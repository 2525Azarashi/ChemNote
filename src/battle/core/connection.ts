/**
 * ===================================================================
 * 対戦モード: 通信の途切れ・アプリの復帰を扱う判定
 * ===================================================================
 *
 * ■ なぜ必要か（実際に起きる壊れ方）
 *
 * 対戦中に次のことが必ず起きる。スマホなら日常的に起きる。
 *   ・電車でトンネルに入る（数十秒の圏外）
 *   ・通知をタップして別アプリへ行き、戻ってくる
 *   ・画面が消える（自動ロック）
 *   ・ホームに戻して放置し、あとで戻ってくる
 *
 * これらに対して、いま対戦モードは★何の手当てもしていない★。
 * その結果こうなる:
 *
 *   (1) 圏外で解答を押すと「解答済み」の表示になる
 *       Firestore は圏外でも書き込みを端末に溜め、
 *       購読は即座に「反映済みのように見える」通知を返す（hasPendingWrites）。
 *       ところが通信が戻って実際にサーバへ送られるときには
 *       締切を過ぎているので、ルールが拒否する。
 *       → ★答えたはずの解答が、あとから黙って消える★。
 *         しかも出る文言は「この操作は許可されていません」で、
 *         利用者には何が起きたのか分からない。
 *
 *   (2) 画面を消していた間に試合が終わっている
 *       戻ってきた時点で結果が確定しているのに、
 *       画面は止まった時点の問題を出したままになりうる。
 *
 *   (3) 復帰直後の残り時間が信用できない
 *       端末が休止していた間、タイマーの割り込みは止まる。
 *       復帰した瞬間に一気に時間が飛ぶので、
 *       「残り8秒」から急に「終了」になる。
 *       これは正しい挙動だが、何も言わないと不正やバグに見える。
 *
 * ここでは「どういう状態のときに、利用者へ何を伝えるべきか」だけを
 * ★純粋な関数として★決める。ブラウザの API を触る部分は hooks 側に置く。
 * こうしておくと、実際に電車に乗らなくても試験で確かめられる。
 */

/** 通信の状態 */
export type ConnectionState =
  /** 通信できている（サーバと繋がっている） */
  | 'online'
  /** 通信が怪しい（端末が圏外、または購読が端末内の控えを返している） */
  | 'offline';

/**
 * 解答を送っていい状態か。
 *
 * ★圏外では送らせない理由★
 * Firestore は圏外でも書き込みを受け取ってしまい、
 * 画面上は「解答済み」になる。しかし送信は通信が戻るまで保留され、
 * そのときには締切を過ぎているのでルールに拒否される。
 * 結果は「答えたのに消える」という、いちばん理不尽な壊れ方になる。
 *
 * それなら★最初から押せないことを伝えた方が良い★。
 * 「電波が戻るまで解答できません」と出れば、
 * 利用者は電波を探すか、諦めるかを自分で選べる。
 */
export function canSubmitAnswer(params: {
  connection: ConnectionState;
  remainMs: number;
  answered: boolean;
}): boolean {
  if (params.connection === 'offline') return false;
  if (params.answered) return false;
  return params.remainMs > 0;
}

/**
 * 端末が休止していた（＝タイマーが止まっていた）とみなす間隔（ms）。
 *
 * ★1秒ではなく2.5秒にしている理由★
 * タイマーは200ms間隔なので、少し詰まっただけでも1秒近く飛ぶことがある。
 * 描画が重い端末で毎回「休止していました」と出ると邪魔になる。
 * 2.5秒飛んだなら、画面が消えたか別アプリに行ったと考えて差し支えない。
 */
export const SUSPEND_GAP_MS = 2_500;

/**
 * 前回の時計の更新からの飛びを見て、端末が休止していたかを判定する。
 *
 * @param previousTickMs 前回タイマーが動いた時刻
 * @param currentTickMs  今回タイマーが動いた時刻
 */
export function didSuspend(previousTickMs: number, currentTickMs: number): boolean {
  if (!Number.isFinite(previousTickMs) || !Number.isFinite(currentTickMs)) return false;
  return currentTickMs - previousTickMs >= SUSPEND_GAP_MS;
}

/**
 * 復帰したときに利用者へ伝えるべきことを決める。
 *
 * ★黙って直さない理由★
 * 復帰処理そのものは購読が自動でやってくれる（Firestore が追いつく）。
 * だが利用者から見ると
 *   ・さっきまで残り8秒だったのに、いきなり次の問題になっている
 *   ・自分が答えていない問題が無回答になっている
 * ので、説明が無いと「勝手に進んだ」「不正をされた」と受け取られる。
 * 起きたことをそのまま伝える。
 *
 * @returns 伝える文。伝えることが無ければ null
 */
export function resumeNotice(params: {
  /** 休止していたか */
  suspended: boolean;
  /** 休止の前後で問題番号が変わったか */
  indexChanged: boolean;
  /** 復帰時点で試合が終わっていたか */
  finished: boolean;
}): string | null {
  if (!params.suspended) return null;

  if (params.finished) {
    return '画面を離れている間に対戦が終了しました。結果を表示します。';
  }
  if (params.indexChanged) {
    return '画面を離れている間に問題が進みました。無回答の問題は0点になります。';
  }
  return '対戦に戻りました。';
}

/**
 * 通信が切れているときに伝える文。
 *
 * ★試合中だけ出す★
 * 待機中や結果画面で出しても行動が変わらないので、
 * 邪魔になるだけで意味が無い。
 */
export function offlineNotice(params: {
  connection: ConnectionState;
  playing: boolean;
}): string | null {
  if (params.connection === 'online') return null;
  if (!params.playing) return null;
  return '通信が切れています。電波が戻るまで解答できません（この間の問題は無回答になります）。';
}

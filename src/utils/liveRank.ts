/**
 * ===================================================================
 * ライブ順位（解答中にも順位を感じられるようにするための計算）
 * ===================================================================
 *
 * ■ なにをしたいのか
 * ワールドカップの中継では、試合中もずっと画面の端に
 *   「現在3位 / 勝ち点差1 / 決勝トーナメント圏内」
 * のような情報が出ている。だから1点の重みが分かるし、心拍数が上がる。
 *
 * 本アプリのランキングは「解き終わってから見るもの」でしかなかった。
 * それでは解答中の1問が順位にどう跳ね返るのか分からないので、
 * 得点に手応え（＝臨場感）が生まれない。
 *
 * そこで「いま何位か」「すぐ上の相手まで何点か」を解答中にも出す。
 * そのための計算だけをここに純粋関数として切り出す。
 * （画面描画・通信・localStorage は一切ここに書かない＝テストしやすくする）
 *
 * ■ 順位の決め方
 * 章ランキングは「その章のベストスコア」で並ぶ。
 * 解答中の自分は、まだ確定していない“暫定スコア”を持っている。
 * したがって
 *   ・他人のベストスコア一覧から、自分自身の記録は取り除く
 *     （自分の過去ベストと今の自分が別人として二重に並ばないようにする）
 *   ・自分より高い人数 + 1 を暫定順位とする（同点は上位＝競技の慣習に合わせる）
 * とする。
 */

/** 順位計算に必要な最小限の情報だけを受け取る */
export interface LadderEntry {
  uid: string;
  nickname: string;
  score: number;
}

/** すぐ上の相手（追い抜く目標） */
export interface ChaseTarget {
  nickname: string;
  score: number;
  /** 追い抜くために必要な点数（同点では抜けないので +1 する） */
  gap: number;
}

export interface LiveStanding {
  /** 暫定順位（1始まり） */
  rank: number;
  /** 自分を含む参加人数 */
  total: number;
  /** 自分の暫定スコア */
  score: number;
  /** すぐ上の相手。1位のときは null */
  nextTarget: ChaseTarget | null;
  /** すぐ下の相手に詰められている点差。最下位のときは null */
  pursuerGap: number | null;
}

/**
 * 「決勝トーナメント進出ライン」として扱う順位。
 *
 * ワールドカップでグループリーグ突破の当落線上がいちばん盛り上がるのと同じで、
 * 「あと1つ上がれば圏内」という線があると、順位そのものに意味が生まれる。
 * 参加者が少ないうちに全員が圏内になってしまうと線の意味が消えるので、
 * 実際の表示では参加人数に応じて絞る（qualifyLineFor を使う）。
 */
export const QUALIFY_LINE = 8;

/**
 * 参加人数に応じた進出ラインを返す。
 * - 人数が少ないときに「全員が圏内」になると線が意味を失うので、上位半分に寄せる
 * - 3人以下では線を引かない（null）
 */
export function qualifyLineFor(total: number): number | null {
  if (total <= 3) return null;
  return Math.max(2, Math.min(QUALIFY_LINE, Math.floor(total / 2)));
}

/**
 * 暫定順位を計算する。
 *
 * @param ladder 章ランキングのベストスコア一覧（自分の記録が混じっていてもよい）
 * @param myUid  自分の uid（null ならゲスト扱いで、ladder から除外はしない）
 * @param myScore いまの自分の暫定スコア
 */
export function computeLiveStanding(
  ladder: LadderEntry[],
  myUid: string | null,
  myScore: number,
): LiveStanding {
  // 自分の過去ベストは「いまの自分」と二重に並べない
  const others = (ladder || []).filter((entry) => !myUid || entry.uid !== myUid);

  const above = others.filter((entry) => entry.score > myScore);
  const rank = above.length + 1;
  const total = others.length + 1;

  // すぐ上＝自分より上の中で最もスコアが低い人
  let nextTarget: ChaseTarget | null = null;
  if (above.length > 0) {
    const nearest = above.reduce((best, cur) => (cur.score < best.score ? cur : best), above[0]);
    nextTarget = {
      nickname: nearest.nickname,
      score: nearest.score,
      gap: Math.max(1, nearest.score - myScore + 1),
    };
  }

  // すぐ下＝自分以下の中で最もスコアが高い人（詰められている距離）
  const below = others.filter((entry) => entry.score <= myScore);
  let pursuerGap: number | null = null;
  if (below.length > 0) {
    const nearest = below.reduce((best, cur) => (cur.score > best.score ? cur : best), below[0]);
    pursuerGap = Math.max(0, myScore - nearest.score);
  }

  return { rank, total, score: myScore, nextTarget, pursuerGap };
}

/**
 * 順位が上がった／下がった／変わらないを判定する。
 * 「小さい数字が上位」なので、差の符号を反転させて扱いやすくする。
 *
 * @returns 正の数なら上昇（例: 3 なら3つ上がった）、負の数なら下降、0 なら変化なし
 */
export function rankDelta(previousRank: number | null | undefined, currentRank: number): number {
  if (previousRank == null) return 0;
  return previousRank - currentRank;
}

/**
 * 何人抜いたかを説明する文を作る。
 * 解答中に出す短い実況なので、長くしない。
 */
export function overtakeMessage(previousRank: number, currentRank: number): string | null {
  const delta = rankDelta(previousRank, currentRank);
  if (delta <= 0) return null;
  if (currentRank === 1) return '首位に立った！';
  return `${delta}人抜き！ ${previousRank}位 → ${currentRank}位`;
}

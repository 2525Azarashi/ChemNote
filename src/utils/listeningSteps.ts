/**
 * ==========================================================================
 * 英語リスニング：「問1で1つの進捗、問2で1つの進捗」にするための道具
 * ==========================================================================
 *
 * ■ なぜこのファイルが必要なのか（ご要望そのもの）
 *     > 今リスニングは、第1問Aだったらどの回も問1〜問4を同じ進捗に入れてると思うんだけど、
 *     > それもうやめて、問1で1つの進捗、問2で1つの進捗みたいな感じにしてほしい。
 *     > だから解説も修正な。
 *
 *   これまでは「第1回演習」を開くと問1〜問4の4問がすべて1画面に並び、
 *   4問まとめて「解答と解説を見る」を押す作りだった。そのため
 *
 *     ・進捗が 1/1 のまま動かず、4問解いても手応えが残らない
 *     ・解説も4問ぶんが一度にどっと出てきて、どの問の話か分からない
 *     ・スクロールしないと4問目にたどり着けない
 *
 *   という状態だった。そこで「1画面＝1問」に切り替える。
 *
 * ■ データは1問ずつに割らない（重要な設計判断）
 *   `practiceProblems` を問単位に割ってしまうと
 *
 *     ・進捗台帳のキー（`solved_problems_v1` の `章ID::大問ID`）が総入れ替えになり、
 *       これまでの学習記録が全部「未着手」に戻る
 *     ・ホームの分母（大問数）が 14 → 56 に跳ね上がり、達成率が一気に下がる
 *     ・ランキング（`leaderboard_chapter/{chapterId}_{uid}`）の過去スコアと
 *       比較できなくなる
 *
 *   という副作用が出る。ご要望は「見え方・解き方」の話なので、
 *   データ構造は据え置き、**表示と進行だけ**を問単位にする。
 *   つまり「大問（回）の中の何問目を今見ているか」を表す step を1つ足すだけ。
 *
 * ■ 対象を絞る理由
 *   化学の大問は「(1)で求めた値を(2)で使う」という連続した構成が多く、
 *   1問ずつに切ると前の設問を見返せなくなって解けなくなる。
 *   一方リスニングの第1問A/Bは1問ごとに音源が独立している（＝前の問を
 *   見返す必要がない）。そこで「音源トラックを持つ問題」だけを対象にする。
 */

/** 1問ぶんの表示単位 */
export interface ListeningStep {
  /** 大問（回）の中での位置（0始まり） */
  index: number;
  /** 小問ID（＝解答・採点・音源トラックのキー） */
  subQuestionId: string;
  /** 「問1」などの見出し。取れないときは並び順から作る */
  label: string;
}

/**
 * その大問を「1問ずつ」に分けて進めるべきか。
 *
 * 判定は音源トラックの有無で行う。リスニング以外（化学など）は
 * audioTracks を持たないので、これまでどおり大問まるごと1画面のまま。
 */
export function isPerSubQuestionListening(problem: any): boolean {
  const tracks = problem?.audioTracks;
  if (!Array.isArray(tracks) || tracks.length === 0) return false;
  const subs = problem?.subQuestions;
  return Array.isArray(subs) && subs.length > 1;
}

/** 小問ラベル（'問2 話者（…）の発話に…'）から「問2」だけを取り出す。 */
export function stepLabelOf(sq: any, index: number): string {
  const matched = String(sq?.label || '').match(/^\s*(問\s*\d+)/u);
  if (matched) return matched[1].replace(/\s+/gu, '');
  return `問${index + 1}`;
}

/**
 * 大問を「問1／問2／…」の表示単位に並べ替える。
 *
 * 1問ずつにしない大問（化学など）では、全小問をまとめた1ステップだけを返す。
 * こうすると呼び出し側は「ステップ配列を順に見せる」だけで両方に対応でき、
 * リスニング用と従来用で描画コードを二重に持たなくて済む。
 */
export function buildListeningSteps(problem: any): ListeningStep[] {
  const subs: any[] = Array.isArray(problem?.subQuestions) ? problem.subQuestions : [];
  if (subs.length === 0) return [];
  return subs.map((sq, index) => ({
    index,
    subQuestionId: String(sq?.id ?? `sub_${index}`),
    label: stepLabelOf(sq, index),
  }));
}

/**
 * 「大問ID＋小問ID」から、採点結果を保存するキーを作る。
 *
 * ★`run.perQuestion` とは別の入れ物（`perStep`）に入れる★
 *   `perQuestion` は「大問1つ＝1レコード」という前提で
 *   進捗の引き継ぎ処理（progress.ts の backfillLegacyProgress）が
 *   キーをそのまま大問IDとして読んでいる。ここに小問単位のキーを混ぜると
 *   存在しない大問を「解いた」と誤って数え、進捗が分母を超えてしまう。
 *   そのため小問単位の記録は別フィールドに分ける。
 */
export function stepScoreKey(questionId: string, subQuestionId: string): string {
  return `${questionId}::${subQuestionId}`;
}

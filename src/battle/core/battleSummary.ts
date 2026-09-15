/**
 * ===================================================================
 * battleSummary — 試合終了後のまとめ（純粋関数・依存ゼロ）
 * ===================================================================
 *
 * ★このファイルは Firebase / React / DOM を一切 import しない。★
 *
 * ■ 何をするファイルか
 *   試合の採点結果（BattleResultSummary）から、リザルト画面に出す
 *     ・平均回答時間・最大コンボ・正解数
 *     ・今回獲得したXP
 *     ・復習すべき問題（自分が間違えた／相手は正解したのに自分は間違えた）
 *   を作る。採点そのものは battleCore が済ませているので、ここは集計だけ。
 *
 * ■ XP について
 *   このアプリにはまだ「経験値」の概念が無い。
 *   ここで導入するXPは ★対戦の頑張りを見せるための数値★ で、
 *   端末内（localStorage）に累計を持つだけ。レートとは別物で、
 *   ランキングにもレートにも影響しない（Firestore に書かない）。
 *   負けても0にならないよう、正解1問ごとに加点する形にしている
 *   （「負けたら何も残らない」だと復習に向かう気持ちが折れる）。
 */

import type { BattleQuestion, BattleResultSummary, BattlePlayerScore, BattleOutcome } from './types';

// ============================================================
// 統計
// ============================================================

export interface BattleStats {
  correctCount: number;
  /** 回答した問題（無回答を除く）の平均秒数。回答が無ければ 0 */
  averageSeconds: number;
  maxStreak: number;
  totalScore: number;
}

/**
 * 平均回答時間は「答えた問題」だけで割る。
 * 無回答は timeUsed が制限時間いっぱいになっていて、
 * 混ぜると「考えていた時間」ではなく「放置した時間」の平均になる。
 * 正誤は問わない（間違えても答えた時間は本人の回答時間）。
 */
export function statsOf(score: BattlePlayerScore, answeredIndexes: ReadonlySet<number>): BattleStats {
  const answered = score.perQuestion.filter((q) => answeredIndexes.has(q.index));
  const total = answered.reduce((s, q) => s + q.timeUsed, 0);
  const averageSeconds = answered.length > 0 ? Math.round((total / answered.length) * 10) / 10 : 0;
  return {
    correctCount: score.correctCount,
    averageSeconds,
    maxStreak: score.maxStreak,
    totalScore: score.score,
  };
}

// ============================================================
// XP
// ============================================================

/** 正解1問あたり */
export const XP_PER_CORRECT = 10;
/** 試合を完走した */
export const XP_FINISH = 20;
/** 勝利 */
export const XP_WIN = 50;
/** 引き分け */
export const XP_DRAW = 25;
/** 最大コンボが3以上のとき、コンボ数×この値 */
export const XP_PER_STREAK = 5;

export interface XpBreakdown {
  finish: number;
  correct: number;
  outcome: number;
  streak: number;
  total: number;
}

export function xpOf(outcome: BattleOutcome, correctCount: number, maxStreak: number): XpBreakdown {
  const finish = XP_FINISH;
  const correct = Math.max(0, correctCount) * XP_PER_CORRECT;
  const outcomeXp = outcome === 'win' ? XP_WIN : outcome === 'draw' ? XP_DRAW : 0;
  const streak = maxStreak >= 3 ? maxStreak * XP_PER_STREAK : 0;
  return { finish, correct, outcome: outcomeXp, streak, total: finish + correct + outcomeXp + streak };
}

/** 累計XPの保存キー（端末内。uid ごと） */
export function xpStorageKey(uid: string): string {
  return `battle_xp_${uid || 'guest'}`;
}

/** 保存文字列 → 数値（壊れていたら 0） */
export function parseXpTotal(raw: string | null | undefined): number {
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

// ============================================================
// 復習の抽出
// ============================================================

/**
 * 復習対象の1問。
 *   reason
 *     'wrong'          … 自分が間違えた（無回答を含む）
 *     'opponent-right' … 自分は間違え、相手は正解した（★優先して見せる★）
 */
export interface ReviewPick {
  index: number;
  question: BattleQuestion;
  reason: 'wrong' | 'opponent-right';
  /** 正解の文字列（choice 系は options、kana は呼び出し側が組み立てて渡す） */
  correctText: string;
}

/**
 * 自分が間違えた問題を抽出する。相手が正解していた問題を先に並べる。
 *
 * @param kanaTextOf kana 形式の正解を文字列にする関数（葉モジュールが
 *                   kanaKeyboard に依存しないよう、外から渡す）
 */
export function pickReviewQuestions(
  result: BattleResultSummary,
  questions: readonly BattleQuestion[],
  kanaTextOf: (order: readonly number[]) => string,
): ReviewPick[] {
  const theirs = new Map(result.opponent?.perQuestion.map((q) => [q.index, q]) ?? []);
  const picks: ReviewPick[] = [];
  for (const s of result.me.perQuestion) {
    if (s.correct) continue;
    const q = questions[s.index];
    if (!q) continue;
    const oppRight = Boolean(theirs.get(s.index)?.correct);
    picks.push({
      index: s.index,
      question: q,
      reason: oppRight ? 'opponent-right' : 'wrong',
      correctText: correctTextOf(q, kanaTextOf),
    });
  }
  // 相手が正解した問題を先に（同じ理由の中では出題順）
  return picks.sort((a, b) => {
    const pa = a.reason === 'opponent-right' ? 0 : 1;
    const pb = b.reason === 'opponent-right' ? 0 : 1;
    return pa - pb || a.index - b.index;
  });
}

export function correctTextOf(
  q: BattleQuestion,
  kanaTextOf: (order: readonly number[]) => string,
): string {
  if (q.format === 'kana') return kanaTextOf(q.panelOrder);
  if (q.format === 'panel') return q.panelOrder.map((i) => q.options[i] ?? '').join('');
  return q.options[q.answerIndex] ?? '';
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * answerJudge — 解答判定の単一の真実 (single source of truth)
 * ------------------------------------------------------------------
 * このモジュールは「ユーザーの解答が正解か」を判定するロジックを一箇所に集約する。
 *
 * 【C7 (b) の狙い】
 *   採点ロジックを *純粋・依存ゼロ・フレームワーク非依存* な関数として切り出し、
 *   クライアント（Quiz / Explanation / 復習リスト）と将来のサーバー採点 API が
 *   まったく同じ判定を使えるようにする。これにより
 *     1) ✓/✗ 表示とスコアの食い違い（従来 trim 有無で不一致があった）を解消
 *     2) サーバー移行時にこのファイルをそのまま Cloud Functions / Workers へ持ち込める
 *        （import する側を差し替えるだけでロジックの再実装が不要）
 *
 * ここには DOM / React / Firebase など環境依存物を一切 import しないこと。
 */

/** 判定対象となる最小限の設問形状（scoring.ts の型と互換） */
export interface JudgeableSubQuestion {
  id: string;
  type?: string;
  correctAnswer?: string;
  /** 別解（いずれかに一致すれば正解）。データに存在すれば利用する */
  acceptedAnswers?: string[];
}

/**
 * 解答文字列を比較用に正規化する。
 * - 前後の空白を除去
 * - 全角空白 → 除去、連続空白 → 単一化
 * 数式・化学式は表記が一意（C4 で半角統一済み）なので、
 * ここでは「空白ゆれ」の吸収のみを行い、意味を変える正規化はしない。
 */
export function normalizeAnswer(value: string | undefined | null): string {
  if (value == null) return '';
  return String(value)
    .replace(/\u3000/g, ' ') // 全角空白→半角
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * 記述式（自動採点不可）かどうか。
 * descriptive のみ自動採点対象外とする（既存仕様を踏襲）。
 */
export function isDescriptive(sq: { type?: string }): boolean {
  return sq.type === 'descriptive';
}

/**
 * 自動採点可能な設問か（記述式を除く）。
 */
export function isJudgeable(sq: { type?: string }): boolean {
  return !isDescriptive(sq);
}

/**
 * 1つの設問について、ユーザーの解答が正解かどうかを判定する。
 * - 記述式は常に false（自動採点不可）
 * - 空解答は false
 * - correctAnswer または acceptedAnswers のいずれかに（正規化して）一致すれば正解
 *
 * これがアプリ全体の「正解/不正解」判定の唯一の基準。
 */
export function isAnswerCorrect(
  sq: JudgeableSubQuestion,
  userAnswer: string | undefined | null
): boolean {
  if (isDescriptive(sq)) return false;

  const ans = normalizeAnswer(userAnswer);
  if (!ans) return false;

  const candidates: string[] = [];
  if (sq.correctAnswer != null) candidates.push(sq.correctAnswer);
  if (Array.isArray(sq.acceptedAnswers)) candidates.push(...sq.acceptedAnswers);

  return candidates.some((c) => normalizeAnswer(c) === ans);
}

/**
 * 自動採点可能な設問だけを抽出する。
 */
export function judgeableSubQuestions<T extends { type?: string }>(subQuestions: T[]): T[] {
  return (subQuestions || []).filter(isJudgeable);
}

/**
 * 設問群の採点結果（正誤マップ + 集計）。
 * 表示（✓/✗）とスコア計算の双方がこの結果を共有できる。
 */
export interface JudgeResult {
  /** setId ごとの正誤（記述式は含めない） */
  correctById: Record<string, boolean>;
  /** 正解数（自動採点可能なもののうち） */
  correctCount: number;
  /** 自動採点可能な設問数 */
  judgeableCount: number;
  /** 全設問数 */
  totalCount: number;
}

/**
 * 設問群をまとめて採点する。
 * Quiz / Explanation / 復習リストはこの関数の結果を使うことで、
 * 表示とスコアの判定基準を完全に一致させられる。
 */
export function judgeSubQuestions(
  subQuestions: JudgeableSubQuestion[],
  answers: Record<string, string>
): JudgeResult {
  const correctById: Record<string, boolean> = {};
  let correctCount = 0;
  let judgeableCount = 0;

  for (const sq of subQuestions || []) {
    if (!isJudgeable(sq)) continue;
    judgeableCount += 1;
    const ok = isAnswerCorrect(sq, answers[sq.id]);
    correctById[sq.id] = ok;
    if (ok) correctCount += 1;
  }

  return {
    correctById,
    correctCount,
    judgeableCount,
    totalCount: (subQuestions || []).length,
  };
}

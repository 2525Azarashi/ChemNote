/**
 * 記述問題（descriptive）の「自己採点チェック（部分点基準）」を扱うユーティリティ。
 *
 * 【背景 / 修正した不具合】
 * 問題データの `gradingCriteria` は本来 string[]（部分点の基準を1項目ずつ並べた配列）だが、
 * 一部の問題（⑤-7 滴定曲線と二段階滴定 の p_c5_7_2）だけ 1本の string で書かれていた。
 * Explanation.tsx は `gradingCriteria.forEach(...)` / `gradingCriteria.map(...)` を直接呼ぶため、
 * string が来ると `.forEach is not a function` で描画中に例外が発生し、
 * その章の解説画面＝「結果・ランキング画面」が真っ白になって表示されなかった。
 *
 * データ側は配列へ修正済みだが、将来同じ形式ミスが混入しても画面が壊れないよう、
 * 参照側は必ずこのユーティリティを通して配列化する。
 */

/** 文章1本で書かれた採点基準を分割する区切り文字（全角スラッシュ・改行・箇条書き記号）。 */
const CRITERIA_SEPARATOR = /\r?\n|／|\s\/\s|・(?=\s*[^\s])/;

/**
 * `gradingCriteria` を必ず string[] に正規化する。
 *
 * - string[]     … 空要素を除いてそのまま利用
 * - string       … 区切り文字で分割（分割できなければ1項目の配列）
 * - null / 他の型 … 空配列
 */
export const normalizeGradingCriteria = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((c): c is string => typeof c === 'string')
      .map(c => c.trim())
      .filter(c => c.length > 0);
  }

  if (typeof value === 'string') {
    const parts = value
      .split(CRITERIA_SEPARATOR)
      .map(c => c.trim())
      .filter(c => c.length > 0);
    return parts.length > 0 ? parts : [];
  }

  return [];
};

/** 採点基準が未設定の記述問題に使う、汎用の自己採点項目。 */
export const DEFAULT_GRADING_CRITERION =
  '模範解答の要点（キーワード・化学式・単位）が正しく書けているか';

/**
 * 小問（subQuestion）から自己採点に使う基準リストを取得する。
 * 記述問題なのに基準が未設定のデータでも、必ず1項目以上返して
 * 「チェック欄が空っぽで自己採点できない」状態を防ぐ。
 */
export const resolveGradingCriteria = (sq: any): string[] => {
  const normalized = normalizeGradingCriteria(sq?.gradingCriteria);
  if (normalized.length > 0) return normalized;
  if (sq?.type === 'descriptive') return [DEFAULT_GRADING_CRITERION];
  return [];
};

/**
 * 自己採点のチェック状況から達成率（0〜1）を返す。
 * 基準が0件のときは 0 を返し、0除算による NaN を防ぐ。
 */
export const gradingCriteriaProgress = (
  sq: any,
  selfGrades: Record<string, boolean>
): { criteria: string[]; checked: number; ratio: number } => {
  const criteria = resolveGradingCriteria(sq);
  if (criteria.length === 0) return { criteria, checked: 0, ratio: 0 };

  let checked = 0;
  criteria.forEach((_, idx) => {
    if (selfGrades[`${sq.id}_${idx}`]) checked++;
  });

  return { criteria, checked, ratio: checked / criteria.length };
};

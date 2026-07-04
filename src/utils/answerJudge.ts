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
 * - 全角数字（０-９）→ 半角数字（0-9）
 * - 全角英字（Ａ-Ｚａ-ｚ）→ 半角英字（A-Za-z）
 * - 全角記号（＋−．，％）→ 半角（+- . , %）、各種マイナス記号 → '-'
 * - 上付き・下付き数字（₀-₉ / ⁰-⁹）→ 通常数字（化学式パレット入力と手入力の互換）
 * 数字・英字は全角/半角どちらで入力しても同じ解答として扱う。
 */
export function normalizeAnswer(value: string | undefined | null): string {
  if (value == null) return '';
  let s = String(value)
    .replace(/\u3000/g, ' ') // 全角空白→半角
    .trim()
    .replace(/\s+/g, ' ');

  // 全角数字・全角英字 → 半角（０-９ / Ａ-Ｚ / ａ-ｚ）
  s = s.replace(/[\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );

  // 全角記号 → 半角
  s = s
    .replace(/[＋]/g, '+')
    .replace(/[．]/g, '.')
    .replace(/[，]/g, ',')
    .replace(/[％]/g, '%')
    // 各種マイナス/ハイフン様記号（−, ―, ‐, –, —, ー(長音は残す)を除く）
    .replace(/[\u2212\uFF0D]/g, '-');

  // 下付き数字（₀₁₂₃₄₅₆₇₈₉）→ 通常数字
  s = s.replace(/[\u2080-\u2089]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x2080 + 0x30)
  );
  // 上付き数字（⁰¹²³⁴-⁹）→ 通常数字、上付き +/- → +/-
  s = s
    .replace(/\u00B9/g, '1')
    .replace(/\u00B2/g, '2')
    .replace(/\u00B3/g, '3')
    .replace(/[\u2070\u2074-\u2079]/g, (ch) => {
      const map: Record<string, string> = {
        '\u2070': '0', '\u2074': '4', '\u2075': '5', '\u2076': '6',
        '\u2077': '7', '\u2078': '8', '\u2079': '9',
      };
      return map[ch] ?? ch;
    })
    .replace(/\u207A/g, '+')
    .replace(/\u207B/g, '-');

  return s;
}

/**
 * 記号選択・並び替え問題の比較用に、区切り記号だけを除いた形も作る。
 * 例: 「ウ→オ→エ→ア→イ」「ウ > オ > エ > ア > イ」「ウオエアイ」を同一視する。
 */
function compactSymbolSequence(value: string): string {
  return normalizeAnswer(value)
    .replace(/[\s,，、・･→＞>\-－―–—]/g, '')
    .replace(/[()（）［］\[\]【】]/g, '');
}

/**
 * 区切り記号を無視する比較は、ア/イ/ウや①②③のような選択肢記号の列だけに限定する。
 * 通常の短答（例: 日本語語句や化学用語）でハイフン等を過剰に無視しないためのガード。
 */
function looksLikeChoiceSequence(value: string): boolean {
  const normalized = normalizeAnswer(value);
  return /[アイウエオカキクケコサシスセソタチツテト①②③④⑤⑥⑦⑧⑨⑩]/.test(normalized);
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

  const compactAns = compactSymbolSequence(ans);
  const canUseCompact = looksLikeChoiceSequence(ans);
  return candidates.some((c) => {
    const normalizedCandidate = normalizeAnswer(c);
    return normalizedCandidate === ans || (
      canUseCompact &&
      looksLikeChoiceSequence(normalizedCandidate) &&
      !!compactAns &&
      compactSymbolSequence(normalizedCandidate) === compactAns
    );
  });
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

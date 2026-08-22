import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

/**
 * ===================================================================
 * 数学（数III 積分法）追加の回帰テスト
 * ===================================================================
 * ご要望：
 *   - 数学を科目として追加し、その中に「数3積分 全パターン演習」を追加
 *   - 3つの原典（河野玄斗15パターン／PASSLABO 150問／超わかる！34講）を
 *     体系的・網羅的に統合した問題＋まとめプリント
 *   - 問題の数字は原典から変える
 *   - 答えを入力できる欄＋数学版の入力パレットを新設
 *
 * ここでは
 *   ① 問題データの構造（章とパターンの網羅・requiresMathPalette の徹底）
 *   ② 解答判定（acceptedAnswers が正規化と整合すること）
 *   ③ まとめプリントの配線（barrel / LearningViewer）
 *   ④ Quiz の数学パレット（opt-in 判定・3描画箇所）
 * を検証する。
 */

const MATH_DATA = readFileSync('src/data/mathData.ts', 'utf8');
const QUIZ = readFileSync('src/components/Quiz.tsx', 'utf8');
const VIEWER = readFileSync('src/components/LearningViewer.tsx', 'utf8');
const BARREL = readFileSync('src/data/learningContent/index.ts', 'utf8');

describe('数III積分の章構成（15パターンの体系）', () => {
  it('積分12章＋ベクトル8章＋確率8章＋整数5章＝33章がすべて定義されている', async () => {
    const { getAllMathChapters } = await import('../src/data/mathData');
    const ids = getAllMathChapters().map((c: any) => c.id);
    expect(ids).toEqual([
      // 数III 積分
      'm1_1', 'm1_2', 'm1_3', 'm1_4', 'm1_5', 'm1_6',
      'm1_7', 'm1_8', 'm1_9', 'm1_10', 'm2_1', 'm2_2',
      // ベクトル
      'mv_1', 'mv_2', 'mv_3', 'mv_4', 'mv_5', 'mv_6', 'mv_7', 'mv_8',
      // 場合の数・確率
      'mp_1', 'mp_2', 'mp_3', 'mp_4', 'mp_5', 'mp_6', 'mp_7', 'mp_8',
      // 整数
      'mi_1', 'mi_2', 'mi_3', 'mi_4', 'mi_5',
    ]);
  });

  it('全章に演習問題が入っている（空の章が無い）', async () => {
    const { getAllMathChapters } = await import('../src/data/mathData');
    for (const c of getAllMathChapters() as any[]) {
      const count = (c.practiceProblems || []).length + (c.miniTest || []).length;
      expect(count, `${c.id} に問題が無い`).toBeGreaterThan(0);
    }
  });

  it('収録統計がデータから計算できる（科目カードの表示に使う）', async () => {
    const { getMathStats } = await import('../src/data/mathData');
    const stats = getMathStats();
    expect(stats.chapters).toBe(33);
    expect(stats.questions).toBeGreaterThanOrEqual(50);
  });

  it('章は realTitle（1章〜7章）でグループ化されている', () => {
    for (const g of ['1章', '2章', '3章', '4章', '5章', '6章', '7章']) {
      expect(MATH_DATA).toContain(g);
    }
  });
});

describe('問題データの品質', () => {
  it('全小問が requiresMathPalette: true（数学パレット opt-in）', async () => {
    const { getAllMathChapters } = await import('../src/data/mathData');
    for (const c of getAllMathChapters() as any[]) {
      for (const p of [...(c.practiceProblems || []), ...(c.miniTest || [])]) {
        for (const sq of p.subQuestions || []) {
          expect(sq.requiresMathPalette, `${sq.id} にパレット指定が無い`).toBe(true);
          expect(sq.type).toBe('short_answer');
          expect(typeof sq.correctAnswer).toBe('string');
          expect(Array.isArray(sq.acceptedAnswers)).toBe(true);
        }
      }
    }
  });

  it('correctAnswer をそのまま入力すれば正解になる（判定関数と整合）', async () => {
    const { getAllMathChapters } = await import('../src/data/mathData');
    const { isAnswerCorrect } = await import('../src/utils/answerJudge');
    for (const c of getAllMathChapters() as any[]) {
      for (const p of [...(c.practiceProblems || []), ...(c.miniTest || [])]) {
        for (const sq of p.subQuestions || []) {
          expect(
            isAnswerCorrect(sq, sq.correctAnswer),
            `${sq.id} の correctAnswer が判定関数で正解にならない`,
          ).toBe(true);
        }
      }
    }
  });

  it('全問題に explanation（解説）が付いている', async () => {
    const { getAllMathChapters } = await import('../src/data/mathData');
    for (const c of getAllMathChapters() as any[]) {
      for (const p of [...(c.practiceProblems || []), ...(c.miniTest || [])]) {
        expect(String(p.explanation || '').length, `${p.id} の解説が短すぎる`).toBeGreaterThan(50);
      }
    }
  });

  it('「定積分で表された関数」は矛盾しない設定になっている（回帰：k = 1 + k 事故の再発防止）', async () => {
    const src = readFileSync('src/data/mathIntegralProblems.ts', 'utf8');
    const block = src.slice(src.indexOf("id: 'q_m2_2_const'"));
    const def = block.slice(0, block.indexOf('surroundingKnowledge'));
    // f(x) = 3x^2 - 2∫[0→1] f(t) dt → k = 1 - 2k → k = 1/3 → f(x) = 3x^2 - 2/3
    expect(def).toContain('3x^2 - 2∫[0→1] f(t) dt');
    expect(def).toContain("'3x^2 - 2/3'");
    expect(def).toContain('k = 1 - 2k');
    // 以前の壊れた「解なし」ドラフトの痕跡が無いこと
    expect(def).not.toContain('k = 1 + k');
    expect(def).not.toContain('failsafe');
  });
});

describe('まとめプリント（積分のパターン化）の配線', () => {
  it('barrel から MATH_INTEGRAL_HTML / PARTS が公開されている', () => {
    expect(BARREL).toContain("export { MATH_INTEGRAL_HTML, MATH_INTEGRAL_PARTS } from './math_integral'");
  });

  it('通し表示用 HTML は全パートの連結で作る（本文の二重管理を防ぐ）', () => {
    const src = readFileSync('src/data/learningContent/math_integral.ts', 'utf8');
    expect(src).toMatch(
      /export const MATH_INTEGRAL_HTML\s*=\s*MATH_INTEGRAL_PARTS\.map\(p => p\.html\)\.join/,
    );
  });

  it('LearningViewer が subject="math" を受け付け、専用タブを持つ', () => {
    expect(VIEWER).toContain("'chemistry_basic' | 'chemistry' | 'math'");
    expect(VIEWER).toContain("'math-integral'");
    expect(VIEWER).toContain('MATH_INTEGRAL_PARTS');
    expect(VIEWER).toContain("label: '数学'");
  });

  it('まとめプリントに判断フローと15パターン早見表が含まれる', async () => {
    const { MATH_INTEGRAL_HTML, MATH_INTEGRAL_PARTS } = await import(
      '../src/data/learningContent/math_integral'
    );
    expect(MATH_INTEGRAL_HTML).toContain('判断フローチャート');
    expect(MATH_INTEGRAL_HTML).toContain('15パターン早見表');
    expect(MATH_INTEGRAL_HTML).toContain('King Property');
    expect(MATH_INTEGRAL_HTML).toContain('区分求積');
    expect(MATH_INTEGRAL_HTML).toContain('部分分数分解');
    // パートIDはタブ内で一意
    const ids = MATH_INTEGRAL_PARTS.map((p: any) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('数学記号パレット（Quiz）', () => {
  it('requiresMathSymbols は opt-in（requiresMathPalette）でのみ有効', () => {
    expect(QUIZ).toContain('function requiresMathSymbols');
    const block = QUIZ.slice(QUIZ.indexOf('function requiresMathSymbols'));
    const def = block.slice(0, block.indexOf('\n}'));
    expect(def).toContain("if (!question?.requiresMathPalette) return false");
    // 選択式には出さない
    expect(def).toContain("'multiple_choice'");
    expect(def).toContain("'sorting'");
  });

  it('数学パレットの記号グループが定義されている（∫・√・π・分数）', () => {
    expect(QUIZ).toContain('mathPaletteGroups');
    for (const sym of ["'∫'", "'√('", "'π'", "'^'", "'dx'", "'sin'", "'log'"]) {
      expect(QUIZ, `${sym} がパレットに無い`).toContain(`label: ${sym}`);
    }
  });

  it('MathPalette は化学パレットと同じ挿入基盤（SymbolPalette）を共有する', () => {
    expect(QUIZ).toContain('function SymbolPalette');
    expect(QUIZ).toContain('function MathPalette');
    expect(QUIZ).toContain('function ChemistryPalette');
    expect(QUIZ).toContain('title="数学記号パレット"');
    expect(QUIZ).toContain('title="化学記号パレット"');
  });

  it('デスクトップ2箇所（記述・短答）＋スマホのカード内2箇所（記述・短答）の計4箇所に描画される', () => {
    // 以前はスマホの下部フローティングバーに複製の入力欄＋パレットを出していたが、
    // 「解答欄が重複して見える」ご指摘で撤去し、カード内の入力欄に直接付ける方式へ。
    // → 記述（textarea）と短答（input）でそれぞれ PC/スマホ分岐があるため計4箇所。
    const renders = (QUIZ.match(/<MathPalette/g) || []).length;
    expect(renders).toBe(4);
    expect(QUIZ).toContain('questionNeedsMathPalette');
  });

  it('数学の設問では化学パレットの誤検知を抑止する', () => {
    // requiresChemicalSymbols は requiresMathPalette の設問を先に除外する
    const block = QUIZ.slice(QUIZ.indexOf('function requiresChemicalSymbols'));
    const def = block.slice(0, block.indexOf('\n}'));
    expect(def).toContain('if (question?.requiresMathPalette) return false');
  });
});

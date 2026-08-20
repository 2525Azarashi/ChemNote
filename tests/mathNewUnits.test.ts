import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

/**
 * ===================================================================
 * 数学 3単元追加（ベクトル・場合の数・確率・整数）の回帰テスト
 * ===================================================================
 * ご要望：
 *   - PASSLABO「全パターン」動画（ベクトル6時間／確率 厳選50題／整数38章）を
 *     モデルに、数IIIの積分と同じ形式で3単元を追加
 *   - 「しっかりと網羅度と質にこだわってね」→ 章の網羅・解答判定の整合・
 *     まとめプリントの配線をここで固定する
 *
 * 検証内容：
 *   ① 3単元の章がすべて配線されている（part / MATH_PROBLEMS / タブ）
 *   ② acceptedAnswers の全表記ゆれが判定関数で正解になる（品質保証）
 *   ③ まとめプリント（判断フロー・型の早見表）の内容マーカー
 *   ④ 執筆中に修正した3つの数学的欠陥の再発防止ガード
 */

const VIEWER = readFileSync('src/components/LearningViewer.tsx', 'utf8');
const BARREL = readFileSync('src/data/learningContent/index.ts', 'utf8');
const MATH_DATA = readFileSync('src/data/mathData.ts', 'utf8');

describe('3単元の配線（part・問題注入・タブ）', () => {
  it('mathData に3つの part（ベクトル・確率・整数）が定義されている', () => {
    expect(MATH_DATA).toContain("id: 'math_vector'");
    expect(MATH_DATA).toContain("id: 'math_probability'");
    expect(MATH_DATA).toContain("id: 'math_integer'");
    expect(MATH_DATA).toContain('ベクトル（全パターン演習）');
    expect(MATH_DATA).toContain('場合の数・確率（全パターン演習）');
    expect(MATH_DATA).toContain('整数（全パターン演習）');
  });

  it('MATH_PROBLEMS に21章分の注入エントリがある', () => {
    for (const id of [
      'mv_1', 'mv_2', 'mv_3', 'mv_4', 'mv_5', 'mv_6', 'mv_7', 'mv_8',
      'mp_1', 'mp_2', 'mp_3', 'mp_4', 'mp_5', 'mp_6', 'mp_7', 'mp_8',
      'mi_1', 'mi_2', 'mi_3', 'mi_4', 'mi_5',
    ]) {
      expect(MATH_DATA, `${id} の問題注入が無い`).toContain(`${id}:`);
    }
  });

  it('LearningViewer に3単元のタブとプリント配線がある', () => {
    expect(VIEWER).toContain("'math-vector'");
    expect(VIEWER).toContain("'math-probability'");
    expect(VIEWER).toContain("'math-integer'");
    expect(VIEWER).toContain('MATH_VECTOR_PARTS');
    expect(VIEWER).toContain('MATH_PROBABILITY_PARTS');
    expect(VIEWER).toContain('MATH_INTEGER_PARTS');
    expect(VIEWER).toContain('ベクトル（全パターン）');
    expect(VIEWER).toContain('場合の数・確率（全パターン）');
    expect(VIEWER).toContain('整数（全パターン）');
  });

  it('barrel から3単元の HTML / PARTS が公開されている', () => {
    expect(BARREL).toContain(
      "export { MATH_VECTOR_HTML, MATH_VECTOR_PARTS } from './math_vector'",
    );
    expect(BARREL).toContain(
      "export { MATH_PROBABILITY_HTML, MATH_PROBABILITY_PARTS } from './math_probability'",
    );
    expect(BARREL).toContain(
      "export { MATH_INTEGER_HTML, MATH_INTEGER_PARTS } from './math_integer'",
    );
  });
});

describe('解答判定の品質（全単元・全表記ゆれ）', () => {
  it('acceptedAnswers のすべての表記ゆれが判定関数で正解になる', async () => {
    const { getAllMathChapters } = await import('../src/data/mathData');
    const { isAnswerCorrect } = await import('../src/utils/answerJudge');
    for (const c of getAllMathChapters() as any[]) {
      for (const p of [...(c.practiceProblems || []), ...(c.miniTest || [])]) {
        for (const sq of p.subQuestions || []) {
          for (const alt of sq.acceptedAnswers || []) {
            expect(
              isAnswerCorrect(sq, alt),
              `${sq.id} の acceptedAnswers「${alt}」が判定関数で正解にならない`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it('小問IDが全単元を通して一意（採点履歴の衝突防止）', async () => {
    const { getAllMathChapters } = await import('../src/data/mathData');
    const ids: string[] = [];
    for (const c of getAllMathChapters() as any[]) {
      for (const p of [...(c.practiceProblems || []), ...(c.miniTest || [])]) {
        for (const sq of p.subQuestions || []) ids.push(sq.id);
      }
    }
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('まとめプリント（3単元）の内容', () => {
  it('ベクトル：係数比較と s+t=1、正射影・ベクトル方程式を扱う', async () => {
    const { MATH_VECTOR_HTML, MATH_VECTOR_PARTS } = await import(
      '../src/data/learningContent/math_vector'
    );
    expect(MATH_VECTOR_HTML).toContain('係数比較');
    expect(MATH_VECTOR_HTML).toContain('s + t = 1');
    expect(MATH_VECTOR_HTML).toContain('正射影');
    expect(MATH_VECTOR_HTML).toContain('共面条件');
    const ids = MATH_VECTOR_PARTS.map((p: any) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('確率：余事象・反復試行・条件付き確率・期待値を扱う', async () => {
    const { MATH_PROBABILITY_HTML, MATH_PROBABILITY_PARTS } = await import(
      '../src/data/learningContent/math_probability'
    );
    expect(MATH_PROBABILITY_HTML).toContain('余事象');
    expect(MATH_PROBABILITY_HTML).toContain('反復試行');
    expect(MATH_PROBABILITY_HTML).toContain('条件付き確率');
    expect(MATH_PROBABILITY_HTML).toContain('期待値');
    const ids = MATH_PROBABILITY_PARTS.map((p: any) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('整数：三大方針（積の形・余りで分類・絞り込み）を扱う', async () => {
    const { MATH_INTEGER_HTML, MATH_INTEGER_PARTS } = await import(
      '../src/data/learningContent/math_integer'
    );
    expect(MATH_INTEGER_HTML).toContain('積の形');
    expect(MATH_INTEGER_HTML).toContain('余りで分類');
    expect(MATH_INTEGER_HTML).toContain('絞り込み');
    expect(MATH_INTEGER_HTML).toContain('ユークリッドの互除法');
    const ids = MATH_INTEGER_PARTS.map((p: any) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('通し表示用 HTML は全パートの連結で作る（本文の二重管理を防ぐ）', () => {
    for (const [file, name] of [
      ['src/data/learningContent/math_vector.ts', 'MATH_VECTOR'],
      ['src/data/learningContent/math_probability.ts', 'MATH_PROBABILITY'],
      ['src/data/learningContent/math_integer.ts', 'MATH_INTEGER'],
    ] as const) {
      const src = readFileSync(file, 'utf8');
      expect(src).toMatch(
        new RegExp(`export const ${name}_HTML\\s*=\\s*${name}_PARTS\\.map\\(p => p\\.html\\)\\.join`),
      );
    }
  });
});

describe('執筆中に修正した数学的欠陥の再発防止', () => {
  it('確率融合問題：q_mp_8_mixed_3 の答えは 1/2（誤答 3/4 ドラフトの再発防止）', () => {
    const src = readFileSync('src/data/mathProbabilityProblems.ts', 'utf8');
    const line = src.split('\n').find((l) => l.includes("'q_mp_8_mixed_3'")) || '';
    expect(line).toContain("'1/2'");
    expect(line).not.toContain("'3/4'");
  });

  it('整数 gcd/lcm 問題：q_mi_1_gcd_3 の答えは 42（誤答 54 ドラフトの再発防止）', () => {
    const src = readFileSync('src/data/mathIntegerProblems.ts', 'utf8');
    const line = src.split('\n').find((l) => l.includes("'q_mi_1_gcd_3'")) || '';
    expect(line).toContain("'42'");
    expect(line).not.toContain("'54'");
  });

  it('整数 不定方程式：7x+5y=39 の自然数解（解なし 7x+5y=4 ドラフトの再発防止）', () => {
    const src = readFileSync('src/data/mathIntegerProblems.ts', 'utf8');
    expect(src).toContain('7x + 5y = 39');
    expect(src).not.toContain('7x + 5y = 4 ');
  });
});

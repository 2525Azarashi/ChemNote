/**
 * ===================================================================
 * 数学の短答式サブ設問を組み立てる sq() のテスト
 * ===================================================================
 *
 * ■ 背景
 *   sq() は数学の問題データ4ファイルに ★1バイトも違わない同じ実装で4つ★
 *   置かれていた（合計171箇所から呼ばれている）。
 *   data/mathProblemKit.ts に1つへまとめたので、
 *   ふるまいが変わっていないことを固定する。
 *
 * ■ 変更前後で実データが同一だと確認した方法（重要）
 *   数学4ファイルの全 export を深く走査して JSON 化し、
 *   変更前後でファイルの MD5 を比較した。
 *     短答式オブジェクト数 171 / 出力1857行
 *     MD5 0005500e5b4da8a4f640b4d368bc9227 が変更前後で一致
 *     cmp でもバイト単位で同一
 *   つまり生成される問題データは1バイトも変わっていない。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { sq } from '../src/data/mathProblemKit';

/** 旧実装の複製（4ファイルにあったものと同一） */
const legacySq = (
  id: string,
  label: string,
  correctAnswer: string,
  acceptedAnswers: string[] = [],
) => ({
  id,
  label,
  type: 'short_answer',
  correctAnswer,
  acceptedAnswers,
  requiresMathPalette: true,
});

describe('sq()（短答式サブ設問の組み立て）', () => {
  it('★旧実装と結果が完全に一致する★', () => {
    const cases: [string, string, string, string[]?][] = [
      ['q1', '約数の個数を求めよ', '12'],
      ['q2', '定積分の値', '7/3', ['7/3', '2.333...']],
      ['q3', '確率', '1/6', ['1/6']],
      ['q4', 'ベクトルの成分', '(2, 5)', ['(2,5)', '(2, 5)']],
      ['q5', '空の受け入れ配列', '0', []],
      ['q6', '', ''],                       // 空文字でも落ちない
      ['q7', '√を含む', '√(5)', ['√5']],
      ['q8', '一般解', 'x = 5k + 3', ['x=5k+3']],
    ];
    for (const [id, label, ans, accepted] of cases) {
      const a = accepted === undefined ? sq(id, label, ans) : sq(id, label, ans, accepted);
      const b = accepted === undefined
        ? legacySq(id, label, ans)
        : legacySq(id, label, ans, accepted);
      expect(a, `${id} で旧実装とずれている`).toEqual(b);
    }
  });

  it('acceptedAnswers を省略すると空配列になる（毎回書かなくてよい）', () => {
    const r = sq('q', 'ラベル', '答え');
    expect(r.acceptedAnswers).toEqual([]);
    // 呼び出しごとに別の配列で、共有されていないこと（片方に push しても他に影響しない）
    const r2 = sq('q2', 'ラベル2', '答え2');
    expect(r.acceptedAnswers).not.toBe(r2.acceptedAnswers);
  });

  it('短答式の既定値（type / requiresMathPalette）が全問に付く', () => {
    const r = sq('q', 'ラベル', '答え');
    expect(r.type).toBe('short_answer');
    expect(r.requiresMathPalette).toBe(true);
  });

  it('渡した acceptedAnswers をそのまま保持する（勝手に加工しない）', () => {
    const accepted = ['a', 'b'];
    const r = sq('q', 'ラベル', 'a', accepted);
    expect(r.acceptedAnswers).toBe(accepted);
  });

  it('返すキーは6つだけ（余計なものを増やしていない）', () => {
    expect(Object.keys(sq('q', 'l', 'a')).sort()).toEqual(
      ['acceptedAnswers', 'correctAnswer', 'id', 'label', 'requiresMathPalette', 'type']
    );
  });
});

// -------------------------------------------------------------------
// 実データが壊れていないことの確認
// -------------------------------------------------------------------
describe('数学4単元の実データ', () => {
  it('★短答式サブ設問が171個ある（変更前と同数）★', async () => {
    const mods = [
      await import('../src/data/mathIntegerProblems'),
      await import('../src/data/mathIntegralProblems'),
      await import('../src/data/mathProbabilityProblems'),
      await import('../src/data/mathVectorProblems'),
    ];
    let count = 0;
    const seen = new WeakSet<object>();
    const walk = (v: unknown) => {
      if (v === null || typeof v !== 'object') return;
      if (seen.has(v as object)) return;
      seen.add(v as object);
      if (Array.isArray(v)) { v.forEach(walk); return; }
      const rec = v as Record<string, unknown>;
      if (rec.type === 'short_answer' && rec.requiresMathPalette === true) count++;
      for (const k of Object.keys(rec)) walk(rec[k]);
    };
    for (const m of mods) for (const k of Object.keys(m)) walk((m as Record<string, unknown>)[k]);
    expect(count).toBe(171);
  });

  it('全短答式サブ設問に id / label / correctAnswer が入っている', async () => {
    const mods = [
      await import('../src/data/mathIntegerProblems'),
      await import('../src/data/mathIntegralProblems'),
      await import('../src/data/mathProbabilityProblems'),
      await import('../src/data/mathVectorProblems'),
    ];
    const bad: string[] = [];
    const seen = new WeakSet<object>();
    const walk = (v: unknown) => {
      if (v === null || typeof v !== 'object') return;
      if (seen.has(v as object)) return;
      seen.add(v as object);
      if (Array.isArray(v)) { v.forEach(walk); return; }
      const rec = v as Record<string, unknown>;
      if (rec.type === 'short_answer' && rec.requiresMathPalette === true) {
        if (!rec.id || typeof rec.correctAnswer !== 'string') bad.push(String(rec.id));
        if (!Array.isArray(rec.acceptedAnswers)) bad.push(`${rec.id}(accepted)`);
      }
      for (const k of Object.keys(rec)) walk(rec[k]);
    };
    for (const m of mods) for (const k of Object.keys(m)) walk((m as Record<string, unknown>)[k]);
    expect(bad, `不正なサブ設問: ${bad.join(', ')}`).toEqual([]);
  });
});

// -------------------------------------------------------------------
// 番人：共通化が維持されていること
// -------------------------------------------------------------------
const ROOT = resolve(__dirname, '..');
const MATH_FILES = [
  'src/data/mathIntegerProblems.ts',
  'src/data/mathIntegralProblems.ts',
  'src/data/mathProbabilityProblems.ts',
  'src/data/mathVectorProblems.ts',
];

describe('番人（共通化の維持）', () => {
  it('★4ファイルすべてが共通の sq() を使っている★', () => {
    for (const f of MATH_FILES) {
      expect(readFileSync(resolve(ROOT, f), 'utf8'), `${f} が mathProblemKit を使っていない`)
        .toMatch(/from '\.\/mathProblemKit'/u);
    }
  });

  it('★4ファイルに sq() の実装コピーが残っていない★', () => {
    for (const f of MATH_FILES) {
      expect(readFileSync(resolve(ROOT, f), 'utf8'), `${f} に sq() の実装が残っている`)
        .not.toMatch(/const sq\s*=\s*\(/u);
    }
  });

  it('mathProblemKit.ts は何も import しない（葉のまま保つ）', () => {
    const src = readFileSync(resolve(ROOT, 'src/data/mathProblemKit.ts'), 'utf8');
    expect(src).not.toMatch(/^import\s/mu);
  });

  it('既存の import 経路（mathIntegralProblems からの MathProblem）が生きている', async () => {
    // 型は実行時に消えるので、再エクスポートの記述があることをソースで確認する
    const src = readFileSync(resolve(ROOT, 'src/data/mathIntegralProblems.ts'), 'utf8');
    expect(src).toMatch(/export type \{ MathProblem \}/u);
  });
});

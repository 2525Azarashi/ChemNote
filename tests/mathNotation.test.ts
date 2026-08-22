/**
 * 数学記法エンジン（convertMathNotation）の回帰テスト
 *
 * ■ 何を守るか（ご要望）
 *   「分数なのに / になってたり、指数もどこについてるのかわからん」を直す。
 *   数学データ（mathIntegralProblems.ts 等）のテキスト記法
 *     ∫[0→π/2] / Σ[k=1→n] / lim[n→∞] / √(x²+y²) / x^(3/2) / x^5/5 / 7C3
 *   が、教科書と同じ構造の HTML（上下限つき∫Σ・根号・縦書き分数・
 *   上付き指数・下付き nCr）へ変換されることを検査する。
 *
 * ■ 同時に守る「壊さない」制約
 *   ・化学の単位 g/mol・mol/L は分数化しない（既存挙動）
 *   ・座標 (3, 1) や成分の組 (3/5, 4/5) を1つの分数と誤認しない
 *   ・同位体 12C・35Cl を組合せ nCr と誤認しない
 */
import { describe, it, expect } from 'vitest';
import { convertMathNotation } from '../src/utils/textFormatter';

describe('convertMathNotation: 定積分・総和・極限', () => {
  it('∫[0→π/2] を上下限つきの大きな∫に変換する', () => {
    const out = convertMathNotation('∫[0→π/2] sin x dx');
    expect(out).toContain('math-bigop');
    expect(out).toContain('&#8747;');       // ∫ 本体
    expect(out).toContain('π/2');            // 上限
    expect(out).toMatch(/math-bigop-lims/);
  });

  it('∫[a,b]（カンマ区切り）も同様に変換する', () => {
    const out = convertMathNotation('∫[a,b] f(x) dx');
    expect(out).toContain('math-bigop');
    expect(out).not.toContain('∫[');
  });

  it('上下限のない ∫ も教科書サイズ（math-bigop-solo）にする', () => {
    const out = convertMathNotation('∫ x^4 dx');
    expect(out).toContain('math-bigop-solo');
  });

  it('Σ[k=1→n] を上下限つきのΣに変換する', () => {
    const out = convertMathNotation('Σ[k=1→n] k^2');
    expect(out).toContain('&#931;');
    expect(out).toContain('k=1');
    expect(out).toContain('math-bigop');
  });

  it('lim[n→∞] を lim の真下に条件が付く形に変換する', () => {
    const out = convertMathNotation('lim[n→∞] (1/n)Σ(k/n)^2');
    expect(out).toContain('math-lim');
    expect(out).toContain('n→∞');
  });
});

describe('convertMathNotation: 根号', () => {
  it('√(x² + y²) は中身の上に線が伸びる根号になる', () => {
    const out = convertMathNotation('√(2² + (-1)²)');
    expect(out).toContain('math-sqrt');
    expect(out).toContain('math-sqrt-body');
    expect(out).toContain('&#8730;');
  });

  it('√65 のような数値も根号で描画する', () => {
    const out = convertMathNotation('√65');
    expect(out).toContain('math-sqrt-body">65</span>');
  });

  it('√x のような変数も根号で描画する', () => {
    const out = convertMathNotation('2√x + C');
    expect(out).toContain('math-sqrt-body">x</span>');
  });
});

describe('convertMathNotation: 指数', () => {
  it('x^(3/2) の指数を上付きにする（中の / は分数化しない）', () => {
    const out = convertMathNotation('(2/3)x^(3/2) + C');
    expect(out).toContain('<sup');
    expect(out).toContain('3&#8725;2');   // 指数内の / は ∕ に置換
    expect(out).not.toContain('^(');
  });

  it('e^x・2^n の1文字英字指数を上付きにする', () => {
    const out = convertMathNotation('e^x + 2^n');
    expect(out).toMatch(/e<sup[^>]*>x<\/sup>/);
    expect(out).toMatch(/2<sup[^>]*>n<\/sup>/);
  });
});

describe('convertMathNotation: 分数', () => {
  it('x^5/5 は「x^5 分の…」の縦書き分数になる', () => {
    const out = convertMathNotation('x^5/5 + C');
    expect(out).toContain('inline-flex flex-col');   // buildFractionHtml の縦書き構造
    expect(out).toContain('border-b');
  });

  it('6!/(3!·2!·1!) の階乗分数を縦書きにする', () => {
    const out = convertMathNotation('6!/(3!·2!·1!) = 60');
    expect(out).toContain('inline-flex flex-col');
    expect(out).toContain('3!·2!·1!');
  });

  it('(a + 2b)/3 の括弧分子を縦書き分数にする', () => {
    const out = convertMathNotation('OP = (a + 2b)/3');
    expect(out).toContain('inline-flex flex-col');
    expect(out).toContain('a + 2b');
  });

  it('sin^5 x/5 は sin^5 x 全体が分子になる', () => {
    const out = convertMathNotation('sin^5 x/5 + C');
    expect(out).toContain('inline-flex flex-col');
    expect(out).toContain('sin');
  });

  it('-1/(2x^2) の括弧分母を縦書き分数にする', () => {
    const out = convertMathNotation('-1/(2x^2) + C');
    expect(out).toContain('inline-flex flex-col');
    expect(out).toContain('2x');
  });

  // ─────────────────────────────────────────────────────
  // ユーザー報告：「∫ 1/√x dx が分数になっていない」
  // 「∫ 1/x^3 dx の正解表示もおかしい」への回帰テスト
  // ─────────────────────────────────────────────────────
  it('1/√x は「1 分の √x」の縦書き分数になる（根号は分母の中）', () => {
    const out = convertMathNotation('∫ 1/√x dx');
    expect(out).toContain('inline-flex flex-col');   // 分数化されている
    expect(out).toContain('math-sqrt');              // 根号も描画されている
    // 分数の HTML の中に根号が入っていること（分数の外に √x が残らない）
    const fracIdx = out.indexOf('inline-flex flex-col');
    const sqrtIdx = out.indexOf('math-sqrt');
    expect(sqrtIdx).toBeGreaterThan(fracIdx);
  });

  it('1/√(x+1) の括弧つき根号分母も縦書き分数になる', () => {
    const out = convertMathNotation('1/√(x+1)');
    expect(out).toContain('inline-flex flex-col');
    expect(out).toContain('math-sqrt');
  });

  it('√x/2 は「√x 分の 2」…根号が分子の縦書き分数になる', () => {
    const out = convertMathNotation('√x/2 + C');
    expect(out).toContain('inline-flex flex-col');
    expect(out).toContain('math-sqrt');
  });

  it('1/x^3 は指数ごと分母に入る（^3 が分数の外にはみ出さない）', () => {
    const out = convertMathNotation('∫ 1/x^3 dx');
    expect(out).toContain('inline-flex flex-col');
    // 分数 HTML の後ろに生の ^3 や孤立した <sup>3</sup> が残らないこと
    expect(out).not.toMatch(/<\/span>\s*\^?3\s+dx/);
    // 分母部分に x^3（後段で上付き化される生テキスト）が丸ごと入っている
    expect(out).toContain('x^3');
  });

  it('2√x + C（正解表示で使う形）は分数化されず根号のまま', () => {
    const out = convertMathNotation('2√x + C');
    expect(out).not.toContain('inline-flex flex-col');
    expect(out).toContain('math-sqrt');
  });
});

describe('convertMathNotation: 順列・組合せ', () => {
  it('7C3 を ₇C₃ の形（下付き添字）にする', () => {
    const out = convertMathNotation('7C3 = 35');
    expect(out).toMatch(/<sub[^>]*>7<\/sub>C<sub[^>]*>3<\/sub>/);
  });

  it('nCr・7P3 も同様に変換する', () => {
    expect(convertMathNotation('nCr')).toMatch(/<sub[^>]*>n<\/sub>C<sub[^>]*>r<\/sub>/);
    expect(convertMathNotation('7P3')).toMatch(/<sub[^>]*>7<\/sub>P<sub[^>]*>3<\/sub>/);
  });
});

describe('convertMathNotation: 化学・英語の本文を壊さない', () => {
  it('単位 g/mol・mol/L は分数化しない', () => {
    expect(convertMathNotation('モル質量は 18 g/mol')).toContain('g/mol');
    expect(convertMathNotation('濃度 0.10 mol/L')).toContain('mol/L');
  });

  it('同位体 12C・35Cl は nCr に変換しない（後ろに数字が続かないため）', () => {
    const out = convertMathNotation('12C と 35Cl の存在比');
    expect(out).toContain('12C');
    expect(out).toContain('35Cl');
  });

  it('座標の組 (3/5, 4/5) を1つの分数と誤認しない', () => {
    // 中身にカンマを含む括弧は EXPR に一致しないので分数化されない
    const out = convertMathNotation('単位ベクトルは (3/5, 4/5)');
    expect(out).not.toContain('3/5, 4/5</span>');
  });

  it('日本語の文章・URLはそのまま通る', () => {
    expect(convertMathNotation('これは普通の文章です。')).toBe('これは普通の文章です。');
  });
});

describe('convertMathNotation: 実データを通した煙テスト', () => {
  it('数学全単元の問題文・解説が生テキストの ^( や ∫[ を残さない', async () => {
    const { mathData } = await import('../src/data/mathData');
    const texts: string[] = [];
    for (const part of mathData.parts as any[]) {
      for (const ch of part.chapters) {
        for (const q of ch.practiceProblems ?? []) {
          if (q?.text) texts.push(q.text);
          if (q?.explanation) texts.push(q.explanation);
        }
      }
    }
    expect(texts.length).toBeGreaterThan(0);
    for (const t of texts) {
      const out = convertMathNotation(t);
      // 上下限つき∫・括弧指数の生テキストが残っていないこと
      expect(out).not.toMatch(/∫\[[^\]]*→[^\]]*\]/);
      expect(out).not.toMatch(/[A-Za-z0-9)]\^\([^()]{1,30}\)/);
    }
  });
});

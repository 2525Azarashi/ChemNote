/**
 * 数式組版エンジン（KaTeX ベース / src/utils/mathTypeset.ts）の回帰テスト
 *
 * ■ 何を守るか（ご要望）
 *   「数式表記がどうしても汚い。Word の数式みたいにしっかりした数式の文字で
 *    出せないのか。解説も問題も、化学基礎でも化学でも数学でも」
 *
 *   → 数式は自作 HTML ではなく TeX の組版（KaTeX）で組む。
 *     このテストは
 *       (1) アプリのテキスト記法が正しい LaTeX に変換されること
 *       (2) 化学式・単位・英語本文を数式と誤認して壊さないこと
 *       (3) 生成 HTML がサニタイザを通っても数式が消えないこと
 *     を固定する。(2) が最重要（既存の全教科を壊さないため）。
 */
import { describe, it, expect } from 'vitest';
import {
  toLatex,
  splitMathPieces,
  renderLatex,
  typesetHtmlMath,
  typesetMath,
  mayContainMath,
  scanMathRegions,
} from '../src/utils/mathTypeset';
import { sanitizeInlineHtml } from '../src/utils/sanitizeHtml';
import { formatText } from '../src/utils/textFormatter';
import { LABEL, BOX } from '../src/utils/explanationFormat';

/** テキストから数式として切り出された LaTeX の配列を得る。 */
function mathOf(text: string): string[] {
  return splitMathPieces(text).filter((p) => p.kind === 'math').map((p) => p.value);
}

/** テキストが一切数式化されないこと（＝従来の描画に任せる）を検査する。 */
function expectNoMath(text: string) {
  expect(mathOf(text), `数式化してはいけない: ${text}`).toEqual([]);
}

describe('toLatex: 積分・総和・極限', () => {
  it('上下限つきの定積分を \\int_{}^{} に変換する', () => {
    expect(toLatex('∫[0→π/2] sin x dx')).toBe('\\int_{0}^{\\frac{\\pi}{2}} \\sin x \\,dx');
  });

  it('上下限のない ∫ と微分要素 dx を組む', () => {
    expect(toLatex('∫ x^4 dx')).toBe('\\int x^{4} \\,dx');
  });

  it('総和 Σ[k=1→n] を \\sum_{}^{} に変換する', () => {
    expect(toLatex('Σ[k=1→n] k^2')).toBe('\\sum_{k=1}^{n} k^{2}');
  });

  it('極限 lim[n→∞] を \\lim_{n \\to \\infty} に変換する', () => {
    expect(toLatex('lim[n→∞]')).toContain('\\lim_{n \\to \\infty}');
  });
});

describe('toLatex: 分数の切り出し（どこまでが分子・分母か）', () => {
  it('指数つきの分子をまとめて分子に入れる（x^(n+1)/(n+1)）', () => {
    expect(toLatex('x^(n+1)/(n+1)')).toBe('\\frac{x^{n+1}}{n+1}');
  });

  it('分母の指数を分母に含める（1/x^3 は (1/x)^3 にしない）', () => {
    expect(toLatex('1/x^3')).toBe('\\frac{1}{x^{3}}');
  });

  it('関数の引数まで分母に含める（1/cos^2x）', () => {
    expect(toLatex('1/cos^2x')).toBe('\\frac{1}{\\cos^2x}');
  });

  it('関数が分母のとき引数も分母に入れる（a^x/log a）', () => {
    expect(toLatex('a^x/log a')).toBe('\\frac{a^{x}}{\\log a}');
  });

  it('分数を囲む括弧は \\left( \\right) で高さを合わせる', () => {
    expect(toLatex('(1/2)e^(x^2)')).toBe('\\left(\\frac{1}{2}\\right)e^{x^{2}}');
  });
});

describe('toLatex: 根号・絶対値・組合せ・導関数', () => {
  it('√(…) を \\sqrt{} にする', () => {
    expect(toLatex('√(x^3+2)')).toBe('\\sqrt{x^{3}+2}');
  });

  it('Unicode の上付き（x²）も指数として扱う', () => {
    expect(toLatex('√(x²+y²)')).toBe('\\sqrt{x^{2}+y^{2}}');
  });

  it('|x| を \\left| \\right| にする', () => {
    expect(toLatex('log|x|')).toBe('\\log \\left|x\\right|');
  });

  it('7C3 を下付きの組合せ記号にする', () => {
    expect(toLatex('7C3')).toBe('{}_{7}\\mathrm{C}_{3}');
  });

  it("導関数 (x^n)' の形を保つ", () => {
    expect(toLatex("(x^n)'")).toBe("(x^{n})'");
  });
});

describe('splitMathPieces: 数式領域の切り出し', () => {
  it('日本語の本文中の数式だけを数式にする', () => {
    const pieces = splitMathPieces('どの問題も公式 ∫ x^n dx = x^(n+1)/(n+1) + C（n ≠ -1）に帰着します。');
    expect(pieces.filter((p) => p.kind === 'math')).toHaveLength(1);
    expect(pieces[0].kind).toBe('text');
    expect(pieces[pieces.length - 1].value).toContain('に帰着します。');
  });

  it('読点で区切られた複数の式をそれぞれ数式にする', () => {
    expect(mathOf('∫ sin x dx = −cos x + C、∫ cos x dx = sin x + C')).toHaveLength(2);
  });

  it('問題番号（1）は数式に含めない', () => {
    const pieces = splitMathPieces('（1）∫ x e^(2x) dx');
    expect(pieces[0]).toEqual({ kind: 'text', value: '（1）' });
    expect(mathOf('（1）∫ x e^(2x) dx')).toEqual(['\\int x e^{2x} \\,dx']);
  });

  it('$…$ で明示された数式を組む', () => {
    expect(mathOf('式は $\\frac{1}{2}mv^2$ です')).toEqual(['\\frac{1}{2}mv^2']);
  });

  it('\\ce{…}（化学反応式）を数式として扱う', () => {
    expect(mathOf('反応は \\ce{2H2O -> 2H2 + O2} です')).toEqual(['\\ce{2H2O -> 2H2 + O2}']);
  });
});

describe('既存データを壊さない（最重要）', () => {
  it('化学の単位（g/mol・mol/L）は数式化しない', () => {
    expectNoMath('モル質量は g/mol、濃度は mol/L で表す');
    expectNoMath('密度は d g/cm3、体積は 22.4 L/mol');
    expectNoMath('速度は m/s、加速度は m/s^2');
    expectNoMath('気体定数は 8.31 J/(mol·K) である');
  });

  it('単位は数式化・化学式化しない（斜体になると別の意味になる）', () => {
    expectNoMath('18 g/mol という単位');
    expectNoMath('mol^-1 という単位');
  });

  it('英語リスニングの本文は数式化しない', () => {
    expectNoMath('She asked when the 12/15 train leaves.');
    expectNoMath('The ratio was 3/4 of the total number of students.');
    expectNoMath('Please turn to page 24 and answer questions 1/2.');
  });

  it('日本語のみの文は走査してもコストを掛けず素通しする', () => {
    expect(scanMathRegions('純物質と混合物の違いを説明できるようにしよう。')).toEqual([]);
  });
});

describe('renderLatex: KaTeX 出力とサニタイズの整合', () => {
  it('KaTeX の HTML を生成する', () => {
    const html = renderLatex('\\frac{x^{n+1}}{n+1}');
    expect(html).toContain('class="katex"');
    expect(html).toContain('mtb-math');
  });

  it('読み上げ用の aria-label を持つ', () => {
    expect(renderLatex('x^2', { ariaLabel: 'x^2' })).toContain('aria-label="x^2"');
  });

  it('サニタイザを通しても数式が消えない（span/class/style/aria-label が許可されている）', () => {
    const sanitized = sanitizeInlineHtml(renderLatex('\\int_{0}^{1} x \\,dx'));
    expect(sanitized).toContain('class="katex"');
    expect(sanitized).toContain('aria-label');
    // 分数・積分記号の字形（KaTeX が出すグリフ）が残っていること
    expect(sanitized).toContain('∫');
  });

  it('\\ce{} で化学反応式を組める（mhchem 拡張が有効）', () => {
    const html = renderLatex('\\ce{2H2O -> 2H2 + O2}');
    expect(html).toContain('class="katex"');
    expect(html.length).toBeGreaterThan(500);
  });

  it('壊れた LaTeX でも例外を投げず画面を壊さない', () => {
    expect(() => renderLatex('\\frac{1}{')).not.toThrow();
    expect(renderLatex('\\frac{1}{')).toContain('span');
  });
});

describe('typesetHtmlMath: まとめプリント（HTML）の数式', () => {
  it('<sup> で書かれた指数を含む式を KaTeX で組み直す', () => {
    const html = typesetHtmlMath("<li>(x<sup>n</sup>)' = nx<sup>n−1</sup>、(sin x)' = cos x</li>");
    expect(html).toContain('class="katex"');
    // <li> の構造は保たれる
    expect(html.startsWith('<li>')).toBe(true);
    expect(html.endsWith('</li>')).toBe(true);
  });

  it('∫ と分数が混ざった公式を組み直す', () => {
    const html = typesetHtmlMath('<li>∫ x<sup>n</sup> dx = x<sup>n+1</sup>/(n+1) + C（n ≠ −1）</li>');
    expect(html).toContain('class="katex"');
    // 数式外の注記は素のテキストとして残る
    expect(html).toContain('（n ≠ −1）');
  });

  it('強調タグ（<strong>）の外側だけを数式にする', () => {
    const html = typesetHtmlMath('<li>∫ 1/x dx = log|x| + C ← <strong>絶対値を忘れない</strong></li>');
    expect(html).toContain('class="katex"');
    expect(html).toContain('<strong>絶対値を忘れない</strong>');
  });

  /*
    ★方針を変えた箇所★
    以前ここは「化学式の <sub>/<sup> は変換しない（無変更で返す）」を
    期待していた。しかしご要望
      「化学式とか反応式も全部ね　問題だけじゃなくて解説とかもね」
      「残りもしてね」
    により、まとめプリント（HTML）の化学式・反応式も mhchem で組む。
    問題文・解説は既に mhchem で組めていたのに、まとめプリントだけが
    「<sub> を小さくしただけ」の見た目で取り残されていたため。
  */
  it('化学式の <sub>/<sup> も mhchem で組み直す（まとめプリント）', () => {
    const chem = typesetHtmlMath('<p>水 H<sub>2</sub>O のモル質量は 18 g/mol である</p>');
    expect(chem).toContain('class="katex"');
    // 読み上げ用に元の並びが残る
    expect(chem).toContain('aria-label="H_{2}O"');
    // 数式でない地の文はそのまま
    expect(chem).toContain('のモル質量は 18 g/mol である');
    expect(chem).not.toContain('katex-error');

    const ion = typesetHtmlMath('<li>Fe<sup>2+</sup> は還元剤としてはたらく</li>');
    expect(ion).toContain('class="katex"');
    expect(ion).toContain('は還元剤としてはたらく');
    expect(ion).not.toContain('katex-error');
  });

  it('反応式（矢印つき）も1つの \\ce{…} として組む', () => {
    const html = typesetHtmlMath(
      '<p>Zn ＋ 2HCl → ZnCl<sub>2</sub> ＋ H<sub>2</sub> は酸化還元反応</p>',
    );
    expect(html).toContain('class="katex"');
    // 式全体が1つの領域になる（左右の辺がばらばらに組まれない）
    expect(html).toContain('aria-label="Zn ＋ 2HCl → ZnCl_{2} ＋ H_{2}"');
    expect(html).toContain('は酸化還元反応');
    expect(html).not.toContain('katex-error');
  });

  it('★原子の数と電荷を混同しない★ SO4²⁻ の 4 は原子数・2- は電荷', () => {
    const html = typesetHtmlMath('<p>硫酸イオン SO<sub>4</sub><sup>2-</sup> は2価の陰イオン</p>');
    expect(html).toContain('class="katex"');
    // ^ が残っていること（落ちると "酸素が42個" の意味になる）
    expect(html).toContain('aria-label="SO_{4}^{2-}"');
    expect(html).not.toContain('katex-error');
  });

  it('英文・単位・ローマ数字（酸化数）は化学式にしない', () => {
    // 元素記号の並びとして読めてしまう英単語（In, No, It, OK）
    const en = '<p>In this case, No problem at all. It is OK.</p>';
    expect(typesetHtmlMath(en)).toBe(en);
    // 単位（mol/L, L, mol）は斜体の変数にしてはいけない
    const unit = '<p>mol/L で表す。22.4 L は 1 mol。</p>';
    expect(typesetHtmlMath(unit)).toBe(unit);
    // 銅(II) の (II) は酸化数であって化学式ではない
    const roman = typesetHtmlMath('<p>銅(II)イオンは青色</p>');
    expect(roman).toBe('<p>銅(II)イオンは青色</p>');
  });

  it('数式を含まない HTML はそのまま返す（冪等・無害）', () => {
    const plain = '<p>純物質と混合物の違いを覚えよう。</p>';
    expect(typesetHtmlMath(plain)).toBe(plain);
    expect(typesetHtmlMath(typesetHtmlMath(plain))).toBe(plain);
  });
});

describe('KaTeX が実際に組版できる LaTeX を返す（描画エラーの検出）', () => {
  /**
   * 最重要の回帰テスト。
   *
   * toLatex は冪等ではない（例: `(1/2)` → `\left(\frac{1}{2}\right)` の
   * 括弧規則が二度当たると `\left\left(` になる）。以前、呼び出し側で
   * toLatex を二重に適用していたため、単体テストは全て緑なのに
   * 画面では数式が赤い LaTeX ソースのまま表示される、という不具合が出た。
   *
   * ここでは「文字列がどう変換されたか」ではなく
   * 「KaTeX が組版に成功したか」を最終出力の HTML で検査する。
   */
  const shouldRender = [
    '（1）∫ x e^(2x) dx',
    'x^(n+1)/(n+1) + C',
    '∫[0→π/2] sin x dx',
    "(x^n)′ = n x^(n-1)",
    '(1/2)e^(x^2) + C',
    '(2/9)(x^3+2)√(x^3+2) + C',
    '∫ 1/cos^2x dx = tan x + C',
    'Σ[k=1→n] k^2 = n(n+1)(2n+1)/6',
    'lim[n→∞] (1 + 1/n)^n = e',
    '7C3 = 35',
    '∫ (log x)/x dx',
    '√(x^2 + 1)/(x - 1)',
  ];

  it.each(shouldRender)('KaTeX のエラー表示にならない: %s', (src) => {
    const html = typesetMath(src);
    // KaTeX は失敗すると色付きの .katex-error に元ソースを入れて返す
    expect(html, `KaTeX が組版に失敗した: ${src}`).not.toContain('katex-error');
    // 生の LaTeX コマンドが画面に漏れていない
    expect(html).not.toContain('\\frac');
    expect(html).not.toContain('\\left');
    // ちゃんと数式として組まれている
    expect(html).toContain('class="katex"');
  });

  it('二重適用で壊れる形を作らない（\\left\\left( を生成しない）', () => {
    for (const src of shouldRender) {
      const latex = mathOf(src).join(' ');
      expect(latex, src).not.toContain('\\left\\left');
      expect(latex, src).not.toContain('\\right\\right');
    }
  });

  it('サニタイズ後も数式が消えない', () => {
    for (const src of shouldRender) {
      const clean = sanitizeInlineHtml(typesetMath(src));
      expect(clean, src).toContain('class="katex"');
    }
  });
});

describe('mayContainMath: 走査の前段フィルタが数式を取りこぼさない', () => {
  /**
   * formatText は性能のため「数式の気配が無いテキスト」を早期 return する。
   * この判定が STRONG_TRIGGER より厳しいと、トリガを増やしても
   * 実アプリでは数式にならない（テストは splitMathPieces を直接呼ぶので
   * 気付けない）という取りこぼしが起きる。両者の整合を固定する。
   */
  it('数式化されるテキストは必ず前段フィルタを通過する', () => {
    const mathTexts = [
      'x^5/5 + C',
      '(1/2)e^(x^2) + C',
      '(2/9)(x^3+2)√(x^3+2) + C',
      'x^(n+1)/(n+1) + C',
      '（1）∫ x e^(2x) dx',
      "(x^n)′ = n x^(n-1)",
      '7C3 = 35',
      'lim[n→∞] (1 + 1/n)^n = e',
    ];
    for (const text of mathTexts) {
      expect(mathOf(text).length, `数式として検出されるべき: ${text}`).toBeGreaterThan(0);
      expect(mayContainMath(text), `前段フィルタが弾いてしまう: ${text}`).toBe(true);
    }
  });

  it('数式を含まないテキストは前段で弾く（走査コストを掛けない）', () => {
    expect(mayContainMath('純物質と混合物の違いを覚えよう。')).toBe(false);
    expect(mayContainMath('She asked when the train leaves.')).toBe(false);
  });
});

// ------------------------------------------------------------------
// 化学式・化学反応式（mhchem）
// ------------------------------------------------------------------
//
// ご要望「化学式とか反応式も全部ね。問題だけじゃなくて解説とかもね」
//
// 化学式は以前「元素記号を Cambria Math、添字だけ font-sans」で描いており、
// フォントが混ざって字面が揃わなかった。TeX の標準である mhchem に載せ、
// 数式と同じ KaTeX で組む。問題文・解説文の区別なく formatText を通るので
// 両方に効く（＝ここで splitMathPieces を検査すれば両方を担保できる）。
describe('化学式・反応式を mhchem で組む', () => {
  it('化学反応式を \\ce{} に変換する', () => {
    expect(mathOf('HCl + NaOH → NaCl + H₂O')).toEqual(['\\ce{HCl + NaOH -> NaCl + H2O}']);
    expect(mathOf('2HCl + Ca(OH)₂ → CaCl₂ + 2H₂O')).toEqual(['\\ce{2HCl + Ca(OH)2 -> CaCl2 + 2H2O}']);
    expect(mathOf('2H2O → 2H2 + O2')).toEqual(['\\ce{2H2O -> 2H2 + O2}']);
  });

  it('可逆反応の矢印（⇄）を <=> にする', () => {
    // 電荷は必ず ^ 付き（CH3COO- ではなく CH3COO^-）。
    // ^ が無いと mhchem は末尾の - をハイフンとして扱い得る。
    expect(mathOf('CH₃COO⁻ ＋ H₂O ⇄ CH₃COOH ＋ OH⁻'))
      .toEqual(['\\ce{CH3COO^- + H2O <=> CH3COOH + OH^-}']);
  });

  it('空白なしで書かれた反応式も項に分ける（H⁺+OH⁻→H₂O）', () => {
    expect(mathOf('H⁺+OH⁻→H₂O')).toEqual(['\\ce{H^+ + OH^- -> H2O}']);
  });

  /**
   * ★最重要★ 電荷と原子数を混同しないこと。
   * SO₄²⁻ を "SO42-" にしてしまうと mhchem は「酸素42個」と解釈し、
   * 化学的に誤った表示になる。正しくは SO4^2-（4=原子数, 2-=電荷）。
   */
  it('イオンの電荷を原子数と混同しない（SO₄²⁻ → SO4^2-）', () => {
    expect(mathOf('SO₄²⁻')).toEqual(['\\ce{SO4^2-}']);
    expect(mathOf('Cu²⁺')).toEqual(['\\ce{Cu^2+}']);
    expect(mathOf('Al³⁺')).toEqual(['\\ce{Al^3+}']);
    expect(mathOf('HSO₄⁻ ＋ H₂O → SO₄²⁻ ＋ H₃O⁺'))
      .toEqual(['\\ce{HSO4^- + H2O -> SO4^2- + H3O^+}']);
  });

  it('解説文（日本語）の中の化学式も組む', () => {
    // 「問題だけじゃなくて解説も」に対応する検査
    const pieces = splitMathPieces('② H₂O が H⁺ を受け取って HCO₃⁻ になっている');
    const math = pieces.filter((p) => p.kind === 'math').map((p) => p.value);
    expect(math).toEqual(['\\ce{H2O}', '\\ce{H^+}', '\\ce{HCO3^-}']);
    // 日本語はテキストとして残る
    expect(pieces.some((p) => p.kind === 'text' && p.value.includes('受け取って'))).toBe(true);
  });

  it('KaTeX が実際に組版できる（エラー表示にならない）', () => {
    const samples = [
      'HCl + NaOH → NaCl + H₂O',
      '3H₂SO₄ + 2Al(OH)₃ → Al₂(SO₄)₃ + 6H₂O',
      'CH₃COO⁻ ＋ H₂O ⇄ CH₃COOH ＋ OH⁻',
      'SO₄²⁻',
      '② H₂O が H⁺ を受け取って HCO₃⁻ になっている',
    ];
    for (const s of samples) {
      const html = sanitizeInlineHtml(typesetMath(s));
      expect(html, `組版に失敗: ${s}`).not.toContain('katex-error');
      expect(html, `数式になっていない: ${s}`).toContain('class="katex"');
    }
  });

  describe('化学式と誤認してはいけないもの', () => {
    it('英文（大文字で始まる語の連続）を化学式にしない', () => {
      expectNoMath('She asked when the train leaves.');
      expectNoMath('The Cat In The Bag');
      expectNoMath('I Am Happy Today');
      expectNoMath('No In As At Be');
    });

    it('単位を化学式にしない', () => {
      expectNoMath('モル質量は g/mol、濃度は mol/L で表す');
      expectNoMath('密度は d g/cm3、体積は 22.4 L/mol');
      expectNoMath('気体定数は 8.31 J/(mol·K) である');
    });

    it('元素記号として読めない語は化学式にしない', () => {
      expectNoMath('Cabbage を食べる');
      expectNoMath('Hello World');
    });

    it('単独の元素記号1個は組み替えない（文章の読みやすさを保つ）', () => {
      expectNoMath('酸素 O のみに注目する');
      expectNoMath('炭素 C を含む');
    });
  });
});

/**
 * ===================================================================
 * 解説データの HTML 属性を数式と誤認して壊さない（実測で見つけた不具合）
 * ===================================================================
 *
 * ■ ご要望
 *   「化学基礎・化学含め様々な科目で解答解説と問題のフォントがあっていないので
 *     問題のフォントに合わせて。」
 *
 * ■ 実測でわかった原因（推測ではなく Playwright の getComputedStyle）
 *   スマホ 390x844／化学基礎の解答・解説画面で、
 *     「解 答」「解法の思考手順」だけが font-family: KaTeX_Main（セリフ体）
 *   になっていた。DOM を見ると pill の HTML がこう壊れていた。
 *
 *     background-color:#&lt;span class=" aria-label="FFF1F5" class="katex" …>解 答</span>
 *
 *   つまり LABEL() が出力する style 属性の中の色コード「#FFF1F5」が
 *   数式トークンと判定され、属性値の途中に KaTeX の HTML が
 *   差し込まれていた。結果として
 *     ・pill の背景色が効かない
 *     ・class="katex" が付くのでセリフ体になる
 *   という二重の壊れ方をしていた。
 *
 * ■ 直し方
 *   formatText で「入力に元から入っている HTML タグ」を先に退避し、
 *   数式走査はタグの外側（＝実際に表示されるテキスト）だけに掛ける。
 *   科目名や字面で分岐する対処はしない（データ上の事実＝タグかどうかで判断）。
 *
 * このテストは上記の壊れ方が再発しないことを固定する。
 */
describe('HTML 属性の中身を数式と誤認しない（解答解説のフォント一致）', () => {
  /** formatText の出力（React 要素）から実際の HTML 文字列を取り出す。 */
  function htmlOf(text: string): string {
    const out = formatText(text) as any;
    return out?.props?.dangerouslySetInnerHTML?.__html ?? String(out ?? '');
  }

  it('LABEL() の style 属性の色コードが数式に変換されない', () => {
    const html = htmlOf(LABEL('解 答') + '\nあいう');

    // 色コードがそのまま残っている（＝属性が壊れていない）
    expect(html).toContain('#FFF1F5');
    expect(html).toContain('border:1.5px solid #D9466E');
    // 属性の途中に KaTeX が差し込まれていない
    expect(html).not.toContain('class="katex"');
    expect(html).not.toContain('aria-label="FFF1F5"');
    // ラベルの表示テキストと本文は残る
    expect(html).toContain('解 答');
    expect(html).toContain('あいう');
  });

  it('BOX() のような複数属性つきタグでも属性値が壊れない', () => {
    const html = htmlOf(BOX('共通テストではこう出る'));

    expect(html).toContain('#FFF4E5');
    expect(html).toContain('#FB8C00');
    expect(html).toContain('#3E2723');
    expect(html).not.toContain('class="katex"');
    expect(html).toContain('共通テストではこう出る');
  });

  it('タグの外側にある本物の数式はこれまで通り組まれる', () => {
    // 退避のしすぎで数式が組まれなくなっていないことも同時に固定する。
    const html = htmlOf(LABEL('解 答') + '\n$x^2 + 1$');
    expect(html).toContain('#FFF1F5');
    expect(html).toContain('katex');
  });
});

/**
 * ===================================================================
 * **…** を太字として描画する（ご要望「太字として表示してください」）
 * ===================================================================
 *
 * ■ 何が起きていたか
 *   解説データには Markdown 記法の太字が書かれているのに、アプリ側に
 *   解釈する処理が無く、画面に
 *     （2） **固体（不溶性の固体）と液体の混合物**
 *   とアスタリスクがそのまま出ていた。
 *
 * ■ 入れる前に実測で確認したこと（べき乗との衝突が怖いため）
 *   コードコメントを除いた src/data 配下の全データを走査した結果：
 *     ・**…** のペア … 64組
 *       （chemProblemsC1 5 / chemProblemsC2 17 / mathIntegralProblems 42）
 *     ・ペアにならない孤立した ** … 0件
 *     ・$…$（数式）の中にある ** … 0件
 *   数値だけを囲む5件（**-5** / **0** / **2** / **1/3** / **8/15**）も
 *   前後を読むと「答えの強調」で、べき乗ではなかった。
 *
 * ■ このテストが守ること
 *   ① 実データの3パターンが太字になる
 *   ② アスタリスク1個の掛け算（a * b → ×）を壊さない
 *   ③ 「解 答」pill（style つき span）を壊さない＝フォント修正を巻き戻さない
 *   ④ 数式・化学式と併存できる
 *   ⑤ 空（****）・改行またぎには手を出さない
 */
describe('**…** を太字として表示する', () => {
  function htmlOf(text: string, prose = false): string {
    const out = formatText(text, [], { prose }) as any;
    return out?.props?.dangerouslySetInnerHTML?.__html ?? String(out ?? '');
  }

  it('実データの太字がアスタリスクではなく <strong> になる', () => {
    const html = htmlOf('（2） **固体（不溶性の固体）と液体の混合物**');
    expect(html).toContain('<strong class="font-bold">固体（不溶性の固体）と液体の混合物</strong>');
    // アスタリスクが画面に残らない
    expect(html).not.toContain('**');
  });

  it('数値だけを囲む強調（数学の答え）も太字になる', () => {
    // 「x の係数は **-5** なので」＝べき乗ではなく答えの強調
    expect(htmlOf('計算不要で **0**。')).toContain('<strong class="font-bold">0</strong>');
    expect(htmlOf('x の係数は **-5** なので')).toContain('<strong class="font-bold">-5</strong>');
  });

  it('アスタリスク1個の掛け算（× 変換）を壊さない', () => {
    const html = htmlOf('a * b と 2 * 3');
    // × に変換される従来の挙動が保たれている
    expect(html).toContain('×');
    expect(html).not.toContain('<strong');
  });

  it('アスタリスク1個で囲んだだけの文字列は太字にしない', () => {
    const html = htmlOf('注意*ここ*は太字にしない');
    expect(html).not.toContain('<strong');
    expect(html).toContain('*ここ*');
  });

  it('「解 答」pill を壊さない（フォント修正を巻き戻さない）', () => {
    const html = htmlOf(LABEL('解 答') + '\n**ろ液**が答え');
    // pill の style が無傷
    expect(html).toContain('#FFF1F5');
    expect(html).toContain('border:1.5px solid #D9466E');
    expect(html).not.toContain('aria-label="FFF1F5"');
    // 本文側は太字になっている
    expect(html).toContain('<strong class="font-bold">ろ液</strong>');
  });

  it('数式（$…$）と併存できる', () => {
    const html = htmlOf('答えは **1/3** で、式は $\\int_0^1 x^2 dx$ です');
    expect(html).toContain('<strong class="font-bold">');
    expect(html).toContain('katex');
    expect(html).not.toContain('**');
  });

  it('英文（prose）でも太字になる', () => {
    const html = htmlOf('The answer is **milk with no sugar**.', true);
    expect(html).toContain('<strong class="font-bold">milk with no sugar</strong>');
  });

  it('空（****）や改行をまたぐものには手を出さない', () => {
    // 中身が無いものを太字にすると空タグが増えるだけなので変換しない
    expect(htmlOf('****')).not.toContain('<strong');
    // 閉じ忘れの可能性があるので改行をまたいだら変換しない（文章を巻き込まない）
    expect(htmlOf('**開いたまま\n閉じない**')).not.toContain('<strong');
  });
});

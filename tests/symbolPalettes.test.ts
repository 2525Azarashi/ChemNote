/**
 * ===================================================================
 * 記号パレット（化学／数学）の回帰テスト
 * ===================================================================
 *
 * ■ ご要望
 *   (1) 「数式パレットの方も変えてね　あと化学式のパレットの方も
 *         あと、そのぱれっとも分かりやすく押しやすいようにしてね　スマホの方も」
 *   (2) 「化学式パレットはアルファベットとかまでパレット作ったら練習にならないから
 *         基本は打つのがめんどくさい＋うちづらいものだけつくってくれたらいいよ」
 *   (3) 「探すのに時間を取らないようにしたい」
 *   (4) 「半角でも全角でも正解になるようにしてね」
 *
 * ■ このテストが守るもの
 *   パレットのボタンは「押した記号（tex）」と「入る文字（value）」の
 *   2つを同時に約束している。片方だけ直すと
 *     ・ボタン面が KaTeX エラーの赤字になる（tex が組版できない）
 *     ・押しても採点されない／組版されない（value が想定外の記法）
 *   という、画面を開かないと気づけない壊れ方をする。
 *
 *   そこで
 *     (a) 全ボタンの tex が KaTeX で必ず組める（赤字にならない）
 *     (b) 全ボタンの tex がサニタイザを通っても消えない
 *     (c) 全ボタンの value が本文と同じ組版エンジンで正しく組まれる
 *     (d) value が LaTeX になっていない（＝解答欄にそのまま入れて良い形）
 *     (e) 電荷は「数字→符号」の順（²⁻）＝ mhchem が原子数と混同しない
 *     (f) ★完成した化学式・イオンを収録していない（練習にならないため）★
 *     (g) ★キーボードで打てる文字を収録していない（探す対象を増やさない）★
 *     (h) ★タブ・枠内スクロールを作らない（探す動作をゼロにする）★
 *     (i) 押しやすさの UI 契約（タップ領域・グリッド）
 *   を総当たりで固定する。
 */
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import {
  chemistryPaletteGroups,
  mathPaletteGroups,
  type PaletteGroup,
  type PaletteItem,
} from '../src/data/symbolPalettes';
import { renderLatex, splitMathPieces } from '../src/utils/mathTypeset';
import { sanitizeInlineHtml } from '../src/utils/sanitizeHtml';
import { normalizeAnswer, isAnswerCorrect } from '../src/utils/answerJudge';

const QUIZ = readFileSync('src/components/Quiz.tsx', 'utf8');
/*
 * 記号パレットの見た目（ボタンのタップ領域・グリッド・組版）は
 * Quiz.tsx から components/SymbolPalette.tsx へ切り出した。
 * 「押しやすさの UI 契約」は移した先のソースで見張る。
 */
const PALETTE = readFileSync('src/components/SymbolPalette.tsx', 'utf8');

/** グループを平らにして「グループ名つきの item」の一覧にする。 */
function flatten(groups: PaletteGroup[]): Array<{ group: string; item: PaletteItem }> {
  return groups.flatMap((g) => g.items.map((item) => ({ group: g.group, item })));
}

const CHEM_ITEMS = flatten(chemistryPaletteGroups);
const MATH_ITEMS = flatten(mathPaletteGroups);
const ALL_ITEMS = [...CHEM_ITEMS, ...MATH_ITEMS];

/** テキストが数式（または化学式）として切り出された LaTeX を返す。 */
function typesetOf(text: string): string[] {
  return splitMathPieces(text).filter((p) => p.kind === 'math').map((p) => p.value);
}

// ===================================================================
// (a)(b) ボタン面（tex）が必ず組版でき、サニタイズ後も残る
// ===================================================================
describe('ボタン面：全ボタンが KaTeX で組める（赤字エラーが出ない）', () => {
  it('tex を持つボタンが十分な数ある（ボタン面の組版化が実際に効いている）', () => {
    const withTex = ALL_ITEMS.filter(({ item }) => item.tex);
    // 記号ボタンは原則すべて組版する。取りこぼしが出たら気づけるように下限を置く。
    expect(withTex.length).toBeGreaterThanOrEqual(ALL_ITEMS.length);
  });

  it.each(ALL_ITEMS.map(({ group, item }) => [group, item.label, item.tex ?? ''] as const))(
    '%s / %s の tex が KaTeX エラーにならない',
    (_group, _label, tex) => {
      const html = renderLatex(tex, { ariaLabel: 'test' });
      expect(html, `tex が空: ${tex}`).not.toBe('');
      // KaTeX は失敗すると katex-error クラスの赤字を返す（throwOnError:false のため）
      expect(html, `KaTeX が組めない: ${tex}`).not.toContain('katex-error');
      // LaTeX コマンドが生のまま漏れていないか（＝組版されずテキスト化されていない）
      expect(html, `\\frac が未処理: ${tex}`).not.toContain('\\frac');
      expect(html, `\\ce が未処理: ${tex}`).not.toContain('\\ce');
      // 二重変換で出る典型的な壊れ方
      expect(html, `\\left が二重: ${tex}`).not.toContain('\\left\\left');
    },
  );

  it.each(ALL_ITEMS.map(({ group, item }) => [group, item.label, item.tex ?? ''] as const))(
    '%s / %s の tex はサニタイズ後も数式が消えない',
    (_group, _label, tex) => {
      const safe = sanitizeInlineHtml(renderLatex(tex, { ariaLabel: 'test' }));
      expect(safe, `サニタイズで数式が消えた: ${tex}`).toContain('katex');
      // 中身（文字や記号）が残っているか。空の span だけになっていないこと。
      expect(safe.replace(/<[^>]*>/g, '').trim().length, `中身が空: ${tex}`).toBeGreaterThan(0);
    },
  );

  it('根号・分数のボタンでは KaTeX の svg/path（縦棒・根号記号）が保持される', () => {
    // サニタイザが svg を落とすと √ の斜線が消えて「ただの角ばった記号」になる。
    const sqrt = mathPaletteGroups.flatMap((g) => g.items).find((i) => i.label === '√(');
    expect(sqrt, '√( のボタンが無い').toBeTruthy();
    const safe = sanitizeInlineHtml(renderLatex(sqrt!.tex!, { ariaLabel: 'root' }));
    expect(safe).toContain('<svg');
    expect(safe).toContain('<path');
  });
});

// ===================================================================
// (f)(g) ★収録の方針★ 打ちにくい記号だけを置く
// ===================================================================
describe('収録の方針：打ちにくい記号だけ（練習を奪わない・探す対象を増やさない）', () => {
  it('★完成した化学式をボタンにしていない（H₂O / CO₂ / NaCl など）★', () => {
    // ご要望「アルファベットとかまでパレット作ったら練習にならない」。
    // 「何と何が結びつくか」を思い出すのが化学の練習そのものなので、
    // 1タップで完成形が入るボタンは置かない。
    const banned = [
      'H₂O', 'CO₂', 'O₂', 'H₂', 'N₂', 'Cl₂', 'NH₃', 'NaCl',
      'CaCO₃', 'H₂SO₄', 'NaOH', 'CH₄', 'HCl', 'CaO',
    ];
    const labels = ALL_ITEMS.map(({ item }) => item.label);
    for (const formula of banned) {
      expect(labels, `${formula} のボタンは練習にならないので置かない`).not.toContain(formula);
    }
  });

  it('★完成したイオンをボタンにしていない（Na⁺ / SO₄²⁻ など）★', () => {
    const banned = ['H⁺', 'OH⁻', 'Na⁺', 'Cl⁻', 'NH₄⁺', 'NO₃⁻', 'SO₄²⁻', 'CO₃²⁻', 'PO₄³⁻', 'Cu²⁺', 'Al³⁺'];
    const labels = ALL_ITEMS.map(({ item }) => item.label);
    for (const ion of banned) {
      expect(labels, `${ion} のボタンは練習にならないので置かない`).not.toContain(ion);
    }
  });

  it('★元素記号・英字・素の数字をボタンにしていない（キーボードで打てる）★', () => {
    for (const { group, item } of ALL_ITEMS) {
      // 単独の英字（x, t, n, C, e）や素の数字（0-9）は1打で入るので置かない。
      expect(item.label, `${group}/${item.label} は普通のキーで打てる`).not.toMatch(
        /^[A-Za-z0-9]$/,
      );
    }
  });

  it('★キーボードに1打である記号をボタンにしていない（+ - = ( ) [ ]）★', () => {
    // これらを置くと「探す対象」が増え、目的の記号が見つけにくくなる。
    const banned = ['+', '-', '=', '(', ')', '[', ']', '*', '.', ','];
    const labels = ALL_ITEMS.map(({ item }) => item.label);
    for (const key of banned) {
      expect(labels, `${key} は普通のキーで打てるので置かない`).not.toContain(key);
    }
  });

  it('★アルファベットで打てる関数名をボタンにしていない（sin / cos / log）★', () => {
    const labels = MATH_ITEMS.map(({ item }) => item.label);
    for (const fn of ['sin', 'cos', 'tan', 'log', 'e^', 'dx', 'dt', '+ C']) {
      expect(labels, `${fn} は英字キーで打てるので置かない`).not.toContain(fn);
    }
    // ただし「打ち方を知らないと書けない雛形」は残す
    expect(labels).toContain('lim');
    expect(labels).toContain('Σ');
  });

  it('収録されているのは「キーに無い記号」か「特殊な記法」だけである', () => {
    // 全ボタンが次のどれかに当てはまること。
    //   ・Unicode の上付き・下付き（₂ ²⁻）… キーに無い
    //   ・キーに無い記号（→ ⇌ ↑ ↓ · π θ ∞ × ≦ ≧ ≠ ∫ Σ √）
    //   ・打ち方を知らないと書けない記法（/ ^ | | ×10 ∫[ ] lim）
    const allowedSpecial = new Set([
      '/', '^', '√(', '| |', '×10', '∫[ ]', 'lim',
    ]);
    const NON_KEYBOARD = /[\u2070-\u209F\u00B2\u00B3\u00B9\u2190-\u21FF\u2200-\u22FF\u0370-\u03FF\u00D7\u00B7\u2266\u2267\u2260]/;
    for (const { group, item } of ALL_ITEMS) {
      const ok = allowedSpecial.has(item.label) || NON_KEYBOARD.test(item.label);
      expect(ok, `${group}/${item.label} は普通のキーで打てるので不要`).toBe(true);
    }
  });

  it('★収録数は1画面に収まる規模（探す時間をゼロにする前提）★', () => {
    // タブを廃して全部出しっぱなしにするため、総数を絞る必要がある。
    expect(CHEM_ITEMS.length, '化学パレットが多すぎる').toBeLessThanOrEqual(36);
    expect(MATH_ITEMS.length, '数学パレットが多すぎる').toBeLessThanOrEqual(24);
    // 空になっていないこと（絞りすぎて使えないのも困る）
    expect(CHEM_ITEMS.length).toBeGreaterThanOrEqual(20);
    expect(MATH_ITEMS.length).toBeGreaterThanOrEqual(12);
  });

  it('打ちにくさの主役（下付き数字・価数）はきちんと揃っている', () => {
    const labels = CHEM_ITEMS.map(({ item }) => item.label);
    // 原子の数 0-9 が全部ある（1つ欠けると入力できない式が出る）
    for (const sub of ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉']) {
      expect(labels, `下付き ${sub} が無い`).toContain(sub);
    }
    // 価数は 1〜3価の ± が揃っている
    for (const charge of ['⁺', '⁻', '²⁺', '²⁻', '³⁺', '³⁻']) {
      expect(labels, `価数 ${charge} が無い`).toContain(charge);
    }
    // 反応式の矢印
    for (const arrow of ['→', '⇌', '↑', '↓']) {
      expect(labels, `${arrow} が無い`).toContain(arrow);
    }
  });
});

// ===================================================================
// (c)(d) 押すと入る文字（value）が本文と同じ組版に載る
// ===================================================================
describe('挿入される値：本文と同じ組版エンジンで正しく組まれる', () => {
  it('value に LaTeX を書いていない（解答欄にそのまま入る文字列である）', () => {
    for (const { group, item } of ALL_ITEMS) {
      expect(item.value, `${group}/${item.label} の value に \\ が混入`).not.toMatch(/\\/);
      expect(item.value, `${group}/${item.label} の value に \\ce{ が混入`).not.toContain('ce{');
      expect(item.value, `${group}/${item.label} の value に $ が混入`).not.toContain('$');
    }
  });

  it('★電荷は「数字→符号」の順（²⁻）＝原子数と誤読させない★', () => {
    // ⁻² の順だと unscript が "^-2" を作り、mhchem の電荷として読めなくなる。
    // また SO₄²⁻ が "SO42-" になると「酸素42個」の意味に化けてしまう。
    for (const { group, item } of CHEM_ITEMS) {
      // 上付き符号のあとに上付き数字が続く並びは禁止
      expect(item.value, `${group}/${item.label} の電荷が符号→数字の順`).not.toMatch(
        /[⁺⁻][⁰¹²³⁴⁵⁶⁷⁸⁹]/,
      );
    }
    // 価数ボタンで組み立てた形が「4個の酸素・2価の陰イオン」として組まれること
    const charge2minus = CHEM_ITEMS.find(({ item }) => item.label === '²⁻')!.item;
    const sub4 = CHEM_ITEMS.find(({ item }) => item.label === '₄')!.item;
    // 生徒の操作：S → O → [₄] → [²⁻]
    const typed = `SO${sub4.value}${charge2minus.value}`;
    expect(typed).toBe('SO₄²⁻');
    expect(typesetOf(typed)[0]).toBe('\\ce{SO4^2-}');
  });

  it('下付きボタンで組み立てた化学式が mhchem（\\ce{…}）として組まれる', () => {
    const sub = (label: string) => CHEM_ITEMS.find(({ item }) => item.label === label)!.item.value;
    // 生徒の操作：H → [₂] → O
    expect(typesetOf(`H${sub('₂')}O`)[0]).toBe('\\ce{H2O}');
    // C → [₆] → H → [₁] → [₂] → O → [₆]
    expect(typesetOf(`C${sub('₆')}H${sub('₁')}${sub('₂')}O${sub('₆')}`)[0]).toBe('\\ce{C6H12O6}');
  });

  it('反応式の記号を挟んで押すと、式全体が1つの \\ce{…} になる', () => {
    // 生徒の操作：Zn → [+キー] → 2HCl → [→ボタン] → ZnCl → [₂] → [+キー] → H → [₂]
    const arrow = CHEM_ITEMS.find(({ item }) => item.label === '→')!.item;
    const sub2 = CHEM_ITEMS.find(({ item }) => item.label === '₂')!.item;
    const typed = `Zn + 2HCl${arrow.value}ZnCl${sub2.value} + H${sub2.value}`;
    const latex = typesetOf(typed);
    expect(latex).toHaveLength(1);
    expect(latex[0]).toBe('\\ce{Zn + 2HCl -> ZnCl2 + H2}');
    // 実際に組めることも確認
    expect(renderLatex(latex[0])).not.toContain('katex-error');
  });

  it('可逆反応（⇌）のボタンも mhchem の平衡矢印として組まれる', () => {
    const eq = CHEM_ITEMS.find(({ item }) => item.label === '⇌')!.item;
    const sub = (l: string) => CHEM_ITEMS.find(({ item }) => item.label === l)!.item.value;
    const typed = `N${sub('₂')} + 3H${sub('₂')}${eq.value}2NH${sub('₃')}`;
    const latex = typesetOf(typed);
    expect(latex).toHaveLength(1);
    expect(latex[0]).toContain('<=>');
    expect(renderLatex(latex[0])).not.toContain('katex-error');
  });

  it('数学の分数・累乗・ルートのボタンは打ち込み記法として組版される', () => {
    // ボタンで作った式（例: x^3/3 + C）が \frac / 指数として組まれること。
    const latex = typesetOf('x^3/3 + C');
    expect(latex.length).toBeGreaterThan(0);
    expect(latex.join(' ')).toContain('\\frac');

    const root = typesetOf('√(x+2)');
    expect(root.join(' '), 'ルートが \\sqrt にならない').toContain('\\sqrt');
  });

  it('定積分・極限・総和のボタンが入れる雛形はそのまま組版できる', () => {
    const items = mathPaletteGroups
      .flatMap((g) => g.items)
      .filter((i) => ['∫[ ]', 'lim', 'Σ'].includes(i.label));
    expect(items).toHaveLength(3);

    // 雛形の中身を埋めた状態で正しく組めること（雛形の記法が engine と一致）
    const filled: Record<string, string> = {
      '∫[ ]': '∫[0→1] x dx',
      lim: 'lim[n→∞] 1/n',
      Σ: 'Σ[k=1→n] k',
    };
    const expected: Record<string, string> = {
      '∫[ ]': '\\int_{0}^{1}',
      lim: '\\lim_{',
      Σ: '\\sum_{',
    };
    for (const item of items) {
      const latex = typesetOf(filled[item.label]).join(' ');
      expect(latex, `${item.label} の雛形が組版されない`).toContain(expected[item.label]);
      expect(renderLatex(latex), `${item.label} が KaTeX エラー`).not.toContain('katex-error');
    }
  });
});

// ===================================================================
// (4) ★半角でも全角でも正解になる★
// ===================================================================
describe('採点：半角でも全角でも、パレットでも手打ちでも正解になる', () => {
  it('上付き・下付きは通常数字として採点される（手打ちと同じ扱い）', () => {
    expect(normalizeAnswer('H₂O')).toBe('H2O');
    expect(normalizeAnswer('SO₄²⁻')).toBe('SO42-');
    expect(normalizeAnswer('Cu²⁺')).toBe('Cu2+');
    expect(normalizeAnswer('NH₄⁺')).toBe('NH4+');
  });

  it('★全角で入力しても半角の正解と一致する★', () => {
    // 日本語 IME は英数字も記号も全角で確定してしまうことが多い。
    expect(normalizeAnswer('Ｈ２Ｏ')).toBe('H2O');
    expect(normalizeAnswer('２．５')).toBe('2.5');
    expect(normalizeAnswer('ｘ＾２')).toBe('x^2');
    expect(normalizeAnswer('１／３')).toBe('1/3');
    expect(normalizeAnswer('ａ＝ｂ')).toBe('a=b');
    expect(normalizeAnswer('Ｃｌ－')).toBe('Cl-');
    expect(normalizeAnswer('（ア）')).toBe('(ア)');
  });

  it('日本語（句読点・長音）は全角半角変換で壊れない', () => {
    // U+3001/3002（、。）と長音「ー」は変換対象外であること。
    expect(normalizeAnswer('ろ過、蒸留')).toBe('ろ過、蒸留');
    expect(normalizeAnswer('ビューレット')).toBe('ビューレット');
    expect(normalizeAnswer('中和です。')).toBe('中和です。');
  });

  it.each([
    // [正解データ, 生徒の入力]
    ['H₂O', 'Ｈ２Ｏ'],
    ['H₂O', 'H2O'],
    ['SO₄²⁻', 'SO42-'],
    ['SO₄²⁻', 'SO4^2-'],
    ['SO₄²⁻', 'ＳＯ４＾２－'],
    ['SO4^2-', 'SO₄²⁻'],
    ['Cu²⁺', 'Cu2+'],
    ['x^2', 'x²'],
    ['x²', 'x^2'],
    ['x²', 'x**2'],
    ['1/3', '1÷3'],
    ['1/3', '１／３'],
    ['x≦3', 'x<=3'],
    ['x≦3', 'x≤3'],
    ['x≧3', 'x>=3'],
    ['x≠3', 'x!=3'],
    ['40 mL', '４０ｍＬ'],
    ['H₂SO₄', 'H2SO4'],
    ['Zn + 2HCl → ZnCl₂ + H₂', 'Zn+2HCl->ZnCl2+H2'],
    ['N₂ + 3H₂ ⇌ 2NH₃', 'N2+3H2<=>2NH3'],
  ])('正解「%s」に対して「%s」も正解になる', (correct, typed) => {
    expect(isAnswerCorrect({ id: 'q', correctAnswer: correct }, typed)).toBe(true);
  });

  it.each([
    // ★緩めすぎ検出★ 別の物質・別の数値が正解になってはいけない
    ['2^3', '23'],
    ['H₂O', 'H₂O₂'],
    ['40 mL', '40 L'],
    ['x^2', 'x^3'],
    ['SO₄²⁻', 'SO₃²⁻'],
    ['1/3', '1/4'],
    ['x≦3', 'x≧3'],
    ['Na⁺', 'Na²⁺'],
  ])('★正解「%s」に対して「%s」は不正解のままである★', (correct, typed) => {
    expect(isAnswerCorrect({ id: 'q', correctAnswer: correct }, typed)).toBe(false);
  });

  it('全ボタンの value が正規化を通しても文字が消えない', () => {
    for (const { group, item } of ALL_ITEMS) {
      const normalized = normalizeAnswer(item.value);
      // 空白のみの value（' → ' など演算子）は正規化でトリムされるため、
      // 「記号そのもの」が残っているかを見る。
      expect(normalized.length, `${group}/${item.label} が正規化で消えた`).toBeGreaterThan(0);
    }
  });
});

// ===================================================================
// (h)(i) 分かりやすさ・押しやすさの UI 契約
// ===================================================================
describe('分かりやすさ：ラベルと説明が全ボタンに揃っている', () => {
  it('すべてのボタンに説明（desc）がある＝読み上げとホバーで意味が分かる', () => {
    for (const { group, item } of ALL_ITEMS) {
      expect(item.desc, `${group}/${item.label} に desc が無い`).toBeTruthy();
      expect(item.desc.length, `${group}/${item.label} の desc が短すぎる`).toBeGreaterThanOrEqual(2);
    }
  });

  it('記号だけでは意味が伝わらないボタンに日本語キャプションが付いている', () => {
    const needCaption = [
      // 数学：打ち込み記号と表示が違うもの
      '/', '^', '√(', '| |', '∫', '∫[ ]', 'lim', 'Σ', 'π', 'θ',
      // 化学：意味が記号から読めないもの
      '↑', '↓', '·', '→', '⇌', '×10',
    ];
    for (const label of needCaption) {
      const item = ALL_ITEMS.find((x) => x.item.label === label)?.item;
      expect(item, `${label} のボタンが見つからない`).toBeTruthy();
      expect(item!.caption, `${label} に caption が無い`).toBeTruthy();
    }
  });

  it('キャプションは短く（スマホのボタン幅で折り返さない長さ）', () => {
    for (const { group, item } of ALL_ITEMS) {
      if (!item.caption) continue;
      expect(item.caption.length, `${group}/${item.label} の caption が長い`).toBeLessThanOrEqual(9);
    }
  });

  it('グループ名に番号が付き、使いどころのヒントがある（探しやすさ）', () => {
    for (const groups of [chemistryPaletteGroups, mathPaletteGroups]) {
      for (const g of groups) {
        expect(g.group, `${g.group} に番号が無い`).toMatch(/^[①-⑨]/);
        // 全部出しっぱなしにするので、見出しの横のヒントが道案内になる
        expect(g.hint, `${g.group} に hint が無い`).toBeTruthy();
      }
    }
  });

  it('★グループ数を少なく保つ（全部出しっぱなしで1画面に収める）★', () => {
    expect(chemistryPaletteGroups.length, '化学のグループが多すぎる').toBeLessThanOrEqual(4);
    expect(mathPaletteGroups.length, '数学のグループが多すぎる').toBeLessThanOrEqual(4);
  });

  it('1グループあたりのボタン数は1〜2行に収まる範囲', () => {
    for (const groups of [chemistryPaletteGroups, mathPaletteGroups]) {
      for (const g of groups) {
        expect(g.items.length, `${g.group} が多すぎる`).toBeLessThanOrEqual(10);
        expect(g.items.length, `${g.group} が空`).toBeGreaterThan(0);
      }
    }
  });

  it('同じグループ内でラベルが重複しない（React key と誤タップ防止）', () => {
    for (const groups of [chemistryPaletteGroups, mathPaletteGroups]) {
      for (const g of groups) {
        const labels = g.items.map((i) => i.label);
        expect(new Set(labels).size, `${g.group} にラベル重複`).toBe(labels.length);
      }
    }
  });
});

describe('押しやすさ：スマホのタップ領域とレイアウト（SymbolPalette.tsx の実装）', () => {
  it('ボタンは 1辺 56px（3.5rem）以上のタップ領域を持つ', () => {
    // Apple/Google の推奨は 44px だが、記号は連続タップするため大きく取る。
    expect(PALETTE).toContain('min-h-[3.5rem]');
  });

  it('ダブルタップ拡大の待ち（約300ms）を消す touch-manipulation が付いている', () => {
    expect(PALETTE).toContain('touch-manipulation');
  });

  it('押した瞬間の見た目の変化（active 状態）がある', () => {
    expect(PALETTE).toMatch(/active:bg-/);
  });

  it('★探す時間をゼロにする：タブも枠内スクロールも作らない★', () => {
    // (a) 高さ固定の枠内スクロール … 目的の記号が隠れる
    expect(PALETTE).not.toContain('max-h-[240px]');
    // (b) カテゴリのタブ切り替え … どのタブか当てる手間が増える
    expect(PALETTE).not.toContain('role="tablist"');
    expect(PALETTE).not.toContain('role="tab"');
    expect(PALETTE).not.toContain('role="tabpanel"');
    // 代わりに全グループを map でそのまま並べる
    expect(PALETTE).toContain('groups.map((grp)');
  });

  it('記号はグリッドで並べ、画面幅に応じて列数を変える', () => {
    expect(PALETTE).toMatch(/grid-cols-4/);
    expect(PALETTE).toMatch(/md:grid-cols-8/);
  });

  it('ボタン面は本文と同じ組版エンジン（renderLatex）で描く', () => {
    expect(PALETTE).toContain("from '../utils/mathTypeset'");
    expect(PALETTE).toContain('renderLatex(item.tex');
    // 生成 HTML は必ずサニタイズを通す
    expect(PALETTE).toContain('sanitizeInlineHtml(renderLatex(');
  });

  it('タップで入力欄のフォーカス（キャレット）を失わない', () => {
    expect(PALETTE).toContain('onMouseDown={(e) => e.preventDefault()}');
  });

  it('caretBack でかっこの内側にキャレットを置ける（閉じ忘れ防止）', () => {
    expect(PALETTE).toContain('caretBack');
    expect(PALETTE).toContain('text.length - back');
    // 雛形ボタンには実際に caretBack が設定されている
    const templates = MATH_ITEMS.filter(({ item }) => (item.caretBack ?? 0) > 0);
    expect(templates.length).toBeGreaterThanOrEqual(4);
  });

  it('パレットの定義は Quiz.tsx から切り出されている（テスト可能にするため）', () => {
    expect(PALETTE).toContain("from '../data/symbolPalettes'");
    expect(PALETTE).not.toContain('const chemistryPaletteGroups');
    expect(PALETTE).not.toContain('const mathPaletteGroups');
    // パレットの描画そのものも Quiz.tsx から出ている（Quiz は「どの設問に出すか」だけ）
    expect(QUIZ).not.toContain('const PaletteButton');
    expect(QUIZ).toContain("from './SymbolPalette'");
  });
});

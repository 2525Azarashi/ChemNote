/**
 * まとめプリントの「印刷 / PDF」機能の回帰テスト
 *
 * ■ なぜソーステキストを直接検査するのか
 *   印刷結果（実際の紙面）は jsdom では再現できない（@media print も
 *   window.print() も評価されない）。そこで「紙面が壊れる原因になる
 *   実装上の抜け」をソースの静的検査で押さえる方針を取る。
 *
 *   具体的に守りたいのは次の3点。
 *     1. 印刷CSSが本当に読み込まれていること（<style> への流し込み）
 *     2. 画面専用UIに lc-no-print が付いていること
 *        → 付け忘れるとヘッダーやタブが全ページに焼き付く
 *     3. <details> の解答が印刷モードで確実に出る／隠れること
 *        → 閉じた <details> は既定で中身が印刷されないため、
 *          display の強制指定が消えると「解答が白紙」になる
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

const printCssSrc = read('src/data/learningContent/printCss.ts');
const barrelSrc = read('src/data/learningContent/index.ts');
const viewerSrc = read('src/components/LearningViewer.tsx');

/**
 * LEARNING_PRINT_CSS のテンプレートリテラル本文のうち、
 * `@media print` に入る前の部分＝画面表示にも効いてしまう範囲。
 * 冒頭のコメントブロックを含めないよう、開始位置をリテラルに合わせる。
 */
const cssBodyStart = printCssSrc.indexOf('LEARNING_PRINT_CSS = `');
const screenScope = printCssSrc.slice(cssBodyStart, printCssSrc.indexOf('@media print', cssBodyStart));

describe('印刷スタイル（printCss.ts）', () => {
  it('A4縦の @page が定義されている', () => {
    expect(printCssSrc).toMatch(/@page\s*\{[^}]*size:\s*A4\s+portrait/);
  });

  it('@page に余白が指定されている（本文が紙端に貼り付かない）', () => {
    expect(printCssSrc).toMatch(/@page\s*\{[^}]*margin:\s*[\d.]+mm/);
  });

  it('印刷モードは「解答つき」「解答を伏せる」の2種類', () => {
    expect(printCssSrc).toContain("answers: 'lc-print-answers'");
    expect(printCssSrc).toContain("blank: 'lc-print-blank'");
  });

  it('画面専用UIを隠すクラスが定義されている', () => {
    expect(printCssSrc).toContain("NO_PRINT_CLASS = 'lc-no-print'");
    expect(printCssSrc).toMatch(/\.\$\{NO_PRINT_CLASS\}[\s\S]{0,80}display:\s*none\s*!important/);
  });

  it('印刷専用要素は画面では非表示・印刷では表示', () => {
    // 画面側（@media print ブロックの外）で display:none
    expect(screenScope).toMatch(/\.\$\{PRINT_ONLY_CLASS\}\s*\{\s*display:\s*none\s*!important/);
    // 印刷側で display:block
    expect(printCssSrc).toMatch(/\.\$\{PRINT_ONLY_CLASS\}\s*\{\s*display:\s*block\s*!important/);
  });

  it('スタイル定義はすべて @media print に閉じており、画面表示を壊さない', () => {
    // 画面側に許すのは「印刷専用要素を隠す」1ルールだけ。
    // ここが増えると、印刷CSSが画面デザインを壊し始める合図。
    // ${...} の補間も波かっこを含むので、数える前に取り除く。
    const withoutInterpolation = screenScope.replace(/\$\{[^}]*\}/g, '_');
    const selectorCount = (withoutInterpolation.match(/\{/g) || []).length;
    expect(selectorCount).toBe(1);
  });

  it('解答つきモードでは閉じた <details> の中身も強制表示する', () => {
    expect(printCssSrc).toMatch(
      /body\.\$\{PRINT_MODE_CLASS\.answers\}[\s\S]{0,120}\.lc-ans > \*:not\(summary\)[\s\S]{0,60}display:\s*revert\s*!important/,
    );
  });

  it('解答を伏せるモードでは中身を隠し、書き込み用の余白を確保する', () => {
    expect(printCssSrc).toMatch(
      /body\.\$\{PRINT_MODE_CLASS\.blank\}[\s\S]{0,120}\.lc-ans > \*:not\(summary\)[\s\S]{0,60}display:\s*none\s*!important/,
    );
    expect(printCssSrc).toMatch(/min-height:\s*\d+mm/);
  });

  it('物質量 補講（.mbs-*）も同じ2モードで印刷できる', () => {
    expect(printCssSrc).toMatch(
      /body\.\$\{PRINT_MODE_CLASS\.answers\}\s+\.mbs-details > \*:not\(summary\)/,
    );
    expect(printCssSrc).toMatch(
      /body\.\$\{PRINT_MODE_CLASS\.blank\}\s+\.mbs-details > \*:not\(summary\)/,
    );
  });

  it('sticky / fixed を通常配置に戻す（全ページへの焼き付き防止）', () => {
    expect(printCssSrc).toMatch(/\.sticky,\s*\.fixed\s*\{\s*position:\s*static\s*!important/);
  });

  it('囲み・表・図は改ページで分断しない', () => {
    expect(printCssSrc).toContain('break-inside: avoid');
    expect(printCssSrc).toContain('page-break-inside: avoid');
  });

  it('表の見出し行は改ページ後も繰り返す', () => {
    expect(printCssSrc).toMatch(/thead\s*\{\s*display:\s*table-header-group/);
  });

  it('見出しがページ末尾で孤立しない', () => {
    expect(printCssSrc).toContain('break-after: avoid-page');
    expect(printCssSrc).toContain('page-break-after: avoid');
  });
});

describe('バレル（learningContent/index.ts）', () => {
  it('印刷用のシンボルを再エクスポートしている', () => {
    for (const name of [
      'LEARNING_PRINT_CSS',
      'PRINT_MODE_CLASS',
      'NO_PRINT_CLASS',
      'PRINT_ONLY_CLASS',
      'PrintMode',
    ]) {
      expect(barrelSrc).toContain(name);
    }
  });
});

describe('LearningViewer の印刷UI', () => {
  it('印刷CSSを <style> で流し込んでいる', () => {
    expect(viewerSrc).toContain('LEARNING_PRINT_CSS');
    expect(viewerSrc).toMatch(/__html:\s*LEARNING_PRINT_CSS/);
  });

  it('2つの印刷モードを呼び出すボタンがある', () => {
    expect(viewerSrc).toContain("handlePrint('answers')");
    expect(viewerSrc).toContain("handlePrint('blank')");
  });

  it('window.print() を呼んでいる（＝ブラウザのPDF保存が使える）', () => {
    expect(viewerSrc).toContain('window.print()');
  });

  it('印刷モードのクラスは印刷後に必ず外す', () => {
    expect(viewerSrc).toMatch(/addEventListener\('afterprint'/);
    expect(viewerSrc).toMatch(/classList\.remove\(modeClass\)/);
    // afterprint が飛ばない環境向けの保険
    expect(viewerSrc).toMatch(/setTimeout\(restore/);
  });

  it('PDFの既定ファイル名になる document.title を差し替え、後で戻す', () => {
    // 科目名（化学基礎 / 化学）は config.label から差し込む
    expect(viewerSrc).toMatch(/document\.title\s*=\s*`\$\{config\.label\}まとめプリント/);
    expect(viewerSrc).toMatch(/document\.title\s*=\s*prevTitle/);
  });

  it('画面専用UI（ヘッダー・タブ・装飾・拡大モーダル）に lc-no-print が付いている', () => {
    // NO_PRINT_CLASS を使っている箇所の数で担保する
    const hits = viewerSrc.match(/\$\{NO_PRINT_CLASS\}/g) || [];
    expect(hits.length).toBeGreaterThanOrEqual(6);
  });

  it('本文の折り返し幅は印刷時に解除できるよう learning-print-area を付けている', () => {
    expect(viewerSrc).toContain('learning-print-area');
  });

  it('印刷専用の紙ヘッダー（タイトル・名前・日付）を持つ', () => {
    expect(viewerSrc).toContain('lc-print-head');
    expect(viewerSrc).toContain('lc-print-only');
    expect(viewerSrc).toContain('lc-print-field');
    expect(viewerSrc).toContain('名前：');
    expect(viewerSrc).toContain('日付：');
  });

  it('化学基礎の全タブ分の印刷タイトルが用意されている', () => {
    const ids = ['toc', "'1-1'", "'1-2'", "'1-3'", "'2-1'", "'2-2'", "'2-3'"];
    const block = viewerSrc.slice(
      viewerSrc.indexOf('const BASIC_PRINT_TITLE'),
      viewerSrc.indexOf('const ADVANCED_PRINT_TITLE'),
    );
    expect(block).not.toBe('');
    for (const id of ids) expect(block).toContain(id.replace(/'/g, ''));
    expect(block).toContain('MOL_BASICS_TAB_ID');
  });
});

/* ==================================================================
 * 科目切り替え（化学基礎 / 化学）
 *
 * ※ 「化学の方にそもそもインプットのボタンがない」という報告を受けて追加。
 *   ・化学でも「学習(インプット)」を押せること
 *   ・押したときに化学用の本文（熱化学）が出ること
 * をソース上で保証する。
 * ================================================================== */
describe('まとめプリントの科目切り替え', () => {
  const modeSrc = read('src/components/ModeSelection.tsx');
  const appSrc = read('src/App.tsx');

  it('★ 化学（発展）でも「学習(インプット)」ボタンを隠さない', () => {
    // 以前は {!isAdvanced && ( でボタンごと消していた。
    // learning を呼ぶボタンが isAdvanced で囲われていないことを見る。
    const at = modeSrc.indexOf("onSelectMode('learning')");
    expect(at).toBeGreaterThan(0);
    const before = modeSrc.slice(Math.max(0, at - 400), at);
    expect(before).not.toMatch(/\{!isAdvanced && \(\s*$/);
  });

  it('★ App から LearningViewer へ subject を渡している', () => {
    const at = appSrc.indexOf('<LearningViewer');
    expect(at).toBeGreaterThan(0);
    expect(appSrc.slice(at, at + 300)).toContain('subject=');
  });

  it('★ 科目ごとの本文マップが両方定義されている', () => {
    expect(viewerSrc).toContain('BASIC_SECTION_HTML');
    expect(viewerSrc).toContain('ADVANCED_SECTION_HTML');
    expect(viewerSrc).toContain('ADV_THERMO_HTML');
  });

  it('★ 化学のタブに熱化学の章が入っている', () => {
    const block = viewerSrc.slice(
      viewerSrc.indexOf('const ADVANCED_SECTIONS'),
      viewerSrc.indexOf('const BASIC_SECTION_HTML'),
    );
    expect(block).toContain("'adv-3'");
    expect(block).toContain('化学反応とエネルギー');
  });

  it('★ 科目名はハードコードせず config.label を使う', () => {
    // 画面ヘッダー・印刷ヘッダー・目次見出しの3か所
    const hits = viewerSrc.match(/\{config\.label\} まとめプリント/g) || [];
    expect(hits.length).toBeGreaterThanOrEqual(3);
  });

  it('★ その科目に無いタブIDは目次へ落とす（空白画面を出さない）', () => {
    // 化学基礎の '2-1' を開いたまま化学へ切り替えると、
    // ADVANCED_SECTION_HTML に該当キーが無いため本文も目次も描かれない。
    // 初期値と、科目が変わったときの両方でガードしている。
    expect(viewerSrc).toMatch(/SECTIONS\.some\(s => s\.id === requestedTab\)/);
    expect(viewerSrc).toMatch(/if \(!SECTIONS\.some\(s => s\.id === activeTab\)\) setActiveTab\('toc'\)/);
  });

  it('★ 化学（発展）の章にも印刷タイトルと部の見出しがある', () => {
    // 印刷ヘッダーが空欄のまま出力されると配布プリントとして成立しない
    const title = viewerSrc.slice(
      viewerSrc.indexOf('const ADVANCED_PRINT_TITLE'),
      viewerSrc.indexOf('const BASIC_PART_LABEL'),
    );
    expect(title).toContain("'adv-3'");
    const part = viewerSrc.slice(
      viewerSrc.indexOf('const ADVANCED_PART_LABEL'),
      viewerSrc.indexOf('const SUBJECT_CONFIG'),
    );
    expect(part).toContain("'adv-3'");
  });
});

/* ==================================================================
 * 強調表記（語句＝太字＋太い下線 / 文章＝太字＋太い波線・いずれも黒）
 *
 * ■ 背景
 *   まとめプリントを印刷したとき「強調しているはずの箇所が
 *   強調に見えない」不具合が出ていた。原因は3つ。
 *     ① 印刷CSSに color / text-decoration-color の指定が無く、
 *        下線の色が親要素の色を継承して薄く見えていた
 *     ② 印刷時に波線（wavy）を点線（dotted）へ置き換えていたため
 *        「語句」と「文章」の区別が消えていた
 *     ③ 線が 1pt しかなく A4 の縮尺では本文の罫線と見分けが付かない
 *   さらに <strong> で包まれていない裸の <u> には
 *   `strong u` のルールが一切当たっていなかった。
 *
 * ■ ここで守る規則
 *   語句   … <strong><u>…</u></strong>              → 太字＋太い直線・黒
 *   文章   … <strong><u class="wavy">…</u></strong>  → 太字＋太い波線・黒
 *   下線部 … <u class="q">…</u>                      → 問題文の指示対象。
 *            “強調”ではないので太字にしない（細線のみ）
 * ================================================================== */
const SECTION_FILES = [
  'section_1_1',
  'section_1_2',
  'section_1_3',
  'section_2_1',
  'section_2_2',
  'section_2_3',
  // 化学（発展）のまとめプリントも、同じ強調ルール・同じSVGスコープ規則で検査する
  'adv_thermo',
] as const;

const globalCssSrc = read('src/data/learningContent/globalCss.ts');

/**
 * 原稿ファイルから「本文（テンプレートリテラルの中身）」だけを取り出す。
 *
 * ファイル先頭の説明コメントには記法の見本として `<u>` や `<strong>` を
 * そのまま書いている（後から章を足す人が読むための仕様書）。
 * これをマークアップ検査に混ぜると
 *   ・裸の <u> がある
 *   ・開閉タグ数が合わない
 * という誤検知になるため、`export const … = \`` 以降〜末尾のバッククォート
 * までに範囲を絞る。検査したいのは実際に描画される HTML だけ。
 */
const sectionBody = (src: string): string => {
  const at = src.indexOf('_HTML = `');
  if (at < 0) return src;
  const from = at + '_HTML = `'.length;
  const to = src.lastIndexOf('`');
  return to > from ? src.slice(from, to) : src.slice(from);
};

const sectionSrcs = new Map(
  SECTION_FILES.map(
    (f) => [f, sectionBody(read(`src/data/learningContent/${f}.ts`))] as const,
  ),
);

/** `text-decoration-*` などを含むCSSブロックを取り出す */
const cssBlock = (css: string, selector: string): string => {
  const at = css.indexOf(selector);
  if (at < 0) return '';
  const open = css.indexOf('{', at);
  const close = css.indexOf('}', open);
  return open < 0 || close < 0 ? '' : css.slice(open, close);
};

describe.each([
  ['画面表示（globalCss.ts）', () => globalCssSrc, '3px'],
  ['印刷（printCss.ts）', () => printCssSrc, '1.6pt'],
])('強調表記の規則 — %s', (_label, getSrc, thickness) => {
  const src = getSrc();

  it('語句の強調は「太い直線」で描かれる', () => {
    const block = cssBlock(src, '.learning-content strong u:not(.wavy)');
    expect(block).toContain('text-decoration-style: solid !important');
    expect(block).toContain(`text-decoration-thickness: ${thickness} !important`);
  });

  it('文章の強調は「太い波線」で描かれる（dotted へ化けていない）', () => {
    const block = cssBlock(src, '.learning-content u.wavy');
    expect(block).toContain('text-decoration-style: wavy !important');
    expect(block).toContain(`text-decoration-thickness: ${thickness} !important`);
    expect(block).not.toContain('dotted');
  });

  it('強調の文字色と下線色を黒に固定している（親の色を継承しない）', () => {
    const block = cssBlock(src, '.learning-content u:not(.q)');
    expect(block).toContain('color: #000 !important');
    expect(block).toContain('text-decoration-color: #000 !important');
    expect(block).toContain('font-weight: 900 !important');
  });

  it('<strong> の無い裸の <u> にもルールが当たる（u 側に直接指定）', () => {
    // `strong u` だけに頼ると <strong> を書き忘れた箇所で強調が消える
    expect(src).toContain('.learning-content u:not(.q)');
    expect(src).toContain('.learning-content u:not(.wavy):not(.q)');
    expect(src).toContain('.learning-content u.wavy');
  });

  it('問題文の「下線部」（u.q）は強調と区別され、太字にならない', () => {
    const block = cssBlock(src, '.learning-content u.q');
    expect(block).toContain('text-decoration-style: solid !important');
    // 語句の強調と同じ太さになってしまうと区別が付かない
    expect(block).not.toContain(`text-decoration-thickness: ${thickness}`);
    expect(block).toMatch(/font-weight:\s*(inherit|normal)\s*!important/);
  });
});

describe('本文の強調マークアップ', () => {
  it.each(SECTION_FILES)('%s: すべての <u> が「強調」か「下線部」のどちらかに分類されている', (file) => {
    const src = sectionSrcs.get(file)!;
    const stray: string[] = [];
    const re = /<u(\s[^>]*)?>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
      const attrs = m[1] ?? '';
      // 問題文の下線部は class="q" で明示する
      if (/class="[^"]*\bq\b[^"]*"/.test(attrs)) continue;
      // 強調は必ず <strong> の直下に置く
      const before = src.slice(Math.max(0, m.index - 20), m.index);
      if (/<strong>\s*$/.test(before)) continue;
      stray.push(src.slice(m.index, m.index + 60));
    }
    expect(stray).toEqual([]);
  });

  it.each(SECTION_FILES)('%s: <strong> の開閉タグ数が一致している', (file) => {
    const src = sectionSrcs.get(file)!;
    const open = (src.match(/<strong>/g) ?? []).length;
    const close = (src.match(/<\/strong>/g) ?? []).length;
    expect(close).toBe(open);
  });

  it.each(SECTION_FILES)('%s: <u> の開閉タグ数が一致している', (file) => {
    const src = sectionSrcs.get(file)!;
    const open = (src.match(/<u(\s[^>]*)?>/g) ?? []).length;
    const close = (src.match(/<\/u>/g) ?? []).length;
    expect(close).toBe(open);
  });

  it('語句・文章の両方の強調が実際に使われている', () => {
    let term = 0;
    let sentence = 0;
    for (const src of sectionSrcs.values()) {
      term += (src.match(/<strong><u>/g) ?? []).length;
      sentence += (src.match(/<strong><u class="wavy">/g) ?? []).length;
    }
    expect(term).toBeGreaterThan(100);
    expect(sentence).toBeGreaterThan(0);
  });
});

/* ==================================================================
 * 図（インラインSVG）のCSS名前空間
 *
 * ■ 背景
 *   インラインSVGの中に書いた <style> は SVG 内に閉じず、
 *   ドキュメント全体のCSSに漏れる。そのため複数の図が
 *   同じ短いクラス名（.t / .l / .s など）を使っていると、
 *   後ろに書かれた図の定義が前の図を上書きしてしまう。
 *
 *   実際に「半反応式の作り方」の図では
 *     .t  … 後の図の定義（青文字）が勝ち → 青地に青文字で見えない
 *     .l  … 後の図の text-anchor:middle が勝ち
 *           → 左寄せラベルが中央寄せになり STEP バッジに重なる
 *   という崩れが起きていた。
 *
 * ■ ここで守る規則
 *   図ごとに `lcfig-<節>-<連番>` のクラスを付け、<style> の
 *   セレクタは必ずそのクラス配下に書く（他の図に影響させない）。
 * ================================================================== */
describe('インラインSVGのスタイルはスコープされている', () => {
  type Fig = { file: string; scope: string; selectors: string[] };
  const figures: Fig[] = [];

  for (const [file, src] of sectionSrcs) {
    const re = /<svg\b([^>]*)>([\s\S]*?)<\/svg>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
      const styleMatch = /<style>([\s\S]*?)<\/style>/.exec(m[2]);
      if (!styleMatch) continue;
      // スコープ名は節番号（lcfig-2-3-1）だけでなく、
      // 化学（発展）のように英字を含む形（lcfig-adv-thermo-1）も許す。
      const scope = /class="[^"]*\b(lcfig-[a-z0-9-]*[0-9])\b/.exec(m[1])?.[1] ?? '';
      const selectors = [...styleMatch[1].matchAll(/^\s*([^{\n]+?)\s*\{/gm)].map((s) => s[1]);
      figures.push({ file, scope, selectors });
    }
  }

  it('インラインSVGの <style> が検出できている', () => {
    expect(figures.length).toBeGreaterThanOrEqual(10);
  });

  it('<style> を持つ図はすべて lcfig-* のスコープクラスを持つ', () => {
    expect(figures.filter((f) => !f.scope).map((f) => f.file)).toEqual([]);
  });

  it('スコープクラスは図ごとに一意', () => {
    const scopes = figures.map((f) => f.scope);
    expect(new Set(scopes).size).toBe(scopes.length);
  });

  it('すべてのセレクタが自分のスコープクラス配下に書かれている', () => {
    const leaks: string[] = [];
    for (const fig of figures) {
      for (const sel of fig.selectors) {
        if (!sel.includes(`.${fig.scope} `)) leaks.push(`${fig.file}: ${sel}`);
      }
    }
    expect(leaks).toEqual([]);
  });
});

describe('印刷時の図の扱い（printCss.ts）', () => {
  it('インラインSVGも用紙幅に収まるよう縮小される', () => {
    const block = cssBlock(printCssSrc, '.learning-content svg');
    expect(block).toContain('max-width: 100%');
    expect(block).toContain('height: auto');
  });

  it('画面用の「タップで拡大」ヒントは印刷されない', () => {
    expect(printCssSrc).toMatch(/\.figzoom-hint\s*\{\s*display:\s*none\s*!important/);
  });
});

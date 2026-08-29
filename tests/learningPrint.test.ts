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
import { readCode } from './helpers/sourceScan';

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
  /*
   * ★ここでは readCode（コメントを除いた実コード）を使う★
   *
   * 理由は実際に起きた事故である。
   * App.tsx に遅延読み込みの理由を書いたとき、その説明文の中に
   *
   *     元のコードは {appState === 'learning' && <LearningViewer … />} で…
   *
   * という一行を含めた。すると下の indexOf('<LearningViewer') が
   * ★本物の JSX ではなく、その説明文に先に当たって★ テストが落ちた。
   * アプリは正しく動いていた（実機確認済み）。壊れていたのは見張り役のほうだった。
   *
   * コメントの文言を変えて緑にするのは症状隠しであり、
   * 同じ罠が別のファイルで必ず再発する。
   * そこで「コンパイラが見ているコードだけを見る」形に直した。
   * 詳細は tests/helpers/sourceScan.ts の冒頭コメント。
   */
  const modeSrc = readCode('src/components/ModeSelection.tsx');
  const appSrc = readCode('src/App.tsx');

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

  it('★ 化学のタブに電池と電気分解の章が入っている', () => {
    const block = viewerSrc.slice(
      viewerSrc.indexOf('const ADVANCED_SECTIONS'),
      viewerSrc.indexOf('const BASIC_SECTION_HTML'),
    );
    expect(block).toContain("'adv-4'");
    expect(block).toContain('電池と電気分解');
    // 本文・パート・印刷タイトル・部見出しの4つの対応表すべてに登録されている
    for (const table of [
      'ADVANCED_SECTION_HTML',
      'SECTION_PARTS',
      'ADVANCED_PRINT_TITLE',
      'ADVANCED_PART_LABEL',
    ]) {
      const at = viewerSrc.indexOf(`const ${table}`);
      expect(at).toBeGreaterThan(0);
      expect(viewerSrc.slice(at, viewerSrc.indexOf('};', at))).toContain("'adv-4'");
    }
  });

  it('★ 目次から4章を開けるボタンがあり、「準備中」の一覧から外れている', () => {
    expect(viewerSrc).toContain("setActiveTab('adv-4')");
    const at = viewerSrc.indexOf('ほかの章（');
    expect(at).toBeGreaterThan(0);
    expect(viewerSrc.slice(at, at + 120)).not.toContain('電池と電気分解');
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
 * 「重要事項ごとに見る」ボタン（熱化学）
 *
 * ■ 背景
 *   熱化学の章が1本の長いHTMLで、
 *     ・内容が省略されていて足りない
 *     ・同じ熱化学でも重要事項ごとに切り替えて見たい
 *   という要望を受けて ADV_THERMO_PARTS に分割した。
 *   ここでは「分割データが壊れていないこと」と
 *   「従来の通し表示・印刷が生きていること」を守る。
 * ================================================================== */
describe('熱化学の重要事項ごとの分割（ADV_THERMO_PARTS）', () => {
  const advSrc = read('src/data/learningContent/adv_thermo.ts');

  it('重要事項の配列をエクスポートし、バレルからも出している', () => {
    expect(advSrc).toContain('export const ADV_THERMO_PARTS');
    expect(barrelSrc).toContain('ADV_THERMO_PARTS');
    expect(barrelSrc).toContain('LearningPart');
  });

  it('★ 通し表示用の ADV_THERMO_HTML は全パートの連結で作る（本文の二重管理を防ぐ）', () => {
    expect(advSrc).toMatch(
      /export const ADV_THERMO_HTML\s*=\s*ADV_THERMO_PARTS\.map\(p => p\.html\)\.join/,
    );
  });

  it('★ 重要事項①〜⑦がすべて揃っている（配布プリントの実物どおり）', () => {
    // 配布プリントの重要事項は①〜⑦。
    // ⑧はアプリ側で勝手に作っていた番号だったので、実物に合わせて廃止した。
    for (const no of ['①', '②', '③', '④', '⑤', '⑥', '⑦']) {
      expect(advSrc).toContain(`重要事項${no}`);
    }
    // プリントには重要事項のほかに「定期テスト・入試に出やすいこと⓵」がある
    expect(advSrc).toContain('定期テスト・入試に出やすいこと①');
    // ゴール・総まとめを含めて14ブロック
    const ids = advSrc.match(/^\s*\{ id: '[a-z0-9]+', no:/gm) ?? [];
    expect(ids.length).toBe(14);
  });

  it('★ プリントのコラム❶〜❺と演習1〜20が省略されずに入っている', () => {
    for (const kw of ['コラム❶', 'コラム❷', 'コラム❸', 'コラム❹', 'コラム❺', '深堀りコラム']) {
      expect(advSrc).toContain(kw);
    }
    for (let i = 1; i <= 20; i += 1) {
      expect(advSrc).toContain(`演習${i} `);
    }
  });

  it('★ 実物プリント特有の重要語がそろっている（エントロピー・光の節）', () => {
    for (const kw of [
      'ΔG ＝ ΔH − TΔS',
      'エントロピー増大の法則',
      'ギブスエネルギー',
      '光電極',
      'ルシフェリン',
      'ルシフェラーゼ',
      'オキシルシフェリン',
      'ケミカルライト',
      'ルミノール',
      '光化学反応',
    ]) {
      expect(advSrc).toContain(kw);
    }
  });

  it('★ 各パートは id / no / title / short / html をすべて持つ', () => {
    const block = advSrc.slice(
      advSrc.indexOf('export const ADV_THERMO_PARTS'),
      advSrc.indexOf('export const ADV_THERMO_HTML'),
    );
    const rows = block.match(/\{ id: [\s\S]*?\},/g) ?? [];
    expect(rows.length).toBeGreaterThanOrEqual(10);
    for (const row of rows) {
      for (const key of ['id:', 'no:', 'title:', 'short:', 'html:']) {
        expect(row).toContain(key);
      }
    }
  });

  it('★ 省略されていた重要事項（熱量測定・分解/状態変化・弱酸の中和）が入っている', () => {
    // 「内容を省略しないで入れてほしい」という要望に対する回帰テスト。
    // まとめプリントに載っていて、以前の版に無かった項目を名指しで押さえる。
    for (const kw of [
      'Q ［J］ ＝ m ［g］ × c ［J/(g・K)］ × Δt ［K］', // 熱量の基本式
      '比熱',
      '熱容量',
      '外挿',
      '分解エンタルピー',
      '融解エンタルピー',
      '蒸発エンタルピー',
      '昇華エンタルピー',
      '弱酸',
      '結合エンタルピー',
      '光触媒',
      '化学発光',
    ]) {
      expect(advSrc).toContain(kw);
    }
  });

  it('★ 例題は分割前より増えている（薄いままの節が残っていない）', () => {
    const examples = advSrc.match(/box box-example/g) ?? [];
    expect(examples.length).toBeGreaterThanOrEqual(14);
  });
});

/* ==================================================================
 * 「重要事項ごとに見る」ボタン（4章 電池と電気分解）
 *
 * ■ 背景
 *   熱化学（3章）と完全に同じ構造・同じ記法で書く、という取り決めで
 *   adv_electro.ts を追加した。3章と同じ観点で
 *     ・分割データが壊れていないこと
 *     ・原典の演習1〜15が省略されていないこと
 *     ・原典の誤植を正しい形に直したままであること
 *   を守る。
 * ================================================================== */
describe('電池と電気分解の重要事項ごとの分割（ADV_ELECTRO_PARTS）', () => {
  const advSrc = read('src/data/learningContent/adv_electro.ts');

  it('重要事項の配列をエクスポートし、バレルからも出している', () => {
    expect(advSrc).toContain('export const ADV_ELECTRO_PARTS');
    expect(barrelSrc).toContain('ADV_ELECTRO_PARTS');
    expect(barrelSrc).toContain('ADV_ELECTRO_HTML');
  });

  it('★ 通し表示用の ADV_ELECTRO_HTML は全パートの連結で作る（本文の二重管理を防ぐ）', () => {
    expect(advSrc).toMatch(
      /export const ADV_ELECTRO_HTML\s*=\s*ADV_ELECTRO_PARTS\.map\(p => p\.html\)\.join/,
    );
  });

  it('★ 重要事項①〜④と「出やすいこと①②」がすべて揃っている', () => {
    for (const no of ['①', '②', '③', '④']) {
      expect(advSrc).toContain(`重要事項${no}`);
    }
    expect(advSrc).toContain('定期テスト・入試に出やすいこと①');
    expect(advSrc).toContain('定期テスト・入試に出やすいこと②');
  });

  it('★ 演習1〜15が省略されずに入っている', () => {
    for (let i = 1; i <= 15; i += 1) {
      expect(advSrc).toContain(`演習${i} `);
    }
  });

  it('★ 各パートは id / no / title / short / html をすべて持つ', () => {
    const block = advSrc.slice(
      advSrc.indexOf('export const ADV_ELECTRO_PARTS'),
      advSrc.indexOf('export const ADV_ELECTRO_HTML'),
    );
    const rows = block.match(/\{ id: [\s\S]*?\},/g) ?? [];
    expect(rows.length).toBeGreaterThanOrEqual(12);
    for (const row of rows) {
      for (const key of ['id:', 'no:', 'title:', 'short:', 'html:']) {
        expect(row).toContain(key);
      }
    }
    // 参照している定数がすべて実際に定義されている（未定義参照でビルドが落ちない）
    for (const m of block.matchAll(/html:\s*([A-Z_0-9]+)\s*\}/g)) {
      expect(advSrc).toContain(`const ${m[1]} = \``);
    }
  });

  it('★ この章の必修キーワードがそろっている', () => {
    for (const kw of [
      'イオン化傾向',
      'ボルタ電池',
      'ダニエル電池',
      '燃料電池',
      '鉛蓄電池',
      'ファラデー',
      '一次電池',
      '二次電池',
      '過電圧',
      'イオン交換膜法',
      '電解精錬',
      '陽極泥',
      '溶融塩電解',
      '氷晶石',
      'ボーキサイト',
      '電流効率',
    ]) {
      expect(advSrc).toContain(kw);
    }
  });

  it('★ 原典の誤植を化学的に正しい形へ直したまま保つ', () => {
    // 燃料電池の全体式は 2H2 + O2 → 2H2O（原典は 2H2 + O2 → H2O）
    expect(advSrc).not.toMatch(/2H<sub>2<\/sub> ＋ O<sub>2<\/sub> → H<sub>2<\/sub>O(?!<)/);
    // 鉛蓄電池の電解液は硫酸 H2SO4（原典は H2PO4）
    expect(advSrc).not.toContain('H<sub>2</sub>PO<sub>4</sub>');
    // 演習15(ⅱ) の答えは 1.20 kg（原典は 1.20 g）
    expect(advSrc).toContain('1.20 kg');
  });

  it('★ 電池と電気分解の用語を混同させない対比表がある', () => {
    expect(advSrc).toContain('負極');
    expect(advSrc).toContain('正極');
    expect(advSrc).toContain('陰極');
    expect(advSrc).toContain('陽極');
    expect(advSrc).toContain('この単元の総まとめ');
  });

  it('★ 例題（演習）が薄くなっていない', () => {
    const examples = advSrc.match(/box box-example/g) ?? [];
    expect(examples.length).toBeGreaterThanOrEqual(10);
  });
});

describe('LearningViewer の「重要事項ごとに見る」UI', () => {
  it('★ パート分割データを読み込み、章ごとの対応表を持つ', () => {
    expect(viewerSrc).toContain('ADV_THERMO_PARTS');
    expect(viewerSrc).toContain('ADV_ELECTRO_PARTS');
    expect(viewerSrc).toContain('SECTION_PARTS');
    expect(viewerSrc).toContain("ALL_PARTS_ID");
  });

  it('★ 「すべて通して読む」と各重要事項のボタンを出す', () => {
    expect(viewerSrc).toContain('重要事項ごとに見る');
    expect(viewerSrc).toContain('すべて通して読む');
    expect(viewerSrc).toMatch(/parts\.map\(part =>/);
    expect(viewerSrc).toMatch(/onClick=\{\(\) => selectPart\(part\.id\)\}/);
  });

  it('★ 選択中のパートだけを描画する（未選択なら章まるごと）', () => {
    expect(viewerSrc).toMatch(/currentPart \? currentPart\.html : fullSectionHtml/);
  });

  it('★ パートを切り替えたら本文を作り直す（key に含める）', () => {
    expect(viewerSrc).toMatch(/key=\{`\$\{activeTab\}:\$\{activePart\}/);
  });

  it('★ タブを移ったら「すべて」に戻す（前の章の①が残らない）', () => {
    expect(viewerSrc).toMatch(/setActivePart\(ALL_PARTS_ID\)/);
  });

  it('★ 前へ / 次へで重要事項を読み進められる', () => {
    expect(viewerSrc).toContain('前の重要事項');
    expect(viewerSrc).toContain('次の重要事項');
    expect(viewerSrc).toContain('prevPart');
    expect(viewerSrc).toContain('nextPart');
  });

  it('★ 絞り込み中は印刷タイトル・紙のヘッダーにも重要事項名を入れる', () => {
    expect(viewerSrc).toMatch(/currentPart \? `_\$\{currentPart\.no\}\$\{currentPart\.title\}`/);
    expect(viewerSrc).toMatch(/currentPart \? `　\$\{currentPart\.no\}\$\{currentPart\.title\}`/);
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
  'adv_electro',
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

/**
 * ===================================================================
 * 学習ページの図のズームを廃止した（ご要望「ズームはいらない」）
 * ===================================================================
 *
 * ■ 経緯
 *   演習画面（QuestionFigure）のズームは先に廃止したが、学習ページには
 *   別実装のライトボックス（LearningViewer 内の全画面表示）が残っていた。
 *   同じご要望の範囲なので、こちらも削除した。
 *
 * ■ 「消したら図が小さくならないか」を先に確認している
 *   .figrow-fig img / .figfull img はいずれも
 *     width: 100%; max-width: 100% !important;
 *   なので、拡大表示に頼らず最初から列の幅いっぱいで表示される。
 *   つまりズームを消しても図の表示サイズは変わらない。
 *
 * ■ 「タップで拡大できます」の案内について
 *   本文データ側に14箇所埋まっている。文章を機械的に削ると前後の句読点や
 *   <br> の位置が問題によって不自然になり得るため、CSS で非表示にしている。
 *   ズームが無いのに案内だけ出る、という嘘の表示を防ぐのが目的。
 */
describe('学習ページの図のズームを廃止（ご要望）', () => {
  const viewerSrc = read('src/components/LearningViewer.tsx');
  /** 自分が書いた説明コメントに引っかからないよう、コメントを外して調べる */
  const viewerCode = viewerSrc
    .replace(/\/\*[\s\S]*?\*\//gu, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/gu, '')
    .replace(/\/\/[^\n]*/gu, '');

  it('拡大表示の state / ハンドラが残っていない', () => {
    expect(viewerCode).not.toContain('zoomFig');
    expect(viewerCode).not.toContain('setZoomFig');
    expect(viewerCode).not.toContain('handleContentClick');
  });

  it('全画面ダイアログ（ライトボックス）が残っていない', () => {
    expect(viewerCode).not.toContain('図の拡大表示');
    expect(viewerCode).not.toContain('ピンチ操作でさらに拡大');
    expect(viewerCode).not.toMatch(/aria-modal/u);
  });

  it('図にズーム用のカーソルが付かない', () => {
    expect(globalCssSrc).not.toContain('cursor: zoom-in');
  });

  it('「タップで拡大できます」の案内は画面に出ない', () => {
    // セレクタは残す（本文データに文言が残っているため）が、非表示にする
    expect(globalCssSrc).toMatch(/\.figzoom-hint\s*\{[^}]*display:\s*none/u);
  });

  it('図は列の幅いっぱいのまま（ズームを消しても小さくならない）', () => {
    for (const selector of ['.learning-content .figrow-fig img', '.learning-content .figfull img']) {
      const block = cssBlock(globalCssSrc, selector);
      expect(block, selector).toContain('width: 100%');
      expect(block, selector).toContain('max-width: 100% !important');
    }
  });
});

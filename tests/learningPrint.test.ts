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
    expect(viewerSrc).toMatch(/document\.title\s*=\s*`化学基礎まとめプリント/);
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

  it('全タブ分の印刷タイトルが用意されている', () => {
    const ids = ['toc', "'1-1'", "'1-2'", "'1-3'", "'2-1'", "'2-2'", "'2-3'"];
    const block = viewerSrc.slice(
      viewerSrc.indexOf('SECTION_PRINT_TITLE'),
      viewerSrc.indexOf('const SECTION_PART_LABEL'),
    );
    for (const id of ids) expect(block).toContain(id.replace(/'/g, ''));
    expect(block).toContain('MOL_BASICS_TAB_ID');
  });
});

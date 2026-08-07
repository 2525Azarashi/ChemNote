/**
 * 学習セクションの HTML を、実アプリと同じ CSS で静的プレビューする。
 * public/_section_preview.html を書き出して、PC 幅とスマホ幅(390px)の両方を確認する。
 *   node scripts/figures/preview_sections.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const SRC = path.join(ROOT, 'src/data/learningContent');

/** TS ファイルからテンプレートリテラルの中身だけ抜き出す（雑だがプレビュー用途には十分） */
function extractHtml(file) {
  const s = fs.readFileSync(path.join(SRC, file), 'utf-8');
  const i = s.indexOf('`');
  const j = s.lastIndexOf('`');
  if (i < 0 || j <= i) throw new Error('template literal not found: ' + file);
  return s.slice(i + 1, j);
}

const css = extractHtml('globalCss.ts');
const sections = ['section_1_1.ts', 'section_1_2.ts', 'section_1_3.ts', 'section_2_2.ts', 'section_2_3.ts'];

const body = sections
  .map((f) => `<h1 style="font:900 22px sans-serif;color:#5b21b6;margin:40px 0 8px;">${f}</h1>
<article class="learning-content">${extractHtml(f)}</article>`)
  .join('\n');

const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>section preview</title>
<style>body{margin:0;background:#FDFBF7;font-family:system-ui,'Noto Sans JP',sans-serif;}
.wrap{max-width:896px;margin:0 auto;padding:16px;}</style>
<style>${css}</style>
</head><body><div class="wrap">${body}</div></body></html>`;

const out = path.join(ROOT, 'public/_section_preview.html');
fs.writeFileSync(out, html, 'utf-8');
console.log('wrote', out, (html.length / 1024).toFixed(1) + ' KB');

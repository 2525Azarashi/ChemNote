/**
 * 生成した SVG をブラウザで一覧表示するためのプレビュー HTML を作る。
 *
 *   node scripts/figures/build.mjs && node scripts/figures/preview.mjs
 *   → public/learning_figures/_preview.html
 *
 * サンドボックスの静的サーバーで開くと、全図版を実寸とスマホ幅（375px）で
 * 並べて確認できる。図の作り込みの確認用で、アプリからは参照しない。
 */
import { readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(HERE, '../../public/learning_figures');

const files = (await readdir(DIR)).filter((f) => f.endsWith('.svg')).sort();

const body = files
  .map(
    (f) => `<section>
  <h2>${f}</h2>
  <div class="row">
    <div class="col"><p class="cap">実寸（横幅いっぱい）</p><img src="./${f}" class="full"></div>
    <div class="col narrow"><p class="cap">スマホ幅 375px</p><img src="./${f}" class="sp"></div>
  </div>
</section>`
  )
  .join('\n');

const html = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>learning_figures プレビュー</title>
<style>
  body{margin:0;padding:24px;background:#f6f3fb;font-family:'Hiragino Sans','Noto Sans JP',sans-serif;color:#2f2740;}
  h1{font-size:20px;}
  section{background:#fff;border:1px solid #c9bce6;border-radius:12px;padding:16px;margin:0 0 24px;}
  h2{font-size:14px;margin:0 0 12px;color:#5b21b6;font-family:monospace;}
  .row{display:flex;gap:20px;align-items:flex-start;flex-wrap:wrap;}
  .col{flex:1 1 520px;min-width:0;}
  .col.narrow{flex:0 0 375px;}
  .cap{font-size:11px;color:#6b6280;margin:0 0 6px;}
  img{display:block;width:100%;height:auto;border:1px solid #ddd;background:#fff;border-radius:4px;}
  .sp{width:375px;}
</style></head>
<body>
<h1>learning_figures プレビュー（${files.length} 枚）</h1>
${body}
</body></html>
`;

await writeFile(path.join(DIR, '_preview.html'), html, 'utf8');
console.log(`_preview.html を書き出しました（${files.length} 枚）`);

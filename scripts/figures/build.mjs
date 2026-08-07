/**
 * 学習コンテンツ（インプット）用オリジナル図版の生成スクリプト。
 *
 *   npx node scripts/figures/build.mjs
 *
 * public/learning_figures/*.svg を書き出す。
 * 従来 public/learning_images/ に置いていた転載画像を置き換えるためのもの。
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { build as separation } from './fig_separation.mjs';
import { build as flame } from './fig_flame.mjs';
import { build as states } from './fig_states.mjs';
import { build as periodic } from './fig_periodic.mjs';
import { build as ionform } from './fig_ionform.mjs';
import { build as periodicity } from './fig_periodicity.mjs';
import { build as radius } from './fig_radius.mjs';
import { buildMetal, buildHBond } from './fig_metal_hbond.mjs';
import { buildCurves, buildTwoStep } from './fig_titration.mjs';
import { buildVolta, buildDaniell, buildFuelCell } from './fig_battery.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, '../../public/learning_figures');

/**
 * Noto Sans CJK JP に収録されておらず、□（豆腐）になってしまう記号。
 * 図の中で使うと「文字化けしている」ように見えるので、ビルドで弾く。
 * 代替が決まっているものは lib.mjs の GLYPH_FALLBACK が自動で置き換えるため、
 * ここで引っかかるのは「代替を決めていない新しい記号」だけになる。
 */
const RISKY_GLYPHS = [
  ['\u2252', '≒', '≈（U+2248）を使う'],
  ['\u2247', '≇', '≉（U+2249）を使う'],
  ['\u2A75', '⩵', '== と書く'],
  ['\u2A76', '⩶', '=== と書く'],
  ['\u29EB', '⧫', '◆（U+25C6）を使う'],
  ['\u2B1B', '⬛', '■（U+25A0）を使う'],
  ['\u2B1C', '⬜', '□（U+25A1）を使う'],
  ['\u1D400', '𝐀', '数式用英字は使わず普通の英字にする'],
  ['\u2206', '∆', 'Δ（U+0394 ギリシャ大文字デルタ）を使う'],
];

/** 描画テキスト（<text> の中身）にグリフ欠けの記号が残っていないか調べる */
function checkGlyphs(name, svg) {
  const drawn = [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)]
    .map((m) => m[1].replace(/<[^>]*>/g, ''))
    .join('');
  for (const [ch, label, hint] of RISKY_GLYPHS) {
    if (drawn.includes(ch)) {
      throw new Error(
        `${name}: フォントに無い記号「${label}」(U+${ch.codePointAt(0).toString(16).toUpperCase()}) が図の中にあります。` +
          `豆腐（□）になるので ${hint} か、lib.mjs の GLYPH_FALLBACK に代替を追加してください。`
      );
    }
  }
}

/** 出力するファイル名 → 生成関数 */
const FIGURES = [
  ['fig_separation.svg', separation, '1-1 分離・精製（ろ過／蒸留／抽出／クロマトグラフィー）'],
  ['fig_flame.svg', flame, '1-1 炎色反応'],
  ['fig_states.svg', states, '1-1 物質の三態と状態変化'],
  ['fig_periodic.svg', periodic, '1-2 周期表（金属／非金属・族の性質）'],
  ['fig_ionform.svg', ionform, '1-2 イオンのでき方'],
  ['fig_periodicity.svg', periodicity, '1-2 価電子・イオン化エネルギー・電子親和力の周期性'],
  ['fig_radius.svg', radius, '1-2 原子半径とイオン半径'],
  ['fig_metal.svg', buildMetal, '1-3 金属結合と自由電子'],
  ['fig_hbond.svg', buildHBond, '1-3 水素化合物の沸点と水素結合'],
  ['fig_titration_curves.svg', buildCurves, '2-2 滴定曲線と指示薬'],
  ['fig_titration_twostep.svg', buildTwoStep, '2-2 二段階滴定'],
  ['fig_volta.svg', buildVolta, '2-3 ボルタ電池'],
  ['fig_daniell.svg', buildDaniell, '2-3 ダニエル電池'],
  ['fig_fuelcell.svg', buildFuelCell, '2-3 燃料電池'],
];

async function main() {
  await mkdir(OUT, { recursive: true });
  let total = 0;
  for (const [name, fn, label] of FIGURES) {
    const svg = fn();
    // 生成物の最低限の健全性チェック（空・閉じ忘れを早期に見つける）
    if (!svg.startsWith('<svg') || !svg.trimEnd().endsWith('</svg>')) {
      throw new Error(`${name}: SVG の形が壊れています`);
    }
    if (svg.includes('undefined') || svg.includes('NaN')) {
      throw new Error(`${name}: undefined / NaN が混ざっています`);
    }
    checkGlyphs(name, svg);
    await writeFile(path.join(OUT, name), svg, 'utf8');
    const kb = (Buffer.byteLength(svg, 'utf8') / 1024).toFixed(1);
    total += Buffer.byteLength(svg, 'utf8');
    console.log(`  ✓ ${name.padEnd(30)} ${String(kb).padStart(6)} KB  ${label}`);
  }
  console.log(`\n${FIGURES.length} 枚を書き出しました（合計 ${(total / 1024).toFixed(1)} KB）`);
  console.log(`出力先: ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

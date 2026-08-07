/**
 * 1-1 炎色反応の語呂合わせ表。
 * 元は個人ブログのスクリーンショット（文字がにじんでいた）だったので描き起こす。
 */
import { C, svg, tx, rect, line, path, circle, caption, measure } from './lib.mjs';

// ink: 色チップの上に置く文字の色。
// 黄・橙・黄緑は明るいので白抜きだと読めない → 濃い文字にする。
const ROWS = [
  { el: 'Li', color: '赤',   hex: '#e0483f', goro: 'リ', word: 'リアカー', ink: '#ffffff' },
  { el: 'Na', color: '黄',   hex: '#e8b427', goro: 'ナ', word: '無き',     ink: '#5a4108' },
  { el: 'K',  color: '赤紫', hex: '#a24bb8', goro: 'K',  word: 'K',        ink: '#ffffff' },
  { el: 'Cu', color: '青緑', hex: '#2a9d8f', goro: '村', word: '村',       ink: '#ffffff' },
  { el: 'Ca', color: '橙',   hex: '#ef8a3c', goro: '動', word: '動力',     ink: '#5c2d05' },
  { el: 'Sr', color: '紅',   hex: '#d6336c', goro: '借', word: '借りると', ink: '#ffffff' },
  { el: 'Ba', color: '黄緑', hex: '#7cb342', goro: '馬', word: '馬力',     ink: '#26400f' },
];

/** 炎のかたち */
function flame(cx, cy, hex, scale = 1) {
  const s = scale;
  return [
    path(`M${cx},${cy - 26 * s} C${cx + 15 * s},${cy - 10 * s} ${cx + 15 * s},${cy + 8 * s} ${cx},${cy + 16 * s} C${cx - 15 * s},${cy + 8 * s} ${cx - 15 * s},${cy - 10 * s} ${cx},${cy - 26 * s} Z`,
      { fill: hex, stroke: 'none', sw: 0, opacity: 0.9 }),
    path(`M${cx},${cy - 12 * s} C${cx + 7 * s},${cy - 3 * s} ${cx + 7 * s},${cy + 6 * s} ${cx},${cy + 12 * s} C${cx - 7 * s},${cy + 6 * s} ${cx - 7 * s},${cy - 3 * s} ${cx},${cy - 12 * s} Z`,
      { fill: '#fff', stroke: 'none', sw: 0, opacity: 0.55 }),
  ].join('\n');
}

export function build() {
  const W = 860;
  const H = 470;
  const g = [];

  // ===== 語呂合わせ帯 =====
  g.push(rect(14, 14, W - 28, 86, { fill: C.accentL, stroke: C.lineD, sw: 1.6, r: 12 }));
  g.push(tx(34, 38, '語呂合わせ', { size: 12.5, anchor: 'start', cls: 't eb', fill: C.accentD }));
  const goro = 'リアカー 無き K 村、動力 借りると するもくれない 馬力';
  g.push(tx(W / 2, 68, goro, { size: 21, cls: 't eb', fill: C.accentD }));
  g.push(tx(W / 2, 90, '（リ＝Li赤／ナ＝Na黄／K＝K赤紫／村＝Cu青緑／動＝Ca橙／借＝Sr紅／馬＝Ba黄緑）',
    { size: 11.5, cls: 's b' }));

  // ===== 表 =====
  const x0 = 14;
  const y0 = 116;
  const colW = (W - 28) / ROWS.length;
  const rowH = 250;

  ROWS.forEach((r, i) => {
    const cx = x0 + colW * i + colW / 2;
    const bx = x0 + colW * i + 4;
    const bw = colW - 8;
    g.push(rect(bx, y0, bw, rowH, { fill: C.white, stroke: C.line, sw: 1.5, r: 10 }));
    // 語呂の頭文字
    g.push(rect(bx, y0, bw, 30, { fill: C.accentL, stroke: 'none', sw: 0, r: 10 }));
    g.push(rect(bx, y0 + 20, bw, 10, { fill: C.accentL, stroke: 'none', sw: 0, r: 0 }));
    g.push(tx(cx, y0 + 15, r.word, { size: 13, cls: 't eb', fill: C.accentD }));
    // 炎
    g.push(flame(cx, y0 + 78, r.hex, 1.25));
    // 元素記号
    g.push(tx(cx, y0 + 128, r.el, { size: 26, cls: 't eb', fill: C.ink }));
    // 色チップ
    g.push(rect(cx - 32, y0 + 152, 64, 30, { fill: r.hex, stroke: C.grayD, sw: 1, r: 8 }));
    g.push(tx(cx, y0 + 167, r.color, { size: 14, cls: 't eb', fill: r.ink }));
    // 覚え方の対応
    g.push(tx(cx, y0 + 200, `${r.goro} → ${r.color}`, { size: 11, cls: 's b' }));
    // 縦の対応線
    g.push(line(cx, y0 + 30, cx, y0 + 48, { stroke: C.line, sw: 1.2, dash: '3 3' }));
  });

  // ===== 注意書き =====
  g.push(rect(14, y0 + rowH + 14, W - 28, 58, { fill: C.redL, stroke: C.red, sw: 1.4, r: 10 }));
  g.push(tx(34, y0 + rowH + 34, '⚠ ここが狙われる', { size: 12, anchor: 'start', cls: 't eb', fill: C.red }));
  g.push(tx(34, y0 + rowH + 56,
    'Mg は炎色反応を示さない。花火の色や、リチウム電池の炎色として出題されることも多い。',
    { size: 12, anchor: 'start', cls: 't b', fill: C.ink }));

  return svg(W, H, g.join('\n'), {
    title: '炎色反応の語呂合わせと元素・炎の色の対応',
    desc: 'Li赤、Na黄、K赤紫、Cu青緑、Ca橙、Sr紅、Ba黄緑。Mgは炎色反応を示さない。',
  });
}

/**
 * 1-2 陽イオン・陰イオンの生成（Na→Na⁺ / Cl→Cl⁻）。
 * 元は他サイトの図。電子殻を正確に描き、貴ガス型配置になることを強調して描き起こす。
 */
import { C, svg, tx, rect, line, path, circle, arrowDefs } from './lib.mjs';

const ar = arrowDefs([C.ink, C.red, C.blue, C.accent]);

/**
 * 原子・イオンの電子殻モデル。
 * shells: 各殻の電子数（K,L,M）
 */
function atom(cx, cy, { symbol, nucleus, shells, highlightLast, ionLabel, color }) {
  const g = [];
  const R = [22, 40, 58];
  // 電子殻
  shells.forEach((n, i) => {
    const isLast = i === shells.length - 1;
    g.push(circle(cx, cy, R[i], {
      fill: 'none',
      stroke: highlightLast && isLast ? color : C.grayD,
      sw: highlightLast && isLast ? 2.2 : 1.3,
    }));
  });
  // 原子核
  g.push(circle(cx, cy, 15, { fill: C.accentL, stroke: C.accentD, sw: 1.8 }));
  g.push(tx(cx, cy, nucleus, { size: 11.5, cls: 't eb', fill: C.accentD }));
  // 電子
  shells.forEach((n, i) => {
    for (let k = 0; k < n; k++) {
      const a = (-90 + (360 / Math.max(n, 1)) * k) * (Math.PI / 180);
      const ex = cx + Math.cos(a) * R[i];
      const ey = cy + Math.sin(a) * R[i];
      const isLast = i === shells.length - 1;
      g.push(circle(ex, ey, 4.6, {
        fill: highlightLast && isLast ? color : '#cdbdf0',
        stroke: highlightLast && isLast ? color : C.accentD,
        sw: 1.2,
      }));
    }
  });
  // 記号（電子殻の外側 R=58 のすぐ下）
  g.push(tx(cx, cy + 76, symbol, { size: 19, cls: 't eb', fill: C.ink }));
  if (ionLabel) g.push(tx(cx, cy + 94, ionLabel, { size: 11, cls: 's b' }));
  // 電子数の内訳（枠外にはみ出さないよう行間を詰める）
  g.push(tx(cx, cy + (ionLabel ? 111 : 94), `電子 ${shells.reduce((a, b) => a + b, 0)} 個（${shells.join('・')}）`,
    { size: 10.5, cls: 'f b' }));
  return g.join('\n');
}

export function build() {
  const W = 880;
  const H = 560;
  const g = [ar.defs];

  /* ========== 上段：Na → Na⁺（陽イオン） ========== */
  g.push(rect(14, 14, W - 28, 244, { fill: '#fdf6f1', stroke: '#e8b48f', sw: 1.6, r: 12 }));
  g.push(rect(30, 28, 118, 26, { fill: C.red, stroke: 'none', sw: 0, r: 13 }));
  g.push(tx(89, 41, '陽イオン', { size: 13, cls: 't eb', fill: C.white }));

  g.push(atom(160, 128, {
    symbol: 'Na', nucleus: '+11', shells: [2, 8, 1], highlightLast: true, color: C.red,
  }));
  // 矢印と説明
  g.push(path(`M${272},${124} l104,0`, { stroke: C.red, sw: 3.2, marker: ar.id(C.red) }));
  g.push(tx(324, 100, '電子を 1 個', { size: 13, cls: 't eb', fill: C.red }));
  g.push(tx(324, 148, '放出する', { size: 13, cls: 't eb', fill: C.red }));
  // 飛び出す電子
  g.push(circle(324, 176, 5.4, { fill: C.red, stroke: 'none', sw: 0 }));
  g.push(tx(346, 176, 'e⁻', { size: 12, anchor: 'start', cls: 't eb', fill: C.red }));

  g.push(atom(452, 128, {
    symbol: 'Na⁺', nucleus: '+11', shells: [2, 8], ionLabel: 'ナトリウムイオン',
  }));

  // 結論ボックス
  g.push(rect(560, 62, 296, 132, { fill: C.white, stroke: '#e8b48f', sw: 1.5, r: 10 }));
  g.push(tx(578, 86, '＋の電気を帯びる理由', { size: 12, anchor: 'start', cls: 't eb', fill: '#a9591f' }));
  g.push(tx(578, 112, '陽子 11 個（＋11）', { size: 12.5, anchor: 'start', cls: 't b' }));
  g.push(tx(578, 134, '電子 10 個（−10）', { size: 12.5, anchor: 'start', cls: 't b' }));
  g.push(line(578, 148, 838, 148, { stroke: C.grayD, sw: 1.4 }));
  g.push(tx(578, 168, '差し引き ＋1 → Na⁺', { size: 13, anchor: 'start', cls: 't eb', fill: C.red }));
  g.push(tx(578, 186, '電子配置は Ne と同じ（安定）', { size: 11, anchor: 'start', cls: 's b' }));

  /* ========== 下段：Cl → Cl⁻（陰イオン） ========== */
  g.push(rect(14, 270, W - 28, 244, { fill: '#eff5fd', stroke: '#8fb4e8', sw: 1.6, r: 12 }));
  g.push(rect(30, 284, 118, 26, { fill: C.blue, stroke: 'none', sw: 0, r: 13 }));
  g.push(tx(89, 297, '陰イオン', { size: 13, cls: 't eb', fill: C.white }));

  g.push(atom(160, 380, {
    symbol: 'Cl', nucleus: '+17', shells: [2, 8, 7], highlightLast: true, color: C.blue,
  }));
  g.push(path(`M${272},${376} l104,0`, { stroke: C.blue, sw: 3.2, marker: ar.id(C.blue) }));
  g.push(tx(324, 352, '電子を 1 個', { size: 13, cls: 't eb', fill: C.blue }));
  g.push(tx(324, 400, '受け取る', { size: 13, cls: 't eb', fill: C.blue }));
  g.push(circle(316, 426, 5.4, { fill: C.blue, stroke: 'none', sw: 0 }));
  g.push(tx(330, 426, 'e⁻', { size: 12, anchor: 'start', cls: 't eb', fill: C.blue }));

  g.push(atom(452, 380, {
    symbol: 'Cl⁻', nucleus: '+17', shells: [2, 8, 8], ionLabel: '塩化物イオン',
  }));

  g.push(rect(560, 320, 296, 140, { fill: C.white, stroke: '#8fb4e8', sw: 1.5, r: 10 }));
  g.push(tx(578, 344, '−の電気を帯びる理由', { size: 12, anchor: 'start', cls: 't eb', fill: '#1f5390' }));
  g.push(tx(578, 372, '陽子 17 個（＋17）', { size: 12.5, anchor: 'start', cls: 't b' }));
  g.push(tx(578, 394, '電子 18 個（−18）', { size: 12.5, anchor: 'start', cls: 't b' }));
  g.push(line(578, 408, 838, 408, { stroke: C.grayD, sw: 1.4 }));
  g.push(tx(578, 428, '差し引き −1 → Cl⁻', { size: 13, anchor: 'start', cls: 't eb', fill: C.blue }));
  g.push(tx(578, 448, '電子配置は Ar と同じ（安定）', { size: 11, anchor: 'start', cls: 's b' }));

  // 共通のまとめ（両パネルの外側に置く）
  g.push(rect(14, 524, W - 28, 30, { fill: C.accentL, stroke: C.lineD, sw: 1.3, r: 15 }));
  g.push(tx(W / 2, 539, 'どちらも「いちばん近い貴ガスと同じ電子配置」になろうとして電子をやりとりする。',
    { size: 12.5, cls: 't eb', fill: C.accentD }));

  return svg(W, H, g.join('\n'), {
    title: '陽イオン・陰イオンの生成（Na→Na⁺、Cl→Cl⁻）',
    desc: 'Naは電子1個を放出してNe型のNa⁺に、Clは電子1個を受け取ってAr型のCl⁻になる。陽子数と電子数の差が電荷になる。',
  });
}

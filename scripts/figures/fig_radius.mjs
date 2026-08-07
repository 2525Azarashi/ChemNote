/**
 * 1-2 原子半径の周期傾向 ＋ 同じ電子配置のイオン半径比較（2枚を1枚に統合）。
 */
import { C, svg, tx, rect, line, path, circle, arrowDefs, caption } from './lib.mjs';

const ar = arrowDefs([C.accent, C.red, C.blue, C.teal, C.ink]);

/* ========== 上：周期表上の原子半径の傾向 ========== */
function trend(ox, oy, w, h) {
  const g = [];
  g.push(rect(ox, oy, w, h, { fill: C.panel, stroke: C.line, sw: 1.5, r: 12 }));
  g.push(caption(ox + 12, oy + 12, w - 24, '原子半径の周期傾向'));

  // 簡略周期表（マス目）
  const CELL = 22;
  const GAP = 2;
  const tx0 = ox + 44;
  const ty0 = oy + 66;
  for (let p = 1; p <= 6; p++) {
    for (let gr = 1; gr <= 18; gr++) {
      // 1周期はH,Heのみ／2〜3周期は3〜12族なし
      if (p === 1 && gr !== 1 && gr !== 18) continue;
      if ((p === 2 || p === 3) && gr >= 3 && gr <= 12) continue;
      const x = tx0 + (gr - 1) * (CELL + GAP);
      const y = ty0 + (p - 1) * (CELL + GAP);
      // 左下ほど濃く（半径が大きい）
      const t = ((18 - gr) / 17) * 0.55 + ((p - 1) / 5) * 0.45;
      const fill = `rgb(${Math.round(255 - t * 90)},${Math.round(255 - t * 120)},${Math.round(255 - t * 30)})`;
      g.push(rect(x, y, CELL, CELL, { fill, stroke: C.grayD, sw: 0.9, r: 3 }));
    }
  }
  // 族・周期のガイド
  g.push(tx(tx0 - 12, ty0 - 12, '族→', { size: 10, anchor: 'end', cls: 'f b' }));
  g.push(tx(tx0 - 12, ty0 + 3 * (CELL + GAP), '周期↓', { size: 10, anchor: 'end', cls: 'f b' }));

  // 代表元素だけ記号を入れる
  const marks = [['H',1,1],['He',18,1],['Li',1,2],['F',17,2],['Ne',18,2],['Na',1,3],['Cl',17,3],['K',1,4],['Cs',1,6]];
  marks.forEach(([s, gr, p]) => {
    const x = tx0 + (gr - 1) * (CELL + GAP) + CELL / 2;
    const y = ty0 + (p - 1) * (CELL + GAP) + CELL / 2;
    g.push(tx(x, y, s, { size: 9, cls: 't eb', fill: C.ink }));
  });

  // 大きな斜め矢印（右上「小」→ 左下「大」）
  // 始点は 1周期の 17族（空きマス）の右端。He のマスに被らせない。
  const x1 = tx0 + 17 * (CELL + GAP) - 4;
  const y1 = ty0 + 8;
  // 矢じりが Cs のマスに重ならないよう、1列ぶん手前（2族の左）で止める
  const x2 = tx0 + (CELL + GAP) + 6;
  const y2 = ty0 + 5 * (CELL + GAP) + CELL - 4;
  g.push(path(`M${x1},${y1} L${x2},${y2}`, { stroke: C.accent, sw: 5, marker: ar.id(C.accent), opacity: 0.7 }));

  // 「小さい」は表の右外側、「大きい」は表の左下外側に置く（マス・矢印に重ねない）
  const outX = tx0 + 18 * (CELL + GAP) + 14;
  g.push(rect(outX, ty0 - 1, 58, 24, { fill: C.white, stroke: C.blue, sw: 1.6, r: 12 }));
  g.push(tx(outX + 29, ty0 + 11, '小さい', { size: 11.5, cls: 't eb', fill: C.blue }));
  // 「大きい」は矢印の先（表のいちばん下の左）のさらに下。
  // 6周期のマス（Cs）の下端＋十分な余白を取るので、マスにも矢じりにも当たらない。
  g.push(rect(tx0 - 4, y2 + 18, 58, 24, { fill: C.white, stroke: C.red, sw: 1.6, r: 12 }));
  g.push(tx(tx0 + 25, y2 + 30, '大きい', { size: 11.5, cls: 't eb', fill: C.red }));

  // 理由
  const rx = ox + w - 250;
  g.push(rect(rx, oy + 56, 236, 108, { fill: C.white, stroke: C.line, sw: 1.4, r: 9 }));
  g.push(tx(rx + 14, oy + 76, 'なぜそうなるか', { size: 11.5, anchor: 'start', cls: 't eb', fill: C.accentD }));
  g.push(tx(rx + 14, oy + 100, '↓ 下に行く：電子殻が増える', { size: 11, anchor: 'start', cls: 't b', fill: C.red }));
  g.push(tx(rx + 26, oy + 118, '→ 半径は大きくなる', { size: 10.5, anchor: 'start', cls: 's b' }));
  g.push(tx(rx + 14, oy + 140, '→ 右に行く：陽子が増える', { size: 11, anchor: 'start', cls: 't b', fill: C.blue }));
  g.push(tx(rx + 26, oy + 158, '→ 引きつけが強く小さくなる', { size: 10.5, anchor: 'start', cls: 's b' }));

  g.push(tx(ox + w / 2, oy + h - 18, '左下ほど大きく、右上ほど小さい（貴ガスは比較から外して考える）',
    { size: 11.5, cls: 't b', fill: C.sub }));
  return g.join('\n');
}

/* ========== 下：Ne型イオンの半径比較 ========== */
const IONS = [
  { s: 'O²⁻',  z: 8,  r: 46, protons: 8  },
  { s: 'F⁻',   z: 9,  r: 40, protons: 9  },
  { s: 'Na⁺',  z: 11, r: 27, protons: 11 },
  { s: 'Mg²⁺', z: 12, r: 22, protons: 12 },
  { s: 'Al³⁺', z: 13, r: 18, protons: 13 },
];

function ionSizes(ox, oy, w, h) {
  const g = [];
  g.push(rect(ox, oy, w, h, { fill: C.panel, stroke: C.line, sw: 1.5, r: 12 }));
  g.push(caption(ox + 12, oy + 12, w - 24, '同じ電子配置（Ne型）のイオン半径くらべ'));

  // 円の下端がそろわないので、記号は「いちばん大きい円の下」の共通ラインに
  // まとめて置く。こうすると下の傾向矢印とも絶対に重ならない。
  const cyc = oy + 132;
  const rMax = Math.max(...IONS.map((i) => i.r));
  const symY = cyc + rMax + 22;
  const step = (w - 120) / (IONS.length - 1);
  IONS.forEach((ion, i) => {
    const cx = ox + 60 + step * i;
    // 電子の雲
    g.push(circle(cx, cyc, ion.r, { fill: '#e5dcf8', stroke: C.accentD, sw: 1.6 }));
    // 原子核
    g.push(circle(cx, cyc, 11, { fill: C.accentL, stroke: C.accentD, sw: 1.5 }));
    g.push(tx(cx, cyc, `+${ion.protons}`, { size: 9.5, cls: 't eb', fill: C.accentD }));
    // 記号（共通ライン）
    g.push(tx(cx, symY, ion.s, { size: 15.5, cls: 't eb', fill: C.ink }));
    g.push(tx(cx, oy + 74, `Z=${ion.z}`, { size: 10.5, cls: 'f b' }));
  });

  // 電子は全部10個
  // Z=… の行（oy+74）とぶつからないよう、見出し直下の帯に置く
  g.push(rect(ox + 16, oy + 38, 92, 22, { fill: C.tealL, stroke: C.teal, sw: 1.3, r: 11 }));
  g.push(tx(ox + 62, oy + 49, '電子はどれも10個', { size: 10, cls: 't eb', fill: '#12705f' }));

  // 3本の傾向矢印
  const bars = [
    { y: symY + 36, label: '陽子（＋）の数',     l: '少ない', r: '多い',   col: C.red },
    { y: symY + 68, label: '電子を引きつける力', l: '弱い',   r: '強い',   col: C.amber },
    { y: symY + 100, label: 'イオン半径',         l: '大きい', r: '小さい', col: C.blue },
  ];
  const bx1 = ox + 168;
  const bx2 = ox + w - 96;
  bars.forEach((b) => {
    g.push(tx(ox + 16, b.y, b.label, { size: 11.5, anchor: 'start', cls: 't eb', fill: b.col }));
    g.push(path(`M${bx1},${b.y} L${bx2},${b.y}`, { stroke: b.col, sw: 3, marker: ar.id(b.col) }));
    g.push(rect(bx1 - 4, b.y - 11, 46, 22, { fill: C.white, stroke: b.col, sw: 1.2, r: 11 }));
    g.push(tx(bx1 + 19, b.y, b.l, { size: 10.5, cls: 't b', fill: b.col }));
    g.push(rect(bx2 - 44, b.y - 11, 46, 22, { fill: C.white, stroke: b.col, sw: 1.2, r: 11 }));
    g.push(tx(bx2 - 21, b.y, b.r, { size: 10.5, cls: 't b', fill: b.col }));
  });

  g.push(rect(ox + 16, oy + h - 50, w - 32, 38, { fill: C.accentL, stroke: C.lineD, sw: 1.4, r: 9 }));
  g.push(tx(ox + w / 2, oy + h - 31, 'O²⁻ ＞ F⁻ ＞ Na⁺ ＞ Mg²⁺ ＞ Al³⁺（原子番号が大きいほど小さい）',
    { size: 12.5, cls: 't eb', fill: C.accentD }));
  return g.join('\n');
}

export function build() {
  const W = 880;
  const H = 720;
  const g = [ar.defs];
  // 上パネルは 290 まで広げる（「大きい」ピルと下のまとめ文がぶつからないように）
  g.push(trend(14, 14, W - 28, 290));
  g.push(ionSizes(14, 320, W - 28, 386));
  return svg(W, H, g.join('\n'), {
    title: '原子半径の周期傾向と、同じ電子配置のイオン半径の比較',
    desc: '原子半径は周期表の左下ほど大きく右上ほど小さい。Ne型の電子配置をもつイオンでは、陽子数が多いほど電子を強く引きつけ、O²⁻＞F⁻＞Na⁺＞Mg²⁺＞Al³⁺の順に小さくなる。',
  });
}

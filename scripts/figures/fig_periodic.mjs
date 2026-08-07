/**
 * 1-2 元素の周期表（族・周期・分類）。
 * 元は白黒のグリッド画像。分類が色で見分けられないので、色分けして描き起こす。
 */
import { C, svg, tx, rect, line, path, arrowDefs } from './lib.mjs';

// [記号, 族, 周期]
const EL = [
  ['H',1,1],['He',18,1],
  ['Li',1,2],['Be',2,2],['B',13,2],['C',14,2],['N',15,2],['O',16,2],['F',17,2],['Ne',18,2],
  ['Na',1,3],['Mg',2,3],['Al',13,3],['Si',14,3],['P',15,3],['S',16,3],['Cl',17,3],['Ar',18,3],
  ['K',1,4],['Ca',2,4],['Sc',3,4],['Ti',4,4],['V',5,4],['Cr',6,4],['Mn',7,4],['Fe',8,4],['Co',9,4],
  ['Ni',10,4],['Cu',11,4],['Zn',12,4],['Ga',13,4],['Ge',14,4],['As',15,4],['Se',16,4],['Br',17,4],['Kr',18,4],
  ['Rb',1,5],['Sr',2,5],['Y',3,5],['Zr',4,5],['Nb',5,5],['Mo',6,5],['Tc',7,5],['Ru',8,5],['Rh',9,5],
  ['Pd',10,5],['Ag',11,5],['Cd',12,5],['In',13,5],['Sn',14,5],['Sb',15,5],['Te',16,5],['I',17,5],['Xe',18,5],
  ['Cs',1,6],['Ba',2,6],['*',3,6],['Hf',4,6],['Ta',5,6],['W',6,6],['Re',7,6],['Os',8,6],['Ir',9,6],
  ['Pt',10,6],['Au',11,6],['Hg',12,6],['Tl',13,6],['Pb',14,6],['Bi',15,6],['Po',16,6],['At',17,6],['Rn',18,6],
  ['Fr',1,7],['Ra',2,7],['**',3,7],
];

// 原子番号
const Z = {};
['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca',
 'Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr',
 'Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe','Cs','Ba'
].forEach((s, i) => { Z[s] = i + 1; });
Object.assign(Z, { Hf:72,Ta:73,W:74,Re:75,Os:76,Ir:77,Pt:78,Au:79,Hg:80,Tl:81,Pb:82,Bi:83,Po:84,At:85,Rn:86,Fr:87,Ra:88 });

const NONMETAL = new Set(['H','He','B','C','N','O','F','Ne','Si','P','S','Cl','Ar','Ge','As','Se','Br','Kr','Sb','Te','I','Xe','Po','At','Rn']);
const ALKALI = new Set(['Li','Na','K','Rb','Cs','Fr']);
const ALKALINE = new Set(['Be','Mg','Ca','Sr','Ba','Ra']);
const HALOGEN = new Set(['F','Cl','Br','I','At']);
const NOBLE = new Set(['He','Ne','Ar','Kr','Xe','Rn']);

const CELL = 40;
const GAP = 2;

function cellStyle(sym, group) {
  if (NOBLE.has(sym))    return { fill: '#e7e2f7', stroke: '#8a76c4', label: C.accentD };
  if (HALOGEN.has(sym))  return { fill: '#fdeef1', stroke: C.red,     label: '#a92e4c' };
  if (ALKALI.has(sym))   return { fill: '#fdf0e3', stroke: C.amber,   label: '#9a6412' };
  if (ALKALINE.has(sym)) return { fill: '#fdf8e3', stroke: '#c9a227', label: '#8a6d12' };
  if (group >= 3 && group <= 12) return { fill: '#e7f6f3', stroke: C.teal, label: '#12705f' };
  if (NONMETAL.has(sym)) return { fill: '#eaf2fc', stroke: C.blue,    label: '#1f5390' };
  return { fill: '#f4f1fa', stroke: C.grayD, label: C.sub };
}

export function build() {
  const W = 880;
  const H = 560;
  const ar = arrowDefs([C.accent, C.ink]);
  const g = [ar.defs];

  const OX = 62;
  const OY = 78;

  // 族番号
  for (let gr = 1; gr <= 18; gr++) {
    const x = OX + (gr - 1) * (CELL + GAP) + CELL / 2;
    g.push(tx(x, OY - 14, String(gr), { size: 11, cls: 's b' }));
  }
  g.push(tx(OX + 9 * (CELL + GAP), OY - 38, '族　→', { size: 12.5, cls: 't eb', fill: C.accentD }));

  // 周期番号
  for (let p = 1; p <= 7; p++) {
    const y = OY + (p - 1) * (CELL + GAP) + CELL / 2;
    g.push(tx(OX - 16, y, String(p), { size: 11, anchor: 'end', cls: 's b' }));
  }
  g.push(tx(24, OY + 3.5 * (CELL + GAP), '周期 →', { size: 12.5, cls: 't eb', fill: C.accentD, rotate: -90 }));

  // セル
  EL.forEach(([sym, gr, p]) => {
    const x = OX + (gr - 1) * (CELL + GAP);
    const y = OY + (p - 1) * (CELL + GAP);
    const st = cellStyle(sym, gr);
    g.push(rect(x, y, CELL, CELL, { fill: st.fill, stroke: st.stroke, sw: 1.2, r: 5 }));
    if (Z[sym]) g.push(tx(x + CELL / 2, y + 11, String(Z[sym]), { size: 8.5, cls: 'f b' }));
    g.push(tx(x + CELL / 2, y + 27, sym, { size: sym.length > 2 ? 12 : 15, cls: 't eb', fill: st.label }));
  });

  // ランタノイド・アクチノイドの注記
  const lanY = OY + 7 * (CELL + GAP) + 8;
  g.push(tx(OX, lanY + 8, '＊ ランタノイド（57〜71）　＊＊ アクチノイド（89〜103）は省略',
    { size: 10.5, anchor: 'start', cls: 'f b' }));

  // 金属／非金属の境界（太い階段線）
  // 各周期の「最も左にある非金属」の左端をたどるので、記号の上を横切らない。
  //   2周期→B(13族)  3周期→Si(14族)  4周期→Ge(14族)  5周期→Sb(15族)  6周期→Po(16族)
  const gx = (gr) => OX + (gr - 1) * (CELL + GAP);
  const gy = (p) => OY + (p - 1) * (CELL + GAP);
  const BOUND = [[2, 13], [3, 14], [4, 14], [5, 15], [6, 16]];
  let d = '';
  BOUND.forEach(([p, gr], i) => {
    const x = gx(gr) - GAP / 2;            // セルの隙間の中央＝罫線の上を通る
    const yT = gy(p) - GAP / 2;
    const yB = gy(p) + CELL + GAP / 2;     // 次の周期の yT と一致するので階段がつながる
    d += i === 0 ? `M${x},${yT}` : ` L${x},${yT}`;
    d += ` L${x},${yB}`;
  });
  g.push(path(d, { stroke: C.ink, sw: 3.2, fill: 'none', cap: 'square', join: 'miter' }));

  // 金属／非金属のラベルは1周期の空きスペース（13〜17族）に置く
  const labY = gy(1) + CELL / 2;
  g.push(tx(gx(13) - 12, labY, '← 金属', { size: 11.5, anchor: 'end', cls: 't eb', fill: C.ink }));
  g.push(tx(gx(13) + 12, labY, '非金属 →', { size: 11.5, anchor: 'start', cls: 't eb', fill: C.ink }));

  // 典型／遷移
  const trX0 = OX + 2 * (CELL + GAP);
  const trW = 10 * (CELL + GAP) - GAP;
  g.push(rect(trX0 - 2, OY + 3 * (CELL + GAP) - 2, trW + 4, 3 * (CELL + GAP) + 2,
    { fill: 'none', stroke: C.teal, sw: 2.4, r: 8, dash: '7 4' }));
  g.push(tx(trX0 + trW / 2, OY + 6 * (CELL + GAP) + 12, '遷移元素（3〜12族）', { size: 12, cls: 't eb', fill: '#12705f' }));

  // ===== 凡例 =====
  const ly = lanY + 34;
  const legend = [
    ['アルカリ金属', '#fdf0e3', C.amber],
    ['アルカリ土類金属', '#fdf8e3', '#c9a227'],
    ['遷移元素', '#e7f6f3', C.teal],
    ['ハロゲン', '#fdeef1', C.red],
    ['貴ガス', '#e7e2f7', '#8a76c4'],
    ['その他の非金属', '#eaf2fc', C.blue],
    ['その他の金属', '#f4f1fa', C.grayD],
  ];
  let lx = OX;
  legend.forEach(([label, fill, stroke]) => {
    g.push(rect(lx, ly, 18, 18, { fill, stroke, sw: 1.4, r: 4 }));
    g.push(tx(lx + 24, ly + 9, label, { size: 11, anchor: 'start', cls: 's b' }));
    lx += 24 + label.length * 11 + 16;
  });

  // ===== 覚えどころ =====
  g.push(rect(OX, ly + 34, W - OX - 20, 44, { fill: C.accentL, stroke: C.lineD, sw: 1.4, r: 10 }));
  g.push(tx(OX + 14, ly + 46, '覚えどころ', { size: 11, anchor: 'start', cls: 't eb', fill: C.accentD }));
  g.push(tx(OX + 14, ly + 66,
    '同じ族＝価電子の数が同じ＝似た性質。1族（H除く）＝アルカリ金属、17族＝ハロゲン、18族＝貴ガス。',
    { size: 12, anchor: 'start', cls: 't b' }));

  return svg(W, H, g.join('\n'), {
    title: '元素の周期表（族・周期・典型／遷移・金属／非金属の分類）',
    desc: '1族はアルカリ金属、2族はアルカリ土類金属、3〜12族は遷移元素、17族はハロゲン、18族は貴ガス。階段線の左が金属、右が非金属。',
  });
}

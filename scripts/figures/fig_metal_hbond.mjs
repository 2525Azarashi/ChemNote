/**
 * 1-3 金属結合（自由電子）／水素化合物の沸点グラフ。
 * 沸点グラフは元画像に AsH₃ が SbH₃ と誤記されていたので、正しい値で描き直す。
 */
import { C, svg, tx, rect, line, path, circle, arrowDefs, caption, makeScale, axes, smooth } from './lib.mjs';

const ar = arrowDefs([C.ink, C.accent, C.red, C.blue, C.amber]);

/* ========== 金属結合 ========== */
export function buildMetal() {
  const W = 720;
  const H = 420;
  const g = [ar.defs];

  g.push(rect(14, 14, W - 28, H - 28, { fill: C.panel, stroke: C.line, sw: 1.5, r: 12 }));
  g.push(caption(30, 28, W - 60, '金属結合 — 自由電子が金属全体を結びつける'));

  // 格子
  const OX = 70, OY = 92, SP = 62, N = 4;
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const cx = OX + c * SP;
      const cy = OY + r * SP;
      // 陽イオン
      g.push(circle(cx, cy, 17, { fill: '#f6c98d', stroke: '#c9822c', sw: 1.8 }));
      g.push(tx(cx, cy, '＋', { size: 14, cls: 't eb', fill: '#8a5410' }));
    }
  }
  // 自由電子（格子のすき間を動く）
  const eDots = [
    [101, 62], [163, 74], [225, 60], [88, 122], [148, 130], [212, 118], [258, 140],
    [96, 184], [156, 176], [220, 190], [110, 244], [172, 250], [232, 236], [60, 152], [262, 76],
  ];
  eDots.forEach(([ex, ey], i) => {
    g.push(circle(ex, ey, 6, { fill: C.accent, stroke: C.accentD, sw: 1.2 }));
    const ang = [20, 130, -70, 200, 60, -140, 100, -20, 170, 40, -110, 150, -50, 80, 210][i];
    const rad = (ang * Math.PI) / 180;
    g.push(path(`M${ex + Math.cos(rad) * 9},${ey + Math.sin(rad) * 9} l${Math.cos(rad) * 13},${Math.sin(rad) * 13}`,
      { stroke: C.accent, sw: 1.5, marker: ar.id(C.accent), opacity: 0.75 }));
  });

  // 凡例
  g.push(circle(50, 330, 13, { fill: '#f6c98d', stroke: '#c9822c', sw: 1.6 }));
  g.push(tx(70, 330, '金属の陽イオン（規則正しく並ぶ）', { size: 12, anchor: 'start', cls: 't b' }));
  g.push(circle(50, 360, 6, { fill: C.accent, stroke: C.accentD, sw: 1.2 }));
  g.push(tx(70, 360, '自由電子（金属全体を自由に動き回る）', { size: 12, anchor: 'start', cls: 't b' }));

  // 性質の説明
  const px = 340;
  g.push(rect(px, 84, W - px - 40, 210, { fill: C.white, stroke: C.line, sw: 1.5, r: 10 }));
  g.push(tx(px + 18, 108, '自由電子から説明できる性質', { size: 12.5, anchor: 'start', cls: 't eb', fill: C.accentD }));
  const props = [
    ['電気伝導性', '自由電子が電荷を運ぶ'],
    ['熱伝導性',   '自由電子が熱を伝える'],
    ['金属光沢',   '自由電子が光を反射する'],
    ['展性・延性', 'ずれても結合が切れない'],
  ];
  props.forEach(([name, why], i) => {
    const y = 136 + i * 40;
    g.push(rect(px + 18, y, W - px - 76, 32, { fill: C.accentL, stroke: 'none', sw: 0, r: 7 }));
    g.push(tx(px + 30, y + 16, name, { size: 12, anchor: 'start', cls: 't eb', fill: C.accentD }));
    g.push(tx(px + 124, y + 16, why, { size: 11.5, anchor: 'start', cls: 't b', fill: C.ink }));
  });

  g.push(tx(px + (W - px - 40) / 2, 326, '「たたくと広がる（展性）」「引くと伸びる（延性）」も',
    { size: 11.5, cls: 's b' }));
  g.push(tx(px + (W - px - 40) / 2, 346, '自由電子のおかげで結合が切れないから。',
    { size: 11.5, cls: 's b' }));

  return svg(W, H, g.join('\n'), {
    title: '金属結合（金属陽イオンと自由電子）',
    desc: '規則正しく並んだ金属陽イオンの間を自由電子が動き回る。電気伝導性・熱伝導性・金属光沢・展性延性はすべて自由電子で説明できる。',
  });
}

/* ========== 水素化合物の沸点 ========== */
// [原子番号, 沸点℃]
const G16 = [[8, 100], [16, -60], [34, -41], [52, -2]];    // H2O, H2S, H2Se, H2Te
const G15 = [[7, -33], [15, -88], [33, -62], [51, -18]];   // NH3, PH3, AsH3, SbH3
const G17 = [[9, 20], [17, -85], [35, -67], [53, -35]];    // HF, HCl, HBr, HI
const G14 = [[6, -162], [14, -112], [32, -88], [50, -52]]; // CH4, SiH4, GeH4, SnH4

export function buildHBond() {
  const W = 760;
  const H = 520;
  const g = [ar.defs];

  g.push(rect(14, 14, W - 28, H - 28, { fill: C.panel, stroke: C.line, sw: 1.5, r: 12 }));
  g.push(caption(30, 28, W - 60, '水素化合物の沸点 — 水素結合をもつものだけ異常に高い'));

  // yMax は 140 にして H₂O（100℃）の上にラベル用の余白を確保する（元は120で上端に貼りついていた）
  // 高さは H-204 まで。軸名「原子番号」はグラフ下端 +34 に出るので、
  // その下のまとめ枠（H-66）との間に必ず余白ができるようにしておく。
  const sc = makeScale({ x0: 72, y0: 74, w: W - 190, h: H - 204, xMin: 0, xMax: 56, yMin: -180, yMax: 140 });
  g.push(axes(sc, {
    xTicks: [10, 20, 30, 40, 50],
    yTicks: [-150, -100, -50, 0, 50, 100],
    xLabel: '原子番号',
    tickSize: 10,
  }));
  g.push(tx(30, sc.y0 + sc.h / 2, '沸点 〔℃〕', { size: 11.5, cls: 't b', rotate: -90 }));

  // 0℃の線
  g.push(line(sc.x0, sc.Y(0), sc.x0 + sc.w, sc.Y(0), { stroke: C.faint, sw: 1.4, dash: '5 4' }));

  // ラベルは点ごとに向きを指定する。
  // 同じ原子番号帯（2〜4番目の点）に4系列が集まるので、
  //   上 / 下 / 左（anchor:end） / 右（anchor:start） に散らして重なりを断つ。
  const U = { dx: 0, dy: -14, anchor: 'middle' };
  const D = { dx: 0, dy: 15, anchor: 'middle' };
  const L = { dx: -9, dy: 1, anchor: 'end' };
  const R = { dx: 9, dy: 1, anchor: 'start' };
  const series = [
    { pts: G16, col: C.red,   name: '16族',
      labels: ['H₂O', 'H₂S', 'H₂Se', 'H₂Te'],
      place: [{ dx: 0, dy: -20, anchor: 'middle' }, U, U, U] },
    { pts: G17, col: C.amber, name: '17族',
      labels: ['HF', 'HCl', 'HBr', 'HI'],
      place: [{ dx: 15, dy: -4, anchor: 'start' }, R, R, R] },
    { pts: G15, col: C.teal,  name: '15族',
      labels: ['NH₃', 'PH₃', 'AsH₃', 'SbH₃'],
      place: [{ dx: -15, dy: -2, anchor: 'end' }, L, L, L] },
    { pts: G14, col: C.blue,  name: '14族',
      labels: ['CH₄', 'SiH₄', 'GeH₄', 'SnH₄'],
      place: [{ dx: -9, dy: -8, anchor: 'end' }, D, D, D] },
  ];

  series.forEach((s) => {
    g.push(path(smooth(sc, s.pts, 0.4), { stroke: s.col, sw: 2.4 }));
    s.pts.forEach(([x, y], i) => {
      g.push(circle(sc.X(x), sc.Y(y), 3.6, { fill: C.white, stroke: s.col, sw: 2 }));
      const p = s.place[i];
      g.push(tx(sc.X(x) + p.dx, sc.Y(y) + p.dy, s.labels[i],
        { size: 10.5, cls: 't eb', fill: s.col, anchor: p.anchor }));
    });
  });

  // 水素結合の強調（H2O, HF, NH3）
  [[8, 100], [9, 20], [7, -33]].forEach(([x, y]) => {
    g.push(circle(sc.X(x), sc.Y(y), 9, { fill: 'none', stroke: C.accent, sw: 2.2, opacity: 0.8 }));
  });
  // 注記はグラフ左下の空白（−100℃より下・原子番号20以上）に置く
  g.push(rect(sc.X(20), sc.Y(-140) - 14, 190, 28, { fill: C.accentL, stroke: C.accent, sw: 1.4, r: 14 }));
  g.push(tx(sc.X(20) + 95, sc.Y(-140), '○ ＝ 水素結合をもつ', { size: 11.5, cls: 't eb', fill: C.accentD }));

  // 凡例
  const lx = W - 104;
  series.forEach((s, i) => {
    const y = 96 + i * 26;
    g.push(line(lx, y, lx + 22, y, { stroke: s.col, sw: 3 }));
    g.push(tx(lx + 28, y, s.name, { size: 11.5, anchor: 'start', cls: 't eb', fill: s.col }));
  });

  // まとめ
  g.push(rect(30, H - 66, W - 60, 44, { fill: C.white, stroke: C.lineD, sw: 1.5, r: 10 }));
  g.push(tx(W / 2, H - 52, '本来は分子量が大きいほど沸点が高い。ところが H₂O・HF・NH₃ だけ折れ線から飛び出す。',
    { size: 11.5, cls: 't b' }));
  g.push(tx(W / 2, H - 33, 'F・O・N に結合した H は水素結合をつくり、分子どうしが強く引き合うため。',
    { size: 11.5, cls: 't eb', fill: C.accentD }));

  return svg(W, H, g.join('\n'), {
    title: '14〜17族水素化合物の沸点と水素結合',
    desc: '同族では分子量が大きいほど沸点が高いが、H₂O・HF・NH₃ は水素結合により例外的に沸点が高い。',
  });
}

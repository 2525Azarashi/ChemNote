/**
 * 2-2 滴定曲線（4パターン）と二段階滴定。
 *
 * 【差し替えの理由】
 * learn_img_17/18 は別サイトから拾った2枚で、しかも 18（弱塩基×強酸）の横軸が
 * 「NaOH水溶液の滴下量」と誤記されていた（塩基を足せば pH は上がるはずで、
 * 図のように下がるのは矛盾）。learn_img_19（二段階滴定）は色が反転した暗い
 * スクリーンショットで、第1・第2中和点の文字がほぼ読めなかった。
 * ここでは4パターンを同じ体裁で描き、指示薬の変色域を帯で重ねて示す。
 */
import {
  C, svg, tx, txLines, rect, line, path, circle, makeScale, axes, smooth,
  caption, arrowDefs,
} from './lib.mjs';

/** 指示薬の変色域 */
const PP = { name: 'フェノールフタレイン', lo: 8.0, hi: 9.8, col: '#e0559a', bg: '#fdeaf4', change: '無色→赤' };
const MO = { name: 'メチルオレンジ', lo: 3.1, hi: 4.4, col: '#e08a2a', bg: '#fdf1de', change: '赤→黄' };

/** 0.1 mol/L の酸 10 mL に 0.1 mol/L の塩基を滴下（強酸×強塩基） */
const D_SS = [
  [0, 1.0], [2, 1.2], [5, 1.5], [8, 2.0], [9.5, 2.6], [9.9, 3.3],
  [10, 7.0],
  [10.1, 10.7], [10.5, 11.4], [12, 11.9], [15, 12.3], [20, 12.5],
];

/** 弱酸（酢酸）10 mL に強塩基（NaOH）を滴下 */
const D_WS = [
  [0, 2.9], [1, 3.8], [3, 4.4], [5, 4.8], [8, 5.4], [9.5, 6.0], [9.9, 6.7],
  [10, 8.7],
  [10.1, 10.7], [10.5, 11.4], [12, 11.9], [15, 12.3], [20, 12.5],
];

/** 弱塩基（アンモニア）10 mL に強酸（HCl）を滴下 */
const D_BW = [
  [0, 11.1], [1, 10.2], [3, 9.6], [5, 9.3], [8, 8.6], [9.5, 8.0], [9.9, 7.3],
  [10, 5.3],
  [10.1, 3.3], [10.5, 2.6], [12, 2.1], [15, 1.7], [20, 1.5],
];

/**
 * 滴定曲線パネル1枚。
 * 中和点の前後で pH が一気に跳ぶので、点列をそのまま滑らかにつなぐと
 * 曲線がふくらんでしまう。中和点の前・後で2本に分けて描く。
 */
function curvePanel(ox, oy, w, h, {
  title, cond, xLabel, data, color, colorL, np, indicators, verdict,
}) {
  const g = [];
  const ar = arrowDefs([color, C.red, C.accent]);
  g.push(ar.defs);
  g.push(rect(ox, oy, w, h, { fill: C.panel, stroke: C.line, sw: 1.5, r: 12 }));
  g.push(caption(ox + 12, oy + 12, w - 24, title, { bg: C.white }));
  g.push(tx(ox + w / 2, oy + 54, cond, { size: 10.5, cls: 's b' }));

  // 縦の割り付け（h = 340 のとき）
  //   +12〜38   見出し
  //   +54       条件
  //   +70〜210  グラフ本体 → 目盛り数字 +225 / 軸名 +244
  //   +262〜318 使う指示薬パネル
  const sc = makeScale({
    x0: ox + 44, y0: oy + 70, w: w - 66, h: h - 200,
    xMin: 0, xMax: 20, yMin: 0, yMax: 14,
  });

  // ---- 指示薬の変色域（曲線より先に敷く） ----
  // 帯の pH 数値は「曲線が帯から遠いほうの端」に置く。
  // 左端に固定すると、たとえば弱酸（開始 pH ≒ 3）の曲線が
  // メチルオレンジの帯（3.1〜4.4）を左端で横切って文字と重なってしまう。
  const phAt = (v) => {
    const near = data.reduce((a, b) => (Math.abs(b[0] - v) < Math.abs(a[0] - v) ? b : a));
    return near[1];
  };
  indicators.forEach((ind) => {
    const yTop = sc.Y(ind.hi);
    const yBot = sc.Y(ind.lo);
    const mid = (ind.lo + ind.hi) / 2;
    const distL = Math.abs(phAt(1) - mid);
    const distR = Math.abs(phAt(19) - mid);
    const left = distL >= distR;
    g.push(rect(sc.x0, yTop, sc.w, yBot - yTop, { fill: ind.bg, stroke: 'none', sw: 0, r: 2 }));
    g.push(line(sc.x0, yTop, sc.x0 + sc.w, yTop, { stroke: ind.col, sw: 1, dash: '4 3', opacity: 0.8 }));
    g.push(line(sc.x0, yBot, sc.x0 + sc.w, yBot, { stroke: ind.col, sw: 1, dash: '4 3', opacity: 0.8 }));
    g.push(tx(left ? sc.x0 + 5 : sc.x0 + sc.w - 5, (yTop + yBot) / 2, `${ind.lo}〜${ind.hi}`, {
      size: 9, anchor: left ? 'start' : 'end', cls: 't eb', fill: ind.col,
    }));
  });

  g.push(axes(sc, {
    xTicks: [0, 5, 10, 15, 20],
    yTicks: [0, 2, 4, 6, 8, 10, 12, 14],
    xLabel,
    grid: false,
    tickSize: 9.5,
  }));
  g.push(tx(ox + 13, sc.y0 + sc.h / 2, 'pH', { size: 11, cls: 't b', rotate: -90 }));

  // 中和点（10 mL）の縦線
  g.push(line(sc.X(10), sc.y0, sc.X(10), sc.y0 + sc.h, { stroke: C.accent, sw: 1.3, dash: '5 4', opacity: 0.7 }));

  // ---- 曲線（中和点の前後で分割） ----
  const before = data.filter((p) => p[0] <= 10);
  const after = data.filter((p) => p[0] >= 10);
  g.push(path(smooth(sc, before, 0.35), { stroke: color, sw: 2.6 }));
  g.push(path(smooth(sc, after, 0.35), { stroke: color, sw: 2.6 }));

  // 中和点
  g.push(circle(sc.X(10), sc.Y(np.ph), 5, { fill: C.red, stroke: C.white, sw: 1.8 }));
  const npLabel = `中和点 pH${np.ph === 7 ? '＝7' : np.ph > 7 ? '＞7' : '＜7'}`;
  const lx = np.ph > 7 ? sc.X(10) - 8 : sc.X(10) + 8;
  const ly = np.ph > 7 ? sc.Y(np.ph) + 20 : sc.Y(np.ph) - 20;
  g.push(tx(lx, ly, npLabel, {
    size: 10.5, anchor: np.ph > 7 ? 'end' : 'start', cls: 't eb', fill: C.red,
  }));

  // ---- 結論（使える指示薬） ----
  g.push(rect(ox + 12, oy + h - 70, w - 24, 56, { fill: C.white, stroke: verdict.col, sw: 1.6, r: 9 }));
  g.push(rect(ox + 12, oy + h - 70, 6, 56, { fill: verdict.col, stroke: 'none', sw: 0, r: 3 }));
  g.push(tx(ox + 28, oy + h - 52, '使う指示薬', { size: 10, anchor: 'start', cls: 's b' }));
  g.push(tx(ox + 28, oy + h - 33, verdict.use, { size: 12, anchor: 'start', cls: 't eb', fill: verdict.col }));
  g.push(tx(ox + w - 28, oy + h - 52, verdict.why, { size: 9.5, anchor: 'end', cls: 's b' }));

  return g.join('\n');
}

/** 滴定曲線 4パターン＋指示薬の選び方 */
export function buildCurves() {
  const W = 880;
  const H = 740;
  const g = [];
  const GW = 420;
  const GH = 340;

  // ❶ 強酸 × 強塩基
  g.push(curvePanel(14, 14, GW, GH, {
    title: '❶ 強酸 × 強塩基',
    cond: '0.1 mol/L HCl 10 mL ← 0.1 mol/L NaOH を滴下',
    xLabel: 'NaOH水溶液の滴下量（mL）',
    data: D_SS,
    color: C.blue,
    colorL: C.blueL,
    np: { ph: 7 },
    indicators: [PP, MO],
    verdict: {
      col: C.blue,
      use: 'どちらでもよい',
      why: '垂直部分が両方の変色域をまたぐ',
    },
  }));

  // ❹ 弱酸 × 強塩基
  g.push(curvePanel(446, 14, GW, GH, {
    title: '❹ 弱酸 × 強塩基',
    cond: '0.1 mol/L CH₃COOH 10 mL ← 0.1 mol/L NaOH を滴下',
    xLabel: 'NaOH水溶液の滴下量（mL）',
    data: D_WS,
    color: C.teal,
    colorL: C.tealL,
    np: { ph: 8.7 },
    indicators: [PP, MO],
    verdict: {
      col: PP.col,
      use: 'フェノールフタレイン',
      why: '中和点が塩基性側にずれる',
    },
  }));

  // ❸ 弱塩基 × 強酸
  g.push(curvePanel(14, 368, GW, GH, {
    title: '❸ 弱塩基 × 強酸',
    cond: '0.1 mol/L NH₃ 10 mL ← 0.1 mol/L HCl を滴下',
    xLabel: '塩酸の滴下量（mL）',
    data: D_BW,
    color: C.amber,
    colorL: C.amberL,
    np: { ph: 5.3 },
    indicators: [PP, MO],
    verdict: {
      col: MO.col,
      use: 'メチルオレンジ',
      why: '中和点が酸性側にずれる',
    },
  }));

  /* ===== 右下：指示薬の選び方まとめ ===== */
  const px = 446;
  const py = 368;
  g.push(rect(px, py, GW, GH, { fill: C.accentL, stroke: C.lineD, sw: 1.6, r: 12 }));
  g.push(caption(px + 12, py + 12, GW - 24, '指示薬の選び方', { bg: C.white }));

  g.push(rect(px + 16, py + 48, GW - 32, 40, { fill: C.white, stroke: C.accent, sw: 1.8, r: 9 }));
  g.push(tx(px + GW / 2, py + 68, '「強」がついている側で変色する指示薬を選ぶ', {
    size: 12.5, cls: 't eb', fill: C.accentD,
  }));

  const rows = [
    ['❶ 強酸 × 強塩基', 'pH ＝ 7', 'どちらも可', C.blue],
    ['❷ 弱酸 × 弱塩基', 'pH ≒ 7', 'どちらも使えない', C.faint],
    ['❸ 弱塩基 × 強酸', 'pH ＜ 7', 'メチルオレンジ', MO.col],
    ['❹ 弱酸 × 強塩基', 'pH ＞ 7', 'フェノールフタレイン', PP.col],
  ];
  rows.forEach(([name, ph, ind, col], i) => {
    const y = py + 98 + i * 44;
    g.push(rect(px + 16, y, GW - 32, 36, { fill: C.white, stroke: col, sw: 1.4, r: 8 }));
    g.push(rect(px + 16, y, 5, 36, { fill: col, stroke: 'none', sw: 0, r: 2.5 }));
    g.push(tx(px + 30, y + 18, name, { size: 11.5, anchor: 'start', cls: 't eb', fill: C.ink }));
    g.push(tx(px + 178, y + 18, ph, { size: 11, anchor: 'middle', cls: 't b', fill: C.sub }));
    g.push(tx(px + GW - 28, y + 18, ind, { size: 11.5, anchor: 'end', cls: 't eb', fill: col }));
  });

  // 変色域の凡例
  [PP, MO].forEach((ind, i) => {
    const y = py + 282 + i * 22;
    g.push(rect(px + 18, y - 7, 26, 14, { fill: ind.bg, stroke: ind.col, sw: 1.2, r: 3 }));
    g.push(tx(px + 52, y, `${ind.name}：pH ${ind.lo}〜${ind.hi}（${ind.change}）`, {
      size: 10, anchor: 'start', cls: 't b', fill: ind.col,
    }));
  });

  return svg(W, H, g.join('\n'), {
    title: '中和滴定の滴定曲線4パターンと指示薬の選び方',
    desc: '強酸×強塩基は中和点pH7で指示薬はどちらでも可。弱酸×強塩基は中和点がpH7より大きくフェノールフタレイン。弱塩基×強酸は中和点がpH7より小さくメチルオレンジ。弱酸×弱塩基は指示薬が使えない。',
  });
}

/** 二段階滴定の点列（V1 = 12.0 mL、V2 = 16.0 mL） */
const D_TWO_A = [[0, 12.6], [3, 12.4], [6, 12.1], [9, 11.5], [11, 10.4], [11.7, 9.4], [12, 8.3]];
const D_TWO_B = [[12, 8.3], [12.4, 7.4], [13, 7.0], [14, 6.7], [15, 6.2], [15.7, 5.2], [16, 3.8]];
const D_TWO_C = [[16, 3.8], [16.4, 2.8], [17, 2.4], [18, 2.0], [20, 1.7]];

/** 二段階滴定（NaOH + Na₂CO₃ 混合水溶液に HCl を滴下） */
export function buildTwoStep() {
  const W = 880;
  const H = 560;
  const g = [];
  const ar = arrowDefs([C.accent, C.red, C.ink, PP.col, MO.col]);
  g.push(ar.defs);

  g.push(caption(14, 14, W - 28, '二段階滴定：NaOH x mol ＋ Na₂CO₃ y mol の混合水溶液に 0.10 mol/L HCl を滴下'));

  /* ===== 左：滴定曲線 ===== */
  const ox = 14;
  const oy = 54;
  const GW = 520;
  const GH = 470;
  g.push(rect(ox, oy, GW, GH, { fill: C.panel, stroke: C.line, sw: 1.5, r: 12 }));

  // 縦の割り付け：
  //   上に 40px（中和点ラベル用）／下に 126px
  //   （目盛り数字 +15、軸名 +34、そのさらに下に区間矢印 2 段）
  const sc = makeScale({
    x0: ox + 50, y0: oy + 40, w: GW - 74, h: GH - 166,
    xMin: 0, xMax: 20, yMin: 0, yMax: 14,
  });

  // 指示薬の変色域。
  // 帯のラベルは「その帯のなかで曲線が通っていない側」に寄せる。
  //   フェノールフタレイン（pH8〜9.8）… 第1中和点が x=12 付近なので右へ
  //   メチルオレンジ（pH3.1〜4.4）    … 第2中和点が x=16 付近なので左へ
  [[PP, 'right'], [MO, 'left']].forEach(([ind, side]) => {
    const yTop = sc.Y(ind.hi);
    const yBot = sc.Y(ind.lo);
    g.push(rect(sc.x0, yTop, sc.w, yBot - yTop, { fill: ind.bg, stroke: 'none', sw: 0, r: 2 }));
    g.push(line(sc.x0, yTop, sc.x0 + sc.w, yTop, { stroke: ind.col, sw: 1, dash: '4 3', opacity: 0.8 }));
    g.push(line(sc.x0, yBot, sc.x0 + sc.w, yBot, { stroke: ind.col, sw: 1, dash: '4 3', opacity: 0.8 }));
    const lx = side === 'right' ? sc.x0 + sc.w - 5 : sc.x0 + 6;
    g.push(tx(lx, (yTop + yBot) / 2, `${ind.name} pH ${ind.lo}〜${ind.hi}`, {
      size: 9.5, anchor: side === 'right' ? 'end' : 'start', cls: 't eb', fill: ind.col,
    }));
  });

  g.push(axes(sc, {
    xTicks: [0, 4, 8, 12, 16, 20],
    yTicks: [0, 2, 4, 6, 8, 10, 12, 14],
    xLabel: '加えた塩酸 HCl の体積（mL）',
    grid: false,
    tickSize: 10,
  }));
  g.push(tx(ox + 16, sc.y0 + sc.h / 2, 'pH', { size: 11.5, cls: 't b', rotate: -90 }));

  // 中和点の縦線
  [[12, '第1中和点', PP.col], [16, '第2中和点', MO.col]].forEach(([v, label, col]) => {
    g.push(line(sc.X(v), sc.y0, sc.X(v), sc.y0 + sc.h, { stroke: col, sw: 1.4, dash: '5 4', opacity: 0.85 }));
    g.push(tx(sc.X(v), sc.y0 - 8, label, { size: 10.5, cls: 't eb', fill: col }));
  });

  // 曲線（3区間に分けて描く）
  [D_TWO_A, D_TWO_B, D_TWO_C].forEach((seg) => {
    g.push(path(smooth(sc, seg, 0.35), { stroke: C.accent, sw: 2.8 }));
  });

  // 中和点の点
  g.push(circle(sc.X(12), sc.Y(8.3), 5.4, { fill: PP.col, stroke: C.white, sw: 1.8 }));
  g.push(circle(sc.X(16), sc.Y(3.8), 5.4, { fill: MO.col, stroke: C.white, sw: 1.8 }));

  // 区間の幅を示す両矢印。
  // lib の line() は markerStart を受け取らないので path() を使う（両端に矢印が出る）。
  // 位置は軸名（sc.y0+sc.h+34）よりさらに下。
  const by = sc.y0 + sc.h + 60;
  const span = (y, v1, v2, label, col, anchor) => {
    const x1 = sc.X(v1);
    const x2 = sc.X(v2);
    g.push(path(`M${x1},${y} L${x2},${y}`, {
      stroke: col, sw: 2, marker: ar.id(col), markerStart: ar.id(col),
    }));
    // 縦の目印（区間の端をはっきりさせる）
    g.push(line(x1, y - 6, x1, y + 6, { stroke: col, sw: 1.6 }));
    g.push(line(x2, y - 6, x2, y + 6, { stroke: col, sw: 1.6 }));
    // ラベルは矢印の右外側に置く（矢印の上に重ねない）
    g.push(tx(x2 + 10, y, label, { size: 11, anchor: anchor || 'start', cls: 't eb', fill: col }));
  };
  span(by, 0, 12, '＝ (x + y) mol 分', PP.col);
  span(by + 30, 12, 16, '＝ y mol 分', MO.col);

  /* ===== 右：反応の順番 ===== */
  const px = 552;
  const py = 54;
  const PWD = W - px - 14;
  g.push(rect(px, py, PWD, GH, { fill: C.accentL, stroke: C.lineD, sw: 1.6, r: 12 }));
  g.push(caption(px + 12, py + 12, PWD - 24, '反応が起こる順番', { bg: C.white }));

  const steps = [
    {
      head: '第1段階（〜第1中和点）',
      col: PP.col,
      eqs: [
        '❶ NaOH + HCl → NaCl + H₂O',
        '❷ Na₂CO₃ + HCl → NaCl + NaHCO₃',
      ],
      amt: '使った HCl ＝ (x + y) mol',
      note: '強い塩基から先に反応する',
    },
    {
      head: '第2段階（第1→第2中和点）',
      col: MO.col,
      eqs: [
        '❸ NaHCO₃ + HCl',
        '　　→ NaCl + H₂O + CO₂',
      ],
      amt: '使った HCl ＝ y mol',
      note: '弱塩基 → 弱酸へ',
    },
  ];

  steps.forEach((s, i) => {
    const y = py + 50 + i * 148;
    g.push(rect(px + 14, y, PWD - 28, 134, { fill: C.white, stroke: s.col, sw: 1.7, r: 10 }));
    g.push(rect(px + 14, y, PWD - 28, 26, { fill: s.col, stroke: 'none', sw: 0, r: 10 }));
    g.push(rect(px + 14, y + 16, PWD - 28, 10, { fill: s.col, stroke: 'none', sw: 0, r: 0 }));
    g.push(tx(px + 14 + (PWD - 28) / 2, y + 13, s.head, { size: 11.5, cls: 't eb', fill: C.white }));
    s.eqs.forEach((e, j) => {
      g.push(tx(px + 28, y + 46 + j * 21, e, { size: 11.5, anchor: 'start', cls: 't b', fill: C.ink }));
    });
    g.push(line(px + 26, y + 94, px + PWD - 26, y + 94, { stroke: C.gray, sw: 1.2 }));
    g.push(tx(px + 28, y + 110, s.amt, { size: 11.5, anchor: 'start', cls: 't eb', fill: s.col }));
    g.push(tx(px + 28, y + 126, s.note, { size: 9.5, anchor: 'start', cls: 's b' }));
  });

  g.push(rect(px + 14, py + 404, PWD - 28, 44, { fill: C.white, stroke: C.red, sw: 1.6, r: 9 }));
  g.push(txLines(px + 14 + (PWD - 28) / 2, py + 419, [
    '⚠ 第1中和点までの体積は (x+y)、',
    '第2中和点までの「差」が y にあたる',
  ], { size: 10, cls: 't eb', fill: C.red, lh: 15 }));

  return svg(W, H, g.join('\n'), {
    title: '二段階滴定の滴定曲線と反応の順番',
    desc: 'NaOHとNa2CO3の混合水溶液にHClを滴下すると、第1中和点（フェノールフタレインの変色、pH約8.3）までに(x+y)molのHClが使われ、第1中和点から第2中和点（メチルオレンジの変色、pH約3.8）までにy molのHClが使われる。',
  });
}

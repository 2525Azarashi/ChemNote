/**
 * 2-3 ボルタ電池・ダニエル電池・燃料電池。
 *
 * 【差し替えの理由】
 * learn_img_20/21 は別サイトからの2枚で電極の向きも配色も揃っておらず、
 * learn_img_22（燃料電池）はリン酸形なのに電解質の層に SO₄²⁻ が描かれていた。
 * 3つとも「負極が左・正極が右」「電子は負極→正極」で統一して描き直す。
 */
import {
  C, svg, tx, txLines, rect, line, path, circle, ellipse, caption, arrowDefs, measure,
} from './lib.mjs';

/**
 * 電極板。
 * ラベルは板の真上ではなく「板の横」に出す。真上には導線が通っているので、
 * 上に置くと必ず線と文字が重なってしまう（side は 'left' | 'right'）。
 */
function plate(cx, top, h, { label, color, w = 22, side = 'right' }) {
  const dx = side === 'left' ? -(w / 2 + 8) : (w / 2 + 8);
  return [
    rect(cx - w / 2, top, w, h, { fill: color, stroke: C.ink, sw: 1.6, r: 3 }),
    tx(cx + dx, top + 14, label, {
      size: 16, cls: 't eb', fill: C.ink, anchor: side === 'left' ? 'end' : 'start',
    }),
  ].join('\n');
}

/** 水槽（ビーカー）＋液面 */
function beaker(x, y, w, h, { liquid, liquidTop = 26, label }) {
  const g = [];
  g.push(path(`M${x},${y} L${x},${y + h - 10} Q${x},${y + h} ${x + 10},${y + h} L${x + w - 10},${y + h} Q${x + w},${y + h} ${x + w},${y + h - 10} L${x + w},${y}`,
    { fill: 'none', stroke: C.grayD, sw: 2.4 }));
  g.push(path(`M${x + 2},${y + liquidTop} L${x + 2},${y + h - 11} Q${x + 2},${y + h - 2} ${x + 11},${y + h - 2} L${x + w - 11},${y + h - 2} Q${x + w - 2},${y + h - 2} ${x + w - 2},${y + h - 11} L${x + w - 2},${y + liquidTop} Z`,
    { fill: liquid, stroke: 'none', sw: 0, opacity: 0.55 }));
  g.push(line(x + 2, y + liquidTop, x + w - 2, y + liquidTop, { stroke: C.blue, sw: 1.4, opacity: 0.6 }));
  if (label) g.push(tx(x + w / 2, y + h + 16, label, { size: 11, cls: 's b' }));
  return g.join('\n');
}

/**
 * 外部回路（電球つき）。
 * 縦の割り付けは必ず wy（導線の高さ）< plateTop（電極の上端）にする。
 * 上から e⁻矢印(wy-32) / e⁻ラベル(wy-15) / 導線と電球(wy) / 電流矢印(wy+26) /
 * 電流ラベル(wy+42) の順に積むので、plateTop は wy+60 以上を確保しておく。
 */
function circuit(cxN, cxP, plateTop, wy, ar) {
  const g = [];
  const mid = (cxN + cxP) / 2;
  const R = 18;
  // 導線（電極の上端から立ち上げて電球へ）
  g.push(path(`M${cxN},${plateTop} L${cxN},${wy} L${mid - R - 8},${wy}`, { stroke: C.ink, sw: 2.2 }));
  g.push(path(`M${mid + R + 8},${wy} L${cxP},${wy} L${cxP},${plateTop}`, { stroke: C.ink, sw: 2.2 }));
  // 電球
  g.push(circle(mid, wy, R, { fill: '#fff8e1', stroke: C.amber, sw: 2 }));
  g.push(path(`M${mid - 7},${wy + 5} L${mid - 3},${wy - 5} L${mid + 1},${wy + 4} L${mid + 5},${wy - 6}`,
    { stroke: C.amber, sw: 1.8 }));
  // 光の線は左右斜め上だけに出す（下側は電流矢印と重なるため出さない）
  [[-1, -1], [1, -1]].forEach(([dx, dy]) => {
    g.push(line(mid + dx * 22, wy + dy * 16, mid + dx * 29, wy + dy * 22, { stroke: C.amber, sw: 1.6 }));
  });

  // 電子の流れ（負極 → 正極）：導線より上に2本
  const ey = wy - 32;
  g.push(path(`M${cxN + 12},${ey} L${mid - R - 16},${ey}`,
    { stroke: C.accent, sw: 2.2, marker: ar.id(C.accent) }));
  g.push(path(`M${mid + R + 16},${ey} L${cxP - 12},${ey}`,
    { stroke: C.accent, sw: 2.2, marker: ar.id(C.accent) }));
  // ラベルは左の矢印のさらに上（何も置かれていない帯）に、左揃えで出す
  g.push(tx(cxN + 12, wy - 48, 'e⁻ の流れ（負極 → 正極）',
    { size: 11, anchor: 'start', cls: 't eb', fill: C.accent }));

  // 電流の向き（電子と逆）：導線より下
  g.push(path(`M${cxP - 12},${wy + 26} L${cxN + 12},${wy + 26}`,
    { stroke: C.red, sw: 1.8, dash: '6 4', marker: ar.id(C.red) }));
  g.push(tx(mid, wy + 42, '電流の向き（e⁻ と逆）', { size: 10, cls: 't b', fill: C.red }));
  return g.join('\n');
}

/** 極の見出しバッジ */
function poleBadge(cx, y, kind) {
  const isNeg = kind === '負極';
  const col = isNeg ? C.blue : C.red;
  const bg = isNeg ? C.blueL : C.redL;
  const t = `${kind}（${isNeg ? '酸化' : '還元'}）`;
  const w = measure(t, 11.5) + 20;
  return [
    rect(cx - w / 2, y, w, 24, { fill: bg, stroke: col, sw: 1.5, r: 12 }),
    tx(cx, y + 12, t, { size: 11.5, cls: 't eb', fill: col }),
  ].join('\n');
}

/** ① ボルタ電池 */
export function buildVolta() {
  const W = 760;
  const H = 566;
  const g = [];
  const ar = arrowDefs([C.accent, C.red, C.ink, C.blue, C.teal]);
  g.push(ar.defs);

  g.push(caption(14, 14, W - 28, '① ボルタ電池　Zn ｜ 希硫酸 H₂SO₄ ｜ Cu'));

  /* 縦の割り付け
   *   52  極バッジ
   *   82  e⁻ラベル      （= WY-48）
   *   98  e⁻矢印         （= WY-32）
   *  130  導線・電球     （= WY）
   *  156  電流矢印       （= WY+26）
   *  172  電流ラベル     （= WY+42）
   *  192  電極の上端     （= PLATE_TOP）
   *  206  ビーカーの上端 （液面 +34 → 240）
   */
  const WY = 130;
  const PLATE_TOP = 192;
  const bx = 40;
  const bw = 330;
  const bh = 216;
  const bTop = 206;                 // ビーカーの上端
  const liqTop = bTop + 34;         // 液面
  const cxN = bx + 80;
  const cxP = bx + bw - 80;

  g.push(poleBadge(cxN, 52, '負極'));
  g.push(poleBadge(cxP, 52, '正極'));
  g.push(circuit(cxN, cxP, PLATE_TOP, WY, ar));

  g.push(beaker(bx, bTop, bw, bh, {
    liquid: '#dff0fb', liquidTop: 34, label: '希硫酸 H₂SO₄（Cu²⁺ は入っていない）',
  }));
  // 電極板は液面より上から差し込み、底より少し上で止める
  g.push(plate(cxN, PLATE_TOP, bTop + bh - 24 - PLATE_TOP, { label: 'Zn', color: '#cfd8de', side: 'left' }));
  g.push(plate(cxP, PLATE_TOP, bTop + bh - 24 - PLATE_TOP, { label: 'Cu', color: '#e2a678', side: 'right' }));

  // 溶液中のイオン（2枚の電極板のあいだ・液面より下だけに置く）
  const ions = [
    [bx + 142, liqTop + 26, 'H⁺', C.red],
    [bx + 196, liqTop + 58, 'H⁺', C.red],
    [bx + 126, liqTop + 92, 'SO₄²⁻', C.blue],
    [bx + 208, liqTop + 118, 'SO₄²⁻', C.blue],
    [bx + 158, liqTop + 148, 'H⁺', C.red],
  ];
  ions.forEach(([x, y, t, col]) => {
    const w = measure(t, 10.5) + 12;
    g.push(rect(x - w / 2, y - 9, w, 18, { fill: C.white, stroke: col, sw: 1.2, r: 9, opacity: 0.95 }));
    g.push(tx(x, y, t, { size: 10.5, cls: 't eb', fill: col }));
  });

  // Zn²⁺ が溶け出す（Zn の右へ／Zn ラベルからは十分下）
  g.push(path(`M${cxN + 14},${liqTop + 18} q24,-10 42,-2`, { stroke: C.blue, sw: 1.8, marker: ar.id(C.blue) }));
  g.push(tx(cxN + 60, liqTop + 4, 'Zn²⁺ が溶け出す',
    { size: 10.5, anchor: 'start', cls: 't eb', fill: C.blue }));

  // Cu 板に水素の泡
  [[cxP - 17, liqTop + 30], [cxP - 19, liqTop + 66], [cxP - 15, liqTop + 104], [cxP + 17, liqTop + 48], [cxP + 18, liqTop + 88]]
    .forEach(([x, y], i) => {
      g.push(circle(x, y, 6 - (i % 2), { fill: '#eaf7ff', stroke: C.blue, sw: 1.3 }));
    });
  g.push(tx(cxP - 6, liqTop + 140, 'H₂ の泡', { size: 11, anchor: 'end', cls: 't eb', fill: C.blue }));

  /* ===== 右：反応式と問題点 ===== */
  const px = 400;
  const PWD = W - px - 14;
  g.push(rect(px, 78, PWD, 200, { fill: C.panel, stroke: C.line, sw: 1.5, r: 12 }));
  g.push(caption(px + 12, 90, PWD - 24, '電極での反応', { bg: C.white }));

  const eqs = [
    ['負極（Zn）', 'Zn → Zn²⁺ + 2e⁻', C.blue],
    ['正極（Cu）', '2H⁺ + 2e⁻ → H₂', C.red],
    ['全体', 'Zn + 2H⁺ → Zn²⁺ + H₂', C.accentD],
  ];
  eqs.forEach(([k, v, col], i) => {
    const y = 126 + i * 48;
    g.push(rect(px + 14, y, PWD - 28, 40, { fill: C.white, stroke: col, sw: 1.5, r: 8 }));
    g.push(rect(px + 14, y, 5, 40, { fill: col, stroke: 'none', sw: 0, r: 2.5 }));
    g.push(tx(px + 28, y + 13, k, { size: 9.5, anchor: 'start', cls: 's b' }));
    g.push(tx(px + 28, y + 29, v, { size: 12, anchor: 'start', cls: 't eb', fill: col }));
  });

  g.push(rect(px, 290, PWD, 130, { fill: C.redL, stroke: C.red, sw: 1.6, r: 12 }));
  g.push(tx(px + PWD / 2, 310, '⚠ ボルタ電池の問題点（分極）', { size: 12, cls: 't eb', fill: C.red }));
  g.push(txLines(px + 16, 336, [
    '発生した H₂ が Cu 板に',
    'くっついて表面をおおうため、',
    '2H⁺ + 2e⁻ → H₂ が起こりにくく',
    'なり、電圧がすぐ下がる。',
    '→ これを改良したのがダニエル電池',
  ], { size: 10.5, anchor: 'start', cls: 't b', fill: C.ink, lh: 17 }));

  g.push(rect(14, 478, W - 28, 74, { fill: C.accentL, stroke: C.lineD, sw: 1.6, r: 10 }));
  g.push(tx(30, 500, '電池の大原則', { size: 11, anchor: 'start', cls: 't eb', fill: C.accentD }));
  g.push(tx(30, 522, 'イオン化傾向の大きい金属が負極（酸化される）。電子は負極 → 導線 → 正極。電流はその逆向き。',
    { size: 11.5, anchor: 'start', cls: 't b', fill: C.ink }));
  g.push(tx(30, 542, '2つの金属のイオン化傾向の差が大きいほど起電力（電圧）は大きくなる。',
    { size: 11.5, anchor: 'start', cls: 't b', fill: C.ink }));

  return svg(W, H, g.join('\n'), {
    title: 'ボルタ電池の構造と電極反応',
    desc: '負極はZn板でZn→Zn2+ +2e-、正極はCu板で2H+ +2e-→H2。電解液は希硫酸。発生した水素がCu板を覆う分極が問題点。',
  });
}

/** ② ダニエル電池 */
export function buildDaniell() {
  const W = 760;
  const H = 586;
  const g = [];
  const ar = arrowDefs([C.accent, C.red, C.ink, C.blue, C.teal]);
  g.push(ar.defs);

  g.push(caption(14, 14, W - 28, '② ダニエル電池　Zn ｜ ZnSO₄aq ｜素焼き板｜ CuSO₄aq ｜ Cu'));

  // 縦の割り付けはボルタ電池とそろえる（WY=130 / 電極上端 192 / 槽 206〜）
  const WY = 130;
  const PLATE_TOP = 192;
  const bx = 40;
  const bw = 330;
  const bh = 216;
  const bTop = 206;
  const liqTop = bTop + 34;
  const bBot = bTop + bh;
  const cxN = bx + 76;
  const cxP = bx + bw - 76;
  const midX = bx + bw / 2;

  g.push(poleBadge(cxN, 52, '負極'));
  g.push(poleBadge(cxP, 52, '正極'));
  g.push(circuit(cxN, cxP, PLATE_TOP, WY, ar));

  // 外枠（ビーカー）
  g.push(path(`M${bx},${bTop} L${bx},${bBot - 10} Q${bx},${bBot} ${bx + 10},${bBot} L${bx + bw - 10},${bBot} Q${bx + bw},${bBot} ${bx + bw},${bBot - 10} L${bx + bw},${bTop}`,
    { fill: 'none', stroke: C.grayD, sw: 2.4 }));
  // 左：硫酸亜鉛（薄い）／右：硫酸銅（青）
  g.push(path(`M${bx + 2},${liqTop} L${bx + 2},${bBot - 11} Q${bx + 2},${bBot - 2} ${bx + 11},${bBot - 2} L${midX - 4},${bBot - 2} L${midX - 4},${liqTop} Z`,
    { fill: '#eef4f8', stroke: 'none', sw: 0 }));
  g.push(path(`M${midX + 4},${liqTop} L${midX + 4},${bBot - 2} L${bx + bw - 11},${bBot - 2} Q${bx + bw - 2},${bBot - 2} ${bx + bw - 2},${bBot - 11} L${bx + bw - 2},${liqTop} Z`,
    { fill: '#cfe3f7', stroke: 'none', sw: 0 }));
  g.push(line(bx + 2, liqTop, bx + bw - 2, liqTop, { stroke: C.blue, sw: 1.4, opacity: 0.6 }));

  // 素焼き板（液面より少し上から底まで）
  g.push(rect(midX - 5, liqTop - 14, 10, bBot - 2 - (liqTop - 14), { fill: '#e7dfd2', stroke: '#a9977c', sw: 1.6, r: 2 }));
  for (let i = 0; i < 8; i++) {
    g.push(line(midX - 4, liqTop + 6 + i * 20, midX + 4, liqTop + 6 + i * 20, { stroke: '#a9977c', sw: 0.9 }));
  }
  // ラベルは槽の外・すぐ下に1回だけ
  g.push(tx(midX, bBot + 16, '素焼き板', { size: 11, cls: 't eb', fill: '#8a7658' }));

  const plateH = bBot - 24 - PLATE_TOP;
  g.push(plate(cxN, PLATE_TOP, plateH, { label: 'Zn', color: '#cfd8de', side: 'left' }));
  g.push(plate(cxP, PLATE_TOP, plateH, { label: 'Cu', color: '#e2a678', side: 'right' }));

  // 水溶液名は槽の外・素焼き板ラベルと同じ高さの左右に
  g.push(tx(bx + 56, bBot + 16, 'ZnSO₄ 水溶液', { size: 10.5, cls: 's b' }));
  g.push(tx(bx + bw - 56, bBot + 16, 'CuSO₄ 水溶液', { size: 10.5, cls: 's b' }));

  // Zn²⁺ 溶出（Zn 板の右どなり）／Cu²⁺ 接近（Cu 板の右どなり）。
  // 左右の半分は素焼き板ではさまれて幅が 70px ほどしかないので、
  // 1行で書くとおたがいの文字がぶつかる。かならず2行に折って置く。
  g.push(path(`M${cxN + 14},${liqTop + 16} q22,-8 38,-2`, { stroke: C.blue, sw: 1.8, marker: ar.id(C.blue) }));
  g.push(tx(cxN + 18, liqTop + 32, 'Zn²⁺ が', { size: 10, anchor: 'start', cls: 't eb', fill: C.blue }));
  g.push(tx(cxN + 18, liqTop + 47, '溶け出す', { size: 10, anchor: 'start', cls: 't eb', fill: C.blue }));
  g.push(path(`M${cxP + 56},${liqTop + 16} q-22,-8 -40,-2`, { stroke: C.red, sw: 1.8, marker: ar.id(C.red) }));
  g.push(tx(cxP + 18, liqTop + 32, 'Cu²⁺ が', { size: 10, anchor: 'start', cls: 't eb', fill: C.red }));
  g.push(tx(cxP + 18, liqTop + 47, '近づく', { size: 10, anchor: 'start', cls: 't eb', fill: C.red }));
  // Cu が析出（板の上に厚みを描き、ラベルは板の左側へ）
  g.push(rect(cxP - 11, liqTop + 56, 22, 42, { fill: '#c1793f', stroke: C.ink, sw: 1.2, r: 2 }));
  g.push(tx(cxP - 18, liqTop + 70, 'Cu が', { size: 10, anchor: 'end', cls: 't eb', fill: '#a35f2c' }));
  g.push(tx(cxP - 18, liqTop + 85, '析出する', { size: 10, anchor: 'end', cls: 't eb', fill: '#a35f2c' }));

  // SO₄²⁻ が素焼き板を通って移動（槽の下のほう＝他の要素がない帯）
  const soY = bBot - 30;
  g.push(path(`M${midX + 42},${soY} L${midX - 42},${soY}`,
    { stroke: C.teal, sw: 2, marker: ar.id(C.teal) }));
  g.push(tx(midX, soY - 15, 'SO₄²⁻ が移動', { size: 10, cls: 't eb', fill: C.teal }));

  /* ===== 右：反応式 ===== */
  const px = 400;
  const PWD = W - px - 14;
  g.push(rect(px, 78, PWD, 200, { fill: C.panel, stroke: C.line, sw: 1.5, r: 12 }));
  g.push(caption(px + 12, 90, PWD - 24, '電極での反応', { bg: C.white }));
  const eqs = [
    ['負極（Zn）', 'Zn → Zn²⁺ + 2e⁻', C.blue],
    ['正極（Cu）', 'Cu²⁺ + 2e⁻ → Cu', C.red],
    ['全体', 'Zn + Cu²⁺ → Zn²⁺ + Cu', C.accentD],
  ];
  eqs.forEach(([k, v, col], i) => {
    const y = 126 + i * 48;
    g.push(rect(px + 14, y, PWD - 28, 40, { fill: C.white, stroke: col, sw: 1.5, r: 8 }));
    g.push(rect(px + 14, y, 5, 40, { fill: col, stroke: 'none', sw: 0, r: 2.5 }));
    g.push(tx(px + 28, y + 13, k, { size: 9.5, anchor: 'start', cls: 's b' }));
    g.push(tx(px + 28, y + 29, v, { size: 12, anchor: 'start', cls: 't eb', fill: col }));
  });

  g.push(rect(px, 290, PWD, 150, { fill: C.tealL, stroke: C.teal, sw: 1.6, r: 12 }));
  g.push(tx(px + PWD / 2, 310, '素焼き板のはたらき', { size: 12, cls: 't eb', fill: C.teal }));
  g.push(txLines(px + 16, 334, [
    '2つの水溶液が急に混ざるのを',
    '防ぐ。混ざると Zn 板の上で',
    'Zn + Cu²⁺ が直接反応してしまい、',
    '導線に電子が流れなくなる。',
    'それでもイオンは通れるので',
    '回路は切れない。',
  ], { size: 10.5, anchor: 'start', cls: 't b', fill: C.ink, lh: 17 }));

  /* ===== 下：長持ちさせる条件 ===== */
  g.push(rect(14, 496, W - 28, 76, { fill: C.accentL, stroke: C.lineD, sw: 1.6, r: 10 }));
  g.push(tx(30, 516, '長持ちさせる濃度の条件（ここが狙われる）', { size: 11, anchor: 'start', cls: 't eb', fill: C.accentD }));
  g.push(tx(30, 540, '❶ ZnSO₄ 水溶液は うすい ほうがよい … Zn → Zn²⁺ + 2e⁻ が進みやすい',
    { size: 11.5, anchor: 'start', cls: 't eb', fill: C.blue }));
  g.push(tx(30, 560, '❷ CuSO₄ 水溶液は 濃い ほうがよい　… Cu²⁺ + 2e⁻ → Cu が進みやすい',
    { size: 11.5, anchor: 'start', cls: 't eb', fill: C.red }));

  return svg(W, H, g.join('\n'), {
    title: 'ダニエル電池の構造と電極反応',
    desc: '負極はZn板とZnSO4水溶液、正極はCu板とCuSO4水溶液で、素焼き板で仕切る。負極Zn→Zn2+ +2e-、正極Cu2+ +2e-→Cu。ZnSO4はうすく、CuSO4は濃いほうが長持ちする。',
  });
}

/** ③ 燃料電池（リン酸形） */
export function buildFuelCell() {
  const W = 800;
  const H = 600;
  const g = [];
  const ar = arrowDefs([C.accent, C.red, C.ink, C.blue, C.teal]);
  g.push(ar.defs);

  g.push(caption(14, 14, W - 28, '③ 燃料電池（リン酸形）　H₂ ｜ リン酸 H₃PO₄ 水溶液 ｜ O₂'));

  // 縦の割り付け：WY=130（導線）／電極上端 192／槽 206〜
  const WY = 130;
  const cellX = 150;
  const cellY = 206;
  const cellW = 380;
  const cellH = 210;
  const elecW = 30;
  const cxN = cellX + 62;
  const cxP = cellX + cellW - 62;
  const PLATE_TOP = 192;

  g.push(poleBadge(cxN, 52, '負極'));
  g.push(poleBadge(cxP, 52, '正極'));
  g.push(circuit(cxN, cxP, PLATE_TOP, WY, ar));

  // 電解質の槽
  g.push(rect(cellX, cellY, cellW, cellH, { fill: '#f0e8fb', stroke: C.lineD, sw: 2, r: 8 }));

  // 電極（多孔質・触媒つき）。ラベルは槽の中の上端に入れて、外に文字を出さない。
  [[cxN, 'H₂ 極'], [cxP, 'O₂ 極']].forEach(([cx, lab]) => {
    g.push(rect(cx - elecW / 2, PLATE_TOP, elecW, cellY + cellH - 12 - PLATE_TOP, {
      fill: '#4a4358', stroke: C.ink, sw: 1.6, r: 4,
    }));
    for (let i = 0; i < 10; i++) {
      g.push(circle(cx - 6 + (i % 2) * 12, cellY + 22 + Math.floor(i / 2) * 36, 2.6,
        { fill: '#9c93ab', stroke: 'none', sw: 0 }));
    }
    // 電極名は板のすぐ下（槽の外）に置く
    g.push(tx(cx, cellY + cellH + 18, lab, { size: 11, cls: 't eb', fill: C.ink }));
  });
  // 「多孔質」の注記は槽の中の上のすきま（2枚の電極板のあいだ）に置く。
  // 槽の外（cellY-12）に置くと電極板の上端や導線とぶつかるため。
  g.push(tx(cellX + cellW / 2, cellY + 22, '電極は多孔質（穴だらけ）',
    { size: 10, cls: 'f b' }));

  // 気体の供給
  g.push(rect(20, cellY + 16, 108, 42, { fill: C.blueL, stroke: C.blue, sw: 1.6, r: 8 }));
  g.push(tx(74, cellY + 37, 'H₂ を送る', { size: 12.5, cls: 't eb', fill: C.blue }));
  g.push(path(`M128,${cellY + 37} L${cxN - elecW / 2 - 8},${cellY + 37}`,
    { stroke: C.blue, sw: 2.2, marker: ar.id(C.blue) }));

  g.push(rect(W - 128, cellY + 16, 108, 42, { fill: C.redL, stroke: C.red, sw: 1.6, r: 8 }));
  g.push(tx(W - 74, cellY + 37, 'O₂ を送る', { size: 12.5, cls: 't eb', fill: C.red }));
  g.push(path(`M${W - 128},${cellY + 37} L${cxP + elecW / 2 + 8},${cellY + 37}`,
    { stroke: C.red, sw: 2.2, marker: ar.id(C.red) }));

  // H⁺ の移動（負極 → 正極）
  [0, 1, 2].forEach((i) => {
    const y = cellY + 112 + i * 30;
    g.push(path(`M${cxN + elecW / 2 + 12},${y} L${cxP - elecW / 2 - 12},${y}`,
      { stroke: C.accent, sw: 1.8, marker: ar.id(C.accent), opacity: 0.85 }));
  });
  g.push(rect(cellX + cellW / 2 - 46, cellY + 78, 92, 22, { fill: C.white, stroke: C.accent, sw: 1.4, r: 11 }));
  g.push(tx(cellX + cellW / 2, cellY + 89, 'H⁺ が移動', { size: 11, cls: 't eb', fill: C.accent }));

  // 生成した水（O₂ 供給の矢印より下の段）
  g.push(rect(W - 134, cellY + 118, 116, 42, { fill: C.tealL, stroke: C.teal, sw: 1.6, r: 8 }));
  g.push(tx(W - 76, cellY + 139, 'H₂O ができる', { size: 12, cls: 't eb', fill: C.teal }));
  g.push(path(`M${cxP + elecW / 2 + 8},${cellY + 139} L${W - 134},${cellY + 139}`,
    { stroke: C.teal, sw: 2.2, marker: ar.id(C.teal) }));

  // 電解質の説明は槽の外・電極名の1行下に置く（槽の中に入れると電極板と重なる）
  g.push(tx(cellX + cellW / 2, cellY + cellH + 42, '電解質：リン酸 H₃PO₄ 水溶液（H⁺ が動く）',
    { size: 11.5, cls: 't eb', fill: C.accentD }));

  /* ===== 下：反応式 ===== */
  const ey = cellY + cellH + 60;
  const eqs = [
    ['負極（H₂ 極）', 'H₂ → 2H⁺ + 2e⁻', '電子を放出＝酸化される（還元剤）', C.blue],
    ['正極（O₂ 極）', 'O₂ + 4H⁺ + 4e⁻ → 2H₂O', '電子を受け取る＝還元される（酸化剤）', C.red],
    ['全体', '2H₂ + O₂ → 2H₂O', '出るのは水だけ＝クリーン', C.accentD],
  ];
  const ew = (W - 28 - 16) / 3;
  eqs.forEach(([k, v, note, col], i) => {
    const x = 14 + i * (ew + 8);
    g.push(rect(x, ey, ew, 88, { fill: C.white, stroke: col, sw: 1.6, r: 10 }));
    g.push(rect(x, ey, ew, 22, { fill: col, stroke: 'none', sw: 0, r: 10 }));
    g.push(rect(x, ey + 12, ew, 10, { fill: col, stroke: 'none', sw: 0, r: 0 }));
    g.push(tx(x + ew / 2, ey + 11, k, { size: 10.5, cls: 't eb', fill: C.white }));
    g.push(tx(x + ew / 2, ey + 42, v, { size: 12, cls: 't eb', fill: col }));
    g.push(tx(x + ew / 2, ey + 68, note, { size: 9.5, cls: 's b' }));
  });

  return svg(W, H, g.join('\n'), {
    title: 'リン酸形燃料電池の仕組みと電極反応',
    desc: '負極でH2→2H+ +2e-、正極でO2+4H+ +4e-→2H2O。電解質はリン酸水溶液でH+が負極から正極へ移動する。全体では2H2+O2→2H2Oとなり、生成物は水だけ。',
  });
}

/**
 * 1-1 物質の三態と状態変化。
 * 元は教材サイトの粒子モデル画像＋状態変化図の2枚だったので、1枚に統合して描き起こす。
 */
import { C, svg, tx, rect, line, path, circle, arrowDefs, caption } from './lib.mjs';

const ar = arrowDefs([C.ink, C.red, C.blue, C.accent]);

/** 粒子の集まりを描く */
function particles(x, y, w, h, kind) {
  const g = [];
  g.push(rect(x, y, w, h, { fill: C.white, stroke: C.grayD, sw: 1.6, r: 8 }));
  const R = 8;
  const dot = (cx, cy) => circle(cx, cy, R, { fill: '#cdbdf0', stroke: C.accentD, sw: 1.4 });

  if (kind === 'solid') {
    // 規則正しく整列（振動）
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cx = x + 26 + c * 24;
        const cy = y + 26 + r * 24;
        g.push(dot(cx, cy));
        // 小さな振動記号
        g.push(line(cx - 13, cy, cx - 10, cy, { stroke: C.faint, sw: 1.2 }));
        g.push(line(cx + 10, cy, cx + 13, cy, { stroke: C.faint, sw: 1.2 }));
      }
    }
  } else if (kind === 'liquid') {
    // 密だが不規則（下半分に寄る）
    const pts = [
      [24, 52], [46, 44], [68, 54], [90, 46], [110, 56],
      [30, 74], [54, 68], [76, 76], [98, 68], [116, 78],
      [26, 96], [50, 92], [72, 98], [94, 92], [114, 100],
    ];
    pts.forEach(([px, py]) => g.push(dot(x + px, y + py)));
    // 流れる矢印
    g.push(path(`M${x + 34},${y + 34} q22,-10 44,0`, { stroke: C.blue, sw: 1.6, marker: ar.id(C.blue) }));
  } else {
    // 気体：まばら＋速度の矢印
    const pts = [[28, 30], [72, 22], [112, 40], [38, 68], [86, 62], [120, 82], [26, 102], [66, 100], [104, 110]];
    pts.forEach(([px, py], i) => {
      g.push(dot(x + px, y + py));
      const ang = [30, 150, -60, 200, 60, -130, 100, -30, 170][i];
      const rad = (ang * Math.PI) / 180;
      g.push(path(`M${x + px + Math.cos(rad) * 11},${y + py + Math.sin(rad) * 11} l${Math.cos(rad) * 14},${Math.sin(rad) * 14}`,
        { stroke: C.red, sw: 1.5, marker: ar.id(C.red) }));
    });
  }
  return g.join('\n');
}

export function build() {
  const W = 880;
  const H = 560;
  const g = [ar.defs];

  const BW = 148;
  const BH = 130;
  const cy = 92;
  const xs = { solid: 60, liquid: 366, gas: 672 };

  // ===== 上段：三態のモデル =====
  const box = (key, title, sub, note) => {
    const x = xs[key];
    const s = [];
    s.push(rect(x - 26, cy - 44, BW + 52, BH + 128, { fill: C.panel, stroke: C.line, sw: 1.4, r: 12 }));
    s.push(caption(x - 12, cy - 34, BW + 24, title));
    s.push(particles(x, cy, BW, BH, key));
    s.push(tx(x + BW / 2, cy + BH + 22, sub, { size: 12.5, cls: 't eb', fill: C.accentD }));
    s.push(tx(x + BW / 2, cy + BH + 44, note, { size: 11.5, cls: 's b' }));
    return s.join('\n');
  };
  g.push(box('solid',  '固体', '位置が決まっている', '規則正しく並び、その場で振動'));
  g.push(box('liquid', '液体', '位置は変わる',       '接したまま流れるように動く'));
  g.push(box('gas',    '気体', '自由に飛び回る',     'すき間が広く、激しく動く'));

  // ===== 中段：状態変化の矢印 =====
  const ay = 372;
  const arrowPair = (x1, x2, upper, lower, upColor, lowColor) => {
    const s = [];
    const mid = (x1 + x2) / 2;
    s.push(path(`M${x1},${ay - 14} L${x2},${ay - 14}`, { stroke: upColor, sw: 3, marker: ar.id(upColor) }));
    s.push(path(`M${x2},${ay + 14} L${x1},${ay + 14}`, { stroke: lowColor, sw: 3, marker: ar.id(lowColor) }));
    s.push(tx(mid, ay - 32, upper, { size: 14, cls: 't eb', fill: upColor }));
    s.push(tx(mid, ay + 32, lower, { size: 14, cls: 't eb', fill: lowColor }));
    return s.join('\n');
  };
  g.push(arrowPair(xs.solid + BW + 34, xs.liquid - 34, '融解', '凝固', C.red, C.blue));
  g.push(arrowPair(xs.liquid + BW + 34, xs.gas - 34, '蒸発', '凝縮', C.red, C.blue));

  // 状態名の再掲（矢印の左右）
  g.push(tx(xs.solid + BW / 2, ay, '固体', { size: 15, cls: 't eb', fill: C.ink }));
  g.push(tx(xs.liquid + BW / 2, ay, '液体', { size: 15, cls: 't eb', fill: C.ink }));
  g.push(tx(xs.gas + BW / 2, ay, '気体', { size: 15, cls: 't eb', fill: C.ink }));

  // ===== 下段：昇華・凝華（固体↔気体を大きく回り込む） =====
  const sx = xs.solid + BW / 2;
  const gx = xs.gas + BW / 2;
  // 3次ベジェの最下点は 0.25*始点y + 0.75*制御点y になるので、
  // ラベルをちょうどその位置に白いピルで置くと「線の上に文字が重なる」ことがない。
  const cx0 = (sx + gx) / 2;
  const y0 = ay + 18;
  const c1 = 452;                       // 昇華（赤）の制御点
  const c2 = 500;                       // 凝華（青）の制御点
  const bottom = (c) => 0.25 * y0 + 0.75 * c;
  g.push(path(`M${sx - 12},${y0} C${sx - 12},${c1} ${gx - 12},${c1} ${gx - 12},${y0}`,
    { stroke: C.red, sw: 3, marker: ar.id(C.red) }));
  g.push(path(`M${gx + 12},${y0} C${gx + 12},${c2} ${sx + 12},${c2} ${sx + 12},${y0}`,
    { stroke: C.blue, sw: 3, marker: ar.id(C.blue) }));
  g.push(rect(cx0 - 62, bottom(c1) - 14, 124, 28, { fill: C.white, stroke: C.red, sw: 1.3, r: 14 }));
  g.push(tx(cx0, bottom(c1), '昇華（固体→気体）', { size: 12, cls: 't eb', fill: C.red }));
  g.push(rect(cx0 - 62, bottom(c2) - 14, 124, 28, { fill: C.white, stroke: C.blue, sw: 1.3, r: 14 }));
  g.push(tx(cx0, bottom(c2), '凝華（気体→固体）', { size: 12, cls: 't eb', fill: C.blue }));

  // ===== 温度の向き =====
  g.push(rect(60, H - 46, 300, 30, { fill: C.redL, stroke: C.red, sw: 1.3, r: 15 }));
  g.push(tx(210, H - 31, '→ 加熱（熱を加える）＝赤い矢印', { size: 12, cls: 't b', fill: C.red }));
  g.push(rect(520, H - 46, 300, 30, { fill: C.blueL, stroke: C.blue, sw: 1.3, r: 15 }));
  g.push(tx(670, H - 31, '← 冷却（熱をうばう）＝青い矢印', { size: 12, cls: 't b', fill: C.blue }));

  return svg(W, H, g.join('\n'), {
    title: '物質の三態と状態変化（融解・凝固・蒸発・凝縮・昇華・凝華）',
    desc: '固体は規則正しく並んで振動、液体は接したまま流動、気体はすき間が広く自由に運動する。加熱で融解・蒸発・昇華、冷却で凝固・凝縮・凝華が起こる。',
  });
}

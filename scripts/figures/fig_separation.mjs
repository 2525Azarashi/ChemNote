/**
 * 1-1 分離・精製の装置図（ろ過・蒸留・抽出・クロマトグラフィー）
 * 元は教材サイトからの転載画像4枚だったものを、1枚のオリジナル図に描き起こす。
 */
import { C, svg, tx, txLines, rect, line, path, circle, ellipse, arrowDefs, caption } from './lib.mjs';

const ar = arrowDefs([C.ink, C.blue, C.accent, C.red]);

/* ---------------- ろ過 ---------------- */
function filtration(ox, oy) {
  const g = [];
  g.push(caption(ox, oy, 240, 'ろ過'));
  const by = oy + 42;

  // 上のビーカー（傾けて注いでいる）
  g.push(path(`M${ox + 24},${by + 6} L${ox + 30},${by + 46} L${ox + 74},${by + 52} L${ox + 82},${by + 12}`,
    { stroke: C.ink, sw: 2 }));
  // 中の液
  g.push(path(`M${ox + 28},${by + 24} L${ox + 31},${by + 46} L${ox + 74},${by + 51} L${ox + 78},${by + 30} Z`,
    { fill: C.blueL, stroke: C.blue, sw: 1.2 }));
  // ガラス棒
  g.push(line(ox + 74, by + 18, ox + 108, by + 76, { stroke: C.faint, sw: 4 }));
  // 注がれる液の筋
  g.push(path(`M${ox + 80},${by + 30} Q${ox + 92},${by + 52} ${ox + 106},${by + 74}`,
    { stroke: C.blue, sw: 2.4 }));

  // ろうと（三角形）
  const fx = ox + 118;
  const fy = by + 62;
  g.push(path(`M${fx - 44},${fy} L${fx + 44},${fy} L${fx + 6},${fy + 54} L${fx + 6},${fy + 86} L${fx - 6},${fy + 86} L${fx - 6},${fy + 54} Z`,
    { fill: C.white, stroke: C.ink, sw: 2 }));
  // ろ紙（内側の台形）
  g.push(path(`M${fx - 36},${fy + 5} L${fx + 36},${fy + 5} L${fx + 3},${fy + 50} L${fx - 3},${fy + 50} Z`,
    { fill: C.amberL, stroke: C.amber, sw: 1.5 }));
  // 落ちるしずく
  g.push(circle(fx, fy + 98, 3.2, { fill: C.blue, stroke: 'none', sw: 0 }));
  g.push(circle(fx, fy + 110, 2.6, { fill: C.blue, stroke: 'none', sw: 0 }));

  // 受けビーカー
  const bx = fx - 42;
  const byy = fy + 120;
  g.push(path(`M${bx},${byy} L${bx + 4},${byy + 56} L${bx + 80},${byy + 56} L${bx + 84},${byy}`,
    { fill: C.white, stroke: C.ink, sw: 2 }));
  g.push(path(`M${bx + 2},${byy + 30} L${bx + 4},${byy + 55} L${bx + 80},${byy + 55} L${bx + 82},${byy + 30} Z`,
    { fill: C.blueL, stroke: C.blue, sw: 1.2 }));

  // ラベル
  g.push(tx(ox + 12, by + 12, 'ろ過する液', { size: 11, anchor: 'start', cls: 's b' }));
  g.push(tx(ox + 168, by + 24, 'ガラス棒', { size: 11, anchor: 'start', cls: 's b' }));
  g.push(line(ox + 166, by + 24, ox + 100, by + 52, { stroke: C.faint, sw: 1, dash: '3 3' }));
  g.push(tx(ox + 190, fy + 22, 'ろ紙', { size: 11, anchor: 'start', cls: 's b' }));
  g.push(line(ox + 188, fy + 22, fx + 20, fy + 24, { stroke: C.faint, sw: 1, dash: '3 3' }));
  g.push(tx(fx + 52, byy + 30, 'ろ液', { size: 11, anchor: 'start', cls: 's b' }));
  g.push(line(fx + 50, byy + 30, fx + 34, byy + 34, { stroke: C.faint, sw: 1, dash: '3 3' }));

  g.push(tx(ox + 120, byy + 78, '固体と液体を分ける', { size: 11.5, cls: 't b', fill: C.accentD }));
  return g.join('\n');
}

/* ---------------- 蒸留 ---------------- */
function distillation(ox, oy) {
  const g = [];
  g.push(caption(ox, oy, 400, '蒸留'));
  const by = oy + 46;

  // 枝付きフラスコ
  const fx = ox + 62;
  const fy = by + 86;
  g.push(path(`M${fx - 9},${fy - 62} L${fx - 9},${fy - 34} A34,34 0 1,0 ${fx + 9},${fy - 34} L${fx + 9},${fy - 62}`,
    { fill: C.white, stroke: C.ink, sw: 2 }));
  // 中の液体
  g.push(path(`M${fx - 31},${fy - 12} A34,34 0 0,0 ${fx + 31},${fy - 12} A34,34 0 0,1 ${fx - 31},${fy - 12} Z`,
    { fill: C.blueL, stroke: 'none', sw: 0 }));
  g.push(path(`M${fx - 31},${fy - 10} A33,33 0 0,0 ${fx + 31},${fy - 10}`, { fill: C.blueL, stroke: C.blue, sw: 1.4 }));
  // 沸騰石
  g.push(circle(fx - 12, fy + 12, 2.6, { fill: C.faint, stroke: 'none', sw: 0 }));
  g.push(circle(fx + 4, fy + 16, 2.6, { fill: C.faint, stroke: 'none', sw: 0 }));
  g.push(circle(fx + 16, fy + 8, 2.6, { fill: C.faint, stroke: 'none', sw: 0 }));
  // 温度計
  g.push(line(fx, by + 6, fx, fy - 34, { stroke: C.red, sw: 3 }));
  g.push(circle(fx, fy - 30, 4, { fill: C.red, stroke: 'none', sw: 0 }));
  g.push(rect(fx - 6, by + 2, 12, 20, { fill: C.white, stroke: C.ink, sw: 1.4, r: 3 }));
  // 枝管
  g.push(path(`M${fx + 9},${fy - 52} L${fx + 52},${fy - 40}`, { stroke: C.ink, sw: 2 }));

  // リービッヒ冷却器（斜め）
  const cx1 = fx + 52, cy1 = fy - 44;
  const cx2 = fx + 176, cy2 = fy - 6;
  g.push(path(`M${cx1},${cy1 - 11} L${cx2},${cy2 - 11} L${cx2},${cy2 + 11} L${cx1},${cy1 + 11} Z`,
    { fill: C.blueL, stroke: C.ink, sw: 2 }));
  g.push(line(cx1, cy1, cx2, cy2, { stroke: C.faint, sw: 1.4, dash: '5 4' }));
  // 冷却水の入口・出口
  g.push(path(`M${cx2 - 18},${cy2 + 12} l0,20`, { stroke: C.blue, sw: 2.2, marker: ar.id(C.blue) }));
  g.push(path(`M${cx1 + 24},${cy1 - 30} l0,18`, { stroke: C.blue, sw: 2.2, marker: ar.id(C.blue) }));

  // アダプター＋三角フラスコ
  g.push(path(`M${cx2},${cy2 - 8} l16,6 l-4,22 l-14,-6 Z`, { fill: C.white, stroke: C.ink, sw: 1.8 }));
  const ex = cx2 + 34, ey = cy2 + 54;
  g.push(path(`M${ex - 8},${ey - 34} L${ex - 30},${ey + 22} L${ex + 30},${ey + 22} L${ex + 8},${ey - 34} Z`,
    { fill: C.white, stroke: C.ink, sw: 2 }));
  g.push(path(`M${ex - 24},${ey + 6} L${ex - 30},${ey + 21} L${ex + 30},${ey + 21} L${ex + 24},${ey + 6} Z`,
    { fill: C.blueL, stroke: C.blue, sw: 1.2 }));
  // したたる
  g.push(circle(ex, ey - 22, 2.6, { fill: C.blue, stroke: 'none', sw: 0 }));

  // 加熱
  g.push(path(`M${fx - 10},${fy + 42} q4,-12 10,-6 q6,-14 10,0 q8,-6 10,6 Z`, { fill: C.amber, stroke: 'none', sw: 0 }));
  g.push(line(fx - 26, fy + 44, fx + 26, fy + 44, { stroke: C.ink, sw: 2 }));

  // ラベル
  g.push(tx(fx - 46, by + 12, '温度計', { size: 11, anchor: 'start', cls: 's b' }));
  // 「枝付きフラスコ」は器具の左下に引き出し線つきで置く。
  // フラスコの真横に置くと球の輪郭・沸騰石と重なってしまうため。
  g.push(line(fx - 32, fy - 4, fx - 56, fy + 46, { stroke: C.faint, sw: 1.1 }));
  g.push(tx(fx - 58, fy + 58, '枝付きフラスコ', { size: 11, cls: 's b' }));
  g.push(line(fx + 17, fy + 9, fx + 42, fy + 28, { stroke: C.faint, sw: 1.1 }));
  g.push(tx(fx + 46, fy + 32, '沸騰石', { size: 11, anchor: 'start', cls: 's b', fill: C.sub }));
  g.push(tx(cx1 + 66, cy1 - 34, 'リービッヒ冷却器', { size: 11, cls: 's b' }));
  g.push(tx(cx2 - 18, cy2 + 42, '冷却水', { size: 10.5, cls: 's b', fill: C.blue }));
  g.push(tx(ex + 46, ey + 8, '三角フラスコ', { size: 11, anchor: 'start', cls: 's b' }));
  g.push(tx(ex + 44, ey - 22, '留出液', { size: 11, anchor: 'start', cls: 's b', fill: C.blue }));

  g.push(tx(ox + 200, oy + 258, '沸点の差で液体どうしを分ける', { size: 11.5, cls: 't b', fill: C.accentD }));
  return g.join('\n');
}

/* ---------------- 抽出（分液ろうと） ---------------- */
function extraction(ox, oy) {
  const g = [];
  g.push(caption(ox, oy, 200, '抽出'));
  const cx = ox + 100;
  const ty = oy + 52;

  // 分液ろうと本体
  g.push(path(`M${cx - 10},${ty} L${cx - 10},${ty + 14} L${cx - 34},${ty + 24} L${cx - 34},${ty + 92} L${cx},${ty + 146} L${cx + 34},${ty + 92} L${cx + 34},${ty + 24} L${cx + 10},${ty + 14} L${cx + 10},${ty} Z`,
    { fill: C.white, stroke: C.ink, sw: 2 }));
  // 上層（ヘキサン）
  g.push(path(`M${cx - 34},${ty + 34} L${cx + 34},${ty + 34} L${cx + 34},${ty + 82} L${cx - 34},${ty + 82} Z`,
    { fill: C.amberL, stroke: 'none', sw: 0 }));
  // 下層（水）
  g.push(path(`M${cx - 34},${ty + 82} L${cx + 34},${ty + 82} L${cx + 34},${ty + 92} L${cx},${ty + 146} L${cx - 34},${ty + 92} Z`,
    { fill: C.blueL, stroke: 'none', sw: 0 }));
  // 境界線
  g.push(line(cx - 34, ty + 82, cx + 34, ty + 82, { stroke: C.ink, sw: 1.8 }));
  g.push(line(cx - 34, ty + 34, cx + 34, ty + 34, { stroke: C.amber, sw: 1.4 }));
  // 枠を上から描き直す
  g.push(path(`M${cx - 34},${ty + 24} L${cx - 34},${ty + 92} L${cx},${ty + 146} L${cx + 34},${ty + 92} L${cx + 34},${ty + 24}`,
    { stroke: C.ink, sw: 2 }));
  // コック
  g.push(circle(cx, ty + 152, 7, { fill: C.white, stroke: C.ink, sw: 1.8 }));
  g.push(line(cx - 11, ty + 152, cx + 11, ty + 152, { stroke: C.ink, sw: 2.4 }));
  g.push(line(cx, ty + 159, cx, ty + 174, { stroke: C.ink, sw: 2 }));

  // ラベル
  g.push(tx(cx + 48, ty + 56, 'ヘキサンの層', { size: 11, anchor: 'start', cls: 's b', fill: C.amber }));
  g.push(line(cx + 46, ty + 56, cx + 32, ty + 58, { stroke: C.faint, sw: 1, dash: '3 3' }));
  g.push(tx(cx + 48, ty + 100, '水の層', { size: 11, anchor: 'start', cls: 's b', fill: C.blue }));
  g.push(line(cx + 46, ty + 100, cx + 30, ty + 96, { stroke: C.faint, sw: 1, dash: '3 3' }));
  g.push(tx(cx - 48, ty + 8, '分液ろうと', { size: 11, anchor: 'end', cls: 's b' }));
  g.push(line(cx - 46, ty + 8, cx - 12, ty + 10, { stroke: C.faint, sw: 1, dash: '3 3' }));

  g.push(tx(cx, ty + 194, '溶けやすさの差で分ける', { size: 11.5, cls: 't b', fill: C.accentD }));
  return g.join('\n');
}

/* ---------------- ペーパークロマトグラフィー ---------------- */
function chromatography(ox, oy) {
  const g = [];
  g.push(caption(ox, oy, 340, 'クロマトグラフィー'));
  const ty = oy + 48;

  const panel = (px, label) => {
    const s = [];
    // ビーカー
    s.push(path(`M${px},${ty + 30} L${px + 4},${ty + 138} L${px + 108},${ty + 138} L${px + 112},${ty + 30}`,
      { fill: C.white, stroke: C.ink, sw: 2 }));
    // 水
    s.push(path(`M${px + 8},${ty + 112} L${px + 9},${ty + 137} L${px + 103},${ty + 137} L${px + 104},${ty + 112} Z`,
      { fill: C.blueL, stroke: C.blue, sw: 1.2 }));
    // ろ紙
    s.push(rect(px + 40, ty + 6, 32, 126, { fill: '#fffdf6', stroke: C.grayD, sw: 1.5, r: 2 }));
    s.push(tx(px + 56, ty - 4, label, { size: 11.5, cls: 't b', fill: C.accentD }));
    return s;
  };

  // 開始前
  g.push(...panel(ox + 6, '開始前'));
  // インクの点
  g.push(circle(ox + 62, ty + 104, 5.5, { fill: '#4b3b6b', stroke: 'none', sw: 0 }));
  g.push(tx(ox + 6, ty + 152, '水性ペンの点をつける', { size: 10.5, anchor: 'start', cls: 's b' }));

  // 矢印
  g.push(path(`M${ox + 130},${ty + 70} l28,0`, { stroke: C.accent, sw: 2.6, marker: ar.id(C.accent) }));
  g.push(tx(ox + 144, ty + 54, '水が上がる', { size: 10, cls: 't b', fill: C.accent }));

  // 開始後
  g.push(...panel(ox + 178, '開始後'));
  // 分かれた色の帯
  const bx = ox + 178 + 40;
  g.push(rect(bx + 2, ty + 40, 28, 9, { fill: '#e0554e', stroke: 'none', sw: 0, r: 3 }));
  g.push(rect(bx + 2, ty + 58, 28, 9, { fill: '#e8a83c', stroke: 'none', sw: 0, r: 3 }));
  g.push(rect(bx + 2, ty + 78, 28, 9, { fill: '#3f8ecf', stroke: 'none', sw: 0, r: 3 }));
  g.push(line(bx - 2, ty + 104, bx + 34, ty + 104, { stroke: C.faint, sw: 1.2, dash: '3 3' }));
  // 上に伸びる矢印
  g.push(path(`M${bx + 44},${ty + 104} l0,-58`, { stroke: C.blue, sw: 2, marker: ar.id(C.blue) }));

  g.push(tx(ox + 292, ty + 44, '軽い＝速い', { size: 10, anchor: 'start', cls: 's b', fill: C.red }));
  g.push(tx(ox + 292, ty + 84, '重い＝遅い', { size: 10, anchor: 'start', cls: 's b', fill: C.blue }));

  g.push(tx(ox + 170, ty + 176, '吸着・移動しやすさの差で分ける', { size: 11.5, cls: 't b', fill: C.accentD }));
  return g.join('\n');
}

export function build() {
  const W = 880;
  const H = 700;
  const body = [
    ar.defs,
    // 上段：ろ過（左）／蒸留（右）
    rect(14, 14, 264, 320, { fill: C.panel, stroke: C.line, sw: 1.4, r: 12 }),
    filtration(30, 26),
    rect(292, 14, 574, 320, { fill: C.panel, stroke: C.line, sw: 1.4, r: 12 }),
    distillation(308, 26),
    // 下段：抽出（左）／クロマト（右）
    rect(14, 348, 264, 300, { fill: C.panel, stroke: C.line, sw: 1.4, r: 12 }),
    extraction(30, 360),
    rect(292, 348, 574, 300, { fill: C.panel, stroke: C.line, sw: 1.4, r: 12 }),
    chromatography(400, 360),
    // フッター
    tx(W / 2, H - 24, 'いずれも「混合物 → 純物質」に分ける操作。何の差を利用しているかで区別する。',
      { size: 12.5, cls: 't b', fill: C.sub }),
  ].join('\n');
  return svg(W, H, body, {
    title: '分離・精製の主な装置と方法（ろ過・蒸留・抽出・クロマトグラフィー）',
    desc: 'ろ過は固体と液体、蒸留は沸点の差、抽出は溶けやすさの差、クロマトグラフィーは吸着・移動しやすさの差を利用して混合物を分離する。',
  });
}

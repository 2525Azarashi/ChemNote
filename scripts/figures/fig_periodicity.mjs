/**
 * 1-2 価電子・イオン化エネルギー・電子親和力の周期性グラフ（3枚組）。
 * 元は別々のサイトから拾った3枚で、軸の目盛りも書式もバラバラだった
 * （イオン化エネルギーの図は 1500 が2回出てくる誤記もあった）。
 * 3つとも同じ体裁で描き直し、「縦軸の最大値で見分ける」という試験のコツを添える。
 */
import { C, svg, tx, rect, line, path, circle, makeScale, axes, polyline, smooth, caption } from './lib.mjs';

/** 価電子の数（原子番号1〜20）— 貴ガスは0 */
const VALENCE = [1,0, 1,2,3,4,5,6,7,0, 1,2,3,4,5,6,7,0, 1,2];

/** 第一イオン化エネルギー kJ/mol（実測値） */
const IE = [1312,2372, 520,899,801,1086,1402,1314,1681,2081,
            496,738,578,787,1012,1000,1251,1521, 419,590];

/** 電子親和力 kJ/mol（正の値が大きいほど陰イオンになりやすい） */
const EA = [73,0, 60,0,27,122,0,141,328,0,
            53,0,42,134,72,200,349,0, 48,2];

const SYM = ['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca'];

/** 1枚のグラフを描く */
function graph(ox, oy, w, h, {
  title, yLabel, yMax, yTicks, data, color, colorL, peaks, troughs, note, curve = false,
}) {
  const g = [];
  g.push(rect(ox, oy, w, h, { fill: C.panel, stroke: C.line, sw: 1.5, r: 12 }));
  g.push(caption(ox + 12, oy + 12, w - 24, title));

  // 縦方向の割り付け（h=300 のとき）
  //   oy+12〜38  見出し
  //   oy+52〜202 グラフ本体      → 目盛り数字 oy+217 / 軸名 oy+236
  //   oy+250〜288 まとめコメント
  const PLOT_TOP = 52;
  const PLOT_BOTTOM = h - 98;
  const sc = makeScale({
    x0: ox + 58, y0: oy + PLOT_TOP, w: w - 82, h: PLOT_BOTTOM - PLOT_TOP,
    xMin: 0, xMax: 21, yMin: 0, yMax,
  });
  g.push(axes(sc, {
    xTicks: [1, 5, 10, 15, 20],
    yTicks,
    xLabel: '原子番号',
    grid: true,
    tickSize: 10,
  }));
  // y軸ラベル（目盛り数字の左端 = x0-9-数字幅 よりさらに左に置く）
  g.push(tx(ox + 15, oy + (PLOT_TOP + PLOT_BOTTOM) / 2, yLabel, { size: 11, cls: 't b', rotate: -90 }));

  const pts = data.map((v, i) => [i + 1, v]);
  // 面
  const areaD = `${curve ? smooth(sc, pts) : polyline(sc, pts)} L${sc.X(20)},${sc.Y(0)} L${sc.X(1)},${sc.Y(0)} Z`;
  g.push(path(areaD, { fill: colorL, stroke: 'none', sw: 0, opacity: 0.55 }));
  // 線
  g.push(path(curve ? smooth(sc, pts) : polyline(sc, pts), { stroke: color, sw: 2.4 }));
  // 点
  pts.forEach(([x, y]) => {
    g.push(circle(sc.X(x), sc.Y(y), 2.8, { fill: C.white, stroke: color, sw: 1.6 }));
  });

  // 元素記号のラベルは白い丸ピルにのせる。
  // ・上に余白があれば点の上、なければ点の下（ただしプロット枠の内側）に置く
  // ・軸の目盛り数字（枠の下）とは絶対に重ならない
  const label = (z, col) => {
    const px = sc.X(z);
    const py = sc.Y(data[z - 1]);
    const up = py - sc.y0 > 26;             // 上に余白があるか
    const ly = up ? py - 15 : py + 15;
    const rw = 22;
    g.push(circle(px, py, 4.4, { fill: col, stroke: C.white, sw: 1.4 }));
    g.push(rect(px - rw / 2, ly - 9, rw, 18, { fill: C.white, stroke: col, sw: 1.1, r: 9 }));
    g.push(tx(px, ly, SYM[z - 1], { size: 10.5, cls: 't eb', fill: col }));
  };
  (peaks || []).forEach((z) => label(z, C.red));
  (troughs || []).forEach((z) => label(z, C.blue));

  if (note) {
    g.push(rect(ox + 12, oy + h - 44, w - 24, 34, { fill: C.white, stroke: C.line, sw: 1.2, r: 8 }));
    g.push(tx(ox + w / 2, oy + h - 27, note, { size: 11, cls: 't b', fill: C.accentD }));
  }
  return g.join('\n');
}

export function build() {
  const W = 880;
  const H = 720;
  const g = [];

  const GW = 420;
  const GH = 300;

  // 左上：価電子
  g.push(graph(14, 14, GW, GH, {
    title: '価電子の数',
    yLabel: '価電子の数',
    yMax: 8,
    yTicks: [0, 2, 4, 6, 8],
    data: VALENCE,
    color: C.teal,
    colorL: C.tealL,
    peaks: [9, 17],
    troughs: [2, 10, 18],
    note: '縦軸の最大値が 8 → 価電子のグラフ',
  }));

  // 右上：イオン化エネルギー
  g.push(graph(446, 14, GW, GH, {
    title: '第一イオン化エネルギー',
    yLabel: 'kJ/mol',
    yMax: 2600,
    yTicks: [0, 500, 1000, 1500, 2000, 2500],
    data: IE,
    color: C.red,
    colorL: C.redL,
    peaks: [2, 10, 18],
    troughs: [3, 11, 19],
    curve: true,
    note: '縦軸が数千 kJ/mol → イオン化エネルギー',
  }));

  // 左下：電子親和力
  g.push(graph(14, 330, GW, GH, {
    title: '電子親和力',
    yLabel: 'kJ/mol',
    yMax: 400,
    yTicks: [0, 100, 200, 300, 400],
    data: EA,
    color: C.blue,
    colorL: C.blueL,
    peaks: [9, 17],
    troughs: [2, 10, 18],
    curve: true,
    note: '縦軸が数百 kJ/mol → 電子親和力',
  }));

  /* ========== 右下：見分け方のまとめ ========== */
  const px = 446, py = 330;
  g.push(rect(px, py, GW, GH, { fill: C.accentL, stroke: C.lineD, sw: 1.6, r: 12 }));
  g.push(caption(px + 12, py + 12, GW - 24, '3つのグラフの見分け方', { bg: C.white }));

  const rows = [
    ['価電子の数', '0 〜 8', C.teal, '貴ガスで 0 に落ちる'],
    ['イオン化エネルギー', '〜 2500', C.red, '貴ガスが山・アルカリ金属が谷'],
    ['電子親和力', '〜 400', C.blue, 'ハロゲンが山（F・Cl が大きい）'],
  ];
  rows.forEach(([name, range, col, feature], i) => {
    const y = py + 62 + i * 62;
    g.push(rect(px + 16, y, GW - 32, 52, { fill: C.white, stroke: col, sw: 1.6, r: 9 }));
    g.push(rect(px + 16, y, 6, 52, { fill: col, stroke: 'none', sw: 0, r: 3 }));
    g.push(tx(px + 32, y + 17, name, { size: 12.5, anchor: 'start', cls: 't eb', fill: col }));
    g.push(tx(px + GW - 32, y + 17, `縦軸 ${range}`, { size: 12, anchor: 'end', cls: 't eb', fill: C.ink }));
    g.push(tx(px + 32, y + 37, feature, { size: 11, anchor: 'start', cls: 's b' }));
  });

  g.push(rect(px + 16, py + 250, GW - 32, 38, { fill: C.white, stroke: C.red, sw: 1.5, r: 9 }));
  g.push(tx(px + GW / 2, py + 269, '⚠ 共通テストでは「縦軸の数値」だけで即断できる',
    { size: 11.5, cls: 't eb', fill: C.red }));

  return svg(W, H, g.join('\n'), {
    title: '価電子の数・第一イオン化エネルギー・電子親和力の周期性',
    desc: '価電子は0〜8、イオン化エネルギーは数千kJ/molで貴ガスが山、電子親和力は数百kJ/molでハロゲンが山になる。縦軸の最大値で3つのグラフを見分けられる。',
  });
}

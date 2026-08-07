/**
 * 1-1 分離・精製の装置図（ろ過・蒸留・抽出・ペーパークロマトグラフィー）
 *
 * 【この版で作り直した理由】
 * ろ過の図が小さく、器具として成立していなかった。
 *   - ガラス棒がろ紙の「1枚側」に当たっていた（正しくは3枚重なった側）。
 *   - ろうとの足がビーカーの内壁に触れているのか読み取れなかった。
 *   - ろ紙をどう折って円すいにするのかが図に無く、「3枚側」の意味が伝わらない。
 *   - 図中の番号と手順の説明が結びついていない場所があった。
 * そこで、ろ過を独立した段（横幅いっぱい）に格上げし、
 *   ①装置図　②ろ紙の折り方（4コマ）　③番号つきの注意点
 * の3点セットにした。
 *
 * 【番号の付け方の方針】
 * 入試で問われるのは「ろ紙の折る順番」ではなく、
 * ガラス棒を当てる位置・ろうとの足の向きなどの《注意点》。
 * そこで番号は紫の丸バッジ（＝注意点）だけに使い、
 * ろ紙の折り方は矢印で順番を示すだけの図解にとどめている。
 * 図中の紫の丸番号と右の「ろ過の注意点」は必ず同じ番号で対応する。
 * 蒸留・抽出・クロマトも同じ規則（紫の丸＝注意点）で統一している。
 *
 * 配置（W=940 / H=1112）
 *   1段目：蒸留（横幅いっぱい）
 *   2段目：ろ過（横幅いっぱい）… 装置図／ろ紙の折り方／手順
 *   3段目：抽出／ペーパークロマトグラフィー
 */
import { C, svg, tx, txLines, rect, line, path, circle, ellipse, arrowDefs, caption } from './lib.mjs';

const ar = arrowDefs([C.ink, C.blue, C.accent, C.red, C.amber, C.sub]);

/* ---------- 小さな共通パーツ ---------- */

/** 手順と対応する丸番号バッジ（図の中に置く目印。紫＝手順の番号） */
function mark(x, y, n, { r = 9.5, bg = C.accent } = {}) {
  return `${circle(x, y, r, { fill: bg, stroke: C.white, sw: 2 })}
${tx(x, y + 0.5, String(n), { size: 11, fill: C.white, cls: 't eb' })}`;
}

/** 引き出し線（細い実線） */
function leader(x1, y1, x2, y2) {
  return line(x1, y1, x2, y2, { stroke: C.faint, sw: 1.1 });
}

/** 点の並びから多角形パスをつくる */
function poly(arr, close = true) {
  return `M${arr.map((p) => `${p[0]},${p[1]}`).join(' L')}${close ? ' Z' : ''}`;
}

/**
 * 丸番号つきの説明ボックス。
 * 図の中のバッジと同じ番号・同じ色にして、「①はここ」と迷わないようにする。
 */
function numberedBox(x, y, w, h, title, items, { note, lh = 16.5, gap = 5, size = 10.5 } = {}) {
  const g = [];
  g.push(rect(x, y, w, h, { fill: C.white, stroke: C.lineD, sw: 1.6, r: 12 }));
  g.push(rect(x, y, w, 28, { fill: C.accentL, stroke: 'none', sw: 0, r: 12 }));
  g.push(rect(x, y + 18, w, 10, { fill: C.accentL, stroke: 'none', sw: 0, r: 0 }));
  g.push(tx(x + w / 2, y + 14, title, { size: 12, cls: 't eb', fill: C.accentD }));
  let cy = y + 46;
  items.forEach(([n, lines]) => {
    g.push(circle(x + 18, cy, 7.5, { fill: C.accent, stroke: 'none', sw: 0 }));
    g.push(tx(x + 18, cy + 0.5, String(n), { size: 9.5, fill: C.white, cls: 't eb' }));
    lines.forEach((l, i) => {
      g.push(tx(x + 32, cy + i * lh, l, { size, anchor: 'start', cls: 't' }));
    });
    cy += lines.length * lh + gap;
  });
  if (note) {
    const ny = y + h - 14 - (note.length - 1) * 15;
    g.push(line(x + 14, ny - 16, x + w - 14, ny - 16, { stroke: C.line, sw: 1 }));
    g.push(txLines(x + 16, ny, note, { size: 9.8, anchor: 'start', cls: 's', lh: 15 }));
  }
  return g.join('\n');
}

/* ==================================================================
   1段目：蒸留（横幅いっぱい）
   ================================================================== */
function distillation() {
  const g = [];
  g.push(caption(26, 24, 888, '蒸留 ― 沸点の差で液体どうしを分ける'));

  /* ---- 枝付きフラスコ ---- */
  const fx = 150;
  // 首＋球（球の中心はおよそ y=224、半径 42）
  g.push(path(`M${fx - 12},100 L${fx - 12},184 A42,42 0 1,0 ${fx + 12},184 L${fx + 12},100`,
    { fill: C.white, stroke: C.ink, sw: 2.2 }));
  // 中の液（球の下半分。液量はフラスコの半分以下＝突沸を防ぐ基本）
  g.push(path('M112,242 A42,42 0 0,0 188,242 Z', { fill: C.blueL, stroke: 'none', sw: 0 }));
  g.push(path('M112,242 L188,242', { stroke: C.blue, sw: 1.5 }));
  // 沸騰石
  g.push(circle(128, 256, 3, { fill: C.faint, stroke: 'none', sw: 0 }));
  g.push(circle(150, 260, 3, { fill: C.faint, stroke: 'none', sw: 0 }));
  g.push(circle(170, 253, 3, { fill: C.faint, stroke: 'none', sw: 0 }));
  // 立ちのぼる蒸気（点線の曲線）
  g.push(path('M144,236 q-8,-22 2,-40 q10,-16 4,-32', { stroke: C.grayD, sw: 1.3, dash: '3 5' }));
  g.push(path('M166,238 q8,-20 0,-38', { stroke: C.grayD, sw: 1.3, dash: '3 5' }));

  /* ---- 温度計（球部を枝の高さにそろえる） ---- */
  g.push(rect(143, 64, 14, 108, { fill: C.white, stroke: C.ink, sw: 1.5, r: 7 }));
  for (let i = 0; i < 5; i++) {
    g.push(line(150, 80 + i * 16, 156, 80 + i * 16, { stroke: C.grayD, sw: 1 }));
  }
  g.push(line(150, 166, 150, 88, { stroke: C.red, sw: 3.4 }));
  g.push(circle(150, 167, 5.5, { fill: C.red, stroke: 'none', sw: 0 }));
  // 枝の高さを示す補助線
  g.push(line(158, 167, 246, 167, { stroke: C.red, sw: 1, dash: '4 4', opacity: 0.75 }));

  /* ---- 枝（フラスコ → 冷却器） ---- */
  g.push(path(poly([[162, 152], [242, 174], [242, 186], [162, 164]]), { fill: C.white, stroke: C.ink, sw: 2 }));

  /* ---- リービッヒ冷却器（内管＋外管＋冷却水の出入口） ---- */
  const A = [240, 180];
  const B = [524, 246];
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
  const ux = (B[0] - A[0]) / L;
  const uy = (B[1] - A[1]) / L;
  const nx = -uy;
  const ny = ux;
  const P = (t, s) => [
    Math.round((A[0] + ux * t + nx * s) * 10) / 10,
    Math.round((A[1] + uy * t + ny * s) * 10) / 10,
  ];

  // 外管（ジャケット）＝冷却水が満たされる部分。両端はすぼまって内管につながる。
  g.push(path(poly([P(30, -7), P(46, -20), P(256, -20), P(272, -7), P(272, 7), P(256, 20), P(46, 20), P(30, 7)]),
    { fill: C.blueL, stroke: C.ink, sw: 2 }));
  // 外管の中の冷却水の流れ（低い側 → 高い側＝蒸気と逆向き）
  g.push(path(`M${P(232, 13).join(',')} L${P(86, 13).join(',')}`,
    { stroke: C.blue, sw: 1.8, marker: ar.id(C.blue), opacity: 0.9 }));
  // 内管＝蒸気の通り道。外管より長く、両端が飛び出す。
  g.push(path(poly([P(-16, -7), P(316, -7), P(316, 7), P(-16, 7)]),
    { fill: C.white, stroke: C.ink, sw: 2 }));
  // 内管の中身：入口側は蒸気（点）、出口側は冷えて液体（青線）
  [10, 34, 58, 82].forEach((t, i) => {
    g.push(circle(...P(t, i % 2 ? 2 : -2), 2.2, { fill: C.grayD, stroke: 'none', sw: 0 }));
  });
  g.push(path(`M${P(206, 3).join(',')} L${P(312, 3).join(',')}`, { stroke: C.blue, sw: 2.6, opacity: 0.85 }));

  // 冷却水の出口（高い側＝フラスコ寄り。上へ抜ける）
  g.push(path(poly([P(56, -19), P(56, -50), P(68, -50), P(68, -19)]),
    { fill: C.white, stroke: C.ink, sw: 1.8 }));
  g.push(path(`M${P(54, -50).join(',')} L${P(70, -50).join(',')}`, { stroke: C.ink, sw: 2.4 }));
  g.push(path(`M${P(62, -58).join(',')} L${P(62, -92).join(',')}`,
    { stroke: C.blue, sw: 2.6, marker: ar.id(C.blue) }));
  // 冷却水の入口（低い側＝受け器寄り。下から入れる）
  g.push(path(poly([P(234, 19), P(234, 50), P(246, 50), P(246, 19)]),
    { fill: C.white, stroke: C.ink, sw: 1.8 }));
  g.push(path(`M${P(232, 50).join(',')} L${P(248, 50).join(',')}`, { stroke: C.ink, sw: 2.4 }));
  g.push(path(`M${P(240, 92).join(',')} L${P(240, 58).join(',')}`,
    { stroke: C.blue, sw: 2.6, marker: ar.id(C.blue) }));

  /* ---- スタンドのクランプ（冷却器を固定する） ---- */
  g.push(rect(400, 344, 60, 9, { fill: C.gray, stroke: C.grayD, sw: 1.2, r: 3 }));
  g.push(rect(426, 246, 8, 100, { fill: C.gray, stroke: C.grayD, sw: 1.2, r: 3 }));
  g.push(rect(419, 234, 22, 14, { fill: C.grayD, stroke: C.sub, sw: 1.2, r: 4 }));

  /* ---- アダプター → 三角フラスコ（受け器） ---- */
  g.push(path(poly([[550.4, 243.6], [586.4, 281.6], [577.6, 290.4], [541.6, 252.4]]),
    { fill: C.white, stroke: C.ink, sw: 2 }));
  g.push(path('M570,284 L570,302', { stroke: C.ink, sw: 2 }));
  g.push(path('M594,284 L594,302', { stroke: C.ink, sw: 2 }));
  g.push(path('M570,302 L542,340 Q539,346 546,346 L618,346 Q625,346 622,340 L594,302',
    { fill: C.white, stroke: C.ink, sw: 2.2 }));
  g.push(path('M554,328 L550,344 L614,344 L610,328 Z', { fill: C.blueL, stroke: C.blue, sw: 1.2 }));
  g.push(circle(582, 314, 3, { fill: C.blue, stroke: 'none', sw: 0 }));

  /* ---- 三脚・金網・ガスバーナー ---- */
  g.push(rect(102, 268, 96, 7, { fill: C.gray, stroke: C.grayD, sw: 1.2, r: 2 }));
  for (let i = 0; i < 7; i++) {
    g.push(line(108 + i * 13, 268, 108 + i * 13, 275, { stroke: C.grayD, sw: 0.9 }));
  }
  g.push(line(102, 272, 198, 272, { stroke: C.ink, sw: 2.4 }));
  g.push(line(110, 272, 94, 352, { stroke: C.ink, sw: 2.4 }));
  g.push(line(190, 272, 206, 352, { stroke: C.ink, sw: 2.4 }));
  g.push(path('M140,326 Q142,300 150,282 Q158,300 160,326 Z', { fill: C.amber, stroke: 'none', sw: 0 }));
  g.push(path('M145,326 Q147,308 150,296 Q153,308 155,326 Z', { fill: '#f7dc9a', stroke: 'none', sw: 0 }));
  g.push(rect(140, 326, 20, 26, { fill: C.white, stroke: C.ink, sw: 1.6, r: 3 }));
  // 実験台
  g.push(line(64, 352, 664, 352, { stroke: C.ink, sw: 2.6 }));

  /* ---- ラベル ---- */
  g.push(tx(110, 76, '温度計', { size: 11, anchor: 'end', cls: 's b' }));
  g.push(leader(114, 76, 141, 76));
  // 「球部は枝の高さ」は装置の右に置くと蒸気の矢印とぶつかるので、左の空きへ出す
  g.push(tx(28, 148, '球部は枝の高さ', { size: 10.5, anchor: 'start', cls: 's b', fill: C.red }));
  g.push(line(130, 152, 144, 163, { stroke: C.red, sw: 1, dash: '3 3', opacity: 0.8 }));
  g.push(tx(32, 206, '枝付きフラスコ', { size: 10.5, anchor: 'start', cls: 's b' }));
  g.push(leader(106, 208, 118, 214));
  g.push(tx(228, 268, '沸騰石', { size: 10.5, anchor: 'start', cls: 's b' }));
  g.push(leader(226, 266, 180, 256));
  g.push(tx(392, 156, 'リービッヒ冷却器', { size: 11.5, cls: 't b', fill: C.accentD }));
  g.push(leader(392, 166, 392, 192));
  g.push(tx(330, 96, '冷却水（出）', { size: 10.5, cls: 's b', fill: C.blue }));
  g.push(tx(464, 336, '冷却水（入）', { size: 10.5, anchor: 'start', cls: 's b', fill: C.blue }));
  g.push(tx(300, 300, '内管＝蒸気　外管＝冷却水', { size: 10.5, cls: 's b' }));
  g.push(leader(302, 290, 334, 226));
  g.push(tx(388, 340, 'クランプで固定', { size: 9.5, anchor: 'end', cls: 'f b' }));
  g.push(leader(392, 338, 418, 330));
  g.push(tx(528, 320, '留出液', { size: 10.5, anchor: 'end', cls: 's b', fill: C.blue }));
  g.push(leader(532, 322, 556, 334));
  g.push(tx(660, 332, '三角フラスコ（受け器）', { size: 10.5, anchor: 'start', cls: 's b' }));
  g.push(leader(656, 334, 624, 340));

  /* ---- 手順と対応する丸番号 ---- */
  g.push(mark(120, 148, 1));           // 温度計の球部＝枝の高さ
  g.push(mark(212, 268, 2));           // 沸騰石
  g.push(mark(450, 336, 3));           // 冷却水は下から入れる
  g.push(leader(100, 244, 112, 244));
  g.push(mark(88, 244, 4));            // 液量はフラスコの半分以下
  g.push(leader(614, 300, 600, 306));
  g.push(mark(624, 297, 5));           // 三角フラスコは密栓しない

  /* ---- 「ここが問われる」ボックス ---- */
  g.push(numberedBox(650, 76, 270, 246, '蒸留でここが問われる', [
    [1, ['温度計の球部は「枝の高さ」に置く', '出ていく蒸気の温度をはかるため']],
    [2, ['沸騰石を入れて突沸（急な沸騰）を防ぐ']],
    [3, ['冷却水は下（低い側）から入れて', '上（高い側）から出す', '管が水で満たされ、蒸気と逆向きに', '流れるので効率よく冷やせる']],
    [4, ['液の量はフラスコの半分以下にする']],
    [5, ['三角フラスコは密栓しない', '圧力が上がって危険だから']],
  ], { lh: 16.5, gap: 5 }));

  return g.join('\n');
}

/* ==================================================================
   2段目：ろ過（横幅いっぱい）
   ================================================================== */
function filtration() {
  const g = [];
  g.push(caption(26, 404, 888, 'ろ過 ― 粒の大きさの差で固体と液体を分ける'));

  /* ================= 装置図 ================= */

  /* ---- ろうと台（スタンド） ---- */
  g.push(rect(34, 700, 96, 12, { fill: C.gray, stroke: C.grayD, sw: 1.3, r: 3 }));
  g.push(rect(56, 452, 10, 250, { fill: C.gray, stroke: C.grayD, sw: 1.3, r: 3 }));
  g.push(rect(64, 545, 108, 7, { fill: C.gray, stroke: C.grayD, sw: 1.2, r: 3 }));

  /* ---- ろうと（円すい＋足） ----
     足の先は斜めに切れていて、長いほう（ここでは左）をビーカーの内壁につける。
     先端の y はビーカーの左壁上の点に揃えてある。 */
  g.push(path('M134,490 L191,578 L191,662 L205,642 L205,578 L258,490',
    { fill: C.white, stroke: C.ink, sw: 2.2 }));

  /* ---- ろ紙（4つ折りを開いた円すい。手前の縁は弧になる） ---- */
  g.push(path('M140,493 A56,12 0 0,0 252,493 L196,573 Z', { fill: C.amberL, stroke: C.amber, sw: 1.4 }));
  // 3枚重なっている側（右半分）を濃く塗る
  g.push(path('M196,505 Q225,503 252,493 L196,573 Z', { fill: '#f0d5a2', stroke: 'none', sw: 0 }));
  // 折り目（手前のいちばん低い点から先端へ）
  g.push(line(196, 505, 196, 573, { stroke: C.amber, sw: 1.5 }));
  // 奥側の縁は見えないので破線
  g.push(path('M140,493 A56,12 0 0,1 252,493', { stroke: C.amber, sw: 1.2, dash: '4 3' }));
  g.push(tx(173, 508, '1枚', { size: 10, cls: 't b', fill: '#8a5a12' }));
  g.push(tx(220, 508, '3枚', { size: 10, cls: 't eb', fill: '#7a4c08' }));
  // ろ紙の上に残る固体（沈殿）。リングと重ならない高さに集める
  g.push(circle(185, 526, 2.7, { fill: C.grayD, stroke: 'none', sw: 0 }));
  g.push(circle(196, 533, 2.7, { fill: C.grayD, stroke: 'none', sw: 0 }));
  g.push(circle(207, 524, 2.7, { fill: C.grayD, stroke: 'none', sw: 0 }));
  g.push(circle(196, 519, 2.7, { fill: C.grayD, stroke: 'none', sw: 0 }));

  /* ---- ろうとの縁（手前に見えるので最後に描く） ---- */
  g.push(ellipse(196, 490, 62, 14, { fill: 'none', stroke: C.ink, sw: 2.2 }));
  /* ---- ろうと台のリング（ろうとの外側を囲んで支える） ----
     全周を描くと円すいの中に線が入って「ろ紙の上の輪」に見えてしまうので、
     向こう側（上の弧）は細い破線、手前側（下の弧）だけを太い実線で描く。 */
  g.push(path('M169,548 A27,7 0 0,0 223,548', { stroke: C.grayD, sw: 3.4 }));
  g.push(path('M169,548 A27,7 0 0,1 223,548', { stroke: C.grayD, sw: 1.2, dash: '4 3' }));

  /* ---- 受けビーカー（ろうとの足が内壁に触れる） ---- */
  g.push(path('M187,600 L191,700 Q192,706 198,706 L314,706 Q320,706 321,700 L325,600',
    { fill: 'none', stroke: C.ink, sw: 2.2 }));
  g.push(path('M192,668 L195,702 L313,702 L316,668 Z', { fill: C.blueL, stroke: C.blue, sw: 1.2 }));
  // 足の先が内壁についていることを強調する短い赤線
  g.push(line(189, 654, 189, 664, { stroke: C.red, sw: 2.6 }));
  // ろ液は内壁を伝って落ちる（はねない）
  g.push(path('M190,662 Q192,666 194,672', { stroke: C.blue, sw: 2.4 }));

  /* ---- 注ぐビーカーとガラス棒 ----
     見出し帯（y=404〜430）に食い込まないよう、ビーカーの上端は y=436 より下に置く。 */
  g.push(path('M292,454 L308,508 L376,490 L360,436', { fill: C.white, stroke: C.ink, sw: 2 }));
  // ビーカーを傾けても液面は水平のまま（器と一緒に傾けない）
  g.push(path('M296.7,470 L308,507 L375,490 L370.1,470 Z', { fill: C.blueL, stroke: C.blue, sw: 1.2 }));
  g.push(path('M292,454 l-9,3 l7,5', { fill: 'none', stroke: C.ink, sw: 2 }));
  // ガラス棒（下端は必ず「3枚側」＝ろ紙の右半分の上のほうに当てる）
  g.push(line(298, 462, 234, 494, { stroke: '#ded8ea', sw: 8, cap: 'round' }));
  g.push(line(296, 465, 236, 492, { stroke: C.white, sw: 2, cap: 'round', opacity: 0.9 }));
  // ガラス棒を伝って落ちる液
  g.push(path('M289,461 Q295,466 300,468 L240,498', { stroke: C.blue, sw: 2.4 }));

  /* ---- ラベル（左＝支持具、右＝操作。引き出し線が交差しないよう振り分ける） ---- */
  g.push(tx(130, 462, 'ろ紙', { size: 10.5, anchor: 'end', cls: 's b' }));
  g.push(tx(128, 516, 'ろうと', { size: 10.5, anchor: 'end', cls: 's b' }));
  g.push(leader(132, 516, 152, 516));
  g.push(tx(128, 582, 'ろうと台（リング）', { size: 10.5, anchor: 'end', cls: 's b' }));
  g.push(tx(252, 444, 'ガラス棒', { size: 10.5, cls: 's b' }));
  g.push(leader(258, 452, 272, 476));
  g.push(tx(272, 526, '沈殿（固体）', { size: 10.5, anchor: 'start', cls: 's b' }));
  g.push(leader(268, 526, 216, 526));
  g.push(tx(334, 676, 'ろ液', { size: 10.5, anchor: 'start', cls: 's b', fill: C.blue }));
  g.push(leader(332, 678, 314, 682));
  g.push(tx(334, 702, 'ビーカー', { size: 10.5, anchor: 'start', cls: 's b' }));
  g.push(leader(332, 700, 318, 698));

  /* ---- 手順と対応する丸番号 ---- */
  g.push(leader(152, 466, 172, 484));
  g.push(mark(142, 462, 1));   // ろ紙は4つ折り／3枚側にガラス棒
  g.push(leader(276, 496, 258, 484));
  g.push(mark(286, 500, 2));   // ガラス棒を伝わらせて注ぐ
  g.push(leader(158, 658, 184, 660));
  g.push(mark(148, 658, 3));   // 足の長いほうを内壁につける
  g.push(mark(282, 684, 4));   // ろ液と沈殿
  g.push(leader(152, 578, 174, 554));
  g.push(mark(142, 582, 5));   // ろうと台のリングで固定

  /* ================= ろ紙の折り方（4コマ） ================= */
  const bx = 452;
  g.push(rect(bx, 436, 190, 288, { fill: C.white, stroke: C.lineD, sw: 1.6, r: 12 }));
  g.push(rect(bx, 436, 190, 28, { fill: '#fdf2dc', stroke: 'none', sw: 0, r: 12 }));
  g.push(rect(bx, 454, 190, 10, { fill: '#fdf2dc', stroke: 'none', sw: 0, r: 0 }));
  g.push(tx(bx + 95, 450, 'ろ紙の折り方', { size: 12, cls: 't eb', fill: '#8a5a12' }));

  const paper = '#fffdf6';
  // 1 円形のろ紙
  g.push(circle(500, 512, 30, { fill: paper, stroke: C.amber, sw: 1.6 }));
  g.push(line(470, 512, 530, 512, { stroke: C.amber, sw: 1.1, dash: '4 3' }));
  g.push(line(500, 482, 500, 542, { stroke: C.amber, sw: 1.1, dash: '4 3' }));
  g.push(tx(500, 556, '円形のろ紙', { size: 10, cls: 's b' }));
  // 2 半分に折る
  g.push(path('M564,527 A30,30 0 0,1 624,527 Z', { fill: paper, stroke: C.amber, sw: 1.6 }));
  g.push(line(594, 497, 594, 527, { stroke: C.amber, sw: 1.1, dash: '4 3' }));
  g.push(tx(594, 556, '半分に折る', { size: 10, cls: 's b' }));
  // 3 さらに半分（四つ折り）
  g.push(path('M500,637 L530,637 A30,30 0 0,0 500,607 Z', { fill: paper, stroke: C.amber, sw: 1.6 }));
  g.push(tx(500, 666, 'さらに半分', { size: 10, cls: 's b' }));
  // 4 開いて円すいに（1枚側と3枚側ができる）
  g.push(path('M568,606 A26,6 0 0,0 620,606 L594,644 Z', { fill: C.amberL, stroke: C.amber, sw: 1.5 }));
  g.push(path('M594,612 Q607,611 620,606 L594,644 Z', { fill: '#f0d5a2', stroke: 'none', sw: 0 }));
  g.push(line(594, 612, 594, 644, { stroke: C.amber, sw: 1.3 }));
  g.push(path('M568,606 A26,6 0 0,1 620,606', { stroke: C.amber, sw: 1.1, dash: '3 3' }));
  g.push(tx(578, 620, '1', { size: 9, cls: 't b', fill: '#8a5a12' }));
  g.push(tx(608, 619, '3', { size: 9, cls: 't eb', fill: '#7a4c08' }));
  g.push(txLines(594, 660, ['開いて円すいに', '（1枚側と3枚側）'], { size: 10, cls: 's b', lh: 14 }));
  // 順番の矢印
  g.push(path('M536,512 L556,512', { stroke: C.amber, sw: 2, marker: ar.id(C.amber) }));
  g.push(path('M594,566 Q594,586 512,586 L500,596', { stroke: C.amber, sw: 2, marker: ar.id(C.amber), dash: '5 4' }));
  g.push(path('M536,622 L556,622', { stroke: C.amber, sw: 2, marker: ar.id(C.amber) }));
  g.push(tx(bx + 95, 700, '3枚側にガラス棒を当てる', { size: 10.5, cls: 't eb', fill: '#8a5a12' }));
  g.push(tx(bx + 95, 716, '（1枚側は破れやすい）', { size: 9.5, cls: 's' }));

  /* ================= 手順とポイント ================= */
  g.push(numberedBox(656, 436, 264, 288, 'ろ過の注意点（入試で問われる）', [
    [1, ['ろ紙は4つ折りにして開き、', '3枚重なった側にガラス棒を当てる']],
    [2, ['液はガラス棒を伝わらせて', '静かに注ぐ（はねを防ぐ）']],
    [3, ['ろうとの足は長いほうを', 'ビーカーの内壁につける']],
    [4, ['ろ紙を通った液が「ろ液」、', '残った固体が「沈殿（残留物）」']],
    [5, ['ろうと台やスタンドのリングで', '固定して装置を安定させる']],
  ], {
    lh: 16.5,
    gap: 6,
    note: ['分けられるのは「粒の大きさの差」。', '溶けている物質はろ紙を通り抜ける。'],
  }));

  return g.join('\n');
}

/* ==================================================================
   3段目・左：抽出
   ================================================================== */
function extraction() {
  const g = [];
  g.push(caption(26, 764, 428, '抽出 ― 溶けやすさの差で分ける'));
  const cx = 128;
  const y0 = 800;

  // 栓
  g.push(rect(cx - 5, y0, 10, 8, { fill: C.white, stroke: C.ink, sw: 1.5, r: 2 }));
  g.push(path(poly([[cx - 9, y0 + 8], [cx + 9, y0 + 8], [cx + 6, y0 + 22], [cx - 6, y0 + 22]]),
    { fill: C.white, stroke: C.ink, sw: 1.8 }));
  // 首
  g.push(line(cx - 8, y0 + 22, cx - 8, y0 + 42, { stroke: C.ink, sw: 2 }));
  g.push(line(cx + 8, y0 + 22, cx + 8, y0 + 42, { stroke: C.ink, sw: 2 }));
  // 本体（洋なし形）
  g.push(path(poly([[cx - 8, y0 + 42], [cx - 31, y0 + 58], [cx - 31, y0 + 112], [cx, y0 + 168],
    [cx + 31, y0 + 112], [cx + 31, y0 + 58], [cx + 8, y0 + 42]], false),
  { fill: C.white, stroke: C.ink, sw: 2.2 }));
  // 上層（密度が小さい）／下層（密度が大きい）
  g.push(path(poly([[cx - 31, y0 + 66], [cx + 31, y0 + 66], [cx + 31, y0 + 106], [cx - 31, y0 + 106]]),
    { fill: C.amberL, stroke: 'none', sw: 0 }));
  g.push(path(poly([[cx - 31, y0 + 106], [cx + 31, y0 + 106], [cx + 31, y0 + 112], [cx, y0 + 168], [cx - 31, y0 + 112]]),
    { fill: C.blueL, stroke: 'none', sw: 0 }));
  g.push(line(cx - 31, y0 + 66, cx + 31, y0 + 66, { stroke: C.amber, sw: 1.4 }));
  g.push(line(cx - 31, y0 + 106, cx + 31, y0 + 106, { stroke: C.ink, sw: 2 }));
  g.push(path(poly([[cx - 31, y0 + 58], [cx - 31, y0 + 112], [cx, y0 + 168], [cx + 31, y0 + 112], [cx + 31, y0 + 58]], false),
    { stroke: C.ink, sw: 2.2 }));
  // コック
  g.push(line(cx - 15, y0 + 172, cx + 15, y0 + 172, { stroke: C.ink, sw: 3.2 }));
  g.push(circle(cx, y0 + 172, 7, { fill: C.white, stroke: C.ink, sw: 1.8 }));
  g.push(line(cx, y0 + 179, cx, y0 + 198, { stroke: C.ink, sw: 2.6 }));
  g.push(circle(cx, y0 + 209, 3.2, { fill: C.blue, stroke: 'none', sw: 0 }));

  // ラベル
  g.push(tx(cx - 44, y0 + 84, '上層（密度小）', { size: 10, anchor: 'end', cls: 's b', fill: '#b57a1e' }));
  g.push(leader(cx - 42, y0 + 84, cx - 32, y0 + 84));
  g.push(tx(cx - 44, y0 + 132, '下層（密度大）', { size: 10, anchor: 'end', cls: 's b', fill: C.blue }));
  g.push(leader(cx - 42, y0 + 132, cx - 24, y0 + 130));
  g.push(tx(cx + 46, y0 + 46, '分液ろうと', { size: 10, anchor: 'start', cls: 's b' }));
  g.push(leader(cx + 44, y0 + 46, cx + 16, y0 + 44));
  g.push(tx(cx - 44, y0 + 176, 'コック', { size: 10, anchor: 'end', cls: 's b' }));
  g.push(leader(cx - 42, y0 + 176, cx - 10, y0 + 174));

  // 手順と対応する丸番号
  g.push(leader(cx + 30, y0 + 14, cx + 10, y0 + 12));
  g.push(mark(cx + 40, y0 + 14, 1));
  g.push(leader(cx + 46, y0 + 106, cx + 32, y0 + 106));
  g.push(mark(cx + 56, y0 + 106, 2));
  g.push(leader(cx + 32, y0 + 174, cx + 10, y0 + 172));
  g.push(mark(cx + 42, y0 + 176, 3));

  g.push(numberedBox(246, 796, 208, 240, '抽出のポイント', [
    [1, ['よく振り混ぜて静置する。', 'ときどき栓を開けて', '中の圧力を抜く']],
    [2, ['密度の小さい液が上層、', '大きい液が下層になる']],
    [3, ['下層はコックから、', '上層は上の口から出す']],
  ], { lh: 16, gap: 6, note: ['ヨウ素をヘキサンに移すように、', '「溶けやすい溶媒」へ移す操作。'] }));

  return g.join('\n');
}

/* ==================================================================
   3段目・右：ペーパークロマトグラフィー
   ================================================================== */
function chromatography() {
  const g = [];
  g.push(caption(490, 764, 424, 'ペーパークロマトグラフィー ― 吸着・移動しやすさの差で分ける'));

  const paper = '#fffdf6';
  // 「はじめ」のろ紙（点をつけただけの状態）
  g.push(rect(500, 842, 26, 120, { fill: paper, stroke: C.grayD, sw: 1.4, r: 2 }));
  g.push(circle(513, 946, 5, { fill: '#4b3b6b', stroke: 'none', sw: 0 }));
  g.push(tx(513, 830, 'はじめ', { size: 10, cls: 's b' }));

  // つり棒
  g.push(line(548, 822, 692, 822, { stroke: C.grayD, sw: 4 }));
  // ビーカー
  g.push(path('M556,836 L561,1000 Q562,1006 568,1006 L672,1006 Q678,1006 679,1000 L684,836',
    { fill: C.white, stroke: C.ink, sw: 2.2 }));
  // 展開液（水）
  g.push(path('M563,962 L566,1002 L674,1002 L677,962 Z', { fill: C.blueL, stroke: C.blue, sw: 1.2 }));
  // ろ紙
  g.push(rect(604, 818, 36, 180, { fill: paper, stroke: C.grayD, sw: 1.5, r: 2 }));
  // 原線（液面より上につける）
  g.push(line(598, 946, 646, 946, { stroke: C.faint, sw: 1.3, dash: '4 3' }));
  // 分かれた色素
  g.push(rect(608, 856, 28, 10, { fill: '#e0554e', stroke: 'none', sw: 0, r: 4 }));
  g.push(rect(608, 886, 28, 10, { fill: '#e8a83c', stroke: 'none', sw: 0, r: 4 }));
  g.push(rect(608, 916, 28, 10, { fill: '#3f8ecf', stroke: 'none', sw: 0, r: 4 }));
  // 上がっていく向き
  g.push(path('M656,944 L656,852', { stroke: C.blue, sw: 2.2, marker: ar.id(C.blue) }));

  g.push(tx(622, 806, 'ろ紙', { size: 10, cls: 's b' }));
  g.push(tx(600, 932, '原点', { size: 9.5, anchor: 'end', cls: 'f b' }));
  g.push(tx(596, 984, '水', { size: 10, anchor: 'end', cls: 's b', fill: C.blue }));
  g.push(tx(600, 860, '速い', { size: 10, anchor: 'end', cls: 's b', fill: C.red }));
  g.push(tx(600, 906, '遅い', { size: 10, anchor: 'end', cls: 's b', fill: C.blue }));

  // 手順と対応する丸番号（①は「はじめ」のろ紙の点＝原点を指す）
  g.push(leader(513, 970, 513, 954));
  g.push(mark(513, 982, 1));
  g.push(leader(692, 900, 662, 900));
  g.push(mark(701, 900, 2));
  g.push(leader(692, 858, 642, 858));
  g.push(mark(701, 858, 3));

  g.push(numberedBox(716, 796, 204, 240, 'クロマトのポイント', [
    [1, ['原点（インクの点）は', '展開液につけない。', 'つけると溶け出てしまう']],
    [2, ['溶媒がろ紙を上がるとき、', '色素も一緒に運ばれる']],
    [3, ['吸着されにくい成分ほど', '速く、遠くまで上がる']],
  ], { lh: 16, gap: 6, note: ['上がった距離の差で、', '混ざった色素を見分けられる。'] }));

  return g.join('\n');
}

export function build() {
  const W = 940;
  const H = 1112;
  const body = [
    ar.defs,
    // 1段目：蒸留
    rect(14, 14, 912, 366, { fill: C.panel, stroke: C.line, sw: 1.4, r: 14 }),
    distillation(),
    // 2段目：ろ過
    rect(14, 394, 912, 346, { fill: C.panel, stroke: C.line, sw: 1.4, r: 14 }),
    filtration(),
    // 3段目：抽出／クロマトグラフィー
    rect(14, 754, 452, 310, { fill: C.panel, stroke: C.line, sw: 1.4, r: 14 }),
    extraction(),
    rect(478, 754, 448, 310, { fill: C.panel, stroke: C.line, sw: 1.4, r: 14 }),
    chromatography(),
    // フッター
    tx(W / 2, H - 22, 'いずれも「混合物 → 純物質」に分ける操作。何の差を利用しているかで区別する。',
      { size: 12.5, cls: 't b', fill: C.sub }),
  ].join('\n');
  return svg(W, H, body, {
    title: '分離・精製の主な装置と方法（ろ過・蒸留・抽出・ペーパークロマトグラフィー）',
    desc: 'ろ過は粒の大きさ、蒸留は沸点の差、抽出は溶けやすさの差、ペーパークロマトグラフィーは吸着・移動しやすさの差を利用して混合物を分離する。ろ過ではろ紙を4つ折りにして開き、3枚重なった側にガラス棒を当て、ろうとの足の長いほうをビーカーの内壁につける。蒸留ではリービッヒ冷却器の内管を蒸気が通り、外管には冷却水を低い側から入れて高い側から出す。',
  });
}

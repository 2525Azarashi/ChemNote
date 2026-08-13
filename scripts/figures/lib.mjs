/**
 * 学習プリント用オリジナル図版の共通ライブラリ。
 *
 * 【なぜ自作するのか】
 * これまでの図はインターネット上の教材サイトから持ってきた画像をそのまま貼っていた。
 * 権利の面で危ういうえ、出典ごとに配色・字体・線の太さがバラバラで、
 * アプリのデザイン（紫を基調としたノート風）とも噛み合っていなかった。
 * そこで全図版を SVG で描き起こし、以下をそろえる。
 *   - 配色・字体・線幅・角丸をアプリのトークンに統一
 *   - 文字はテキストのまま（＝拡大してもぼやけない・検索や読み上げが効く）
 *   - ファイルサイズが軽い（JPEG の数十分の一）
 */

/** アプリ共通の配色トークン */
export const C = {
  ink: '#2f2740',        // 主たる文字色
  sub: '#6b6280',        // 補助文字
  faint: '#9c93ab',      // さらに薄い文字・補助線
  line: '#c9bce6',       // 枠線（薄紫）
  lineD: '#a794d6',      // 枠線（濃いめ）
  accent: '#7c3aed',     // アクセント（紫）
  accentD: '#5b21b6',    // アクセント（濃紫）
  accentL: '#f3ecff',    // アクセント背景
  panel: '#faf7ff',      // パネル背景
  white: '#ffffff',
  red: '#d94a6a',
  redL: '#fdeef1',
  blue: '#3a7bd5',
  blueL: '#eaf2fc',
  teal: '#1e9e8a',
  tealL: '#e7f6f3',
  amber: '#d9932a',
  amberL: '#fdf4e3',
  green: '#4c9a4c',
  gray: '#dcd7e6',
  grayD: '#b9b1c9',
};

/** 図版で使う和文フォントスタック */
export const FONT =
  "'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP','Noto Sans CJK JP','Yu Gothic','Meiryo',sans-serif";

/** XML 特殊文字のエスケープ */
export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ===== 下付き・上付き文字の安全な描画 =====
   H₂SO₄ のような Unicode の下付き文字（U+2080〜）は、
   日本語フォント（Noto Sans CJK JP など）にグリフが無いことが多く、
   日本語混在テキストではフォントフォールバックの結果
   □（豆腐）になってしまう環境がある。
   そこで Unicode の下付き・上付き文字は使わず、
   「普通の数字＋SVG の tspan で上下にずらす」方式で描く。
   こうすればどのフォントでも必ず表示され、文字としてコピーもできる。 */

/** Unicode の下付き・上付き文字 → 通常文字への対応表 */
const SUB_MAP = {
  '\u2080': '0', '\u2081': '1', '\u2082': '2', '\u2083': '3', '\u2084': '4',
  '\u2085': '5', '\u2086': '6', '\u2087': '7', '\u2088': '8', '\u2089': '9',
  '\u208A': '+', '\u208B': '-', '\u208C': '=', '\u208D': '(', '\u208E': ')',
};
const SUP_MAP = {
  '\u2070': '0', '\u00B9': '1', '\u00B2': '2', '\u00B3': '3', '\u2074': '4',
  '\u2075': '5', '\u2076': '6', '\u2077': '7', '\u2078': '8', '\u2079': '9',
  '\u207A': '+', '\u207B': '\u2212', '\u207C': '=', '\u207D': '(', '\u207E': ')',
  '\u207F': 'n', '\u2071': 'i',
};

/** title / desc / aria-label 用に、Unicode の下付き・上付きを普通の文字へ落とす。
    これらは画面に描画されず読み上げ専用なので、tspan は使えない。
    フォント依存で読み上げが崩れるのを防ぐため平文にしておく。 */
export function plainSubSup(str) {
  return safeGlyphs(str).replace(/[\u2070-\u209F\u00B2\u00B3\u00B9]/g, (ch) => {
    if (Object.prototype.hasOwnProperty.call(SUB_MAP, ch)) return SUB_MAP[ch];
    if (Object.prototype.hasOwnProperty.call(SUP_MAP, ch)) return SUP_MAP[ch] === '\u2212' ? '-' : SUP_MAP[ch];
    return ch;
  });
}

/* ===== グリフが無い記号を安全な記号に寄せる =====
   Noto Sans CJK JP には収録されていない記号がいくつかあり、
   そのまま書くと □（豆腐）になって文字化けに見える。
   ここで「意味の同じ、収録されている記号」に置き換えてしまう。
   例）≒（U+2252）は Noto Sans CJK JP に無い → ≈（U+2248）にする。 */
const GLYPH_FALLBACK = {
  '\u2252': '\u2248', // ≒ → ≈（ほぼ等しい）
  '\u2247': '\u2249', // ≇ → ≉
  '\u2A75': '==',     // ⩵ → ==
  '\uFF5E': '\u301C', // ～（全角チルダ）→ 〜（波ダッシュ。和文フォントに確実にある）
};

/** 描画テキストからグリフ欠けの危険な記号を追い出す */
export function safeGlyphs(str) {
  let s = String(str);
  for (const [from, to] of Object.entries(GLYPH_FALLBACK)) {
    if (s.includes(from)) s = s.split(from).join(to);
  }
  return s;
}

/** SVG のルート要素を組み立てる */
export function svg(w, h, body, { title = '', desc = '' } = {}) {
  title = plainSubSup(title);
  desc = plainSubSup(desc);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img"${title ? ` aria-label="${esc(title)}"` : ''}>
<title>${esc(title)}</title>${desc ? `\n<desc>${esc(desc)}</desc>` : ''}
<style>
  .t{font-family:${FONT};fill:${C.ink};}
  .s{font-family:${FONT};fill:${C.sub};}
  .f{font-family:${FONT};fill:${C.faint};}
  .b{font-weight:700;}
  .eb{font-weight:800;}
  text{dominant-baseline:middle;}
</style>
<rect x="0" y="0" width="${w}" height="${h}" fill="${C.white}"/>
${body}
</svg>
`;
}

/** 文字列に下付き・上付きが含まれるか（tspan を使う必要があるか） */
export function hasSubSup(str) {
  return /[\u2070-\u209F\u00B2\u00B3\u00B9]/.test(String(str));
}

/** 下付き・上付きを tspan に変換しつつ XML エスケープする。
    dy はカーソルを動かしてしまうので、次に出す文字の tspan で必ず戻す
    （空の tspan やゼロ幅スペースは使わない＝それ自体が豆腐になる環境を避ける）。

    ★重要★ ここが返す markup は **text-anchor="start" の <text> にしか入れてはいけない。**
    ブラウザ以外の SVG レンダラ（cairosvg / librsvg / resvg など。図の目視検証や
    サーバ側でのPNG化に使う）は「text-anchor と 複数 tspan」の組み合わせで
    各 tspan の送り幅を正しく積み上げられず、
      H₂SO₄ が「H ₂SO|₄」のように重なって崩れる（＝文字化けに見える）。
    そのため tx() 側で、添え字を含む文字列は必ず anchor を start に倒し、
    x を measureRich() の実測ぶんだけ手前にずらしてから描く。 */
export function escRich(str, size) {
  // 収録されていない記号（≒ など）は先に安全な記号へ寄せる＝豆腐（□）を出さない
  const s = safeGlyphs(str);
  const small = Math.max(7, Math.round(size * 0.72 * 10) / 10);
  const subDy = Math.round(size * 0.2 * 10) / 10;   // 下へ
  const supDy = Math.round(size * 0.36 * 10) / 10;  // 上へ
  const parts = [];
  let pendingDy = 0; // 直前の添え字で動かした分（次の tspan で打ち消す）
  let plain = '';

  const flushPlain = () => {
    if (!plain) return;
    if (pendingDy) {
      parts.push(`<tspan dy="${Math.round(-pendingDy * 10) / 10}">${esc(plain)}</tspan>`);
      pendingDy = 0;
    } else {
      parts.push(esc(plain));
    }
    plain = '';
  };

  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    const isSub = Object.prototype.hasOwnProperty.call(SUB_MAP, ch);
    const isSup = Object.prototype.hasOwnProperty.call(SUP_MAP, ch);
    if (!isSub && !isSup) { plain += ch; i++; continue; }
    flushPlain();
    // 同種の添え字が続く分はまとめて1つの tspan にする
    const map = isSub ? SUB_MAP : SUP_MAP;
    let run = '';
    while (i < s.length && Object.prototype.hasOwnProperty.call(map, s[i])) {
      run += map[s[i]];
      i++;
    }
    const dy = Math.round(((isSub ? subDy : -supDy) - pendingDy) * 10) / 10;
    parts.push(`<tspan font-size="${small}" dy="${dy}">${esc(run)}</tspan>`);
    pendingDy = isSub ? subDy : -supDy;
  }
  flushPlain();
  // 末尾が添え字で終わった場合、ずれは次の文字が無いので放置してよい
  return parts.join('');
}

/**
 * テキスト。anchor: start|middle|end
 *
 * 添え字（H₂SO₄ / e⁻ など）を含む文字列は、下付き・上付きを tspan で描くため、
 * text-anchor が start 以外だとレンダラによって字が重なって壊れる（escRich の注意書き参照）。
 * そこで添え字を含む場合だけ、
 *   ・anchor を start に固定し
 *   ・x を「文字列の実測幅 × アンカー係数」だけ手前へずらす
 * ことで、見た目の中央寄せ・右寄せを保ったまま崩れを防ぐ。
 */
export function tx(x, y, s, { size = 13, anchor = 'middle', cls = 't b', fill, rotate, opacity } = {}) {
  let ax = x;
  let anc = anchor;
  if (anchor !== 'start' && hasSubSup(s)) {
    const w = measureRich(s, size);
    ax = Math.round((x - (anchor === 'middle' ? w / 2 : w)) * 100) / 100;
    anc = 'start';
  }
  const a = [`x="${ax}"`, `y="${y}"`, `class="${cls}"`, `font-size="${size}"`, `text-anchor="${anc}"`];
  if (fill) a.push(`fill="${fill}"`);
  if (opacity != null) a.push(`opacity="${opacity}"`);
  // 回転の中心は「見た目の基準点」である元の x のままにする（ずらした ax ではない）
  if (rotate) a.push(`transform="rotate(${rotate} ${x} ${y})"`);
  return `<text ${a.join(' ')}>${escRich(s, size)}</text>`;
}

/** 複数行テキスト（行間 lh） */
export function txLines(x, y, lines, opt = {}) {
  const lh = opt.lh ?? (opt.size ?? 13) * 1.45;
  return lines
    .map((l, i) => tx(x, y + i * lh, l, opt))
    .join('\n');
}

/** 角丸の矩形 */
export function rect(x, y, w, h, { fill = 'none', stroke = C.line, sw = 1.6, r = 6, dash, opacity } = {}) {
  const a = [`x="${x}"`, `y="${y}"`, `width="${w}"`, `height="${h}"`, `rx="${r}"`,
    `fill="${fill}"`, `stroke="${stroke}"`, `stroke-width="${sw}"`];
  if (dash) a.push(`stroke-dasharray="${dash}"`);
  if (opacity != null) a.push(`opacity="${opacity}"`);
  return `<rect ${a.join(' ')}/>`;
}

/** 直線 */
export function line(x1, y1, x2, y2, { stroke = C.ink, sw = 1.6, dash, cap = 'round', marker, opacity } = {}) {
  const a = [`x1="${x1}"`, `y1="${y1}"`, `x2="${x2}"`, `y2="${y2}"`,
    `stroke="${stroke}"`, `stroke-width="${sw}"`, `stroke-linecap="${cap}"`];
  if (dash) a.push(`stroke-dasharray="${dash}"`);
  if (marker) a.push(`marker-end="url(#${marker})"`);
  if (opacity != null) a.push(`opacity="${opacity}"`);
  return `<line ${a.join(' ')}/>`;
}

/** 自由曲線・多角形 */
export function path(d, { fill = 'none', stroke = C.ink, sw = 1.6, dash, marker, markerStart, cap = 'round', join = 'round', opacity } = {}) {
  const a = [`d="${d}"`, `fill="${fill}"`, `stroke="${stroke}"`, `stroke-width="${sw}"`,
    `stroke-linecap="${cap}"`, `stroke-linejoin="${join}"`];
  if (dash) a.push(`stroke-dasharray="${dash}"`);
  if (marker) a.push(`marker-end="url(#${marker})"`);
  if (markerStart) a.push(`marker-start="url(#${markerStart})"`);
  if (opacity != null) a.push(`opacity="${opacity}"`);
  return `<path ${a.join(' ')}/>`;
}

/** 円 */
export function circle(cx, cy, r, { fill = 'none', stroke = C.ink, sw = 1.4, opacity } = {}) {
  const a = [`cx="${cx}"`, `cy="${cy}"`, `r="${r}"`, `fill="${fill}"`, `stroke="${stroke}"`, `stroke-width="${sw}"`];
  if (opacity != null) a.push(`opacity="${opacity}"`);
  return `<circle ${a.join(' ')}/>`;
}

/** 楕円 */
export function ellipse(cx, cy, rx, ry, { fill = 'none', stroke = C.ink, sw = 1.4, opacity } = {}) {
  const a = [`cx="${cx}"`, `cy="${cy}"`, `rx="${rx}"`, `ry="${ry}"`, `fill="${fill}"`, `stroke="${stroke}"`, `stroke-width="${sw}"`];
  if (opacity != null) a.push(`opacity="${opacity}"`);
  return `<ellipse ${a.join(' ')}/>`;
}

/** 矢印マーカーの定義（色ごとに用意する） */
export function arrowDefs(colors = [C.ink, C.accent, C.red, C.blue, C.teal, C.green, C.sub]) {
  const uniq = [...new Set(colors)];
  const ms = uniq
    .map(
      (col, i) => `<marker id="ar${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="strokeWidth" orient="auto-start-reverse">
  <path d="M0,0.6 L10,5 L0,9.4 z" fill="${col}"/>
</marker>`
    )
    .join('\n');
  const map = {};
  uniq.forEach((col, i) => { map[col] = `ar${i}`; });
  return { defs: `<defs>\n${ms}\n</defs>`, id: (col) => map[col] };
}

/** 見出し帯（図の一番上に置く小見出し） */
export function caption(x, y, w, text, { fill = C.accentD, bg = C.accentL, size = 14 } = {}) {
  return `${rect(x, y, w, 26, { fill: bg, stroke: 'none', sw: 0, r: 13 })}
${tx(x + w / 2, y + 13, text, { size, fill, cls: 't eb' })}`;
}

/** ラベル用の小さなタグ（枠つき） */
export function tag(cx, cy, text, { size = 12, fill = C.white, stroke = C.line, color = C.ink, padX = 8, padY = 6 } = {}) {
  const w = measure(text, size) + padX * 2;
  const h = size + padY * 2;
  return `${rect(cx - w / 2, cy - h / 2, w, h, { fill, stroke, sw: 1.3, r: h / 2 })}
${tx(cx, cy, text, { size, fill: color, cls: 't b' })}`;
}

/**
 * 文字幅のざっくり見積り。
 * 和文は全角＝1em、英数字・記号は約0.55em として計算する。
 * （SVG にはテキスト幅の自動計算がないため、枠の大きさをここで決める）
 */
export function measure(text, size = 13) {
  let w = 0;
  for (const ch of String(text)) {
    const code = ch.codePointAt(0);
    const isHalf = code < 0x2e80 || (code >= 0xff61 && code <= 0xff9f);
    w += isHalf ? size * 0.55 : size * 1.0;
  }
  return w;
}

/**
 * 添え字（下付き・上付き）を含む文字列の描画幅。
 * 添え字は escRich が font-size を 0.72 倍にして描くので、幅もその比率で数える。
 * tx() が中央寄せ・右寄せを自前で計算するために使う。
 */
export function measureRich(text, size = 13) {
  const small = Math.max(7, Math.round(size * 0.72 * 10) / 10);
  let w = 0;
  for (const ch of String(text)) {
    const isSub = Object.prototype.hasOwnProperty.call(SUB_MAP, ch);
    const isSup = Object.prototype.hasOwnProperty.call(SUP_MAP, ch);
    if (isSub || isSup) {
      // 添え字は必ず半角相当（数字・符号）なので半角幅で数える
      w += small * 0.55;
      continue;
    }
    const code = ch.codePointAt(0);
    const isHalf = code < 0x2e80 || (code >= 0xff61 && code <= 0xff9f);
    w += isHalf ? size * 0.55 : size * 1.0;
  }
  return w;
}

/** 折れ線グラフの座標変換をつくる */
export function makeScale({ x0, y0, w, h, xMin, xMax, yMin, yMax }) {
  return {
    X: (v) => x0 + ((v - xMin) / (xMax - xMin)) * w,
    Y: (v) => y0 + h - ((v - yMin) / (yMax - yMin)) * h,
    x0, y0, w, h, xMin, xMax, yMin, yMax,
  };
}

/** 折れ線グラフの軸・目盛り・グリッド */
export function axes(sc, {
  xTicks = [], yTicks = [], xLabel = '', yLabel = '',
  grid = true, tickSize = 11,
} = {}) {
  const out = [];
  if (grid) {
    yTicks.forEach((t) => {
      out.push(line(sc.x0, sc.Y(t), sc.x0 + sc.w, sc.Y(t), { stroke: C.gray, sw: 1, dash: '3 4' }));
    });
    xTicks.forEach((t) => {
      out.push(line(sc.X(t), sc.y0, sc.X(t), sc.y0 + sc.h, { stroke: C.gray, sw: 1, dash: '3 4' }));
    });
  }
  // 軸
  out.push(line(sc.x0, sc.y0 + sc.h, sc.x0 + sc.w, sc.y0 + sc.h, { stroke: C.ink, sw: 2, cap: 'square' }));
  out.push(line(sc.x0, sc.y0, sc.x0, sc.y0 + sc.h, { stroke: C.ink, sw: 2, cap: 'square' }));
  // 目盛り
  xTicks.forEach((t) => {
    out.push(line(sc.X(t), sc.y0 + sc.h, sc.X(t), sc.y0 + sc.h + 5, { stroke: C.ink, sw: 1.6 }));
    out.push(tx(sc.X(t), sc.y0 + sc.h + 15, String(t), { size: tickSize, cls: 's b' }));
  });
  yTicks.forEach((t) => {
    out.push(line(sc.x0 - 5, sc.Y(t), sc.x0, sc.Y(t), { stroke: C.ink, sw: 1.6 }));
    out.push(tx(sc.x0 - 9, sc.Y(t), String(t), { size: tickSize, anchor: 'end', cls: 's b' }));
  });
  if (xLabel) out.push(tx(sc.x0 + sc.w / 2, sc.y0 + sc.h + 34, xLabel, { size: 12, cls: 't b' }));
  if (yLabel) out.push(tx(16, sc.y0 + sc.h / 2, yLabel, { size: 12, cls: 't b', rotate: -90 }));
  return out.join('\n');
}

/** 点列から滑らかでない（直線つなぎの）折れ線パスをつくる */
export function polyline(sc, pts) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${sc.X(p[0]).toFixed(1)},${sc.Y(p[1]).toFixed(1)}`).join(' ');
}

/** 点列からカーディナル補間の滑らかな曲線パスをつくる */
export function smooth(sc, pts, tension = 0.5) {
  const P = pts.map((p) => [sc.X(p[0]), sc.Y(p[1])]);
  if (P.length < 3) return P.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[i + 2] || P[i + 1];
    const c1x = p1[0] + ((p2[0] - p0[0]) / 6) * tension * 2;
    const c1y = p1[1] + ((p2[1] - p0[1]) / 6) * tension * 2;
    const c2x = p2[0] - ((p3[0] - p1[0]) / 6) * tension * 2;
    const c2y = p2[1] - ((p3[1] - p1[1]) / 6) * tension * 2;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/**
 * =====================================================================
 * アプリのアイコン契約
 * =====================================================================
 * ご指摘（原文）：
 *   > アプリケーションのアイコンが横に圧縮されているので
 *   > 正常な比に直してください。
 *
 * ★このファイルが守る不変条件★
 *
 *  1. アイコンは必ず ★正方形★（横:縦 = 1:1）である。
 *     アイコンの枠は OS もブラウザも正方形なので、
 *     横長の画像を指定すると横方向に押し縮められて潰れる。
 *     実際に起きていたのは、まさにこれだった：
 *       /manatob_bg.png … 1000x358（比 2.79）を rel="icon" に指定
 *
 *  2. 参照先のファイルが ★実際に存在する★。
 *     manifest.json は /icons/icon-192.png を指していたが、
 *     public/icons/ ディレクトリそのものが存在しなかった。
 *     この種の不具合は「画面には何も出ない」ので目で気づけない。
 *
 *  3. manifest の sizes 表記と ★実ファイルの寸法が一致する★。
 *     192x192 と書いてあるのに中身が別の大きさだと、
 *     ブラウザが縮小・拡大して画質が落ちる。
 *
 *  4. purpose:"any" と purpose:"maskable" を ★兼用しない★。
 *     Android は maskable のアイコンを端末ごとの形（円・角丸・しずく型）で
 *     切り抜くので、中央の直径80%（セーフゾーン）の外は消える前提で
 *     余白を多めに取る必要がある。一方 any は余白が少ない方が綺麗。
 *     この2つは要求が正反対なので、1ファイルで兼ねると必ずどちらかが崩れる。
 *
 *  5. 横長のロゴを ★アイコンとして直接指定し直さない★（退行防止）。
 *
 *  6. ★絵の左右に十分な余白がある（全貌が枠に収まる）★
 *     ご指摘（原文）：
 *       > アイコンをこのように縮小し、全貌が収まるようにして。
 *     添付のタブのスクリーンショットで、ワードマークの両端（左の「m」と
 *     右の「b」）が枠の縁で切れていた。
 *     原因はピクセル照合で確定させた：タブに出ていたのは
 *     <link rel="icon"> の「m」マークではなく ★manifest 経由の
 *     icon-192/512（purpose:"any"）★ で、そのファイルは絵が枠幅の 92% を
 *     占め、左右の余白が 3.6% しかなかった。ブラウザはアイコンを角丸に
 *     切り抜いたり 24px まで縮めたりするので、この余白では端が飲まれる。
 *     下の I4 が ★実ファイルのピクセルを読んで★ 余白を検算する。
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf-8');

const HTML = read('index.html');
const MANIFEST = JSON.parse(read('public/manifest.json')) as {
  icons: { src: string; sizes: string; type: string; purpose?: string }[];
};

/**
 * PNG の先頭から幅・高さを読む。
 *
 * PNG は必ず
 *   8 バイトの署名 → 長さ(4) → "IHDR"(4) → 幅(4) → 高さ(4)
 * という並びで始まると規格で決まっているので、
 * 画像ライブラリを足さずにこれだけで寸法が分かる。
 */
function pngSize(rel: string): { w: number; h: number } {
  const buf = fs.readFileSync(path.join(ROOT, rel));
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  expect(buf.subarray(0, 8).equals(sig)).toBe(true);
  expect(buf.subarray(12, 16).toString('ascii')).toBe('IHDR');
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

/**
 * ICO に含まれる各画像の寸法を読む。
 *
 * ICO のヘッダは
 *   予約(2) 種別(2) 枚数(2) → 各16バイトのエントリ
 * で、エントリの先頭2バイトが幅・高さ。
 * ★0 は「256」を意味する★（1バイトに 256 が入らないための約束）。
 */
function icoSizes(rel: string): { w: number; h: number }[] {
  const buf = fs.readFileSync(path.join(ROOT, rel));
  const count = buf.readUInt16LE(4);
  const out: { w: number; h: number }[] = [];
  for (let i = 0; i < count; i += 1) {
    const off = 6 + i * 16;
    out.push({
      w: buf[off] === 0 ? 256 : buf[off],
      h: buf[off + 1] === 0 ? 256 : buf[off + 1],
    });
  }
  return out;
}

/** index.html の <link> から rel と href を取り出す。 */
function links(): { rel: string; href: string; sizes: string }[] {
  const out: { rel: string; href: string; sizes: string }[] = [];
  for (const m of HTML.matchAll(/<link\b[^>]*>/gu)) {
    const tag = m[0];
    const rel = /\brel="([^"]*)"/u.exec(tag)?.[1] ?? '';
    const href = /\bhref="([^"]*)"/u.exec(tag)?.[1] ?? '';
    const sizes = /\bsizes="([^"]*)"/u.exec(tag)?.[1] ?? '';
    out.push({ rel, href, sizes });
  }
  return out;
}

/** /foo.png のような公開パスを public/ 配下の実ファイルパスに直す。 */
const toPublic = (href: string) => path.posix.join('public', href.replace(/^\//u, ''));

// =====================================================================
// I1: manifest のアイコンは存在し、正方形で、寸法表記と一致する
// =====================================================================
describe('I1: manifest のアイコン', () => {
  it('icons が空でない', () => {
    expect(MANIFEST.icons.length).toBeGreaterThan(0);
  });

  it('参照先のファイルが実在する（★以前は public/icons/ が無かった★）', () => {
    for (const icon of MANIFEST.icons) {
      const rel = toPublic(icon.src);
      expect(fs.existsSync(path.join(ROOT, rel)), `${icon.src} が存在しない`).toBe(true);
    }
  });

  it('★すべて正方形（横:縦 = 1:1）★', () => {
    for (const icon of MANIFEST.icons) {
      const { w, h } = pngSize(toPublic(icon.src));
      expect(w, `${icon.src} が正方形でない (${w}x${h})`).toBe(h);
    }
  });

  it('sizes の表記と実ファイルの寸法が一致する', () => {
    for (const icon of MANIFEST.icons) {
      const [dw, dh] = icon.sizes.split('x').map(Number);
      const { w, h } = pngSize(toPublic(icon.src));
      expect(w, `${icon.src} の幅が宣言と違う`).toBe(dw);
      expect(h, `${icon.src} の高さが宣言と違う`).toBe(dh);
    }
  });

  it('any と maskable を1ファイルで兼用していない', () => {
    // 兼用（"any maskable"）だと、余白の要求が正反対なので
    // 「any で小さすぎる」か「maskable で端が切れる」のどちらかが必ず起きる。
    for (const icon of MANIFEST.icons) {
      const purposes = (icon.purpose ?? 'any').trim().split(/\s+/u);
      expect(purposes.length, `${icon.src} の purpose が兼用になっている`).toBe(1);
    }
  });

  it('any と maskable の両方が用意されている', () => {
    const purposes = new Set(
      MANIFEST.icons.map((i) => (i.purpose ?? 'any').trim()),
    );
    expect(purposes.has('any')).toBe(true);
    expect(purposes.has('maskable')).toBe(true);
  });

  it('maskable は any より余白が広い（切り抜かれても消えないため）', () => {
    // 同じ 512px で比べると、maskable の方はロゴが小さく描かれている
    // ＝不透明でない周辺が広い。ファイルの中身までは見ないが、
    // 少なくとも別ファイルとして分かれていることを保証する。
    const any512 = MANIFEST.icons.find(
      (i) => i.sizes === '512x512' && (i.purpose ?? 'any') === 'any',
    );
    const mask512 = MANIFEST.icons.find(
      (i) => i.sizes === '512x512' && i.purpose === 'maskable',
    );
    expect(any512).toBeDefined();
    expect(mask512).toBeDefined();
    expect(any512!.src).not.toBe(mask512!.src);
  });
});

// =====================================================================
// I2: index.html の <link rel="icon"> も正方形の実ファイルを指す
// =====================================================================
describe('I2: index.html のアイコン指定', () => {
  const iconLinks = () =>
    links().filter((l) => /\bicon\b/u.test(l.rel) && l.href.startsWith('/'));

  it('rel="icon" / apple-touch-icon がある', () => {
    expect(iconLinks().length).toBeGreaterThan(0);
    expect(links().some((l) => l.rel.includes('apple-touch-icon'))).toBe(true);
  });

  it('参照先がすべて実在する（★以前は存在しないパスを指していた★）', () => {
    for (const l of iconLinks()) {
      const rel = toPublic(l.href);
      expect(fs.existsSync(path.join(ROOT, rel)), `${l.href} が存在しない`).toBe(true);
    }
  });

  it('★PNG のアイコンはすべて正方形★', () => {
    for (const l of iconLinks()) {
      if (!l.href.endsWith('.png')) continue;
      const { w, h } = pngSize(toPublic(l.href));
      expect(w, `${l.href} が正方形でない (${w}x${h})`).toBe(h);
    }
  });

  it('ICO の各サイズも正方形で、1x1 の空画像ではない', () => {
    // ★以前 public/favicon.ico は 1x1（実質空）だった★
    const sizes = icoSizes('public/favicon.ico');
    expect(sizes.length).toBeGreaterThan(0);
    for (const { w, h } of sizes) {
      expect(w).toBe(h);
      expect(w, 'favicon.ico が 1x1 の空画像に戻っている').toBeGreaterThanOrEqual(16);
    }
  });

  it('★横長のロゴをアイコンに指定し直さない★（退行防止）', () => {
    /*
      -----------------------------------------------------------------
      これが今回の不具合の直接の原因だった。

        <link rel="icon" href="/manatob_bg.png" />

      manatob_bg.png は 1000x358（横:縦 = 2.79 : 1）の横長ワードマーク。
      アイコンの枠は正方形なので、横方向に約 2.8 倍押し縮められて
      「横に圧縮された」見た目になっていた。

      ロゴ自体は画面内では MntbLogo.tsx が object-contain + w-auto で
      正しく扱っているので、直すべきはアイコン指定の方だった。
      -----------------------------------------------------------------
    */
    const forbidden = ['manatob_bg.png', 'mntb_logo.png'];
    for (const l of links()) {
      if (!/\bicon\b/u.test(l.rel)) continue;
      for (const bad of forbidden) {
        expect(l.href, `${bad} は横長なのでアイコンに使えない`).not.toContain(bad);
      }
    }
  });

  it('apple-touch-icon は 180x180 の正方形', () => {
    const apple = links().find((l) => l.rel.includes('apple-touch-icon'));
    expect(apple).toBeDefined();
    const { w, h } = pngSize(toPublic(apple!.href));
    expect(w).toBe(180);
    expect(h).toBe(180);
  });
});

// =====================================================================
// I3: アイコンはスクリプトで作り直せる（手作業に戻さない）
// =====================================================================
describe('I3: 再生成できること', () => {
  it('生成スクリプトが存在する', () => {
    // ロゴを差し替えたときに、誰でも同じ手順で作り直せるようにしておく。
    expect(fs.existsSync(path.join(ROOT, 'scripts/make-icons.py'))).toBe(true);
  });

  it('生成スクリプトは比を「幅から計算」している（潰さないことの要点）', () => {
    // 幅と高さを別々に決めると、そこが潰れる原因になる。
    const src = read('scripts/make-icons.py');
    expect(src).toContain('target_h = max(1, round(target_w * lh / lw))');
  });

  it('生成スクリプトは maskable のセーフゾーンを検算する', () => {
    const src = read('scripts/make-icons.py');
    expect(src).toContain('def check_safe_zone');
    expect(src).toContain('math.hypot');
  });
});

// =====================================================================
// I4: 絵の全貌が枠に収まる（左右の余白を実ファイルのピクセルで検算）
// =====================================================================
/**
 * ★なぜソースの数字ではなく生成物のピクセルを見るのか★
 *   scripts/make-icons.py の WIDTH_RATIO を見るだけなら文字列比較で済むが、
 *   それでは「スクリプトは直したが PNG を作り直し忘れた」を捕まえられない。
 *   実際に配信されるのは PNG の方なので、PNG そのものを測る。
 *
 * PNG のピクセルは zlib で圧縮されているが、Node には zlib が標準で入って
 * いるので追加の依存なしに展開できる。
 * 手順は PNG の規格そのままで
 *   IHDR で幅・高さ・色種別を読む → IDAT を連結して inflate →
 *   走査線ごとの「フィルタ」を外す（PNG は隣のバイトとの差分で保存される）
 * の3段。
 */
import zlib from 'node:zlib';

type Rgba = { w: number; h: number; data: Buffer };

function decodePng(rel: string): Rgba {
  const buf = fs.readFileSync(path.join(ROOT, rel));
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];
  // このリポジトリのアイコンは make-icons.py が RGBA 8bit で書き出す。
  // 別の形式に変わったらこの assert で気づけるようにしておく。
  expect(bitDepth, `${rel} が 8bit でない`).toBe(8);
  expect(colorType, `${rel} が RGBA(6) でない`).toBe(6);
  const channels = 4;

  // IDAT チャンクを全部つなげる（大きい PNG は複数に分割される）。
  const idat: Buffer[] = [];
  let off = 8;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.subarray(off + 4, off + 8).toString('ascii');
    if (type === 'IDAT') idat.push(buf.subarray(off + 8, off + 8 + len));
    if (type === 'IEND') break;
    off += 12 + len; // 長さ(4) + 種別(4) + 中身 + CRC(4)
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));

  // 走査線のフィルタを外す。
  const stride = w * channels;
  const out = Buffer.alloc(w * h * channels);
  let pos = 0;
  for (let y = 0; y < h; y += 1) {
    const filter = raw[pos];
    pos += 1;
    const line = raw.subarray(pos, pos + stride);
    pos += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x += 1) {
      const a = x >= channels ? cur[x - channels] : 0; // 左
      const b = prev ? prev[x] : 0; // 上
      const c = prev && x >= channels ? prev[x - channels] : 0; // 左上
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        // Paeth 予測：左・上・左上のうち推定値に最も近いものを選ぶ
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      } else if (filter !== 0) {
        throw new Error(`${rel}: 未知のフィルタ ${filter}`);
      }
      cur[x] = v & 0xff;
    }
  }
  return { w, h, data: out };
}

/**
 * 「絵」が occupying している範囲を返す。
 * 地の色（アイボリー #FDFBF7）と十分に違う画素、または透明でない画素を
 * 絵とみなす。maskable/any は地が塗られていて、透過のものは alpha で判定。
 */
function inkBounds(rel: string) {
  const { w, h, data } = decodePng(rel);
  const BG = [253, 251, 247];
  let x0 = w;
  let x1 = -1;
  let y0 = h;
  let y1 = -1;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      const a = data[i + 3];
      if (a === 0) continue;
      const diff =
        Math.abs(data[i] - BG[0]) +
        Math.abs(data[i + 1] - BG[1]) +
        Math.abs(data[i + 2] - BG[2]);
      if (diff <= 18) continue; // 地の色とほぼ同じ＝余白
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  expect(x1, `${rel} に絵が見つからない`).toBeGreaterThanOrEqual(0);
  return {
    w,
    h,
    inkW: x1 - x0 + 1,
    inkH: y1 - y0 + 1,
    // 左右の余白のうち狭い方（＝切れやすい側）を割合で返す
    sideMargin: Math.min(x0, w - 1 - x1) / w,
    topBottomMargin: Math.min(y0, h - 1 - y1) / h,
  };
}

describe('I4: 絵の全貌が枠に収まる', () => {
  /*
    ■ しきい値 8% の根拠
      ご提供のタブ画像から測ると favicon の枠は ★24x24★ だった。
      8% は 24px 換算で約 1.9px。ブラウザは四隅を角丸で削るので、
      上下中央の帯であるこのワードマークなら 2px 弱の横余白で
      端が縁に触らなくなる（実測でも切れなくなった）。

      ★以前は 3.6% しかなくて切れていた★ ので、
      ここを下回る値に戻さないことが今回の不変条件。
  */
  const MIN_SIDE_MARGIN = 0.08;

  it('★manifest の any アイコンは左右に 8% 以上の余白を持つ（以前は 3.6% で切れていた）★', () => {
    const anyIcons = MANIFEST.icons.filter((i) => (i.purpose ?? 'any') === 'any');
    expect(anyIcons.length).toBeGreaterThan(0);
    for (const icon of anyIcons) {
      const m = inkBounds(toPublic(icon.src));
      expect(
        m.sideMargin,
        `${icon.src} の左右の余白が ${(m.sideMargin * 100).toFixed(1)}% しかない`,
      ).toBeGreaterThanOrEqual(MIN_SIDE_MARGIN);
    }
  });

  it('maskable アイコンは any より余白が広い（切り抜かれても消えないため）', () => {
    const any512 = inkBounds('public/icons/icon-512.png');
    const mask512 = inkBounds('public/icons/icon-maskable-512.png');
    expect(mask512.sideMargin).toBeGreaterThan(any512.sideMargin);
    // セーフゾーン（中央の直径80%の円）に対角が収まっているかの実測版。
    // make-icons.py の check_safe_zone と同じ計算を、生成物側で検算する。
    const rw = mask512.inkW / mask512.w;
    const rh = mask512.inkH / mask512.h;
    expect(Math.hypot(rw / 2, rh / 2)).toBeLessThanOrEqual(0.4);
  });

  it('apple-touch-icon も左右に余白を持つ', () => {
    const m = inkBounds('public/icons/apple-touch-icon-180.png');
    expect(m.sideMargin).toBeGreaterThanOrEqual(MIN_SIDE_MARGIN);
  });

  it('favicon（「m」マーク）は四方に余白を持つ（角丸で四隅が削れるため）', () => {
    // ★96/192 も対象に入れる★
    //   この2つは「タブに manifest 側の横長ロゴが選ばれてしまう」対策として
    //   追加したもの（index.html のコメント参照）。追加したのに余白の
    //   検算から漏れていると、対策そのものが切れた絵を配ることになる。
    const marks = [32, 48, 96, 192].map((n) => `public/icons/favicon-${n}.png`);
    for (const rel of marks) {
      const m = inkBounds(rel);
      // こちらは比 1.000 の正方形マークなので、横だけでなく縦も効く。
      expect(m.sideMargin, `${rel} の左右の余白が足りない`).toBeGreaterThanOrEqual(0.05);
      expect(m.topBottomMargin, `${rel} の上下の余白が足りない`).toBeGreaterThanOrEqual(0.05);
    }
  });

  /**
   * scripts/make-icons.py から WIDTH_RATIO['any'] の値を読む。
   *
   * ★素朴に /'any':\s*([0-9.]+)/ で探してはいけない★
   *   スクリプトのコメントには経緯として「以前ここは 'any': 0.92 だった」と
   *   書いてある。素朴な正規表現はそのコメントを先に拾ってしまい、
   *   実際の設定値ではなく ★過去の値★ を検査してしまう
   *   （このテストを書いた最初の版で実際にそれが起きた）。
   *   なので WIDTH_RATIO = { ... } の中だけを見る。
   */
  function anyWidthRatio(): number {
    const src = read('scripts/make-icons.py');
    const dict = /WIDTH_RATIO\s*=\s*\{([\s\S]*?)\}/u.exec(src);
    expect(dict, 'WIDTH_RATIO の定義が見つからない').not.toBeNull();
    const m = /'any':\s*([0-9.]+)/u.exec(dict![1]);
    expect(m, "WIDTH_RATIO['any'] が見つからない").not.toBeNull();
    return parseFloat(m![1]);
  }

  it('「m」マークは 192px まで揃えている（タブが manifest 側へ流れないため）', () => {
    /*
      ブラウザは <link rel="icon"> の候補から必要な大きさに一番近いものを
      選ぶが、候補が小さいものしか無いと manifest.json 側の
      icons（＝横長ワードマーク）へ流れる。それが今回の不具合の
      「favicon-48.png を直しても症状が変わらない」理由だった。
      候補を 192px まで揃えておくことで、タブには「m」マークが選ばれる。
    */
    for (const n of [32, 48, 96, 192]) {
      const rel = `public/icons/favicon-${n}.png`;
      expect(fs.existsSync(path.join(ROOT, rel)), `${rel} が無い`).toBe(true);
      const { w, h } = pngSize(rel);
      expect(w).toBe(n);
      expect(h).toBe(n);
    }
    // index.html からも参照されていること（作っただけで使っていないを防ぐ）
    const hrefs = links().map((l) => l.href);
    expect(hrefs).toContain('/icons/favicon-192.png');
    expect(hrefs).toContain('/icons/favicon-96.png');
  });

  it('★退行防止★ 余白を削って「大きく見せる」方向に戻さない', () => {
    /*
      -----------------------------------------------------------------
      以前ここは意図的に 0.92（余白 3.6%）にしていた。
      理由は「横長のロゴを正方形に入れると上下に余白ができて小さく見える。
      ならば横幅を取れるだけ取ろう」という考えだった。

      その考えは ★今回のご指摘で否定された★：
        > アイコンをこのように縮小し、全貌が収まるようにして。
      小さく見えることより、端が切れないことが優先される。

      「アイコンが小さいので大きくしよう」という一般論だけを根拠に
      WIDTH_RATIO を戻されやすいので、上限側もここで固定しておく。
      -----------------------------------------------------------------
    */
    const ratio = anyWidthRatio();
    // 幅 84% を超えると左右の余白が 8% を割る（(1-0.84)/2 = 8%）。
    expect(ratio, 'any の幅を広げすぎ＝端が切れる方向に戻っている').toBeLessThanOrEqual(0.84);
    // 逆に小さすぎても読めないので下限も置く。
    expect(ratio).toBeGreaterThanOrEqual(0.6);
  });

  it('生成スクリプトと生成物がずれていない（PNG を作り直し忘れていない）', () => {
    // スクリプトの WIDTH_RATIO['any'] と、実ファイルの絵の幅の割合が一致するか。
    const ratio = anyWidthRatio();
    const m = inkBounds('public/icons/icon-512.png');
    // 縮小時の反エイリアスで 1〜2px ずれるので 1.5% の許容を置く。
    expect(Math.abs(m.inkW / m.w - ratio)).toBeLessThan(0.015);
  });
});

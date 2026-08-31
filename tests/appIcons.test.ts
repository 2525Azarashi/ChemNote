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

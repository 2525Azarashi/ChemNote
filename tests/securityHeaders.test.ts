import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * セキュリティヘッダーの回帰テスト。
 *
 * public/_headers（Cloudflare Pages / Netlify）と vercel.json（Vercel）の
 * 2系統に同じポリシーを置いているため、
 *   1) 必須ヘッダーが揃っていること
 *   2) CSP が危険な方向に緩められていないこと
 *   3) 2ファイルの CSP が食い違っていないこと
 * をここで固定する。
 */

const root = resolve(__dirname, '..');
const headersPath = resolve(root, 'public/_headers');
const vercelPath = resolve(root, 'vercel.json');

const headersSrc = readFileSync(headersPath, 'utf-8');
const vercelJson = JSON.parse(readFileSync(vercelPath, 'utf-8')) as {
  headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
};

/** `_headers` から `Key: value` を取り出す（値にコロンを含むので最初の1つだけで分割） */
function headerFromFile(key: string): string | undefined {
  const line = headersSrc
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.toLowerCase().startsWith(`${key.toLowerCase()}:`));
  if (!line) return undefined;
  return line.slice(key.length + 1).trim();
}

function headerFromVercel(key: string, source = '/(.*)'): string | undefined {
  const block = vercelJson.headers.find((h) => h.source === source);
  return block?.headers.find((h) => h.key.toLowerCase() === key.toLowerCase())?.value;
}

/** CSP 文字列を { directive: [values] } に分解 */
function parseCsp(csp: string): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const part of csp.split(';')) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;
    out[tokens[0]] = tokens.slice(1);
  }
  return out;
}

const REQUIRED_HEADERS = [
  'Content-Security-Policy',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Strict-Transport-Security',
  'Cross-Origin-Opener-Policy',
];

describe('セキュリティヘッダー: 設定ファイルが存在する', () => {
  it('public/_headers がある', () => {
    expect(existsSync(headersPath)).toBe(true);
  });

  it('vercel.json がある', () => {
    expect(existsSync(vercelPath)).toBe(true);
  });

  it('public/ に置いてあるので dist にコピーされる（ビルド成果物に含まれる）', () => {
    // Vite は public/ 配下をそのまま dist へコピーする。
    expect(headersPath).toContain(`${resolve(root, 'public')}`);
  });
});

describe('セキュリティヘッダー: 必須ヘッダーが両方の設定に揃っている', () => {
  for (const key of REQUIRED_HEADERS) {
    it(`_headers に ${key} がある`, () => {
      expect(headerFromFile(key)).toBeTruthy();
    });

    it(`vercel.json に ${key} がある`, () => {
      expect(headerFromVercel(key)).toBeTruthy();
    });
  }
});

describe('セキュリティヘッダー: 個別の値', () => {
  it('X-Content-Type-Options は nosniff', () => {
    expect(headerFromFile('X-Content-Type-Options')).toBe('nosniff');
    expect(headerFromVercel('X-Content-Type-Options')).toBe('nosniff');
  });

  it('X-Frame-Options は DENY（クリックジャッキング対策）', () => {
    expect(headerFromFile('X-Frame-Options')).toBe('DENY');
    expect(headerFromVercel('X-Frame-Options')).toBe('DENY');
  });

  it('Referrer-Policy は外部にパスを漏らさない設定', () => {
    const allowed = ['no-referrer', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin'];
    expect(allowed).toContain(headerFromFile('Referrer-Policy'));
    expect(allowed).toContain(headerFromVercel('Referrer-Policy'));
  });

  it('HSTS は 1年以上', () => {
    for (const v of [headerFromFile('Strict-Transport-Security'), headerFromVercel('Strict-Transport-Security')]) {
      const age = Number(/max-age=(\d+)/.exec(v ?? '')?.[1] ?? 0);
      expect(age).toBeGreaterThanOrEqual(31536000);
    }
  });

  it('Permissions-Policy でカメラ・マイク・位置情報を無効化している', () => {
    for (const v of [headerFromFile('Permissions-Policy'), headerFromVercel('Permissions-Policy')]) {
      expect(v).toMatch(/camera=\(\)/);
      expect(v).toMatch(/microphone=\(\)/);
      expect(v).toMatch(/geolocation=\(\)/);
    }
  });

  it('COOP は Google ログインのポップアップを壊さない値', () => {
    // same-origin にすると signInWithPopup が動かなくなるため allow-popups が必須。
    expect(headerFromFile('Cross-Origin-Opener-Policy')).toBe('same-origin-allow-popups');
    expect(headerFromVercel('Cross-Origin-Opener-Policy')).toBe('same-origin-allow-popups');
  });
});

describe('CSP: 危険な緩め方をしていない', () => {
  const csps = [
    ['_headers', parseCsp(headerFromFile('Content-Security-Policy') ?? '')],
    ['vercel.json', parseCsp(headerFromVercel('Content-Security-Policy') ?? '')],
  ] as const;

  for (const [label, csp] of csps) {
    it(`${label}: default-src は 'self'`, () => {
      expect(csp['default-src']).toEqual(["'self'"]);
    });

    it(`${label}: script-src に 'unsafe-inline' / 'unsafe-eval' がない`, () => {
      expect(csp['script-src']).not.toContain("'unsafe-inline'");
      expect(csp['script-src']).not.toContain("'unsafe-eval'");
    });

    it(`${label}: script-src にワイルドカード * がない`, () => {
      expect(csp['script-src']).not.toContain('*');
      expect(csp['script-src']).not.toContain('https:');
    });

    it(`${label}: object-src は 'none'（Flash/plugin 経由の実行を封じる）`, () => {
      expect(csp['object-src']).toEqual(["'none'"]);
    });

    it(`${label}: frame-ancestors は 'none'`, () => {
      expect(csp['frame-ancestors']).toEqual(["'none'"]);
    });

    it(`${label}: base-uri を固定している（<base> 差し替え攻撃対策）`, () => {
      expect(csp['base-uri']).toEqual(["'self'"]);
    });

    it(`${label}: form-action を固定している`, () => {
      expect(csp['form-action']).toEqual(["'self'"]);
    });

    it(`${label}: upgrade-insecure-requests がある`, () => {
      expect(csp).toHaveProperty('upgrade-insecure-requests');
    });
  }
});

describe('CSP: アプリが実際に使う通信先を許可できている', () => {
  const csp = parseCsp(headerFromFile('Content-Security-Policy') ?? '');

  it('Firestore への接続を許可している', () => {
    expect(csp['connect-src'].join(' ')).toContain('firestore.googleapis.com');
  });

  it('Firebase Auth（identitytoolkit / securetoken）を許可している', () => {
    const v = csp['connect-src'].join(' ');
    expect(v).toContain('identitytoolkit.googleapis.com');
    expect(v).toContain('securetoken.googleapis.com');
  });

  it('フィードバック送信先（Google Apps Script）を許可している', () => {
    // src/utils/feedback.ts が script.google.com へ POST している
    expect(csp['connect-src'].join(' ')).toContain('script.google.com');
  });

  it('Google Fonts の CSS と本体を許可している', () => {
    // src/index.css が @import で fonts.googleapis.com を読む
    expect(csp['style-src'].join(' ')).toContain('fonts.googleapis.com');
    expect(csp['font-src'].join(' ')).toContain('fonts.gstatic.com');
  });

  it('Google ログインのポップアップ用に accounts.google.com を許可している', () => {
    expect(csp['frame-src'].join(' ')).toContain('accounts.google.com');
    expect(csp['script-src'].join(' ')).toContain('accounts.google.com');
  });

  it('Google アカウントのアバター画像を表示できる（img-src に https:）', () => {
    // ランキング/フレンドの photoURL は googleusercontent 等の外部ホスト
    expect(csp['img-src'].join(' ')).toContain('https:');
  });

  it('style-src には unsafe-inline を許可している（Tailwind v4 / motion / 印刷CSS注入のため）', () => {
    expect(csp['style-src']).toContain("'unsafe-inline'");
  });
});

describe('CSP: 2ファイルのポリシーが一致している', () => {
  it('_headers と vercel.json の CSP が同一', () => {
    const a = (headerFromFile('Content-Security-Policy') ?? '').replace(/\s+/g, ' ').trim();
    const b = (headerFromVercel('Content-Security-Policy') ?? '').replace(/\s+/g, ' ').trim();
    expect(a).toBe(b);
  });
});

describe('リポジトリ衛生: 秘密情報や使い捨てスクリプトを追跡していない', () => {
  const gitignore = readFileSync(resolve(root, '.gitignore'), 'utf-8');

  it('firebase-applet-config.json を .gitignore している', () => {
    expect(gitignore).toContain('firebase-applet-config.json');
  });

  it('サービスアカウント鍵のパターンを .gitignore している', () => {
    expect(gitignore).toMatch(/serviceAccount|service-account/);
    expect(gitignore).toContain('*.pem');
  });

  it('リポジトリ直下の使い捨てスクリプトを .gitignore している', () => {
    expect(gitignore).toContain('/*.js');
    expect(gitignore).toContain('/*.cjs');
  });

  it('リポジトリ直下に .js / .cjs の使い捨てスクリプトが残っていない', () => {
    // 過去に 54 個の調査用スクリプトが直下に散らばっていたので再発防止
    const files = readFileSync(resolve(root, '.gitignore'), 'utf-8');
    expect(files).toBeTruthy();
    const leftovers = require('node:fs')
      .readdirSync(root)
      .filter((f: string) => /\.(js|cjs)$/.test(f) && f !== 'eslint.config.js');
    expect(leftovers).toEqual([]);
  });
});

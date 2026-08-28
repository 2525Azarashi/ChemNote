/**
 * ===================================================================
 * タイムアウト付き fetch（fetchWithTimeout）の共通化テスト
 * ===================================================================
 *
 * ■ 何が重複していたか
 *   「無応答のまま送信中で固まる」のを防ぐタイムアウト付き fetch が、
 *   まったく同じ実装（1文字違わない8行）で2箇所にあった。
 *     src/utils/feedback.ts:491      （フィードバック送信）
 *     src/utils/userRegistry.ts:214  （ユーザー記録の送信）
 *   タイムアウト値 WEBHOOK_TIMEOUT_MS = 15000 も同じ値で2箇所にあった。
 *
 *   この2つは同じ GAS ウェブアプリ（同じURL）へ送る。userRegistry.ts の
 *   コメントには「送信タイムアウト（フィードバックと揃える）」と
 *   書いてあり、揃えるべきだという意図が明記されている。しかし実装が
 *   2つあるので、片方だけ直しても誰も気づかない状態だった。
 *
 * ■ このテストの方針
 *   移す前の実装をここに複製（legacy…）し、共通化後の実装と
 *   同じふるまいになることを確認する。ネットワークには出ないよう
 *   globalThis.fetch を差し替えて検証する。
 *   本番コードを触る前に実行して「失敗すること」を確かめてから移した。
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** 移動前に feedback.ts / userRegistry.ts にあった実装（そのまま複製） */
async function legacyFetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
  vi.useRealTimers();
});

describe('fetchWithTimeout（送信のタイムアウト）', () => {
  it('成功時は fetch の Response をそのまま返す', async () => {
    const { fetchWithTimeout } = await import('../src/utils/httpTimeout');
    const fake = { ok: true, status: 200 } as Response;
    globalThis.fetch = vi.fn(async () => fake) as any;

    const got = await fetchWithTimeout('https://example.test/x', { method: 'POST' }, 15000);
    // ラップせず「その Response そのもの」を返す（呼び出し側が .ok / .status を見る）
    expect(got).toBe(fake);
  });

  it('init をそのまま渡し、signal だけを足している（既存の送信作法を壊さない）', async () => {
    const { fetchWithTimeout } = await import('../src/utils/httpTimeout');
    const calls: any[] = [];
    globalThis.fetch = vi.fn(async (u: any, i: any) => { calls.push([u, i]); return { ok: true } as Response; }) as any;

    // 実際に使われている init（GAS は text/plain の simple request で送る）
    const init: RequestInit = {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: '{"kind":"user"}',
    };
    await fetchWithTimeout('https://example.test/gas', init, 15000);

    const [url, passed] = calls[0];
    expect(url).toBe('https://example.test/gas');
    expect(passed.method).toBe('POST');
    expect(passed.redirect).toBe('follow');
    expect(passed.headers).toEqual({ 'Content-Type': 'text/plain;charset=utf-8' });
    expect(passed.body).toBe('{"kind":"user"}');
    // signal が足されている（これがタイムアウトの実体）
    expect(passed.signal).toBeInstanceOf(AbortSignal);
    expect(passed.signal.aborted).toBe(false);
    // 呼び出し側が渡した init オブジェクト自体は書き換えていない
    expect('signal' in init).toBe(false);
  });

  it('mode: no-cors を渡した場合も上書きせずに通す（CORS 失敗時の撃ち直し）', async () => {
    const { fetchWithTimeout } = await import('../src/utils/httpTimeout');
    const calls: any[] = [];
    globalThis.fetch = vi.fn(async (_u: any, i: any) => { calls.push(i); return { ok: true } as Response; }) as any;

    await fetchWithTimeout('https://example.test/gas', { method: 'POST', mode: 'no-cors' }, 15000);
    expect(calls[0].mode).toBe('no-cors');
    expect(calls[0].signal).toBeInstanceOf(AbortSignal);
  });

  it('タイムアウトすると abort され、AbortError 相当で失敗する', async () => {
    const { fetchWithTimeout } = await import('../src/utils/httpTimeout');
    let seen: AbortSignal | null = null;
    // 応答が返ってこない fetch を模して、signal の abort をエラーに変える
    globalThis.fetch = vi.fn((_u: any, i: any) => {
      seen = i.signal;
      return new Promise((_res, rej) => {
        i.signal.addEventListener('abort', () => {
          const e: any = new Error('The operation was aborted.');
          e.name = 'AbortError';
          rej(e);
        });
      });
    }) as any;

    // 呼び出し側（sendToWebhook）は error?.name === 'AbortError' で分岐している
    await expect(fetchWithTimeout('https://example.test/slow', {}, 20)).rejects.toMatchObject({ name: 'AbortError' });
    expect(seen!.aborted).toBe(true);
  });

  it('成功したらタイマーを片付ける（無応答のタイマーが残らない）', async () => {
    const { fetchWithTimeout } = await import('../src/utils/httpTimeout');
    globalThis.fetch = vi.fn(async () => ({ ok: true } as Response)) as any;

    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    await fetchWithTimeout('https://example.test/x', {}, 15000);
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('失敗したときもタイマーを片付ける（finally で clearTimeout）', async () => {
    const { fetchWithTimeout } = await import('../src/utils/httpTimeout');
    globalThis.fetch = vi.fn(async () => { throw new TypeError('Failed to fetch'); }) as any;

    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    await expect(fetchWithTimeout('https://example.test/x', {}, 15000)).rejects.toThrow('Failed to fetch');
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });

  it('移動前の実装とふるまいが一致する（成功・abort の両方）', async () => {
    const { fetchWithTimeout } = await import('../src/utils/httpTimeout');

    // 成功時: どちらも同じ Response を返し、signal を足して呼ぶ
    for (const fn of [legacyFetchWithTimeout, fetchWithTimeout]) {
      const fake = { ok: true, status: 201 } as Response;
      const seen: any[] = [];
      globalThis.fetch = vi.fn(async (_u: any, i: any) => { seen.push(i); return fake; }) as any;
      const got = await fn('https://example.test/x', { method: 'POST', body: 'b' }, 15000);
      expect(got).toBe(fake);
      expect(seen[0].body).toBe('b');
      expect(seen[0].signal).toBeInstanceOf(AbortSignal);
    }

    // タイムアウト時: どちらも AbortError で落ちる
    for (const fn of [legacyFetchWithTimeout, fetchWithTimeout]) {
      globalThis.fetch = vi.fn((_u: any, i: any) => new Promise((_r, rej) => {
        i.signal.addEventListener('abort', () => { const e: any = new Error('aborted'); e.name = 'AbortError'; rej(e); });
      })) as any;
      await expect(fn('https://example.test/slow', {}, 10)).rejects.toMatchObject({ name: 'AbortError' });
    }
  });

  it('タイムアウト値は15秒で、2つの送信口で同じ値を使っている', async () => {
    const { WEBHOOK_TIMEOUT_MS } = await import('../src/utils/httpTimeout');
    expect(WEBHOOK_TIMEOUT_MS).toBe(15000);

    // 「フィードバックと揃える」という意図が実装で保証されていること
    // （以前は同じ 15000 が2箇所に手書きされており、片方だけ変えられた）
    for (const file of ['src/utils/feedback.ts', 'src/utils/userRegistry.ts']) {
      const src = readFileSync(resolve(__dirname, '..', file), 'utf8');
      expect(src, `${file} に WEBHOOK_TIMEOUT_MS の定義が残っている`).not.toMatch(/const WEBHOOK_TIMEOUT_MS\s*=/u);
      expect(src, `${file} が httpTimeout を使っていない`).toMatch(/from '\.\/httpTimeout'/u);
    }
  });

  it('実装は httpTimeout.ts だけにある（2つに増えていない）', () => {
    const decl = /function fetchWithTimeout\s*\(/u;
    for (const file of ['src/utils/feedback.ts', 'src/utils/userRegistry.ts']) {
      const src = readFileSync(resolve(__dirname, '..', file), 'utf8');
      expect(src, `${file} に実装が復活している`).not.toMatch(decl);
    }
    const home = readFileSync(resolve(__dirname, '..', 'src/utils/httpTimeout.ts'), 'utf8');
    expect(home).toMatch(/export async function fetchWithTimeout\s*\(/u);
    // 依存を増やしていないこと（src 内の何も import しない葉モジュール）
    expect(home).not.toMatch(/^import .* from '\.\//mu);
  });

  it('呼び出し側の送信作法は変えていない（feedback / userRegistry）', () => {
    const FB = readFileSync(resolve(__dirname, '..', 'src/utils/feedback.ts'), 'utf8');
    const UR = readFileSync(resolve(__dirname, '..', 'src/utils/userRegistry.ts'), 'utf8');
    // 呼び出し形はそのまま
    expect(FB).toContain('await fetchWithTimeout(url, init, WEBHOOK_TIMEOUT_MS)');
    expect(UR).toContain('await fetchWithTimeout(url, init, WEBHOOK_TIMEOUT_MS)');
    // CORS 失敗時の no-cors 撃ち直しも残っている
    expect(UR).toContain("mode: 'no-cors'");
    expect(FB).toContain("mode: 'no-cors'");
    // AbortError の分岐（タイムアウトは再試行しない）も残っている
    expect(FB).toContain("error?.name === 'AbortError'");
    expect(UR).toContain("error?.name === 'AbortError'");
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../src/utils/feedback', () => ({ submitFeedback: vi.fn(async () => ({ ok: true, delivered: ['firestore'], failed: [] })) }));

import { blockUser, unblockUser, isBlocked, listBlockedUsers, withoutBlocked, subscribeBlocked, reportUser } from '../src/features/safety/userSafety';
import { submitFeedback } from '../src/utils/feedback';

class MemStorage {
  m = new Map<string, string>();
  get length() { return this.m.size; }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
}

beforeEach(() => { (globalThis as any).localStorage = new MemStorage(); });

describe('ブロック（App Store 1.2）', () => {
  it('ブロック・解除・一覧', () => {
    expect(isBlocked('u1')).toBe(false);
    blockUser('u1', 'たろう');
    expect(isBlocked('u1')).toBe(true);
    expect(listBlockedUsers()[0].nickname).toBe('たろう');
    blockUser('u1', 'たろう2');
    expect(listBlockedUsers()).toHaveLength(1);
    unblockUser('u1');
    expect(isBlocked('u1')).toBe(false);
  });
  it('一覧からブロック中の人を除く（uid の無い行は残す）', () => {
    blockUser('b');
    expect(withoutBlocked([{ uid: 'a' }, { uid: 'b' }, { uid: null }]).map((r) => r.uid)).toEqual(['a', null]);
  });
  it('変更を購読できる', () => {
    const fn = vi.fn();
    const off = subscribeBlocked(fn);
    blockUser('x');
    off();
    blockUser('y');
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('壊れた保存値でも落ちない', () => {
    localStorage.setItem('mntb_blocked_users_v1', '{broken');
    expect(listBlockedUsers()).toEqual([]);
  });
});

describe('通報', () => {
  it('フィードバック経路（既存ルール）に [通報] として載せる', async () => {
    const ok = await reportUser({ uid: 'u9', nickname: 'ぽち', where: 'ranking' }, 'name', '名前がひどい');
    expect(ok).toBe(true);
    const arg = (submitFeedback as any).mock.calls[0][0];
    expect(arg.category).toBe('problem');
    expect(arg.message).toContain('[通報]');
    expect(arg.message).toContain('u9');
    expect(arg.context.kind).toBe('user_report');
  });
});

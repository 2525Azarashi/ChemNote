import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase', () => ({ db: {}, auth: {} }));
import { clearLocalData } from '../src/features/account/accountDeletion';

describe('アカウント削除：端末の記録を消す', () => {
  it('uid を含むキーと mntb_* だけ消し、他人の記録は残す', () => {
    const m = new Map<string, string>([
      ['profile_U1', '1'], ['streak_U1', '1'], ['mntb_growth', '1'], ['profile_U2', '1'], ['theme', 'dark'],
    ]);
    const store = {
      get length() { return m.size; },
      key: (i: number) => [...m.keys()][i] ?? null,
      removeItem: (k: string) => { m.delete(k); },
    } as unknown as Storage;
    expect(clearLocalData('U1', store)).toBe(3);
    expect([...m.keys()].sort()).toEqual(['profile_U2', 'theme']);
  });
});

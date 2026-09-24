import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, vi, beforeEach } from 'vitest';

/** 運営専用 Firebase 使用量メーター：数え方とすべての Firestore 呼び出しが経由していることを確認 */
const store = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => { store.set(k, String(v)); },
  removeItem: (k: string) => { store.delete(k); },
  clear: () => store.clear(),
  key: () => null,
  length: 0,
});

vi.mock('firebase/firestore', () => ({
  getDoc: vi.fn(async () => ({ metadata: { fromCache: false }, exists: () => true })),
  getDocs: vi.fn(async () => ({ metadata: { fromCache: false }, size: 7 })),
  setDoc: vi.fn(async () => {}),
  updateDoc: vi.fn(async () => {}),
  addDoc: vi.fn(async () => ({})),
  deleteDoc: vi.fn(async () => {}),
  onSnapshot: vi.fn(() => () => {}),
  writeBatch: vi.fn(() => ({ set: vi.fn(), update: vi.fn(), delete: vi.fn(), commit: vi.fn(async () => {}) })),
  runTransaction: vi.fn(),
}));

import * as m from '../src/utils/firestoreMetered';

describe('firestoreMetered', () => {
  beforeEach(() => { m.clearUsage(); });

  it('読み取り・書き込み・削除を機能（最上位コレクション）ごとに数える', async () => {
    await m.getDoc({ path: 'battle_rooms/abc' } as never);
    await m.getDocs({ path: 'leaderboard_total' } as never);
    await m.setDoc({ path: 'battle_rooms/abc' } as never, {} as never);
    await m.deleteDoc({ path: 'battle_codes/XY12' } as never);
    const b = m.writeBatch({} as never);
    b.set({ path: 'friends/u/items/v' } as never, {} as never);
    b.delete({ path: 'friends/u/items/w' } as never);
    await b.commit();
    m.flushUsageNow();
    const [day] = m.readUsage();
    expect(day.reads).toBe(8);
    expect(day.writes).toBe(2);
    expect(day.deletes).toBe(2);
    expect(day.byArea.battle_rooms).toEqual({ reads: 1, writes: 1, deletes: 0 });
    expect(day.byArea.leaderboard_total.reads).toBe(7);
    expect(day.byArea.friends).toEqual({ reads: 0, writes: 1, deletes: 1 });
  });

  it('アプリの Firestore 呼び出しは firebase.ts 以外すべてメーター経由', () => {
    const walk = (d: string): string[] => readdirSync(d).flatMap((f) => {
      const p = join(d, f);
      return statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(f) ? [p] : [];
    });
    const offenders = walk('src').filter((p) => !/firebase\.ts$|firestoreMetered\.ts$/.test(p))
      .filter((p) => /from 'firebase\/firestore'/.test(readFileSync(p, 'utf8')) && !/import type/.test(readFileSync(p, 'utf8').match(/.*from 'firebase\/firestore'.*/)?.[0] ?? ''));
    expect(offenders).toEqual([]);
  });

  it('使用量パネルは運営だけに出る（FeedbackAdminPanel 内で admin 判定）', () => {
    const src = readFileSync('src/components/FeedbackAdminPanel.tsx', 'utf8');
    expect(src).toMatch(/\{admin && <UsageMeterPanel \/>\}/);
  });
});

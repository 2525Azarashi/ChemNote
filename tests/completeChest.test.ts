/**
 * デイリーコンプリート宝箱（core/growth.ts）のテスト。
 * ミッション3つを全部受け取ると1日1回開けられ、7日連続で大当たり。
 */
import { describe, expect, it } from 'vitest';
import {
  allMissionsClaimed,
  BADGES,
  chestOpenedToday,
  claimMission,
  COINS_PER_WRITE_MAX,
  COMPLETE_CHEST_ID,
  completeChestFor,
  currentCompleteStreak,
  emptyProgress,
  missionsForDate,
  normalizeProgress,
  openCompleteChest,
  XP_PER_WRITE_MAX,
  type GrowthProgress,
} from '../src/battle/core/growth';

function allDone(p: GrowthProgress, today: string): GrowthProgress {
  const ms = missionsForDate(today);
  let next: GrowthProgress = { ...p, daily: { date: today, progress: Object.fromEntries(ms.map((m) => [m.id, m.goal])), claimed: [] } };
  for (const m of ms) next = claimMission(next, m.id, today).next;
  return next;
}

function nextDay(d: string): string {
  const t = new Date(`${d}T00:00:00`);
  t.setDate(t.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
}

describe('completeChestFor', () => {
  it('7日周期で増え、7日目が大当たり。書き込み上限を超えない', () => {
    const days = [1, 2, 3, 4, 5, 6, 7].map(completeChestFor);
    for (let i = 1; i < 6; i++) expect(days[i].coins).toBeGreaterThan(days[i - 1].coins);
    expect(days[6].jackpot).toBe(true);
    expect(days.slice(0, 6).every((d) => !d.jackpot)).toBe(true);
    expect(completeChestFor(8).coins).toBe(completeChestFor(1).coins);
    expect(completeChestFor(14).jackpot).toBe(true);
    for (let d = 0; d <= 30; d++) {
      const c = completeChestFor(d);
      expect(c.coins).toBeLessThanOrEqual(COINS_PER_WRITE_MAX);
      expect(c.xp).toBeLessThanOrEqual(XP_PER_WRITE_MAX);
    }
  });
});

describe('openCompleteChest', () => {
  const today = '2026-09-24';

  it('ミッションが残っていると開かない', () => {
    const p = emptyProgress('u');
    expect(allMissionsClaimed(p, today)).toBe(false);
    const r = openCompleteChest(p, today);
    expect(r.reward).toBeNull();
    expect(r.next).toBe(p);
  });

  it('全部受け取ると1回だけ開く', () => {
    const p = allDone(emptyProgress('u'), today);
    expect(allMissionsClaimed(p, today)).toBe(true);
    const r = openCompleteChest(p, today);
    expect(r.reward).toEqual(completeChestFor(1));
    expect(r.next.coins).toBe(p.coins + r.reward!.coins);
    expect(r.next.xp).toBe(p.xp + r.reward!.xp);
    expect(r.next.completeDays).toBe(1);
    expect(r.next.daily.claimed).toContain(COMPLETE_CHEST_ID);
    expect(chestOpenedToday(r.next, today)).toBe(true);
    expect(openCompleteChest(r.next, today).reward).toBeNull();
  });

  it('宝箱IDはミッション受け取りと干渉しない', () => {
    const p = openCompleteChest(allDone(emptyProgress('u'), today), today).next;
    expect(claimMission(p, COMPLETE_CHEST_ID, today).reward).toBeNull();
  });

  it('連続で開けると7日目に大当たり、1日空くとリセット', () => {
    let p = emptyProgress('u');
    let d = today;
    for (let i = 1; i <= 7; i++) {
      const r = openCompleteChest(allDone(p, d), d);
      expect(r.reward?.streak).toBe(i);
      p = r.next;
      if (i < 7) d = nextDay(d);
    }
    expect(p.completeStreak).toBe(7);
    expect(p.badges.b_chest_7).toBeDefined();
    expect(currentCompleteStreak(p, d)).toBe(7);
    expect(currentCompleteStreak(p, nextDay(d))).toBe(7);
    const gap = nextDay(nextDay(d));
    expect(currentCompleteStreak(p, gap)).toBe(0);
    const r = openCompleteChest(allDone(p, gap), gap);
    expect(r.reward?.streak).toBe(1);
    expect(r.next.completeDays).toBe(8);
  });

  it('古い保存データでも壊れない', () => {
    const p = normalizeProgress('u', { xp: 10, coins: 5 });
    expect(p.completeStreak).toBe(0);
    expect(p.completeDays).toBe(0);
    expect(p.lastCompleteDate).toBe('');
    expect(BADGES.some((b) => b.id === 'b_chest_30')).toBe(true);
  });
});

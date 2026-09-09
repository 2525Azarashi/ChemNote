/**
 * 成長システム（core/growth.ts）の純粋ロジックのテスト。
 *
 * 経験値は両端末が同じ採点結果から同じ値を出さなければならない。
 * ここがズレると、同じ試合で友達と貰える経験値が違う、という形で壊れる。
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  applyHolesFilled,
  applyLogin,
  applyLoginWithBonus,
  loginBonusFor,
  ratingTierChange,
  ratingTierOf,
  shareTextForMatch,
  applyMatchToProgress,
  BADGES,
  canClaimMission,
  claimMission,
  COINS_PER_WRITE_MAX,
  emptyProgress,
  equipItem,
  equipTitle,
  evaluateUnlocks,
  ITEMS,
  levelOf,
  MISSION_POOL,
  missionsForDate,
  MISSIONS_PER_DAY,
  normalizeProgress,
  purchaseItem,
  rankSubjects,
  XP_PER_MATCH_MAX,
  XP_PER_WRITE_MAX,
  xpForMatch,
  xpRequiredForLevel,
  type MatchSummaryForGrowth,
} from '../src/battle/core/growth';
import type { BattlePlayerScore } from '../src/battle/core/types';

function score(correct: boolean[], maxStreak = 0): BattlePlayerScore {
  return {
    uid: 'a',
    perQuestion: correct.map((c, i) => ({
      index: i, correct: c, timeUsed: 3, base: c ? 100 : 0, speed: 0, streak: 0, total: c ? 100 : 0,
    })),
    score: correct.filter(Boolean).length * 100,
    correctCount: correct.filter(Boolean).length,
    totalTime: 30,
    maxStreak,
  };
}

function match(over: Partial<MatchSummaryForGrowth> = {}): MatchSummaryForGrowth {
  return {
    roomId: 'room-1', subject: 'chemistry_basic', outcome: 'win', buzz: false, forfeit: false,
    score: score([true, true, true, false, true], 3), answeredCount: 5, holesFilled: 0, ...over,
  };
}

describe('経験値', () => {
  it('負けても0にはならない（参加＋正解ぶんは必ず入る）', () => {
    const xp = xpForMatch(score([false, false, true]), 'lose');
    expect(xp.total).toBe(20 + 10);
    expect(xp.outcome).toBe(0);
  });
  it('勝利・連続・全問のボーナスが積まれる', () => {
    const xp = xpForMatch(score([true, true, true, true], 4), 'win');
    expect(xp).toEqual({ participation: 20, correct: 40, outcome: 50, streak: 15, perfect: 30, total: 155 });
  });
  it('不戦勝は勝利ボーナスが半分', () => {
    expect(xpForMatch(score([true]), 'win', true).outcome).toBe(25);
  });
  it('1試合の上限を超えない（20問全問正解でも上限内）', () => {
    const xp = xpForMatch(score(Array(20).fill(true), 20), 'win');
    expect(xp.total).toBeLessThanOrEqual(XP_PER_MATCH_MAX);
    expect(xp.total).toBe(315);
  });
});

describe('レベル', () => {
  it('必要経験値は単調増加', () => {
    for (let l = 2; l < 99; l += 1) expect(xpRequiredForLevel(l + 1)).toBeGreaterThan(xpRequiredForLevel(l));
  });
  it('0xp は Lv1、境界ちょうどで上がる', () => {
    expect(levelOf(0).level).toBe(1);
    expect(levelOf(xpRequiredForLevel(2) - 1).level).toBe(1);
    expect(levelOf(xpRequiredForLevel(2)).level).toBe(2);
    expect(levelOf(xpRequiredForLevel(30)).level).toBe(30);
  });
  it('進捗率は 0〜1', () => {
    const info = levelOf(xpRequiredForLevel(5) + 10);
    expect(info.level).toBe(5);
    expect(info.ratio).toBeGreaterThan(0);
    expect(info.ratio).toBeLessThan(1);
  });
  it('負数・NaN は 0 扱い', () => {
    expect(levelOf(-5).level).toBe(1);
    expect(levelOf(Number.NaN).level).toBe(1);
  });
});

describe('試合の反映', () => {
  const today = '2026-09-08';
  it('経験値・勝敗・教科別成績・バッジ・装備解放が動く', () => {
    const { next, delta } = applyMatchToProgress(emptyProgress('a'), match(), today, 1000);
    expect(delta).not.toBeNull();
    expect(next.matches).toBe(1);
    expect(next.wins).toBe(1);
    expect(next.xp).toBe(delta!.xp.total);
    expect(next.subjects.chemistry_basic).toEqual({ matches: 1, wins: 1, correct: 4, answered: 5 });
    expect(delta!.newBadges).toContain('b_first_match');
    expect(delta!.newBadges).toContain('b_first_win');
    expect(next.badges.b_first_win).toBe(1000);
    expect(next.owned).toContain('pose_good');
    expect(delta!.unlocked).toContain('pose_good');
    expect(next.lastRoomId).toBe('room-1');
  });
  it('同じ部屋IDは二度反映しない', () => {
    const first = applyMatchToProgress(emptyProgress('a'), match(), today).next;
    const again = applyMatchToProgress(first, match(), today);
    expect(again.delta).toBeNull();
    expect(again.next).toBe(first);
  });
  it('早押しの勝利は buzzWins に数える', () => {
    expect(applyMatchToProgress(emptyProgress('a'), match({ buzz: true }), today).next.buzzWins).toBe(1);
  });
  it('全問正解は perfectGames に数える', () => {
    const { next } = applyMatchToProgress(emptyProgress('a'), match({ score: score([true, true, true], 3) }), today);
    expect(next.perfectGames).toBe(1);
    expect(next.badges).toHaveProperty('b_perfect');
  });
  it('1回の書き込みで増える経験値・コインは上限内（試合＋全ミッション受け取り）', () => {
    let total = applyMatchToProgress(emptyProgress('a'), match({ score: score(Array(20).fill(true), 20), holesFilled: 5 }), today).next;
    for (const m of missionsForDate(today)) total = claimMission(total, m.id, today).next;
    expect(total.xp).toBeLessThanOrEqual(XP_PER_WRITE_MAX);
    expect(total.coins).toBeLessThanOrEqual(COINS_PER_WRITE_MAX);
  });
});

describe('デイリーミッション', () => {
  it('毎日3つ・穴系を必ず1つ・同じ種類は重ならない', () => {
    for (let d = 1; d <= 28; d += 1) {
      const ms = missionsForDate(`2026-09-${String(d).padStart(2, '0')}`);
      expect(ms).toHaveLength(MISSIONS_PER_DAY);
      expect(ms.filter((m) => m.kind === 'holes')).toHaveLength(1);
      expect(new Set(ms.map((m) => m.kind)).size).toBe(ms.length);
    }
  });
  it('日付が同じなら同じ組（端末やユーザーに依存しない）', () => {
    expect(missionsForDate('2026-09-08')).toEqual(missionsForDate('2026-09-08'));
  });
  it('試合で進み、達成したら受け取れる。二度は受け取れない', () => {
    const today = '2026-09-08';
    const ms = missionsForDate(today);
    let p = emptyProgress('a');
    for (let i = 0; i < 3; i += 1) {
      p = applyMatchToProgress(p, match({ roomId: `r${i}`, buzz: true, score: score([true, true, true, true, true], 5) }), today).next;
    }
    for (const m of ms) {
      if (m.kind === 'holes') continue;
      expect(p.daily.progress[m.id]).toBe(m.goal);
      expect(canClaimMission(p, m.id, today)).toBe(true);
      const r = claimMission(p, m.id, today);
      expect(r.reward).toEqual({ xp: m.rewardXp, coins: m.rewardCoins });
      expect(claimMission(r.next, m.id, today).reward).toBeNull();
    }
  });
  it('日付が変わると進捗はリセットされる', () => {
    let p = applyMatchToProgress(emptyProgress('a'), match(), '2026-09-08').next;
    expect(Object.keys(p.daily.progress).length).toBeGreaterThan(0);
    p = applyLogin(p, '2026-09-09');
    expect(p.daily.date).toBe('2026-09-09');
    expect(p.daily.progress).toEqual({});
  });
  it('穴を埋めると穴系ミッションだけ進む', () => {
    const today = '2026-09-08';
    const holes = missionsForDate(today).find((m) => m.kind === 'holes')!;
    const p = applyHolesFilled(emptyProgress('a'), 2, today);
    expect(p.holesFilled).toBe(2);
    expect(p.daily.progress[holes.id]).toBe(Math.min(2, holes.goal));
    expect(Object.keys(p.daily.progress)).toEqual([holes.id]);
  });
  it('ミッションIDは重複しない', () => {
    expect(new Set(MISSION_POOL.map((m) => m.id)).size).toBe(MISSION_POOL.length);
  });
});

describe('ログイン日数', () => {
  it('同じ日は1回しか数えない、翌日は連続、飛ぶとリセット', () => {
    let p = applyLogin(emptyProgress('a'), '2026-09-08');
    expect(p.loginDays).toBe(1);
    expect(p.loginStreak).toBe(1);
    expect(applyLogin(p, '2026-09-08')).toBe(p);
    p = applyLogin(p, '2026-09-09');
    expect(p.loginStreak).toBe(2);
    p = applyLogin(p, '2026-09-12');
    expect(p.loginDays).toBe(3);
    expect(p.loginStreak).toBe(1);
  });
});

describe('バッジ・装備', () => {
  it('IDは重複しない・装備の参照先バッジは実在する', () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(ITEMS.length);
    for (const item of ITEMS) {
      if ('badge' in item.unlock) expect(BADGES.some((b) => b.id === item.unlock.badge)).toBe(true);
    }
  });
  it('ポーズ画像は public/mascots に実在する', () => {
    for (const item of ITEMS.filter((i) => i.kind === 'pose')) {
      const path = resolve(__dirname, '..', 'public', item.value.replace(/^\//, ''));
      expect(() => readFileSync(path)).not.toThrow();
    }
  });
  it('持っていない装備・称号は身につけられない', () => {
    const p = emptyProgress('a');
    expect(equipItem(p, 'pose_sleeping')).toBe(p);
    expect(equipTitle(p, 'b_first_win')).toBe(p);
    expect(equipTitle(p, '').equipped.title).toBe('');
  });
  it('コイン交換：足りなければ拒否、足りれば減って所持', () => {
    expect(purchaseItem(emptyProgress('a'), 'frame_pink').ok).toBe(false);
    const rich = purchaseItem({ ...emptyProgress('a'), coins: 100 }, 'frame_pink');
    expect(rich.ok).toBe(true);
    expect(rich.next.coins).toBe(20);
    expect(rich.next.owned).toContain('frame_pink');
    expect(purchaseItem(rich.next, 'frame_pink').ok).toBe(false);
    expect(purchaseItem({ ...emptyProgress('a'), coins: 9999 }, 'pose_walking').ok).toBe(false);
  });
  it('レベルで自動解放される', () => {
    const unlocked = evaluateUnlocks({ ...emptyProgress('a'), xp: xpRequiredForLevel(10) });
    expect(unlocked).toContain('pose_walking');
    expect(unlocked).toContain('frame_blue');
    expect(unlocked).not.toContain('frame_purple');
  });
});

describe('normalizeProgress', () => {
  it('壊れたデータでも初期値で埋める', () => {
    const p = normalizeProgress('a', { xp: 'abc', coins: -5, owned: [1, 'pose_good'], equipped: { pose: 3 } });
    expect(p.xp).toBe(0);
    expect(p.coins).toBe(0);
    expect(p.owned).toEqual(['pose_basic', 'frame_paper', 'pose_good']);
    expect(p.equipped.pose).toBe('pose_basic');
  });
  it('null は空の記録', () => {
    expect(normalizeProgress('a', null)).toEqual(emptyProgress('a'));
  });
});

describe('教科別統計', () => {
  it('正答率の高い順に並ぶ', () => {
    let p = emptyProgress('a');
    p = applyMatchToProgress(p, match({ roomId: 'r1', subject: 'math', score: score([true, false, false, false]), answeredCount: 4 }), '2026-09-08').next;
    p = applyMatchToProgress(p, match({ roomId: 'r2', subject: 'chemistry_basic', score: score([true, true, true, false]), answeredCount: 4 }), '2026-09-08').next;
    const ranked = rankSubjects(p);
    expect(ranked[0]!.subject).toBe('chemistry_basic');
    expect(ranked[0]!.accuracy).toBe(75);
    expect(ranked[1]!.accuracy).toBe(25);
  });
});

describe('つぎの目標', () => {
  it('数えられる全バッジに進捗がある・上限で丸める', async () => {
    const { badgeProgress, nextBadgeGoals, nextLevelUnlock, msUntilNextDay } = await import('../src/battle/core/growth');
    const p = { ...emptyProgress('a'), matches: 6, wins: 12 };
    expect(badgeProgress(p, 'b_matches_10')).toEqual({ id: 'b_matches_10', current: 6, goal: 10, remain: 4, ratio: 0.6 });
    expect(badgeProgress(p, 'b_wins_10')!.remain).toBe(0);
    for (const b of BADGES) expect(badgeProgress(p, b.id), b.id).not.toBeNull();
    const goals = nextBadgeGoals(p, 3);
    expect(goals.length).toBe(3);
    // 同じ系列（試合数）は1つだけ
    expect(goals.filter((g) => g.id.startsWith('b_matches_')).length).toBeLessThanOrEqual(1);
    // 達成済みのバッジは出ない
    const earned = applyMatchToProgress(emptyProgress('a'), match(), '2026-09-08').next;
    expect(nextBadgeGoals(earned, 10).some((g) => g.id === 'b_first_match')).toBe(false);
    // つぎのレベル解放
    expect(nextLevelUnlock(emptyProgress('a'))?.level).toBe(3);
    expect(nextLevelUnlock({ ...emptyProgress('a'), xp: xpRequiredForLevel(99), owned: ITEMS.map((i) => i.id) })).toBeNull();
    // 翌日0時まで
    expect(msUntilNextDay(new Date(2026, 8, 8, 23, 0, 0))).toBe(3_600_000);
  });
});

describe('ログインボーナス', () => {
  it('連続日数で増え、7日目が節目。書き込み上限に収まる', () => {
    const days = [1, 2, 3, 4, 5, 6, 7].map((d) => loginBonusFor(d));
    for (let i = 1; i < days.length; i++) expect(days[i].coins).toBeGreaterThan(days[i - 1].coins);
    expect(days[6].milestone).toBe(true);
    expect(days[5].milestone).toBe(false);
    // 8日目は1日目と同じ額（7日周期）
    expect(loginBonusFor(8).coins).toBe(loginBonusFor(1).coins);
    for (let d = 1; d <= 30; d++) {
      const b = loginBonusFor(d);
      expect(b.coins).toBeLessThanOrEqual(COINS_PER_WRITE_MAX);
      expect(b.xp).toBeLessThanOrEqual(600);
    }
  });
  it('初回は付く・同じ日は付かない・翌日は連続2日目の額', () => {
    const r1 = applyLoginWithBonus(emptyProgress('a'), '2026-09-08');
    expect(r1.bonus?.streak).toBe(1);
    expect(r1.next.coins).toBe(loginBonusFor(1).coins);
    expect(r1.next.xp).toBe(loginBonusFor(1).xp);
    const r2 = applyLoginWithBonus(r1.next, '2026-09-08');
    expect(r2.bonus).toBeNull();
    expect(r2.next).toBe(r1.next);
    const r3 = applyLoginWithBonus(r1.next, '2026-09-09');
    expect(r3.bonus?.streak).toBe(2);
    expect(r3.next.coins).toBe(loginBonusFor(1).coins + loginBonusFor(2).coins);
  });
});

describe('レート段位・シェア文', () => {
  it('段位の境目は battleRanking と同じ（1350/1500/1650/1800/2000）', () => {
    expect(ratingTierOf(1499).label).toBe('初級');
    expect(ratingTierOf(1500).label).toBe('中級');
    expect(ratingTierOf(2000).label).toBe('達人');
    expect(ratingTierOf(2000).next).toBeNull();
    expect(ratingTierOf(1500).next).toBe(1650);
  });
  it('段位の変化を検出する', () => {
    expect(ratingTierChange(1490, 1505)).toBe('up');
    expect(ratingTierChange(1505, 1490)).toBe('down');
    expect(ratingTierChange(1510, 1530)).toBeNull();
  });
  it('シェア文に勝敗・点・レート・レベルが入る', () => {
    const t = shareTextForMatch({
      outcome: 'win', subjectLabel: '化学基礎', myScore: 390, theirScore: 360,
      rating: { before: 1500, after: 1513 }, level: 3, title: '初勝利',
    });
    expect(t).toContain('勝ち！');
    expect(t).toContain('390 - 360');
    expect(t).toContain('1513（+13）中級');
    expect(t).toContain('Lv.3 「初勝利」');
    expect(t.split('\n').length).toBe(4);
  });
});

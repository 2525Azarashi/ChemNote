/**
 * ゲーム機能の追加分（演習報酬・マナラッシュ・ボーナスミッション・宝箱・5連ガチャ）。
 */
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
const { auth } = vi.hoisted(() => ({ auth: { currentUser: { uid: 'a' } as { uid: string } | null } }));
vi.mock('../src/firebase', () => ({ auth }));
import {
  allMissionsForDate, applyRushResult, applyStudySolved, BADGES, BONUS_MISSION_POOL, bonusMissionsForDate,
  allMissionsClaimed, claimMission, COINS_PER_WRITE_MAX, completeChestFor, emptyProgress, ITEMS, MISSION_POOL,
  missionById, missionsForDate, normalizeProgress, openCompleteChest, rushRankOf, rushRewardFor, STUDY_REWARD,
  XP_PER_WRITE_MAX, badgeProgress,
} from '../src/battle/core/growth';
import { applyRushGrowth, drawGachaMulti, GACHA_MULTI_COUNT, GROWTH_STORAGE_PREFIX, loadMyGrowth, openChest,
  recordStudyGrowth, rushCoinPlaysLeft } from '../src/battle/data/growthStore';
import { GACHA_COST } from '../src/battle/core/arenaEconomy';
import { isRushQuestion, rushPointsFor, RUSH_FEVER_COMBO } from '../src/components/ManaRush';
import type { BattleQuestion } from '../src/battle/core/types';

const data = new Map<string, string>();
const storage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => { data.set(k, v); },
  removeItem: (k: string) => data.delete(k), clear: () => data.clear() };
const key = (uid = 'a') => GROWTH_STORAGE_PREFIX + uid;
const TODAY = '2026-09-09';
const rush = (over: Partial<Parameters<typeof applyRushResult>[1]> = {}) =>
  ({ runId: 'run1', subject: 'math', score: 1800, correct: 12, answered: 14, maxCombo: 6, ...over });

beforeEach(() => {
  data.clear(); auth.currentUser = { uid: 'a' };
  vi.stubGlobal('localStorage', storage); vi.useFakeTimers(); vi.setSystemTime(new Date(2026, 8, 9, 12));
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('ボーナスミッション', () => {
  it('毎日2つ（演習1・マナラッシュ1）で、対戦ミッションと合わせて5つ・ID重複なし', () => {
    for (let d = 1; d <= 28; d += 1) {
      const date = `2026-09-${String(d).padStart(2, '0')}`;
      const b = bonusMissionsForDate(date);
      expect(b).toHaveLength(2);
      expect(b[0]!.kind).toBe('study');
      expect(b[1]!.kind).not.toBe('study');
      const all = allMissionsForDate(date);
      expect(all).toHaveLength(5);
      expect(new Set(all.map(m => m.id)).size).toBe(5);
    }
    const ids = [...MISSION_POOL, ...BONUS_MISSION_POOL].map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(missionById('x_study3')?.kind).toBe('study');
  });
  it('対戦ミッションの組み合わせは従来どおり（既存の3つを変えていない）', () => {
    expect(missionsForDate(TODAY)).toHaveLength(3);
  });
  it('保存済みのボーナスミッション進捗は読み込みで捨てない', () => {
    const p = normalizeProgress('a', { daily: { date: TODAY, progress: { x_study3: 2, bogus: 9 }, claimed: [] } });
    expect(p.daily.progress).toEqual({ x_study3: 2 });
  });
});

describe('演習の報酬', () => {
  it('XP・コイン・演習ミッションが進み、バッジも付く', () => {
    let p = emptyProgress('a');
    const study = bonusMissionsForDate(TODAY)[0]!;
    for (let i = 0; i < 10; i += 1) p = applyStudySolved(p, TODAY).next;
    expect(p.xp).toBeGreaterThanOrEqual(STUDY_REWARD.xp * 10);
    expect(p.coins).toBe(STUDY_REWARD.coins * 10);
    expect(p.studySolved).toBe(10);
    expect(p.daily.progress[study.id]).toBe(study.goal);
    expect(p.badges).toHaveProperty('b_study_10');
  });
  it('同じ大問は1日1回だけ（何度解き直しても増えすぎない）', async () => {
    expect((await recordStudyGrowth('a', 'c1::q1'))?.reward).toEqual(STUDY_REWARD);
    expect((await recordStudyGrowth('a', 'c1::q1'))?.reward).toBeNull();
    expect((await loadMyGrowth()).studySolved).toBe(1);
    vi.setSystemTime(new Date(2026, 8, 10, 12));
    expect((await recordStudyGrowth('a', 'c1::q1'))?.reward).toEqual(STUDY_REWARD);
    // 前日の study 記録は保存時に掃除される
    const receipts: string[] = JSON.parse(data.get(key())!).receipts;
    expect(receipts.some(r => r.startsWith('study:2026-09-09'))).toBe(false);
  });
  it('別アカウントの操作では書かない', async () => {
    expect(await recordStudyGrowth('b', 'c1::q1')).toBeNull();
    expect(data.size).toBe(0);
  });
  it('演習の採点から呼ばれている（動的 import で初回読み込みを重くしない）', () => {
    const src = readFileSync('src/utils/quizScoring.ts', 'utf8');
    expect(src).toContain("import('../battle/data/growthStore')");
    expect(src).toContain('recordStudyGrowth');
    expect(src).not.toMatch(/^import .*growthStore/m);
  });
});

describe('マナラッシュ', () => {
  it('得点：コンボで増え、フィーバーで2倍、はやいほどボーナス', () => {
    expect(rushPointsFor(1, 5000).points).toBe(100);
    expect(rushPointsFor(1, 1000).points).toBe(150);
    expect(rushPointsFor(3, 5000).points).toBe(140);
    const fever = rushPointsFor(RUSH_FEVER_COMBO, 5000);
    expect(fever.fever).toBe(true);
    expect(fever.points).toBe((100 + (RUSH_FEVER_COMBO - 1) * 20) * 2);
    // コンボ加点は上限つき
    expect(rushPointsFor(50, 5000).points).toBe(rushPointsFor(11, 5000).points);
  });
  it('出題は画像・音声なしの短い選択式だけ', () => {
    const q: BattleQuestion = { id: 'x', subject: 'math', chapterId: 'c', problemId: 'p', subQuestionId: 's', format: 'choice4',
      prompt: '', label: '1+1=?', options: ['1', '2', '3', '4'], answerIndex: 1, panelOrder: [], timeLimit: 20 };
    expect(isRushQuestion(q)).toBe(true);
    expect(isRushQuestion({ ...q, imageUrl: '/a.png' })).toBe(false);
    expect(isRushQuestion({ ...q, audioUrl: '/a.mp3' })).toBe(false);
    expect(isRushQuestion({ ...q, format: 'kana' })).toBe(false);
    expect(isRushQuestion({ ...q, label: 'あ'.repeat(200) })).toBe(false);
    expect(isRushQuestion({ ...q, answerIndex: 9 })).toBe(false);
  });
  it('ランク', () => {
    expect(rushRankOf(0)).toBe('C'); expect(rushRankOf(1200)).toBe('B');
    expect(rushRankOf(2500)).toBe('A'); expect(rushRankOf(4000)).toBe('S');
  });
  it('結果の反映：自己ベスト・教科別ベスト・ミッション・バッジ', () => {
    const r = applyRushResult(emptyProgress('a'), rush({ score: 4200, maxCombo: 10 }), TODAY, true);
    expect(r.newBest).toBe(true);
    expect(r.next.rushBest).toBe(4200);
    expect(r.next.rushBestBy.math).toBe(4200);
    expect(r.next.rushPlays).toBe(1);
    expect(r.next.badges).toHaveProperty('b_rush_first');
    expect(r.next.badges).toHaveProperty('b_rush_4000');
    expect(r.next.badges).toHaveProperty('b_rush_combo10');
    expect(r.next.owned).toContain('frame_lightning');
    expect(r.next.owned).toContain('frame_comet');
    const rushMission = bonusMissionsForDate(TODAY)[1]!;
    expect(r.next.daily.progress[rushMission.id]).toBe(1);
    const lower = applyRushResult(r.next, rush({ runId: 'run2', score: 100 }), TODAY, true);
    expect(lower.newBest).toBe(false);
    expect(lower.next.rushBest).toBe(4200);
  });
  it('報酬は上限つき。コイン対象外の回はXPだけ', () => {
    const big = rushRewardFor(rush({ score: 999999, correct: 999, maxCombo: 999 }), true);
    expect(big.xp).toBeLessThanOrEqual(150);
    expect(big.coins).toBeLessThanOrEqual(40);
    expect(rushRewardFor(rush(), false).coins).toBe(0);
  });
  it('同じ runId は1回だけ。コインは1日5回まで、XPは毎回', async () => {
    const first = await applyRushGrowth(rush({ runId: 'r0' }));
    expect(first?.reward?.coins).toBeGreaterThan(0);
    expect((await applyRushGrowth(rush({ runId: 'r0' })))?.reward).toBeUndefined();
    for (let i = 1; i < 5; i += 1) await applyRushGrowth(rush({ runId: `r${i}` }));
    expect(rushCoinPlaysLeft()).toBe(0);
    const sixth = await applyRushGrowth(rush({ runId: 'r5' }));
    expect(sixth?.reward?.coins).toBe(0);
    expect(sixth?.reward?.xp).toBeGreaterThan(0);
    expect((await loadMyGrowth()).rushPlays).toBe(6);
    vi.setSystemTime(new Date(2026, 8, 10, 12));
    expect(rushCoinPlaysLeft()).toBe(5);
  });
  it('不正な入力は保存しない', async () => {
    expect(await applyRushGrowth(rush({ runId: '' }))).toBeNull();
    expect(await applyRushGrowth(rush({ score: Number.NaN }))).toBeNull();
    expect(data.size).toBe(0);
  });
});

describe('コンプリート宝箱', () => {
  const allClaimed = () => {
    let p = { ...emptyProgress('a'), daily: { date: TODAY, progress: {} as Record<string, number>, claimed: [] as string[] } };
    for (const m of allMissionsForDate(TODAY)) p.daily.progress[m.id] = m.goal;
    for (const m of allMissionsForDate(TODAY)) p = claimMission(p, m.id, TODAY).next;
    return p;
  };
  it('対戦3つ＋ボーナス2つを全部受け取るまでは開かない。開けるのは1日1回', () => {
    expect(allMissionsClaimed(emptyProgress('a'), TODAY)).toBe(false);
    // 対戦ミッションだけ受け取っても開かない
    let battleOnly = { ...emptyProgress('a'), daily: { date: TODAY, progress: {} as Record<string, number>, claimed: [] as string[] } };
    for (const m of missionsForDate(TODAY)) { battleOnly.daily.progress[m.id] = m.goal; battleOnly = claimMission(battleOnly, m.id, TODAY).next; }
    expect(openCompleteChest(battleOnly, TODAY).reward).toBeNull();
    const p = allClaimed();
    expect(allMissionsClaimed(p, TODAY)).toBe(true);
    const r = openCompleteChest(p, TODAY);
    expect(r.reward).toEqual(completeChestFor(1));
    expect(openCompleteChest(r.next, TODAY).reward).toBeNull();
  });
  it('1日の報酬合計（対戦＋ボーナス＋宝箱）でも1回の書き込み上限を超えない', () => {
    for (const m of allMissionsForDate(TODAY)) {
      expect(m.rewardXp).toBeLessThanOrEqual(XP_PER_WRITE_MAX);
      expect(m.rewardCoins).toBeLessThanOrEqual(COINS_PER_WRITE_MAX);
    }
    for (let d = 1; d <= 7; d += 1) expect(completeChestFor(d).coins).toBeLessThanOrEqual(COINS_PER_WRITE_MAX);
  });
  it('ストア経由でも1回だけ', async () => {
    data.set(key(), JSON.stringify({ version: 1, progress: allClaimed(), receipts: [], day: TODAY }));
    expect((await openChest())?.reward).toEqual(completeChestFor(1));
    expect((await openChest())?.reward).toBeNull();
  });
});

describe('5連ガチャ', () => {
  beforeEach(() => { vi.stubGlobal('crypto', { getRandomValues: (a: Uint32Array) => { a.forEach((_, i) => { a[i] = i * 400_000_000; }); return a; } }); });
  it('残高があれば5回ぶんを1回で書く。同じ requestId は1回だけ', async () => {
    data.set(key(), JSON.stringify({ version: 1, progress: { ...emptyProgress('a'), coins: 300 }, receipts: [], day: '' }));
    const r = await drawGachaMulti('m1');
    expect(r?.results).toHaveLength(GACHA_MULTI_COUNT);
    const refund = r!.results!.reduce((n, x) => n + x.refund, 0);
    expect(r?.progress.coins).toBe(300 - GACHA_COST * GACHA_MULTI_COUNT + refund);
    expect((await drawGachaMulti('m1'))?.results).toBeNull();
  });
  it('残高不足なら1枚も使わない', async () => {
    data.set(key(), JSON.stringify({ version: 1, progress: { ...emptyProgress('a'), coins: GACHA_COST * GACHA_MULTI_COUNT - 1 }, receipts: [], day: '' }));
    const before = data.get(key());
    expect((await drawGachaMulti('m2'))?.results).toBeNull();
    expect(data.get(key())).toBe(before);
  });
});

describe('追加の称号・フレーム', () => {
  it('新しい称号は進捗が数えられ、フレームの参照先は実在する', () => {
    for (const id of ['b_study_10', 'b_study_50', 'b_study_200', 'b_rush_first', 'b_rush_2500', 'b_rush_4000', 'b_rush_combo10']) {
      expect(BADGES.some(b => b.id === id)).toBe(true);
      expect(badgeProgress(emptyProgress('a'), id)).not.toBeNull();
    }
    for (const id of ['frame_scholar', 'frame_lightning', 'frame_comet']) {
      const item = ITEMS.find(i => i.id === id)!;
      expect('badge' in item.unlock).toBe(true);
    }
  });
  it('古い記録（新しい項目なし）も初期値で読める', () => {
    const p = normalizeProgress('a', { xp: 10, rushBestBy: { math: 500, __proto__: 1, 'Bad-Key': 3 } });
    expect(p.studySolved).toBe(0);
    expect(p.rushBest).toBe(0);
    expect(p.rushBestBy).toEqual({ math: 500 });
  });
});

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
const { auth } = vi.hoisted(() => ({ auth: { currentUser: { uid: 'a' } as { uid: string } | null } }));
vi.mock('../src/firebase', () => ({ auth }));
import { drawGacha, applyMatchGrowth, buyItem, claimMissionReward, loadMyGrowth, recordReviewGrowth,
  subscribeGrowth, touchLogin, GROWTH_STORAGE_PREFIX } from '../src/battle/data/growthStore';
import { emptyProgress, missionsForDate, applyLoginWithBonus, claimMission, xpRequiredForLevel, BADGES, MISSION_POOL } from '../src/battle/core/growth';
import { readFileSync } from 'node:fs';
import { readAudioPreferences, writeAudioPreferences } from '../src/battle/audio/audioPreferences';
const data = new Map<string, string>();
let failWrite = false;
const storage = { getItem: (k: string) => data.get(k) ?? null,
  setItem: (k: string, v: string) => { if (failWrite) throw Error('Quota'); data.set(k, v); },
  removeItem: (k: string) => data.delete(k), clear: () => data.clear() };
const key = (uid = 'a') => GROWTH_STORAGE_PREFIX + uid;
const match = (roomId = 'r1') => ({ roomId, subject: 'math', outcome: 'win' as const,
  buzz: false, forfeit: false, answeredCount: 1, holesFilled: 0,
  score: { uid: 'a', correctCount: 1, maxStreak: 1, totalTime: 2, score: 100,
    perQuestion: [{ index: 0, correct: true, timeUsed: 2, base: 100, speed: 0, streak: 0, total: 100 }] } });
beforeEach(() => {
  data.clear(); failWrite = false; auth.currentUser = { uid: 'a' };
  vi.stubGlobal('localStorage', storage); vi.useFakeTimers(); vi.setSystemTime(new Date(2026, 8, 9, 12));
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe('private growth integration', () => {
  it('never enables the unsafe public collection or telemetry', () => {
    expect(readFileSync('src/battle/data/growthStore.ts','utf8')).not.toMatch(/from ['"]firebase\/firestore|trackEvent\(/);
    expect(readFileSync('firestore.rules','utf8')).not.toContain('match /battle_progress/');
  });
  it('rejects nonconsecutive match replay', async () => {
    await applyMatchGrowth(match('r1')); await applyMatchGrowth(match('r2'));
    const before = await loadMyGrowth();
    expect((await applyMatchGrowth(match('r1')))?.delta).toBeNull();
    expect(await loadMyGrowth()).toEqual(before); expect(before.matches).toBe(2);
  });
  it('serializes claims and atomically purchases and equips', async () => {
    expect((await Promise.all([touchLogin(), touchLogin()])).filter(r => r?.bonus)).toHaveLength(1);
    data.set(key(),JSON.stringify({version:1,progress:{...emptyProgress('a'),coins:100},receipts:[],day:''}));
    expect((await Promise.all([buyItem('frame_pink'),buyItem('frame_pink')])).filter(r=>r?.ok)).toHaveLength(1);
    const p=await loadMyGrowth(); expect(p.coins).toBe(20); expect(p.equipped.frame).toBe('frame_pink');
  });
  it('does not reclaim missions after clock rollback', async () => {
    const m=missionsForDate('2026-09-09')[0];
    data.set(key(),JSON.stringify({version:1,progress:{...emptyProgress('a'),daily:{date:'2026-09-09',progress:{[m.id]:m.goal},claimed:[]}},receipts:[],day:'2026-09-09'}));
    expect((await claimMissionReward(m.id))?.reward).not.toBeNull();
    vi.setSystemTime(new Date(2026,8,8,12));
    expect((await claimMissionReward(m.id))?.reward).toBeNull();
    expect((await loadMyGrowth()).coins).toBe(m.rewardCoins);
  });
  it('isolates guest and accounts without touching learning storage', async () => {
    data.set('review_list_a','unchanged'); await applyMatchGrowth(match());
    auth.currentUser={uid:'b'}; expect((await loadMyGrowth()).xp).toBe(0);
    auth.currentUser=null; await touchLogin();
    auth.currentUser={uid:'a'}; expect((await loadMyGrowth()).matches).toBe(1);
    expect(data.get('review_list_a')).toBe('unchanged');
  });
  it('refuses delayed results for a different account', async () => {
    auth.currentUser={uid:'b'}; expect(await applyMatchGrowth(match(),'a')).toBeNull(); expect(data.size).toBe(0);
  });
  it('counts a review once per question per day', async () => {
    await recordReviewGrowth('a','c::q::s'); await recordReviewGrowth('a','c::q::s');
    expect((await loadMyGrowth()).holesFilled).toBe(1);
    vi.setSystemTime(new Date(2026,8,10,12)); await recordReviewGrowth('a','c::q::s');
    expect((await loadMyGrowth()).holesFilled).toBe(2);
  });
  it('does not consume receipts or report success if saving fails; retry works', async () => {
    failWrite=true; expect(await applyMatchGrowth(match())).toBeNull(); expect(data.size).toBe(0);
    failWrite=false; expect((await applyMatchGrowth(match()))?.delta).not.toBeNull();
  });
  it('preserves corrupt data rather than overwriting it', async () => {
    data.set(key(),'{broken'); expect((await loadMyGrowth()).xp).toBe(0);
    expect(await touchLogin()).toBeNull(); expect(data.get(key())).toBe('{broken');
  });
  it('handles blocked storage', async () => {
    vi.stubGlobal('localStorage',undefined); expect(await touchLogin()).toBeNull(); expect((await loadMyGrowth()).xp).toBe(0);
  });
  it('does not publish another account to an old subscriber', async () => {
    const ids:string[]=[]; const off=subscribeGrowth(p=>ids.push(p.uid));
    await touchLogin(); auth.currentUser={uid:'b'}; await touchLogin(); off(); expect(ids).toEqual(['a']);
  });
  it('rechecks account identity after a cross-tab lock', async () => {
    vi.stubGlobal('navigator',{locks:{request:async (_:string,fn:()=>unknown)=>{auth.currentUser={uid:'b'};return fn();}}});
    expect(await applyMatchGrowth(match(),'a')).toBeNull(); expect(data.size).toBe(0);
  });
  it('unlocks equipment immediately after mission or login XP crosses a level', () => {
    const p={...emptyProgress('a'),xp:xpRequiredForLevel(3)-1};
    expect(applyLoginWithBonus(p,'2026-09-09').next.owned).toContain('pose_walking');
    const m=missionsForDate('2026-09-09')[0];
    expect(claimMission({...p,daily:{date:'2026-09-09',progress:{[m.id]:m.goal},claimed:[]}},m.id,'2026-09-09').next.owned).toContain('pose_walking');
  });
  it('does not show unreachable buzz missions or badges', () => {
    expect(MISSION_POOL.some(m=>m.kind==='buzz_win')).toBe(false); expect(BADGES.some(b=>b.id==='b_buzz_5')).toBe(false);
  });
});


describe('shared live audio and reward preferences', () => {
  it('preserves the previous quiet default and explicit legacy preferences', () => {
    expect(readAudioPreferences().sfx).toBe(false);
    data.set('battle_sfx','on'); expect(readAudioPreferences().sfx).toBe(true);
    data.set('battle_sfx','off'); expect(readAudioPreferences().sfx).toBe(false);
  });
  it('uses one setting for live battles and reward sounds', () => {
    writeAudioPreferences({sfx:true,bgm:true,volume:0.3});
    expect(readAudioPreferences()).toEqual({sfx:true,bgm:true,volume:0.3});
    writeAudioPreferences({sfx:false});
    expect(readAudioPreferences()).toEqual({sfx:false,bgm:true,volume:0.3});
  });
  it('does not throw when sound preferences cannot be persisted', () => {
    failWrite=true; expect(()=>writeAudioPreferences({sfx:true})).not.toThrow();
  });
});


describe('arena atomic rewards and draws', () => {
  const seed = (coins = 100) => data.set(key(), JSON.stringify({version:1,progress:{...emptyProgress('a'),coins},receipts:[],day:''}));
  beforeEach(() => { vi.stubGlobal('crypto', {getRandomValues: (a: Uint32Array) => { a[0]=0; return a; }}); });
  it('credits item and cost only once on concurrent replay', async () => {
    seed(); const r=await Promise.all([drawGacha('same'),drawGacha('same')]);
    expect(r.filter(v=>v?.result)).toHaveLength(1); expect((await loadMyGrowth()).coins).toBe(50);
    expect(JSON.parse(data.get(key())!).receipts).toEqual(['gacha:same']);
  });
  it('returns 20 coins on a duplicate without duplicating inventory', async () => {
    seed(); await drawGacha('one');const before=await loadMyGrowth();
    const r=await drawGacha('two');expect(r?.result?.duplicate).toBe(true);expect(r?.result?.refund).toBe(20);
    expect(r?.progress.coins).toBe(20);expect(r?.progress.owned).toEqual(before.owned);
  });
  it('insufficient balance and malformed request leave no receipt', async () => {
    seed(49);const before=data.get(key());expect((await drawGacha('one'))?.result).toBeNull();
    expect(await drawGacha('')).toBeNull();expect(await drawGacha('x'.repeat(101))).toBeNull();expect(data.get(key())).toBe(before);
  });
  it('failed saving never spends coins and can be retried', async () => {
    seed();const before=data.get(key());failWrite=true;expect(await drawGacha('retry')).toBeNull();expect(data.get(key())).toBe(before);
    failWrite=false;expect((await drawGacha('retry'))?.result).toBeTruthy();expect((await loadMyGrowth()).coins).toBe(50);
  });
  it('does not debit a newly signed-in account for an old confirmation', async () => {
    seed();auth.currentUser={uid:'b'};expect(await drawGacha('old','a')).toBeNull();expect(data.has(key('b'))).toBe(false);
  });
  it('awards exact match breakdown once, not on result replay', async () => {
    const r=await applyMatchGrowth(match());expect(r?.delta?.coins).toEqual({finish:10,correct:2,victory:10,total:22});
    expect(r?.progress.coins).toBe(22);await applyMatchGrowth(match());expect((await loadMyGrowth()).coins).toBe(22);
  });
  it('honors legacy lastRoomId even without a receipt', async () => {
    await applyMatchGrowth(match());const e=JSON.parse(data.get(key())!);e.receipts=[];data.set(key(),JSON.stringify(e));
    expect((await applyMatchGrowth(match()))?.delta).toBeNull();expect((await loadMyGrowth()).coins).toBe(22);
  });
  it('BGM defaults on but explicit off survives', () => {
    expect(readAudioPreferences().bgm).toBe(true);writeAudioPreferences({bgm:false});expect(readAudioPreferences().bgm).toBe(false);
  });
});

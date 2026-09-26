import { describe, it, expect } from 'vitest';
import { arenaRule, speedCurve, nationalRoomMatches, answerNumber } from '../src/battle/core/arenaRules';
import { matchCoins, rollGacha, gachaItems, gachaItemsByRarity, gachaItemRate, GACHA_RARITY_RATES, GACHA_DUPLICATE_REFUND_BY_RARITY } from '../src/battle/core/arenaEconomy';
import { gachaRarityOf } from '../src/battle/core/growth';
import { emptyProgress, type MatchSummaryForGrowth } from '../src/battle/core/growth';
import { defaultRuleOf, normalizeRule } from '../src/battle/core/battleRules';
import { scoreBattleQuestion, resolveTimeLimit } from '../src/battle/core/battleCore';
import type { BattleQuestion } from '../src/battle/core/types';

const q: BattleQuestion = {id:'test',subject:'chemistry_basic',chapterId:'c',problemId:'p',subQuestionId:'s',format:'choice4',prompt:'test',label:'',options:['A','B','C','D'],answerIndex:1,panelOrder:[],timeLimit:20};
describe('versioned speed scoring', () => {
  it('preserves old snapshots and opts new rooms into v2', () => {
    const old=defaultRuleOf(q.subject);const copy={...old};const fresh=arenaRule(old);
    expect(old).toEqual(copy);expect(normalizeRule(q.subject,old).scoringVersion).toBeUndefined();
    expect(normalizeRule(q.subject,fresh).scoringVersion).toBe(2);
    expect(fresh.pointsCorrect).toBe(60);expect(fresh.pointsSpeedMax).toBe(240);
  });
  it('curve is bounded, monotone and nonlinear', () => {
    expect(speedCurve(-2)).toBe(0);expect(speedCurve(2)).toBe(1);expect(speedCurve(.5)).toBeCloseTo(.2125);
    for(let i=0;i<100;i++) expect(speedCurve((i+1)/100)).toBeGreaterThanOrEqual(speedCurve(i/100));
  });
  it('actual scoring uses curve only for versioned rooms', () => {
    const rules=arenaRule(defaultRuleOf(q.subject));const start=1700000000000;
    const limit=resolveTimeLimit(q,rules);const record={index:0,choice:1,panel:[],answeredAt:start+limit*500};
    const modern=scoreBattleQuestion(q,record,rules,0,start);
    const legacy=scoreBattleQuestion(q,record,{...rules,scoringVersion:undefined},0,start);
    expect(modern.speed).toBe(51);expect(legacy.speed).toBe(120);expect(modern.base).toBe(60);
    expect(scoreBattleQuestion(q,{...record,choice:0},rules,7,start).total).toBe(0);
  });
  it('a fast correct answer can reverse a 150-point deficit', () => {
    const rules=arenaRule(defaultRuleOf(q.subject));const start=1700000000000;
    const score=(ms:number)=>scoreBattleQuestion(q,{index:0,choice:1,panel:[],answeredAt:start+ms},rules,0,start).total;
    expect(score(1000)).toBeGreaterThan(150+score(resolveTimeLimit(q,rules)*950));
  });
});

describe('national session admission', () => {
  const room={mode:'random',subject:'math',joinCode:'',status:'waiting',players:['a','b'],profiles:{a:{matchSessionId:'sa'},b:{matchSessionId:'sb'}}};
  it('both current sessions can find the same room including an already-started room', () => {
    expect(nationalRoomMatches(room,'a','math','sa')).toBe(true);
    expect(nationalRoomMatches({...room,status:'playing'},'b','math','sb')).toBe(true);
  });
  it.each([{mode:'friend'},{joinCode:'ABCD'},{status:'finished'},{status:'aborted'},{subject:'english_vocab'},{players:['a']},{players:['a','a']},{profiles:{a:{matchSessionId:'old'}}}])('rejects stale or unrelated rooms %j', patch => {
    expect(nationalRoomMatches({...room,...patch},'a','math','sa')).toBe(false);
  });
  it('rejects missing identity or session and nonparticipants', () => {
    expect(nationalRoomMatches(room,'a','math','')).toBe(false);
    expect(nationalRoomMatches(room,'c','math','sa')).toBe(false);
  });
});

describe('cosmetic economy', () => {
  const progress={...emptyProgress('a'),coins:100};
  it('has 36 decorations + the UR study prints split into N / R / SR / UR tiers and does not mutate the source', () => {
    const tiersAll=gachaItemsByRarity();
    expect(gachaItems().filter(i=>i.kind!=='print')).toHaveLength(36);
    expect(gachaItems()).toHaveLength(36+tiersAll.UR.length);
    // ガチャ限定ポーズ3種＋SRフレーム2種は必ずラインナップに入り、SR 枠
    for(const id of ['pose_listening','pose_science','pose_trophy','frame_prism','frame_galaxy']) {
      const item=gachaItems().find(i=>i.id===id)!; expect(item).toBeTruthy(); expect(gachaRarityOf(item)).toBe('SR');
    }
    const tiers=gachaItemsByRarity();
    expect(tiers.SR.length+tiers.R.length+tiers.N.length).toBe(36);
    for(const r of ['UR','SR','R','N'] as const) expect(tiers[r].length).toBeGreaterThan(0);
    // 提供割合の合計は 100%、SR は R・N より1つあたりが低い…ではなく、枠の割合どおり
    const total=gachaItems().reduce((n,i)=>n+gachaItemRate(i),0);
    expect(total).toBeCloseTo(1,9);
    expect(GACHA_RARITY_RATES.UR+GACHA_RARITY_RATES.SR+GACHA_RARITY_RATES.R+GACHA_RARITY_RATES.N).toBeCloseTo(1,9);
    // 乱数の区間どおりにそれぞれのアイテムが出る（どのアイテムも出うる）
    let acc=0;
    for(const tier of ['UR','SR','R','N'] as const) for(const item of tiers[tier]) {
      const w=gachaItemRate(item);
      expect(rollGacha(progress,acc+w*0.5)?.item.id).toBe(item.id);
      expect(rollGacha(progress,acc+w*0.5)?.rarity).toBe(tier);
      acc+=w;
    }
    expect(progress.coins).toBe(100);expect(progress.owned).not.toContain(gachaItems()[0].id);
  });
  it('R-or-better guarantee never yields N', () => {
    for(let i=0;i<200;i+=1) expect(rollGacha(progress,i/200,'R')?.rarity).not.toBe('N');
    const rates=gachaItems().filter(i=>gachaRarityOf(i)!=='N').reduce((n,i)=>n+gachaItemRate(i,'R'),0);
    expect(rates).toBeCloseTo(1,9);
  });
  it.each([NaN,Infinity,-1,1])('rejects invalid randomness %s', n => expect(rollGacha(progress,n)).toBeNull());
  it('requires full cost even for an owned item', () => {
    expect(rollGacha({...progress,coins:49,owned:gachaItems().map(i=>i.id)},0)).toBeNull();
    const first=rollGacha(progress,0)!;const second=rollGacha(first.next,0)!;
    expect(second.refund).toBe(GACHA_DUPLICATE_REFUND_BY_RARITY[second.rarity]);expect(second.next.coins).toBe(second.refund);
    // N の重複は従来どおり 20 枚
    const nRandom=1-1e-9;const n1=rollGacha(progress,nRandom)!;expect(n1.rarity).toBe('N');expect(rollGacha(n1.next,nRandom)!.refund).toBe(20);
  });
  const match=(patch:Partial<MatchSummaryForGrowth>={}):MatchSummaryForGrowth=>({roomId:'r',subject:'math',outcome:'win',buzz:false,forfeit:false,answeredCount:1,holesFilled:0,score:{uid:'a',correctCount:1,maxStreak:1,totalTime:1,score:100,perQuestion:[{index:0,correct:true,answered:true,timeUsed:1,base:60,speed:40,streak:0,total:100}]},...patch});
  it('breaks down earned coins and excludes inactivity and forfeits', () => {
    expect(matchCoins(match())).toEqual({finish:10,correct:2,victory:10,total:22});
    expect(matchCoins(match({outcome:'lose'})).total).toBe(12);
    expect(matchCoins(match({forfeit:true})).total).toBe(0);
    expect(matchCoins(match({score:{...match().score,correctCount:0,perQuestion:[]}})).total).toBe(0);
  });
});

describe('confirmed answer labels', () => {
  it('shows option numbers only for unambiguous confirmed choices', () => {
    expect(answerNumber(q,'B')).toBe('【2】');expect(answerNumber(q)).toBe('');
    expect(answerNumber(q,'missing')).toBe('');expect(answerNumber({...q,format:'kana'},'B')).toBe('');
    expect(answerNumber({...q,options:['B','B']},'B')).toBe('');
  });
});


it('allows long listening recordings in new rooms without changing saved rules', () => {
  const saved = { ...defaultRuleOf('english_listening'), timeLimitOverride: 35 };
  const fresh = arenaRule(saved);
  expect(saved.timeLimitOverride).toBe(35);
  expect(fresh.timeLimitOverride).toBe(55);
  expect(fresh.pointsSpeedMax).toBe(20);
  expect(resolveTimeLimit({ ...q, subject: 'english_listening' }, fresh)).toBe(55);
});

// 2026-09-23: online listening battles could never start. The first deadline was
// 55s + 7.6s countdown + 0.7s grace = 63.3s, but firestore.rules rejects deadlines
// at or beyond request.time + 60s. Keep every subject's first deadline under the bound.
it('keeps the first online deadline inside the Firestore 60-second rule for every subject', async () => {
  const { firstDeadlineSec, COUNTDOWN_TOTAL_MS } = await import('../src/battle/core/battleLive');
  const { BATTLE_TIME_SCALED_MAX } = await import('../src/battle/core/battleCore');
  const NETWORK_GRACE_SEC = 0.7;
  for (const subject of ['english_listening', 'chemistry_basic', 'math', 'english_vocab']) {
    const rule = arenaRule(defaultRuleOf(subject));
    const limit = resolveTimeLimit({ ...q, subject, timeLimit: 999 }, rule);
    expect(limit).toBeLessThanOrEqual(BATTLE_TIME_SCALED_MAX);
    const first = firstDeadlineSec(limit);
    expect(first + NETWORK_GRACE_SEC).toBeLessThan(60);
    expect(first).toBeGreaterThanOrEqual(limit); // answer time is never shortened
  }
  expect(firstDeadlineSec(20)).toBe(20 + COUNTDOWN_TOTAL_MS / 1000); // short questions keep the full countdown
});

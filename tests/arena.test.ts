import { describe, it, expect } from 'vitest';
import { arenaRule, speedCurve, nationalRoomMatches, answerNumber } from '../src/battle/core/arenaRules';
import { matchCoins, rollGacha, gachaItems } from '../src/battle/core/arenaEconomy';
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
  it('has sixteen equally sized draw intervals and does not mutate the source', () => {
    expect(gachaItems()).toHaveLength(16);
    for(const [i,item] of gachaItems().entries()) {
      expect(rollGacha(progress,i/gachaItems().length)?.item.id).toBe(item.id);
      expect(rollGacha(progress,(i+1)/gachaItems().length-Number.EPSILON)?.item.id).toBe(item.id);
    }
    expect(progress.coins).toBe(100);expect(progress.owned).not.toContain(gachaItems()[0].id);
  });
  it.each([NaN,Infinity,-1,1])('rejects invalid randomness %s', n => expect(rollGacha(progress,n)).toBeNull());
  it('requires full cost even for an owned item', () => {
    expect(rollGacha({...progress,coins:49,owned:gachaItems().map(i=>i.id)},0)).toBeNull();
    const first=rollGacha(progress,0)!;const second=rollGacha(first.next,0)!;
    expect(second.refund).toBe(20);expect(second.next.coins).toBe(20);
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

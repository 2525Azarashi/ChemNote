import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BattleLiveStage, type BattleLiveStageProps } from '../src/battle/ui/BattleLiveStage';
import { ReviewPicks } from '../src/battle/ui/BattleResultLive';
import { ArenaFighters } from '../src/battle/ui/ArenaFighters';
import { arenaRule } from '../src/battle/core/arenaRules';
import { defaultRuleOf } from '../src/battle/core/battleRules';
import type { BattleQuestion, BattlePlayerScore } from '../src/battle/core/types';
const question:BattleQuestion={id:'audit',subject:'english_vocab',chapterId:'c',problemId:'p',subQuestionId:'s',format:'choice4',prompt:'choose',label:'word',options:['A','B','C','D'],answerIndex:1,panelOrder:[],timeLimit:10};
const score:BattlePlayerScore={uid:'opponent',score:120,correctCount:1,maxStreak:1,totalTime:1,perQuestion:[{index:0,correct:true,answered:true,submittedAnswer:'B',timeUsed:1,base:60,speed:60,streak:0,total:120}]};
const noop=()=>{};
const props:BattleLiveStageProps={question,index:0,total:10,rules:arenaRule(defaultRuleOf('english_vocab')),remainMs:8000,preStartMs:0,answered:false,opponentAnswered:true,myChoice:-1,myPanel:[],reveal:false,myScore:null,opponentScore:score,meNickname:'me',opponentNickname:'other',maskOpponent:true,finished:false,onChoose:noop,onPushPanel:noop,onPopPanel:noop,onCyclePanel:noop,onCommitKana:noop};
const live=(over:Partial<BattleLiveStageProps>={})=>renderToStaticMarkup(React.createElement(BattleLiveStage,{...props,...over}));
describe('actual live/review rendering contracts',()=>{
 it('does not expose opponent confirmed-answer panel before own lock',()=>{
  expect(live()).not.toContain('arena-opponent-answer');
 });
 it('shows the selected number only after own lock or reveal',()=>{
  expect(live({answered:true})).toMatch(/相手の確定回答.*【2】/);
  expect(live({reveal:true})).toMatch(/相手の確定回答.*【2】/);
 });
 it('never invents an answer while opponent is still thinking',()=>{
  expect(live({answered:true,opponentAnswered:false})).not.toContain('arena-opponent-answer');
 });
 it('counts down without exposing an answer panel',()=>{
  expect(live({answered:true,preStartMs:3000})).not.toContain('arena-opponent-answer');
 });
 it('renders confirmed input text without a choice number for kana',()=>{
  const textScore={...score,perQuestion:[{...score.perQuestion[0],submittedAnswer:'ことば'}]};
  const html=live({question:{...question,format:'kana',options:[]},answered:true,opponentScore:textScore});
  expect(html).toContain('ことば');expect(html).toContain('arena-opponent-answer');expect(html).not.toContain('【2】');
 });
 it('keeps opponent choice number in post-match review',()=>{
  const html=renderToStaticMarkup(React.createElement(ReviewPicks,{picks:[{index:0,question,reason:'opponent-right',correctText:'B'}],subject:'english_vocab',opponentScore:score}));
  expect(html).toMatch(/相手の回答.*【2】/);expect(html).toContain('battle-review-picks');
 });
 it('renders own correct/wrong effects and background without changing questions',()=>{
  expect(live({reveal:true,myScore:score})).toContain('is-hit');
  expect(live({reveal:true})).toContain('is-miss');
  expect(live()).toContain('arena-background-fx');expect(live()).toContain('choose');
 });
 it('distinguishes match preparation and offline status from answer activity',()=>{
  const ready=renderToStaticMarkup(React.createElement(ArenaFighters,{matched:true}));
  expect(ready.match(/準備OK/g)).toHaveLength(2);expect(ready).not.toContain('回答済み');
  const offline=renderToStaticMarkup(React.createElement(ArenaFighters,{offline:true}));
  expect(offline).toContain('通信待ち');
 });
});

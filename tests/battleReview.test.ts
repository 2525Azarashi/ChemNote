import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { normalizeJoinCode, BattleFriendJoin } from '../src/battle/ui/BattleFriendJoin';
import { loadReviewExplanation } from '../src/battle/ui/BattleReviewDetails';
import { loadPool } from '../src/battle/data/battlePool';
import { BattleResult } from '../src/battle/ui/BattleResult';
import { kanaTextOf } from '../src/battle/core/kanaKeyboard';
import { scoreBattlePlayer, judgeBattle } from '../src/battle/core/battleCore';
import { defaultRuleOf } from '../src/battle/core/battleRules';
import { readFileSync } from 'node:fs';

describe('join code input', () => {
  it.each([['abcd','ABCD'], ['ａｂｃｄ','ABCD'], [' ＡＢ ＣＤ ','ABCD'], ['a2b3','A2B3']])('normalizes %s at submission', (input, expected) => {
    expect(normalizeJoinCode(input)).toBe(expected);
  });
  it('does not truncate invalid long codes or silently remove non-code letters', () => {
    expect(normalizeJoinCode('ABCDE')).toBe('ABCDE');
    expect(normalizeJoinCode('あABCD')).toBe('あABCD');
  });
  it('uses one visible native input and an explicit submit button', () => {
    const html=renderToStaticMarkup(React.createElement(BattleFriendJoin,{onBack(){},onJoined(){}}));
    expect(html.match(/<input /g)).toHaveLength(1);
    expect(html).not.toContain('h-0 w-0');
    expect(html).toContain('autoComplete="off"');
    expect(html).toContain('部屋に入る');
  });
});

describe('real source explanations after a match', () => {
  it.each(['chemistry_basic','chemistry','biology_basic','math','english_grammar','english_listening','geography'])('%s resolves a real source explanation', async subject => {
    const pool=await loadPool(subject);
    const text=await loadReviewExplanation(pool[0]);
    expect(text.length).toBeGreaterThan(30);
    expect(text).not.toContain('undefined');
  });
  it('rika resolves related printed material instead of fabricating an explanation', async () => {
    const q=(await loadPool('rika'))[0];
    expect((await loadReviewExplanation(q)).length).toBeGreaterThan(20);
  });
  it('a missing source does not fall back to another question', async () => {
    const q=(await loadPool('chemistry_basic'))[0];
    expect(await loadReviewExplanation({...q,problemId:'deleted-source'})).toBe('');
    expect(await loadReviewExplanation({...q,subQuestionId:'deleted-sub'})).toBe('');
  });
  it('kana correct answers are decoded with the kana keyboard, not empty options', async () => {
    const q=(await loadPool('biology_basic')).find(q=>q.format==='kana')!;
    const rules=defaultRuleOf('biology_basic');
    const score=scoreBattlePlayer('guest',[q],{},rules,new Map());
    const html=renderToStaticMarkup(React.createElement(BattleResult,{
      result:judgeBattle(score,null,rules),questions:[q],subject:q.subject,opponent:null,
      meNickname:'guest',rating:null,byForfeit:false,maskOpponent:false,onExit(){},onPractice(){},
    }));
    expect(html).toContain(kanaTextOf(q.panelOrder));
    expect(html).toContain('詳しい解説を読む');
    expect(html).toContain(`data-practice-question="${q.id}"`);
  });
});

it('keeps return controls in every study stage and does not mount full lessons during matches', () => {
  for(const file of ['QuizScreens','Quiz','ExplanationScreen','Explanation','ListeningBriefing']) {
    expect(readFileSync(`src/components/${file}.tsx`,'utf8')).toContain('onReturnToBattle');
  }
  const app=readFileSync('src/App.tsx','utf8');
  expect(app).toContain("(appState === 'battle' || battleReturnActive)");
  expect(app).toContain('savedBattleScroll.current');
  expect(app).not.toContain("from './data/allChapters'");
});

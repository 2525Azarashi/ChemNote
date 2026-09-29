import { describe, it, expect } from 'vitest';
import { battleTimeLimitOf, BATTLE_TIME_MAX, BATTLE_TIME_MIN } from '../src/battle/core/battleTiming';
import { calcSubQuestionTimeLimit } from '../src/utils/scoring';

describe('battleTiming（対戦の締切は1人用から独立）', () => {
  it('かな入力相当（text・5文字）は18秒で固定', () => {
    expect(battleTimeLimitOf({ type: 'text', correctAnswer: 'ルミノール' })).toBe(18);
  });
  it('1人用の見積りが変わっても対戦の値は別に決まる', () => {
    const sq = { id: 'x', type: 'text', correctAnswer: 'ルミノール' };
    // 1人用は長め（45+25=70秒）。対戦は70×0.42=29 にはならない
    expect(calcSubQuestionTimeLimit(sq)).toBe(70);
    expect(battleTimeLimitOf(sq)).not.toBe(29);
  });
  it('どんな入力でも 8〜30秒（60秒未満）に収まる', () => {
    const cases = [
      { type: 'descriptive', correctAnswer: 'あ'.repeat(500), label: 'い'.repeat(500) },
      { type: 'multiple_choice', options: [] },
      { type: 'sorting', items: Array(30).fill('a') },
      {},
    ];
    for (const c of cases) {
      const t = battleTimeLimitOf(c);
      expect(t).toBeGreaterThanOrEqual(BATTLE_TIME_MIN);
      expect(t).toBeLessThanOrEqual(BATTLE_TIME_MAX);
      expect(t).toBeLessThan(60);
    }
  });
});

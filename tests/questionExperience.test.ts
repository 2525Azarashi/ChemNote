import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SUBJECTS, getChaptersOfSubject } from '../src/data/allChapters';
import { loadPool, POOL_COUNTS } from '../src/battle/data/battlePool';
import { drawQuestionIds, effectiveRule } from '../src/battle/data/battle';
import { isAnswerCorrect, isDescriptive } from '../src/utils/answerJudge';
import { toChemLatex } from '../src/utils/mathTypeset';
import { calcQuestionTimeLimit, calcSubQuestionTimeLimit } from '../src/utils/scoring';
import { isMathematicallyEqual } from '../src/utils/mathExpression';
import { resolveTimeLimit, scoreBattleQuestion, NO_ANSWER } from '../src/battle/core/battleCore';
import { kanaTextOf } from '../src/battle/core/kanaKeyboard';
import { BattleQuestionView } from '../src/battle/ui/BattleQuestionView';
import type { BattleQuestion } from '../src/battle/core/types';

// Structural and grading checks, not a claim of source-level semantic review.
describe('all published study problems', () => {
  it.each(SUBJECTS.map(s => s.id))('%s: answerability, unique fields and valid assets', subject => {
    let checked = 0;
    for (const c of getChaptersOfSubject(subject) as any[]) {
      const mini = Array.isArray(c.miniTest) ? c.miniTest : c.miniTest?.problems || [];
      for (const p of [...c.practiceProblems || [], ...mini]) {
        const ids = new Set();
        for (const sq of p.subQuestions || []) {
          checked++;
          const key = `${subject}/${c.id}/${p.id}/${sq.id}`;
          expect(ids.has(sq.id), key).toBe(false); ids.add(sq.id);
          expect(sq.id && sq.label?.trim(), key).toBeTruthy();
          expect(JSON.stringify(sq), key).not.toContain('\uFFFD');
          if (isDescriptive(sq)) continue;
          expect(String(sq.correctAnswer || '').trim(), key).not.toBe('');
          expect(isAnswerCorrect(sq, sq.correctAnswer), key).toBe(true);
          for (const alt of sq.acceptedAnswers || []) expect(isAnswerCorrect(sq, alt), key + ':' + alt).toBe(true);
          if (sq.type === 'multiple_choice') {
            const options: string[] = sq.options;
            expect(options?.length, key).toBeGreaterThan(1);
            expect(new Set(options.map(o => o.trim())).size, key).toBe(options.length);
            const multi = ['・', '、', ','].some(sep => {
              const parts = sq.correctAnswer.split(sep).map((s: string) => s.trim());
              return parts.length >= 2 && parts.every((s: string) => options.includes(s));
            });
            expect(multi || options.some(o => isAnswerCorrect(sq, o)), key).toBe(true);
          }
        }
        for (const track of p.audioTracks || []) {
          if (track.audioUrl?.startsWith('/')) expect(existsSync('public' + track.audioUrl), track.audioUrl).toBe(true);
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});

describe('all 4,066 battle questions and all units', () => {
  it.each(Object.keys(POOL_COUNTS))('%s: complete answers, notation, scope and timers', async subject => {
    const pool = await loadPool(subject);
    const rules = effectiveRule(subject);
    expect(pool.length).toBe(POOL_COUNTS[subject]);
    expect(new Set(pool.map(q => q.id)).size).toBe(pool.length);
    for (const q of pool) {
      expect((q.prompt + q.label).trim(), q.id).not.toBe('');
      expect(q.prompt + q.label + q.options.join(' '), q.id).not.toMatch(/\uFFFD|\bundefined\b|\bNaN\b/);
      const input = q.format === 'kana' || q.format === 'panel';
      if (input) {
        expect(q.panelOrder.length, q.id).toBeGreaterThan(0);
        expect(q.panelOrder.every(Number.isInteger), q.id).toBe(true);
        if (q.format === 'kana') expect(kanaTextOf(q.panelOrder).length, q.id).toBe(q.panelOrder.length);
        else expect(q.panelOrder.every(i => i >= 0 && i < q.options.length), q.id).toBe(true);
        expect(resolveTimeLimit(q, rules), q.id).toBeGreaterThanOrEqual(47);
      } else {
        expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
        expect(new Set(q.options.map(o => o.trim())).size, q.id).toBe(q.options.length);
        expect(Number.isInteger(q.answerIndex) && q.answerIndex >= 0 && q.answerIndex < q.options.length, q.id).toBe(true);
      }
      const answer = { index: 0, choice: q.answerIndex, panel: q.panelOrder, answeredAt: 2000 };
      expect(scoreBattleQuestion(q, answer, rules, 0, 1000).correct, q.id).toBe(true);
      expect(resolveTimeLimit(q, rules) * 1000 + 700, q.id).toBeLessThan(60000);
      if (q.imageUrl?.startsWith('/')) expect(existsSync('public' + q.imageUrl), q.id).toBe(true);
    }
    const units = [...new Set(pool.filter(q => rules.formats.includes(q.format)).map(q => q.chapterId))];
    for (const chapterId of units) {
      const candidates = pool.filter(q => q.chapterId === chapterId && rules.formats.includes(q.format));
      const uniqueCount = new Set(candidates.map(q => q.subQuestionId)).size;
      const selected = await drawQuestionIds(subject, rules, 'audit-seed', chapterId);
      expect(selected.length, chapterId).toBe(Math.min(rules.questionCount, uniqueCount));
      expect(selected.every(id => candidates.some(q => q.id === id)), chapterId).toBe(true);
      expect(await drawQuestionIds(subject, rules, 'audit-seed', chapterId)).toEqual(selected);
      expect(new Set(selected.map(id => pool.find(q => q.id === id)!.subQuestionId)).size).toBe(selected.length);
    }
    expect(await drawQuestionIds(subject, rules, 'audit', 'not-a-unit')).toEqual([]);
    expect(await drawQuestionIds(subject, rules, 'audit')).toEqual(await drawQuestionIds(subject, rules, 'audit', undefined));
  });
});

describe('ionic charge and grading regressions', () => {
  it.each([
    ['Fe2+', 'Fe^2+'], ['Fe3+', 'Fe^3+'], ['Cu2+', 'Cu^2+'],
    ['2Fe2+', '2Fe^2+'], ['SO42-', 'SO4^2-'], ['CO32-', 'CO3^2-'],
    ['Fe²⁺', 'Fe^2+'], ['Fe^{3+}', 'Fe^3+'], ['Fe^2+', 'Fe^2+'],
    ['Cl2', 'Cl2'], ['Fe2O3', 'Fe2O3'], ['NH4+', 'NH4+'],
    ['SO₄²⁻', 'SO4^2-'], ['O₂⁻', 'O2^-'], ['O2+', 'O2+'],
  ])('%s preserves charge versus atom counts', (input, expected) => {
    expect(toChemLatex(input)).toBe(`\\ce{${expected}}`);
  });
  it('an oxidation-number list is not the product 16', () => {
    expect(isMathematicallyEqual('+2・+3・+8/3', '16')).toBe(false);
    expect(isAnswerCorrect({ id: 'iron', correctAnswer: '+2・+3・+8/3' }, '16')).toBe(false);
    expect(isAnswerCorrect({ id: 'iron', correctAnswer: '+2・+3・+8/3' }, '+2・+3・+8/3')).toBe(true);
    expect(isMathematicallyEqual('2×3', '6')).toBe(true);
  });
});

describe('input time and unambiguous feedback', () => {
  const q: BattleQuestion = { id: 'q', subject: 'chemistry_basic', chapterId: 'c6_1', problemId: 'p', subQuestionId: 's',
    format: 'choice4', prompt: '鉄の酸化数', label: '変化を選ぶ', options: ['増加', '減少', '同じ', '不明'], answerIndex: 0, panelOrder: [], timeLimit: 15 };
  const render = (overrides: object) => renderToStaticMarkup(React.createElement(BattleQuestionView, {
    question: q, index: 0, total: 5, remainMs: 0, answered: true, myChoice: 0, myPanel: [], reveal: true,
    onChoose() {}, onPushPanel() {}, onPopPanel() {}, onCyclePanel() {}, onCommitKana() {}, ...overrides,
  }));
  it.each([[0, '正解！'], [1, '不正解'], [-1, '未回答・時間切れ']])('choice %s clearly shows %s', (myChoice, label) => {
    const html = render({ myChoice });
    expect(html).toContain(label); expect(html).toContain('role="status"');
    expect(html).toContain('あなたの回答：'); expect(html).toContain('正しい答え：');
    expect(html.match(/disabled=""/g)?.length).toBe(4);
  });
  it('hides correct answers while the opponent is still thinking', () => {
    expect(render({ reveal: false, remainMs: 5000 })).not.toContain('data-answer-feedback');
  });
  it('unsubmitted kana is not called a wrong submitted answer', () => {
    expect(render({ question: { ...q, format: 'kana', panelOrder: [0, 1] }, myPanel: [0], answered: false })).toContain('未回答・時間切れ');
  });
  it('score records distinguish wrong answers from absence', () => {
    const rules = effectiveRule(q.subject);
    expect(scoreBattleQuestion(q, undefined, rules, 0, 1000).answered).toBe(false);
    expect(scoreBattleQuestion(q, { index: 0, choice: NO_ANSWER, panel: [], answeredAt: 3000 }, rules, 0, 1000).answered).toBe(false);
    const wrong = scoreBattleQuestion(q, { index: 0, choice: 1, panel: [], answeredAt: 3000 }, rules, 0, 1000);
    expect(wrong).toMatchObject({ correct: false, answered: true, submittedAnswer: '減少', total: 0 });
  });
  it('does not discount input time on the second field of a group', () => {
    const subs = ['a', 'b'].map(id => ({ id, group: 'same', type: 'text', correctAnswer: 'Fe2+' }));
    expect(calcSubQuestionTimeLimit(subs[0])).toBe(65);
    expect(calcQuestionTimeLimit(subs)).toBe(130);
    expect(calcSubQuestionTimeLimit({ id: 'essay', type: 'descriptive', correctAnswer: 'a'.repeat(100) })).toBe(240);
  });
});

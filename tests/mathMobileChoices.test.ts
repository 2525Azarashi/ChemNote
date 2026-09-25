/**
 * スマホの数学4択：選択肢を実際の採点関数に通して、正しさを全件確かめる。
 *   ・正解の選択肢は必ず正解と判定される
 *   ・誤答は1つも正解と判定されない（別解扱いで正解になってしまう誤答が無い）
 *   ・4つとも別の文字列
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import table from '../src/data/mathChoices.generated.json';
import { mathData } from '../src/data/mathData';
import { isAnswerCorrect } from '../src/utils/answerJudge';
import { asMobileChoiceSub } from '../src/utils/mathMobileChoices';

const T = table as Record<string, string[]>;
const subs = mathData.parts.flatMap(p => p.chapters).flatMap(c => c.practiceProblems).flatMap((p: any) => p.subQuestions || []);

describe('スマホの数学4択', () => {
  it('入力式の設問の9割以上を4択にできている', () => {
    const sa = subs.filter((s: any) => s.type === 'short_answer');
    const covered = sa.filter((s: any) => T[s.id]);
    expect(covered.length / sa.length).toBeGreaterThan(0.9);
  });
  it('どの設問も、正解の選択肢だけが正解と判定される（採点関数で全件確認）', () => {
    const bad: string[] = [];
    for (const s of subs as any[]) {
      const q = asMobileChoiceSub(s, T);
      if (!q) continue;
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      const judged = q.options.filter((o: string) => isAnswerCorrect(s, o));
      if (judged.length !== 1 || !isAnswerCorrect(s, String(s.correctAnswer))) bad.push(`${s.id}: ${judged.join(' / ')}`);
    }
    expect(bad).toEqual([]);
  });
  it('並びは設問ごとに固定で、正解の位置が偏らない', () => {
    const pos = [0, 0, 0, 0];
    for (const s of subs as any[]) {
      const q = asMobileChoiceSub(s, T);
      if (!q) continue;
      expect(asMobileChoiceSub(s, T)!.options).toEqual(q.options);
      pos[q.options.indexOf(String(s.correctAnswer))]! += 1;
    }
    const total = pos.reduce((a, b) => a + b, 0);
    for (const p of pos) expect(p / total).toBeGreaterThan(0.18);
  });
  it('スマホだけ（PC は入力のまま）・数学の演習だけで読み込む', () => {
    const pane = readFileSync('src/components/AnswerPane.tsx', 'utf8');
    const quiz = readFileSync('src/components/Quiz.tsx', 'utf8');
    expect(pane).toMatch(/!isDesktop && sq\.type === 'short_answer' && mobileChoiceSub\?\.\(sq\)/);
    expect(quiz).toMatch(/useMathChoices\(!isDesktop && mathCourseOfChapter\(String\(chapter\.id\)\) != null\)/);
  });
});

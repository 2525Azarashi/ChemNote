import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { mathData } from '../src/data/mathData';
import { MATH_LEVELS, MATH_TOPICS, buildMathTopicGroups, mathCourseOfChapter, mathLevelOfCourse, mathTopicOfChapter } from '../src/data/mathNavigation';

describe('数学の選び方（数ⅠA/ⅡB/ⅢC → 科目 → 単元）', () => {
  const all = mathData.parts.flatMap(p => p.chapters);
  it('すべての単元がどれかの科目に入る（迷子の単元がない）', () => {
    expect(all.filter(c => !mathCourseOfChapter(c.id)).map(c => c.id)).toEqual([]);
  });
  it('教科書の区分どおりに振り分ける', () => {
    expect(mathCourseOfChapter('ia1_1')).toBe('mc1');
    expect(mathCourseOfChapter('ia4_3')).toBe('mc1');
    expect(mathCourseOfChapter('ia5_2')).toBe('mca');
    expect(mathCourseOfChapter('mp_1')).toBe('mca');
    expect(mathCourseOfChapter('mi_1')).toBe('mca');
    expect(mathCourseOfChapter('m1_10')).toBe('mc3');
    expect(mathCourseOfChapter('mv_1')).toBe('mcc');
    expect(mathCourseOfChapter('mcb_sums')).toBe('mcb');
  });
  it('3段階・6科目、どの科目にも単元がある', () => {
    expect(MATH_LEVELS.map(l => l.label)).toEqual(['数ⅠA', '数ⅡB', '数ⅢC']);
    for (const l of MATH_LEVELS) for (const c of l.courses) {
      expect(mathLevelOfCourse(c)).toBe(l.id);
      expect(all.some(ch => mathCourseOfChapter(ch.id) === c)).toBe(true);
    }
  });
  it('単元選択の画面に段階・科目のボタンがある', () => {
    const src = readFileSync('src/components/ChapterSelection.tsx', 'utf8');
    expect(src).toContain('aria-label="数学の段階"');
    expect(src).toContain('aria-label="数学の科目"');
    expect(src).toContain('aria-label="数学の分野へ移動"');
  });

  it('★同じ分野は1つのタブにまとまる★（どの単元もちょうど1つの分野に入る）', () => {
    for (const c of all) {
      const course = mathCourseOfChapter(c.id)!;
      const hits = MATH_TOPICS[course].filter(t => t.match(c.id));
      expect(hits.length, `${c.id} が ${hits.length} 個の分野に入っている`).toBe(1);
    }
    const groups = buildMathTopicGroups(mathData.parts);
    const ids = groups.flatMap(g => g.chapters.map(c => c.id));
    expect(ids.length).toBe(all.length);
    expect(new Set(ids).size).toBe(all.length);
    // タブ名は重複しない
    expect(new Set(groups.map(g => g.title)).size).toBe(groups.length);
  });
  it('場合の数・確率は「数学A｜場合の数と確率」1か所にまとまる（以前は3か所に散らばっていた）', () => {
    const groups = buildMathTopicGroups(mathData.parts);
    const withProb = groups.filter(g => g.chapters.some(c => /^(ia5_|mp_)/.test(c.id)));
    expect(withProb.map(g => g.title)).toEqual(['数学A｜場合の数と確率']);
    expect(mathTopicOfChapter('mi_3')).toBe('整数の性質');
    expect(mathTopicOfChapter('m1_5')).toBe('積分法');
    expect(mathTopicOfChapter('mv_7')).toBe('ベクトル');
  });
  it('タブの中は 基礎〜標準 → 網羅 → パターン演習 の順', () => {
    const order = { basic: 0, full: 1, pattern: 2 } as const;
    for (const g of buildMathTopicGroups(mathData.parts)) {
      const seq = g.chapters.map(c => order[c.mathStage]);
      expect(seq).toEqual([...seq].sort((a, b) => a - b));
    }
  });
  it('章オブジェクトの中身（問題）はそのまま', () => {
    const groups = buildMathTopicGroups(mathData.parts);
    const src = all.find(c => c.id === 'ia5_2')!;
    const shown = groups.flatMap(g => g.chapters).find(c => c.id === 'ia5_2')!;
    expect(shown.practiceProblems).toBe(src.practiceProblems);
    expect(shown.abstractTitle).toBe(src.abstractTitle);
  });
});

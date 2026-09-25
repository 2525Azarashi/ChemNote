import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { mathData } from '../src/data/mathData';
import { MATH_LEVELS, mathCourseOfChapter, mathLevelOfCourse } from '../src/data/mathNavigation';

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
});

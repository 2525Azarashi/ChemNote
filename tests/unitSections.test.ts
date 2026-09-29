import { describe, expect, it } from 'vitest';
import { buildUnitSections } from '../src/data/unitSections';
import { getPartsOfSubject } from '../src/data/allChapters';

const count = (c: any) => (c.practiceProblems || []).length;
const groupsOf = (subject: string) => {
  const m = new Map<string, any[]>();
  for (const p of getPartsOfSubject(subject) as any[]) for (const c of p.chapters) m.set(c.realTitle, [...(m.get(c.realTitle) || []), c]);
  return m;
};

describe('単元一覧の小分け（並べ方だけ・問題は変えない）', () => {
  it('どの教科でも単元が1つも消えず、重複もしない', () => {
    for (const subject of ['chemistry_basic', 'chemistry', 'geography', 'biology_basic', 'english_grammar']) {
      for (const [, chs] of groupsOf(subject)) {
        const ids = buildUnitSections(subject, chs, count).flatMap(s => s.chapters.map(c => c.id));
        expect(ids.sort()).toEqual(chs.map(c => c.id).sort());
      }
    }
  });
  it('化学：問題の無い単元は「準備中」として最後にまとめる', () => {
    const chs = groupsOf('chemistry').get('7章 非金属元素')!;
    const secs = buildUnitSections('chemistry', chs, count);
    expect(secs.at(-1)!.key).toBe('empty');
    expect(secs.at(-1)!.chapters.every(c => count(c) === 0)).toBe(true);
    expect(secs[0].chapters.every(c => count(c) > 0)).toBe(true);
  });
  it('化学基礎：全単元に問題があるので見出しは出さない（今までどおり）', () => {
    for (const [, chs] of groupsOf('chemistry_basic')) {
      const secs = buildUnitSections('chemistry_basic', chs, count);
      expect(secs).toHaveLength(1);
      expect(secs[0].label).toBeNull();
      expect(secs[0].chapters.map(c => c.id)).toEqual(chs.map(c => c.id));
    }
  });
  it('地理：第1問は「単元演習」と「模試」に分かれる', () => {
    const secs = buildUnitSections('geography', groupsOf('geography').get('第1問')!, count);
    expect(secs.map(s => s.key)).toEqual(['geo:unit', 'geo:exam']);
  });
  it('数学：段階ごとに見出し', () => {
    const chs = [
      { id: 'a', mathStage: 'basic', practiceProblems: [1] },
      { id: 'b', mathStage: 'full', practiceProblems: [1] },
      { id: 'c', mathStage: 'pattern', practiceProblems: [1] },
    ];
    expect(buildUnitSections('math', chs, count).map(s => s.label)).toEqual(['基礎〜標準', '網羅（全範囲）', 'パターン演習']);
  });
});

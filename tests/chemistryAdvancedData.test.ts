/**
 * 化学（発展）データの構造テスト。
 *
 * 目的:
 *  - 化学基礎と同じ形（parts → chapters → {id, abstractTitle, realTitle, topics, ...}）であること
 *  - 章ID が化学基礎と衝突しないこと（進捗・ランキングは章IDで管理しているため）
 *  - 教科書順（理論 → 無機 → 有機）で並んでいること
 *  - 教科書の小単元がそれぞれ1つのアプリ単元になっていること
 */
import { describe, it, expect } from 'vitest';
import {
  chemistryAdvancedData,
  ADVANCED_FIELDS,
  getAdvancedPart,
  getAdvancedChapters,
  getAllAdvancedChapters,
  getAdvancedFieldStats,
} from '../src/data/chemistryAdvancedData';
import { chemistryData } from '../src/data/chemistryData';

describe('化学（発展）データの構造', () => {
  it('理論化学・無機化学・有機化学の3分野が教科書順に並んでいる', () => {
    expect(chemistryAdvancedData.parts.map((p) => p.field)).toEqual([
      'theoretical',
      'inorganic',
      'organic',
    ]);
    expect(ADVANCED_FIELDS.map((f) => f.title)).toEqual(['理論化学', '無機化学', '有機化学']);
  });

  it('化学基礎と同じ形（章は abstractTitle / realTitle / topics を持つ）', () => {
    for (const chapter of getAllAdvancedChapters()) {
      expect(typeof chapter.id).toBe('string');
      expect(chapter.abstractTitle.length).toBeGreaterThan(0);
      expect(chapter.realTitle.length).toBeGreaterThan(0);
      expect(Array.isArray(chapter.topics)).toBe(true);
      expect(Array.isArray(chapter.practiceProblems)).toBe(true);
      expect(Array.isArray(chapter.miniTest)).toBe(true);
    }
  });

  it('章ID に重複がなく、化学基礎の章ID とも衝突しない', () => {
    const advIds = getAllAdvancedChapters().map((c) => c.id);
    expect(new Set(advIds).size).toBe(advIds.length);

    const basicIds = new Set(
      chemistryData.parts.flatMap((p: any) => p.chapters.map((c: any) => c.id)),
    );
    for (const id of advIds) {
      expect(basicIds.has(id)).toBe(false);
    }
  });

  it('各分野の章（＝教科書の章）は複数の小単元を束ねている', () => {
    for (const field of ADVANCED_FIELDS) {
      const chapters = getAdvancedChapters(field.id);
      expect(chapters.length).toBeGreaterThan(0);
      // realTitle（教科書の章）でまとめると、章の数より小単元の数のほうが多い
      const sections = new Set(chapters.map((c) => c.realTitle));
      expect(sections.size).toBeGreaterThan(0);
      expect(chapters.length).toBeGreaterThan(sections.size);
    }
  });

  it('getAdvancedFieldStats は章数・単元数・問題数を返す', () => {
    for (const field of ADVANCED_FIELDS) {
      const stats = getAdvancedFieldStats(field.id);
      const chapters = getAdvancedChapters(field.id);
      expect(stats.units).toBe(chapters.length);
      expect(stats.sections).toBe(new Set(chapters.map((c) => c.realTitle)).size);
      // 問題は今後追加していく段階なので 0 以上であればよい
      expect(stats.questions).toBeGreaterThanOrEqual(0);
    }
  });

  it('getAdvancedPart は未知の分野に対して null を返す', () => {
    expect(getAdvancedPart('theoretical')).not.toBeNull();
    expect(getAdvancedPart('unknown' as any)).toBeNull();
  });
});

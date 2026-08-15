/**
 * ===================================================================
 * 英語リスニング（共通テスト）単元データの構造テスト
 * ===================================================================
 * ご要望：
 *   第1問 A,B / 第2問 / 第3問 / 第4問 A,B / 第5問 / 第6問 A,B
 *   の順で「まずは単元を追加する」。デザインは他科目と変えない。
 *
 * 「デザインを変えない」＝ 既存の単元選択画面（ChapterSelection）を
 * そのまま流用できることなので、
 *   ① 化学基礎／化学とまったく同じ parts→chapters の形をしていること
 *   ② 単元IDが既存2科目と衝突しないこと（進捗・ランキングは単元IDで管理）
 * を機械的に守れるようテストで固定する。
 */
import { describe, it, expect } from 'vitest';
import {
  englishListeningData,
  LISTENING_SECTIONS,
  getListeningPart,
  getListeningChapters,
  getAllListeningChapters,
  getListeningStats,
} from '../src/data/englishListeningData';
import { chemistryData } from '../src/data/chemistryData';
import { getAllAdvancedChapters } from '../src/data/chemistryAdvancedData';

describe('英語リスニングの単元構成', () => {
  it('ご要望どおりの並び（第1問A/B → 第2問 → 第3問 → 第4問A/B → 第5問 → 第6問A/B）', () => {
    expect(getAllListeningChapters().map((c) => c.abstractTitle)).toEqual([
      '第1問 A',
      '第1問 B',
      '第2問',
      '第3問',
      '第4問 A',
      '第4問 B',
      '第5問',
      '第6問 A',
      '第6問 B',
    ]);
  });

  it('タブ見出し（realTitle）は大問6つにまとまる', () => {
    const realTitles = [...new Set(getAllListeningChapters().map((c) => c.realTitle))];
    expect(realTitles).toEqual(['第1問', '第2問', '第3問', '第4問', '第5問', '第6問']);
  });

  it('前半（2回読み）／後半（1回読み）の2区分に分かれている', () => {
    expect(englishListeningData.parts.map((p) => p.section)).toEqual([
      'first_half',
      'second_half',
    ]);
    expect(LISTENING_SECTIONS.map((s) => s.id)).toEqual(['first_half', 'second_half']);
    // 第1問・第2問だけが2回読み、第3問以降は1回読み
    for (const c of getListeningChapters('first_half')) expect(c.readCount).toBe(2);
    for (const c of getListeningChapters('second_half')) expect(c.readCount).toBe(1);
  });
});

describe('他科目と同じ形（画面を流用するための約束）', () => {
  it('章は abstractTitle / realTitle / topics / practiceProblems / miniTest を持つ', () => {
    for (const chapter of getAllListeningChapters()) {
      expect(typeof chapter.id).toBe('string');
      expect(chapter.abstractTitle.length).toBeGreaterThan(0);
      expect(chapter.realTitle.length).toBeGreaterThan(0);
      expect(Array.isArray(chapter.topics)).toBe(true);
      expect(chapter.topics.length).toBeGreaterThan(0);
      expect(Array.isArray(chapter.practiceProblems)).toBe(true);
      expect(Array.isArray(chapter.miniTest)).toBe(true);
    }
  });

  it('単元ID に重複がなく、化学基礎・化学の単元ID とも衝突しない', () => {
    const ids = getAllListeningChapters().map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);

    const chemIds = new Set<string>([
      ...chemistryData.parts.flatMap((p: any) => p.chapters.map((c: any) => c.id)),
      ...getAllAdvancedChapters().map((c) => c.id),
    ]);
    for (const id of ids) {
      expect(chemIds.has(id)).toBe(false);
      // 接頭辞 el… で識別できる
      expect(id.startsWith('el')).toBe(true);
    }
  });

  it('問題はまだ未収録（＝画面上は「準備中」と出る段階）', () => {
    expect(getListeningStats().questions).toBe(0);
  });
});

describe('集計ヘルパー', () => {
  it('getListeningStats は大問数・単元数・配点・マーク数を返す', () => {
    const stats = getListeningStats();
    expect(stats.sections).toBe(6);
    expect(stats.units).toBe(9);
    // 配点は大問単位で公表されるため、A/B を二重に足さず合計100点になる
    expect(stats.points).toBe(100);
    expect(stats.marks).toBe(37);
  });

  it('getListeningPart は未知の区分に対して null を返す', () => {
    expect(getListeningPart('first_half')).not.toBeNull();
    expect(getListeningPart('unknown' as any)).toBeNull();
    expect(getListeningChapters('unknown' as any)).toEqual([]);
  });
});

/**
 * ===================================================================
 * findChapterById（全教科横断の章引き）の特性テスト
 * ===================================================================
 *
 * ■ 何を守るためのテストか
 * App.tsx にベタ書きされていた
 *
 *     [...chemistryData.parts.flatMap(p => p.chapters),
 *      ...chemistryAdvancedData..., ...englishListeningData...,
 *      ...mathData..., ...biologyBasicData..., ...englishGrammarData...]
 *       .find(c => c.id === selectedChapterId)
 *
 * を data/allChapters.ts の findChapterById() に移した。
 * このテストは「移す前と後で、返ってくる章が完全に同一であること」を
 * 検証する。ここが壊れると「単元を選んでも問題が出ない」という
 * 分かりにくい不具合になるため、元の式をテスト側に写して
 * 両者を突き合わせる形にしている。
 */

import { describe, it, expect } from 'vitest';
import { findChapterById } from '../src/data/allChapters';
import { chemistryData } from '../src/data/chemistryData';
import { chemistryAdvancedData } from '../src/data/chemistryAdvancedData';
import { englishListeningData } from '../src/data/englishListeningData';
import { mathData } from '../src/data/mathData';
import { biologyBasicData } from '../src/data/biologyBasicData';
import { englishGrammarData } from '../src/data/englishGrammarData';

/** リファクタ前に App.tsx が行っていた計算をそのまま再現したもの */
function legacyFindChapterById(chapterId: string | null | undefined) {
  return [
    ...chemistryData.parts.flatMap((p) => p.chapters as any[]),
    ...chemistryAdvancedData.parts.flatMap((p) => p.chapters as any[]),
    ...englishListeningData.parts.flatMap((p) => p.chapters as any[]),
    ...mathData.parts.flatMap((p) => p.chapters as any[]),
    ...biologyBasicData.parts.flatMap((p) => p.chapters as any[]),
    ...englishGrammarData.parts.flatMap((p) => p.chapters as any[]),
  ].find((c) => (c as any).id === chapterId);
}

const allIds: string[] = [
  ...chemistryData.parts.flatMap((p) => p.chapters as any[]),
  ...chemistryAdvancedData.parts.flatMap((p) => p.chapters as any[]),
  ...englishListeningData.parts.flatMap((p) => p.chapters as any[]),
  ...mathData.parts.flatMap((p) => p.chapters as any[]),
  ...biologyBasicData.parts.flatMap((p) => p.chapters as any[]),
  ...englishGrammarData.parts.flatMap((p) => p.chapters as any[]),
].map((c) => (c as any).id);

describe('findChapterById（全教科横断の章引き）', () => {
  it('章が1つ以上ある（データ読み込み自体の確認）', () => {
    expect(allIds.length).toBeGreaterThan(0);
  });

  it('すべての章IDについて、リファクタ前と同じ章オブジェクトを返す', () => {
    for (const id of allIds) {
      // 同じ「実体」が返ることまで確認する（コピーではない）
      expect(findChapterById(id)).toBe(legacyFindChapterById(id));
    }
  });

  it('存在しないIDでは undefined を返す', () => {
    expect(findChapterById('__no_such_chapter__')).toBeUndefined();
  });

  it('null / undefined / 空文字では undefined を返す（画面初期状態）', () => {
    expect(findChapterById(null)).toBeUndefined();
    expect(findChapterById(undefined)).toBeUndefined();
    expect(findChapterById('')).toBeUndefined();
  });

  it('2回目以降も同じ実体を返す（キャッシュしても結果が変わらない）', () => {
    const id = allIds[0];
    expect(findChapterById(id)).toBe(findChapterById(id));
  });

  it('各教科の章が少なくとも1つは引ける（教科の取りこぼしが無い）', () => {
    const subjects: [string, { parts: { chapters: unknown[] }[] }][] = [
      ['化学基礎', chemistryData as any],
      ['化学', chemistryAdvancedData as any],
      ['英語リスニング', englishListeningData as any],
      ['数学', mathData as any],
      ['生物基礎', biologyBasicData as any],
      ['英文法', englishGrammarData as any],
    ];
    for (const [label, data] of subjects) {
      const first = data.parts.flatMap((p) => p.chapters as any[])[0];
      expect(first, `${label} に章が無い`).toBeTruthy();
      expect(findChapterById((first as any).id), `${label} の章が引けない`).toBe(first);
    }
  });
});

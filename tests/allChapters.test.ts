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
import { findChapterById, getChaptersOfSubject, SUBJECTS } from '../src/data/allChapters';
import { chemistryData } from '../src/data/chemistryData';
import { chemistryAdvancedData, getAllAdvancedChapters } from '../src/data/chemistryAdvancedData';
import { englishListeningData, getAllListeningChapters } from '../src/data/englishListeningData';
import { mathData, getAllMathChapters } from '../src/data/mathData';
import { biologyBasicData, getAllBiologyChapters } from '../src/data/biologyBasicData';
import { englishGrammarData, getAllGrammarChapters } from '../src/data/englishGrammarData';
import { SUBJECT_LABELS, type SubjectId } from '../src/components/SubjectSelection';

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

/**
 * ===================================================================
 * getChaptersOfSubject / SUBJECTS の特性テスト
 * ===================================================================
 *
 * Home.tsx にあった次の2か所の「6教科の列挙」を SUBJECTS に寄せた。
 *
 *   ・allChaptersList     … 選択中の教科の章（if 連鎖）
 *   ・subjectProgressDefs … 教科別の進捗バーの定義（{ id, label, chapters }）
 *
 * ここでは「寄せる前に Home.tsx が返していた値」をテスト側に写して、
 * 新しい関数と突き合わせる。進捗バーの分母・分子はこの配列から
 * 計算されるので、ずれると画面の数字が黙って変わってしまう。
 */

/** リファクタ前の Home.tsx allChaptersList（L76-86）をそのまま再現したもの */
function legacyAllChaptersList(subject: string | null | undefined): any[] {
  if (subject === 'chemistry') return getAllAdvancedChapters() as any[];
  if (subject === 'english_listening') return getAllListeningChapters() as any[];
  if (subject === 'math') return getAllMathChapters() as any[];
  if (subject === 'biology_basic') return getAllBiologyChapters() as any[];
  if (subject === 'english_grammar') return getAllGrammarChapters() as any[];
  return chemistryData.parts.flatMap((p: any) => p.chapters) as any[];
}

/** リファクタ前の Home.tsx subjectProgressDefs（L100-134）をそのまま再現したもの */
const legacySubjectProgressDefs = [
  {
    id: 'chemistry_basic',
    label: '化学基礎',
    chapters: chemistryData.parts.flatMap((p: any) => p.chapters) as any[],
  },
  { id: 'chemistry', label: '化学', chapters: getAllAdvancedChapters() as any[] },
  {
    id: 'english_listening',
    label: '英語リスニング',
    chapters: getAllListeningChapters() as any[],
  },
  { id: 'math', label: '数学', chapters: getAllMathChapters() as any[] },
  { id: 'biology_basic', label: '生物基礎', chapters: getAllBiologyChapters() as any[] },
  { id: 'english_grammar', label: '英文法', chapters: getAllGrammarChapters() as any[] },
];

describe('getChaptersOfSubject / SUBJECTS（教科レジストリ）', () => {
  it('全教科について、リファクタ前の allChaptersList と同じ章が同じ順で返る', () => {
    for (const subject of SUBJECTS) {
      const actual = getChaptersOfSubject(subject.id);
      const expected = legacyAllChaptersList(subject.id);
      expect(actual.length, `${subject.label} の章数が違う`).toBe(expected.length);
      // 順番も含めて、同じ実体が同じ位置に並ぶことまで確認する
      actual.forEach((chapter: any, i: number) => {
        expect(chapter, `${subject.label} の ${i} 番目の章が違う`).toBe(expected[i]);
      });
    }
  });

  it('未知の教科IDでは化学基礎の章を返す（元の if 連鎖の既定分岐と同じ）', () => {
    const fallback = legacyAllChaptersList('__unknown__');
    expect(getChaptersOfSubject('__unknown__').length).toBe(fallback.length);
    expect(getChaptersOfSubject('__unknown__')[0]).toBe(fallback[0]);
    // null / undefined でも画面が空にならない
    expect(getChaptersOfSubject(null)[0]).toBe(fallback[0]);
    expect(getChaptersOfSubject(undefined)[0]).toBe(fallback[0]);
  });

  it('SUBJECTS の並び・ID・表示名が、リファクタ前の進捗バーの定義と一致する', () => {
    expect(SUBJECTS.length).toBe(legacySubjectProgressDefs.length);
    SUBJECTS.forEach((subject, i) => {
      expect(subject.id, `${i} 番目の教科IDが違う（画面の並びが変わる）`).toBe(
        legacySubjectProgressDefs[i].id,
      );
      expect(subject.label, `${subject.id} の表示名が違う`).toBe(
        legacySubjectProgressDefs[i].label,
      );
    });
  });

  it('進捗バーの分母（大問数）がリファクタ前と一致する', () => {
    const countProblems = (chapters: any[]) =>
      chapters.reduce(
        (sum: number, c: any) =>
          sum + (c.miniTest?.length || 0) + (c.practiceProblems?.length || 0),
        0,
      );
    SUBJECTS.forEach((subject, i) => {
      expect(
        countProblems(getChaptersOfSubject(subject.id)),
        `${subject.label} の大問数が変わっている`,
      ).toBe(countProblems(legacySubjectProgressDefs[i].chapters));
    });
  });

  it('2回目以降も同じ実体を返す（キャッシュしても結果が変わらない）', () => {
    for (const subject of SUBJECTS) {
      expect(getChaptersOfSubject(subject.id)).toBe(getChaptersOfSubject(subject.id));
    }
  });

  it('SUBJECTS の教科IDと表示名が SubjectSelection の定義と一致する', () => {
    // data 層から components を参照できないため型を二重に持っている。
    // 値がずれていないことをここで担保する。
    for (const subject of SUBJECTS) {
      expect(
        SUBJECT_LABELS[subject.id as SubjectId],
        `${subject.id} の表示名が SubjectSelection とずれている`,
      ).toBe(subject.label);
    }
    // 逆向き：SubjectSelection にある教科が SUBJECTS から漏れていない
    for (const id of Object.keys(SUBJECT_LABELS)) {
      expect(
        SUBJECTS.some((subject) => subject.id === id),
        `${id} が SUBJECTS に無い（教科追加の入れ忘れ）`,
      ).toBe(true);
    }
  });
});

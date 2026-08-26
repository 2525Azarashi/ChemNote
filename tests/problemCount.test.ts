/**
 * ===================================================================
 * 大問カウント共通化の「壊していないこと」の検証
 * ===================================================================
 *
 * src/data/problemCount.ts は、アプリ内に10か所あった
 *
 *     (c.miniTest?.length || 0) + (c.practiceProblems?.length || 0)
 *
 * という式を1か所にまとめたもの。
 *
 * このテストは「まとめる前の式」をテスト側に書き写しておき、
 * 実データ全章に対して両者が完全に一致することを確かめる。
 * リファクタリングの前に書いて実行し、通ることを確認してから
 * 本体のコードに手を入れている（式の写し間違いを防ぐため）。
 *
 * 数字をベタ書きしていないのは、問題を追加したときに
 * テストが「実データと合わなくなって落ちる」ようにしないため。
 * ここで見たいのは「昔の式と今の関数が同じ答えを出すか」だけ。
 */

import { describe, it, expect } from 'vitest';
import { countChapterProblems, countProblemsInChapters } from '../src/data/problemCount';
import { chemistryData } from '../src/data/chemistryData';
import { chemistryAdvancedData, getAllAdvancedChapters, getAdvancedChapters, getAdvancedFieldStats, ADVANCED_FIELDS } from '../src/data/chemistryAdvancedData';
import { englishListeningData, getAllListeningChapters, getListeningStats } from '../src/data/englishListeningData';
import { mathData, getAllMathChapters, getMathStats } from '../src/data/mathData';
import { biologyBasicData, getAllBiologyChapters, getBiologyStats } from '../src/data/biologyBasicData';
import { englishGrammarData, getAllGrammarChapters, getGrammarStats } from '../src/data/englishGrammarData';

/** まとめる前の式（Home.tsx / 各 data ファイルに書かれていたもの） */
function legacyCount(c: any): number {
  return (c.miniTest?.length || 0) + (c.practiceProblems?.length || 0);
}

/** まとめる前の式（SubjectSelection.tsx に書かれていた別表記） */
function legacyCountAltForm(c: any): number {
  return (c.practiceProblems || []).length + (c.miniTest || []).length;
}

/** 各教科の全章（parts をならしたもの） */
const allSubjectChapters: [string, any[]][] = [
  ['chemistry_basic', chemistryData.parts.flatMap((p: any) => p.chapters)],
  ['chemistry', chemistryAdvancedData.parts.flatMap((p: any) => p.chapters)],
  ['english_listening', englishListeningData.parts.flatMap((p: any) => p.chapters)],
  ['math', mathData.parts.flatMap((p: any) => p.chapters)],
  ['biology_basic', biologyBasicData.parts.flatMap((p: any) => p.chapters)],
  ['english_grammar', englishGrammarData.parts.flatMap((p: any) => p.chapters)],
];

describe('countChapterProblems（大問カウントの共通化）', () => {
  it('実データの全章で、まとめる前の式と1問もズレない', () => {
    let checked = 0;
    for (const [subjectId, chapters] of allSubjectChapters) {
      for (const chapter of chapters) {
        expect(
          countChapterProblems(chapter),
          `${subjectId} / ${chapter.id} の大問数が変わっている`,
        ).toBe(legacyCount(chapter));
        checked += 1;
      }
    }
    // 章が1つも見つからないまま「全部一致した」と誤判定しないための番人
    expect(checked).toBeGreaterThan(100);
  });

  it('SubjectSelection にあった別表記の式とも一致する', () => {
    for (const [subjectId, chapters] of allSubjectChapters) {
      for (const chapter of chapters) {
        expect(
          countChapterProblems(chapter),
          `${subjectId} / ${chapter.id} が別表記とズレている`,
        ).toBe(legacyCountAltForm(chapter));
      }
    }
  });

  it('問題がまだ無い章・欠けている章では 0 を返す（従来の || 0 と同じ）', () => {
    expect(countChapterProblems({})).toBe(0);
    expect(countChapterProblems({ miniTest: [], practiceProblems: [] })).toBe(0);
    expect(countChapterProblems(null)).toBe(0);
    expect(countChapterProblems(undefined)).toBe(0);
    // 片方だけあるとき
    expect(countChapterProblems({ miniTest: [1, 2] })).toBe(2);
    expect(countChapterProblems({ practiceProblems: [1, 2, 3] })).toBe(3);
    expect(countChapterProblems({ miniTest: [1], practiceProblems: [1, 2] })).toBe(3);
  });
});

describe('countProblemsInChapters（合計）', () => {
  it('各教科の合計が、まとめる前の reduce と一致する', () => {
    for (const [subjectId, chapters] of allSubjectChapters) {
      const legacyTotal = chapters.reduce((sum: number, c: any) => sum + legacyCount(c), 0);
      expect(
        countProblemsInChapters(chapters),
        `${subjectId} の合計問題数が変わっている`,
      ).toBe(legacyTotal);
    }
  });

  it('空配列・未指定では 0', () => {
    expect(countProblemsInChapters([])).toBe(0);
    expect(countProblemsInChapters(null)).toBe(0);
    expect(countProblemsInChapters(undefined)).toBe(0);
  });
});

describe('各教科の stats 関数が返す questions が変わらない', () => {
  // 科目選択カードに出る「◯問」の数字。ここがズレると画面の表示が変わってしまう。
  it('リスニング・数学・生物基礎・英文法の questions が実データの合計と一致する', () => {
    expect(getListeningStats().questions).toBe(
      getAllListeningChapters().reduce((s: number, c: any) => s + legacyCount(c), 0),
    );
    expect(getMathStats().questions).toBe(
      getAllMathChapters().reduce((s: number, c: any) => s + legacyCount(c), 0),
    );
    expect(getBiologyStats().questions).toBe(
      getAllBiologyChapters().reduce((s: number, c: any) => s + legacyCount(c), 0),
    );
    expect(getGrammarStats().questions).toBe(
      getAllGrammarChapters().reduce((s: number, c: any) => s + legacyCount(c), 0),
    );
  });

  it('化学（発展）の分野ごとの questions が実データの合計と一致する', () => {
    // 分野（field）は章ではなく part 側に付いているので、
    // 分野の章を取り出すのは getAdvancedChapters に任せる。
    for (const field of ADVANCED_FIELDS) {
      const chaptersOfField = getAdvancedChapters(field.id);
      expect(
        getAdvancedFieldStats(field.id).questions,
        `${field.id} の問題数が変わっている`,
      ).toBe(chaptersOfField.reduce((s: number, c: any) => s + legacyCount(c), 0));
    }
    // 全分野を足すと全章の合計になる（分野の取りこぼしが無いことの確認）
    expect(
      ADVANCED_FIELDS.reduce((s, f) => s + getAdvancedFieldStats(f.id).questions, 0),
    ).toBe(getAllAdvancedChapters().reduce((s: number, c: any) => s + legacyCount(c), 0));
  });
});

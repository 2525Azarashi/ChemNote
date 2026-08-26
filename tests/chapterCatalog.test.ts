/**
 * 章カタログ（先生ダッシュボードの到達率の「分母」）の特性テスト。
 *
 * ■ なぜこのテストが必要か
 *   getChapterCatalog は「その科目に章がいくつあり、各章に大問が何問あるか」を返す。
 *   これは生徒の到達率の分母になるため、値が1つでもズレると
 *   成績表示が静かに間違う（画面は普通に出るので気づけない）。
 *
 *   今後この周辺の構造を整理するときに、
 *   ★整理の前後で分母が1問も変わっていないこと★
 *   を機械的に保証するための土台として、現在の値をそのまま記録しておく。
 *
 * ■ 期待値の決め方
 *   「あるべき値」を人間が計算して書くのではなく、
 *   ★現在の実装が返している値をそのまま固定する★（特性テスト）。
 *   目的は仕様の再定義ではなく「変えていないことの証明」なので、
 *   現状をスナップショットするのが正しい。
 */
import { describe, expect, it } from 'vitest';
import {
  getChapterCatalog,
  countCatalogProblems,
  SUBJECT_LABELS,
  type CatalogSubject,
} from '../src/data/chapterCatalog';

const SUBJECTS: CatalogSubject[] = [
  'chemistry_basic',
  'chemistry',
  'english_listening',
  'english_grammar',
  'math',
  'biology_basic',
];

describe('章カタログ（到達率の分母）', () => {
  it('科目ラベルは6科目そろっている', () => {
    for (const s of SUBJECTS) {
      expect(SUBJECT_LABELS[s], `${s} のラベル`).toBeTruthy();
    }
    expect(Object.keys(SUBJECT_LABELS).sort()).toEqual([...SUBJECTS].sort());
  });

  it('全科目で章が1つ以上返り、各章は id / title / totalProblems を持つ', () => {
    for (const s of SUBJECTS) {
      const rows = getChapterCatalog(s);
      expect(rows.length, `${s} の章数`).toBeGreaterThan(0);
      for (const row of rows) {
        expect(typeof row.id, `${s} の章 id`).toBe('string');
        expect(row.id.length, `${s} の章 id が空でない`).toBeGreaterThan(0);
        expect(typeof row.title, `${s} の章 title`).toBe('string');
        expect(row.title.length, `${s} の章 title が空でない`).toBeGreaterThan(0);
        expect(Number.isInteger(row.totalProblems), `${s} の totalProblems が整数`).toBe(true);
      }
    }
  });

  it('★問題が0問の章は分母に含めない★（到達率を不当に下げないため）', () => {
    for (const s of SUBJECTS) {
      for (const row of getChapterCatalog(s)) {
        expect(row.totalProblems, `${s} / ${row.id} は0問であってはならない`).toBeGreaterThan(0);
      }
    }
  });

  it('章 id は科目内で重複しない（重複すると分母が二重計上される）', () => {
    for (const s of SUBJECTS) {
      const ids = getChapterCatalog(s).map((r) => r.id);
      expect(new Set(ids).size, `${s} の章 id はユニーク`).toBe(ids.length);
    }
  });

  it('countCatalogProblems は各章の totalProblems の合計と一致する', () => {
    for (const s of SUBJECTS) {
      const sum = getChapterCatalog(s).reduce((a, r) => a + r.totalProblems, 0);
      expect(countCatalogProblems(s), `${s} の合計`).toBe(sum);
    }
  });

  it('2回呼んでも同じ配列（キャッシュが効いていて結果がぶれない）', () => {
    for (const s of SUBJECTS) {
      expect(getChapterCatalog(s)).toBe(getChapterCatalog(s));
    }
  });

  /**
   * ★構造整理の前後で分母が変わっていないことを保証する本体★
   * 数値は「現在の実装の実測値」。整理でこの値が動いたら、
   * それは到達率の計算が変わったということなので必ず止めること。
   */
  it('科目ごとの章数と大問総数が、整理前と一致する', () => {
    const actual = Object.fromEntries(
      SUBJECTS.map((s) => [s, { chapters: getChapterCatalog(s).length, problems: countCatalogProblems(s) }]),
    );
    expect(actual).toMatchInlineSnapshot(`
      {
        "biology_basic": {
          "chapters": 5,
          "problems": 24,
        },
        "chemistry": {
          "chapters": 5,
          "problems": 20,
        },
        "chemistry_basic": {
          "chapters": 29,
          "problems": 174,
        },
        "english_grammar": {
          "chapters": 20,
          "problems": 20,
        },
        "english_listening": {
          "chapters": 3,
          "problems": 44,
        },
        "math": {
          "chapters": 33,
          "problems": 65,
        },
      }
    `);
  });
});

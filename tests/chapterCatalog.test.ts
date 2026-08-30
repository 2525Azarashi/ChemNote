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

/**
 * 分母を見る対象の科目。
 * 科目を追加したときはここと下のスナップショットの2か所を更新する
 * （スナップショットは `npx vitest run tests/chapterCatalog.test.ts -u`）。
 * ★新しい科目をここに足すのを忘れると、その科目の分母が
 * このファイルの監視外になる★ので、下の「ラベルがそろっている」
 * テストが SUBJECT_LABELS のキーと完全一致を見て検知する。
 */
const SUBJECTS: CatalogSubject[] = [
  'chemistry_basic',
  'chemistry',
  'english_listening',
  'english_grammar',
  'math',
  'biology_basic',
  // 2026-08 追加：地理総合・地理探究（第1問を回ごとに収録）
  'geography',
];

describe('章カタログ（到達率の分母）', () => {
  it('科目ラベルはすべての科目分そろっている', () => {
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
   * 上の合計値スナップショットだけだと、
   * 「ある章が +1 され、別の章が -1 された」ような相殺に気づけない。
   * 章1件ずつ（id / title / 問題数）まで固定して、
   * 構造整理で1件もズレていないことを確かめる。
   *
   * 期待値はファイルに書き下すと数百行になるので、
   * ★教科データから直接組み立てた「あるべき一覧」と突き合わせる★方式にする。
   * カタログ側の switch 文を経由しない独立した経路で作るので、
   * switch を消す整理をしても、この検査は影響を受けない。
   */
  it('章1件ずつ（id / title / 問題数）が教科データと完全に一致する', async () => {
    const { chemistryData } = await import('../src/data/chemistryData');
    const { chemistryAdvancedData } = await import('../src/data/chemistryAdvancedData');
    const { englishListeningData } = await import('../src/data/englishListeningData');
    const { mathData } = await import('../src/data/mathData');
    const { biologyBasicData } = await import('../src/data/biologyBasicData');
    const { englishGrammarData } = await import('../src/data/englishGrammarData');
    const { geographyData } = await import('../src/data/geographyData');

    const rawBySubject: Record<CatalogSubject, any> = {
      chemistry_basic: chemistryData,
      chemistry: chemistryAdvancedData,
      english_listening: englishListeningData,
      english_grammar: englishGrammarData,
      math: mathData,
      biology_basic: biologyBasicData,
      geography: geographyData,
    };

    // ★科目を追加してここの対応表を更新し忘れると、
    // undefined.parts で落ちて原因が分かりにくいので先に見る★
    for (const s of SUBJECTS) {
      expect(rawBySubject[s], `${s} の教科データが rawBySubject に登録されている`).toBeTruthy();
    }

    for (const s of SUBJECTS) {
      // 整理前の toDefinitions と同じ手順を、テスト側で独立に組み立てる
      const expected: { id: string; title: string; totalProblems: number }[] = [];
      for (const part of rawBySubject[s].parts || []) {
        for (const chapter of part.chapters || []) {
          const total =
            (Array.isArray(chapter.practiceProblems) ? chapter.practiceProblems.length : 0) +
            (Array.isArray(chapter.miniTest) ? chapter.miniTest.length : 0);
          if (total === 0) continue;
          expected.push({
            id: chapter.id,
            title: (chapter.abstractTitle || chapter.realTitle || chapter.id).trim(),
            totalProblems: total,
          });
        }
      }
      expect(getChapterCatalog(s), `${s} の章一覧`).toEqual(expected);
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
          "chapters": 4,
          "problems": 60,
        },
        "geography": {
          "chapters": 5,
          "problems": 5,
        },
        "math": {
          "chapters": 33,
          "problems": 65,
        },
      }
    `);
  });
});

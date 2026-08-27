import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

import {
  SUBJECT_INDEX,
  getChapterIndexOfSubject,
} from '../src/data/chapterIndex.generated';
import { SUBJECTS, getChaptersOfSubject } from '../src/data/allChapters';
import { countChapterProblems, countProblemsInChapters } from '../src/data/problemCount';

/**
 * ===================================================================
 * 章インデックス（軽い索引）が教科データ本体とズレないことの検査
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ このテストが守っているもの
 * -------------------------------------------------------------------
 * src/data/chapterIndex.generated.ts は
 * scripts/gen-chapter-index.mts が教科データから機械的に作る索引で、
 * ホーム画面はこれだけを読む（教科データ本体は読まない）。
 *
 * したがって索引が古いと、ホームの分母だけが古い値のままになる。
 * これは「解いたのに進捗が増えない」という、
 * ★ユーザーから見て最も原因が分からない種類の不具合★ になる。
 *
 * そこでここで索引と本体を1件ずつ突き合わせる。
 * 問題を足して `npm run gen:index` を忘れたら、このテストが落ちる。
 *
 * -------------------------------------------------------------------
 * ■ 「同じ数え方であること」まで見る
 * -------------------------------------------------------------------
 * 単に数字が一致しているかではなく、
 * 索引の problemCount が data/problemCount.ts の countChapterProblems
 * （＝アプリ本体が使っている唯一の数え方）と一致することを見る。
 * こうしておけば、将来 countChapterProblems の定義を変えたときにも
 * 索引を作り直す必要があることが自動で分かる。
 */

describe('章インデックス：教科データ本体とズレていない', () => {
  it('教科の顔ぶれと並び順が SUBJECTS と完全に一致する', () => {
    // 並び順はホーム画面の教科別進捗の表示順そのものなので、
    // 集合が同じでは足りず、順序まで一致していなければならない。
    expect(SUBJECT_INDEX.map((s) => s.id)).toEqual(SUBJECTS.map((s) => s.id));
  });

  it('教科の表示名が SUBJECTS の label と一致する', () => {
    expect(SUBJECT_INDEX.map((s) => s.label)).toEqual(SUBJECTS.map((s) => s.label));
  });

  it.each(SUBJECTS.map((s) => [s.id] as const))(
    '%s: 章IDの並びが本体と一致する',
    (subjectId) => {
      const real = getChaptersOfSubject(subjectId).map((c: any) => String(c.id));
      const indexed = getChapterIndexOfSubject(subjectId).map((c) => c.id);
      expect(indexed).toEqual(real);
    },
  );

  it.each(SUBJECTS.map((s) => [s.id] as const))(
    '%s: 章ごとの大問数が countChapterProblems と一致する',
    (subjectId) => {
      const real = getChaptersOfSubject(subjectId);
      const indexed = getChapterIndexOfSubject(subjectId);

      real.forEach((chapter: any, i: number) => {
        // countChapterProblems はアプリ本体が使っている唯一の数え方。
        expect(indexed[i].problemCount).toBe(countChapterProblems(chapter));
      });
    },
  );

  it.each(SUBJECTS.map((s) => [s.id] as const))(
    '%s: 章名（title / abstractTitle）が本体と一致する',
    (subjectId) => {
      const real = getChaptersOfSubject(subjectId);
      const indexed = getChapterIndexOfSubject(subjectId);

      real.forEach((chapter: any, i: number) => {
        // 索引側は「値があるときだけ」持たせているので、
        // 本体が空文字・未定義のときは索引側も undefined になる。
        const expectedTitle =
          typeof chapter.title === 'string' && chapter.title ? chapter.title : undefined;
        const expectedAbstract =
          typeof chapter.abstractTitle === 'string' && chapter.abstractTitle
            ? chapter.abstractTitle
            : undefined;

        expect(indexed[i].title).toBe(expectedTitle);
        expect(indexed[i].abstractTitle).toBe(expectedAbstract);
      });
    },
  );

  it('教科ごとの合計大問数が本体と一致する（ホームの分母そのもの）', () => {
    SUBJECTS.forEach((subject) => {
      const realTotal = countProblemsInChapters(getChaptersOfSubject(subject.id) as any);
      const indexTotal = getChapterIndexOfSubject(subject.id).reduce(
        (sum, c) => sum + c.problemCount,
        0,
      );
      expect(indexTotal).toBe(realTotal);
    });
  });

  it('化学基礎の合計が 174 大問（実データの既知の値）', () => {
    const total = getChapterIndexOfSubject('chemistry_basic').reduce(
      (sum, c) => sum + c.problemCount,
      0,
    );
    expect(total).toBe(174);
  });

  it('未知の教科IDのときは先頭の教科（化学基礎）を返す（本体と同じ既定）', () => {
    // getChaptersOfSubject が未知IDで SUBJECTS[0] を返す挙動に合わせている。
    expect(getChapterIndexOfSubject('no_such_subject')).toBe(
      getChapterIndexOfSubject('chemistry_basic'),
    );
    expect(getChapterIndexOfSubject(undefined)).toBe(
      getChapterIndexOfSubject('chemistry_basic'),
    );
    expect(getChapterIndexOfSubject(null)).toBe(getChapterIndexOfSubject('chemistry_basic'));
  });
});

describe('章インデックス：軽いままであること（これが存在する理由）', () => {
  const source = readFileSync('src/data/chapterIndex.generated.ts', 'utf8');

  it('教科データを import していない（葉モジュールである）', () => {
    /*
     * ★これがこのファイルの存在意義そのもの★
     * ここから教科データを import すると、索引を読むだけで
     * 教科データ本体（約 2.6MB）が引き込まれ、索引にした意味が消える。
     * 型の import すら置かない（実行時には消えるが、
     * 「ここには依存を足さない」という約束を機械的に守るため）。
     */
    expect(source).not.toMatch(/^\s*import\s/m);
    expect(source).not.toMatch(/^\s*export\s+\{[^}]*\}\s+from\s/m);
    expect(source).not.toMatch(/^\s*export\s+\*\s+from\s/m);
  });

  it('問題文・選択肢・解説を含んでいない', () => {
    // 索引が持つのは id / title / abstractTitle / problemCount だけ。
    // 万一生成スクリプトが問題の中身を書き出すようになったら、
    // 起動時の読み込み量が元に戻ってしまうのでここで止める。
    ['question', 'options', 'explanation', 'answer', 'subQuestions'].forEach((field) => {
      expect(source).not.toContain(`"${field}"`);
    });
  });

  it('十分小さい（章の数ぶんしか増えない設計になっている）', () => {
    // 現在 約 25KB。問題を増やしても章の数（162）ぶんしか増えない。
    // 上限を 200KB にしているのは、章が数倍に増えても通り、
    // 問題本文が混入した場合（数MB規模）には必ず落ちる幅として選んだ。
    expect(Buffer.byteLength(source, 'utf8')).toBeLessThan(200_000);
  });

  it('手で編集しないことが明記されている', () => {
    expect(source).toContain('自動生成');
    expect(source).toContain('gen-chapter-index');
  });
});

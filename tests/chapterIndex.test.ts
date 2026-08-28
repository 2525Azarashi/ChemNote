import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

import {
  SUBJECT_INDEX,
  getChapterIndexOfSubject,
  SUBJECT_STATS,
  getSubjectStats,
} from '../src/data/chapterIndex.generated';
import { SUBJECTS, getChaptersOfSubject } from '../src/data/allChapters';
import { countChapterProblems, countProblemsInChapters } from '../src/data/problemCount';
import { getAllAdvancedChapters } from '../src/data/chemistryAdvancedData';
import { getListeningStats } from '../src/data/englishListeningData';
import { getMathStats } from '../src/data/mathData';
import { getBiologyStats } from '../src/data/biologyBasicData';
import { getGrammarStats } from '../src/data/englishGrammarData';

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

describe('収録ボリュームの数字が本物の集計関数と一致する', () => {
  /*
   * ★ここが落ちたら、科目選択画面の数字だけが古いまま出ている★
   *
   * 索引の数字は生成時に本物の集計関数を呼んで埋め込んでいるが、
   * 「問題を足したのに npm run gen:index を忘れた」場合は
   * 索引だけが古くなる。タイトル画面に古い問題数が出るのは
   * ユーザーから見て原因が全く分からない不具合なので、
   * 実行時にも本物と1フィールドずつ突き合わせて止める。
   */

  it('化学基礎：科目選択画面が書いていた式と一致する', () => {
    // SubjectSelection.tsx の元の式:
    //   chemistryData.parts.flatMap(p => p.chapters) → 章数と countProblemsInChapters
    const chapters = getChaptersOfSubject('chemistry_basic');
    expect(SUBJECT_STATS.chemistry_basic).toEqual({
      chapters: chapters.length,
      questions: countProblemsInChapters(chapters as never),
    });
    // 実際にカードに出ている「全29単元・演習174問」と一致していること
    expect(SUBJECT_STATS.chemistry_basic.chapters).toBe(29);
    expect(SUBJECT_STATS.chemistry_basic.questions).toBe(174);
  });

  it('化学（発展）：getAllAdvancedChapters と一致する', () => {
    const chapters = getAllAdvancedChapters();
    expect(SUBJECT_STATS.chemistry).toEqual({
      chapters: chapters.length,
      questions: countProblemsInChapters(chapters as never),
    });
  });

  it('英語リスニング：getListeningStats の戻り値と完全一致する', () => {
    // 配点・マーク数・大問数まで含めて丸ごと一致していること
    expect(SUBJECT_STATS.english_listening).toEqual(getListeningStats());
  });

  it('数学：getMathStats の戻り値と完全一致する', () => {
    expect(SUBJECT_STATS.math).toEqual(getMathStats());
  });

  it('生物基礎：getBiologyStats の戻り値と完全一致する', () => {
    expect(SUBJECT_STATS.biology_basic).toEqual(getBiologyStats());
  });

  it('英文法：getGrammarStats の戻り値と完全一致する', () => {
    expect(SUBJECT_STATS.english_grammar).toEqual(getGrammarStats());
  });

  it('教科の抜け漏れがない（SUBJECTS の全教科ぶんある）', () => {
    // 教科を追加したとき、索引側に足し忘れるとカードの数字が消える。
    SUBJECTS.forEach((subject) => {
      expect(SUBJECT_STATS[subject.id]).toBeDefined();
    });
    expect(Object.keys(SUBJECT_STATS).length).toBe(SUBJECTS.length);
  });

  it('未知の教科IDでも壊れない（空オブジェクトを返す）', () => {
    // 画面側は数字が undefined のときの表示を持っているので、
    // 例外を投げずに空で返すのが正しい振る舞い。
    expect(getSubjectStats('no_such_subject')).toEqual({});
    expect(getSubjectStats(null)).toEqual({});
    expect(getSubjectStats(undefined)).toEqual({});
    expect(getSubjectStats('chemistry_basic')).toEqual(SUBJECT_STATS.chemistry_basic);
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

  it('ビルド設定が索引を教科データのチャンクに入れていない', () => {
    /*
     * ★ソースを軽くしても、配信の単位が重ければ意味がない★
     *
     * vite.config.ts の manualChunks は
     *   if (id.includes('/src/data/')) return 'data';
     * で src/data 配下をまとめて 1 つの data チャンク（約 3MB）にしている。
     * この索引も src/data にあるため、例外を書かないと
     * 索引を読むだけで 3MB のチャンクを取得することになり、
     * 「ホームは索引だけ読む」という変更の効果が完全に消える。
     * （実際にビルド結果を grep して、索引の中身が data チャンク側に
     *   入っていることを確認したうえで例外を追加した。）
     *
     * ここでは「例外が data 行より前に書かれている」ことまで検査する。
     * 後ろに書くと先に data として拾われてしまい、無意味になるため。
     *
     * -------------------------------------------------------------------
     * ■ ★索引1件だけでなく「例外全部」を見る理由（実際に踏んだ穴）★
     * -------------------------------------------------------------------
     * 例外は今後も増える（軽くした data 層のファイルが増えるため）。
     * ところが「索引の行だけ」を見る検査だと、
     * ★別の例外行が data 行より後ろに書かれても気づけない★。
     *
     * さらに悪いことに、例外を書き忘れたファイルが data チャンクに残ると、
     * そのファイルを参照している索引まで data チャンク側へ引き寄せられる。
     * 実際に chapterCatalog.ts を軽くしたとき、例外を書く前のビルドでは
     *     index の problemCount   3 個 / data の problemCount 164 個
     * と逆転しており、索引の例外（例外1）が実質無効化されていた。
     * 例外を追加したら
     *     index の problemCount 167 個 / data の problemCount   0 個
     * に戻った。
     *
     * つまり「例外が1つでも順序を間違えると、他の例外まで一緒に壊れる」。
     * そこでこの検査は特定の1行を見るのではなく、
     * ★src/data を判定するすべての例外行が data 行より前にあること★
     * を見る形にしてある。例外を足しても検査を足す必要はない。
     */
    const config = readFileSync('vite.config.ts', 'utf8');

    /*
     * 設定ファイルには理由を説明する長いコメントが入っており、
     * その中にも同じ文字列が出てくる。
     * ここで見たいのは「実際に動く行」の順序なので、
     * コメント行を除いた実行される行だけを取り出して比べる。
     */
    const codeLines = config
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('if (') && line.includes('/src/data/'));

    const dataRuleAt = codeLines.findIndex(
      (line) => line.includes("'/src/data/'") && line.includes("'data'"),
    );
    expect(dataRuleAt, 'src/data をまとめて data チャンクにする行が見つからない').toBeGreaterThan(
      -1,
    );

    // 索引の例外は必ず存在していなければならない（この索引の存在意義そのもの）
    const indexExceptionAt = codeLines.findIndex((line) =>
      line.includes('/src/data/chapterIndex.generated'),
    );
    expect(indexExceptionAt, '索引を data チャンクから外す例外が無い').toBeGreaterThan(-1);
    expect(
      indexExceptionAt,
      '索引の例外が data 行より後ろにある（先に data として拾われるので無意味）',
    ).toBeLessThan(dataRuleAt);

    /*
     * data 行より後ろに書かれた「例外らしき行」が無いこと。
     *
     * 例外行＝src/data の中の特定ファイルを判定して data 以外を返す行。
     * data 行そのものは除く。
     */
    const misplaced = codeLines
      .slice(dataRuleAt + 1)
      .filter((line) => !(line.includes("'/src/data/'") && line.includes("'data'")));
    expect(
      misplaced,
      'data 行より後ろに src/data の例外が書かれている（この行は永久に実行されない）:\n  ' +
        misplaced.join('\n  '),
    ).toEqual([]);
  });
});

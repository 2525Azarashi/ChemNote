/**
 * =====================================================================
 * 地理探究 模擬問題（第1回〜第6回＋予想問題）の契約
 * =====================================================================
 * ご指示（原文）：
 *   > ④ 地理探究問題の導入 — 添付ZIP（第1問〜第3問／6セット＋予想問題）を
 *   > 既存UIに合わせて導入。★配点は表記しない★
 *
 * ★このファイルが守る不変条件★
 *
 *  1. ★配点をどこにも表示しない★
 *     元データの見出しには「第1問　気候…（配点34点）」と書かれている。
 *     生成側（scripts/geo/build.py）の strip_points() で落としているが、
 *     元データを差し替えたときに落とし漏れても目では気づけないので、
 *     ここで機械的に止める。単元名・topics・設問文・選択肢・解説の
 *     すべてを走査する。
 *
 *  2. ★設問が「解ける状態」で画面に出ている★
 *     「次の文Ｋ〜Ｍの正誤の組合せを選べ」という設問は、Ｋ・Ｌ・Ｍ の
 *     本文が画面に出ていなければ原理的に解けない。実際、開発中に
 *     設問文の続き26件（div.memo など）が丸ごと落ちる不具合があった。
 *     そこで「Ｋ〜Ｍ／Ｘ・Ｙ を参照している設問は、その記号を含む
 *     本文を必ず持つ」ことを検査する。
 *
 *  3. ★正解が選択肢の中にある★
 *     採点は「選んだ文字列 === correctAnswer」で行うので、
 *     correctAnswer が options に無いと絶対に正解できない。
 *
 *  4. ★解説に小問ごとの目印がある★
 *     採点画面のアコーディオンは explanation を <!--sq:id--> で切り分ける
 *     （src/utils/explanationFormat.ts の sliceEnhancedBySubQuestion）。
 *     目印が無いと null が返り、解説が1文字も出ない。
 *
 *  5. ★画像生成に頼っていない★
 *     「画像生成にクレジット使うからスクリプト側を変える作戦で行こ」
 *     というご指示のため、図は日本語の説明文と表で再現している。
 *     元データに残っていた英語の生成プロンプトが混ざっていないか見る。
 *
 *  6. ★単元と問題が正しく結びついている★
 *     単元 id で問題を引く仕組みなので、id がずれると単元は空になる。
 */

import { describe, it, expect } from 'vitest';
import { GEO_EXAM_PROBLEMS } from '../src/data/geographyExamProblems';
import { getAllGeographyChapters } from '../src/data/geographyData';
import {
  SQ_MARK,
  SQ_BODY_MARK,
  sliceEnhancedBySubQuestion,
} from '../src/utils/explanationFormat';

/** 模擬問題の単元だけを取り出す（既存の第1問セットは対象外）。 */
const examChapters = getAllGeographyChapters().filter((c) => c.id.startsWith('geo_exam_'));

/** 全問題を平らに並べたもの（id 付きで、どこで落ちたか分かるようにする）。 */
const allProblems = Object.entries(GEO_EXAM_PROBLEMS).flatMap(([key, problems]) =>
  problems.map((p) => ({ key, problem: p })),
);

const allSubQuestions = allProblems.flatMap(({ key, problem }) =>
  problem.subQuestions.map((sq: any) => ({ key, problemId: problem.id, sq })),
);

describe('地理探究 模擬問題：収録量', () => {
  it('21単元（7回 × 3大問）が登録されている', () => {
    expect(Object.keys(GEO_EXAM_PROBLEMS)).toHaveLength(21);
    expect(examChapters).toHaveLength(21);
  });

  it('大問は21、設問は112ある', () => {
    expect(allProblems).toHaveLength(21);
    expect(allSubQuestions).toHaveLength(112);
  });

  it('1単元 = 1大問（タブで第1問／第2問／第3問を切り替える形）', () => {
    for (const [key, problems] of Object.entries(GEO_EXAM_PROBLEMS)) {
      expect(problems, `${key} は大問1つであること`).toHaveLength(1);
    }
  });

  it('設問数は 第1問=6 / 第2問=5 / 第3問=5 の形に揃っている', () => {
    for (const [key, problems] of Object.entries(GEO_EXAM_PROBLEMS)) {
      const n = problems[0].subQuestions.length;
      const expected = key.endsWith('_1') ? 6 : 5;
      expect(n, `${key} の設問数`).toBe(expected);
    }
  });
});

describe('地理探究 模擬問題：★配点は表記しない★', () => {
  /**
   * 検査する文字の作り方。
   *   「配点」という語そのものを探す。
   *   ★「N点」では探さない★ … 解説には「この3点を機械的に確認する」
   *   のような日本語の「〜点」があり、これは消してはいけない文章である。
   */
  const POINTS = /配点/;
  /** 「（34点）」「(33 点)」のように括弧に囲まれた点数表記も配点なので拾う。 */
  const BRACKETED_POINTS = /[（(]\s*\d+\s*点\s*[）)]/;

  it('単元名（画面のカード見出し）に配点が無い', () => {
    for (const chapter of examChapters) {
      expect(chapter.abstractTitle, chapter.id).not.toMatch(POINTS);
      expect(chapter.abstractTitle, chapter.id).not.toMatch(BRACKETED_POINTS);
      expect(chapter.realTitle, chapter.id).not.toMatch(POINTS);
    }
  });

  it('topics（カードに並ぶ学習項目）に配点が無い', () => {
    for (const chapter of examChapters) {
      for (const topic of chapter.topics) {
        expect(topic, `${chapter.id} / ${topic}`).not.toMatch(POINTS);
        expect(topic, `${chapter.id} / ${topic}`).not.toMatch(BRACKETED_POINTS);
      }
    }
  });

  it('大問の見出し（category）に配点が無い', () => {
    for (const { key, problem } of allProblems) {
      expect(problem.category, key).not.toMatch(POINTS);
      expect(problem.category, key).not.toMatch(BRACKETED_POINTS);
    }
  });

  it('設問文・選択肢・解説のどこにも「配点」が無い', () => {
    for (const { key, problem } of allProblems) {
      expect(problem.text, `${key} の本文`).not.toMatch(POINTS);
      expect(problem.explanation, `${key} の解説`).not.toMatch(POINTS);
      for (const sq of problem.subQuestions as any[]) {
        expect(sq.label, `${key} / ${sq.id} の設問文`).not.toMatch(POINTS);
        for (const opt of sq.options as string[]) {
          expect(opt, `${key} / ${sq.id} の選択肢`).not.toMatch(POINTS);
        }
        for (const step of sq.detailedExplanation.steps as string[]) {
          expect(step, `${key} / ${sq.id} の思考手順`).not.toMatch(POINTS);
        }
      }
    }
  });
});

describe('地理探究 模擬問題：設問が解ける状態になっている', () => {
  it('選択肢は4つ以上あり、空でない', () => {
    for (const { key, sq } of allSubQuestions) {
      expect(sq.options.length, `${key} / ${sq.id}`).toBeGreaterThanOrEqual(4);
      for (const opt of sq.options as string[]) {
        expect(opt.trim(), `${key} / ${sq.id} に空の選択肢`).not.toBe('');
      }
    }
  });

  it('★正解が選択肢の中にある★（無いと絶対に正解できない）', () => {
    for (const { key, sq } of allSubQuestions) {
      expect(sq.options, `${key} / ${sq.id} の正解 ${sq.correctAnswer}`).toContain(
        sq.correctAnswer,
      );
    }
  });

  it('選択肢に同じ文字列が重複していない（どちらを選んでも正解になってしまう）', () => {
    for (const { key, sq } of allSubQuestions) {
      const uniq = new Set(sq.options as string[]);
      expect(uniq.size, `${key} / ${sq.id} に重複した選択肢`).toBe(sq.options.length);
    }
  });

  it('正解は記号（①など）ではなく本文になっている', () => {
    for (const { key, sq } of allSubQuestions) {
      expect(sq.correctAnswer, `${key} / ${sq.id}`).not.toMatch(/^[①-⑨]$/);
    }
  });

  it('★記号（Ｋ〜Ｍ／Ｘ・Ｙなど）を参照する設問は、その記号の本文を持っている★', () => {
    /**
     * 「次の文Ｋ〜Ｍの正誤の組合せを選べ」という設問は、
     * Ｋ・Ｌ・Ｍ が何の文なのかが画面に出ていなければ解けない。
     * 設問文（label）と大問の本文（text）のどちらかに出ていればよい。
     */
    for (const { key, problemId, sq } of allSubQuestions) {
      const problem = allProblems.find((x) => x.problem.id === problemId)!.problem;
      const visible = `${problem.text}\n${sq.label}`;
      // 全角・半角のどちらの記号でも参照されうる
      const refs = sq.label.match(/[ＫＬＭK-M]〜[ＫＬＭK-M]|空欄[Ａ-Ｚ][・Ａ-Ｚ]*/g) || [];
      if (refs.length === 0) continue;
      for (const ref of refs) {
        // 参照している記号を1文字ずつ取り出し、本文側に現れているか確認する
        const letters = ref.replace(/[〜空欄・]/g, '').split('');
        for (const ch of letters) {
          const count = (visible.match(new RegExp(ch, 'g')) || []).length;
          expect(
            count,
            `${key} / ${sq.id}：「${ref}」と言っているのに ${ch} の本文が画面に出ていない`,
          ).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it('想定正答率は 1〜99% の範囲に入っている', () => {
    for (const { key, sq } of allSubQuestions) {
      expect(sq.correctAnswerRate, `${key} / ${sq.id}`).toBeGreaterThan(0);
      expect(sq.correctAnswerRate, `${key} / ${sq.id}`).toBeLessThan(100);
    }
  });

  it('思考手順（steps）が1つ以上あり、Markdown表を混ぜていない', () => {
    /**
     * steps は Explanation.tsx で <li> の1行として描かれるため、
     * Markdown の表を入れても展開されず「| 地点 | 標高 |」という
     * 生の文字列が出てしまう。表は explanation 側に載せる約束。
     */
    for (const { key, sq } of allSubQuestions) {
      expect(sq.detailedExplanation.steps.length, `${key} / ${sq.id}`).toBeGreaterThan(0);
      for (const step of sq.detailedExplanation.steps as string[]) {
        expect(step.trim(), `${key} / ${sq.id} に空の手順`).not.toBe('');
        expect(step, `${key} / ${sq.id} の手順に表が混ざっている`).not.toMatch(
          /^\s*\|.*\|\s*$/m,
        );
        expect(step, `${key} / ${sq.id} に表の置換漏れ`).not.toContain('[[表');
      }
    }
  });

  it('見出し（theme）が語の途中で切れていない', () => {
    for (const { key, sq } of allSubQuestions) {
      const theme: string = sq.detailedExplanation.theme;
      expect(theme.trim(), `${key} / ${sq.id}`).not.toBe('');
      // 「…につ」「…にお」のように助詞の途中で終わっていないか
      expect(theme, `${key} / ${sq.id} の見出しが途中で切れている`).not.toMatch(
        /(につ|にお|とし|によ|から見|に関)$/,
      );
      /**
       * ★送り仮名の途中で終わっていないか★
       *   実際にあった不具合：語尾の「として」を rstrip('として') で
       *   落としていたため（rstrip は文字集合なので と/し/て を
       *   1文字ずつ削る）、「〜読み取れること」が
       *   「〜読み取れるこ」になり、画面の「答えの核心」に
       *   意味の通らない見出しが出ていた。
       */
      expect(theme, `${key} / ${sq.id} の見出しが送り仮名の途中で終わっている`).not.toMatch(
        /(取れるこ|られるこ|えるこ|いるこ|するこ|なるこ|わかるこ)$/,
      );
    }
  });

  /**
   * ★見出しが「資料の指し先」だけになっていないか★
   *   これも実際にあった不具合：長い設問見出しを「前半を残して切る」
   *   方式にしていたため、「資料1のア〜エのうち」だけが残り、
   *   何を答える設問なのか画面から読み取れなかった。
   *   日本語の設問は答える対象が後ろに来るので、
   *   ★「〜のうち」「〜から」で終わる見出しは作ってはいけない★
   */
  it('★見出しが資料の指し先だけで終わっていない★', () => {
    for (const { key, sq } of allSubQuestions) {
      const theme: string = sq.detailedExplanation.theme;
      expect(theme, `${key} / ${sq.id}：資料の指し先だけの見出しになっている`).not.toMatch(
        /(のうち|から|について|における)$/,
      );
    }
  });

  /**
   * ★語頭が欠けていないか★
   *   文字数で機械的に切ると「東京大都市圏」→「京大都市圏」のように
   *   語の頭が落ちて別の地名に読めてしまう。
   *   固有名詞の頭が欠ける典型例を名指しで止める。
   */
  it('★見出しの語頭が欠けていない★', () => {
    const BROKEN_HEADS = ['京大都市圏', 'れる北極域', '段・下段'];
    for (const { key, sq } of allSubQuestions) {
      const theme: string = sq.detailedExplanation.theme;
      for (const broken of BROKEN_HEADS) {
        expect(theme.startsWith(broken), `${key} / ${sq.id}：「${broken}」で始まっている`).toBe(false);
      }
    }
  });

  /**
   * ★指示語で始まる見出しになっていないか★
   *   実際にあった不具合：長い見出しを後ろの節だけ残す方式にしたとき、
   *     「その形が示す社会的課題との組合せ」
   *   のように★「その」が何を指すのか分からない見出し★ができていた。
   *   元の設問は「人口ピラミッドとして最も適当なものと、その形が…」で、
   *   「その」＝人口ピラミッドの形。見出しだけを見るユーザーには
   *   絶対に伝わらないので、指示語で始めてはいけない。
   */
  it('★見出しが指示語で始まっていない★', () => {
    for (const { key, sq } of allSubQuestions) {
      const theme: string = sq.detailedExplanation.theme;
      // ★止めたいのは「その／それ」で始まる見出しだけ★
      //   「この調査についての次の会話文中の…」は設問の原文そのままで、
      //   直前に解いた大問の調査を指しているのでユーザーには通じる。
      //   ここまで禁止すると原文を壊す方向に働くので対象にしない。
      expect(theme, `${key} / ${sq.id}：指示語で始まる見出しになっている`).not.toMatch(
        /^(その|それ)/,
      );
    }
  });

  /**
   * ★見出しの末尾が助詞のままになっていないか★
   *   「〜との組合せ★を★」のように目的格の助詞で終わると、
   *   文が途中で切れているように見える。見出しは名詞で止める。
   *
   *   ★ただし『と』『の』『に』『で』は語の一部になりうる★
   *   これらをまとめて削ったところ「〜から読み取れる★こと★」の
   *   末尾の「と」が落ちて「〜読み取れるこ」になった（8件）。
   *   よって検査するのも「を」「は」だけに限る。
   */
  it('★見出しが助詞（を・は）で終わっていない★', () => {
    for (const { key, sq } of allSubQuestions) {
      const theme: string = sq.detailedExplanation.theme;
      expect(theme, `${key} / ${sq.id}：助詞で終わる見出しになっている`).not.toMatch(/[をは]$/);
    }
  });

  /**
   * ★設問の定型の言い回しが残っていないか★
   *   「最も適当なものを」「次の①〜⑥のうちから一つ選べ」といった
   *   出題の作法は、どの設問でも同じなので見出しに書く価値がない。
   *   残っていると、肝心の「何を答えるか」が定型に埋もれて読めなくなる。
   *
   *   ★『最も適当』の直後の送り仮名『な』を忘れると1文字も落ちない★
   *   実際にそれで「…組合せとして最も適当なものを」が丸ごと残っていた。
   */
  it('★見出しに出題の定型（最も適当なものを 等）が残っていない★', () => {
    for (const { key, sq } of allSubQuestions) {
      const theme: string = sq.detailedExplanation.theme;
      // ★止めたいのは「見出しの末尾に残った定型」だけ★
      //   文の途中の「〜として最も適当なものと、〜との組合せ」は
      //   ★2つのものを対応づけて答えさせる設問の本体★であって定型ではない。
      //   ここを消すと「何と何を組み合わせるのか」が分からなくなる。
      expect(theme, `${key} / ${sq.id}：出題の定型が末尾に残っている`).not.toMatch(
        /(最も適当|適当でない|適切でない)\s*(?:な)?\s*(?:もの|こと|組合せ)?\s*(?:を|は)?$/,
      );
      expect(theme, `${key} / ${sq.id}：選ばせ方の定型が残っている`).not.toMatch(
        /(のうちから\s*一つ選べ|ものを選べ|次の[①-⑳])/,
      );
    }
  });
});

describe('地理探究 模擬問題：解説が採点画面に出る形になっている', () => {
  it('★小問ごとの目印（<!--sq:id-->）がある★', () => {
    for (const { key, problem } of allProblems) {
      for (const sq of problem.subQuestions as any[]) {
        expect(problem.explanation, `${key} / ${sq.id} の目印`).toContain(SQ_MARK(sq.id));
      }
      expect(problem.explanation, `${key} の本文目印`).toContain(SQ_BODY_MARK);
    }
  });

  it('sliceEnhancedBySubQuestion が全小問の解説を取り出せる', () => {
    for (const { key, problem } of allProblems) {
      const slices = sliceEnhancedBySubQuestion(problem.explanation);
      expect(slices, `${key}：解説を切り分けられない`).not.toBeNull();
      for (const sq of problem.subQuestions as any[]) {
        const found = slices!.subs.find((s) => s.id === sq.id);
        expect(found, `${key} / ${sq.id} の解説が見つからない`).toBeTruthy();
        expect(found!.body.trim().length, `${key} / ${sq.id} の解説が空`).toBeGreaterThan(30);
      }
    }
  });

  it('解説に回の移動リンク（◀ 目次／第2回▶）が混ざっていない', () => {
    for (const { key, problem } of allProblems) {
      expect(problem.explanation, key).not.toContain('◀');
      expect(problem.explanation, key).not.toContain('▶');
      expect(problem.explanation, key).not.toContain('目次へ');
    }
  });

  it('解説に表の置換漏れ（[[表n]]／[表]）が無い', () => {
    for (const { key, problem } of allProblems) {
      expect(problem.explanation, key).not.toContain('[[表');
      expect(problem.explanation, key).not.toContain('[表]');
    }
  });
});

describe('地理探究 模擬問題：★画像生成に頼っていない★', () => {
  /**
   * 元データには図を作るための英語プロンプトが埋め込まれていた。
   * 画像は生成しない方針なので、プロンプトが生徒の画面に
   * 漏れていないことを確認する（漏れると英文がそのまま出る）。
   */
  const ENGLISH_PROMPT = [
    'A plain black-and-white',
    'schematic',
    'X axis',
    'solid line',
    'grayscale',
    'Equirectangular projection',
  ];

  it('本文に英語の生成プロンプトが混ざっていない', () => {
    for (const { key, problem } of allProblems) {
      for (const word of ENGLISH_PROMPT) {
        expect(problem.text, `${key} に「${word}」が漏れている`).not.toContain(word);
      }
    }
  });

  it('図の代わりに日本語の説明か表が入っている', () => {
    for (const { key, problem } of allProblems) {
      // 資料の見出しは必ず「**資料1　…**」の形で入っている
      expect(problem.text, `${key} に資料が無い`).toMatch(/\*\*資料\d/);
    }
  });

  it('画像ファイルに依存していない（imageUrl を使っていない）', () => {
    for (const { key, problem } of allProblems) {
      expect((problem as any).imageUrl, `${key}`).toBeUndefined();
    }
  });
});

describe('地理探究 模擬問題：単元と問題が結びついている', () => {
  it('21単元すべてに問題が入っている（id のずれが無い）', () => {
    for (const chapter of examChapters) {
      expect(chapter.practiceProblems.length, `${chapter.id} が空`).toBeGreaterThan(0);
    }
  });

  it('タブは 第1問／第2問／第3問 の3つにまとまる', () => {
    const tabs = new Set(examChapters.map((c) => c.realTitle));
    expect([...tabs].sort()).toEqual(['第1問', '第2問', '第3問']);
  });

  it('各タブに7単元（第1回〜第6回＋予想問題）が並ぶ', () => {
    for (const tab of ['第1問', '第2問', '第3問']) {
      const n = examChapters.filter((c) => c.realTitle === tab).length;
      expect(n, `${tab} の単元数`).toBe(7);
    }
  });

  it('単元名は回の名前から始まる（カードで回を見分けられる）', () => {
    for (const chapter of examChapters) {
      expect(chapter.abstractTitle, chapter.id).toMatch(/^(第\d回|予想問題)\s/);
    }
  });

  /**
   * ★同じ「第1問」タブに2系列が同居するので、カードで見分けが付くこと★
   *   既存の第1問セット（geo_q1_*）も模擬問題（geo_exam_*）も
   *   realTitle が '第1問' なので、同じタブに 5 + 7 = 12 枚のカードが並ぶ。
   *   どちらも「第1回 …」で始まるため、末尾の系列表記が無いと
   *   ユーザーはどちらを開いたのか分からない。
   */
  it('★カード名の末尾で系列（単元演習／模試）が見分けられる★', () => {
    for (const chapter of examChapters) {
      expect(chapter.abstractTitle, `${chapter.id} に系列表記が無い`).toMatch(/（模試）$/);
    }
    const q1 = getAllGeographyChapters().filter((c) => c.id.startsWith('geo_q1_'));
    expect(q1.length, '既存の第1問セットの単元数').toBe(5);
    for (const chapter of q1) {
      expect(chapter.abstractTitle, `${chapter.id} に系列表記が無い`).toMatch(/（単元演習）$/);
    }
  });

  it('同じタブの中でカード名が重複していない', () => {
    const byTab = new Map<string, string[]>();
    for (const chapter of getAllGeographyChapters()) {
      const list = byTab.get(chapter.realTitle) || [];
      list.push(chapter.abstractTitle);
      byTab.set(chapter.realTitle, list);
    }
    for (const [tab, titles] of byTab) {
      expect(new Set(titles).size, `${tab} タブのカード名が重複`).toBe(titles.length);
    }
  });

  it('topics は空でなく、単元ごとに用意されている', () => {
    for (const chapter of examChapters) {
      expect(chapter.topics.length, `${chapter.id} の topics`).toBeGreaterThan(0);
      for (const topic of chapter.topics) {
        expect(topic.trim(), `${chapter.id} に空の topic`).not.toBe('');
      }
    }
  });

  it('単元 id が既存の第1問セット（geo_q1_*）と衝突していない', () => {
    const all = getAllGeographyChapters().map((c) => c.id);
    expect(new Set(all).size, '単元 id の重複').toBe(all.length);
  });
});

describe('地理探究 模擬問題：文字の健全性', () => {
  it('文字化け（置換文字）が無い', () => {
    for (const { key, problem } of allProblems) {
      const whole = `${problem.category}\n${problem.text}\n${problem.explanation}`;
      expect(whole, `${key} に文字化け`).not.toContain('\uFFFD');
    }
  });

  it('本文・解説が空になっている大問が無い', () => {
    for (const { key, problem } of allProblems) {
      expect(problem.text.trim().length, `${key} の本文`).toBeGreaterThan(100);
      expect(problem.explanation.trim().length, `${key} の解説`).toBeGreaterThan(500);
    }
  });
});

import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach } from 'vitest';

import {
  SOLVED_KEY_PREFIX,
  problemKey,
  readSolvedMap,
  markProblemSolved,
  isProblemSolved,
  countSolvedProblems,
  countSolvedProblemsIn,
  countSolvedByChapter,
  backfillLegacyProgress,
  isPlainRecord,
  parseStoredNonNegativeInteger,
  parseStoredStringArrayRecord,
  parseStoredStringRecord,
} from '../src/utils/progress';

/**
 * ===================================================================
 * 学習進捗（大問ベース）の回帰テスト
 * ===================================================================
 * タイトル画面の「学習進捗」が動いていなかった原因は3つあった。
 *   ① 章をやり切ると quiz_run_* / quiz_answers_* が消され、進捗も消えていた
 *   ② mini_test しか数えておらず、174大問のうち153問（演習）が無視されていた
 *   ③ 分母が miniTest の「小問」数、分子が answers のキー数で単位が違っていた
 *
 * ここでは
 *   - 「1点でも取れた大問だけ」を数える仕様
 *   - 一度記録したら消えない（追記のみ）こと
 *   - 章IDと大問IDの組で持つこと（大問IDは章内で重複しうる）
 *   - 旧データからの引き継ぎ
 * を検証する。
 */

// ------------------------------------------------------------------
// localStorage の最小実装（Node には無いため）
// ------------------------------------------------------------------
function installLocalStorage() {
  const store = new Map<string, string>();
  const mock = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, String(v)); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
  (globalThis as any).localStorage = mock;
  return mock;
}

let ls: ReturnType<typeof installLocalStorage>;

beforeEach(() => {
  ls = installLocalStorage();
});

describe('localStorage 復元値の実行時検証', () => {
  it('解答マップは文字列値だけを受け入れる', () => {
    expect(parseStoredStringRecord('{"q1":"ア","q2":""}')).toEqual({ q1: 'ア', q2: '' });
    expect(parseStoredStringRecord('{"q1":42}')).toEqual({});
    expect(parseStoredStringRecord('["ア"]')).toEqual({});
    expect(parseStoredStringRecord('{broken')).toEqual({});
  });

  it('消去マップは文字列配列だけを受け入れる', () => {
    expect(parseStoredStringArrayRecord('{"q1":["ア","イ"]}')).toEqual({ q1: ['ア', 'イ'] });
    expect(parseStoredStringArrayRecord('{"q1":"ア"}')).toEqual({});
    expect(parseStoredStringArrayRecord('{"q1":["ア",2]}')).toEqual({});
    expect(parseStoredStringArrayRecord('null')).toEqual({});
  });

  it('添字は有限・非負の安全な整数に限定し、上限内へ収める', () => {
    expect(parseStoredNonNegativeInteger('3')).toBe(3);
    expect(parseStoredNonNegativeInteger('99', 4)).toBe(4);
    expect(parseStoredNonNegativeInteger('-1')).toBe(0);
    expect(parseStoredNonNegativeInteger('2.5')).toBe(0);
    expect(parseStoredNonNegativeInteger('2abc')).toBe(0);
    expect(parseStoredNonNegativeInteger('Infinity')).toBe(0);
  });

  it('通常のレコードだけを許可し、配列や null を拒否する', () => {
    expect(isPlainRecord({ key: 'value' })).toBe(true);
    expect(isPlainRecord(Object.create(null))).toBe(true);
    expect(isPlainRecord([])).toBe(false);
    expect(isPlainRecord(null)).toBe(false);
  });

  it('App と Quiz が未検証の型キャストや JSON.parse を復元に使わない', () => {
    const app = readFileSync('src/App.tsx', 'utf8');
    const quiz = readFileSync('src/components/Quiz.tsx', 'utf8');

    expect(app).toContain('return isAppState(saved) ? saved');
    expect(app).toContain('return isAppMode(saved) ? saved');
    expect(app).toContain("parseStoredStringRecord(localStorage.getItem('savedQuizAnswers'))");
    expect(app).not.toContain("localStorage.getItem('savedAppState') as AppState");
    expect(app).not.toContain("localStorage.getItem('savedAppMode') as AppMode");

    expect(quiz).toContain('if (!isPlainRecord(parsed)) return emptyRun()');
    expect(quiz).toContain('parseStoredStringRecord(localStorage.getItem(`quiz_answers_');
    expect(quiz).toContain('parseStoredStringArrayRecord(localStorage.getItem(`quiz_elim_');
    expect(quiz).toContain('parseStoredNonNegativeInteger(');
  });
});

describe('進捗キー', () => {
  it('章IDと大問IDの組で一意になる（大問IDは章をまたいで重複しうる）', () => {
    expect(problemKey('c2_1', 'q_c2_1_1')).toBe('c2_1::q_c2_1_1');
    expect(problemKey('c1_1', 'q_c2_1_1')).not.toBe(problemKey('c2_1', 'q_c2_1_1'));
  });

  it('uid ごとに保存先が分かれる（未ログインは guest 扱い）', () => {
    markProblemSolved('uidA', 'c1_1', 'q1', 10);
    markProblemSolved(null, 'c1_1', 'q2', 10);

    expect(countSolvedProblems('uidA')).toBe(1);
    expect(countSolvedProblems('guest')).toBe(1);
    expect(ls.getItem(`${SOLVED_KEY_PREFIX}uidA`)).toBeTruthy();
    expect(ls.getItem(`${SOLVED_KEY_PREFIX}guest`)).toBeTruthy();
  });
});

describe('markProblemSolved：1点でも取れた大問だけを記録する', () => {
  it('1点以上なら記録する', () => {
    expect(markProblemSolved('u', 'c1_1', 'q1', 1)).toBe(true);
    expect(isProblemSolved('u', 'c1_1', 'q1')).toBe(true);
  });

  it('0点・負の点・数値でない値は記録しない', () => {
    expect(markProblemSolved('u', 'c1_1', 'zero', 0)).toBe(false);
    expect(markProblemSolved('u', 'c1_1', 'minus', -5)).toBe(false);
    expect(markProblemSolved('u', 'c1_1', 'nan', Number.NaN)).toBe(false);
    // 有限でない値は「壊れた点数」として弾く（進捗を汚さない）
    expect(markProblemSolved('u', 'c1_1', 'inf', Number.POSITIVE_INFINITY)).toBe(false);
    expect(countSolvedProblems('u')).toBe(0);
  });

  it('空のIDは記録しない', () => {
    expect(markProblemSolved('u', '', 'q1', 100)).toBe(false);
    expect(markProblemSolved('u', 'c1_1', '', 100)).toBe(false);
    expect(countSolvedProblems('u')).toBe(0);
  });

  it('同じ大問を2回解いても二重計上せず、初回時刻を保つ', () => {
    expect(markProblemSolved('u', 'c1_1', 'q1', 50)).toBe(true);
    const first = readSolvedMap('u')[problemKey('c1_1', 'q1')];
    expect(markProblemSolved('u', 'c1_1', 'q1', 999)).toBe(false);
    expect(readSolvedMap('u')[problemKey('c1_1', 'q1')]).toBe(first);
    expect(countSolvedProblems('u')).toBe(1);
  });

  it('一度記録した進捗は run / answers を消しても残る（元の不具合①の再発防止）', () => {
    ls.setItem('quiz_run_c1_1_practice', JSON.stringify({ perQuestion: {} }));
    ls.setItem('quiz_answers_c1_1_practice', JSON.stringify({ s1: 'ア' }));
    markProblemSolved('u', 'c1_1', 'q1', 40);

    // 章を解き終えたときに Quiz.tsx / App.tsx が行う削除を再現する
    ls.removeItem('quiz_run_c1_1_practice');
    ls.removeItem('quiz_answers_c1_1_practice');

    expect(countSolvedProblems('u')).toBe(1);
  });

  it('壊れた保存値でも例外を投げず、空として扱う', () => {
    ls.setItem(`${SOLVED_KEY_PREFIX}u`, '{ぶっ壊れ');
    expect(readSolvedMap('u')).toEqual({});
    expect(countSolvedProblems('u')).toBe(0);
    expect(markProblemSolved('u', 'c1_1', 'q1', 10)).toBe(true);
  });
});

describe('countSolvedByChapter', () => {
  it('章ごとの解答済み大問数を返す', () => {
    markProblemSolved('u', 'c1_1', 'q1', 10);
    markProblemSolved('u', 'c1_1', 'q2', 10);
    markProblemSolved('u', 'c2_1', 'q1', 10);

    expect(countSolvedByChapter('u')).toEqual({ c1_1: 2, c2_1: 1 });
  });
});

/**
 * -------------------------------------------------------------------
 * countSolvedProblemsIn：科目ごとの「何問中何問」を出すための集計
 * -------------------------------------------------------------------
 * ホームの学習進捗を教科別に並べる際、全科目合計の countSolvedProblems を
 * そのまま使うと「化学基礎 174問中 180問」のように分子が分母を超えてしまう。
 * 対象の章に限って数えられることを担保する。
 */
describe('countSolvedProblemsIn：対象の章に限って数える', () => {
  it('指定した章の分だけを数え、他の科目の分は混ぜない', () => {
    // 化学基礎（c*）で3問、化学（発展 a*）で2問解いた状態
    markProblemSolved('u', 'c1_1', 'q1', 10);
    markProblemSolved('u', 'c1_1', 'q2', 10);
    markProblemSolved('u', 'c2_1', 'q1', 10);
    markProblemSolved('u', 'a1_1', 'q1', 10);
    markProblemSolved('u', 'a2_1', 'q1', 10);

    // 全科目合計は5問
    expect(countSolvedProblems('u')).toBe(5);
    // 化学基礎に限れば3問（化学の2問が混ざらない）
    expect(countSolvedProblemsIn('u', ['c1_1', 'c2_1'])).toBe(3);
    // 化学に限れば2問
    expect(countSolvedProblemsIn('u', ['a1_1', 'a2_1'])).toBe(2);
  });

  it('対象の章が空なら 0（分母0の科目でも壊れない）', () => {
    markProblemSolved('u', 'c1_1', 'q1', 10);
    expect(countSolvedProblemsIn('u', [])).toBe(0);
  });

  it('未受講の章を指定しても 0 のまま（存在しない章IDを無視する）', () => {
    markProblemSolved('u', 'c1_1', 'q1', 10);
    expect(countSolvedProblemsIn('u', ['zzz_9'])).toBe(0);
  });

  it('Set でも配列でも同じ結果になる（Iterable を受ける）', () => {
    markProblemSolved('u', 'c1_1', 'q1', 10);
    markProblemSolved('u', 'c1_1', 'q2', 10);
    expect(countSolvedProblemsIn('u', new Set(['c1_1']))).toBe(2);
    expect(countSolvedProblemsIn('u', ['c1_1'])).toBe(2);
  });
});

describe('backfillLegacyProgress：既存ユーザーの履歴を取りこぼさない', () => {
  const chapters = [
    {
      id: 'c1_1',
      miniTest: [{ id: 'm1', subQuestions: [{ id: 'm1_a' }, { id: 'm1_b' }] }],
      practiceProblems: [
        { id: 'p1', subQuestions: [{ id: 'p1_a' }] },
        { id: 'p2', subQuestions: [{ id: 'p2_a' }] },
      ],
    },
    {
      id: 'c1_2',
      miniTest: [{ id: 'm2', subQuestions: [{ id: 'm2_a' }] }],
      practiceProblems: [{ id: 'p3', subQuestions: [{ id: 'p3_a' }] }],
    },
  ];

  it('① quiz_run の perQuestion から、1点以上の大問を復元する', () => {
    ls.setItem('quiz_run_c1_1_practice', JSON.stringify({
      perQuestion: { p1: { finalScore: 120 }, p2: { finalScore: 0 } },
    }));

    const added = backfillLegacyProgress('u', chapters);
    expect(added).toBe(1);
    expect(isProblemSolved('u', 'c1_1', 'p1')).toBe(true);
    expect(isProblemSolved('u', 'c1_1', 'p2')).toBe(false);
  });

  it('② run が消えていても、quiz_answers から小問→大問を辿って復元する', () => {
    ls.setItem('quiz_answers_c1_1_practice', JSON.stringify({ p2_a: 'イ', p1_a: '   ' }));

    backfillLegacyProgress('u', chapters);
    // 解答が入っている p2 は拾い、空白だけの p1 は拾わない
    expect(isProblemSolved('u', 'c1_1', 'p2')).toBe(true);
    expect(isProblemSolved('u', 'c1_1', 'p1')).toBe(false);
  });

  it('③ run も answers も無く completed_ だけ残る章は、章の全大問を復元する', () => {
    ls.setItem('completed_u', JSON.stringify(['c1_2']));

    backfillLegacyProgress('u', chapters);
    expect(isProblemSolved('u', 'c1_2', 'm2')).toBe(true);
    expect(isProblemSolved('u', 'c1_2', 'p3')).toBe(true);
    expect(countSolvedProblems('u')).toBe(2);
  });

  it('mini_test だけでなく practice も対象にする（元の不具合②の再発防止）', () => {
    ls.setItem('quiz_run_c1_1_mini_test', JSON.stringify({ perQuestion: { m1: { finalScore: 90 } } }));
    ls.setItem('quiz_run_c1_1_practice', JSON.stringify({ perQuestion: { p1: { finalScore: 90 } } }));

    backfillLegacyProgress('u', chapters);
    expect(isProblemSolved('u', 'c1_1', 'm1')).toBe(true);
    expect(isProblemSolved('u', 'c1_1', 'p1')).toBe(true);
  });

  it('2回目以降は何もしない（引き継ぎ済みフラグ）', () => {
    ls.setItem('quiz_run_c1_1_practice', JSON.stringify({ perQuestion: { p1: { finalScore: 50 } } }));

    expect(backfillLegacyProgress('u', chapters)).toBe(1);
    expect(backfillLegacyProgress('u', chapters)).toBe(0);
    expect(countSolvedProblems('u')).toBe(1);
  });

  it('引き継ぎが走っても、すでに記録済みの分を二重計上しない', () => {
    markProblemSolved('u', 'c1_1', 'p1', 30);
    ls.setItem('quiz_run_c1_1_practice', JSON.stringify({ perQuestion: { p1: { finalScore: 50 } } }));

    backfillLegacyProgress('u', chapters);
    expect(countSolvedProblems('u')).toBe(1);
  });

  it('壊れた旧データがあっても例外を投げない', () => {
    ls.setItem('quiz_run_c1_1_practice', 'not json');
    ls.setItem('quiz_answers_c1_1_practice', '{{{');
    ls.setItem('completed_u', 'nope');

    expect(() => backfillLegacyProgress('u', chapters)).not.toThrow();
  });
});

describe('画面側の結線（進捗が実際に記録・表示されるか）', () => {
  it('Quiz.tsx が採点直後に markProblemSolved を呼んでいる', () => {
    const src = readFileSync('src/components/Quiz.tsx', 'utf8');
    expect(src).toContain("from '../utils/progress'");
    expect(src).toMatch(/markProblemSolved\(\s*uid,\s*chapter\.id,\s*currentQuestion\.id,\s*boostedScore\s*\)/);

    // saveRun より後（＝採点が確定した後）に書いていること
    expect(src.indexOf('markProblemSolved(uid')).toBeGreaterThan(
      src.indexOf('saveRun(chapter.id, mode, nextRun)'),
    );
  });

  it('Home.tsx が大問ベースの分母（miniTest＋practiceProblems）を使っている', async () => {
    const src = readFileSync('src/components/Home.tsx', 'utf8');
    expect(src).toContain("from '../utils/progress'");
    // 科目ごとに数える版を使う（全科目合計の countSolvedProblems ではない）
    expect(src).toContain('countSolvedProblemsIn');
    expect(src).toContain('backfillLegacyProgress');

    // 分母を数える式そのものは data/problemCount.ts に集約したため、
    // 「Home.tsx に c.practiceProblems?.length と書いてあるか」という
    // 文字列検査では意図（＝分母が「ミニテスト＋演習」であること）を守れなくなった。
    // 代わりに (1) Home.tsx がその共通関数を使っていること、
    //         (2) その共通関数が実際に両方を足していること、の2点を見る。
    expect(src).toContain('countProblemsInChapters');
    const { countChapterProblems } = await import('../src/data/problemCount');
    // ミニテストだけ・演習だけ・両方、いずれも正しく数えること
    expect(countChapterProblems({ miniTest: [1, 2, 3] })).toBe(3);
    expect(countChapterProblems({ practiceProblems: [1, 2] })).toBe(2);
    expect(countChapterProblems({ miniTest: [1, 2, 3], practiceProblems: [1, 2] })).toBe(5);

    // 旧実装（mini_test の answers を数える）が残っていないこと
    expect(src).not.toContain('quiz_answers_${c.id}_mini_test');
  });

  it('Home.tsx が教科ごとの進捗バーを出している（化学基礎と化学を並べる）', async () => {
    const src = readFileSync('src/components/Home.tsx', 'utf8');
    // 科目ID → { solved, total } を持ち、ループで並べていること
    expect(src).toContain('subjectProgressDefs');
    expect(src).toContain('subjectProgress');
    expect(src).toMatch(/subjectProgressDefs\.map\(/);
    // 全科目合計で分母を割る旧実装（単一の progressPercent）が残っていないこと
    expect(src).not.toMatch(/const progressPercent\s*=/);

    // 科目の定義そのものは data/allChapters.ts の SUBJECTS に集約したため、
    // 「Home.tsx に getAllAdvancedChapters と書いてあるか」という文字列検査では
    // 意図（＝化学基礎と化学が別々の進捗バーとして並ぶこと）を守れなくなった。
    // 代わりに、進捗バーの元になるデータを実際に見て確認する。
    const { SUBJECTS, getChaptersOfSubject } = await import('../src/data/allChapters');
    const ids = SUBJECTS.map((s) => s.id);
    expect(ids).toContain('chemistry_basic');
    expect(ids).toContain('chemistry');

    // それぞれ中身のある別々の章一覧であること（同じものを2本並べていない）
    const basic = getChaptersOfSubject('chemistry_basic');
    const advanced = getChaptersOfSubject('chemistry');
    expect(basic.length).toBeGreaterThan(0);
    expect(advanced.length).toBeGreaterThan(0);
    expect(basic[0]).not.toBe(advanced[0]);

    // 化学の章一覧は各教科ファイルの取り出し関数と一致していること
    const { getAllAdvancedChapters } = await import('../src/data/chemistryAdvancedData');
    expect(advanced.length).toBe((getAllAdvancedChapters() as any[]).length);
  });

  it('問題が0件の科目は「大問 0/0 問 (0%)」ではなく「準備中」と出す', () => {
    // 問題データが0件の科目で分母0のまま数字を出すと不具合に見えるため、
    // 「問題を準備中」という文言で伝える。
    // （化学（発展）は演習問題の収録が始まったので、この分岐は
    //  今後追加される他科目のための安全網として残している。）
    const src = readFileSync('src/components/Home.tsx', 'utf8');
    expect(src).toContain('const isEmpty = p.total === 0');
    expect(src).toContain('問題を準備中');
    // 分母0でゼロ除算せず 0% に落ちること（NaN% を出さない）
    expect(src).toMatch(/p\.total > 0 \? Math\.round\(\(p\.solved \/ p\.total\) \* 100\) : 0/);
  });

  it('化学（発展）は演習問題20問が進捗の分母に入る', async () => {
    // 出典テキスト『化学の道しるべ 理論化学 ～化学反応と熱・光エネルギー編～』の
    // 演習1〜20 を「問題」として収録したため、化学（発展）の分母は 0 ではなく 20。
    // まとめプリントに載せただけで問題側に入っていない、という退行を防ぐ。
    const { getAllAdvancedChapters } = await import('../src/data/chemistryAdvancedData');
    const chapters = getAllAdvancedChapters() as any[];
    expect(chapters.length).toBeGreaterThan(0); // 章立ては存在する
    const total = chapters.reduce(
      (sum: number, c: any) => sum + (c.miniTest?.length || 0) + (c.practiceProblems?.length || 0),
      0,
    );
    expect(total).toBe(20);

    // 収録済みの単元だけに問題がぶら下がっている（他は枠のみ）
    const withProblems = chapters.filter((c) => (c.practiceProblems?.length || 0) > 0).map((c) => c.id);
    expect(withProblems.sort()).toEqual(['a1_1', 'a3_1', 'a3_2', 'a3_3', 'a3_4']);
  });

  it('総大問数が 174 問（実データと一致）', async () => {
    const { chemistryData } = await import('../src/data/chemistryData');
    const chapters = (chemistryData as any).parts.flatMap((p: any) => p.chapters);
    const total = chapters.reduce(
      (sum: number, c: any) => sum + (c.miniTest?.length || 0) + (c.practiceProblems?.length || 0),
      0,
    );
    expect(total).toBe(174);
  });
});

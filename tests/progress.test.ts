import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach } from 'vitest';

import {
  SOLVED_KEY_PREFIX,
  problemKey,
  readSolvedMap,
  markProblemSolved,
  isProblemSolved,
  countSolvedProblems,
  countSolvedByChapter,
  backfillLegacyProgress,
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

  it('Home.tsx が大問ベースの分母（miniTest＋practiceProblems）を使っている', () => {
    const src = readFileSync('src/components/Home.tsx', 'utf8');
    expect(src).toContain("from '../utils/progress'");
    expect(src).toContain('countSolvedProblems');
    expect(src).toContain('backfillLegacyProgress');
    expect(src).toContain('c.practiceProblems?.length');

    // 旧実装（mini_test の answers を数える）が残っていないこと
    expect(src).not.toContain('quiz_answers_${c.id}_mini_test');
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

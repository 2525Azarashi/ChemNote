/**
 * ===================================================================
 * 化学（発展）演習問題の回帰テスト
 * ===================================================================
 *
 * 何を守るテストか
 * ----------------
 * 出典テキスト『化学の道しるべ 理論化学 ～化学反応と熱・光エネルギー編～』
 * の 演習1〜演習20 は、まとめプリント（LearningViewer）に載せるだけでなく
 * **アプリの「問題」として解ける状態** でなければならない、という要件がある。
 *
 * ところが chemistryAdvancedData.ts は「全分野の単元の枠」を持つ骨格ファイルで、
 * 章は practiceProblems: [] を既定値として作られる。
 * 問題データの流し込み（ADVANCED_PROBLEMS）が外れたり、章IDのタイポで
 * どこにも刺さらなくなったりしても、画面はエラーにならず
 * 「単元はあるのに問題が0問」という静かな事故になる。
 *
 * このテストは
 *   ・演習1〜20 が漏れなく章にぶら下がっていること
 *   ・Quiz / Explanation が要求するフィールドが揃っていること
 *   ・解説が enhanceExplanation で整形され、小問ごとに中身が出ること
 *   ・大学名などの出典表記が消えていないこと
 * を機械的に固定する。
 */
import { describe, it, expect } from 'vitest';
import {
  chemistryAdvancedData,
  getAllAdvancedChapters,
  getAdvancedFieldStats,
} from '../src/data/chemistryAdvancedData';
import { chemistryData } from '../src/data/chemistryData';
import { getUnitTeaching } from '../src/data/unitTeaching';
import {
  sliceEnhancedBySubQuestion,
  sliceEnhancedByQuestion,
  questionGroupKey,
} from '../src/utils/explanationFormat';

/** 演習問題を収録した章のID（教科書の並び順） */
const PROBLEM_CHAPTER_IDS = ['a1_1', 'a3_1', 'a3_2', 'a3_3', 'a3_4'] as const;

/** 章IDごとに収録している演習番号（PDF の 演習N と対応） */
const EXPECTED_DRILLS: Record<string, number[]> = {
  a1_1: [1],
  a3_1: [2, 3, 4, 5, 6, 7, 9, 14, 19],
  a3_2: [8, 11, 12, 13, 15],
  a3_3: [10, 16, 17, 18],
  a3_4: [20],
};

const chaptersById = new Map(getAllAdvancedChapters().map((c) => [c.id, c]));

/** 演習問題を持つ全大問（章IDつき） */
const allProblems = PROBLEM_CHAPTER_IDS.flatMap((id) =>
  (chaptersById.get(id)?.practiceProblems ?? []).map((p: any) => ({ chapterId: id, problem: p })),
);

/** Explanation.tsx の sliceForSq と同じ手順で、小問ぶんの解説を切り出す */
function sliceForSq(enhanced: string, sq: any): string {
  const sub = sliceEnhancedBySubQuestion(enhanced);
  if (sub) {
    const key = String(sq?.id ?? '');
    const hit = sub.subs.filter((x) => x.id === key);
    if (hit.length > 0) {
      return [hit.map((x) => x.body).join('\n'), sub.shared].filter((t) => t.trim()).join('\n');
    }
    if (sub.shared.trim()) return sub.shared;
  }
  const qs = sliceEnhancedByQuestion(enhanced);
  if (!qs) return '';
  const key = questionGroupKey(sq?.label);
  if (!key) return '';
  return qs.groups
    .filter((g) => g.key === key)
    .map((g) => g.text)
    .join('\n');
}

describe('化学（発展）演習問題の収録', () => {
  it('PDF の演習1〜20 がすべて「問題」として収録されている', () => {
    expect(allProblems).toHaveLength(20);

    // 大問テキストの先頭「演習N」から番号を拾い、1〜20 が漏れなく揃うことを見る
    const numbers = allProblems
      .map(({ problem }) => /^演習\s*(\d+)/.exec(String(problem.text))?.[1])
      .filter(Boolean)
      .map(Number)
      .sort((a, b) => a - b);
    expect(numbers).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  it('演習問題が想定どおりの単元にぶら下がっている', () => {
    for (const [chapterId, drills] of Object.entries(EXPECTED_DRILLS)) {
      const chapter = chaptersById.get(chapterId);
      expect(chapter, `章 ${chapterId} が存在しない`).toBeDefined();
      const numbers = (chapter!.practiceProblems as any[])
        .map((p) => Number(/^演習\s*(\d+)/.exec(String(p.text))?.[1]))
        .sort((a, b) => a - b);
      expect(numbers).toEqual([...drills].sort((a, b) => a - b));
    }
  });

  it('問題を収録していない単元は空配列のまま（枠だけ先行させている）', () => {
    const withProblems = getAllAdvancedChapters()
      .filter((c) => c.practiceProblems.length > 0)
      .map((c) => c.id);
    expect(withProblems.sort()).toEqual([...PROBLEM_CHAPTER_IDS].sort());
  });

  it('理論化学の収録問題数として集計される（単元選択のカード表示）', () => {
    expect(getAdvancedFieldStats('theoretical').questions).toBe(20);
    expect(getAdvancedFieldStats('inorganic').questions).toBe(0);
    expect(getAdvancedFieldStats('organic').questions).toBe(0);
  });
});

describe('化学（発展）演習問題のデータ形式', () => {
  it('大問IDが一意で、化学基礎のIDと衝突しない', () => {
    const ids = allProblems.map(({ problem }) => problem.id);
    expect(new Set(ids).size).toBe(ids.length);

    const basicIds = new Set(
      chemistryData.parts
        .flatMap((p: any) => p.chapters || [])
        .flatMap((c: any) => [...(c.practiceProblems || []), ...(c.miniTest || [])])
        .map((p: any) => p.id),
    );
    for (const id of ids) expect(basicIds.has(id)).toBe(false);
  });

  it('Explanation.tsx が参照する category が全問に入っている', () => {
    for (const { problem } of allProblems) {
      expect(typeof problem.category, `${problem.id} の category`).toBe('string');
      expect(problem.category.length).toBeGreaterThan(0);
    }
  });

  it('小問は id / label / type / correctAnswer を持つ', () => {
    for (const { problem } of allProblems) {
      expect(Array.isArray(problem.subQuestions)).toBe(true);
      expect(problem.subQuestions.length).toBeGreaterThan(0);
      for (const sq of problem.subQuestions) {
        expect(typeof sq.id, `${problem.id} の小問 id`).toBe('string');
        expect(sq.id.startsWith(problem.id)).toBe(true);
        expect(String(sq.label).length).toBeGreaterThan(0);
        expect(typeof sq.type).toBe('string');
        // 採点と【解答】カードの生成に必須
        expect(String(sq.correctAnswer ?? '').trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('小問IDが全体で一意（アコーディオンの切り出しキーになる）', () => {
    const sqIds = allProblems.flatMap(({ problem }) =>
      problem.subQuestions.map((sq: any) => sq.id),
    );
    expect(new Set(sqIds).size).toBe(sqIds.length);
  });

  it('Quiz.tsx が描き分けられる type だけを使っている', () => {
    const supported = new Set([
      'short_answer',
      'multiple_choice',
      'descriptive',
      'select',
      'sorting',
      'true_false',
      'group',
    ]);
    for (const { problem } of allProblems) {
      for (const sq of problem.subQuestions) {
        expect(supported.has(sq.type), `${sq.id} の type=${sq.type}`).toBe(true);
      }
    }
  });

  it('選択式の小問には options が付いている', () => {
    for (const { problem } of allProblems) {
      for (const sq of problem.subQuestions) {
        if (sq.type === 'multiple_choice' || sq.type === 'select') {
          expect(Array.isArray(sq.options), `${sq.id} の options`).toBe(true);
          expect(sq.options.length).toBeGreaterThan(1);
        }
      }
    }
  });
});

describe('化学（発展）演習問題の解説', () => {
  it('enhanceExplanation で整形済み（解答カードが生成されている）', () => {
    for (const { problem } of allProblems) {
      const text: string = problem.explanationSupplement || problem.explanation;
      expect(text.startsWith('<!--fmt-v1-->'), `${problem.id} が未整形`).toBe(true);
      expect(text).toContain('解 答');
    }
  });

  it('単元ごとの出題傾向ボックスが解説に入っている', () => {
    for (const { problem } of allProblems) {
      const text: string = problem.explanationSupplement || problem.explanation;
      expect(text, `${problem.id}`).toContain('ココが狙われる');
    }
  });

  it('収録した5単元すべてに指導テンプレート（思考の型）がある', () => {
    for (const id of PROBLEM_CHAPTER_IDS) {
      const teaching = getUnitTeaching(id);
      expect(teaching, `${id} の unitTeaching`).toBeDefined();
      expect(teaching!.steps.length).toBeGreaterThanOrEqual(3);
      expect(teaching!.trend.sources.length).toBeGreaterThan(0);
      expect(teaching!.trend.asked.length).toBeGreaterThan(0);
      expect(teaching!.trend.traps.length).toBeGreaterThan(0);
      expect(teaching!.trend.advice.length).toBeGreaterThan(0);
    }
  });

  it('小問アコーディオンを開けば必ず中身が出る（空にならない）', () => {
    for (const { problem } of allProblems) {
      const text: string = problem.explanationSupplement || problem.explanation;
      const subs = problem.subQuestions.filter(Boolean);
      // 小問1つの大問は解説全体が1問ぶんなので対象外（verify スクリプトと同じ基準）
      if (subs.length < 2) continue;
      for (const sq of subs) {
        expect(sliceForSq(text, sq).trim().length, `${sq.id} の解説が空`).toBeGreaterThan(0);
      }
    }
  });

  it('禁止スタイル（<u> による黄色マーカー）を使っていない', () => {
    for (const { problem } of allProblems) {
      const text: string = problem.explanationSupplement || problem.explanation;
      expect(/<u>/i.test(text), `${problem.id}`).toBe(false);
    }
  });
});

describe('化学（発展）演習問題の出典表記', () => {
  it('大学名などの出典が問題文に残っている', () => {
    const texts = allProblems.map(({ problem }) => String(problem.text)).join('\n');
    for (const source of [
      '東京大',
      '同志社大',
      '三重大',
      '慶応義塾大',
      '東京理科大',
      '龍谷大学',
      '明治薬大',
      '愛知工大',
      'センター試験',
    ]) {
      expect(texts, `出典「${source}」が消えている`).toContain(source);
    }
  });

  it('章の並び順は教科書順のまま（3章の小単元が①〜④で並ぶ）', () => {
    const third = getAllAdvancedChapters()
      .filter((c) => c.id.startsWith('a3_'))
      .map((c) => c.abstractTitle);
    expect(third).toEqual([
      '① 反応エンタルピー',
      '② ヘスの法則',
      '③ 結合エネルギー',
      '④ 光とエネルギー',
    ]);
  });
});

describe('化学（発展）のデータ整合', () => {
  it('parts → chapters を辿って重複した章IDがない', () => {
    const ids = chemistryAdvancedData.parts.flatMap((p) => p.chapters.map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

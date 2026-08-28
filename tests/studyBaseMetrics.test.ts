import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

import {
  collectStudyDays,
  countActiveDaysWithin,
  summarizeReviewDiscipline,
  calcEngagementScore,
  buildStudyBaseMetrics,
  buildStudentSummary,
} from '../src/utils/studySummary';
import { buildAttitudeEvidence } from '../src/utils/kantenReport';
import type { SolvedMap } from '../src/utils/studySyncCore';
import type { ReviewItem } from '../src/utils/reviewList';

/**
 * ===================================================================
 * 学習の基礎指標（buildStudyBaseMetrics）のテスト
 * ===================================================================
 *
 * これは「振る舞いを変えないための」テストである（characterization test）。
 *
 * 目的：
 *   studySummary.ts の buildStudentSummary と
 *   kantenReport.ts  の buildAttitudeEvidence に
 *   まったく同じ順序で書かれていた5指標の導出を1つにまとめた。
 *   その結果、**先生に見える数値が1つも変わっていない**ことを保証する。
 *
 * やり方：
 *   まとめる前のコードを legacy〜 として下に写しておき、
 *   「新しい共通関数の結果 === 写した昔のコードの結果」を突き合わせる。
 *   数値がずれたらこのテストが落ちるので、
 *   評価材料の数字が静かに変わってしまう事故を防げる。
 *
 * ⚠️ 評価に使われる数値なので、ここは特に厳しく見る。
 *    同じ生徒がダッシュボードとレポートで違う点数に見えるのは
 *    絶対に避けなければならない。
 */

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date('2026-08-20T12:00:00').getTime();
const MASTERED_BOX = 6;

function reviewItem(overrides: Partial<ReviewItem> = {}): ReviewItem {
  return {
    key: 'c1::q1::a',
    chapterId: 'c1',
    questionId: 'q1',
    subQuestionId: 'a',
    box: 0,
    dueAt: 0,
    wrongCount: 0,
    correctCount: 0,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

// ===================================================================
// まとめる前のコード（buildStudentSummary の中身をそのまま写したもの）
// ===================================================================
// ★ここは意図的に「昔のまま」にしている。直してはいけない★
// 新しい共通関数と突き合わせる基準なので、
// ここを新しい書き方に合わせてしまうと比較の意味が失われる。
function legacyFromStudentSummary(
  solved: SolvedMap | null | undefined,
  reviewItems: ReviewItem[] | null | undefined,
  masteredBox: number,
  now: number,
) {
  const studyDays = collectStudyDays(solved, reviewItems);
  const review = summarizeReviewDiscipline(reviewItems, masteredBox, now);
  const activeDaysIn14 = countActiveDaysWithin(studyDays, 14, now);

  return {
    activeDaysIn14,
    lastStudiedAt: studyDays.length > 0 ? studyDays[studyDays.length - 1] : null,
    review,
    engagement: calcEngagementScore({
      activeDaysIn14,
      recoveryRate: review.recoveryRate,
      overdue: review.overdue,
      reviewTotal: review.total,
    }),
  };
}

// ===================================================================
// まとめる前のコード（buildAttitudeEvidence の中身をそのまま写したもの）
// ===================================================================
// ★上の legacyFromStudentSummary と1文字ずつ同じ本文である★
// （元のファイルではコメントだけが違い、コードは完全に一致していた。
//   それが「まとめてよい」と判断した根拠なので、2つ別々に写している。）
function legacyFromAttitudeEvidence(
  solved: SolvedMap | null | undefined,
  reviewItems: ReviewItem[] | null | undefined,
  masteredBox: number,
  now: number,
) {
  const studyDays = collectStudyDays(solved, reviewItems);
  const review = summarizeReviewDiscipline(reviewItems, masteredBox, now);
  const activeDaysIn14 = countActiveDaysWithin(studyDays, 14, now);

  return {
    activeDaysIn14,
    totalStudyDays: studyDays.length,
    lastStudiedAt: studyDays.length > 0 ? studyDays[studyDays.length - 1] : null,
    review,
    engagement: calcEngagementScore({
      activeDaysIn14,
      recoveryRate: review.recoveryRate,
      overdue: review.overdue,
      reviewTotal: review.total,
    }),
  };
}

// ===================================================================
// 検証に使う入力（現実に起こりうる形をひととおり）
// ===================================================================
interface Case {
  name: string;
  solved: SolvedMap | null | undefined;
  items: ReviewItem[] | null | undefined;
}

const CASES: Case[] = [
  {
    name: 'よく復習している生徒',
    solved: {
      'c1::q1': NOW - 1 * DAY,
      'c1::q2': NOW - 2 * DAY,
      'c2::q1': NOW - 5 * DAY,
      'c3::q1': NOW - 20 * DAY,
    },
    items: [
      reviewItem({ key: 'a', box: 6, wrongCount: 2, correctCount: 3, updatedAt: NOW - 1 * DAY }),
      reviewItem({ key: 'b', box: 3, wrongCount: 1, correctCount: 1, updatedAt: NOW - 3 * DAY }),
      reviewItem({ key: 'c', box: 1, wrongCount: 4, correctCount: 1, dueAt: NOW - 2 * DAY }),
    ],
  },
  {
    name: '期限切れを放置している生徒',
    solved: { 'c1::q1': NOW - 30 * DAY },
    items: [
      reviewItem({ key: 'a', box: 0, wrongCount: 5, correctCount: 0, dueAt: NOW - 10 * DAY }),
      reviewItem({ key: 'b', box: 0, wrongCount: 3, correctCount: 0, dueAt: NOW - 9 * DAY }),
    ],
  },
  {
    name: 'まだ何もしていない生徒（空）',
    solved: {},
    items: [],
  },
  {
    name: 'データが null の生徒',
    solved: null,
    items: null,
  },
  {
    name: 'データが undefined の生徒',
    solved: undefined,
    items: undefined,
  },
  {
    name: '進捗だけあって復習が無い生徒',
    solved: { 'c1::q1': NOW - 1 * DAY, 'c1::q2': NOW - 1 * DAY },
    items: [],
  },
  {
    name: '復習だけあって進捗が無い生徒',
    solved: {},
    items: [reviewItem({ key: 'a', box: 2, wrongCount: 2, correctCount: 2, updatedAt: NOW - 4 * DAY })],
  },
  {
    name: '毎日やっている生徒（継続が満点になる）',
    solved: Object.fromEntries(
      Array.from({ length: 14 }, (_, i) => [`c1::q${i}`, NOW - i * DAY]),
    ),
    items: [reviewItem({ key: 'a', box: 6, wrongCount: 1, correctCount: 1, updatedAt: NOW })],
  },
  {
    name: '壊れた値が混ざっている場合',
    solved: { 'c1::q1': Number.NaN, 'c1::q2': NOW - 1 * DAY },
    items: [
      reviewItem({ key: 'a', box: Number.NaN as unknown as number, wrongCount: Number.NaN as unknown as number }),
      reviewItem({ key: 'b', box: 6, wrongCount: 2, correctCount: 2 }),
    ],
  },
];

// ===================================================================
// 前提の確認：まとめてよかったのか
// ===================================================================
describe('前提：2か所に写されていた計算は本当に同じだったのか', () => {
  /**
   * ★これが「まとめてよい」という許可そのもの★
   * 2つの昔のコードを互いに突き合わせる。
   * ここが落ちるなら振る舞いが違っていたということなので、
   * まとめてはいけない（＝この作業自体が間違い）。
   */
  it.each(CASES.map((c) => [c.name, c] as const))(
    '%s：昔の2つのコードが同じ結果を出す',
    (_name, testCase) => {
      const a = legacyFromStudentSummary(testCase.solved, testCase.items, MASTERED_BOX, NOW);
      const b = legacyFromAttitudeEvidence(testCase.solved, testCase.items, MASTERED_BOX, NOW);

      expect(a.activeDaysIn14).toEqual(b.activeDaysIn14);
      expect(a.lastStudiedAt).toEqual(b.lastStudiedAt);
      expect(a.review).toEqual(b.review);
      expect(a.engagement).toEqual(b.engagement);
    },
  );
});

// ===================================================================
// 共通関数が昔のコードと一致すること
// ===================================================================
describe('buildStudyBaseMetrics は昔のコードと同じ結果を出す', () => {
  it.each(CASES.map((c) => [c.name, c] as const))(
    '%s：ダッシュボード側の昔のコードと一致',
    (_name, testCase) => {
      const now = buildStudyBaseMetrics(testCase.solved, testCase.items, MASTERED_BOX, NOW);
      const legacy = legacyFromStudentSummary(testCase.solved, testCase.items, MASTERED_BOX, NOW);

      expect(now.activeDaysIn14).toEqual(legacy.activeDaysIn14);
      expect(now.lastStudiedAt).toEqual(legacy.lastStudiedAt);
      expect(now.review).toEqual(legacy.review);
      expect(now.engagement).toEqual(legacy.engagement);
    },
  );

  it.each(CASES.map((c) => [c.name, c] as const))(
    '%s：観点別レポート側の昔のコードと一致（studyDays の数も）',
    (_name, testCase) => {
      const now = buildStudyBaseMetrics(testCase.solved, testCase.items, MASTERED_BOX, NOW);
      const legacy = legacyFromAttitudeEvidence(testCase.solved, testCase.items, MASTERED_BOX, NOW);

      expect(now.studyDays.length).toEqual(legacy.totalStudyDays);
      expect(now.activeDaysIn14).toEqual(legacy.activeDaysIn14);
      expect(now.lastStudiedAt).toEqual(legacy.lastStudiedAt);
      expect(now.review).toEqual(legacy.review);
      expect(now.engagement).toEqual(legacy.engagement);
    },
  );

  it('最終学習日は「学習した日のいちばん最後」を返す', () => {
    const solved = { 'c1::q1': NOW - 5 * DAY, 'c1::q2': NOW - 1 * DAY };
    const result = buildStudyBaseMetrics(solved, [], MASTERED_BOX, NOW);
    expect(result.lastStudiedAt).toBe(result.studyDays[result.studyDays.length - 1]);
  });

  it('記録が無ければ最終学習日は null（0 や空文字にしない）', () => {
    const result = buildStudyBaseMetrics(null, null, MASTERED_BOX, NOW);
    expect(result.studyDays).toEqual([]);
    expect(result.lastStudiedAt).toBeNull();
  });

  it('同じ入力なら何回呼んでも同じ結果（副作用がない）', () => {
    const solved = { 'c1::q1': NOW - 1 * DAY };
    const items = [reviewItem({ box: 3, wrongCount: 2, correctCount: 1 })];
    const first = buildStudyBaseMetrics(solved, items, MASTERED_BOX, NOW);
    const second = buildStudyBaseMetrics(solved, items, MASTERED_BOX, NOW);
    expect(second).toEqual(first);
  });

  it('渡された復習リストを書き換えない', () => {
    const items = [reviewItem({ box: 3, wrongCount: 2, correctCount: 1 })];
    const snapshot = JSON.stringify(items);
    buildStudyBaseMetrics({}, items, MASTERED_BOX, NOW);
    expect(JSON.stringify(items)).toBe(snapshot);
  });
});

// ===================================================================
// 呼び出し側（先生に見える2つの出口）が変わっていないこと
// ===================================================================
describe('呼び出し側の出口が変わっていない', () => {
  it.each(CASES.map((c) => [c.name, c] as const))(
    '%s：buildStudentSummary の中身が昔のコードと一致',
    (_name, testCase) => {
      const summary = buildStudentSummary({
        uid: 'u1',
        displayName: 'テスト生徒',
        solved: testCase.solved,
        reviewItems: testCase.items,
        masteredBox: MASTERED_BOX,
        now: NOW,
      });
      const legacy = legacyFromStudentSummary(testCase.solved, testCase.items, MASTERED_BOX, NOW);

      // 共通化した5指標
      expect(summary.activeDaysIn14).toEqual(legacy.activeDaysIn14);
      expect(summary.lastStudiedAt).toEqual(legacy.lastStudiedAt);
      expect(summary.review).toEqual(legacy.review);
      expect(summary.engagement).toEqual(legacy.engagement);
      // この関数だけが持つ項目（まとめていない部分）
      expect(summary.uid).toBe('u1');
      expect(summary.displayName).toBe('テスト生徒');
      expect(summary.solvedTotal).toBe(testCase.solved ? Object.keys(testCase.solved).length : 0);
    },
  );

  it.each(CASES.map((c) => [c.name, c] as const))(
    '%s：buildAttitudeEvidence の中身が昔のコードと一致',
    (_name, testCase) => {
      const evidence = buildAttitudeEvidence(testCase.solved, testCase.items, MASTERED_BOX, NOW);
      const legacy = legacyFromAttitudeEvidence(testCase.solved, testCase.items, MASTERED_BOX, NOW);

      expect(evidence.activeDaysIn14).toEqual(legacy.activeDaysIn14);
      expect(evidence.totalStudyDays).toEqual(legacy.totalStudyDays);
      expect(evidence.lastStudiedAt).toEqual(legacy.lastStudiedAt);
      expect(evidence.review).toEqual(legacy.review);
      expect(evidence.engagement).toEqual(legacy.engagement);
    },
  );

  /**
   * ★これがいちばん大事★
   * 同じ生徒について、ダッシュボードと観点別レポートが
   * 同じ「取り組み度」「復習状況」を出すこと。
   * ここがずれると先生が判断できなくなる。
   */
  it.each(CASES.map((c) => [c.name, c] as const))(
    '%s：ダッシュボードと観点別レポートの数値が一致する',
    (_name, testCase) => {
      const summary = buildStudentSummary({
        uid: 'u1',
        displayName: 'テスト生徒',
        solved: testCase.solved,
        reviewItems: testCase.items,
        masteredBox: MASTERED_BOX,
        now: NOW,
      });
      const evidence = buildAttitudeEvidence(testCase.solved, testCase.items, MASTERED_BOX, NOW);

      expect(evidence.engagement).toEqual(summary.engagement);
      expect(evidence.review).toEqual(summary.review);
      expect(evidence.activeDaysIn14).toEqual(summary.activeDaysIn14);
      expect(evidence.lastStudiedAt).toEqual(summary.lastStudiedAt);
    },
  );

  it('buildAttitudeEvidence 独自の項目（粘り強さ）は残っている', () => {
    const items = [
      reviewItem({ key: 'a', box: 6, wrongCount: 3, correctCount: 3 }),
      reviewItem({ key: 'b', box: 6, wrongCount: 0, correctCount: 1 }),
      reviewItem({ key: 'c', box: 2, wrongCount: 4, correctCount: 1 }),
    ];
    const evidence = buildAttitudeEvidence({}, items, MASTERED_BOX, NOW);
    // 「間違えたのに定着まで持っていった」= box>=6 かつ wrongCount>0 → a だけ
    expect(evidence.recoveredToMastery).toBe(1);
  });
});

// ===================================================================
// 構造の見張り（また同じ重複が生えないように）
// ===================================================================
describe('構造の見張り', () => {
  const summarySrc = readFileSync('src/utils/studySummary.ts', 'utf8');
  const kantenSrc = readFileSync('src/utils/kantenReport.ts', 'utf8');

  it('2つの呼び出し側はどちらも共通関数を使っている', () => {
    expect(summarySrc).toContain('buildStudyBaseMetrics');
    expect(kantenSrc).toContain('buildStudyBaseMetrics');
  });

  it('土台の計算は共通関数の中だけにある（呼び出し側に写し戻されていない）', () => {
    // 5指標の導出の目印。共通関数の中に1回だけ出るのが正しい状態。
    const marker = /countActiveDaysWithin\(studyDays, 14, now\)/g;
    expect(summarySrc.match(marker) ?? []).toHaveLength(1);
    // kantenReport 側には土台の計算そのものが残っていない
    expect(kantenSrc).not.toMatch(marker);
    expect(kantenSrc).not.toContain('calcEngagementScore({');
  });

  it('計算の置き場所は utils のまま（data や components に依存していない）', () => {
    expect(summarySrc).not.toMatch(/from '\.\.\/components\//);
    expect(summarySrc).not.toMatch(/from '\.\.\/data\//);
  });
});

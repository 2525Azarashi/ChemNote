import { describe, it, expect } from 'vitest';

import {
  toDateKey,
  startOfDay,
  collectStudyDays,
  countActiveDaysWithin,
  summarizeReviewDiscipline,
  buildChapterProgressRows,
  calcEngagementScore,
  buildStudentSummary,
  escapeCsvCell,
  buildStudentCsv,
  buildChapterCsv,
  STUDENT_CSV_HEADERS,
} from '../src/utils/studySummary';
import type { ReviewItem } from '../src/utils/reviewList';

/**
 * ===================================================================
 * 学習サマリー（先生ダッシュボード／観点別評価の材料）のテスト
 * ===================================================================
 * 「主体的に学習に取り組む態度」の評価材料を出すのが目的なので、
 *   - 生徒が不当に低く評価されないこと
 *   - 数字が根拠を伴うこと（内訳が出ること）
 * を重点的に検証する。
 */

const DAY = 24 * 60 * 60 * 1000;

function makeItem(overrides: Partial<ReviewItem> = {}): ReviewItem {
  return {
    key: 'c1_1::q1::s1',
    chapterId: 'c1_1',
    questionId: 'q1',
    subQuestionId: 's1',
    box: 0,
    dueAt: 0,
    wrongCount: 0,
    correctCount: 0,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

describe('学習した日の集計', () => {
  it('進捗と復習の両方から学習日を拾う', () => {
    const now = new Date(2026, 0, 15, 10, 0, 0).getTime();
    const yesterday = now - DAY;

    const days = collectStudyDays({ 'c1_1::q1': now }, [makeItem({ updatedAt: yesterday })]);

    expect(days).toHaveLength(2);
    expect(days).toContain(toDateKey(now));
    expect(days).toContain(toDateKey(yesterday));
  });

  it('同じ日に何問解いても1日として数える', () => {
    const now = new Date(2026, 0, 15, 9, 0, 0).getTime();
    const later = new Date(2026, 0, 15, 21, 0, 0).getTime();

    const days = collectStudyDays({ a: now, b: later }, []);

    expect(days).toHaveLength(1);
  });

  it('時刻が壊れている記録は無視する', () => {
    expect(collectStudyDays({ a: 0, b: NaN as any }, [])).toEqual([]);
  });

  it('startOfDay はその日の0時に丸める', () => {
    const time = new Date(2026, 0, 15, 23, 59, 59).getTime();
    const start = new Date(startOfDay(time));
    expect(start.getHours()).toBe(0);
    expect(start.getDate()).toBe(15);
  });

  it('直近14日に含まれる日だけを数える', () => {
    const now = new Date(2026, 0, 20, 12, 0, 0).getTime();
    const days = [
      toDateKey(now),
      toDateKey(now - 3 * DAY),
      toDateKey(now - 30 * DAY), // 範囲外
    ];

    expect(countActiveDaysWithin(days, 14, now)).toBe(2);
  });
});

describe('復習の実行状況', () => {
  it('期限が来た未対応・定着済み・回数を集計する', () => {
    const now = 10_000;
    const items = [
      makeItem({ key: 'a', dueAt: 5_000, wrongCount: 3, correctCount: 2 }), // 期限超過
      makeItem({ key: 'b', dueAt: 20_000, box: 6, wrongCount: 1, correctCount: 1 }), // 定着
    ];

    const summary = summarizeReviewDiscipline(items, 6, now);

    expect(summary.total).toBe(2);
    expect(summary.overdue).toBe(1);
    expect(summary.mastered).toBe(1);
    expect(summary.wrongCount).toBe(4);
    expect(summary.retryCount).toBe(3);
  });

  it('立て直し率 = 解き直し / 間違い', () => {
    const summary = summarizeReviewDiscipline(
      [makeItem({ wrongCount: 4, correctCount: 2 })],
      6,
      0,
    );
    expect(summary.recoveryRate).toBeCloseTo(0.5);
  });

  it('まだ間違えていない場合は 0 除算にならない', () => {
    const summary = summarizeReviewDiscipline([], 6, 0);
    expect(summary.recoveryRate).toBe(0);
    expect(Number.isFinite(summary.recoveryRate)).toBe(true);
  });
});

describe('取り組み度（先生の判断材料）', () => {
  it('週3〜4回（14日で7日）やれば継続は満点になる', () => {
    // 毎日やらないと満点にならない設計だと、部活のある生徒が
    // 不当に低く出てしまうため、7日で満点にしている
    const result = calcEngagementScore({
      activeDaysIn14: 7,
      recoveryRate: 0,
      overdue: 0,
      reviewTotal: 0,
    });
    expect(result.breakdown.continuity).toBe(50);
  });

  it('7日を超えても頭打ち（過剰な学習を煽らない）', () => {
    const seven = calcEngagementScore({ activeDaysIn14: 7, recoveryRate: 0, overdue: 0, reviewTotal: 0 });
    const fourteen = calcEngagementScore({ activeDaysIn14: 14, recoveryRate: 0, overdue: 0, reviewTotal: 0 });
    expect(fourteen.breakdown.continuity).toBe(seven.breakdown.continuity);
  });

  it('間違いを全部解き直していれば立て直しが満点', () => {
    const result = calcEngagementScore({
      activeDaysIn14: 0,
      recoveryRate: 1,
      overdue: 0,
      reviewTotal: 5,
    });
    expect(result.breakdown.recovery).toBe(35);
  });

  it('復習が0件でも未処理点は満点（まだ間違えていない＝放置していない）', () => {
    const result = calcEngagementScore({
      activeDaysIn14: 0,
      recoveryRate: 0,
      overdue: 0,
      reviewTotal: 0,
    });
    expect(result.breakdown.upkeep).toBe(15);
  });

  it('全部放置していると未処理点が0になる', () => {
    const result = calcEngagementScore({
      activeDaysIn14: 0,
      recoveryRate: 0,
      overdue: 10,
      reviewTotal: 10,
    });
    expect(result.breakdown.upkeep).toBe(0);
  });

  it('満点は100、内訳の合計と一致する', () => {
    const result = calcEngagementScore({
      activeDaysIn14: 10,
      recoveryRate: 1,
      overdue: 0,
      reviewTotal: 3,
    });
    expect(result.score).toBe(100);
    const sum =
      result.breakdown.continuity + result.breakdown.recovery + result.breakdown.upkeep;
    expect(result.score).toBe(sum);
  });

  it('必ず内訳が付く（数字だけが独り歩きしないように）', () => {
    const result = calcEngagementScore({
      activeDaysIn14: 3,
      recoveryRate: 0.4,
      overdue: 1,
      reviewTotal: 4,
    });
    expect(result.breakdown).toHaveProperty('continuity');
    expect(result.breakdown).toHaveProperty('recovery');
    expect(result.breakdown).toHaveProperty('upkeep');
  });

  it('壊れた入力でも 0〜100 の範囲に収まる', () => {
    const result = calcEngagementScore({
      activeDaysIn14: NaN as any,
      recoveryRate: -5,
      overdue: -1,
      reviewTotal: NaN as any,
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});

describe('単元別の到達状況', () => {
  const chapters = [
    { id: 'c1_1', title: '①-A 物質の成分', totalProblems: 6 },
    { id: 'c1_2', title: '②-A 物質の分離と精製', totalProblems: 4 },
  ];

  it('章ごとに解いた数と到達率を出す', () => {
    const rows = buildChapterProgressRows(
      chapters,
      { 'c1_1::q1': 1, 'c1_1::q2': 1, 'c1_1::q3': 1, 'c1_2::q1': 1 },
      [],
      0,
    );

    expect(rows[0].solvedProblems).toBe(3);
    expect(rows[0].ratePercent).toBe(50);
    expect(rows[1].ratePercent).toBe(25);
  });

  it('解いた数が総数を超えない（章の問題が減った場合の保険）', () => {
    const rows = buildChapterProgressRows(
      [{ id: 'c1_1', title: 'x', totalProblems: 2 }],
      { 'c1_1::a': 1, 'c1_1::b': 1, 'c1_1::c': 1 },
      [],
      0,
    );
    expect(rows[0].solvedProblems).toBe(2);
    expect(rows[0].ratePercent).toBe(100);
  });

  it('章ごとの未処理の復習数（つまずきの所在）を出す', () => {
    const rows = buildChapterProgressRows(
      chapters,
      {},
      [
        makeItem({ key: 'a', chapterId: 'c1_2', dueAt: 100 }),
        makeItem({ key: 'b', chapterId: 'c1_2', dueAt: 200 }),
        makeItem({ key: 'c', chapterId: 'c1_1', dueAt: 99_999 }), // まだ期限前
      ],
      1_000,
    );

    expect(rows[0].pendingReviews).toBe(0);
    expect(rows[1].pendingReviews).toBe(2);
  });

  it('問題数0の章で 0 除算しない', () => {
    const rows = buildChapterProgressRows([{ id: 'x', title: 'x', totalProblems: 0 }], {}, [], 0);
    expect(rows[0].ratePercent).toBe(0);
  });
});

describe('生徒1人分のサマリー', () => {
  it('未学習の生徒は最終学習日が null になる（声を掛ける対象として拾える）', () => {
    const summary = buildStudentSummary({
      uid: 'u1',
      displayName: '出席1',
      solved: {},
      reviewItems: [],
      masteredBox: 6,
    });

    expect(summary.lastStudiedAt).toBeNull();
    expect(summary.solvedTotal).toBe(0);
  });

  it('解いた数と最終学習日が入る', () => {
    const now = new Date(2026, 0, 15, 10, 0, 0).getTime();
    const summary = buildStudentSummary({
      uid: 'u1',
      displayName: '出席1',
      solved: { 'c1_1::q1': now - DAY, 'c1_1::q2': now },
      reviewItems: [],
      masteredBox: 6,
      now,
    });

    expect(summary.solvedTotal).toBe(2);
    expect(summary.lastStudiedAt).toBe(toDateKey(now));
    expect(summary.activeDaysIn14).toBe(2);
  });
});

describe('CSV 出力（先生が Excel で開く）', () => {
  it('Excel の文字化けを防ぐため BOM を付ける', () => {
    const csv = buildStudentCsv([]);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
  });

  it('BOM 無しも選べる', () => {
    const csv = buildStudentCsv([], false);
    expect(csv.charCodeAt(0)).not.toBe(0xfeff);
  });

  it('CSV インジェクションを無効化する（=で始まるセルを数式にしない）', () => {
    // 生徒がニックネームに =cmd|... を入れた場合、Excel が数式として
    // 解釈してしまう。学校へ配る成果物なのでここは必須。
    expect(escapeCsvCell('=1+1')).toBe("'=1+1");
    expect(escapeCsvCell('+SUM(A1)')).toBe("'+SUM(A1)");
    expect(escapeCsvCell('-2')).toBe("'-2");
    expect(escapeCsvCell('@x')).toBe("'@x");
  });

  it('カンマや改行を含む名前を壊さない', () => {
    expect(escapeCsvCell('田中, 太郎')).toBe('"田中, 太郎"');
    expect(escapeCsvCell('行1\n行2')).toBe('"行1\n行2"');
  });

  it('引用符を二重にしてエスケープする', () => {
    expect(escapeCsvCell('あ"い')).toBe('"あ""い"');
  });

  it('null / undefined は空欄になる', () => {
    expect(escapeCsvCell(null)).toBe('');
    expect(escapeCsvCell(undefined)).toBe('');
  });

  it('取り組み度と内訳が列に含まれる（根拠を必ず併記する）', () => {
    expect(STUDENT_CSV_HEADERS).toContain('取り組み度');
    expect(STUDENT_CSV_HEADERS).toContain('内訳:継続');
    expect(STUDENT_CSV_HEADERS).toContain('内訳:立て直し');
    expect(STUDENT_CSV_HEADERS).toContain('内訳:未処理');
  });

  it('生徒の行が出力される', () => {
    const summary = buildStudentSummary({
      uid: 'u1',
      displayName: '出席1 田中',
      solved: { 'c1_1::q1': 1000 },
      reviewItems: [makeItem({ wrongCount: 2, correctCount: 1 })],
      masteredBox: 6,
    });

    const csv = buildStudentCsv([summary]);

    expect(csv).toContain('出席1 田中');
    expect(csv.split('\r\n').filter((line) => line.trim() !== '')).toHaveLength(2);
  });

  it('未学習の生徒は「未学習」と表示される（空欄で見落とさない）', () => {
    const summary = buildStudentSummary({
      uid: 'u1',
      displayName: '出席2',
      solved: {},
      reviewItems: [],
      masteredBox: 6,
    });
    expect(buildStudentCsv([summary])).toContain('未学習');
  });

  it('単元別 CSV も出せる', () => {
    const rows = buildChapterProgressRows(
      [{ id: 'c1_1', title: '①-A 物質の成分', totalProblems: 6 }],
      { 'c1_1::q1': 1 },
      [],
      0,
    );
    const csv = buildChapterCsv(rows);
    expect(csv).toContain('①-A 物質の成分');
    expect(csv).toContain('単元');
  });
});

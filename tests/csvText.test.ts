import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

import {
  escapeCsvCell,
  buildCsvText,
  buildStudentCsv,
  buildChapterCsv,
  STUDENT_CSV_HEADERS,
  CHAPTER_CSV_HEADERS,
  type StudentSummary,
  type ChapterProgressRow,
} from '../src/utils/studySummary';
import { buildKantenCsv, KANTEN_CSV_HEADERS } from '../src/utils/kantenReport';

/**
 * ===================================================================
 * CSV の骨組み（buildCsvText）のテスト
 * ===================================================================
 *
 * これは「振る舞いを変えないための」テストである（characterization test）。
 *
 * なぜここを1つにまとめたのか：
 *   CSV の外側（見出し → 各行 → CRLF → 末尾改行 → BOM）が
 *   3か所に同じ形で書かれていた。ここは間違えると実害が出る。
 *     - BOM を落とす        → Excel で日本語が文字化けする
 *     - escapeCsvCell 忘れ  → CSV インジェクションが通る
 *     - 改行が LF           → 古い Excel で1行に潰れる
 *   3か所に散っていると「片方だけ直して片方は穴のまま」になりうるので、
 *   骨組みだけを1か所に集めた。
 *
 * ⚠️ 学校へ配る成果物なので、文字化け対策とインジェクション対策は
 *    3つの CSV すべてで効いていることを必ず確認する。
 */

// ===================================================================
// まとめる前のコード（3つの CSV 関数の骨組みをそのまま写したもの）
// ===================================================================
// ★ここは意図的に「昔のまま」にしている。直してはいけない★
function legacyCsv(
  headers: readonly unknown[],
  rows: readonly unknown[][],
  withBom = true,
): string {
  const lines: string[] = [];
  lines.push(headers.map(escapeCsvCell).join(','));
  rows.forEach((row) => {
    lines.push(row.map(escapeCsvCell).join(','));
  });
  const body = `${lines.join('\r\n')}\r\n`;
  return withBom ? `\uFEFF${body}` : body;
}

const CASES: { name: string; headers: readonly unknown[]; rows: unknown[][] }[] = [
  { name: '行が無い（見出しだけ）', headers: ['あ', 'い'], rows: [] },
  { name: 'ふつうの表', headers: ['名前', '点数'], rows: [['田中', 80], ['佐藤', 95]] },
  {
    name: 'カンマ・改行・引用符が入る',
    headers: ['名前', 'メモ'],
    rows: [['田中, 太郎', '行1\n行2'], ['あ"い', 'ふつう']],
  },
  {
    name: '数式に見えるセル（インジェクション）',
    headers: ['=SUM(A1)', '+1'],
    rows: [['-2', '@cmd'], ['\tタブ', '\r復帰']],
  },
  {
    name: 'null と undefined が混ざる',
    headers: ['a', 'b'],
    rows: [[null, undefined], [0, false]],
  },
  { name: '見出しも行も空', headers: [], rows: [] },
  {
    name: '日本語だけ',
    headers: ['単元', '到達率'],
    rows: [['① 純物質と混合物', '75%']],
  },
];

describe('前提：3か所に写されていた骨組みは本当に同じだったのか', () => {
  /**
   * ★これが「まとめてよい」という許可そのもの★
   * 新しい共通関数と、写した昔のコードの結果を1文字ずつ突き合わせる。
   */
  it.each(CASES.map((c) => [c.name, c] as const))(
    '%s：共通関数が昔のコードと1文字も違わない',
    (_name, testCase) => {
      expect(buildCsvText(testCase.headers, testCase.rows, true)).toBe(
        legacyCsv(testCase.headers, testCase.rows, true),
      );
      expect(buildCsvText(testCase.headers, testCase.rows, false)).toBe(
        legacyCsv(testCase.headers, testCase.rows, false),
      );
    },
  );
});

describe('CSV の骨組みが守るべきこと', () => {
  it('BOM を付ける（Excel の文字化け対策）', () => {
    expect(buildCsvText(['あ'], [['い']]).startsWith('\uFEFF')).toBe(true);
  });

  it('BOM 無しも選べる', () => {
    expect(buildCsvText(['あ'], [['い']], false).startsWith('\uFEFF')).toBe(false);
  });

  it('行区切りは CRLF（LF だけにしない）', () => {
    const csv = buildCsvText(['a', 'b'], [['1', '2']], false);
    expect(csv).toBe('a,b\r\n1,2\r\n');
    // LF 単独が混ざっていないこと
    expect(csv.replace(/\r\n/g, '')).not.toContain('\n');
  });

  it('最後の行にも改行を付ける', () => {
    expect(buildCsvText(['a'], [['1']], false).endsWith('\r\n')).toBe(true);
  });

  it('★数式に見えるセルを無効化する（CSV インジェクション対策）★', () => {
    const csv = buildCsvText(['x'], [['=1+1'], ['+SUM(A1)'], ['-2'], ['@x']], false);
    expect(csv).toContain("'=1+1");
    expect(csv).toContain("'+SUM(A1)");
    expect(csv).toContain("'-2");
    expect(csv).toContain("'@x");
  });

  it('見出しもエスケープを通す（見出しに , が入っても壊れない）', () => {
    expect(buildCsvText(['名前, 敬称'], [], false)).toBe('"名前, 敬称"\r\n');
  });

  it('引用符は2つ重ねて escape する', () => {
    expect(buildCsvText(['x'], [['あ"い']], false)).toContain('"あ""い"');
  });

  it('渡した配列を書き換えない', () => {
    const headers = ['a', 'b'];
    const rows = [['1', '2']];
    const snapshot = JSON.stringify({ headers, rows });
    buildCsvText(headers, rows);
    expect(JSON.stringify({ headers, rows })).toBe(snapshot);
  });
});

// ===================================================================
// 3つの CSV の出口が変わっていないこと
// ===================================================================
function summary(overrides: Partial<StudentSummary> = {}): StudentSummary {
  return {
    uid: 'u1',
    displayName: '田中, 太郎',
    solvedTotal: 12,
    activeDaysIn14: 5,
    lastStudiedAt: '2026-08-19',
    review: {
      total: 8,
      overdue: 2,
      mastered: 3,
      retryCount: 7,
      wrongCount: 9,
      recoveryRate: 0.7777,
    },
    engagement: {
      score: 71,
      breakdown: { continuity: 36, recovery: 27, upkeep: 8 },
    },
    ...overrides,
  };
}

describe('3つの CSV の出口が変わっていない', () => {
  it('buildStudentCsv は昔の骨組みと同じ文字列を出す', () => {
    const rows = [summary(), summary({ displayName: '=悪意', lastStudiedAt: null })];
    const expected = legacyCsv(
      STUDENT_CSV_HEADERS,
      rows.map((row) => [
        row.displayName,
        row.solvedTotal,
        row.activeDaysIn14,
        row.lastStudiedAt ?? '未学習',
        row.review.total,
        row.review.overdue,
        row.review.mastered,
        row.review.wrongCount,
        row.review.retryCount,
        `${Math.round(row.review.recoveryRate * 100)}%`,
        row.engagement.score,
        row.engagement.breakdown.continuity,
        row.engagement.breakdown.recovery,
        row.engagement.breakdown.upkeep,
      ]),
      true,
    );
    expect(buildStudentCsv(rows)).toBe(expected);
  });

  it('buildChapterCsv は昔の骨組みと同じ文字列を出す', () => {
    const rows: ChapterProgressRow[] = [
      { chapterId: 'c1', chapterTitle: '① 純物質, と混合物', totalProblems: 4, ratePercent: 75, pendingReviews: 1 },
      { chapterId: 'c2', chapterTitle: '② 原子の構造', totalProblems: 5, ratePercent: 0, pendingReviews: 0 },
    ];
    const expected = legacyCsv(
      CHAPTER_CSV_HEADERS,
      rows.map((row) => [row.chapterTitle, row.totalProblems, row.ratePercent, row.pendingReviews]),
      true,
    );
    expect(buildChapterCsv(rows)).toBe(expected);
  });

  it('3つの CSV すべてで BOM が付く', () => {
    expect(buildStudentCsv([summary()]).startsWith('\uFEFF')).toBe(true);
    expect(buildChapterCsv([]).startsWith('\uFEFF')).toBe(true);
    expect(buildKantenCsv([]).startsWith('\uFEFF')).toBe(true);
  });

  it('3つの CSV すべてで行区切りが CRLF', () => {
    for (const csv of [buildStudentCsv([summary()], false), buildChapterCsv([], false), buildKantenCsv([], false)]) {
      expect(csv.endsWith('\r\n')).toBe(true);
      expect(csv.replace(/\r\n/g, '')).not.toContain('\n');
    }
  });

  it('★3つの CSV すべてでインジェクション対策が効く★', () => {
    const evil = '=cmd|calc';
    expect(buildStudentCsv([summary({ displayName: evil })], false)).toContain(`'${evil}`);
    expect(
      buildChapterCsv(
        [{ chapterId: 'c', chapterTitle: evil, totalProblems: 1, ratePercent: 0, pendingReviews: 0 }],
        false,
      ),
    ).toContain(`'${evil}`);
  });

  it('見出しの列数と本文の列数が一致している（列ずれ防止）', () => {
    const studentCsv = buildStudentCsv([summary()], false).split('\r\n');
    // 「田中, 太郎」は引用符で囲まれるが、カンマ数は列数-1 のまま
    expect(studentCsv[0].split(',').length).toBe(STUDENT_CSV_HEADERS.length);

    const chapterCsv = buildChapterCsv([], false).split('\r\n');
    expect(chapterCsv[0].split(',').length).toBe(CHAPTER_CSV_HEADERS.length);

    const kantenCsv = buildKantenCsv([], false).split('\r\n');
    expect(kantenCsv[0].split(',').length).toBe(KANTEN_CSV_HEADERS.length);
  });
});

// ===================================================================
// 構造の見張り（また同じ重複が生えないように）
// ===================================================================
describe('構造の見張り', () => {
  const summarySrc = readFileSync('src/utils/studySummary.ts', 'utf8');
  const kantenSrc = readFileSync('src/utils/kantenReport.ts', 'utf8');

  it('3つの CSV 関数はどれも共通の骨組みを使っている', () => {
    // studySummary 側は定義1つ + 呼び出し2つ
    expect((summarySrc.match(/buildCsvText/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect(kantenSrc).toContain('buildCsvText');
  });

  it('骨組みが呼び出し側に写し戻されていない', () => {
    // BOM と CRLF の組み立ては共通関数の中だけ（1回だけ）
    const bom = /return withBom \? `\\uFEFF\$\{body\}` : body;/g;
    expect((summarySrc.match(bom) ?? []).length).toBe(1);
    expect(kantenSrc).not.toMatch(bom);
    expect(kantenSrc).not.toContain("lines.join('\\r\\n')");
  });

  it('計算の置き場所は utils のまま（data や components に依存していない）', () => {
    expect(summarySrc).not.toMatch(/from '\.\.\/components\//);
    expect(summarySrc).not.toMatch(/from '\.\.\/data\//);
  });
});

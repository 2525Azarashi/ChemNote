import { describe, it, expect } from 'vitest';

import {
  buildKnowledgeEvidence,
  buildAttitudeEvidence,
  buildCommentDraft,
  buildKantenReport,
  buildKantenCsv,
  kantenCsvFileName,
  KANTEN_CSV_HEADERS,
  THINKING_NOTE,
} from '../src/utils/kantenReport';
import type { ChapterDefinition } from '../src/utils/studySummary';
import type { ReviewItem } from '../src/utils/reviewList';
import { getChapterCatalog, countCatalogProblems, SUBJECT_LABELS } from '../src/data/chapterCatalog';

/**
 * ===================================================================
 * 観点別評価レポートのテスト
 * ===================================================================
 * 学校に「評価材料」として渡すものなので、
 *   - 評定（A/B/C）を出していないこと
 *   - 生徒が不当に低く／高く見えないこと
 *   - 下書き文が事実だけで組み立てられていること
 * を重点的に検証する。
 */

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date('2026-08-20T12:00:00').getTime();

const CHAPTERS: ChapterDefinition[] = [
  { id: 'c1', title: '① 純物質と混合物', totalProblems: 4 },
  { id: 'c2', title: '② 原子の構造', totalProblems: 5 },
  { id: 'c3', title: '③ 化学結合', totalProblems: 3 },
];

function reviewItem(overrides: Partial<ReviewItem>): ReviewItem {
  return {
    key: 'c1::q1::a',
    chapterId: 'c1',
    questionId: 'q1',
    subQuestionId: 'a',
    box: 0,
    dueAt: NOW + DAY,
    wrongCount: 1,
    correctCount: 0,
    createdAt: NOW - DAY,
    updatedAt: NOW - DAY,
    ...overrides,
  };
}

// ===================================================================
// 知識・技能の材料
// ===================================================================

describe('buildKnowledgeEvidence', () => {
  it('到達率を「実際に解ける問題」に対する割合で出す', () => {
    const solved = { 'c1::q1': NOW, 'c1::q2': NOW, 'c2::q1': NOW };
    const evidence = buildKnowledgeEvidence(CHAPTERS, solved, [], 6, NOW);
    expect(evidence.totalProblems).toBe(12);
    expect(evidence.solvedProblems).toBe(3);
    expect(evidence.ratePercent).toBe(25);
  });

  it('未着手の章を「得意」に混ぜない（0%の章が strong に入らない）', () => {
    const solved = { 'c1::q1': NOW };
    const evidence = buildKnowledgeEvidence(CHAPTERS, solved, [], 6, NOW);
    evidence.strongChapters.forEach((row) => {
      expect(row.solvedProblems).toBeGreaterThan(0);
    });
  });

  it('弱い章は到達率の低い順に出る', () => {
    const solved = { 'c1::q1': NOW, 'c1::q2': NOW, 'c1::q3': NOW, 'c1::q4': NOW };
    const evidence = buildKnowledgeEvidence(CHAPTERS, solved, [], 6, NOW);
    expect(evidence.weakChapters[0].ratePercent).toBe(0);
    expect(evidence.weakChapters[0].chapterId).not.toBe('c1');
  });

  it('データが無い生徒は 0% になる（落ちない）', () => {
    const evidence = buildKnowledgeEvidence(CHAPTERS, null, null, 6, NOW);
    expect(evidence.ratePercent).toBe(0);
    expect(evidence.solvedProblems).toBe(0);
  });
});

// ===================================================================
// 態度の材料
// ===================================================================

describe('buildAttitudeEvidence', () => {
  it('「間違えたのに定着まで持っていった問題」を数える（粘り強さの証跡）', () => {
    const items = [
      reviewItem({ key: 'a', box: 6, wrongCount: 2, correctCount: 6 }), // 定着（間違い→回復）
      reviewItem({ key: 'b', box: 6, wrongCount: 0 }), // 定着だが間違い記録なし → 数えない
      reviewItem({ key: 'c', box: 2, wrongCount: 1 }), // まだ途中
    ];
    const evidence = buildAttitudeEvidence({}, items, 6, NOW);
    expect(evidence.recoveredToMastery).toBe(1);
  });

  it('学習記録が無い生徒でも壊れない', () => {
    const evidence = buildAttitudeEvidence(null, null, 6, NOW);
    expect(evidence.totalStudyDays).toBe(0);
    expect(evidence.lastStudiedAt).toBeNull();
    expect(evidence.review.recoveryRate).toBe(0);
  });
});

// ===================================================================
// 所見の下書き
// ===================================================================

describe('buildCommentDraft', () => {
  const baseKnowledge = () =>
    buildKnowledgeEvidence(CHAPTERS, { 'c1::q1': NOW - 2 * DAY, 'c1::q2': NOW - DAY }, [], 6, NOW);

  it('記録が無い生徒には「記録はまだない」と正直に返す（空文字を返さない）', () => {
    const draft = buildCommentDraft({
      subjectLabel: '化学基礎',
      knowledge: buildKnowledgeEvidence(CHAPTERS, null, null, 6, NOW),
      attitude: buildAttitudeEvidence(null, null, 6, NOW),
    });
    expect(draft).toBe('化学基礎のアプリ学習の記録はまだない。');
  });

  it('事実（数値・単元名）で組み立てられ、評定語（A/B/C・優秀など）を含まない', () => {
    const items = [reviewItem({ box: 6, wrongCount: 2, correctCount: 6, updatedAt: NOW - DAY })];
    const draft = buildCommentDraft({
      subjectLabel: '化学基礎',
      knowledge: baseKnowledge(),
      attitude: buildAttitudeEvidence({ 'c1::q1': NOW - 2 * DAY }, items, 6, NOW),
    });
    expect(draft).toContain('化学基礎では全12問中2問');
    expect(draft).toContain('解き直し');
    // 人物評・評定語が混ざっていないこと（誠実さのルール3）
    ['優秀', '劣', 'A評価', 'B評価', 'C評価', '素晴らしい', '意欲的'].forEach((banned) => {
      expect(draft).not.toContain(banned);
    });
  });

  it('直近の学習が無い場合は最終学習日を事実として書く', () => {
    const solved = { 'c1::q1': NOW - 30 * DAY };
    const draft = buildCommentDraft({
      subjectLabel: '化学基礎',
      knowledge: buildKnowledgeEvidence(CHAPTERS, solved, [], 6, NOW),
      attitude: buildAttitudeEvidence(solved, [], 6, NOW),
    });
    expect(draft).toContain('直近2週間の記録はない');
  });
});

// ===================================================================
// レポート全体と CSV
// ===================================================================

describe('buildKantenReport / buildKantenCsv', () => {
  const report = () =>
    buildKantenReport({
      uid: 'u1',
      displayName: '=1+1', // CSVインジェクションを試みる名前
      subjectLabel: '化学基礎',
      chapters: CHAPTERS,
      solved: { 'c1::q1': NOW - DAY },
      reviewItems: [reviewItem({})],
      masteredBox: 6,
      now: NOW,
    });

  it('思考・判断・表現には「測れない」という断り書きが必ず付く', () => {
    expect(report().thinkingNote).toBe(THINKING_NOTE);
    expect(THINKING_NOTE).toContain('操作記録だけでは十分な材料にならない');
  });

  it('CSV はヘッダー行＋生徒行で、観点をまたいだ合成値の列を持たない', () => {
    const csv = buildKantenCsv([report()], false);
    const lines = csv.trim().split('\r\n');
    expect(lines).toHaveLength(2);
    expect(lines[0].split(',').length).toBe(KANTEN_CSV_HEADERS.length);
    // 観点別評価では「合計点」を作ってはいけない
    expect(lines[0]).not.toContain('合計');
  });

  it('CSV インジェクションを無効化する（先頭の = に \' を付ける）', () => {
    const csv = buildKantenCsv([report()], false);
    expect(csv).toContain("'=1+1");
  });

  it('BOM 付きで出す（Excel の文字化け対策）', () => {
    expect(buildKantenCsv([report()]).startsWith('\uFEFF')).toBe(true);
  });

  it('ファイル名にクラス名と日付が入り、パスに使えない文字は除去される', () => {
    const name = kantenCsvFileName('2年A組/化学', NOW);
    expect(name).toContain('2年A組_化学');
    expect(name).toContain('2026-08-20');
    expect(name).not.toContain('/');
  });
});

// ===================================================================
// 章カタログ
// ===================================================================

describe('chapterCatalog', () => {
  it('化学基礎は29章すべてに問題があり、カタログに全部載る', () => {
    const rows = getChapterCatalog('chemistry_basic');
    expect(rows.length).toBe(29);
    rows.forEach((row) => {
      expect(row.totalProblems).toBeGreaterThan(0);
      expect(row.title.length).toBeGreaterThan(0);
    });
  });

  it('化学（発展）は問題未収録の章を分母に入れない', () => {
    const rows = getChapterCatalog('chemistry');
    // 未収録章が多いので全章数（60超）よりずっと少ないはず
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(20);
    rows.forEach((row) => expect(row.totalProblems).toBeGreaterThan(0));
  });

  it('英語リスニングも問題のある単元だけが載る', () => {
    const rows = getChapterCatalog('english_listening');
    expect(rows.length).toBeGreaterThan(0);
    rows.forEach((row) => expect(row.totalProblems).toBeGreaterThan(0));
  });

  it('大問総数はカタログの合計と一致する', () => {
    const rows = getChapterCatalog('chemistry_basic');
    const sum = rows.reduce((acc, row) => acc + row.totalProblems, 0);
    expect(countCatalogProblems('chemistry_basic')).toBe(sum);
  });

  it('科目ラベルは3科目そろっている', () => {
    expect(SUBJECT_LABELS.chemistry_basic).toBe('化学基礎');
    expect(SUBJECT_LABELS.chemistry).toBe('化学');
    expect(SUBJECT_LABELS.english_listening).toBe('英語リスニング');
  });
});

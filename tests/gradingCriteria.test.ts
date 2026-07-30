import { describe, it, expect } from 'vitest';
import {
  normalizeGradingCriteria,
  resolveGradingCriteria,
  gradingCriteriaProgress,
  DEFAULT_GRADING_CRITERION,
} from '../src/utils/gradingCriteria';
import { chemistryData } from '../src/data/chemistryData';

/**
 * 「⑦ 滴定曲線と二段階滴定」の結果・ランキング画面が表示されなかった不具合の回帰テスト。
 *
 * 原因：p_c5_7_2 の gradingCriteria が string[] ではなく string だったため、
 *       Explanation.tsx の gradingCriteria.forEach / .map が例外を投げ、
 *       章の解説（＝結果・ランキング）画面が描画できなかった。
 */

describe('normalizeGradingCriteria', () => {
  it('配列はそのまま（空要素は除去）', () => {
    expect(normalizeGradingCriteria(['A', ' B ', '', '  '])).toEqual(['A', 'B']);
  });

  it('文字列でも必ず配列になる（.forEach/.map で落ちない）', () => {
    const result = normalizeGradingCriteria('NaOH+HCl→NaCl+H₂O が書けていること。');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
  });

  it('全角スラッシュ・改行区切りの文字列は項目ごとに分割する', () => {
    expect(normalizeGradingCriteria('第1式が書けている／第2式が書けている')).toEqual([
      '第1式が書けている',
      '第2式が書けている',
    ]);
    expect(normalizeGradingCriteria('項目1\n項目2')).toEqual(['項目1', '項目2']);
  });

  it('未定義・null・数値などは空配列', () => {
    expect(normalizeGradingCriteria(undefined)).toEqual([]);
    expect(normalizeGradingCriteria(null)).toEqual([]);
    expect(normalizeGradingCriteria(42)).toEqual([]);
  });
});

describe('resolveGradingCriteria', () => {
  it('記述問題で基準が未設定でも自己採点項目を1つ返す', () => {
    expect(resolveGradingCriteria({ id: 'x', type: 'descriptive' })).toEqual([
      DEFAULT_GRADING_CRITERION,
    ]);
  });

  it('記述以外で基準が無ければ空配列', () => {
    expect(resolveGradingCriteria({ id: 'x', type: 'short_answer' })).toEqual([]);
  });
});

describe('gradingCriteriaProgress', () => {
  it('チェック数から 0〜1 の達成率を返す', () => {
    const sq = { id: 'sq1', type: 'descriptive', gradingCriteria: ['a', 'b', 'c', 'd'] };
    const { ratio, checked } = gradingCriteriaProgress(sq, { sq1_0: true, sq1_2: true });
    expect(checked).toBe(2);
    expect(ratio).toBeCloseTo(0.5);
  });

  it('基準0件でも NaN にならない', () => {
    const { ratio } = gradingCriteriaProgress({ id: 'sq1', type: 'short_answer' }, {});
    expect(ratio).toBe(0);
    expect(Number.isNaN(ratio)).toBe(false);
  });
});

describe('問題データの形式（全章）', () => {
  const collectSubQuestions = () => {
    const rows: { chapterId: string; questionId: string; sq: any }[] = [];
    for (const part of (chemistryData as any).parts || []) {
      for (const chapter of part.chapters || []) {
        for (const key of ['practiceProblems', 'miniTest'] as const) {
          for (const q of chapter[key] || []) {
            for (const sq of q.subQuestions || []) {
              rows.push({ chapterId: chapter.id, questionId: q.id, sq });
            }
          }
        }
      }
    }
    return rows;
  };

  it('gradingCriteria は必ず配列（string は描画時に例外を起こす）', () => {
    const offenders = collectSubQuestions()
      .filter(({ sq }) => sq.gradingCriteria !== undefined && !Array.isArray(sq.gradingCriteria))
      .map(({ chapterId, questionId, sq }) => `${chapterId}/${questionId}/${sq.id}`);
    expect(offenders).toEqual([]);
  });

  it('detailedExplanation.steps は必ず配列', () => {
    const offenders = collectSubQuestions()
      .filter(
        ({ sq }) =>
          sq.detailedExplanation?.steps !== undefined && !Array.isArray(sq.detailedExplanation.steps)
      )
      .map(({ chapterId, questionId, sq }) => `${chapterId}/${questionId}/${sq.id}`);
    expect(offenders).toEqual([]);
  });

  it('⑦ 滴定曲線と二段階滴定（c5_7）の全小問が描画可能な形式である', () => {
    const rows = collectSubQuestions().filter(r => r.chapterId === 'c5_7');
    expect(rows.length).toBeGreaterThan(0);
    for (const { sq } of rows) {
      // 実際の描画と同じ経路（map）を通しても例外にならないことを確認
      expect(() => resolveGradingCriteria(sq).map(c => String(c))).not.toThrow();
      if (sq.type === 'multiple_choice') expect(Array.isArray(sq.options)).toBe(true);
    }
  });
});

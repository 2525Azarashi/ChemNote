/**
 * ===================================================================
 * 化学（発展）出題傾向データの構造テスト
 * ===================================================================
 * ご要望：
 *   「共通テストの化学基礎の分析と同じ形式で、過去15年分の化学の
 *     共通テスト＋センター試験の問題（本試と追試）を分析して欲しい」
 *
 * ＝ 化学基礎（src/data/trendData.ts）とまったく同じ形で、
 *   ① 2012〜2026 の15年分をカバーしていること
 *   ② 本試だけでなく追試の情報を持っていること
 *   ③ 化学（発展）の全66単元（a1_1〜a14_5）と1対1で対応していること
 *   ④ TrendModal がそのまま描画できる TrendDataset になっていること
 * を機械的に守れるようテストで固定する。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  overallTrendAdvanced,
  chapterTrendsAdvanced,
  rotationAnalysisAdvanced,
  chemistryAdvancedTrendDataset,
} from '../src/data/chemistryAdvancedTrendData';
import { chemistryBasicTrendDataset } from '../src/data/trendData';
import { getAllAdvancedChapters, chemistryAdvancedData } from '../src/data/chemistryAdvancedData';

const repoRoot = resolve(__dirname, '..');
const read = (p: string) => readFileSync(resolve(repoRoot, p), 'utf-8');

describe('全体総括（過去15年・本試＋追試）', () => {
  it('2012〜2026年の15年分を、抜けも重複もなく収録している', () => {
    const years = overallTrendAdvanced.yearlyOverview.map((r) => r.year);
    expect(years).toHaveLength(15);
    expect(years).toEqual([...years].sort((a, b) => a - b));
    expect(new Set(years).size).toBe(15);
    expect(years[0]).toBe(2012);
    expect(years[years.length - 1]).toBe(2026);
  });

  it('2020年までがセンター試験、2021年以降が共通テストに分類されている', () => {
    for (const row of overallTrendAdvanced.yearlyOverview) {
      expect(row.type).toBe(row.year <= 2020 ? 'センター' : '共通テスト');
    }
  });

  it('全ての年度に本試の特徴と追試の特徴の両方が入っている', () => {
    for (const row of overallTrendAdvanced.yearlyOverview) {
      expect(row.feature.length).toBeGreaterThan(20);
      expect(row.supplementary, `${row.year}年の追試情報`).toBeTruthy();
      expect((row.supplementary ?? '').length).toBeGreaterThan(10);
    }
  });

  it('満点は各年100点（化学は化学基礎の50点と違う）', () => {
    for (const row of overallTrendAdvanced.yearlyOverview) {
      expect(row.points).toBe(100);
    }
  });

  it('期間の説明に15年分と本試・追試の両方が明記されている', () => {
    expect(overallTrendAdvanced.period).toContain('2012');
    expect(overallTrendAdvanced.period).toContain('2026');
    expect(overallTrendAdvanced.period).toMatch(/追試|追・再試/);
  });

  it('平均点は共通テスト期を含み、過去最低の2025年（45.34点）を収録している', () => {
    const scores = overallTrendAdvanced.averageScores;
    expect(scores.length).toBeGreaterThanOrEqual(6);
    const y2025 = scores.find((s) => s.year === 2025);
    expect(y2025?.score).toContain('45.34');
    const y2026 = scores.find((s) => s.year === 2026);
    expect(y2026?.score).toContain('56.86');
  });

  it('2027年予想構成が、化学の5大問体制（第1〜4問必答＋第5問総合）を前提にしている', () => {
    expect(overallTrendAdvanced.exam2027Structure.q1.length).toBeGreaterThanOrEqual(8);
    expect(overallTrendAdvanced.exam2027Structure.q2Candidates.length).toBeGreaterThanOrEqual(4);
    // 予想度バッジ（◎ or 数値%）を TrendModal が判定できる形になっている
    for (const item of overallTrendAdvanced.exam2027Structure.q1) {
      expect(item.probability.startsWith('◎') || /\d/.test(item.probability)).toBe(true);
    }
  });

  it('トレンド解説に「追試は本試の補集合」という観点が含まれている', () => {
    const all = overallTrendAdvanced.bigTrends.map((t) => `${t.title}${t.detail}`).join('');
    expect(all).toMatch(/追試/);
  });
});

describe('章・単元別トレンド', () => {
  it('化学（発展）の全14章を、データ側の realTitle と同じ名前・同じ順で持っている', () => {
    const realTitles: string[] = [];
    for (const part of chemistryAdvancedData.parts as any[]) {
      for (const chapter of part.chapters as any[]) {
        if (chapter.realTitle && !realTitles.includes(chapter.realTitle)) {
          realTitles.push(chapter.realTitle);
        }
      }
    }
    expect(chapterTrendsAdvanced.map((c) => c.chapterGroupTitle)).toEqual(realTitles);
    expect(chapterTrendsAdvanced).toHaveLength(14);
  });

  it('全66単元（a1_1〜a14_5）が、単元データと1対1で対応している', () => {
    const dataIds = getAllAdvancedChapters().map((c: any) => c.id);
    const trendIds = chapterTrendsAdvanced.flatMap((c) => c.units.map((u) => u.id));
    expect(trendIds).toHaveLength(66);
    expect(new Set(trendIds).size).toBe(66);
    expect([...trendIds].sort()).toEqual([...dataIds].sort());
  });

  it('単元名（name）が単元データの abstractTitle と一致している', () => {
    const titleById = new Map(
      getAllAdvancedChapters().map((c: any) => [c.id, c.abstractTitle as string])
    );
    for (const chapter of chapterTrendsAdvanced) {
      for (const unit of chapter.units) {
        expect(unit.name, `${unit.id} の単元名`).toBe(titleById.get(unit.id));
      }
    }
  });

  it('単元IDが章番号と整合している（7章の単元は a7_ で始まる など）', () => {
    for (const chapter of chapterTrendsAdvanced) {
      const chapterNo = chapter.chapterGroupTitle.match(/^(\d+)章/)?.[1];
      expect(chapterNo).toBeTruthy();
      for (const unit of chapter.units) {
        expect(unit.id.startsWith(`a${chapterNo}_`), `${unit.id} は ${chapterNo}章`).toBe(true);
      }
    }
  });

  it('各単元が、頻度・出題年・出題タイプ・武器・演習ポイント・2027予想をすべて備えている', () => {
    for (const chapter of chapterTrendsAdvanced) {
      expect(chapter.summary.length).toBeGreaterThan(50);
      for (const unit of chapter.units) {
        expect(unit.frequency.length, unit.id).toBeGreaterThan(3);
        expect(unit.yearsAppeared.length, unit.id).toBeGreaterThan(10);
        expect(unit.examTypes.length, unit.id).toBeGreaterThanOrEqual(3);
        expect(unit.weapons.length, unit.id).toBeGreaterThanOrEqual(3);
        expect(unit.studyPoints.length, unit.id).toBeGreaterThan(30);
        expect(unit.prediction2027.length, unit.id).toBeGreaterThan(15);
      }
    }
  });

  it('frequency は「（」の手前が短いラベルになっている（一覧の折りたたみ表示用）', () => {
    for (const chapter of chapterTrendsAdvanced) {
      for (const unit of chapter.units) {
        const label = unit.frequency.split('（')[0];
        expect(label.length, `${unit.id}: ${label}`).toBeLessThanOrEqual(12);
        expect(label.length).toBeGreaterThan(0);
      }
    }
  });

  it('2027予想が ◎ / ○ / △ のいずれかで始まる（バッジ色分けの前提）', () => {
    for (const chapter of chapterTrendsAdvanced) {
      for (const unit of chapter.units) {
        expect(['◎', '○', '△'], `${unit.id}: ${unit.prediction2027}`).toContain(
          unit.prediction2027[0]
        );
      }
    }
  });

  it('studyPoints / prediction2027 の強調（★）が開閉ペアになっている', () => {
    for (const chapter of chapterTrendsAdvanced) {
      for (const unit of chapter.units) {
        for (const text of [unit.studyPoints, unit.prediction2027]) {
          const stars = (text.match(/★/g) || []).length;
          expect(stars % 2, `${unit.id}: ${text}`).toBe(0);
        }
      }
    }
  });

  it('追試の出題年に触れている単元が十分にある（本試だけの分析になっていない）', () => {
    const units = chapterTrendsAdvanced.flatMap((c) => c.units);
    const withSupplementary = units.filter((u) => u.yearsAppeared.includes('追'));
    expect(withSupplementary.length).toBeGreaterThanOrEqual(Math.floor(units.length * 0.6));
  });

  it('出題年に 2012〜2026 の範囲外の年が混ざっていない', () => {
    for (const chapter of chapterTrendsAdvanced) {
      for (const unit of chapter.units) {
        for (const y of unit.yearsAppeared.match(/\d{4}/g) || []) {
          const year = Number(y);
          expect(year, `${unit.id}: ${year}`).toBeGreaterThanOrEqual(2012);
          expect(year, `${unit.id}: ${year}`).toBeLessThanOrEqual(2026);
        }
      }
    }
  });
});

describe('ローテーション分析（2027年予想度）', () => {
  it('主要テーマを十分な数だけ収録している', () => {
    expect(rotationAnalysisAdvanced.length).toBeGreaterThanOrEqual(20);
  });

  it('テーマ名が重複していない', () => {
    const themes = rotationAnalysisAdvanced.map((r) => r.theme);
    expect(new Set(themes).size).toBe(themes.length);
  });

  it('すべてのテーマに本試の出題年と追試の出題年の両方が入っている', () => {
    for (const row of rotationAnalysisAdvanced) {
      expect(row.years.length, row.theme).toBeGreaterThan(4);
      expect(row.yearsSupplementary, `${row.theme} の追試情報`).toBeTruthy();
    }
  });

  it('予想度が ◎ / ○ / △ のいずれかで始まる（バッジ色分けの前提）', () => {
    for (const row of rotationAnalysisAdvanced) {
      expect(['◎', '○', '△'], `${row.theme}: ${row.prediction}`).toContain(row.prediction[0]);
    }
  });

  it('理論・無機・有機・高分子のすべての分野からテーマを拾っている', () => {
    const all = rotationAnalysisAdvanced.map((r) => r.theme).join('／');
    expect(all).toMatch(/気体|平衡|電気分解|反応速度/); // 理論
    expect(all).toMatch(/ハロゲン|製法|金属|錯イオン/); // 無機
    expect(all).toMatch(/異性体|アルコール|エステル|芳香族/); // 有機
    expect(all).toMatch(/糖類|アミノ酸|高分子/); // 高分子
  });
});

describe('TrendDataset（TrendModal に渡す表示データ）', () => {
  it('化学基礎のデータセットとまったく同じキーを持っている（同じ形式の分析）', () => {
    expect(Object.keys(chemistryAdvancedTrendDataset).sort()).toEqual(
      Object.keys(chemistryBasicTrendDataset).sort()
    );
  });

  it('overall / chapters / rotation が本ファイルの実データを指している', () => {
    expect(chemistryAdvancedTrendDataset.overall).toBe(overallTrendAdvanced);
    expect(chemistryAdvancedTrendDataset.chapters).toBe(chapterTrendsAdvanced);
    expect(chemistryAdvancedTrendDataset.rotation).toBe(rotationAnalysisAdvanced);
  });

  it('ヘッダーに「過去15年」「本試」「追試」が明記されている', () => {
    expect(chemistryAdvancedTrendDataset.headerTitle).toContain('15年');
    expect(chemistryAdvancedTrendDataset.headerTitle).toMatch(/本試/);
    expect(chemistryAdvancedTrendDataset.headerTitle).toMatch(/追試/);
    expect(chemistryAdvancedTrendDataset.headerSubtitle).toContain('2012');
    expect(chemistryAdvancedTrendDataset.headerSubtitle).toContain('2026');
  });

  it('センター→共通テスト比較表が3列そろっている', () => {
    expect(chemistryAdvancedTrendDataset.comparisonTable.length).toBeGreaterThanOrEqual(6);
    for (const row of chemistryAdvancedTrendDataset.comparisonTable) {
      expect(row).toHaveLength(3);
      row.forEach((cell) => expect(cell.length).toBeGreaterThan(0));
    }
  });

  it('最終メッセージに追試を活用する助言が入っている', () => {
    const all = chemistryAdvancedTrendDataset.finalMessages.join('');
    expect(chemistryAdvancedTrendDataset.finalMessages.length).toBeGreaterThanOrEqual(3);
    expect(all).toMatch(/追試/);
  });
});

describe('TrendModal の汎用化（化学基礎の表示を壊していないこと）', () => {
  const modal = read('src/components/TrendModal.tsx');

  it('dataset プロップを受け取り、省略時は化学基礎になる', () => {
    expect(modal).toContain('dataset?: TrendDataset');
    expect(modal).toContain('dataset = chemistryBasicTrendDataset');
  });

  it('固定文言ではなく dataset の値を描画している', () => {
    // ヘッダーは「章指定があればその章名／なければ dataset.headerTitle」の三項演算子
    expect(modal).toContain(': dataset.headerTitle}');
    expect(modal).toContain('{dataset.headerSubtitle}');
    expect(modal).toContain('{dataset.yearlyTableTitle}');
    expect(modal).toContain('{dataset.structurePrimaryLabel}');
    expect(modal).toContain('{dataset.structureSecondaryLabel}');
    expect(modal).toContain('{dataset.averageScoreNote}');
    expect(modal).toContain('{dataset.rotationIntro}');
    expect(modal).toContain('dataset.comparisonTable.map');
    expect(modal).toContain('dataset.finalMessages.map');
  });

  it('追試の列は、追試データを持つ科目のときだけ表示する', () => {
    expect(modal).toContain('hasSupplementary');
    expect(modal).toContain('row.supplementary');
    expect(modal).toContain('row.yearsSupplementary');
  });

  it('旧来の直接 import（overallTrend など）は残っていない', () => {
    expect(modal).not.toMatch(/import\s*\{[^}]*\boverallTrend\b/);
    expect(modal).not.toMatch(/import\s*\{[^}]*\brotationAnalysis\b/);
  });
});

describe('画面への配線', () => {
  const chapterSelection = read('src/components/ChapterSelection.tsx');
  const modeSelection = read('src/components/ModeSelection.tsx');

  it('単元選択画面が科目に応じて傾向データを切り替える', () => {
    expect(chapterSelection).toContain('chemistryAdvancedTrendDataset');
    expect(chapterSelection).toContain('const trendDataset = isAdvanced');
    expect(chapterSelection).toContain('dataset={trendDataset}');
  });

  it('化学の単元・章の傾向ボタンが、対応表の手書きではなくデータから自動生成される', () => {
    expect(chapterSelection).toContain('advancedChapterIdToTrendUnit');
    expect(chapterSelection).toContain('advancedRealTitleToChapterGroupTitle');
  });

  it('英語リスニングでは傾向ボタンを出さない（傾向データが無いため）', () => {
    expect(chapterSelection).toContain('isListening');
    expect(chapterSelection).toMatch(/trendUnitMap[\s\S]{0,200}isListening/);
  });

  it('モード選択画面で化学でも「共通テスト出題傾向」を開ける', () => {
    expect(modeSelection).toContain("subject === 'chemistry_basic' || isAdvanced");
    expect(modeSelection).toContain('isAdvanced ? chemistryAdvancedTrendDataset');
  });

  it('化学では2027年予想問題ボタンは出さない（まだ用意していないため）', () => {
    expect(modeSelection).toContain('onMockExam && !isAdvanced');
  });
});

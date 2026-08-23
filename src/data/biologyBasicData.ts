/**
 * ===================================================================
 * 生物基礎（共通テスト完全対応）データ
 * ===================================================================
 *
 * ■ 位置づけ
 *   chemistryData / mathData と同じ「骨格＋問題流し込み」方式。
 *   parts → chapters（章）→ practiceProblems（大問）の3層で、
 *   Quiz / Explanation / ChapterSelection / Home をすべて無改造で流用する。
 *
 * ■ 章構成の設計
 *   共通テスト「生物基礎」の学習指導要領の全範囲を 5 章で網羅する。
 *     第1章 生物の特徴（共通性・細胞・代謝・酵素・顕微鏡）
 *     第2章 遺伝子とその働き（DNA・複製・転写翻訳・ゲノム）
 *     第3章 体内環境の維持（体液・肝腎・自律神経・ホルモン・免疫）
 *     第4章 植生の多様性と遷移・バイオーム
 *     第5章 生態系とその保全
 *   定番のセンター・共通テスト対策講義が扱う頻出テーマを「範囲として」
 *   すべてカバーするが、問題文・数値・構成はすべて本アプリの
 *   オリジナルであり、既存教材・動画の転載は一切含まない。
 */

import {
  bioFeatureProblems,
  bioGeneProblems,
  bioHomeostasisProblems,
  bioVegetationProblems,
  bioEcosystemProblems,
} from './biologyBasicProblems';
import type { BiologyProblem } from './biologyBasicProblems';

export interface BiologyChapter {
  id: string;
  /** 単元名（アプリの単元名として表示） */
  abstractTitle: string;
  /** 章名（単元選択画面のタブ見出しになる） */
  realTitle: string;
  /** 扱う内容 */
  topics: string[];
  practiceProblems: any[];
  miniTest: any[];
}

export interface BiologyPart {
  id: string;
  title: string;
  chapters: BiologyChapter[];
}

/** 章を組み立てる補助関数（mathData の ch() と同じ役割） */
const ch = (
  id: string,
  realTitle: string,
  abstractTitle: string,
  topics: string[],
): BiologyChapter => ({
  id,
  abstractTitle,
  realTitle,
  topics,
  practiceProblems: [],
  miniTest: [],
});

export const biologyBasicData: { parts: BiologyPart[] } = {
  parts: [
    {
      id: 'bio_basic',
      title: '生物基礎（共通テスト完全対応）',
      chapters: [
        ch('bio1_1', '1章 生物の特徴', '① 生物の共通性・細胞・代謝・酵素・顕微鏡', [
          '生物の共通性と多様性（細胞・DNA・ATP・恒常性）',
          '原核細胞と真核細胞、細胞小器官の働き',
          '代謝（同化・異化）と ATP、呼吸と光合成',
          '酵素の性質（基質特異性・最適温度・最適pH）',
          '顕微鏡観察とミクロメーターの計算',
        ]),
        ch('bio2_1', '2章 遺伝子とその働き', '② DNA・複製・転写翻訳・ゲノム', [
          'DNA の構造（ヌクレオチド・二重らせん・塩基の相補性）',
          '遺伝子研究の歴史（グリフィス・アベリー・ハーシーとチェイス）',
          '半保存的複製と細胞周期・DNA 量の変化',
          '転写・翻訳とセントラルドグマ、コドン',
          'ゲノム・遺伝子発現の調節（パフ・分化）',
        ]),
        ch('bio3_1', '3章 体内環境の維持', '③ 体液・肝腎・自律神経・ホルモン・免疫', [
          '体液の組成と循環、血液凝固',
          '肝臓と腎臓の働き（尿生成・濃縮率）',
          '自律神経系（交感神経・副交感神経）と心臓の拍動調節',
          'ホルモンと血糖濃度の調節、糖尿病',
          '免疫（自然免疫・獲得免疫、体液性・細胞性免疫、予防接種と血清療法）',
        ]),
        ch('bio4_1', '4章 植生と遷移・バイオーム', '④ 植生・遷移・バイオーム', [
          '植生と相観・優占種、森林の階層構造',
          '光合成曲線（光補償点・光飽和点）と陽生・陰生植物',
          '一次遷移・二次遷移と極相、ギャップ更新',
          '世界のバイオーム（気温と降水量による分布）',
          '日本のバイオーム（水平分布・垂直分布・森林限界）',
        ]),
        ch('bio5_1', '5章 生態系とその保全', '⑤ 生態系・物質循環・環境保全', [
          '生態系の成り立ち（生産者・消費者・分解者、食物網・栄養段階）',
          '物質循環（炭素循環）とエネルギーの流れ、地球温暖化',
          '生態系のバランス（自然浄化・富栄養化・生物濃縮・外来生物）',
          '生物多様性と保全（里山・絶滅危惧種・環境アセスメント）',
        ]),
      ],
    },
  ],
};

/** 章 id → 問題配列の対応表 */
const BIO_PROBLEMS: Record<string, BiologyProblem[]> = {
  bio1_1: bioFeatureProblems,
  bio2_1: bioGeneProblems,
  bio3_1: bioHomeostasisProblems,
  bio4_1: bioVegetationProblems,
  bio5_1: bioEcosystemProblems,
};

(() => {
  for (const chapter of biologyBasicData.parts.flatMap((p) => p.chapters)) {
    const problems = BIO_PROBLEMS[chapter.id];
    if (problems && problems.length > 0) {
      chapter.practiceProblems = problems;
    }
  }
})();

/** 全単元をまとめて返す（Home の進捗集計などで使う） */
export function getAllBiologyChapters(): BiologyChapter[] {
  return biologyBasicData.parts.flatMap((p) => p.chapters);
}

/** 収録状況（単元数・問題数）。科目選択カードの表示に使う。 */
export function getBiologyStats() {
  const chapters = getAllBiologyChapters();
  const questions = chapters.reduce(
    (sum, c) => sum + (c.practiceProblems?.length || 0) + (c.miniTest?.length || 0),
    0,
  );
  // 化学側の stats と同じキー名（chapters / questions）で返す。
  return { chapters: chapters.length, questions };
}

/**
 * ===================================================================
 * 地理総合・地理探究　単元データ
 * ===================================================================
 *
 * ■ 構成の考え方
 *   共通テストの地理は「第1問・第2問…」という大問単位で出題されるので、
 *   英語リスニングと同じく
 *     タブ  = 大問（realTitle：'第1問'）
 *     単元  = 回（abstractTitle：'第1回 モンスーンアジアの気候と稲作'）
 *   という2階層にしている。
 *   ChapterSelection の共通処理（realTitle でタブにまとめる／
 *   splitTabTitle が '第1問' を Q1 と読む）にそのまま乗るため、
 *   画面側に地理専用の分岐を足す必要がない。
 *
 * ■ 収録状況
 *   第1問セット（第1回〜第5回・全25設問）のみ収録済み。
 *   第2問・第3問、および第6回以降は資料が届いた順に追加する。
 *
 * ■ データ形式
 *   biologyBasicData.ts と完全に同じ形（parts → chapters）。
 */

import { countProblemsInChapters } from './problemCount';
import { GEO_Q1_PROBLEMS } from './geographyQ1Problems';
import type { GeographyProblem } from './geographyQ1Problems';

export interface GeographyChapter {
  id: string;
  abstractTitle: string;
  realTitle: string;
  topics: string[];
  practiceProblems: any[];
  miniTest: any[];
}

export interface GeographyPart {
  id: string;
  title: string;
  chapters: GeographyChapter[];
}

/** 1単元（1回分）を作る補助。生物基礎の ch() と同じ役割。 */
const ch = (
  id: string,
  realTitle: string,
  abstractTitle: string,
  topics: string[],
): GeographyChapter => ({
  id,
  abstractTitle,
  realTitle,
  topics,
  practiceProblems: [],
  miniTest: [],
});

export const geographyData: { parts: GeographyPart[] } = {
  parts: [
    {
      id: 'geo_main',
      title: '地理総合・地理探究（共通テスト対応）',
      chapters: [
        ch('geo_q1_r1', '第1問', '第1回 モンスーンアジアの気候と稲作', [
          '気候グラフ（ハイサーグラフ）の読み取り',
          '季節風（モンスーン）の向きと時期',
          '米の生産量・輸出量と輸出依存度の計算',
          '二期作の成立条件（かんがい・冬季の気温）',
          '資料の限界（観測点の標高と気温の逓減）',
        ]),
        ch('geo_q1_r2', '第1問', '第2回 世界の人口構造と人口移動', [
          '人口ピラミッドの3類型（つぼ型・富士山型・変形）',
          '‰（パーミル）と％の換算、自然増加率の計算',
          '自然増減と社会増減（外国人労働者の流入）',
          '粗死亡率と年齢構成の関係',
          '人口構造の将来変化（後期高齢層の増加）',
        ]),
        ch('geo_q1_r3', '第1問', '第3回 地図と位置情報・地域調査', [
          '平均勾配の計算と単位換算（km → m）',
          '縮尺の計算と大小関係（分母が小さいほど大縮尺）',
          '扇状地の粒径・透水性と水無川・湧水',
          '土石流警戒区域の指定根拠（地形・地質）',
          'GISの重ね合わせによる防災まちづくり',
        ]),
        ch('geo_q1_r4', '第1問', '第4回 資源・エネルギーと国際関係', [
          'エネルギー自給率の推移とエネルギー革命',
          '2014年の急落（原発停止と化石燃料輸入増）',
          '化石燃料の輸入先の構成（原油・LNG・石炭）',
          'チョークポイント（ホルムズ海峡）と供給リスク',
          '主要国の自給率の背景（シェール革命・原子力）',
        ]),
        ch('geo_q1_r5', '第1問', '第5回 環境問題と食料生産の国際比較', [
          '冬小麦と春小麦の立地（越冬できるかと降水の季節）',
          'CO₂排出量の3指標（総量・1人あたり・累積）',
          '指標の選択で評価が変わるという視点',
          '単位収量（生産量÷収穫面積）の計算',
          '地中海式農業（冬小麦・オリーブ・かんがい）',
        ]),
      ],
    },
  ],
};

/** 章 id → 問題配列の対応表（geographyQ1Problems.ts 側で定義） */
const GEO_PROBLEMS: Record<string, GeographyProblem[]> = {
  ...GEO_Q1_PROBLEMS,
};

(() => {
  for (const chapter of geographyData.parts.flatMap((p) => p.chapters)) {
    const problems = GEO_PROBLEMS[chapter.id];
    if (problems && problems.length > 0) {
      chapter.practiceProblems = problems;
    }
  }
})();

/** 全単元をまとめて返す（Home の進捗集計などで使う） */
export function getAllGeographyChapters(): GeographyChapter[] {
  return geographyData.parts.flatMap((p) => p.chapters);
}

/**
 * 収録状況（単元数・大問数・設問数）。科目選択カードの表示に使う。
 *
 * ★数字をハードコードしない★
 *   この科目は「1回＝大問1つ＝設問5問」という形だが、
 *   カードに `chapters * 5` と書くと、
 *   ・設問が4問や6問の回を足した瞬間に表示が嘘になる
 *   ・第2問以降（設問数が違う）を足したときに気づけない
 *   ので、英文法の marks と同じやり方で subQuestions を実際に数える。
 *   （現在は 5回 × 5問 = 25 になるが、それは「数えた結果」であって前提ではない）
 */
export function getGeographyStats() {
  const chapters = getAllGeographyChapters();
  // 大問の数え方（ミニテスト＋演習）は data/problemCount.ts に集約している
  const questions = countProblemsInChapters(chapters);
  // 生徒が実際に解く「設問」の数＝各大問の subQuestions の合計
  const marks = chapters.reduce(
    (sum, c) =>
      sum +
      [...(c.practiceProblems || []), ...(c.miniTest || [])].reduce(
        (n, p: any) => n + (Array.isArray(p?.subQuestions) ? p.subQuestions.length : 0),
        0,
      ),
    0,
  );
  // 他科目の stats と同じキー名（chapters / questions）で返す。
  return { chapters: chapters.length, questions, marks };
}

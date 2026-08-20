/**
 * ===================================================================
 * 数学（数III 積分法「全パターン演習」）データ
 * ===================================================================
 *
 * ■ 位置づけ
 *   chemistryAdvancedData.ts と同じ「骨格＋問題流し込み」方式。
 *   parts → chapters（単元）→ practiceProblems（大問）の3層で、
 *   Quiz / Explanation / ChapterSelection / Home をすべて無改造で流用する。
 *
 * ■ 単元構成の設計（3教材の統合分析にもとづく独自体系）
 *   以下の3つの定番教材を「体系として」分析し、共通する学習順序を抽出した。
 *     ・不定積分は「基本公式 → f(ax+b) → 微分接触（置換の心）→ log型 →
 *       部分積分 → 部分分数 → 三角の次数下げ → 特殊置換」の順で積み上がる
 *     ・定積分は「偶奇性・King Property・区分求積・積分漸化式」など
 *       定積分でしか使えない技巧が独立の層になる
 *   という2層構造はどの教材でも一致しており、本データもこの順に並べる。
 *
 *   ★問題はすべてオリジナル（数値・関数の係数・出題文を変更）★
 *   パターン（解法の型）は数学の共有財産だが、問題そのものは
 *   数値・係数・構成を変えた本アプリ独自の問題として作成している。
 *
 * ■ 解答形式
 *   数式入力は Quiz.tsx の「数学記号パレット」（MathPalette）で行う。
 *   表記は次のルールに統一し、acceptedAnswers で表記ゆれを吸収する。
 *     ・積分定数は C（大文字）
 *     ・累乗は ^ （例: x^3）、分数は / （例: x^3/3）
 *     ・log は自然対数（底 e）。絶対値は log|x| のように | | で書く
 *     ・√ は √( ) 、π・θ・e はそのままの文字
 */

import {
  integralBasicProblems,
  integralLinearProblems,
  integralContactProblems,
  integralLogTypeProblems,
  integralByPartsProblems,
  integralPartialFractionProblems,
  integralTrigPowerProblems,
  integralSubstitutionProblems,
  integralDefiniteTechProblems,
  integralFunctionEqProblems,
} from './mathIntegralProblems';

/** 1つの単元。AdvancedChapter と同形（Quiz/ChapterSelection を流用するため）。 */
export interface MathChapter {
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

export interface MathPart {
  id: string;
  title: string;
  chapters: MathChapter[];
}

/** 章を組み立てる補助関数（chemistryAdvancedData の ch() と同じ役割） */
const ch = (
  id: string,
  realTitle: string,
  abstractTitle: string,
  topics: string[],
): MathChapter => ({
  id,
  abstractTitle,
  realTitle,
  topics,
  practiceProblems: [],
  miniTest: [],
});

export const mathData: { parts: MathPart[] } = {
  parts: [
    {
      id: 'math_integral',
      title: '数III 積分法（全パターン演習）',
      chapters: [
        // ---- 第1章 不定積分の全パターン ----
        ch('m1_1', '1章 不定積分の土台', '① 基本公式（累乗・指数・対数・三角）', [
          'x^n の積分（n が分数・負でも同じ）',
          '累乗根は指数に直す',
          'e^x・a^x・1/x の積分',
          'sin・cos・1/cos² の積分',
        ]),
        ch('m1_2', '1章 不定積分の土台', '② f(ax+b) 型（1/a 倍を忘れない）', [
          '∫f(ax+b)dx = (1/a)F(ax+b) + C',
          '(2x+1)^5・cos(3x)・e^(1-2x) 型',
        ]),
        ch('m1_3', '2章 置換積分と微分接触', '③ 微分接触型（置換積分の主役）', [
          '∫f(g(x))g\'(x)dx 型の発見',
          '「カタマリの微分が横にいるか」の判定',
          '慣れたら置換せずに直接積分する',
        ]),
        ch('m1_4', '2章 置換積分と微分接触', '④ log 型（分子が分母の微分）', [
          '∫f\'(x)/f(x)dx = log|f(x)| + C',
          'tan x の積分',
          '分子の次数が高いときは帯分数化してから',
        ]),
        ch('m1_5', '3章 部分積分', '⑤ 部分積分（消去型）', [
          '多項式 × (指数・三角) は多項式を微分して消す',
          'log x・多項式 × log は log を微分する側に',
          '(x)\' を補う一手（∫log x dx）',
        ]),
        ch('m1_6', '3章 部分積分', '⑥ 部分積分（同形出現・2回転）', [
          'e^x sin x 型：2回部分積分して同形を出す',
          '移項して 2I = … の形にする',
        ]),
        ch('m1_7', '4章 分数関数と部分分数分解', '⑦ 部分分数分解', [
          '1/{(x+a)(x+b)} 型の分解',
          '分子の次数 ≧ 分母なら先に割り算（帯分数化）',
          '恒等式による係数決定',
        ]),
        ch('m1_8', '5章 三角関数の積分', '⑧ sin・cos の n 乗（次数下げと接触）', [
          '奇数乗：1つ残して残りを 1-cos² などに変形（微分接触へ）',
          '偶数乗：半角公式で次数を下げる',
          'sin²・cos²・sin³・cos³ の使い分け',
        ]),
        ch('m1_9', '5章 三角関数の積分', '⑨ 積和公式・tan の処理', [
          'sin A cos B 型は積和公式で和に直す',
          'tan²x = 1/cos²x - 1 の利用',
        ]),
        ch('m1_10', '6章 特殊な置換', '⑩ x = a sinθ・x = a tanθ・その他の置換', [
          '√(a²-x²) は x = a sinθ',
          '1/(x²+a²) は x = a tanθ',
          '√(ax+b) は全体を t とおく',
          't = e^x・t = tan(x/2) などの定番置換',
        ]),
        // ---- 第2章 定積分の技巧 ----
        ch('m2_1', '7章 定積分の技巧', '⑪ 偶関数・奇関数と King Property', [
          '奇関数は対称区間で 0',
          '∫[a,b] f(x)dx = ∫[a,b] f(a+b-x)dx（King Property）',
          '足して2で割る技法',
        ]),
        ch('m2_2', '7章 定積分の技巧', '⑫ 定積分で表された関数・区分求積・漸化式', [
          '∫[a,b] f(t)dt は定数とおく',
          'd/dx ∫[a,x] f(t)dt = f(x)',
          '区分求積法 lim (1/n)Σf(k/n) = ∫[0,1] f(x)dx',
          '積分漸化式（部分積分で n を下げる）',
        ]),
      ],
    },
  ],
};

// =====================================================================
// 問題データの流し込み（chemistryAdvancedData と同じ方式）
// =====================================================================

/** 章ID → 演習問題の配列 */
const MATH_PROBLEMS: Record<string, any[]> = {
  m1_1: integralBasicProblems,
  m1_2: integralLinearProblems,
  m1_3: integralContactProblems,
  m1_4: integralLogTypeProblems,
  m1_5: integralByPartsProblems.filter((p) => p.id.includes('elim')),
  m1_6: integralByPartsProblems.filter((p) => p.id.includes('cyc')),
  m1_7: integralPartialFractionProblems,
  m1_8: integralTrigPowerProblems.filter((p) => !p.id.includes('prodsum')),
  m1_9: integralTrigPowerProblems.filter((p) => p.id.includes('prodsum')),
  m1_10: integralSubstitutionProblems,
  m2_1: integralDefiniteTechProblems,
  m2_2: integralFunctionEqProblems,
};

(() => {
  for (const chapter of mathData.parts.flatMap((p) => p.chapters)) {
    const problems = MATH_PROBLEMS[chapter.id];
    if (problems && problems.length > 0) {
      chapter.practiceProblems = problems;
    }
  }
})();

/** 全単元をまとめて返す（Home の進捗集計などで使う） */
export function getAllMathChapters(): MathChapter[] {
  return mathData.parts.flatMap((p) => p.chapters);
}

/** 収録状況（単元数・問題数）。科目選択カードの表示に使う。 */
export function getMathStats() {
  const chapters = getAllMathChapters();
  const questions = chapters.reduce(
    (sum, c) => sum + (c.practiceProblems?.length || 0) + (c.miniTest?.length || 0),
    0,
  );
  // 化学側の stats と同じキー名（chapters / questions）で返す。
  // SubjectSelection の科目カードがそのまま埋め込めるようにするため。
  return { chapters: chapters.length, questions };
}

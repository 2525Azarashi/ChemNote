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
import {
  vectorBasicProblems,
  vectorDotProblems,
  vectorPositionProblems,
  vectorIntersectionProblems,
  vectorAreaProblems,
  vectorEquationProblems,
  vectorSpaceBasicProblems,
  vectorSpacePlaneProblems,
} from './mathVectorProblems';
import {
  probCountingProblems,
  probArrangeProblems,
  probBasicProblems,
  probComplementProblems,
  probRepeatProblems,
  probConditionalProblems,
  probExpectationProblems,
  probMixedProblems,
} from './mathProbabilityProblems';
import {
  intDivisorProblems,
  intEuclidProblems,
  intFactorProblems,
  intModProblems,
  intBoundProblems,
} from './mathIntegerProblems';

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
    {
      id: 'math_vector',
      title: 'ベクトル（全パターン演習）',
      chapters: [
        // ---- 1章 平面ベクトルの基本 ----
        ch('mv_1', '1章 平面ベクトルの基本', '① 演算・成分・大きさ・単位ベクトル', [
          '成分計算（x成分・y成分を別々に）',
          '大きさ |a| = √(x²+y²)',
          '単位ベクトル a/|a|・平行＝実数倍',
        ]),
        ch('mv_2', '1章 平面ベクトルの基本', '② 内積・なす角・垂直条件・|a+tb|の最小', [
          '内積の2つの顔（成分の式・大きさとなす角の式）',
          '垂直 ⇔ 内積0、平行 ⇔ x1y2-x2y1=0',
          '|a+tb| は2乗して t の2次関数へ',
        ]),
        // ---- 2章 位置ベクトルと図形 ----
        ch('mv_3', '2章 位置ベクトルと図形', '③ 内分・外分・重心', [
          '内分点 (na+mb)/(m+n)（たすきがけ）',
          '外分は「マイナス付き内分」で処理',
          '重心 (a+b+c)/3',
        ]),
        ch('mv_4', '2章 位置ベクトルと図形', '④ 交点（係数比較）・共線条件 s+t=1', [
          '同じ点を2通りに表して1次独立から係数比較',
          '直線AB上 ⇔ 係数の和が1',
          'メネラウス・チェバによる検算',
        ]),
        // ---- 3章 面積とベクトル方程式 ----
        ch('mv_5', '3章 面積とベクトル方程式', '⑤ 三角形の面積・正射影ベクトル', [
          'S = (1/2)|x1y2 - x2y1|（成分の面積公式）',
          'S = (1/2)√(|a|²|b|²-(a·b)²)（内積の面積公式）',
          '正射影 (a·b/|a|²)a と垂線の足',
        ]),
        ch('mv_6', '3章 面積とベクトル方程式', '⑥ 直線・円のベクトル方程式', [
          'p = a + td（通る点＋方向の実数倍）',
          '法線ベクトルは係数を並べる (a, b)',
          '|p-c|=r は円、(p-a)·(p-b)=0 は直径の両端',
        ]),
        // ---- 4章 空間ベクトル ----
        ch('mv_7', '4章 空間ベクトル', '⑦ 空間の成分・内積・垂直・距離', [
          '公式は平面と同じ（z成分が増えるだけ）',
          '空間のなす角・垂直条件',
          '空間の距離・中点',
        ]),
        ch('mv_8', '4章 空間ベクトル', '⑧ 共面条件 s+t+u=1・球面', [
          '平面ABC上 ⇔ 係数の和が1（共面条件）',
          '球面 (x-a)²+(y-b)²+(z-c)²=r²',
          '球の切り口は直角三角形で処理',
        ]),
      ],
    },
    {
      id: 'math_probability',
      title: '場合の数・確率（全パターン演習）',
      chapters: [
        // ---- 1章 場合の数の土台 ----
        ch('mp_1', '1章 場合の数の土台', '① P と C の使い分け・最短経路', [
          '並べる（順序あり）は P、選ぶだけは C',
          '隣り合う→かたまり、隣り合わない→隙間',
          '同じものを含む順列・最短経路は C で数える',
        ]),
        ch('mp_2', '1章 場合の数の土台', '② 円順列・重複順列・組分け', [
          '円順列 (n-1)!・じゅず順列はさらに÷2',
          '重複順列 n^r（空きあり）と余事象',
          '同じ人数の組分けは組数の階乗で割る',
        ]),
        // ---- 2章 確率の基本 ----
        ch('mp_3', '2章 確率の基本', '③ 同様に確からしい・サイコロ・玉', [
          'すべてを区別して数える（同様に確からしく）',
          '最大値・最小値は「以下」の差で数える',
          '同時に取り出す＝組合せ C',
        ]),
        ch('mp_4', '2章 確率の基本', '④ 余事象・和事象', [
          'P(A∪B) = P(A) + P(B) - P(A∩B)（重なりを引く）',
          '「少なくとも」「〜以上」は余事象のサイン',
          '倍数の個数は商の切り捨てで数える',
        ]),
        // ---- 3章 独立試行・反復試行 ----
        ch('mp_5', '3章 独立試行・反復試行', '⑤ 反復試行・優勝決定の確率', [
          'nCr p^r (1-p)^(n-r)（nCr は場所の選び方）',
          '場所指定の問題では nCr を掛けない',
          '「n回目に決着」は最後の1回を固定する',
        ]),
        // ---- 4章 条件付き確率・期待値 ----
        ch('mp_6', '4章 条件付き確率・期待値', '⑥ 条件付き確率・原因の確率', [
          'P_A(B) = P(A∩B)/P(A)（分母が縮む）',
          '樹形図で経路の確率を足す',
          '結果から原因をさかのぼるベイズ型',
        ]),
        ch('mp_7', '4章 条件付き確率・期待値', '⑦ 期待値', [
          '期待値＝値×確率の総和',
          '和の期待値は期待値の和（線形性）',
          '確率の合計が1になるかで検算',
        ]),
        ch('mp_8', '4章 条件付き確率・期待値', '⑧ 総合問題（パターンの融合）', [
          '数え上げ×確率×条件付きの融合',
          '反復試行×点の移動（移動量を回数の式に）',
          'どの型の組合せかを言語化して解く',
        ]),
      ],
    },
    {
      id: 'math_integer',
      title: '整数（全パターン演習）',
      chapters: [
        // ---- 1章 約数・倍数 ----
        ch('mi_1', '1章 約数・倍数と素因数分解', '① 約数の個数・総和・最大公約数と最小公倍数', [
          '約数の個数は (指数+1) の積',
          '約数の総和は等比数列の和の積',
          'gcd が G なら a=Gm, b=Gn（m,n 互いに素）とおく',
        ]),
        // ---- 2章 互除法と不定方程式 ----
        ch('mi_2', '2章 互除法と1次不定方程式', '② ユークリッドの互除法・ax+by=c の整数解', [
          'gcd(a, b) = gcd(b, r) で小さくする',
          '特殊解→辺々引いて一般解',
          '「互いに素だから倍数」の論法',
        ]),
        // ---- 3章 因数分解の利用 ----
        ch('mi_3', '3章 因数分解の利用', '③ 積の形×約数の組合せ・素数条件', [
          'xy+ax+by=c は (x+b)(y+a)=c+ab に直す',
          '平方の差は (x+y)(x-y) に分解',
          '素数 ⇔ 積に分解したら片方が1',
        ]),
        // ---- 4章 余りと絞り込み ----
        ch('mi_4', '4章 余りによる分類と絞り込み', '④ 余りの計算・余りで分類する証明', [
          'べき乗の余りは循環する（周期を見つける）',
          '3で割った余りで分類（n=3k, 3k+1, 3k+2）',
          '連続整数の積の倍数性',
        ]),
        ch('mi_5', '4章 余りによる分類と絞り込み', '⑤ 範囲の絞り込み・n進法', [
          '対称式は大小を仮定して最小の文字を評価',
          '1/x + 1/y 型は不等式で範囲を絞る',
          'n進法の相互変換（余りを下から読む）',
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
  // ---- ベクトル ----
  mv_1: vectorBasicProblems,
  mv_2: vectorDotProblems,
  mv_3: vectorPositionProblems,
  mv_4: vectorIntersectionProblems,
  mv_5: vectorAreaProblems,
  mv_6: vectorEquationProblems,
  mv_7: vectorSpaceBasicProblems,
  mv_8: vectorSpacePlaneProblems,
  // ---- 場合の数・確率 ----
  mp_1: probCountingProblems,
  mp_2: probArrangeProblems,
  mp_3: probBasicProblems,
  mp_4: probComplementProblems,
  mp_5: probRepeatProblems,
  mp_6: probConditionalProblems,
  mp_7: probExpectationProblems,
  mp_8: probMixedProblems,
  // ---- 整数 ----
  mi_1: intDivisorProblems,
  mi_2: intEuclidProblems,
  mi_3: intFactorProblems,
  mi_4: intModProblems,
  mi_5: intBoundProblems,
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

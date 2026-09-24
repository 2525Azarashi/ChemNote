/**
 * ===================================================================
 * 数学「入試レベル強化」問題（全 33 単元 × 2 大問 = 66 大問）
 * ===================================================================
 *
 * ■ 位置づけ
 *   既存の 65 大問（各単元 1〜3 大問）に加えて、各単元へ入試標準〜やや難の
 *   大問を 2 つずつ追加する。mathData.ts の MATH_PROBLEMS で既存問題の
 *   後ろに spread して注入する（既存問題・ID・採点ロジックは一切変更しない）。
 *
 * ■ 品質保証
 *   このファイルは math-plus/gen_ts.py が自動生成する。
 *   全サブ設問の正答は sympy / Python 全列挙で機械検算済み
 *   （検算に通らない問題はここに出力されない）。
 *   手で編集せず、math-plus/*.py を直して再生成すること。
 *
 * ■ 表記ルールは既存ファイルと同じ（^ / / √( ) / log|x| / 積分定数 C）。
 */

import { sq } from './mathProblemKit';
import type { MathProblem } from './mathProblemKit';

// ---- m1_1 ----
export const plus_m1_1: MathProblem[] = [
  {
    id: "q_m1_1_plus_mix",
    category: "基本公式（融合：展開してから公式）",
    text: `次の不定積分を求めよ。積分定数は C とする。

（1）∫ (x^2 - 1)^2/x^2 dx
（2）∫ (√x + 1)^2 dx
（3）∫ (e^x - 1)(e^x + 1) dx
（4）∫ (2sin x + 1/cos^2 x) dx`,
    subQuestions: [
      sq("q_m1_1_plus_mix_1", "（1）∫ (x^2 - 1)^2/x^2 dx", "x^3/3 - 2x - 1/x + C", ["x^3/3-2x-1/x+C", "(1/3)x^3 - 2x - 1/x + C", "x^3/3 - 2x - x^(-1) + C"]),
      sq("q_m1_1_plus_mix_2", "（2）∫ (√x + 1)^2 dx", "x^2/2 + (4/3)x√x + x + C", ["x^2/2+(4/3)x√x+x+C", "x^2/2 + (4/3)x^(3/2) + x + C", "(1/2)x^2 + (4/3)x√x + x + C", "x^2/2 + 4x√x/3 + x + C"]),
      sq("q_m1_1_plus_mix_3", "（3）∫ (e^x - 1)(e^x + 1) dx", "e^(2x)/2 - x + C", ["e^(2x)/2-x+C", "(1/2)e^(2x) - x + C", "e^2x/2 - x + C"]),
      sq("q_m1_1_plus_mix_4", "（4）∫ (2sin x + 1/cos^2 x) dx", "-2cos x + tan x + C", ["-2cosx+tanx+C", "tan x - 2cos x + C", "tanx-2cosx+C", "-2cos(x) + tan(x) + C"]),
    ],
    explanation: `基本公式しか使わないのに、入試では「まず展開・約分して公式が使える形に直す」一手が要求されます。

（1）(x^2 - 1)^2/x^2 = (x^4 - 2x^2 + 1)/x^2 = x^2 - 2 + x^(-2)。項別に積分して x^3/3 - 2x - 1/x + C。
　　x^(-2) の積分が -x^(-1) = -1/x になる符号を落とさないこと。

（2）(√x + 1)^2 = x + 2√x + 1 = x + 2x^(1/2) + 1。
　　∫ 2x^(1/2) dx = 2·x^(3/2)/(3/2) = (4/3)x^(3/2) = (4/3)x√x。よって x^2/2 + (4/3)x√x + x + C。

（3）(e^x - 1)(e^x + 1) = e^(2x) - 1。∫ e^(2x) dx = e^(2x)/2（f(ax+b) 型で 1/2 倍）。答え e^(2x)/2 - x + C。

（4）∫ sin x dx = -cos x、∫ 1/cos^2 x dx = tan x。答え -2cos x + tan x + C。

「展開・約分・指数に直す」で全部が基本公式に落ちる、という感覚を身につけると、見た目が複雑な問題でも手が止まりません。答えは必ず微分して元に戻るか確かめましょう。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m1_1_plus_cond",
    category: "基本公式（条件から積分定数を決める）",
    text: `関数 f(x) は f'(x) = 3x^2 - 4x - 1 かつ f(0) = 2 を満たす。また、x > 0 で定義された関数 g(x) は g'(x) = e^x + 1/x かつ g(1) = e を満たす。

（1）f(x) を求めよ。
（2）f(x) = 0 の解のうち最大のものを求めよ。
（3）g(x) を求めよ。`,
    subQuestions: [
      sq("q_m1_1_plus_cond_1", "（1）f(x)", "x^3 - 2x^2 - x + 2", ["x^3-2x^2-x+2", "f(x) = x^3 - 2x^2 - x + 2", "(x-1)(x-2)(x+1)", "(x+1)(x-1)(x-2)"]),
      sq("q_m1_1_plus_cond_2", "（2）最大の解", "2", ["x = 2", "x=2"]),
      sq("q_m1_1_plus_cond_3", "（3）g(x)", "e^x + log x", ["e^x+logx", "g(x) = e^x + log x", "e^x + ln x", "e^x+log(x)", "e^x + log(x)"]),
    ],
    explanation: `「導関数と1点の値」から元の関数を決める問題は、①不定積分 ②条件で C を決める、の2段階です。

（1）f(x) = ∫(3x^2 - 4x - 1)dx = x^3 - 2x^2 - x + C。f(0) = C = 2。よって f(x) = x^3 - 2x^2 - x + 2。

（2）f(1) = 1 - 2 - 1 + 2 = 0 なので x - 1 を因数にもつ。割り算して f(x) = (x - 1)(x^2 - x - 2) = (x - 1)(x - 2)(x + 1)。
　　解は x = -1, 1, 2 で、最大は 2。検算：f(2) = 8 - 8 - 2 + 2 = 0 ✓。

（3）g(x) = ∫(e^x + 1/x)dx = e^x + log x + C（x > 0 なので log|x| = log x）。g(1) = e + 0 + C = e より C = 0。よって g(x) = e^x + log x。

積分定数 C を「答えに +C と書く」だけで終わらせず、条件があれば必ず値まで決める。入試の小問(1)で C を決め忘れると、(2)(3) がすべて崩れます。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- m1_2 ----
export const plus_m1_2: MathProblem[] = [
  {
    id: "q_m1_2_plus_mix",
    category: "f(ax+b) 型（累乗・三角・指数の混合）",
    text: `次の不定積分を求めよ。積分定数は C とする。

（1）∫ (3x - 2)^4 dx
（2）∫ cos(2x + 1) dx
（3）∫ e^(3 - 2x) dx
（4）∫ 1/(1 - 4x)^2 dx`,
    subQuestions: [
      sq("q_m1_2_plus_mix_1", "（1）∫ (3x - 2)^4 dx", "(3x-2)^5/15 + C", ["(3x-2)^5/15+C", "(1/15)(3x-2)^5 + C", "1/15(3x-2)^5+C"]),
      sq("q_m1_2_plus_mix_2", "（2）∫ cos(2x + 1) dx", "sin(2x+1)/2 + C", ["sin(2x+1)/2+C", "(1/2)sin(2x+1) + C", "1/2sin(2x+1)+C"]),
      sq("q_m1_2_plus_mix_3", "（3）∫ e^(3 - 2x) dx", "-e^(3-2x)/2 + C", ["-e^(3-2x)/2+C", "-(1/2)e^(3-2x) + C", "-1/2e^(3-2x)+C"]),
      sq("q_m1_2_plus_mix_4", "（4）∫ 1/(1 - 4x)^2 dx", "1/(4(1-4x)) + C", ["1/(4(1-4x))+C", "1/(4 - 16x) + C", "1/(4-16x)+C", "(1/4)(1-4x)^(-1) + C"]),
    ],
    explanation: `∫ f(ax + b) dx = (1/a) F(ax + b) + C。「中身を微分した a で割る」だけですが、a が負のとき・中身が (1 - 4x) のように x の係数が後ろにあるときに符号を落とすのが典型ミスです。

（1）(3x-2)^5/5 を 3 で割って (3x-2)^5/15 + C。

（2）sin(2x+1) を 2 で割って sin(2x+1)/2 + C。

（3）e^(3-2x) の中身の微分は -2。e^(3-2x)/(-2) = -e^(3-2x)/2 + C。

（4）(1-4x)^(-2) の積分は (1-4x)^(-1)/(-1) を中身の微分 -4 で割る：(1-4x)^(-1)/((-1)(-4)) = (1-4x)^(-1)/4 = 1/(4(1-4x)) + C。負×負で正になる。

確認は「答えを微分して元に戻るか」。特に (4) は微分すると -1·(1-4x)^(-2)·(-4)/4 = 1/(1-4x)^2 で戻ります。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m1_2_plus_def",
    category: "f(ax+b) 型（定積分・面積への応用）",
    text: `（1）定積分 ∫[0→1] (2x + 1)^3 dx を求めよ。
（2）定積分 ∫[0→π/6] sin(3x) dx を求めよ。
（3）曲線 y = e^(2x) と x 軸、および直線 x = 0、x = 1 で囲まれた部分の面積 S を求めよ。`,
    subQuestions: [
      sq("q_m1_2_plus_def_1", "（1）∫[0→1] (2x + 1)^3 dx", "10", []),
      sq("q_m1_2_plus_def_2", "（2）∫[0→π/6] sin(3x) dx", "1/3", ["0.333…"]),
      sq("q_m1_2_plus_def_3", "（3）面積 S", "(e^2 - 1)/2", ["(e^2-1)/2", "e^2/2 - 1/2", "(1/2)(e^2 - 1)", "1/2(e^2-1)", "S = (e^2 - 1)/2"]),
    ],
    explanation: `f(ax+b) 型は定積分・面積計算の中で「1/a を忘れる」形で失点しやすい単元です。

（1）∫(2x+1)^3 dx = (2x+1)^4/8。[0→1] で (3^4 - 1^4)/8 = (81 - 1)/8 = 10。

（2）∫sin(3x) dx = -cos(3x)/3。[0→π/6] で -cos(π/2)/3 + cos(0)/3 = 0 + 1/3 = 1/3。

（3）0 ≤ x ≤ 1 で e^(2x) > 0 なので S = ∫[0→1] e^(2x) dx = [e^(2x)/2]_0^1 = e^2/2 - 1/2 = (e^2 - 1)/2。

面積の問題では「符号」（グラフが x 軸より上か）を確認してから積分する。指数関数は常に正なので、そのまま積分すれば面積になります。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- m1_3 ----
export const plus_m1_3: MathProblem[] = [
  {
    id: "q_m1_3_plus_mix",
    category: "微分接触（カタマリの微分が横にいる）",
    text: `次の不定積分を求めよ。積分定数は C とする。

（1）∫ x(x^2 + 1)^3 dx
（2）∫ sin^3 x cos x dx
（3）∫ x e^(x^2) dx
（4）∫ (log x)^2/x dx`,
    subQuestions: [
      sq("q_m1_3_plus_mix_1", "（1）∫ x(x^2 + 1)^3 dx", "(x^2+1)^4/8 + C", ["(x^2+1)^4/8+C", "(1/8)(x^2+1)^4 + C", "1/8(x^2+1)^4+C"]),
      sq("q_m1_3_plus_mix_2", "（2）∫ sin^3 x cos x dx", "sin^4 x/4 + C", ["sin^4x/4+C", "(1/4)sin^4 x + C", "(sin x)^4/4 + C", "1/4sin^4x+C", "(sinx)^4/4+C"]),
      sq("q_m1_3_plus_mix_3", "（3）∫ x e^(x^2) dx", "e^(x^2)/2 + C", ["e^(x^2)/2+C", "(1/2)e^(x^2) + C", "1/2e^(x^2)+C"]),
      sq("q_m1_3_plus_mix_4", "（4）∫ (log x)^2/x dx", "(log x)^3/3 + C", ["(logx)^3/3+C", "(1/3)(log x)^3 + C", "1/3(logx)^3+C", "(ln x)^3/3 + C"]),
    ],
    explanation: `∫ f(g(x)) g'(x) dx = F(g(x)) + C。「カタマリ g(x) の微分 g'(x) が（定数倍を除いて）横にいるか」を最初に確認します。

（1）カタマリ x^2 + 1、その微分 2x が横の x の 2 倍。∫(x^2+1)^3 · x dx = (1/2)∫(x^2+1)^3 · 2x dx = (1/2)·(x^2+1)^4/4 = (x^2+1)^4/8 + C。

（2）カタマリ sin x、微分 cos x がそのまま横にいる。sin^4 x/4 + C。

（3）カタマリ x^2、微分 2x。x = (1/2)·2x なので e^(x^2)/2 + C。

（4）カタマリ log x、微分 1/x が横にいる。(log x)^3/3 + C。

「置換 t = g(x) をしてもよいが、慣れたら見ただけで F(g(x)) を書く」のがスピードの差になります。定数倍の調整（1/2 など）を微分で検算する習慣を。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m1_3_plus_sqrt",
    category: "微分接触（根号・分数・定積分）",
    text: `（1）∫ x/√(x^2 + 4) dx を求めよ（積分定数は C）。
（2）∫ (2x + 1)/(x^2 + x + 3)^2 dx を求めよ（積分定数は C）。
（3）定積分 ∫[0→√3] x√(x^2 + 1) dx を求めよ。`,
    subQuestions: [
      sq("q_m1_3_plus_sqrt_1", "（1）∫ x/√(x^2 + 4) dx", "√(x^2+4) + C", ["√(x^2+4)+C", "(x^2+4)^(1/2) + C"]),
      sq("q_m1_3_plus_sqrt_2", "（2）∫ (2x + 1)/(x^2 + x + 3)^2 dx", "-1/(x^2+x+3) + C", ["-1/(x^2+x+3)+C", "-(x^2+x+3)^(-1) + C"]),
      sq("q_m1_3_plus_sqrt_3", "（3）∫[0→√3] x√(x^2 + 1) dx", "7/3", []),
    ],
    explanation: `（1）カタマリ x^2 + 4、微分 2x。x/√(x^2+4) = (1/2)(x^2+4)^(-1/2)·2x。∫ = (1/2)·(x^2+4)^(1/2)/(1/2) = √(x^2+4) + C。
　　「1/√(カタマリ) × カタマリの微分」は √(カタマリ) の2倍…ではなく、係数 1/2 と 2 が打ち消して係数 1 になる。

（2）カタマリ x^2 + x + 3、微分 2x + 1 がぴったり分子。∫ u^(-2) du = -u^(-1)。よって -1/(x^2+x+3) + C。

（3）∫ x√(x^2+1) dx = (1/2)·(x^2+1)^(3/2)/(3/2) = (x^2+1)^(3/2)/3。[0→√3] で (4^(3/2) - 1)/3 = (8 - 1)/3 = 7/3。

分子に「分母（の中身）の微分」が見えたら微分接触。これが見えないときは部分分数分解や置換を疑う、という判断順序を身につけましょう。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- m1_4 ----
export const plus_m1_4: MathProblem[] = [
  {
    id: "q_m1_4_plus_mix",
    category: "log 型（分子が分母の微分）",
    text: `次の不定積分を求めよ。積分定数は C とする。

（1）∫ (2x - 3)/(x^2 - 3x + 5) dx
（2）∫ e^x/(e^x + 2) dx
（3）∫ cos x/(sin x + 2) dx
（4）∫ 1/(x log x) dx（x > 1）`,
    subQuestions: [
      sq("q_m1_4_plus_mix_1", "（1）", "log(x^2 - 3x + 5) + C", ["log(x^2-3x+5)+C", "log|x^2 - 3x + 5| + C", "log|x^2-3x+5|+C", "ln(x^2-3x+5)+C"]),
      sq("q_m1_4_plus_mix_2", "（2）", "log(e^x + 2) + C", ["log(e^x+2)+C", "log|e^x + 2| + C", "ln(e^x+2)+C"]),
      sq("q_m1_4_plus_mix_3", "（3）", "log(sin x + 2) + C", ["log(sinx+2)+C", "log|sin x + 2| + C", "log|sinx+2|+C", "ln(sin x + 2) + C"]),
      sq("q_m1_4_plus_mix_4", "（4）", "log(log x) + C", ["log(logx)+C", "log|log x| + C", "log|logx|+C", "ln(ln x) + C", "log(log(x)) + C"]),
    ],
    explanation: `∫ f'(x)/f(x) dx = log|f(x)| + C。分子が「分母の微分」になっているかを確認します。分母が常に正なら絶対値は外せます。

（1）(x^2 - 3x + 5)' = 2x - 3 が分子そのまま。判別式 9 - 20 < 0 で分母は常に正。log(x^2 - 3x + 5) + C。

（2）(e^x + 2)' = e^x。log(e^x + 2) + C。

（3）(sin x + 2)' = cos x。sin x + 2 ≥ 1 > 0。log(sin x + 2) + C。

（4）1/(x log x) = (1/x)/(log x)。(log x)' = 1/x が分子。log(log x) + C（x > 1 なので log x > 0）。

「分子 ÷ 分母の微分」が定数になるかを確かめ、定数倍で調整する。分母が 2 次で分子が 1 次なら、まず log 型を疑うのが定石です。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m1_4_plus_tan",
    category: "log 型（帯分数化・tan・定積分）",
    text: `（1）∫ tan x dx を求めよ（積分定数は C）。
（2）∫ (x^2 + 1)/(x - 1) dx を求めよ（積分定数は C）。
（3）定積分 ∫[0→1] (2x + 4)/(x^2 + 4x + 3) dx を求めよ。`,
    subQuestions: [
      sq("q_m1_4_plus_tan_1", "（1）∫ tan x dx", "-log|cos x| + C", ["-log|cosx|+C", "-log|cos(x)| + C", "log|1/cos x| + C", "-ln|cos x| + C"]),
      sq("q_m1_4_plus_tan_2", "（2）∫ (x^2 + 1)/(x - 1) dx", "x^2/2 + x + 2log|x - 1| + C", ["x^2/2+x+2log|x-1|+C", "(1/2)x^2 + x + 2log|x-1| + C", "x^2/2 + x + 2 log|x - 1| + C", "1/2x^2+x+2log|x-1|+C"]),
      sq("q_m1_4_plus_tan_3", "（3）∫[0→1] (2x + 4)/(x^2 + 4x + 3) dx", "log(8/3)", ["log 8 - log 3", "3log2 - log3", "log8-log3", "ln(8/3)"]),
    ],
    explanation: `（1）tan x = sin x/cos x。分子 sin x は分母 cos x の微分の -1 倍。∫ tan x dx = -∫(-sin x)/cos x dx = -log|cos x| + C。

（2）分子の次数 ≧ 分母の次数なので、まず割り算（帯分数化）：(x^2 + 1)/(x - 1) = x + 1 + 2/(x - 1)。
　　項別に積分して x^2/2 + x + 2log|x - 1| + C。「割ってから log」が鉄則。

（3）(x^2 + 4x + 3)' = 2x + 4 が分子そのまま。[log(x^2 + 4x + 3)]_0^1 = log 8 - log 3 = log(8/3)。
　　定積分なので絶対値は区間内の符号で判断：0 ≤ x ≤ 1 で x^2 + 4x + 3 > 0。

log 型で最も多い失敗は「分子の次数が高いのに、割らずに log を書く」こと。次数比較を最初の一手に。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- m1_5 ----
export const plus_m1_5: MathProblem[] = [
  {
    id: "q_m1_5_plus_mix",
    category: "部分積分（多項式を微分して消す）",
    text: `次の不定積分を求めよ。積分定数は C とする。

（1）∫ x cos 2x dx
（2）∫ (2x + 1) e^(-x) dx
（3）∫ x^2 log x dx
（4）∫ log(x + 1) dx`,
    subQuestions: [
      sq("q_m1_5_plus_mix_1", "（1）∫ x cos 2x dx", "(x sin 2x)/2 + (cos 2x)/4 + C", ["xsin2x/2+cos2x/4+C", "(1/2)x sin 2x + (1/4)cos 2x + C", "x sin(2x)/2 + cos(2x)/4 + C", "1/2xsin2x+1/4cos2x+C"]),
      sq("q_m1_5_plus_mix_2", "（2）∫ (2x + 1) e^(-x) dx", "-(2x + 3)e^(-x) + C", ["-(2x+3)e^(-x)+C", "-(2x+3)/e^x + C", "(-2x-3)e^(-x) + C", "-2xe^(-x) - 3e^(-x) + C"]),
      sq("q_m1_5_plus_mix_3", "（3）∫ x^2 log x dx", "(x^3 log x)/3 - x^3/9 + C", ["x^3logx/3-x^3/9+C", "(1/3)x^3 log x - (1/9)x^3 + C", "(x^3/3)log x - x^3/9 + C", "1/3x^3logx-1/9x^3+C"]),
      sq("q_m1_5_plus_mix_4", "（4）∫ log(x + 1) dx", "(x + 1)log(x + 1) - x + C", ["(x+1)log(x+1)-x+C", "(x+1)log(x+1) - (x+1) + C"]),
    ],
    explanation: `部分積分 ∫ f g' dx = f g - ∫ f' g dx。「微分して簡単になるもの（多項式・log）を f に、積分しやすいもの（指数・三角）を g' に」。

（1）f = x, g' = cos 2x → g = sin 2x/2。x·sin 2x/2 - ∫ sin 2x/2 dx = x sin 2x/2 + cos 2x/4 + C。

（2）f = 2x + 1, g' = e^(-x) → g = -e^(-x)。-(2x+1)e^(-x) + ∫ 2e^(-x) dx = -(2x+1)e^(-x) - 2e^(-x) = -(2x+3)e^(-x) + C。

（3）log は微分する側。f = log x, g' = x^2 → g = x^3/3。(x^3/3)log x - ∫(x^3/3)(1/x)dx = (x^3/3)log x - x^3/9 + C。

（4）(x + 1)' = 1 を補って f = log(x+1), g' = 1 → g = x + 1 と取る。(x+1)log(x+1) - ∫(x+1)·1/(x+1) dx = (x+1)log(x+1) - x + C。
　　g = x と取っても正しいが、g = x + 1 と取ると残りの積分が 1 になって速い。

優先順位「log > 多項式 > 三角・指数」で微分する側を決めると迷いません。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m1_5_plus_def",
    category: "部分積分（定積分・面積）",
    text: `（1）定積分 ∫[0→π] x sin x dx を求めよ。
（2）定積分 ∫[1→e] log x dx を求めよ。
（3）定積分 ∫[0→1] x e^(2x) dx を求めよ。`,
    subQuestions: [
      sq("q_m1_5_plus_def_1", "（1）∫[0→π] x sin x dx", "π", ["pi"]),
      sq("q_m1_5_plus_def_2", "（2）∫[1→e] log x dx", "1", []),
      sq("q_m1_5_plus_def_3", "（3）∫[0→1] x e^(2x) dx", "(e^2 + 1)/4", ["(e^2+1)/4", "e^2/4 + 1/4", "(1/4)(e^2 + 1)", "1/4(e^2+1)"]),
    ],
    explanation: `定積分の部分積分は [f g] の値を先に計算し、残りの積分を別に処理すると計算ミスが減ります。

（1）[-x cos x]_0^π + ∫[0→π] cos x dx = (-π·(-1) - 0) + [sin x]_0^π = π + 0 = π。

（2）[x log x]_1^e - ∫[1→e] 1 dx = (e·1 - 0) - (e - 1) = 1。「∫log x dx = x log x - x」を知っていれば [x log x - x]_1^e = (e - e) - (0 - 1) = 1。

（3）[x e^(2x)/2]_0^1 - ∫[0→1] e^(2x)/2 dx = e^2/2 - [e^(2x)/4]_0^1 = e^2/2 - (e^2/4 - 1/4) = e^2/4 + 1/4 = (e^2 + 1)/4。

面積・体積の問題で頻出する形ばかりです。(3) のように「e^2/2 - e^2/4」の通分でミスしやすいので、最後に数値（e ≈ 2.72）で大きさの感覚を確認するのも有効です。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- m1_6 ----
export const plus_m1_6: MathProblem[] = [
  {
    id: "q_m1_6_plus_mix",
    category: "部分積分（同形出現）",
    text: `次の不定積分を求めよ。積分定数は C とする。

（1）∫ e^x sin x dx
（2）∫ e^(2x) cos x dx
（3）∫ e^(-x) sin 2x dx`,
    subQuestions: [
      sq("q_m1_6_plus_mix_1", "（1）∫ e^x sin x dx", "e^x(sin x - cos x)/2 + C", ["e^x(sinx-cosx)/2+C", "(1/2)e^x(sin x - cos x) + C", "(e^x/2)(sin x - cos x) + C", "1/2e^x(sinx-cosx)+C", "(e^x sin x - e^x cos x)/2 + C"]),
      sq("q_m1_6_plus_mix_2", "（2）∫ e^(2x) cos x dx", "e^(2x)(2cos x + sin x)/5 + C", ["e^(2x)(2cosx+sinx)/5+C", "(1/5)e^(2x)(2cos x + sin x) + C", "(e^(2x)/5)(sin x + 2cos x) + C", "e^(2x)(sin x + 2cos x)/5 + C", "1/5e^(2x)(2cosx+sinx)+C"]),
      sq("q_m1_6_plus_mix_3", "（3）∫ e^(-x) sin 2x dx", "-e^(-x)(sin 2x + 2cos 2x)/5 + C", ["-e^(-x)(sin2x+2cos2x)/5+C", "-(1/5)e^(-x)(sin 2x + 2cos 2x) + C", "-(e^(-x)/5)(sin 2x + 2cos 2x) + C", "-(sin 2x + 2cos 2x)/(5e^x) + C", "-1/5e^(-x)(sin2x+2cos2x)+C"]),
    ],
    explanation: `「指数 × 三角」は部分積分を 2 回行うと元の積分 I が再登場する（同形出現）。移項して I について解きます。

（1）I = ∫ e^x sin x dx。e^x を積分する側に固定。
　I = e^x sin x - ∫ e^x cos x dx = e^x sin x - (e^x cos x + ∫ e^x sin x dx) = e^x(sin x - cos x) - I。
　∴ 2I = e^x(sin x - cos x)、I = e^x(sin x - cos x)/2 + C。

（2）I = ∫ e^(2x) cos x dx。e^(2x) を積分（1/2 倍を忘れない）。
　I = (1/2)e^(2x) cos x + (1/2)∫ e^(2x) sin x dx = (1/2)e^(2x) cos x + (1/2){(1/2)e^(2x) sin x - (1/2) I}
　∴ (5/4)I = e^(2x)(2cos x + sin x)/4 → I = e^(2x)(2cos x + sin x)/5 + C。

（3）I = ∫ e^(-x) sin 2x dx。e^(-x) を積分（符号に注意）。
　I = -e^(-x) sin 2x + 2∫ e^(-x) cos 2x dx = -e^(-x) sin 2x + 2{-e^(-x) cos 2x - 2 I}
　∴ 5I = -e^(-x)(sin 2x + 2cos 2x) → I = -e^(-x)(sin 2x + 2cos 2x)/5 + C。

【検算のコツ】 ∫ e^(ax) sin bx dx = e^(ax)(a sin bx - b cos bx)/(a²+b²) + C、∫ e^(ax) cos bx dx = e^(ax)(a cos bx + b sin bx)/(a²+b²) + C。
（1）は a=1,b=1、（2）は a=2,b=1、（3）は a=-1,b=2 に当てはめて一致を確認できます。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m1_6_plus_def",
    category: "部分積分（2回転・定積分）",
    text: `（1）定積分 ∫[0→π] e^x sin x dx を求めよ。
（2）不定積分 ∫ sin(log x) dx を求めよ（積分定数は C）。
（3）不定積分 ∫ (log x)^2 dx を求めよ（積分定数は C）。`,
    subQuestions: [
      sq("q_m1_6_plus_def_1", "（1）∫[0→π] e^x sin x dx", "(e^π + 1)/2", ["(e^π+1)/2", "(e^pi+1)/2", "e^π/2 + 1/2", "(1/2)(e^π + 1)", "1/2(e^π+1)"]),
      sq("q_m1_6_plus_def_2", "（2）∫ sin(log x) dx", "x{sin(log x) - cos(log x)}/2 + C", ["x{sin(logx)-cos(logx)}/2+C", "x(sin(log x) - cos(log x))/2 + C", "(x/2)(sin(log x) - cos(log x)) + C", "(1/2)x(sin(log x) - cos(log x)) + C", "x(sin(logx)-cos(logx))/2+C", "1/2x(sin(logx)-cos(logx))+C"]),
      sq("q_m1_6_plus_def_3", "（3）∫ (log x)^2 dx", "x(log x)^2 - 2x log x + 2x + C", ["x(logx)^2-2xlogx+2x+C", "x{(log x)^2 - 2log x + 2} + C", "x((logx)^2-2logx+2)+C", "x(log x)^2 - 2(x log x - x) + C"]),
    ],
    explanation: `（1）不定積分 e^x(sin x - cos x)/2 を使って
　[e^x(sin x - cos x)/2]_0^π = e^π(0 - (-1))/2 - e^0(0 - 1)/2 = e^π/2 + 1/2 = (e^π + 1)/2。
　部分積分を定積分のまま 2 回行い、2I = [e^x(sin x - cos x)]_0^π と移項しても同じ。

（2）I = ∫ sin(log x) dx。(x)' = 1 を補って部分積分。
　I = x sin(log x) - ∫ x·cos(log x)·(1/x) dx = x sin(log x) - ∫ cos(log x) dx
　　= x sin(log x) - {x cos(log x) + ∫ sin(log x) dx} = x sin(log x) - x cos(log x) - I
　∴ I = x{sin(log x) - cos(log x)}/2 + C。「log の中身」でも同形が出る典型例。

（3）(x)' = 1 を補い、(log x)^2 を微分する側に。
　∫ (log x)^2 dx = x(log x)^2 - ∫ x·2log x·(1/x) dx = x(log x)^2 - 2∫ log x dx = x(log x)^2 - 2(x log x - x) + C
　　= x(log x)^2 - 2x log x + 2x + C。
　同形は出ないが「2 回転」で片付く形。∫ log x dx = x log x - x を暗記しておくと 1 手で終わります。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- m1_7 ----
export const plus_m1_7: MathProblem[] = [
  {
    id: "q_m1_7_plus_mix",
    category: "部分分数分解（基本〜重解）",
    text: `次の不定積分を求めよ。積分定数は C とする。

（1）∫ 1/(x^2 - 1) dx
（2）∫ (3x + 1)/(x^2 + x - 2) dx
（3）∫ 1/{x(x + 1)^2} dx
（4）∫ x^3/(x^2 - 1) dx`,
    subQuestions: [
      sq("q_m1_7_plus_mix_1", "（1）∫ 1/(x^2 - 1) dx", "(1/2)log|(x - 1)/(x + 1)| + C", ["(1/2)log|(x-1)/(x+1)|+C", "1/2log|(x-1)/(x+1)|+C", "(1/2)(log|x-1| - log|x+1|) + C", "(1/2)log|x-1| - (1/2)log|x+1| + C", "log|(x-1)/(x+1)|/2 + C"]),
      sq("q_m1_7_plus_mix_2", "（2）∫ (3x + 1)/(x^2 + x - 2) dx", "(5/3)log|x + 2| + (4/3)log|x - 1| + C", ["(5/3)log|x+2|+(4/3)log|x-1|+C", "5/3log|x+2| + 4/3log|x-1| + C", "(4/3)log|x-1| + (5/3)log|x+2| + C", "(1/3)(5log|x+2| + 4log|x-1|) + C"]),
      sq("q_m1_7_plus_mix_3", "（3）∫ 1/{x(x + 1)^2} dx", "log|x/(x + 1)| + 1/(x + 1) + C", ["log|x/(x+1)|+1/(x+1)+C", "log|x| - log|x+1| + 1/(x+1) + C", "log|x|-log|x+1|+1/(x+1)+C", "1/(x+1) + log|x/(x+1)| + C"]),
      sq("q_m1_7_plus_mix_4", "（4）∫ x^3/(x^2 - 1) dx", "x^2/2 + (1/2)log|x^2 - 1| + C", ["x^2/2+(1/2)log|x^2-1|+C", "(1/2)x^2 + (1/2)log|x^2-1| + C", "x^2/2 + log|x^2-1|/2 + C", "(x^2 + log|x^2-1|)/2 + C", "1/2x^2+1/2log|x^2-1|+C"]),
    ],
    explanation: `部分分数分解の手順：① 分子の次数 ≧ 分母なら割り算 ② 分母を因数分解 ③ 恒等式で係数決定（数値代入が速い）。

（1）1/(x²-1) = 1/{(x-1)(x+1)} = (1/2){1/(x-1) - 1/(x+1)}。
　∫ = (1/2)(log|x-1| - log|x+1|) = (1/2)log|(x-1)/(x+1)| + C。

（2）x²+x-2 = (x+2)(x-1)。(3x+1)/{(x+2)(x-1)} = A/(x+2) + B/(x-1) とおき、3x+1 = A(x-1) + B(x+2)。
　x=1: 4 = 3B → B = 4/3。x=-2: -5 = -3A → A = 5/3。
　∫ = (5/3)log|x+2| + (4/3)log|x-1| + C。

（3）重解 (x+1)² を含む場合は A/x + B/(x+1) + D/(x+1)² の 3 項が必要。
　1 = A(x+1)² + Bx(x+1) + Dx。x=0: A=1。x=-1: D = -1。x² の係数: A + B = 0 → B = -1。
　∫ = log|x| - log|x+1| + 1/(x+1) + C = log|x/(x+1)| + 1/(x+1) + C。
　（1/(x+1)² の積分は -1/(x+1)。D=-1 なので符号が反転して +1/(x+1)。）

（4）分子の次数が高いので先に割る：x³/(x²-1) = x + x/(x²-1)。
　x/(x²-1) は分子が分母の微分の 1/2 なので log 型：(1/2)log|x²-1|。
　∫ = x²/2 + (1/2)log|x²-1| + C。部分分数に分けなくても log 型で一発、が入試での時短ポイント。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m1_7_plus_def",
    category: "部分分数分解（定積分と log の整理）",
    text: `次の定積分を求めよ。

（1）∫[2→3] 1/(x^2 - x) dx
（2）∫[0→1] (x + 3)/{(x + 1)(x + 2)} dx
（3）∫[1→2] 1/{x^2(x + 1)} dx`,
    subQuestions: [
      sq("q_m1_7_plus_def_1", "（1）∫[2→3] 1/(x^2 - x) dx", "log(4/3)", ["log 4/3", "2log2 - log3", "log4 - log3", "log(4)-log(3)"]),
      sq("q_m1_7_plus_def_2", "（2）∫[0→1] (x + 3)/{(x + 1)(x + 2)} dx", "log(8/3)", ["log 8/3", "3log2 - log3", "log8 - log3", "3log(2)-log(3)"]),
      sq("q_m1_7_plus_def_3", "（3）∫[1→2] 1/{x^2(x + 1)} dx", "1/2 + log(3/4)", ["1/2+log(3/4)", "log(3/4) + 1/2", "1/2 + log3 - 2log2", "1/2 + log 3 - 2 log 2", "1/2 - log(4/3)", "(1/2) + log(3/4)"]),
    ],
    explanation: `（1）1/(x²-x) = 1/{x(x-1)} = 1/(x-1) - 1/x。
　[log|(x-1)/x|]_2^3 = log(2/3) - log(1/2) = log(4/3)。

（2）(x+3)/{(x+1)(x+2)} = A/(x+1) + B/(x+2)、x+3 = A(x+2) + B(x+1)。x=-1: A=2、x=-2: B=-1。
　[2log(x+1) - log(x+2)]_0^1 = (2log2 - log3) - (0 - log2) = 3log2 - log3 = log(8/3)。

（3）1/{x²(x+1)} = A/x + B/x² + D/(x+1)。1 = Ax(x+1) + B(x+1) + Dx²。
　x=0: B=1。x=-1: D=1。x² の係数: A + D = 0 → A=-1。
　[-log x - 1/x + log(x+1)]_1^2 = (-log2 - 1/2 + log3) - (0 - 1 + log2) = log3 - 2log2 + 1/2 = 1/2 + log(3/4)。

【log の整理】答えは log(4/3) のように 1 つの log にまとめるのが標準。log(3/4) = -log(4/3) なので、(3) は 1/2 - log(4/3) とも書けます。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- m1_8 ----
export const plus_m1_8: MathProblem[] = [
  {
    id: "q_m1_8_plus_mix",
    category: "sin・cos の n 乗（奇数乗・偶数乗・混合）",
    text: `次の不定積分を求めよ。積分定数は C とする。

（1）∫ sin^3 x dx
（2）∫ cos^4 x dx
（3）∫ sin^2 x cos^3 x dx
（4）∫ sin^2 x cos^2 x dx`,
    subQuestions: [
      sq("q_m1_8_plus_mix_1", "（1）∫ sin^3 x dx", "-cos x + cos^3 x/3 + C", ["-cosx+cos^3x/3+C", "cos^3 x/3 - cos x + C", "-cos x + (1/3)cos^3 x + C", "(1/3)cos^3x - cosx + C", "-cosx+1/3cos^3x+C"]),
      sq("q_m1_8_plus_mix_2", "（2）∫ cos^4 x dx", "3x/8 + sin 2x/4 + sin 4x/32 + C", ["3x/8+sin2x/4+sin4x/32+C", "(3/8)x + (1/4)sin 2x + (1/32)sin 4x + C", "(12x + 8sin 2x + sin 4x)/32 + C", "3/8x+1/4sin2x+1/32sin4x+C"]),
      sq("q_m1_8_plus_mix_3", "（3）∫ sin^2 x cos^3 x dx", "sin^3 x/3 - sin^5 x/5 + C", ["sin^3x/3-sin^5x/5+C", "(1/3)sin^3 x - (1/5)sin^5 x + C", "1/3sin^3x-1/5sin^5x+C", "(sin x)^3/3 - (sin x)^5/5 + C"]),
      sq("q_m1_8_plus_mix_4", "（4）∫ sin^2 x cos^2 x dx", "x/8 - sin 4x/32 + C", ["x/8-sin4x/32+C", "(1/8)x - (1/32)sin 4x + C", "(4x - sin 4x)/32 + C", "1/8x-1/32sin4x+C"]),
    ],
    explanation: `「奇数乗は 1 つ残して微分接触、偶数乗は半角公式で次数下げ」が鉄則。

（1）sin³x = (1 - cos²x) sin x。cos x = t とおくと dt = -sin x dx。
　∫ (1 - t²)(-dt) = -t + t³/3 → -cos x + cos³x/3 + C。

（2）cos⁴x = {(1 + cos 2x)/2}² = (1 + 2cos 2x + cos²2x)/4。cos²2x = (1 + cos 4x)/2 でさらに下げる。
　= 3/8 + (1/2)cos 2x + (1/8)cos 4x。積分して 3x/8 + sin 2x/4 + sin 4x/32 + C。

（3）cos が奇数乗 → cos x を 1 つ残す：sin²x(1 - sin²x) cos x。sin x = t。
　∫ (t² - t⁴) dt = t³/3 - t⁵/5 → sin³x/3 - sin⁵x/5 + C。

（4）両方偶数乗 → sin x cos x = (1/2)sin 2x：sin²x cos²x = (1/4)sin²2x = (1 - cos 4x)/8。
　∫ = x/8 - sin 4x/32 + C。

【判断フロー】 (a) どちらかが奇数乗 → 奇数乗側を 1 つ残して置換 (b) 両方偶数乗 → 2倍角・半角で次数下げ。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m1_8_plus_def",
    category: "sin・cos の n 乗（定積分・ウォリス）",
    text: `次の定積分を求めよ。

（1）∫[0→π/2] sin^3 x dx
（2）∫[0→π] sin^2 x dx
（3）∫[0→π/2] cos^5 x dx
（4）∫[0→π/4] sin^2 2x dx`,
    subQuestions: [
      sq("q_m1_8_plus_def_1", "（1）∫[0→π/2] sin^3 x dx", "2/3", ["(2/3)"]),
      sq("q_m1_8_plus_def_2", "（2）∫[0→π] sin^2 x dx", "π/2", ["pi/2", "(1/2)π"]),
      sq("q_m1_8_plus_def_3", "（3）∫[0→π/2] cos^5 x dx", "8/15", ["(8/15)"]),
      sq("q_m1_8_plus_def_4", "（4）∫[0→π/4] sin^2 2x dx", "π/8", ["pi/8", "(1/8)π"]),
    ],
    explanation: `（1）sin³x = (1 - cos²x)sin x。cos x = t：x:0→π/2 で t:1→0。∫[0→1] (1 - t²) dt = 1 - 1/3 = 2/3。

（2）sin²x = (1 - cos 2x)/2。[x/2 - sin 2x/4]_0^π = π/2。
　「区間 [0, π] で sin²x の平均値は 1/2」と覚えると即答できる。

（3）cos⁵x = (1 - sin²x)² cos x。sin x = t：t:0→1。∫[0→1] (1 - 2t² + t⁴) dt = 1 - 2/3 + 1/5 = 8/15。
　【ウォリス積分】∫[0→π/2] cos^n x dx = ∫[0→π/2] sin^n x dx で、n 奇数のとき (n-1)!!/n!!：n=5 → (4·2)/(5·3·1) = 8/15。n=3 → 2/3 で (1) とも一致。

（4）sin²2x = (1 - cos 4x)/2。[x/2 - sin 4x/8]_0^(π/4) = π/8 - 0 = π/8。

面積・体積・回転体で sin², cos², sin³ の定積分は必ず出るので、(1)(2)(3) の値は暗算レベルにしておきましょう。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- m1_9 ----
export const plus_m1_9: MathProblem[] = [
  {
    id: "q_m1_9_plus_mix",
    category: "積和公式・tan の n 乗",
    text: `次の不定積分を求めよ。積分定数は C とする。

（1）∫ sin 3x sin x dx
（2）∫ cos 3x sin x dx
（3）∫ tan^2 x dx
（4）∫ tan^3 x dx`,
    subQuestions: [
      sq("q_m1_9_plus_mix_1", "（1）∫ sin 3x sin x dx", "sin 2x/4 - sin 4x/8 + C", ["sin2x/4-sin4x/8+C", "(1/4)sin 2x - (1/8)sin 4x + C", "sin(2x)/4 - sin(4x)/8 + C", "1/4sin2x-1/8sin4x+C", "(2sin 2x - sin 4x)/8 + C"]),
      sq("q_m1_9_plus_mix_2", "（2）∫ cos 3x sin x dx", "cos 2x/4 - cos 4x/8 + C", ["cos2x/4-cos4x/8+C", "(1/4)cos 2x - (1/8)cos 4x + C", "cos(2x)/4 - cos(4x)/8 + C", "1/4cos2x-1/8cos4x+C", "-cos 4x/8 + cos 2x/4 + C"]),
      sq("q_m1_9_plus_mix_3", "（3）∫ tan^2 x dx", "tan x - x + C", ["tanx-x+C", "-x + tan x + C", "tan(x) - x + C"]),
      sq("q_m1_9_plus_mix_4", "（4）∫ tan^3 x dx", "tan^2 x/2 + log|cos x| + C", ["tan^2x/2+log|cosx|+C", "(1/2)tan^2 x + log|cos x| + C", "1/2tan^2x+log|cosx|+C", "1/(2cos^2 x) + log|cos x| + C", "(1/2)tan^2x+log|cosx|+C"]),
    ],
    explanation: `（1）積和公式 sin A sin B = -(1/2){cos(A+B) - cos(A-B)}。
　sin 3x sin x = (cos 2x - cos 4x)/2。∫ = sin 2x/4 - sin 4x/8 + C。

（2）sin A cos B = (1/2){sin(A+B) + sin(A-B)}。A = x, B = 3x：sin x cos 3x = (1/2){sin 4x + sin(-2x)} = (sin 4x - sin 2x)/2。
　∫ = -cos 4x/8 + cos 2x/4 + C。sin(-2x) = -sin 2x の符号処理が要注意。

（3）tan²x = 1/cos²x - 1（1 + tan² = 1/cos²）。∫ = tan x - x + C。

（4）tan³x = tan x(1/cos²x - 1) = tan x/cos²x - tan x。
　tan x/cos²x は tan x = t とおくと dt = dx/cos²x なので ∫ t dt = tan²x/2。
　∫ tan x dx = -log|cos x|。よって ∫ tan³x dx = tan²x/2 + log|cos x| + C。
　（tan²x/2 = 1/(2cos²x) - 1/2 なので、1/(2cos²x) + log|cos x| + C も同じ答え。）

積和公式は「係数 1/2」「差の角の符号」でミスが集中するので、微分して戻る検算を習慣に。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m1_9_plus_def",
    category: "積和・tan の定積分",
    text: `次の定積分を求めよ。

（1）∫[0→π/2] sin 2x cos x dx
（2）∫[0→π/4] tan^2 x dx
（3）∫[π/6→π/3] 1/(sin^2 x cos^2 x) dx
（4）∫[0→π/2] cos 2x cos 3x dx`,
    subQuestions: [
      sq("q_m1_9_plus_def_1", "（1）∫[0→π/2] sin 2x cos x dx", "2/3", ["(2/3)"]),
      sq("q_m1_9_plus_def_2", "（2）∫[0→π/4] tan^2 x dx", "1 - π/4", ["1-π/4", "1 - pi/4", "(4 - π)/4", "-π/4 + 1"]),
      sq("q_m1_9_plus_def_3", "（3）∫[π/6→π/3] 1/(sin^2 x cos^2 x) dx", "4√3/3", ["(4√3)/3", "4/√3", "(4/3)√3", "4√(3)/3", "4/√(3)"]),
      sq("q_m1_9_plus_def_4", "（4）∫[0→π/2] cos 2x cos 3x dx", "3/5", ["(3/5)"]),
    ],
    explanation: `（1）積和：sin 2x cos x = (1/2)(sin 3x + sin x)。
　(1/2)[-cos 3x/3 - cos x]_0^(π/2) = (1/2){0 - (-1/3 - 1)} = 2/3。
　【別解】sin 2x cos x = 2sin x cos²x → cos x = t で ∫[0→1] 2t² dt = 2/3。微分接触が見えれば置換の方が速い。

（2）tan²x = 1/cos²x - 1。[tan x - x]_0^(π/4) = 1 - π/4。

（3）1/(sin²x cos²x) = (sin²x + cos²x)/(sin²x cos²x) = 1/cos²x + 1/sin²x。
　[tan x - 1/tan x]_(π/6)^(π/3) = (√3 - 1/√3) - (1/√3 - √3) = 2√3 - 2/√3 = 4/√3 = 4√3/3。
　「1 = sin² + cos² を分子に補う」は分数三角関数の必殺技。

（4）cos A cos B = (1/2){cos(A+B) + cos(A-B)}。cos 2x cos 3x = (1/2)(cos 5x + cos x)。
　(1/2)[sin 5x/5 + sin x]_0^(π/2) = (1/2)(1/5 + 1) = 3/5。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- m1_10 ----
export const plus_m1_10: MathProblem[] = [
  {
    id: "q_m1_10_plus_mix",
    category: "特殊な置換（√・e^x・全体置換）",
    text: `次の不定積分を求めよ。積分定数は C とする。

（1）∫ x√(x + 2) dx
（2）∫ x/√(1 - x^2) dx
（3）∫ 1/{x√(x + 1)} dx　（x > 0）
（4）∫ e^(2x)/(e^x + 1) dx`,
    subQuestions: [
      sq("q_m1_10_plus_mix_1", "（1）∫ x√(x + 2) dx", "(2/5)(x + 2)^2√(x + 2) - (4/3)(x + 2)√(x + 2) + C", ["(2/5)(x+2)^2√(x+2)-(4/3)(x+2)√(x+2)+C", "(2/5)(x+2)^(5/2) - (4/3)(x+2)^(3/2) + C", "2(x+2)^(5/2)/5 - 4(x+2)^(3/2)/3 + C", "(2/15)(3x - 4)(x+2)√(x+2) + C", "2(3x-4)(x+2)√(x+2)/15 + C"]),
      sq("q_m1_10_plus_mix_2", "（2）∫ x/√(1 - x^2) dx", "-√(1 - x^2) + C", ["-√(1-x^2)+C", "-(1-x^2)^(1/2) + C", "C - √(1-x^2)"]),
      sq("q_m1_10_plus_mix_3", "（3）∫ 1/{x√(x + 1)} dx", "log|(√(x + 1) - 1)/(√(x + 1) + 1)| + C", ["log|(√(x+1)-1)/(√(x+1)+1)|+C", "log((√(x+1)-1)/(√(x+1)+1)) + C", "log|√(x+1)-1| - log|√(x+1)+1| + C", "log(√(x+1)-1) - log(√(x+1)+1) + C"]),
      sq("q_m1_10_plus_mix_4", "（4）∫ e^(2x)/(e^x + 1) dx", "e^x - log(e^x + 1) + C", ["e^x-log(e^x+1)+C", "e^x - log|e^x+1| + C", "e^x-log|e^x+1|+C", "-log(e^x+1) + e^x + C"]),
    ],
    explanation: `（1）√(x+2) = t とおく（x = t² - 2, dx = 2t dt）。
　∫ (t² - 2)·t·2t dt = ∫ (2t⁴ - 4t²) dt = (2/5)t⁵ - (4/3)t³ = (2/5)(x+2)²√(x+2) - (4/3)(x+2)√(x+2) + C。
　共通因数でくくると (2/15)(3x - 4)(x+2)√(x+2) + C。「x = t² - 2 に置き直す」手順を忘れない。

（2）分子 x は分母の中身 (1 - x²) の微分 -2x の -1/2 倍 → 微分接触。
　∫ x(1 - x²)^(-1/2) dx = -(1/2)·2(1 - x²)^(1/2) = -√(1 - x²) + C。x = sinθ と置く必要はない。

（3）√(x+1) = t（x = t² - 1, dx = 2t dt）。
　∫ 2t/{(t² - 1)t} dt = ∫ 2/(t² - 1) dt = ∫ {1/(t-1) - 1/(t+1)} dt = log|(t-1)/(t+1)|
　→ log|(√(x+1) - 1)/(√(x+1) + 1)| + C。「√ の全体置換 → 部分分数分解」の 2 段構え。

（4）e^x = t（dx = dt/t）。e^(2x)/(e^x+1) dx = t/(t+1) dt = {1 - 1/(t+1)} dt。
　∫ = t - log(t+1) = e^x - log(e^x + 1) + C。
　【別解】e^(2x)/(e^x+1) = e^x - e^x/(e^x+1) と変形すれば、後半は log 型で一発。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m1_10_plus_def",
    category: "特殊な置換（x = a sinθ・x = a tanθ の定積分）",
    text: `次の定積分を求めよ。

（1）∫[0→1] x^2√(1 - x^2) dx
（2）∫[0→√3] 1/(x^2 + 3) dx
（3）∫[-1→0] 1/(x^2 + 2x + 2) dx
（4）∫[0→4] 1/(1 + √x) dx`,
    subQuestions: [
      sq("q_m1_10_plus_def_1", "（1）∫[0→1] x^2√(1 - x^2) dx", "π/16", ["pi/16", "(1/16)π"]),
      sq("q_m1_10_plus_def_2", "（2）∫[0→√3] 1/(x^2 + 3) dx", "√3π/12", ["(√3/12)π", "π/(4√3)", "√3 π/12", "π√3/12", "(√3)π/12", "sqrt(3)pi/12"]),
      sq("q_m1_10_plus_def_3", "（3）∫[-1→0] 1/(x^2 + 2x + 2) dx", "π/4", ["pi/4", "(1/4)π"]),
      sq("q_m1_10_plus_def_4", "（4）∫[0→4] 1/(1 + √x) dx", "4 - 2log 3", ["4-2log3", "4 - 2log(3)", "4 - 2 log 3", "-2log3 + 4", "2(2 - log 3)", "4-log9", "4 - log 9"]),
    ],
    explanation: `（1）x = sinθ（θ: 0→π/2、dx = cosθ dθ、√(1-x²) = cosθ）。
　∫[0→π/2] sin²θ cos²θ dθ = ∫ (1/4)sin²2θ dθ = (1/8)∫[0→π/2] (1 - cos 4θ) dθ = (1/8)(π/2) = π/16。

（2）x = √3 tanθ（dx = √3/cos²θ dθ、x² + 3 = 3/cos²θ）。x: 0→√3 で tanθ: 0→1、θ: 0→π/4。
　∫[0→π/4] (cos²θ/3)(√3/cos²θ) dθ = (√3/3)∫[0→π/4] dθ = (√3/3)(π/4) = √3π/12。
　【公式】∫ 1/(x²+a²) dx は x = a tanθ で (1/a)θ。a = √3、θ = π/4 → π/(4√3) = √3π/12。

（3）x² + 2x + 2 = (x+1)² + 1。x + 1 = tanθ（x: -1→0 で θ: 0→π/4）。
　∫[0→π/4] cos²θ·(1/cos²θ) dθ = ∫[0→π/4] dθ = π/4。「平方完成してから x + 1 を tan に置く」。

（4）√x = t（x = t², dx = 2t dt、t: 0→2）。∫[0→2] 2t/(1+t) dt = 2∫[0→2] {1 - 1/(1+t)} dt = 2[t - log(1+t)]_0^2 = 2(2 - log 3) = 4 - 2log 3。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- m2_1 ----
export const plus_m2_1: MathProblem[] = [
  {
    id: "q_m2_1_plus_mix",
    category: "偶関数・奇関数の見抜き",
    text: `次の定積分を求めよ。

（1）∫[-π/2→π/2] (x^3 cos x + sin^2 x) dx
（2）∫[-1→1] (x^2 + 1)e^(x^2)·x dx
（3）∫[-2→2] (x + 1)^2 dx
（4）∫[-π→π] x sin x dx`,
    subQuestions: [
      sq("q_m2_1_plus_mix_1", "（1）∫[-π/2→π/2] (x^3 cos x + sin^2 x) dx", "π/2", ["pi/2", "(1/2)π"]),
      sq("q_m2_1_plus_mix_2", "（2）∫[-1→1] (x^2 + 1)e^(x^2)·x dx", "0", ["ゼロ"]),
      sq("q_m2_1_plus_mix_3", "（3）∫[-2→2] (x + 1)^2 dx", "28/3", ["(28/3)"]),
      sq("q_m2_1_plus_mix_4", "（4）∫[-π→π] x sin x dx", "2π", ["2pi", "2 π"]),
    ],
    explanation: `対称区間 [-a, a] では「奇関数 → 0、偶関数 → 2∫[0→a]」。積分する前に各項の偶奇を判定するだけで計算量が激減します。

（1）x³cos x は（奇）×（偶）＝奇 → 0。sin²x は偶。
　∫ = 2∫[0→π/2] sin²x dx = 2·(π/4) = π/2。

（2）(x²+1)e^(x²) は偶、それに x（奇）をかけているので全体は奇関数 → 0。
　e^(x²) は初等関数で積分できないが、偶奇を見れば計算不要。「積分できない形が対称区間に出たら奇関数を疑う」。

（3）展開して x² + 2x + 1。2x は奇 → 0。x² + 1 は偶。
　∫ = 2∫[0→2] (x² + 1) dx = 2(8/3 + 2) = 28/3。

（4）x sin x は（奇）×（奇）＝偶。∫ = 2∫[0→π] x sin x dx = 2[-x cos x + sin x]_0^π = 2π。

【偶奇の掛け算表】偶×偶＝偶、奇×奇＝偶、偶×奇＝奇。x^n（n 偶数）・cos・|x| が偶、x^n（n 奇数）・sin・tan が奇。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m2_1_plus_king",
    category: "King Property（x → a+b-x の置換）",
    text: `（1）I = ∫[0→π/2] cos x/(sin x + cos x) dx を求めよ。
（2）I = ∫[0→π] x sin x/(1 + cos^2 x) dx について、x = π - t と置換して I を 2 通りに表し、I の値を求めよ。
（3）∫[0→π/4] log(1 + tan x) dx を求めよ。`,
    subQuestions: [
      sq("q_m2_1_plus_king_1", "（1）I", "π/4", ["pi/4", "(1/4)π"]),
      sq("q_m2_1_plus_king_2", "（2）I", "π^2/4", ["pi^2/4", "(π^2)/4", "(1/4)π^2", "π²/4"]),
      sq("q_m2_1_plus_king_3", "（3）∫[0→π/4] log(1 + tan x) dx", "(π/8)log 2", ["(π/8)log2", "π log 2/8", "πlog2/8", "(π log 2)/8", "(pi/8)log2", "(1/8)π log 2", "π/8 log 2"]),
    ],
    explanation: `King Property：∫[a→b] f(x) dx = ∫[a→b] f(a + b - x) dx（x = a + b - t と置換するだけ）。「区間の両端で入れ替わる」形に効く。

（1）x = π/2 - t で I = ∫[0→π/2] sin t/(cos t + sin t) dt = J。
　I + J = ∫[0→π/2] (cos x + sin x)/(sin x + cos x) dx = π/2。I = J なので I = π/4。
　「足して 2 で割る」技法。sin と cos の役割が入れ替わることを利用。

（2）x = π - t：sin(π - t) = sin t、cos²(π - t) = cos²t。
　I = ∫[0→π] (π - t) sin t/(1 + cos²t) dt = π∫[0→π] sin t/(1 + cos²t) dt - I。
　∴ 2I = π∫[0→π] sin x/(1 + cos²x) dx。cos x = u（du = -sin x dx）で ∫[-1→1] du/(1 + u²) = 2·(π/4) = π/2。
　2I = π·(π/2) → I = π²/4。「x が邪魔なとき King で x を消す」典型。

（3）x = π/4 - t：tan(π/4 - t) = (1 - tan t)/(1 + tan t)。1 + tan(π/4 - t) = 2/(1 + tan t)。
　I = ∫[0→π/4] {log 2 - log(1 + tan t)} dt = (π/4)log 2 - I。
　∴ 2I = (π/4)log 2、I = (π/8)log 2。
　【まとめ】King を使う合図：①区間 [0, π/2] で sin↔cos ②被積分関数に x が 1 つ余っている ③tan(π/4 - x) が簡単になる。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- m2_2 ----
export const plus_m2_2: MathProblem[] = [
  {
    id: "q_m2_2_plus_func",
    category: "定積分で表された関数",
    text: `（1）f(x) = x^2 + ∫[0→1] t f(t) dt を満たす関数 f(x) を求めよ。
（2）f(x) = ∫[0→x] (x - t) e^t dt のとき、f'(x) を求めよ。
（3）g(x) = ∫[0→x] (t^2 - 3t + 2) dt の極大値を求めよ。
（4）∫[a→x] f(t) dt = x^3 - 3x + 2（a は正の定数）を満たすとき、定数 a の値を求めよ。`,
    subQuestions: [
      sq("q_m2_2_plus_func_1", "（1）f(x)", "x^2 + 1/2", ["x^2+1/2", "x^2 + (1/2)", "x^2+(1/2)", "f(x) = x^2 + 1/2", "x^2+0.5"]),
      sq("q_m2_2_plus_func_2", "（2）f'(x)", "e^x - 1", ["e^x-1", "-1 + e^x", "f'(x) = e^x - 1"]),
      sq("q_m2_2_plus_func_3", "（3）極大値", "5/6", ["(5/6)"]),
      sq("q_m2_2_plus_func_4", "（4）a", "1", ["a = 1", "a=1"]),
    ],
    explanation: `（1）∫[0→1] t f(t) dt は「定数」なので k とおく：f(x) = x² + k。
　k = ∫[0→1] t(t² + k) dt = [t⁴/4 + kt²/2]_0^1 = 1/4 + k/2。k - k/2 = 1/4 → k = 1/2。∴ f(x) = x² + 1/2。

（2）x は t の積分に対して定数なので外に出す：f(x) = x∫[0→x] e^t dt - ∫[0→x] t e^t dt。
　f'(x) = {1·∫[0→x] e^t dt + x·e^x} - x e^x = ∫[0→x] e^t dt = e^x - 1。
　「(x - t) の x を外に出してから微分」が鉄則。x を中に残したまま d/dx ∫[0→x] = (被積分関数に x 代入) とすると 0 になって誤り。

（3）g'(x) = x² - 3x + 2 = (x - 1)(x - 2)。x = 1 で正→負に変わるので極大。
　g(1) = ∫[0→1] (t² - 3t + 2) dt = 1/3 - 3/2 + 2 = 5/6。
　（下端 0 は g の値に効くが、g' には効かない。）

（4）両辺を x で微分すると f(x) = 3x² - 3。x = a を代入すると左辺は 0 なので a³ - 3a + 2 = 0。
　(a - 1)²(a + 2) = 0、a > 0 より a = 1。
　【手順】①微分して f を出す ②x = a（下端）を代入して「= 0」から a を決める。②を忘れる答案が非常に多い。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_m2_2_plus_riemann",
    category: "区分求積法・積分漸化式",
    text: `（1）lim[n→∞] Σ[k=1→n] n/(n + k)^2 を求めよ。
（2）lim[n→∞] (1/n) Σ[k=1→n] √(k/n) を求めよ。
（3）lim[n→∞] (1/n){sin(π/n) + sin(2π/n) + … + sin(nπ/n)} を求めよ。
（4）I_n = ∫[0→1] x^n e^x dx とするとき、I_2 を求めよ。`,
    subQuestions: [
      sq("q_m2_2_plus_riemann_1", "（1）lim Σ n/(n+k)^2", "1/2", ["(1/2)", "0.5"]),
      sq("q_m2_2_plus_riemann_2", "（2）lim (1/n)Σ√(k/n)", "2/3", ["(2/3)"]),
      sq("q_m2_2_plus_riemann_3", "（3）lim (1/n)Σ sin(kπ/n)", "2/π", ["2/pi", "(2/π)", "2π^(-1)"]),
      sq("q_m2_2_plus_riemann_4", "（4）I_2", "e - 2", ["e-2", "-2 + e"]),
    ],
    explanation: `区分求積法：lim (1/n) Σ[k=1→n] f(k/n) = ∫[0→1] f(x) dx。「1/n をくくり出し、残りを k/n の式にする」。

（1）n/(n+k)² = (1/n)·1/(1 + k/n)²。∴ ∫[0→1] 1/(1+x)² dx = [-1/(1+x)]_0^1 = -1/2 + 1 = 1/2。
　「n の次数を合わせる」：分母が n² なので分子に n を 1 つ出すと 1/n が作れる。

（2）そのまま f(x) = √x。∫[0→1] √x dx = [2x^(3/2)/3]_0^1 = 2/3。

（3）(1/n)Σ sin(kπ/n) = (1/n)Σ f(k/n)、f(x) = sin πx。∫[0→1] sin πx dx = [-cos πx/π]_0^1 = (1 + 1)/π = 2/π。

（4）部分積分で n を下げる：I_n = [x^n e^x]_0^1 - n∫ x^(n-1) e^x dx = e - n I_(n-1)。
　I_0 = ∫[0→1] e^x dx = e - 1。I_1 = e - I_0 = 1。I_2 = e - 2I_1 = e - 2。
　【漸化式の型】I_n = e - n I_(n-1) の形を導いてから、I_0 から順に計算。「いきなり I_2 を部分積分 2 回」でも解けるが、漸化式の導出が問われることが多い。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mv_1 ----
export const plus_mv_1: MathProblem[] = [
  {
    id: "q_mv_1_plus_comp",
    category: "成分計算と |a + tb| の最小",
    text: `a = (2, -1), b = (1, 3) とする。

（1）3a - 2b を成分で表せ。
（2）|3a - 2b| を求めよ。
（3）|a + t b| が最小となる実数 t の値を求めよ。
（4）（3）のときの |a + t b| の最小値を求めよ。`,
    subQuestions: [
      sq("q_mv_1_plus_comp_1", "（1）3a - 2b", "(4, -9)", ["(4,-9)", "（4, -9）"]),
      sq("q_mv_1_plus_comp_2", "（2）|3a - 2b|", "√97", ["√(97)", "ルート97"]),
      sq("q_mv_1_plus_comp_3", "（3）t", "1/10", ["t = 1/10", "t=1/10", "0.1"]),
      sq("q_mv_1_plus_comp_4", "（4）最小値", "7√10/10", ["(7√10)/10", "7/√10", "(7/10)√10", "7√(10)/10", "√(49/10)"]),
    ],
    explanation: `（1）3a = (6, -3)、2b = (2, 6)。差は (4, -9)。

（2）√(4² + 9²) = √(16 + 81) = √97。

（3）成分で a + tb = (2 + t, -1 + 3t)。
　|a + tb|² = (2 + t)² + (3t - 1)² = 10t² - 2t + 5 = 10(t - 1/10)² + 49/10。
　∴ t = 1/10 で最小。
　【内積で】|a + tb|² = |a|² + 2t(a·b) + t²|b|² = 5 + 2t(-1) + 10t²。同じ式になる（a·b = 2·1 + (-1)·3 = -1）。

（4）最小値は √(49/10) = 7/√10 = 7√10/10。

【ポイント】「|a + tb| の最小」は 2 乗して t の 2 次関数に帰着。幾何的には a + tb ⊥ b のとき最小で、(a + tb)·b = 0 → t = -(a·b)/|b|² = 1/10 とも出せる。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mv_1_plus_para",
    category: "平行条件・分解・単位ベクトル",
    text: `（1）a = (x, 2), b = (4, x + 2) が平行となる x の値をすべて求めよ。
（2）a = (2, -1), b = (1, 3) のとき、c = (5, 1) を c = s a + t b の形で表す。(s, t) を求めよ。
（3）a = (1, 2) と平行で大きさが 2√5 のベクトルのうち、x 成分が負のものを求めよ。
（4）a = (3, -4) と同じ向きの単位ベクトルを求めよ。`,
    subQuestions: [
      sq("q_mv_1_plus_para_1", "（1）x", "x = 2, -4", ["2, -4", "-4, 2", "x = -4, 2", "2,-4", "-4,2", "x=2,-4"]),
      sq("q_mv_1_plus_para_2", "（2）(s, t)", "(2, 1)", ["(2,1)", "s = 2, t = 1", "s=2,t=1", "（2, 1）"]),
      sq("q_mv_1_plus_para_3", "（3）", "(-2, -4)", ["(-2,-4)", "（-2, -4）"]),
      sq("q_mv_1_plus_para_4", "（4）", "(3/5, -4/5)", ["(3/5,-4/5)", "（3/5, -4/5）", "(0.6, -0.8)"]),
    ],
    explanation: `（1）a ∥ b ⇔ x(x + 2) - 2·4 = 0（成分の「たすき掛け」が 0）。x² + 2x - 8 = (x + 4)(x - 2) = 0 → x = 2, -4。
　「a ∥ b ⇔ a = kb」で解いてもよいが、成分の x₁y₂ - x₂y₁ = 0 が最速。

（2）(5, 1) = s(2, -1) + t(1, 3) → 2s + t = 5、-s + 3t = 1。第 2 式から s = 3t - 1 を第 1 式に代入：6t - 2 + t = 5 → t = 1、s = 2。∴ (s, t) = (2, 1)。
　平行でない 2 本のベクトルがあれば、平面上の任意のベクトルはただ 1 通りに分解できる（一次独立）。

（3）a に平行 → k(1, 2)。大きさ |k|√5 = 2√5 → k = ±2。x 成分が負 → k = -2、(-2, -4)。

（4）|a| = √(9 + 16) = 5。a/|a| = (3/5, -4/5)。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mv_2 ----
export const plus_mv_2: MathProblem[] = [
  {
    id: "q_mv_2_plus_angle",
    category: "内積の条件から大きさ・角を求める",
    text: `|a| = 2, |b| = 3, a·b = -3 とする。

（1）a と b のなす角 θ を求めよ（0° ≦ θ ≦ 180°）。
（2）|a + b| を求めよ。
（3）|2a - b| を求めよ。
（4）a + b と a - b のなす角の余弦 cosφ を求めよ。`,
    subQuestions: [
      sq("q_mv_2_plus_angle_1", "（1）θ", "120°", ["120", "120度", "2π/3"]),
      sq("q_mv_2_plus_angle_2", "（2）|a + b|", "√7", ["√(7)", "ルート7"]),
      sq("q_mv_2_plus_angle_3", "（3）|2a - b|", "√37", ["√(37)", "ルート37"]),
      sq("q_mv_2_plus_angle_4", "（4）cosφ", "-5/√133", ["-5√133/133", "-(5/133)√133", "-5/√(133)", "-5√(133)/133", "-5/(√7√19)"]),
    ],
    explanation: `（1）cosθ = a·b/(|a||b|) = -3/6 = -1/2 → θ = 120°。

（2）|a + b|² = |a|² + 2a·b + |b|² = 4 - 6 + 9 = 7 → |a + b| = √7。

（3）|2a - b|² = 4|a|² - 4a·b + |b|² = 16 + 12 + 9 = 37 → √37。

（4）(a + b)·(a - b) = |a|² - |b|² = 4 - 9 = -5。
　|a + b| = √7、|a - b|² = |a|² - 2a·b + |b|² = 4 + 6 + 9 = 19 → |a - b| = √19。
　cosφ = -5/(√7·√19) = -5/√133（= -5√133/133）。

【ポイント】「|a|, |b|, a·b の 3 つ」が分かれば、a と b の 1 次結合どうしの内積・大きさ・角はすべて計算できる。|a ± b|² の展開を機械的に行うこと。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mv_2_plus_perp",
    category: "垂直条件・なす角（成分）",
    text: `a = (1, 2), b = (3, -1) とする。

（1）a·b を求めよ。
（2）a + k b と a - b が垂直となる実数 k の値を求めよ。
（3）a と b のなす角 θ について cosθ を求めよ。
（4）c = (x, 1) が a と垂直になる x の値を求めよ。`,
    subQuestions: [
      sq("q_mv_2_plus_perp_1", "（1）a·b", "1", []),
      sq("q_mv_2_plus_perp_2", "（2）k", "4/9", ["k = 4/9", "k=4/9"]),
      sq("q_mv_2_plus_perp_3", "（3）cosθ", "√2/10", ["1/(5√2)", "(√2)/10", "1/5√2", "√(2)/10", "1/√50"]),
      sq("q_mv_2_plus_perp_4", "（4）x", "-2", ["x = -2", "x=-2"]),
    ],
    explanation: `（1）a·b = 1·3 + 2·(-1) = 1。

（2）(a + kb)·(a - b) = |a|² - a·b + k(a·b) - k|b|² = 5 - 1 + k - 10k = 4 - 9k = 0 → k = 4/9。
　成分で a + kb = (1 + 3k, 2 - k)、a - b = (-2, 3) として -2(1 + 3k) + 3(2 - k) = 4 - 9k としても同じ。

（3）cosθ = 1/(√5·√10) = 1/√50 = 1/(5√2) = √2/10。

（4）c·a = x + 2 = 0 → x = -2。

【垂直の判定】「垂直 ⇔ 内積 0」。(2) のように k を含む場合は展開して 1 次方程式にする。|a|², |b|², a·b を最初にメモしておくと速い。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mv_3 ----
export const plus_mv_3: MathProblem[] = [
  {
    id: "q_mv_3_plus_ratio",
    category: "位置ベクトル（内分・外分・重心）",
    text: `三角形 OAB において OA = a, OB = b とする。

（1）辺 AB を 2:1 に内分する点 P の位置ベクトル OP を a, b で表せ。
（2）辺 AB を 1:3 に外分する点 Q の位置ベクトル OQ を a, b で表せ。
（3）三角形 OAB の重心 G の位置ベクトル OG を a, b で表せ。
（4）三角形 ABP（P は（1）の点）の重心 G' の位置ベクトル OG' を a, b で表せ。`,
    subQuestions: [
      sq("q_mv_3_plus_ratio_1", "（1）OP", "(a + 2b)/3", ["(a+2b)/3", "a/3 + 2b/3", "(1/3)a + (2/3)b", "1/3a+2/3b"]),
      sq("q_mv_3_plus_ratio_2", "（2）OQ", "(3a - b)/2", ["(3a-b)/2", "3a/2 - b/2", "(3/2)a - (1/2)b", "3/2a-1/2b", "-b/2 + 3a/2"]),
      sq("q_mv_3_plus_ratio_3", "（3）OG", "(a + b)/3", ["(a+b)/3", "a/3 + b/3", "(1/3)a + (1/3)b", "(1/3)(a + b)"]),
      sq("q_mv_3_plus_ratio_4", "（4）OG'", "(4a + 5b)/9", ["(4a+5b)/9", "4a/9 + 5b/9", "(4/9)a + (5/9)b", "4/9a+5/9b"]),
    ],
    explanation: `（1）m:n 内分点は (n·OA + m·OB)/(m + n)。2:1 内分なので (1·a + 2·b)/3 = (a + 2b)/3。「比の数字が反対側にかかる」。

（2）m:n 外分点は (-n·OA + m·OB)/(m - n)。1:3 外分：(-3a + b)/(1 - 3) = (3a - b)/2。
　n を負にした「内分の公式」と覚えると統一できる：(-n·a + m·b)/(m + (-n))。

（3）重心は 3 頂点の位置ベクトルの平均：(0 + a + b)/3 = (a + b)/3。O が原点なので OO = 0。

（4）G' = (OA + OB + OP)/3 = {a + b + (a + 2b)/3}/3 = {(4a + 5b)/3}/3 = (4a + 5b)/9。
　係数の和が 4/9 + 5/9 = 1 になっていることを確認（G' は直線 AB 上にある：P も A, B も AB 上だから当然）。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mv_3_plus_coord",
    category: "座標での内分・外分・重心・平行四辺形",
    text: `3 点 A(1, 2), B(4, -1), C(-2, 6) について、次の点の座標を求めよ。

（1）線分 AB を 1:2 に内分する点 P
（2）線分 AB を 3:1 に外分する点 Q
（3）三角形 ABC の重心 G
（4）四角形 ABCD が平行四辺形となる点 D`,
    subQuestions: [
      sq("q_mv_3_plus_coord_1", "（1）P", "(2, 1)", ["(2,1)", "（2, 1）"]),
      sq("q_mv_3_plus_coord_2", "（2）Q", "(11/2, -5/2)", ["(11/2,-5/2)", "（11/2, -5/2）", "(5.5, -2.5)", "(5.5,-2.5)"]),
      sq("q_mv_3_plus_coord_3", "（3）G", "(1, 7/3)", ["(1,7/3)", "（1, 7/3）"]),
      sq("q_mv_3_plus_coord_4", "（4）D", "(-5, 9)", ["(-5,9)", "（-5, 9）"]),
    ],
    explanation: `（1）1:2 内分：(2·A + 1·B)/3 = ((2 + 4)/3, (4 - 1)/3) = (2, 1)。

（2）3:1 外分：(-1·A + 3·B)/(3 - 1) = ((-1 + 12)/2, (-2 - 3)/2) = (11/2, -5/2)。
　外分点は「B を越えた先」にある。B(4, -1) から見て A の反対側に進んだ位置になっているかを図で確認。

（3）G = ((1 + 4 - 2)/3, (2 - 1 + 6)/3) = (1, 7/3)。

（4）平行四辺形 ABCD（頂点がこの順）⇔ AD = BC ⇔ D = A + C - B = (1 - 4 - 2, 2 + 6 + 1) = (-5, 9)。
　「対角線の中点が一致（A + C = B + D）」と覚えると 1 行で出る。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mv_4 ----
export const plus_mv_4: MathProblem[] = [
  {
    id: "q_mv_4_plus_cross",
    category: "2直線の交点（係数比較）",
    text: `三角形 OAB において、辺 OA を 2:1 に内分する点を M、辺 OB を 1:2 に内分する点を N とし、線分 AN と BM の交点を P とする。OA = a, OB = b とする。

（1）OP を a, b で表せ。
（2）AP:PN を求めよ。
（3）BP:PM を求めよ。
（4）直線 OP と辺 AB の交点を Q とするとき、AQ:QB を求めよ。`,
    subQuestions: [
      sq("q_mv_4_plus_cross_1", "（1）OP", "(4a + b)/7", ["(4a+b)/7", "4a/7 + b/7", "(4/7)a + (1/7)b", "4/7a+1/7b"]),
      sq("q_mv_4_plus_cross_2", "（2）AP:PN", "3:4", ["3 : 4", "3：4"]),
      sq("q_mv_4_plus_cross_3", "（3）BP:PM", "6:1", ["6 : 1", "6：1"]),
      sq("q_mv_4_plus_cross_4", "（4）AQ:QB", "1:4", ["1 : 4", "1：4"]),
    ],
    explanation: `OM = (2/3)a、ON = (1/3)b。

（1）P は AN 上：AP:PN = s:(1 - s) として OP = (1 - s)a + s·(1/3)b。
　P は BM 上：BP:PM = t:(1 - t) として OP = t·(2/3)a + (1 - t)b。
　a, b は一次独立なので係数比較：1 - s = 2t/3、s/3 = 1 - t。
　第 2 式から s = 3 - 3t、第 1 式に代入：1 - 3 + 3t = 2t/3 → (7/3)t = 2 → t = 6/7、s = 3/7。
　∴ OP = (4/7)a + (1/7)b = (4a + b)/7。

（2）AP:PN = s:(1 - s) = 3/7 : 4/7 = 3:4。

（3）BP:PM = t:(1 - t) = 6/7 : 1/7 = 6:1。

（4）Q は直線 OP 上：OQ = k·OP = (4k/7)a + (k/7)b。Q は AB 上なので係数の和が 1：5k/7 = 1 → k = 7/5。
　OQ = (4/5)a + (1/5)b。内分点の公式 (n·a + m·b)/(m + n) と比べて m = 1, n = 4 → AQ:QB = 1:4。

【別解：メネラウスの定理】三角形 OAN と直線 BM で (OM/MA)(AP/PN)(NB/BO) = 1 → (2/1)(AP/PN)(2/3) = 1 → AP/PN = 3/4。係数比較の検算に使える。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mv_4_plus_line",
    category: "共線条件 s + t = 1 の使い方",
    text: `三角形 OAB において OA = a, OB = b とする。

（1）OP = (2a + 3b)/5 のとき、点 P は辺 AB 上にある。AP:PB を求めよ。
（2）OP = x a + (2x - 1) b が直線 AB 上にあるとき、x の値を求めよ。
（3）OP = a/3 + b/2 のとき、直線 OP と直線 AB の交点 Q について OQ を a, b で表せ。
（4）（3）のとき、OP:PQ を求めよ。`,
    subQuestions: [
      sq("q_mv_4_plus_line_1", "（1）AP:PB", "3:2", ["3 : 2", "3：2"]),
      sq("q_mv_4_plus_line_2", "（2）x", "2/3", ["x = 2/3", "x=2/3"]),
      sq("q_mv_4_plus_line_3", "（3）OQ", "(2a + 3b)/5", ["(2a+3b)/5", "2a/5 + 3b/5", "(2/5)a + (3/5)b", "2/5a+3/5b"]),
      sq("q_mv_4_plus_line_4", "（4）OP:PQ", "5:1", ["5 : 1", "5：1"]),
    ],
    explanation: `【共線条件】点 P が直線 AB 上 ⇔ OP = s a + t b で s + t = 1。（さらに s, t ≧ 0 なら線分 AB 上。）

（1）(2a + 3b)/5 = (2/5)a + (3/5)b。係数の和は 1 なので確かに AB 上。内分点の公式 (n·a + m·b)/(m + n) と比べて m = 3, n = 2 → AP:PB = 3:2。
　「b の係数が AP 側の比」：b の係数 3/5 = AP/AB。

（2）x + (2x - 1) = 1 → 3x = 2 → x = 2/3。

（3）Q は直線 OP 上なので OQ = k·OP = (k/3)a + (k/2)b。AB 上なので k/3 + k/2 = 1 → (5/6)k = 1 → k = 6/5。
　OQ = (2/5)a + (3/5)b = (2a + 3b)/5。

（4）OQ = (6/5)OP なので OP:OQ = 5:6、OP:PQ = 5:1。

【ポイント】「係数の和が 1 になるように定数倍する」のが交点を求める最速手順。(1) の点 P と (3) の点 Q が同じ位置になることにも注目。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mv_5 ----
export const plus_mv_5: MathProblem[] = [
  {
    id: "q_mv_5_plus_area",
    category: "面積公式と正射影ベクトル",
    text: `|a| = 3, |b| = 2, a·b = 3 とし、OA = a, OB = b とする。

（1）a と b のなす角 θ について cosθ を求めよ。
（2）三角形 OAB の面積 S を求めよ。
（3）b の a への正射影ベクトルを a で表せ。
（4）点 B から直線 OA に下ろした垂線の長さ h を求めよ。`,
    subQuestions: [
      sq("q_mv_5_plus_area_1", "（1）cosθ", "1/2", ["(1/2)", "0.5"]),
      sq("q_mv_5_plus_area_2", "（2）S", "3√3/2", ["(3√3)/2", "(3/2)√3", "3√(3)/2", "3/2√3"]),
      sq("q_mv_5_plus_area_3", "（3）正射影ベクトル", "a/3", ["(1/3)a", "1/3a"]),
      sq("q_mv_5_plus_area_4", "（4）h", "√3", ["√(3)", "ルート3"]),
    ],
    explanation: `（1）cosθ = a·b/(|a||b|) = 3/6 = 1/2（θ = 60°）。

（2）面積公式 S = (1/2)√(|a|²|b|² - (a·b)²) = (1/2)√(36 - 9) = (1/2)√27 = 3√3/2。
　（(1/2)|a||b|sinθ = (1/2)·3·2·(√3/2) = 3√3/2 でも同じ。）

（3）b の a への正射影ベクトル = (a·b/|a|²)a = (3/9)a = a/3。
　「b の a 方向成分」を a の何倍かで表す。|a| で割るのではなく |a|² で割る点に注意。

（4）h = |b|sinθ = 2·(√3/2) = √3。あるいは S = (1/2)|a|h → h = 2S/|a| = 3√3/3 = √3。
　h² = |b|² - |正射影|² = 4 - 1 = 3 でも検算できる（正射影の大きさは |a|/3 = 1）。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mv_5_plus_coord",
    category: "座標での面積・垂線の足",
    text: `3 点 A(1, 1), B(4, 2), C(2, 5) について、次を求めよ。

（1）AB·AC
（2）三角形 ABC の面積 S
（3）AC の AB への正射影ベクトル（成分で）
（4）点 C から直線 AB に下ろした垂線の足 H の座標`,
    subQuestions: [
      sq("q_mv_5_plus_coord_1", "（1）AB·AC", "7", []),
      sq("q_mv_5_plus_coord_2", "（2）S", "11/2", ["(11/2)", "5.5"]),
      sq("q_mv_5_plus_coord_3", "（3）正射影ベクトル", "(21/10, 7/10)", ["(21/10,7/10)", "（21/10, 7/10）", "(7/10)(3, 1)", "(2.1, 0.7)", "(2.1,0.7)"]),
      sq("q_mv_5_plus_coord_4", "（4）H", "(31/10, 17/10)", ["(31/10,17/10)", "（31/10, 17/10）", "(3.1, 1.7)", "(3.1,1.7)"]),
    ],
    explanation: `AB = (3, 1)、AC = (1, 4)。

（1）AB·AC = 3·1 + 1·4 = 7。

（2）成分の面積公式 S = (1/2)|x₁y₂ - x₂y₁| = (1/2)|3·4 - 1·1| = 11/2。
　（√ の公式でも (1/2)√(10·17 - 49) = (1/2)√121 = 11/2。）

（3）(AB·AC/|AB|²)AB = (7/10)(3, 1) = (21/10, 7/10)。

（4）H = A + (正射影ベクトル) = (1 + 21/10, 1 + 7/10) = (31/10, 17/10)。
　検算：CH = (31/10 - 2, 17/10 - 5) = (11/10, -33/10) = (11/10)(1, -3)。AB = (3, 1) との内積は (11/10)(3 - 3) = 0 で確かに垂直。
　CH の長さ = (11/10)√10、S = (1/2)|AB|·CH = (1/2)√10·(11√10/10) = 11/2 で (2) と一致。

【定番手順】垂線の足 = 始点 + 正射影ベクトル。三角形の高さ・距離・対称点はすべてこの手順から派生する。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mv_6 ----
export const plus_mv_6: MathProblem[] = [
  {
    id: "q_mv_6_plus_line",
    category: "直線のベクトル方程式と点と直線の距離",
    text: `点 A(1, 2) を通り、方向ベクトル d = (3, -1) に平行な直線を ℓ とする。

（1）ℓ の方程式を ax + by + c = 0 の形で求めよ。
（2）点 A を通り、法線ベクトル n = (2, 5) をもつ直線の方程式を求めよ。
（3）ℓ 上の点で原点 O に最も近い点 H の座標を求めよ。
（4）原点 O と ℓ の距離を求めよ。`,
    subQuestions: [
      sq("q_mv_6_plus_line_1", "（1）ℓ", "x + 3y - 7 = 0", ["x+3y-7=0", "x + 3y = 7", "x+3y=7", "y = -x/3 + 7/3", "y = -(1/3)x + 7/3"]),
      sq("q_mv_6_plus_line_2", "（2）", "2x + 5y - 12 = 0", ["2x+5y-12=0", "2x + 5y = 12", "2x+5y=12"]),
      sq("q_mv_6_plus_line_3", "（3）H", "(7/10, 21/10)", ["(7/10,21/10)", "（7/10, 21/10）", "(0.7, 2.1)", "(0.7,2.1)"]),
      sq("q_mv_6_plus_line_4", "（4）距離", "7√10/10", ["(7√10)/10", "7/√10", "(7/10)√10", "7√(10)/10"]),
    ],
    explanation: `（1）媒介変数表示：(x, y) = (1, 2) + t(3, -1) → x = 1 + 3t、y = 2 - t。
　t = 2 - y を代入：x = 1 + 3(2 - y) = 7 - 3y → x + 3y - 7 = 0。
　（方向 (3, -1) ⇒ 法線 (1, 3) なので 1(x - 1) + 3(y - 2) = 0 としても速い。）

（2）法線ベクトル n = (2, 5) の直線：n·(p - a) = 0 → 2(x - 1) + 5(y - 2) = 0 → 2x + 5y - 12 = 0。
　「法線ベクトル (a, b) ⇔ 直線 ax + by + c = 0」の対応を即答できるようにする。

（3）H = (1 + 3t, 2 - t) とおき、OH ⊥ d：(1 + 3t)·3 + (2 - t)(-1) = 1 + 10t = 0 → t = -1/10。
　H = (1 - 3/10, 2 + 1/10) = (7/10, 21/10)。

（4）|OH| = √(49 + 441)/10 = √490/10 = 7√10/10。
　点と直線の距離の公式 |c|/√(a² + b²) = 7/√10 = 7√10/10 と一致。「垂線の足を求める → 距離」の流れと公式の両方で検算できる。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mv_6_plus_circle",
    category: "円のベクトル方程式（直径・接線）",
    text: `（1）2 点 A(1, 2), B(5, -4) を直径の両端とする円の方程式を求めよ。
（2）（1）の円上の点 P(5, 2) における接線の方程式を求めよ。
（3）位置ベクトル p が p·(p - 2c) = 0（c = (1, 3)）を満たす点 P の軌跡は円である。その中心の座標を求めよ。
（4）（3）の円の半径を求めよ。`,
    subQuestions: [
      sq("q_mv_6_plus_circle_1", "（1）", "(x - 3)^2 + (y + 1)^2 = 13", ["(x-3)^2+(y+1)^2=13", "x^2 + y^2 - 6x + 2y - 3 = 0", "x^2+y^2-6x+2y-3=0"]),
      sq("q_mv_6_plus_circle_2", "（2）接線", "2x + 3y - 16 = 0", ["2x+3y-16=0", "2x + 3y = 16", "2x+3y=16"]),
      sq("q_mv_6_plus_circle_3", "（3）中心", "(1, 3)", ["(1,3)", "（1, 3）"]),
      sq("q_mv_6_plus_circle_4", "（4）半径", "√10", ["√(10)", "ルート10"]),
    ],
    explanation: `（1）直径の両端が A, B の円：(p - a)·(p - b) = 0（円周角 90°）。
　中心は AB の中点 (3, -1)、半径は |AB|/2 = √(16 + 36)/2 = √52/2 = √13。∴ (x - 3)² + (y + 1)² = 13。
　（(p - a)·(p - b) = 0 を成分で展開すると (x - 1)(x - 5) + (y - 2)(y + 4) = 0 → x² + y² - 6x + 2y - 3 = 0 で同じ式。）

（2）P(5, 2) は 2² + 3² = 13 で確かに円上。中心 C(3, -1) に対し CP = (2, 3)。
　接線は P を通り CP に垂直：(p₀ - c)·(p - c) = r² → 2(x - 3) + 3(y + 1) = 13 → 2x + 3y - 16 = 0。
　（P を代入すると 10 + 6 - 16 = 0 で確認。）

（3）p·p - 2p·c = 0 → |p|² - 2p·c + |c|² = |c|² → |p - c|² = |c|²。
　中心 c = (1, 3)、半径 |c| の円（原点を通る）。

（4）半径 = |c| = √(1 + 9) = √10。
　【ポイント】p·(p - 2c) = 0 は「O と 2c を直径の両端とする円」と読める（(p - 0)·(p - 2c) = 0）。中心は O と 2c の中点 c、半径 |c|。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mv_7 ----
export const plus_mv_7: MathProblem[] = [
  {
    id: "q_mv_7_plus_basic",
    category: "空間ベクトルの成分・内積・垂直",
    text: `a = (1, 2, 2), b = (2, -2, 1) とする。

（1）|a| を求めよ。
（2）a と b のなす角 θ を求めよ。
（3）a, b の両方に垂直で、大きさが 3、x 成分が正のベクトル c を求めよ。
（4）点 P(1, 2, 2), Q(2, -2, 1) の距離 PQ を求めよ。`,
    subQuestions: [
      sq("q_mv_7_plus_basic_1", "（1）|a|", "3", []),
      sq("q_mv_7_plus_basic_2", "（2）θ", "90°", ["90", "90度", "π/2", "直角"]),
      sq("q_mv_7_plus_basic_3", "（3）c", "(2, 1, -2)", ["(2,1,-2)", "（2, 1, -2）"]),
      sq("q_mv_7_plus_basic_4", "（4）PQ", "3√2", ["3√(2)", "√18", "3ルート2"]),
    ],
    explanation: `（1）|a| = √(1 + 4 + 4) = 3。

（2）a·b = 2 - 4 + 2 = 0 → 垂直、θ = 90°。（内積 0 は即「垂直」。cosθ を計算する前に内積の値を見る。）

（3）c = (p, q, r) とおく。c·a = p + 2q + 2r = 0、c·b = 2p - 2q + r = 0。
　辺々加えて 3p + 3r = 0 → r = -p。第 1 式に代入：p + 2q - 2p = 0 → q = p/2。∴ c = (p/2)(2, 1, -2)。
　|(2, 1, -2)| = 3 なので、大きさ 3 で x 成分正 → c = (2, 1, -2)。
　【別解】外積 a × b = (2·1 - 2·(-2), 2·2 - 1·1, 1·(-2) - 2·2) = (6, 3, -6) = 3(2, 1, -2)。

（4）PQ = |b - a| = |(1, -4, -1)| = √(1 + 16 + 1) = √18 = 3√2。
　a ⊥ b で |a| = |b| = 3 なので、O, P, Q は直角二等辺三角形。PQ = 3√2 は斜辺として整合する。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mv_7_plus_triangle",
    category: "空間の三角形（内積・角・面積）",
    text: `3 点 A(2, 1, 3), B(4, -1, 1), C(1, 2, 2) について、次を求めよ。

（1）|AB|
（2）AB·AC
（3）cos∠BAC
（4）三角形 ABC の面積 S`,
    subQuestions: [
      sq("q_mv_7_plus_triangle_1", "（1）|AB|", "2√3", ["2√(3)", "√12", "2ルート3"]),
      sq("q_mv_7_plus_triangle_2", "（2）AB·AC", "-2", []),
      sq("q_mv_7_plus_triangle_3", "（3）cos∠BAC", "-1/3", ["-(1/3)"]),
      sq("q_mv_7_plus_triangle_4", "（4）S", "2√2", ["2√(2)", "√8", "2ルート2"]),
    ],
    explanation: `AB = (2, -2, -2)、AC = (-1, 1, -1)。

（1）|AB| = √(4 + 4 + 4) = √12 = 2√3。

（2）AB·AC = -2 - 2 + 2 = -2。

（3）|AC| = √3。cos∠BAC = -2/(2√3·√3) = -2/6 = -1/3。負なので ∠BAC は鈍角。

（4）S = (1/2)√(|AB|²|AC|² - (AB·AC)²) = (1/2)√(12·3 - 4) = (1/2)√32 = 2√2。
　（sin∠BAC = √(1 - 1/9) = 2√2/3、S = (1/2)·2√3·√3·(2√2/3) = 2√2 でも一致。）

【空間でも公式は同じ】内積・なす角・面積の公式は平面と全く同じ形。成分が 3 つになるだけ。ただし「x₁y₂ - x₂y₁」の面積公式は平面専用なので、空間では √ の公式を使う。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mv_8 ----
export const plus_mv_8: MathProblem[] = [
  {
    id: "q_mv_8_plus_coplanar",
    category: "共面条件 s + t + u = 1",
    text: `四面体 OABC において OA = a, OB = b, OC = c とする。

（1）OP = (1/2)a + (1/3)b + k c を満たす点 P が平面 ABC 上にあるとき、k の値を求めよ。
（2）OQ = k(a + 2b + 5c) を満たす点 Q が平面 ABC 上にあるとき、OQ を a, b, c で表せ。
（3）辺 OA の中点を M、三角形 ABC の重心を G とする。直線 MG と平面 OBC の交点 R について、OR を b, c で表せ。
（4）（3）のとき、MG:GR を求めよ。`,
    subQuestions: [
      sq("q_mv_8_plus_coplanar_1", "（1）k", "1/6", ["k = 1/6", "k=1/6"]),
      sq("q_mv_8_plus_coplanar_2", "（2）OQ", "(a + 2b + 5c)/8", ["(a+2b+5c)/8", "a/8 + b/4 + 5c/8", "(1/8)a + (1/4)b + (5/8)c", "(1/8)a + (2/8)b + (5/8)c", "1/8a+1/4b+5/8c"]),
      sq("q_mv_8_plus_coplanar_3", "（3）OR", "b + c", ["b+c", "c + b", "c+b"]),
      sq("q_mv_8_plus_coplanar_4", "（4）MG:GR", "1:2", ["1 : 2", "1：2"]),
    ],
    explanation: `【共面条件】点 P が平面 ABC 上 ⇔ OP = s a + t b + u c で s + t + u = 1（O が平面 ABC 上にないとき）。

（1）1/2 + 1/3 + k = 1 → k = 1 - 5/6 = 1/6。

（2）k(1 + 2 + 5) = 1 → k = 1/8。OQ = (a + 2b + 5c)/8。

（3）OM = a/2、OG = (a + b + c)/3。R は直線 MG 上：OR = (1 - t)OM + t·OG = {(1 - t)/2 + t/3}a + (t/3)b + (t/3)c。
　R が平面 OBC 上 ⇔ a の係数が 0：(1 - t)/2 + t/3 = 0 → 3(1 - t) + 2t = 0 → t = 3。
　OR = (3/3)b + (3/3)c = b + c。

（4）t = 3 は「M から G の方向に MG の 3 倍進んだ位置」。MR = 3MG なので GR = 2MG、MG:GR = 1:2。

【ポイント】「平面 OBC 上 ⇔ a の係数 0」「平面 ABC 上 ⇔ 係数の和 1」。どちらの平面かで使う条件が変わる。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mv_8_plus_sphere",
    category: "球面の方程式",
    text: `（1）2 点 A(1, 2, 3), B(3, -2, 5) を直径の両端とする球面の方程式を求めよ。
（2）球面 x^2 + y^2 + z^2 - 2x + 4y - 6z + 5 = 0 の中心の座標を求めよ。
（3）（2）の球面の半径を求めよ。
（4）（2）の球面と平面 z = 5 が交わってできる円の半径を求めよ。`,
    subQuestions: [
      sq("q_mv_8_plus_sphere_1", "（1）", "(x - 2)^2 + y^2 + (z - 4)^2 = 6", ["(x-2)^2+y^2+(z-4)^2=6", "x^2 + y^2 + z^2 - 4x - 8z + 14 = 0", "x^2+y^2+z^2-4x-8z+14=0"]),
      sq("q_mv_8_plus_sphere_2", "（2）中心", "(1, -2, 3)", ["(1,-2,3)", "（1, -2, 3）"]),
      sq("q_mv_8_plus_sphere_3", "（3）半径", "3", []),
      sq("q_mv_8_plus_sphere_4", "（4）円の半径", "√5", ["√(5)", "ルート5"]),
    ],
    explanation: `（1）中心は AB の中点 (2, 0, 4)。半径は |AB|/2 = √(4 + 16 + 4)/2 = √24/2 = √6。
　∴ (x - 2)² + y² + (z - 4)² = 6。（(p - a)·(p - b) = 0 を展開しても同じ。）

（2）平方完成：(x - 1)² + (y + 2)² + (z - 3)² = 1 + 4 + 9 - 5 = 9。中心 (1, -2, 3)。

（3）半径 = √9 = 3。

（4）中心 (1, -2, 3) と平面 z = 5 の距離は |5 - 3| = 2。
　切り口の円の半径 r は r² = 3² - 2² = 5 → r = √5。
　【定番】「球と平面の交わり」は、中心から平面への距離 d を出して r = √(R² - d²)。円の中心は (1, -2, 5)。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mp_1 ----
export const plus_mp_1: MathProblem[] = [
  {
    id: "q_mp_1_plus_pc",
    category: "P と C の使い分け（役職・整数）",
    text: `（1）男子 4 人、女子 3 人の 7 人から 4 人を選ぶとき、男女がともに少なくとも 1 人含まれる選び方は何通りか。
（2）7 人から委員長・副委員長・書記を 1 人ずつ選ぶ方法は何通りか。
（3）0, 1, 2, 3, 4, 5 の 6 枚のカードから 3 枚を選んで並べ、3 桁の整数を作る。整数は何個できるか。
（4）（3）のうち偶数は何個か。`,
    subQuestions: [
      sq("q_mp_1_plus_pc_1", "（1）", "34", ["34通り", "34 通り"]),
      sq("q_mp_1_plus_pc_2", "（2）", "210", ["210通り", "210 通り"]),
      sq("q_mp_1_plus_pc_3", "（3）", "100", ["100個", "100 個", "100通り"]),
      sq("q_mp_1_plus_pc_4", "（4）", "52", ["52個", "52 個", "52通り"]),
    ],
    explanation: `（1）余事象で数える：全体 C(7,4) = 35 から「男子のみ」C(4,4) = 1 と「女子のみ」C(3,4) = 0 を引く。35 - 1 - 0 = 34 通り。
　「少なくとも」は余事象、が場合の数でも鉄則。

（2）役職が異なるので順列：P(7,3) = 7·6·5 = 210 通り。「選ぶだけ」なら C、「選んで区別する」なら P。

（3）百の位は 0 以外の 5 通り、十の位は残り 5 通り、一の位は残り 4 通り：5·5·4 = 100 個。
　「0 が先頭に来られない」制約のある位から埋める。

（4）一の位で場合分け。
　一の位 0：百・十は残り 5 枚から P(5,2) = 20 個。
　一の位 2 または 4：百の位は 0 と一の位以外の 4 通り、十の位は残り 4 通り → 2×4×4 = 32 個。
　合計 52 個。「一の位が 0 かどうか」で百の位の候補数が変わるのが最大の落とし穴。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mp_1_plus_path",
    category: "最短経路・同じものを含む順列",
    text: `右図のような格子状の道路で、A から B へ最短経路で行く（A を左下、B を右上とし、右へ 5 区画・上へ 4 区画）。

（1）最短経路は全部で何通りか。
（2）点 P（A から右 2・上 1 の交差点）を通る経路は何通りか。
（3）点 P を通らない経路は何通りか。
（4）「AABBBCC」の 7 文字を 1 列に並べる方法は何通りか。`,
    subQuestions: [
      sq("q_mp_1_plus_path_1", "（1）", "126", ["126通り", "126 通り"]),
      sq("q_mp_1_plus_path_2", "（2）", "60", ["60通り", "60 通り"]),
      sq("q_mp_1_plus_path_3", "（3）", "66", ["66通り", "66 通り"]),
      sq("q_mp_1_plus_path_4", "（4）", "210", ["210通り", "210 通り"]),
    ],
    explanation: `（1）右 5 回・上 4 回の並べ方：9!/(5!4!) = C(9,4) = 126 通り。

（2）A→P は右 2・上 1 で C(3,1) = 3 通り、P→B は右 3・上 3 で C(6,3) = 20 通り。積の法則で 3×20 = 60 通り。

（3）全体 - P を通る = 126 - 60 = 66 通り。「通らない」は余事象。

（4）同じものを含む順列：7!/(2!3!2!) = 5040/24 = 210 通り。
　最短経路（1）が「→→→→→↑↑↑↑ の並べ替え」と同じ構造であることに気づくと、公式が 1 つで済む。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mp_2 ----
export const plus_mp_2: MathProblem[] = [
  {
    id: "q_mp_2_plus_circle",
    category: "円順列（条件付き）・じゅず順列",
    text: `大人 3 人、子ども 3 人の計 6 人が円形のテーブルに座る。

（1）座り方は全部で何通りか。
（2）子ども 3 人が誰も隣り合わない座り方は何通りか。
（3）特定の子ども 2 人（X と Y）が隣り合う座り方は何通りか。
（4）異なる 6 個の玉で首飾りを作る方法は何通りか。`,
    subQuestions: [
      sq("q_mp_2_plus_circle_1", "（1）", "120", ["120通り", "120 通り"]),
      sq("q_mp_2_plus_circle_2", "（2）", "12", ["12通り", "12 通り"]),
      sq("q_mp_2_plus_circle_3", "（3）", "48", ["48通り", "48 通り"]),
      sq("q_mp_2_plus_circle_4", "（4）", "60", ["60通り", "60 通り"]),
    ],
    explanation: `（1）円順列 (6 - 1)! = 5! = 120 通り。

（2）まず大人 3 人を円形に並べる：(3 - 1)! = 2 通り。大人の間の 3 つのすき間に子ども 3 人を 1 人ずつ入れる：3! = 6 通り。2×6 = 12 通り。
　「隣り合わない」は「先に他方を並べて、すき間に入れる」。

（3）X と Y をひとまとめにして 5 個の円順列：(5 - 1)! = 24 通り。X, Y の並び順 2 通り。24×2 = 48 通り。

（4）じゅず順列（裏返して同じものを同一視）：(6 - 1)!/2 = 60 通り。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mp_2_plus_group",
    category: "重複順列と組分け",
    text: `（1）6 人を A, B の 2 つの部屋に入れる。どの部屋にも 1 人以上入る方法は何通りか。
（2）6 人を 3 つの部屋 A, B, C に入れる。どの部屋にも 1 人以上入る方法は何通りか。
（3）6 人を 2 人ずつ 3 組に分ける方法は何通りか（組に区別はない）。
（4）6 人を 3 人・2 人・1 人の 3 組に分ける方法は何通りか。`,
    subQuestions: [
      sq("q_mp_2_plus_group_1", "（1）", "62", ["62通り", "62 通り"]),
      sq("q_mp_2_plus_group_2", "（2）", "540", ["540通り", "540 通り"]),
      sq("q_mp_2_plus_group_3", "（3）", "15", ["15通り", "15 通り"]),
      sq("q_mp_2_plus_group_4", "（4）", "60", ["60通り", "60 通り"]),
    ],
    explanation: `（1）各人が A か B かの重複順列 2⁶ = 64 通りから、全員 A・全員 B の 2 通りを引く：62 通り。

（2）3⁶ = 729 通りから「空き部屋がある」場合を引く。
　ちょうど 1 部屋が空（2 部屋を使う）：3 通り × (2⁶ - 2) = 3×62 = 186。ちょうど 2 部屋が空：3 通り。
　729 - 186 - 3 = 540 通り。
　【包除の形】3⁶ - C(3,1)·2⁶ + C(3,2)·1⁶ = 729 - 192 + 3 = 540 と書くと機械的に出せる。

（3）組に区別があれば C(6,2)·C(4,2)·C(2,2) = 15·6·1 = 90。組の区別をなくすため 3! で割る：90/6 = 15 通り。
　「同じ人数の組」の数だけ階乗で割る。

（4）人数がすべて異なるので組は自動的に区別される：C(6,3)·C(3,2)·C(1,1) = 20·3·1 = 60 通り。割らない。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mp_3 ----
export const plus_mp_3: MathProblem[] = [
  {
    id: "q_mp_3_plus_dice",
    category: "サイコロの確率（最大値・積・和）",
    text: `（1）2 個のサイコロを投げるとき、出る目の和が 5 の倍数になる確率を求めよ。
（2）2 個のサイコロを投げるとき、出る目の積が 12 になる確率を求めよ。
（3）3 個のサイコロを投げるとき、出る目の最大値が 4 以下である確率を求めよ。
（4）3 個のサイコロを投げるとき、出る目の最大値がちょうど 4 である確率を求めよ。`,
    subQuestions: [
      sq("q_mp_3_plus_dice_1", "（1）", "7/36", []),
      sq("q_mp_3_plus_dice_2", "（2）", "1/9", ["4/36"]),
      sq("q_mp_3_plus_dice_3", "（3）", "8/27", ["64/216"]),
      sq("q_mp_3_plus_dice_4", "（4）", "37/216", []),
    ],
    explanation: `（1）和が 5：(1,4)(2,3)(3,2)(4,1) の 4 通り。和が 10：(4,6)(5,5)(6,4) の 3 通り。合計 7 通り → 7/36。
　2 個のサイコロは「36 通りの表」を書けば確実。

（2）積が 12：(2,6)(3,4)(4,3)(6,2) の 4 通り → 4/36 = 1/9。(1,12) は不可。

（3）「最大値が 4 以下」⇔「3 個とも 4 以下」：(4/6)³ = (2/3)³ = 8/27。

（4）「最大値がちょうど 4」＝「4 以下」－「3 以下」：(4/6)³ - (3/6)³ = 64/216 - 27/216 = 37/216。
　【最大値・最小値の確率】P(max = k) = P(max ≦ k) - P(max ≦ k - 1)。直接数えるより確実。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mp_3_plus_ball",
    category: "玉を取り出す確率（同時・順に）",
    text: `赤玉 4 個、白玉 3 個、青玉 2 個の計 9 個が入った袋から玉を取り出す。

（1）同時に 3 個取り出すとき、3 個とも赤である確率を求めよ。
（2）同時に 3 個取り出すとき、赤・白・青が 1 個ずつである確率を求めよ。
（3）同時に 3 個取り出すとき、少なくとも 1 個が白である確率を求めよ。
（4）1 個ずつ 2 回、元に戻さずに取り出すとき、1 回目が赤で 2 回目が白である確率を求めよ。`,
    subQuestions: [
      sq("q_mp_3_plus_ball_1", "（1）", "1/21", ["4/84"]),
      sq("q_mp_3_plus_ball_2", "（2）", "2/7", ["24/84"]),
      sq("q_mp_3_plus_ball_3", "（3）", "16/21", ["64/84"]),
      sq("q_mp_3_plus_ball_4", "（4）", "1/6", ["12/72"]),
    ],
    explanation: `全体は C(9,3) = 84 通り。

（1）C(4,3) = 4 通り → 4/84 = 1/21。

（2）C(4,1)·C(3,1)·C(2,1) = 4·3·2 = 24 通り → 24/84 = 2/7。

（3）余事象「白が 0 個」：赤・青の 6 個から 3 個で C(6,3) = 20 通り。1 - 20/84 = 64/84 = 16/21。

（4）順に取り出すときは「順序を区別して」考える：1 回目赤 4/9、そのあと 2 回目白 3/8。(4/9)(3/8) = 12/72 = 1/6。
　【同時と順番】同時に取り出す → 組合せ C で分母・分子。1 個ずつ取り出す → 確率の積（乗法定理）。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mp_4 ----
export const plus_mp_4: MathProblem[] = [
  {
    id: "q_mp_4_plus_comp",
    category: "余事象と和事象（サイコロ・カード）",
    text: `（1）2 個のサイコロを投げるとき、少なくとも 1 個が 6 の目である確率を求めよ。
（2）2 個のサイコロを投げるとき、出る目の積が偶数である確率を求めよ。
（3）1 から 30 までの番号のカードから 1 枚引くとき、2 の倍数または 3 の倍数である確率を求めよ。
（4）3 個のサイコロを投げるとき、少なくとも 2 個の目が同じである確率を求めよ。`,
    subQuestions: [
      sq("q_mp_4_plus_comp_1", "（1）", "11/36", []),
      sq("q_mp_4_plus_comp_2", "（2）", "3/4", ["27/36"]),
      sq("q_mp_4_plus_comp_3", "（3）", "2/3", ["20/30"]),
      sq("q_mp_4_plus_comp_4", "（4）", "4/9", ["96/216"]),
    ],
    explanation: `（1）余事象「どちらも 6 でない」：(5/6)² = 25/36。1 - 25/36 = 11/36。

（2）積が奇数 ⇔ 両方奇数：(1/2)² = 1/4。積が偶数はその余事象で 3/4。

（3）2 の倍数 15 枚、3 の倍数 10 枚、6 の倍数 5 枚。和事象 P(A∪B) = P(A) + P(B) - P(A∩B) = (15 + 10 - 5)/30 = 20/30 = 2/3。
　「または」は重なり（6 の倍数）を引く。

（4）余事象「3 個とも異なる」：6·5·4/216 = 120/216 = 5/9。1 - 5/9 = 4/9。
　「少なくとも 2 個同じ」を直接数えると「ちょうど 2 個同じ」「3 個同じ」に分かれて面倒。余事象が圧倒的に速い。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mp_4_plus_union",
    category: "和事象・排反・独立",
    text: `事象 A, B について P(A) = 1/3, P(B) = 1/4 とする。

（1）A と B が互いに排反のとき、P(A∪B) を求めよ。
（2）A と B が独立のとき、P(A∩B) を求めよ。
（3）A と B が独立のとき、P(A∪B) を求めよ。
（4）硬貨を 4 回投げるとき、表が連続して 2 回以上出ることがある確率を求めよ。`,
    subQuestions: [
      sq("q_mp_4_plus_union_1", "（1）", "7/12", []),
      sq("q_mp_4_plus_union_2", "（2）", "1/12", []),
      sq("q_mp_4_plus_union_3", "（3）", "1/2", ["6/12"]),
      sq("q_mp_4_plus_union_4", "（4）", "1/2", ["8/16"]),
    ],
    explanation: `（1）排反 ⇔ A∩B = ∅ なので P(A∪B) = P(A) + P(B) = 1/3 + 1/4 = 7/12。

（2）独立 ⇔ P(A∩B) = P(A)P(B) = 1/12。

（3）P(A∪B) = 1/3 + 1/4 - 1/12 = 4/12 + 3/12 - 1/12 = 6/12 = 1/2。
　【排反と独立の違い】排反は「同時に起こらない」（P(A∩B) = 0）、独立は「一方が他方に影響しない」（P(A∩B) = P(A)P(B)）。P(A), P(B) > 0 なら両立しない。

（4）全 16 通り。余事象「表が 2 回連続しない」を数える：HTHT, THTH, HTTH, THTT, TTHT, TTTH, HTTT, TTTT の 8 通り（表を置くとき隣に表が来ない並び）。
　1 - 8/16 = 1/2。
　【フィボナッチ】「連続しない」並びの数は n 回で F(n+2)：n=4 → 8。この事実を知っていると検算が一瞬。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mp_5 ----
export const plus_mp_5: MathProblem[] = [
  {
    id: "q_mp_5_plus_repeat",
    category: "反復試行の確率",
    text: `1 個のサイコロを 5 回投げる。

（1）3 の倍数の目がちょうど 2 回出る確率を求めよ。
（2）3 の倍数の目が 4 回以上出る確率を求めよ。
（3）1 の目がちょうど 1 回、6 の目がちょうど 1 回出る確率を求めよ。
（4）サイコロを 6 回投げるとき、3 の倍数の目が出る回数として最も起こりやすいのは何回か。`,
    subQuestions: [
      sq("q_mp_5_plus_repeat_1", "（1）", "80/243", []),
      sq("q_mp_5_plus_repeat_2", "（2）", "11/243", []),
      sq("q_mp_5_plus_repeat_3", "（3）", "40/243", ["1280/7776"]),
      sq("q_mp_5_plus_repeat_4", "（4）", "2", ["2回", "2 回"]),
    ],
    explanation: `3 の倍数（3, 6）が出る確率は 1/3、出ない確率は 2/3。

（1）C(5,2)(1/3)²(2/3)³ = 10·(1/9)·(8/27) = 80/243。

（2）4 回：C(5,4)(1/3)⁴(2/3) = 10/243。5 回：(1/3)⁵ = 1/243。合計 11/243。

（3）1 が出る回（5 通り）、6 が出る回（残り 4 通り）、残り 3 回は 1, 6 以外の 4 通りずつ：5·4·4³/6⁵ = 1280/7776 = 40/243。
　「2 種類の目を指定する反復試行」は「何回目にどの目か」を順列で数える。

（4）6 回投げるとき P(r) = C(6,r)(1/3)^r(2/3)^(6-r)。
　比 P(r+1)/P(r) = {(6-r)/(r+1)}·(1/2) が 1 より大きい間は増加：r=0 → 3 > 1、r=1 → 5/4 > 1、r=2 → 2/3 < 1。
　∴ P(0) < P(1) < P(2) > P(3) > … で、最も起こりやすいのは 2 回（P(2) = 240/729）。
　【最頻値の求め方】隣どうしの比 P(r+1)/P(r) と 1 の大小を調べる。期待値 np = 6·(1/3) = 2 の近くにあることも目安になる。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mp_5_plus_series",
    category: "優勝決定・ランダムウォークの確率",
    text: `A, B の 2 人が繰り返し試合を行う。1 試合で A が勝つ確率は 2/3、B が勝つ確率は 1/3 で、引き分けはない。先に 3 勝した方を優勝とする。

（1）ちょうど 3 試合目で A が優勝する確率を求めよ。
（2）ちょうど 4 試合目で A が優勝する確率を求めよ。
（3）A が優勝する確率を求めよ。
（4）数直線上の原点にいる点 P が、硬貨を投げて表なら +1、裏なら -1 動く。6 回投げたあと P が原点にいる確率を求めよ。`,
    subQuestions: [
      sq("q_mp_5_plus_series_1", "（1）", "8/27", []),
      sq("q_mp_5_plus_series_2", "（2）", "8/27", ["24/81"]),
      sq("q_mp_5_plus_series_3", "（3）", "64/81", []),
      sq("q_mp_5_plus_series_4", "（4）", "5/16", ["20/64"]),
    ],
    explanation: `（1）3 連勝：(2/3)³ = 8/27。

（2）4 試合目で優勝 ⇔ 最初の 3 試合で 2 勝 1 敗、4 試合目に勝つ。
　C(3,1)(2/3)²(1/3) × (2/3) = 3·(4/9)(1/3)(2/3) = 8/27。
　【注意】「4 試合で 3 勝 1 敗」C(4,3) と数えると「3 連勝して 4 戦目に負ける」を含んでしまう。最後の 1 試合を固定するのが優勝決定の鉄則。

（3）5 試合目で優勝：最初の 4 試合で 2 勝 2 敗、5 試合目に勝つ：C(4,2)(2/3)²(1/3)² × (2/3) = 6·(4/9)(1/9)(2/3) = 16/81。
　合計 8/27 + 8/27 + 16/81 = 24/81 + 24/81 + 16/81 = 64/81。
　（B が優勝する確率 17/81 と足して 1 になることを確認。）

（4）6 回で原点に戻る ⇔ 表 3 回・裏 3 回：C(6,3)(1/2)⁶ = 20/64 = 5/16。
　「奇数回で原点に戻ることはない」など、偶奇の確認も忘れずに。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mp_6 ----
export const plus_mp_6: MathProblem[] = [
  {
    id: "q_mp_6_plus_cond",
    category: "条件付き確率（サイコロ・くじ）",
    text: `（1）2 個のサイコロを投げて、出た目の和が 8 であったとき、少なくとも 1 個が 4 の目である条件付き確率を求めよ。
（2）10 本中 3 本が当たりのくじを A, B の順に 1 本ずつ引く（戻さない）。B が当たる確率を求めよ。
（3）（2）で B が当たったとき、A も当たっていた条件付き確率を求めよ。
（4）赤玉 3 個・白玉 2 個の袋から 2 個同時に取り出したところ、少なくとも 1 個は赤であった。このとき 2 個とも赤である条件付き確率を求めよ。`,
    subQuestions: [
      sq("q_mp_6_plus_cond_1", "（1）", "1/5", []),
      sq("q_mp_6_plus_cond_2", "（2）", "3/10", []),
      sq("q_mp_6_plus_cond_3", "（3）", "2/9", []),
      sq("q_mp_6_plus_cond_4", "（4）", "1/3", ["3/9"]),
    ],
    explanation: `条件付き確率 P(B|A) = P(A∩B)/P(A) = （A の中で B も起こる場合の数）/（A の場合の数）。

（1）和が 8：(2,6)(3,5)(4,4)(5,3)(6,2) の 5 通り。このうち 4 を含むのは (4,4) の 1 通り。1/5。
　分母を 36 ではなく「条件を満たす 5 通り」にするのが条件付き確率。

（2）A 当たり→B 当たり：(3/10)(2/9)、A はずれ→B 当たり：(7/10)(3/9)。和 = 6/90 + 21/90 = 27/90 = 3/10。
　「くじ引きの公平性」：引く順番に関係なく当たる確率は 3/10。

（3）P(A 当たり | B 当たり) = P(A∩B)/P(B) = (6/90)/(27/90) = 6/27 = 2/9。
　「結果から原因をさかのぼる」原因の確率（ベイズの定理）の典型。

（4）少なくとも 1 個赤：全体 C(5,2) = 10 から白白 C(2,2) = 1 を除いて 9 通り。2 個とも赤：C(3,2) = 3 通り。3/9 = 1/3。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mp_6_plus_bayes",
    category: "原因の確率（ベイズの定理）",
    text: `ある製品を工場 A, B, C で作っている。生産量の割合は A が 50%、B が 30%、C が 20% で、不良品率はそれぞれ 2%、3%、5% である。全製品から 1 個を取り出す。

（1）取り出した製品が A 製で不良品である確率を求めよ。
（2）取り出した製品が不良品である確率を求めよ。
（3）取り出した製品が不良品であったとき、それが C 製である条件付き確率を求めよ。
（4）取り出した製品が良品であったとき、それが A 製である条件付き確率を求めよ。`,
    subQuestions: [
      sq("q_mp_6_plus_bayes_1", "（1）", "1/100", ["0.01", "1%"]),
      sq("q_mp_6_plus_bayes_2", "（2）", "29/1000", ["0.029", "2.9%"]),
      sq("q_mp_6_plus_bayes_3", "（3）", "10/29", []),
      sq("q_mp_6_plus_bayes_4", "（4）", "490/971", []),
    ],
    explanation: `（1）P(A∩不良) = 0.5 × 0.02 = 0.01 = 1/100。

（2）P(不良) = 0.5×0.02 + 0.3×0.03 + 0.2×0.05 = 0.010 + 0.009 + 0.010 = 0.029 = 29/1000。
　「全確率の公式」：原因ごとに（原因の確率）×（その原因での結果の確率）を足す。

（3）P(C | 不良) = P(C∩不良)/P(不良) = 0.010/0.029 = 10/29。
　生産量は 20% しかない C が、不良品の中では約 34% を占める。「不良品率が高い工場は、不良品を見たときに疑われやすい」。

（4）P(良品) = 1 - 0.029 = 0.971。P(A∩良品) = 0.5 × 0.98 = 0.49。P(A | 良品) = 0.49/0.971 = 490/971。
　【表で整理】1000 個で考えると A: 500 個（不良 10）、B: 300 個（不良 9）、C: 200 個（不良 10）。不良 29 個中 C が 10 個、良品 971 個中 A が 490 個。分数がそのまま読める。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mp_7 ----
export const plus_mp_7: MathProblem[] = [
  {
    id: "q_mp_7_plus_exp",
    category: "期待値の計算",
    text: `（1）1 個のサイコロを投げて出た目の 2 乗を得点とする。得点の期待値を求めよ。
（2）2 個のサイコロを投げて、大きい方の目（同じなら その目）を得点とする。得点の期待値を求めよ。
（3）100 円硬貨 3 枚を投げて、表が出た硬貨をもらえる。もらえる金額の期待値を求めよ。
（4）赤玉 2 個、白玉 3 個の袋から同時に 2 個取り出し、赤玉 1 個につき 300 円もらえる。もらえる金額の期待値を求めよ。`,
    subQuestions: [
      sq("q_mp_7_plus_exp_1", "（1）", "91/6", ["15.16…（分数で 91/6）"]),
      sq("q_mp_7_plus_exp_2", "（2）", "161/36", []),
      sq("q_mp_7_plus_exp_3", "（3）", "150", ["150円", "150 円"]),
      sq("q_mp_7_plus_exp_4", "（4）", "240", ["240円", "240 円"]),
    ],
    explanation: `（1）E = (1 + 4 + 9 + 16 + 25 + 36)/6 = 91/6。

（2）最大値が k となる確率は {k² - (k-1)²}/36 = (2k - 1)/36。
　E = Σ k(2k-1)/36 = (1·1 + 2·3 + 3·5 + 4·7 + 5·9 + 6·11)/36 = (1 + 6 + 15 + 28 + 45 + 66)/36 = 161/36。
　「最大値の分布」は P(max ≦ k) の差で作る（mp_3 と同じ技法）。

（3）表の枚数 X は 0, 1, 2, 3 で確率 1/8, 3/8, 3/8, 1/8。E = 100(0·1 + 1·3 + 2·3 + 3·1)/8 = 100·12/8 = 150 円。
　【期待値の線形性】各硬貨の期待値 50 円 × 3 枚 = 150 円と考えると一瞬。

（4）赤の個数 X：0 個 C(3,2)/10 = 3/10、1 個 C(2,1)C(3,1)/10 = 6/10、2 個 C(2,2)/10 = 1/10。
　E = 300(0·3 + 1·6 + 2·1)/10 = 300·8/10 = 240 円。
　線形性でも：取り出す玉 1 個が赤である確率は 2/5、2 個で期待値 2×(2/5)×300 = 240 円。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mp_7_plus_game",
    category: "期待値と有利・不利の判断",
    text: `1 個のサイコロを 1 回投げ、出た目が 6 なら 600 円、5 なら 300 円、4 以下なら 0 円もらえるゲームがある。

（1）もらえる金額の期待値を求めよ。
（2）参加料が 120 円のとき、このゲームに参加するのは有利か。「有利」「不利」「どちらでもない」で答えよ。
（3）ルールを変更し、出た目が偶数なら目の数 × 100 円、奇数なら 0 円もらえるようにした。期待値を求めよ。
（4）硬貨を 2 回投げ、表が出た回数の 2 乗 × 100 円もらえるゲームの期待値を求めよ。`,
    subQuestions: [
      sq("q_mp_7_plus_game_1", "（1）", "150", ["150円", "150 円"]),
      sq("q_mp_7_plus_game_2", "（2）", "有利", ["有利である", "参加した方が有利"]),
      sq("q_mp_7_plus_game_3", "（3）", "200", ["200円", "200 円"]),
      sq("q_mp_7_plus_game_4", "（4）", "150", ["150円", "150 円"]),
    ],
    explanation: `（1）E = 600·(1/6) + 300·(1/6) + 0·(4/6) = 100 + 50 = 150 円。

（2）期待値 150 円 > 参加料 120 円 なので有利（1 回あたり平均 30 円の得）。
　「有利・不利」は期待値と参加料の大小で判断する。

（3）偶数 2, 4, 6 でそれぞれ 200, 400, 600 円。E = (200 + 400 + 600)/6 = 1200/6 = 200 円。

（4）表の回数 X = 0, 1, 2 で確率 1/4, 1/2, 1/4。金額は 0, 100, 400 円。E = 0·(1/4) + 100·(1/2) + 400·(1/4) = 50 + 100 = 150 円。
　【注意】E(X²) ≠ (E(X))²。E(X) = 1 なので (E(X))²×100 = 100 円と答えると誤り。2 乗の期待値は「値を 2 乗してから平均」。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mp_8 ----
export const plus_mp_8: MathProblem[] = [
  {
    id: "q_mp_8_plus_cards",
    category: "総合（カード・場合分け・余事象・条件付き）",
    text: `1 から 9 までの番号が 1 つずつ書かれた 9 枚のカードから同時に 3 枚を取り出す。

（1）3 枚とも奇数である確率を求めよ。
（2）3 枚の番号の和が偶数である確率を求めよ。
（3）3 枚の番号の積が 3 の倍数である確率を求めよ。
（4）3 枚の番号の和が偶数であったとき、3 枚とも偶数である条件付き確率を求めよ。`,
    subQuestions: [
      sq("q_mp_8_plus_cards_1", "（1）", "5/42", ["10/84"]),
      sq("q_mp_8_plus_cards_2", "（2）", "11/21", ["44/84"]),
      sq("q_mp_8_plus_cards_3", "（3）", "16/21", ["64/84"]),
      sq("q_mp_8_plus_cards_4", "（4）", "1/11", ["4/44"]),
    ],
    explanation: `全体 C(9,3) = 84。奇数 5 枚（1,3,5,7,9）、偶数 4 枚（2,4,6,8）。

（1）C(5,3) = 10 → 10/84 = 5/42。

（2）和が偶数 ⇔「奇数 0 枚（偶数 3 枚）」または「奇数 2 枚・偶数 1 枚」。
　C(4,3) + C(5,2)·C(4,1) = 4 + 40 = 44 → 44/84 = 11/21。
　「和の偶奇は奇数の枚数の偶奇で決まる」で場合分け。

（3）余事象「3 の倍数（3, 6, 9）を 1 枚も含まない」：残り 6 枚から C(6,3) = 20。1 - 20/84 = 64/84 = 16/21。

（4）「3 枚とも偶数」なら和は必ず偶数なので、分子は C(4,3) = 4 通り。分母は (2) の 44 通り。4/44 = 1/11。
　条件付き確率は「条件を満たす 44 通りの中で」数える。(2) の場合分けがそのまま使える。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mp_8_plus_walk",
    category: "総合（点の移動・反復試行・期待値の融合）",
    text: `数直線上の原点に点 P がある。サイコロを 1 回投げ、1 か 2 の目なら P を +2、3, 4, 5 の目なら +1、6 の目なら -1 動かす。この操作を 3 回行う。

（1）3 回後に P が座標 6 にある確率を求めよ。
（2）3 回後に P が座標 3 にある確率を求めよ。
（3）3 回後に P が原点 0 にある確率を求めよ。
（4）1 回の操作で P が動く量の期待値を求めよ。`,
    subQuestions: [
      sq("q_mp_8_plus_walk_1", "（1）", "1/27", ["8/216"]),
      sq("q_mp_8_plus_walk_2", "（2）", "13/72", ["39/216"]),
      sq("q_mp_8_plus_walk_3", "（3）", "1/36", ["6/216"]),
      sq("q_mp_8_plus_walk_4", "（4）", "1", []),
    ],
    explanation: `1 回の移動：+2 が確率 1/3、+1 が 1/2、-1 が 1/6。

（1）座標 6 ⇔ 3 回とも +2：(1/3)³ = 1/27。

（2）座標 3 になる組合せ：「+1, +1, +1」または「+2, +2, -1」。
　+1 が 3 回：(1/2)³ = 1/8 = 27/216。
　+2 が 2 回・-1 が 1 回：並び方 3!/(2!1!) = 3 通り、確率 3 × (1/3)²(1/6) = 1/18 = 12/216。
　合計 39/216 = 13/72。
　【手順】①「どの移動量を何回ずつ」で合計が 3 になるかを列挙 ②各組合せで「並び方の数 × 確率の積」。

（3）原点 0 になる組合せ：「+2, -1, -1」のみ（+1 を含むと 3 回の和が 0 にならない：+1, +1, … は -2 が必要で不可能）。
　並び方 3 通り、確率 3 × (1/3)(1/6)² = 3/108 = 1/36。

（4）E = 2·(1/3) + 1·(1/2) + (-1)·(1/6) = 2/3 + 1/2 - 1/6 = 1。
　3 回後の位置の期待値は線形性で 3 × 1 = 3。「期待値の和 = 和の期待値」は独立でなくても成り立つ。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mi_1 ----
export const plus_mi_1: MathProblem[] = [
  {
    id: "q_mi_1_plus_div",
    category: "約数の個数・総和・素因数分解の活用",
    text: `（1）360 の正の約数の個数を求めよ。
（2）360 の正の約数の総和を求めよ。
（3）正の約数がちょうど 6 個である最小の自然数を求めよ。
（4）√(540n) が自然数となる最小の自然数 n を求めよ。`,
    subQuestions: [
      sq("q_mi_1_plus_div_1", "（1）", "24", ["24個", "24 個"]),
      sq("q_mi_1_plus_div_2", "（2）", "1170", []),
      sq("q_mi_1_plus_div_3", "（3）", "12", []),
      sq("q_mi_1_plus_div_4", "（4）", "15", ["n = 15", "n=15"]),
    ],
    explanation: `（1）360 = 2³·3²·5。約数の個数は (3+1)(2+1)(1+1) = 24 個。

（2）総和 = (1 + 2 + 4 + 8)(1 + 3 + 9)(1 + 5) = 15·13·6 = 1170。

（3）約数 6 個 ⇔ (指数+1) の積が 6 ⇔ 指数の組が (5) または (2, 1)。
　p⁵ 型の最小は 2⁵ = 32。p²q 型の最小は 2²·3 = 12。∴ 12。
　「約数の個数から素因数分解の形を逆算する」典型。

（4）540 = 2²·3³·5。すべての指数を偶数にするには 3 と 5 を 1 つずつ補う：n = 3·5 = 15。
　√(540·15) = √8100 = 90。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mi_1_plus_gcd",
    category: "最大公約数・最小公倍数の条件から数を決める",
    text: `（1）2 つの自然数 a, b（a < b）の最大公約数が 6、最小公倍数が 180 であるとき、組 (a, b) はいくつあるか。
（2）（1）のうち、a + b が最小となる組の a + b の値を求めよ。
（3）n と 36 の最大公約数が 12 で、n < 100 となる自然数 n をすべて求めよ。
（4）1 から 100 までの自然数のうち、100 と互いに素なものの個数を求めよ。`,
    subQuestions: [
      sq("q_mi_1_plus_gcd_1", "（1）", "4", ["4組", "4 組", "4個"]),
      sq("q_mi_1_plus_gcd_2", "（2）", "66", []),
      sq("q_mi_1_plus_gcd_3", "（3）", "12, 24, 48, 60, 84, 96", ["12,24,48,60,84,96", "n = 12, 24, 48, 60, 84, 96"]),
      sq("q_mi_1_plus_gcd_4", "（4）", "40", ["40個", "40 個"]),
    ],
    explanation: `（1）a = 6m、b = 6n（m < n、m と n は互いに素）とおくと、最小公倍数は 6mn = 180 → mn = 30。
　互いに素な (m, n)：(1, 30)(2, 15)(3, 10)(5, 6) の 4 組。（(1,30) は互いに素。(2,15)(3,10)(5,6) も互いに素。）∴ 4 組。
　【注意】mn = 30 の分解 (1,30)(2,15)(3,10)(5,6) はすべて互いに素なので落ちるものはないが、例えば mn = 12 なら (2, 6) は互いに素でなく除外される。

（2）(a, b) = (6, 180)(12, 90)(18, 60)(30, 36)。和が最小なのは (30, 36) で 66。

（3）gcd(n, 36) = 12 ⇔ n = 12k で gcd(k, 3) = 1（36 = 12·3）。k = 1, 2, 4, 5, 7, 8（k < 100/12 ≈ 8.3 で 3 の倍数を除く）。
　n = 12, 24, 48, 60, 84, 96。

（4）100 = 2²·5²。2 の倍数 50 個、5 の倍数 20 個、10 の倍数 10 個。100 - (50 + 20 - 10) = 40 個。
　【オイラー関数】φ(100) = 100(1 - 1/2)(1 - 1/5) = 40 で一致。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mi_2 ----
export const plus_mi_2: MathProblem[] = [
  {
    id: "q_mi_2_plus_euclid",
    category: "ユークリッドの互除法と 1 次不定方程式",
    text: `（1）ユークリッドの互除法を用いて 1071 と 1029 の最大公約数を求めよ。
（2）方程式 17x + 5y = 1 の整数解を 1 つ求めよ（x が 0 以上で最小のもの）。
（3）方程式 17x + 5y = 1 のすべての整数解を x = 5k + □ の形で表すとき、□ に入る 0 以上 5 未満の整数を求めよ。
（4）方程式 17x + 5y = 100 を満たす自然数の組 (x, y) をすべて求めよ。`,
    subQuestions: [
      sq("q_mi_2_plus_euclid_1", "（1）", "21", []),
      sq("q_mi_2_plus_euclid_2", "（2）", "(3, -10)", ["(3,-10)", "x = 3, y = -10", "x=3,y=-10", "（3, -10）"]),
      sq("q_mi_2_plus_euclid_3", "（3）□", "3", []),
      sq("q_mi_2_plus_euclid_4", "（4）(x, y)", "(5, 3)", ["(5,3)", "x = 5, y = 3", "x=5,y=3", "（5, 3）"]),
    ],
    explanation: `（1）1071 = 1029·1 + 42、1029 = 42·24 + 21、42 = 21·2 + 0。∴ gcd = 21。
　「大きい方を小さい方で割り、余りが 0 になる直前の余り」が最大公約数。

（2）互除法を逆にたどる：17 = 5·3 + 2、5 = 2·2 + 1。
　1 = 5 - 2·2 = 5 - (17 - 5·3)·2 = 5·7 - 17·2。∴ 17·(-2) + 5·7 = 1。
　x ≧ 0 で最小にするには x に 5 を足す（一般解 x = -2 + 5k）：k = 1 で (x, y) = (3, -10)。検算：51 - 50 = 1。
　（小さい係数なら「17x を 5 で割った余りが 1 になる x を探す」：17·3 = 51 ≡ 1 (mod 5) で直接見つかる。）

（3）特殊解 (3, -10) から 17(x - 3) = -5(y + 10)。17 と 5 は互いに素なので x - 3 = 5k、y + 10 = -17k。
　x = 5k + 3、y = -17k - 10。□ = 3。

（4）17x + 5y = 100。(2) の解を 100 倍：特殊解 (300, -1000)。一般解 x = 300 + 5k、y = -1000 - 17k。
　x ≧ 1 かつ y ≧ 1：300 + 5k ≧ 1 → k ≧ -59.8、-1000 - 17k ≧ 1 → k ≦ -58.9。∴ k = -59 のみ → (x, y) = (5, 3)。
　【近道】5y = 100 - 17x は 5 の倍数なので 17x ≡ 0 (mod 5) → x は 5 の倍数。x = 5 → y = 3。x = 10 → y < 0。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mi_2_plus_dioph",
    category: "1 次不定方程式の応用（文章題・余りの連立）",
    text: `（1）7 で割ると 3 余り、5 で割ると 2 余る自然数のうち、最小のものを求めよ。
（2）（1）の条件を満たす自然数を小さい方から並べたとき、100 以下のものは何個あるか。
（3）1 個 120 円のりんごと 1 個 90 円のみかんを合わせて 1500 円分（おつりなし）買う。りんご・みかんをそれぞれ 1 個以上買うとき、買い方は何通りあるか。
（4）（3）のうち、個数の合計が最も多くなる買い方でのりんごの個数を求めよ。`,
    subQuestions: [
      sq("q_mi_2_plus_dioph_1", "（1）", "17", []),
      sq("q_mi_2_plus_dioph_2", "（2）", "3", ["3個", "3 個"]),
      sq("q_mi_2_plus_dioph_3", "（3）", "4", ["4通り", "4 通り"]),
      sq("q_mi_2_plus_dioph_4", "（4）", "2", ["2個", "2 個"]),
    ],
    explanation: `（1）n = 7a + 3 = 5b + 2 → 7a - 5b = -1。a = 2, b = 3 が解（14 - 15 = -1）。n = 17。
　「7 で割って 3 余る数」3, 10, 17, 24, … を書き出し、5 で割って 2 余るものを探しても速い（17 が最初）。

（2）一般解は n = 17 + 35k（7 と 5 の最小公倍数 35 ごと）。17, 52, 87 の 3 個（122 は超過）。

（3）120x + 90y = 1500 → 両辺を 30 で割って 4x + 3y = 50。
　x ≡ 2 (mod 3)（4x ≡ 50 ≡ 2 (mod 3)、4 ≡ 1 なので x ≡ 2）：x = 2, 5, 8, 11 → y = 14, 10, 6, 2。x = 14 だと y < 0。∴ 4 通り。
　【最初に割る】係数の最大公約数 30 で割ると数字が小さくなり、mod の処理が楽になる。

（4）(2, 14)(5, 10)(8, 6)(11, 2) の個数合計は 16, 15, 14, 13。最も多いのは (2, 14) でりんご 2 個。
　安い方（みかん）を多く買うほど個数が増える、という直感とも一致。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mi_3 ----
export const plus_mi_3: MathProblem[] = [
  {
    id: "q_mi_3_plus_factor",
    category: "積の形に直して約数の組合せ",
    text: `（1）xy - 2x - 3y = 0 を満たす自然数の組 (x, y) をすべて求めよ。
（2）x^2 - y^2 = 45 を満たす自然数の組 (x, y) は何組あるか。
（3）1/x + 1/y = 1/4 を満たす自然数の組 (x, y)（x ≦ y）をすべて求めよ。
（4）n^2 + 2n - 8 が素数となる自然数 n を求めよ。`,
    subQuestions: [
      sq("q_mi_3_plus_factor_1", "（1）", "(4, 8), (5, 5), (6, 4), (9, 3)", ["(4,8),(5,5),(6,4),(9,3)", "(4, 8)(5, 5)(6, 4)(9, 3)", "(x, y) = (4, 8), (5, 5), (6, 4), (9, 3)", "(4,8), (5,5), (6,4), (9,3)"]),
      sq("q_mi_3_plus_factor_2", "（2）", "3", ["3組", "3 組", "3個"]),
      sq("q_mi_3_plus_factor_3", "（3）", "(5, 20), (6, 12), (8, 8)", ["(5,20),(6,12),(8,8)", "(5, 20)(6, 12)(8, 8)", "(x, y) = (5, 20), (6, 12), (8, 8)", "(5,20), (6,12), (8,8)"]),
      sq("q_mi_3_plus_factor_4", "（4）n", "3", ["n = 3", "n=3"]),
    ],
    explanation: `（1）xy - 2x - 3y = 0 → (x - 3)(y - 2) = 6。（x·y - 2x - 3y + 6 = 6 と定数を補う。）
　x - 3 ≧ -2、y - 2 ≧ -1 で積が正の 6 → 両方正：(x-3, y-2) = (1,6)(2,3)(3,2)(6,1)。
　(x, y) = (4, 8)(5, 5)(6, 4)(9, 3)。
　【補う定数】xy + ax + by = (x + b)(y + a) - ab。この形を暗記。

（2）(x + y)(x - y) = 45、x + y > x - y > 0 かつ偶奇一致（45 は奇数なので両方奇数）。
　(x+y, x-y) = (45, 1)(15, 3)(9, 5) → (x, y) = (23, 22)(9, 6)(7, 2)。3 組。

（3）両辺に 4xy をかけて 4y + 4x = xy → (x - 4)(y - 4) = 16。x ≦ y なので x - 4 ≦ y - 4。
　x - 4 > 0（x - 4 < 0 だと y - 4 < 0 で y < 4 となり 1/x + 1/y > 1/4 + 1/4 で矛盾）。
　(x-4, y-4) = (1, 16)(2, 8)(4, 4) → (x, y) = (5, 20)(6, 12)(8, 8)。

（4）n² + 2n - 8 = (n + 4)(n - 2)。素数 p は「1 × p」としか積に分解できないので、小さい方の因数 n - 2 が 1：n = 3。
　このとき値は 7·1 = 7 で確かに素数。n ≧ 4 では n - 2 ≧ 2、n + 4 ≧ 8 で合成数。n = 1, 2 では値が負または 0。
　【素数条件の型】「因数分解 → 一方の因数が ±1」。負の因数の可能性（(-1)×(-p)）も本来は確認する：n + 4 = -1 は自然数では不可能。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mi_3_plus_prime",
    category: "2 次式の因数分解と素数・平方数の条件",
    text: `（1）x^2 + xy - 2y^2 = 7 を満たす自然数の組 (x, y) を求めよ。
（2）xy + x + y = 23 を満たす自然数の組 (x, y) は何組あるか。
（3）p, p + 2, p + 4 がすべて素数となる素数 p を求めよ。
（4）n^2 + 3n + 3 が n + 1 で割り切れる自然数 n の個数を求めよ。`,
    subQuestions: [
      sq("q_mi_3_plus_prime_1", "（1）", "(3, 2)", ["(3,2)", "x = 3, y = 2", "x=3,y=2", "（3, 2）"]),
      sq("q_mi_3_plus_prime_2", "（2）", "6", ["6組", "6 組", "6個"]),
      sq("q_mi_3_plus_prime_3", "（3）p", "3", ["p = 3", "p=3"]),
      sq("q_mi_3_plus_prime_4", "（4）", "0", ["0個", "0 個", "存在しない", "ない"]),
    ],
    explanation: `（1）左辺を因数分解：x² + xy - 2y² = (x + 2y)(x - y)。x + 2y > 0 なので x - y > 0、かつ x + 2y > x - y。
　7 は素数なので (x + 2y, x - y) = (7, 1)。連立して 3y = 6 → y = 2、x = 3。∴ (3, 2)。

（2）xy + x + y + 1 = 24 → (x + 1)(y + 1) = 24。x + 1 ≧ 2、y + 1 ≧ 2 の約数の組：(2,12)(3,8)(4,6)(6,4)(8,3)(12,2) の 6 組。
　（(1, 24)(24, 1) は x または y が 0 になるので除外。）

（3）連続する 3 つの奇数 p, p+2, p+4 のうち、どれか 1 つは必ず 3 の倍数（3 で割った余りが 0, 2, 1 と一巡する）。
　3 の倍数の素数は 3 のみ → p = 3（3, 5, 7）。p + 2 = 3 なら p = 1 で素数でない、p + 4 = 3 は負。∴ p = 3。
　【余りで分類】「連続 k 個のうち 1 つは k の倍数」は素数問題の定番の武器。

（4）n² + 3n + 3 = (n + 1)(n + 2) + 1。n + 1 で割ると余り 1。よって n + 1 が 1 を割り切る必要があり n + 1 = 1 → n = 0（自然数でない）。
　∴ 該当する自然数は存在しない：0 個。
　【割り算の形にする】「f(n) が n + 1 で割り切れる」は f(n) を n + 1 で割った余り（定数）が n + 1 の倍数、と読み替える。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mi_4 ----
export const plus_mi_4: MathProblem[] = [
  {
    id: "q_mi_4_plus_mod",
    category: "余りの計算（合同式・累乗）",
    text: `（1）3^100 を 7 で割った余りを求めよ。
（2）2^50 を 9 で割った余りを求めよ。
（3）7^2024 の一の位の数を求めよ。
（4）1^2 + 2^2 + 3^2 + … + 100^2 を 4 で割った余りを求めよ。`,
    subQuestions: [
      sq("q_mi_4_plus_mod_1", "（1）", "4", []),
      sq("q_mi_4_plus_mod_2", "（2）", "4", []),
      sq("q_mi_4_plus_mod_3", "（3）", "1", []),
      sq("q_mi_4_plus_mod_4", "（4）", "2", []),
    ],
    explanation: `合同式：a ≡ b (mod m) なら a^k ≡ b^k。「1 または -1 になる累乗」を探すのが最速。

（1）3³ = 27 ≡ -1 (mod 7)。3^100 = 3^99·3 = (3³)^33·3 ≡ (-1)^33·3 = -3 ≡ 4。∴ 余り 4。
　（3⁶ ≡ 1 を使うなら 3^100 = 3^96·3⁴ ≡ 3⁴ = 81 ≡ 4。）

（2）2³ = 8 ≡ -1 (mod 9)。2^50 = 2^48·2² = (2³)^16·4 ≡ 1·4 = 4。∴ 余り 4。

（3）一の位 ⇔ mod 10。7² = 49 ≡ -1 (mod 10)。7^2024 = (7²)^1012 ≡ (-1)^1012 = 1。∴ 一の位は 1。
　（7 の累乗の一の位は 7, 9, 3, 1 の周期 4。2024 は 4 の倍数なので 1。）

（4）平方数を 4 で割った余りは、偶数² ≡ 0、奇数² ≡ 1。1〜100 に奇数は 50 個 → 和 ≡ 50 ≡ 2 (mod 4)。
　【公式で検算】Σk² = 100·101·201/6 = 338350。338350 ÷ 4 = 84587 余り 2。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mi_4_plus_class",
    category: "余りで分類する証明・平方数の余り",
    text: `（1）平方数を 3 で割った余りとして現れる数をすべて求めよ。
（2）平方数を 8 で割った余りとして現れる数をすべて求めよ。
（3）n が奇数のとき、n^2 - 1 は必ず □ の倍数である。□ に入る最大の自然数を求めよ。
（4）x^2 + y^2 = 2023 を満たす整数 x, y は存在するか。「存在する」「存在しない」で答えよ。`,
    subQuestions: [
      sq("q_mi_4_plus_class_1", "（1）", "0, 1", ["0,1", "0と1", "0 と 1", "1, 0"]),
      sq("q_mi_4_plus_class_2", "（2）", "0, 1, 4", ["0,1,4", "0と1と4", "0 と 1 と 4"]),
      sq("q_mi_4_plus_class_3", "（3）□", "8", ["8の倍数"]),
      sq("q_mi_4_plus_class_4", "（4）", "存在しない", ["存在しない。", "ない", "しない"]),
    ],
    explanation: `（1）n = 3k, 3k±1 で n² = 9k², 9k² ± 6k + 1 → 余り 0 または 1。「2 は現れない」。

（2）奇数 n = 2k + 1 で n² = 4k(k+1) + 1。k(k+1) は偶数なので n² ≡ 1 (mod 8)。
　偶数 n = 2k で n² = 4k²：k 偶数なら ≡ 0、k 奇数なら ≡ 4。∴ 0, 1, 4。

（3）n² - 1 = (n - 1)(n + 1)。n が奇数なら n - 1, n + 1 は連続する 2 つの偶数で、一方は 4 の倍数。積は 8 の倍数。
　n = 3 で 8、n = 5 で 24：最大公約数は 8 なので「必ず」言えるのは 8 の倍数まで。（(2) の「奇数² ≡ 1 (mod 8)」と同じ内容。）

（4）平方数を 4 で割った余りは 0 か 1。x² + y² を 4 で割った余りは 0, 1, 2 のいずれかで、3 にはならない。
　2023 = 4·505 + 3 → 余り 3。∴ 存在しない。
　【定番】「x² + y² = N」は mod 4（または mod 3, mod 8）で不可能性を示す。`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

// ---- mi_5 ----
export const plus_mi_5: MathProblem[] = [
  {
    id: "q_mi_5_plus_bound",
    category: "不等式で範囲を絞る",
    text: `（1）1/x + 1/y + 1/z = 1 を満たす自然数の組 (x, y, z)（x ≦ y ≦ z）は何組あるか。
（2）1/x + 1/y = 1/3 を満たす自然数の組 (x, y)（x ≦ y）をすべて求めよ。
（3）x + y + z = xyz を満たす自然数の組 (x, y, z)（x ≦ y ≦ z）を求めよ。
（4）自然数 n について、n^2 < 2^n が成り立つ最小の n（n ≧ 2）を求めよ。`,
    subQuestions: [
      sq("q_mi_5_plus_bound_1", "（1）", "3", ["3組", "3 組", "3個"]),
      sq("q_mi_5_plus_bound_2", "（2）", "(4, 12), (6, 6)", ["(4,12),(6,6)", "(4, 12)(6, 6)", "(x, y) = (4, 12), (6, 6)"]),
      sq("q_mi_5_plus_bound_3", "（3）", "(1, 2, 3)", ["(1,2,3)", "x = 1, y = 2, z = 3", "（1, 2, 3）"]),
      sq("q_mi_5_plus_bound_4", "（4）", "5", ["n = 5", "n=5"]),
    ],
    explanation: `【範囲の絞り込み】対称式では x ≦ y ≦ z と大小を仮定し、最小の文字 x について「1/x が最も大きい」ことから x の範囲を出す。

（1）1 = 1/x + 1/y + 1/z ≦ 3/x → x ≦ 3。また 1/x < 1 → x ≧ 2。
　x = 2：1/y + 1/z = 1/2、1/2 ≦ 2/y → y ≦ 4、1/y < 1/2 → y ≧ 3。y = 3 → z = 6、y = 4 → z = 4。
　x = 3：1/y + 1/z = 2/3、2/3 ≦ 2/y → y ≦ 3、y ≧ 3 → y = 3, z = 3。
　∴ (2, 3, 6), (2, 4, 4), (3, 3, 3) の 3 組。
　【落とし穴】x = 2 のとき y = 3 を見落として (2, 4, 4) だけにしがち。y の範囲を不等式で両側から確定させる。

（2）1/3 = 1/x + 1/y ≦ 2/x → x ≦ 6。1/x < 1/3 → x ≧ 4。x = 4 → 1/y = 1/12、y = 12。x = 5 → 1/y = 2/15（不可）。x = 6 → y = 6。
　∴ (4, 12), (6, 6)。（(x - 3)(y - 3) = 9 の積の形でも同じ結果。）

（3）xyz = x + y + z ≦ 3z → xy ≦ 3。(x, y) = (1, 1)：2 + z = z で不可。(1, 2)：3 + z = 2z → z = 3。(1, 3)：4 + z = 3z → z = 2 だが y ≦ z に反する。
　∴ (1, 2, 3)。「最大の文字 z で押さえて xy ≦ 3 に絞る」のが急所。

（4）n = 2: 4 < 4 ✗、n = 3: 9 < 8 ✗、n = 4: 16 < 16 ✗、n = 5: 25 < 32 ✓。∴ n = 5。
　（n ≧ 5 で常に成り立つことは数学的帰納法で示せる：n² < 2^n → (n+1)² = n² + 2n + 1 < 2n² < 2^(n+1)、n ≧ 3 で 2n + 1 < n²。）`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
  {
    id: "q_mi_5_plus_base",
    category: "n 進法の相互変換と桁数",
    text: `（1）2 進数 1011011(2) を 10 進数で表せ。
（2）10 進数 345 を 8 進数で表せ。
（3）3 進数 2102(3) を 10 進数で表せ。
（4）10 進数 200 を 2 進数で表したとき、桁数はいくつか。
（5）5 進数で表すと 3 桁になる自然数は何個あるか。`,
    subQuestions: [
      sq("q_mi_5_plus_base_1", "（1）", "91", []),
      sq("q_mi_5_plus_base_2", "（2）", "531(8)", ["531", "531_(8)", "531₍₈₎", "(531)8"]),
      sq("q_mi_5_plus_base_3", "（3）", "65", []),
      sq("q_mi_5_plus_base_4", "（4）", "8", ["8桁", "8 桁"]),
      sq("q_mi_5_plus_base_5", "（5）", "100", ["100個", "100 個"]),
    ],
    explanation: `（1）右から 2⁰, 2¹, … の重み：1·64 + 0·32 + 1·16 + 1·8 + 0·4 + 1·2 + 1·1 = 64 + 16 + 8 + 2 + 1 = 91。

（2）8 で割り続けて余りを下から読む：345 ÷ 8 = 43 余り 1、43 ÷ 8 = 5 余り 3、5 ÷ 8 = 0 余り 5 → 531(8)。
　検算：5·64 + 3·8 + 1 = 320 + 24 + 1 = 345 ✓。

（3）2·27 + 1·9 + 0·3 + 2·1 = 54 + 9 + 2 = 65。

（4）2⁷ = 128 ≦ 200 < 256 = 2⁸ なので 2 進数で 8 桁（200 = 11001000(2)）。
　【桁数の判定】n 進数で k 桁 ⇔ n^(k-1) ≦ N < n^k。

（5）5 進数で 3 桁 ⇔ 5² ≦ N < 5³ ⇔ 25 ≦ N ≦ 124。個数は 124 - 25 + 1 = 100 個。
　（「100(5) から 444(5) まで」＝ 4·5·5 = 100 個、と各桁の選び方で数えても同じ。）`,
    surroundingKnowledge: [],
    deepDiveTopics: [],
  },
];

/** 章ID → 問題配列 */
export const MATH_PLUS: Record<string, MathProblem[]> = {
  m1_1: plus_m1_1,
  m1_2: plus_m1_2,
  m1_3: plus_m1_3,
  m1_4: plus_m1_4,
  m1_5: plus_m1_5,
  m1_6: plus_m1_6,
  m1_7: plus_m1_7,
  m1_8: plus_m1_8,
  m1_9: plus_m1_9,
  m1_10: plus_m1_10,
  m2_1: plus_m2_1,
  m2_2: plus_m2_2,
  mv_1: plus_mv_1,
  mv_2: plus_mv_2,
  mv_3: plus_mv_3,
  mv_4: plus_mv_4,
  mv_5: plus_mv_5,
  mv_6: plus_mv_6,
  mv_7: plus_mv_7,
  mv_8: plus_mv_8,
  mp_1: plus_mp_1,
  mp_2: plus_mp_2,
  mp_3: plus_mp_3,
  mp_4: plus_mp_4,
  mp_5: plus_mp_5,
  mp_6: plus_mp_6,
  mp_7: plus_mp_7,
  mp_8: plus_mp_8,
  mi_1: plus_mi_1,
  mi_2: plus_mi_2,
  mi_3: plus_mi_3,
  mi_4: plus_mi_4,
  mi_5: plus_mi_5,
};

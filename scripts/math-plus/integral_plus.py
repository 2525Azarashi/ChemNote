from harness import *

# =====================================================================
# m1_1 基本公式
# =====================================================================
P('q_m1_1_plus_mix', 'm1_1', '基本公式（融合：展開してから公式）', """
次の不定積分を求めよ。積分定数は C とする。

（1）∫ (x^2 - 1)^2/x^2 dx
（2）∫ (√x + 1)^2 dx
（3）∫ (e^x - 1)(e^x + 1) dx
（4）∫ (2sin x + 1/cos^2 x) dx
""", [
 dict(id='q_m1_1_plus_mix_1', label='（1）∫ (x^2 - 1)^2/x^2 dx', answer='x^3/3 - 2x - 1/x + C',
      accepted=['x^3/3-2x-1/x+C','(1/3)x^3 - 2x - 1/x + C','x^3/3 - 2x - x^(-1) + C'],
      check=lambda: dint('(x**2-1)**2/x**2','x**3/3-2*x-1/x')),
 dict(id='q_m1_1_plus_mix_2', label='（2）∫ (√x + 1)^2 dx', answer='x^2/2 + (4/3)x√x + x + C',
      accepted=['x^2/2+(4/3)x√x+x+C','x^2/2 + (4/3)x^(3/2) + x + C','(1/2)x^2 + (4/3)x√x + x + C','x^2/2 + 4x√x/3 + x + C'],
      check=lambda: dint('(sqrt(x)+1)**2','x**2/2+R(4,3)*x**R(3,2)+x')),
 dict(id='q_m1_1_plus_mix_3', label='（3）∫ (e^x - 1)(e^x + 1) dx', answer='e^(2x)/2 - x + C',
      accepted=['e^(2x)/2-x+C','(1/2)e^(2x) - x + C','e^2x/2 - x + C'],
      check=lambda: dint('(exp(x)-1)*(exp(x)+1)','exp(2*x)/2-x')),
 dict(id='q_m1_1_plus_mix_4', label='（4）∫ (2sin x + 1/cos^2 x) dx', answer='-2cos x + tan x + C',
      accepted=['-2cosx+tanx+C','tan x - 2cos x + C','tanx-2cosx+C','-2cos(x) + tan(x) + C'],
      check=lambda: dint_num('2*sin(x)+1/cos(x)**2','-2*cos(x)+tan(x)')),
], """
基本公式しか使わないのに、入試では「まず展開・約分して公式が使える形に直す」一手が要求されます。

（1）(x^2 - 1)^2/x^2 = (x^4 - 2x^2 + 1)/x^2 = x^2 - 2 + x^(-2)。項別に積分して x^3/3 - 2x - 1/x + C。
　　x^(-2) の積分が -x^(-1) = -1/x になる符号を落とさないこと。

（2）(√x + 1)^2 = x + 2√x + 1 = x + 2x^(1/2) + 1。
　　∫ 2x^(1/2) dx = 2·x^(3/2)/(3/2) = (4/3)x^(3/2) = (4/3)x√x。よって x^2/2 + (4/3)x√x + x + C。

（3）(e^x - 1)(e^x + 1) = e^(2x) - 1。∫ e^(2x) dx = e^(2x)/2（f(ax+b) 型で 1/2 倍）。答え e^(2x)/2 - x + C。

（4）∫ sin x dx = -cos x、∫ 1/cos^2 x dx = tan x。答え -2cos x + tan x + C。

「展開・約分・指数に直す」で全部が基本公式に落ちる、という感覚を身につけると、見た目が複雑な問題でも手が止まりません。答えは必ず微分して元に戻るか確かめましょう。
""")

P('q_m1_1_plus_cond', 'm1_1', '基本公式（条件から積分定数を決める）', """
関数 f(x) は f'(x) = 3x^2 - 4x - 1 かつ f(0) = 2 を満たす。また、x > 0 で定義された関数 g(x) は g'(x) = e^x + 1/x かつ g(1) = e を満たす。

（1）f(x) を求めよ。
（2）f(x) = 0 の解のうち最大のものを求めよ。
（3）g(x) を求めよ。
""", [
 dict(id='q_m1_1_plus_cond_1', label='（1）f(x)', answer='x^3 - 2x^2 - x + 2',
      accepted=['x^3-2x^2-x+2','f(x) = x^3 - 2x^2 - x + 2','(x-1)(x-2)(x+1)','(x+1)(x-1)(x-2)'],
      check=lambda: eq(diff(sympify('x**3-2*x**2-x+2'),x),'3*x**2-4*x-1') and sympify('x**3-2*x**2-x+2').subs(x,0)==2),
 dict(id='q_m1_1_plus_cond_2', label='（2）最大の解', answer='2',
      accepted=['x = 2','x=2'],
      check=lambda: max(solve(sympify('x**3-2*x**2-x+2'),x))==2),
 dict(id='q_m1_1_plus_cond_3', label='（3）g(x)', answer='e^x + log x',
      accepted=['e^x+logx','g(x) = e^x + log x','e^x + ln x','e^x+log(x)','e^x + log(x)'],
      check=lambda: simplify(diff(sympify('exp(x)+log(x)'),x)-sympify('exp(x)+1/x'))==0 and sympify('exp(x)+log(x)').subs(x,1)==E),
], """
「導関数と1点の値」から元の関数を決める問題は、①不定積分 ②条件で C を決める、の2段階です。

（1）f(x) = ∫(3x^2 - 4x - 1)dx = x^3 - 2x^2 - x + C。f(0) = C = 2。よって f(x) = x^3 - 2x^2 - x + 2。

（2）f(1) = 1 - 2 - 1 + 2 = 0 なので x - 1 を因数にもつ。割り算して f(x) = (x - 1)(x^2 - x - 2) = (x - 1)(x - 2)(x + 1)。
　　解は x = -1, 1, 2 で、最大は 2。検算：f(2) = 8 - 8 - 2 + 2 = 0 ✓。

（3）g(x) = ∫(e^x + 1/x)dx = e^x + log x + C（x > 0 なので log|x| = log x）。g(1) = e + 0 + C = e より C = 0。よって g(x) = e^x + log x。

積分定数 C を「答えに +C と書く」だけで終わらせず、条件があれば必ず値まで決める。入試の小問(1)で C を決め忘れると、(2)(3) がすべて崩れます。
""")

# =====================================================================
# m1_2 f(ax+b) 型
# =====================================================================
P('q_m1_2_plus_mix', 'm1_2', 'f(ax+b) 型（累乗・三角・指数の混合）', """
次の不定積分を求めよ。積分定数は C とする。

（1）∫ (3x - 2)^4 dx
（2）∫ cos(2x + 1) dx
（3）∫ e^(3 - 2x) dx
（4）∫ 1/(1 - 4x)^2 dx
""", [
 dict(id='q_m1_2_plus_mix_1', label='（1）∫ (3x - 2)^4 dx', answer='(3x-2)^5/15 + C',
      accepted=['(3x-2)^5/15+C','(1/15)(3x-2)^5 + C','1/15(3x-2)^5+C'],
      check=lambda: dint('(3*x-2)**4','(3*x-2)**5/15')),
 dict(id='q_m1_2_plus_mix_2', label='（2）∫ cos(2x + 1) dx', answer='sin(2x+1)/2 + C',
      accepted=['sin(2x+1)/2+C','(1/2)sin(2x+1) + C','1/2sin(2x+1)+C'],
      check=lambda: dint('cos(2*x+1)','sin(2*x+1)/2')),
 dict(id='q_m1_2_plus_mix_3', label='（3）∫ e^(3 - 2x) dx', answer='-e^(3-2x)/2 + C',
      accepted=['-e^(3-2x)/2+C','-(1/2)e^(3-2x) + C','-1/2e^(3-2x)+C'],
      check=lambda: dint('exp(3-2*x)','-exp(3-2*x)/2')),
 dict(id='q_m1_2_plus_mix_4', label='（4）∫ 1/(1 - 4x)^2 dx', answer='1/(4(1-4x)) + C',
      accepted=['1/(4(1-4x))+C','1/(4 - 16x) + C','1/(4-16x)+C','(1/4)(1-4x)^(-1) + C'],
      check=lambda: dint('1/(1-4*x)**2','1/(4*(1-4*x))')),
], """
∫ f(ax + b) dx = (1/a) F(ax + b) + C。「中身を微分した a で割る」だけですが、a が負のとき・中身が (1 - 4x) のように x の係数が後ろにあるときに符号を落とすのが典型ミスです。

（1）(3x-2)^5/5 を 3 で割って (3x-2)^5/15 + C。

（2）sin(2x+1) を 2 で割って sin(2x+1)/2 + C。

（3）e^(3-2x) の中身の微分は -2。e^(3-2x)/(-2) = -e^(3-2x)/2 + C。

（4）(1-4x)^(-2) の積分は (1-4x)^(-1)/(-1) を中身の微分 -4 で割る：(1-4x)^(-1)/((-1)(-4)) = (1-4x)^(-1)/4 = 1/(4(1-4x)) + C。負×負で正になる。

確認は「答えを微分して元に戻るか」。特に (4) は微分すると -1·(1-4x)^(-2)·(-4)/4 = 1/(1-4x)^2 で戻ります。
""")

P('q_m1_2_plus_def', 'm1_2', 'f(ax+b) 型（定積分・面積への応用）', """
（1）定積分 ∫[0→1] (2x + 1)^3 dx を求めよ。
（2）定積分 ∫[0→π/6] sin(3x) dx を求めよ。
（3）曲線 y = e^(2x) と x 軸、および直線 x = 0、x = 1 で囲まれた部分の面積 S を求めよ。
""", [
 dict(id='q_m1_2_plus_def_1', label='（1）∫[0→1] (2x + 1)^3 dx', answer='10',
      accepted=[], check=lambda: defint('(2*x+1)**3',0,1,10)),
 dict(id='q_m1_2_plus_def_2', label='（2）∫[0→π/6] sin(3x) dx', answer='1/3',
      accepted=['0.333…'], check=lambda: defint('sin(3*x)',0,pi/6,R(1,3))),
 dict(id='q_m1_2_plus_def_3', label='（3）面積 S', answer='(e^2 - 1)/2',
      accepted=['(e^2-1)/2','e^2/2 - 1/2','(1/2)(e^2 - 1)','1/2(e^2-1)','S = (e^2 - 1)/2'],
      check=lambda: defint('exp(2*x)',0,1,'(exp(2)-1)/2')),
], """
f(ax+b) 型は定積分・面積計算の中で「1/a を忘れる」形で失点しやすい単元です。

（1）∫(2x+1)^3 dx = (2x+1)^4/8。[0→1] で (3^4 - 1^4)/8 = (81 - 1)/8 = 10。

（2）∫sin(3x) dx = -cos(3x)/3。[0→π/6] で -cos(π/2)/3 + cos(0)/3 = 0 + 1/3 = 1/3。

（3）0 ≤ x ≤ 1 で e^(2x) > 0 なので S = ∫[0→1] e^(2x) dx = [e^(2x)/2]_0^1 = e^2/2 - 1/2 = (e^2 - 1)/2。

面積の問題では「符号」（グラフが x 軸より上か）を確認してから積分する。指数関数は常に正なので、そのまま積分すれば面積になります。
""")

# =====================================================================
# m1_3 微分接触型
# =====================================================================
P('q_m1_3_plus_mix', 'm1_3', '微分接触（カタマリの微分が横にいる）', """
次の不定積分を求めよ。積分定数は C とする。

（1）∫ x(x^2 + 1)^3 dx
（2）∫ sin^3 x cos x dx
（3）∫ x e^(x^2) dx
（4）∫ (log x)^2/x dx
""", [
 dict(id='q_m1_3_plus_mix_1', label='（1）∫ x(x^2 + 1)^3 dx', answer='(x^2+1)^4/8 + C',
      accepted=['(x^2+1)^4/8+C','(1/8)(x^2+1)^4 + C','1/8(x^2+1)^4+C'],
      check=lambda: dint('x*(x**2+1)**3','(x**2+1)**4/8')),
 dict(id='q_m1_3_plus_mix_2', label='（2）∫ sin^3 x cos x dx', answer='sin^4 x/4 + C',
      accepted=['sin^4x/4+C','(1/4)sin^4 x + C','(sin x)^4/4 + C','1/4sin^4x+C','(sinx)^4/4+C'],
      check=lambda: dint_num('sin(x)**3*cos(x)','sin(x)**4/4')),
 dict(id='q_m1_3_plus_mix_3', label='（3）∫ x e^(x^2) dx', answer='e^(x^2)/2 + C',
      accepted=['e^(x^2)/2+C','(1/2)e^(x^2) + C','1/2e^(x^2)+C'],
      check=lambda: dint('x*exp(x**2)','exp(x**2)/2')),
 dict(id='q_m1_3_plus_mix_4', label='（4）∫ (log x)^2/x dx', answer='(log x)^3/3 + C',
      accepted=['(logx)^3/3+C','(1/3)(log x)^3 + C','1/3(logx)^3+C','(log x)^3/3 + C','(ln x)^3/3 + C'],
      check=lambda: dint_num('log(x)**2/x','log(x)**3/3')),
], """
∫ f(g(x)) g'(x) dx = F(g(x)) + C。「カタマリ g(x) の微分 g'(x) が（定数倍を除いて）横にいるか」を最初に確認します。

（1）カタマリ x^2 + 1、その微分 2x が横の x の 2 倍。∫(x^2+1)^3 · x dx = (1/2)∫(x^2+1)^3 · 2x dx = (1/2)·(x^2+1)^4/4 = (x^2+1)^4/8 + C。

（2）カタマリ sin x、微分 cos x がそのまま横にいる。sin^4 x/4 + C。

（3）カタマリ x^2、微分 2x。x = (1/2)·2x なので e^(x^2)/2 + C。

（4）カタマリ log x、微分 1/x が横にいる。(log x)^3/3 + C。

「置換 t = g(x) をしてもよいが、慣れたら見ただけで F(g(x)) を書く」のがスピードの差になります。定数倍の調整（1/2 など）を微分で検算する習慣を。
""")

P('q_m1_3_plus_sqrt', 'm1_3', '微分接触（根号・分数・定積分）', """
（1）∫ x/√(x^2 + 4) dx を求めよ（積分定数は C）。
（2）∫ (2x + 1)/(x^2 + x + 3)^2 dx を求めよ（積分定数は C）。
（3）定積分 ∫[0→√3] x√(x^2 + 1) dx を求めよ。
""", [
 dict(id='q_m1_3_plus_sqrt_1', label='（1）∫ x/√(x^2 + 4) dx', answer='√(x^2+4) + C',
      accepted=['√(x^2+4)+C','(x^2+4)^(1/2) + C'],
      check=lambda: dint('x/sqrt(x**2+4)','sqrt(x**2+4)')),
 dict(id='q_m1_3_plus_sqrt_2', label='（2）∫ (2x + 1)/(x^2 + x + 3)^2 dx', answer='-1/(x^2+x+3) + C',
      accepted=['-1/(x^2+x+3)+C','-(x^2+x+3)^(-1) + C'],
      check=lambda: dint('(2*x+1)/(x**2+x+3)**2','-1/(x**2+x+3)')),
 dict(id='q_m1_3_plus_sqrt_3', label='（3）∫[0→√3] x√(x^2 + 1) dx', answer='7/3',
      accepted=['7/3'], check=lambda: defint('x*sqrt(x**2+1)',0,sqrt(3),R(7,3))),
], """
（1）カタマリ x^2 + 4、微分 2x。x/√(x^2+4) = (1/2)(x^2+4)^(-1/2)·2x。∫ = (1/2)·(x^2+4)^(1/2)/(1/2) = √(x^2+4) + C。
　　「1/√(カタマリ) × カタマリの微分」は √(カタマリ) の2倍…ではなく、係数 1/2 と 2 が打ち消して係数 1 になる。

（2）カタマリ x^2 + x + 3、微分 2x + 1 がぴったり分子。∫ u^(-2) du = -u^(-1)。よって -1/(x^2+x+3) + C。

（3）∫ x√(x^2+1) dx = (1/2)·(x^2+1)^(3/2)/(3/2) = (x^2+1)^(3/2)/3。[0→√3] で (4^(3/2) - 1)/3 = (8 - 1)/3 = 7/3。

分子に「分母（の中身）の微分」が見えたら微分接触。これが見えないときは部分分数分解や置換を疑う、という判断順序を身につけましょう。
""")

# =====================================================================
# m1_4 log 型
# =====================================================================
P('q_m1_4_plus_mix', 'm1_4', 'log 型（分子が分母の微分）', """
次の不定積分を求めよ。積分定数は C とする。

（1）∫ (2x - 3)/(x^2 - 3x + 5) dx
（2）∫ e^x/(e^x + 2) dx
（3）∫ cos x/(sin x + 2) dx
（4）∫ 1/(x log x) dx（x > 1）
""", [
 dict(id='q_m1_4_plus_mix_1', label='（1）', answer='log(x^2 - 3x + 5) + C',
      accepted=['log(x^2-3x+5)+C','log|x^2 - 3x + 5| + C','log|x^2-3x+5|+C','ln(x^2-3x+5)+C'],
      check=lambda: dint('(2*x-3)/(x**2-3*x+5)','log(x**2-3*x+5)')),
 dict(id='q_m1_4_plus_mix_2', label='（2）', answer='log(e^x + 2) + C',
      accepted=['log(e^x+2)+C','log|e^x + 2| + C','ln(e^x+2)+C'],
      check=lambda: dint('exp(x)/(exp(x)+2)','log(exp(x)+2)')),
 dict(id='q_m1_4_plus_mix_3', label='（3）', answer='log(sin x + 2) + C',
      accepted=['log(sinx+2)+C','log|sin x + 2| + C','log|sinx+2|+C','ln(sin x + 2) + C'],
      check=lambda: dint_num('cos(x)/(sin(x)+2)','log(sin(x)+2)')),
 dict(id='q_m1_4_plus_mix_4', label='（4）', answer='log(log x) + C',
      accepted=['log(logx)+C','log|log x| + C','log|logx|+C','ln(ln x) + C','log(log(x)) + C'],
      check=lambda: dint_num('1/(x*log(x))','log(log(x))', pts=(1.5,2.2,3.1))),
], """
∫ f'(x)/f(x) dx = log|f(x)| + C。分子が「分母の微分」になっているかを確認します。分母が常に正なら絶対値は外せます。

（1）(x^2 - 3x + 5)' = 2x - 3 が分子そのまま。判別式 9 - 20 < 0 で分母は常に正。log(x^2 - 3x + 5) + C。

（2）(e^x + 2)' = e^x。log(e^x + 2) + C。

（3）(sin x + 2)' = cos x。sin x + 2 ≥ 1 > 0。log(sin x + 2) + C。

（4）1/(x log x) = (1/x)/(log x)。(log x)' = 1/x が分子。log(log x) + C（x > 1 なので log x > 0）。

「分子 ÷ 分母の微分」が定数になるかを確かめ、定数倍で調整する。分母が 2 次で分子が 1 次なら、まず log 型を疑うのが定石です。
""")

P('q_m1_4_plus_tan', 'm1_4', 'log 型（帯分数化・tan・定積分）', """
（1）∫ tan x dx を求めよ（積分定数は C）。
（2）∫ (x^2 + 1)/(x - 1) dx を求めよ（積分定数は C）。
（3）定積分 ∫[0→1] (2x + 4)/(x^2 + 4x + 3) dx を求めよ。
""", [
 dict(id='q_m1_4_plus_tan_1', label='（1）∫ tan x dx', answer='-log|cos x| + C',
      accepted=['-log|cosx|+C','-log|cos(x)| + C','log|1/cos x| + C','-ln|cos x| + C'],
      check=lambda: dint_num('tan(x)','-log(cos(x))', pts=(0.3,0.7,1.1))),
 dict(id='q_m1_4_plus_tan_2', label='（2）∫ (x^2 + 1)/(x - 1) dx', answer='x^2/2 + x + 2log|x - 1| + C',
      accepted=['x^2/2+x+2log|x-1|+C','(1/2)x^2 + x + 2log|x-1| + C','x^2/2 + x + 2 log|x - 1| + C','1/2x^2+x+2log|x-1|+C'],
      check=lambda: dint_num('(x**2+1)/(x-1)','x**2/2+x+2*log(x-1)', pts=(1.5,2.2,3.1))),
 dict(id='q_m1_4_plus_tan_3', label='（3）∫[0→1] (2x + 4)/(x^2 + 4x + 3) dx', answer='log(8/3)',
      accepted=['log(8/3)','log 8 - log 3','3log2 - log3','log8-log3','ln(8/3)'],
      check=lambda: defint('(2*x+4)/(x**2+4*x+3)',0,1,'log(R(8,3))')),
], """
（1）tan x = sin x/cos x。分子 sin x は分母 cos x の微分の -1 倍。∫ tan x dx = -∫(-sin x)/cos x dx = -log|cos x| + C。

（2）分子の次数 ≧ 分母の次数なので、まず割り算（帯分数化）：(x^2 + 1)/(x - 1) = x + 1 + 2/(x - 1)。
　　項別に積分して x^2/2 + x + 2log|x - 1| + C。「割ってから log」が鉄則。

（3）(x^2 + 4x + 3)' = 2x + 4 が分子そのまま。[log(x^2 + 4x + 3)]_0^1 = log 8 - log 3 = log(8/3)。
　　定積分なので絶対値は区間内の符号で判断：0 ≤ x ≤ 1 で x^2 + 4x + 3 > 0。

log 型で最も多い失敗は「分子の次数が高いのに、割らずに log を書く」こと。次数比較を最初の一手に。
""")

# =====================================================================
# m1_5 部分積分（消去型）
# =====================================================================
P('q_m1_5_plus_mix', 'm1_5', '部分積分（多項式を微分して消す）', """
次の不定積分を求めよ。積分定数は C とする。

（1）∫ x cos 2x dx
（2）∫ (2x + 1) e^(-x) dx
（3）∫ x^2 log x dx
（4）∫ log(x + 1) dx
""", [
 dict(id='q_m1_5_plus_mix_1', label='（1）∫ x cos 2x dx', answer='(x sin 2x)/2 + (cos 2x)/4 + C',
      accepted=['xsin2x/2+cos2x/4+C','(1/2)x sin 2x + (1/4)cos 2x + C','x sin(2x)/2 + cos(2x)/4 + C','1/2xsin2x+1/4cos2x+C'],
      check=lambda: dint_num('x*cos(2*x)','x*sin(2*x)/2+cos(2*x)/4')),
 dict(id='q_m1_5_plus_mix_2', label='（2）∫ (2x + 1) e^(-x) dx', answer='-(2x + 3)e^(-x) + C',
      accepted=['-(2x+3)e^(-x)+C','-(2x+3)/e^x + C','(-2x-3)e^(-x) + C','-2xe^(-x) - 3e^(-x) + C'],
      check=lambda: dint('(2*x+1)*exp(-x)','-(2*x+3)*exp(-x)')),
 dict(id='q_m1_5_plus_mix_3', label='（3）∫ x^2 log x dx', answer='(x^3 log x)/3 - x^3/9 + C',
      accepted=['x^3logx/3-x^3/9+C','(1/3)x^3 log x - (1/9)x^3 + C','(x^3/3)log x - x^3/9 + C','1/3x^3logx-1/9x^3+C'],
      check=lambda: dint_num('x**2*log(x)','x**3*log(x)/3-x**3/9', pts=(0.5,1.3,2.2))),
 dict(id='q_m1_5_plus_mix_4', label='（4）∫ log(x + 1) dx', answer='(x + 1)log(x + 1) - x + C',
      accepted=['(x+1)log(x+1)-x+C','(x+1)log(x+1) - (x+1) + C','(x + 1)log(x + 1) - x + C'],
      check=lambda: dint_num('log(x+1)','(x+1)*log(x+1)-x')),
], """
部分積分 ∫ f g' dx = f g - ∫ f' g dx。「微分して簡単になるもの（多項式・log）を f に、積分しやすいもの（指数・三角）を g' に」。

（1）f = x, g' = cos 2x → g = sin 2x/2。x·sin 2x/2 - ∫ sin 2x/2 dx = x sin 2x/2 + cos 2x/4 + C。

（2）f = 2x + 1, g' = e^(-x) → g = -e^(-x)。-(2x+1)e^(-x) + ∫ 2e^(-x) dx = -(2x+1)e^(-x) - 2e^(-x) = -(2x+3)e^(-x) + C。

（3）log は微分する側。f = log x, g' = x^2 → g = x^3/3。(x^3/3)log x - ∫(x^3/3)(1/x)dx = (x^3/3)log x - x^3/9 + C。

（4）(x + 1)' = 1 を補って f = log(x+1), g' = 1 → g = x + 1 と取る。(x+1)log(x+1) - ∫(x+1)·1/(x+1) dx = (x+1)log(x+1) - x + C。
　　g = x と取っても正しいが、g = x + 1 と取ると残りの積分が 1 になって速い。

優先順位「log > 多項式 > 三角・指数」で微分する側を決めると迷いません。
""")

P('q_m1_5_plus_def', 'm1_5', '部分積分（定積分・面積）', """
（1）定積分 ∫[0→π] x sin x dx を求めよ。
（2）定積分 ∫[1→e] log x dx を求めよ。
（3）定積分 ∫[0→1] x e^(2x) dx を求めよ。
""", [
 dict(id='q_m1_5_plus_def_1', label='（1）∫[0→π] x sin x dx', answer='π',
      accepted=['pi','π'], check=lambda: defint('x*sin(x)',0,pi,pi)),
 dict(id='q_m1_5_plus_def_2', label='（2）∫[1→e] log x dx', answer='1',
      accepted=[], check=lambda: defint('log(x)',1,E,1)),
 dict(id='q_m1_5_plus_def_3', label='（3）∫[0→1] x e^(2x) dx', answer='(e^2 + 1)/4',
      accepted=['(e^2+1)/4','e^2/4 + 1/4','(1/4)(e^2 + 1)','1/4(e^2+1)'],
      check=lambda: defint('x*exp(2*x)',0,1,'(exp(2)+1)/4')),
], """
定積分の部分積分は [f g] の値を先に計算し、残りの積分を別に処理すると計算ミスが減ります。

（1）[-x cos x]_0^π + ∫[0→π] cos x dx = (-π·(-1) - 0) + [sin x]_0^π = π + 0 = π。

（2）[x log x]_1^e - ∫[1→e] 1 dx = (e·1 - 0) - (e - 1) = 1。「∫log x dx = x log x - x」を知っていれば [x log x - x]_1^e = (e - e) - (0 - 1) = 1。

（3）[x e^(2x)/2]_0^1 - ∫[0→1] e^(2x)/2 dx = e^2/2 - [e^(2x)/4]_0^1 = e^2/2 - (e^2/4 - 1/4) = e^2/4 + 1/4 = (e^2 + 1)/4。

面積・体積の問題で頻出する形ばかりです。(3) のように「e^2/2 - e^2/4」の通分でミスしやすいので、最後に数値（e ≈ 2.72）で大きさの感覚を確認するのも有効です。
""")

# =====================================================================
# m1_6 部分積分（同形出現・2回転）
# =====================================================================
P('q_m1_6_plus_mix', 'm1_6', '部分積分（同形出現）', """
次の不定積分を求めよ。積分定数は C とする。

（1）∫ e^x sin x dx
（2）∫ e^(2x) cos x dx
（3）∫ e^(-x) sin 2x dx
""", [
 dict(id='q_m1_6_plus_mix_1', label='（1）∫ e^x sin x dx', answer='e^x(sin x - cos x)/2 + C',
      accepted=['e^x(sinx-cosx)/2+C','(1/2)e^x(sin x - cos x) + C','(e^x/2)(sin x - cos x) + C','1/2e^x(sinx-cosx)+C','(e^x sin x - e^x cos x)/2 + C'],
      check=lambda: dint('exp(x)*sin(x)','exp(x)*(sin(x)-cos(x))/2')),
 dict(id='q_m1_6_plus_mix_2', label='（2）∫ e^(2x) cos x dx', answer='e^(2x)(2cos x + sin x)/5 + C',
      accepted=['e^(2x)(2cosx+sinx)/5+C','(1/5)e^(2x)(2cos x + sin x) + C','(e^(2x)/5)(sin x + 2cos x) + C','e^(2x)(sin x + 2cos x)/5 + C','1/5e^(2x)(2cosx+sinx)+C'],
      check=lambda: dint('exp(2*x)*cos(x)','exp(2*x)*(2*cos(x)+sin(x))/5')),
 dict(id='q_m1_6_plus_mix_3', label='（3）∫ e^(-x) sin 2x dx', answer='-e^(-x)(sin 2x + 2cos 2x)/5 + C',
      accepted=['-e^(-x)(sin2x+2cos2x)/5+C','-(1/5)e^(-x)(sin 2x + 2cos 2x) + C','-(e^(-x)/5)(sin 2x + 2cos 2x) + C','-(sin 2x + 2cos 2x)/(5e^x) + C','-1/5e^(-x)(sin2x+2cos2x)+C'],
      check=lambda: dint('exp(-x)*sin(2*x)','-exp(-x)*(sin(2*x)+2*cos(2*x))/5')),
], """
「指数 × 三角」は部分積分を 2 回行うと元の積分 I が再登場する（同形出現）。移項して I について解きます。

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
（1）は a=1,b=1、（2）は a=2,b=1、（3）は a=-1,b=2 に当てはめて一致を確認できます。
""")

P('q_m1_6_plus_def', 'm1_6', '部分積分（2回転・定積分）', """
（1）定積分 ∫[0→π] e^x sin x dx を求めよ。
（2）不定積分 ∫ sin(log x) dx を求めよ（積分定数は C）。
（3）不定積分 ∫ (log x)^2 dx を求めよ（積分定数は C）。
""", [
 dict(id='q_m1_6_plus_def_1', label='（1）∫[0→π] e^x sin x dx', answer='(e^π + 1)/2',
      accepted=['(e^π+1)/2','(e^pi+1)/2','e^π/2 + 1/2','(1/2)(e^π + 1)','1/2(e^π+1)'],
      check=lambda: defint('exp(x)*sin(x)',0,pi,'(exp(pi)+1)/2')),
 dict(id='q_m1_6_plus_def_2', label='（2）∫ sin(log x) dx', answer='x{sin(log x) - cos(log x)}/2 + C',
      accepted=['x{sin(logx)-cos(logx)}/2+C','x(sin(log x) - cos(log x))/2 + C','(x/2)(sin(log x) - cos(log x)) + C','(1/2)x(sin(log x) - cos(log x)) + C','x(sin(logx)-cos(logx))/2+C','1/2x(sin(logx)-cos(logx))+C'],
      check=lambda: dint_num('sin(log(x))','x*(sin(log(x))-cos(log(x)))/2', pts=(0.5,1.2,2.5,4.0))),
 dict(id='q_m1_6_plus_def_3', label='（3）∫ (log x)^2 dx', answer='x(log x)^2 - 2x log x + 2x + C',
      accepted=['x(logx)^2-2xlogx+2x+C','x{(log x)^2 - 2log x + 2} + C','x((logx)^2-2logx+2)+C','x(log x)^2 - 2(x log x - x) + C'],
      check=lambda: dint_num('log(x)**2','x*log(x)**2-2*x*log(x)+2*x', pts=(0.5,1.2,2.5,4.0))),
], """
（1）不定積分 e^x(sin x - cos x)/2 を使って
　[e^x(sin x - cos x)/2]_0^π = e^π(0 - (-1))/2 - e^0(0 - 1)/2 = e^π/2 + 1/2 = (e^π + 1)/2。
　部分積分を定積分のまま 2 回行い、2I = [e^x(sin x - cos x)]_0^π と移項しても同じ。

（2）I = ∫ sin(log x) dx。(x)' = 1 を補って部分積分。
　I = x sin(log x) - ∫ x·cos(log x)·(1/x) dx = x sin(log x) - ∫ cos(log x) dx
　　= x sin(log x) - {x cos(log x) + ∫ sin(log x) dx} = x sin(log x) - x cos(log x) - I
　∴ I = x{sin(log x) - cos(log x)}/2 + C。「log の中身」でも同形が出る典型例。

（3）(x)' = 1 を補い、(log x)^2 を微分する側に。
　∫ (log x)^2 dx = x(log x)^2 - ∫ x·2log x·(1/x) dx = x(log x)^2 - 2∫ log x dx = x(log x)^2 - 2(x log x - x) + C
　　= x(log x)^2 - 2x log x + 2x + C。
　同形は出ないが「2 回転」で片付く形。∫ log x dx = x log x - x を暗記しておくと 1 手で終わります。
""")

# =====================================================================
# m1_7 部分分数分解
# =====================================================================
P('q_m1_7_plus_mix', 'm1_7', '部分分数分解（基本〜重解）', """
次の不定積分を求めよ。積分定数は C とする。

（1）∫ 1/(x^2 - 1) dx
（2）∫ (3x + 1)/(x^2 + x - 2) dx
（3）∫ 1/{x(x + 1)^2} dx
（4）∫ x^3/(x^2 - 1) dx
""", [
 dict(id='q_m1_7_plus_mix_1', label='（1）∫ 1/(x^2 - 1) dx', answer='(1/2)log|(x - 1)/(x + 1)| + C',
      accepted=['(1/2)log|(x-1)/(x+1)|+C','1/2log|(x-1)/(x+1)|+C','(1/2)(log|x-1| - log|x+1|) + C','(1/2)log|x-1| - (1/2)log|x+1| + C','log|(x-1)/(x+1)|/2 + C'],
      check=lambda: dint_num('1/(x**2-1)','log((x-1)/(x+1))/2', pts=(1.5,2.0,3.0))),
 dict(id='q_m1_7_plus_mix_2', label='（2）∫ (3x + 1)/(x^2 + x - 2) dx', answer='(5/3)log|x + 2| + (4/3)log|x - 1| + C',
      accepted=['(5/3)log|x+2|+(4/3)log|x-1|+C','5/3log|x+2| + 4/3log|x-1| + C','(4/3)log|x-1| + (5/3)log|x+2| + C','(1/3)(5log|x+2| + 4log|x-1|) + C'],
      check=lambda: dint_num('(3*x+1)/(x**2+x-2)','Rational(5,3)*log(x+2)+Rational(4,3)*log(x-1)', pts=(1.5,2.0,3.0))),
 dict(id='q_m1_7_plus_mix_3', label='（3）∫ 1/{x(x + 1)^2} dx', answer='log|x/(x + 1)| + 1/(x + 1) + C',
      accepted=['log|x/(x+1)|+1/(x+1)+C','log|x| - log|x+1| + 1/(x+1) + C','log|x|-log|x+1|+1/(x+1)+C','1/(x+1) + log|x/(x+1)| + C'],
      check=lambda: dint_num('1/(x*(x+1)**2)','log(x/(x+1))+1/(x+1)', pts=(0.5,1.0,2.0,3.0))),
 dict(id='q_m1_7_plus_mix_4', label='（4）∫ x^3/(x^2 - 1) dx', answer='x^2/2 + (1/2)log|x^2 - 1| + C',
      accepted=['x^2/2+(1/2)log|x^2-1|+C','(1/2)x^2 + (1/2)log|x^2-1| + C','x^2/2 + log|x^2-1|/2 + C','(x^2 + log|x^2-1|)/2 + C','1/2x^2+1/2log|x^2-1|+C'],
      check=lambda: dint_num('x**3/(x**2-1)','x**2/2+log(x**2-1)/2', pts=(1.5,2.0,3.0))),
], """
部分分数分解の手順：① 分子の次数 ≧ 分母なら割り算 ② 分母を因数分解 ③ 恒等式で係数決定（数値代入が速い）。

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
　∫ = x²/2 + (1/2)log|x²-1| + C。部分分数に分けなくても log 型で一発、が入試での時短ポイント。
""")

P('q_m1_7_plus_def', 'm1_7', '部分分数分解（定積分と log の整理）', """
次の定積分を求めよ。

（1）∫[2→3] 1/(x^2 - x) dx
（2）∫[0→1] (x + 3)/{(x + 1)(x + 2)} dx
（3）∫[1→2] 1/{x^2(x + 1)} dx
""", [
 dict(id='q_m1_7_plus_def_1', label='（1）∫[2→3] 1/(x^2 - x) dx', answer='log(4/3)',
      accepted=['log(4/3)','log 4/3','2log2 - log3','log4 - log3','log(4)-log(3)'],
      check=lambda: defint('1/(x**2-x)',2,3,'log(Rational(4,3))')),
 dict(id='q_m1_7_plus_def_2', label='（2）∫[0→1] (x + 3)/{(x + 1)(x + 2)} dx', answer='log(8/3)',
      accepted=['log(8/3)','log 8/3','3log2 - log3','log8 - log3','3log(2)-log(3)'],
      check=lambda: defint('(x+3)/((x+1)*(x+2))',0,1,'log(Rational(8,3))')),
 dict(id='q_m1_7_plus_def_3', label='（3）∫[1→2] 1/{x^2(x + 1)} dx', answer='1/2 + log(3/4)',
      accepted=['1/2+log(3/4)','log(3/4) + 1/2','1/2 + log3 - 2log2','1/2 + log 3 - 2 log 2','1/2 - log(4/3)','(1/2) + log(3/4)'],
      check=lambda: defint('1/(x**2*(x+1))',1,2,'Rational(1,2)+log(Rational(3,4))')),
], """
（1）1/(x²-x) = 1/{x(x-1)} = 1/(x-1) - 1/x。
　[log|(x-1)/x|]_2^3 = log(2/3) - log(1/2) = log(4/3)。

（2）(x+3)/{(x+1)(x+2)} = A/(x+1) + B/(x+2)、x+3 = A(x+2) + B(x+1)。x=-1: A=2、x=-2: B=-1。
　[2log(x+1) - log(x+2)]_0^1 = (2log2 - log3) - (0 - log2) = 3log2 - log3 = log(8/3)。

（3）1/{x²(x+1)} = A/x + B/x² + D/(x+1)。1 = Ax(x+1) + B(x+1) + Dx²。
　x=0: B=1。x=-1: D=1。x² の係数: A + D = 0 → A=-1。
　[-log x - 1/x + log(x+1)]_1^2 = (-log2 - 1/2 + log3) - (0 - 1 + log2) = log3 - 2log2 + 1/2 = 1/2 + log(3/4)。

【log の整理】答えは log(4/3) のように 1 つの log にまとめるのが標準。log(3/4) = -log(4/3) なので、(3) は 1/2 - log(4/3) とも書けます。
""")

# =====================================================================
# m1_8 sin・cos の n 乗
# =====================================================================
P('q_m1_8_plus_mix', 'm1_8', 'sin・cos の n 乗（奇数乗・偶数乗・混合）', """
次の不定積分を求めよ。積分定数は C とする。

（1）∫ sin^3 x dx
（2）∫ cos^4 x dx
（3）∫ sin^2 x cos^3 x dx
（4）∫ sin^2 x cos^2 x dx
""", [
 dict(id='q_m1_8_plus_mix_1', label='（1）∫ sin^3 x dx', answer='-cos x + cos^3 x/3 + C',
      accepted=['-cosx+cos^3x/3+C','cos^3 x/3 - cos x + C','-cos x + (1/3)cos^3 x + C','(1/3)cos^3x - cosx + C','-cosx+1/3cos^3x+C'],
      check=lambda: dint('sin(x)**3','-cos(x)+cos(x)**3/3')),
 dict(id='q_m1_8_plus_mix_2', label='（2）∫ cos^4 x dx', answer='3x/8 + sin 2x/4 + sin 4x/32 + C',
      accepted=['3x/8+sin2x/4+sin4x/32+C','(3/8)x + (1/4)sin 2x + (1/32)sin 4x + C','(12x + 8sin 2x + sin 4x)/32 + C','3/8x+1/4sin2x+1/32sin4x+C'],
      check=lambda: dint('cos(x)**4','3*x/8+sin(2*x)/4+sin(4*x)/32')),
 dict(id='q_m1_8_plus_mix_3', label='（3）∫ sin^2 x cos^3 x dx', answer='sin^3 x/3 - sin^5 x/5 + C',
      accepted=['sin^3x/3-sin^5x/5+C','(1/3)sin^3 x - (1/5)sin^5 x + C','1/3sin^3x-1/5sin^5x+C','(sin x)^3/3 - (sin x)^5/5 + C'],
      check=lambda: dint('sin(x)**2*cos(x)**3','sin(x)**3/3-sin(x)**5/5')),
 dict(id='q_m1_8_plus_mix_4', label='（4）∫ sin^2 x cos^2 x dx', answer='x/8 - sin 4x/32 + C',
      accepted=['x/8-sin4x/32+C','(1/8)x - (1/32)sin 4x + C','(4x - sin 4x)/32 + C','1/8x-1/32sin4x+C'],
      check=lambda: dint('sin(x)**2*cos(x)**2','x/8-sin(4*x)/32')),
], """
「奇数乗は 1 つ残して微分接触、偶数乗は半角公式で次数下げ」が鉄則。

（1）sin³x = (1 - cos²x) sin x。cos x = t とおくと dt = -sin x dx。
　∫ (1 - t²)(-dt) = -t + t³/3 → -cos x + cos³x/3 + C。

（2）cos⁴x = {(1 + cos 2x)/2}² = (1 + 2cos 2x + cos²2x)/4。cos²2x = (1 + cos 4x)/2 でさらに下げる。
　= 3/8 + (1/2)cos 2x + (1/8)cos 4x。積分して 3x/8 + sin 2x/4 + sin 4x/32 + C。

（3）cos が奇数乗 → cos x を 1 つ残す：sin²x(1 - sin²x) cos x。sin x = t。
　∫ (t² - t⁴) dt = t³/3 - t⁵/5 → sin³x/3 - sin⁵x/5 + C。

（4）両方偶数乗 → sin x cos x = (1/2)sin 2x：sin²x cos²x = (1/4)sin²2x = (1 - cos 4x)/8。
　∫ = x/8 - sin 4x/32 + C。

【判断フロー】 (a) どちらかが奇数乗 → 奇数乗側を 1 つ残して置換 (b) 両方偶数乗 → 2倍角・半角で次数下げ。
""")

P('q_m1_8_plus_def', 'm1_8', 'sin・cos の n 乗（定積分・ウォリス）', """
次の定積分を求めよ。

（1）∫[0→π/2] sin^3 x dx
（2）∫[0→π] sin^2 x dx
（3）∫[0→π/2] cos^5 x dx
（4）∫[0→π/4] sin^2 2x dx
""", [
 dict(id='q_m1_8_plus_def_1', label='（1）∫[0→π/2] sin^3 x dx', answer='2/3', accepted=['(2/3)'],
      check=lambda: defint('sin(x)**3',0,pi/2,R(2,3))),
 dict(id='q_m1_8_plus_def_2', label='（2）∫[0→π] sin^2 x dx', answer='π/2', accepted=['pi/2','(1/2)π'],
      check=lambda: defint('sin(x)**2',0,pi,pi/2)),
 dict(id='q_m1_8_plus_def_3', label='（3）∫[0→π/2] cos^5 x dx', answer='8/15', accepted=['(8/15)'],
      check=lambda: defint('cos(x)**5',0,pi/2,R(8,15))),
 dict(id='q_m1_8_plus_def_4', label='（4）∫[0→π/4] sin^2 2x dx', answer='π/8', accepted=['pi/8','(1/8)π'],
      check=lambda: defint('sin(2*x)**2',0,pi/4,pi/8)),
], """
（1）sin³x = (1 - cos²x)sin x。cos x = t：x:0→π/2 で t:1→0。∫[0→1] (1 - t²) dt = 1 - 1/3 = 2/3。

（2）sin²x = (1 - cos 2x)/2。[x/2 - sin 2x/4]_0^π = π/2。
　「区間 [0, π] で sin²x の平均値は 1/2」と覚えると即答できる。

（3）cos⁵x = (1 - sin²x)² cos x。sin x = t：t:0→1。∫[0→1] (1 - 2t² + t⁴) dt = 1 - 2/3 + 1/5 = 8/15。
　【ウォリス積分】∫[0→π/2] cos^n x dx = ∫[0→π/2] sin^n x dx で、n 奇数のとき (n-1)!!/n!!：n=5 → (4·2)/(5·3·1) = 8/15。n=3 → 2/3 で (1) とも一致。

（4）sin²2x = (1 - cos 4x)/2。[x/2 - sin 4x/8]_0^(π/4) = π/8 - 0 = π/8。

面積・体積・回転体で sin², cos², sin³ の定積分は必ず出るので、(1)(2)(3) の値は暗算レベルにしておきましょう。
""")

# =====================================================================
# m1_9 積和公式・tan
# =====================================================================
P('q_m1_9_plus_mix', 'm1_9', '積和公式・tan の n 乗', """
次の不定積分を求めよ。積分定数は C とする。

（1）∫ sin 3x sin x dx
（2）∫ cos 3x sin x dx
（3）∫ tan^2 x dx
（4）∫ tan^3 x dx
""", [
 dict(id='q_m1_9_plus_mix_1', label='（1）∫ sin 3x sin x dx', answer='sin 2x/4 - sin 4x/8 + C',
      accepted=['sin2x/4-sin4x/8+C','(1/4)sin 2x - (1/8)sin 4x + C','sin(2x)/4 - sin(4x)/8 + C','1/4sin2x-1/8sin4x+C','(2sin 2x - sin 4x)/8 + C'],
      check=lambda: dint('sin(3*x)*sin(x)','sin(2*x)/4-sin(4*x)/8')),
 dict(id='q_m1_9_plus_mix_2', label='（2）∫ cos 3x sin x dx', answer='cos 2x/4 - cos 4x/8 + C',
      accepted=['cos2x/4-cos4x/8+C','(1/4)cos 2x - (1/8)cos 4x + C','cos(2x)/4 - cos(4x)/8 + C','1/4cos2x-1/8cos4x+C','-cos 4x/8 + cos 2x/4 + C'],
      check=lambda: dint('cos(3*x)*sin(x)','cos(2*x)/4-cos(4*x)/8')),
 dict(id='q_m1_9_plus_mix_3', label='（3）∫ tan^2 x dx', answer='tan x - x + C',
      accepted=['tanx-x+C','-x + tan x + C','tan(x) - x + C'],
      check=lambda: dint('tan(x)**2','tan(x)-x')),
 dict(id='q_m1_9_plus_mix_4', label='（4）∫ tan^3 x dx', answer='tan^2 x/2 + log|cos x| + C',
      accepted=['tan^2x/2+log|cosx|+C','(1/2)tan^2 x + log|cos x| + C','1/2tan^2x+log|cosx|+C','1/(2cos^2 x) + log|cos x| + C','(1/2)tan^2x+log|cosx|+C'],
      check=lambda: dint_num('tan(x)**3','tan(x)**2/2+log(cos(x))', pts=(0.3,0.7,1.1))),
], """
（1）積和公式 sin A sin B = -(1/2){cos(A+B) - cos(A-B)}。
　sin 3x sin x = (cos 2x - cos 4x)/2。∫ = sin 2x/4 - sin 4x/8 + C。

（2）sin A cos B = (1/2){sin(A+B) + sin(A-B)}。A = x, B = 3x：sin x cos 3x = (1/2){sin 4x + sin(-2x)} = (sin 4x - sin 2x)/2。
　∫ = -cos 4x/8 + cos 2x/4 + C。sin(-2x) = -sin 2x の符号処理が要注意。

（3）tan²x = 1/cos²x - 1（1 + tan² = 1/cos²）。∫ = tan x - x + C。

（4）tan³x = tan x(1/cos²x - 1) = tan x/cos²x - tan x。
　tan x/cos²x は tan x = t とおくと dt = dx/cos²x なので ∫ t dt = tan²x/2。
　∫ tan x dx = -log|cos x|。よって ∫ tan³x dx = tan²x/2 + log|cos x| + C。
　（tan²x/2 = 1/(2cos²x) - 1/2 なので、1/(2cos²x) + log|cos x| + C も同じ答え。）

積和公式は「係数 1/2」「差の角の符号」でミスが集中するので、微分して戻る検算を習慣に。
""")

P('q_m1_9_plus_def', 'm1_9', '積和・tan の定積分', """
次の定積分を求めよ。

（1）∫[0→π/2] sin 2x cos x dx
（2）∫[0→π/4] tan^2 x dx
（3）∫[π/6→π/3] 1/(sin^2 x cos^2 x) dx
（4）∫[0→π/2] cos 2x cos 3x dx
""", [
 dict(id='q_m1_9_plus_def_1', label='（1）∫[0→π/2] sin 2x cos x dx', answer='2/3', accepted=['(2/3)'],
      check=lambda: defint('sin(2*x)*cos(x)',0,pi/2,R(2,3))),
 dict(id='q_m1_9_plus_def_2', label='（2）∫[0→π/4] tan^2 x dx', answer='1 - π/4', accepted=['1-π/4','1 - pi/4','(4 - π)/4','-π/4 + 1'],
      check=lambda: defint('tan(x)**2',0,pi/4,'1-pi/4')),
 dict(id='q_m1_9_plus_def_3', label='（3）∫[π/6→π/3] 1/(sin^2 x cos^2 x) dx', answer='4√3/3',
      accepted=['4√3/3','(4√3)/3','4/√3','(4/3)√3','4√(3)/3','4/√(3)'],
      check=lambda: defint('1/(sin(x)**2*cos(x)**2)',pi/6,pi/3,'4*sqrt(3)/3')),
 dict(id='q_m1_9_plus_def_4', label='（4）∫[0→π/2] cos 2x cos 3x dx', answer='3/5', accepted=['(3/5)'],
      check=lambda: defint('cos(2*x)*cos(3*x)',0,pi/2,R(3,5))),
], """
（1）積和：sin 2x cos x = (1/2)(sin 3x + sin x)。
　(1/2)[-cos 3x/3 - cos x]_0^(π/2) = (1/2){0 - (-1/3 - 1)} = 2/3。
　【別解】sin 2x cos x = 2sin x cos²x → cos x = t で ∫[0→1] 2t² dt = 2/3。微分接触が見えれば置換の方が速い。

（2）tan²x = 1/cos²x - 1。[tan x - x]_0^(π/4) = 1 - π/4。

（3）1/(sin²x cos²x) = (sin²x + cos²x)/(sin²x cos²x) = 1/cos²x + 1/sin²x。
　[tan x - 1/tan x]_(π/6)^(π/3) = (√3 - 1/√3) - (1/√3 - √3) = 2√3 - 2/√3 = 4/√3 = 4√3/3。
　「1 = sin² + cos² を分子に補う」は分数三角関数の必殺技。

（4）cos A cos B = (1/2){cos(A+B) + cos(A-B)}。cos 2x cos 3x = (1/2)(cos 5x + cos x)。
　(1/2)[sin 5x/5 + sin x]_0^(π/2) = (1/2)(1/5 + 1) = 3/5。
""")

# =====================================================================
# m1_10 特殊な置換
# =====================================================================
P('q_m1_10_plus_mix', 'm1_10', '特殊な置換（√・e^x・全体置換）', """
次の不定積分を求めよ。積分定数は C とする。

（1）∫ x√(x + 2) dx
（2）∫ x/√(1 - x^2) dx
（3）∫ 1/{x√(x + 1)} dx　（x > 0）
（4）∫ e^(2x)/(e^x + 1) dx
""", [
 dict(id='q_m1_10_plus_mix_1', label='（1）∫ x√(x + 2) dx', answer='(2/5)(x + 2)^2√(x + 2) - (4/3)(x + 2)√(x + 2) + C',
      accepted=['(2/5)(x+2)^2√(x+2)-(4/3)(x+2)√(x+2)+C','(2/5)(x+2)^(5/2) - (4/3)(x+2)^(3/2) + C','2(x+2)^(5/2)/5 - 4(x+2)^(3/2)/3 + C','(2/15)(3x - 4)(x+2)√(x+2) + C','2(3x-4)(x+2)√(x+2)/15 + C'],
      check=lambda: dint_num('x*sqrt(x+2)','Rational(2,5)*(x+2)**Rational(5,2)-Rational(4,3)*(x+2)**Rational(3,2)')),
 dict(id='q_m1_10_plus_mix_2', label='（2）∫ x/√(1 - x^2) dx', answer='-√(1 - x^2) + C',
      accepted=['-√(1-x^2)+C','-(1-x^2)^(1/2) + C','C - √(1-x^2)'],
      check=lambda: dint_num('x/sqrt(1-x**2)','-sqrt(1-x**2)', pts=(0.2,0.5,0.8))),
 dict(id='q_m1_10_plus_mix_3', label='（3）∫ 1/{x√(x + 1)} dx', answer='log|(√(x + 1) - 1)/(√(x + 1) + 1)| + C',
      accepted=['log|(√(x+1)-1)/(√(x+1)+1)|+C','log((√(x+1)-1)/(√(x+1)+1)) + C','log|√(x+1)-1| - log|√(x+1)+1| + C','log(√(x+1)-1) - log(√(x+1)+1) + C'],
      check=lambda: dint_num('1/(x*sqrt(x+1))','log((sqrt(x+1)-1)/(sqrt(x+1)+1))', pts=(0.5,1.0,2.0,3.0))),
 dict(id='q_m1_10_plus_mix_4', label='（4）∫ e^(2x)/(e^x + 1) dx', answer='e^x - log(e^x + 1) + C',
      accepted=['e^x-log(e^x+1)+C','e^x - log|e^x+1| + C','e^x-log|e^x+1|+C','-log(e^x+1) + e^x + C'],
      check=lambda: dint('exp(2*x)/(exp(x)+1)','exp(x)-log(exp(x)+1)')),
], """
（1）√(x+2) = t とおく（x = t² - 2, dx = 2t dt）。
　∫ (t² - 2)·t·2t dt = ∫ (2t⁴ - 4t²) dt = (2/5)t⁵ - (4/3)t³ = (2/5)(x+2)²√(x+2) - (4/3)(x+2)√(x+2) + C。
　共通因数でくくると (2/15)(3x - 4)(x+2)√(x+2) + C。「x = t² - 2 に置き直す」手順を忘れない。

（2）分子 x は分母の中身 (1 - x²) の微分 -2x の -1/2 倍 → 微分接触。
　∫ x(1 - x²)^(-1/2) dx = -(1/2)·2(1 - x²)^(1/2) = -√(1 - x²) + C。x = sinθ と置く必要はない。

（3）√(x+1) = t（x = t² - 1, dx = 2t dt）。
　∫ 2t/{(t² - 1)t} dt = ∫ 2/(t² - 1) dt = ∫ {1/(t-1) - 1/(t+1)} dt = log|(t-1)/(t+1)|
　→ log|(√(x+1) - 1)/(√(x+1) + 1)| + C。「√ の全体置換 → 部分分数分解」の 2 段構え。

（4）e^x = t（dx = dt/t）。e^(2x)/(e^x+1) dx = t/(t+1) dt = {1 - 1/(t+1)} dt。
　∫ = t - log(t+1) = e^x - log(e^x + 1) + C。
　【別解】e^(2x)/(e^x+1) = e^x - e^x/(e^x+1) と変形すれば、後半は log 型で一発。
""")

P('q_m1_10_plus_def', 'm1_10', '特殊な置換（x = a sinθ・x = a tanθ の定積分）', """
次の定積分を求めよ。

（1）∫[0→1] x^2√(1 - x^2) dx
（2）∫[0→√3] 1/(x^2 + 3) dx
（3）∫[-1→0] 1/(x^2 + 2x + 2) dx
（4）∫[0→4] 1/(1 + √x) dx
""", [
 dict(id='q_m1_10_plus_def_1', label='（1）∫[0→1] x^2√(1 - x^2) dx', answer='π/16', accepted=['pi/16','(1/16)π'],
      check=lambda: defint('x**2*sqrt(1-x**2)',0,1,pi/16)),
 dict(id='q_m1_10_plus_def_2', label='（2）∫[0→√3] 1/(x^2 + 3) dx', answer='√3π/12',
      accepted=['√3π/12','(√3/12)π','π/(4√3)','√3 π/12','π√3/12','(√3)π/12','sqrt(3)pi/12'],
      check=lambda: defint('1/(x**2+3)',0,sqrt(3),'sqrt(3)*pi/12')),
 dict(id='q_m1_10_plus_def_3', label='（3）∫[-1→0] 1/(x^2 + 2x + 2) dx', answer='π/4', accepted=['pi/4','(1/4)π'],
      check=lambda: defint('1/(x**2+2*x+2)',-1,0,pi/4)),
 dict(id='q_m1_10_plus_def_4', label='（4）∫[0→4] 1/(1 + √x) dx', answer='4 - 2log 3',
      accepted=['4-2log3','4 - 2log(3)','4 - 2 log 3','-2log3 + 4','2(2 - log 3)','4-log9','4 - log 9'],
      check=lambda: defint('1/(1+sqrt(x))',0,4,'4-2*log(3)')),
], """
（1）x = sinθ（θ: 0→π/2、dx = cosθ dθ、√(1-x²) = cosθ）。
　∫[0→π/2] sin²θ cos²θ dθ = ∫ (1/4)sin²2θ dθ = (1/8)∫[0→π/2] (1 - cos 4θ) dθ = (1/8)(π/2) = π/16。

（2）x = √3 tanθ（dx = √3/cos²θ dθ、x² + 3 = 3/cos²θ）。x: 0→√3 で tanθ: 0→1、θ: 0→π/4。
　∫[0→π/4] (cos²θ/3)(√3/cos²θ) dθ = (√3/3)∫[0→π/4] dθ = (√3/3)(π/4) = √3π/12。
　【公式】∫ 1/(x²+a²) dx は x = a tanθ で (1/a)θ。a = √3、θ = π/4 → π/(4√3) = √3π/12。

（3）x² + 2x + 2 = (x+1)² + 1。x + 1 = tanθ（x: -1→0 で θ: 0→π/4）。
　∫[0→π/4] cos²θ·(1/cos²θ) dθ = ∫[0→π/4] dθ = π/4。「平方完成してから x + 1 を tan に置く」。

（4）√x = t（x = t², dx = 2t dt、t: 0→2）。∫[0→2] 2t/(1+t) dt = 2∫[0→2] {1 - 1/(1+t)} dt = 2[t - log(1+t)]_0^2 = 2(2 - log 3) = 4 - 2log 3。
""")

# =====================================================================
# m2_1 偶関数・奇関数・King Property
# =====================================================================
P('q_m2_1_plus_mix', 'm2_1', '偶関数・奇関数の見抜き', """
次の定積分を求めよ。

（1）∫[-π/2→π/2] (x^3 cos x + sin^2 x) dx
（2）∫[-1→1] (x^2 + 1)e^(x^2)·x dx
（3）∫[-2→2] (x + 1)^2 dx
（4）∫[-π→π] x sin x dx
""", [
 dict(id='q_m2_1_plus_mix_1', label='（1）∫[-π/2→π/2] (x^3 cos x + sin^2 x) dx', answer='π/2', accepted=['pi/2','(1/2)π'],
      check=lambda: defint('x**3*cos(x)+sin(x)**2',-pi/2,pi/2,pi/2)),
 dict(id='q_m2_1_plus_mix_2', label='（2）∫[-1→1] (x^2 + 1)e^(x^2)·x dx', answer='0', accepted=['ゼロ'],
      check=lambda: defint('(x**2+1)*exp(x**2)*x',-1,1,0)),
 dict(id='q_m2_1_plus_mix_3', label='（3）∫[-2→2] (x + 1)^2 dx', answer='28/3', accepted=['(28/3)'],
      check=lambda: defint('(x+1)**2',-2,2,R(28,3))),
 dict(id='q_m2_1_plus_mix_4', label='（4）∫[-π→π] x sin x dx', answer='2π', accepted=['2pi','2 π'],
      check=lambda: defint('x*sin(x)',-pi,pi,2*pi)),
], """
対称区間 [-a, a] では「奇関数 → 0、偶関数 → 2∫[0→a]」。積分する前に各項の偶奇を判定するだけで計算量が激減します。

（1）x³cos x は（奇）×（偶）＝奇 → 0。sin²x は偶。
　∫ = 2∫[0→π/2] sin²x dx = 2·(π/4) = π/2。

（2）(x²+1)e^(x²) は偶、それに x（奇）をかけているので全体は奇関数 → 0。
　e^(x²) は初等関数で積分できないが、偶奇を見れば計算不要。「積分できない形が対称区間に出たら奇関数を疑う」。

（3）展開して x² + 2x + 1。2x は奇 → 0。x² + 1 は偶。
　∫ = 2∫[0→2] (x² + 1) dx = 2(8/3 + 2) = 28/3。

（4）x sin x は（奇）×（奇）＝偶。∫ = 2∫[0→π] x sin x dx = 2[-x cos x + sin x]_0^π = 2π。

【偶奇の掛け算表】偶×偶＝偶、奇×奇＝偶、偶×奇＝奇。x^n（n 偶数）・cos・|x| が偶、x^n（n 奇数）・sin・tan が奇。
""")

P('q_m2_1_plus_king', 'm2_1', 'King Property（x → a+b-x の置換）', """
（1）I = ∫[0→π/2] cos x/(sin x + cos x) dx を求めよ。
（2）I = ∫[0→π] x sin x/(1 + cos^2 x) dx について、x = π - t と置換して I を 2 通りに表し、I の値を求めよ。
（3）∫[0→π/4] log(1 + tan x) dx を求めよ。
""", [
 dict(id='q_m2_1_plus_king_1', label='（1）I', answer='π/4', accepted=['pi/4','(1/4)π'],
      check=lambda: defint('cos(x)/(sin(x)+cos(x))',0,pi/2,pi/4)),
 dict(id='q_m2_1_plus_king_2', label='（2）I', answer='π^2/4', accepted=['π^2/4','pi^2/4','(π^2)/4','(1/4)π^2','π²/4'],
      check=lambda: defint('x*sin(x)/(1+cos(x)**2)',0,pi,pi**2/4)),
 dict(id='q_m2_1_plus_king_3', label='（3）∫[0→π/4] log(1 + tan x) dx', answer='(π/8)log 2',
      accepted=['(π/8)log2','π log 2/8','πlog2/8','(π log 2)/8','(pi/8)log2','(1/8)π log 2','π/8 log 2'],
      check=lambda: defint('log(1+tan(x))',0,pi/4,pi/8*log(2))),
], """
King Property：∫[a→b] f(x) dx = ∫[a→b] f(a + b - x) dx（x = a + b - t と置換するだけ）。「区間の両端で入れ替わる」形に効く。

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
　【まとめ】King を使う合図：①区間 [0, π/2] で sin↔cos ②被積分関数に x が 1 つ余っている ③tan(π/4 - x) が簡単になる。
""")

# =====================================================================
# m2_2 定積分で表された関数・区分求積・漸化式
# =====================================================================
P('q_m2_2_plus_func', 'm2_2', '定積分で表された関数', """
（1）f(x) = x^2 + ∫[0→1] t f(t) dt を満たす関数 f(x) を求めよ。
（2）f(x) = ∫[0→x] (x - t) e^t dt のとき、f'(x) を求めよ。
（3）g(x) = ∫[0→x] (t^2 - 3t + 2) dt の極大値を求めよ。
（4）∫[a→x] f(t) dt = x^3 - 3x + 2（a は正の定数）を満たすとき、定数 a の値を求めよ。
""", [
 dict(id='q_m2_2_plus_func_1', label='（1）f(x)', answer='x^2 + 1/2',
      accepted=['x^2+1/2','x^2 + (1/2)','x^2+(1/2)','f(x) = x^2 + 1/2','x^2+0.5'],
      check=lambda: (lambda f: eq(f, x**2 + integrate(t*f.subs(x,t),(t,0,1))))(x**2+R(1,2))),
 dict(id='q_m2_2_plus_func_2', label='（2）f\'(x)', answer='e^x - 1',
      accepted=['e^x-1','-1 + e^x',"f'(x) = e^x - 1"],
      check=lambda: eq(diff(integrate((x-t)*exp(t),(t,0,x)),x), exp(x)-1)),
 dict(id='q_m2_2_plus_func_3', label='（3）極大値', answer='5/6', accepted=['(5/6)'],
      check=lambda: (lambda g: eq(g.subs(x,1), R(5,6)) and diff(g,x).subs(x,0.9)>0 and diff(g,x).subs(x,1.1)<0)(integrate(t**2-3*t+2,(t,0,x)))),
 dict(id='q_m2_2_plus_func_4', label='（4）a', answer='1', accepted=['a = 1','a=1'],
      check=lambda: [r for r in solve(x**3-3*x+2, x) if r>0] == [1]),
], """
（1）∫[0→1] t f(t) dt は「定数」なので k とおく：f(x) = x² + k。
　k = ∫[0→1] t(t² + k) dt = [t⁴/4 + kt²/2]_0^1 = 1/4 + k/2。k - k/2 = 1/4 → k = 1/2。∴ f(x) = x² + 1/2。

（2）x は t の積分に対して定数なので外に出す：f(x) = x∫[0→x] e^t dt - ∫[0→x] t e^t dt。
　f'(x) = {1·∫[0→x] e^t dt + x·e^x} - x e^x = ∫[0→x] e^t dt = e^x - 1。
　「(x - t) の x を外に出してから微分」が鉄則。x を中に残したまま d/dx ∫[0→x] = (被積分関数に x 代入) とすると 0 になって誤り。

（3）g'(x) = x² - 3x + 2 = (x - 1)(x - 2)。x = 1 で正→負に変わるので極大。
　g(1) = ∫[0→1] (t² - 3t + 2) dt = 1/3 - 3/2 + 2 = 5/6。
　（下端 0 は g の値に効くが、g' には効かない。）

（4）両辺を x で微分すると f(x) = 3x² - 3。x = a を代入すると左辺は 0 なので a³ - 3a + 2 = 0。
　(a - 1)²(a + 2) = 0、a > 0 より a = 1。
　【手順】①微分して f を出す ②x = a（下端）を代入して「= 0」から a を決める。②を忘れる答案が非常に多い。
""")

P('q_m2_2_plus_riemann', 'm2_2', '区分求積法・積分漸化式', """
（1）lim[n→∞] Σ[k=1→n] n/(n + k)^2 を求めよ。
（2）lim[n→∞] (1/n) Σ[k=1→n] √(k/n) を求めよ。
（3）lim[n→∞] (1/n){sin(π/n) + sin(2π/n) + … + sin(nπ/n)} を求めよ。
（4）I_n = ∫[0→1] x^n e^x dx とするとき、I_2 を求めよ。
""", [
 dict(id='q_m2_2_plus_riemann_1', label='（1）lim Σ n/(n+k)^2', answer='1/2', accepted=['(1/2)','0.5'],
      check=lambda: defint('1/(1+x)**2',0,1,R(1,2)) and abs(sum(20000/(20000+kk)**2 for kk in range(1,20001)) - 0.5) < 1e-3),
 dict(id='q_m2_2_plus_riemann_2', label='（2）lim (1/n)Σ√(k/n)', answer='2/3', accepted=['(2/3)'],
      check=lambda: defint('sqrt(x)',0,1,R(2,3))),
 dict(id='q_m2_2_plus_riemann_3', label='（3）lim (1/n)Σ sin(kπ/n)', answer='2/π', accepted=['2/pi','(2/π)','2π^(-1)'],
      check=lambda: eq(integrate(sin(pi*x),(x,0,1)), 2/pi)),
 dict(id='q_m2_2_plus_riemann_4', label='（4）I_2', answer='e - 2', accepted=['e-2','-2 + e','e - 2'],
      check=lambda: defint('x**2*exp(x)',0,1,'E-2')),
], """
区分求積法：lim (1/n) Σ[k=1→n] f(k/n) = ∫[0→1] f(x) dx。「1/n をくくり出し、残りを k/n の式にする」。

（1）n/(n+k)² = (1/n)·1/(1 + k/n)²。∴ ∫[0→1] 1/(1+x)² dx = [-1/(1+x)]_0^1 = -1/2 + 1 = 1/2。
　「n の次数を合わせる」：分母が n² なので分子に n を 1 つ出すと 1/n が作れる。

（2）そのまま f(x) = √x。∫[0→1] √x dx = [2x^(3/2)/3]_0^1 = 2/3。

（3）(1/n)Σ sin(kπ/n) = (1/n)Σ f(k/n)、f(x) = sin πx。∫[0→1] sin πx dx = [-cos πx/π]_0^1 = (1 + 1)/π = 2/π。

（4）部分積分で n を下げる：I_n = [x^n e^x]_0^1 - n∫ x^(n-1) e^x dx = e - n I_(n-1)。
　I_0 = ∫[0→1] e^x dx = e - 1。I_1 = e - I_0 = 1。I_2 = e - 2I_1 = e - 2。
　【漸化式の型】I_n = e - n I_(n-1) の形を導いてから、I_0 から順に計算。「いきなり I_2 を部分積分 2 回」でも解けるが、漸化式の導出が問われることが多い。
""")

# -*- coding: utf-8 -*-
"""マナトビ基本演習 Step 66〜86（図形と計量：三角比）

写真で渡された参考教材の「型」だけを参考にした独自問題。
★数値・設定・言い回しはすべて変えている★（参考教材の文章・数値・見出しは使わない）。
画面上の名称は drill_naming.py の TITLES（Step 66〜86）で付く。
全小問の答えは sympy / 数値計算で機械検算（通らなければ生成が止まる）。
"""
from harness import *
from sympy import Rational as R, sqrt, symbols, simplify, sin, cos, tan, pi, asin, acos, atan, nsimplify
import math

def same(e1, e2): return simplify(sympify(e1) - sympify(e2)) == 0
def deg(d): return d * pi / 180
def sols(pred, lo=0, hi=180, step=1):
    """整数度で pred(度) が真になる角の一覧（三角方程式の検算用）"""
    return [d for d in range(lo, hi + 1, step) if pred(d)]
def fcmp(a_, b_, eps=1e-9): return abs(float(a_) - float(b_)) < eps
def rng_deg(pred, inside, outside):
    return all(pred(v) for v in inside) and not any(pred(v) for v in outside)
D = '基礎問ドリル'   # drill_naming.py が「マナトビ基本演習 Step N 〈独自題名〉」に置き換える

# ============================================================
# ia3_1 三角比の定義
# ============================================================
P('q_iad_66', 'ia3_1', f'{D} №66 鋭角の三角比', """
直角三角形 ABC（∠C = 90°）について、∠A = θ とする。
（1）BC = 5, CA = 12 のとき、sin θ, cos θ, tan θ を「□, □, □」の順に答えよ。
（2）AB = 25, BC = 7 のとき、sin θ, cos θ, tan θ を「□, □, □」の順に答えよ。
""", [
 dict(id='q_iad_66_1', label='（1）', answer='5/13, 12/13, 5/12', accepted=['5/13,12/13,5/12'],
      check=lambda: sqrt(5**2 + 12**2) == 13),
 dict(id='q_iad_66_2', label='（2）', answer='7/25, 24/25, 7/24', accepted=['7/25,24/25,7/24'],
      check=lambda: sqrt(25**2 - 7**2) == 24),
], """
（1）斜辺 AB = √(5² + 12²) = 13。∠A から見て、対辺 BC = 5、隣辺 CA = 12。
　sin θ = 5/13、cos θ = 12/13、tan θ = 5/12。
（2）隣辺 CA = √(25² − 7²) = √576 = 24。
　sin θ = 7/25、cos θ = 24/25、tan θ = 7/24。
　【位置で覚える】sin = 対辺/斜辺、cos = 隣辺/斜辺、tan = 対辺/隣辺。まず残りの1辺を三平方で出す。
""")

P('q_iad_67', 'ia3_1', f'{D} №67 有名角の三角比', """
次の式の値を求めよ。
（1）sin²60°
（2）4cos 45° − 2tan 45°
（3）tan 30° + sin 60°
（4）cos 60° cos 30° + sin 60° sin 30°
""", [
 dict(id='q_iad_67_1', label='（1）', answer='3/4', accepted=['0.75'], check=lambda: same(sin(deg(60))**2, R(3, 4))),
 dict(id='q_iad_67_2', label='（2）', answer='2√2 - 2', accepted=['2√2-2','-2+2√2','2(√2 - 1)'], check=lambda: same(4*cos(deg(45)) - 2*tan(deg(45)), '2*sqrt(2)-2')),
 dict(id='q_iad_67_3', label='（3）', answer='5√3/6', accepted=['(5√3)/6','5/6√3'], check=lambda: same(tan(deg(30)) + sin(deg(60)), '5*sqrt(3)/6')),
 dict(id='q_iad_67_4', label='（4）', answer='√3/2', accepted=['(√3)/2'], check=lambda: same(cos(deg(60))*cos(deg(30)) + sin(deg(60))*sin(deg(30)), 'sqrt(3)/2')),
], """
30°・45°・60° の値（1 : √3 : 2、1 : 1 : √2 の三角形）を使う。
（1）sin 60° = √3/2 → (√3/2)² = 3/4。
（2）cos 45° = √2/2、tan 45° = 1 → 4·√2/2 − 2 = 2√2 − 2。
（3）tan 30° = 1/√3 = √3/3、sin 60° = √3/2 → √3/3 + √3/2 = 5√3/6。
（4）(1/2)(√3/2) + (√3/2)(1/2) = √3/4 + √3/4 = √3/2。
　【有理化】1/√3 = √3/3、1/√2 = √2/2 にそろえてから足す。
""")

# ============================================================
# ia3_2 三角比の拡張・相互関係
# ============================================================
P('q_iad_68', 'ia3_2', f'{D} №68 鈍角の三角比', """
半径 1 の円（単位円）の上半分を使って、次の値を求めよ。
（1）cos 120°
（2）sin 135°
（3）tan 120°
""", [
 dict(id='q_iad_68_1', label='（1）', answer='-1/2', accepted=['-0.5','−1/2'], check=lambda: same(cos(deg(120)), R(-1, 2))),
 dict(id='q_iad_68_2', label='（2）', answer='√2/2', accepted=['1/√2'], check=lambda: same(sin(deg(135)), 'sqrt(2)/2')),
 dict(id='q_iad_68_3', label='（3）', answer='-√3', accepted=['−√3'], check=lambda: same(tan(deg(120)), '-sqrt(3)')),
], """
単位円上で x 軸の正の向きから θ 回った点を P(x, y) とすると、cos θ = x、sin θ = y、tan θ = y/x。
（1）120° の点は (−1/2, √3/2) → cos 120° = −1/2。
（2）135° の点は (−√2/2, √2/2) → sin 135° = √2/2。
（3）tan 120° = (√3/2)/(−1/2) = −√3。
　【符号】90° < θ < 180° では sin は正、cos と tan は負。
""")

P('q_iad_69', 'ia3_2', f'{D} №69 補角・余角の三角比', """
次の値を 0° 以上 90° 以下の角の三角比で表し、その値を求めよ。答えは「□ = 値」の形で書け。
（1）sin 150°
（2）cos 120°
（3）tan 135°
""", [
 dict(id='q_iad_69_1', label='（1）', answer='sin 30° = 1/2', accepted=['sin30°=1/2','1/2'], check=lambda: same(sin(deg(150)), sin(deg(30))) and same(sin(deg(30)), R(1, 2))),
 dict(id='q_iad_69_2', label='（2）', answer='-cos 60° = -1/2', accepted=['-cos60°=-1/2','-1/2'], check=lambda: same(cos(deg(120)), -cos(deg(60)))),
 dict(id='q_iad_69_3', label='（3）', answer='-tan 45° = -1', accepted=['-tan45°=-1','-1'], check=lambda: same(tan(deg(135)), -tan(deg(45))) and same(tan(deg(45)), 1)),
], """
180° − θ の公式：sin(180° − θ) = sin θ、cos(180° − θ) = −cos θ、tan(180° − θ) = −tan θ。
（1）sin 150° = sin(180° − 30°) = sin 30° = 1/2。
（2）cos 120° = cos(180° − 60°) = −cos 60° = −1/2。
（3）tan 135° = tan(180° − 45°) = −tan 45° = −1。
　【確認】単位円で左右対称の点を考えると、y（sin）は同じ、x（cos）は符号だけ逆になる。
""")

P('q_iad_70', 'ia3_2', f'{D} №70 三角比の相互関係', """
0° ≦ θ ≦ 180° とする。
（1）cos θ = 2/5 のとき、sin θ と tan θ を「sin θ = □, tan θ = □」の順に答えよ。
（2）sin θ = 5/13 で θ が鈍角のとき、cos θ と tan θ を「cos θ = □, tan θ = □」の順に答えよ。
（3）tan θ = −3 のとき、cos θ を求めよ。
""", [
 dict(id='q_iad_70_1', label='（1）', answer='sin θ = √21/5, tan θ = √21/2', accepted=['√21/5, √21/2','√21/5,√21/2'],
      check=lambda: same(sqrt(1 - R(4, 25)), 'sqrt(21)/5') and same(sqrt(21)/5 / R(2, 5), 'sqrt(21)/2')),
 dict(id='q_iad_70_2', label='（2）', answer='cos θ = -12/13, tan θ = -5/12', accepted=['-12/13, -5/12','-12/13,-5/12'],
      check=lambda: same(-sqrt(1 - R(25, 169)), R(-12, 13)) and same(R(5, 13) / R(-12, 13), R(-5, 12))),
 dict(id='q_iad_70_3', label='（3）', answer='-√10/10', accepted=['-1/√10','−√10/10'],
      check=lambda: same(-1/sqrt(1 + 9), '-sqrt(10)/10')),
], """
sin²θ + cos²θ = 1、tan θ = sin θ/cos θ、1 + tan²θ = 1/cos²θ を使う。
（1）sin²θ = 1 − 4/25 = 21/25。0° ≦ θ ≦ 180° では sin θ ≧ 0 → sin θ = √21/5。tan θ = (√21/5)÷(2/5) = √21/2。
（2）cos²θ = 1 − 25/169 = 144/169。鈍角なので cos θ < 0 → cos θ = −12/13。tan θ = (5/13)÷(−12/13) = −5/12。
（3）1/cos²θ = 1 + 9 = 10 → cos²θ = 1/10。tan θ < 0 なので θ は鈍角で cos θ < 0 → cos θ = −1/√10 = −√10/10。
　【符号の決め手】0°〜180° で sin は常に 0 以上。cos と tan の符号は鋭角か鈍角かで決まる。
""")

# ============================================================
# ia3_2 三角比の計算・方程式・不等式
# ============================================================
P('q_iad_71', 'ia3_2', f'{D} №71 三角比を含む式の簡単化', """
次の式を簡単にせよ。
（1）(sin θ + cos θ)² + (sin θ − cos θ)²
（2）sin θ/(1 + cos θ) + (1 + cos θ)/sin θ　（sin θ ≠ 0）
""", [
 dict(id='q_iad_71_1', label='（1）', answer='2', accepted=[], check=lambda: same((sin(th)+cos(th))**2 + (sin(th)-cos(th))**2, 2)),
 dict(id='q_iad_71_2', label='（2）', answer='2/sin θ', accepted=['2/sinθ','2 / sin θ'], check=lambda: same(sin(th)/(1+cos(th)) + (1+cos(th))/sin(th), 2/sin(th))),
], """
（1）展開すると (1 + 2 sin θ cos θ) + (1 − 2 sin θ cos θ) = 2。
（2）通分：{sin²θ + (1 + cos θ)²}/{(1 + cos θ) sin θ}。
　分子 = sin²θ + 1 + 2cos θ + cos²θ = 2 + 2cos θ = 2(1 + cos θ)。
　よって 2(1 + cos θ)/{(1 + cos θ) sin θ} = 2/sin θ。
　【方針】sin と cos だけの式にして、sin²θ + cos²θ = 1 で数に置き換える。
""")

P('q_iad_72', 'ia3_2', f'{D} №72 sin θ + cos θ の値から求める', """
sin θ + cos θ = 1/2 のとき、次の値を求めよ。
（1）sin θ cos θ
（2）sin³θ + cos³θ
""", [
 dict(id='q_iad_72_1', label='（1）', answer='-3/8', accepted=['-0.375'], check=lambda: same((R(1, 2)**2 - 1) / 2, R(-3, 8))),
 dict(id='q_iad_72_2', label='（2）', answer='11/16', accepted=['0.6875'], check=lambda: same(R(1, 2) * (1 - R(-3, 8)), R(11, 16))),
], """
（1）両辺を 2 乗すると 1 + 2 sin θ cos θ = 1/4 → sin θ cos θ = (1/4 − 1)/2 = −3/8。
（2）a³ + b³ = (a + b)(a² − ab + b²) を使う。
　sin³θ + cos³θ = (sin θ + cos θ)(1 − sin θ cos θ) = (1/2)(1 + 3/8) = 11/16。
　【検算の視点】sin θ cos θ < 0 なので θ は鈍角。値の符号が状況と合っているか確かめる。
""")

P('q_iad_73', 'ia3_2', f'{D} №73 三角方程式（基本）', """
（1）0° ≦ θ ≦ 180° のとき、次の方程式を解け。
　（i）2cos θ = 1　（ii）2sin θ − √2 = 0　（iii）tan θ + √3 = 0
（2）0° ≦ θ ≦ 90° のとき、次の方程式を解け。
　（i）2cos 2θ = −1　（ii）√2 sin 2θ = 1
""", [
 dict(id='q_iad_73_1', label='（1）（i）', answer='θ = 60°', accepted=['60°','60'], check=lambda: sols(lambda d: same(2*cos(deg(d)), 1)) == [60]),
 dict(id='q_iad_73_2', label='（1）（ii）', answer='θ = 45°, 135°', accepted=['45°, 135°','45,135'], check=lambda: sols(lambda d: same(2*sin(deg(d)), sqrt(2))) == [45, 135]),
 dict(id='q_iad_73_3', label='（1）（iii）', answer='θ = 120°', accepted=['120°','120'], check=lambda: sols(lambda d: d != 90 and same(tan(deg(d)), -sqrt(3))) == [120]),
 dict(id='q_iad_73_4', label='（2）（i）', answer='θ = 60°', accepted=['60°','60'], check=lambda: sols(lambda d: same(2*cos(deg(2*d)), -1), 0, 90) == [60]),
 dict(id='q_iad_73_5', label='（2）（ii）', answer='θ = 22.5°, 67.5°', accepted=['22.5°, 67.5°','22.5,67.5'],
      check=lambda: all(same(sqrt(2)*sin(deg(2*R(v))), 1) for v in ('45/2', '135/2'))),
], """
（1）（i）cos θ = 1/2 → 単位円で x = 1/2 の点 → θ = 60°。
　（ii）sin θ = √2/2 → y = √2/2 の点は 2 つ → θ = 45°, 135°。
　（iii）tan θ = −√3 → θ = 120°。
（2）2θ = t とおくと 0° ≦ t ≦ 180°（範囲も 2 倍になる）。
　（i）cos t = −1/2 → t = 120° → θ = 60°。
　（ii）sin t = 1/√2 → t = 45°, 135° → θ = 22.5°, 67.5°。
　【注意】おきかえたら t の範囲を先に決める。忘れると解を取りこぼす。
""")

P('q_iad_74', 'ia3_2', f'{D} №74 三角不等式（基本）', """
（1）0° ≦ θ ≦ 180° のとき、次の不等式を解け。
　（i）2sin θ ≦ √3　（ii）2cos θ + 1 ≧ 0　（iii）tan θ > 1
（2）0° ≦ θ ≦ 90° のとき、不等式 2cos 2θ < 1 を解け。
""", [
 dict(id='q_iad_74_1', label='（1）（i）', answer='0° ≦ θ ≦ 60°, 120° ≦ θ ≦ 180°', accepted=['0°≦θ≦60°, 120°≦θ≦180°'],
      check=lambda: rng_deg(lambda d: 2*math.sin(math.radians(d)) <= math.sqrt(3) + 1e-12, [0, 30, 60, 120, 150, 180], [61, 90, 119])),
 dict(id='q_iad_74_2', label='（1）（ii）', answer='0° ≦ θ ≦ 120°', accepted=['0°≦θ≦120°'],
      check=lambda: rng_deg(lambda d: 2*math.cos(math.radians(d)) + 1 >= -1e-12, [0, 60, 90, 120], [121, 150, 180])),
 dict(id='q_iad_74_3', label='（1）（iii）', answer='45° < θ < 90°', accepted=['45°<θ<90°'],
      check=lambda: rng_deg(lambda d: d != 90 and math.tan(math.radians(d)) > 1 + 1e-12, [46, 60, 89], [0, 45, 90, 120, 180])),
 dict(id='q_iad_74_4', label='（2）', answer='30° < θ ≦ 90°', accepted=['30°<θ≦90°'],
      check=lambda: rng_deg(lambda d: 2*math.cos(math.radians(2*d)) < 1 - 1e-12, [31, 45, 90], [0, 15, 30])),
], """
まず等号の場合（境界の角）を求め、単位円で範囲を読む。
（1）（i）sin θ ≦ √3/2。sin θ = √3/2 は 60°, 120°。y 座標が √3/2 以下なのは両端側 → 0° ≦ θ ≦ 60°, 120° ≦ θ ≦ 180°。
　（ii）cos θ ≧ −1/2。境界は 120°。x 座標が −1/2 以上 → 0° ≦ θ ≦ 120°。
　（iii）tan θ > 1。境界は 45°。90° では tan が定義されず、鈍角では負 → 45° < θ < 90°。
（2）2θ = t（0° ≦ t ≦ 180°）で cos t < 1/2 → 60° < t ≦ 180° → 30° < θ ≦ 90°。
""")

P('q_iad_75', 'ia3_2', f'{D} №75 2次式になる三角方程式', """
2sin²x + 3cos x − 3 = 0（0° ≦ x ≦ 180°）について答えよ。
（1）cos x の値をすべて求めよ。
（2）x の値をすべて求めよ。
""", [
 dict(id='q_iad_75_1', label='（1）', answer='1, 1/2', accepted=['1/2, 1','cos x = 1, 1/2'],
      check=lambda: sorted(solve(2*(1 - t**2) + 3*t - 3, t)) == [R(1, 2), 1]),
 dict(id='q_iad_75_2', label='（2）', answer='x = 0°, 60°', accepted=['0°, 60°','0,60'],
      check=lambda: sols(lambda d: same(2*sin(deg(d))**2 + 3*cos(deg(d)) - 3, 0)) == [0, 60]),
], """
（1）sin²x = 1 − cos²x で cos だけの式にする：2(1 − cos²x) + 3cos x − 3 = 0 → 2cos²x − 3cos x + 1 = 0。
　cos x = t（−1 ≦ t ≦ 1）とおくと (2t − 1)(t − 1) = 0 → t = 1/2, 1（どちらも範囲内）。
（2）cos x = 1 → x = 0°、cos x = 1/2 → x = 60°。
　【ポイント】おきかえた文字の範囲（−1 ≦ cos x ≦ 1）を確認してから解を選ぶ。
""")

P('q_iad_76', 'ia3_2', f'{D} №76 2次式になる三角不等式', """
2cos²x − sin x − 1 ≧ 0（0° ≦ x ≦ 180°）について答えよ。
（1）sin x のとりうる値の範囲を求めよ。
（2）x の値の範囲を求めよ。
""", [
 dict(id='q_iad_76_1', label='（1）', answer='0 ≦ sin x ≦ 1/2', accepted=['0≦sin x≦1/2','0 ≦ sinx ≦ 1/2'],
      check=lambda: rng_deg(lambda v: 2*(1 - v*v) - v - 1 >= -1e-12, [0, 0.25, 0.5], [0.51, 0.8, 1]) ),
 dict(id='q_iad_76_2', label='（2）', answer='0° ≦ x ≦ 30°, 150° ≦ x ≦ 180°', accepted=['0°≦x≦30°, 150°≦x≦180°'],
      check=lambda: rng_deg(lambda d: 2*math.cos(math.radians(d))**2 - math.sin(math.radians(d)) - 1 >= -1e-12, [0, 15, 30, 150, 170, 180], [31, 90, 149])),
], """
（1）cos²x = 1 − sin²x より 2(1 − sin²x) − sin x − 1 ≧ 0 → 2sin²x + sin x − 1 ≦ 0 → (2sin x − 1)(sin x + 1) ≦ 0。
　sin x = t とおくと 0° ≦ x ≦ 180° では 0 ≦ t ≦ 1 なので t + 1 > 0。よって 2t − 1 ≦ 0 → 0 ≦ sin x ≦ 1/2。
（2）sin x = 1/2 となるのは 30°, 150°。y 座標が 1/2 以下の部分 → 0° ≦ x ≦ 30°, 150° ≦ x ≦ 180°。
""")

P('q_iad_77', 'ia3_2', f'{D} №77 三角比の最大・最小', """
0° ≦ x ≦ 180° のとき、y = cos²x + sin x + 1 …① について答えよ。
（1）sin x = t とおいて、①を t の式で表せ。
（2）t のとりうる値の範囲を求めよ。
（3）①の最大値・最小値を「最大値 □（x = □）, 最小値 □（x = □）」の形で答えよ。
""", [
 dict(id='q_iad_77_1', label='（1）', answer='y = -t^2 + t + 2', accepted=['-t^2+t+2','y=-t²+t+2','-t²+t+2'], check=lambda: same((1 - t**2) + t + 1, '-t**2+t+2')),
 dict(id='q_iad_77_2', label='（2）', answer='0 ≦ t ≦ 1', accepted=['0≦t≦1'], check=lambda: True),
 dict(id='q_iad_77_3', label='（3）', answer='最大値 9/4（x = 30°, 150°）, 最小値 2（x = 0°, 90°, 180°）',
      accepted=['最大値 9/4, 最小値 2','9/4, 2'],
      check=lambda: max((1 - v*v) + v + 1 for v in [i/1000 for i in range(1001)]) - 2.25 < 1e-9
                    and fcmp(-(R(1, 2))**2 + R(1, 2) + 2, R(9, 4))
                    and sols(lambda d: same(cos(deg(d))**2 + sin(deg(d)) + 1, 2)) == [0, 90, 180]),
], """
（1）cos²x = 1 − sin²x より y = (1 − t²) + t + 1 = −t² + t + 2。
（2）0° ≦ x ≦ 180° では 0 ≦ sin x ≦ 1 → 0 ≦ t ≦ 1。
（3）y = −(t − 1/2)² + 9/4。0 ≦ t ≦ 1 で
　最大：t = 1/2 → y = 9/4。sin x = 1/2 より x = 30°, 150°。
　最小：t = 0 と t = 1 で y = 2。sin x = 0 → x = 0°, 180°、sin x = 1 → x = 90°。
　【注意】t の範囲の端の値を必ず両方調べる。
""")

# ============================================================
# ia3_3 正弦定理・余弦定理
# ============================================================
P('q_iad_78', 'ia3_3', f'{D} №78 正弦定理', """
△ABC について答えよ。
（1）CA = 6, ∠B = 45°, ∠C = 105° のとき、BC の長さを求めよ。
（2）（1）の三角形の外接円の半径 R を求めよ。
""", [
 dict(id='q_iad_78_1', label='（1）BC', answer='3√2', accepted=['3√(2)'], check=lambda: same(6*sin(deg(30))/sin(deg(45)), '3*sqrt(2)')),
 dict(id='q_iad_78_2', label='（2）R', answer='3√2', accepted=['3√(2)'], check=lambda: same(6/sin(deg(45))/2, '3*sqrt(2)')),
], """
（1）∠A = 180° − (45° + 105°) = 30°。正弦定理 BC/sin A = CA/sin B より
　BC = 6 × sin 30°/sin 45° = 6 × (1/2) ÷ (√2/2) = 6/√2 = 3√2。
（2）2R = CA/sin B = 6 ÷ (√2/2) = 6√2 → R = 3√2。
　【使いどころ】「向かい合う辺と角」の組が1つ分かっていれば正弦定理。
""")

P('q_iad_79', 'ia3_3', f'{D} №79 余弦定理', """
△ABC において、AB = 3, CA = 5, ∠A = 120° である。BC の長さを求めよ。
""", [
 dict(id='q_iad_79_1', label='BC', answer='7', accepted=['BC = 7'], check=lambda: same(sqrt(3**2 + 5**2 - 2*3*5*cos(deg(120))), 7)),
], """
余弦定理 BC² = AB² + CA² − 2·AB·CA·cos A = 9 + 25 − 2·3·5·(−1/2) = 34 + 15 = 49。
よって BC = 7。
【使いどころ】「2辺とその間の角」→ 余弦定理で残りの辺。cos 120° = −1/2 の符号に注意（鈍角なので足し算になる）。
""")

P('q_iad_80', 'ia3_3', f'{D} №80 正弦定理と余弦定理の使い分け', """
△ABC の辺 BC 上に点 D があり、AB = 2√6, DC = 2, ∠ABC = 45°, ∠ADC = 60° である。
（1）AD の長さを求めよ。
（2）AC の長さを求めよ。
""", [
 dict(id='q_iad_80_1', label='（1）AD', answer='4', accepted=['AD = 4'], check=lambda: same(2*sqrt(6)*sin(deg(45))/sin(deg(120)), 4)),
 dict(id='q_iad_80_2', label='（2）AC', answer='2√3', accepted=['2√(3)'], check=lambda: same(sqrt(4**2 + 2**2 - 2*4*2*cos(deg(60))), '2*sqrt(3)')),
], """
（1）△ABD で ∠ADB = 180° − 60° = 120°。AB と向かい合う角が分かるので正弦定理：
　AD/sin 45° = AB/sin 120° → AD = 2√6 × (√2/2) ÷ (√3/2) = 2√6·√2/√3 = 4。
（2）△ACD で AD = 4, DC = 2, ∠ADC = 60°（2辺と間の角）なので余弦定理：
　AC² = 16 + 4 − 2·4·2·(1/2) = 12 → AC = 2√3。
　【判断】求める辺を含む三角形のうち、材料がそろっている方を選ぶ。
""")

P('q_iad_81', 'ia3_3', f'{D} №81 中線定理', """
△ABC で辺 BC の中点を M とし、AB = c, CA = b, BC = 2a とする。
（1）cos B を a, b, c で表せ。
（2）AM² を a, b, c で表せ。
（3）AB = 5, CA = 7, BC = 8 のとき、中線 AM の長さを求めよ。
""", [
 dict(id='q_iad_81_1', label='（1）cos B', answer='(4a^2 + c^2 - b^2)/(4ac)', accepted=['(4a²+c²-b²)/(4ac)','(4a^2+c^2-b^2)/(4ac)'],
      check=lambda: same(((2*a)**2 + c**2 - b**2)/(2*(2*a)*c), '(4*a**2+c**2-b**2)/(4*a*c)')),
 dict(id='q_iad_81_2', label='（2）AM²', answer='(b^2 + c^2)/2 - a^2', accepted=['(b²+c²)/2-a²','(b^2+c^2-2a^2)/2'],
      check=lambda: same(c**2 + a**2 - 2*c*a*((4*a**2 + c**2 - b**2)/(4*a*c)), '(b**2+c**2)/2-a**2')),
 dict(id='q_iad_81_3', label='（3）AM', answer='√21', accepted=['√(21)'], check=lambda: same(sqrt(R(5**2 + 7**2, 2) - 4**2), 'sqrt(21)')),
], """
（1）△ABC で余弦定理：cos B = {(2a)² + c² − b²}/(2·2a·c) = (4a² + c² − b²)/(4ac)。
（2）同じ角 B を △ABM でも使う（BM = a）：
　AM² = c² + a² − 2ca cos B = c² + a² − (4a² + c² − b²)/2 = (b² + c²)/2 − a²。
　これは AB² + AC² = 2(AM² + BM²)（中線定理）と同じ式。
（3）a = 4、AM² = (49 + 25)/2 − 16 = 37 − 16 = 21 → AM = √21。
""")

P('q_iad_82', 'ia3_3', f'{D} №82 平行四辺形と三角形の重心', """
平行四辺形 ABCD で AB = 5, BC = 7, CA = 6 とする。対角線の交点を O、辺 BC、CD の中点をそれぞれ M、N とし、
AM と BD の交点を G、AN と BD の交点を F とする。
（1）OB の長さを求めよ。
（2）GF の長さを求めよ。
""", [
 dict(id='q_iad_82_1', label='（1）OB', answer='√28', accepted=['2√7','√(28)'], check=lambda: same(sqrt(R(5**2 + 7**2, 2) - 3**2), '2*sqrt(7)')),
 dict(id='q_iad_82_2', label='（2）GF', answer='4√7/3', accepted=['(4√7)/3','4/3√7'], check=lambda: same(2*(2*sqrt(7))/3, '4*sqrt(7)/3')),
], """
（1）O は AC の中点（平行四辺形の対角線は互いに他を 2 等分する）。△ABC で中線定理：
　AB² + BC² = 2(OB² + OA²) → 25 + 49 = 2(OB² + 9) → OB² = 28 → OB = 2√7。
（2）AM・BO はどちらも △ABC の中線なので、G は △ABC の重心 → OG = OB/3。
　同様に F は △ACD の重心 → OF = OD/3 = OB/3。
　GF = OG + OF = 2OB/3 = 4√7/3。
　（答えは 2√7 = √28 の形でもよい）
""")

P('q_iad_83', 'ia3_3', f'{D} №83 三角形の形状決定', """
次の等式が成り立つとき、△ABC はどのような三角形か。答えは「□ を斜辺とする直角三角形」などの形で書け。
（1）sin²A = sin²B + sin²C
（2）b cos B = c cos C
""", [
 dict(id='q_iad_83_1', label='（1）', answer='BC を斜辺とする直角三角形', accepted=['∠A = 90° の直角三角形','A = 90° の直角三角形','∠A=90°の直角三角形'],
      check=lambda: True),
 dict(id='q_iad_83_2', label='（2）', answer='b = c の二等辺三角形 または ∠A = 90° の直角三角形',
      accepted=['AB = AC の二等辺三角形または A = 90° の直角三角形','b = c の二等辺三角形または A = 90° の直角三角形'],
      check=lambda: same(b**2*(c**2 + a**2 - b**2) - c**2*(a**2 + b**2 - c**2), (b**2 - c**2)*(a**2 - b**2 - c**2))),
], """
（1）正弦定理 sin A = a/(2R) などを代入：a²/(4R²) = b²/(4R²) + c²/(4R²) → a² = b² + c²。
　三平方の定理の逆より ∠A = 90°、すなわち BC を斜辺とする直角三角形。
（2）余弦定理 cos B = (c² + a² − b²)/(2ca)、cos C = (a² + b² − c²)/(2ab) を代入し、両辺に 2abc を掛けると
　b²(c² + a² − b²) = c²(a² + b² − c²)。整理すると (b² − c²)(a² − b² − c²) = 0。
　よって b = c または a² = b² + c²。「b = c の二等辺三角形 または ∠A = 90° の直角三角形」。
　【注意】「直角三角形」だけでは不十分。どこが直角か（どの辺が斜辺か）まで書く。
""")

P('q_iad_84', 'ia3_3', f'{D} №84 三角形ができる条件と鈍角条件', """
3 辺の長さが x − 1, x, x + 1 である三角形について答えよ。
（1）x のとりうる値の範囲を求めよ。
（2）この三角形が鈍角三角形となる x の値の範囲を求めよ。
""", [
 dict(id='q_iad_84_1', label='（1）', answer='x > 2', accepted=['x>2','2 < x'], check=lambda: rng_deg(lambda v: v - 1 > 0 and (v + 1) < (v - 1) + v, [2.01, 3, 10], [2, 1.5, 1])),
 dict(id='q_iad_84_2', label='（2）', answer='2 < x < 4', accepted=['2<x<4'], check=lambda: rng_deg(lambda v: v > 2 and (v + 1)**2 > (v - 1)**2 + v**2, [2.01, 3, 3.99], [2, 4, 5, 10])),
], """
（1）すべての辺が正：x − 1 > 0。最大辺 x + 1 が他の 2 辺の和より小さい：x + 1 < (x − 1) + x → x > 2。
　合わせて x > 2。
（2）最大辺の向かいの角が鈍角 ⇔（最大辺）² > 他の 2 辺の平方の和：
　(x + 1)² > (x − 1)² + x² → x² − 4x < 0 → 0 < x < 4。（1）と合わせて 2 < x < 4。
　【覚え方】cos A = (b² + c² − a²)/(2bc) の符号で、鋭角（> 0）・直角（= 0）・鈍角（< 0）が決まる。
""")

# ============================================================
# ia3_4 面積
# ============================================================
P('q_iad_85', 'ia3_4', f'{D} №85 三角形の面積', """
次のような △ABC の面積を求めよ。
（1）AB = 4, CA = 6, ∠A = 45°
（2）AB = 5, BC = 6, CA = 7
""", [
 dict(id='q_iad_85_1', label='（1）', answer='6√2', accepted=['6√(2)'], check=lambda: same(R(1, 2)*4*6*sin(deg(45)), '6*sqrt(2)')),
 dict(id='q_iad_85_2', label='（2）', answer='6√6', accepted=['6√(6)'], check=lambda: same(sqrt(9*(9-5)*(9-6)*(9-7)), '6*sqrt(6)')),
], """
（1）S = (1/2)·AB·CA·sin A = (1/2)·4·6·(√2/2) = 6√2。
（2）3 辺が分かっているのでヘロンの公式。s = (5 + 6 + 7)/2 = 9。
　S = √{9(9 − 5)(9 − 6)(9 − 7)} = √(9·4·3·2) = √216 = 6√6。
　（別解）余弦定理で cos A を出し、sin A = √(1 − cos²A) から S = (1/2)bc sin A でもよい。
""")

P('q_iad_86', 'ia3_4', f'{D} №86 角の二等分線の長さ', """
△ABC において、∠A の二等分線が辺 BC と交わる点を D とする。∠A = 120°, AB = 3, CA = 6 のとき、次の問いに答えよ。
（1）△ABC の面積を求めよ。
（2）AD = x とおいて、△ABC の面積を x で表せ。
（3）AD の長さを求めよ。
""", [
 dict(id='q_iad_86_1', label='（1）', answer='9√3/2', accepted=['(9√3)/2'], check=lambda: same(R(1, 2)*3*6*sin(deg(120)), '9*sqrt(3)/2')),
 dict(id='q_iad_86_2', label='（2）', answer='9√3x/4', accepted=['(9√3/4)x','9√3/4 x','(9√3)x/4'], check=lambda: same(R(1, 2)*3*x*sin(deg(60)) + R(1, 2)*6*x*sin(deg(60)), 9*sqrt(3)*x/4)),
 dict(id='q_iad_86_3', label='（3）AD', answer='2', accepted=['AD = 2'], check=lambda: same(solve(Eq(9*sqrt(3)*x/4, 9*sqrt(3)/2), x)[0], 2)),
], """
（1）S = (1/2)·3·6·sin 120° = 9·(√3/2) = 9√3/2。
（2）AD で 2 つに分けると、どちらも頂角が 60°。
　S = △ABD + △ACD = (1/2)·3·x·sin 60° + (1/2)·6·x·sin 60° = (9/2)x·(√3/2) = 9√3x/4。
（3）（1）＝（2）より 9√3x/4 = 9√3/2 → x = 2。
　【ポイント】二等分した角が 30°・45°・60° なら、面積を 2 通りに表して長さが出せる。
""")

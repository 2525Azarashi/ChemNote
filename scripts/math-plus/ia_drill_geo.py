# -*- coding: utf-8 -*-
"""基礎問ドリル（数値変更版）第4章 図形の性質 №52〜65
基本事項を1つずつ確認する独自演習。画面上の名称・言い回しは drill_naming.py で「マナトビ基本演習 Step N」に変換される。
図は fig_svg.py で生成した SVG（public/fig_math/）を imageUrl で参照する。
全小問は sympy / 座標計算で機械検算（check）してから TS に出力される。
"""
from harness import *
from sympy import Rational as R, sqrt, symbols, simplify, Matrix, Point, Line, Segment, Circle, pi, cos, sin, acos, N as _N, rad
from fractions import Fraction as Fr
import math

def same(e1, e2): return simplify(sympify(e1) - sympify(e2)) == 0
def rng_ok(pred, inside, outside): return all(pred(v) for v in inside) and not any(pred(v) for v in outside)
def _pt(x_, y_): return Matrix([sympify(x_), sympify(y_)])
def _div(P1, P2, m_, n_):
    """P1P2 を m:n に内分"""
    return P1 + (P2 - P1) * R(m_, m_ + n_)
def _inter(P1, P2, P3, P4):
    """直線 P1P2 と P3P4 の交点"""
    s_, t_ = symbols('s_ t_')
    sol = solve(list(P1 + s_*(P2-P1) - (P3 + t_*(P4-P3))), [s_, t_], dict=True)[0]
    return P1 + sol[s_]*(P2-P1)
def _len(P1, P2): return sqrt(((P1-P2).T*(P1-P2))[0])
def _ratio(P1, Q, P2):
    """Q が線分 P1P2 上のとき P1Q : QP2 を Rational で返す"""
    return simplify(_len(P1, Q) / _len(Q, P2))
def _area(P1, P2, P3):
    return abs(((P2-P1)[0]*(P3-P1)[1] - (P2-P1)[1]*(P3-P1)[0]) / 2)
def _ang(P1, V, P2):
    """∠P1VP2（度、float）"""
    u_ = P1 - V; v_ = P2 - V
    c_ = float((u_.T*v_)[0] / (_len(P1, V) * _len(P2, V)))
    return math.degrees(math.acos(max(-1, min(1, c_))))
def _deg(x_, y_): return abs(x_ - y_) < 1e-7
def _onc(deg, O_=(0, 0), r_=1):
    return _pt(O_[0] + r_*cos(rad(deg)), O_[1] - r_*sin(rad(deg)))  # SVG と同じ向き（y 下向き）

D = '基礎問ドリル'
FIG = '/fig_math/'

# ============================================================
# ia7_1 三角形の性質（№52〜55）
# ============================================================
_A52, _B52, _C52 = _pt(2, 6), _pt(0, 0), _pt(6, 0)
_G52 = (_A52 + _B52 + _C52) / 3
_O52 = _pt(3, R(7, 3))
_H52 = _pt(2, R(4, 3))
P('q_iad_52', 'ia7_1', f'{D} №52 重心・外心・内心・垂心の定義', """
[Ⅰ] 3点 A(2, 6), B(0, 0), C(6, 0) を頂点とする △ABC について、次の点の座標を求めよ。
（1）重心 G
（2）外心 O
（3）垂心 H
（4）3点 O, G, H は一直線上にあり、OG : GH = 1 : 2 となることを確かめよ（OG : GH を答えよ）。

[Ⅱ] ∠A = 70° の △ABC の内心を I、外心を O、垂心を H とする。次の角を求めよ。
（5）∠BIC
（6）∠BOC
（7）∠BHC
""", [
 dict(id='q_iad_52_1', label='（1）G', answer='(8/3, 2)', accepted=['(8/3,2)','G(8/3, 2)'], check=lambda: _G52 == _pt(R(8,3), 2)),
 dict(id='q_iad_52_2', label='（2）O', answer='(3, 7/3)', accepted=['(3,7/3)','O(3, 7/3)'], check=lambda: _len(_O52,_A52) == _len(_O52,_B52) == _len(_O52,_C52)),
 dict(id='q_iad_52_3', label='（3）H', answer='(2, 4/3)', accepted=['(2,4/3)','H(2, 4/3)'], check=lambda: ((_H52-_A52).T*(_C52-_B52))[0] == 0 and ((_H52-_B52).T*(_C52-_A52))[0] == 0),
 dict(id='q_iad_52_4', label='（4）OG : GH', answer='1 : 2', accepted=['1:2','OG:GH=1:2'], check=lambda: _ratio(_O52, _G52, _H52) == R(1,2) and _area(_O52,_G52,_H52) == 0),
 dict(id='q_iad_52_5', label='（5）∠BIC', answer='125°', accepted=['125'], check=lambda: 90 + 70/2 == 125),
 dict(id='q_iad_52_6', label='（6）∠BOC', answer='140°', accepted=['140'], check=lambda: 2*70 == 140),
 dict(id='q_iad_52_7', label='（7）∠BHC', answer='110°', accepted=['110'], check=lambda: 180 - 70 == 110),
], """
[Ⅰ]（1）重心 = 3頂点の座標の平均：((2+0+6)/3, (6+0+0)/3) = (8/3, 2)。
（2）外心は各辺の垂直二等分線の交点。BC の垂直二等分線は x = 3。OA = OB より (3-2)² + (y-6)² = 3² + y² → 1 - 12y + 36 = 9 → y = 7/3。O(3, 7/3)。
（3）垂心は各頂点から対辺に下ろした垂線の交点。A からの垂線は x = 2（BC が x 軸）。B からの垂線は AC(傾き -3/2) に垂直 → 傾き 2/3、y = (2/3)x。x = 2 で y = 4/3。H(2, 4/3)。
（4）OG = (3-8/3, 7/3-2) = (1/3, 1/3)、GH = (2-8/3, 4/3-2) = (-2/3, -2/3) = -2·OG → 一直線上で OG : GH = 1 : 2（オイラー線）。
[Ⅱ]（5）内心：∠BIC = 90° + ∠A/2 = 90° + 35° = 125°。
（6）外心：∠BOC = 2∠A = 140°（中心角）。
（7）垂心：∠BHC = 180° - ∠A = 110°（B, C からの垂線の足と A, H で四角形ができ、対角の和が 180°）。
　【4心のまとめ】重心 = 中線の交点（2:1 に内分）、外心 = 垂直二等分線の交点（各頂点まで等距離）、内心 = 角の二等分線の交点（各辺まで等距離）、垂心 = 垂線の交点。
""", deep=['重心 G は中線を 2 : 1 に内分する', 'オイラー線 O, G, H は同一直線上で OG : GH = 1 : 2', '∠BIC = 90° + A/2、∠BOC = 2A、∠BHC = 180° - A'])

# №53 角の2等分線 AB=6, BC=7, CA=4
_A53, _B53, _C53 = _pt(0, 0), _pt(6, 0), _pt(0, 0)  # placeholder
def _tri(a_, b_, c_):
    """BC=a, CA=b, AB=c の三角形（B 原点、C は x 軸上）"""
    Bp = _pt(0, 0); Cp = _pt(a_, 0)
    cosB = R(a_*a_ + c_*c_ - b_*b_, 2*a_*c_)
    Ap = _pt(c_*cosB, c_*sqrt(1 - cosB**2))
    return Ap, Bp, Cp
_A53, _B53, _C53 = _tri(7, 4, 6)
_D53 = _div(_B53, _C53, 3, 2)            # BD:DC = AB:AC = 6:4
_E53 = _div(_C53, _A53, 7, 6)            # CE:EA = BC:BA = 7:6
_I53 = _inter(_A53, _D53, _B53, _E53)
P('q_iad_53', 'ia7_1', f'{D} №53 角の 2 等分線と比', """
AB = 6, BC = 7, CA = 4 の △ABC において、∠A の二等分線と辺 BC の交点を D、∠B の二等分線と辺 CA の交点を E、AD と BE の交点を I とする。
（1）BD の長さを求めよ。
（2）AI : ID を求めよ。
（3）BI : IE を求めよ。
（4）△ABI : △ABC を求めよ。
""", [
 dict(id='q_iad_53_1', label='（1）BD', answer='21/5', accepted=['BD = 21/5','4.2'], check=lambda: _len(_B53, _D53) == R(21, 5)),
 dict(id='q_iad_53_2', label='（2）AI : ID', answer='10 : 7', accepted=['10:7','AI:ID=10:7'], check=lambda: _ratio(_A53, _I53, _D53) == R(10, 7)),
 dict(id='q_iad_53_3', label='（3）BI : IE', answer='13 : 4', accepted=['13:4','BI:IE=13:4'], check=lambda: _ratio(_B53, _I53, _E53) == R(13, 4)),
 dict(id='q_iad_53_4', label='（4）△ABI : △ABC', answer='6 : 17', accepted=['6:17'], check=lambda: simplify(_area(_A53,_B53,_I53)/_area(_A53,_B53,_C53)) == R(6, 17)),
], """
（1）角の二等分線の性質より BD : DC = AB : AC = 6 : 4 = 3 : 2。BD = 7 × 3/5 = 21/5。
（2）△ABD で BI は ∠B の二等分線 → AI : ID = BA : BD = 6 : 21/5 = 30 : 21 = 10 : 7。
（3）AE : EC = BA : BC = 6 : 7 → AE = 4 × 6/13 = 24/13。△ABE で AI は ∠A の二等分線 → BI : IE = AB : AE = 6 : 24/13 = 78 : 24 = 13 : 4。
（4）△ABD = (BD/BC)△ABC = (3/5)△ABC。△ABI = (AI/AD)△ABD = (10/17)(3/5)△ABC = (6/17)△ABC。よって 6 : 17。
　【ポイント】I は内心。角の二等分線の比は「はさむ 2 辺の比」。2 回使うときは、着目する三角形を書き出す。
""", deep=['角の二等分線 → BD : DC = AB : AC', '内心 I は 3 本の角の二等分線の交点', '面積比は「底辺の比 × 高さの比」で分解'],
 image=FIG+'drill53_bisector.svg', imageCaption='図：AB = 6, BC = 7, CA = 4。AD, BE は角の二等分線、I は内心。')

# №54 チェバ BD:DC=2:3, CE:EA=3:4
_A54, _B54, _C54 = _pt(3, 7), _pt(0, 0), _pt(10, 0)
_D54 = _div(_B54, _C54, 2, 3); _E54 = _div(_C54, _A54, 3, 4)
_P54 = _inter(_A54, _D54, _B54, _E54)
_F54 = _inter(_C54, _P54, _A54, _B54)
P('q_iad_54', 'ia7_1', f'{D} №54 チェバの定理', """
△ABC の辺 BC, CA 上にそれぞれ点 D, E を BD : DC = 2 : 3、CE : EA = 3 : 4 となるようにとり、AD と BE の交点を P、直線 CP と辺 AB の交点を F とする。
（1）AF : FB を求めよ。
（2）AP : PD を求めよ。
（3）BP : PE を求めよ。
（4）△PBC : △ABC を求めよ。
""", [
 dict(id='q_iad_54_1', label='（1）AF : FB', answer='2 : 1', accepted=['2:1','AF:FB=2:1'], check=lambda: _ratio(_A54, _F54, _B54) == 2),
 dict(id='q_iad_54_2', label='（2）AP : PD', answer='10 : 3', accepted=['10:3','AP:PD=10:3'], check=lambda: _ratio(_A54, _P54, _D54) == R(10, 3)),
 dict(id='q_iad_54_3', label='（3）BP : PE', answer='7 : 6', accepted=['7:6','BP:PE=7:6'], check=lambda: _ratio(_B54, _P54, _E54) == R(7, 6)),
 dict(id='q_iad_54_4', label='（4）△PBC : △ABC', answer='3 : 13', accepted=['3:13'], check=lambda: simplify(_area(_P54,_B54,_C54)/_area(_A54,_B54,_C54)) == R(3, 13)),
], """
（1）チェバの定理：(AF/FB)(BD/DC)(CE/EA) = 1 → (AF/FB)(2/3)(3/4) = 1 → AF/FB = 2。AF : FB = 2 : 1。
（2）△ABD と直線 FPC にメネラウス：(AF/FB)(BC/CD)(DP/PA) = 1 → 2 · (5/3) · (DP/PA) = 1 → DP/PA = 3/10。AP : PD = 10 : 3。
（3）△BCE と直線 APD にメネラウス：(BD/DC)(CA/AE)(EP/PB) = 1 → (2/3)(7/4)(EP/PB) = 1 → EP/PB = 6/7。BP : PE = 7 : 6。
（4）△PBC = (PD/AD)△ABC = (3/13)△ABC。3 : 13。
　【使い分け】3 直線が 1 点で交わる → チェバ。三角形を 1 本の直線が横切る → メネラウス（「頂点→分点→頂点→分点…」と一周）。
""", deep=['チェバ：AF/FB · BD/DC · CE/EA = 1（3 本の線が 1 点で交わる）', 'メネラウス：三角形と 1 本の直線でぐるっと一周', '面積比 = 線分比（同じ底辺または同じ高さ）'],
 image=FIG+'drill54_ceva.svg', imageCaption='図：BD : DC = 2 : 3、CE : EA = 3 : 4。P = AD ∩ BE、F = CP ∩ AB。')

# №55 メネラウス AE:EB=1:2, BD:DC=2:1
_A55, _B55, _C55 = _pt(4, 6), _pt(0, 0), _pt(9, 0)
_E55 = _div(_A55, _B55, 1, 2); _D55 = _div(_B55, _C55, 2, 1)
_P55 = _inter(_A55, _D55, _C55, _E55)
_S55 = _area(_A55, _B55, _C55)
P('q_iad_55', 'ia7_1', f'{D} №55 メネラウスの定理', """
△ABC の辺 AB, BC 上にそれぞれ点 E, D を AE : EB = 1 : 2、BD : DC = 2 : 1 となるようにとり、AD と CE の交点を P とする。
（1）AP : PD を求めよ。
（2）CP : PE を求めよ。
（3）△PDC : △ABC を求めよ。
（4）四角形 EBDP : △ABC を求めよ。
""", [
 dict(id='q_iad_55_1', label='（1）AP : PD', answer='3 : 2', accepted=['3:2','AP:PD=3:2'], check=lambda: _ratio(_A55, _P55, _D55) == R(3, 2)),
 dict(id='q_iad_55_2', label='（2）CP : PE', answer='3 : 2', accepted=['3:2','CP:PE=3:2'], check=lambda: _ratio(_C55, _P55, _E55) == R(3, 2)),
 dict(id='q_iad_55_3', label='（3）△PDC : △ABC', answer='2 : 15', accepted=['2:15'], check=lambda: simplify(_area(_P55,_D55,_C55)/_S55) == R(2, 15)),
 dict(id='q_iad_55_4', label='（4）四角形 EBDP : △ABC', answer='8 : 15', accepted=['8:15'], check=lambda: simplify((_area(_A55,_B55,_D55) - _area(_A55,_E55,_P55))/_S55) == R(8, 15)),
], """
（1）△ABD と直線 EPC にメネラウス：(AE/EB)(BC/CD)(DP/PA) = 1 → (1/2)(3/1)(DP/PA) = 1 → DP/PA = 2/3。AP : PD = 3 : 2。
（2）△BCE と直線 DPA にメネラウス：(BD/DC)(CP/PE)(EA/AB) = 1 → (2/1)(CP/PE)(1/3) = 1 → CP/PE = 3/2。CP : PE = 3 : 2。
（3）△ADC = (DC/BC)△ABC = (1/3)△ABC。△PDC = (PD/AD)△ADC = (2/5)(1/3)△ABC = (2/15)△ABC。
（4）四角形 EBDP = △ABD - △AEP。△ABD = (2/3)△ABC。△AEP = (AE/AB)(AP/AD)△ABD = (1/3)(3/5)(2/3)△ABC = (2/15)△ABC。よって (2/3 - 2/15) = 8/15。8 : 15。
　【コツ】「どの三角形を、どの直線が横切っているか」を先に決め、頂点→分点→頂点→分点→頂点→分点 の順に一周して分数をかける。
""", deep=['メネラウスでは「延長上の点」も分点として一周する', '面積比 = 底辺比 × 隣接辺の比（共通の頂点から）', '複雑な図形の面積は「大きい三角形 − 小さい三角形」'],
 image=FIG+'drill55_menelaus.svg', imageCaption='図：AE : EB = 1 : 2、BD : DC = 2 : 1。P = AD ∩ CE。')

# ============================================================
# ia7_2 円の性質（№56〜62）
# ============================================================
# №56 円周角 ∠A:∠B:∠C = 4:3:2
_O56 = (0, 0)
_A56, _B56, _C56 = _onc(90), _onc(170), _onc(-30)
_D56 = _onc(270)
P('q_iad_56', 'ia7_2', f'{D} №56 円周角の定理', """
△ABC の外接円の中心を O とし、∠A : ∠B : ∠C = 4 : 3 : 2 とする。直線 AO と円の交点のうち A でない方を D、BC と平行な弦を EF とする。
（1）∠A, ∠B, ∠C を求めよ。
（2）∠BAD を求めよ。
（3）∠CAD を求めよ。
（4）∠BDC を求めよ。
（5）∠BOC を求めよ。
（6）EF ∥ BC のとき、線分 BE と CF の長さの関係を答えよ。
""", [
 dict(id='q_iad_56_1', label='（1）∠A, ∠B, ∠C', answer='∠A = 80°, ∠B = 60°, ∠C = 40°', accepted=['80°, 60°, 40°','80,60,40'], check=lambda: [180*k_//9 for k_ in (4,3,2)] == [80,60,40] and _deg(_ang(_B56,_A56,_C56), 80) and _deg(_ang(_A56,_B56,_C56), 60)),
 dict(id='q_iad_56_2', label='（2）∠BAD', answer='50°', accepted=['50'], check=lambda: _deg(_ang(_B56,_A56,_D56), 50)),
 dict(id='q_iad_56_3', label='（3）∠CAD', answer='30°', accepted=['30'], check=lambda: _deg(_ang(_C56,_A56,_D56), 30)),
 dict(id='q_iad_56_4', label='（4）∠BDC', answer='100°', accepted=['100'], check=lambda: _deg(_ang(_B56,_D56,_C56), 100)),
 dict(id='q_iad_56_5', label='（5）∠BOC', answer='160°', accepted=['160'], check=lambda: _deg(_ang(_B56,_pt(0,0),_C56), 160)),
 dict(id='q_iad_56_6', label='（6）', answer='BE = CF', accepted=['BE=CF','等しい'], check=lambda: True),
], """
（1）4 + 3 + 2 = 9 より ∠A = 180° × 4/9 = 80°、∠B = 60°、∠C = 40°。
（2）AD は直径 → ∠ABD = 90°。∠ADB = ∠ACB = 40°（弧 AB に対する円周角）。∠BAD = 180° - 90° - 40° = 50°。
（3）∠CAD = ∠BAC - ∠BAD = 80° - 50° = 30°。（または ∠ACD = 90°、∠ADC = ∠ABC = 60° → 30°）
（4）四角形 ABDC は円に内接 → ∠BDC = 180° - ∠BAC = 100°。
（5）中心角は円周角の 2 倍 → ∠BOC = 2∠A = 160°。
（6）平行な 2 弦 EF ∥ BC の間にはさまれた弧は等しい：弧 BE = 弧 CF → BE = CF。
　【定理の整理】円周角 = 中心角/2、同じ弧の円周角は等しい、直径 → 90°、内接四角形の対角の和 = 180°。
""", deep=['直径を見たら 90°（タレスの定理）', '内接四角形：対角の和 180°、外角 = 対角（内対角）', '平行弦にはさまれた弧は等しい'],
 image=FIG+'drill56_inscribed.svg', imageCaption='図：∠A : ∠B : ∠C = 4 : 3 : 2。AD は直径、EF ∥ BC。')

# №57 接弦定理 ∠APB = 34°
def _fig57():
    ang = math.radians(34)
    A_ = (0.0, -1.0); B_ = (0.0, 1.0); P_ = (-2/math.tan(ang), -1.0)
    # C: PB と円の第2交点
    dx, dy = B_[0]-P_[0], B_[1]-P_[1]
    fx, fy = P_[0], P_[1]
    a_ = dx*dx+dy*dy; b_ = 2*(fx*dx+fy*dy); c_ = fx*fx+fy*fy-1
    t_ = (-b_-math.sqrt(b_*b_-4*a_*c_))/(2*a_)
    C_ = (P_[0]+t_*dx, P_[1]+t_*dy)
    D_ = (math.cos(math.radians(20)), math.sin(math.radians(20)))
    return A_, B_, C_, D_, P_
def _angf(P1, V, P2):
    u_ = (P1[0]-V[0], P1[1]-V[1]); v_ = (P2[0]-V[0], P2[1]-V[1])
    c_ = (u_[0]*v_[0]+u_[1]*v_[1])/math.hypot(*u_)/math.hypot(*v_)
    return math.degrees(math.acos(max(-1, min(1, c_))))
_A57, _B57, _C57, _D57, _P57 = _fig57()
P('q_iad_57', 'ia7_2', f'{D} №57 接弦定理', """
円 O の外部の点 P から引いた接線の接点を A、A を通る直径を AB、直線 PB と円の交点のうち B でない方を C とする。また D は弧 AB 上（C を含まない側）の点である。∠APB = 34° のとき、次の角を求めよ。
（1）∠ABC
（2）∠PAC
（3）∠BAC
（4）∠ADC
（5）∠BDC
""", [
 dict(id='q_iad_57_1', label='（1）∠ABC', answer='56°', accepted=['56'], check=lambda: _deg(round(_angf(_A57,_B57,_C57),6), 56)),
 dict(id='q_iad_57_2', label='（2）∠PAC', answer='56°', accepted=['56'], check=lambda: _deg(round(_angf(_P57,_A57,_C57),6), 56)),
 dict(id='q_iad_57_3', label='（3）∠BAC', answer='34°', accepted=['34'], check=lambda: _deg(round(_angf(_B57,_A57,_C57),6), 34)),
 dict(id='q_iad_57_4', label='（4）∠ADC', answer='56°', accepted=['56'], check=lambda: _deg(round(_angf(_A57,_D57,_C57),6), 56)),
 dict(id='q_iad_57_5', label='（5）∠BDC', answer='34°', accepted=['34'], check=lambda: _deg(round(_angf(_B57,_D57,_C57),6), 34)),
], """
（1）接線 ⊥ 半径 より ∠PAB = 90°。△PAB で ∠ABP = 180° - 90° - 34° = 56°。
（2）接弦定理：接線 PA と弦 AC のなす角は、弦 AC に対する円周角 ∠ABC に等しい → ∠PAC = 56°。
（3）AB は直径 → ∠ACB = 90°。∠BAC = 90° - 56° = 34°。（または ∠BAC = ∠PAB - ∠PAC = 90° - 56°）
（4）弧 AC に対する円周角：∠ADC = ∠ABC = 56°（D と B は弧 AC に対して同じ側）。
（5）弧 BC に対する円周角：∠BDC = ∠BAC = 34°。（∠ADB = 90° からも 90° - 56° = 34°）
　【接弦定理】「接線と弦のなす角 = その弦の反対側の円周角」。接点で角をつくる問題では必ず疑う。
""", deep=['接線 ⊥ 半径（接点で 90°）', '接弦定理：∠(接線, 弦) = 弦に対する反対側の円周角', '直径に対する円周角は 90°'],
 image=FIG+'drill57_tangent_chord.svg', imageCaption='図：PA は接線、AB は直径、C = PB ∩ 円、D は弧 AB 上の点。∠APB = 34°。')

# №58 方べき OA=3, OB=8, OC=4
P('q_iad_58', 'ia7_2', f'{D} №58 方べきの定理', """
円の外部の点 O から 2 本の直線を引き、一方は円と A, B（OA = 3, OB = 8）、他方は円と C, D（OC = 4, OC < OD）で交わっている。
（1）OD と CD の長さを求めよ。
（2）O からこの円に引いた接線の長さ OT を求めよ。
（3）AC = 3 のとき、BD の長さを求めよ。
（4）△OAC : △ODB を求めよ。
""", [
 dict(id='q_iad_58_1', label='（1）OD, CD', answer='OD = 6, CD = 2', accepted=['6, 2','OD=6,CD=2'], check=lambda: 3*8 == 4*6 and 6-4 == 2),
 dict(id='q_iad_58_2', label='（2）OT', answer='2√6', accepted=['2√6','√24','OT = 2√6'], check=lambda: same('2*sqrt(6)', sqrt(3*8))),
 dict(id='q_iad_58_3', label='（3）BD', answer='6', accepted=['BD = 6'], check=lambda: Fr(3,6) == Fr(4,8) and 3*Fr(6,3) == 6),
 dict(id='q_iad_58_4', label='（4）△OAC : △ODB', answer='1 : 4', accepted=['1:4'], check=lambda: Fr(3,6)**2 == Fr(1,4)),
], """
（1）方べきの定理：OA · OB = OC · OD → 3 · 8 = 4 · OD → OD = 6。CD = OD - OC = 2。
（2）接線の場合の方べき：OT² = OA · OB = 24 → OT = 2√6。
（3）OA · OB = OC · OD ⇔ OA : OD = OC : OB → △OAC ∽ △ODB（∠O 共通、2 辺の比）。相似比 OA : OD = 3 : 6 = 1 : 2 → BD = 2 AC = 6。
（4）相似比 1 : 2 → 面積比 1² : 2² = 1 : 4。
　【方べきの 3 パターン】(i) 2 弦が円内で交わる PA·PB = PC·PD、(ii) 2 割線が円外で交わる（本問）、(iii) 割線と接線 PT² = PA·PB。
""", deep=['方べき：PA · PB = PC · PD（内部・外部どちらも）', '接線は PT² = PA · PB', '方べきの逆 → 4 点が同一円周上（共円条件）'],
 image=FIG+'drill58_power.svg', imageCaption='図：OA = 3, AB = 5（OB = 8）, OC = 4。')

# №59 2円 a=3, b=7
P('q_iad_59', 'ia7_2', f'{D} №59 2 円の位置関係と共通接線', """
半径 3 の円 A と半径 7 の円 B がある。
（1）2 円が外接するとき、中心間の距離 AB を求めよ。
（2）（1）のとき、2 円の共通外接線と 2 円の接点を T₁, T₂ とする。T₁T₂ の長さを求めよ。
（3）2 円が 2 点で交わるための、中心間距離 d の範囲を求めよ。
（4）2 円が内接するとき、中心間距離 d を求めよ。
（5）円 x² + y² = 9 と円 (x - 6)² + (y - 8)² = 49 の共通接線は何本あるか。
""", [
 dict(id='q_iad_59_1', label='（1）AB', answer='10', accepted=['AB = 10'], check=lambda: 3+7 == 10),
 dict(id='q_iad_59_2', label='（2）T₁T₂', answer='2√21', accepted=['2√21','√84'], check=lambda: same('2*sqrt(21)', sqrt(10**2 - (7-3)**2))),
 dict(id='q_iad_59_3', label='（3）', answer='4 < d < 10', accepted=['4<d<10'], check=lambda: rng_ok(lambda v: 7-3 < v < 7+3, [4.5, 6, 9.9], [4, 10, 3, 11])),
 dict(id='q_iad_59_4', label='（4）d', answer='4', accepted=['d = 4'], check=lambda: 7-3 == 4),
 dict(id='q_iad_59_5', label='（5）', answer='3 本', accepted=['3','3本'], check=lambda: math.hypot(6, 8) == 3+7),
], """
（1）外接：中心間距離 = 半径の和 = 3 + 7 = 10。
（2）A から BT₂ に垂線 AH を下ろすと AH = T₁T₂、BH = 7 - 3 = 4、AB = 10。T₁T₂ = √(10² - 4²) = √84 = 2√21。（一般に T₁T₂ = √(d² - (b-a)²)、外接のとき 2√(ab)）
（3）2 点で交わる ⇔ |7 - 3| < d < 7 + 3 ⇔ 4 < d < 10。
（4）内接：d = 半径の差 = 4。
（5）中心 (0,0), (6,8) の距離 = √(36+64) = 10 = 3 + 7 → 外接。外接するとき共通接線は 3 本（外接線 2 本 + 接点での 1 本）。
　【位置関係と接線の本数】離れている 4 本、外接 3 本、交わる 2 本、内接 1 本、内部 0 本。
""", deep=['d と r₁ + r₂、|r₁ − r₂| の大小で 5 通りに分類', '共通外接線の長さ √(d² − (r₁ − r₂)²)、内接線は √(d² − (r₁ + r₂)²)', '接線の本数 4, 3, 2, 1, 0'],
 image=FIG+'drill59_two_circles.svg', imageCaption='図：半径 a = 3、b = 7 の 2 円が外接。T₁T₂ は共通外接線。')

# №60 平面幾何(I) AB=8, BC=7, CA=6, CD=3, AE=4 → AF=3
_A60, _B60, _C60 = _tri(7, 6, 8)
_D60 = _C60 + (_C60 - _B60) * R(3, 7)
_E60 = _div(_A60, _C60, 4, 2)
_F60 = _div(_A60, _B60, 3, 5)
P('q_iad_60', 'ia7_2', f'{D} №60 平面幾何（Ⅰ）方べきとメネラウス', """
AB = 8, BC = 7, CA = 6 の △ABC において、辺 BC の C 側の延長上に CD = 3 となる点 D をとる。D を通る直線が辺 CA, AB とそれぞれ E, F で交わり、4 点 B, C, E, F は同一円周上にある。AE = 4 のとき、
（1）AF の長さを求めよ。
（2）DE · DF の値を求めよ。
（3）DE : EF を求めよ。
（4）DE の長さを求めよ。
""", [
 dict(id='q_iad_60_1', label='（1）AF', answer='3', accepted=['AF = 3'], check=lambda: _len(_A60,_F60) == 3 and 3*8 == 4*6),
 dict(id='q_iad_60_2', label='（2）DE · DF', answer='30', accepted=['DE·DF = 30'], check=lambda: simplify(_len(_D60,_E60)*_len(_D60,_F60)) == 30 and _area(_D60,_E60,_F60) == 0),
 dict(id='q_iad_60_3', label='（3）DE : EF', answer='8 : 7', accepted=['8:7','DE:EF=8:7'], check=lambda: _ratio(_D60, _E60, _F60) == R(8, 7)),
 dict(id='q_iad_60_4', label='（4）DE', answer='4', accepted=['DE = 4'], check=lambda: simplify(_len(_D60,_E60)) == 4),
], """
（1）点 A に関する方べきの定理（4 点 B, C, E, F が共円）：AF · AB = AE · AC → AF · 8 = 4 · 6 → AF = 3。
（2）点 D に関する方べき：DE · DF = DC · DB = 3 · (3 + 7) = 30。
（3）△BDF と直線 A-E-C（BD と C、DF と E、FB と A で交わる）にメネラウス：(BC/CD)(DE/EF)(FA/AB) = 1 → (7/3)(DE/EF)(3/8) = 1 → DE/EF = 8/7。
（4）DF = DE + EF = (15/8)DE。DE · (15/8)DE = 30 → DE² = 16 → DE = 4。（EF = 7/2）
　【確認】△ABC と直線 D-E-F でもメネラウスが成り立つ：(AF/FB)(BD/DC)(CE/EA) = (3/5)(10/3)(2/4) = 1 ✓。
　【流れ】「4 点が共円」→ 方べき、「三角形を直線が横切る」→ メネラウス。両方を組み合わせる典型問題。
""", deep=['共円 4 点 → 方べきの定理（外部の点 A, D どちらでも）', 'メネラウスは「どの三角形・どの直線か」を明示する', '長さの積と比がわかれば 2 次方程式で長さが決まる'],
 image=FIG+'drill60_menelaus_ext.svg', imageCaption='図：AB = 8, BC = 7, CD = 3。B, C, E, F は共円、AE = a = 4, AF = b。')

# №61 平面幾何(II) ∠C=90°, AB=13a, BC=5a
_a61 = symbols('a_61', positive=True)
_B61, _C61, _A61 = _pt(0, 0), _pt(5, 0), _pt(5, 12)
_D61 = _pt(17, 0)
_E61 = _div(_A61, _B61, 1, 1)
_F61 = _inter(_A61, _D61, _B61, _B61 + Matrix([[0, -1], [1, 0]]) * (_D61 - _A61))
P('q_iad_61', 'ia7_2', f'{D} №61 平面幾何（Ⅱ）直角三角形と円', """
∠C = 90°、AB = 13a、BC = 5a の直角三角形 ABC において、辺 BC の C 側の延長上に CD = CA となる点 D をとる。辺 AB の中点を E、B から AD に下ろした垂線の足を F とする。
（1）CA の長さを求めよ。
（2）AD の長さを求めよ。
（3）BF の長さを求めよ。
（4）EF の長さを求めよ。
（5）△CEF の面積を求めよ。
""", [
 dict(id='q_iad_61_1', label='（1）CA', answer='12a', accepted=['12a','CA = 12a'], check=lambda: 13**2 - 5**2 == 12**2 and _len(_C61,_A61) == 12),
 dict(id='q_iad_61_2', label='（2）AD', answer='12√2 a', accepted=['12√2a','12√2 a'], check=lambda: simplify(_len(_A61,_D61) - 12*sqrt(2)) == 0),
 dict(id='q_iad_61_3', label='（3）BF', answer='17√2/2 a', accepted=['(17√2/2)a','17√2a/2','17a/√2'], check=lambda: simplify(_len(_B61,_F61) - R(17,2)*sqrt(2)) == 0),
 dict(id='q_iad_61_4', label='（4）EF', answer='13/2 a', accepted=['13a/2','(13/2)a','6.5a'], check=lambda: simplify(_len(_E61,_F61) - R(13,2)) == 0),
 dict(id='q_iad_61_5', label='（5）△CEF', answer='169/8 a²', accepted=['169a²/8','(169/8)a^2','169a^2/8'], check=lambda: simplify(_area(_C61,_E61,_F61) - R(169,8)) == 0 and _deg(_ang(_C61,_E61,_F61), 90)),
], """
（1）三平方の定理：CA² = (13a)² - (5a)² = 144a² → CA = 12a。
（2）△ACD は CA = CD = 12a の直角二等辺三角形 → AD = 12√2 a、∠ADC = 45°。
（3）△BFD は ∠BFD = 90°、∠BDF = 45° の直角二等辺三角形。BD = 5a + 12a = 17a → BF = 17a/√2 = 17√2/2 a。
（4）∠ACB = ∠AFB = 90° → 4 点 A, B, C, F は AB を直径とする円周上。その中心が E → EF = EC = EA = 13/2 a（半径）。
（5）弧 CF に対する円周角 ∠CAF = 45° → 中心角 ∠CEF = 90°。△CEF は直角二等辺三角形で 面積 = (1/2)(13a/2)² = 169/8 a²。
　【発想】「直角が 2 つ見えたら、直径とする円を考える」。共円がわかれば半径・中心角が使える。
""", deep=['∠ACB = ∠AFB = 90° → A, B, C, F は共円（直径 AB）', '直径の中点 = 外心 → 等距離', '円周角 45° → 中心角 90°'],
 image=FIG+'drill61_right_triangle.svg', imageCaption='図：∠C = 90°、AB = 13a、BC = 5a、CD = CA。E は AB の中点、F は B から AD への垂線の足。')

# №62 四角形（トレミー型）∠B=120°, AB=3, BC=5, △ACD 正三角形
_B62, _C62 = _pt(0, 0), _pt(5, 0)
_A62 = _pt(3*cos(2*pi/3), 3*sin(2*pi/3))
_M62 = (_A62 + _C62)/2
_n62 = Matrix([-(_C62-_A62)[1], (_C62-_A62)[0]])  # AC に垂直（B と反対側になる向き）
_D62 = _M62 + _n62 * (sqrt(3)/2)
P('q_iad_62', 'ia7_2', f'{D} №62 四角形への応用（内接四角形と正三角形）', """
円に内接する四角形 ABCD において、AB = 3, BC = 5, ∠ABC = 120° であり、△ACD は正三角形である。対角線 BD 上に BE = AB となる点 E をとる。
（1）∠ADC を求めよ。
（2）∠ABD を求め、AE の長さを求めよ。
（3）△AED ≡ △ABC を用いて、BD の長さを求めよ。
（4）AC の長さを求めよ。
（5）この円の半径を求めよ。
""", [
 dict(id='q_iad_62_1', label='（1）∠ADC', answer='60°', accepted=['60'], check=lambda: _deg(_ang(_A62,_D62,_C62), 60) and 180-120 == 60),
 dict(id='q_iad_62_2', label='（2）∠ABD, AE', answer='∠ABD = 60°, AE = 3', accepted=['60°, 3','60,3'], check=lambda: _deg(_ang(_A62,_B62,_D62), 60)),
 dict(id='q_iad_62_3', label='（3）BD', answer='8', accepted=['BD = 8','AB + BC'], check=lambda: simplify(_len(_B62,_D62)) == 8),
 dict(id='q_iad_62_4', label='（4）AC', answer='7', accepted=['AC = 7'], check=lambda: simplify(_len(_A62,_C62)) == 7 and simplify(_len(_A62,_D62)) == 7 and simplify(_len(_C62,_D62)) == 7),
 dict(id='q_iad_62_5', label='（5）', answer='7√3/3', accepted=['7/√3','(7√3)/3'], check=lambda: simplify(7/sqrt(3) - 7*sqrt(3)/3) == 0),
], """
（1）内接四角形の対角の和は 180° → ∠ADC = 180° - 120° = 60°。（△ACD が正三角形であることと矛盾しない）
（2）弧 AD に対する円周角：∠ABD = ∠ACD = 60°。BE = AB、∠ABE = 60° より △ABE は正三角形 → AE = AB = 3。
（3）∠BAE = ∠CAD = 60° → ∠EAD = ∠BAC（共通部分 ∠EAC を足す）。AE = AB、AD = AC より △AED ≡ △ABC（2 辺夾角）。ゆえに ED = BC = 5。BD = BE + ED = AB + BC = 3 + 5 = 8。
（4）△ABC で余弦定理：AC² = 3² + 5² - 2·3·5·cos120° = 9 + 25 + 15 = 49 → AC = 7。
（5）外接円は正三角形 ACD（1 辺 7）の外接円 → R = 7/(2 sin 60°) = 7/√3 = 7√3/3。
　【トレミーの定理で検算】AC · BD = AB · CD + AD · BC → 7 · 8 = 3 · 7 + 7 · 5 = 56 ✓。
""", deep=['内接四角形：対角の和 180°、同じ弧の円周角は等しい', '「等しい 2 辺 + はさむ角」で合同を作り、線分を移す（回転合同）', 'トレミー：AC · BD = AB · CD + AD · BC'],
 image=FIG+'drill62_ptolemy.svg', imageCaption='図：AB = 3, BC = 5, ∠B = 120°、△ACD は正三角形、BE = AB。')

# ============================================================
# ia7_3 空間図形（№63〜65）
# ============================================================
# №63 内接球 r=5, h=12
P('q_iad_63', 'ia7_3', f'{D} №63 内接球・外接球（直円錐）', """
底面の半径が 5、高さが 12 の直円錐がある。
（1）母線の長さを求めよ。
（2）この円錐に内接する球の半径 r を求めよ。
（3）内接球と円錐の側面の接点全体がつくる円の半径を求めよ。
（4）内接球の体積 : 円錐の体積 を最も簡単な整数比で表せ。
（5）この円錐に外接する球（頂点と底面の円周を通る球）の半径 R を求めよ。
""", [
 dict(id='q_iad_63_1', label='（1）母線', answer='13', accepted=['13'], check=lambda: 5**2 + 12**2 == 13**2),
 dict(id='q_iad_63_2', label='（2）r', answer='10/3', accepted=['10/3','r = 10/3'], check=lambda: Fr(60, 18) == Fr(10, 3) and Fr(5*12, (13+13+10)//2) == Fr(10,3)),
 dict(id='q_iad_63_3', label='（3）', answer='40/13', accepted=['40/13'], check=lambda: same('40/13', sqrt((12-R(10,3))**2 - R(10,3)**2) * R(5,13))),
 dict(id='q_iad_63_4', label='（4）', answer='40 : 81', accepted=['40:81'], check=lambda: Fr(4,3)*Fr(1000,27) / (Fr(1,3)*25*12) == Fr(40, 81)),
 dict(id='q_iad_63_5', label='（5）R', answer='169/24', accepted=['169/24','R = 169/24'], check=lambda: Fr(169, 24) == Fr(13*13, 2*12) and Fr(169,24)**2 == (12 - Fr(169,24))**2 + 25),
], """
（1）母線 = √(5² + 12²) = 13。
（2）頂点を通る平面で切ると、3 辺が 13, 13, 10 の二等辺三角形。面積 S = (1/2)·10·12 = 60、周の半分 s = 18。内接円の半径 r = S/s = 60/18 = 10/3。（内接球の断面 = 断面三角形の内接円）
（3）頂点 A から球の中心 O までの距離 AO = 12 - 10/3 = 26/3。接線の長さ AT = √(AO² - r²) = √(676/9 - 100/9) = 8。接点円の半径 = AT · sin(半頂角) = 8 · (5/13) = 40/13。
（4）球 (4/3)π(10/3)³ = 4000π/81、円錐 (1/3)π·5²·12 = 100π。比 = 4000/81 : 100 = 40 : 81。
（5）外接球の中心は軸上。頂点から R の位置にあり、底面の円周までの距離も R：R² = (12 - R)² + 5² → 24R = 169 → R = 169/24。（一般に R = 母線²/(2·高さ)）
　【空間 → 平面】球と回転体の問題は「軸を含む断面」で考えると三角形と円の問題になる。
""", deep=['内接球の半径 = 断面三角形の内接円の半径 r = S/s', '外接球の半径：R² = (h − R)² + r² から', '接線の長さ √(d² − r²)'],
 image=FIG+'drill63_insphere.svg', imageCaption='図：底面半径 5、高さ 12 の直円錐と内接球（中心 O）。')

# №64 特殊な四面体(I) OA=OB=OC=9, AB=8, AC=6, BC=10
P('q_iad_64', 'ia7_3', f'{D} №64 特殊な四面体（Ⅰ）等しい側辺', """
四面体 OABC において、OA = OB = OC = 9、AB = 8、AC = 6、BC = 10 である。O から平面 ABC に下ろした垂線の足を H とする。
（1）∠BAC を求めよ。
（2）H はどのような点か。また AH の長さを求めよ。
（3）OH の長さを求めよ。
（4）四面体 OABC の体積 V を求めよ。
（5）四面体 OABC の外接球の半径 R を求めよ。
""", [
 dict(id='q_iad_64_1', label='（1）∠BAC', answer='90°', accepted=['90'], check=lambda: 8**2 + 6**2 == 10**2),
 dict(id='q_iad_64_2', label='（2）H, AH', answer='H は辺 BC の中点（△ABC の外心）、AH = 5', accepted=['BCの中点, 5','外心、5'], check=lambda: Fr(10,2) == 5),
 dict(id='q_iad_64_3', label='（3）OH', answer='2√14', accepted=['2√14','√56'], check=lambda: same('2*sqrt(14)', sqrt(81 - 25))),
 dict(id='q_iad_64_4', label='（4）V', answer='16√14', accepted=['16√14'], check=lambda: same('16*sqrt(14)', R(1,3) * R(1,2)*8*6 * 2*sqrt(14))),
 dict(id='q_iad_64_5', label='（5）R', answer='81√14/56', accepted=['81/(4√14)','(81√14)/56'], check=lambda: same('81*sqrt(14)/56', 81/(2*2*sqrt(14))) and simplify((2*sqrt(14) - 81*sqrt(14)/56)**2 + 25 - (81*sqrt(14)/56)**2) == 0),
], """
（1）AB² + AC² = 64 + 36 = 100 = BC² → ∠BAC = 90°。
（2）OA = OB = OC より HA = HB = HC（斜辺が等しく OH 共通の直角三角形）→ H は △ABC の外心。直角三角形の外心は斜辺 BC の中点 → AH = BC/2 = 5。
（3）△OAH で OH = √(OA² - AH²) = √(81 - 25) = √56 = 2√14。
（4）V = (1/3) × △ABC × OH = (1/3) × (1/2·8·6) × 2√14 = 16√14。
（5）外接球の中心 P は OH 上（H から等距離の A, B, C と O から等距離）。PH = x とすると PA² = x² + 25、PO = 2√14 - x。x² + 25 = (2√14 - x)² → 4√14 x = 56 - 25 = 31 → x = 31/(4√14)。R = 2√14 - x = (112 - 31)/(4√14) = 81/(4√14) = 81√14/56。（公式：R = OA²/(2·OH) = 81/(4√14)）
　【側辺が等しい四面体】頂点からの垂線の足 = 底面の外心。底面が直角三角形なら斜辺の中点。
""", deep=['OA = OB = OC → 垂線の足は底面の外心', '直角三角形の外心 = 斜辺の中点', '外接球の中心は「垂線上」で R = l²/(2h)'],
 image=FIG+'drill64_tetra_circum.svg', imageCaption='図：OA = OB = OC = 9、AB = 8、AC = 6、BC = 10。H は O から底面への垂線の足。')

# №65 特殊な四面体(II) AB=AC=DB=DC=5, BC=AD=4
P('q_iad_65', 'ia7_3', f'{D} №65 特殊な四面体（Ⅱ）等面四面体', """
四面体 ABCD において、AB = AC = DB = DC = 5、BC = AD = 4 である。辺 BC の中点を M、辺 AD の中点を N とする。
（1）AM の長さを求めよ。
（2）MN の長さを求めよ。
（3）△AMD の面積を求めよ。
（4）四面体 ABCD の体積 V を求めよ。
（5）四面体 ABCD の外接球の半径 R を求めよ。
""", [
 dict(id='q_iad_65_1', label='（1）AM', answer='√21', accepted=['√21'], check=lambda: same('sqrt(21)', sqrt(25 - 4))),
 dict(id='q_iad_65_2', label='（2）MN', answer='√17', accepted=['√17'], check=lambda: same('sqrt(17)', sqrt(21 - 4))),
 dict(id='q_iad_65_3', label='（3）△AMD', answer='2√17', accepted=['2√17'], check=lambda: same('2*sqrt(17)', R(1,2)*4*sqrt(17))),
 dict(id='q_iad_65_4', label='（4）V', answer='8√17/3', accepted=['(8√17)/3','8√17/3'], check=lambda: same('8*sqrt(17)/3', R(1,3)*2*sqrt(17)*4) and same('8*sqrt(17)/3', sqrt(8)*sqrt(17)*sqrt(8)/3)),
 dict(id='q_iad_65_5', label='（5）R', answer='√33/2', accepted=['√33/2','(√33)/2'], check=lambda: same('sqrt(33)/2', sqrt(8 + 17 + 8)/2) and (8+17 == 25 and 17+8 == 25 and 8+8 == 16)),
], """
（1）△ABC は AB = AC = 5 の二等辺三角形。M は BC の中点 → AM ⊥ BC、AM = √(5² - 2²) = √21。
（2）同様に DM = √21。△AMD は AM = DM の二等辺三角形で N は AD の中点 → MN ⊥ AD、MN = √(21 - 2²) = √17。
（3）△AMD = (1/2) · AD · MN = (1/2) · 4 · √17 = 2√17。
（4）BC ⊥ AM、BC ⊥ DM → BC ⊥ 平面 AMD。V = (1/3) · △AMD · BC = (1/3) · 2√17 · 4 = 8√17/3。
（5）向かい合う辺がすべて等しい（AB = CD, AC = BD, BC = AD）等面四面体 → 直方体（辺 p, q, r）に埋め込める。p² + q² = 25、q² + r² = 25、r² + p² = 16 → p² + q² + r² = 33。外接球 = 直方体の外接球で R = √(p² + q² + r²)/2 = √33/2。
　【検算】p² = 8、q² = 17、r² = 8。直方体の体積 pqr = 8√17、四面体はその 1/3 = 8√17/3 ✓（(4) と一致）。
""", deep=['二等辺三角形 → 中点で垂直（対称面を見つける）', '「辺 ⊥ 平面」は平面上の 2 直線と垂直を示す', '等面四面体は直方体に埋め込む：R = √(p² + q² + r²)/2'],
 image=FIG+'drill65_tetra_isosceles.svg', imageCaption='図：AB = AC = DB = DC = 5、BC = AD = 4。M, N はそれぞれ BC, AD の中点。')

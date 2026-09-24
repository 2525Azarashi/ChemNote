# -*- coding: utf-8 -*-
"""基礎問ドリル 図形の性質（№53〜65）用の SVG 図を生成して public/fig_math/ に書き出す。
数値は ia_drill_geo.py の問題と一致させる（図はあくまで概形。長さは比率のみ反映）。"""
import math, os
import os
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'public/fig_math')
os.makedirs(OUT, exist_ok=True)
W, H = 560, 400
STY = ("<style>text{font-family:'Helvetica Neue',Arial,sans-serif;font-size:20px;fill:#1f2937}"
       ".it{font-style:italic}.s{font-size:16px;fill:#374151}.pt{fill:#111827}.ln{stroke:#111827;stroke-width:2.2;fill:none}"
       ".th{stroke:#111827;stroke-width:1.4;fill:none}.ds{stroke:#111827;stroke-width:1.6;stroke-dasharray:6 5;fill:none}"
       ".c{stroke:#2563eb;stroke-width:2.2;fill:none}.r{stroke:#dc2626;stroke-width:2;fill:none}.fill{fill:#dbeafe;stroke:none;opacity:.7}</style>")

def svg(body, w=W, h=H):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">'
            f'{STY}<rect width="{w}" height="{h}" fill="#ffffff"/>{body}</svg>')
def L(p, q, cls='ln'): return f'<line x1="{p[0]:.1f}" y1="{p[1]:.1f}" x2="{q[0]:.1f}" y2="{q[1]:.1f}" class="{cls}"/>'
def poly(pts, cls='ln'): return f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in pts)}" class="{cls}"/>'
def T(p, s, dx=0, dy=0, cls='it'): return f'<text x="{p[0]+dx:.1f}" y="{p[1]+dy:.1f}" class="{cls}">{s}</text>'
def dot(p, r=4): return f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="{r}" class="pt"/>'
def circ(c, r, cls='c'): return f'<circle cx="{c[0]:.1f}" cy="{c[1]:.1f}" r="{r:.1f}" class="{cls}"/>'
def lab(p, s, dx, dy): return T(p, s, dx, dy)
def rt(p, a, b, size=12):
    """点 p で線分 pa, pb が直角のマーク"""
    ua = ((a[0]-p[0]), (a[1]-p[1])); ub = ((b[0]-p[0]), (b[1]-p[1]))
    na = math.hypot(*ua); nb = math.hypot(*ub)
    ua = (ua[0]/na*size, ua[1]/na*size); ub = (ub[0]/nb*size, ub[1]/nb*size)
    pts = [(p[0]+ua[0], p[1]+ua[1]), (p[0]+ua[0]+ub[0], p[1]+ua[1]+ub[1]), (p[0]+ub[0], p[1]+ub[1])]
    return f'<polyline points="{" ".join(f"{x:.1f},{y:.1f}" for x,y in pts)}" class="th"/>'
def tick(p, q, n=1, size=7):
    """線分 pq の中点に n 本の等長記号"""
    mx, my = (p[0]+q[0])/2, (p[1]+q[1])/2
    dx, dy = q[0]-p[0], q[1]-p[1]; nrm = math.hypot(dx, dy); ux, uy = dx/nrm, dy/nrm
    px, py = -uy, ux; out = ''
    for i in range(n):
        off = (i-(n-1)/2)*5
        cx, cy = mx+ux*off, my+uy*off
        out += L((cx-px*size, cy-py*size), (cx+px*size, cy+py*size), 'th')
    return out
def divpt(p, q, m, n):
    """pq を m:n に内分"""
    return (p[0]+(q[0]-p[0])*m/(m+n), p[1]+(q[1]-p[1])*m/(m+n))
def inter(p1, p2, p3, p4):
    x1,y1=p1; x2,y2=p2; x3,y3=p3; x4,y4=p4
    d=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)
    t=((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/d
    return (x1+t*(x2-x1), y1+t*(y2-y1))
def circum(A,B,C):
    ax,ay=A; bx,by=B; cx,cy=C
    d=2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by))
    ux=((ax*ax+ay*ay)*(by-cy)+(bx*bx+by*by)*(cy-ay)+(cx*cx+cy*cy)*(ay-by))/d
    uy=((ax*ax+ay*ay)*(cx-bx)+(bx*bx+by*by)*(ax-cx)+(cx*cx+cy*cy)*(bx-ax))/d
    return (ux,uy), math.hypot(ax-ux, ay-uy)
def tri_from_sides(a_, b_, c_, B=(90,320), scale=None):
    """BC=a_, CA=b_, AB=c_ の三角形。B を左下、C を右に。"""
    if scale is None: scale = 380/a_
    C=(B[0]+a_*scale, B[1])
    cosB=(a_*a_+c_*c_-b_*b_)/(2*a_*c_); sinB=math.sqrt(max(0,1-cosB*cosB))
    A=(B[0]+c_*scale*cosB, B[1]-c_*scale*sinB)
    return A,B,C
FIGS = {}

# ---- №53 角の二等分線：AB=6, BC=7, CA=4（→ BD:DC=3:2, BD=21/5）----
A,B,C = tri_from_sides(7,4,6,B=(70,330),scale=58)
D = divpt(B,C,6,4)                      # BD:DC = AB:AC = 6:4
I = inter(A,D,B,divpt(A,C,7,4))         # ∠B の二等分線は AC を BA:BC=6:7 に分ける
E = inter(B,I,A,C)
FIGS['drill53_bisector.svg'] = svg(poly([A,B,C]) + L(A,D) + L(B,E) + dot(I) +
  lab(A,'A',-8,-10)+lab(B,'B',-22,10)+lab(C,'C',8,10)+lab(D,'D',-6,26)+lab(E,'E',10,4)+lab(I,'I',-22,-4)+
  T(divpt(A,B,1,1),'6',-30,-6,'s')+T(divpt(B,C,1,1),'7',-4,28,'s')+T(divpt(A,C,1,1),'4',14,-8,'s'))

# ---- №54 チェバ：BD:DC=2:3, CE:EA=3:4 ----
A,B,C = (300,60),(70,330),(500,330)
D = divpt(B,C,2,3); E = divpt(C,A,3,4)
P_ = inter(A,D,B,E); F = inter(C,P_,A,B)
FIGS['drill54_ceva.svg'] = svg(poly([A,B,C]) + L(A,D) + L(B,E) + L(C,F) + dot(P_) +
  lab(A,'A',-8,-10)+lab(B,'B',-24,10)+lab(C,'C',8,10)+lab(D,'D',-6,26)+lab(E,'E',12,4)+lab(F,'F',-24,0)+lab(P_,'P',8,20)+
  T(divpt(B,D,1,1),'②',-8,28,'s')+T(divpt(D,C,1,1),'③',-8,28,'s')+T(divpt(C,E,1,1),'③',14,2,'s')+T(divpt(E,A,1,1),'④',14,2,'s'))

# ---- №55 メネラウス：AE:EB=1:2 (E on AB), BD:DC=2:1 (D on BC), CE ∩ AD = P ----
A,B,C = (300,60),(70,330),(500,330)
E = divpt(A,B,1,2); D = divpt(B,C,2,1); P_ = inter(A,D,C,E)
FIGS['drill55_menelaus.svg'] = svg(poly([A,B,C]) + L(A,D) + L(C,E) + dot(P_) +
  lab(A,'A',-8,-10)+lab(B,'B',-24,10)+lab(C,'C',8,10)+lab(D,'D',-6,26)+lab(E,'E',-24,0)+lab(P_,'P',6,-8)+
  T(divpt(A,E,1,1),'①',-30,2,'s')+T(divpt(E,B,1,1),'②',-30,2,'s')+T(divpt(B,D,1,1),'②',-8,28,'s')+T(divpt(D,C,1,1),'①',-8,28,'s'))

# ---- №56 円周角：∠A:∠B:∠C = 4:3:2（A=80,B=60,C=40）, D は AO の延長, EF∥BC ----
# 外接円 中心 O=(280,200), R=150。中心角 2∠A=160°(弧BC) 等
O=(280,205); R=150
def onc(deg): return (O[0]+R*math.cos(math.radians(deg)), O[1]-R*math.sin(math.radians(deg)))
# 弧 BC = 160°, 弧 CA = 120°, 弧 AB = 80°
A=onc(90); B=onc(90+80); C=onc(90-120)
D=(2*O[0]-A[0], 2*O[1]-A[1])
# EF ∥ BC、OD と交わる位置：BC の y より下（円の下側）
yEF = O[1] + 0.75*R
dxEF = math.sqrt(R*R-(yEF-O[1])**2)
E=(O[0]-dxEF, yEF); F=(O[0]+dxEF, yEF)
FIGS['drill56_inscribed.svg'] = svg(circ(O,R) + poly([A,B,C]) + L(A,D) + L(E,F) + L(B,E,'th') + L(C,F,'th') + dot(O) +
  lab(A,'A',-8,-12)+lab(B,'B',-26,8)+lab(C,'C',10,8)+lab(D,'D',6,22)+lab(E,'E',-26,8)+lab(F,'F',10,8)+lab(O,'O',8,-6)+
  T((O[0]-250,60),'∠A:∠B:∠C = 4:3:2',0,0,'s'))

# ---- №57 接弦定理：P 外点, 接点 A, 直径 AB, PB と円の交点 C ----
O=(360,210); R=120
A=(O[0],O[1]+R); B=(O[0],O[1]-R); P_=(80,O[1]+R)
# C: PB と円のもう一つの交点
dx,dy=B[0]-P_[0],B[1]-P_[1]
# パラメトリック P + t(B-P), |.|=R  → 解 t(≠1)
fx,fy=P_[0]-O[0],P_[1]-O[1]
a_=dx*dx+dy*dy; b_=2*(fx*dx+fy*dy); c_=fx*fx+fy*fy-R*R
t=(-b_-math.sqrt(b_*b_-4*a_*c_))/(2*a_)
C=(P_[0]+t*dx,P_[1]+t*dy)
Dd=onc_ = (O[0]+R*math.cos(math.radians(20)), O[1]-R*math.sin(math.radians(20)))
FIGS['drill57_tangent_chord.svg'] = svg(circ(O,R) + L(P_,(A[0]+120,A[1])) + L(P_,B) + L(A,B) + L(A,C) + L(C,B,'th') +
  L(A,Dd,'th')+L(C,Dd,'th') + dot(O) +
  lab(A,'A',-4,26)+lab(B,'B',-6,-12)+lab(C,'C',-26,-4)+lab(P_,'P',-8,26)+lab(O,'O',8,-6)+lab(Dd,'D',10,4)+
  f'<path d="M {A[0]-30:.1f} {A[1]:.1f} A 30 30 0 0 1 {A[0]-30*math.cos(math.atan2(A[1]-C[1],A[0]-C[0])):.1f} {A[1]-30*math.sin(math.atan2(A[1]-C[1],A[0]-C[0])):.1f}" class="r"/>'+
  T(A,'a',-46,-8,'it'))

# ---- №58 方べき：O 外点, 割線 OAB (OA=3, OB=8), 割線 OCD (OC=4) ----
Oc=(330,215); R=125
Ox=(60,300)
def secant(Ox, ang):
    dx,dy=math.cos(ang),math.sin(ang)
    fx,fy=Ox[0]-Oc[0],Ox[1]-Oc[1]
    b_=2*(fx*dx+fy*dy); c_=fx*fx+fy*fy-R*R
    disc=math.sqrt(b_*b_-4*c_); t1=(-b_-disc)/2; t2=(-b_+disc)/2
    return (Ox[0]+t1*dx,Ox[1]+t1*dy),(Ox[0]+t2*dx,Ox[1]+t2*dy)
A,B=secant(Ox, math.radians(-8)); C,D=secant(Ox, math.radians(-38))
FIGS['drill58_power.svg'] = svg(circ(Oc,R) + L(Ox,B) + L(Ox,D) + L(A,D,'th') + L(C,B,'th') +
  lab(Ox,'O',-24,8)+lab(A,'A',-4,26)+lab(B,'B',10,8)+lab(C,'C',-14,-10)+lab(D,'D',6,-8)+
  T(divpt(Ox,A,1,1),'3',-2,28,'s')+T(divpt(A,B,1,1),'5',-2,28,'s')+T(divpt(Ox,C,1,1),'4',-18,-8,'s'))

# ---- №59 2円の外接・共通接線 ----
a_,b_=55,105; y0=330
A=(150,y0-a_); Bc=(150+2*math.sqrt(a_*b_)+0, y0-b_)
# 外接: AB = a+b。T1T2 = 2√(ab)。中心間水平距離 = √((a+b)^2-(b-a)^2) = 2√(ab)
FIGS['drill59_two_circles.svg'] = svg(circ(A,a_)+circ(Bc,b_)+L((60,y0),(520,y0))+L(A,Bc)+L(A,(A[0],y0),'ds')+L(Bc,(Bc[0],y0),'ds')+
  L(A,(Bc[0],A[1]),'ds')+rt((Bc[0],A[1]),A,Bc)+dot(A)+dot(Bc)+
  lab(A,'A',-24,-4)+lab(Bc,'B',8,-8)+lab((A[0],y0),'T₁',-12,26)+lab((Bc[0],y0),'T₂',-12,26)+
  T(divpt(A,(A[0],y0),1,1),'a',-22,6,'it')+T(divpt(Bc,(Bc[0],y0),1,1),'b',10,6,'it')+T(divpt(A,Bc,1,1),'a+b',-40,-8,'it')+lab((Bc[0],A[1]),'H',8,20))

# ---- №60 平面幾何(I)：D on BC の延長、直線 DF が AB,AC と交わる。AB=8,BC=7,CA=6,CD=3（B,C,E,F 共円 → AE=4, AF=3）----
A,B,C = tri_from_sides(7,6,8,B=(60,330),scale=42)
Dp=(C[0]+3*42,C[1])
E=divpt(A,C,4,2)  # AE:EC = 4:2
F=divpt(A,B,3,5)  # AF:FB = 3:5
FIGS['drill60_menelaus_ext.svg'] = svg(poly([A,B,C])+L(C,Dp)+L(Dp,F)+dot(E)+dot(F)+
  lab(A,'A',-8,-10)+lab(B,'B',-24,10)+lab(C,'C',-6,26)+lab(Dp,'D',8,10)+lab(E,'E',12,-2)+lab(F,'F',-24,0)+
  T(divpt(A,B,3,1),'8',-26,0,'s')+T(divpt(B,C,1,1),'7',-6,28,'s')+T(divpt(C,Dp,1,1),'3',-6,28,'s')+
  T(divpt(A,E,1,1),'a',12,-4,'it')+T(divpt(A,F,1,1),'b',-22,-2,'it'))

# ---- №61 平面幾何(II)：∠C=90°, AB=13a, BC=5a → CA=12a, D on BC 延長 (CD=CA), E: AB中点, F: B から AD への垂線の足 ----
sc=17
C=(200,330); B=(C[0]-5*sc,330); A=(200,330-12*sc)
Dp=(C[0]+12*sc,330); E=divpt(A,B,1,1)
# F = 垂線の足
vx,vy=Dp[0]-A[0],Dp[1]-A[1]; t=((B[0]-A[0])*vx+(B[1]-A[1])*vy)/(vx*vx+vy*vy); F=(A[0]+t*vx,A[1]+t*vy)
Oc,Rr=circum(A,B,C)
FIGS['drill61_right_triangle.svg'] = svg(circ(Oc,Rr,'ds')+poly([A,B,Dp])+L(A,C)+L(B,F)+L(E,C,'th')+L(E,F,'th')+rt(C,A,B)+rt(F,B,A)+dot(E)+
  lab(A,'A',-8,-10)+lab(B,'B',-24,10)+lab(C,'C',-6,26)+lab(Dp,'D',8,10)+lab(E,'E',-26,-2)+lab(F,'F',10,-6)+
  T(divpt(B,C,1,1),'5a',-12,28,'it')+T(divpt(A,B,1,3),'13a',-40,0,'it')+tick(C,Dp,2)+tick(A,C,2))

# ---- №62 四角形（トレミー型）：∠B=120°, CD=DA=AC ----
Oc=(290,205); R=150
A=(Oc[0]+R*math.cos(math.radians(210)),Oc[1]-R*math.sin(math.radians(210)))
C=(Oc[0]+R*math.cos(math.radians(330)),Oc[1]-R*math.sin(math.radians(330)))
Dp=(Oc[0],Oc[1]-R)
B=(Oc[0]+R*math.cos(math.radians(255)),Oc[1]-R*math.sin(math.radians(255)))
E=inter(B,Dp,A,C)
# E は BD 上で BE = AB
bl=math.hypot(A[0]-B[0],A[1]-B[1]); ux,uy=(Dp[0]-B[0])/math.hypot(Dp[0]-B[0],Dp[1]-B[1]),(Dp[1]-B[1])/math.hypot(Dp[0]-B[0],Dp[1]-B[1])
E=(B[0]+ux*bl,B[1]+uy*bl)
FIGS['drill62_ptolemy.svg'] = svg(circ(Oc,R,'ds')+poly([A,B,C,Dp])+L(A,C)+L(B,Dp)+L(A,E,'th')+dot(E)+
  lab(A,'A',-24,8)+lab(B,'B',-8,26)+lab(C,'C',10,8)+lab(Dp,'D',-6,-12)+lab(E,'E',10,-6)+
  tick(A,Dp,2)+tick(Dp,C,2)+tick(A,C,2)+tick(A,B,1)+tick(B,E,1)+T(B,'120°',6,-14,'s')+T(divpt(A,B,1,1),'3',-22,10,'s')+T(divpt(B,C,1,1),'5',10,12,'s'))

# ---- №63 内接球：直円錐 r=5, h=12 ----
apex=(280,60); base_y=330; rr=180
FIGS['drill63_insphere.svg'] = svg(L(apex,(apex[0]-rr,base_y))+L(apex,(apex[0]+rr,base_y))+
  f'<ellipse cx="{apex[0]}" cy="{base_y}" rx="{rr}" ry="34" class="ln"/>'+
  circ((apex[0], base_y-75), 75)+L(apex,(apex[0],base_y),'ds')+L((apex[0],base_y),(apex[0]+rr,base_y),'th')+
  dot((apex[0],base_y-75))+lab((apex[0],base_y-75),'O',10,-6)+
  T((apex[0]+rr/2,base_y),'5',-4,-8,'s')+T((apex[0],(apex[1]+base_y)/2),'12',8,0,'s')+lab(apex,'A',-8,-10)+lab((apex[0],base_y),'H',6,24)+
  L((apex[0],base_y-75),(apex[0]+75*math.cos(math.atan2(rr,base_y-apex[1])),base_y-75-75*math.sin(math.atan2(rr,base_y-apex[1]))),'r'))

# ---- №64 四面体 OA=OB=OC, △ABC 直角三角形 ----
Bp=(90,300); Cp=(470,300); Ap=(360,200); Hp=divpt(Bp,Cp,1,1)  # 斜辺 BC の中点が外心（∠A=90°）
Op=(Hp[0],60)
FIGS['drill64_tetra_circum.svg'] = svg(poly([Ap,Bp,Cp],'ln')+L(Op,Ap)+L(Op,Bp)+L(Op,Cp)+L(Op,Hp,'ds')+L(Hp,Ap,'ds')+rt(Hp,Op,Cp)+dot(Hp)+
  lab(Op,'O',-6,-10)+lab(Ap,'A',8,-4)+lab(Bp,'B',-24,10)+lab(Cp,'C',10,10)+lab(Hp,'H',-6,26)+
  T(divpt(Ap,Bp,1,1),'8',-4,-10,'s')+T(divpt(Ap,Cp,1,1),'6',8,-8,'s')+T(divpt(Bp,Cp,1,3),'10',-4,26,'s')+T(divpt(Op,Bp,1,1),'9',-24,0,'s'))

# ---- №65 特殊な四面体 AB=AC=DB=DC=5, BC=AD=4 ----
Ap=(300,60); Bp=(80,250); Cp=(330,330); Dp=(480,230)
Mp=divpt(Bp,Cp,1,1); Np=divpt(Ap,Dp,1,1)
FIGS['drill65_tetra_isosceles.svg'] = svg(L(Ap,Bp)+L(Ap,Cp)+L(Ap,Dp)+L(Bp,Cp)+L(Cp,Dp)+L(Bp,Dp,'ds')+L(Ap,Mp,'th')+L(Dp,Mp,'th')+L(Mp,Np,'r')+dot(Mp)+dot(Np)+
  lab(Ap,'A',-8,-10)+lab(Bp,'B',-24,8)+lab(Cp,'C',-4,26)+lab(Dp,'D',10,8)+lab(Mp,'M',-8,26)+lab(Np,'N',8,-6)+
  T(divpt(Ap,Bp,1,1),'5',-22,0,'s')+T(divpt(Ap,Cp,1,1),'5',10,0,'s')+T(divpt(Cp,Dp,1,1),'5',8,20,'s')+T(divpt(Bp,Cp,1,1),'4',-22,20,'s')+T(divpt(Ap,Dp,1,3),'4',10,-6,'s')+T(divpt(Bp,Dp,1,3),'5',-6,-10,'s'))

for name, body in FIGS.items():
    open(os.path.join(OUT, name), 'w', encoding='utf-8').write(body)
print('written', len(FIGS), 'svgs →', OUT)

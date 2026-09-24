# -*- coding: utf-8 -*-
"""マナトビ基本演習 Step 87〜137（場合の数と確率・データの分析）の図を SVG で作る。

★図の数値は問題データ（ia_drill_*.py）から直接読む★
  図だけ手で描くと、問題の数値を直したときに図が古いまま残る。
  ここでは問題ファイルで使っている配列（度数・得点・座標）を import して描くので、ずれない。

使い方:
  from fig_data_svg import attach_figures, write_all
  attach_figures(PROBLEMS)   # 対象の大問に imageUrl / imageCaption を付ける（gen_ts.py から呼ぶ）
  write_all()                # public/fig_math/*.svg を書き出す
"""
import math
import os
from fractions import Fraction as F

import ia_drill_comb2 as C2
import ia_drill_prob2 as P2
import ia_drill_data as DA
import ia_drill_data3 as D3

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'public/fig_math')

STY = ("<style>text{font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;fill:#1f2937}"
       ".s{font-size:12px;fill:#4b5563}.b{font-weight:700}.ln{stroke:#111827;stroke-width:2;fill:none}"
       ".th{stroke:#9ca3af;stroke-width:1;fill:none}.gd{stroke:#e5e7eb;stroke-width:1;fill:none}"
       ".ds{stroke:#6b7280;stroke-width:1.4;stroke-dasharray:5 4;fill:none}.bar{fill:#bfdbfe;stroke:#1d4ed8;stroke-width:1.4}"
       ".box{fill:#dbeafe;stroke:#1d4ed8;stroke-width:1.8}.red{stroke:#dc2626;stroke-width:3;fill:none}"
       ".pt{fill:#1d4ed8}.pt2{fill:#dc2626}.hl{stroke:#dc2626;stroke-width:2.4;fill:none}</style>")


def svg(body, w, h, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" '
            f'aria-label="{title}"><title>{title}</title>{STY}<rect width="{w}" height="{h}" fill="#ffffff"/>{body}</svg>')


def L(x1, y1, x2, y2, c='ln'):
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" class="{c}"/>'


def T(x, y, s, c='', anchor='middle'):
    cls = f' class="{c}"' if c else ''
    return f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}"{cls}>{s}</text>'


def rect(x, y, w, h, c):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" class="{c}"/>'


def dot(x, y, r=4.5, c='pt'):
    return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" class="{c}"/>'


# ------------------------------------------------------------------
# 部品
# ------------------------------------------------------------------
def histogram(freq, lo, w, unit, ylabel='人', title='', W=560, H=330, ymax=None):
    ml, mr, mt, mb = 56, 20, 34, 52
    pw, ph = W - ml - mr, H - mt - mb
    n = len(freq)
    ymax = ymax or (max(freq) + (2 - max(freq) % 2))
    bw = pw / n
    sy = ph / ymax
    b = [T(W / 2, 22, title, 'b')] if title else []
    step = 2 if ymax <= 16 else 5
    for v in range(0, ymax + 1, step):
        y = mt + ph - v * sy
        b.append(L(ml, y, ml + pw, y, 'gd'))
        b.append(T(ml - 8, y + 5, v, 's', 'end'))
    for i, f in enumerate(freq):
        x = ml + i * bw
        b.append(rect(x, mt + ph - f * sy, bw, f * sy, 'bar'))
        b.append(T(x + bw / 2, mt + ph - f * sy - 5, f, 's'))
    for i in range(n + 1):
        b.append(T(ml + i * bw, mt + ph + 18, lo + w * i, 's'))
    b.append(L(ml, mt + ph, ml + pw, mt + ph))
    b.append(L(ml, mt, ml, mt + ph))
    b.append(T(ml + pw, mt + ph + 38, f'（{unit}）', 's', 'end'))
    b.append(T(ml - 8, mt - 10, f'（{ylabel}）', 's', 'end'))
    return b


def boxplot(rows, lo, hi, tick, unit, W=560, rowh=62, title=''):
    """rows = [(ラベル, (min, q1, q2, q3, max)), ...]"""
    ml, mr, mt = 70, 24, 36 if title else 16
    H = mt + rowh * len(rows) + 40
    pw = W - ml - mr
    sx = lambda v: ml + (float(v) - lo) / (hi - lo) * pw
    b = [T(W / 2, 22, title, 'b')] if title else []
    v = lo
    while v <= hi + 1e-9:
        b.append(L(sx(v), mt, sx(v), mt + rowh * len(rows), 'gd'))
        b.append(T(sx(v), mt + rowh * len(rows) + 18, f'{v:g}', 's'))
        v += tick
    for i, (name, (mn, q1, q2, q3, mx)) in enumerate(rows):
        cy = mt + rowh * i + rowh / 2
        b.append(T(ml - 12, cy + 5, name, 'b', 'end'))
        b.append(L(sx(mn), cy, sx(q1), cy))
        b.append(L(sx(q3), cy, sx(mx), cy))
        b.append(L(sx(mn), cy - 9, sx(mn), cy + 9))
        b.append(L(sx(mx), cy - 9, sx(mx), cy + 9))
        b.append(rect(sx(q1), cy - 16, sx(q3) - sx(q1), 32, 'box'))
        b.append(L(sx(q2), cy - 16, sx(q2), cy + 16))
    if unit:
        b.append(T(W - mr, mt + rowh * len(rows) + 36, f'（{unit}）', 's', 'end'))
    return b, H


def scatter(pts, lo, hi, tick, xl, yl, x0, y0, size=250, cls='pt'):
    """(x0, y0) を左上とする正方形の散布図"""
    s = lambda v: (float(v) - lo) / (hi - lo) * size
    b = []
    v = lo
    while v <= hi + 1e-9:
        b.append(L(x0 + s(v), y0, x0 + s(v), y0 + size, 'gd'))
        b.append(L(x0, y0 + size - s(v), x0 + size, y0 + size - s(v), 'gd'))
        b.append(T(x0 + s(v), y0 + size + 16, f'{v:g}', 's'))
        b.append(T(x0 - 6, y0 + size - s(v) + 4, f'{v:g}', 's', 'end'))
        v += tick
    b.append(L(x0, y0 + size, x0 + size, y0 + size))
    b.append(L(x0, y0, x0, y0 + size))
    seen = {}
    for (px, py) in pts:
        k = (px, py)
        seen[k] = seen.get(k, 0) + 1
        off = (seen[k] - 1) * 5
        b.append(dot(x0 + s(px) + off, y0 + size - s(py), 4.5, cls))
    b.append(T(x0 + size / 2, y0 + size + 34, xl, 's'))
    b.append(f'<text x="{x0 - 34:.1f}" y="{y0 + size / 2:.1f}" text-anchor="middle" class="s" '
             f'transform="rotate(-90 {x0 - 34:.1f} {y0 + size / 2:.1f})">{yl}</text>')
    return b


def grid_path(W_, H_, cell=60, blocked=(), marks=(), labels=(), x0=50, y0=30):
    b = []
    X = lambda i: x0 + i * cell
    Y = lambda j: y0 + (H_ - j) * cell
    for i in range(W_ + 1):
        b.append(L(X(i), Y(0), X(i), Y(H_)))
    for j in range(H_ + 1):
        b.append(L(X(0), Y(j), X(W_), Y(j)))
    for (p, q) in blocked:
        mx, my = (X(p[0]) + X(q[0])) / 2, (Y(p[1]) + Y(q[1])) / 2
        b.append(L(X(p[0]), Y(p[1]), X(q[0]), Y(q[1]), 'hl'))
        b.append(L(mx - 8, my - 8, mx + 8, my + 8, 'red'))
        b.append(L(mx - 8, my + 8, mx + 8, my - 8, 'red'))
    for (pt, name, dx, dy) in labels:
        b.append(dot(X(pt[0]), Y(pt[1]), 5, 'pt2' if name not in ('A', 'B', 'P', 'Q') else 'pt'))
        b.append(T(X(pt[0]) + dx, Y(pt[1]) + dy, name, 'b'))
    w = x0 * 2 + W_ * cell
    h = y0 + H_ * cell + 40
    return b, w, h


# ------------------------------------------------------------------
# 各図
# ------------------------------------------------------------------
def fig_octagon():
    cx, cy, R = 200, 200, 150
    P = [(cx + R * math.sin(2 * math.pi * k / 8), cy - R * math.cos(2 * math.pi * k / 8)) for k in range(8)]
    b = ['<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in P) + '" class="ln"/>']
    b.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" class="ds"/>')
    # 例：直径 P0-P4 を斜辺とする直角三角形
    b.append(f'<polygon points="{P[0][0]:.1f},{P[0][1]:.1f} {P[4][0]:.1f},{P[4][1]:.1f} {P[2][0]:.1f},{P[2][1]:.1f}" '
             'style="fill:#fee2e2;stroke:#dc2626;stroke-width:2.2"/>')
    b.append(dot(cx, cy, 3.5, 'pt2'))
    b.append(T(cx + 14, cy + 4, 'O', 's', 'start'))
    for k, (x, y) in enumerate(P):
        b.append(dot(x, y))
        dx, dy = (x - cx) / R * 22, (y - cy) / R * 22
        b.append(T(x + dx, y + dy + 5, 'ABCDEFGH'[k], 'b'))
    b.append(T(200, 392, '例：直径 AE を斜辺とする直角三角形 ACE', 's'))
    return svg(''.join(b), 400, 404, '正八角形ABCDEFGHと、直径を斜辺とする直角三角形の例')


def fig_grid101():
    b, w, h = grid_path(6, 4, 60, blocked=C2._bl,
                        labels=[((0, 0), 'A', -14, 22), ((6, 4), 'B', 14, -10), ((3, 2), 'C', 14, -8)])
    b.append(T(w / 2, h - 8, '赤い×の道（(2,0)-(3,0) と (4,2)-(4,3)）は (3) で通れない', 's'))
    return svg(''.join(b), w, h, '横6区画・縦4区画の碁盤の目の道。AからBへ、Cは(3,2)、通れない道2本')


def fig_grid114():
    b, w, h = grid_path(4, 1, 80, labels=[((0, 0), 'P', -14, 22), ((4, 1), 'Q', 14, -10), ((3, 1), 'R', 0, -14)])
    return svg(''.join(b), w, h, '横4区画・縦1区画の道。PからQへ、Rは(3,1)')


def fig_hist121():
    b = histogram(DA._f30, 30, 10, '点', title='30人の得点（10点ごとの階級）', ymax=10)
    return svg(''.join(b), 560, 330, '30人の得点のヒストグラム')


def fig_hist122():
    b = histogram(DA._f122, 0, 20, '点', title='40人の得点の度数分布', ymax=16)
    return svg(''.join(b), 560, 330, '40人の得点のヒストグラム（20点ごと）')


def fig_hist124():
    b = histogram(DA._f124, 4, 4, '点', title='43人の合計点', ymax=12)
    return svg(''.join(b), 560, 330, '43人の合計点のヒストグラム（4点ごと）')


def fig_hist126():
    b = histogram(DA._f126, 5, 5, 'm', title='40人のボール投げの記録', ymax=12)
    return svg(''.join(b), 560, 330, '40人のボール投げの記録のヒストグラム（5mごと）')


def fig_box123():
    rows = [('A君', (min(DA._A15), *DA._qa, max(DA._A15))), ('B君', (min(DA._B15), *DA._qb, max(DA._B15)))]
    b, H = boxplot(rows, 30, 100, 10, '点', title='A君・B君の15回の得点')
    return svg(''.join(b), 560, H, 'A君とB君の得点の箱ひげ図')


def fig_box125():
    rows = [('P線', (min(DA._K), *DA._quart(DA._K), max(DA._K))), ('Q線', (min(DA._I), *DA._quart(DA._I), max(DA._I)))]
    b, H = boxplot(rows, 0, 6, 0.5, 'km', title='駅間距離')
    return svg(''.join(b), 560, H, 'P線とQ線の駅間距離の箱ひげ図')


def fig_box128():
    b, H = boxplot([('', (18, 44, 52, 60, 82))], 0, 100, 10, '', title='')
    # 5つの値と外れ値の境目を書き込む
    ml, pw = 70, 560 - 70 - 24
    sx = lambda v: ml + v / 100 * pw
    for v in (18, 44, 60, 82):
        b.append(T(sx(v), 12, v, 's'))
    for v, name in ((20, '下の境目 20'), (84, '上の境目 84')):
        b.append(L(sx(v), 16, sx(v), 16 + 62, 'hl'))
        b.append(T(sx(v), H - 4, name, 's'))
    return svg(''.join(b), 560, H + 14, '最小値18・第1四分位数44・第3四分位数60・最大値82の箱ひげ図と外れ値の境目')


def fig_scatter135():
    b = [T(180, 22, '1回戦 x と 2回戦 y', 'b')]
    b += scatter(list(zip(D3._x135, D3._y135)), 25, 50, 5, '1回戦 x（点）', '2回戦 y（点）', 70, 40, 250)
    return svg(''.join(b), 360, 350, '10人の1回戦と2回戦の得点の散布図')


def fig_scatter136():
    b = [T(165, 22, '1回目（r ≒ 0.65）', 'b'), T(485, 22, '2回目（r ≒ 0.82）', 'b')]
    b += scatter(list(zip(D3._A1, D3._B1)), 0, 10, 2, '科目A（点）', '科目B（点）', 50, 40, 230)
    b += scatter(list(zip(D3._A2, D3._B2)), 0, 10, 2, '科目A（点）', '科目B（点）', 370, 40, 230, 'pt2')
    return svg(''.join(b), 640, 330, '12人の2科目の小テスト1回目と2回目の散布図')


def fig_hist137():
    # 20枚のコインを投げる実験200回の結果（表の枚数の度数）。15枚以上が6回になるようにした例
    freq = {5: 3, 6: 7, 7: 15, 8: 24, 9: 30, 10: 36, 11: 32, 12: 25, 13: 14, 14: 8, 15: 4, 16: 2}
    assert sum(freq.values()) == 200 and sum(v for k, v in freq.items() if k >= 15) == 6
    W, H, ml, mt, mb = 580, 320, 56, 34, 50
    pw, ph = W - ml - 20, H - mt - mb
    ks = sorted(freq)
    bw = pw / len(ks)
    sy = ph / 40
    b = [T(W / 2, 22, 'コイン20枚を投げる実験を200回：表の枚数の度数', 'b')]
    for v in range(0, 41, 10):
        y = mt + ph - v * sy
        b.append(L(ml, y, ml + pw, y, 'gd'))
        b.append(T(ml - 8, y + 5, v, 's', 'end'))
    for i, k in enumerate(ks):
        x = ml + i * bw
        f = freq[k]
        cls = 'bar' if k < 15 else 'box" style="fill:#fecaca;stroke:#dc2626'
        b.append(f'<rect x="{x + 3:.1f}" y="{mt + ph - f * sy:.1f}" width="{bw - 6:.1f}" height="{f * sy:.1f}" class="{cls}"/>')
        b.append(T(x + bw / 2, mt + ph - f * sy - 5, f, 's'))
        b.append(T(x + bw / 2, mt + ph + 18, k, 's'))
    b.append(L(ml, mt + ph, ml + pw, mt + ph))
    b.append(T(ml + pw, mt + ph + 38, '（表の枚数）', 's', 'end'))
    b.append(T(ml - 8, mt - 10, '（回）', 's', 'end'))
    return svg(''.join(b), W, H, 'コイン20枚を200回投げた実験の度数分布。15枚以上は合計6回'), freq


FIG137, FREQ137 = None, None

# step -> (ファイル名, 作る関数, キャプション)
FIGURES = {
    98: ('drill98_octagon', fig_octagon, '正八角形 ABCDEFGH。赤は直径 AE を斜辺とする直角三角形の例'),
    101: ('drill101_grid', fig_grid101, '横6区画・縦4区画の碁盤の目。C(3,2)。赤い×は (3) で通れない道'),
    114: ('drill114_grid', fig_grid114, '横4区画・縦1区画の道。R(3,1)'),
    121: ('drill121_hist', fig_hist121, '30人の得点のヒストグラム（30点から10点ごと）'),
    122: ('drill122_hist', fig_hist122, '40人の得点のヒストグラム（20点ごと）'),
    123: ('drill123_box', fig_box123, 'A君・B君の得点の箱ひげ図'),
    124: ('drill124_hist', fig_hist124, '43人の合計点のヒストグラム（a 以上 b 未満）'),
    125: ('drill125_box', fig_box125, 'P線・Q線の駅間距離の箱ひげ図'),
    126: ('drill126_hist', fig_hist126, '40人のボール投げの記録のヒストグラム（a 以上 b 未満）'),
    128: ('drill128_box', fig_box128, '箱ひげ図（最小値18, Q₁44, Q₃60, 最大値82）と外れ値の境目'),
    135: ('drill135_scatter', fig_scatter135, '10人の1回戦 x と 2回戦 y の散布図'),
    136: ('drill136_scatter', fig_scatter136, '12人の科目A・Bの散布図（左：1回目、右：2回目）'),
    137: ('drill137_hist', lambda: fig_hist137()[0], 'コイン20枚を200回投げた実験の結果。赤は表が15枚以上（計6回）'),
}


def attach_figures(problems):
    """harness.PROBLEMS の該当大問に画像を付ける（gen_ts.py が TS に書き出す）"""
    by_id = {p['id']: p for p in problems}
    for step, (name, _fn, cap) in FIGURES.items():
        p = by_id.get(f'q_iad_{step}')
        if p is None:
            raise SystemExit(f'[fig] q_iad_{step} が問題データに無い')
        p['image'] = f'/fig_math/{name}.svg'
        p['imageCaption'] = cap


def write_all():
    os.makedirs(OUT, exist_ok=True)
    for step, (name, fn, _cap) in FIGURES.items():
        with open(os.path.join(OUT, f'{name}.svg'), 'w', encoding='utf-8') as f:
            f.write(fn())
    return len(FIGURES)


if __name__ == '__main__':
    print('wrote', write_all(), 'svg files to', OUT)

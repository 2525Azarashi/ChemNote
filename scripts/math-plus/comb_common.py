# -*- coding: utf-8 -*-
"""マナトビ基本演習 Step 87〜138（場合の数と確率／データの分析）の共通部品

1つの定義から2つを作る。
  ① 演習（短答）… harness.P() に登録 → gen_ts.py が src/data/mathIAProblems.ts へ
  ② 対戦（4択） … export_authored_drill.py が src/battle/data/authored/math.<章>.json へ
全小問の答えは Python の総当たり / 公式で機械検算（通らなければ生成が止まる）。
対戦の誤答は「典型的な誤り」を意図して作り、why に誤りの理由を書く
（他の設問の答えを借りていない）。
参考教材の「型」だけを参考にした独自問題で、数値・設定・言い回しはすべて変えている。
"""
from harness import P, sympify
from sympy import simplify, symbols
from fractions import Fraction as F

x = symbols('x')
D = '基礎問ドリル'   # drill_naming.py が「マナトビ基本演習 Step N 〈独自題名〉」に置き換える

# 対戦用のデータ（export_authored_drill.py が読む）
BATTLE = []


def same(e1, e2):
    return simplify(sympify(e1) - sympify(e2)) == 0


def fs(v):
    if isinstance(v, F):
        return str(v.numerator) if v.denominator == 1 else f'{v.numerator}/{v.denominator}'
    return str(v)


def S(n, label, q, ans, expl, wrong, unit='', accepted=(), check=None, bp=None, tl=None):
    """小問1つ。
    ans     … int / Fraction / str（演習の正答。表示もこれ）
    wrong   … [(誤答の文, なぜ誤りか), ...] 3つ（対戦の4択に使う）
    bp      … 対戦用の問題文（省略時は 大問の文＋設問文）。150文字以内
    check   … 答えを別の方法（総当たり・公式）で確かめる式
    """
    a = fs(ans)
    acc = [a + unit] if unit else []
    acc += [v for v in accepted if v not in acc and v != a]
    return dict(n=n, label=label, q=q, answer=a, accepted=acc, expl=expl, unit=unit,
                wrong=wrong, bp=bp, tl=tl, check=check)


FIGS = {}   # step -> (ファイル名, キャプション)。fig_data_svg.py が同じ名前で SVG を書き出す


def PROB(step, chapter, title, statement, subs, point, fig=None):
    pid = f'q_iad_{step}'
    psubs, lines = [], [statement.strip()]
    for s in subs:
        sid = f'{pid}_{s["n"]}'
        chk = s['check'] if s['check'] is not None else (lambda: False)
        psubs.append(dict(id=sid, label=s['label'], answer=s['answer'], accepted=s['accepted'], check=chk))
        if s['q']:
            lines.append(f'{s["label"]}{s["q"]}')
        s['id'] = sid
    expl = '\n\n'.join(f'{s["label"]}{s["expl"]}' for s in subs) + f'\n\n【ポイント】{point}'
    img = cap = None
    if fig:
        img, cap = f'/fig_math/{fig[0]}.svg', fig[1]
        FIGS[step] = fig
    P(pid, chapter, f'{D} №{step} {title}', '\n'.join(lines), psubs, expl, image=img, imageCaption=cap)
    BATTLE.append(dict(problemId=pid, chapter=chapter, statement=statement.strip(), subs=subs, point=point))

"""
数学「入試レベル強化」問題の作成ハーネス。

各大問は dict:
  id, chapter, category, text, subs:[{id,label,answer,accepted:[...],check}], explanation
check は sympy で「answer が正しいこと」を機械的に確かめる式（真偽）。
検算に通らない問題は TS に出力しない（例外で止める）。
"""
from sympy import *
from sympy import Rational as R
import re, json, sys

_LOCALS = {'R': Rational, 'Rational': Rational}
_sympify = sympify
def sympify(e, **kw):
    if isinstance(e, str):
        return _sympify(e, locals=_LOCALS, **kw)
    return _sympify(e, **kw)

x, t, k, n, a, b, c, m = symbols('x t k n a b c m')
th = symbols('theta')

PROBLEMS = []  # 全大問

def P(id, chapter, category, text, subs, explanation, deep=None, image=None, imageCaption=None):
    for s in subs:
        s.setdefault('accepted', [])
        # 検算（必須）
        ok = s.get('check')
        if ok is None:
            raise SystemExit(f"[{s['id']}] check が無い")
        if callable(ok):
            ok = ok()
        if ok is True or (not isinstance(ok, tuple) and ok == True and ok is not False and not isinstance(ok, str)):
            ok = True
        if ok is not True:
            raise SystemExit(f"[{s['id']}] 検算に失敗: answer={s['answer']!r} check={ok!r}")
    ids = [s['id'] for s in subs]
    if len(set(ids)) != len(ids):
        raise SystemExit(f"[{id}] sub id 重複")
    # 基本演習（旧・基礎問ドリル）は名称と言い回しを独自のものに変換する（drill_naming.py）
    from drill_naming import apply as _drill_apply
    category, text = _drill_apply(category, text)
    PROBLEMS.append(dict(id=id, chapter=chapter, category=category, text=text.strip(), subs=subs,
                         explanation=explanation.strip(), deep=deep or [], image=image, imageCaption=imageCaption))

# ---- 便利: 積分の検算（微分して戻る） ----
def dint(expr_str, ans_str, var=x):
    """∫expr dx = ans + C かを確認（ans を微分して expr と一致）。文字列は sympy 式。"""
    e = sympify(expr_str); f = sympify(ans_str)
    return simplify(diff(f, var) - e) == 0

def dint_num(expr_str, ans_str, var=x, pts=(0.3, 0.7, 1.3, 2.1)):
    """数値で微分一致を確認（simplify が苦手な三角・対数向け）"""
    e = sympify(expr_str); f = sympify(ans_str)
    d = diff(f, var)
    for p in pts:
        try:
            v1 = complex(d.subs(var, p).evalf()); v2 = complex(e.subs(var, p).evalf())
        except Exception:
            continue
        if abs(v1 - v2) > 1e-7:
            return (p, v1, v2)
    return True

def defint(expr_str, lo, hi, ans, var=x):
    """定積分の検算。数値積分（高精度）で比較するので sympy の記号積分が遅い形でも速い。"""
    e = sympify(expr_str); a_ = sympify(ans)
    v = Integral(e, (var, lo, hi)).evalf(20)
    diff_ = abs(complex(N(v - a_, 20)))
    return True if diff_ < 1e-9 else (v, a_)

def eq(a_, b_):
    return simplify(sympify(a_) - sympify(b_)) == 0

def fmt_deep(*lines):
    return list(lines)

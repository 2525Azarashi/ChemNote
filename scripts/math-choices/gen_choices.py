"""
スマホの4択演習（数学）の選択肢を作る（機械生成・sympy で検算）。

  npx tsx scripts/math-choices/dump-targets.mts > .tmpwork/math-choice-targets.json
  python3 scripts/math-choices/gen_choices.py
  → src/data/mathChoices.generated.json（手で編集しない）

誤答の作り方（上から順に、3つそろうまで）:
  1. 手書きの対戦4択（authored/math.*.json）の誤答（正解が一致するものだけ）
  2. 典型的な誤りの形（符号の取り違え・±1・逆数・2倍/半分・係数1つの取り違え）
  3. 同じ単元の別の設問の答えのうち、同じ形（数だけ・式・座標…）のもの

採用しない誤答（機械で検査）:
  ・正解や別解と同じ文字列、または数値・式として等しいもの（sympy で比較）
  ・誤答どうしが等しいもの
  ・正解より極端に長い/短いもの（見た目で正解が分かってしまう）
3つそろわない設問は、スマホでも入力式のまま（無理に4択にしない）。
"""
import json, re, random, hashlib
from sympy import sympify, simplify, N, Symbol
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor

SRC = '.tmpwork/math-choice-targets.json'
DST = 'src/data/mathChoices.generated.json'
targets = json.load(open(SRC))

TRANS = standard_transformations + (implicit_multiplication_application, convert_xor)
LOCAL = {k: Symbol(k) for k in 'abcdefghjkmnpqrstuvwxyz'}
LOCAL.update({'e': sympify('E'), 'pi': sympify('pi'), 'π': sympify('pi')})


def norm(s):
    return re.sub(r'\s+', '', str(s)).replace('（', '(').replace('）', ')').replace('−', '-').replace('－', '-').replace('，', ',')


def to_expr(s):
    """式として読めれば sympy の式、読めなければ None（C・log|..|・不等式・文章は読まない）"""
    t = norm(s)
    if not t or re.search(r'[ぁ-んァ-ヶ一-龠<>≦≧≤≥=|,:;、]', t) or 'C' in t:
        return None
    t = t.replace('√', 'sqrt').replace('π', 'pi').replace('×', '*').replace('÷', '/').replace('·', '*')
    t = re.sub(r'sqrt(\d+)', r'sqrt(\1)', t)
    try:
        return parse_expr(t, local_dict=LOCAL, transformations=TRANS)
    except Exception:
        return None


def equivalent(a, b):
    if norm(a) == norm(b):
        return True
    x, y = to_expr(a), to_expr(b)
    if x is None or y is None:
        return False
    try:
        return simplify(x - y) == 0
    except Exception:
        return False


def shape(s):
    """見た目の形（同じ形の答えだけを誤答に使う。形が違うと見ただけで正解が分かる）"""
    t = norm(s)
    prefix = ''
    m = re.match(r'^([a-zA-Z](?:\(x\))?)=(.*)$', t)
    if m:
        prefix, t = m.group(1) + '=', m.group(2)
    unit = ''
    um = re.search(r'([ぁ-んァ-ヶ一-龠々%°]+|[a-z]{1,2})$', t) if re.search(r'\\d[a-z]{1,2}$', t) or re.search(r'[ぁ-んァ-ヶ一-龠々%°]$', t) else None
    if um and re.search(r'\d', t[:um.start()]):
        unit, t = um.group(1), t[:um.start()]
    if re.fullmatch(r'-?\d+', t): k = 'int'
    elif re.fullmatch(r'-?\d+/\d+', t): k = 'frac'
    elif re.fullmatch(r'-?\d+\.\d+', t): k = 'dec'
    elif re.fullmatch(r'\(.*\)', t) and ',' in t: k = 'tuple%d' % t.count(',')
    elif ',' in t: k = 'list%d' % t.count(',')
    elif 'C' in t: k = 'integral'
    elif re.search(r'[<>≦≧≤≥]', t): k = 'ineq'
    elif re.search(r'[ぁ-んァ-ヶ一-龠]', t): k = 'text'
    elif '√' in t: k = 'sqrt'
    elif re.search(r'[a-z]', t): k = 'expr'
    else: k = 'other'
    return prefix + k + ('/' + unit if unit else '')


def looks_bad(ans, w):
    """見ただけで誤りと分かる・不自然な誤答"""
    t = norm(w)
    for m in re.finditer(r'(-?\d+)/(\d+)', t):
        a, b = int(m.group(1)), int(m.group(2))
        if b == 1 or b == 0: return True
        from math import gcd
        if gcd(abs(a), b) > 1 and not re.search(r'(-?\d+)/(\d+)', norm(ans)) is None:
            ma = re.search(r'(-?\d+)/(\d+)', norm(ans))
            if gcd(abs(int(ma.group(1))), int(ma.group(2))) == 1: return True
    for m in re.finditer(r'√(\d+)', t):
        n = int(m.group(1))
        if n in (0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100): return True
    if re.search(r'(?<![\d.])1√', t): return True
    # 「/1」は書かない（e^(2x)/1・π/1）。約分できる「6√2/2」も書かない
    if re.search(r'/1(?!\d)', t): return True
    for m in re.finditer(r'(?<![\d.])(\d+)√\d+/(\d+)', t):
        from math import gcd
        if gcd(int(m.group(1)), int(m.group(2))) > 1: return True
    # 並び（約数の一覧など）で同じ数が2回出る
    if ',' in t:
        items = [x for x in re.split(r',', t) if x]
        if len(items) != len(set(items)): return True
    # 積分定数の符号だけ変えたもの（-C も +C も正解）
    if norm(w).replace('-C', '+C') == norm(ans).replace('-C', '+C'): return True
    # 角度の ±1°（誰も間違えない）
    if '°' in t:
        a_nums = re.findall(r'\d+', norm(ans)); w_nums = re.findall(r'\d+', t)
        if len(a_nums) == len(w_nums) and any(abs(int(x) - int(y)) == 1 for x, y in zip(a_nums, w_nums)): return True
        if any(int(n) % 15 for n in w_nums): return True
    if '√' in norm(ans) and not norm(ans).startswith('-') and t.startswith('-'): return True
    # 使っている文字（x, a, θ…）が正解と違う
    letters = lambda z: set(re.findall(r'[a-zθ]', re.sub(r'(log|sin|cos|tan|sqrt|lim)', '', z)))
    if letters(norm(ans)) != letters(t): return True
    # 答えが 0 以上の数なのに負の誤答（個数・確率・n進数などで一目で分かる）
    if not norm(ans).startswith('-') and t.startswith('-') and shape(ans).split('/')[0] in ('int', 'frac', 'dec'):
        return True
    return False


NUM = re.compile(r'(?<![\w.])(\d+(?:\.\d+)?)')


def perturb(ans, rnd):
    """典型的な誤りの形を作る（正解の文字列を少しだけ変える）"""
    t = str(ans).strip()
    out = []
    # 符号の取り違え
    if t.startswith('-'): out.append(t[1:])
    elif shape(t) in ('int', 'frac', 'dec', 'sqrt', 'expr'): out.append('-' + t if not re.search(r'[+\-]', t[1:]) else t)
    # 式の中の +/- を1つ入れ替え
    for m in re.finditer(r'(?<=\S)\s*([+\-])\s*', t):
        sign = '-' if m.group(1) == '+' else '+'
        out.append(t[:m.start(1)] + sign + t[m.end(1):])
    # 数を1つだけ変える（±1・2倍・半分）
    nums = list(NUM.finditer(t))
    for m in nums:
        v = m.group(1)
        if m.start(1) > 0 and t[m.start(1) - 1] in '^₍(' and t[m.start(1) - 1] == '^':
            continue
        if '.' in v:
            cand = [str(round(float(v) + d, 2)) for d in (0.1, -0.1, 1, -1)]
        else:
            n = int(v)
            cand = [str(n + 1), str(n - 1) if n > 1 else str(n + 2), str(n * 2), str(n // 2) if n > 3 else str(n + 3)]
        for c in cand:
            out.append(t[:m.start(1)] + c + t[m.end(1):])
    # 分数は逆数
    fm = re.fullmatch(r'(-?)(\d+)/(\d+)', norm(t))
    if fm: out.append(f'{fm.group(1)}{fm.group(3)}/{fm.group(2)}')
    rnd.shuffle(out)
    return out


def length_ok(ans, w):
    a, b = len(norm(ans)), len(norm(w))
    return b >= max(1, a * 0.4) and b <= a * 2.2 + 3


# 単元ごとの答え（同じ形の誤答を借りるため）
by_chapter = {}
for t in targets:
    by_chapter.setdefault(t['chapterId'], []).append(t)

result = {}
stats = {'authored': 0, 'mixed': 0, 'skip': 0}
for t in targets:
    rnd = random.Random(int(hashlib.md5(t['id'].encode()).hexdigest()[:8], 16))
    ans, accepted = t['answer'], t['accepted']
    picked = []

    def try_add(w):
        w = str(w).strip()
        if not w or len(picked) >= 3 or not length_ok(ans, w):
            return
        if shape(w) != shape(ans) or looks_bad(ans, w):
            return
        if any(equivalent(w, a) for a in accepted):
            return
        if any(equivalent(w, p) for p in picked):
            return
        picked.append(w)

    from_authored = False
    for w in (t.get('seed') or []):
        try_add(w)
    if len(picked) == 3:
        from_authored = True
    if len(picked) < 3:
        for w in perturb(ans, rnd):
            try_add(w)
            if len(picked) >= 2 and not from_authored:
                break
    if len(picked) < 3:
        sib = [x['answer'] for x in by_chapter[t['chapterId']] if x['id'] != t['id'] and shape(x['answer']) == shape(ans)]
        rnd.shuffle(sib)
        for w in sib:
            try_add(w)
    if len(picked) < 3:
        for w in perturb(ans, rnd):
            try_add(w)
    if len(picked) < 3:
        stats['skip'] += 1
        continue
    stats['authored' if from_authored else 'mixed'] += 1
    result[t['id']] = picked

json.dump(result, open(DST, 'w'), ensure_ascii=False, separators=(',', ':'), sort_keys=True)
print(stats, 'total', len(result), 'of', len(targets))

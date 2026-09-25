"""
スマホの4択演習（数学）の誤答を作る。
  python3 scripts/math-choices/gen_wrong.py   # .tmpwork/math-choice-targets.json → .tmpwork/math-choice-wrong.json
- 手書き対戦4択の誤答（seed）があればそれを使う（LLM は使わない）
- 無いものは LLM に「典型的な誤り」から誤答3つを作らせ、機械で検査する
  （正解・別解と同じ／数値として等しい／重複 → 不採用、作り直し）
"""
import json, os, re, sys, concurrent.futures as cf, yaml
from openai import OpenAI
from sympy import sympify, simplify, N
cfg = yaml.safe_load(open(os.path.expanduser('~/.genspark_llm.yaml')))
client = OpenAI(api_key=cfg['openai']['api_key'], base_url=cfg['openai']['base_url'])
SRC = '.tmpwork/math-choice-targets.json'; DST = '.tmpwork/math-choice-wrong.json'
targets = json.load(open(SRC))
done = json.load(open(DST)) if os.path.exists(DST) else {}

def norm(s): return re.sub(r'\s+', '', str(s)).replace('（', '(').replace('）', ')').replace('−', '-').replace('－', '-')
def as_num(s):
    t = norm(s).replace('^', '**').replace('√', 'sqrt').replace('π', 'pi').replace('×', '*').replace('÷', '/')
    if not re.fullmatch(r'[0-9+\-*/().a-z]+', t) or re.search(r'[a-z]', t.replace('sqrt', '').replace('pi', '')): return None
    try: v = complex(N(sympify(t))); return v
    except Exception: return None
def same(a, b):
    if norm(a) == norm(b): return True
    x, y = as_num(a), as_num(b)
    return x is not None and y is not None and abs(x - y) < 1e-9
def valid(t, wrong):
    if not isinstance(wrong, list) or len(wrong) != 3: return False
    ws = [str(w).strip() for w in wrong]
    if any(not w or len(w) > 80 for w in ws): return False
    for w in ws:
        if any(same(w, a) for a in t['accepted']): return False
    for i in range(3):
        for j in range(i + 1, 3):
            if same(ws[i], ws[j]): return False
    return True

PROMPT = """あなたは高校数学の先生です。次の問題の「4択問題の誤答（ひっかけ）」を3つ作ってください。
条件:
- 生徒が実際にしやすい典型的な誤り（符号ミス・公式の取り違え・場合分け漏れ・計算ミス・約分忘れ など）から作る
- 正解と同じ値・同じ意味になるもの（約分しただけ・順番を入れ替えただけ・表記違い）は絶対に作らない
- 正解と同じ書き方（記号・書式・単位・分数の書き方）にそろえる。正解より明らかに長い/短いものは避ける
- それぞれ、なぜ誤りかを15〜40字の日本語で
JSON のみで返す: {"wrong":["誤答1","誤答2","誤答3"],"why":["理由1","理由2","理由3"]}

問題: {problem}
設問: {label}
正解: {answer}
別解として正しい表記: {accepted}
解説（抜粋）: {explanation}"""

def fill(t):
    out = PROMPT
    for k, v in (('problem', t['problem']), ('label', t['label']), ('answer', t['answer']), ('accepted', ' / '.join(t['accepted'])), ('explanation', t['explanation'])):
        out = out.replace('{' + k + '}', str(v))
    return out

def work(t):
    if t['seed'] and len(t['seed']) == 3 and valid(t, t['seed']):
        return t['id'], {'wrong': t['seed'], 'why': None, 'source': 'authored'}
    for attempt in range(3):
        try:
            r = client.chat.completions.create(model='gpt-5-mini', messages=[{'role': 'user', 'content': fill(t)}])
            txt = r.choices[0].message.content or ''
            m = re.search(r'\{.*\}', txt, re.S)
            obj = json.loads(m.group(0)) if m else None
            if obj and valid(t, obj.get('wrong')):
                return t['id'], {'wrong': [str(w).strip() for w in obj['wrong']], 'why': obj.get('why'), 'source': 'llm'}
        except Exception as e:
            print('ERR', t['id'], e, file=sys.stderr)
    return t['id'], None

todo = [t for t in targets if t['id'] not in done]
print('todo', len(todo), file=sys.stderr)
with cf.ThreadPoolExecutor(max_workers=int(os.environ.get('WORKERS', '24'))) as ex:
    for n, (k, v) in enumerate(ex.map(work, todo)):
        if v: done[k] = v
        if n % 50 == 0:
            json.dump(done, open(DST, 'w'), ensure_ascii=False); print('progress', n, len(done), file=sys.stderr)
json.dump(done, open(DST, 'w'), ensure_ascii=False)
print('done', len(done), 'of', len(targets), file=sys.stderr)

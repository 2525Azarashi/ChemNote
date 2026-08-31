# -*- coding: utf-8 -*-
"""地理探究HTML（kai1〜kai6・yosou）を構造化JSONに落とす調査用パーサ。"""
import re, json, html, sys, os

# ★元データはリポジトリ内に置く★
#   最初は /tmp/chiri/chiri-tankyu を読んでいたが、サンドボックスを作り直すと
#   /tmp が消えるので、次の作業のときに「もう一度ZIPを貰う」ことになる。
#   HTML 8ファイルで 700KB なので、リポジトリに入れて作業を再開できるようにした。
SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src')
FILES = ['kai1','kai2','kai3','kai4','kai5','kai6','yosou']

def txt(s):
    s = re.sub(r'<br\s*/?>', '\n', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s)
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()

def parse_table(tbl):
    rows = []
    for tr in re.findall(r'<tr[^>]*>(.*?)</tr>', tbl, re.S):
        cells = []
        for m in re.finditer(r'<(t[hd])([^>]*)>(.*?)</\1>', tr, re.S):
            attrs = m.group(2)
            cs = int((re.search(r'colspan="(\d+)"', attrs) or [0,'1'])[1])
            rs = int((re.search(r'rowspan="(\d+)"', attrs) or [0,'1'])[1])
            cells.append({'t': m.group(1), 'v': txt(m.group(3)), 'cs': cs, 'rs': rs})
        if cells: rows.append(cells)
    return rows

out = {}
for f in FILES:
    s = open(os.path.join(SRC, f+'.html'), encoding='utf-8').read()
    qpart, apart = re.split(r"<section class=\"answers[^\"]*\"", s, maxsplit=1)
    # --- 大問ごとに分割
    sections = []
    parts = re.split(r'<h2>(第\d問[^<]*)</h2>', qpart)
    for i in range(1, len(parts), 2):
        sections.append({'h2': txt(parts[i]), 'body': parts[i+1]})
    file_obj = {'title': txt(re.search(r'<title>(.*?)</title>', s, re.S).group(1)), 'sections': []}
    for sec in sections:
        b = sec['body']
        lead = [txt(x) for x in re.findall(r'<p class="lead">(.*?)</p>', b, re.S)]
        dial = []
        for d in re.findall(r'<div class="dialogue">(.*?)</div>', b, re.S):
            for p in re.findall(r'<p>(.*?)</p>', d, re.S):
                dial.append(txt(p))
        figs = []
        for fig in re.findall(r'<figure class="material">(.*?)</figure>', b, re.S):
            cap = re.search(r'<figcaption>(.*?)</figcaption>', fig, re.S)
            pre = re.search(r'<pre>(.*?)</pre>', fig, re.S)
            note = re.search(r'<p class="zu-note">(.*?)</p>', fig, re.S)
            kind = re.search(r'<p class="zu-kind">(.*?)</p>', fig, re.S)
            figs.append({
                'caption': txt(cap.group(1)) if cap else '',
                'kind': txt(kind.group(1)) if kind else '',
                'prompt': html.unescape(pre.group(1)) if pre else '',
                'note': txt(note.group(1)) if note else '',
                'tables': [parse_table(t) for t in re.findall(r'<table class="data"[^>]*>(.*?)</table>', fig, re.S)],
                'srcs': [txt(x) for x in re.findall(r'<p class="src"[^>]*>(.*?)</p>', fig, re.S)],
            })
        qs = []
        for q in re.findall(r'<div class="q">(.*?)</div>\s*(?=<div class="q">|<h2>|<!--|$)', b, re.S):
            head = re.search(r'<p class="q-head">(.*?)</p>', q, re.S)
            mark = re.search(r'<span class="mark">(\d+)</span>', q)
            body = re.search(r'<div class="q-body">(.*?)</div>', q, re.S)
            ol = re.search(r'<ol class="choices">(.*?)</ol>', q, re.S)
            choices = [txt(x) for x in re.findall(r'<li>(.*?)</li>', ol.group(1), re.S)] if ol else []
            tables = [parse_table(t) for t in re.findall(r'<table class="data"[^>]*>(.*?)</table>', q, re.S)]
            qs.append({
                'head': txt(head.group(1)) if head else '',
                'mark': int(mark.group(1)) if mark else None,
                'body': [txt(p) for p in re.findall(r'<p[^>]*>(.*?)</p>', body.group(1), re.S)] if body else [],
                'choices': choices,
                'tables': tables,
            })
        file_obj['sections'].append({'h2': sec['h2'], 'lead': lead, 'dialogue': dial, 'figures': figs, 'questions': qs})
    # --- 解答表
    ans = {}
    at = re.search(r'<table class="ans-table">(.*?)</table>', apart, re.S)
    for row in parse_table(at.group(1)):
        vals = [c['v'] for c in row]
        nums = [v for v in vals if re.fullmatch(r'\d+', v)]
        cor = [v for v in vals if re.fullmatch(r'[①-⑧]', v)]
        if nums and cor:
            ans[int(nums[0])] = cor[0]
    # --- 解説
    #
    # ★見出しの深さがファイルによって違う★
    #   kai1〜kai6 は設問ごとの解説を <h3>問1　正解 ④</h3> で書いているが、
    #   yosou.html だけは <h3> を「第1問　エネルギー転換と資源の地理」という
    #   大問の見出しに使い、設問ごとの解説を ★<h4>★ に落としている。
    #   h3 だけを見ていた最初のパーサでは yosou の解説が
    #   5件しか取れず（大問見出しと総括だけ）、16設問ぶんの解説が
    #   まるごと欠けていた。
    #   → h3 と h4 の両方を見出しとして扱う。
    #
    # ★見出しの並び順を保つ★
    #   「第1問」の問1と「第2問」の問1は同じ "問1　正解 ①" になりうるので、
    #   文字列を鍵にすると上書きされる。直前に出た大問見出しと組にして
    #   区別できるようにし、出現順も order に残す。
    exps = {}
    order = []
    heading = re.compile(r'<h([34])>(.*?)</h\1>', re.S)
    marks = [(m.start(), m.end(), m.group(1), txt(m.group(2))) for m in heading.finditer(apart)]
    cur_dai = ''
    for idx, (st, en, level, title) in enumerate(marks):
        nxt = marks[idx + 1][0] if idx + 1 < len(marks) else len(apart)
        body = txt(re.sub(r'<table.*?</table>', '[表]', apart[en:nxt], flags=re.S))[:4000]
        is_q = re.match(r'問\s*\d+', title) is not None
        if not is_q:
            # 設問でない見出し（大問名・総括）は、以降の設問の所属として覚える
            if re.match(r'第\s*\d+\s*問', title):
                cur_dai = title
        key = f'{cur_dai} / {title}' if (is_q and cur_dai) else title
        exps.setdefault(key, []).append(body)
        order.append({'level': int(level), 'dai': cur_dai if is_q else '', 'title': title, 'isQuestion': is_q})
    file_obj['answers'] = ans
    file_obj['explanations'] = {k: v for k, v in exps.items()}
    file_obj['explanationOrder'] = order
    out[f] = file_obj

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'raw.json')
json.dump(out, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for f in FILES:
    o = out[f]
    qexp = sum(1 for x in o['explanationOrder'] if x['isQuestion'])
    print(f, '|', len(o['sections']), 'sections |', sum(len(s['questions']) for s in o['sections']), 'q |',
          len(o['answers']), 'ans |', qexp, '設問解説 /', len(o['explanationOrder']), '見出し')
    for s in o['sections']:
        print('   ', s['h2'], '| figs', len(s['figures']), '| q', len(s['questions']), '| marks', [q['mark'] for q in s['questions']])

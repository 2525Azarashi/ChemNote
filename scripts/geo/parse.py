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
    # ★箇条書き・段落の区切りを改行として残す★
    #   タグを一律で消すと <li>…</li><li>…</li> が 1 行に潰れ、
    #   解説の「① …／② …」が読めない帯になる。
    #   閉じタグの手前に改行を入れてから、タグを落とす。
    s = re.sub(r'</(li|p|tr|h[1-6]|div|ul|ol|section|figcaption|pre)>', '\n', s)
    s = re.sub(r'<(li)[^>]*>', '・', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s)
    s = re.sub(r'[ \t]+', ' ', s)
    # 改行の前後に付いた空白と、3行以上の空行を畳む
    s = re.sub(r' *\n *', '\n', s)
    s = re.sub(r'\n{3,}', '\n\n', s)
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
            # ★1つの図の中に複数の資料が縦に並んでいる★
            #   実データの figure は「［上段］表 → ［下段］グラフ → 注記」のように
            #   複数の部品が順番に並んでいる（1つの figure に表が最大4つある）。
            #   種類ごとに findall で集めると ★並び順が失われて★
            #   「どの見出しがどの表のものか」が分からなくなるので、
            #   出現順のまま blocks に積む。
            blocks = []
            for m in re.finditer(
                r'<p class="src"[^>]*>(?P<src>.*?)</p>'
                r'|<table class="data"[^>]*>(?P<tbl>.*?)</table>'
                # memo / zu-prompt の中に div は入っていないので、
                # 最初の </div> までを取れば足りる（非貪欲で止める）。
                r'|<div class="memo"[^>]*>(?P<memo>.*?)</div>'
                r'|<div class="zu-prompt"[^>]*>(?P<zu>.*?)</div>',
                    fig, re.S):
                if m.group('src') is not None:
                    t = txt(m.group('src'))
                    # 「［上段］…」「［図Ⅰ］…」は資料の小見出し、それ以外は注記。
                    blocks.append({'type': 'label' if t.startswith('［') else 'note', 'text': t})
                elif m.group('tbl') is not None:
                    blocks.append({'type': 'table', 'rows': parse_table(m.group('tbl'))})
                elif m.group('memo') is not None:
                    mm = m.group('memo')
                    h5 = re.search(r'<h5>(.*?)</h5>', mm, re.S)
                    blocks.append({'type': 'memo',
                                   'title': txt(h5.group(1)) if h5 else '',
                                   'items': [txt(x) for x in re.findall(r'<li>(.*?)</li>', mm, re.S)]})
                else:
                    zu = m.group('zu')
                    k = re.search(r'<p class="zu-kind">(.*?)</p>', zu, re.S)
                    p = re.search(r'<pre>(.*?)</pre>', zu, re.S)
                    n = re.search(r'<p class="zu-note">(.*?)</p>', zu, re.S)
                    blocks.append({'type': 'fig',
                                   'kind': txt(k.group(1)) if k else '',
                                   'prompt': html.unescape(p.group(1)) if p else '',
                                   'note': txt(n.group(1)) if n else ''})
            figs.append({
                'caption': txt(cap.group(1)) if cap else '',
                'kind': txt(kind.group(1)) if kind else '',
                'prompt': html.unescape(pre.group(1)) if pre else '',
                'note': txt(note.group(1)) if note else '',
                'tables': [parse_table(t) for t in re.findall(r'<table class="data"[^>]*>(.*?)</table>', fig, re.S)],
                'srcs': [txt(x) for x in re.findall(r'<p class="src"[^>]*>(.*?)</p>', fig, re.S)],
                'blocks': blocks,
            })
        qs = []
        for q in re.findall(r'<div class="q">(.*?)</div>\s*(?=<div class="q">|<h2>|<!--|$)', b, re.S):
            head = re.search(r'<p class="q-head">(.*?)</p>', q, re.S)
            mark = re.search(r'<span class="mark">(\d+)</span>', q)
            ol = re.search(r'<ol class="choices">(.*?)</ol>', q, re.S)
            choices = [txt(x) for x in re.findall(r'<li>(.*?)</li>', ol.group(1), re.S)] if ol else []
            tables = [parse_table(t) for t in re.findall(r'<table class="data"[^>]*>(.*?)</table>', q, re.S)]
            #
            # ★設問文の続き（選択肢の前提になる文）を落とさない★
            #   もとは <div class="q-body"> だけを見ていたが、
            #   実際には設問文の続きが6種類の入れ物に散っていた（実測）。
            #     div.q-body   …  2件（K・L・M の文）
            #     div.memo     … 20件（K〜M の文、Ｘ・Ｙの選択肢の中身）
            #     div.dialogue …  2件（空欄を含む会話文）
            #     p.lead       …  1件（空欄を含む説明文）
            #     p.exam-meta  …  1件（単位換算の指示）
            #     ★クラスの無い <p>（<p style="margin:8px 0"> など）… 11件★
            #   これらを見落とすと「Ｋ〜Ｍの正誤の組合せを選べ」と言われても
            #   Ｋ・Ｌ・Ｍ が何の文なのか画面に出ず、★設問が解けなくなる★。
            #
            # ★クラスの無い <p> こそが「空欄を含む文そのもの」だった★
            #   例（kai2 問5）：
            #     <p class="q-head">問5 … 空欄Ｙ・Ｚに入る語句の組合せ…</p>
            #     <p style="margin:8px 0">1970〜75年には都心3区の人口が
            #       減少する一方、…Ｙが進んでいた…2005年以降は…Ｚと
            #       呼ばれる現象が生じている。</p>
            #   この2つ目の <p> は class を持っていないため、
            #   クラス名で拾う書き方では取りこぼしていた。
            #   Ｙ・Ｚ が入る文が画面に出なければ、何を選ぶのか分からない。
            #   → 「設問の中に直接置かれた <p>」は種類を問わず全部拾う。
            #     ただし class="exp"（＝解説側の講評「想定正答率の平均は…」）
            #     だけは設問文ではないので除く。
            #
            #   → 資料（figures）と同じように、出現順のブロック列にして全部持つ。
            #     並び順が意味を持つ（説明 → 空欄の選択肢 → 選択肢）ので、
            #     種類ごとにまとめず、出てきた順のまま残す。
            after = q.split('</p>', 1)[1] if head else q
            #   入れ子の div / table の中の <p> を二重に拾わないよう、
            #   先に「直下の <p> だけが残る」状態を作ってから位置を数える。
            nested = set()
            for nm in re.finditer(
                    r'<div class="(?:memo|dialogue|q-body|choices)"[^>]*>.*?</div>'
                    r'|<table.*?</table>|<ol.*?</ol>', after, re.S):
                nested.update(range(nm.start(), nm.end()))
            qblocks = []
            for bm in re.finditer(
                    r'<div class="(memo|dialogue|q-body)"[^>]*>(.*?)</div>'
                    r'|<p([^>]*)>(.*?)</p>', after, re.S):
                if bm.group(1):
                    kind, inner = bm.group(1), bm.group(2)
                    if kind == 'memo':
                        items = [txt(x) for x in re.findall(r'<li>(.*?)</li>', inner, re.S)]
                        qblocks.append({'type': 'memo', 'items': [x for x in items if x]})
                    else:
                        lines = [txt(x) for x in re.findall(r'<p[^>]*>(.*?)</p>', inner, re.S)]
                        qblocks.append({'type': kind, 'lines': [x for x in lines if x]})
                    continue
                # ここから「設問の中に直接置かれた <p>」
                if bm.start() in nested:
                    continue                     # 入れ子の中身は上で拾い済み
                attr = bm.group(3) or ''
                if 'class="exp"' in attr:
                    continue                     # 解説側の講評（設問文ではない）
                line = txt(bm.group(4))
                if not line:
                    continue
                cls = re.search(r'class="([\w-]+)"', attr)
                qblocks.append({'type': cls.group(1) if cls else 'para', 'lines': [line]})
            qs.append({
                'head': txt(head.group(1)) if head else '',
                'mark': int(mark.group(1)) if mark else None,
                'blocks': qblocks,
                'choices': choices,
                'tables': tables,
            })
        file_obj['sections'].append({'h2': sec['h2'], 'lead': lead, 'dialogue': dial, 'figures': figs, 'questions': qs})
    # --- 解答表
    # 解答表の列は「大問 / 問 / 解答番号 / 正解 / 配点 / 想定正答率」。
    #
    # ★配点は読まない★
    #   ユーザーの指示は「配点は表記しない」。ここで拾ってしまうと
    #   後段の変換スクリプトがうっかり画面に出せる状態になるので、
    #   そもそも JSON に入れない（＝出しようがない）ようにしている。
    #
    # ★想定正答率は拾う★
    #   アプリ側の subQuestion.correctAnswerRate に入れる値で、
    #   他科目でも表示している「正答率○%」と同じ意味。
    #   これは配点ではないので表記して問題ない。
    ans = {}
    rates = {}
    at = re.search(r'<table class="ans-table">(.*?)</table>', apart, re.S)
    for row in parse_table(at.group(1)):
        vals = [c['v'] for c in row]
        nums = [v for v in vals if re.fullmatch(r'\d+', v)]
        cor = [v for v in vals if re.fullmatch(r'[①-⑧]', v)]
        pct = [v for v in vals if re.fullmatch(r'\d+%', v)]
        if nums and cor:
            no = int(nums[0])
            ans[no] = cor[0]
            if pct:
                rates[no] = int(pct[0].rstrip('%'))
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
    #
    # ★解説の中の計算表を捨てない★
    #   解説には「変化量を計算した表」「1人当たりを計算した表」など、
    #   答えの根拠そのものである表が 9 件ある（kai1 問5・kai5 問4 など）。
    #   最初はこれを '[表]' の3文字に置き換えていたので、
    #   解説を読んでも「どの数値からその結論が出たのか」が分からなかった。
    #   → 出現順に [[表1]] [[表2]] という目印だけを本文に残し、
    #     表そのものは tables に取っておく。
    #     後段（build.py）が目印を Markdown の表に置き換える。
    exps = {}
    exp_tables = {}
    order = []

    def cut_tables(chunk):
        """本文から表を抜き出し、[[表n]] の目印に置き換える。"""
        rows_list = []

        def repl(m):
            rows_list.append(parse_table(m.group(0)))
            return f'\n[[表{len(rows_list)}]]\n'

        body = txt(re.sub(r'<table.*?</table>', repl, chunk, flags=re.S))[:4000]
        return body, rows_list

    # ★h2 も見出しとして数える★
    #   kai1〜kai6 は大問の区切りを <h2>第1問の解説</h2> で書いており、
    #   h3・h4 だけを見ていると「第1問の問4」と「第2問の問4」が
    #   同じ "問4　正解 ②" という鍵になって 1 つのキーに混ざる
    #   （実際 kai1 では n=2 の配列になっていた）。
    #   h2 まで見れば直前の大問が分かるので、鍵が衝突しなくなる。
    heading = re.compile(r'<h([234])>(.*?)</h\1>', re.S)
    marks = [(m.start(), m.end(), m.group(1), txt(m.group(2))) for m in heading.finditer(apart)]
    cur_dai = ''
    for idx, (st, en, level, title) in enumerate(marks):
        nxt = marks[idx + 1][0] if idx + 1 < len(marks) else len(apart)
        body, body_tables = cut_tables(apart[en:nxt])
        is_q = re.match(r'問\s*\d+', title) is not None
        if not is_q:
            # 設問でない見出し（大問名・総括）は、以降の設問の所属として覚える
            if re.match(r'第\s*\d+\s*問', title):
                cur_dai = title
        key = f'{cur_dai} / {title}' if (is_q and cur_dai) else title
        exps.setdefault(key, []).append(body)
        exp_tables.setdefault(key, []).append(body_tables)
        order.append({'level': int(level), 'dai': cur_dai if is_q else '', 'title': title, 'isQuestion': is_q})
    file_obj['answers'] = ans
    file_obj['rates'] = rates
    file_obj['explanations'] = {k: v for k, v in exps.items()}
    file_obj['explanationTables'] = exp_tables
    file_obj['explanationOrder'] = order
    out[f] = file_obj

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'raw.json')
json.dump(out, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for f in FILES:
    o = out[f]
    qexp = sum(1 for x in o['explanationOrder'] if x['isQuestion'])
    dup = [k for k, v in o['explanations'].items() if len(v) > 1]
    print(f, '|', len(o['sections']), 'sections |', sum(len(s['questions']) for s in o['sections']), 'q |',
          len(o['answers']), 'ans |', len(o['rates']), 'rate |', qexp, '設問解説 /',
          len(o['explanationOrder']), '見出し |', len(dup), '鍵の衝突')
    blocks = [bl['type'] for s in o['sections'] for fg in s['figures'] for bl in fg['blocks']]
    import collections as _c
    print('     blocks:', dict(_c.Counter(blocks)))
    for s in o['sections']:
        print('   ', s['h2'], '| figs', len(s['figures']), '| q', len(s['questions']), '| marks', [q['mark'] for q in s['questions']])

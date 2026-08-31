# -*- coding: utf-8 -*-
"""
地理探究の raw.json から src/data/geographyExamProblems.ts を生成する。

======================================================================
■ このスクリプトが解いている問題
======================================================================
元データ（kai1〜kai6・yosou の HTML）は「紙の模試」の体裁で書かれている。
アプリの演習画面は「1つの大問（problem）＋ その中の設問（subQuestions）」
という形しか受け取れないので、その形へ翻訳する必要がある。

  紙                          アプリ
  ---------------------      -----------------------------------
  第1回の第1問              problem 1 つ（practiceProblems[0]）
  　リード文＋会話文＋資料    problem.text（Markdown）
  　問1〜問6                 subQuestions（6件）
  第1回の第2問              problem もう 1 つ
  第1回の第3問              problem もう 1 つ

★1回 = 3つの大問 = 1つの単元（chapter）★
共通テストの地理は第1問〜第3問で1セットなので、
「第1回」という単元の中に大問3つを入れる。

======================================================================
■ ★配点は一切出さない★
======================================================================
ユーザーの明示的な指示：「配点は表記しない」

紙の元データには配点が2か所に書かれている。
  (1) 大問の見出し　… 「第1問　気候・河川流出と自然災害の地域性（配点34点）」
  (2) 解答表の配点列 … 「6点」「7点」など

このスクリプトでは
  (1) を strip_points() で見出しから削り、
  (2) は parse.py の段階でそもそも JSON に入れていない
という二重の対策をとっている。
「消し忘れ」を防ぐため、最後に出力文字列全体を検査して
「配点」という語が残っていたら異常終了する（assert_no_points）。

======================================================================
■ ★図は画像を作らない★
======================================================================
元データの図は 2 種類ある。

  (a) <table class="data"> … 数値そのものが表として書かれている（46件）
      → Markdown の表に変換すれば、画像なしで完全に再現できる。
        アプリは ExplanationBody が Markdown 表を本物の <table> に
        変換するので、そのまま読める。

  (b) <pre> の英語プロンプトだけ … 地図・グラフの「描き方」の指示（20件）
      → 画像生成はしない（クレジットを使わないという方針）。
        代わりにプロンプト本文に書かれている★数値と位置の情報★を
        日本語の箇条書きに起こして「文章で読める資料」にする。
        例）折れ線グラフ3系列 →
            「P：240, 250, 191, …（1月〜12月）」という数値列の表。
        設問はこの数値の大小関係で解かれるので、
        グラフの絵がなくても設問は成立する
        （元データの注記にも「上の数値列を必ずそのまま再現してください
          （問2・問3がこの値の大小関係で解かれるため）」とある）。

======================================================================
■ 使い方
======================================================================
    python3 scripts/geo/parse.py    # HTML → raw.json
    python3 scripts/geo/build.py    # raw.json → src/data/geographyExamProblems.ts
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = os.path.join(ROOT, 'scripts', 'geo', 'raw.json')
OUT = os.path.join(ROOT, 'src', 'data', 'geographyExamProblems.ts')

# 回の識別子と、単元の見出しに使う名前
ROUNDS = [
    ('kai1', 'r1', '第1回', '標準'),
    ('kai2', 'r2', '第2回', 'やや易'),
    ('kai3', 'r3', '第3回', '難'),
    ('kai4', 'r4', '第4回', '標準'),
    ('kai5', 'r5', '第5回', 'やや難'),
    ('kai6', 'r6', '第6回', '難・因果推論型'),
    ('yosou', 'yo', '予想問題', '出題予想分析つき'),
]

CIRCLED = '①②③④⑤⑥⑦⑧⑨'


def strip_points(text: str) -> str:
    """見出しから「（配点34点）」を削る。★配点は表記しない★という指示のため。"""
    return re.sub(r'\s*[（(]\s*配点\s*\d+\s*点?\s*[）)]', '', text).strip()


def esc(text: str) -> str:
    """TypeScript のテンプレートリテラルに安全に埋め込める形にする。"""
    return text.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')


# =====================================================================
# 表を Markdown に変換する
# =====================================================================
#
# ★2段ヘッダを1行に畳む★
#   元の HTML には
#       ┌──┬──────┬──────┐
#       │地点│  1月    │  4月    │   ← rowspan / colspan つき
#       │    │気温│降水│気温│降水│
#   のような2段ヘッダがある（188セルが rowspan・colspan・改行つき）。
#   Markdown の表は「ヘッダ1行」しか表せないので、
#   rowspan / colspan をいったんマス目に展開したうえで、
#   ヘッダ行を縦に連結して「1月 気温℃」という1行にする。
#   こうすると列と数値の対応が崩れない。


def expand_grid(rows):
    """rowspan / colspan を実際のマス目に展開する。"""
    grid = []          # grid[r][c] = セルの文字列
    kinds = []         # kinds[r][c] = 'th' / 'td'
    for r, row in enumerate(rows):
        while len(grid) <= r:
            grid.append({})
            kinds.append({})
        col = 0
        for cell in row:
            # すでに上の行の rowspan で埋まっているマスは飛ばす
            while col in grid[r]:
                col += 1
            for dr in range(cell['rs']):
                for dc in range(cell['cs']):
                    while len(grid) <= r + dr:
                        grid.append({})
                        kinds.append({})
                    grid[r + dr][col + dc] = cell['v']
                    kinds[r + dr][col + dc] = cell['t']
            col += cell['cs']
    width = max((max(g) + 1) for g in grid if g) if any(grid) else 0
    out, out_kind = [], []
    for r in range(len(grid)):
        if not grid[r]:
            continue
        out.append([grid[r].get(c, '') for c in range(width)])
        out_kind.append([kinds[r].get(c, 'td') for c in range(width)])
    return out, out_kind


def to_markdown_table(rows) -> str:
    """parse.py が出した表を Markdown の表にする。"""
    grid, kinds = expand_grid(rows)
    if not grid:
        return ''
    # 先頭から連続する「すべて th の行」をヘッダとみなす
    head_n = 0
    for r in range(len(grid)):
        if all(k == 'th' for k in kinds[r]):
            head_n = r + 1
        else:
            break
    if head_n == 0:
        head_n = 1  # th が無い表（選択肢表など）は1行目を見出し扱いにする

    def cellify(v: str) -> str:
        # セル内改行は Markdown の表に置けないので全角スペースでつなぐ。
        # Markdown の区切り文字である | は全角に逃がす（列が壊れるのを防ぐ）。
        return re.sub(r'\s*\n\s*', '　', v).replace('|', '｜').strip()

    header = []
    for c in range(len(grid[0])):
        # 縦に並ぶヘッダを連結（同じ語の繰り返しは1回だけにする）
        parts = []
        for r in range(head_n):
            v = cellify(grid[r][c])
            if v and (not parts or parts[-1] != v):
                parts.append(v)
        header.append('　'.join(parts))

    body = [[cellify(v) for v in grid[r]] for r in range(head_n, len(grid))]

    # 数値の列は右寄せにすると読みやすい（見出し列は左寄せ）
    align = []
    for c in range(len(header)):
        col = [body[r][c] for r in range(len(body))]
        numeric = col and all(re.fullmatch(r'[−+±\-＋0-9,.\s%％]*', v or '') and v for v in col)
        align.append('---:' if numeric else ':---')

    lines = ['| ' + ' | '.join(header) + ' |', '|' + '|'.join(align) + '|']
    for row in body:
        lines.append('| ' + ' | '.join(row) + ' |')
    return '\n'.join(lines)


# =====================================================================
# 図（画像を作らない図）を「読める資料」にする
# =====================================================================
#
# ★なぜ画像を作らないのか★
#   画像生成はクレジットを使うので使わない、という方針。
#   代わりに、元データの <pre> に書かれている★数値★を文章と表に起こす。
#   元データ自身の注記にも
#     「上の数値列を必ずそのまま再現してください
#       （問2・問3がこの値の大小関係で解かれるため、
#         形だけ似せた図では設問が成立しません）」
#   と書かれている。つまり設問が要求しているのは「絵」ではなく「数値」なので、
#   数値を正しく渡せれば設問は完全に成立する。
#
# ★2種類に分けて扱う★
#   (a) 数値系列を持つ図（折れ線・棒・散布図）
#       → プロンプトの数値行を機械的に拾って表にする。read_series()
#   (b) 位置関係だけの図（模式地図・地形断面図・人口ピラミッド）
#       → 数値が無いので機械変換できない。
#         figures.json に日本語の説明を手で書き、それを差し込む。
#         （プロンプトは英語の作図指示なので、そのまま生徒に見せられない）
#
# ★英語の作図指示をそのまま出さない★
#   "A plain black-and-white schematic world map for a Japanese university
#    entrance examination booklet." のような指示文が生徒に見えると
#   問題として成立しないので、プロンプト本文は絶対に出力しない。

# 数値系列の行を拾う正規表現。
#   例1  「  P - solid line, filled circle markers:」の次行
#          「      240, 250, 191, 105, 55, 32, 16, 10, 9, 36, 98, 181」
#   例2  「  中国 - solid line, filled circle markers:  620, 1100, 4200, 7600」
#   例3  「  1980 = 100, 1990 = 135, 2000 = 190, 2010 = 200, 2020 = 235」
#   例4  「  0時=32, 3時=27, 6時=31, ...」
NUM = r'[−+±\-＋]?\d[\d,]*(?:\.\d+)?'
SERIES_LINE = re.compile(rf'^\s*(?:.*?[:：])?\s*((?:{NUM}\s*,\s*){{3,}}{NUM})\s*$')
PAIR_LINE = re.compile(rf'^\s*(?:.*?[:：])?\s*((?:\S+\s*[=＝]\s*{NUM}\s*,\s*){{3,}}\S+\s*[=＝]\s*{NUM})\s*$')
# 系列名の行。実データには4つの書き方が混在している（全部拾わないと
# 「どの線がどの系列か」が分からず、表にしても設問が解けない）。
#
#   (1) 「P - solid line, filled circle markers:」        … 記号だけの名前
#   (2) 「Series 1 「電力需要」 — THICK SOLID line…」      … 鉤括弧つき
#   (3) 「Series A "世界平均" — SOLID black line…」        … 引用符つき
#   (4) 「SERIES 1 — ダム建設前（1930年代）: SOLID thick…」 … ダッシュの後ろが名前
#
# (2)(3) は名前が括弧に囲まれているので確実に取れる。
# (4) は「ダッシュ → 名前 → コロン」の形なので、コロンまでを名前とみなす。
# (1) は「短い語 → ダッシュ → 英語の線種」の形で見分ける。
LABEL_QUOTED = re.compile(r'^\s*(?:SERIES|Series|series)\s+\S+\s*[「『"“]([^」』"”]+)[」』"”]')
LABEL_DASHED = re.compile(r'^\s*(?:SERIES|Series|series)\s+\S+\s*[-–—]\s*([^:：]{1,40}?)\s*[:：]')
LABEL_PLAIN = re.compile(r'^\s*[-・]?\s*([^\s\-–—:：]{1,12})\s*[-–—]\s*(?:thick |thin |fine |long-|dash|dott|solid|open|filled|bold)')


def read_label(line: str) -> str:
    """1行から系列名を読む。読めなければ空文字。"""
    for pat in (LABEL_QUOTED, LABEL_DASHED, LABEL_PLAIN):
        m = pat.match(line)
        if m:
            name = m.group(1).strip()
            # 「SERIES 1 — SOLID thick black line」のように、ダッシュの後ろが
            # 名前ではなく線種の説明だった場合は名前として採用しない。
            if re.match(r'(?i)^(thick|thin|fine|long|short|solid|dash|dott|open|filled|bold|vertical)\b', name):
                return ''
            return name
    return ''


def split_top_level(text: str, want_pairs: bool):
    """
    カンマ区切りの列を分ける。

    ★桁区切りのカンマを列の区切りと誤読しない★
      「1980 = 1,830, 1990 = 1,760, ...」を素朴に ',' で split すると
      「1980 = 1」「830」「1990 = 1」「760」…に割れて、
      1,830万人が 1万人になってしまう（実際にこの壊れ方をした）。
      桁区切りは「カンマの直後が3桁の数字で、そこで数値が終わる」形なので、
      ・want_pairs（= を含む形）なら「= を含む塊」単位で切る
      ・値だけの形なら「カンマの直後が3桁＋数値の続きが無い」ものは
        桁区切りとみなして繋げる
      という判定で分ける。
    """
    if want_pairs:
        # 「キー = 値」の並び。次の「=」の手前にある最後のカンマで切る。
        return [c for c in re.split(r',(?=[^,=]*[=＝])', text) if c.strip()]
    # 値だけの並び。桁区切り（,の後ろがちょうど3桁で、その後に数字が続かない）は繋ぐ。
    return [c for c in re.split(r',(?!\d{3}(?:\D|$))', text) if c.strip()]


def read_series(prompt: str):
    """
    プロンプトから数値系列を拾う。

    戻り値は [(系列名, [値, ...]), ...]。
    系列名が読み取れない場合は空文字を返し、呼び出し側が
    「系列1」などの仮名を当てる。
    """
    out = []
    pending_label = ''
    for raw in prompt.split('\n'):
        line = raw.rstrip()
        # 「ラベル = 値」が並ぶ行（例：1980 = 100, 1990 = 135, ...）
        mp = PAIR_LINE.match(line)
        if mp:
            head = line[: line.rfind(mp.group(1))]
            pending_label = read_label(head) or pending_label
            pairs = []
            for chunk in split_top_level(mp.group(1), True):
                k, _, v = chunk.partition('=') if '=' in chunk else chunk.partition('＝')
                pairs.append((k.strip(), v.strip()))
            out.append((pending_label, pairs))
            pending_label = ''
            continue
        # 値だけが並ぶ行（例：240, 250, 191, ...）
        ms = SERIES_LINE.match(line)
        if ms:
            # 同じ行の「:」の前にラベルが書かれている場合はそれを使う
            head = line[: line.rfind(ms.group(1))]
            label = read_label(head) or pending_label
            vals = [v.strip() for v in split_top_level(ms.group(1), False)]
            out.append((label, [('', v) for v in vals]))
            pending_label = ''
            continue
        # 値を伴わないラベル行は、次の数値行のラベルとして覚える
        name = read_label(line)
        if name:
            pending_label = name
    return out


def series_to_markdown(series, axis_hint: str) -> str:
    """
    read_series() の結果を Markdown の表にする。

    ★横軸のラベルをどう決めるか★
      ・「1980 = 100」形式ならキーがそのまま横軸になる。
      ・値だけの並びのときは、個数から横軸を推測する。
        12個 → 1月〜12月（月別グラフ）
        それ以外は axis_hint（図の見出しから拾った年など）を使い、
        それも無ければ 1,2,3… の通し番号にする。
        ★推測できないときに勝手な年号を書かない★ ことが大事で、
        嘘の軸を書くと設問の読み取りが変わってしまう。
    """
    if not series:
        return ''
    rows = []
    for idx, (name, pairs) in enumerate(series):
        label = name or f'系列{idx + 1}'
        keys = [k for k, _ in pairs]
        vals = [v for _, v in pairs]
        rows.append((label, keys, vals))

    # 横軸の見出しを決める
    first_keys = rows[0][1]
    if all(k for k in first_keys):
        axis = first_keys
    elif len(first_keys) == 12:
        axis = [f'{i}月' for i in range(1, 13)]
    elif axis_hint:
        axis = axis_hint.split(',') if len(axis_hint.split(',')) == len(first_keys) else []
    else:
        axis = []
    if not axis or len(axis) != len(first_keys):
        axis = [str(i + 1) for i in range(len(first_keys))]

    lines = ['| 系列 | ' + ' | '.join(axis) + ' |',
             '|:---|' + '|'.join(['---:'] * len(axis)) + '|']
    for label, keys, vals in rows:
        # 系列ごとに個数が違う場合（測定点が違う図）は、キーを併記して崩れを防ぐ
        if len(vals) == len(axis) and (not all(keys) or keys == axis):
            lines.append(f'| {label} | ' + ' | '.join(vals) + ' |')
        else:
            pairs = '／'.join(f'{k}＝{v}' if k else v for k, v in zip(keys, vals))
            lines.append(f'| {label} | ' + pairs + ' |' + ' |' * (len(axis) - 1))
    return '\n'.join(lines)


# =====================================================================
# 図（1つの資料）を Markdown に起こす
# =====================================================================
#
# ★手書きの日本語説明を使う場所★
#   figures.json に、位置関係だけの図（模式地図・断面図・人口ピラミッドなど）
#   24件ぶんの日本語説明を手で書いてある。鍵は
#     'ファイル/大問の番号/図の番号/ブロックの番号'
#   で raw.json の blocks の位置を直接指す。
#   数値系列が読めた図はその表を出し、読めなかった図だけ説明を使う。
FIGS = os.path.join(ROOT, 'scripts', 'geo', 'figures.json')


def load_hand_figures():
    data = json.load(open(FIGS, encoding='utf-8'))
    return {k: v for k, v in data.items() if not k.startswith('_')}


HAND = load_hand_figures()
HAND_USED = set()


def axis_hint_of(prompt: str) -> str:
    """
    プロンプトの X 軸の記述から横軸の目盛を拾う。

    例）「X axis: six ticks labelled 1965 / 1980 / 1995 / 2005 / 2015 / 2022,」
        →「1965,1980,1995,2005,2015,2022」
        「X axis: four year ticks, 1990 / 2000 / 2010 / 2020, evenly spaced.」
        →「1990,2000,2010,2020」
    ★読めないときは空文字を返す★ 勝手な軸を作ると設問の読み取りが変わる。
    """
    for line in prompt.split('\n'):
        if not re.search(r'(?i)\bX\s*axis\b', line):
            continue
        # 「1990 / 2000 / 2010 / 2020」のようにスラッシュ区切りで並ぶ形
        m = re.search(r'((?:\d[\d,]*\s*/\s*){2,}\d[\d,]*)', line)
        if m:
            return ','.join(x.strip() for x in m.group(1).split('/'))
        # 「2011, 2012, 2013, …」のようにカンマ区切りで並ぶ形
        m = re.search(r'((?:\d{4}\s*,\s*){3,}\d{4})', line)
        if m:
            return ','.join(x.strip() for x in m.group(1).split(','))
    return ''


def render_figure(file_key: str, sec_i: int, fig_i: int, fig) -> str:
    """
    1つの資料（figure）を Markdown に起こす。

    ★元データの並び順を崩さない★
      figure の中は「［上段］表 → ［下段］グラフ → 注記」のように
      部品が順番に並んでいる。blocks はその出現順なので、
      そのまま上から出せば、見出しと表の対応が崩れない。
    """
    out = []
    if fig['caption']:
        out.append('**' + strip_points(fig['caption']) + '**')
    for bi, bl in enumerate(fig['blocks']):
        kind = bl['type']
        if kind == 'label':
            out.append('**' + bl['text'] + '**')
        elif kind == 'note':
            out.append('（注）' + bl['text'])
        elif kind == 'table':
            md = to_markdown_table(bl['rows'])
            if md:
                out.append(md)
        elif kind == 'memo':
            if bl['title']:
                out.append('**' + bl['title'] + '**')
            out.extend('- ' + item for item in bl['items'] if item)
        else:  # fig
            series = read_series(bl['prompt'])
            if series:
                md = series_to_markdown(series, axis_hint_of(bl['prompt']))
                if md:
                    out.append(md)
            else:
                # ★英語の作図指示は絶対に出さない★
                #   生徒に "A plain black-and-white schematic map..." が見えたら
                #   問題として成立しないので、手書きの日本語説明に差し替える。
                key = f'{file_key}/{sec_i}/{fig_i}/{bi}'
                hand = HAND.get(key)
                if hand is None:
                    raise SystemExit(f'figures.json に説明がありません: {key}')
                HAND_USED.add(key)
                out.extend(hand['lines'])
    return '\n\n'.join(x for x in out if x)


# =====================================================================
# 選択肢を「本文そのまま」の配列にする
# =====================================================================
#
# ★なぜ記号（①〜⑧）ではなく本文を options に入れるのか★
#   既存の geographyQ1Problems.ts と同じ方針。
#   記号だけを並べたボタンは、押す前に何を選んでいるのか分からない。
#   本文をそのまま入れれば、ボタンを見ただけで内容が読める。
#
# ★元データの選択肢は2つの書き方がある（全数計測済み）★
#   (1) <ol class="choices"> …… 65件（4択53・6択9・8択3）
#       各 li が「①　……」という本文なので、記号を外して使う。
#   (2) <table class="data"> …… 47件（組合せ選択肢）
#       表の向きが2通りある。
#         通常 45件：1列目が①〜⑧（行＝選択肢）
#         転置  2件：1行目が①〜⑧（列＝選択肢、行＝K/L/M など）
#       どちらも「A＝ア、B＝イ、…」という1文に畳んで options に入れる。


def strip_circle(text: str) -> str:
    """選択肢の本文から先頭の「①　」を外す。"""
    return re.sub(rf'^[{CIRCLED}]\s*', '', text).strip()


def choices_from_table(rows):
    """
    組合せ選択肢の表を「①→本文」の対応に畳む。

    戻り値は [(記号, 本文), ...]。向きが判定できないときは空リスト。
    """
    grid, _ = expand_grid(rows)
    if len(grid) < 2 or len(grid[0]) < 2:
        return []

    def cell(v):
        return re.sub(r'\s*\n\s*', ' ', v or '').strip()

    col0 = [cell(r[0]) for r in grid[1:]]           # 1列目（見出しを除く）
    row0 = [cell(c) for c in grid[0][1:]]           # 1行目（見出しを除く）

    def is_marks(vals):
        return bool(vals) and all(v and v[0] in CIRCLED for v in vals)

    out = []
    if is_marks(col0):
        # 通常型：行が選択肢。見出し行が項目名（A / B / C …）。
        heads = [cell(v) for v in grid[0][1:]]
        for r in grid[1:]:
            mark = cell(r[0])[0]
            parts = []
            for h, v in zip(heads, [cell(x) for x in r[1:]]):
                if not v:
                    continue
                parts.append(f'{h}＝{v}' if h else v)
            out.append((mark, '　'.join(parts)))
    elif is_marks(row0):
        # 転置型：列が選択肢。1列目が項目名（K / L / M）。
        names = [cell(r[0]) for r in grid[1:]]
        for ci, head in enumerate(row0, start=1):
            mark = head[0]
            parts = []
            for name, r in zip(names, grid[1:]):
                v = cell(r[ci]) if ci < len(r) else ''
                if not v:
                    continue
                parts.append(f'{name}＝{v}' if name else v)
            out.append((mark, '　'.join(parts)))
    return out


def build_choices(question):
    """
    設問から (options, mark_to_option) を作る。

    mark_to_option は「①」→ options の文字列。正解の変換に使う。
    """
    pairs = []
    if question['choices']:
        for text in question['choices']:
            m = re.match(rf'^([{CIRCLED}])', text)
            pairs.append((m.group(1) if m else '', strip_circle(text)))
    else:
        for table in question['tables']:
            pairs = choices_from_table(table)
            if pairs:
                break
    options = [body for _, body in pairs if body]
    marks = {mark: body for mark, body in pairs if mark and body}
    return options, marks


# =====================================================================
# 解説を「思考手順（steps）」と「詳しい解説の本文」に分ける
# =====================================================================
#
# ★なぜ2つに分けるのか★
#   画面には解説の置き場所が2つある。
#     (1) detailedExplanation.steps
#         → Explanation.tsx が <ol> の1行ずつに描く。
#           1行 = 1つの手順なので、ここに表を入れても展開されない。
#     (2) problem.explanation の小問スライス
#         → ExplanationBody が Markdown として描く。表が本物の表になる。
#   元データの解説は「文章 ＋ 計算表」が混ざった1本の塊なので、
#   文章の段落を steps に、表を含む全文を (2) に置く。
#   ★同じ内容を2か所に置くのは重複ではなく役割分担★
#   （steps は「解く筋道の要約」、(2) は「根拠の数値まで載せた全文」）。

# 元データの解説末尾には回の移動リンクの文字が混ざっている（15件）。
# 「◀ 第1回」「第3回（難）▶」「目次へ」など。問題の中身ではないので落とす。
NAV_LINE = re.compile(r'^\s*(◀|▶|目次)|(◀|▶)\s*$|^\s*目次へ\s*▶?\s*$')


def drop_nav(lines):
    """回の移動リンク（◀ 第1回 / 目次へ ▶ など）を落とす。"""
    return [ln for ln in lines if ln.strip() and not NAV_LINE.search(ln.strip())]


def render_explanation_tables(body: str, tables) -> str:
    """
    解説本文の [[表1]] を Markdown の表に置き換える。

    parse.py が「表を捨てずに目印だけ残す」形にしてあるので、
    ここで本物の表に戻す。★この表が答えの根拠そのもの★なので
    落とすと「どの数値からその結論が出たのか」が読めなくなる。
    """
    def repl(m):
        i = int(m.group(1)) - 1
        if 0 <= i < len(tables):
            md = to_markdown_table(tables[i])
            if md:
                return '\n' + md + '\n'
        return ''
    return re.sub(r'\[\[表(\d+)\]\]', repl, body)


def steps_of(body: str):
    """
    解説本文を steps[]（思考手順の1行ずつ）に分解する。

    元データの解説は空行区切りの段落で、多くの段落が「・」で始まる。
    ★表の目印を含む段落は steps に入れない★
      steps は <li> の1行なので Markdown 表が展開されず、
      「[[表1]]」や崩れた表がそのまま見えてしまう。
      表は problem.explanation 側（Markdown が効く場所）に載せる。
    """
    out = []
    for para in re.split(r'\n\s*\n', body):
        para = para.strip()
        if not para or '[[表' in para:
            continue
        lines = drop_nav(para.split('\n'))
        if not lines:
            continue
        text = ' '.join(x.strip() for x in lines)
        text = re.sub(r'^・\s*', '', text).strip()
        if text:
            out.append(text)
    return out


def theme_of(head: str) -> str:
    """
    設問見出しから detailedExplanation.theme（主題の短い言葉）を作る。

    見出しは
      「問1　資料1のA〜Dと、資料2のア〜エとの組合せとして
        最も適当なものを、次の①〜⑥のうちから一つ選べ。1」
    のように「問N　」＋設問文＋末尾の解答番号でできている。
    そこから「何を答えるのか」だけを短く残す。
    """
    text = re.sub(r'^問\s*\d+[\s\u3000]*', '', head).strip()
    text = re.sub(r'\d+$', '', text).strip()       # 末尾の解答番号
    # 「、次の①〜⑥のうちから一つ選べ。」という定型の末尾を落とす
    text = re.sub(
        r'[、]?\s*(?:次|後)の[' + CIRCLED + r']\s*[〜～]\s*[' + CIRCLED
        + r']\s*のうちから\s*一つ選べ。?\s*$', '', text).strip()
    # 「〜として最も適当なものを」「〜ものを」を落とす。
    #
    # ★★「正しい」だけを手がかりに切ってはいけない★★
    #   以前は re.split(r'(?:最も適当|適当でない|正しい|誤って)') と
    #   書いていたため、設問文の途中にある
    #     「…文ｐ・ｑのうち★正しいもの★との組合せとして最も適当なものを…」
    #   の「正しい」で切ってしまい、肝心の「との組合せ」が捨てられて
    #   見出しが「…文ｐ・ｑのうち」で終わっていた。
    #   これでは何を答える設問なのか画面から読み取れない。
    #
    #   落としたいのは★設問の定型の末尾★＝
    #     「〜（として）最も適当なものを」「〜として正しいものを」…
    #   だけなので、★末尾に固定（$）した正規表現で削る★方式にする。
    #   「ものを／ものは／もの」まで含めて末尾から一気に落とすことで、
    #   文中の「正しいもの」は削られない（末尾ではないため）。
    #   ★「適当なものを」の『な』を忘れると1文字も落ちない★
    #     「最も適当」の直後には送りの「な」が入る（最も適当★な★ものを）。
    #     これを勘定に入れないと末尾がまったく削れず、見出しが
    #     「…組合せとして最も適当なものを」と定型のまま長くなってしまう。
    TAIL = (
        r'(?:、|，)?\s*(?:として|に|で)?\s*'
        r'(?:最も適当|適当でない|最も適切|適切でない|正しい|誤って(?:いる)?)'
        r'\s*(?:な|の)?\s*(?:もの|こと|組合せ)?\s*(?:を|は|には)?\s*[、。]?\s*$'
    )
    for _ in range(3):
        cut = re.sub(TAIL, '', text).strip()
        if cut == text or not cut:
            break
        text = cut
    #   末尾の定型が落ちきらない古い形（「…として最も適当な組合せを」など）
    #   に備えて、★末尾に残った定型語だけ★をもう一度削る。
    text = re.sub(r'(?:として)?\s*(?:最も適当|適当でない|正しい|誤って(?:いる)?)\s*$', '', text).strip()
    text = re.sub(r'[、。]\s*$', '', text).strip()
    #   「〜のうち」で見出しが終わると「何のうち？」で終わってしまうので、
    #   ★末尾の『のうち』は落とす★（例：「文ｐ・ｑのうち」→「文ｐ・ｑ」）。
    while text.endswith('のうち'):
        text = text.removesuffix('のうち').strip('、。 ')
    #   ★見出しを助詞で終わらせない（ただし削るのは「を」「は」だけ）★
    #     「〜との組合せ★を★」のように目的格の助詞が残ると、
    #     文が途中で切れているように見える。
    #
    #     ★★『と』『の』『に』『で』を削ってはいけない★★
    #       これらは語の一部になりうる。実際に 'をはがのにでと' を
    #       まとめて削ったところ、「〜から読み取れる★こと★」の
    #       末尾の「と」が落ちて「〜読み取れるこ」になり、
    #       画面の「答えの核心」が意味不明になった（8件）。
    #       単独で助詞と断定できる「を」「は」だけを対象にする。
    while text and text[-1] in 'をは':
        text = text[:-1].strip('、。 ')
    if not text:
        text = re.sub(r'^問\s*\d+[\s\u3000]*', '', head).strip()
    if not text:
        return '資料の読み取り'
    # ★途中でぶつ切りにしない★
    #   見出しなので短くしたいが、「そのおおよそ」のように語の途中で切ると
    #   何を答える設問なのか分からなくなる。
    #
    # ★★前を捨てて「後ろの節」を残す★★
    #   最初は「上限より前の最後の読点で切る」＝前half を残していたが、
    #   実物の画面で確かめると
    #     「資料1のア〜エのうち」（＝答えの核心）
    #   のように、資料の指し先だけが残って何を答えるのか分からなかった。
    #   日本語の設問は
    #     ［資料の場所］、［条件］、★［何を答えるか］★
    #   の順で、答える対象がいちばん後ろに来る。
    #   そこで上限を超えるときは、★末尾に近い読点から後ろを残す★。
    LIMIT = 34
    if len(text) > LIMIT:
        # ★切るのは「読点の直後」だけにする★
        #   文字数で機械的に切ると「東京大都市圏」→「京大都市圏」のように
        #   語の頭が欠けて別の意味に読めてしまう（実際に起きた）。
        #   そこで、読点の直後（＝意味のまとまりの頭）だけを候補にし、
        #   上限に収まるいちばん前の候補を採る。
        starts = [m.end() for m in re.finditer(r'[、。]', text)]
        picked = next(
            (text[i:] for i in starts if 8 <= len(text) - i <= LIMIT),
            None,
        )
        #   候補が無い／頭が助詞で始まって読めない場合は、
        #   ★切らずに全文を残す★（長い見出しの方がまだ読める）。
        #   ★「その」「この」で始まる切り出しも禁止する★
        #     「資料1のア〜エの人口ピラミッドと、その形が示す社会的課題との
        #      組合せ」を後半だけ残すと「その形が示す〜」になり、
        #     ★「その」が何を指すのか見出しだけでは分からない★。
        #     指示語で始まるくらいなら全文を残した方が読める。
        NG_HEAD = ('の', 'を', 'に', 'が', 'は', 'と', 'で', 'も', 'や',
                   'その', 'この', 'これ', 'それ')
        if picked and not picked.startswith(NG_HEAD):
            text = picked
    # ★rstrip('として') と書いてはいけない★
    #   rstrip は「文字集合」なので、末尾の と／し／て を1文字ずつ削る。
    #   そのため「〜読み取れること」が「〜読み取れるこ」になっていた。
    #   落としたいのは語尾の「として」そのものなので removesuffix を使う。
    text = text.strip('、。 ')
    while text.endswith('として'):
        text = text.removesuffix('として').strip('、。 ')
    return text.strip('、。 ')


def difficulty_of(rate) -> int:
    """
    想定正答率から難易度（★の数）を決める。

    ★配点は使わない★（表記しない指示のため raw.json にも入っていない）。
    正答率が高い＝易しいので、素直に逆向きに割り当てる。
    """
    try:
        r = float(rate)
    except (TypeError, ValueError):
        return 3
    if r >= 70:
        return 1
    if r >= 60:
        return 2
    if r >= 50:
        return 3
    if r >= 40:
        return 4
    return 5


def answer_note(title: str) -> str:
    """
    解説見出しの「正解 ③（Ｋ 正　Ｌ 誤　Ｍ 正）」から括弧の中身だけを取る。

    正解そのものは answers から取るので、ここでは
    「どの記号がどれに対応するか」の補足だけを拾う。
    """
    m = re.search(r'正解\s*[' + CIRCLED + r']\s*[（(](.+?)[）)]\s*$', title)
    return m.group(1).strip() if m else ''


# =====================================================================
# 設問文（label）を組み立てる
# =====================================================================
#
# ★設問文の続きを必ず一緒に出す★
#   「次の文Ｋ〜Ｍの正誤の組合せを選べ」という設問は、
#   Ｋ・Ｌ・Ｍ が何の文なのかが書かれていなければ絶対に解けない。
#   元データではその文が memo / dialogue / q-body / lead / exam-meta の
#   5種類の入れ物に散っていて（26件）、出現順に意味がある
#   （説明 → 空欄の選択肢 → 選択肢）ので、順番を崩さずに並べる。


def build_label(question) -> str:
    """設問文を1本の Markdown にする（末尾の解答番号は落とす）。"""
    head = re.sub(r'\s*\d+\s*$', '', question['head']).strip()
    out = [strip_points(head)]
    for bl in question['blocks']:
        kind = bl['type']
        if kind == 'memo':
            out.extend('- ' + x for x in bl['items'])
        elif kind == 'dialogue':
            out.extend(bl['lines'])
        elif kind == 'exam-meta':
            out.extend('（注）' + x for x in bl['lines'])
        else:  # q-body / lead
            out.extend(bl['lines'])
    return '\n\n'.join(x for x in out if x)


# =====================================================================
# 大問の本文（problem.text）を組み立てる
# =====================================================================


def build_text(section, file_key: str, sec_i: int) -> str:
    """リード文 ＋ 会話文 ＋ 資料 を1本の Markdown にする。"""
    out = []
    out.extend(section['lead'])
    if section['dialogue']:
        out.append('**【会話文】**')
        out.extend(section['dialogue'])
    for fi, fig in enumerate(section['figures']):
        md = render_figure(file_key, sec_i, fi, fig)
        if md:
            out.append(md)
    return '\n\n'.join(x for x in out if x)


# =====================================================================
# 大問の解説（problem.explanation）を組み立てる
# =====================================================================
#
# ★HTML コメントの目印を必ず付ける★
#   採点画面は src/utils/explanationFormat.ts の
#     SQ_MARK      = '<!--sq:{小問id}-->'   … ここから下がその小問の解説
#     SQ_BODY_MARK = '<!--sqb-->'           … 見出しの終わり／本文の始まり
#     SQ_SHARED_MARK = '<!--sqall-->'       … 大問共通の解説の始まり
#   を目印にして解説を小問ごとに切り出している（sliceEnhancedBySubQuestion）。
#   目印が無いと切り出しが null になり、
#   ★アコーディオンを開いても解説が出てこない★
#   （既存教材でその不具合が起きていたと explanationFormat.ts 自身が書いている）。
SQ_MARK = '<!--sq:%s-->'
SQ_BODY_MARK = '<!--sqb-->'
SQ_SHARED_MARK = '<!--sqall-->'


def build_explanation(sq_parts, shared_lines) -> str:
    """
    小問ごとの解説を目印つきで1本に連結する。

    sq_parts     … [(小問id, 見出し, 本文Markdown), ...]
    shared_lines … 大問すべてに添える共通の解説（無ければ空リスト）
    """
    out = []
    if shared_lines:
        out.append(SQ_SHARED_MARK)
        out.extend(shared_lines)
    for sq_id, title, body in sq_parts:
        out.append(SQ_MARK % sq_id)
        out.append(title)
        out.append(SQ_BODY_MARK)
        out.append(body)
    return '\n\n'.join(x for x in out if x)


# =====================================================================
# ★出力に配点が残っていないか検査する★
# =====================================================================


def assert_no_points(text: str) -> None:
    """
    「配点」という語が1つでも残っていたら異常終了する。

    ★「N点」では検査しない★
      解説本文には「この3点を機械的に確認する」「この2点に線を引く」など
      日本語の「〜点」が6件あり、これは消してはいけない文章である。
      配点の書き方は必ず「（配点34点）」の形なので「配点」だけを見る。
    """
    hits = [m.start() for m in re.finditer('配点', text)]
    if hits:
        near = text[max(0, hits[0] - 40):hits[0] + 40]
        raise SystemExit(f'★配点が出力に残っています★ {len(hits)}件\n  …{near}…')


# =====================================================================
# 全体を組み立てて TypeScript を書き出す
# =====================================================================
#
# ★1回 = 3つの大問 = 1つの単元★
#   出力の形は既存の geographyQ1Problems.ts と同じ。
#     GEO_EXAM_PROBLEMS = { 'geo_exam_r1': [大問1, 大問2, 大問3], ... }
#   単元 id は既存（geo_q1_r1〜r5）と衝突しないように geo_exam_* にする。

HEADER = '''/**
 * ===================================================================
 * 地理探究 共通テスト形式 模擬問題（第1回〜第6回＋予想問題）
 * ===================================================================
 *
 * ★このファイルは自動生成★ 直接編集しないこと。
 *   もと    : scripts/geo/src/{kai1..kai6,yosou}.html
 *   作り方  : python3 scripts/geo/parse.py && python3 scripts/geo/build.py
 *
 * ■ 構成
 *   1回 = 第1問・第2問・第3問 の3大問 = 1つの単元（chapter）。
 *   1大問 = problem 1つ。設問（問1〜問6）が subQuestions。
 *   全7回 × 3大問 = 21大問 / 112設問。
 *
 * ■ ★配点は表記しない★
 *   もとの紙の資料には「（配点34点）」や配点列があるが、
 *   ユーザーの指示により一切出さない。
 *   生成時に「配点」という語が残っていないか検査している
 *   （build.py の assert_no_points）。
 *
 * ■ ★図は画像を作らない★
 *   数値が表で書かれている図は Markdown の表に変換した。
 *   位置関係だけの図（模式地図・断面図・人口ピラミッド等）は
 *   scripts/geo/figures.json に日本語で起こした説明を差し込んでいる。
 *   → 画像が無くても、設問が要求する大小関係・位置関係は全部読める。
 *
 * ■ 選択肢
 *   ①〜⑧の記号ではなく「選択肢の本文そのまま」を options に入れる。
 *   組合せ選択肢の表は「Ａ＝ア　Ｂ＝イ　…」という1文に畳んである。
 *
 * ■ 解説
 *   detailedExplanation.steps  … 解く筋道（画面が <ol> で1行ずつ描く）
 *   problem.explanation        … 根拠の数値（表）まで載せた全文。
 *                                小問ごとに <!--sq:id--> の目印付き
 *                                （目印が無いと採点画面に解説が出ない）。
 */

import type { GeographyProblem } from './geographyQ1Problems';

'''


def build_problem(file_key, slug, round_name, section, sec_i, fo):
    """1つの大問（problem）を組み立てる。"""
    q_title = strip_points(section['h2'])                   # 「第1問　気候…」
    problem_id = f'q_geo_{slug}_{sec_i + 1}'

    # 解説の見出しは explanationOrder の実データから引く（★推測で組み立てない★）
    exp_q = [e for e in fo['explanationOrder'] if e['isQuestion']]
    # この大問に属する設問解説だけを取り出す（mark の通し番号で対応させる）
    base = sum(len(s['questions']) for s in fo['sections'][:sec_i])
    exp_q = exp_q[base:base + len(section['questions'])]

    sub_questions = []
    sq_parts = []
    for qi, (question, exp) in enumerate(zip(section['questions'], exp_q)):
        mark = str(question['mark'])
        sq_id = f'{problem_id}_q{qi + 1}'
        options, mark_to_option = build_choices(question)
        raw_answer = fo['answers'].get(mark, '')
        answer = mark_to_option.get(raw_answer, raw_answer)
        if answer not in options:
            raise SystemExit(f'★正解が選択肢の中にありません★ {file_key}/{sec_i}/{qi} {raw_answer!r}')

        key = (exp['dai'] + ' / ' + exp['title']) if exp['dai'] else exp['title']
        body = fo['explanations'][key][0]
        tables = fo['explanationTables'][key][0]

        sub_questions.append({
            'id': sq_id,
            'label': build_label(question),
            'type': 'multiple_choice',
            'options': options,
            'correctAnswer': answer,
            'correctAnswerRate': fo['rates'].get(mark),
            'detailedExplanation': {
                'theme': theme_of(question['head']),
                'type': '資料読解型',
                'difficulty': difficulty_of(fo['rates'].get(mark)),
                'steps': steps_of(body),
            },
        })
        # 採点画面のアコーディオンに出す全文（表つき）
        note = answer_note(exp['title'])
        title = f'問{qi + 1}　正解　{answer}' + (f'（{note}）' if note else '')
        full = render_explanation_tables(body, tables)
        full = '\n\n'.join(drop_nav(re.split(r'\n\s*\n', full)))
        sq_parts.append((sq_id, title, full))

    # 大問すべてに添える共通の解説（yosou の「この予想問題の要点」だけが該当）
    shared = []
    for e in fo['explanationOrder']:
        if e['isQuestion'] or '要点' not in e['title']:
            continue
        lines = fo['explanations'].get(e['title'], [])
        joined = '\n\n'.join(drop_nav(re.split(r'\n\s*\n', '\n\n'.join(lines))))
        if joined:
            shared = [f'**{e["title"]}**', joined]

    return {
        'id': problem_id,
        'category': f'{round_name} {q_title}',
        'text': build_text(section, file_key, sec_i),
        'subQuestions': sub_questions,
        'explanation': build_explanation(sq_parts, shared),
        'surroundingKnowledge': [],
        'deepDiveTopics': [],
    }


def ts_problem(problem) -> str:
    """1つの大問を TypeScript の書き方で文字列にする。"""
    def lit(text):
        return '`' + esc(text) + '`'

    def arr(items):
        return '[\n' + ''.join(f'          {lit(x)},\n' for x in items) + '        ]'

    out = ['  {']
    out.append(f"    id: '{problem['id']}',")
    out.append(f"    category: {lit(problem['category'])},")
    out.append(f"    text: {lit(problem['text'])},")
    out.append('    subQuestions: [')
    for sq in problem['subQuestions']:
        de = sq['detailedExplanation']
        out.append('      {')
        out.append(f"        id: '{sq['id']}',")
        out.append(f"        label: {lit(sq['label'])},")
        out.append("        type: 'multiple_choice',")
        out.append(f"        options: {arr(sq['options'])},")
        out.append(f"        correctAnswer: {lit(sq['correctAnswer'])},")
        out.append(f"        correctAnswerRate: {sq['correctAnswerRate']},")
        out.append('        detailedExplanation: {')
        out.append(f"          theme: {lit(de['theme'])},")
        out.append(f"          type: '{de['type']}',")
        out.append(f"          difficulty: {de['difficulty']},")
        out.append('          steps: [')
        for step in de['steps']:
            out.append(f'            {lit(step)},')
        out.append('          ],')
        out.append('        },')
        out.append('      },')
    out.append('    ],')
    out.append(f"    explanation: {lit(problem['explanation'])},")
    out.append('    surroundingKnowledge: [],')
    out.append('    deepDiveTopics: [],')
    out.append('  },')
    return '\n'.join(out)


def main():
    raw = json.load(open(RAW, encoding='utf-8'))
    chunks = [HEADER]
    names = []
    total_sq = 0

    for file_key, slug, round_name, level in ROUNDS:
        fo = raw[file_key]
        problems = [
            build_problem(file_key, slug, round_name, section, sec_i, fo)
            for sec_i, section in enumerate(fo['sections'])
        ]
        total_sq += sum(len(p['subQuestions']) for p in problems)
        var = f'geoExam{slug.capitalize()}Problems'
        # ★鍵は「回×大問」の粒度にする★
        #   画面の単元（chapter）はタブ＝第1問/第2問/第3問、
        #   カード＝「第1回 …」なので、単元1つ＝大問1つになる。
        #   回単位（3大問まとめて1鍵）にすると単元が7つしか作れず、
        #   タブで大問を切り替える形にできない。
        for sec_i in range(len(problems)):
            names.append((f'geo_exam_{slug}_{sec_i + 1}', f'[{var}[{sec_i}]]'))
        body = '\n'.join(ts_problem(p) for p in problems)
        chunks.append(
            f'// =====================================================================\n'
            f'// {round_name}（{level}）　第1問〜第3問\n'
            f'// =====================================================================\n\n'
            f'export const {var}: GeographyProblem[] = [\n{body}\n];\n'
        )

    chunks.append(
        '/** 単元 id → その大問（1つ）。既存の GEO_Q1_PROBLEMS とは別系統。 */\n'
        'export const GEO_EXAM_PROBLEMS: Record<string, GeographyProblem[]> = {\n'
        + ''.join(f'  {key}: {var},\n' for key, var in names)
        + '};\n'
    )

    # ★検査はデータ本体だけに掛ける★
    #   ヘッダーのコメントには「配点は表記しない」という方針の説明そのものが
    #   書かれているので、ヘッダーまで検査すると必ず引っかかってしまう。
    #   守りたいのは「生徒に見える文字列」＝データ本体なので、そこだけ見る。
    body_text = '\n'.join(chunks[1:])
    assert_no_points(body_text)
    text = '\n'.join(chunks)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(text)

    # 手書き説明の使い残しがないか（figures.json に無駄な鍵が無いか）
    unused = sorted(set(HAND) - HAND_USED)
    print(f'書き出し {OUT}')
    print(f'  回 {len(ROUNDS)} / 大問 {len(names)} / 設問 {total_sq}')
    print(f'  手書き説明 {len(HAND_USED)}/{len(HAND)} 使用' + (f' 未使用 {unused}' if unused else ''))
    print(f'  配点の残り 0 件（検査済み）')


if __name__ == '__main__':
    main()

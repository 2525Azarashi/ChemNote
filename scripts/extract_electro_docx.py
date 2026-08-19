"""
配布プリント（電気エネルギー編 .docx）から本文テキストを抽出する。

■ 目的
  熱化学編と同じように「まとめプリント（インプット）」と「演習問題」を
  アプリへ収録するため、まず原稿の全文と構造（演習/コラム/重要事項の位置）を
  把握する。抽出結果は scripts/data/ に置き、以後の変換の入力にする。

■ 方針
  python-docx を入れずに標準ライブラリだけで処理する（依存を増やさない）。
  段落 <w:p> ごとに <w:t> を連結し、表 <w:tbl> はセルを「 | 」で区切る。

■ 数式（OMML）の扱い ★重要
  この原稿は数値や反応式の多くを Word の数式オブジェクト（<m:oMath>）で
  書いているため、<w:t> だけを拾うと「電解槽Ⅰには␣の希硫酸が」のように
  数値が丸ごと抜け落ちる。そこで m:f（分数）・m:sSup（上付き）・
  m:sSub（下付き）・m:rad（根号）などを構造ごとに読み、
  分数は (分子)/(分母)、上付きは ^、下付きは _ の形の平文に落とす。
"""
import re
import sys
import zipfile
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
M = '{http://schemas.openxmlformats.org/officeDocument/2006/math}'


def omml_text(node):
    """数式（OMML）1 つ分を平文に落とす。構造を保つため再帰で処理する。"""
    tag = node.tag

    def kids(name):
        """直下の <m:name> 要素をまとめてテキスト化する。"""
        return ''.join(omml_text(c) for c in node.findall(M + name))

    if tag == M + 'r':                       # 数式内の 1 ラン
        return ''.join(t.text or '' for t in node.findall(M + 't'))
    if tag == W + 't':                       # 数式内に混ざる通常テキスト
        return node.text or ''
    if tag == M + 'f':                       # 分数
        return f'({kids("num")})/({kids("den")})'
    if tag == M + 'sSup':                    # 上付き（指数・イオン価）
        return f'{kids("e")}^{kids("sup")}'
    if tag == M + 'sSub':                    # 下付き（化学式の数）
        return f'{kids("e")}_{kids("sub")}'
    if tag == M + 'sSubSup':                 # 上下付き
        return f'{kids("e")}_{kids("sub")}^{kids("sup")}'
    if tag == M + 'rad':                     # 根号
        return f'√({kids("e")})'
    if tag == M + 'd':                       # 括弧で囲まれた式
        return f'({kids("e")})'
    if tag == M + 'nary':                    # Σ・∫ など
        return f'{kids("chr")}{kids("sub")}{kids("sup")}{kids("e")}'

    # 上記以外（m:oMath, m:e, m:num, m:den, m:oMathPara …）は中身を連結する。
    # rPr / ctrlPr は書式情報なので読み飛ばす。
    out = []
    for c in node:
        if c.tag in (M + 'rPr', M + 'ctrlPr', W + 'rPr', M + 'argPr'):
            continue
        out.append(omml_text(c))
    return ''.join(out)


def para_text(p):
    """段落1つ分のテキスト。数式・タブ・改行も見えるようにしておく。"""
    out = []
    skip = set()          # 数式配下の <w:t> を二重に拾わないための除外集合

    def collect_descendants(node):
        for c in node.iter():
            if c is not node:
                skip.add(id(c))

    for node in p.iter():
        if id(node) in skip:
            continue
        if node.tag in (M + 'oMath', M + 'oMathPara'):
            out.append(omml_text(node))
            collect_descendants(node)
        elif node.tag == W + 't':
            out.append(node.text or '')
        elif node.tag == W + 'tab':
            out.append('\t')
        elif node.tag in (W + 'br', W + 'cr'):
            out.append('\n')
    return ''.join(out)


def cell_text(tc):
    """表のセル1つ分。セル内の表（入れ子）も拾う。"""
    parts = []
    for child in tc:
        if child.tag == W + 'p':
            parts.append(para_text(child))
        elif child.tag == W + 'tbl':
            parts.append(table_text(child, sep=' '))
    return ' '.join(s for s in parts if s.strip()).strip()


def table_text(tbl, sep='\n'):
    rows = []
    for row in tbl.findall(W + 'tr'):
        cells = [cell_text(tc) for tc in row.findall(W + 'tc')]
        rows.append(' | '.join(cells))
    return sep.join(rows)


def walk(body):
    """本文を上から順に、段落と表をテキスト化して返す。"""
    lines = []
    for child in body:
        if child.tag == W + 'p':
            lines.append(para_text(child))
        elif child.tag == W + 'tbl':
            for row in child.findall(W + 'tr'):
                cells = [cell_text(tc) for tc in row.findall(W + 'tc')]
                lines.append('[表] ' + ' | '.join(cells))
    return lines


def main(path, out):
    z = zipfile.ZipFile(path)
    root = ET.fromstring(z.read('word/document.xml'))
    body = root.find(W + 'body')
    lines = walk(body)
    text = '\n'.join(lines)
    # 連続する空行は1つに畳む（構造を読みやすくするため）
    text = re.sub(r'\n{3,}', '\n\n', text)
    with open(out, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f'wrote {out}: {len(text)} chars, {len(lines)} blocks')
    # 構造の目印を数える
    for pat, label in [
        (r'演習\s*[０-９\d]+', '演習'),
        (r'コラム', 'コラム'),
        (r'重要事項', '重要事項'),
        (r'★', '難易度マーク行'),
    ]:
        n = len([l for l in lines if re.search(pat, l.strip())])
        print(f'  {label}: {n}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])

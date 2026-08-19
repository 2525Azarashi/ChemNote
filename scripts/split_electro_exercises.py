"""
抽出済みテキストを「演習ごと」に切り分け、問題文と解答・解説に分けて JSON 化する。

原稿では
    [表] 演習N★ …問題文…
    解答と解説
    …解答本文…
の順に並ぶため、「解答と解説」の行を境目として扱う。

ただし表記は一定ではなく、
  ・演習9  … 見出しが「解答」だけ
  ・演習13 … 「解答と解説　解答：５：３：７：３：５」と同じ行に答えが続く
という揺れがあるので、見出しの判定は前方一致で行い、
見出し行の残り（「解答：…」）も解答側に残す。
"""
import json
import re
import sys

ZEN = str.maketrans('０１２３４５６７８９', '0123456789')


def main(src, out):
    lines = open(src, encoding='utf-8').read().split('\n')
    heads = [i for i, l in enumerate(lines) if re.match(r'^\[表\]\s*演習', l)]
    items = []
    for idx, start in enumerate(heads):
        end = heads[idx + 1] if idx + 1 < len(heads) else len(lines)
        block = lines[start:end]
        head = block[0]
        m = re.match(r'^\[表\]\s*演習([０-９0-9]+)\s*(★+)\s*(.*)$', head)
        no = int(m.group(1).translate(ZEN))
        stars = len(m.group(2))
        first = m.group(3)
        # 「解答と解説」「解答」以降を解説として分ける（見出し行の残りも解答側へ）
        cut, cut_rest = None, ''
        for i, l in enumerate(block):
            m2 = re.match(r'^\s*(?:解答と解説|解答)\s*(.*)$', l.strip())
            if m2:
                cut, cut_rest = i, m2.group(1).strip()
                break
        if cut is None:
            q_lines = [first] + block[1:]
            a_lines = []
        else:
            q_lines = [first] + block[1:cut]
            a_lines = ([cut_rest] if cut_rest else []) + block[cut + 1:]
        items.append({
            'no': no,
            'stars': stars,
            'question': '\n'.join(x for x in q_lines).strip(),
            'answer': '\n'.join(a_lines).strip(),
        })
    json.dump(items, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'wrote {out}: {len(items)} exercises')
    for it in items:
        print(f"  演習{it['no']} {'★'*it['stars']} Q={len(it['question'])} A={len(it['answer'])}")


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])

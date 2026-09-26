# -*- coding: utf-8 -*-
"""マナトビ基本演習 Step 87〜137 を対戦用の手書き問題（authored）JSON に書き出す。

  python3 scripts/math-plus/export_authored_drill.py
  → src/battle/data/authored/math.<章ID>.json（ia4_1〜ia4_3, ia5_1〜ia5_6）

★演習と対戦を同じ定義から作る★ 問題・正解は ia_drill_comb*/prob*/data*.py の1か所だけ。
★誤答は問題ごとに「典型的なまちがい」を意図して作ったもの★ 他の設問の答えを借りていない。
★選択肢の見た目をそろえる★ 誤答の「（〜とした値）」の注記は画面に出さず why に回す
  （注記つきの選択肢だけが誤答だと、見た目で正解が分かってしまうため）。
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import ia_drill_comb, ia_drill_comb2, ia_drill_prob, ia_drill_prob2  # noqa
import ia_drill_data, ia_drill_data2, ia_drill_data3  # noqa
from comb_common import BATTLE

OUT_DIR = os.path.join(ROOT, 'src/battle/data/authored')
PROMPT_MAX = 150


def value_part(text):
    return re.split(r'（', text, maxsplit=1)[0].strip()


def loose(s):
    return re.sub(r'[\s　・，,、。．.]', '', s).lower()


def first_sentence(s):
    return re.split(r'(?<=。)', s.strip())[0]


def one_line(ans, expl):
    s = f'{ans}。{first_sentence(expl)}'
    return s if len(s) <= 120 else s[:119] + '…'


def build():
    files, errs = {}, []
    for prob in BATTLE:
        ch = prob['chapter']
        for s in prob['subs']:
            correct = s['answer'] + s['unit']
            prompt = s['bp'] or (prob['statement'] + (s['q'] or ''))
            if len(prompt) > PROMPT_MAX:
                errs.append(f'{s["id"]}: prompt {len(prompt)} 文字')
            opts = [dict(text=correct, correct=True, why=first_sentence(s['expl'])[:200])]
            for text, why in s['wrong']:
                v = value_part(text)
                note = text[len(v):].strip().strip('（）')
                opts.append(dict(text=v, why=f'{why}（{note}）' if note else why))
            ns = [loose(o['text']) for o in opts]
            for i in range(4):
                for j in range(i + 1, 4):
                    if ns[i] in ns[j] or ns[j] in ns[i]:
                        errs.append(f'{s["id"]}: 「{opts[i]["text"]}」「{opts[j]["text"]}」が包含関係')
            files.setdefault(ch, []).append(dict(
                id=f'a:{ch}:{prob["problemId"]}:{s["id"]}:1',
                source=dict(chapterId=ch, problemId=prob['problemId'], subQuestionId=s['id']),
                format='choice4', prompt=prompt, label='', options=opts,
                oneLine=one_line(correct, s['expl']), timeLimit=s['tl'] or 20))
    if errs:
        raise SystemExit('対戦用に出せない設問:\n  ' + '\n  '.join(errs))
    return files


def main():
    files = build()
    total = 0
    for ch, qs in sorted(files.items()):
        path = os.path.join(OUT_DIR, f'math.{ch}.json')
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(dict(subject='math', chapterId=ch, authoredBy='manatobi-drill-87-137', questions=qs),
                      f, ensure_ascii=False, indent=2)
            f.write('\n')
        total += len(qs)
        print(f'  {os.path.relpath(path, ROOT)}  {len(qs)}問')
    print('authored total', total)


if __name__ == '__main__':
    main()

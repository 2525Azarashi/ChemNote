#!/usr/bin/env python3
"""
第2問の正解位置の偏りを均す（選択肢の並び順だけを入れ替える）。

■ なぜ必要か
    配布 PDF の正解位置は 48 問で
        ① 13問 / ② 21問 / ③ 9問 / ④ 5問
    と偏っている。②を塗るだけで 44% 当たり、①②で 71% になる。
    音を聞かずに点が取れると リスニングの練習にならないので、
    選択肢の**並び順だけ**を入れ替えて正解位置をほぼ均等にする。
    第1問B（shuffle_q1b_options.py）・第3問（shuffle_listening_q3_options.py）と
    同じ方針。

■ 第1問B との決定的な違い ―「画像を切り貼りしない」
    第1問B では既に焼き込み済みの JPEG があったため、
    画像のマスを切り出して入れ替える必要があった（難しく、壊れやすい）。
    第2問は **まだ画像を作っていない**。
    そこで「画像生成プロンプトの Panel 記述ごと入れ替える」ことで、
    画像は最初から入れ替わった順番で生成される。
    画像処理が一切要らないので、ズレようがない。

■ 入れ替える対象（この4つを必ず同じ置換で動かす）
    1. options（選択肢の説明・日本語）
    2. answerIndex / answerMark（正解位置）
    3. imagePrompt の Panel 1〜4 の記述（＝生成される絵の並び）
    4. explanation 中の丸数字（①③ のような他選択肢への言及）

■ 「2×2の4枚から選択」型（34問）だけを入れ替える理由
    第2問には2つの絵の形式がある。
      A: 2×2 の4枚から選ぶ（34問）… プロンプトが Panel 1〜4 に分かれており、
         記述の入れ替えが機械的に安全にできる。
      B: 1枚の図の中に①〜④が配置される（14問）… 地図上のルートや
         座席表のように「①〜④が図の中のどこを指すか」が
         1つの文に溶けており、機械的に入れ替えると
         プロンプトが壊れて意味不明な絵になりかねない。
    ご要望「コードで形式的に作ると問題によっておかしくなる可能性があるから
    注意ね」に照らし、安全に入れ替えられる A 型だけを対象にする。
    B 型14問の正解位置（① 2 / ② 8 / ③ 1 / ④ 3）は固定なので、
    A 型34問の割り当てでその不足を埋め、全体でほぼ均等にする。

■ 使い方
    python3 scripts/shuffle_listening_q2_options.py            # 実行
    python3 scripts/shuffle_listening_q2_options.py --check    # 検証のみ
"""

from __future__ import annotations

import argparse
import collections
import itertools
import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'scripts' / 'data' / 'q2_parsed.json'
OUT = ROOT / 'scripts' / 'data' / 'q2_shuffled.json'

MARKS = '①②③④'

# 乱数を固定し、何度実行しても同じ結果になるようにする（再現性のため）。
SEED = 20260828

# Panel 記述の切り出し。「Panel 1: … Panel 2: …」を4つに分ける。
RE_PANEL = re.compile(r'Panel\s*([1-4])\s*:\s*(.*?)(?=\s*Panel\s*[1-4]\s*:|$)', re.S)


def is_grid(q: dict) -> bool:
    """2×2の4枚から選ぶ型（A型）かどうか。"""
    return '2×2' in q['figureType']


def split_prompt(prompt: str) -> tuple[str, list[str]] | None:
    """
    プロンプトを (共通の前置き, [Panel1〜4の記述]) に分ける。
    Panel が4つ揃っていなければ None（＝入れ替え対象にしない）。
    """
    head_end = prompt.find('Panel 1:')
    if head_end < 0:
        return None
    head, body = prompt[:head_end], prompt[head_end:]
    found = RE_PANEL.findall(body)
    if [n for n, _ in found] != ['1', '2', '3', '4']:
        return None
    return head, [t.strip() for _, t in found]


def join_prompt(head: str, panels: list[str]) -> str:
    """(前置き, Panel記述4つ) を1本のプロンプトに戻す。"""
    body = ' '.join(f'Panel {i + 1}: {panels[i]}' for i in range(4))
    return (head.rstrip() + ' ' + body).strip()


def apply_perm(q: dict, perm: tuple[int, int, int, int]) -> dict:
    """
    perm[i] = 「新しい i 番目には元の perm[i] 番目を置く」という置換を適用する。

    options / imagePrompt の Panel / answerIndex / explanation の丸数字を
    すべて同じ置換で書き換えるので、4者が食い違うことは原理的に起きない。
    """
    q = json.loads(json.dumps(q))  # 元を壊さないよう深いコピー

    old_options = q['options']
    q['options'] = [old_options[perm[i]] for i in range(4)]

    split = split_prompt(q['imagePrompt'])
    if split is not None:
        head, panels = split
        q['imagePrompt'] = join_prompt(head, [panels[perm[i]] for i in range(4)])

    # 元の正解が新しい何番目に来たか
    old_answer = q['answerIndex'] - 1
    new_answer = perm.index(old_answer)
    q['answerIndex'] = new_answer + 1
    q['answerMark'] = MARKS[new_answer]
    q['answerText'] = q['options'][new_answer]

    # 解説が他の選択肢を丸数字で指している場合も同じ置換で書き換える
    # （旧番号 → 新番号。置換途中で二重に書き換えないよう一括で行う）
    old_to_new = {perm[i]: i for i in range(4)}
    q['explanation'] = re.sub(
        r'[①②③④]',
        lambda m: MARKS[old_to_new[MARKS.index(m.group())]],
        q['explanation'],
    )

    q['shuffled'] = True
    q['shufflePerm'] = list(perm)
    return q


def plan_targets(grid_count: int, fixed: collections.Counter) -> list[int]:
    """
    A型 grid_count 問に割り当てる「正解位置」の一覧を作る。

    B型（固定）の分布 fixed を踏まえ、全体がなるべく均等になるよう
    A型側で不足分を埋める。
    """
    total = grid_count + sum(fixed.values())
    targets: list[int] = []
    # 各位置の目標本数（全体を均等に割る）
    base = [total // 4] * 4
    for i in range(total % 4):
        base[i] += 1
    for i in range(4):
        need = base[i] - fixed[MARKS[i]]
        targets += [i] * max(0, need)
    # 端数の調整（丸めで合計がずれた場合は少ない位置から足す／多い位置から引く）
    while len(targets) > grid_count:
        c = collections.Counter(targets)
        targets.remove(max(c, key=lambda k: c[k]))
    while len(targets) < grid_count:
        c = collections.Counter(targets)
        targets.append(min(range(4), key=lambda k: c[k]))
    return targets


def shuffle(sets: list[dict]) -> list[dict]:
    rng = random.Random(SEED)

    grid: list[tuple[int, int]] = []
    fixed: collections.Counter = collections.Counter()
    for s in sets:
        for q in s['questions']:
            if is_grid(q) and split_prompt(q['imagePrompt']) is not None:
                grid.append((s['set'], q['q']))
            else:
                fixed[q['answerMark']] += 1

    targets = plan_targets(len(grid), fixed)
    rng.shuffle(targets)

    # すべての置換パターン（24通り）を用意しておく
    perms = list(itertools.permutations(range(4)))

    out = json.loads(json.dumps(sets))
    index = {(s['set'], q['q']): q for s in out for q in s['questions']}

    for (key, target) in zip(grid, targets):
        q = index[key]
        old_answer = q['answerIndex'] - 1
        # 「元の正解が新しい target 番目に来る」置換だけを候補にする
        candidates = [p for p in perms if p.index(old_answer) == target]
        # 恒等置換（並びが変わらない）は最後の手段にして、見た目を必ず変える
        non_identity = [p for p in candidates if p != (0, 1, 2, 3)]
        chosen = rng.choice(non_identity or candidates)
        index[key].update(apply_perm(q, chosen))

    return out


def verify(before: list[dict], after: list[dict]) -> list[str]:
    """
    入れ替えの結果が壊れていないことを確かめる。

    ■ ここで落とすもの（重要な順）
      1. 選択肢の集合が変わっていないこと（＝説明を作ったり消したりしていない）
      2. 正解の中身が同じであること（位置だけが変わったこと）
      3. Panel 記述の集合が変わっていないこと（＝絵の内容が増減していない）
      4. 選択肢と Panel の対応が保たれていること
    """
    errors: list[str] = []
    b_index = {(s['set'], q['q']): q for s in before for q in s['questions']}

    for s in after:
        for q in s['questions']:
            tag = f'第{s["set"]}セット問{q["q"]}'
            b = b_index[(s['set'], q['q'])]

            if sorted(q['options']) != sorted(b['options']):
                errors.append(f'{tag}: 選択肢の集合が変わっている')
            if q['options'][q['answerIndex'] - 1] != q['answerText']:
                errors.append(f'{tag}: 正解位置と本文が不一致')
            if q['answerText'] != b['answerText']:
                errors.append(
                    f'{tag}: 正解の中身が変わっている\n'
                    f'    before: {b["answerText"]}\n    after : {q["answerText"]}'
                )
            if q['answerMark'] != MARKS[q['answerIndex'] - 1]:
                errors.append(f'{tag}: マークと番号が不一致')

            sa, sb = split_prompt(q['imagePrompt']), split_prompt(b['imagePrompt'])
            if (sa is None) != (sb is None):
                errors.append(f'{tag}: プロンプトの Panel 構造が壊れた')
            elif sa is not None and sb is not None:
                if sorted(sa[1]) != sorted(sb[1]):
                    errors.append(f'{tag}: Panel 記述の集合が変わっている')
                if sa[0].strip() != sb[0].strip():
                    errors.append(f'{tag}: プロンプトの前置きが変わっている')
                # 選択肢と Panel の対応（元の対応表と突き合わせる）
                if 'shufflePerm' in q:
                    perm = q['shufflePerm']
                    for i in range(4):
                        if q['options'][i] != b['options'][perm[i]]:
                            errors.append(f'{tag}: 選択肢の置換が perm と不一致')
                        if sa[1][i] != sb[1][perm[i]]:
                            errors.append(f'{tag}: Panel の置換が perm と不一致')

            # 解説に残った丸数字が「正解と同じ番号」を他選択肢として
            # 指していないか（置換ミスの検出）
            marks = set(re.findall(r'[①②③④]', q['explanation']))
            if q['answerMark'] in marks and len(marks) > 0:
                errors.append(
                    f'{tag}: 解説が正解と同じ番号 {q["answerMark"]} を'
                    f'誤答として挙げている可能性'
                )
    return errors


def report(label: str, sets: list[dict]) -> None:
    c = collections.Counter(q['answerMark'] for s in sets for q in s['questions'])
    total = sum(c.values())
    parts = ' / '.join(f'{MARKS[i]} {c[MARKS[i]]}問' for i in range(4))
    top = max(c.values()) / total * 100
    print(f'  {label}: {parts}  （最頻位置だけ塗った場合の正答率 {top:.0f}%）')


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true', help='検証のみ（ファイルを書かない）')
    args = ap.parse_args()

    before = json.loads(SRC.read_text(encoding='utf-8'))
    after = shuffle(before)

    errors = verify(before, after)
    print('正解位置の分布')
    report('入れ替え前', before)
    report('入れ替え後', after)

    grid = sum(
        1 for s in after for q in s['questions'] if q.get('shuffled')
    )
    print(f'  入れ替えた問: {grid} 問（2×2型）/ 固定: {48 - grid} 問（1枚図型）')

    if errors:
        print(f'\n検証で {len(errors)} 件の問題を検出しました:')
        for e in errors:
            print(' -', e)
        return 1

    if args.check:
        print('\n--check のためファイルは書きませんでした。')
        return 0

    OUT.write_text(json.dumps(after, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'\n{OUT.relative_to(ROOT)} を書きました。')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

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

# ===================================================================
# ★配布 PDF のイラストをそのまま使う問（並べ替えを禁止する）★
# ===================================================================
#
# 当初この入れ替えは「画像はまだ作っていないから、プロンプトごと
# 入れ替えれば絵は最初から入れ替わった順で生成される」という前提で
# 作られていた（上の説明の「第1問B との決定的な違い」）。
#
# ところが後日、配布 PDF「第２問.pdf」から実物のイラストが手に入った。
# そこで実測したところ、
#
#     4枚組の画像は 1254×1254 px で、各マスの左上に ①②③④ が
#     ★絵として焼き込まれている★
#     （マス左上 22% の領域の暗ピクセル率 ≈10%、
#       その右隣の帯は ≈0.3% ＝ ほぼ白紙）
#
# ことが分かった。番号が絵の一部なので、
#
#   ・マスを切り貼りして並べ替えると、番号ごと動いてしまう
#     （②のマスが①の位置に来ても、そこには②と描かれている）
#   ・逆にデータ側だけ並べ替えると、絵の②と選択肢の②が食い違う
#
# つまり「実物の絵を使うなら、データは PDF の並びのままにするしかない」。
# 絵を選ぶ大問で並びが1つずれると、答えが無い／2つある問題になり、
# 学習の妨げになるどころか誤答を覚えさせてしまう。
#
# そのため、実物のイラストを収録する問はここに列挙して
# 並べ替えの対象から外す（＝ PDF 原文の並びで固定する）。
# 残りの問は従来どおり並べ替え、後から自前生成のイラストを
# 入れ替え後の並びで作る。
#
# ★ここに足した問は、必ず配布 PDF の実物イラストを使うこと。★
# 自前生成の絵を使う問をここに入れると、偏りを均す効果が薄れる。
#
# 単位は「セット」ではなく「(セット番号, 問番号)」にしている。
# 実物イラストを1枚ずつ目で確認したところ、同じセットの中でも
# 使える絵と使えない絵が混在していたため（下の EXCLUDED を参照）。
PDF_ILLUSTRATION_QUESTIONS = frozenset({
    (1, 1), (1, 2), (1, 3),
    (6, 1), (6, 2),
    (9, 1), (9, 2), (9, 3),
    (11, 2), (11, 3),
    (12, 1), (12, 2), (12, 3),
    (13, 2), (13, 3),
})

# ===================================================================
# ★実物イラストがあるのに使えなかった問（記録）★
# ===================================================================
# 上のセット（1・6・9・11・12・13）の絵を1マスずつ拡大して
# 選択肢の文言と突き合わせた結果、次の3問は絵と選択肢が
# 噛み合っていなかったため、公開対象から外した。
# 「コードで形式的に作るとおかしくなる」ご指摘のとおり、
# 4枚組だからといって機械的に採用してはいけない実例。
#
#   (6, 3) 別問題の絵が入っている
#          選択肢は「ソファ上に旗／テーブルの角に風船」など
#          ホームパーティーの飾り付けの位置を選ぶ問なのに、
#          PDF のその頁の絵は誕生日パーティーで4人の男の子に
#          ①〜④が振られた絵（＝第5セット問3 の1枚図版）だった。
#
#   (11, 1) 絵の本数が選択肢と合わない
#          ③の絵はジュース6本＋水7本＝13本だが選択肢③は「6本＋6本＝12本」。
#          ④の絵は12本＋12本＝24本だが選択肢④は「10本＋10本＝20本」。
#          しかも③が正解なので、絵を見て数えると正解が消える。
#
#   (13, 1) ①〜④がルートではなく地点に付いている
#          選択肢は4通りの道順を選ぶ問だが、絵に描かれた破線ルートは1本だけで、
#          ①〜④は家・湖・橋の右・行き止まりという「場所」を指していた。
#
# この3問は実物イラストを使わないので、並べ替えの対象に戻してある
# （＝後から自前生成の絵を入れ替え後の並びで作れる）。
EXCLUDED_PDF_ILLUSTRATIONS = frozenset({(6, 3), (11, 1), (13, 1)})

# Panel 記述の切り出し。「Panel 1: … Panel 2: …」を4つに分ける。
RE_PANEL = re.compile(r'Panel\s*([1-4])\s*:\s*(.*?)(?=\s*Panel\s*[1-4]\s*:|$)', re.S)


def is_grid(q: dict) -> bool:
    """2×2の4枚から選ぶ型（A型）かどうか。"""
    return '2×2' in q['figureType']


def is_locked(set_no: int, q_no: int) -> bool:
    """配布 PDF の実物イラストを使う問（＝並べ替え禁止）かどうか。"""
    return (set_no, q_no) in PDF_ILLUSTRATION_QUESTIONS


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
            # 並べ替えられるのは
            #   (1) 2×2型で、(2) プロンプトが Panel 1〜4 に分かれており、
            #   (3) 配布 PDF の実物イラストを使わない問
            # の3条件を満たす問だけ。
            # (3) を外すと、絵に焼き込まれた ①②③④ とデータの並びが
            # 食い違って「答えの無い問題」になる（上の説明を参照）。
            if (
                is_grid(q)
                and split_prompt(q['imagePrompt']) is not None
                and not is_locked(s['set'], q['q'])
            ):
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

    total_q = sum(len(s['questions']) for s in after)
    grid = sum(1 for s in after for q in s['questions'] if q.get('shuffled'))
    print(
        f'  入れ替えた問: {grid} 問（2×2型）/ '
        f'固定: {total_q - grid} 問'
        f'（うち {len(PDF_ILLUSTRATION_QUESTIONS)} 問は配布PDFの実物イラストを使う問）'
    )

    # 先に公開する問（実物イラストがある問）だけの分布も出す。
    # 全体が均等でも、先に公開する分だけを見ると偏っている場合があるため。
    published = [
        {
            'set': s['set'],
            'questions': [
                q for q in s['questions'] if is_locked(s['set'], q['q'])
            ],
        }
        for s in after
    ]
    published = [s for s in published if s['questions']]
    if published:
        report('うち先行公開ぶん', published)

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

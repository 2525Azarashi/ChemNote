#!/usr/bin/env python3
"""
情報Ⅰ（joho）の対戦プールを作る変換スクリプト。

■ 何をするか
  配布ZIP「情報Ⅰ問題パック_マナトビ用_450問.zip」の reference/joho-pool.json（元データ）を
  アプリの「外部教科」形式 src/battle/data/external/joho.json に変換する。
  あとは `npm run gen:battle-pool` が他の外部教科（理科・英単語）と同じ手順で
  pool.joho.generated.ts / answer.joho.generated.ts を作る。

■ なぜ ZIP の add/pool.joho.generated.ts をそのまま置かないのか
  ZIP の指示書は「POOL_BY_SUBJECT に joho を足す」形だが、このアプリにそういう表は無い。
  このアプリでは外部教科は external/*.json → gen:battle-pool で取り込む決まり
  （scripts/gen-battle-pool.mts の loadExternalPools）。
  タプルも chapterId が数値（1〜5）・panelOrder が [0,1,2,3] など、この形式と違う。
  そのため元データ（JSON）から変換する。

■ 使い方
  python3 scripts/gen-joho-pool.py <joho-pool.json のパス>
  npm run gen:battle-pool

■ 変換の決まり
  - 章：情報社会→jh1 … データ活用→jh5（章名は src/data/externalSubjects.ts と一致させる）
  - 試合後の1行解答（oneLine）＝「答え：<正解>／<why の解説>」
  - 制限時間 30 秒（元データどおり）
"""
import json, sys, os

CHAPTERS = [
    ('jh1', '情報社会'),
    ('jh2', 'デジタル化'),
    ('jh3', 'プログラミング'),
    ('jh4', 'ネットワーク'),
    ('jh5', 'データ活用'),
]
CH_ID = {name: cid for cid, name in CHAPTERS}

def main():
    if len(sys.argv) < 2:
        sys.exit('使い方: python3 scripts/gen-joho-pool.py <joho-pool.json>')
    src = json.load(open(sys.argv[1], encoding='utf-8'))
    out, seen = [], set()
    for i, q in enumerate(src, 1):
        qid = q['id']
        assert qid not in seen, f'ID重複: {qid}'
        seen.add(qid)
        opts = q['options']
        assert len(opts) == 4 and len(set(opts)) == 4, f'{qid}: 選択肢が4個・相異なるでない'
        assert 0 <= q['answer'] <= 3, f'{qid}: answer が範囲外'
        assert q['ch'] in CH_ID, f'{qid}: 未知の章 {q["ch"]}'
        # 選択肢が全部「英字1文字」だと、gen:battle-pool の安全装置（記号だけの選択肢＝①ア A を弾く）に
        # 捨てられる（例：j949 シーザー暗号の G/A/D/C）。意味は変えずに「文字 A」の形にして取り込む。
        if all(len(o) == 1 and o.isascii() and o.isalpha() for o in opts):
            opts = [f'文字 {o}' for o in opts]
        out.append({
            'id': f'jh:{qid}',
            'chapterId': CH_ID[q['ch']],
            'problemId': qid,
            'subQuestionId': qid,
            'format': 'choice4',
            'prompt': '次の問いに答えよ。',
            'label': q['q'],
            'options': opts,
            'answerIndex': q['answer'],
            'panelOrder': [],
            'timeLimit': 30,
            'imageUrl': '',
            # 1行解答は 120 字以内（tests/battleAnswers.test.ts）。長いプログラム行が答えのときは
            # 答えの本文は選択肢で見えているので省き、解説だけにする。
            'oneLine': (lambda s: s if len(s) <= 120 else q['why'])(f"答え：{opts[q['answer']]}／{q['why']}"),
        })
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dest = os.path.join(root, 'src/battle/data/external/joho.json')
    json.dump({
        'subject': 'joho',
        'label': '情報Ⅰ',
        'source': '情報Ⅰ問題パック（マナトビ用・450問・共通テスト情報Ⅰ対策の独自作問）',
        'questions': out,
    }, open(dest, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    by = {}
    for q in out:
        by[q['chapterId']] = by.get(q['chapterId'], 0) + 1
    print(f'{dest} に {len(out)} 問を書き出しました: {by}')

if __name__ == '__main__':
    main()

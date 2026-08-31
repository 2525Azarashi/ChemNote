#!/usr/bin/env python3
"""
===================================================================
まとめ録りした第2問の音声を、問ごとの MP3 に切り分ける
===================================================================

gen_q2_tts_batches.py が作った台本で音声を生成すると、
6問ぶんが1本の MP3 になっている。これを問ごとに切り分ける。

-------------------------------------------------------------------
■ ★秒数で切らない★
-------------------------------------------------------------------
「1問あたり約13秒だから13秒ごとに切る」は必ず失敗する。
読み上げ速度は台詞の長さで変わるので、ズレが後半に累積し、
最後の問は台詞の途中から始まる音源になる。

そこで、台本の各問の頭に入れておいたナレーターの合図

    Speaker 3: Number one.
    Speaker 3: Number two.
    ...

の ★実際の発話時刻★ を文字起こしから取り、そこで切る。
推測を一切しない。

-------------------------------------------------------------------
■ 使い方（2段階）
-------------------------------------------------------------------
文字起こしは外部のツールで行う。このスクリプトはその結果を読む。

  1. 音声を単語単位の時刻付きで文字起こしする
     （audio_transcribe を elevenlabs_scribe_v2 で実行し、
      返ってきた words_url の JSON を保存する）

  2. このスクリプトに渡す

        python3 split_q2_tts_batch.py \
            --batch 1 \
            --audio /tmp/batch01.mp3 \
            --words /tmp/batch01_words.json

単語 JSON は次のどちらの形でも読める（処理系によって違うため）。

    {"words": [{"start": 0.1, "end": 0.5, "text": "Number"}, ...]}
    [{"start": 0.1, "end": 0.5, "text": "Number"}, ...]

-------------------------------------------------------------------
■ ★書き出す前に必ず検算する★
-------------------------------------------------------------------
切り分けは「聞かないと失敗に気付けない」作業なので、
機械的に確かめられることは全部確かめてから書き出す。

  ・合図の数が台本の問数と一致するか
  ・合図の順序（one, two, three …）が台本どおりか
  ・各区間の長さが妥当か（既存の実測 11〜14秒 を基準に 6〜40秒）
  ・区間が重なっていないか、負の長さになっていないか

1つでも合わなければ ★何も書き出さずに中止する★。
半分だけ正しい音源を公開すると、どれが正しいか分からなくなる。

-------------------------------------------------------------------
■ 合図そのものは音源に含めない
-------------------------------------------------------------------
"Number one." はバッチを切るための道具であって、
生徒に聞かせるものではない。
各問の音源は、合図が終わった直後から次の合図の直前までを切り出す。

既存5問（1問ずつ録音したもの）にも合図は入っていないので、
これで38問の作りが揃う。

-------------------------------------------------------------------
■ 再エンコードする理由
-------------------------------------------------------------------
MP3 をフレーム単位でコピー（-c copy）すると、切り位置が
最大 数十ms ずれる。ずれると台詞の頭が欠ける。
128kbps で再エンコードする（既存5問と同じビットレート）。
音質の劣化より、切り位置の正確さを優先する。
===================================================================
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BATCH_DIR = ROOT / 'scripts' / 'data' / 'q2_tts_batches'
AUDIO_OUT = ROOT / 'public' / 'listening_audio'

# 合図が終わってから本編が始まるまでの余白（秒）。
# 合図の直後に少し間があるので、そこを飛ばして本編から始める。
LEAD_TRIM_SEC = 0.25

# 次の合図の直前で切るときに残す余白（秒）。
# 設問文の語尾が切れないように、少し手前で止める。
TAIL_KEEP_SEC = 0.35

# 区間の長さの許容範囲（秒）。既存5問の実測は 11.9〜13.7 秒。
# 下限6秒: これより短いと台詞が丸ごと欠けている。
# 上限40秒: これより長いと2問ぶんが1つに入っている。
MIN_SEG_SEC = 6.0
MAX_SEG_SEC = 40.0

BITRATE = '128k'


def load_words(path: Path) -> list[dict]:
    """単語単位の時刻付き文字起こしを読む。形の違いを吸収する。"""
    data = json.loads(path.read_text(encoding='utf-8'))
    if isinstance(data, dict):
        for key in ('words', 'items', 'result'):
            if isinstance(data.get(key), list):
                data = data[key]
                break
        else:
            raise SystemExit(
                f'単語の配列が見つかりません。含まれるキー: {list(data)}'
            )
    if not isinstance(data, list):
        raise SystemExit('単語 JSON の形が想定と違います')

    out: list[dict] = []
    for w in data:
        text = str(w.get('text') or w.get('word') or '').strip()
        if not text:
            continue
        try:
            start = float(w['start'])
            end = float(w.get('end', w['start']))
        except (KeyError, TypeError, ValueError):
            # 時刻の無い単語は切り分けに使えないので飛ばす。
            continue
        out.append({'text': text, 'start': start, 'end': end})
    if not out:
        raise SystemExit('時刻付きの単語が1つも読めませんでした')
    return out


def norm(text: str) -> str:
    """照合用に記号を落として小文字化する（"Number," → "number"）。"""
    return re.sub(r'[^a-z]', '', text.lower())


def find_markers(words: list[dict], expected: list[str], marker_word: str) -> list[dict]:
    """
    文字起こしの中から合図（"Number one." など）の位置を探す。

    expected は台本の順序どおりの数詞（['one','two',...]）。
    ★順序どおりに前から探す★ ので、同じ数詞が後半にもう一度
    出てきても取り違えない。

    戻り値: [{'word':'one', 'start':合図の開始, 'end':数詞の終了'}, ...]
    """
    key = norm(marker_word)
    found: list[dict] = []
    pos = 0
    for want in expected:
        hit = None
        i = pos
        while i < len(words) - 1:
            if norm(words[i]['text']) == key and norm(words[i + 1]['text']) == want:
                hit = {
                    'word': want,
                    'start': words[i]['start'],
                    'end': words[i + 1]['end'],
                }
                pos = i + 2
                break
            i += 1
        if hit is None:
            raise SystemExit(
                f'★中止★ 合図 "{marker_word} {want}" が文字起こしに見つかりません。\n'
                '考えられる原因:\n'
                '  ・音声生成が合図の行を読み飛ばした\n'
                '  ・文字起こしが合図を別の語に取り違えた\n'
                '  ・台本と音声が対応していない（別のバッチを渡している）\n'
                '文字起こしの先頭20語: '
                + ' '.join(w['text'] for w in words[:20])
            )
        found.append(hit)
    return found


def audio_duration(path: Path) -> float:
    out = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
         '-of', 'csv=p=0', str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def build_segments(markers: list[dict], plan: list[dict], total: float) -> list[dict]:
    """
    合図の位置から、問ごとの切り出し区間を組む。

    区間は「合図が終わった直後」から「次の合図の直前」まで。
    最後の問だけは音声の終わりまで。
    """
    segs: list[dict] = []
    for i, (mk, p) in enumerate(zip(markers, plan)):
        start = mk['end'] + LEAD_TRIM_SEC
        if i + 1 < len(markers):
            end = markers[i + 1]['start'] - TAIL_KEEP_SEC
        else:
            end = total
        segs.append({
            'name': p['name'],
            'marker': p['marker'],
            'start': start,
            'end': end,
            'dur': end - start,
        })
    return segs


def verify(segs: list[dict], total: float) -> None:
    """
    書き出す前の検算。1つでも異常があれば中止する。

    ★半分だけ切り出して終わるのが最悪★
    どのファイルが正しいのか分からなくなり、
    結局全部録り直すことになる。だから全部確かめてから書く。
    """
    problems: list[str] = []
    prev_end = 0.0
    for s in segs:
        if s['dur'] <= 0:
            problems.append(f'{s["name"]}: 長さが0以下（{s["dur"]:.2f}秒）')
        elif s['dur'] < MIN_SEG_SEC:
            problems.append(
                f'{s["name"]}: 短すぎます {s["dur"]:.2f}秒 '
                f'（下限 {MIN_SEG_SEC}秒／台詞が欠けている可能性）'
            )
        elif s['dur'] > MAX_SEG_SEC:
            problems.append(
                f'{s["name"]}: 長すぎます {s["dur"]:.2f}秒 '
                f'（上限 {MAX_SEG_SEC}秒／2問が1つに入っている可能性）'
            )
        if s['start'] < prev_end - 0.01:
            problems.append(f'{s["name"]}: 前の区間と重なっています')
        if s['end'] > total + 0.01:
            problems.append(
                f'{s["name"]}: 終了時刻 {s["end"]:.2f}秒 が'
                f'音声の長さ {total:.2f}秒 を超えています'
            )
        prev_end = s['end']

    if problems:
        raise SystemExit(
            '★中止★ 切り分けの検算で問題が見つかりました。'
            '1つも書き出していません。\n  - '
            + '\n  - '.join(problems)
        )


def cut(audio: Path, seg: dict, dest: Path) -> None:
    subprocess.run(
        ['ffmpeg', '-y', '-v', 'error',
         '-i', str(audio),
         '-ss', f'{seg["start"]:.3f}',
         '-to', f'{seg["end"]:.3f}',
         '-c:a', 'libmp3lame', '-b:a', BITRATE,
         str(dest)],
        check=True,
    )


def main() -> None:
    ap = argparse.ArgumentParser(
        description='まとめ録りした音声を問ごとの MP3 に切り分ける'
    )
    ap.add_argument('--batch', type=int, required=True, help='バッチ番号（1〜）')
    ap.add_argument('--audio', required=True, help='まとめ録りした MP3 のパス')
    ap.add_argument('--words', required=True, help='単語単位の時刻付き文字起こし JSON')
    ap.add_argument(
        '--dry-run', action='store_true',
        help='切り分けの位置を表示するだけで、書き出さない',
    )
    args = ap.parse_args()

    meta_path = BATCH_DIR / f'batch{args.batch:02d}.json'
    if not meta_path.exists():
        raise SystemExit(
            f'バッチの設計図がありません: {meta_path}\n'
            'まず scripts/gen_q2_tts_batches.py を実行してください。'
        )
    meta = json.loads(meta_path.read_text(encoding='utf-8'))
    plan = meta['questions']
    marker_word = meta['markerWord']

    audio = Path(args.audio)
    if not audio.exists():
        raise SystemExit(f'音声がありません: {audio}')

    words = load_words(Path(args.words))
    markers = find_markers(words, [p['markerWord'] for p in plan], marker_word)
    total = audio_duration(audio)
    segs = build_segments(markers, plan, total)
    verify(segs, total)

    print(f'batch{args.batch:02d}: 音声 {total:.2f}秒 / {len(segs)} 問')
    print()
    print(f'{"問":14} {"開始":>8} {"終了":>8} {"長さ":>7}')
    for s in segs:
        print(f'{s["name"]:14} {s["start"]:8.2f} {s["end"]:8.2f} {s["dur"]:7.2f}')
    print()

    if args.dry_run:
        print('--dry-run なので書き出していません。')
        return

    AUDIO_OUT.mkdir(parents=True, exist_ok=True)
    for s in segs:
        dest = AUDIO_OUT / f'{s["name"]}.mp3'
        cut(audio, s, dest)
        size = dest.stat().st_size
        print(f'書き出し: {dest.relative_to(ROOT)}  {size:,} バイト')

    print()
    print(f'{len(segs)} 問を書き出しました。')
    print('★次にやること★')
    print('  1. 切り出した音声を聞いて検証する')
    print('     （台詞の頭と設問文の語尾が欠けていないか）')
    print('  2. python3 scripts/gen_listening_q2_data.py で audioUrl を貼る')


if __name__ == '__main__':
    main()

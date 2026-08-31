#!/usr/bin/env python3
"""
===================================================================
第2問 TTS を「まとめ録り」するためのバッチ台本を作る
===================================================================

★このスクリプトが解決している問題★

第2問は38問ある。1問ずつ音声生成を呼ぶと38回の呼び出しになり、
生成クレジットを大量に消費する。実際に前回は5問生成した時点で
クレジットが尽き、33問が未生成のまま残った。

そこで「複数問を1本の長い音声として録り、あとで機械的に切り分ける」
方式にする。呼び出し回数は 38回 → 数回になる。

-------------------------------------------------------------------
■ 切り分けをどうやって成立させるか
-------------------------------------------------------------------
長い音声を「だいたいこの秒数で切る」では絶対に失敗する。
読み上げ速度は問ごとに違うので、ズレが後半に累積し、
問の途中で切れた音源が量産される。それは無音より悪い
（生徒が「途中で切れた」と感じ、アプリ自体を信用しなくなる）。

そこで各問の頭に、ナレーターが読む区切りの合図を入れる。

    Speaker 3: Number one.
    Speaker 1: Would you like anything to drink ...
    ...
    Speaker 3: Question. What will the man drink?

    Speaker 3: Number two.
    ...

生成後、音声を文字起こしして「Number」という単語の出現時刻を取る。
その時刻が正確な切り分け位置になる。秒数の推測を一切しない。

★なぜ "Number" という語を選んだか★
    全38問の台本を機械的に検索し、"number" が
    ★1度も出てこない★ことを確認済み（本ファイル下部の
    assert_marker_is_safe() が毎回検査する）。
    台本の中に同じ語があると、対話の途中を区切りだと誤認して
    そこで切ってしまう。だから「台本に出てこない語」でなければ
    ならない。"item" は el2_set2_q1 に出てくるので使えない。

-------------------------------------------------------------------
■ ★話者番号を「登場順」から「性別順」に振り直している★
-------------------------------------------------------------------
これがバッチ化で最も注意を要した点である。

manifest.json の voiceMap は「登場順」で Speaker 1 / 2 を振っている。
つまり問によって Speaker 1 が女性のときと男性のときがある
（実測: 女性が先の問 17、男性が先の問 21）。

1本の音声にまとめる場合、Speaker 1 に割り当てる声は
★その音声全体で1つ★しか指定できない。
登場順のままだと、Speaker 1 = 女性の声に固定した瞬間、
「男性が先に話す21問」で男性役が女性の声で読まれる。
父親や店員の男性が女性の声で話す音源ができあがる。

そこでバッチ用の台本では番号の意味を固定する。

    Speaker 1 = 女性役（Adeline）
    Speaker 2 = 男性役（Mark）
    Speaker 3 = ナレーター

男性が先に話す問は "Speaker 2:" から書き始める。
台詞の順序は変わらない。番号の付け替えだけである。

この振り直しは gender_of()（scripts/q2_tts_voices.py）で行う。
役割の日本語から性別を判定し、判定できなければ例外を投げる。
黙って男性に寄せると嘘の音源ができるため。

-------------------------------------------------------------------
■ バッチの大きさをどう決めたか
-------------------------------------------------------------------
実測（既存5問）: 1問あたり 約12〜14秒 / 台本 約220〜360文字。

1本を長くすればするほど呼び出しは減るが、次の危険が増える。

  ・生成が失敗したとき、まとめて数問ぶんを録り直すことになる
  ・長い音声ほど後半で声質や速度が乱れやすい
  ・文字数の上限に当たる可能性がある

そこで既定を6問（約90秒 / 約1700文字）とした。
38問なら7本の呼び出しで済む（38回 → 7回）。

★重要な運用方針★
    最初は1本だけ生成して、切り分けと聞き取り検証まで通すこと。
    いきなり7本流すと、方式そのものに欠陥があった場合に
    7本ぶんのクレジットを捨てることになる。

-------------------------------------------------------------------
■ 既存5問も録り直す対象に含めている理由
-------------------------------------------------------------------
既存5問は「登場順」の番号で録音済みで、さらに
ナレーター（Sam）が男性話者（Mark）と聞き分けられないという
既知の欠陥がある（scripts/q2_tts_voices.py に記録）。

バッチでは
  ・番号の意味が変わる（性別順）
  ・ナレーターの声を差し替える

ため、既存5問だけ古い方式のまま残すと、38問の中で
5問だけ声の割り当てが違うことになる。生徒には
「同じ第2問なのに音源の作りが違う」としか見えない。

したがって既定では38問すべてを対象にする。
既存5問を残したい場合は --skip-existing を付ける。

-------------------------------------------------------------------
■ 出力
-------------------------------------------------------------------
    scripts/data/q2_tts_batches/batch01.txt        音声生成へ渡す台本
    scripts/data/q2_tts_batches/batch01.json       切り分けに使う設計図
    scripts/data/q2_tts_batches/batches.json       全バッチの一覧

何度実行しても同じ結果になる（冪等）。
===================================================================
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from q2_tts_voices import VOICE_FEMALE, VOICE_MALE, VOICE_NARRATOR, gender_of

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / 'scripts' / 'data' / 'q2_tts' / 'manifest.json'
OUTDIR = ROOT / 'scripts' / 'data' / 'q2_tts_batches'
AUDIO_DIR = ROOT / 'public' / 'listening_audio'

# 区切りの合図に使う語。台本に出現しないことを毎回検査する。
MARKER_WORD = 'Number'

# 合図に使う数詞。1〜10 まであれば1バッチ10問まで扱える。
# 数字（"1"）ではなく英単語を使うのは、文字起こしの結果が
# "one" と "1" のどちらで返るか処理系依存なので、
# 単語で書いておけば照合が安定するため。
ORDINAL_WORDS = (
    'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine', 'ten',
)

# バッチ1本あたりの既定の問数。理由は冒頭のコメント参照。
DEFAULT_BATCH_SIZE = 6

# 話者番号の意味（バッチ内で固定）
SPK_FEMALE = 'Speaker 1'
SPK_MALE = 'Speaker 2'
SPK_NARRATOR = 'Speaker 3'


def load_manifest() -> list[dict]:
    return json.loads(MANIFEST.read_text(encoding='utf-8'))


def assert_marker_is_safe(rows: list[dict]) -> None:
    """
    区切りの合図に使う語が、どの台本にも出てこないことを検査する。

    ★この検査を外してはいけない★
    台本の中に同じ語があると、切り分けがその位置を区切りだと
    誤認する。結果は「対話の途中で切れた音源」であり、
    生成し直すまで直らない。しかも聞かないと気付けない。

    将来 MARKER_WORD を変えたときにも、ここで必ず検査される。
    """
    pattern = re.compile(r'\b' + re.escape(MARKER_WORD) + r'\b', re.IGNORECASE)
    hits = [r['name'] for r in rows if pattern.search(r['script'])]
    if hits:
        raise SystemExit(
            f'★中止★ 区切りの合図 "{MARKER_WORD}" が台本に出現します: {hits}\n'
            'この語で切り分けると対話の途中で切れます。\n'
            'MARKER_WORD を、どの台本にも出てこない語に変えてください。'
        )


def parse_script(script: str) -> tuple[list[tuple[str, str]], str]:
    """
    manifest の台本を「対話の行」と「設問文」に分解する。

    manifest の台本はこの形になっている。

        Speaker 1: <台詞>
        Speaker 2: <台詞>
        ...
        Speaker 3: Question. <設問文>

    戻り値:
        ([(元の話者番号, 台詞), ...], 設問文の行)

    ここでは番号を振り直さない。振り直しは呼び出し側が
    voiceMap（役割の日本語）を見て行う。
    この関数は「行の構造を取り出す」だけに留める。
    """
    turns: list[tuple[str, str]] = []
    question = ''
    for raw in script.split('\n'):
        line = raw.strip()
        if not line:
            continue
        m = re.match(r'^(Speaker \d):\s*(.*)$', line)
        if not m:
            raise ValueError(f'話者の書式が想定と違います: {line!r}')
        spk, text = m.group(1), m.group(2)
        if spk == SPK_NARRATOR:
            # ナレーターの行は設問文。台本の最後に1行だけある想定。
            if question:
                raise ValueError(f'ナレーターの行が2つあります: {line!r}')
            question = text
        else:
            turns.append((spk, text))
    if not question:
        raise ValueError('設問文（Speaker 3 の行）が見つかりません')
    if not turns:
        raise ValueError('対話の行が見つかりません')
    return turns, question


def rebuild_by_gender(row: dict) -> tuple[list[str], dict[str, str]]:
    """
    台本の話者番号を「登場順」から「性別順」に振り直す。

    ★この関数がバッチ化の核心★
    1本の音声では Speaker 1 に割り当てる声を1つしか指定できない。
    登場順のままだと、男性が先に話す問で男性役が女性の声になる。

    戻り値:
        (振り直した対話の行, 使った声の対応表)

    声の対応表は記録用。あとで「この音源の Speaker 2 は誰か」を
    人が確認できるようにしておく。
    """
    turns, question = parse_script(row['script'])
    voice_map = row['voiceMap']

    # 元の話者番号 → 性別。役割の日本語から判定する。
    # 判定できない役割があれば gender_of() が例外を投げる。
    gender_by_spk = {spk: gender_of(role) for spk, role in voice_map.items()}

    # 対話は男女ペアである前提。崩れていたら気付けるようにする。
    genders = set(gender_by_spk.values())
    if genders != {'F', 'M'}:
        raise ValueError(
            f'{row["name"]}: 対話が男女ペアになっていません: {voice_map}'
        )

    lines: list[str] = []
    for spk, text in turns:
        new_spk = SPK_FEMALE if gender_by_spk[spk] == 'F' else SPK_MALE
        lines.append(f'{new_spk}: {text}')
    lines.append(f'{SPK_NARRATOR}: {question}')

    used = {
        SPK_FEMALE: f'{VOICE_FEMALE}（女性役）',
        SPK_MALE: f'{VOICE_MALE}（男性役）',
        SPK_NARRATOR: f'{VOICE_NARRATOR}（ナレーター）',
    }
    return lines, used


def build_batch_script(rows: list[dict]) -> tuple[str, list[dict]]:
    """
    複数問を1本の台本にまとめる。

    各問の頭にナレーターが読む区切りの合図を入れる。

        Speaker 3: Number one.
        （1問目の対話と設問）

        Speaker 3: Number two.
        （2問目の対話と設問）

    戻り値:
        (台本の文字列, 問ごとの設計図)

    設計図には「何番の合図がどの問に対応するか」を書く。
    切り分けのときにこれを読む。
    """
    if len(rows) > len(ORDINAL_WORDS):
        raise ValueError(
            f'1バッチは最大 {len(ORDINAL_WORDS)} 問です（要求 {len(rows)} 問）'
        )

    blocks: list[str] = []
    plan: list[dict] = []
    for i, row in enumerate(rows):
        word = ORDINAL_WORDS[i]
        lines, used = rebuild_by_gender(row)
        # 合図は必ず単独の行にする。対話の台詞とくっつくと、
        # 文字起こしで語の位置がぶれる。
        blocks.append(f'{SPK_NARRATOR}: {MARKER_WORD} {word}.\n' + '\n'.join(lines))
        plan.append({
            'name': row['name'],
            'marker': f'{MARKER_WORD} {word}',
            'markerWord': word,
            'markerIndex': i,
            'set': row['set'],
            'q': row['q'],
            'scene': row['scene'],
            'speakers': row['speakers'],
            'voices': used,
            'originalVoiceMap': row['voiceMap'],
            'lines': lines,
            'rewritten': row.get('rewritten', False),
        })

    # 問の間は空行2つ。読み上げに間が入りやすく、
    # 文字起こしでも区切りが見つけやすくなる。
    return '\n\n\n'.join(blocks), plan


def build_batch_requirements(plan: list[dict]) -> str:
    """
    音声生成へ渡す声の指示文を組む。

    ★1本の音声の中で声を絶対に変えさせないことが最重要★
    バッチは複数の場面（カフェ・駅・自宅…）を続けて含むので、
    場面が変わるたびに声を変えられると、切り分けた結果
    「問ごとに別人が読んでいる音源」になってしまう。
    それは1問ずつ録るより悪い。
    だから指示文で明示的に禁止する。
    """
    scenes = '; '.join(f'{p["marker"]} = {p["scene"]}' for p in plan)
    return (
        'Japanese university entrance exam (共通テスト) English listening audio. '
        'Clear standard American English, moderate and even pace, '
        'no background music, no sound effects, no emotional exaggeration. '
        f'{SPK_FEMALE} = an adult female native English speaker, voice {VOICE_FEMALE}. '
        f'{SPK_MALE} = an adult male native English speaker, voice {VOICE_MALE}. '
        f'{SPK_NARRATOR} = a calm neutral exam narrator, voice {VOICE_NARRATOR}, '
        'clearly distinct in timbre from both dialogue speakers, '
        'slightly slower and more formal than the dialogue. '
        '★CRITICAL: this recording contains several independent short dialogues. '
        'Each one starts with the narrator saying "Number one.", "Number two.", and so on. '
        'Use exactly the SAME three voices for the WHOLE recording. '
        'Do NOT change any voice, accent, age or tone between the dialogues, '
        'even though the scenes are different. '
        'Leave a clear pause of about one second before each "Number ..." line, '
        'and a clear pause before each "Question." line. '
        'Do not add any words that are not in the script.★ '
        f'Scenes for context only (do not read aloud): {scenes}'
    )


def main() -> None:
    ap = argparse.ArgumentParser(
        description='第2問 TTS のバッチ台本を作る（まとめ録り用）'
    )
    ap.add_argument(
        '--batch-size', type=int, default=DEFAULT_BATCH_SIZE,
        help=f'1バッチの問数（既定 {DEFAULT_BATCH_SIZE}）',
    )
    ap.add_argument(
        '--skip-existing', action='store_true',
        help='すでに MP3 がある問を除く（既定は全38問を対象にする）',
    )
    args = ap.parse_args()

    rows = load_manifest()
    assert_marker_is_safe(rows)

    targets = rows
    if args.skip_existing:
        skipped = [
            r['name'] for r in rows
            if (AUDIO_DIR / f'{r["name"]}.mp3').exists()
        ]
        targets = [
            r for r in rows if (AUDIO_DIR / f'{r["name"]}.mp3').exists() is False
        ]
        print(f'既存の MP3 を除外: {len(skipped)} 問 {skipped}')
        print(
            '※ 既存ぶんは「登場順」の話者番号かつ旧ナレーターで録音されています。\n'
            '   残すと38問の中で声の割り当てが違う問が混ざります。'
        )

    OUTDIR.mkdir(parents=True, exist_ok=True)

    batches: list[dict] = []
    for bi in range(0, len(targets), args.batch_size):
        chunk = targets[bi:bi + args.batch_size]
        no = bi // args.batch_size + 1
        script, plan = build_batch_script(chunk)
        requirements = build_batch_requirements(plan)

        stem = f'batch{no:02d}'
        (OUTDIR / f'{stem}.txt').write_text(script + '\n', encoding='utf-8')
        meta = {
            'batch': no,
            'stem': stem,
            'markerWord': MARKER_WORD,
            'count': len(chunk),
            'chars': len(script),
            'requirements': requirements,
            'questions': plan,
        }
        (OUTDIR / f'{stem}.json').write_text(
            json.dumps(meta, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
        )
        batches.append({
            'batch': no,
            'stem': stem,
            'count': len(chunk),
            'chars': len(script),
            'names': [p['name'] for p in plan],
        })
        print(f'{stem}: {len(chunk)} 問 / {len(script)} 文字 '
              f'/ {", ".join(p["name"] for p in plan)}')

    (OUTDIR / 'batches.json').write_text(
        json.dumps(batches, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )

    total_q = sum(b['count'] for b in batches)
    print()
    print(f'対象 {total_q} 問 を {len(batches)} 本にまとめました '
          f'（音声生成の呼び出しが {total_q} 回 → {len(batches)} 回）')
    print(f'出力先: {OUTDIR.relative_to(ROOT)}')
    print()
    print('★次にやること★')
    print('  1. batch01 だけを生成する（いきなり全部流さない）')
    print('  2. scripts/split_q2_tts_batch.py で切り分ける')
    print('  3. 切り分けた音声を聞いて検証する')
    print('  4. 問題なければ残りのバッチを生成する')


if __name__ == '__main__':
    main()

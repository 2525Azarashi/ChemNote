#!/usr/bin/env python3
"""
===================================================================
第2問 TTS 台本の生成（scripts/data/q2_tts/ を作る）
===================================================================

★このスクリプトは音声を作らない。「音声を作るための台本」を作る。★

-------------------------------------------------------------------
■ なぜ台本ファイルを別に作るのか
-------------------------------------------------------------------
第2問には配布 PDF に MP3 が付属しない。いまアプリは
ListeningAudioPlayer がブラウザの音声合成（SpeechSynthesis）で
turns を読み上げてしのいでいるが、これには弱点が3つある。

  1. 端末によって声が入っていない／日本語の声で英語を読んでしまう
  2. 読み上げ速度や間の取り方が本番と違う
  3. オフラインだと動かない端末がある

そこで将来 MP3 を用意するときに備え、
「どの問を、どの台本で、どの声で読ませるか」を
先にファイルとして確定させておく。

台本さえ確定していれば、あとは TTS を1回流すだけで済む。
台本を毎回その場で組み立てると、生成のたびに文言が揺れて
「同じ問なのに前回と読み上げが違う」という事故が起きる。

-------------------------------------------------------------------
■ 本番（共通テスト）の第2問の読み上げ順
-------------------------------------------------------------------
第2問は次の順で流れる。

    （2人の短い対話） → Question. （英語の設問文）

これが2回くり返される（2回読み）。
ただし「2回」はプレーヤー側で2回再生すれば足りるので、
音声ファイル自体は1回ぶんだけ作る。
（2回ぶんを1ファイルに焼くと、途中で止めて考えたい生徒が困る）

-------------------------------------------------------------------
■ 話者記号の扱い
-------------------------------------------------------------------
PDF のスクリプトは W / M / K / S / F / D という記号を使っている。
基本は W=女性・M=男性 だが、一部の問では M が「母親」を指す。
機械的に性別へ置き換えると嘘になるので、

  ・記号はそのまま保持する
  ・「登場順に Speaker 1, Speaker 2 …」へ割り当てる
  ・各話者が誰なのかは speakers 欄の日本語をそのまま声の指示に載せる

という方針をとる。こうすれば TTS 側には
「Speaker 1 は母親の声、Speaker 2 は高校生男子の声」と伝わる。

-------------------------------------------------------------------
■ 出力
-------------------------------------------------------------------
scripts/data/q2_tts/
  ├── manifest.json          … 全問の一覧（生成の指示書）
  ├── el2_set1_q1.txt        … 1問ぶんの読み上げ台本
  ├── el2_set1_q2.txt
  └── …

manifest.json の各要素:
  {
    "name":      "el2_set6_q3",            出力する MP3 の名前
    "audioUrl":  "/listening_audio/el2_set6_q3.mp3",
    "set": 6, "q": 3,
    "scene":     "男女がホームパーティーの…",  場面（日本語）
    "speakers":  "男性 / 女性",
    "voiceMap":  {"Speaker 1": "男性", "Speaker 2": "女性"},
    "script":    "Speaker 1: …\nSpeaker 2: …\nSpeaker 3: Question. …",
    "requirements": "…（声の指示。TTS へそのまま渡す）",
    "rewritten": true                       図に合わせて書き直した問か
  }

-------------------------------------------------------------------
■ 使い方
-------------------------------------------------------------------
    python3 scripts/gen_q2_tts_scripts.py

冪等。何度流しても同じ内容になる（＝差分が出ない）。

生成できたら、manifest.json を上から順に audio_generation へ渡し、
できた MP3 を public/listening_audio/ に置く。最後に

    python3 scripts/gen_listening_q2_data.py --with-audio

で audioUrl を埋める（--with-audio は MP3 が実在する問だけ埋める）。
===================================================================
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHUFFLED = ROOT / 'scripts' / 'data' / 'q2_shuffled.json'
OUTDIR = ROOT / 'scripts' / 'data' / 'q2_tts'

sys.path.insert(0, str(Path(__file__).resolve().parent))
from shuffle_listening_q2_options import PDF_ILLUSTRATION_QUESTIONS  # noqa: E402

# 図に合わせて文章側を書き直した問（音声も新しい台本で録り直す必要がある）
try:
    from q2_figure_fixes import FIXES

    REWRITTEN = frozenset(FIXES)
except Exception:  # pragma: no cover - FIXES が無くても台本は作れる
    REWRITTEN = frozenset()

# 話者記号 → 既定の声の性別。speakers 欄が具体的な場合はそちらを優先する。
DEFAULT_GENDER = {
    'W': '女性',
    'M': '男性',
    'K': '男子',
    'S': '男性',
    'F': '男性',
    'D': '男性',
}

# ナレーター（英語の設問文を読む声）は必ず対話の2人と別扱いにする。
NARRATOR = 'Speaker 3'


def tidy(text: str) -> str:
    """台本に載せる前に空白を整える。"""
    return ' '.join(text.split()).strip()


def speaker_roles(speakers: str) -> list[str]:
    """
    speakers 欄（例 '母親 / 息子（高校生）'）を役割の並びへ分解する。
    区切りが無ければ空リストを返し、呼び出し側で記号から補う。
    """
    if not speakers:
        return []
    return [tidy(part) for part in speakers.split('/') if tidy(part)]


def build_voice_map(turns: list[dict], speakers: str) -> dict[str, str]:
    """
    登場順に Speaker N を割り当て、それぞれが誰なのかを対応づける。

    speakers 欄の並び（左が先に話す人）と、対話の登場順は
    PDF 上でそろっているので、登場順どおりに突き合わせる。
    ずれている場合は記号の既定の性別で埋める（嘘をつかないため）。
    """
    order: list[str] = []
    for t in turns:
        if t['who'] not in order:
            order.append(t['who'])

    roles = speaker_roles(speakers)
    voice_map: dict[str, str] = {}
    for i, code in enumerate(order):
        if i < len(roles):
            role = roles[i]
        else:
            role = DEFAULT_GENDER.get(code, '話者')
        # 記号も残す。TTS には無害だが、人が読んで検証するときに効く。
        voice_map[f'Speaker {i + 1}'] = f'{role}（記号 {code}）'
    return voice_map


def build_script(turns: list[dict], question: str) -> str:
    """
    「対話 → Question. 設問」の順に並べた読み上げ台本を作る。

    Speaker N 表記にするのは、elevenlabs/v3-tts などの
    複数話者対応 TTS がこの前置きを見て声を切り替えるため。
    """
    order: list[str] = []
    for t in turns:
        if t['who'] not in order:
            order.append(t['who'])
    label = {code: f'Speaker {i + 1}' for i, code in enumerate(order)}

    lines = [f'{label[t["who"]]}: {tidy(t["text"])}' for t in turns]
    lines.append(f'{NARRATOR}: Question. {tidy(question)}')
    return '\n'.join(lines)


def build_requirements(voice_map: dict[str, str], scene: str) -> str:
    """
    TTS へ渡す声の指示文。共通テストの音源に寄せることを明示する。

    ・BGM なし（本番は無音）
    ・過度な感情表現を避ける（聞き取りの難易度が変わってしまう）
    ・設問文は少しゆっくり、フォーマルに
    """
    who = '. '.join(
        f'{spk} = {role} の英語ネイティブの声' for spk, role in voice_map.items()
    )
    return (
        'Japanese university entrance exam (共通テスト) English listening audio. '
        'Clear standard American English, moderate and even pace, '
        'no background music, no sound effects, no emotional exaggeration. '
        f'{who}. '
        f'{NARRATOR} = a calm neutral narrator reading the exam question, '
        'slightly slower and more formal than the dialogue, clearly separated '
        'from it by a short pause. '
        f'Scene for context (do not read aloud): {scene}'
    )


def collect() -> list[dict]:
    """公開中の問だけを、セット順・問順に集める。"""
    sets = json.loads(SHUFFLED.read_text(encoding='utf-8'))
    rows: list[dict] = []
    for s in sets:
        set_no = s['set']
        for q in s['questions']:
            q_no = q['q']
            if (set_no, q_no) not in PDF_ILLUSTRATION_QUESTIONS:
                continue  # イラストが無い問はアプリに出ていないので音声も要らない
            name = f'el2_set{set_no}_q{q_no}'
            voice_map = build_voice_map(q['turns'], q.get('speakers', ''))
            rows.append(
                {
                    'name': name,
                    'audioUrl': f'/listening_audio/{name}.mp3',
                    'set': set_no,
                    'q': q_no,
                    'scene': tidy(q.get('scene', '')),
                    'speakers': tidy(q.get('speakers', '')),
                    'voiceMap': voice_map,
                    'script': build_script(q['turns'], q['question']),
                    'requirements': build_requirements(
                        voice_map, tidy(q.get('scene', ''))
                    ),
                    'rewritten': (set_no, q_no) in REWRITTEN,
                }
            )
    return rows


def main() -> int:
    if not SHUFFLED.exists():
        print(f'{SHUFFLED} がありません。先に shuffle を回してください。')
        return 1

    rows = collect()
    OUTDIR.mkdir(parents=True, exist_ok=True)

    # 1問1ファイル。人が中身を確認・手直しできるようにテキストで置く。
    for r in rows:
        (OUTDIR / f'{r["name"]}.txt').write_text(r['script'] + '\n', encoding='utf-8')

    (OUTDIR / 'manifest.json').write_text(
        json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8'
    )

    rewritten = [r['name'] for r in rows if r['rewritten']]
    print(f'{OUTDIR.relative_to(ROOT)} に台本 {len(rows)} 問を書きました。')
    print(f'  うち図に合わせて書き直した問: {len(rewritten)} 問')
    for n in rewritten:
        print(f'    - {n}')
    print('  manifest.json を上から順に TTS へ渡してください。')
    print('  できた MP3 は public/listening_audio/ に置きます。')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

"""第2問リスニングの台本を「1問 = 1本」で出す（まとめ録りをしない版）。

===================================================================
■ なぜ「1問ずつ」版を用意するのか
===================================================================
まとめ録り（gen_q2_tts_batches.py）は6問を1本にまとめるので、
呼び出し回数が 38回 → 7回 に減る。安いのはこちらである。

しかし★1回の生成に必要なクレジットが大きい★ため、
残量が少ないときは「6問ぶんの1本」が通らないことがある。
実際 batch03 は2回続けて弾かれた。

1問ずつなら1回が軽いので、残量が少なくても通る可能性がある。

    まとめ録り … 1回が重い / 合計は安い / 残量が少ないと詰む
    1問ずつ   … 1回が軽い / 合計は高い / 少しずつでも前に進む

つまり★「合計の安さ」より「1回の通りやすさ」を取る作戦★。
どちらが良いかは残量次第なので、両方を残しておく。

===================================================================
■ ★まとめ録り版と声を必ず揃える（ここが一番大事）★
===================================================================
既存の12問（batch01・batch02）は次の声で録ってある。

    Speaker 1 = 女性役     Adeline
    Speaker 2 = 男性役     Mark
    Speaker 3 = ナレーター Daniel

★同じ第2問の中で声が変わると、生徒には「別の教材が混ざった」
  ように聞こえる。★ 特にナレーターが変わると、
  「誰が質問しているのか」の手がかりが問ごとにブレて解きにくい。

そこでこのスクリプトは、まとめ録り版と同じ関数
（q2_tts_voices.gender_of / VOICE_FEMALE / VOICE_MALE / VOICE_NARRATOR）
を読み込んで台本を作る。声の定義は q2_tts_voices.py にしか無いので、
片方だけ変わることが起きない。

★注意★ scripts/data/q2_tts/manifest.json の requirements は
  「登場順」時代の古い指示文で、★声の名前が入っていない★。
  あれをそのまま TTS へ渡すと声が固定されず、既存12問とズレる。
  だからこのスクリプトが requirements を作り直す。

===================================================================
■ 話者番号は「性別順」に振り直す
===================================================================
manifest の voiceMap は「登場順」で Speaker 1 / 2 を振っている。
つまり問によって Speaker 1 が女性のときと男性のときがある。

1問ずつでも、番号の意味は全問で揃えておく。理由は2つ。

  1. まとめ録りで録った12問と混在するため、
     ★同じ問集の中で番号の意味が変わってはいけない★
  2. あとで「この音源の Speaker 2 は誰か」を人が確認するとき、
     問ごとに規則が違うと必ず間違える

振り直しは rebuild_by_gender()（gen_q2_tts_batches.py）を再利用する。
同じ処理を2か所に書くと片方だけ直して不整合を起こすため。

===================================================================
■ 使い方
===================================================================
    # 未録音の問だけ台本を出す（既定）
    python3 scripts/gen_q2_tts_single.py

    # 特定の問だけ
    python3 scripts/gen_q2_tts_single.py --only el2_set6_q2

    # 先頭 N 問だけ（クレジットが少ないとき）
    python3 scripts/gen_q2_tts_single.py --limit 3

    # 録音済みも含めて全38問
    python3 scripts/gen_q2_tts_single.py --all

出力先: scripts/data/q2_tts_single/<name>.{txt,json}
    .txt  … TTS の query にそのまま渡す台本
    .json … requirements と声の対応表（人が検証するため）

===================================================================
■ 生成したあとの手順（★まとめ録りとの違い★）
===================================================================
1問ずつの音声は★切り分けが不要★。
そのため次の2つは「やらない」。

    ・"Number one." の合図を入れない
      （1問しか入っていないので切る必要がない。
        合図を入れると音源に余計な語が残る）
    ・split_q2_tts_batch.py を使わない

やることは3つだけ。

  1. 生成した mp3 を public/listening_audio/<name>.mp3 として置く
  2. python3 scripts/gen_listening_q2_data.py で audioUrl を貼る
  3. npx vitest run tests/englishListeningQ2Sets.test.ts / tsc / build

■ 声の検証について
  scripts/verify_q2_tts_speakers.py は「1本の中に3役が入っている」
  前提の道具なので、1問ずつの音源でもそのまま使える
  （1問の中に女性役・男性役・ナレーターが全員いる）。
  ただし区間数が少ないので、判定は参考程度に見ること。
  まとめ録りの12問で Daniel の分離は既に確認済み。
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

# ★声の定義とふるまいは1か所に集める★
# 同じ内容をここに書き写すと、片方だけ変えたときに
# 既存12問と声が食い違う事故が起きる。
from q2_tts_voices import (  # noqa: E402
    VOICE_FEMALE,
    VOICE_MALE,
    VOICE_NARRATOR,
)
from gen_q2_tts_batches import (  # noqa: E402
    SPK_FEMALE,
    SPK_MALE,
    SPK_NARRATOR,
    load_manifest,
    rebuild_by_gender,
)

OUT_DIR = ROOT / 'scripts' / 'data' / 'q2_tts_single'
AUDIO_DIR = ROOT / 'public' / 'listening_audio'


def already_recorded(name: str) -> bool:
    """
    その問の mp3 がもう置いてあるか。

    サイズも見るのは、0バイトや途中で切れたファイルを
    「録音済み」と誤認しないため。
    """
    path = AUDIO_DIR / f'{name}.mp3'
    return path.exists() and path.stat().st_size > 1000


def build_single_requirements(row: dict, first_speaker: str) -> str:
    """
    1問ぶんの声の指示文を作る。

    ★まとめ録り版との違い★
    まとめ録り版には「1本に複数の対話が入っているので
    途中で声を変えるな」という強い注意書きが必要だった。
    1問ずつではその心配が無いので、その部分を落としている。

    ★共通させること★
    声の名前（Adeline / Mark / Daniel）は必ず書く。
    これが無いと TTS が毎回違う声を選び、
    既存12問と声がズレる。

    ★「入れ替えるな」を必ず入れる（実際に起きた事故）★
    この注意書きが無い状態で生成した el2_set10_q1 は、
    台本では Speaker 2（男性）が先頭なのに
    ★女性が先に話す音源になった★。
    第2問はイラストを選ぶ形式なので、設問に
    "she" / "the woman" / "the boy" が入る問で入れ替わると
    正解が変わって問題が成立しなくなる。
    そこで
      ・"Do not swap them"
      ・「台本は Speaker N から始まるので
        □性の声が最初に話す」という具体的な指定
    を入れることにした。これを入れてからの4問は
    すべて台本どおりになった。

    ただし指示文だけでは保証できないので、録音後に必ず
    scripts/verify_q2_single_gender.py で実測確認すること。
    """
    scene = row.get('scene', '')
    first_gender = 'female' if first_speaker == SPK_FEMALE else 'male'
    return (
        'Japanese university entrance exam (共通テスト) English listening audio. '
        'Clear standard American English, moderate and even pace, '
        'no background music, no sound effects, no emotional exaggeration. '
        f'{SPK_FEMALE} = an adult female native English speaker, '
        f'voice {VOICE_FEMALE}. '
        f'{SPK_MALE} = an adult male native English speaker, '
        f'voice {VOICE_MALE}. '
        f'{SPK_NARRATOR} = a calm neutral exam narrator, voice {VOICE_NARRATOR}, '
        'clearly distinct in timbre from both dialogue speakers, '
        'slightly slower and more formal than the dialogue, '
        'separated from the dialogue by a clear pause. '
        '★CRITICAL: use exactly these three voices, and keep the speaker '
        'assignment exactly as written in the script. '
        f'{SPK_FEMALE} must be female, {SPK_MALE} must be male. '
        f'The script begins with {first_speaker}, '
        f'so a {first_gender} voice must speak first. '
        'Do not swap them. '
        'Do not add any words that are not in the script. '
        'Do not add an introduction, a number, or a closing remark.★ '
        f'Scene for context (do not read aloud): {scene}'
    )


def main() -> None:
    ap = argparse.ArgumentParser(
        description='第2問リスニングの台本を1問=1本で出す',
    )
    ap.add_argument(
        '--all',
        action='store_true',
        help='録音済みも含めて全38問を出す',
    )
    ap.add_argument(
        '--only',
        metavar='NAME',
        help='この問だけ出す（例 el2_set6_q2）',
    )
    ap.add_argument(
        '--limit',
        type=int,
        metavar='N',
        help='先頭 N 問だけ出す（クレジットが少ないとき）',
    )
    args = ap.parse_args()

    rows = load_manifest()

    if args.only:
        rows = [r for r in rows if r['name'] == args.only]
        if not rows:
            raise SystemExit(f'その問が manifest にありません: {args.only}')
    elif not args.all:
        rows = [r for r in rows if not already_recorded(r['name'])]

    if args.limit is not None:
        if args.limit < 1:
            raise SystemExit('--limit は1以上にしてください')
        rows = rows[: args.limit]

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # ★録音が済んだ問の台本は消す★
    # 残しておくと「このディレクトリの中身＝残り作業」が崩れ、
    # 同じ問をもう一度生成してクレジットを無駄にする事故が起きる。
    # --only / --all のときは意図して指定しているので触らない。
    #
    # ★この掃除は「出す台本が無い」判定より前に行う★
    #   以前は後ろに置いていたため、最後の1問を録り終えて
    #   rows が空になった瞬間に return してしまい、
    #   録音済みの台本が消えずに残った（38問完走時に実際に発生）。
    #   「全部録り終わったのにディレクトリに6問ぶん残っている」
    #   状態はまさに事故の元なので、掃除を先にやる。
    if not args.only and not args.all:
        cleaned = 0
        for stale in sorted(OUT_DIR.glob('*.txt')):
            if already_recorded(stale.stem):
                stale.unlink()
                (OUT_DIR / f'{stale.stem}.json').unlink(missing_ok=True)
                cleaned += 1
        if cleaned:
            print(f'録音済みの台本を削除: {cleaned} 問')

    if not rows:
        print('出す台本がありません（すべて録音済み）。')
        return

    print(f'出力先: {OUT_DIR.relative_to(ROOT)}')
    print(f'声: {SPK_FEMALE}={VOICE_FEMALE} / '
          f'{SPK_MALE}={VOICE_MALE} / {SPK_NARRATOR}={VOICE_NARRATOR}')
    print()

    for row in rows:
        # ★まとめ録り版と同じ関数で振り直す★
        # 1問ずつでも番号の意味を全問で揃えるため。
        lines, used = rebuild_by_gender(row)
        script = '\n'.join(lines)

        # 合図（"Number one." など）は入れない。
        # 1問しか入っていないので切り分けが不要で、
        # 入れると音源に余計な語が残るだけ。
        if 'Number' in script:
            raise ValueError(
                f'{row["name"]}: 台本に "Number" が含まれています。'
                '1問ずつ版では合図を入れないため、'
                '台詞に Number が出る問は台本を見直してください。'
            )

        name = row['name']
        (OUT_DIR / f'{name}.txt').write_text(script + '\n', encoding='utf-8')

        first_spk = lines[0].split(':', 1)[0]
        meta = {
            'name': name,
            'set': row['set'],
            'q': row['q'],
            'scene': row.get('scene', ''),
            'speakers': row.get('speakers', ''),
            'chars': len(script),
            'voices': used,
            'originalVoiceMap': row['voiceMap'],
            'firstSpeaker': first_spk,
            'requirements': build_single_requirements(row, first_spk),
        }
        (OUT_DIR / f'{name}.json').write_text(
            json.dumps(meta, ensure_ascii=False, indent=2) + '\n',
            encoding='utf-8',
        )

        mark = '録音済' if already_recorded(name) else '未録音'
        print(f'  {name:16s} {mark}  {len(script):4d}字  先に話す: {first_spk}')

    print()
    print(f'{len(rows)} 問の台本を出しました。')
    print()
    print('★次にやること★')
    print('  1. 1問ずつ音声を生成する')
    print(f'       台本      … {OUT_DIR.relative_to(ROOT)}/<name>.txt の中身')
    print(f'       声の指示  … 同 <name>.json の requirements')
    print('       モデル    … elevenlabs/v3-tts')
    print('  2. mp3 を public/listening_audio/<name>.mp3 として置く')
    print('     ★切り分けは不要★（1問しか入っていないため）')
    print('  3. python3 scripts/gen_listening_q2_data.py で audioUrl を貼る')


if __name__ == '__main__':
    main()

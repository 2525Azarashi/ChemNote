# audio_sources — 旧音源と新音源の保管庫（アプリには入らない）

リスニング音源を「商用権未確認の旧音源」と「商用条件を確認して作り直した新音源」に**分けて恒久保存**する場所。
アプリが実際に鳴らすのは `public/listening_*/` の1種類だけ。このフォルダは public の外なのでビルド（dist）に含まれない。

```
audio_sources/
  legacy/                      旧音源（差し替え前の public のファイルそのまま。商用公開しない）
    listening_audio/el1A_set1_q1.mp3 …
  commercial/                  新音源の元ファイル（高音質マスター）と受領記録
    elevenlabs_2026-09-19_q1a-set1/
      listening_audio/el1A_set1_q1.flac …   取り込みに使った元ファイル
      receipt/                               受け取った原本・受領記録・分割記録
```

- **手で置かない・消さない。** `scripts/listening-audio.mts import … --apply --batch <名前>` が自動で保存する。
- 旧音源は「最初に差し替えるとき」に1回だけ `legacy/` へ保存される（2回目以降の差し替えで新音源を旧扱いしない）。
- 旧音源に戻す：`npx tsx scripts/listening-audio.mts use-legacy <stem | chapterId | all>`
- どの音源がどちらか・生成元・商用の根拠：`scripts/data/listening_audio_ledger.json`（`status: replaced` が新音源）
- 手順の全体：`docs/LISTENING_AUDIO_REPLACE.md`

# Gemini 向け案内

**最初に `AGENTS.md` を読んでください。** ルール・読む順番・作業手順はすべてそこにあります。

1. `AGENTS.md` … 共通ルール（全AI共通）
2. `docs/CODEMAP.md` … どこに何があるか
3. リスニング音源の差し替え → `docs/LISTENING_AUDIO_REPLACE.md`

特に注意（間違えやすい点）：

- 大きいファイル（`src/App.tsx` など）を全部読もうとしない。`grep -n` で場所を探して一部だけ読む。
- `.generated.` の付いたファイルは編集しない。
- 音源は `npx tsx scripts/listening-audio.mts import <フォルダ>` で入れる。手でコピー・改名しない。
- PR本文には「リスニング配布判断」など4行が必須（`AGENTS.md` §5）。

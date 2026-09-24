# AI作業ガイド（どのAIでも最初にこれを読む）

Claude / Gemini / GPT など、どのAIが作業してもこのファイルが共通の入口です。
`CLAUDE.md` と `GEMINI.md` はこのファイルへの案内だけです。

---

## 1. 作業を始める前に読む順番

1. **このファイル**（ルール）
2. **`docs/CODEMAP.md`**（どこに何があるか。ファイルを探す前に必ず見る）
3. 作業内容に応じて1つだけ：
   - リスニング音源の追加・差し替え → **`docs/LISTENING_AUDIO_REPLACE.md`**
   - 対戦 → `docs/BATTLE.md`
   - 化学の問題・表記 → `docs/UNIT_GUIDE.md`
   - PR の書き方（リスニング配布判断）→ `docs/LISTENING_DERIVATIVE.md`

README.md の前半は古い作業メモです。構造の把握には CODEMAP.md を使ってください。

---

## 2. 絶対に守るルール（破るとアプリが壊れる・データが消える）

1. **`.generated.` が名前に入ったファイルを手で編集しない。** 元データを直してコマンドで作り直す（CODEMAP.md §3）。
2. **リスニング音源のファイル名を変えない。手でコピーしない。** 必ず `scripts/listening-audio.mts` を使う。
3. **`src/data/listeningSets/*.json`（第4〜6問の台本）を書き換えない。** 配布元で検査済みのデータ。
4. **`src/App.tsx` を大きく書き換えない。** 画面の追加・変更は `src/components/` 側で行い、App.tsx は呼び出しの1〜数行だけ触る。
5. **`firestore.rules` を変えたら**、Firebase への反映が別途必要だとユーザーに伝える（`docs/いまやること.md`）。
6. **`.tmpwork/`・`.delivery/`・`core`・`dist/` はコミットしない**（.gitignore 済み。`git add -A` の前に `git status` で確認）。
7. **作業していない機能を「完了」「送付済み」と書かない。** やっていないことは「未実施」と書く。
8. UI・デザインを頼まれていない作業で変えない。
9. **対戦の制限時間・カウントダウンを延ばさない**（Firestore ルールで締切は60秒未満。超えるとオンライン対戦だけ開始できなくなる。CODEMAP.md の⚠参照）。
10. **`audio_sources/legacy/`（旧音源）を消さない・public に戻さない。** 旧音源に戻すときは `use-legacy` コマンドを使う。
11. 外部から届いたパッチ（ZIP）は古い版を元に作られていることが多い。`git apply --check` が失敗したら、今の構造を残したまま**追加部分だけ手で合わせる**（今ある教材を消さない）。

---

## 3. 作業の進め方（この順番で）

1. `git status` と `git log --oneline -5` で現在の状態を確認
2. CODEMAP.md で触るファイルを決める
3. 大きいファイルは `grep -n "キーワード" ファイル` で場所を探し、その周辺だけ読む
4. 変更する
5. 確認する：
   - `npx tsc --noEmit`（型エラーが無いこと。既存のエラーと新しいエラーを区別する）
   - 関係するテストだけ：`npx vitest run tests/<関係するファイル>.test.ts`
   - 問題データを変えたら：`npm run gen:battle-pool`
   - 音源を変えたら：`npx tsx scripts/listening-audio.mts check`
6. コミット → PR（下の §5）

サンドボックスで `npm run build` はメモリ不足で落ちることがある。アプリの不具合ではない（`docs/BUILD.md`）。

---

## 4. よく頼まれる作業の最短手順

| 依頼 | 手順 |
|---|---|
| 録り直したリスニング音源を入れて | `docs/LISTENING_AUDIO_REPLACE.md` §2 のコマンド4つ |
| どの音源が差し替え済みか | `npx tsx scripts/listening-audio.mts status` |
| 音源のファイル名一覧が欲しい | `npx tsx scripts/listening-audio.mts list --tsv .tmpwork/audio-list.tsv` |
| 問題の誤字を直して | CODEMAP.md §2 で教科のファイルを探す → 直す → `npm run gen:battle-pool` |
| 教科を隠して/出して | `src/config/features.ts` |
| とびら君のセリフ | `src/data/mascotTips.ts` |

---

## 5. Git と PR

- ブランチ：`genspark_ai_developer`、PR 先：`main`（リポジトリ `2525Azarashi/ChemNote`）
- コミットメッセージ：`type(scope): 説明`（例 `feat(listening-audio): 第3問の音源を差し替え`）
- **PR本文に必ず次の4行**（どちらか1つを選ぶ。詳細 `docs/LISTENING_DERIVATIVE.md`）：

```
リスニング配布判断: リスニングにも送ってください。   ← または「リスニングには送らないでください。」
リスニング配布理由: （理由）
リスニング対象: （変更したファイル）
リスニング受け渡し状況: 未送付。（実際に送っていなければ必ず「未送付」）
```

音源・ガチャ・コイン・対戦・保存・セキュリティなど共通部分の変更は原則「送ってください」。
化学など統合版だけの教科の変更は「送らないでください」＋理由。

---

## 6. 用語

| 用語 | 意味 |
|---|---|
| マナトビ / ChemNote | このアプリ（ChemNote はリポジトリ名） |
| 統合版 | このリポジトリ。全教科入り |
| リスニング専用版 | 2026-09-18 に分岐した別コピー（`scripts/listening-export/`） |
| chapterId | 単元のID。リスニングは `el1_A`〜`el6_B`、化学基礎 `c1_1`、化学 `a1_1` など |
| audioTracks / audioUrl | リスニング問題が持つ音源情報 / 音源ファイルのパス |
| 台帳（ledger） | 音源ごとの生成元・商用権の記録 `scripts/data/listening_audio_ledger.json` |
| とびら君 | マスコットキャラ |
| マナコイン | アプリ内通貨（ガチャ等） |

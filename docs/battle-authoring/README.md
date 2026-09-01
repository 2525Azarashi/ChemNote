# 手書き対戦問題（authored）— 運用の手引き

このディレクトリは **本体側（このリポジトリ）** の運用手順を書いたもの。
作業場（別ルーム）に渡すのは `PROMPT.md`（全教科共通・1本）のほう。
範囲の割り当ては `ASSIGNMENTS.md`（★本体だけが持つ台帳★）で管理する。

---

## 1. これは何を解決するものか

### 問題

対戦プールは既存の演習データから **機械変換** で作っている（`scripts/gen-battle-pool.mts`）。
だが変換できる形の設問が少なく、大半が出題されていない。

```
chemistry_basic       159問 出題  /  825問 未出題
chemistry              10問       /   73問
english_listening     146問       /   98問
biology_basic          62問       /  161問
english_grammar       100問       /    0問
geography             127問       /   10問
───────────────────────────────────────────
合計 1,167問中 604問しか対戦に出ていない
```

**出せないのは問題が悪いからではない。** 対戦画面（1画面・選択肢かカナ入力）に
合う形になっていないだけである。

### 過去にやって失敗したこと

`USE_SYNTHESIZED_FORMATS = true`（`gen-battle-pool.mts` line 156）で、
スクリプトに形式を合成させた。壊れた。原因は3つ。

1. **誤答を機械的に借りた** — `answersByChapter` から同じ章の他の設問の答えを
   持ってきて誤答にした。結果、誤答のほうが正しい問題ができた
2. **リード文を切った** — 「文章中の( ア )」だけを取り出したので、
   画面を見ても何を聞かれているか分からなくなった
3. **表記ゆれを固定できなかった** — 「割合（または組成）」のような答えを
   カナ入力にして、正しく答えても不正解になった

これを見て「AI に作らせると壊れる」と判断したのは **誤りだった**。
壊れたのは **スクリプトが問題を読まずに機械的に処理したから** であって、
**問題を読んだうえで意図して誤答を作る作業** はまったく別物である。

### 解決

- 元データを **省略せずに** 書き出して、AI に **全部読ませる**
- AI は **1問1問** 作り直す（大問を分割して、同じ内容を聞く小問にする）
- 壊れ方3種を **機械的に検出する検証器** を通す
- 成果物は **JSON のテキストのみ**。★作業場は git を触らない・ZIP も作らない★
- 受け渡しは **チャットに貼るだけ**。ファイルへの格納は本体がやる

---

## 2. ★なぜ作業場に git を触らせないのか／なぜ範囲を本体が切るのか★

教科・範囲ごとに **複数の作業場（別ルームの AI）を並列で動かす**。

### 理由1 — 生成ファイルが壊れる

それぞれが PR を出すと：

- 同じファイル（`battlePool.ts` / `pool.*.generated.ts`）を同時に書き換える
- **後からマージした PR が、先のものを上書きして消す**
- 生成ファイルは数百行あり、コンフリクトを人間が正しく解決できない

### 理由2 — ★作業場は PR を出さない＝進捗がどこにも記録されない★

以前は「章ごとにプロンプトを分けて、作業場に担当章を選ばせる」設計だった。**これは破綻している。**
作業場は push しないので、**誰がどの章をやったかが記録に残らない**。
複数の作業場を同時に動かせば、必ず取り合いと重複が起きる。

だから **範囲は本体（人間）が先に切って割り当てる**。台帳は `ASSIGNMENTS.md`。
プロンプトは `PROMPT.md` **1本だけ**で、**§0 の「担当範囲」の枠だけを差し替えて渡す**。

```
本体（ここ）                      作業場A            作業場B            作業場C
──────────────────────────────────────────────────────────────────────────
① ASSIGNMENTS.md で範囲を切る
② PROMPT.md の §0 だけ書き換えて渡す → 化学基礎前半     化学基礎中盤      生物基礎
③                                      JSON を書く      JSON を書く       JSON を書く
④                            ←──────  チャットで返す（git 無し・ZIP 無し）
⑤ 本体が authored/ に格納
⑥ verify → gen:battle-pool → PR は1つだけ
```

★ZIP 方式（`pack:authored` / `import:authored`）は **運用ではもう使わない**。★
スクリプトはリポジトリに残っているが、作業場に ZIP を作らせない。

---

## 3. コマンド一覧

| コマンド | 誰が | 何をする |
|---|---|---|
| `npm run export:chapter -- <教科> <章ID>` | 作業場 | 章の元データを省略なく Markdown 化 |
| `npm run export:chapter -- <教科> --all` | 作業場 | 全章ぶん出す |
| `npm run verify:authored` | 両方 | `authored/` の JSON を全部検証 |
| `npm run verify:authored -- --survey <教科>` | 本体 | 未出題の小問を数える |
| `npm run verify:authored -- --file <パス>` | 本体 | 1ファイルだけ検証（見本の検査） |
| ~~`npm run pack:authored`~~ | — | ★運用では使わない（ZIP 方式は廃止）★ |
| ~~`npm run import:authored`~~ | — | ★運用では使わない（ZIP 方式は廃止）★ |
| `npm run gen:battle-pool` | 本体 | プールを再生成（**ここで手書きが対戦に載る**） |
| `npx vitest run tests/authoredConvert.test.ts` | 本体 | 変換の検査（33件） |
| `npm run lint:scripts` | 本体 | `scripts/` の型チェック |

---

## 4. 本体側の手順

### 4-1. 作業場を立てる前に

```bash
# その教科がどれだけ出せていないかを見る
npm run verify:authored -- --survey chemistry_basic
```

章ごとの「機械生成で出せている数 / 総小問数」が出る。
**出せている数が少ない章から** 作業場を立てる。

### 4-2. 作業場に渡すもの

1. `docs/battle-authoring/ASSIGNMENTS.md` で **範囲を1つ決める**（状態を `作業中` にする）
2. `docs/battle-authoring/PROMPT.md` の **§0 の枠だけ** を書き換える
   ```
   【担当範囲】     化学基礎 中盤
   【教科ID】       chemistry_basic
   【担当する章ID】 c3_1  c3_2  c3_3
   【作業場の名前】 room-cb-2
   ```
3. **ファイル本文を丸ごとコピーして作業場に貼る**
4. リポジトリへのアクセス（元データを読むため）

★作業場に章を選ばせない。★ 範囲は本体が切って渡す。

### 4-3. JSON がチャットで返ってきたら

作業場は **章ごとに1回ずつ** `=== AUTHORED / … ===` の見出し付きで返してくる。

```bash
# 1) 本体が手で（またはヒアドキュメントで）ファイルに落とす
#    src/battle/data/authored/<教科ID>.<章ID>.json

# 2) 検証（エラー0になるまで直す）
npm run verify:authored -- <教科ID>
```

- 分割して返ってきた場合は `questions` 配列を順に連結して1ファイルにする
- `id` が重複したら **後勝ちを捨てる**
- 受領したら `ASSIGNMENTS.md` の状態を `受領` → 取り込み後に `取り込み済` にする

### 4-4. 全部そろったら再生成

```bash
npm run gen:battle-pool
npm run lint
npm run build
```

そのあと **本体が1つの PR** を出す。

---

## 5. ファイルの役割

```
src/battle/core/authoredTypes.ts       型の定義（葉モジュール・import 0）
src/battle/data/authored/              取り込んだ JSON の置き場
  .gitkeep                             ★ここに見本を置かない★（id 重複の原因になる）
scripts/export-chapter-source.mts      元データ → Markdown（省略なし）
scripts/verify-authored-battle.mts     検証（検査A〜F）
scripts/pack-authored-zip.mts          （ZIP 方式の名残・★運用では使わない★）
scripts/import-authored-zip.mts        （ZIP 方式の名残・★運用では使わない★）
docs/battle-authoring/
  README.md                            ★このファイル★（本体側の手順）
  PROMPT.md                            ★作業場に渡す指示書（全教科共通・§0 だけ差し替え）★
  ASSIGNMENTS.md                       ★範囲の割り当て台帳（本体だけが持つ）★
  example.chemistry_basic.c1_1.json    検証を通った見本12問
tsconfig.scripts.json                  scripts/ の型チェック用
```

---

## 6. 検証器（`verify-authored-battle.mts`）が見ているもの

| | 検査 | 落とす理由 |
|---|---|---|
| A | id の形・重複 | 取り込み時に問題が消える |
| B | `source` が元データに実在するか | **存在しない＝元データを読まずに書いた** |
| C | 選択肢の数・`correct` が1つ・重複・**包含関係**・`why` の有無 | 過去の失敗1（誤答を借りた） |
| D | kana がカタカナ2〜8字・**五十音パネルから打てるか** | 過去の失敗3（表記ゆれ） |
| E | **正解が元データに実在するか**（無ければ `grounding` 必須、それも実在照合） | 事実でない問題を防ぐ |
| F | `prompt` 150字・**画面に無いものへの参照**・`timeLimit` 8〜30・`oneLine` 10〜120字 | 過去の失敗2（リード文を切った） |

### 負のテストで確認済み

わざと壊した5問を投入して **9件のエラーが出る** ことを実際に確認した。

```
「上の文章」は対戦画面に存在しないものを指している
oneLine は 10〜120文字（今: 7文字）
選択肢「純物質」と「純物質・混合物」が包含関係にある
元データに存在しない小問を指している: c1_1/q1/q1_zzz
正解「ゼンゼンチガウゴ」が元の大問の本文・解説・解答のどこにも見つからない
選択肢[1]「気体」に why が無い（×3）
kana の答えはカタカナ（＋長音）だけ（今: "化合物"）
```

**過去に壊した3つの原因が、すべて機械的に検出される。**

---

## 7. 取り込み側（実装済み）

`npm run import:authored` で `authored/` に JSON が入ったあと、
**`npm run gen:battle-pool` が実際に対戦プールへ合流させる**。ここまで実装済み。

### 何が起きるか

```
src/battle/data/authored/chemistry_basic.c1_1.json
      ↓  npm run gen:battle-pool
src/battle/data/pool.chemistry_basic.generated.ts   ← "a:..." の行が増える
src/battle/data/battlePool.ts                       ← POOL_COUNTS / POOL_FORMAT_COUNTS が更新される
```

生成のログに必ず次の行が出る。**0問なら取り込めていない**ので、そこで気づける。

```
[gen:battle-pool] うち手書き（別の作業場が書いたもの）: 12 問
[gen:battle-pool] 教科別:
  chemistry_basic  171問 ... 未使用 825  手書き 12
```

### 変換の規則

| 手書きの JSON | 生成されるプール |
|---|---|
| `format: "choice"`（2・3・5・6択） | `format: 'choice'` / `panelOrder: []` |
| `format: "choice4"`（4択） | `format: 'choice4'` |
| `options[].correct: true` の位置 | **ID を種に並べ替えたあとの** `answerIndex` |
| `format: "kana"` / `answer` | `options: []` / `answerIndex: -1` / `panelOrder: KANA_KEYS の添字` |
| `timeLimit` | 8〜30秒に丸める（範囲外でも落とさない） |

### 機械生成と重なったとき

同じ小問（`chapterId` / `problemId` / `subQuestionId` の3つ組）から
機械生成と手書きの両方ができた場合は **手書きを優先**し、機械生成側をプールから外す。

**一部だけ残すと同じ小問が1試合に2回出る**（抽選の重複排除は `id` で見るので防げない）。
実測で `c1_1` の見本を入れると1問が置き換わり、ログにこう出る。

```
うち手書き: 13 問（うち 1 問は機械生成を置き換えた）
```

### 落としたときは理由が出る

「なぜか出題されない」が作業場にとって一番たちが悪いので、
落とした問題は**必ず ID と理由をログに出す**。

```
[gen:battle-pool] ★手書きのうち 3 問を落とした★
  - a:c1_1:q1:q1_zzz:1: 元データに存在しない小問を指している (c1_1:q1:q1_zzz)
  - a:c1_1:q2:q2_1:9: correct: true がちょうど1つになっていない
  - a:c1_1:q1:q1_a:1: 同じ id が既にある（あとから来たほうを捨てた）
```

### ★変換の判断は生成器の中に書いていない★

判断そのものは `src/battle/core/authoredConvert.ts` にある。理由は1つ。

> 生成スクリプトの中に書くと **テストから呼べない**
> （`gen-battle-pool.mts` は import した瞬間に `main()` が走り、
>   全教科データを読んで生成ファイルを書き換えてしまう）。

過去の事故（`USE_SYNTHESIZED_FORMATS`）は
**「生成器の中だけにあって誰にも検査されないロジックが、壊れた問題を本番に出した」**
というものだった。同じ形にはしない。

検査は `tests/authoredConvert.test.ts`（33件）。
`correct: true` の個数を見るガードを意図的に壊すとテストが落ちることを実測で確認している
（＝テストが飾りになっていない）。

```
npx vitest run tests/authoredConvert.test.ts    # ★全体実行は OOM。ファイル単位で★
```

---

## 7-B. まだやっていないこと

- [ ] `oneLine` を `BattleResult.tsx` に出す（①対戦 → ②演習 の橋）
      → いまは `authoredConvert.ts` が `oneLine` をプールに運んでいない。
        プールのタプルに欄を足すか、別ファイルに解答だけを分けるかの判断が要る
- [ ] 誤答タグ（`options[].why` がその材料になる）
- [ ] 英語リスニングに「聞き取った語を入力する」形式を足すか
      → 英単語は五十音パネルで打てないので、英字入力の新設が必要（`docs/LISTENING_AS_PRODUCT.md` §5）

---

## 8. 注意

- **生成ファイル（`pool.*.generated.ts`）を手で編集しない。** 必ず再生成する
- `FORMAT_CODE`（`gen-battle-pool.mts` 付近）は **append-only**。
  既存の番号を動かすと、生成済みファイル内の数字の意味が総入れ替わりになる
- `KANA_KEYS`（`src/battle/core/kanaKeyboard.ts`）も **append-only**。
  プールがカナの正解を「添字」で持っているため
- `build/` は `.gitignore` 済み。書き出した Markdown はコミットされない

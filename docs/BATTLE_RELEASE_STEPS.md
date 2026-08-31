# 対戦モードを公開するまでの手順（ユーザー作業・完全版）

対戦モードのコードはすでに全部入っている。
残っているのは **あなたの手で Firebase 側を触る作業だけ** である。

この文書は「何を・どこで・どの順で・何を見て成功と判断するか」を
1手ずつ書いたものである。★上から順にやること。★

---

## ★最重要：順序を絶対に守る★

```
   ① ルールを Firebase に公開する
              ↓
   ② 公開できたことを確認する
              ↓
   ③ 最後に FEATURES.battle = true にする
```

**逆にすると壊れる。**
`battle = true` を先にすると、画面には対戦モードが出るのに
Firestore 側は書き込みを全部拒否するので、
生徒が対戦を始めた瞬間に「この操作は許可されていません」が出る。

- ルールだけ先に公開 → 誰にも影響しない（機能はまだ隠れているだけ）
- フラグだけ先に true → ★全員がエラーに当たる★

だから **必ずルールが先** である。

---

## 前提：あなたのプロジェクト情報

| 項目 | 値 |
|---|---|
| Firebase プロジェクトID | `mntb-4ef06` |
| ルールのファイル | `firestore.rules`（このリポジトリのルート） |
| ルールの行数 | **1931 行**（v3 適用後） |

ルール画面の直リンク:
<https://console.firebase.google.com/project/mntb-4ef06/firestore/rules>

---

# 手順① ルールを Firebase に公開する

方法は2つある。**どちらか片方だけやればよい。**

- **方法A：Console に貼り付け** … ブラウザだけで完結。★初めてならこれ★
- **方法B：CLI でデプロイ** … PC にターミナルがある人向け

---

## 方法A：Firebase Console に貼り付ける（推奨）

### A-1. 貼り付ける中身をコピーする

GitHub で `firestore.rules` を開く:

<https://github.com/2525Azarashi/ChemNote/blob/genspark_ai_developer/firestore.rules>

1. 右上の **「Raw」** ボタンを押す
2. `Ctrl + A`（全選択）→ `Ctrl + C`（コピー）
   - Mac は `⌘ + A` → `⌘ + C`

> ⚠️ **必ず「Raw」を押してからコピーする。**
> Raw を押さずにコピーすると、GitHub の画面に表示されている
> **行番号が一緒に混ざる**ことがあり、貼り付けたルールが
> 構文エラーになる。

> ⚠️ **PR がマージ済みかで URL が変わる。**
> まだマージしていなければ上の `genspark_ai_developer` のリンク。
> マージ後は `main` に変えてよい:
> <https://github.com/2525Azarashi/ChemNote/blob/main/firestore.rules>

### A-2. Console を開く

<https://console.firebase.google.com/project/mntb-4ef06/firestore/rules>

**プロジェクトのオーナーの Google アカウントでログインすること。**
別アカウントだと画面が開けない、または「公開」が押せない。

### A-3. 中身を入れ替える

1. エディタの中をクリック
2. `Ctrl + A`（**エディタ内の全選択**）
3. `Delete` で全部消す
4. `Ctrl + V` で貼り付け

> ⚠️ **「消してから貼る」こと。**
> 消さずに貼ると古いルールの下に新しいルールが繋がり、
> `service cloud.firestore` が2つある壊れた状態になる。

### A-4. 貼れたか確認する（★公開の前にここを見る★)

貼り付けたあと、**公開ボタンを押す前に**次の3つを確認する。

**確認1：行数**
エディタの左端の行番号を一番下までスクロールして、
**1931** で終わっていること。

- 1738 で終わっている → v2 の古い内容を貼っている（v3 になっていない）
- それ以外 → コピーが途中で切れている

**確認2：最後の3行**
一番下がこうなっていること。

```
  }
}
```
（その少し上に `//   対戦モードのルール — ★ここまで★` がある）

**確認3：赤いエラーが出ていない**
Console のエディタは構文エラーを赤い波線と
画面下のメッセージで教えてくれる。
**赤が出ていたら公開せず、A-1 からやり直す。**

### A-5. 公開する

右上の **「公開」（Publish）** ボタンを押す。

- ボタンが灰色で押せない → 変更が認識されていない。
  エディタ内を一度クリックして1文字打ち、消してから再度見る。
- 「エラーがあるため公開できません」 → A-4 の確認3 に戻る。

押すと数秒〜1分で反映される。
画面上部に「最終公開: たった今」のような表示が出れば完了。

---

## 方法B：Firebase CLI でデプロイ

PC でこのリポジトリを clone している場合。

```bash
# 1. CLI を入れる（初回のみ）
npm install -g firebase-tools

# 2. ログイン（ブラウザが開く）
firebase login

# 3. リポジトリのルートに移動してからデプロイ
cd <ChemNote のフォルダ>
firebase deploy --only firestore:rules --project mntb-4ef06
```

**成功時の表示:**

```
+  cloud.firestore: rules file firestore.rules compiled successfully
+  firestore: released rules firestore.rules to cloud.firestore
+  Deploy complete!
```

`Deploy complete!` が出れば完了。

### よくあるエラー

| 表示 | 意味 | 対処 |
|---|---|---|
| `Failed to get Firebase project mntb-4ef06` | ログインしたアカウントに権限が無い | プロジェクトのオーナーの Google アカウントで `firebase login` をやり直す |
| `Cannot run login in non-interactive mode` | ブラウザが開けない環境 | `firebase login --no-localhost` を使う |
| `compilation errors` | ルールの構文エラー | `firestore.rules` が 1931 行か確認（`wc -l firestore.rules`） |
| `command not found: firebase` | CLI が入っていない | 手順1をやる。または `npx firebase deploy ...` |

> ⚠️ このサンドボックス（AI 側）からはデプロイできない。
> あなたの Google アカウントの認証情報が必要で、
> それを AI 側に渡してはいけないからである。

---

# 手順② 公開できたか確認する

**ここを飛ばさないこと。** 「公開を押した」と
「実際に反映された」は別である。

## 確認1：Console の表示を見る（かんたん）

ルール画面に戻り、右上あたりの **「最終公開」の日時**が
たった今になっていること。

## 確認2：実際に読めるか試す（確実）★おすすめ★

ブラウザで次の URL をそのまま開く。
（`key=` の値は `src/firebase.ts` の `apiKey` と同じもの。
Web アプリの API キーは公開前提の値なので、これは秘密ではない）

```
https://firestore.googleapis.com/v1/projects/mntb-4ef06/databases/(default)/documents/leaderboard_total?pageSize=1&key=AIzaSyCAzgkmwE77KMWt2gY1ca63DmIa-dZA5CY
```

| 返ってきたもの | 判定 |
|---|---|
| `{}` または `{ "documents": [...] }` | ★成功★ |
| `403` / `PERMISSION_DENIED` | ★失敗★ ルールが反映されていない |

`leaderboard_total` はルール上「誰でも読める」設定なので、
ここが 403 なら**ルールが古いまま**という決定的な証拠になる。

## 確認3：対戦のルールが入ったかを見る

Console のルール画面で `Ctrl + F` を使い、次の語を検索する。

- `battleRoomProof` … ★これが見つかれば v3 のルールが入っている★
- 見つからない → v2 のまま。手順① をやり直す。

これは v3 で追加された関数なので、**v3 が入ったかどうかの目印**になる。

---

# 手順③ 最後にフラグを true にする

**手順②で確認できてから、これをやる。**

`src/config/features.ts` の 163 行目付近:

```ts
  battle: false,
```

を

```ts
  battle: true,
```

に変える。そのあとビルドしてデプロイ（普段のアプリの公開手順どおり）。

```bash
npm run build
```

## 元に戻したいとき

`battle: false` に戻してビルドし直せば、対戦モードは即座に隠れる。
**ルールは公開したままでよい**（公開されていても、
使わなければ何も起きない）。

このフラグは4箇所（ナビ／トップのカード／ルーティング／一覧）
すべてで参照されているので、false にすれば
「見えないのに入れてしまう」抜け道は残らない。

---

# 手順④（任意）今後のルール変更を自動化する

毎回 Console に貼るのが面倒なら、GitHub Actions で自動化できる。
雛形は `docs/deploy-firestore-rules.workflow.yml` にある。
設定手順は `docs/DEPLOY_FIRESTORE_RULES.md` の「方法3」に書いてある。

一度設定すれば、`firestore.rules` を変更して main にマージするだけで
自動でデプロイされる。

> ⚠️ サービスアカウントの JSON は非常に強い認証情報である。
> **リポジトリにコミットせず、GitHub Secrets にのみ置く。**

---

# 困ったときの逆引き表

| 症状 | 原因 | 対処 |
|---|---|---|
| 「この操作は許可されていません」 | ルールが未公開なのにフラグを true にした | 手順① を実行。または一旦 `battle: false` に戻す |
| ランキングが真っ白 | 同上（`leaderboard_total` が読めていない） | 手順②の確認2で 403 かどうか見る |
| Console で「公開」が押せない | 変更が認識されていない／構文エラー | A-4 の確認3 を見る |
| 行数が 1738 | v2 の古いルールを貼っている | v3 の `firestore.rules`（1931行）を貼る |
| `battleRoomProof` が無い | 同上 | 同上 |
| レートだけ異常に高い生徒がいる | v2 のルールで不正された残骸 | v3 公開後は不可能。既存データは Console で手直しする |

---

# なぜ v3 のルールを公開する必要があるのか

v2 のルールには**実際に悪用できる穴が4つ**あった。
特に重いのが次の2つである。

| # | v2 でできてしまったこと |
|---|---|
| 12 | **1試合もせずにレートを上限4000まで盛れた** |
| 13 | **相手の申告を見てから自分の申告を書き換えて、必ず勝てた** |

不具合12 の原因は、ルールがこれだけしか見ていなかったこと。

```
&& request.resource.data.lastRoomId != resource.data.lastRoomId
```

「前回と違う文字列」ならOKなので、`fake_a → fake_b → fake_a → …` と
架空のIDを交互に書くだけで上限まで到達できた。

> **変化量の上限（±60）は「1回あたり」しか縛らない。
> 回数を止めていなければ、上限には何の意味もない。**

v3 では `get()` で部屋を実際に読み、次の5点を全部要求する
（`battleRoomProof`）。

| 要求 | 防いでいること |
|---|---|
| その部屋が実在する | 架空の試合 |
| 自分が `players` に入っている | 他人の試合への便乗 |
| `players.size() == 2` | 1人部屋の自作自演 |
| `status == 'finished'` | 決着前のレート先取り |
| 自分の `attest` がある | 申告なしの反映 |

**この修正はすべてルール側にある。**
つまり **ルールを公開しなければ修正は1つも効かない。**
テストが緑でも、公開していない本番は v2 のまま穴が空いている。

詳しい経緯は `docs/BATTLE.md` の §12 にある。

---

# 検証済みの状態（AI 側で確認したもの）

あなたが手順①を実行する前に、こちらで次を確認済みである。

```
firestore.rules                   … 1931 行（v3 / 括弧の対応も検証済み）
battle.rules.test + exploit.test  … 157 passed（エミュレータ実行）
battleCore/Pool/connection/clock  … 158 passed
leaderboard/friends/feedback      … 114 passed（既存機能に影響なし）
tsc --noEmit                      … exit 0
npm run build                     … 成功
```

つまり **ルールの中身は正しい。** あとは公開するだけである。

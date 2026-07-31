# ユーザーフィードバック収集機能 セットアップガイド

タイトル画面と各結果画面に設置した「ご意見・ご要望」機能の、**収集先（どこに届くか）の決め方と設定手順**をまとめたドキュメントです。

---

## 1. まず結論：今の状態でもう「集まる」

**追加設定なしで、すでにフィードバックは溜まります。**

送信されたご意見は Firebase Firestore の `feedback` コレクションに 1 件 1 ドキュメントで保存されます。

- 確認方法：[Firebase コンソール](https://console.firebase.google.com/project/mntb-4ef06/firestore/data/~2Ffeedback) → Firestore Database → `feedback`
- 並び順：`createdAt`（サーバー時刻）の降順で見るのが便利です
- 権限：**書き込み（投函）だけ許可、読み取りはクライアントから一切不可**。
  つまり生徒同士でお互いの意見や連絡先メールを覗くことはできません。管理者はコンソールから閲覧します。

> ⚠️ ルールを更新したので、初回だけ `firebase deploy --only firestore:rules` が必要です（下の「4. Firestore ルールの反映」参照）。

---

## 2. 「メール」か「スプレッドシート」か、まだ決めなくてよい設計

ご要望の「メールアドレス（mntobira@gmail.com）なのか、Google スプレッドシートなのか、現在は想定できない」に対応するため、**収集先を 3 系統に分け、後から切り替えられる構造**にしています。

| # | 収集先 | 状態 | 設定 | 向いている用途 |
|---|--------|------|------|----------------|
| ① | **Firestore `feedback`** | 常時ON（既定） | 不要 | 消えない保管庫。全件を確実に残す |
| ② | **Google スプレッドシート／メール通知** | 任意 | `VITE_FEEDBACK_WEBHOOK_URL` を設定 | 一覧で眺めたい／届いたら即気づきたい |
| ③ | **`mailto:` フォールバック** | 自動 | 不要 | 通信失敗時に生徒自身のメーラーから送る最後の砦 |

②を有効にすると、1 回の送信が Firestore とスプレッドシート（＋メール）の**両方**に届きます。
どちらか一方に絞りたくなったら、Apps Script 側の `CONFIG` を書き換えるだけで済みます（アプリの再ビルド不要）。

### 判断の目安

- **とりあえず様子を見たい** → ①のまま。何もしなくてOK。
- **届いたらすぐメールで知りたい** → ②を設定し、`SEND_EMAIL: true` / `APPEND_SHEET: false`
- **溜めて後からまとめて読みたい** → ②を設定し、`SEND_EMAIL: false` / `APPEND_SHEET: true`
- **迷っている** → ②を設定して**両方 `true`**。後から片方を `false` にするだけ。← おすすめ

---

## 3. ②の設定手順（Google スプレッドシート＋メール通知）

所要時間は 5 分程度です。

1. **受け取り用のスプレッドシートを新規作成**（名前は自由。シート `feedback` は自動作成されます）
2. そのスプレッドシートで **［拡張機能］→［Apps Script］** を開く
3. エディタの中身を全部消し、**[`docs/feedback-gas.js`](./feedback-gas.js) の内容をそのまま貼り付け**
4. ファイル先頭の `CONFIG` を確認・調整

   ```js
   var CONFIG = {
     NOTIFY_EMAIL: 'mntobira@gmail.com', // 通知先
     SEND_EMAIL: true,                   // メール通知する？
     APPEND_SHEET: true,                 // シートに記録する？
     SHEET_NAME: 'feedback',
     SHARED_SECRET: '',
   };
   ```

5. **［デプロイ］→［新しいデプロイ］→ 種類「ウェブアプリ」**
   - 次のユーザーとして実行：**自分**
   - アクセスできるユーザー：**全員** ← ここが「全員」でないと受信できません
6. 表示された **ウェブアプリの URL** をコピー
7. プロジェクトの `.env` に追記して再ビルド

   ```bash
   VITE_FEEDBACK_WEBHOOK_URL="https://script.google.com/macros/s/xxxxxxxx/exec"
   # 通知先メールをアプリ側でも変えたい場合（mailto の宛先に使われます）
   # VITE_FEEDBACK_EMAIL="mntobira@gmail.com"
   ```

8. アプリのタイトル画面 →「ご意見・ご要望」からテスト送信し、
   シートに 1 行増える／メールが届くことを確認

### 動作確認のコツ

- コピーしたウェブアプリ URL をブラウザで直接開くと
  `ChemNote feedback endpoint is running.` と表示されます。
  表示されない場合は手順 5 の公開設定（「全員」）を見直してください。
- Apps Script のコードを直した後は
  **［デプロイ］→［デプロイを管理］→ 鉛筆アイコン → バージョン「新バージョン」**
  で再デプロイが必要です（URL は変わりません）。

---

## 4. Firestore ルールの反映

`firestore.rules` に `feedback` コレクションのルールを追加しました。反映するには：

```bash
firebase deploy --only firestore:rules
```

追加したルールの要点：

- `allow create` のみ許可（**未ログインのゲストでも送信可能**）
- `allow read, update, delete: if false` — クライアントからは読めない／消せない
- フィールド構成を `hasOnly` で固定し、想定外のデータ混入を拒否
- `message` は 1〜2000 文字、`rating` は 0〜5 の整数、`screen` / `category` は既知の値のみ
- `uid` は「ログイン中の本人の uid」か `null`（ゲスト）のみ → **なりすまし不可**
- `createdAt` は `request.time` 固定 → 端末時計の偽装で並び順を荒らせない

---

## 5. 設置場所

| 画面 | 場所 | 自動で付く情報 |
|------|------|----------------|
| **タイトル画面**（`Home.tsx`） | 「学習ノート」「アプリ紹介」と並ぶカード | 連続学習日数、解答済み問題数／総問題数、ゲストか否か |
| **単元の結果画面**（`Explanation.tsx`） | Result Score カード内・ランキングの下 | 単元 ID、単元名、モード、合計スコア、正解数／採点対象数、所要時間 |
| **模擬試験の結果画面**（`MockExam.tsx`） | 「もう一度解く／選択に戻る」ボタンの下 | 得点、満点、正答率、所要時間、時間超過フラグ |

どの画面でも 1 行で追加できます。

```tsx
import { FeedbackButton } from './FeedbackButton';

<FeedbackButton screen="chapter_result" variant="inline" context={{ chapterId }} />
```

`variant` は `card`（横長カード）／`inline`（ピル型ボタン）／`text`（テキストリンク）の 3 種類です。

---

## 6. 通信失敗時のふるまい（意見を取りこぼさない設計）

1. Firestore・Webhook の**両方が失敗**した場合のみ、`localStorage`（キー `feedback_outbox_v1`、最大 20 件）へ退避します。
2. 同時に「メールで送る」ボタンを提示します（宛先・本文・端末情報が差し込まれた `mailto:`）。
3. 次回アプリ起動時（起動 2.5 秒後）と**オンライン復帰時**に自動で再送します（`flushFeedbackQueue`）。

電波の悪い教室や機内モードで書かれた意見も、後から確実に届きます。

---

## 7. 収集される情報

**必須入力は本文だけ**です。氏名・メールアドレスは任意で、未入力でも送信できます。

- 入力値：満足度（任意・1〜5）、種類、本文、返信用メール（任意）
- 自動付与：送信元画面、画面固有の付帯情報（上表）、ログイン中なら uid・表示名・ログインメール、送信日時、UserAgent、画面サイズ、アプリ版、管理 ID

学習の記録・スコア・ランキングには一切影響しません。

---

## 8. 関連ファイル

| ファイル | 役割 |
|----------|------|
| `src/utils/feedback.ts` | 送信ロジック本体（3 系統の送信口・検証・再送キュー・`mailto` 生成） |
| `src/components/FeedbackModal.tsx` | 入力フォーム（星評価・種類・本文・返信先・完了／失敗表示） |
| `src/components/FeedbackButton.tsx` | 各画面に置く入口ボタン（`card` / `inline` / `text`） |
| `firestore.rules` | `feedback` コレクションの投函専用ルール |
| `docs/feedback-gas.js` | Google Apps Script（スプレッドシート追記＋メール通知） |
| `tests/feedback.test.ts` | 検証・ペイロード生成・`mailto`・再送キューの回帰テスト |

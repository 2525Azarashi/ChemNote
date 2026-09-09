<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

## 2026-09-07 UI改善（PR #125 / 4c26835 基準）

- 選択中の科目を引き継ぎ、不要な科目・学習モードの再選択を省略。
- 化学の分野切替を単元一覧に統合し、章タブを起動中保持。
- 全科目の復習先を検証して移動。ノート表示タブを保持し、答えを開かず復習を開始。
- 対戦中の本体ナビによる離脱を防止。試合中の得点表示を圧縮し、相手探しの案内を実処理に合わせる。
- ホーム本体、共通CSS、教材、対戦ルール・採点・通信フックは変更なし。
- 新規URI・API・保存サービスは追加なし。既存の `/` 内の画面状態を使用。
- 型検査・本番ビルド成功。対象テスト306件・Chromium操作7シナリオ成功。本番2人対戦・Safari実機は未実施。
- 既存のデータ読み込み量テスト2件は、未変更の4c26835でも失敗。上限を緩めず、別課題として残す。
- 誤答小問だけの復習、ノート編集の保存統一、ブラウザ履歴、全端末で全選択肢を同時表示する調整は今後の課題。
- 公開・GitHubへのpushは未実施。ZIP内の changes.patch と適用手順で取り込み、利用環境で再確認する。

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/881a46f3-3ab9-446b-9d0b-8a115d48a0f0

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

The current application does not call the Gemini API, so no Gemini API key is required or bundled into the browser build.

---

## Firestore セキュリティルールのデプロイ（フレンド機能）

> ⚠️ **フレンド機能を使うには、ルールのデプロイが必須です。**
> ルールをデプロイしていないと、申請時に
> 「この操作は許可されていません…」というエラーが出ます。
> `friend_codes` は新設コレクションのため、旧ルールでは
> match ブロックが存在せず**暗黙的に全拒否**されます。

```bash
# 1. ログイン（初回のみ / ブラウザが開きます）
firebase login

# 2. プロジェクトを選択（このリポジトリは mntb-4ef06 が既定）
firebase use mntb-4ef06
firebase projects:list      # 選択中のプロジェクトを確認

# 3. ルールのみデプロイ
firebase deploy --only firestore:rules

# 4. インデックスが必要になった場合
firebase deploy --only firestore:indexes
```

### デプロイできたかの確認

- Firebase Console → Firestore Database → **ルール** タブで
  更新日時が最新になっているか
- 「ルール playground」で `friend_codes/MNTB-XXXX-XXXX` の
  `get` が allow になるか

### パス設定の確認

`firebase.json` が以下を指していることを確認してください。

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### ルールのテスト（エミュレータ）

```bash
npm run test:rules
```

Firestore エミュレータを起動し、`tests/friends.rules.test.ts` を実行します
（Java ランタイムが必要）。

### 動作確認チェックリスト

- [ ] `firebase deploy --only firestore:rules` が成功する
- [ ] 自分のフレンドコードで自分に申請すると弾かれる
- [ ] 存在しないコードだと「該当するフレンドコードが見つかりません」と出る
- [ ] 正しいコードで申請すると `friend_requests` に `status: "pending"` が作られる
- [ ] 相手side で承認すると双方の `friends` サブコレクションに追加され一覧に出る
- [ ] `npm run test:rules` が全ケース通る

### それでも解決しない場合

| 確認項目 | 方法 |
|---|---|
| 別プロジェクトにデプロイしていないか | `firebase use` の値と `src/firebase.ts` の `projectId`（`mntb-4ef06`）が一致するか |
| クライアントの初期化が正しいか | ブラウザDevTools → Network で Firestore リクエスト先プロジェクトIDを確認 |
| 認証済みか（`request.auth == null`）| DevTools Console で `firebase.auth().currentUser` 相当を確認。ログインし直す |
| ルールが反映されているか | Console のルールタブの更新日時、または playground で検証 |

詳細な設計は [docs/FRIEND_SYSTEM.md](docs/FRIEND_SYSTEM.md) を参照してください。

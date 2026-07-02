# 採点アーキテクチャ（C7 / 段階b）

## 目的

将来のサーバーサイド採点（不正防止・スコア改ざん対策）へ移行しやすいように、
**採点・解答判定ロジックを純粋（依存ゼロ）な共有モジュールへ切り出した**ことの記録。
本 PR ではインフラ（Firebase プラン等）は変更していない。クライアント採点のまま、
「同じ関数をサーバーでも動かせる」状態を用意するのがゴール。

## モジュール構成

```
src/utils/answerJudge.ts   ← 解答判定の単一の真実 (single source of truth)
                              - normalizeAnswer / isAnswerCorrect / isDescriptive
                              - judgeSubQuestions（正誤マップ + 集計）
                              - DOM / React / Firebase を一切 import しない純粋関数

src/utils/scoring.ts       ← スコア計算（時間ボーナス・コンボ等）
                              answerJudge を利用して「正誤判定」を委譲
```

### 利用箇所（すべて answerJudge を経由するよう統一）
- `components/Quiz.tsx`：採点・誤答キャプチャ（復習リスト）
- `components/Explanation.tsx`：✓/✗ 表示・カテゴリ別分析・自己採点対象の判定
- `utils/scoring.ts`：`scoreProblem` / `calcMaxCombo`

## この統一で直った不具合

従来 `Explanation.tsx` は `answers[id] === correctAnswer`（trim なし）で ✓/✗ を表示し、
`scoring.ts` は `.trim()` 済みで採点していたため、**前後に空白が入ると
「表示は不正解なのに加点される」等の食い違い**が起きうる状態だった。
`isAnswerCorrect()` に一本化したことで表示とスコアが必ず一致する。

## サーバーサイド採点への移行手順（将来）

`answerJudge.ts` と `scoring.ts` は環境非依存なので、そのままサーバーへ持ち込める。

1. **採点エンドポイントを用意**（例: Firebase Cloud Functions / Cloudflare Workers）
   - リクエスト: `{ chapterId, questionId, answers, timeLimit, timeUsed, ... }`
   - サーバー側で `problem` データ（正解）を保持し、`answerJudge` + `scoring` で採点
   - レスポンス: `ScoreBreakdown`
2. **正解データをクライアントから隠す**
   - 現状は `src/data/*.ts` に `correctAnswer` を同梱している（クライアント採点のため）。
     サーバー採点に切り替える際は、正解を含むデータをサーバー限定バンドルへ移動し、
     クライアントには問題文・選択肢のみ配信する。
3. **クライアントは結果を表示するだけにする**
   - `Quiz.tsx` の `scoreProblem` 呼び出しを API 呼び出しへ置換。
   - `answerJudge` の import 先をローカル→共有パッケージに差し替えるだけでロジック再実装は不要。

## テスト

`answerJudge` は純粋関数なので単体テストが容易（`tsx` で実行可能）。
CI 追加時は以下のようなケースを回帰テストに含めること：
- exact / 前後空白 / 全角空白 / 記述式は常に false / acceptedAnswers 別解 / 集計値

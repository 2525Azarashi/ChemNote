# コード地図（CODEMAP）— どこに何があるか

> 「○○を直したい → このファイル」を引くための表。**ファイルを開く前にここを見る。**
> 大きいファイル（App.tsx 1,800行など）を頭から全部読まない。`grep -n` で場所を探してから該当範囲だけ読む。

---

## 1. 全体像（1分）

- **何のアプリ？** 共通テスト対策の学習アプリ「マナトビ」（リポジトリ名 ChemNote）。
  教科：化学基礎・化学・英語リスニング・数学・生物基礎・英文法・地理（＋理科 `rika`）。
- **技術**：React 19 + TypeScript + Vite 6 + Tailwind 4。データ保存は Firebase（Firestore / Auth）と localStorage。
- **URL で画面を切り替えていない。** 画面は `src/App.tsx` の `appState`（`'home' | 'quiz' | 'battle' …`）で切り替わる。
- **問題データはすべて TypeScript / JSON のファイル**（DB ではない）。問題を直す＝`src/data/` のファイルを直す。
- **音声・画像は `public/`** にある。コードからは `/listening_audio/xxx.mp3` のように `/` 始まりで参照する。

```
src/
  App.tsx            画面切替の中心（appState）。1,800行。★直接大改造しない★
  main.tsx           起動。Service Worker 登録
  firebase.ts        Firebase 接続設定（projectId: mntb-4ef06）
  config/features.ts 教科・機能の公開/非公開フラグ（1か所で管理）
  components/        画面部品（Home, Quiz, Explanation, ListeningAudioPlayer …）
  data/              ★問題データと教科構成★（教科ごとにファイルが分かれる）
  utils/             ロジック（採点・進捗・保存・リスニング補助 …）
  hooks/             React フック
  battle/            オンライン対戦（core=ルール, data=出題プール, ui=画面, hooks）
  features/rika/     理科（独立した小機能）
  features/safety/   名前フィルタ・通報・ブロック・アイコンURL制限（App Store 1.2）
  features/account/  アカウント削除（App Store 5.1.1(v)）と設定画面の「安全とアカウント」欄
  features/legal/    利用規約・プライバシーポリシー（アプリ内表示）
  features/auth/     Appleでサインインのボタン（App Store 4.8）
public/              画像・音声・マスコット・PWA アイコン
scripts/             データ生成・検査・音源取り込み等の道具（アプリ本体には入らない）
tests/               vitest のテスト（*.test.ts）と Playwright 用（*.browser.mjs）
docs/                設計メモ・手順書
.tmpwork/ .delivery/ 作業用・納品物置き場（git 管理外。コミットしない）
```

---

## 2. 目的別：どのファイルを触るか

### 問題・教材

| やりたいこと | ファイル |
|---|---|
| 教科の一覧・順番 | `src/data/allChapters.ts`（`SUBJECTS`）、表示名は `src/data/subjectLabels.ts` |
| 教科を隠す/出す | `src/config/features.ts`（冒頭コメントの「4箇所」ルールを読む） |
| 化学基礎の問題 | `src/data/chemistryData.ts`、`chemProblemsC1〜C4.ts`、`acidBaseProblems.ts`、`redoxProblems.ts` など |
| 化学の問題 | `src/data/chemistryAdvancedData.ts`、`inorganic*.ts`、`advancedThermoProblems.ts`、`crystalProblems.ts` |
| 英語リスニング 第1問A | `src/data/englishListeningQ1AProblems.ts`（型 `ListeningAudioTrack` の定義もここ）、`englishListeningQ1ASets.ts` |
| 英語リスニング 第1問B / 第2問 / 第3問 | `englishListeningQ1BProblems.ts` / `englishListeningQ2Problems.ts` / `englishListeningQ3Problems.ts` |
| 英語リスニング 第4〜6問 | データは `src/data/listeningSets/listening-q4.json` 等（**原則いじらない**）、変換は `englishListeningQ4to6Problems.ts` |
| リスニングの大問構成 | `src/data/englishListeningData.ts` |
| 英文法 | `src/data/englishGrammarData.ts`、`egProblems*.ts` |
| 数学 | `src/data/mathData.ts`（パート構成）、`math*Problems.ts`、`mathProblemKit.ts`。数I・A（`ia*`）は `mathIAProblems.ts`、入試強化は `mathPlusProblems.ts`（**どちらも外部の Python 生成物。手で直さない**）、6科目カリキュラム（`mc*`）は `mathCurriculum.ts`。図は `public/fig_math/` |
| 地理 | `src/data/geographyData.ts`、`geography*Problems.ts`、画像 `public/geography/` |
| 生物基礎 | `src/data/biologyBasicData.ts`、`biologyBasicProblems.ts` |
| 数学の問題を直す・足す | `scripts/math-plus/*.py` を直して `python3 scripts/math-plus/gen_ts.py` → `npm run gen:index`（sympy で答えを自動検算。ts を手で直さない）。「マナトビ基本演習 Step N」の題名・言い回しは `scripts/math-plus/drill_naming.py` |
| 情報Ⅰ（対戦専用・450問） | 元データ `docs/joho/joho-pool.source.json` → `python3 scripts/gen-joho-pool.py docs/joho/joho-pool.source.json` → `npm run gen:battle-pool`。教科名・色・単元は `src/data/externalSubjects.ts` |
| 対戦専用教科（演習画面なし） | `externalSubjects.ts` の `BATTLE_ONLY_SUBJECTS`（英単語・情報Ⅰ） |

> ✅ 以前は `npm run gen:battle-pool` で化学基礎・化学・生物基礎のかな問題の秒数が揺れていたが、
> 対戦の締切を `src/battle/core/battleTiming.ts` に固定したので**もう揺れない**（1人用の `scoring.ts` を変えても対戦は変わらない）。
| 化学の表記ルール | `docs/UNIT_GUIDE.md`（検査：`npm run lint:chem`） |

### 音声（リスニング）

| やりたいこと | 場所 |
|---|---|
| **録り直した音源を入れる** | **`docs/LISTENING_AUDIO_REPLACE.md` の手順どおり `scripts/listening-audio.mts` を使う** |
| 音源ファイルの実体 | `public/listening_audio/`（第1〜3問）、`public/listening_q4/` `q5/` `q6/`（第4〜6問） |
| 音源の商用権の状態 | `scripts/data/listening_audio_ledger.json`（ツールが自動更新。手で編集しない） |
| 旧音源 / 新音源の元ファイル | `audio_sources/legacy/` / `audio_sources/commercial/`（アプリには入らない。`audio_sources/README.md`） |
| 第4〜6問の音声の長さ（制限時間の計算用） | `src/data/listeningSets/listening-q4-6-durations.json`（ツールが自動更新） |
| 再生ボタン・2回読み | `src/components/ListeningAudioPlayer.tsx` |
| 音源が無いときのブラウザ読み上げ | `src/utils/listeningSpeech.ts` |
| 対戦でのリスニング音声 | `src/battle/data/battlePool.ts`（`audioUrl` を付ける所）、`src/battle/ui/BattleQuestionView.tsx` |
| 商用音声への移行の経緯 | `docs/COMMERCIAL_AUDIO_MIGRATION.md` |
| 外部に録音を頼むための台本パック | `scripts/export-listening-audio-prompts.mts` |
| BGM・効果音 | `src/battle/audio/battleAudio.ts`、`public/*.mp3` |

### 画面

| 画面 | ファイル |
|---|---|
| ホーム | `src/components/Home.tsx` |
| 教科選択 | `src/components/SubjectSelection.tsx` |
| 単元選択 | `src/components/ChapterSelection.tsx`（数学のタブは `src/data/mathNavigation.ts` の `MATH_TOPICS`＝科目→教科書の分野。タブ内の見出し（数学の段階・地理の単元演習/模試・準備中）は `src/data/unitSections.ts`） |
| 問題を解く | `src/components/Quiz.tsx`、`ProblemPane.tsx`、`AnswerPane.tsx` |
| 解説 | `src/components/Explanation.tsx`、`ExplanationScreen.tsx` |
| 復習・ノート | `src/components/StudyHub.tsx`、`ReviewList.tsx`、`NoteList.tsx` |
| ガチャ・コイン・きせかえ | `src/components/GachaRoom.tsx`、`GrowthHub.tsx`、`src/battle/ui/ManaCoinBalance.tsx` |
| ガチャ大当たり（UR）＝学習プリント PDF | 一覧 `src/data/gachaPrints.generated.ts`（自動生成）、PDF `public/prints/`、作り方 `scripts/gacha-prints/`（下の「学習プリントの作り直し」） |
| マスコット（とびら君） | `src/components/DoorMascot.tsx`、画像 `public/mascots/`、セリフ `src/data/mascotTips.ts` |
| 対戦 | `src/battle/ui/BattleMode.tsx`（入口）→ `BattleHome.tsx` など |
| きょうのミッション・コンプリート宝箱 | 画面 `src/battle/ui/BattleMissions.tsx`、計算 `src/battle/core/growth.ts`（`missionsForDate`、`openCompleteChest`）、保存 `src/battle/data/growthStore.ts`（`openChest`、端末内のみ） |
| フレンド | `src/components/FriendPanel.tsx`、`src/utils/friends.ts`（設計 `docs/FRIEND_SYSTEM.md`） |

### 保存・サーバー

| 内容 | ファイル |
|---|---|
| Firebase 設定 | `src/firebase.ts` |
| Firestore のアクセス権 | `firestore.rules`（反映手順 `docs/いまやること.md`） |
| ログイン（Google / Apple） | `src/utils/googleAuth.ts`（`signInWith('google' \| 'apple')`）、ボタン `src/features/auth/AppleSignInButton.tsx` |
| 他人に見える名前のチェック | `src/features/safety/nicknameFilter.ts`（送信時 `sanitizeNickname`、表示時 `displaySafeNickname`） |
| 通報・ブロック | `src/features/safety/userSafety.ts`、メニュー `UserSafetyMenu.tsx`（ランキング・フレンド・対戦結果） |
| アカウント削除 | `src/features/account/accountDeletion.ts` |
| セキュリティヘッダー（CSP） | `vercel.json` と `public/_headers`（**両方を同じ内容に**。`tests/securityHeaders.test.ts`） |
| Service Worker | `public/sw.js`（同一オリジンの GET だけ。画面はネットワーク優先） |
| App Store 申請の確認表 | `docs/APP_STORE.md` |
| 学習進捗の保存 | `src/utils/progress.ts`、`studySync*.ts`、キー名 `userStorageKeys.ts` `quizStorageKeys.ts` |
| ランキング | `src/utils/leaderboard.ts` |
| 対戦のルール・採点 | `src/battle/core/battleRules.ts`、`battleCore.ts`（設計 `docs/BATTLE.md`） |
| 対戦の問題ごとの秒数（生成時） | `src/battle/core/battleTiming.ts`（1人用から独立） |
| 対戦の制限時間 | `battleCore.ts` の `resolveTimeLimit`（上限55秒）、`arenaRules.ts`（リスニング55秒）、1問目の締切は `battleLive.ts` の `firstDeadlineSec` |

> ⚠ **対戦の締切は Firestore ルールで「今から60秒未満」に制限されている**（`firestore.rules` の `battleDeadlineSane`）。
> 制限時間やカウントダウンを延ばすと、AI対戦は動くのに**オンライン対戦だけ開始できなくなる**（2026-09-23 にリスニングで実際に発生）。
> 変えるときは `tests/arena.test.ts` の 60秒検査と `tests/battle.rules.test.ts` を必ず回す。

---

## 3. 自動生成ファイル（★手で編集しない★）

名前に `.generated.` が入っているファイルはスクリプトが作る。直すなら元データを直して再生成する。

| ファイル | 作り直すコマンド |
|---|---|
| `src/battle/data/pool.*.generated.ts`、`answer.*.generated.ts` | `npm run gen:battle-pool` |
| `src/data/chapterIndex.generated.ts` | `npm run gen:index` |
| `src/features/rika/chapters.rika.generated.ts` | 外部の `tools/build_app_pack.py`（このリポジトリには無い。手で直さない） |
| `scripts/data/listening_audio_ledger.json` | `npx tsx scripts/listening-audio.mts import … --apply` |
| `src/data/listeningSets/listening-q4-6-durations.json` | 同上（または `… refresh-durations`） |

問題データを変えたら、対戦にも反映するため `npm run gen:battle-pool` を忘れない。

---

## 4. コマンド早見表

| 目的 | コマンド |
|---|---|
| 開発サーバー | `npm run dev`（ポート 3000） |
| 型チェック（まずこれ） | `npx tsc --noEmit` |
| テスト（関係するものだけ） | `npx vitest run tests/englishListeningData.test.ts` のようにファイル指定 |
| 本番ビルド | `npm run build`（サンドボックスではメモリ不足で落ちる → `docs/BUILD.md` の swap 手順） |
| 問題データの検査 | `npm run verify`、化学表記 `npm run lint:chem` |
| 音源一覧 / 検査 / 取り込み / 進捗 | `npm run audio:list` / `audio:check` / `audio:import -- <フォルダ>` / `audio:status` |

テストを全部一度に回すと重い（数百件）。変更したファイルに関係するテストだけ回す。

---

## 5. 設計メモ（詳しく知りたいとき）

| テーマ | 文書 |
|---|---|
| 対戦 | `docs/BATTLE.md`、`docs/BATTLE_RELEASE_STEPS.md` |
| 構造整理の履歴・「まとめなかった理由」 | `docs/REFACTORING.md` |
| 採点 | `docs/SCORING_ARCHITECTURE.md` |
| リスニング専用版との分岐・PRルール | `docs/LISTENING_DERIVATIVE.md` |
| ビルドとメモリ | `docs/BUILD.md` |


## 学習プリント（ガチャ大当たり UR）の作り直し

提供割合は `src/battle/core/arenaEconomy.ts` の `GACHA_RARITY_RATES`（UR 5%・SR 5%・R 25%・N 65%）。
UR 枠の中は等確率なので、プリントを増やすと1種あたりの割合が自動で下がる（42種で約0.12%）。

```bash
# 0) 初回だけ：PDF 用の Chromium（アプリの依存には入れない）
mkdir -p .tmpwork/pw && (cd .tmpwork/pw && npm i playwright && npx playwright install chromium)
# 1) アプリの確認済みデータ（対戦プールの問題・正解・解説、出題傾向データ）を書き出す
npx tsx scripts/gacha-prints/dump-data.mts .tmpwork/prints-data.json
# 2) PDF を作る（カタログは build-prints.mjs の catalog）
node scripts/gacha-prints/build-prints.mjs .tmpwork/prints-data.json
# 3) 圧縮・サムネイル・一覧（src/data/gachaPrints.generated.ts）
python3 scripts/gacha-prints/finalize.py
```

- 問題は新しく作らない（正解の誤りを配らないため、検証済みの対戦プールだけを使う）。
- 二次関数の週課題（`scripts/gacha-prints/source/quadratic_weekly_6weeks.pdf`）はハブの教材をそのまま収録。
- プリントは `kind: 'print'` のアイテム。装備はできず、ガチャ画面の「マイプリント」から開く・保存する。

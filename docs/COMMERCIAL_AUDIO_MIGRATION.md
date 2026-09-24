# 商用音声への移行記録（2026-09-18）

> **録り直した音源の取り込み方は [LISTENING_AUDIO_REPLACE.md](LISTENING_AUDIO_REPLACE.md)。** 差し替え状況は `npx tsx scripts/listening-audio.mts status`、音源ごとの生成元・商用根拠は `scripts/data/listening_audio_ledger.json`（2026-09-23 追加。全364本 legacy_unverified から開始）。

旧ZIPは公開保留。既存音源の生成時契約を確認できていないため、商用公開可能とは扱わない。エンジン名だけで有料プランや第三者サービス経由の利用権を証明したことにしない。統合版・旧音源は比較用として保持する。

## PDF納品と追加の商用利用調査（2026-09-18）

- 全台本PDF（403ページ、364音源・1,309発話）：https://www.genspark.ai/api/files/s/fDyGSPhX
- 操作・商用利用ガイドのみ（9ページ）：https://www.genspark.ai/api/files/s/ihbZ54i7
- PDFはMiniMax向けの操作案内と共通制作指示を含む。読み上げ本文はGemini/他TTSへ流用可能だが、声ID・APIパラメータ・プロンプト欄は互換ではない。Geminiではstyle/promptとtextを分離し、MiniMaxやChirpには指示文を読み上げ本文として混ぜない。
- PDFから全364 IDと1,309原文を抽出照合し一致（レイアウト上の空白を除く）。日本語フォント埋込み、ページ外テキストなし、置換文字なしを確認。第1問Aのレンダリングでも欠落・重なり・文字化けなしを確認。APIキー等は含めない。PDFにGoogle代替案の追加説明はまだ含めていない。
- MiniMax Audioの実UIでVoice Selection/Library/Filters/Useを確認し、女性→男性→同じ女性へ戻す操作例をPDF化。未ログインでの画面確認であり生成・課金・ダウンロードの実動作は未確認。
- 公式 https://www.minimax.io/audio/subscribe の展開FAQは、TTSの個人/非営利利用は出典表示付き、商用/収益化はStarter以上への加入を案内。現行Freeは月10,000 credits。無料期間のsongs商用権をTTSへ転用しない。課金規約と現行画面にプラン枠・無料配布量の差があるため、申込み時の表示を優先する。

### 新しく検討した候補（未生成・未採用）

1. Google Cloud Text-to-Speech Chirp 3: HD：無料枠重視の第一試聴候補。https://cloud.google.com/text-to-speech/pricing は月100万文字まで無料。今回の140,599文字一巡は約14.1%（同じ請求アカウントの他利用・再生成・追加課金対象等は別）。請求設定は必要で、超過すると課金される。300ドル特典を前提にしなくてよい。
2. 同サービスNeural2：月100万文字まで無料の代替。Chirp/Geminiとは別モデルであり、既存試聴と同じ音質と断定しない。
3. Google公式 https://docs.cloud.google.com/text-to-speech/docs/basics は、Cloud規約と法令に従って生成音声をアプリやメディアに使用できると説明。https://docs.cloud.google.com/text-to-speech/docs/data-logging はCloud TTSの顧客テキスト/音声をログしないと説明。個別の標準声と対象機能の条件は適用され、無条件の法的保証ではない。
4. Gemini API/AI Studio：https://ai.google.dev/gemini-api/docs/billing は2026年3月以降、300ドルWelcome creditの対象外と明記。カード登録だけで実質無料とはいえない。https://docs.cloud.google.com/free/docs/free-cloud-features はFree Trial請求アカウントとPaid請求アカウントを区別する。予算アラートは停止上限ではない。
5. Google Cloud/Vertex AI経由のGemini TTS：AI Studioとは別経路。対象SKU・特典残高/期限/資格・Preview条件を確認してから試す。料金表ではGemini TTS自体の月間無料枠はNot available。全量が無料になると保証しない。
6. Azure F0：月50万文字無料の表示はあるが、無料商用の推奨候補から除外。Microsoft Product TermsをHTTP取得して直接確認：https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/MCA 。正確な条項は “For Customers of the paid tier TTS Service only, Customer may use the audio output of prebuilt neural voices generated using the TTS Service, including for commercial purposes.”。無料料金表やフォーラムの古い肯定回答より規約を優先する。

現在は選択肢の案内のみ。Cloudアカウント設定、API呼び出し、音声一括再生成、モデルの自動変更、公開承認はいずれも行っていない。以前のMiniMax採用方針は、無料枠を重視する最新依頼を受け代替案と再比較中。

## 外部生成用プロンプトの引き渡し（2026-09-18）

ユーザーはGenspark Plus/Pro未加入であることを明確化し、外部生成用の全プロンプトの受け渡しを依頼。`scripts/export-listening-audio-prompts.mts` を追加し、現行教材から直接抽出した。これはアプリZIPでも生成済み音声でもない。

- ZIP: https://www.genspark.ai/api/files/s/ajmDZ859
- ローカル: `.delivery/manatobi_external_audio_prompts_2026-09-18.zip`（2,569,394 bytes、2,415 files）
- SHA-256: `161e359e883957d27abd67801c416e9ed5c7235c2564f13ab5a3259760ba3fa4`
- 範囲: 全9単元、364完成音源分、1,309発話、読み上げ140,599文字。原本に話者情報不足のある48音源は要確認。プロバイダの実voice_idは全て未承認。
- 同梱: 最初に読む手順、外部担当者へのマスタープロンプト、音源別制作指示とGemini代替プロンプト、ラベルなし原文、MiniMax API入力テンプレート、話者・アクセント計画、先行8サンプルの計画、商用条件/サポート問い合わせ文、返却台帳と結合・QC手順。
- 台本は改変なし。原本との独立照合で全364音源/1,309発話と第6問の性別・アクセント指定の一致を確認。全ファイルSHA、ZIPのCRCと再展開相当の内容比較も成功。既存出力先の上書き拒否を確認。
- `spoken/*.txt` の中身だけをMiniMaxのPrompt欄へ渡す。制作指示・話者名・JSON全体は読ませない。APIテンプレートは実行プログラムではなく、実voice_idと契約の確認後に使用する。
- 完成済み音声、補助単語の追加録音、BGM、動画、実アプリ、APIキー、個人の課金情報は同梱していない。音声生成・支払い・公開は未実施。旧アプリZIPの公開保留も継続。
- パックはこの会話への納品用としてアップロード済み。別リスニング部屋は未登録・未送付で、外部サービスへの実投入や生成完了も未確認。

## 選定結果：MiniMaxを採用方針、公開承認は別（2026-09-18）

ユーザーはKokoroを不採用とし、MiniMaxは明瞭だが少し反響感があり、Geminiは感情表現を感じると評価。コストより品質・商用利用の安全性を優先するよう依頼した。Genspark Plus/Proには未加入との申告あり。未加入だけで全生成物を法的に不可と断定せず、本案件は商用条件を確認できる経路で再生成する方針。

- 採用方針：MiniMax Speech 2.8 HD。教材の聞き取りやすさを優先。Kokoroは候補から除外し全量生成を再開しない。Geminiは代替候補、ElevenLabs直接有料生成は契約条件が明確な予備経路。
- 本番生成の推奨経路：利用者名義のfal有料従量課金で、標準提供ボイスを使い、運営側で音声ファイルを事前生成する。Gensparkのクレジット消費をfalとの直接契約の証明にしない。現時点で契約・本番生成は未実施。
- falモデルページのCommercial use表示を再確認：https://fal.ai/models/fal-ai/minimax/speech-2.8-hd
- fal規約（2026-09-08）：https://fal.ai/terms 。第三者条件と非侵害免責がある。API統合のCustomer Solutionには18歳以上のエンドユーザー条件があるため、学習者が生成APIを呼ぶ設計にはしない。事前生成ファイルの収益化教材への同梱、選択ボイス、契約終了後の配信継続について不明点は本番全量生成前に書面確認する。問い合わせ未送信・回答未取得。
- MiniMax Open Platform規約も参照：https://platform.minimax.io/protocol/terms-of-service 。入力・生成内容の権利保持、適用されるサービスルール、合成音声の表示要件を確認。これをGenspark無料経由の利用権へ転用しない。

独立した比較評価（2026-09-18取得）：
https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice
Gemini 3.1 Flash TTS: Elo 1200 / 95% CI ±12、Eleven v3: 1166 / ±11、MiniMax Speech 2.8 HD: 1165 / ±11。MiniMaxとElevenの優劣はこの差から判断できない。音色が似ていることを証明する指標ではない。
https://artificialanalysis.ai/methodology/text-to-speech
Provider Voice Arenaは各社の複数の標準声を用いるユーザー選好評価。受験英語の正答率・残響測定ではなく、世間全体の総意でもない。総合選好ではGeminiが上だが、今回の利用者評価と教材用途を優先しMiniMaxを選んだ。

試聴サンプルは生成済み：Gemini/Aoede（約6.1秒）、MiniMax/English_Graceful_Lady（約5.8秒）、ElevenLabs v3/Adeline（約3.8秒）、既存Kokoro/af_heart（約5.0秒）。新規3本のWhisper認識は同一台本と一致。旧Q1Aの台帳はexisting_assetでElevenLabs製を証明できず、誤ラベルを避けるためElevenLabsも新規生成した。

`.tmpwork/audio-comparison-2026-09-18/` に原音4本、音量調整した連続MP3/WAV、hash・生成経路JSON、約2.2MBのZIPを用意し、全MP3デコードとZIP CRCを検証。アップロード呼び出しは中断され共有URL取得未確認。原音を変更せず、連続版のみ定数ゲインでRMSをそろえた（MiniMax -6.20dB、Gemini +0.01dB）。声・話速が異なるため厳密なモデル比較ではない。反響の原因は未確定で、音量調整で除去したとは言わない。

次の品質確認は同一音量で短文・男女対話・数値と否定・長文を検査。標準ボイスの変更、無加工FLAC/PCMの取得を優先し、強いノイズ除去で子音を損なわない。API資料にはリバーブを直接無効化する設定は確認できず、「反響なし」の文章指定だけで直るとは保証しない。https://fal.ai/models/fal-ai/minimax/speech-2.8-hd/api

現サンプルのGenspark経由商用権は未確認。本番音源への転用、全364本の生成、差し替え、公開ゲート解除、新版ZIP納品はいずれも未実施。

## それ以前の調査：音質再選定・生成経路別確認（2026-09-18）

ユーザーからKokoroの「ガサガサ」が気になるとの指摘。採用は保留し、代表生成のPythonと全量生成の待機shellを停止、プロセスが残っていないことを確認した。ログ上は代表7本が完了、第6問Bは未完了。既存音源の置換・公開ゲート解除はしない。停止中に作成された途中キャッシュは再開前に検査する。

既存音源にはGenspark経由とElevenLabs直接生成が混在している。エンジン名で一括判定せず、生成経路・生成日・生成時プラン・声の条件・証跡を音源ごとに確認する。契約履歴と各音源への対応は未確認であり、全件再生成が必須と確定したわけではない。

一次資料を2026-09-18に取得して確認：

- Genspark Membership Plans: https://www.genspark.ai/helpcenter/membership-plans
  - FAQはPlus/Proの有効な契約期間中に作成したAIコンテンツについて、音声を含む商用利用権を明記している。現ページの特典保証は2027-06-30までで、それ以後に作るものは最新条件を参照とある。過去の全プラン・全生成物への遡及保証と解釈しない。
- Genspark Terms (Last updated 2026-04-02): https://www.genspark.ai/terms
  - 規約と適用プランに従う商用利用を認める一方、第三者の権利・ライセンス条件を留保する。出所・生成の文脈を明示せず再公開しない旨もある。教材内の帰属表示を確認する。Genspark経由のElevenLabs音声を、個人のElevenLabs Free契約と同一扱いで不可とは判定しない。個別モデル・声の例外や解約後の継続利用が不明ならサポートへ書面確認する。
- ElevenLabs公式FAQ: https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform
  - 直接利用のFreeは商用不可。有料契約期間中の生成物は、必要な権利・規約遵守を条件に解約後も商用利用可。無料時の生成物が後の有料化で商用可になるわけではない。
- MiniMax Speech 2.8 HDのfal公式モデルページ: https://fal.ai/models/fal-ai/minimax/speech-2.8-hd
  - Commercial use表示を確認。ただしfal直接利用の説明とGensparkの契約は区別する。
- Gemini API規約: https://ai.google.dev/gemini-api/terms
  - 業務用途のAPI利用と出力の権利について記載。未成年向けAPIクライアントには制約があるため、本アプリへライブAPIを組み込む承認根拠にはしない。比較はGenspark経由の事前生成音声を想定し、配布条件は別途確認する。

比較に使用した台本は原本で確認した以下の一文。ユーザー承認後にGemini、MiniMax、ElevenLabsを各1本生成し、既存Kokoroと比較した。

> I was going to bring my umbrella, but I forgot it on the train this morning.

米国英語・成人女性・落ち着いた教材読み・同程度の速さ・BGMなしを指定したが、実際の話速は同一にならなかった。ユーザー評価と今回の選定結果は冒頭に記録。

補足：カフェ対話の「Ice or hot?」はWhisperでは「Nice or hot?」、Geminiでは「Ice or hot?」となった。ASR間の差であり、自然さの合格証明には使わない。

## 採用候補と一次資料

Kokoro-82M v1.0は公式モデルカードにApache 2.0と商用展開の説明がある。
- https://huggingface.co/hexgrad/Kokoro-82M
- https://github.com/hexgrad/kokoro/blob/main/LICENSE
- https://github.com/thewh1teagle/kokoro-onnx （実行コードMIT／モデルApache 2.0）

モデル・音声定義はmodel-files-v1.1のv1.0 int8とvoices-v1.0.bin。ローカル実行し、外部無料TTSサービスを呼ばない。ライセンス本文とモデルカードは `.tmpwork/kokoro/models/` に保存。配布時には必要な帰属・利用条件も同梱する。台本・画像・BGM・動画の権利まで一括保証したものではない。

## 作業

- `scripts/prepare-kokoro-audio.mts`：実教材から364音源のジョブを作成。旧台帳206件と第6問の話者定義を参照する。
- `scripts/generate-kokoro-audio.py --samples`：8種類の代表音源を生成。
- 引数なしで全364件を生成。文単位のチェックポイントから再開可能。
- 出力 `.tmpwork/kokoro/replacement/`。元音源を自動上書きしない。
- 台本・モデル・声のハッシュ、秒数、話速、音量、話者の対応をJSONに記録。
- 2回読みはアプリ側で行うため、ファイルは1回分だけ作る。
- 性別・アクセントが特定できない／代用する話者は要レビュー。自動で確認済みにしない。

## 品質と現状

機械的な波形チェックや書き起こし一致だけでは自然さを保証しない。生成物は必ず `generated_needs_quality_review`。
短文と図書館の男女対話では独立したWhisper書き起こしが台本と一致した。
カフェの対話は「Ice or hot?」が「Nice or hot?」と認識され、要再確認。認識器の誤りか音声の問題かは未確定であり、合格扱いにしない。
長文・数値・否定・固有名詞・話者の区別・自然な間・対戦時間を確認してから差し替える。全364件の品質確認と配布ZIPは未完了。

## 引き継ぎ

リスニング配布判断: リスニングにも送ってください。
リスニング配布理由: 商用条件を確認した音源へ移行するため。
リスニング対象: 再生成音源、生成スクリプト、品質台帳、ライセンス表示、公開ビルド。
リスニング受け渡し状況: 未送付。サンプルを共有し検証中。旧ZIPは公開保留。

/**
 * 英文法　問題データのバレル（集約点）
 *
 * ─────────────────────────────────────────────────────────────────────
 * このファイルは「まとめ役」だけを担当します。問題そのものは持ちません。
 *
 * ★構成★
 *   englishGrammarKit.ts       … 型と buildEgSet()（内容を持たない）
 *   egProblemsGrammar1〜8.ts   … 文法の幹（① 文型 〜 ⑭ 特殊構文）
 *   egProblemsUsage1〜4.ts     … 語法（⑮ 動詞 〜 ⑱ 前置詞）
 *   egProblemsExpr1〜2.ts      … 表現（⑲ イディオム／⑳ 会話・語い）
 *   englishGrammarProblems.ts  … ★このファイル。20 単元をまとめて再輸出★
 *   englishGrammarData.ts      … 単元ツリーへ流し込み、解説を整形
 *
 * ★1ファイル1〜2単元に分けている理由★
 *   1問ごとに英文・4択・和訳・語句・思考ステップ・誤答肢の理由を手書きしており、
 *   1単元でおよそ 10KB になります。1ファイルにまとめると編集も差分確認も
 *   現実的でなくなるため、単元単位で分割しています。
 *
 * ★型は englishGrammarKit.ts が唯一の出どころ★
 *   以前このファイルに独自の GrammarProblem 型を書いていましたが、
 *   audioTracks / readCount を持たない古い設計だったため廃止しました。
 *   型定義を二重に持つと必ず食い違うので、ここでは再輸出だけを行います。
 * ─────────────────────────────────────────────────────────────────────
 */

export type {
  GrammarAudioTrack,
  GrammarProblem,
  EgItem,
  EgMark,
  EgSetMeta,
} from './englishGrammarKit';

export { EG_MARKS, buildEgSet } from './englishGrammarKit';

// =====================================================================
// 第1部　文法の幹（文型 → 時制 → 準動詞 → 関係詞 → 仮定法 → 比較）
// =====================================================================

/** eg1_1　① 基本5文型と自動詞・他動詞 */
export { egSvPatternProblems } from './egProblemsGrammar1';
/** eg1_2　② 基本時制と時制の一致 */
export { egTenseProblems } from './egProblemsGrammar1';

/** eg1_3　③ 完了形（現在・過去・未来） */
export { egAspectProblems } from './egProblemsGrammar2';
/** eg1_4　④ 助動詞と助動詞＋have p.p. */
export { egModalProblems } from './egProblemsGrammar2';

/** eg1_5　⑤ 受動態・知覚動詞・使役動詞 */
export { egPassiveProblems } from './egProblemsGrammar3';
/** eg2_1　⑥ 不定詞（3用法と重要構文） */
export { egInfinitiveProblems } from './egProblemsGrammar3';

/** eg2_2　⑦ 動名詞と to do / doing の使い分け */
export { egGerundProblems } from './egProblemsGrammar4';
/** eg2_3　⑧ 分詞と分詞構文 */
export { egParticipleProblems } from './egProblemsGrammar4';

/** eg2_4　⑨ 関係代名詞（格と what・that） */
export { egRelativeProblems } from './egProblemsGrammar5';
/** eg2_5　⑩ 関係副詞と複合関係詞 */
export { egRelativeAdverbProblems } from './egProblemsGrammar5';

/** eg3_1　⑪ 仮定法過去・過去完了・未来 */
export { egSubjunctiveProblems } from './egProblemsGrammar6';
/** eg3_2　⑫ if を使わない仮定表現 */
export { egSubjunctiveNoIfProblems } from './egProblemsGrammar6';

/** eg3_3　⑬ 原級・比較級・最上級と重要表現 */
export { egComparisonProblems } from './egProblemsGrammar7';

/** eg3_4　⑭ 強調・倒置・省略・同格・無生物主語 */
export { egSpecialProblems } from './egProblemsGrammar8';

// =====================================================================
// 第2部　語法（動詞・名詞・形容詞・副詞・前置詞の使い方）
// =====================================================================

/** eg4_1　⑮ 動詞の語法（自他・語形・型） */
export { egVerbUsageProblems } from './egProblemsUsage1';
/** eg4_2　⑯ 名詞・代名詞・冠詞の語法 */
export { egNounArticleProblems } from './egProblemsUsage2';
/** eg4_3　⑰ 形容詞・副詞の語法 */
export { egAdjAdverbProblems } from './egProblemsUsage3';
/** eg4_4　⑱ 前置詞の語法 */
export { egPrepositionProblems } from './egProblemsUsage4';

// =====================================================================
// 第3部　イディオム・会話表現・語い
// =====================================================================

/** eg5_1　⑲ 動詞を含む熟語・群動詞 */
export { egIdiomProblems } from './egProblemsExpr1';
/** eg5_2　⑳ 会話表現と多義語・語い */
export { egConversationProblems } from './egProblemsExpr2';

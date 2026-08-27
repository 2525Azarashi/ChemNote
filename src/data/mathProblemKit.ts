/**
 * ===================================================================
 * 数学の問題データを組み立てる共通部品
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ なぜこのファイルを作ったのか
 * -------------------------------------------------------------------
 * 短答式サブ設問を組み立てる補助関数 sq() が、数学の問題データ4ファイルに
 * ★1バイトも違わない同じ実装で4つ★ 置かれていた。
 *
 *   src/data/mathIntegerProblems.ts     （数A 整数）
 *   src/data/mathIntegralProblems.ts    （数II 積分）
 *   src/data/mathProbabilityProblems.ts （数A 確率）
 *   src/data/mathVectorProblems.ts      （数C ベクトル）
 *
 * 合計171箇所から呼ばれており、数学の短答式サブ設問はすべてこれを通る。
 * 4つに分かれていると、
 *
 *   - 短答式の既定値（requiresMathPalette など）を変えるとき
 *     4ファイルすべてを直さないと、単元によって挙動が違ってしまう
 *   - 1つだけ直し忘れると「積分では数式パレットが出るのに
 *     ベクトルでは出ない」といった不整合になる
 *
 * という事故が起きうる。1か所に集約する。
 *
 * -------------------------------------------------------------------
 * ■ 型 MathProblem について（互換性）
 * -------------------------------------------------------------------
 * MathProblem はもともと mathIntegralProblems.ts で定義されており、
 * 他の3ファイルが `import type { MathProblem } from './mathIntegralProblems'`
 * と書いていた。「積分の問題ファイル」が型の置き場になっているのは
 * 分かりにくいので、型もここに移した。
 *
 * ただし mathIntegralProblems.ts はこの型をそのまま再エクスポートするので、
 * 既存の import は**書き換え不要**でそのまま動く
 * （utils/logicTreeTypes.ts ↔ components/InteractiveTree.tsx と同じ方式）。
 * 型は TypeScript のコンパイル時に消えるため、実行されるコードは変わらない。
 *
 * -------------------------------------------------------------------
 * ■ 依存の向き
 * -------------------------------------------------------------------
 * このファイルは何も import しない（葉）。
 * data 層の中だけで完結するので、utils → data → utils のような
 * 往復を新たに作らない。
 */

/** 1つの大問。chemistryData の practiceProblems 要素と同形。 */
export type MathProblem = {
  id: string;
  category: string;
  text: string;
  subQuestions: any[];
  explanation: string;
  surroundingKnowledge: string[];
  deepDiveTopics: string[];
};

/**
 * 短答式サブ設問を組み立てる補助（requiresMathPalette を毎回書かない）。
 *
 * ★ここを変えると数学4単元・171箇所すべての短答式に影響する★
 *   type / requiresMathPalette は既定値として全問に付く。
 *   採点は correctAnswer と acceptedAnswers の両方で行われるため、
 *   表記ゆれの受け入れは acceptedAnswers に足す。
 *
 * @param id              サブ設問ID
 * @param label           設問文
 * @param correctAnswer   正答（表示にも使われる代表の答え）
 * @param acceptedAnswers 表記ゆれとして正解にする答えの一覧
 */
export const sq = (
  id: string,
  label: string,
  correctAnswer: string,
  acceptedAnswers: string[] = [],
) => ({
  id,
  label,
  type: 'short_answer',
  correctAnswer,
  acceptedAnswers,
  requiresMathPalette: true,
});

/**
 * ===================================================================
 * 論理ツリー（フローチャート）のデータ型
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ なぜ型だけを別ファイルに置くのか
 * -------------------------------------------------------------------
 * これらの型はもともと components/InteractiveTree.tsx で定義されていた。
 * しかし utils/logicTreeUtils.ts（ツリーを絞り込む純粋関数）が
 * その型を使うために
 *
 *     utils/logicTreeUtils.ts  →  components/InteractiveTree.tsx
 *
 * という「下位の層が画面の層を参照する」向きの import が発生していた。
 * これは src 全体で唯一の utils → components 依存であり、
 *
 *   - 型が欲しいだけなのに、画面コンポーネント（motion / lucide / 子コンポーネント）
 *     まで芋づるで結びついてしまう
 *   - ツリーの計算ロジックを単体で扱いにくくなる
 *
 * という問題があった。型の置き場をここに移すことで依存の向きを
 *
 *     components  →  utils   （＝他の78本と同じ、素直な向き）
 *
 * に揃えている。
 *
 * -------------------------------------------------------------------
 * ■ 互換性について
 * -------------------------------------------------------------------
 * InteractiveTree.tsx はこの型をそのまま再エクスポートしている。
 * そのため `import { NodeData } from './InteractiveTree'` と書いている
 * 既存のコンポーネントは**変更不要**で、これまでどおり動作する。
 *
 * また型は TypeScript のコンパイル時に消えるため、
 * この分離によって**実行されるコードは一切変わらない**。
 */

/**
 * ノードに表示する手順番号。
 * 数値のほか '補足' のような文字列や、番号を振らない null も取りうる。
 */
export type StepType = number | string | null;

/** 論理ツリーの1ノード（子を持つ再帰構造） */
export interface NodeData {
  id: string;
  label: string;
  step: StepType;
  subLabel?: string;
  isGroup?: boolean;
  explanation?: string;
  /**
   * 解説に添える図・グラフの識別子（ExplanationChart の EXPLANATION_CHARTS のキー）。
   * アスキーアートで図を描かず、SVG として構造化して描画するために用いる。
   */
  chart?: string;
  relatedQuestions?: { id: string; label: string }[];
  children?: NodeData[];
}

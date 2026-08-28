/**
 * ===================================================================
 * ロジックツリー（フローチャート）を絞り込む純粋関数
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ ここに置いてある関数
 * -------------------------------------------------------------------
 *   extractSectionByChapter … c5(酸と塩基)/c6(酸化還元) のフルツリーから
 *                             下位章に対応するセクションを切り出す。
 *                             ChapterFlowchartModal（単元選択のフロー
 *                             チャート）と PracticeExplanationTree
 *                             （問題解説のツリー）の2画面が使っている。
 *
 * -------------------------------------------------------------------
 * ■ 以前ここにあった、どこからも呼ばれていなかった関数について
 * -------------------------------------------------------------------
 *   このファイルには長い間、誰も呼んでいない関数が残っていた。
 *
 *     collectQuestionIds / extractRelevantTree
 *       … 「表示中の問題に relatedQuestions が対応するノードだけを残す」
 *         枝刈り方式。c5/c6 のツリーを添付HTMLのフル解説に差し替えた際
 *         （commit f4c475c）、確認問題プレースホルダを消したことで
 *         relatedQuestions を持たないノードが枝刈りされてしまう問題が
 *         起き、★extractSectionByChapter（章番号でセクションを選ぶ方式）
 *         に置き換えられた★。つまり役目を終えた実装である。
 *
 *     getRelatedSteps / filterTree
 *       … getRelatedSteps は画面側（Explanation.tsx）にある章別の
 *         実装だけが使われていた。こちらは章を見ずに6本のツリーを
 *         無条件に探すもので、呼び出し元が無かった。
 *         filterTree は Explanation.tsx のコピー（export の有無以外
 *         完全に同一）ともども、どちらも呼ばれていなかった。
 *
 *   ★これらを消したことで得られた効果★
 *     getRelatedSteps が chemistryData から6本のツリーを import して
 *     いたため、このファイルは
 *         utils/logicTreeUtils.ts  →  data/chemistryData.ts
 *     という「utils が data を参照する」向きの import を持っていた。
 *     さらに data/chemistryData.ts は utils/explanationFormat.ts を
 *     import しているので、ファイル単位で
 *         utils → data → utils
 *     という往復が生まれていた。使われていない関数を消すことで、
 *     この import ごと解消できた（現在このファイルは型以外に
 *     何も import しない）。
 *
 *   なお Rollup は使われていない export を落とすため、成果物の
 *   ふるまいは変わらない。実際に削除前後でチャンクの内容を比較して
 *   確認している。
 */
import type { NodeData } from './logicTreeTypes';

/**
 * 単元全体を1つの大きなツリーで共有している c5(酸と塩基)/c6(酸化還元) 用に、
 * 「その下位章に対応する重要事項セクションだけ」をルートごと切り出す。
 *
 * これらのツリーは
 *   root（酸と塩基 / 酸化還元反応）
 *     └ children[0] = 重要事項① …（isGroup, 章 c5_1/c6_1）
 *     └ children[1] = 重要事項② …（isGroup, 章 c5_2/c6_2）
 *     └ …
 * という並びで、children の index がそのまま下位章の番号（1始まり）に対応する。
 * 添付HTMLをそのまま反映したフル解説ツリーであり、確認問題プレースホルダは含まない。
 *
 * - chapterId が "c5"/"c6"（単元トップ）の場合は全セクションをそのまま表示する。
 * - "c5_2" 等の下位章の場合は、対応する1セクションのみを子に持つルートを返す。
 * - 対応セクションが存在しない場合はフルツリーをそのまま返す（フォールバック）。
 *
 * @param fullTree   単元全体のロジックツリー（acidBaseTreeData / redoxTreeData）
 * @param chapterId  "c5" / "c5_2" / "c6" / "c6_5" など
 * @returns          切り出し後のツリー（該当なし・単元トップならフルツリー）。
 */
export const extractSectionByChapter = (
  fullTree: NodeData | null | undefined,
  chapterId: string
): NodeData | null => {
  if (!fullTree) return null;

  // "c5_2" -> 2 / "c6_5" -> 5。単元トップ("c5"/"c6")なら null（＝全体表示）。
  const m = chapterId.match(/^c[56]_(\d+)$/);
  if (!m) return fullTree; // 単元トップ or 想定外 → フル表示

  const sectionIndex = parseInt(m[1], 10) - 1; // 1始まり → 0始まり
  const children = fullTree.children || [];
  const section = children[sectionIndex];
  if (!section) return fullTree; // フォールバック（想定外の章番号）

  return {
    ...fullTree,
    children: [section],
  };
};

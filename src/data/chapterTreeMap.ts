/**
 * ===================================================================
 * 章ID → ロジックツリー（学習フローチャート）の対応表
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ なぜこのファイルを作ったのか
 * -------------------------------------------------------------------
 * 「章ID からその章のフローチャートを引く」という同じ対応表が、
 * 2つの画面にそれぞれ書かれていた。
 *
 *   - components/ChapterFlowchartModal.tsx （単元選択画面のフローチャート）
 *       … if 文を17本並べて代入していく方式
 *   - components/PracticeExplanationTree.tsx（問題解説のツリー）
 *       … Record を引いてから c5/c6 をフォールバックする方式
 *
 * 書き方は違うが、中身（17本の対応と c5/c6 の扱い）は同一だった。
 * 実在する29章＋想定外IDの計38パターンで両者の返り値を比べ、
 * ★すべてツリーの参照が一致すること★を確認済み
 * （tests/chapterTreeResolution.test.ts の「前提の確認」テスト）。
 *
 * 対応表が2か所にあると、章やツリーを追加したときに
 * 「単元選択画面には出るが問題解説には出ない」といった
 * 片方だけ直し忘れる事故が起きる。1か所に集約する。
 *
 * -------------------------------------------------------------------
 * ■ なぜ utils/ ではなく data/ に置くのか（重要）
 * -------------------------------------------------------------------
 * この対応表は chemistryData.ts の17本のツリーを参照する。
 * もし utils/ に置くと
 *
 *     utils/  →  data/chemistryData.ts  →  utils/explanationFormat.ts
 *
 * という utils → data → utils の往復が生まれてしまう。
 * これは直前のコミットで logicTreeUtils.ts から取り除いたばかりの
 * 循環依存そのものである。同じ問題を作り直さないため、
 * ツリーの実体と同じ data 層に置く。
 * 依存の向きは components → data の一方向のみになる。
 *
 * ※ ここには型以外に utils を実行時 import しない。
 *    （tests/chapterTreeResolution.test.ts が番人として見張っている）
 *
 * -------------------------------------------------------------------
 * ■ ふるまいを変えていないこと
 * -------------------------------------------------------------------
 * 「該当ツリーが無いとき」の型は画面ごとに違っていた
 * （Modal は null、Practice は undefined）。ここは画面側の分岐に
 * 直結するので、この関数は undefined を返し、
 * 各画面が従来どおりの形に受け取る。表示は一切変わらない。
 */
import {
  substanceTreeData,
  separationTreeData,
  componentDetectionTreeData,
  thermalMotionTreeData,
  atomicStructureTreeData,
  ionTreeData,
  ionGenerationTreeData,
  ionSizeTreeData,
  chemicalBondTreeData,
  crystalTreeData,
  interactionTreeData,
  atomicWeightTreeData,
  amountOfSubstanceTreeData,
  chemicalEquationTreeData,
  concentrationTreeData,
  acidBaseTreeData,
  redoxTreeData,
} from './chemistryData';
import type { NodeData } from '../utils/logicTreeTypes';

/**
 * 章ごとに専用のツリーを持つ章（c1〜c4）の対応表。
 *
 * ここに無い章では、別単元のツリーを誤って表示しないよう
 * 何も返さない（フローチャートを描画しない）。
 */
const TREE_BY_CHAPTER: Record<string, NodeData> = {
  c1_1: substanceTreeData,
  c1_2_A: separationTreeData,
  c1_2_B: componentDetectionTreeData,
  c1_3: thermalMotionTreeData,
  c2_1: atomicStructureTreeData,
  c2_2: ionTreeData,
  c2_3: ionGenerationTreeData,
  c2_4: ionSizeTreeData,
  c3_1: chemicalBondTreeData,
  c3_2: crystalTreeData,
  c3_3: interactionTreeData,
  c4_1: atomicWeightTreeData,
  c4_2: amountOfSubstanceTreeData,
  c4_3: chemicalEquationTreeData,
  c4_4: concentrationTreeData,
};

/**
 * 単元全体で1つの大きなツリーを共有している単元の対応表。
 * c5(酸と塩基)/c6(酸化還元) は下位章（c5_1〜c5_7 / c6_1〜c6_7）が
 * すべて同じフルツリーを指し、表示時に該当セクションを切り出す。
 */
const SHARED_UNIT_TREES: { prefix: string; tree: NodeData }[] = [
  { prefix: 'c5', tree: acidBaseTreeData },
  { prefix: 'c6', tree: redoxTreeData },
];

/** 対応表に載っている章の数（c1〜c4 の15章 + c5 + c6 = 17） */
export const CHAPTER_TREE_COUNT =
  Object.keys(TREE_BY_CHAPTER).length + SHARED_UNIT_TREES.length;

/**
 * その章が「単元全体で1つのツリーを共有する単元（c5/c6）」に属するか。
 *
 * true の場合、呼び出し側は extractSectionByChapter で
 * 該当セクションだけを切り出して表示する。
 * c1〜c4 は章ごとに専用ツリーがあるため切り出さない（false）。
 */
export function isSharedUnitTree(chapterId: string | undefined | null): boolean {
  if (!chapterId) return false;
  return SHARED_UNIT_TREES.some(
    ({ prefix }) => chapterId === prefix || chapterId.startsWith(`${prefix}_`)
  );
}

/**
 * その章に学習フローチャート（ロジックツリー）が用意されているか。
 *
 * 解説画面（Explanation.tsx）が「フローチャートのブロックを描画するか」を
 * 決めるのに使う。以前は Explanation.tsx が17章ぶんの章IDを直接並べた
 * ★3つめのコピー★ を持っていたため、章を追加したときに
 * 「対応表にツリーはあるのにブロックが描画されない」という
 * 食い違いが起きうる状態だった。対応表から導出することで、
 * ツリーを1本足せば描画側も自動的に追従する。
 */
export function hasChapterTree(chapterId: string | undefined | null): boolean {
  return !!resolveChapterTree(chapterId);
}

/**
 * 章IDから、その章のフルツリー（単元共有ツリーの場合は単元全体）を引く。
 *
 * - c1〜c4 … 章ごとの専用ツリー
 * - c5/c6 および その下位章 … 単元全体の共有ツリー
 * - それ以外（他教科・未知のID・空文字・undefined）… undefined
 *   （誤ったフローチャートを表示しないため、あえて何も返さない）
 *
 * ※ 返すのは元データそのものの参照。呼び出し側で書き換えてはいけない。
 */
export function resolveChapterTree(
  chapterId: string | undefined | null
): NodeData | undefined {
  if (!chapterId) return undefined;

  const dedicated = TREE_BY_CHAPTER[chapterId];
  if (dedicated) return dedicated;

  const shared = SHARED_UNIT_TREES.find(
    ({ prefix }) => chapterId === prefix || chapterId.startsWith(`${prefix}_`)
  );
  return shared?.tree;
}

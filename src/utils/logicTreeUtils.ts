import { NodeData } from '../components/InteractiveTree';
import { substanceTreeData, separationTreeData, thermalMotionTreeData, atomicStructureTreeData, ionTreeData, ionGenerationTreeData } from '../data/chemistryData';

export const getRelatedSteps = (sqId: string, currentQuestion: any) => {
  const steps: { step: number | string | null, label: string, id: string }[] = [];
  
  const findInTree = (node: NodeData) => {
    if (node.relatedQuestions?.some(q => q.id === sqId)) {
      steps.push({ step: node.step, label: node.label, id: node.id });
    }
    if (node.children) {
      node.children.forEach(findInTree);
    }
  };
  
  if (substanceTreeData) findInTree(substanceTreeData);
  if (separationTreeData) findInTree(separationTreeData);
  if (thermalMotionTreeData) findInTree(thermalMotionTreeData);
  if (atomicStructureTreeData) findInTree(atomicStructureTreeData);
  if (ionTreeData) findInTree(ionTreeData);
  if (ionGenerationTreeData) findInTree(ionGenerationTreeData);
  
  return steps;
};

export const filterTree = (node: NodeData, relatedNodeIds: string[]): NodeData | null => {
  const isRelated = relatedNodeIds.includes(node.id);
  const filteredChildren = node.children
    ? node.children.map(child => filterTree(child, relatedNodeIds)).filter(child => child !== null) as NodeData[]
    : [];
  
  if (isRelated || filteredChildren.length > 0) {
    return {
      ...node,
      children: filteredChildren
    };
  }
  return null;
};

/**
 * 表示中の問題（親問題＋その小問）に対応する ID を集約する。
 * ロジックツリーの relatedQuestions は、親問題ID・小問IDのいずれかで
 * 対応付けられているため、両方を集める。
 */
export const collectQuestionIds = (questions: any[]): Set<string> => {
  const ids = new Set<string>();
  for (const q of questions || []) {
    if (!q) continue;
    if (q.id) ids.add(q.id);
    for (const sq of q.subQuestions || []) {
      if (sq?.id) ids.add(sq.id);
    }
  }
  return ids;
};

/**
 * ツリー内の各ノードが「表示中の問題」に関連しているかを判定する。
 * relatedQuestions のいずれかの id が targetIds に含まれていれば関連ノード。
 */
const nodeMatchesQuestions = (node: NodeData, targetIds: Set<string>): boolean => {
  if (!node.relatedQuestions || node.relatedQuestions.length === 0) return false;
  return node.relatedQuestions.some(rq => targetIds.has(rq.id));
};

/**
 * フルツリーから「表示中の問題に対応する枝」だけを抜粋する。
 *
 * - 関連ノード（relatedQuestions が対象問題を含むノード）を残す。
 * - 関連ノードへ至る祖先（ルート・Stepグループ等）も残すことで、
 *   Stepバッジ・色分け・階層構造を保ったまま該当箇所のみを切り出す。
 * - 対象問題が全く見つからない場合は null を返す（＝抜粋不能）。
 *
 * @param fullTree     単元全体のロジックツリー
 * @param targetIds    表示中の問題ID群（親問題ID・小問ID）
 * @returns            抜粋後のツリー。該当なしなら null。
 */
export const extractRelevantTree = (
  fullTree: NodeData | null | undefined,
  targetIds: Set<string>
): NodeData | null => {
  if (!fullTree) return null;
  if (!targetIds || targetIds.size === 0) return null;

  const prune = (node: NodeData): NodeData | null => {
    const selfMatch = nodeMatchesQuestions(node, targetIds);
    const prunedChildren = node.children
      ? (node.children.map(prune).filter(Boolean) as NodeData[])
      : [];

    // 自身が該当、または子孫に該当がある場合のみ残す（祖先の保持）。
    if (selfMatch || prunedChildren.length > 0) {
      return {
        ...node,
        children: prunedChildren.length > 0 ? prunedChildren : undefined,
      };
    }
    return null;
  };

  return prune(fullTree);
};

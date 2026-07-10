import React from 'react';
import { InteractiveTree, NodeData } from './InteractiveTree';
import { substanceTreeData, separationTreeData, componentDetectionTreeData, thermalMotionTreeData, atomicStructureTreeData, ionTreeData, ionGenerationTreeData, ionSizeTreeData, chemicalBondTreeData, crystalTreeData, interactionTreeData, atomicWeightTreeData, amountOfSubstanceTreeData, chemicalEquationTreeData, concentrationTreeData, acidBaseTreeData, redoxTreeData } from '../data/chemistryData';
import { extractSectionByChapter } from '../utils/logicTreeUtils';

interface PracticeExplanationTreeProps {
  deepThoughtData: any;
  chapter: any;
  questions: any[];
  handleQuestionClick: (id: string) => void;
  expandedStep: string | null;
  setExpandedStep: (step: string | null) => void;
  expandedNodeId: string | null;
  scrollTrigger: number;
  isMobile: boolean;
  renderSubQuestionCheck: (sq: any, parentQuestion: any) => React.ReactElement;
  zoom?: 'far' | 'normal';
  /**
   * true のとき、単元選択画面のロジックツリーと完全に同一の「折りたたみ式」挙動にする。
   * （初期状態はすべて閉じており、ノードをタップした時だけ展開する）
   * このとき expandedStep / expandedNodeId / scrollTrigger による自動展開は行わない。
   */
  collapsible?: boolean;
}

export const PracticeExplanationTree: React.FC<PracticeExplanationTreeProps> = ({
  deepThoughtData,
  chapter,
  questions,
  handleQuestionClick,
  expandedStep,
  setExpandedStep,
  expandedNodeId,
  scrollTrigger,
  isMobile,
  renderSubQuestionCheck,
  zoom = 'far',
  collapsible = false
}) => {
  // 章IDごとに対応するフローチャート（ロジックツリー）を明示的に対応付ける。
  // ここに存在しない章（例: c5 酸と塩基, c6 酸化還元）は専用ツリーが無いため、
  // 別単元のツリー（物質の分類など）を誤って表示しないよう、フローチャートを描画しない。
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

  // 酸と塩基・酸化還元は下位章（c5_1〜c5_7 / c6_1〜c6_7）をまとめて1つのツリーに対応させる。
  const resolveTree = (chapterId: string | undefined): NodeData | undefined => {
    if (!chapterId) return undefined;
    if (TREE_BY_CHAPTER[chapterId]) return TREE_BY_CHAPTER[chapterId];
    if (chapterId === 'c5' || chapterId.startsWith('c5_')) return acidBaseTreeData;
    if (chapterId === 'c6' || chapterId.startsWith('c6_')) return redoxTreeData;
    return undefined;
  };

  const fullTreeData: NodeData | undefined = resolveTree(chapter?.id);

  // c5(酸と塩基)/c6(酸化還元)は単元全体で1つの大きなツリーを共有しているため、
  // その下位章（c5_1〜c5_7 / c6_1〜c6_7）に対応する重要事項セクションのみを切り出す。
  // 添付HTML由来のフル解説（Step構成・解説付き）をそのまま表示し、
  // 単元選択画面のフローチャートと表示範囲を一致させる。
  // c1〜c4 は章ごとに専用ツリーがあるため切り出さない。
  const isSharedUnitTree = !!chapter?.id && (
    chapter.id === 'c5' || chapter.id.startsWith('c5_') ||
    chapter.id === 'c6' || chapter.id.startsWith('c6_')
  );
  let currentTreeData: NodeData | undefined = fullTreeData;
  if (fullTreeData && isSharedUnitTree) {
    currentTreeData = extractSectionByChapter(fullTreeData, chapter!.id) ?? fullTreeData;
  }

  // 対応するツリーが無い章では、誤ったフローチャートを表示しない。
  if (!currentTreeData) {
    return null;
  }

  const renderContent = (nodeId: string) => {
    const matchedSqs: { sq: any, parentQuestion: any }[] = [];
    
    // Check if deepThoughtData has explanations for this step/node
    if (deepThoughtData?.phase2?.explanations) {
      const stepExplanation = deepThoughtData.phase2.explanations.find((ex: any) => {
        const normalize = (s: string) => s.replace(/[\s【】]/g, '').toLowerCase();
        return normalize(ex.step).includes(normalize(nodeId)) || 
               normalize(nodeId).includes(normalize(ex.step));
      });
      
      for (const question of questions) {
        for (const sq of question.subQuestions) {
          if (stepExplanation?.subQuestionIds?.includes(sq.id)) {
            if (!matchedSqs.some(item => item.sq.id === sq.id)) {
              matchedSqs.push({ sq, parentQuestion: question });
            }
          }
        }
      }
    }
    
    // Also check node's direct relatedQuestions configuration
    const findNodeInTree = (node: any, id: string): any => {
      if (node.id === id) return node;
      if (node.children) {
        for (const child of node.children) {
          const res = findNodeInTree(child, id);
          if (res) return res;
        }
      }
      return null;
    };
    
    const nodeInTree = findNodeInTree(currentTreeData, nodeId);
    if (nodeInTree?.relatedQuestions) {
      const relatedIds = nodeInTree.relatedQuestions.map((rq: any) => rq.id);
      for (const question of questions) {
        for (const sq of question.subQuestions) {
          if (relatedIds.includes(sq.id)) {
            if (!matchedSqs.some(item => item.sq.id === sq.id)) {
              matchedSqs.push({ sq, parentQuestion: question });
            }
          }
        }
      }
    }

    if (matchedSqs.length === 0) return null;

    return (
      <div className="mt-4 space-y-3">
        <div className="text-xs font-bold text-slate-500 mb-2">このステップの確認問題:</div>
        {matchedSqs.map(({ sq, parentQuestion }) => (
          <div key={sq.id} className="w-full">
            {renderSubQuestionCheck(sq, parentQuestion)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div id="logical-tree-section" className="p-1 sm:p-2 border-t border-gray-100 w-full bg-white">
      <div className="flex flex-col w-full">
        <div className="w-full bg-[#FDFBF7] rounded-2xl border border-gray-200 p-1 sm:p-3">
          {collapsible && (
            <p className="text-[11px] sm:text-xs text-gray-500 font-bold px-2 pt-2 pb-1">
              ▼ ロジックツリー（タップで開閉・確認問題へ移動できます）
            </p>
          )}
          <InteractiveTree 
            data={currentTreeData}
            onQuestionClick={handleQuestionClick}
            /* collapsible のときは単元選択画面のロジックツリーと同一挙動にするため、
               自動展開（expandedStep / expandedNodeId / scrollTrigger）を渡さず、
               初期状態はすべて折りたたんだ状態にする。 */
            expandedStep={collapsible ? undefined : expandedStep}
            expandedNodeId={collapsible ? undefined : expandedNodeId}
            scrollTrigger={collapsible ? undefined : scrollTrigger}
            renderContent={renderContent}
            mobileTightCrop={collapsible ? true : isMobile}
            zoom={collapsible ? 'far' : (zoom as 'far' | 'normal')}
            /* 結果表示画面ではツリー全体をワンタップで開閉できるようにする */
            collapsibleAll={collapsible}
          />
        </div>
      </div>
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InteractiveTree, type NodeData } from './InteractiveTree';
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
} from '../data/chemistryData';
import { collectQuestionIds, extractRelevantTree } from '../utils/logicTreeUtils';

// 章IDごとの対応ツリー。c5(酸と塩基)/c6(酸化還元)は下位章もまとめて対応。
const TREE_BY_CHAPTER: Record<string, NodeData> = {
  c1_1: substanceTreeData as NodeData,
  c1_2_A: separationTreeData as NodeData,
  c1_2_B: componentDetectionTreeData as NodeData,
  c1_3: thermalMotionTreeData as NodeData,
  c2_1: atomicStructureTreeData as NodeData,
  c2_2: ionTreeData as NodeData,
  c2_3: ionGenerationTreeData as NodeData,
  c2_4: ionSizeTreeData as NodeData,
  c3_1: chemicalBondTreeData as NodeData,
  c3_2: crystalTreeData as NodeData,
  c3_3: interactionTreeData as NodeData,
  c4_1: atomicWeightTreeData as NodeData,
  c4_2: amountOfSubstanceTreeData as NodeData,
  c4_3: chemicalEquationTreeData as NodeData,
  c4_4: concentrationTreeData as NodeData,
};

const resolveTree = (chapterId: string | undefined): NodeData | undefined => {
  if (!chapterId) return undefined;
  if (TREE_BY_CHAPTER[chapterId]) return TREE_BY_CHAPTER[chapterId];
  if (chapterId === 'c5' || chapterId.startsWith('c5_')) return acidBaseTreeData as NodeData;
  if (chapterId === 'c6' || chapterId.startsWith('c6_')) return redoxTreeData as NodeData;
  return undefined;
};

interface ProblemLogicTreeProps {
  /** 章オブジェクト（id を参照） */
  chapter: any;
  /** 現在表示している問題（この問題に対応する枝だけを抜粋する） */
  currentQuestion: any;
  /** ロジックツリー内の確認問題をタップしたときのハンドラ（任意） */
  onQuestionClick?: (questionId: string) => void;
  isMobile?: boolean;
  /** 初期状態で開いておくか（既定: 閉じている） */
  defaultOpen?: boolean;
}

/**
 * 問題ページ用の抜粋ロジックツリー。
 * その問題に対応する Step/ノードだけを切り出して、開閉式で表示する。
 * 解答解説ページの PracticeExplanationTree と同じ抜粋ロジック
 * （extractRelevantTree）を使うため、両ページで範囲が一致する。
 */
export const ProblemLogicTree: React.FC<ProblemLogicTreeProps> = ({
  chapter,
  currentQuestion,
  onQuestionClick,
  isMobile = false,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const treeData = useMemo<NodeData | null>(() => {
    const fullTree = resolveTree(chapter?.id);
    if (!fullTree || !currentQuestion) return null;
    const targetIds = collectQuestionIds([currentQuestion]);
    const extracted = extractRelevantTree(fullTree, targetIds);
    // 該当ノードが見つからない場合は表示しない（誤ったフルツリーを貼らない）。
    return extracted;
  }, [chapter?.id, currentQuestion]);

  // 対応する抜粋ツリーが無ければ何も描画しない。
  if (!treeData) return null;

  return (
    <div className="mt-5 font-handwriting">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl bg-[#FDFBF7] border border-gray-200 hover:border-[#A9CCE3]/50 transition-colors cursor-pointer"
      >
        <ChevronDown
          size={16}
          className={`text-gray-500 shrink-0 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`}
        />
        <span className="text-[11px] sm:text-xs text-gray-600 font-bold font-handwriting">
          ▼ ロジックツリー（タップで開閉・確認問題へ移動できます）
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-white rounded-2xl border border-gray-200 p-1 sm:p-3 shadow-sm w-full font-handwriting">
              <InteractiveTree
                data={treeData}
                onQuestionClick={onQuestionClick}
                mobileTightCrop={isMobile}
                zoom="far"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

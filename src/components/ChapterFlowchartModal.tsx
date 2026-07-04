import React from 'react';
import { X, GitBranch } from 'lucide-react';
import { InteractiveTree, type NodeData } from './InteractiveTree';
import { motion } from 'motion/react';
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
  redoxTreeData
} from '../data/chemistryData';
import { collectQuestionIds, extractRelevantTree } from '../utils/logicTreeUtils';

interface ChapterFlowchartModalProps {
  chapterId: string;
  chapterTitle: string;
  onClose: () => void;
  onSelectQuestion?: (questionIndex: number) => void;
  questions?: any[];
}

export function ChapterFlowchartModal({ 
  chapterId, 
  chapterTitle, 
  onClose, 
  onSelectQuestion,
  questions = []
}: ChapterFlowchartModalProps) {
  
  // Resolve the FULL tree data by chapterId.
  // ※ c5(酸と塩基)/c6(酸化還元)は単元全体で1つの大きなツリーを共有しており、
  //   下位章（c6_1〜c6_7 等）ごとに開いた場合は「その章の問題に対応するStep範囲だけ」を
  //   抜粋して表示する（フルツリーをそのまま貼らない）。
  let fullTreeData: NodeData | null = null;
  if (chapterId === 'c1_1') fullTreeData = substanceTreeData;
  if (chapterId === 'c1_2_A') fullTreeData = separationTreeData;
  if (chapterId === 'c1_2_B') fullTreeData = componentDetectionTreeData;
  if (chapterId === 'c1_3') fullTreeData = thermalMotionTreeData;
  if (chapterId === 'c2_1') fullTreeData = atomicStructureTreeData;
  if (chapterId === 'c2_2') fullTreeData = ionTreeData;
  if (chapterId === 'c2_3') fullTreeData = ionGenerationTreeData;
  if (chapterId === 'c2_4') fullTreeData = ionSizeTreeData;
  if (chapterId === 'c3_1') fullTreeData = chemicalBondTreeData;
  if (chapterId === 'c3_2') fullTreeData = crystalTreeData;
  if (chapterId === 'c3_3') fullTreeData = interactionTreeData;
  if (chapterId === 'c4_1') fullTreeData = atomicWeightTreeData;
  if (chapterId === 'c4_2') fullTreeData = amountOfSubstanceTreeData;
  if (chapterId === 'c4_3') fullTreeData = chemicalEquationTreeData;
  if (chapterId === 'c4_4') fullTreeData = concentrationTreeData;
  if (chapterId === 'c5' || chapterId.startsWith('c5_')) fullTreeData = acidBaseTreeData;
  if (chapterId === 'c6' || chapterId.startsWith('c6_')) fullTreeData = redoxTreeData;

  // c5/c6 は単元全体で1つの大きなツリーを共有しているため、
  // その章（下位章）の問題に対応するStep範囲のみを抜粋する。
  // c1〜c4 は章ごとに専用ツリーがあり、ツリー全体がそのトピックの範囲なので抜粋しない。
  const isSharedUnitTree =
    chapterId === 'c5' || chapterId.startsWith('c5_') ||
    chapterId === 'c6' || chapterId.startsWith('c6_');
  let currentTreeData: NodeData | null = fullTreeData;
  if (fullTreeData && isSharedUnitTree && questions.length > 0) {
    const targetIds = collectQuestionIds(questions);
    const extracted = extractRelevantTree(fullTreeData, targetIds);
    if (extracted) currentTreeData = extracted;
  }

  // Handle click on a questions from the logic tree node
  const handleQuestionClick = (questionId: string) => {
    if (!onSelectQuestion || questions.length === 0) return;
    
    // Find subquestion or parent question index
    const qIndex = questions.findIndex((q: any) => {
      // Direct comparison or inside subquestions
      if (q.id === questionId) return true;
      return q.subQuestions?.some((sq: any) => sq.id === questionId);
    });

    if (qIndex !== -1) {
      onSelectQuestion(qIndex);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1B2631]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-[100] overflow-y-auto font-handwriting">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl border border-gray-150 w-full max-w-4xl md:max-w-6xl max-h-[90vh] flex flex-col overflow-hidden font-handwriting"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white text-[#2C3E50] shrink-0 font-handwriting">
          <div className="flex items-center gap-3">
            <div className="bg-[#A9CCE3]/20 p-2 rounded-xl">
              <GitBranch className="text-[#2C3E50]" size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-handwriting font-bold tracking-wider leading-tight">
                {chapterTitle}
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-500 font-handwriting font-bold">
                学習フローチャート・ロジックツリー
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 bg-[#FDFBF7] font-handwriting">
          {currentTreeData ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-1 sm:p-3 shadow-sm w-full font-handwriting">
              <p className="text-[11px] sm:text-xs text-gray-500 font-bold px-2 pt-2 pb-1">
                ▼ ロジックツリー（タップで開閉・確認問題へ移動できます）
              </p>
              <InteractiveTree 
                data={currentTreeData}
                onQuestionClick={handleQuestionClick}
                mobileTightCrop={true}
                zoom="far"
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm w-full text-center text-sm text-gray-400 font-handwriting font-bold">
              この単元のフローチャートは準備中です
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0 font-handwriting">
          <p className="text-[10px] sm:text-xs text-slate-400 font-handwriting font-bold">
            ※ ステップをタップして開閉。確認問題ボタンから直接学習を開始できます。
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2C3E50] hover:bg-[#1B2631] text-white text-xs sm:text-sm font-handwriting font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </motion.div>
    </div>
  );
}

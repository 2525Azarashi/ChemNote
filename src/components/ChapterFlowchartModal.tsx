import React from 'react';
import { X, GitBranch } from 'lucide-react';
import { InteractiveTree } from './InteractiveTree';
import { motion } from 'motion/react';
import { 
  substanceTreeData, 
  separationTreeData, 
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
  concentrationTreeData
} from '../data/chemistryData';

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
  
  // Resolve correct tree data by chapterId
  let currentTreeData = substanceTreeData;
  if (chapterId === 'c1_2_A') currentTreeData = separationTreeData;
  if (chapterId === 'c1_3') currentTreeData = thermalMotionTreeData;
  if (chapterId === 'c2_1') currentTreeData = atomicStructureTreeData;
  if (chapterId === 'c2_2') currentTreeData = ionTreeData;
  if (chapterId === 'c2_3') currentTreeData = ionGenerationTreeData;
  if (chapterId === 'c2_4') currentTreeData = ionSizeTreeData;
  if (chapterId === 'c3_1') currentTreeData = chemicalBondTreeData;
  if (chapterId === 'c3_2') currentTreeData = crystalTreeData;
  if (chapterId === 'c3_3') currentTreeData = interactionTreeData;
  if (chapterId === 'c4_1') currentTreeData = atomicWeightTreeData;
  if (chapterId === 'c4_2') currentTreeData = amountOfSubstanceTreeData;
  if (chapterId === 'c4_3') currentTreeData = chemicalEquationTreeData;
  if (chapterId === 'c4_4') currentTreeData = concentrationTreeData;

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
          <div className="bg-white rounded-2xl border border-gray-200 p-1 sm:p-3 shadow-sm w-full font-handwriting">
            <InteractiveTree 
              data={currentTreeData}
              onQuestionClick={handleQuestionClick}
              mobileTightCrop={true}
              zoom="far"
            />
          </div>
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

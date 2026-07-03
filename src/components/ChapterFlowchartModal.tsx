import React from 'react';
import { X, GitBranch } from 'lucide-react';
import { InteractiveTree, type NodeData } from './InteractiveTree';
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
  concentrationTreeData,
  acidBaseTreeData
} from '../data/chemistryData';

interface ChapterFlowchartModalProps {
  chapterId: string;
  chapterTitle: string;
  onClose: () => void;
  onSelectQuestion?: (questionIndex: number) => void;
  questions?: any[];
}

// ⑤ 酸と塩基・⑥ 酸化還元反応 の各サブ単元は、
// 静的HTMLフローチャート集（詳細版）の該当章を iframe で埋め込んで表示する。
// key: chapterId ／ value: フローチャート集内の data-chart-id
const staticFlowchartMap: Record<string, string> = {
  // ⑤ 酸と塩基
  'c5_1': 'p2-2-1', // 酸と塩基の定義
  'c5_2': 'p2-2-2', // 酸と塩基の強さ
  'c5_3': 'p2-2-3', // pHについて
  'c5_4': 'p2-2-4', // 中和とは何か
  'c5_5': 'p2-2-5', // 中和反応の計算
  'c5_6': 'p2-2-6', // 中和滴定の道具と方法
  'c5_7': 'p2-2-7', // 滴定曲線と二段階滴定
  // ⑥ 酸化還元反応
  'c6_1': 'p2-3-1', // 酸化還元反応とは何か（酸化数）
  'c6_2': 'p2-3-2', // 半反応式と酸化還元反応式の作り方
  'c6_3': 'p2-3-3', // 酸化剤と還元剤の量的関係（酸化還元滴定）
  'c6_4': 'p2-3-4', // 酸化剤・還元剤としての強さ
  'c6_5': 'p2-3-5', // 金属のイオン化傾向と反応
  'c6_6': 'p2-3-6', // 電池
  'c6_7': 'p2-3-7', // 工業的製法
};

export function ChapterFlowchartModal({ 
  chapterId, 
  chapterTitle, 
  onClose, 
  onSelectQuestion,
  questions = []
}: ChapterFlowchartModalProps) {
  
  // 静的HTMLフローチャート（詳細版）の該当章
  const staticChartId = staticFlowchartMap[chapterId];

  // Resolve correct tree data by chapterId
  let currentTreeData: NodeData = substanceTreeData;
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
  if (chapterId === 'c5' || chapterId.startsWith('c5_')) currentTreeData = acidBaseTreeData;

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
          {staticChartId ? (
            <div className="flex flex-col gap-4">
              {/* 詳細版フローチャート（静的HTML を iframe 埋め込み） */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full overflow-hidden">
                <iframe
                  src={`/flowcharts/chem-basic-acid-redox-flowchart.html?only=${staticChartId}&embed=1`}
                  title={`${chapterTitle} フローチャート（詳細版）`}
                  className="w-full border-0"
                  style={{ height: 'min(62vh, 720px)', minHeight: 420 }}
                  loading="lazy"
                />
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/60 flex justify-end">
                  <a
                    href={`/flowcharts/chem-basic-acid-redox-flowchart.html#${staticChartId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] sm:text-xs font-bold text-[#2C3E50] hover:text-[#A9CCE3] underline underline-offset-2 transition-colors"
                  >
                    フローチャート集（全項目）を新しいタブで開く ↗
                  </a>
                </div>
              </div>

              {/* ⑤ 酸と塩基はロジックツリーも併せて表示（問題への直接リンク付き） */}
              {chapterId.startsWith('c5') && (
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
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-1 sm:p-3 shadow-sm w-full font-handwriting">
              <InteractiveTree 
                data={currentTreeData}
                onQuestionClick={handleQuestionClick}
                mobileTightCrop={true}
                zoom="far"
              />
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

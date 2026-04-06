import React from 'react';
import { Network, CheckCircle2 } from 'lucide-react';
import { InteractiveTree } from './InteractiveTree';
import { substanceTreeData } from '../data/chemistryData';
import { formatText } from '../utils/textFormatter';

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
  renderSubQuestionCheck
}) => {
  return (
    <div id="logical-tree-section" className="p-4 sm:p-6 md:p-8 border-b border-[#3A506B]/50 w-full max-h-[60vh] overflow-y-auto">
      {chapter.abstractTitle.includes("① 純物質と混合物") ? (
        <div className="flex flex-col w-full gap-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-sm text-slate-300">
            <p className="mb-1"><span className="font-bold text-orange-400">「Step 1」</span>…演習問題⓵－１・演習問題⓵－２ で演習可能</p>
            <p className="mb-1"><span className="font-bold text-emerald-400">「Step 2」</span>…演習問題⓵－４ で演習可能</p>
            <p><span className="font-bold text-blue-400">「Step 3」</span>…演習問題⓵－３ で演習可能</p>
          </div>
          <div className="w-full">
            <InteractiveTree 
              data={substanceTreeData} 
              onQuestionClick={handleQuestionClick} 
              expandedStep={expandedStep} 
              expandedNodeId={expandedNodeId}
              scrollTrigger={scrollTrigger}
              zoom={isMobile ? 'far' : 'normal'}
            />
          </div>
        </div>
      ) : (
        <>
          <h4 className="font-bold mb-3 flex items-center gap-2 text-sm md:text-base text-[#5BC0BE]">
            <Network className="w-4 h-4 md:w-5 md:h-5" />
            ロジックツリー
          </h4>
          <div className="text-xs md:text-sm overflow-x-auto p-4 rounded-lg border text-[#E0E1DD]/80 bg-[#0B132B]/50 border-[#3A506B]/30">
            {deepThoughtData.phase1.tree.split('\n').map((line: string, i: number) => {
              const branchMatch = line.match(/^([ │├─└]+)(.*)$/);
              const branch = branchMatch ? branchMatch[1] : "";
              const nodeText = branchMatch ? branchMatch[2].trim() : line.trim();
              
              const expData = deepThoughtData.phase2?.explanations?.find((e: any) => e.step === nodeText);
              const stepSubQuestions = expData?.subQuestionIds 
                ? questions.flatMap((q: any) => q.subQuestions).filter((sq: any) => expData.subQuestionIds.includes(sq.id))
                : [];

              return (
                <React.Fragment key={i}>
                  <div className="flex items-center my-1.5 whitespace-pre font-mono">
                    <span>{branch}</span>
                    <button 
                      onClick={() => setExpandedStep(expandedStep === nodeText ? null : nodeText)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors shadow-sm ${expData ? "bg-[#3A506B]/20 text-[#E0E1DD] border-[#5BC0BE]/50 hover:bg-[#3A506B]/40" : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}
                    >
                      <span className="font-bold">{nodeText}</span>
                    </button>
                  </div>
                  {expandedStep === nodeText && expData && (
                    <div className="ml-8 mt-2 mb-4 p-4 rounded-xl border shadow-inner bg-[#0B132B]/80 border-[#3A506B]">
                      <h6 className="text-sm font-bold mb-3 flex items-center gap-2 text-[#5BC0BE]">
                        <CheckCircle2 className="w-4 h-4" />
                        解説と答え合わせ
                      </h6>
                      <div className="text-sm mb-4 text-[#E0E1DD]">
                        {formatText(expData.content)}
                      </div>
                      {stepSubQuestions.length > 0 && (
                        <div className="space-y-3">
                          {stepSubQuestions.map((sq: any) => {
                            const parentQuestion = questions.find((q: any) => q.subQuestions.some((s: any) => s.id === sq.id));
                            return renderSubQuestionCheck(sq, parentQuestion);
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

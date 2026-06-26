import React, { useEffect, useState } from 'react';
import { chemistryData } from '../data/chemistryData';
import { ChevronRight, ArrowLeft, ChevronDown, GitBranch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChapterFlowchartModal } from './ChapterFlowchartModal';

interface ChapterSelectionProps {
  mode: 'mini_test' | 'practice';
  onSelectChapter: (id: string, questionIndex?: number) => void;
  onBack: () => void;
}

export function ChapterSelection({ mode, onSelectChapter, onBack }: ChapterSelectionProps) {
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [selectedFlowchart, setSelectedFlowchart] = useState<{ id: string; title: string; questions: any[] } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full notebook-paper rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 relative font-handwriting">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-gray-500 hover:text-[#2C3E50] transition-colors font-bold font-handwriting bg-white/80 px-4 py-2 rounded-full shadow-sm z-10"
      >
        <ArrowLeft size={20} />
        <span className="font-handwriting">戻る</span>
      </button>

      <div className="text-center mb-8 md:mb-12 mt-12 md:mt-0 font-handwriting">
        <h2 className="text-2xl md:text-4xl font-handwriting font-bold text-[#2C3E50] mb-3 md:mb-4">
          {mode === 'mini_test' ? '小テスト' : '演習問題'}
        </h2>
        <p className="text-sm md:text-base text-gray-600 font-handwriting font-bold">
          学習したい単元を選択してください
        </p>
      </div>

      <div className="space-y-12 md:space-y-20 font-handwriting">
        {chemistryData.parts.map(part => {
          // Group chapters by realTitle (e.g., "1章 物質の構成")
          const chaptersByGroup = (part.chapters as any[]).reduce((acc: any, chapter: any) => {
            const group = chapter.realTitle || "その他";
            if (!acc[group]) acc[group] = [];
            acc[group].push(chapter);
            return acc;
          }, {});

          return (
            <div key={part.id} className="font-handwriting">
              <h3 className="text-xl md:text-2xl font-handwriting font-bold text-[#D9A0A0] mb-6 md:mb-10 border-b-4 border-double border-gray-200 pb-2 flex items-center gap-3">
                <span className="bg-[#D9A0A0] text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm shadow-sm shrink-0 font-handwriting">
                  {part.id === 'part1' ? '1' : '2'}
                </span>
                <span className="leading-tight font-handwriting">{part.title}</span>
              </h3>
              
              <div className="space-y-12 md:space-y-16 font-handwriting">
                {Object.entries(chaptersByGroup).map(([groupTitle, chapters], groupIndex, array) => (
                  <div key={groupTitle} className="relative font-handwriting">
                    {/* Chapter Group Title */}
                    <h4 className="text-lg md:text-xl font-handwriting font-bold text-[#2C3E50] mb-4 md:mb-6 pl-3 md:pl-4 border-l-4 border-[#A9CCE3] flex items-center">
                      {groupTitle}
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 font-handwriting">
                      {(chapters as any[]).map(chapter => {
                        const questions = mode === 'mini_test' ? (chapter as any).miniTest : ((chapter as any).practiceProblems || []);
                        const hasQuestions = questions.length > 0;

                        return (
                          <div
                            key={chapter.id}
                            className="group relative sticky-note rounded-xl p-4 md:p-6 text-left flex flex-col justify-between min-h-[180px] md:min-h-[200px] border border-yellow-105 transition-all duration-300 hover:rotate-1 hover:scale-[1.01] hover:shadow-md font-handwriting"
                          >
                            <div className="w-full font-handwriting">
                              <h5 className="text-sm md:text-base font-handwriting font-bold text-[#2C3E50] leading-tight mb-2.5">
                                {chapter.abstractTitle}
                              </h5>

                              {/* Topics List */}
                              {chapter.topics && chapter.topics.length > 0 && (
                                <ul className="text-[10px] md:text-xs text-gray-500 font-handwriting space-y-1 pl-1 mb-4 font-bold">
                                  {chapter.topics.map((topic, idx) => (
                                    <li key={idx} className="flex items-start gap-1 font-handwriting">
                                      <span className="text-[#A9CCE3] mt-0.5 font-handwriting">•</span>
                                      <span className="opacity-90 leading-tight font-handwriting">{topic}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            <div className="w-full mt-4 pt-3 border-t border-yellow-200/40 flex flex-col gap-3 font-handwriting">
                              {/* Action buttons */}
                              <div className="flex flex-wrap items-center gap-2 font-bold font-handwriting">
                                {hasQuestions ? (
                                  <button
                                    onClick={() => onSelectChapter(chapter.id, 0)}
                                    className="flex-1 min-w-[90px] text-center bg-[#2C3E50] text-white hover:bg-[#1B2631] font-bold font-handwriting text-xs py-2 px-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                                  >
                                    最初から解く
                                  </button>
                                ) : (
                                  <span className="text-xs text-gray-400 bg-gray-100/50 px-2.5 py-2 rounded-lg font-handwriting">
                                    準備中
                                  </span>
                                )}

                                {/* Flowchart Viewer Button */}
                                <button
                                  onClick={() => setSelectedFlowchart({ id: chapter.id, title: chapter.abstractTitle, questions })}
                                  className="flex items-center gap-1 text-xs font-bold font-handwriting text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 p-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                                  title="単元のフローチャートを確認"
                                >
                                  <GitBranch size={13} className="text-emerald-600" />
                                  <span className="font-handwriting">フローチャート</span>
                                </button>

                                {/* Choose Question Button */}
                                {hasQuestions && questions.length > 1 && (
                                  <button
                                    onClick={() => setExpandedChapterId(expandedChapterId === chapter.id ? null : chapter.id)}
                                    className={`flex items-center gap-1 text-xs font-bold font-handwriting p-2 rounded-xl border shadow-xs transition-colors cursor-pointer
                                      ${expandedChapterId === chapter.id 
                                        ? 'bg-[#A9CCE3] text-white border-[#A9CCE3]' 
                                        : 'text-[#2C3E50] bg-white border-gray-200 hover:bg-gray-50'}`}
                                  >
                                    <span className="font-handwriting">問を選択</span>
                                    <ChevronDown size={13} className={`transition-transform duration-200 ${expandedChapterId === chapter.id ? 'rotate-180' : ''}`} />
                                  </button>
                                )}
                              </div>

                              {/* Accordion List for Question Selection */}
                              <AnimatePresence>
                                {expandedChapterId === chapter.id && hasQuestions && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden bg-white/80 rounded-xl border border-yellow-255 p-2 space-y-1 max-h-[140px] overflow-y-auto shadow-inner font-handwriting"
                                  >
                                    <div className="text-[10px] text-gray-400 font-bold mb-1 pl-1 font-handwriting">
                                      開始する問題を選択:
                                    </div>
                                    {questions.map((q: any, qIdx: number) => (
                                      <button
                                        key={q.id}
                                        onClick={() => onSelectChapter(chapter.id, qIdx)}
                                        className="w-full text-left p-1.5 hover:bg-[#A9CCE3]/15 rounded-lg flex justify-between items-center text-xs text-slate-700 bg-white/60 border border-gray-150 hover:border-[#A9CCE3]/30 transition-all font-bold font-handwriting cursor-pointer"
                                      >
                                        <span className="truncate pr-1.5 font-handwriting">{q.category || `問 ${qIdx + 1}`}</span>
                                        <ChevronRight size={12} className="text-[#A9CCE3] shrink-0" />
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Dashed separator between chapters (except last) */}
                    {groupIndex < array.length - 1 && (
                      <div className="absolute -bottom-6 md:-bottom-8 left-2 md:left-4 right-2 md:right-4 border-b-2 border-dashed border-gray-300/40 font-handwriting"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chapter Flowchart Viewer Modal */}
      <AnimatePresence>
        {selectedFlowchart && (
          <ChapterFlowchartModal 
            chapterId={selectedFlowchart.id}
            chapterTitle={selectedFlowchart.title}
            questions={selectedFlowchart.questions}
            onClose={() => setSelectedFlowchart(null)}
            onSelectQuestion={(qIdx) => onSelectChapter(selectedFlowchart.id, qIdx)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

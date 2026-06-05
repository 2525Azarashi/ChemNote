import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Edit3, ArrowLeft, GripVertical } from 'lucide-react';
import { formatText } from '../utils/textFormatter';
import { substanceTreeData } from '../data/chemistryData';
import { getRelatedSteps, filterTree } from '../utils/logicTreeUtils';
import { Explanation } from './Explanation';
import { IonizationEnergyChart } from './IonizationEnergyChart';

interface QuizProps {
  mode: 'mini_test' | 'practice';
  chapter: any;
  onFinish: (answers: Record<string, string>) => void;
  onBack: () => void;
  isGuest: boolean;
  isMobileView?: boolean;
  onExplanationChange?: (isExplanation: boolean) => void;
}

export function Quiz({ mode, chapter, onFinish, onBack, isGuest, isMobileView, onExplanationChange }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem(`quiz_answers_${chapter.id}_${mode}`) || '{}');
    } catch {
      return {};
    }
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    return parseInt(localStorage.getItem(`quiz_idx_${chapter.id}_${mode}`) || '0', 10);
  });
  const [showingExplanation, setShowingExplanation] = useState(() => {
    return localStorage.getItem(`quiz_expl_${chapter.id}_${mode}`) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(`quiz_answers_${chapter.id}_${mode}`, JSON.stringify(answers));
  }, [answers, chapter.id, mode]);

  useEffect(() => {
    localStorage.setItem(`quiz_idx_${chapter.id}_${mode}`, currentQuestionIndex.toString());
  }, [currentQuestionIndex, chapter.id, mode]);

  useEffect(() => {
    localStorage.setItem(`quiz_expl_${chapter.id}_${mode}`, showingExplanation.toString());
  }, [showingExplanation, chapter.id, mode]);

  // New state for layout and highlighting
  const [isProblemExpanded, setIsProblemExpanded] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  // Use passed prop if available, otherwise check window width
  const [isDesktop, setIsDesktop] = useState(!isMobileView && window.innerWidth >= 1024);

  useEffect(() => {
    if (isMobileView !== undefined) {
      setIsDesktop(!isMobileView);
    } else {
      const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMobileView]);

  // Clear highlights on new question
  useEffect(() => {
    setHighlights([]);
  }, [currentQuestionIndex]);

  // Prevent zoom/pinch out during active quiz, but allow on explanations
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    const originalContent = meta?.getAttribute('content') || '';
    if (meta) {
      if (showingExplanation) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover');
      } else {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
    }
    
    return () => {
      if (meta) {
        meta.setAttribute('content', originalContent);
      }
    };
  }, [showingExplanation]);

  useEffect(() => {
    if (!showingExplanation) {
      window.scrollTo(0, 0);
    }
  }, [currentQuestionIndex, showingExplanation]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      if (selectedText.length > 0 && selectedText.length <= 100) {
        setHighlights(prev => Array.from(new Set([...prev, selectedText])));
        selection.removeAllRanges();
      }
    }
  };

  const handleOptionSelect = (sqId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [sqId]: option }));
  };

  const handleTextChange = (sqId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [sqId]: text }));
  };

  const questions = mode === 'mini_test' ? chapter.miniTest : (chapter.practiceProblems || []);

  if (questions.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl p-6 md:p-12 border border-gray-100 text-center relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-gray-500 hover:text-[#2C3E50] transition-colors font-bold bg-gray-50 px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={20} />
          <span>戻る</span>
        </button>
        <h2 className="text-xl md:text-2xl font-modern font-bold text-gray-800 mb-4 mt-12 md:mt-8">
          {chapter.abstractTitle}
        </h2>
        <p className="text-sm md:text-base text-gray-500 font-modern mb-8">
          この単元の問題はまだ追加されていません。
        </p>
        <button
          onClick={onBack}
          className="bg-[#1B2631] text-white px-6 py-3 rounded-xl font-bold w-full sm:w-auto"
        >
          単元選択に戻る
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = () => {
    if (!showingExplanation) {
      setShowingExplanation(true);
      if (onExplanationChange) onExplanationChange(true);
    } else {
      if (!isLastQuestion) {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowingExplanation(false);
        if (onExplanationChange) onExplanationChange(false);
      } else {
        onFinish(answers);
        if (onExplanationChange) onExplanationChange(false);
      }
    }
  };

  const handlePrevious = () => {
    if (showingExplanation) {
      setShowingExplanation(false);
      if (onExplanationChange) onExplanationChange(false);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowingExplanation(true);
      if (onExplanationChange) onExplanationChange(true);
    }
  };

  if (showingExplanation) {
    return (
      <Explanation 
        mode={mode} 
        chapter={chapter} 
        answers={answers} 
        onBack={() => { setShowingExplanation(false); if (onExplanationChange) onExplanationChange(false); }} 
        isGuest={isGuest}
        singleQuestionIndex={currentQuestionIndex}
        onNextQuestion={handleNext}
        isLastQuestion={isLastQuestion}
        isMobileView={false}
      />
    );
  }

  return (
    <div className="fixed inset-0 w-full flex flex-col bg-gray-50 overflow-hidden z-40 pb-20 md:pb-0">
      
      {/* Header (Fixed) */}
      <div className="flex-none p-2 md:p-6 border-b border-gray-200 bg-white shadow-sm z-10 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center text-left gap-2 md:gap-4 min-w-0">
          <button 
            onClick={onBack}
            className="flex items-center justify-center p-1.5 md:p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
          >
            <ArrowLeft size={18} className="md:w-5 md:h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm md:text-xl font-handwriting text-[#2C3E50] font-bold truncate">
              {chapter.abstractTitle}
            </h2>
            <div className="text-[10px] md:text-xs text-gray-500 font-bold mt-0.5">
              {mode === 'mini_test' ? '小テスト' : '演習問題'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 bg-gray-100 rounded-full px-3 py-1 md:px-4 md:py-1.5 shrink-0">
          <div className="text-[10px] md:text-sm text-gray-500 font-bold hidden sm:block">進捗</div>
          <div className="font-mono font-bold text-[#2C3E50] text-xs md:text-base">
            <span className="text-sm md:text-lg">{currentQuestionIndex + 1}</span>
            <span className="text-gray-400 mx-1">/</span>
            <span>{questions.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area (Split on Desktop, Stacked on Mobile) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* Section 1: Problem Text */}
        <div className={`
          lg:w-[58%] flex-none flex flex-col bg-white border-b lg:border-b-0 lg:border-r border-gray-200 transition-all duration-300
          ${isDesktop ? 'h-full' : (isProblemExpanded ? 'absolute inset-0 z-30 h-full shadow-lg' : 'max-h-[50vh] h-auto shadow-md relative z-20')}
        `}>
          <div className="flex items-center justify-between p-2 md:p-4 border-b border-gray-100 bg-blue-50/30">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#A9CCE3]/20 text-[#A9CCE3] font-bold flex items-center justify-center text-[10px] md:text-sm border-2 border-[#A9CCE3]">
                Q{currentQuestionIndex + 1}
              </div>
              <span className="font-bold text-[#2C3E50] text-sm md:text-base">問題文</span>
              
              {highlights.length > 0 && (
                <button 
                  onClick={() => setHighlights([])} 
                  className="text-[10px] md:text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 hover:bg-amber-100 transition-colors whitespace-nowrap"
                >
                  ハイライト消去
                </button>
              )}
            </div>
            
            {!isDesktop && (
              <button 
                onClick={() => setIsProblemExpanded(!isProblemExpanded)}
                className="text-xs font-bold text-gray-500 hover:text-[#2C3E50] underline underline-offset-2 whitespace-nowrap"
              >
                {isProblemExpanded ? '閉じる' : '全画面で読む'}
              </button>
            )}
          </div>
          
          <div 
            className="flex-1 overflow-y-auto p-4 md:p-8 text-sm md:text-base text-gray-800 font-modern leading-relaxed"
            onMouseUp={handleTextSelection}
            onTouchEnd={handleTextSelection}
            title="テキストを選択するとハイライトできます"
          >
            <div>
              {formatText(currentQuestion.text, highlights)}
              {currentQuestion.text.includes('図6') && (
                <div className="mt-4">
                  <IonizationEnergyChart showDetails={false} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Answers Area (Scrollable) */}
        <div className={`lg:w-[42%] flex-1 min-h-0 overflow-y-auto bg-gray-50/50 p-4 md:p-8 pb-8 md:pb-8 relative ${!isDesktop && isProblemExpanded ? 'hidden' : 'block z-10'}`}>
          <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
            <h3 className="font-bold text-gray-400 text-sm md:text-base mb-2 md:mb-4">解答入力</h3>
            {currentQuestion.subQuestions.map((sq: any) => (
              <div key={sq.id} className="flex flex-col gap-3 md:gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-[#A9CCE3]/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4">
                  <span className="font-bold text-[#1B2631] min-w-[60px] text-center bg-gray-50 py-1.5 px-3 rounded-md text-sm border border-gray-100 self-start lg:self-auto shrink-0 shadow-sm">{sq.label}</span>
                  
                  {sq.type === 'multiple_choice' ? (
                    <div className="flex flex-wrap gap-2 md:gap-3 w-full">
                      {sq.options.map((opt: string) => {
                        const isSelected = (answers[sq.id] || '').split(',').includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() => {
                              const isMultiple = sq.correctAnswer && sq.correctAnswer.includes(",");
                              let next: string[];
                              if (isMultiple) {
                                const current = (answers[sq.id] || '').split(',').filter(Boolean);
                                next = isSelected 
                                  ? current.filter(a => a !== opt)
                                  : [...current, opt];
                              } else {
                                next = isSelected ? [] : [opt];
                              }
                              handleOptionSelect(sq.id, next.join(','));
                            }}
                            className={`px-3 py-2 md:px-5 md:py-2 rounded-full font-bold text-sm transition-all duration-200 border-2 flex items-center justify-center flex-1 sm:flex-none min-w-[3rem] shadow-sm cursor-pointer
                              ${isSelected 
                                ? 'bg-[#A9CCE3] text-white border-[#A9CCE3] ring-2 ring-[#A9CCE3]/30 scale-[1.02]' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#A9CCE3]/50 hover:bg-gray-50'
                              }`}
                          >
                            {formatText(opt)}
                          </button>
                        );
                      })}
                    </div>
                  ) : sq.type === 'sorting' ? (
                    <div className="flex-grow flex flex-col gap-4 w-full">
                      {/* Interactive Drag & Reorder Sequence */}
                      <div className="flex flex-col gap-2.5">
                        <div className="text-xs text-gray-400 font-bold flex items-center justify-between">
                          <span>ドラッグまたは左右移動ボタンで順序を並べ替え :</span>
                          <span className="text-[10px] text-[#A9CCE3] font-normal">左ほど「大きい」</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2.5 p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl min-h-[72px]">
                          {(() => {
                            const activeOrder = answers[sq.id] ? answers[sq.id].split(' > ') : [...(sq.items || [])];
                            
                            const handleSwap = (idx1: number, idx2: number) => {
                              if (idx1 < 0 || idx1 >= activeOrder.length || idx2 < 0 || idx2 >= activeOrder.length) return;
                              const nextOrder = [...activeOrder];
                              const temp = nextOrder[idx1];
                              nextOrder[idx1] = nextOrder[idx2];
                              nextOrder[idx2] = temp;
                              handleOptionSelect(sq.id, nextOrder.join(' > '));
                            };

                            return activeOrder.map((item: string, idx: number) => {
                              const isDragging = draggingIndex === idx;
                              const isDragOver = dragOverIndex === idx;

                              return (
                                <div
                                  key={`${item}-${idx}`}
                                  draggable
                                  onDragStart={(e) => {
                                    setDraggingIndex(idx);
                                    e.dataTransfer.effectAllowed = 'move';
                                  }}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDragEnter={(e) => {
                                    e.preventDefault();
                                    setDragOverIndex(idx);
                                  }}
                                  onDragLeave={() => setDragOverIndex(null)}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    setDragOverIndex(null);
                                    if (draggingIndex === null || draggingIndex === idx) return;
                                    const nextOrder = [...activeOrder];
                                    const draggedValue = nextOrder[draggingIndex];
                                    nextOrder.splice(draggingIndex, 1);
                                    nextOrder.splice(idx, 0, draggedValue);
                                    handleOptionSelect(sq.id, nextOrder.join(' > '));
                                    setDraggingIndex(null);
                                  }}
                                  onDragEnd={() => {
                                    setDraggingIndex(null);
                                    setDragOverIndex(null);
                                  }}
                                  className={`flex flex-col items-center p-2.5 bg-white border rounded-xl shadow-xs transition-all duration-200 cursor-grab select-none
                                    ${isDragging ? 'opacity-30 border-dashed border-gray-300 scale-95' : 'opacity-100'}
                                    ${isDragOver ? 'border-[#A9CCE3] bg-[#A9CCE3]/15 scale-105 ring-2 ring-[#A9CCE3]/20' : 'border-gray-200 hover:border-[#A9CCE3]/50 hover:bg-gray-50/50'}
                                  `}
                                >
                                  {/* Draggable Header */}
                                  <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
                                    <GripVertical size={13} className="text-gray-400 font-bold" />
                                    <span className="font-bold text-gray-800 text-sm">{formatText(item)}</span>
                                  </div>

                                  {/* Swap & Click controls */}
                                  <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-md border border-gray-150">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => handleSwap(idx, idx - 1)}
                                      className="p-1 rounded hover:bg-white text-gray-500 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                                      title="左に移動"
                                    >
                                      <ChevronLeft size={13} className="stroke-[2.5]" />
                                    </button>
                                    <span className="text-[9px] text-gray-400 font-mono select-none px-0.5">{idx + 1}</span>
                                    <button
                                      type="button"
                                      disabled={idx === activeOrder.length - 1}
                                      onClick={() => handleSwap(idx, idx + 1)}
                                      className="p-1 rounded hover:bg-white text-gray-500 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                                      title="右に移動"
                                    >
                                      <ChevronRight size={13} className="stroke-[2.5]" />
                                    </button>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      {/* Reset controls */}
                      <div className="flex items-center justify-between gap-3 pt-0.5">
                        <span className="text-xs text-gray-400 leading-normal">
                          ※ 元素長押し・ドラッグ、または <code>&lt;</code> <code>&gt;</code> ボタンで並べ替えてください。
                        </span>
                        
                        {(answers[sq.id] || '') !== '' && (
                          <button
                            type="button"
                            onClick={() => {
                              handleOptionSelect(sq.id, '');
                            }}
                            className="text-xs text-red-400 hover:text-red-500 transition-colors font-medium hover:underline py-1 px-2.5 hover:bg-red-50 rounded-lg cursor-pointer shrink-0"
                          >
                            やり直す (初期設定に戻す)
                          </button>
                        )}
                      </div>
                    </div>
                  ) : sq.type === 'descriptive' ? (
                    <div className="flex-1 relative w-full">
                      <Edit3 className="absolute left-3 top-3 text-gray-400" size={16} />
                      <textarea
                        value={answers[sq.id] || ''}
                        onChange={(e) => handleTextChange(sq.id, e.target.value)}
                        placeholder="解答を入力..."
                        rows={3}
                        className="w-full pl-9 pr-4 py-2 md:py-2.5 text-[16px] md:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern resize-none bg-gray-50 focus:bg-white leading-relaxed"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 relative w-full">
                      <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        value={answers[sq.id] || ''}
                        onChange={(e) => handleTextChange(sq.id, e.target.value)}
                        placeholder="解答を入力..."
                        className="w-full pl-9 pr-4 py-2.5 md:py-2.5 text-[16px] md:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern bg-gray-50 focus:bg-white shadow-sm leading-relaxed"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Answer submission action button and back button at the bottom of the answers column */}
            <div className="pt-6 border-t border-gray-200/60 flex items-center justify-between gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                title="前の問題へ"
                className={`flex items-center justify-center p-2.5 rounded-xl font-bold transition-all duration-200 border-2 shrink-0 cursor-pointer
                  ${currentQuestionIndex === 0 
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/50' 
                    : 'border-[#A9CCE3] text-[#A9CCE3] hover:bg-[#A9CCE3] hover:text-white bg-white shadow-sm'}`}
              >
                <ChevronLeft size={16} className="stroke-[2.5]" />
              </button>

              <button
                onClick={handleNext}
                className="flex shadow-md hover:shadow-lg hover:-translate-y-0.5 items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold tracking-wider transition-all duration-300 text-xs md:text-sm bg-[#2C3E50] text-white hover:bg-[#1B2631] flex-1 sm:flex-none sm:w-[180px] cursor-pointer"
              >
                <span>解答と解説を見る</span>
                <ChevronRight size={14} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

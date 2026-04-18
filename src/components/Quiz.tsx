import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Edit3, ArrowLeft } from 'lucide-react';
import { formatText } from '../utils/textFormatter';
import { substanceTreeData } from '../data/chemistryData';
import { getRelatedSteps, filterTree } from '../utils/logicTreeUtils';
import { Explanation } from './Explanation';

interface QuizProps {
  mode: 'mini_test' | 'practice';
  chapter: any;
  onFinish: (answers: Record<string, string>) => void;
  onBack: () => void;
  isGuest: boolean;
  isMobileView?: boolean;
}

export function Quiz({ mode, chapter, onFinish, onBack, isGuest, isMobileView }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showingExplanation, setShowingExplanation] = useState(false);

  // New state for layout and highlighting
  const [isProblemExpanded, setIsProblemExpanded] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
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
    } else {
      if (!isLastQuestion) {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowingExplanation(false);
      } else {
        onFinish(answers);
      }
    }
  };

  const handlePrevious = () => {
    if (showingExplanation) {
      setShowingExplanation(false);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowingExplanation(true);
    }
  };

  if (showingExplanation) {
    return (
      <Explanation 
        mode={mode} 
        chapter={chapter} 
        answers={answers} 
        onBack={() => setShowingExplanation(false)} 
        isGuest={isGuest}
        singleQuestionIndex={currentQuestionIndex}
        onNextQuestion={handleNext}
        isLastQuestion={isLastQuestion}
        isMobileView={isMobileView}
      />
    );
  }

  return (
    <div className="w-full h-[100dvh] md:h-screen flex flex-col bg-gray-50 overflow-hidden relative">
      
      {/* Header (Fixed) */}
      <div className="flex-none p-3 md:p-6 border-b border-gray-200 bg-white shadow-sm z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center w-full sm:w-auto text-left gap-3 md:gap-4">
          <button 
            onClick={onBack}
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h2 className="text-base md:text-xl font-handwriting text-[#2C3E50] font-bold truncate">
              {chapter.abstractTitle}
            </h2>
            <div className="text-xs text-gray-500 font-bold mt-0.5">
              {mode === 'mini_test' ? '小テスト' : '演習問題'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-1.5 w-full sm:w-auto justify-between sm:justify-center">
          <div className="text-xs md:text-sm text-gray-500 font-bold">進捗</div>
          <div className="font-mono font-bold text-[#2C3E50]">
            <span className="text-base md:text-lg">{currentQuestionIndex + 1}</span>
            <span className="text-gray-400 mx-1">/</span>
            <span>{questions.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area (Split on Desktop, Stacked on Mobile) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* Section 1: Problem Text */}
        <div className={`
          lg:w-1/2 flex-none flex flex-col bg-white border-b lg:border-b-0 lg:border-r border-gray-200 transition-all duration-300
          ${isDesktop ? 'h-full' : (isProblemExpanded ? 'absolute inset-0 z-30 h-full shadow-lg' : 'max-h-[35vh] h-auto shadow-md relative z-20')}
        `}>
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-100 bg-blue-50/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#A9CCE3]/20 text-[#A9CCE3] font-bold flex items-center justify-center text-sm border-2 border-[#A9CCE3]">
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
            {formatText(currentQuestion.text, highlights)}
          </div>
        </div>

        {/* Section 2: Answers Area (Scrollable) */}
        <div className={`lg:w-1/2 flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 pb-32 md:pb-32 ${!isDesktop && isProblemExpanded ? 'hidden' : 'block z-10'}`}>
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
                              const current = (answers[sq.id] || '').split(',').filter(Boolean);
                              const next = isSelected 
                                ? current.filter(a => a !== opt)
                                : [...current, opt];
                              handleOptionSelect(sq.id, next.join(','));
                            }}
                            className={`px-3 py-2 md:px-5 md:py-2 rounded-full font-bold text-sm transition-all duration-200 border-2 flex items-center justify-center flex-1 sm:flex-none min-w-[3rem] shadow-sm
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
                  ) : sq.type === 'descriptive' ? (
                    <div className="flex-1 relative w-full">
                      <Edit3 className="absolute left-3 top-3 text-gray-400" size={16} />
                      <textarea
                        value={answers[sq.id] || ''}
                        onChange={(e) => handleTextChange(sq.id, e.target.value)}
                        placeholder="解答を入力..."
                        rows={3}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern resize-none bg-gray-50 focus:bg-white"
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
                        className="w-full pl-9 pr-4 py-3 md:py-2.5 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern bg-gray-50 focus:bg-white shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer (Fixed Navigation Buttons) */}
      <div className={`absolute bottom-0 left-0 right-0 flex-none p-4 md:px-8 md:py-5 bg-white/90 backdrop-blur-md border-t border-gray-200 z-40 ${!isDesktop && isProblemExpanded ? 'hidden' : 'block'}`}>
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl font-bold transition-all duration-200 border-2 text-sm md:text-base shrink-0
              ${currentQuestionIndex === 0 
                ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/50' 
                : 'border-[#A9CCE3] text-[#A9CCE3] hover:bg-[#A9CCE3] hover:text-white bg-white shadow-sm'}`}
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">前の問題へ</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm md:text-base bg-[#2C3E50] text-white hover:bg-[#1a252f] flex-1 max-w-[320px]"
          >
            <span>解答と解説を見る</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

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
}

export function Quiz({ mode, chapter, onFinish, onBack, isGuest }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showingExplanation, setShowingExplanation] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestionIndex, showingExplanation]);

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
      />
    );
  }

  return (
    <div className="w-full notebook-paper rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8 border-b-2 border-dashed border-gray-200 pb-4 md:pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-handwriting text-[#2C3E50] mb-1 md:mb-2 font-bold tracking-wide">
            {chapter.abstractTitle} - {mode === 'mini_test' ? '小テスト' : '演習問題'}
          </h2>
          <div className="text-xs md:text-sm text-gray-500 font-modern font-bold">
            問題 {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-[#D9A0A0] transition-colors font-modern font-bold bg-white px-3 py-2 md:px-4 md:py-2 rounded-full shadow-sm border border-gray-100 text-sm md:text-base w-full sm:w-auto justify-center"
        >
          <ArrowLeft size={16} className="md:w-[18px] md:h-[18px]" />
          <span>戻る</span>
        </button>
      </div>

      <div className="space-y-8 md:space-y-12">
        <div key={currentQuestion.id} className="bg-white/60 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#A9CCE3]/30 relative mt-4 md:mt-0">
          <div className="absolute -top-4 -left-3 md:-top-5 md:-left-5 w-10 h-10 md:w-12 md:h-12 bg-[#FFB7B2] text-white rounded-full flex items-center justify-center font-handwriting text-lg md:text-xl font-bold shadow-md transform -rotate-6">
            Q{currentQuestionIndex + 1}
          </div>
          
          <div className="text-sm md:text-base text-gray-800 font-modern mb-6 md:mb-8 leading-relaxed mt-2 md:mt-0">
            {formatText(currentQuestion.text)}
          </div>



          <div className="space-y-4">
            {currentQuestion.subQuestions.map((sq: any) => (
              <div key={sq.id} className="flex flex-col gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 md:gap-4">
                  <span className="font-bold text-[#1B2631] min-w-[60px] text-center bg-gray-50 py-1 px-2 rounded-md text-xs md:text-sm self-start lg:self-auto">{sq.label}</span>
                  
                  {sq.type === 'multiple_choice' ? (
                    <div className="flex flex-wrap gap-2 md:gap-3">
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
                            className={`px-3 py-1.5 md:px-4 md:py-1.5 rounded-full font-bold text-xs md:text-sm transition-all duration-200 border-2 flex items-center justify-center flex-1 sm:flex-none min-w-[80px]
                              ${isSelected 
                                ? 'bg-[#A9CCE3] text-white border-[#A9CCE3] shadow-md scale-[1.02] md:scale-105' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#A9CCE3] hover:text-[#A9CCE3]'
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
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern resize-none"
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
                        className="w-full pl-9 pr-4 py-2.5 md:py-2 text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern"
                      />
                    </div>
                  )}
                </div>


              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-12 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-bold tracking-wider transition-all duration-300 border-2 text-sm md:text-base
            ${currentQuestionIndex === 0 
              ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
              : 'border-[#A9CCE3] text-[#A9CCE3] hover:bg-[#A9CCE3] hover:text-white'}`}
        >
          <ChevronLeft size={18} className="md:w-5 md:h-5" />
          <span>前の問題へ</span>
        </button>

        <button
          onClick={handleNext}
          className={`flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm md:text-base
            bg-[#2C3E50] text-white hover:bg-[#1a252f]`}
        >
          <span>解答と解説を見る</span>
          <ChevronRight size={18} className="md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}

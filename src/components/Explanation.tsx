import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, BookOpen, AlertCircle, CheckSquare, TrendingUp, AlertTriangle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { formatText } from '../utils/textFormatter';

interface ExplanationProps {
  chapter: any;
  answers: Record<string, string>;
  onBack: () => void;
}

export function Explanation({ chapter, answers, onBack }: ExplanationProps) {
  const [selfGrades, setSelfGrades] = useState<Record<string, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestionIndex]);

  const toggleGrade = (criteriaId: string) => {
    setSelfGrades(prev => ({ ...prev, [criteriaId]: !prev[criteriaId] }));
  };

  const weakAreas = useMemo(() => {
    const analysis: Record<string, { total: number; correct: number }> = {};

    chapter.miniTest.forEach((q: any) => {
      const category = q.category || 'その他';
      if (!analysis[category]) {
        analysis[category] = { total: 0, correct: 0 };
      }

      q.subQuestions.forEach((sq: any) => {
        analysis[category].total += 1;

        if (sq.type === 'descriptive') {
           if (sq.gradingCriteria) {
             const criteriaCount = sq.gradingCriteria.length;
             let checkedCount = 0;
             sq.gradingCriteria.forEach((_: any, idx: number) => {
               if (selfGrades[`${sq.id}_${idx}`]) checkedCount++;
             });
             analysis[category].correct += (checkedCount / criteriaCount);
           }
        } else {
          if (answers[sq.id] === sq.correctAnswer) {
            analysis[category].correct += 1;
          }
        }
      });
    });

    return Object.entries(analysis)
      .map(([category, stats]) => ({
        category,
        percentage: Math.round((stats.correct / stats.total) * 100)
      }))
      .filter(item => item.percentage < 100)
      .sort((a, b) => a.percentage - b.percentage);
  }, [chapter, answers, selfGrades]);

  if (chapter.miniTest.length === 0) {
    return (
      <div className="w-full text-center">
        <button onClick={onBack} className="bg-[#1B2631] text-white px-6 py-3 rounded-xl font-bold w-full sm:w-auto">
          戻る
        </button>
      </div>
    );
  }

  const currentQuestion = chapter.miniTest[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === chapter.miniTest.length - 1;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="w-full space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/40">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#1B2631] transition-colors font-modern font-bold bg-white sm:bg-transparent px-4 py-2 sm:px-0 sm:py-0 rounded-full sm:rounded-none shadow-sm sm:shadow-none border border-gray-100 sm:border-none w-full sm:w-auto justify-center sm:justify-start"
        >
          <ArrowLeft size={18} className="md:w-5 md:h-5" />
          <span className="text-sm md:text-base">単元選択に戻る</span>
        </button>
        <div className="text-xs md:text-sm font-bold text-gray-400 self-center sm:self-auto">
          {chapter.realTitle}
        </div>
      </div>

      {/* Weak Areas Analysis */}
      {currentQuestionIndex === 0 && weakAreas.length > 0 && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg border border-red-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FFB7B2] to-[#D9A0A0]"></div>
          <h3 className="text-lg md:text-xl font-handwriting font-bold text-[#2C3E50] mb-4 md:mb-6 flex items-center gap-2">
            <TrendingUp className="text-[#D9A0A0] w-5 h-5 md:w-6 md:h-6" />
            <span>分析結果：復習推奨エリア</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {weakAreas.map((area) => (
              <div key={area.category} className="bg-white p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-end mb-2 md:mb-3">
                  <div className="flex items-center gap-1.5 md:gap-2 text-gray-700 font-bold text-sm md:text-base">
                    <AlertTriangle className="text-[#D9A0A0] w-4 h-4 md:w-[18px] md:h-[18px]" />
                    <span>{area.category}</span>
                  </div>
                  <span className="font-mono font-bold text-xl md:text-2xl text-[#D9A0A0]">
                    {area.percentage}<span className="text-xs md:text-sm ml-0.5">%</span>
                  </span>
                </div>
                
                {/* Gauge/Slider UI */}
                <div className="relative h-3 md:h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FFB7B2] to-[#ff8080] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${area.percentage}%` }}
                  />
                  {/* Stripes pattern overlay for texture */}
                  <div className="absolute inset-0 opacity-30" 
                       style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.5) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.5) 50%,rgba(255,255,255,.5) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} 
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] md:text-xs text-gray-400 font-mono">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs md:text-sm text-gray-500 mt-4 text-right font-modern">
            ※ 記述問題は自己採点チェックを入れるとスコアに反映されます
          </p>
        </div>
      )}

      <div key={currentQuestion.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Problem Restatement */}
        <div className="bg-[#FDFBF7] p-4 sm:p-6 md:p-8 border-b border-gray-100 relative">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-4">
            <div className="inline-flex items-center gap-2 bg-[#A9CCE3] text-white text-[10px] md:text-xs font-bold px-2.5 py-1 md:px-3 md:py-1 rounded-full self-start">
              <span>Q{currentQuestionIndex + 1}</span>
              <span>問題再掲</span>
            </div>
            <div className="text-xs md:text-sm text-gray-500 font-modern font-bold">
              問題 {currentQuestionIndex + 1} / {chapter.miniTest.length}
            </div>
          </div>
          <div className="text-sm md:text-base text-gray-700 font-modern leading-relaxed">
            {formatText(currentQuestion.text)}
          </div>
        </div>

        {/* Answers & Results */}
        <div className="p-4 sm:p-6 md:p-8 bg-white">
          <h3 className="text-base md:text-lg font-bold text-[#1B2631] mb-4 md:mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
            <span>答え合わせ</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
            {currentQuestion.subQuestions.map((sq: any) => {
              if (sq.type === 'descriptive') {
                return (
                  <div key={sq.id} className="p-3 md:p-4 rounded-xl border-2 border-blue-100 bg-blue-50/30 col-span-1 lg:col-span-2 flex flex-col gap-3 md:gap-4">
                    <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4">
                      <div className="font-bold text-gray-500 mt-1 text-xs md:text-sm bg-white px-2 py-0.5 rounded border border-gray-100 sm:border-none sm:bg-transparent sm:px-0 sm:py-0">{sq.label}</div>
                      <div className="flex-1 w-full">
                        <div className="text-[10px] md:text-xs text-gray-500 mb-1">あなたの解答</div>
                        <div className="font-bold text-sm md:text-base text-gray-700 mb-3 md:mb-4 whitespace-pre-wrap bg-white p-2 rounded-lg border border-gray-100 sm:border-none sm:bg-transparent sm:p-0">
                          {formatText(answers[sq.id] || '未解答')}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-500 mb-1">模範解答</div>
                        <div className="font-bold text-sm md:text-base text-[#1B2631] mb-3 md:mb-4 bg-white p-2 rounded-lg border border-gray-100 sm:border-none sm:bg-transparent sm:p-0">
                          {formatText(sq.correctAnswer)}
                        </div>
                        
                        <div className="bg-white p-3 md:p-4 rounded-lg border border-blue-200 shadow-sm">
                          <div className="text-xs md:text-sm font-bold text-[#2C3E50] mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                            <CheckSquare className="text-blue-500 w-4 h-4 md:w-4 md:h-4" />
                            <span>自己採点チェック（部分点基準）</span>
                          </div>
                          <div className="space-y-2 md:space-y-3">
                            {sq.gradingCriteria?.map((criteria: string, cIdx: number) => {
                              const criteriaId = `${sq.id}_${cIdx}`;
                              const isChecked = selfGrades[criteriaId] || false;
                              return (
                                <label key={cIdx} className="flex items-start gap-2 md:gap-3 cursor-pointer group py-1 md:py-0" onClick={() => toggleGrade(criteriaId)}>
                                  <div className={`mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${isChecked ? 'bg-blue-500 border-blue-500' : 'border-gray-300 group-hover:border-blue-400 bg-white'}`}>
                                    {isChecked && <CheckCircle2 className="text-white w-3 h-3 md:w-3.5 md:h-3.5" />}
                                  </div>
                                  <span className={`text-xs md:text-sm leading-tight ${isChecked ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                                    {formatText(criteria)}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              const isCorrect = answers[sq.id] === sq.correctAnswer;
              return (
                <div key={sq.id} className={`p-3 md:p-4 rounded-xl border-2 flex flex-col sm:flex-row items-start gap-2 sm:gap-4 ${isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                  <div className="flex justify-between w-full sm:w-auto">
                    <div className="font-bold text-gray-500 mt-1 text-xs md:text-sm bg-white px-2 py-0.5 rounded border border-gray-100 sm:border-none sm:bg-transparent sm:px-0 sm:py-0">{sq.label}</div>
                    <div className="sm:hidden">
                      {isCorrect ? <CheckCircle2 className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="text-[10px] md:text-xs text-gray-500 mb-1">あなたの解答</div>
                    <div className={`font-bold text-sm md:text-base bg-white p-2 rounded-lg border border-gray-100 sm:border-none sm:bg-transparent sm:p-0 ${isCorrect ? 'text-green-600' : 'text-red-500 line-through opacity-70'}`}>
                      {formatText(answers[sq.id] || '未解答')}
                    </div>
                    {!isCorrect && (
                      <div className="mt-2">
                        <div className="text-[10px] md:text-xs text-gray-500 mb-1">正解</div>
                        <div className="font-bold text-sm md:text-base text-[#1B2631] bg-white p-2 rounded-lg border border-gray-100 sm:border-none sm:bg-transparent sm:p-0">
                          {formatText(sq.correctAnswer)}
                        </div>
                      </div>
                    )}
                    {sq.partialCreditCriteria && (
                      <div className="mt-2 md:mt-3 text-[10px] md:text-xs bg-yellow-50 text-yellow-800 p-2 rounded flex items-start gap-1">
                        <AlertCircle className="shrink-0 mt-0.5 w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span>{formatText(sq.partialCreditCriteria)}</span>
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    {isCorrect ? <CheckCircle2 className="text-green-500 w-5 h-5 md:w-6 md:h-6" /> : <XCircle className="text-red-500 w-5 h-5 md:w-6 md:h-6" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation Memo */}
          <div className="masking-tape bg-[#FDFBF7] p-4 sm:p-6 md:p-8 rounded-xl shadow-inner border border-gray-200 relative mt-8 md:mt-12">
            <h4 className="font-handwriting text-base md:text-lg text-[#1B2631] mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2 border-b-2 border-[#1B2631] pb-1.5 md:pb-2 inline-flex">
              <Lightbulb className="text-[#F9E79F] w-4 h-4 md:w-5 md:h-5" />
              <span>解説・論理ツリー</span>
            </h4>
            <div className="text-xs md:text-sm text-gray-700 font-modern whitespace-pre-wrap leading-relaxed mb-6 md:mb-8">
              {formatText(currentQuestion.explanation)}
            </div>

            <div className="space-y-4 md:space-y-6">
              {currentQuestion.surroundingKnowledge && currentQuestion.surroundingKnowledge.length > 0 && (
                <div>
                  <h5 className="font-bold text-xs md:text-sm text-[#2C3E50] mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
                    <BookOpen className="text-[#A9CCE3] w-4 h-4 md:w-4 md:h-4" />
                    <span>周辺知識・類似問題</span>
                  </h5>
                  <div className="space-y-3 md:space-y-4">
                    {currentQuestion.surroundingKnowledge.map((k: string, idx: number) => {
                      // Extract title if it exists (e.g., 【基本問題・類似】)
                      const titleMatch = k.match(/^(【.*?】)(.*)/s);
                      if (titleMatch) {
                        return (
                          <div key={idx} className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="inline-block bg-[#2C3E50] text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded mb-2">
                              {titleMatch[1].replace(/[【】]/g, '')}
                            </div>
                            <div className="text-xs md:text-sm text-gray-700 font-modern leading-relaxed">
                              {formatText(titleMatch[2].trim())}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm text-xs md:text-sm text-gray-700 font-modern leading-relaxed">
                          {formatText(k)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentQuestion.deepDiveTopics && currentQuestion.deepDiveTopics.length > 0 && (
                <div className="bg-white p-4 md:p-5 rounded-xl border-2 border-dashed border-[#D9A0A0]">
                  <h5 className="font-bold text-xs md:text-sm text-[#D9A0A0] mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2">
                    <Search className="w-4 h-4 md:w-4 md:h-4" />
                    <span>さらに深掘り</span>
                  </h5>
                  <div className="space-y-3 md:space-y-4">
                    {currentQuestion.deepDiveTopics.map((topic: string, idx: number) => {
                      const titleMatch = topic.match(/^(【.*?】)(.*)/s);
                      let title = "";
                      let content = topic;
                      
                      if (titleMatch) {
                        title = titleMatch[1].replace(/[【】]/g, '');
                        content = titleMatch[2].trim();
                      } else {
                        const parts = topic.split('\n');
                        title = parts[0];
                        content = parts.slice(1).join('\n');
                      }

                      return (
                        <div key={idx} className="bg-[#FDFBF7] p-3 md:p-4 rounded-lg border border-[#D9A0A0]/30">
                          <div className="font-bold text-[#D9A0A0] text-[11px] md:text-xs mb-2 border-b border-[#D9A0A0]/20 pb-1">
                            {title}
                          </div>
                          <div className="text-gray-700 text-[11px] md:text-xs leading-relaxed whitespace-pre-wrap">
                            {formatText(content)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
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
          disabled={isLastQuestion}
          className={`flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-lg text-sm md:text-base
            ${isLastQuestion 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-[#2C3E50] text-white hover:bg-[#1a252f] hover:shadow-xl hover:-translate-y-1'}`}
        >
          <span>次の問題へ</span>
          <ChevronRight size={18} className="md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}

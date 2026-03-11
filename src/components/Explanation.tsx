import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, BookOpen, AlertCircle, CheckSquare, TrendingUp, AlertTriangle, ChevronLeft, ChevronRight, Search, ChevronDown, ChevronUp, Edit3, Save } from 'lucide-react';
import { formatText } from '../utils/textFormatter';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface ExplanationProps {
  mode: 'mini_test' | 'practice';
  chapter: any;
  answers: Record<string, string>;
  onBack: () => void;
}

export function Explanation({ mode, chapter, answers, onBack }: ExplanationProps) {
  const [selfGrades, setSelfGrades] = useState<Record<string, boolean>>({});
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [expandedSq, setExpandedSq] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState<Record<string, boolean>>({});

  const questions = mode === 'mini_test' ? chapter.miniTest : (chapter.practiceProblems || []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [questions]);

  const handleSaveNote = async (question: any, index: number) => {
    if (!auth.currentUser) return;
    setSavingNote(prev => ({ ...prev, [question.id]: true }));
    try {
      const newNote = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        uid: auth.currentUser.uid,
        question: question.text,
        answer: question.subQuestions.map((sq: any) => sq.correctAnswer).join(', '),
        explanation: question.explanation,
        chapterTitle: chapter.abstractTitle || chapter.realTitle || '',
        questionIndex: index + 1,
        memo: '',
        createdAt: new Date().toISOString()
      };
      
      const existingNotes = JSON.parse(localStorage.getItem(`notes_${auth.currentUser.uid}`) || '[]');
      existingNotes.push(newNote);
      localStorage.setItem(`notes_${auth.currentUser.uid}`, JSON.stringify(existingNotes));
      
      alert('ノートに保存しました！');
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました。');
    } finally {
      setSavingNote(prev => ({ ...prev, [question.id]: false }));
    }
  };

  const toggleGrade = (criteriaId: string) => {
    setSelfGrades(prev => ({ ...prev, [criteriaId]: !prev[criteriaId] }));
  };

  const weakAreas = useMemo(() => {
    const analysis: Record<string, { total: number; correct: number }> = {};

    questions.forEach((q: any) => {
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
  }, [questions, answers, selfGrades]);

  if (questions.length === 0) {
    return (
      <div className="w-full text-center">
        <button onClick={onBack} className="bg-[#1B2631] text-white px-6 py-3 rounded-xl font-bold w-full sm:w-auto">
          戻る
        </button>
      </div>
    );
  }

  const calculateScore = (question: any) => {
    let totalScore = 0;
    let maxScore = question.subQuestions.length;

    question.subQuestions.forEach((sq: any) => {
      if (sq.type === 'descriptive') {
        if (sq.gradingCriteria) {
          const criteriaCount = sq.gradingCriteria.length;
          let checkedCount = 0;
          sq.gradingCriteria.forEach((_: any, idx: number) => {
            if (selfGrades[`${sq.id}_${idx}`]) checkedCount++;
          });
          totalScore += (checkedCount / criteriaCount);
        }
      } else {
        if (answers[sq.id] === sq.correctAnswer) {
          totalScore += 1;
        }
      }
    });

    return Math.round((totalScore / maxScore) * 100);
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
      {weakAreas.length > 0 && (
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

      {/* Questions List */}
      <div className="space-y-4 md:space-y-6">
        {questions.map((question: any, index: number) => {
          const isQuestionExpanded = expandedQuestionId === question.id;
          const scorePercentage = calculateScore(question);

          return (
            <div key={question.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              {/* Question Tab Header */}
              <button 
                onClick={() => setExpandedQuestionId(isQuestionExpanded ? null : question.id)}
                className={`w-full flex items-center justify-between p-4 md:p-6 transition-colors ${isQuestionExpanded ? 'bg-[#FDFBF7]' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="bg-[#A9CCE3] text-white font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm shadow-sm">
                    Q{index + 1}
                  </div>
                  <div className="text-left font-bold text-[#2C3E50] text-sm md:text-base line-clamp-1">
                    {question.category || '問題'}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 md:gap-6">
                  {/* ノート保存ボタン */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSaveNote(question, index); }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${savingNote[question.id] ? 'bg-gray-200 text-gray-500' : 'bg-[#F9E79F] text-[#D35400] hover:bg-[#F5B041]'}`}
                    disabled={savingNote[question.id]}
                  >
                    <Save size={14} />
                    {savingNote[question.id] ? '保存中...' : 'ノートに保存'}
                  </button>
                  <div className="flex flex-col items-end">
                    <div className="text-[10px] md:text-xs text-gray-500 font-bold mb-0.5">あなたの正答率</div>
                    <div className={`font-mono font-bold text-base md:text-lg ${scorePercentage >= 80 ? 'text-green-500' : scorePercentage <= 40 ? 'text-red-500' : 'text-yellow-600'}`}>
                      {scorePercentage}%
                    </div>
                  </div>
                  <div className={`text-gray-400 transition-transform duration-300 ${isQuestionExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={24} />
                  </div>
                </div>
              </button>

              {/* Question Content (Dropdown) */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isQuestionExpanded ? 'max-h-[10000px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'}`}>
                {/* Problem Restatement */}
                <div className="bg-[#FDFBF7] p-4 sm:p-6 md:p-8 border-b border-gray-100 relative">
                  <div className="text-sm md:text-base text-gray-700 font-modern leading-relaxed">
                    {formatText(question.text)}
                  </div>
                </div>

                {/* Answers & Results */}
                <div className="p-4 sm:p-6 md:p-8 bg-white">
                  <h3 className="text-base md:text-lg font-bold text-[#1B2631] mb-4 md:mb-6 flex items-center gap-2">
                    <CheckCircle2 className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
                    <span>答え合わせ</span>
                  </h3>
                  
                  <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                    {question.subQuestions.map((sq: any) => {
                      const isCorrect = sq.type === 'descriptive' ? false : answers[sq.id] === sq.correctAnswer;
                      const isExpanded = expandedSq === sq.id;

                      return (
                        <div key={sq.id} className={`rounded-xl border-2 overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-md' : 'shadow-sm'} ${sq.type === 'descriptive' ? 'border-blue-100' : (isCorrect ? 'border-green-100' : 'border-red-100')}`}>
                          {/* Tab Header */}
                          <button 
                            onClick={() => setExpandedSq(isExpanded ? null : sq.id)}
                            className={`w-full flex items-center justify-between p-3 md:p-4 transition-colors ${sq.type === 'descriptive' ? 'bg-blue-50/30 hover:bg-blue-50/50' : (isCorrect ? 'bg-green-50/30 hover:bg-green-50/50' : 'bg-red-50/30 hover:bg-red-50/50')}`}
                          >
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="font-bold text-gray-600 text-xs md:text-sm bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">{sq.label}</div>
                              {sq.type !== 'descriptive' && (
                                <div>
                                  {isCorrect ? <CheckCircle2 className="text-green-500 w-5 h-5 md:w-6 md:h-6" /> : <XCircle className="text-red-500 w-5 h-5 md:w-6 md:h-6" />}
                                </div>
                              )}
                              {sq.type === 'descriptive' && (
                                <div className="text-xs md:text-sm font-bold text-blue-500 flex items-center gap-1">
                                  <Edit3 size={16} />
                                  <span>記述問題</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown size={20} />
                              </div>
                            </div>
                          </button>

                          {/* Tab Content (Dropdown) */}
                          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-4 md:p-6 bg-white">
                              {sq.type === 'descriptive' ? (
                                <div className="flex flex-col gap-3 md:gap-4">
                                  <div className="text-[10px] md:text-xs text-gray-500 mb-1">あなたの解答</div>
                                  <div className="font-bold text-sm md:text-base text-gray-700 mb-3 md:mb-4 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    {formatText(answers[sq.id] || '未解答')}
                                  </div>
                                  <div className="text-[10px] md:text-xs text-gray-500 mb-1">模範解答</div>
                                  <div className="font-bold text-sm md:text-base text-[#1B2631] mb-3 md:mb-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                    {formatText(sq.correctAnswer)}
                                  </div>
                                  
                                  <div className="bg-white p-3 md:p-4 rounded-lg border border-blue-200 shadow-sm mt-2">
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
                              ) : (
                                <div className="flex flex-col gap-3 md:gap-4">
                                  <div className="text-[10px] md:text-xs text-gray-500 mb-1">あなたの解答</div>
                                  <div className={`font-bold text-sm md:text-base p-3 rounded-lg border ${isCorrect ? 'bg-green-50/50 border-green-100 text-green-700' : 'bg-red-50/50 border-red-100 text-red-600 line-through opacity-80'}`}>
                                    {formatText(answers[sq.id] || '未解答')}
                                  </div>
                                  {!isCorrect && (
                                    <div className="mt-2">
                                      <div className="text-[10px] md:text-xs text-gray-500 mb-1">正解</div>
                                      <div className="font-bold text-sm md:text-base text-[#1B2631] bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {formatText(sq.correctAnswer)}
                                      </div>
                                    </div>
                                  )}
                                  {sq.partialCreditCriteria && (
                                    <div className="mt-2 md:mt-3 text-[10px] md:text-xs bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-200 flex items-start gap-2">
                                      <AlertCircle className="shrink-0 mt-0.5 w-4 h-4" />
                                      <span className="leading-relaxed">{formatText(sq.partialCreditCriteria)}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
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
                      {formatText(question.explanation)}
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      {question.surroundingKnowledge && question.surroundingKnowledge.length > 0 && (
                        <div>
                          <h5 className="font-bold text-xs md:text-sm text-[#2C3E50] mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2">
                            <BookOpen className="text-[#A9CCE3] w-4 h-4 md:w-5 md:h-5" />
                            <span>周辺知識・類似問題</span>
                          </h5>
                          <div className="space-y-3 md:space-y-4">
                            {question.surroundingKnowledge.map((k: string, idx: number) => {
                              // Extract title if it exists (e.g., 【基本問題・類似】)
                              const titleMatch = k.match(/^(【.*?】)(.*)/s);
                              if (titleMatch) {
                                return (
                                  <div key={idx} className="bg-white p-4 md:p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#A9CCE3]"></div>
                                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md mb-3 border border-blue-100">
                                      <BookOpen size={14} className="text-blue-500" />
                                      {titleMatch[1].replace(/[【】]/g, '')}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-700 font-modern leading-relaxed whitespace-pre-wrap">
                                      {formatText(titleMatch[2].trim())}
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <div key={idx} className="bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm text-xs md:text-sm text-gray-700 font-modern leading-relaxed whitespace-pre-wrap">
                                  {formatText(k)}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {question.deepDiveTopics && question.deepDiveTopics.length > 0 && (
                        <div className="mt-6 md:mt-8">
                          <h5 className="font-bold text-xs md:text-sm text-[#D9A0A0] mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2">
                            <Search className="w-4 h-4 md:w-5 md:h-5" />
                            <span>さらに深掘り</span>
                          </h5>
                          <div className="space-y-3 md:space-y-4">
                            {question.deepDiveTopics.map((topic: string, idx: number) => {
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
                                <div key={idx} className="bg-gradient-to-br from-red-50 to-white p-4 md:p-5 rounded-xl border border-red-100 shadow-sm relative overflow-hidden">
                                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D9A0A0]"></div>
                                  <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md mb-3 border border-red-200">
                                    <Lightbulb size={14} className="text-red-600" />
                                    {title}
                                  </div>
                                  <div className="text-xs md:text-sm text-gray-700 font-modern leading-relaxed whitespace-pre-wrap">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

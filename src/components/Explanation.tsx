import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, BookOpen, AlertCircle, CheckSquare, TrendingUp, AlertTriangle, ChevronDown, Edit3, Save, Search, Network, Circle } from 'lucide-react';
import { formatText } from '../utils/textFormatter';
import { auth } from '../firebase';

interface ExplanationProps {
  mode: 'mini_test' | 'practice';
  chapter: any;
  answers: Record<string, string>;
  onBack: () => void;
  isGuest: boolean;
  singleQuestionIndex?: number;
  onNextQuestion?: () => void;
  isLastQuestion?: boolean;
  isMobileView?: boolean;
}

import { NodeData } from './InteractiveTree';
import { InteractiveLogicTree } from './InteractiveLogicTree';
import { substanceTreeData, separationTreeData, thermalMotionTreeData, atomicStructureTreeData, ionTreeData, ionGenerationTreeData, ionSizeTreeData, chemicalBondTreeData } from '../data/chemistryData';
import { PracticeExplanationTree } from './PracticeExplanationTree';
import { IonizationEnergyChart } from './IonizationEnergyChart';

// Substance Tree Data for Chapter 1 (Moved to chemistryData.ts)

const filterTree = (node: NodeData, relatedNodeIds: string[]): NodeData | null => {
  const isRelated = relatedNodeIds.includes(node.id);
  const filteredChildren = node.children
    ? node.children.map(child => filterTree(child, relatedNodeIds)).filter(child => child !== null) as NodeData[]
    : [];
  
  if (isRelated || filteredChildren.length > 0) {
    return {
      ...node,
      children: filteredChildren
    };
  }
  return null;
};

const getDifficulty = (sqId: string) => {
  const id = sqId.replace(/^q/, 'p');
  const level1 = ['p1_a', 'p1_i', 'p1_u', 'p1_e', 'p1_o', 'p1_ki', 'p1_ku', 'p2_1', 'p2_2', 'p2_3', 'p2_5', 'p2_6', 'p2_8', 'p2_11', 'p2_14'];
  const level2 = ['p1_ka', 'p1_ke', 'p1_ko', 'p2_4', 'p2_7', 'p2_9', 'p2_10', 'p2_12', 'p2_13', 'p2_15'];
  const level3 = ['p3_1', 'p3_2', 'p3_3', 'p3_4', 'p3_5', 'p3_6', 'p3_7', 'p3_8', 'p3_9', 'p3_10'];
  
  if (level1.includes(id)) return 1;
  if (level2.includes(id)) return 2;
  if (level3.includes(id)) return 3;
  return 1;
};

export function Explanation({ mode: initialMode, chapter, answers, onBack, isGuest, singleQuestionIndex, onNextQuestion, isLastQuestion, isMobileView }: ExplanationProps) {
  const isPracticeMode = initialMode === 'practice';
  // Virtual mode is always 'mini_test' for bright style choices!
  const mode = 'mini_test';

  const [selfGrades, setSelfGrades] = useState<Record<string, boolean>>({});
  const [expandedSq, setExpandedSq] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [scrollTrigger, setScrollTrigger] = useState<number>(0);
  const [expandedCorrectQuestions, setExpandedCorrectQuestions] = useState<Record<string, boolean>>({});
  const [savingNote, setSavingNote] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(isMobileView !== undefined ? isMobileView : window.innerWidth < 768);

  useEffect(() => {
    if (isMobileView !== undefined) {
      setIsMobile(isMobileView);
    } else {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isMobileView]);

  const stepColors: Record<string, string> = {
    "1": "bg-red-500/20 text-red-700 border-red-500/50 hover:bg-red-500/30",
    "2": "bg-blue-500/20 text-blue-700 border-blue-500/50 hover:bg-blue-500/30",
    "3": "bg-green-500/20 text-green-700 border-green-500/50 hover:bg-green-500/30",
    "4": "bg-yellow-500/20 text-yellow-800 border-yellow-500/50 hover:bg-yellow-500/30",
    "5": "bg-purple-500/20 text-purple-700 border-purple-500/50 hover:bg-purple-500/30",
    "6": "bg-pink-500/20 text-pink-700 border-pink-500/50 hover:bg-pink-500/30",
    "7": "bg-cyan-500/20 text-cyan-700 border-cyan-500/50 hover:bg-cyan-500/30",
  };
  const markerColors: Record<string, string> = {
    "1": "bg-red-500",
    "2": "bg-blue-500",
    "3": "bg-green-500",
    "4": "bg-yellow-500",
    "5": "bg-purple-500",
    "6": "bg-pink-500",
    "7": "bg-cyan-500",
  };
  const borderColors: Record<string, string> = {
    "1": "border-red-500",
    "2": "border-blue-500",
    "3": "border-green-500",
    "4": "border-yellow-500",
    "5": "border-purple-500",
    "6": "border-pink-500",
    "7": "border-cyan-500",
  };

  const allQuestions = initialMode === 'mini_test' ? chapter.miniTest : (chapter.practiceProblems || []);
  const questions = useMemo(() => {
    return singleQuestionIndex !== undefined ? [allQuestions[singleQuestionIndex]] : allQuestions;
  }, [allQuestions, singleQuestionIndex]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singleQuestionIndex, chapter.id]);

  // Set viewport to allow zoom/pinch out on explanation pages
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    const originalContent = meta?.getAttribute('content') || '';
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover');
    }
    
    return () => {
      if (meta) {
        meta.setAttribute('content', originalContent);
      }
    };
  }, []);

  const handleSaveNote = async (question: any, index: number) => {
    const displayIndex = singleQuestionIndex !== undefined ? singleQuestionIndex : index;
    if (isGuest) {
      alert('ゲストモードではノート機能は使用できません。');
      return;
    }
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
        questionIndex: displayIndex + 1,
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

  const handleQuestionClick = (questionId: string) => {
    // Map q_id to p_id for practice mode
    const idMap: Record<string, string> = {
      'q1_a': 'p1_a', 'q1_b': 'p1_i', 'q1_c': 'p1_u', 'q1_d': 'p1_e', 'q1_e': 'p1_o', 'q1_f': 'p1_ka',
      'q2_1': 'p2_1', 'q2_2': 'p2_2', 'q2_3': 'p2_3', 'q2_4': 'p2_4', 'q2_5': 'p2_5', 'q2_6': 'p2_6',
      'q3_1': 'p3_1', 'q3_2': 'p3_2', 'q3_3': 'p3_3', 'q3_4': 'p3_4',
      'q4_1': 'p4_1', 'q4_2': 'p4_2', 'q4_3': 'p4_3',
    };

    const reverseIdMap: Record<string, string> = Object.entries(idMap).reduce((acc, [k, v]) => {
      acc[v] = k;
      return acc;
    }, {} as Record<string, string>);

    let targetId = questionId;
    if (isPracticeMode) {
      targetId = idMap[questionId] || questionId.replace(/^q/, 'p');
    } else if (mode === 'mini_test') {
      targetId = reverseIdMap[questionId] || questionId.replace(/^p/, 'q');
    }
    
    setExpandedSq(targetId);
    
    setTimeout(() => {
      const element = document.getElementById(`sq-${targetId}`);
      if (element) {
        // Calculate the exact Y position to center the element in the viewport
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - (window.innerHeight / 2) + (rect.height / 2);
        
        try {
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        } catch (e) {
          window.scrollTo(0, targetY);
        }
        
        // Secondary fallback using scrollIntoView just in case
        setTimeout(() => {
          const newRect = element.getBoundingClientRect();
          if (newRect.top < 0 || newRect.bottom > window.innerHeight) {
            try {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch (e) {
              element.scrollIntoView();
            }
          }
        }, 100);
        
        // Add a temporary highlight effect
        const originalTransition = element.style.transition;
        element.style.transition = 'all 0.5s ease';
        element.style.boxShadow = '0 0 0 4px rgba(91, 192, 190, 0.5)';
        setTimeout(() => {
          element.style.boxShadow = '';
          setTimeout(() => {
            element.style.transition = originalTransition;
          }, 500);
        }, 2000);
      }
    }, 400);
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

  const deepThoughtData = useMemo(() => {
    for (const q of questions) {
      try {
        const parsed = JSON.parse(q.explanation);
        if (parsed && parsed.type === 'logic_thought') {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return null;
  }, [questions]);

  const getRelatedSteps = (sqId: string, currentQuestion: any) => {
    const steps: { step: number | string | null, label: string, id: string }[] = [];
    
    // Always check logic trees first as they are the primary logic structures
    const findInTree = (node: NodeData) => {
      if (node.relatedQuestions?.some(q => q.id === sqId)) {
        steps.push({ step: node.step, label: node.label, id: node.id });
      }
      if (node.children) {
        node.children.forEach(findInTree);
      }
    };
    
    if (chapter?.id === 'c1_2_A' && separationTreeData) findInTree(separationTreeData);
    else if (chapter?.id === 'c1_3' && thermalMotionTreeData) findInTree(thermalMotionTreeData);
    else if (chapter?.id === 'c2_1' && atomicStructureTreeData) findInTree(atomicStructureTreeData);
    else if (chapter?.id === 'c2_2' && ionTreeData) findInTree(ionTreeData);
    else if (chapter?.id === 'c2_3' && ionGenerationTreeData) findInTree(ionGenerationTreeData);
    else if (chapter?.id === 'c2_4' && ionSizeTreeData) findInTree(ionSizeTreeData);
    else if (chapter?.id === 'c3_1' && chemicalBondTreeData) findInTree(chemicalBondTreeData);
    else if (substanceTreeData) findInTree(substanceTreeData);
    
    if (steps.length > 0) return steps;

    // Fallback to logic_thought JSON in the current question's explanation
    if (!currentQuestion.explanation) return [];
    try {
      const parsed = JSON.parse(currentQuestion.explanation);
      if (parsed.type === 'logic_thought' && parsed.phase2 && parsed.phase2.explanations) {
        return parsed.phase2.explanations
          .filter((ex: any) => ex.subQuestionIds.includes(sqId))
          .map((ex: any) => {
            const stepMatch = ex.step.match(/Step (\d+)/);
            return {
              step: stepMatch ? stepMatch[1] : ex.step,
              label: ex.tag,
              id: ex.step
            };
          });
      }
    } catch (e) {
      // Not JSON
    }
    return [];
  };

  const isGroupAllCorrect = (sq: any, currentQuestion: any) => {
    if (!sq.group || !currentQuestion) return false;
    const sameGroupSqs = (currentQuestion.subQuestions || []).filter((item: any) => item.group === sq.group);
    return sameGroupSqs.every((item: any) => answers[item.id] === item.correctAnswer);
  };

  const renderSubQuestionCheck = (sq: any, currentQuestion: any) => {
    const isMiniTest = mode === 'mini_test';
    const isCorrect = sq.type === 'descriptive' ? false : answers[sq.id] === sq.correctAnswer;
    const isExpanded = expandedSq === sq.id;
    const relatedSteps = getRelatedSteps(sq.id, currentQuestion);

    // Label modification to include group name prefix for grouped subquestions
    const displayLabel = sq.group 
      ? `${sq.group.split(' ')[0]} : 係数 ${sq.label}`
      : sq.label;

    if (!isExpanded) {
      return (
        <button 
          key={sq.id}
          onClick={() => setExpandedSq(sq.id)}
          className={`w-full flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 gap-3 rounded-xl border transition-colors ${sq.type === 'descriptive' ? 'bg-[#A9CCE3]/10 border-[#A9CCE3]/30' : (isCorrect ? 'bg-[#5BC0BE]/10 border-[#5BC0BE]/30' : 'bg-[#D9A0A0]/10 border-[#D9A0A0]/30')}`}
        >
          <div className="flex flex-col md:flex-row md:items-start gap-3 w-full md:w-auto text-left flex-1 min-w-0">
            {displayLabel.length > 20 ? (
              <div className={`font-bold ${isMiniTest ? 'text-gray-800' : 'text-[#E0E1DD]'} text-xs md:text-sm leading-relaxed max-w-full break-words inline-block py-1.5`}>
                {displayLabel}
              </div>
            ) : (
              <div className={`font-bold text-[#E0E1DD] text-xs md:text-sm bg-[#0B132B]/50 px-3 py-1.5 rounded-xl border border-[#3A506B]/50 leading-relaxed max-w-full break-words inline-block`}>
                {displayLabel}
              </div>
            )}
            {sq.type !== 'descriptive' && (
              <div className="shrink-0 pt-1.5 md:pt-0">
                {isCorrect ? <CheckCircle2 className="text-[#5BC0BE] w-5 h-5" /> : <XCircle className="text-[#D9A0A0] w-5 h-5" />}
              </div>
            )}
          </div>
          <ChevronDown className="text-[#7A8B99] shrink-0 self-end md:self-center" size={20} />
        </button>
      );
    }

    return (
      <div id={`sq-${sq.id}`} key={sq.id} className={`w-full ${isMiniTest ? 'bg-white' : 'bg-[#1C2541]'} rounded-xl border ${isMiniTest ? 'border-gray-200' : 'border-[#3A506B]'} shadow-lg p-4 md:p-6`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-3">
          {displayLabel.length > 20 ? (
            <div className={`font-bold ${isMiniTest ? 'text-gray-800' : 'text-[#E0E1DD]'} text-sm md:text-base leading-relaxed break-words flex-1`}>
              {displayLabel}
            </div>
          ) : (
            <div className={`font-bold ${isMiniTest ? 'text-gray-800' : 'text-[#E0E1DD]'} text-sm ${isMiniTest ? 'bg-gray-100' : 'bg-[#0B132B]'} px-3 py-1 rounded border ${isMiniTest ? 'border-gray-200' : 'border-[#3A506B]'}`}>
              {displayLabel}
            </div>
          )}
          <button onClick={() => setExpandedSq(null)} className="text-[#7A8B99] hover:text-[#E0E1DD] shrink-0">
            <XCircle size={24} />
          </button>
        </div>

        {/* Content with Grid Layout */}
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Related Steps Badge */}
            {/* Removed related steps badge for all modes */}

            <div>
              <div className="text-xs text-[#7A8B99] mb-1">あなたの解答</div>
              <div className={`p-3 rounded-lg border ${sq.type === 'descriptive' ? (mode === 'mini_test' ? 'bg-gray-50 border-gray-200' : 'bg-[#0B132B] border-[#3A506B]') : (isCorrect ? 'bg-[#5BC0BE]/10 border-[#5BC0BE]/30 text-[#5BC0BE]' : 'bg-[#D9A0A0]/10 border-[#D9A0A0]/30 text-[#D9A0A0]')}`}>
                {formatText(answers[sq.id] || '未解答')}
              </div>
            </div>
            {sq.detailedExplanation ? (
              <div className={`p-4 rounded-lg border text-sm ${mode === 'mini_test' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-[#0B132B]/60 border-[#3A506B]/50 text-[#E0E1DD]'}`}>
                <h5 className={`font-bold ${mode === 'mini_test' ? 'text-emerald-700' : 'text-[#5BC0BE]'} mb-2`}>【{sq.detailedExplanation.theme}】</h5>
                {isPracticeMode && (
                  <p className="text-xs text-[#7A8B99] mb-2">【難易度】: {'★'.repeat(getDifficulty(sq.id)) + '☆'.repeat(5 - getDifficulty(sq.id))}</p>
                )}
                
                {isPracticeMode && (
                  <ol className="list-decimal list-inside space-y-1">
                    {sq.detailedExplanation.steps.map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                )}

                <p className={`font-bold ${isMiniTest ? 'text-emerald-700' : 'text-[#5BC0BE]'} mt-3`}>【解答】{sq.correctAnswer}</p>

                {sq.group && (
                  <div className="mt-3 pt-2 border-t border-gray-200/20 text-xs font-semibold flex items-center gap-2">
                    {isGroupAllCorrect(sq, currentQuestion) ? (
                      <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        ✨ この式全体の係数はすべて正解です（完答○）
                      </span>
                    ) : (
                      <span className="text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                        ⚠️ 反応式のすべての係数が一致したときのみ完答となります
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-[#7A8B99] mb-1">正解</div>
                  <div className="p-3 rounded-lg border bg-[#5BC0BE]/10 border-[#5BC0BE]/30 text-[#5BC0BE]">
                    {formatText(sq.correctAnswer)}
                  </div>
                </div>

                {sq.group && (
                  <div className="mt-2 text-xs font-semibold flex items-center gap-2">
                    {isGroupAllCorrect(sq, currentQuestion) ? (
                      <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        ✨ この式全体の係数はすべて正解です（完答○）
                      </span>
                    ) : (
                      <span className="text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                        ⚠️ 反応式のすべての係数が一致したときのみ完答となります
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Logic Tree (Below) */}
          {/* Removed logic tree from bottom of subquestion */}
        </div>
      </div>
    );
  };

  if (questions.length === 0) {
    return (
      <div className="w-full text-center">
        <button onClick={onBack} className="bg-[#1B2631] text-white px-6 py-3 rounded-xl font-bold w-full sm:w-auto">
          戻る
        </button>
      </div>
    );
  }

  const calculateScore = useCallback((question: any) => {
    let totalScore = 0;
    
    // Group subquestions to see how many effective tasks there are
    const groups: Record<string, { sqs: any[], allCorrect: boolean }> = {};
    let singleQuestionsCount = 0;

    (question.subQuestions || []).forEach((sq: any) => {
      const isCorrect = sq.type === 'descriptive'
        ? false // grading criteria handles descriptive
        : answers[sq.id] === sq.correctAnswer;

      if (sq.group) {
        if (!groups[sq.group]) {
          groups[sq.group] = { sqs: [], allCorrect: true };
        }
        groups[sq.group].sqs.push(sq);
        if (!isCorrect) {
          groups[sq.group].allCorrect = false;
        }
      } else {
        singleQuestionsCount++;
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
          if (isCorrect) {
            totalScore += 1;
          }
        }
      }
    });

    const groupCounts = Object.keys(groups).length;
    const maxScore = singleQuestionsCount + groupCounts;

    Object.values(groups).forEach(g => {
      if (g.allCorrect) {
        totalScore += 1;
      }
    });

    if (maxScore === 0) return 0;
    return Math.round((totalScore / maxScore) * 100);
  }, [answers, selfGrades]);

  const toggleCorrectExpanded = (id: string) => {
    setExpandedCorrectQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={isMobile 
      ? `explanation-desktop-wrapper active` 
      : `fixed inset-0 w-full h-full flex flex-col bg-[#FDFBF7] overflow-hidden z-40 pb-20 md:pb-0`
    }>
      <div className={isMobile ? "explanation-desktop-content" : "w-full h-full flex flex-col"}>
        {isMobile && (
          <div className="explanation-scroll-hint">
            横にスワイプして全体を確認できます →
          </div>
        )}
        <div className={isMobile 
          ? `w-full rounded-3xl overflow-clip shadow-2xl border font-handwriting relative my-4 md:my-8 ${
              mode === 'mini_test' 
                ? 'bg-white text-gray-800 border-gray-100' 
                : 'bg-[#0B132B] text-[#E0E1DD] border-[#1C2541]'
            }`
          : `w-full h-full flex flex-col font-handwriting relative ${
              mode === 'mini_test' 
                ? 'bg-white text-gray-800' 
                : 'bg-[#0B132B] text-[#E0E1DD]'
            }`
        }>
      {/* Background effects */}
      {mode !== 'mini_test' && (
        <>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 50% 0%, #3A506B 0%, transparent 70%)'
          }}></div>
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(#1C2541 1px, transparent 1px)',
            backgroundSize: '100% 2rem'
          }}></div>
        </>
      )}

      {/* Header */}
      <div className={`p-4 md:p-6 border-b-2 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-none ${
        mode === 'mini_test' ? 'bg-white/90 border-gray-100' : 'bg-[#0B132B]/90 border-[#1C2541]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0 w-full md:w-auto">
          <div className="flex-shrink-0">
            <h3 className={`text-lg md:text-xl font-bold tracking-wider ${
              mode === 'mini_test' ? 'text-[#2C3E50]' : 'text-[#5BC0BE]'
            }`}>
              解答・解説
            </h3>
            <div className={`text-xs md:text-sm mt-1 ${
              mode === 'mini_test' ? 'text-gray-500' : 'text-[#7A8B99]'
            }`}>
              {chapter.realTitle}
            </div>
          </div>

          {singleQuestionIndex !== undefined && questions[0] && (
            <div className={`flex flex-wrap items-center gap-2 sm:gap-3 sm:border-l sm:pl-4 md:pl-6 lg:pl-8 ${
              mode === 'mini_test' ? 'border-gray-200' : 'border-[#3A506B]/50'
            } w-full sm:w-auto`}>
              <div className={`flex items-center gap-1 font-bold text-[11px] md:text-xs px-2.5 py-1 rounded-full border ${
                mode === 'mini_test' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-[#5BC0BE]/20 text-[#5BC0BE] border-[#5BC0BE]/30'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>答え合わせ</span>
              </div>

              <div className={`font-bold px-2.5 py-0.5 rounded-full text-xs shadow-sm border ${
                mode === 'mini_test' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-[#5BC0BE]/20 text-[#5BC0BE] border-[#5BC0BE]/30'
              }`}>
                Q{singleQuestionIndex + 1}
              </div>

              <div className={`font-bold text-xs md:text-sm truncate max-w-[120px] sm:max-w-[200px] ${
                mode === 'mini_test' ? 'text-gray-800' : 'text-[#E0E1DD]'
              }`}>
                {questions[0].category || '問題'}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleSaveNote(questions[0], singleQuestionIndex); }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors border ${
                  savingNote[questions[0].id] 
                    ? (mode === 'mini_test' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-[#1C2541] text-[#7A8B99] border-[#1C2541]') 
                    : (mode === 'mini_test' ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' : 'bg-[#F9E79F]/20 text-[#F9E79F] border-[#F9E79F]/30 hover:bg-[#F9E79F]/30')
                }`}
                disabled={savingNote[questions[0].id]}
              >
                <Save size={12} />
                <span>{savingNote[questions[0].id] ? '保存中...' : 'ノートに保存'}</span>
              </button>

              {(() => {
                const scorePercentage = calculateScore(questions[0]);
                return (
                  <div className="flex items-center gap-1 ml-auto sm:ml-0">
                    <span className={`text-[10px] md:text-xs font-bold ${mode === 'mini_test' ? 'text-gray-500' : 'text-[#7A8B99]'}`}>正答率:</span>
                    <span className={`font-mono font-bold text-xs md:text-sm ${
                      scorePercentage >= 80 
                        ? (mode === 'mini_test' ? 'text-emerald-600' : 'text-[#5BC0BE]') 
                        : scorePercentage <= 40 
                          ? (mode === 'mini_test' ? 'text-red-500' : 'text-[#D9A0A0]') 
                          : (mode === 'mini_test' ? 'text-amber-500' : 'text-[#F9E79F]')
                    }`}>
                      {scorePercentage}%
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
        {singleQuestionIndex !== undefined && onNextQuestion ? (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={onBack}
              className={`flex items-center gap-2 transition-colors font-bold px-4 py-2 rounded-full border flex-1 md:flex-none justify-center ${
                mode === 'mini_test' 
                  ? 'text-gray-500 hover:text-[#2C3E50] border-gray-200 hover:border-[#2C3E50] bg-gray-50' 
                  : 'text-[#7A8B99] hover:text-[#5BC0BE] border-[#1C2541] hover:border-[#5BC0BE] bg-[#1C2541]/50'
              }`}
            >
              <ArrowLeft size={18} />
              <span>問題に戻る</span>
            </button>
            <button 
              onClick={onNextQuestion}
              className={`flex items-center gap-2 transition-colors font-bold px-4 py-2 rounded-full border flex-1 md:flex-none justify-center ${
                mode === 'mini_test' 
                  ? 'text-white bg-[#2C3E50] hover:bg-[#1a252f] border-[#2C3E50]' 
                  : 'text-[#0B132B] bg-[#5BC0BE] hover:bg-[#4A9D9C] border-[#5BC0BE]'
              }`}
            >
              <span>{isLastQuestion ? '結果を見る' : '次の問題へ'}</span>
              <ArrowLeft size={18} className="rotate-180" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onBack}
            className={`flex items-center gap-2 transition-colors font-bold px-4 py-2 rounded-full border w-full md:w-auto justify-center ${
              mode === 'mini_test' 
                ? 'text-gray-500 hover:text-[#2C3E50] border-gray-200 hover:border-[#2C3E50] bg-gray-50' 
                : 'text-[#7A8B99] hover:text-[#5BC0BE] border-[#1C2541] hover:border-[#5BC0BE] bg-[#1C2541]/50'
            }`}
          >
            <ArrowLeft size={18} />
            <span>単元選択に戻る</span>
          </button>
        )}
      </div>

      <div className={isMobile
        ? `p-4 md:p-6 relative z-10 space-y-6 md:space-y-8 ${mode === 'mini_test' ? 'bg-white' : ''}`
        : `p-4 md:p-6 relative z-10 flex-1 overflow-hidden flex flex-col ${mode === 'mini_test' ? 'bg-white' : ''}`
      }>
      {/* Weak Areas Analysis */}
        {singleQuestionIndex === undefined && weakAreas.length > 0 && (
          <div className={`rounded-2xl p-5 md:p-6 shadow-lg border relative overflow-hidden ${
            mode === 'mini_test' ? 'bg-gray-50 border-gray-100' : 'bg-[#1C2541]/50 border-[#3A506B]/50'
          }`}>
            <h3 className={`text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2 ${
              mode === 'mini_test' ? 'text-[#2C3E50]' : 'text-[#D9A0A0]'
            }`}>
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
              <span>分析結果：復習推奨エリア</span>
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {weakAreas.map((area) => (
                <div key={area.category} className={`p-4 md:p-5 rounded-xl border shadow-sm ${
                  mode === 'mini_test' ? 'bg-white border-gray-100' : 'bg-[#0B132B]/80 border-[#1C2541]'
                }`}>
                  <div className="flex justify-between items-end mb-2 md:mb-3">
                    <div className={`flex items-center gap-1.5 md:gap-2 font-bold text-sm md:text-base ${
                      mode === 'mini_test' ? 'text-[#2C3E50]' : 'text-[#E0E1DD]'
                    }`}>
                      <AlertTriangle className={`w-4 h-4 md:w-[18px] md:h-[18px] ${
                        mode === 'mini_test' ? 'text-[#D9A0A0]' : 'text-[#D9A0A0]'
                      }`} />
                      <span>{area.category}</span>
                    </div>
                    <span className={`font-mono font-bold text-xl md:text-2xl ${
                      mode === 'mini_test' ? 'text-[#D9A0A0]' : 'text-[#D9A0A0]'
                    }`}>
                      {area.percentage}<span className="text-xs md:text-sm ml-0.5">%</span>
                    </span>
                  </div>
                  
                  {/* Gauge/Slider UI */}
                  <div className={`relative h-3 md:h-4 rounded-full overflow-hidden shadow-inner ${
                    mode === 'mini_test' ? 'bg-gray-100' : 'bg-[#1C2541]'
                  }`}>
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                        mode === 'mini_test' ? 'bg-gradient-to-r from-[#D9A0A0] to-[#FFB7B2]' : 'bg-gradient-to-r from-[#D9A0A0] to-[#FFB7B2]'
                      }`}
                      style={{ width: `${area.percentage}%` }}
                    />
                    <div className="absolute inset-0 opacity-30" 
                         style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.2) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.2) 50%,rgba(255,255,255,.2) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} 
                    />
                  </div>
                  <div className={`flex justify-between mt-1 text-[10px] md:text-xs font-mono ${
                    mode === 'mini_test' ? 'text-gray-400' : 'text-[#7A8B99]'
                  }`}>
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className={`text-xs md:text-sm mt-4 text-right ${
              mode === 'mini_test' ? 'text-gray-400' : 'text-[#7A8B99]'
            }`}>
              ※ 記述問題は自己採点チェックを入れるとスコアに反映されます
            </p>
          </div>
        )}

        {/* Unified Explanation Area */}
        <div className={isMobile
          ? `rounded-2xl shadow-lg border ${mode === 'mini_test' ? 'bg-white border-gray-200' : 'bg-[#1C2541]/40 border-[#3A506B]/50'}`
          : `border-none shadow-none flex-1 flex flex-col h-full min-h-0 overflow-hidden`
        }>
          <div className={isMobile
            ? "grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6 md:p-8 lg:h-[calc(100vh-220px)] lg:overflow-hidden"
            : "grid grid-cols-1 lg:grid-cols-[58%_42%] gap-6 p-0 h-full flex-1 overflow-hidden"
          }>
            
            {/* LEFT COLUMN: Problem statements and flowcharts */}
            <div className="space-y-6 lg:overflow-y-auto lg:h-full lg:pr-4">
              {singleQuestionIndex === undefined && (
                <h3 className={`text-base md:text-lg font-bold mb-4 md:mb-6 flex items-center gap-2 ${mode === 'mini_test' ? 'text-emerald-700' : 'text-[#5BC0BE]'}`}>
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                  <span>答え合わせ</span>
                </h3>
              )}
              
              <div className="space-y-8 md:space-y-12">
              {questions.length > 0 ? (
                questions.map((question: any, qIndex: number) => {
                const scorePercentage = calculateScore(question);
                return (
                  <div key={question.id} className="space-y-4 md:space-y-6">
                    {singleQuestionIndex === undefined && (
                      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${mode === 'mini_test' ? 'border-gray-200' : 'border-[#3A506B]/30'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`font-bold px-3 py-1 rounded-full text-xs md:text-sm shadow-sm border ${mode === 'mini_test' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-[#5BC0BE]/20 text-[#5BC0BE] border-[#5BC0BE]/30'}`}>
                            Q{(singleQuestionIndex !== undefined ? singleQuestionIndex : qIndex) + 1}
                          </div>
                          <div className={`text-left font-bold text-sm md:text-base ${mode === 'mini_test' ? 'text-gray-800' : 'text-[#E0E1DD]'}`}>
                            {question.category || '問題'}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSaveNote(question, qIndex); }}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors border ${savingNote[question.id] ? (mode === 'mini_test' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-[#1C2541] text-[#7A8B99] border-[#1C2541]') : (mode === 'mini_test' ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' : 'bg-[#F9E79F]/20 text-[#F9E79F] border-[#F9E79F]/30 hover:bg-[#F9E79F]/30')}`}
                            disabled={savingNote[question.id]}
                          >
                            <Save size={14} />
                            {savingNote[question.id] ? '保存中...' : 'ノートに保存'}
                          </button>
                          <div className="flex flex-col items-end">
                            <div className={`text-[10px] md:text-xs font-bold mb-0.5 ${mode === 'mini_test' ? 'text-gray-500' : 'text-[#7A8B99]'}`}>あなたの正答率</div>
                            <div className={`font-mono font-bold text-base md:text-lg ${scorePercentage >= 80 ? (mode === 'mini_test' ? 'text-emerald-600' : 'text-[#5BC0BE]') : scorePercentage <= 40 ? (mode === 'mini_test' ? 'text-red-500' : 'text-[#D9A0A0]') : (mode === 'mini_test' ? 'text-amber-500' : 'text-[#F9E79F]')}`}>
                              {scorePercentage}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Problem Restatement */}
                    <div className={`p-4 rounded-lg border text-sm md:text-base leading-relaxed ${
                      mode === 'mini_test' ? 'bg-white border-gray-200 text-gray-800' : 'bg-[#0B132B]/60 border-[#3A506B]/50 text-[#E0E1DD]/90'
                    }`}>
                      {formatText(question.text)}
                      {question.text.includes('図6') && (
                        <div className="mt-4">
                          <IonizationEnergyChart showDetails={true} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
              ) : null}
              </div>
              
              {/* Flowchart (Logical Tree) - Moved under problem statement inside Left Column */}
              {(deepThoughtData || chapter?.id === 'c1_2_A' || chapter?.id === 'c1_3' || chapter?.id === 'c1_1_A' || chapter?.id === 'c2_1' || chapter?.id === 'c2_2' || chapter?.id === 'c2_3' || chapter?.id === 'c2_4' || chapter?.id?.startsWith('c3_')) && (
                <div className="mt-6 border-t pt-6 border-gray-200">
                  <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-emerald-700">
                    <Network size={16} />
                    <span>フローチャート（解法の思考プロセス）</span>
                  </h4>
                  <PracticeExplanationTree
                    deepThoughtData={deepThoughtData}
                    chapter={chapter}
                    questions={questions}
                    handleQuestionClick={handleQuestionClick}
                    expandedStep={expandedStep}
                    setExpandedStep={setExpandedStep}
                    expandedNodeId={expandedNodeId}
                    scrollTrigger={scrollTrigger}
                    isMobile={isMobile}
                    renderSubQuestionCheck={renderSubQuestionCheck}
                    zoom={isMobile ? 'normal' : 'far'}
                  />
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Answers, grading, and explanations */}
            <div className="space-y-6 lg:overflow-y-auto lg:h-full lg:pl-4">
              {questions.length > 0 ? (
                questions.map((question: any, qIndex: number) => {
                return (
                  <div key={`right-${question.id}`} className="space-y-6">
                    <div className="space-y-6 md:space-y-8">
                      {(() => {
                        const incorrectSqs = question.subQuestions.filter((sq: any) => sq.type === 'descriptive' ? false : answers[sq.id] !== sq.correctAnswer);
                        const correctSqs = question.subQuestions.filter((sq: any) => sq.type === 'descriptive' ? true : answers[sq.id] === sq.correctAnswer);
                        const isCorrectExpanded = expandedCorrectQuestions[question.id];

                        const renderSq = (sq: any, isCorrect: boolean) => {
                          const isExpanded = expandedSq === sq.id;
                          const displayLabel = sq.group 
                            ? `${sq.group.split(' ')[0]} : 係数 ${sq.label}`
                            : sq.label;

                          return (
                            <div id={`sq-${sq.id}`} key={sq.id} className={`rounded-xl border overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'shadow-sm'} ${sq.type === 'descriptive' ? (mode === 'mini_test' ? 'border-blue-200' : 'border-[#A9CCE3]/30') : (isCorrect ? (mode === 'mini_test' ? 'border-emerald-200' : 'border-[#5BC0BE]/30') : (mode === 'mini_test' ? 'border-red-200' : 'border-[#D9A0A0]/30'))}`}>
                            {/* Tab Header */}
                            <button 
                              onClick={() => setExpandedSq(isExpanded ? null : sq.id)}
                              className={`w-full flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 gap-3 transition-colors ${sq.type === 'descriptive' ? (mode === 'mini_test' ? 'bg-blue-50 hover:bg-blue-100' : 'bg-[#A9CCE3]/10 hover:bg-[#A9CCE3]/20') : (isCorrect ? (mode === 'mini_test' ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-[#5BC0BE]/10 hover:bg-[#5BC0BE]/20') : (mode === 'mini_test' ? 'bg-red-50 hover:bg-red-100' : 'bg-[#D9A0A0]/10 hover:bg-[#D9A0A0]/20'))}`}
                            >
                              <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4 flex-1 min-w-0 text-left">
                                {displayLabel.length > 20 ? (
                                  <div className={`font-bold text-xs md:text-sm leading-relaxed max-w-full break-words inline-block py-1.5 ${mode === 'mini_test' ? 'text-gray-800' : 'text-[#E0E1DD]'}`}>{displayLabel}</div>
                                ) : (
                                  <div className={`font-bold text-xs md:text-sm px-3 py-1.5 rounded-xl border shadow-xs max-w-full break-words inline-block leading-relaxed ${mode === 'mini_test' ? 'text-gray-700 bg-white border-gray-200' : 'text-[#E0E1DD] bg-[#0B132B]/50 border-[#3A506B]/50'}`}>{displayLabel}</div>
                                )}
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 shrink-0">
                                  {sq.type !== 'descriptive' && (
                                    <div>
                                      {isCorrect ? <CheckCircle2 className={`w-5 h-5 md:w-6 md:h-6 ${mode === 'mini_test' ? 'text-emerald-600' : 'text-[#5BC0BE]'}`} /> : <XCircle className={`w-5 h-5 md:w-6 md:h-6 ${mode === 'mini_test' ? 'text-red-500' : 'text-[#D9A0A0]'}`} />}
                                    </div>
                                  )}
                                  {sq.type === 'descriptive' && (
                                    <div className={`text-xs md:text-sm font-bold flex items-center gap-1 ${mode === 'mini_test' ? 'text-blue-600' : 'text-[#A9CCE3]'}`}>
                                      <Edit3 size={16} />
                                      <span>記述問題</span>
                                    </div>
                                  )}
                                  {sq.type !== 'descriptive' && (
                                    <div className={`font-bold text-sm md:text-base ${mode === 'mini_test' ? 'text-gray-800' : 'text-[#E0E1DD]'}`}>
                                      <span className={`text-xs mr-1 ${mode === 'mini_test' ? 'text-gray-500' : 'text-[#7A8B99]'}`}>正解:</span>
                                      {sq.correctAnswer}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 md:gap-4 shrink-0 justify-end md:self-center">
                                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${mode === 'mini_test' ? 'text-gray-400' : 'text-[#7A8B99]'}`}>
                                  <ChevronDown size={20} />
                                </div>
                              </div>
                            </button>

                            {/* Tab Content (Dropdown) */}
                            <div className={"transition-all duration-300 ease-in-out overflow-hidden " + (isExpanded ? "max-h-[1500px] opacity-100 border-t " + (mode === 'mini_test' ? 'border-gray-200' : 'border-[#3A506B]/30') : 'max-h-0 opacity-0')}>
                              <div className={`p-4 md:p-6 ${mode === 'mini_test' ? 'bg-gray-50' : 'bg-[#0B132B]/40'}`}>
                                <div className="flex flex-col gap-6">
                                  <div className="w-full">
                                    {/* Related Steps Badge */}
                                    {!isCorrect && isPracticeMode && (() => {
                                      const relatedSteps = getRelatedSteps(sq.id, question);
                                      if (relatedSteps.length === 0) return null;
                                      return (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                          {relatedSteps.map((stepInfo, sIdx) => (
                                            <div key={sIdx} className="flex items-center gap-2 px-3 py-1.5 rounded-full border font-bold text-xs bg-[#5BC0BE]/20 text-[#5BC0BE] border-[#5BC0BE]/30">
                                              <Network size={12} />
                                              <span>Step {stepInfo.step}: {stepInfo.label}</span>
                                            </div>
                                          ))}
                                        </div>
                                      );
                                    })()}

                                    {sq.type === 'descriptive' ? (
                                      <div className="flex flex-col gap-3 md:gap-4">
                                        <div className={`text-[10px] md:text-xs mb-1 ${mode === 'mini_test' ? 'text-gray-500' : 'text-[#7A8B99]'}`}>あなたの解答</div>
                                        <div className={`font-bold text-sm md:text-base ${mode === 'mini_test' ? 'text-gray-800 bg-white' : 'text-[#E0E1DD] bg-[#1C2541]/50'} mb-3 md:mb-4 whitespace-pre-wrap p-3 rounded-lg border ${mode === 'mini_test' ? 'border-gray-200' : 'border-[#3A506B]/50'}`}>
                                          {formatText(answers[sq.id] || '未解答')}
                                        </div>
                                        
                                        {sq.detailedExplanation ? (
                                          <div className={`p-4 rounded-lg border text-sm mt-2 ${mode === 'mini_test' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-[#0B132B]/60 border-[#3A506B]/50 text-[#E0E1DD]'}`}>
                                            <div className="mb-4">
                                              <h5 className={`font-bold ${mode === 'mini_test' ? 'text-emerald-700' : 'text-[#5BC0BE]'} mb-1`}>【問題テーマ】</h5>
                                              <p className={`${mode === 'mini_test' ? 'text-gray-700' : 'text-[#E0E1DD]'}`}>{sq.detailedExplanation.theme}</p>
                                            </div>
                                            {isPracticeMode && (
                                              <div className="mb-4">
                                                <p className="font-bold text-gray-700">【難易度】: {'★'.repeat(getDifficulty(sq.id)) + '☆'.repeat(5 - getDifficulty(sq.id))}</p>
                                              </div>
                                            )}
                                            {isPracticeMode && (
                                              !isCorrect && getRelatedSteps(sq.id, question).length > 0 ? (
                                                <div className="mb-4">
                                                  <h5 className="font-bold text-gray-700 mb-2">【関連するロジックステップ】</h5>
                                                  <div className="flex flex-wrap gap-2">
                                                    {getRelatedSteps(sq.id, question).map((stepInfo: { step: number | string | null, label: string, id: string }, idx: number) => (
                                                      <button
                                                        key={idx}
                                                        onClick={() => {
                                                          setExpandedNodeId(stepInfo.id);
                                                          setExpandedStep(stepInfo.label);
                                                          setScrollTrigger(prev => prev + 1);
                                                          // InteractiveTree handles scrolling to the specific node
                                                        }}
                                                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-300 flex items-center gap-1"
                                                      >
                                                        <Network size={14} className="text-[#34495E]" />
                                                        {stepInfo.step ? `Step ${stepInfo.step}の「${stepInfo.label}」` : `「${stepInfo.label}」`}を復習する
                                                      </button>
                                                    ))}
                                                  </div>
                                                </div>
                                              ) : (
                                                <ol className="list-none space-y-1.5 mb-4">
                                                  {sq.detailedExplanation.steps.map((step: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                      <span className={`shrink-0 text-[#5BC0BE]`}></span>
                                                      <span>{step}</span>
                                                    </li>
                                                  ))}
                                                </ol>
                                              )
                                            )}
                                            <div className={`pt-3 border-t border-dashed ${mode === 'mini_test' ? 'border-gray-300' : 'border-[#3A506B]'}`}>
                                              <h5 className={`font-bold ${mode === 'mini_test' ? 'text-emerald-700' : 'text-[#5BC0BE]'} mb-2`}>【解答】</h5>
                                              <div className={`font-bold text-sm md:text-base ${mode === 'mini_test' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-[#5BC0BE] bg-[#5BC0BE]/10 border-[#5BC0BE]/30'} p-3 rounded-lg border`}>
                                                {formatText(sq.correctAnswer)}
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="flex flex-col gap-3 md:gap-4">
                                            <div className={`text-[10px] md:text-xs mb-1 ${mode === 'mini_test' ? 'text-gray-500' : 'text-[#7A8B99]'}`}>模範解答</div>
                                            <div className={`font-bold text-sm md:text-base mb-3 md:mb-4 p-3 rounded-lg border ${mode === 'mini_test' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-[#5BC0BE] bg-[#5BC0BE]/10 border-[#5BC0BE]/30'}`}>
                                              {formatText(sq.correctAnswer)}
                                            </div>
                                            
                                            {!isCorrect && isPracticeMode && getRelatedSteps(sq.id, question).length > 0 && (
                                              <div className="mb-4">
                                                <h5 className="font-bold text-[#5BC0BE] mb-2">【関連するロジックステップ】</h5>
                                                <div className="flex flex-wrap gap-2">
                                                  {getRelatedSteps(sq.id, question).map((stepInfo: { step: number | string | null, label: string, id: string }, idx: number) => (
                                                    <button
                                                      key={idx}
                                                      onClick={() => {
                                                        setExpandedNodeId(stepInfo.id);
                                                        setExpandedStep(stepInfo.label);
                                                        setScrollTrigger(prev => prev + 1);
                                                      }}
                                                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-300 flex items-center gap-1"
                                                    >
                                                      <Network size={14} className="text-[#34495E]" />
                                                      {stepInfo.step ? `Step ${stepInfo.step}の「${stepInfo.label}」` : `「${stepInfo.label}」`}を復習する
                                                    </button>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                        
                                        <div className={`${mode === 'mini_test' ? 'bg-white border-gray-200' : 'bg-[#1C2541]/50 border-[#A9CCE3]/30'} p-3 md:p-4 rounded-lg border shadow-sm mt-2`}>
                                          <div className={`text-xs md:text-sm font-bold mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2 ${mode === 'mini_test' ? 'text-blue-600' : 'text-[#A9CCE3]'}`}>
                                            <CheckSquare className="w-4 h-4 md:w-4 md:h-4" />
                                            <span>自己採点チェック（部分点基準）</span>
                                          </div>
                                          <div className="space-y-2 md:space-y-3">
                                            {sq.gradingCriteria?.map((criteria: string, cIdx: number) => {
                                              const criteriaId = `${sq.id}_${cIdx}`;
                                              const isChecked = selfGrades[criteriaId] || false;
                                              return (
                                                <label key={cIdx} className="flex items-start gap-2 md:gap-3 cursor-pointer group py-1 md:py-0" onClick={() => toggleGrade(criteriaId)}>
                                                  <div className={`mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${isChecked ? (mode === 'mini_test' ? 'bg-blue-500 border-blue-500' : 'bg-[#5BC0BE] border-[#5BC0BE]') : (mode === 'mini_test' ? 'border-gray-300 group-hover:border-blue-500 bg-white' : 'border-[#3A506B] group-hover:border-[#5BC0BE] bg-[#0B132B]')}`}>
                                                    {isChecked && <CheckCircle2 className={`w-3 h-3 md:w-3.5 md:h-3.5 ${mode === 'mini_test' ? 'text-white' : 'text-[#0B132B]'}`} />}
                                                  </div>
                                                  <span className={`text-xs md:text-sm leading-tight ${isChecked ? (mode === 'mini_test' ? 'text-gray-800' : 'text-[#E0E1DD]') : 'text-[#7A8B99]'}`}>
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
                                        <div className={`text-[10px] md:text-xs mb-1 ${mode === 'mini_test' ? 'text-gray-500' : 'text-[#7A8B99]'}`}>あなたの解答</div>
                                        <div className={`font-bold text-sm md:text-base p-3 rounded-lg border ${isCorrect ? (mode === 'mini_test' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-[#5BC0BE]/10 border-[#5BC0BE]/30 text-[#5BC0BE]') : (mode === 'mini_test' ? 'bg-red-50 border-red-200 text-red-600 line-through opacity-80' : 'bg-[#D9A0A0]/10 border-[#D9A0A0]/30 text-[#D9A0A0] line-through opacity-80')}`}>
                                          {formatText(answers[sq.id] || '未解答')}
                                        </div>
                                        
                                        {sq.detailedExplanation ? (
                                          <div className={`p-4 rounded-lg border text-sm mt-2 ${mode === 'mini_test' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-[#0B132B]/60 border-[#3A506B]/50 text-[#E0E1DD]'}`}>
                                            <div className="mb-4">
                                              <h5 className={`font-bold ${mode === 'mini_test' ? 'text-emerald-700' : 'text-[#5BC0BE]'} mb-1`}>【問題テーマ】</h5>
                                              <p className={`${mode === 'mini_test' ? 'text-gray-700' : 'text-[#E0E1DD]'}`}>{sq.detailedExplanation.theme}</p>
                                            </div>
                                            {isPracticeMode && (
                                              <div className="mb-4">
                                                <p className="font-bold text-[#5BC0BE]">【難易度】: {'★'.repeat(getDifficulty(sq.id)) + '☆'.repeat(5 - getDifficulty(sq.id))}</p>
                                              </div>
                                            )}
                                            {isPracticeMode && (
                                              !isCorrect && getRelatedSteps(sq.id, question).length > 0 ? (
                                                <div className="mb-4">
                                                  <h5 className="font-bold text-[#5BC0BE] mb-2">【関連するロジックステップ】</h5>
                                                  <div className="flex flex-wrap gap-2">
                                                    {getRelatedSteps(sq.id, question).map((stepInfo: { step: number | string | null, label: string, id: string }, idx: number) => (
                                                      <button
                                                        key={idx}
                                                        onClick={() => {
                                                          setExpandedNodeId(stepInfo.id);
                                                          setExpandedStep(stepInfo.label);
                                                          setScrollTrigger(prev => prev + 1);
                                                          // InteractiveTree handles scrolling to the specific node
                                                        }}
                                                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-300 flex items-center gap-1"
                                                      >
                                                        <Network size={14} className="text-[#34495E]" />
                                                        {stepInfo.step ? `Step ${stepInfo.step}の「${stepInfo.label}」` : `「${stepInfo.label}」`}を復習する
                                                      </button>
                                                    ))}
                                                  </div>
                                                </div>
                                              ) : (
                                                <ol className="list-none space-y-1.5 mb-4">
                                                  {sq.detailedExplanation.steps.map((step: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                      <span className={`shrink-0 text-[#5BC0BE]`}></span>
                                                      <span>{step}</span>
                                                    </li>
                                                  ))}
                                                </ol>
                                              )
                                            )}
                                            <div className={`pt-3 border-t border-dashed ${mode === 'mini_test' ? 'border-gray-300' : 'border-[#3A506B]'}`}>
                                              <h5 className={`font-bold ${mode === 'mini_test' ? 'text-emerald-700' : 'text-[#5BC0BE]'} mb-2`}>【解答】</h5>
                                              <div className={`font-bold text-sm md:text-base ${mode === 'mini_test' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-[#5BC0BE] bg-[#5BC0BE]/10 border-[#5BC0BE]/30'} p-3 rounded-lg border`}>
                                                {formatText(sq.correctAnswer)}
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="mt-2">
                                            <div className={`text-[10px] md:text-xs mb-1 ${mode === 'mini_test' ? 'text-gray-500' : 'text-[#7A8B99]'}`}>正解</div>
                                            <div className={`font-bold text-sm md:text-base p-3 rounded-lg border ${mode === 'mini_test' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-[#5BC0BE] bg-[#5BC0BE]/10 border-[#5BC0BE]/30'}`}>
                                              {formatText(sq.correctAnswer)}
                                            </div>
    
                                            {!isCorrect && isPracticeMode && getRelatedSteps(sq.id, question).length > 0 && (
                                              <div className="mt-4">
                                                <h5 className="font-bold text-[#5BC0BE] mb-2">【関連するロジックステップ】</h5>
                                                <div className="flex flex-wrap gap-2">
                                                  {getRelatedSteps(sq.id, question).map((stepInfo: { step: number | string | null, label: string, id: string }, idx: number) => (
                                                    <button
                                                      key={idx}
                                                      onClick={() => {
                                                        setExpandedNodeId(stepInfo.id);
                                                        setExpandedStep(stepInfo.label);
                                                        setScrollTrigger(prev => prev + 1);
                                                      }}
                                                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-300 flex items-center gap-1"
                                                    >
                                                      <Network size={14} className="text-[#34495E]" />
                                                      {stepInfo.step ? `Step ${stepInfo.step}の「${stepInfo.label}」` : `「${stepInfo.label}」`}を復習する
                                                    </button>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
    
                                        {sq.partialCreditCriteria && (
                                          <div className={`mt-2 md:mt-3 text-[10px] md:text-xs p-3 rounded-lg border flex items-start gap-2 ${mode === 'mini_test' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-[#F9E79F]/10 text-[#F9E79F] border-[#F9E79F]/30'}`}>
                                            <AlertCircle className="shrink-0 mt-0.5 w-4 h-4" />
                                            <span className="leading-relaxed">{formatText(sq.partialCreditCriteria)}</span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Bottom Section: Logic Tree */}
                                  {!isCorrect && isPracticeMode && (
                                    <div className="w-full mt-2 pt-6 border-t border-gray-200">
                                      {(() => {
                                        const relatedSteps = getRelatedSteps(sq.id, question);
                                        if (relatedSteps.length === 0) return null;
                                        
                                        const targetTreeParams = chapter?.id === 'c1_2_A' ? separationTreeData 
                                          : chapter?.id === 'c1_3' ? thermalMotionTreeData 
                                          : chapter?.id === 'c2_1' ? atomicStructureTreeData
                                          : chapter?.id === 'c2_2' ? ionTreeData
                                          : chapter?.id === 'c2_3' ? ionGenerationTreeData
                                          : chapter?.id === 'c2_4' ? ionSizeTreeData
                                          : chapter?.id === 'c3_1' ? chemicalBondTreeData
                                          : substanceTreeData;
                                        const filteredData = filterTree(targetTreeParams, relatedSteps.map(s => s.id));
                                        if (!filteredData) return null;

                                        return (
                                          <div className="w-full flex justify-center">
                                            <div className="w-full max-w-4xl">
                                              <InteractiveLogicTree 
                                                data={filteredData} 
                                                step={String(relatedSteps[0].step)}
                                                focusNode={relatedSteps[0].id}
                                                zoom="normal"
                                                mobileTightCrop={true}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      };

                      return (
                          <>
                            {incorrectSqs.length > 0 && (
                              <div className="space-y-3 md:space-y-4">
                                <h4 className={`font-bold flex items-center gap-2 ${mode === 'mini_test' ? 'text-red-600' : 'text-[#D9A0A0]'}`}>
                                  <XCircle size={18} />
                                  間違えた問題
                                </h4>
                                {incorrectSqs.map(sq => renderSq(sq, false))}
                              </div>
                            )}

                            {correctSqs.length > 0 && (
                              <div className="space-y-3 md:space-y-4 mt-6">
                                <button 
                                  onClick={() => toggleCorrectExpanded(question.id)}
                                  className={`w-full flex items-center justify-between p-3 md:p-4 rounded-xl border font-bold transition-colors ${mode === 'mini_test' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-[#5BC0BE]/10 text-[#5BC0BE] border-[#5BC0BE]/30 hover:bg-[#5BC0BE]/20'}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} />
                                    <span>正解した問題を表示する ({correctSqs.length}問)</span>
                                  </div>
                                  <ChevronDown size={20} className={`transition-transform duration-300 ${isCorrectExpanded ? 'rotate-180' : ''}`} />
                                </button>
                                
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCorrectExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                  <div className="space-y-3 md:space-y-4 mt-2">
                                    {correctSqs.map(sq => renderSq(sq, true))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* Normal Explanation (if not logic_thought or if mini_test) */}
                    {(() => {
                      let explanationText = question.explanation;
                      let stepInfo = null;

                      try {
                        const parsed = JSON.parse(question.explanation);
                        if (parsed && parsed.type === 'logic_thought') {
                          if (mode === 'mini_test') {
                            // For mini_test, extract explanation from logic_thought JSON
                            explanationText = parsed.phase2.explanations.map((ex: any) => ex.content).join('\n\n');
                          } else {
                            // For practice, we use deepThoughtData globally, so we can return null here
                            return null;
                          }
                        }
                      } catch (e) {
                        // Not JSON, render normal explanation
                      }
                      
                      if (!explanationText) return null;

                      return (
                        <div className={`p-4 sm:p-5 rounded-xl shadow-inner border mt-4 ${
                          mode === 'mini_test' ? 'bg-gray-50 border-gray-200' : 'bg-[#0B132B]/80 border-[#3A506B]/50'
                        }`}>
                          <h4 className={`text-sm md:text-base mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2 border-b-2 pb-1.5 inline-flex ${
                            mode === 'mini_test' ? 'text-emerald-700 border-emerald-200' : 'text-[#5BC0BE] border-[#3A506B]/50'
                          }`}>
                            <Lightbulb className={`w-4 h-4 ${mode === 'mini_test' ? 'text-amber-500' : 'text-[#F9E79F]'}`} />
                            <span>解説</span>
                          </h4>
                          <div className={`text-xs md:text-sm whitespace-pre-wrap leading-relaxed ${
                            mode === 'mini_test' ? 'text-gray-700' : 'text-[#E0E1DD]/90'
                          }`}>
                            {formatText(explanationText)}
                          </div>
                          {deepThoughtData && isPracticeMode && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <h5 className="text-xs font-bold mb-2 text-[#2C3E50]/80">解答に必要なロジックツリーのStep:</h5>
                              <div className="flex flex-wrap gap-2">
                                {deepThoughtData.phase1.steps.map((step: any, idx: number) => (
                                  <span key={idx} className="text-[10px] px-2 py-1 rounded border bg-slate-100 text-[#2C3E50] border-gray-200">
                                    {step.step}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                );
              })
            ) : (
              <div className={`p-12 text-center rounded-2xl border-2 border-dashed ${mode === 'mini_test' ? 'bg-gray-50 border-gray-200 text-gray-500' : 'bg-[#1C2541]/30 border-[#3A506B]/50 text-[#7A8B99]'}`}>
                <div className="flex flex-col items-center gap-4">
                  <AlertCircle size={48} className="text-amber-500" />
                  <p className="text-lg font-bold">問題がありません。</p>
                </div>
              </div>
            )}

          {/* Stumbling Points (from logic_thought) */}
          {deepThoughtData && deepThoughtData.phase2.stumblingPoints && deepThoughtData.phase2.stumblingPoints.length > 0 && (
            <div className={`p-4 sm:p-6 md:p-8 border-b ${mode === 'mini_test' ? 'border-gray-200 bg-gray-50' : 'border-[#3A506B]/50 bg-[#1C2541]/20'}`}>
              <h4 className={`font-bold mb-4 text-base md:text-lg flex items-center gap-2 ${mode === 'mini_test' ? 'text-red-600' : 'text-[#D9A0A0]'}`}>
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
                つまずきポイント
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deepThoughtData.phase2.stumblingPoints.map((point: any, idx: number) => (
                  <div key={idx} className={`p-4 sm:p-5 rounded-xl border shadow-sm relative overflow-hidden ${mode === 'mini_test' ? 'bg-red-50 border-red-200' : 'bg-[#D9A0A0]/10 border-[#D9A0A0]/30'}`}>
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${mode === 'mini_test' ? 'bg-red-500' : 'bg-[#D9A0A0]'}`}></div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`text-xs font-bold px-2 py-0.5 rounded border ${mode === 'mini_test' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-[#D9A0A0]/20 text-[#D9A0A0] border-[#D9A0A0]/30'}`}>
                        {point.step}
                      </div>
                      <h5 className={`font-bold text-sm md:text-base ${mode === 'mini_test' ? 'text-red-700' : 'text-[#D9A0A0]'}`}>{point.type || point.point}</h5>
                    </div>
                    <div className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${mode === 'mini_test' ? 'text-gray-700' : 'text-[#E0E1DD]/90'}`}>
                      {formatText(point.content || point.reason)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Surrounding Knowledge / Deep Dive (from all questions) */}
          <div className="p-4 sm:p-6 md:p-8 space-y-8">
            {questions.map((question: any, qIndex: number) => {
              const hasKnowledge = question.surroundingKnowledge && question.surroundingKnowledge.length > 0;
              const hasDeepDive = question.deepDiveTopics && question.deepDiveTopics.length > 0;
              
              if (!hasKnowledge && !hasDeepDive) return null;

              return (
                <div key={`extra-${question.id}`} className="space-y-6">
                  <div className={`flex items-center gap-3 border-b pb-2 ${mode === 'mini_test' ? 'border-gray-200' : 'border-[#3A506B]/30'}`}>
                    <div className={`font-bold px-2 py-0.5 rounded text-xs shadow-sm border ${mode === 'mini_test' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-[#5BC0BE]/20 text-[#5BC0BE] border-[#5BC0BE]/30'}`}>
                      Q{(singleQuestionIndex !== undefined ? singleQuestionIndex : qIndex) + 1}
                    </div>
                    <h4 className={`font-bold text-sm md:text-base ${mode === 'mini_test' ? 'text-gray-800' : 'text-[#E0E1DD] opacity-80'}`}>
                      周辺知識・深掘り
                    </h4>
                  </div>

                  {hasKnowledge && (
                    <div>
                      <h5 className={`font-bold text-xs md:text-sm mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2 ${mode === 'mini_test' ? 'text-blue-600' : 'text-[#A9CCE3]'}`}>
                        <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                        <span>周辺知識・類似問題</span>
                      </h5>
                      <div className="space-y-3 md:space-y-4">
                        {question.surroundingKnowledge.map((k: string, idx: number) => {
                          const titleMatch = k.match(/^(【.*?】)(.*)/s);
                          if (titleMatch) {
                            return (
                              <div key={idx} className={`p-4 md:p-5 rounded-xl border shadow-sm relative overflow-hidden ${mode === 'mini_test' ? 'bg-blue-50 border-blue-200' : 'bg-[#1C2541]/50 border-[#A9CCE3]/30'}`}>
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${mode === 'mini_test' ? 'bg-blue-400' : 'bg-[#A9CCE3]'}`}></div>
                                <div className={`inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md mb-3 border ${mode === 'mini_test' ? 'bg-white text-blue-600 border-blue-200' : 'bg-[#A9CCE3]/10 text-[#A9CCE3] border-[#A9CCE3]/20'}`}>
                                  <BookOpen size={14} />
                                  {titleMatch[1].replace(/[【】]/g, '')}
                                </div>
                                <div className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${mode === 'mini_test' ? 'text-gray-700' : 'text-[#E0E1DD]/90'}`}>
                                  {formatText(titleMatch[2].trim())}
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div key={idx} className={`p-4 md:p-5 rounded-xl border shadow-sm text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${mode === 'mini_test' ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-[#1C2541]/50 border-[#3A506B]/50 text-[#E0E1DD]/90'}`}>
                              {formatText(k)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {hasDeepDive && (
                    <div className="mt-6 md:mt-8">
                      <h5 className={`font-bold text-xs md:text-sm mb-3 md:mb-4 flex items-center gap-1.5 md:gap-2 ${mode === 'mini_test' ? 'text-amber-600' : 'text-[#D9A0A0]'}`}>
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
                            <div key={idx} className={`p-4 md:p-5 rounded-xl border shadow-sm relative overflow-hidden ${mode === 'mini_test' ? 'bg-amber-50 border-amber-200' : 'bg-[#D9A0A0]/10 border-[#D9A0A0]/30'}`}>
                              <div className={`absolute top-0 left-0 w-1.5 h-full ${mode === 'mini_test' ? 'bg-amber-400' : 'bg-[#D9A0A0]'}`}></div>
                              <div className={`inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-md mb-3 border ${mode === 'mini_test' ? 'bg-white text-amber-600 border-amber-200' : 'bg-[#D9A0A0]/20 text-[#D9A0A0] border-[#D9A0A0]/30'}`}>
                                <Lightbulb size={14} />
                                {title}
                              </div>
                              <div className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${mode === 'mini_test' ? 'text-gray-700' : 'text-[#E0E1DD]/90'}`}>
                                {formatText(content)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}

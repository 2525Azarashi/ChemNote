import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronRight, ChevronLeft, Edit3, ArrowLeft, GripVertical, Trophy } from 'lucide-react';
import { formatText } from '../utils/textFormatter';
import { substanceTreeData } from '../data/chemistryData';
import { getRelatedSteps, filterTree } from '../utils/logicTreeUtils';
import { Explanation } from './Explanation';
import { IonizationEnergyChart } from './IonizationEnergyChart';
import { QuizTimerBar } from './QuizTimerBar';
import {
  calcQuestionTimeLimit,
  scoreProblem,
  calcMaxCombo,
  comboMultiplier,
  type ScoreBreakdown,
} from '../utils/scoring';
import { submitChapterScore } from '../utils/leaderboard';

interface QuizProps {
  mode: 'mini_test' | 'practice';
  chapter: any;
  onFinish: (answers: Record<string, string>) => void;
  onBack: () => void;
  isGuest: boolean;
  isMobileView?: boolean;
  onExplanationChange?: (isExplanation: boolean) => void;
  onScored?: (breakdown: ScoreBreakdown, meta: { timeLimit: number; timeUsed: number; questionId: string }) => void;
}

/**
 * 章単位の累積スコアを localStorage に保持するためのキー生成
 */
function chapterRunKey(chapterId: string, mode: string) {
  return `quiz_run_${chapterId}_${mode}`;
}

interface ChapterRunState {
  totalScore: number;
  runningCombo: number;
  perQuestion: Record<string, ScoreBreakdown & { timeLimit: number; timeUsed: number }>;
  totalCorrect: number;
  totalJudgeable: number;
  totalTimeSec: number;
  startedAt: number;
}

function loadRun(chapterId: string, mode: string): ChapterRunState {
  try {
    const raw = localStorage.getItem(chapterRunKey(chapterId, mode));
    if (raw) return JSON.parse(raw);
  } catch {
    /* noop */
  }
  return {
    totalScore: 0,
    runningCombo: 0,
    perQuestion: {},
    totalCorrect: 0,
    totalJudgeable: 0,
    totalTimeSec: 0,
    startedAt: Date.now(),
  };
}

function saveRun(chapterId: string, mode: string, run: ChapterRunState) {
  try {
    localStorage.setItem(chapterRunKey(chapterId, mode), JSON.stringify(run));
  } catch {
    /* noop */
  }
}

const chemistryShortcuts = [
  { label: '⁺ (1価陽)', value: '⁺', desc: '1価陽イオン (上付きプラス)' },
  { label: '⁻ (1価陰)', value: '⁻', desc: '1価陰イオン (上付きマイナス)' },
  { label: '²⁺ (2価陽)', value: '²⁺', desc: '2価陽イオン' },
  { label: '²⁻ (2価陰)', value: '²⁻', desc: '2価陰イオン' },
  { label: '³⁺ (3価陽)', value: '³⁺', desc: '3価陽イオン' },
  { label: '³⁻ (3価陰)', value: '³⁻', desc: '3価陰イオン' },
  { label: 'NH₄⁺', value: 'NH₄⁺', desc: 'アンモニウムイオン' },
  { label: 'OH⁻', value: 'OH⁻', desc: '水酸化物イオン' },
  { label: 'NO₃⁻', value: 'NO₃⁻', desc: '硝酸イオン' },
  { label: 'SO₄²⁻', value: 'SO₄²⁻', desc: '硫酸イオン' },
  { label: 'CO₃²⁻', value: 'CO₃²⁻', desc: '炭酸イオン' },
  { label: 'PO₄³⁻', value: 'PO₄³⁻', desc: 'リン酸イオン' },
  { label: '₂ (下付き2)', value: '₂', desc: '下付き2' },
  { label: '₃ (下付き3)', value: '₃', desc: '下付き3' },
  { label: '₄ (下付き4)', value: '₄', desc: '下付き4' },
  { label: '₅ (下付き5)', value: '₅', desc: '下付き5' },
];

export function Quiz({ mode, chapter, onFinish, onBack, isGuest, isMobileView, onExplanationChange, onScored }: QuizProps) {
  // ===== タイマー & スコア用 state =====
  const [run, setRun] = useState<ChapterRunState>(() => loadRun(chapter.id, mode));
  const timeUsedRef = useRef(0); // タイマーから250msごとに通知される最新値
  const lastScoredQuestionRef = useRef<string | null>(null);

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
    timeUsedRef.current = 0;
    lastScoredQuestionRef.current = null;
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

  // この問題の制限時間を計算（メモ化）
  const questionTimeLimit = useMemo(() => {
    if (!currentQuestion) return 60;
    return calcQuestionTimeLimit(currentQuestion.subQuestions || []);
  }, [currentQuestion]);

  // Group subQuestions if they have a group property
  const groupedSubQuestions = useMemo(() => {
    if (!currentQuestion) return [];
    const list: { type: 'single' | 'group'; groupName?: string; items: any[] }[] = [];
    let lastGroup: any = null;

    (currentQuestion.subQuestions || []).forEach((sq: any) => {
      if (sq.group) {
        if (lastGroup && lastGroup.groupName === sq.group) {
          lastGroup.items.push(sq);
        } else {
          lastGroup = { type: 'group', groupName: sq.group, items: [sq] };
          list.push(lastGroup);
        }
      } else {
        lastGroup = null;
        list.push({ type: 'single', items: [sq] });
      }
    });
    return list;
  }, [currentQuestion]);

  /**
   * 現在の問題を採点して run state を更新する。
   * 解説画面に入る瞬間 = 解答提出の瞬間 として扱う。
   * 同じ問題を2度採点しないよう lastScoredQuestionRef でガード。
   */
  const scoreCurrentQuestionIfNeeded = () => {
    if (!currentQuestion) return;
    if (lastScoredQuestionRef.current === currentQuestion.id) return;
    lastScoredQuestionRef.current = currentQuestion.id;

    const subQuestions = currentQuestion.subQuestions || [];
    const timeUsed = Math.max(0, Math.round(timeUsedRef.current));
    const maxCombo = calcMaxCombo(subQuestions, answers);
    const breakdown = scoreProblem(subQuestions, answers, {
      timeLimit: questionTimeLimit,
      timeUsed,
      maxCombo,
      runningCombo: run.runningCombo,
    });

    // 章コンボ倍率を適用
    const multiplier = comboMultiplier(run.runningCombo);
    const boostedScore = Math.floor(breakdown.finalScore * multiplier);
    const finalBreakdown: ScoreBreakdown = { ...breakdown, finalScore: boostedScore };

    // 章全体の状態を更新
    const isAllCorrect =
      breakdown.judgeableCount > 0 && breakdown.correctCount === breakdown.judgeableCount;
    const nextRunningCombo = isAllCorrect ? run.runningCombo + 1 : 0;

    const nextRun: ChapterRunState = {
      ...run,
      totalScore: run.totalScore + boostedScore,
      runningCombo: nextRunningCombo,
      totalCorrect: run.totalCorrect + breakdown.correctCount,
      totalJudgeable: run.totalJudgeable + breakdown.judgeableCount,
      totalTimeSec: run.totalTimeSec + timeUsed,
      perQuestion: {
        ...run.perQuestion,
        [currentQuestion.id]: { ...finalBreakdown, timeLimit: questionTimeLimit, timeUsed },
      },
    };
    setRun(nextRun);
    saveRun(chapter.id, mode, nextRun);

    if (onScored) {
      onScored(finalBreakdown, {
        timeLimit: questionTimeLimit,
        timeUsed,
        questionId: currentQuestion.id,
      });
    }
  };

  /**
   * 章のラン全体が終わった時に Firestore へ章ベストを送る
   */
  const finalizeChapterRun = async (latestRun: ChapterRunState) => {
    if (isGuest) return; // ゲストは同期しない
    try {
      const correctRate =
        latestRun.totalJudgeable > 0 ? latestRun.totalCorrect / latestRun.totalJudgeable : 0;
      await submitChapterScore({
        chapterId: chapter.id,
        score: latestRun.totalScore,
        correctRate,
        totalCorrect: latestRun.totalCorrect,
        totalQuestions: latestRun.totalJudgeable,
        timeUsedSec: latestRun.totalTimeSec,
      });
    } catch (e) {
      console.error('[Quiz] submitChapterScore failed:', e);
    }
  };

  const handleNext = () => {
    if (!showingExplanation) {
      // 解答提出 → 採点して解説へ
      scoreCurrentQuestionIfNeeded();
      setShowingExplanation(true);
      if (onExplanationChange) onExplanationChange(true);
    } else {
      if (!isLastQuestion) {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowingExplanation(false);
        if (onExplanationChange) onExplanationChange(false);
      } else {
        // 章全体が完了 → ランキング送信
        // run state は React 更新が非同期なので、ここでは保存済みの最新を取り直す
        const latest = loadRun(chapter.id, mode);
        finalizeChapterRun(latest);
        // 新たな挑戦のためにラン状態リセット
        try { localStorage.removeItem(chapterRunKey(chapter.id, mode)); } catch { /* noop */ }
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
    const stored = run.perQuestion[currentQuestion?.id];
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
        scoreBreakdown={stored || null}
        scoreMeta={stored ? { timeLimit: stored.timeLimit, timeUsed: stored.timeUsed } : null}
        totalScore={run.totalScore}
        runningCombo={run.runningCombo}
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
        
        <div className="flex items-center gap-2 shrink-0">
          {/* 現在の累積スコアピル（スコア機能の視覚フィードバック） */}
          <div className="flex items-center gap-1.5 bg-[#F4D03F]/15 border border-[#F4D03F]/30 rounded-full px-2 py-1 md:px-3 md:py-1.5" title={`累積スコア / 連続正解 ${run.runningCombo}`}>
            <Trophy size={12} className="text-[#D4A017]" />
            <div className="font-mono font-bold text-[#1B2631] text-xs md:text-sm tabular-nums">
              {run.totalScore}
            </div>
            {run.runningCombo >= 3 && (
              <span className="text-[10px] font-bold text-orange-500 ml-0.5">🔥{run.runningCombo}</span>
            )}
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
      </div>

      {/* タイマーバー（ヘッダー直下、問題本文の上） ー 控えめな細いバー */}
      <div className="flex-none bg-white border-b border-gray-100">
        <QuizTimerBar
          timeLimit={questionTimeLimit}
          running={!showingExplanation}
          onTick={(e) => { timeUsedRef.current = e; }}
          resetKey={`${chapter.id}_${currentQuestionIndex}`}
        />
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
            {groupedSubQuestions.map((g: any, gIdx: number) => {
              if (g.type === 'group') {
                return (
                  <div key={`group-${gIdx}`} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-[#A9CCE3]/50 transition-all duration-250 flex flex-col gap-4">
                    <span className="font-bold text-[#2C3E50] text-sm text-left bg-blue-50/50 border border-[#A9CCE3]/30 py-2.5 px-4 rounded-xl leading-relaxed shadow-xs w-full block">
                      {formatText(g.groupName)}
                    </span>
                    
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 w-full">
                      {g.items.map((sq: any) => (
                        <div key={sq.id} className="flex flex-col gap-1.5 min-w-[50px] bg-stone-50/80 p-2 border border-stone-200/60 rounded-xl shadow-2xs">
                          <span className="font-bold text-stone-500 text-xs text-center border-b border-stone-200/60 pb-1 select-none font-sans">
                            {sq.label}
                          </span>
                          <input
                            type="text"
                            value={answers[sq.id] || ''}
                            onChange={(e) => handleTextChange(sq.id, e.target.value)}
                            placeholder="..."
                            className="w-full py-1 text-center text-sm font-bold text-stone-800 border-none outline-none focus:ring-0 leading-none bg-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              const sq = g.items[0];
              return (
                <div key={sq.id} className="flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-[#A9CCE3]/50 transition-all duration-250">
                  <div className="flex flex-col gap-3.5 w-full">
                    <span className="font-bold text-[#2C3E50] text-sm text-left bg-blue-50/45 border border-[#A9CCE3]/25 py-2 px-4 rounded-xl leading-relaxed shadow-xs w-full block">
                      {sq.label}
                    </span>
                    
                    {sq.type === 'multiple_choice' ? (
                      (() => {
                        const isLongOptionList = sq.options.some((opt: string) => opt.length > 5);
                        return (
                          <div className={isLongOptionList 
                            ? "grid grid-cols-1 gap-2.5 w-full" 
                            : "grid grid-cols-2 xs:grid-cols-3 gap-2 md:gap-3 w-full sm:flex sm:flex-wrap"
                          }>
                            {sq.options.map((opt: string) => {
                              const isSelected = (answers[sq.id] || '').split(',').includes(opt);
                              return (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    const isMultiple = sq.correctAnswer && (sq.correctAnswer.includes(",") || sq.correctAnswer.includes("・"));
                                    let next: string[];
                                    if (isMultiple) {
                                      const separator = sq.correctAnswer.includes("・") ? "・" : ",";
                                      const current = (answers[sq.id] || '').split(separator).filter(Boolean);
                                      const nextUnordered = isSelected 
                                        ? current.filter(a => a !== opt)
                                        : [...current, opt];
                                      const ordered = sq.options.filter((o: string) => nextUnordered.includes(o));
                                      next = ordered;
                                      handleOptionSelect(sq.id, next.join(separator));
                                    } else {
                                      next = isSelected ? [] : [opt];
                                      handleOptionSelect(sq.id, next.join(','));
                                    }
                                  }}
                                  className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border-2 flex items-center ${isLongOptionList ? 'justify-start text-left w-full' : 'justify-center text-center w-full sm:w-auto sm:flex-none'} min-w-[3rem] shadow-sm cursor-pointer
                                    ${isSelected 
                                      ? 'bg-[#A9CCE3] text-white border-[#A9CCE3] ring-2 ring-[#A9CCE3]/30 scale-[1.01]' 
                                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#A9CCE3]/50 hover:bg-gray-50'
                                    }`}
                                >
                                  {formatText(opt)}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()
                    ) : sq.type === 'sorting' ? (
                      <div className="flex-grow flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-2.5">
                          <div className="text-xs text-gray-400 font-bold flex items-center justify-between">
                            <span>ドラッグで順序を並べ替え :</span>
                            <span className="text-[10px] text-[#A9CCE3] font-normal">左ほど「大きい」</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2.5 p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl min-h-[72px]">
                            {(() => {
                              const activeOrder = answers[sq.id] ? answers[sq.id].split(' > ') : [...(sq.items || [])];
                              
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
                                    className={`flex items-center gap-2 px-3 py-2 bg-white border rounded-xl shadow-xs transition-all duration-200 cursor-grab select-none active:cursor-grabbing
                                      ${isDragging ? 'opacity-30 border-dashed border-gray-300 scale-95' : 'opacity-100'}
                                      ${isDragOver ? 'border-[#A9CCE3] bg-[#A9CCE3]/15 scale-105 ring-2 ring-[#A9CCE3]/20' : 'border-gray-200 hover:border-[#A9CCE3]/50 hover:bg-gray-50/50'}
                                    `}
                                  >
                                    <GripVertical size={13} className="text-gray-400 font-bold shrink-0" />
                                    <span className="font-bold text-gray-800 text-sm whitespace-nowrap">{formatText(item)}</span>
                                    <span className="text-[10px] bg-stone-100 text-stone-500 rounded px-1.5 py-0.5 text-center select-none font-mono font-semibold shrink-0">{idx + 1}</span>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
  
                        <div className="flex items-center justify-between gap-3 pt-0.5">
                          <span className="text-xs text-gray-400 leading-normal">
                            ※ 要素をドラッグまたは指でスライドさせて、正しい順序に並び替えてください。
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
                      <div className="flex-grow relative w-full">
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
                      <div className="flex-grow flex flex-col gap-2 w-full">
                        <div className="relative w-full">
                          <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="text"
                            value={answers[sq.id] || ''}
                            onChange={(e) => handleTextChange(sq.id, e.target.value)}
                            placeholder="解答を入力..."
                            className="w-full pl-9 pr-4 py-2.5 md:py-2.5 text-[16px] md:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern bg-gray-50 focus:bg-white shadow-sm leading-relaxed"
                          />
                        </div>
                        
                        {/* Chemistry Symbol Helper Palette */}
                        <div className="bg-stone-50 border border-stone-200/80 p-2 md:p-2.5 rounded-xl flex flex-col gap-1.5 w-full">
                          <div className="text-[10px] md:text-xs text-stone-500 font-bold select-none px-0.5">
                            化学記号パレット (タップで入力欄に挿入 & コピー) :
                          </div>
                          <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto">
                            {chemistryShortcuts.map((item) => (
                              <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                  const currentVal = answers[sq.id] || '';
                                  handleTextChange(sq.id, currentVal + item.value);
                                  try {
                                    navigator.clipboard.writeText(item.value);
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                className="px-2 py-1 bg-white border border-stone-200 hover:border-stone-400 hover:bg-stone-100 rounded-lg text-xs md:text-sm font-bold text-stone-700 font-sans shadow-xs cursor-pointer transition-colors flex items-center gap-1 active:scale-95"
                                title={item.desc}
                              >
                                <span>{item.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

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

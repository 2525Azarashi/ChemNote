import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronRight, ChevronLeft, Edit3, ArrowLeft, GripVertical, Trophy } from 'lucide-react';
import { formatText } from '../utils/textFormatter';
import { substanceTreeData } from '../data/chemistryData';
import { getRelatedSteps, filterTree } from '../utils/logicTreeUtils';
import { Explanation } from './Explanation';
import { IonizationEnergyChart } from './IonizationEnergyChart';
import { QuestionFigure } from './QuestionFigure';
import { buildFigureNumberMap, getFigureNumber } from '../utils/figureNumbering';
import { QuizTimerBar } from './QuizTimerBar';
import { FloatingScoreAnimation } from './FloatingScoreAnimation';
import {
  calcQuestionTimeLimit,
  scoreProblem,
  calcMaxCombo,
  comboMultiplier,
  type ScoreBreakdown,
} from '../utils/scoring';
import { submitChapterScore } from '../utils/leaderboard';
import { captureWrongAnswers, type WrongAnswerInput } from '../utils/reviewList';
import { isAnswerCorrect, isDescriptive } from '../utils/answerJudge';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { auth } from '../firebase';

interface QuizProps {
  mode: 'mini_test' | 'practice';
  chapter: any;
  onFinish: (answers: Record<string, string>, result?: ChapterRunState) => void;
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

/**
 * 問題が下付き・上付き文字パレットの表示が必要かどうかを判定
 * 対象：イオン表記、化学式、原子番号・質量数表記など
 */
function requiresChemicalSymbols(question: any, answer: any = {}): boolean {
  const text = [
    question?.text || '',
    answer?.correctAnswer || '',
    question?.category || '',
    JSON.stringify(question?.detailedExplanation || ''),
  ]
    .join(' ')
    .toLowerCase();

  // パターン検出：
  // 1. イオン表記（例：Cu2+, Cl-, NH4+）
  const ionPattern = /\b([a-z]{1,2}\d*(?:[\+\-]|【）)|\([\+\-]|イオン)/i;
  // 2. 化学式内の数字（例：H2O, CaCO3）
  const chemicalFormula = /\b[a-z]\d+\b|[a-z]{2,}\d+/i;
  // 3. 上付き・下付き記号の参照（例：⁺, ⁻, ₂, ₃）
  const unicodeSuperSubscript = /[⁺⁻²³⁴⁵₂₃₄₅]/;
  // 4. 原子番号や質量数表記（例：_8O, 235U）
  const massNumberPattern = /\d+[a-z]|[a-z]\d+[\+\-\)]|\d+\(/;
  // 5. 「価」「イオン」「原子」関連キーワード
  const chemKeywords =
    /価|イオン|原子|分子|化合物|酸化|還元|電荷|陽子|陰イオン|陽イオン|硫酸|硝酸|塩化|水酸|炭酸|アンモニウム/;
  // 6. 化学反応式・イオン反応式・熱化学方程式などの記述問題
  const reactionKeywords =
    /反応式|化学式|組成式|電離|中和|化学反応|イオン反応|熱化学|燃焼|→|⇌/;

  return (
    ionPattern.test(text) ||
    chemicalFormula.test(text) ||
    unicodeSuperSubscript.test(text) ||
    massNumberPattern.test(text) ||
    chemKeywords.test(text) ||
    reactionKeywords.test(text)
  );
}

type PaletteItem = { label: string; value: string; desc: string };
type PaletteGroup = { group: string; items: PaletteItem[] };

// 化学記号パレット（カテゴリ別）。
// 反応式・化学式・イオン式の入力を、キーボードを使わずワンタップで行えるようにする。
const chemistryPaletteGroups: PaletteGroup[] = [
  {
    group: '反応式の記号',
    items: [
      { label: '→', value: ' → ', desc: '生成（右向き矢印）' },
      { label: '⇌', value: ' ⇌ ', desc: '可逆反応（平衡）' },
      { label: '+', value: ' + ', desc: '化学式どうしの区切り（プラス）' },
      { label: '↑', value: '↑', desc: '気体の発生' },
      { label: '↓', value: '↓', desc: '沈殿の生成' },
      { label: '·', value: '·', desc: '水和水などの中点（例: CuSO₄·5H₂O）' },
    ],
  },
  {
    group: '下付き数字',
    items: [
      { label: '₁', value: '₁', desc: '下付き1' },
      { label: '₂', value: '₂', desc: '下付き2' },
      { label: '₃', value: '₃', desc: '下付き3' },
      { label: '₄', value: '₄', desc: '下付き4' },
      { label: '₅', value: '₅', desc: '下付き5' },
      { label: '₆', value: '₆', desc: '下付き6' },
      { label: '₇', value: '₇', desc: '下付き7' },
      { label: '₈', value: '₈', desc: '下付き8' },
    ],
  },
  {
    group: 'イオンの価数（上付き）',
    items: [
      { label: '⁺', value: '⁺', desc: '1価陽イオン (上付きプラス)' },
      { label: '⁻', value: '⁻', desc: '1価陰イオン (上付きマイナス)' },
      { label: '²⁺', value: '²⁺', desc: '2価陽イオン' },
      { label: '²⁻', value: '²⁻', desc: '2価陰イオン' },
      { label: '³⁺', value: '³⁺', desc: '3価陽イオン' },
      { label: '³⁻', value: '³⁻', desc: '3価陰イオン' },
    ],
  },
  {
    group: 'よく使うイオン式',
    items: [
      { label: 'H⁺', value: 'H⁺', desc: '水素イオン' },
      { label: 'OH⁻', value: 'OH⁻', desc: '水酸化物イオン' },
      { label: 'NH₄⁺', value: 'NH₄⁺', desc: 'アンモニウムイオン' },
      { label: 'NO₃⁻', value: 'NO₃⁻', desc: '硝酸イオン' },
      { label: 'SO₄²⁻', value: 'SO₄²⁻', desc: '硫酸イオン' },
      { label: 'CO₃²⁻', value: 'CO₃²⁻', desc: '炭酸イオン' },
      { label: 'PO₄³⁻', value: 'PO₄³⁻', desc: 'リン酸イオン' },
      { label: 'Cl⁻', value: 'Cl⁻', desc: '塩化物イオン' },
    ],
  },
  {
    group: 'よく使う化学式',
    items: [
      { label: 'H₂O', value: 'H₂O', desc: '水' },
      { label: 'CO₂', value: 'CO₂', desc: '二酸化炭素' },
      { label: 'O₂', value: 'O₂', desc: '酸素' },
      { label: 'H₂', value: 'H₂', desc: '水素' },
      { label: 'N₂', value: 'N₂', desc: '窒素' },
      { label: 'Cl₂', value: 'Cl₂', desc: '塩素' },
      { label: 'NaCl', value: 'NaCl', desc: '塩化ナトリウム' },
      { label: 'CaCO₃', value: 'CaCO₃', desc: '炭酸カルシウム' },
    ],
  },
];

// iOS/Android: ソフトウェアキーボード出現時に入力欄がキーボードで隠れるのを防ぐため、
// フォーカス時に少し遅延して入力欄を画面内へスクロールする。
// visualViewport API が使える場合は、キーボードで狭まった実際の可視領域を基準に
// 入力欄がキーボードの上に来るよう調整する（block:'center' だとキーボード裏に隠れることがある）。
const scrollInputIntoView = (target: HTMLElement) => {
  const vv = (window as any).visualViewport as VisualViewport | undefined;
  if (vv) {
    const rect = target.getBoundingClientRect();
    // 可視領域の下端（キーボード上端に相当）
    const visibleBottom = vv.offsetTop + vv.height;
    // 入力欄の下端が可視領域の下端より下（＝キーボードに隠れている）なら、
    // 余白 24px を確保してスクロールする。
    const margin = 24;
    const overflowBottom = rect.bottom - (visibleBottom - margin);
    if (overflowBottom > 0) {
      window.scrollBy({ top: overflowBottom, behavior: 'smooth' });
      return;
    }
    // 入力欄が可視領域の上に隠れている場合
    const overflowTop = (vv.offsetTop + margin) - rect.top;
    if (overflowTop > 0) {
      window.scrollBy({ top: -overflowTop, behavior: 'smooth' });
      return;
    }
    return;
  }
  // visualViewport 非対応環境のフォールバック
  try {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch {
    target.scrollIntoView();
  }
};

const handleInputFocusScroll = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const target = e.currentTarget;
  // キーボードの表示アニメーション完了を待ってからスクロールする。
  setTimeout(() => scrollInputIntoView(target), 300);
  // visualViewport のリサイズ（キーボード出現）を捉えて再調整（iOS で確実にするため）。
  const vv = (window as any).visualViewport as VisualViewport | undefined;
  if (vv) {
    const onResize = () => {
      scrollInputIntoView(target);
      vv.removeEventListener('resize', onResize);
    };
    vv.addEventListener('resize', onResize);
    // 保険として一定時間後にリスナーを解除
    setTimeout(() => vv.removeEventListener('resize', onResize), 1000);
  }
};

/**
 * 化学記号パレット。
 * - カテゴリ別に記号を配置し、ワンタップで入力欄のカーソル位置へ挿入する。
 * - 入力欄の参照を受け取り、選択範囲（カーソル位置）に挿入 → キャレットを更新する。
 *   参照が無い場合は末尾に追記するフォールバック動作。
 */
function ChemistryPalette({
  value,
  onChange,
  inputRef,
}: {
  value: string;
  onChange: (next: string) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}) {
  const insert = (text: string) => {
    const el = inputRef.current;
    if (el && typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = value.slice(0, start) + text + value.slice(end);
      onChange(next);
      // 挿入後、キャレットを挿入文字列の直後へ移動（次の描画後に反映）。
      const caret = start + text.length;
      requestAnimationFrame(() => {
        try {
          el.focus();
          el.setSelectionRange(caret, caret);
        } catch {
          /* noop */
        }
      });
    } else {
      onChange(value + text);
    }
  };

  return (
    <div className="bg-stone-50 border border-stone-200/80 p-2.5 md:p-3 rounded-xl flex flex-col gap-2 w-full">
      <div className="text-[11px] md:text-xs text-stone-500 font-bold select-none px-0.5 flex items-center gap-1">
        <span>化学記号パレット</span>
        <span className="font-normal text-stone-400">（タップで入力欄のカーソル位置に挿入）</span>
      </div>
      <div className="flex flex-col gap-2 max-h-[220px] md:max-h-none overflow-y-auto">
        {chemistryPaletteGroups.map((grp) => (
          <div key={grp.group} className="flex flex-col gap-1">
            <div className="text-[10px] md:text-[11px] text-stone-400 font-bold select-none px-0.5">
              {grp.group}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {grp.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  // マウス/タッチダウンでの入力欄フォーカス喪失を防ぐ（キャレット維持のため）。
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => insert(item.value)}
                  className="min-w-[44px] min-h-[36px] px-2.5 py-1.5 bg-white border border-stone-200 hover:border-stone-400 hover:bg-stone-100 rounded-lg text-sm md:text-sm font-bold text-stone-700 font-sans shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-1 active:scale-95"
                  title={item.desc}
                  aria-label={item.desc}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Quiz({ mode, chapter, onFinish, onBack, isGuest, isMobileView, onExplanationChange, onScored }: QuizProps) {
  // ===== タイマー & スコア用 state =====
  const [run, setRun] = useState<ChapterRunState>(() => loadRun(chapter.id, mode));
  const timeUsedRef = useRef(0); // タイマーから250msごとに通知される最新値
  const lastScoredQuestionRef = useRef<string | null>(null);
  // 記述/短答入力欄の参照を sub-question id 単位で保持（化学記号パレットの
  // カーソル位置挿入に使用）。
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});
  const getInputRef = (sqId: string): React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> => ({
    get current() {
      return inputRefs.current[sqId] ?? null;
    },
    set current(el: HTMLInputElement | HTMLTextAreaElement | null) {
      inputRefs.current[sqId] = el;
    },
  });

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
  // Score animation state
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [scoreAnimationData, setScoreAnimationData] = useState<{
    breakdown: ScoreBreakdown;
    totalScore: number;
  } | null>(null);
  // スマホ/PC判定は共有フックに一元化（lg=1024px 以上をPCとみなす）。
  // isMobileView が渡された場合（スマホプレビュー枠）はそれを優先する。
  const isDesktop = useIsDesktop(isMobileView !== undefined ? !isMobileView : undefined);

  // 直前に表示していた問題のインデックスを保持（離脱した問題の回答リセット用）
  const prevQuestionIndexRef = useRef(currentQuestionIndex);

  /**
   * 指定インデックスの問題に入力された回答を消去する。
   * ただし、その問題が既に採点済み（run.perQuestion に記録済み）の場合は保持する
   * （採点済みの解答は解説表示の答え合わせに必要なため）。
   * 「一度離れた未提出の問題の回答」だけをリセットし、不正な得点（解答の使い回し）を防ぐ。
   */
  const clearAnswersForQuestionIfUnscored = (qIndex: number) => {
    const q = questions[qIndex];
    if (!q) return;
    const scored = !!run.perQuestion[q.id];
    if (scored) return; // 採点済みは残す
    const subIds: string[] = (q.subQuestions || []).map((sq: any) => sq.id);
    if (subIds.length === 0) return;
    setAnswers(prev => {
      let changed = false;
      const next = { ...prev };
      subIds.forEach(id => {
        if (id in next) {
          delete next[id];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  };

  // Clear highlights on new question
  useEffect(() => {
    setHighlights([]);
    timeUsedRef.current = 0;
    lastScoredQuestionRef.current = null;

    // 問題が切り替わったら、離れた（前の）問題の未提出回答をリセットする
    const leftIndex = prevQuestionIndexRef.current;
    if (leftIndex !== currentQuestionIndex) {
      clearAnswersForQuestionIfUnscored(leftIndex);
      prevQuestionIndexRef.current = currentQuestionIndex;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // 章内の図版へ通し番号（図1・図2 …）を割り当てるためのマップ。
  const figureNumberMap = useMemo(() => buildFigureNumberMap(questions), [questions]);

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
    if (!currentQuestion) return null;
    if (run.perQuestion[currentQuestion.id]) return null;
    if (lastScoredQuestionRef.current === currentQuestion.id) return null;
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

    // 復習リスト：この問題で間違えた設問（自動採点可能なもの）をキャプチャする。
    // 記述式（descriptive）は自動採点不可なため対象外。
    try {
      const uid = auth.currentUser?.uid || (isGuest ? 'guest' : null);
      if (uid) {
        const questionIndex = currentQuestionIndex + 1;
        const wrongInputs: WrongAnswerInput[] = subQuestions
          .filter((sq: any) => !isDescriptive(sq))
          .filter((sq: any) => !isAnswerCorrect(sq, answers[sq.id]))
          .map((sq: any) => ({
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            questionIndex,
            questionId: currentQuestion.id,
            subQuestionId: sq.id,
            subLabel: sq.label,
            questionText: currentQuestion.text,
            correctAnswer: sq.correctAnswer,
            wrongAnswer: (answers[sq.id] || '').trim(),
          }));
        if (wrongInputs.length > 0) captureWrongAnswers(uid, wrongInputs);
      }
    } catch (e) {
      console.error('[Quiz] captureWrongAnswers failed:', e);
    }

    if (onScored) {
      onScored(finalBreakdown, {
        timeLimit: questionTimeLimit,
        timeUsed,
        questionId: currentQuestion.id,
      });
    }

    return { breakdown: finalBreakdown, nextRun, addedScore: boostedScore };
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
      const scored = scoreCurrentQuestionIfNeeded();
      
      // スコアアニメーションのデータを取得
      const currentQuestion = questions[currentQuestionIndex];
      if (scored) {
        const scoreData = scored.breakdown;
        setScoreAnimationData({
          breakdown: scoreData,
          totalScore: scored.addedScore,
        });
        setShowScoreAnimation(true);
        // アニメーション終了後に自動的に非表示に
        setTimeout(() => setShowScoreAnimation(false), 3500);
      }
      
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
        onFinish(answers, latest);
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

  /**
   * クイズから離脱（単元選択に戻る）するときのハンドラ。
   * 解説表示中でない＝まだ採点していない現在の問題に入力された回答は、
   * 離脱時にリセットして「離れた問題の回答の使い回し」による不正得点を防ぐ。
   */
  const handleExit = () => {
    if (!showingExplanation) {
      clearAnswersForQuestionIfUnscored(currentQuestionIndex);
    }
    onBack();
  };

  if (showingExplanation) {
    const stored = run.perQuestion[currentQuestion?.id];
    return (
      <>
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
        {scoreAnimationData && (
          <FloatingScoreAnimation
            breakdown={scoreAnimationData.breakdown}
            totalScore={scoreAnimationData.totalScore}
            isVisible={showScoreAnimation}
          />
        )}
      </>
    );
  }

  return (
    <div className="fixed inset-0 w-full flex flex-col bg-gray-50 overflow-hidden z-40">
      
      {/* Header (Fixed) */}
      <div className="flex-none p-2 md:p-6 border-b border-gray-200 bg-white shadow-sm z-10 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center text-left gap-2 md:gap-4 min-w-0">
          <button 
            onClick={handleExit}
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

      {/* Score Animation Overlay */}
      {scoreAnimationData && (
        <FloatingScoreAnimation
          breakdown={scoreAnimationData.breakdown}
          totalScore={scoreAnimationData.totalScore}
          isVisible={showScoreAnimation}
        />
      )}

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
            className="flex-1 overflow-y-auto p-4 md:p-8 text-[15px] leading-[1.85] md:text-base md:leading-relaxed text-gray-800 font-modern break-words [overflow-wrap:anywhere]"
            onMouseUp={handleTextSelection}
            onTouchEnd={handleTextSelection}
            title="テキストを選択するとハイライトできます"
          >
            <div className="max-w-prose md:max-w-none">
              {formatText(currentQuestion.text, highlights)}
              {currentQuestion.text.includes('図6') && (
                <div className="mt-4">
                  <IonizationEnergyChart showDetails={false} />
                </div>
              )}
              {/* 問題に付随する図・イラスト（PDF由来の図版など） */}
              {currentQuestion.imageUrl && (
                <QuestionFigure
                  src={currentQuestion.imageUrl}
                  caption={currentQuestion.imageCaption}
                  figureNumber={getFigureNumber(figureNumberMap, currentQuestion.id)}
                  tone="light"
                  className="mt-5"
                />
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Answers Area (Scrollable) */}
        <div className={`lg:w-[42%] flex-1 min-h-0 overflow-y-auto bg-gray-50/50 p-4 md:p-8 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-8 relative ${!isDesktop && isProblemExpanded ? 'hidden' : 'block z-10'}`}>
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
                            onFocus={handleInputFocusScroll}
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
                        // 複数選択かどうかの判定：
                        //   correctAnswer を区切り文字で分割した「すべてのトークン」が選択肢に存在する場合のみ複数選択とみなす。
                        //   単に correctAnswer にカンマが含まれるだけ（例: "ア: 相対, イ: 単位, ..." のような
                        //   カンマ入りの単一選択肢）を複数選択と誤判定しないようにするための堅牢な判定。
                        const optionSet = new Set(sq.options.map((o: string) => o.trim()));
                        const detectMulti = (sep: string) => {
                          if (!sq.correctAnswer || !sq.correctAnswer.includes(sep)) return false;
                          const toks = sq.correctAnswer.split(sep).map((t: string) => t.trim()).filter(Boolean);
                          return toks.length >= 2 && toks.every((t: string) => optionSet.has(t));
                        };
                        const multiSep = detectMulti('・') ? '・' : (detectMulti(',') ? ',' : null);
                        const isMultiple = multiSep !== null;
                        return (
                          <div className={isLongOptionList 
                            ? "grid grid-cols-1 gap-2.5 w-full" 
                            : "grid grid-cols-2 xs:grid-cols-3 gap-2 md:gap-3 w-full sm:flex sm:flex-wrap"
                          }>
                            {sq.options.map((opt: string) => {
                              // 単一選択ではカンマで分割せず完全一致で判定する（カンマ入り選択肢に対応）
                              const isSelected = isMultiple
                                ? (answers[sq.id] || '').split(multiSep as string).map(s => s.trim()).includes(opt.trim())
                                : (answers[sq.id] || '') === opt;
                              return (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    let next: string[];
                                    if (isMultiple) {
                                      const separator = multiSep as string;
                                      const current = (answers[sq.id] || '').split(separator).map(s => s.trim()).filter(Boolean);
                                      const nextUnordered = isSelected 
                                        ? current.filter(a => a !== opt)
                                        : [...current, opt];
                                      const ordered = sq.options.filter((o: string) => nextUnordered.includes(o));
                                      next = ordered;
                                      handleOptionSelect(sq.id, next.join(separator));
                                    } else {
                                      handleOptionSelect(sq.id, isSelected ? '' : opt);
                                      return;
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
                      <div className="flex-grow flex flex-col gap-2 w-full">
                        <div className="relative w-full">
                          <Edit3 className="absolute left-3 top-3 text-gray-400" size={16} />
                          <textarea
                            ref={(el) => { inputRefs.current[sq.id] = el; }}
                            value={answers[sq.id] || ''}
                            onChange={(e) => handleTextChange(sq.id, e.target.value)}
                            onFocus={handleInputFocusScroll}
                            placeholder="解答を入力..."
                            rows={3}
                            className="w-full pl-9 pr-4 py-2 md:py-2.5 text-[16px] md:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern resize-none bg-gray-50 focus:bg-white leading-relaxed"
                          />
                        </div>

                        {/* 化学記号パレット（反応式・化学式の記述が必要な問題のみ表示） */}
                        {requiresChemicalSymbols(sq, sq.correctAnswer) && (
                          <ChemistryPalette
                            value={answers[sq.id] || ''}
                            onChange={(next) => handleTextChange(sq.id, next)}
                            inputRef={getInputRef(sq.id)}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex-grow flex flex-col gap-2 w-full">
                        <div className="relative w-full">
                          <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            ref={(el) => { inputRefs.current[sq.id] = el; }}
                            type="text"
                            value={answers[sq.id] || ''}
                            onChange={(e) => handleTextChange(sq.id, e.target.value)}
                            onFocus={handleInputFocusScroll}
                            placeholder="解答を入力..."
                            className="w-full pl-9 pr-4 py-2.5 md:py-2.5 text-[16px] md:text-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern bg-gray-50 focus:bg-white shadow-sm leading-relaxed"
                          />
                        </div>

                        {/* 化学記号パレット（必要な問題のみ表示・カーソル位置に挿入） */}
                        {requiresChemicalSymbols(sq, sq.correctAnswer) && (
                          <ChemistryPalette
                            value={answers[sq.id] || ''}
                            onChange={(next) => handleTextChange(sq.id, next)}
                            inputRef={getInputRef(sq.id)}
                          />
                        )}
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

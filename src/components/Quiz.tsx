import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { ChevronRight, ChevronLeft, Edit3, ArrowLeft, GripVertical, Trophy } from 'lucide-react';
import { formatText } from '../utils/textFormatter';
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
import { useIsDesktop, useIsMobile } from '../hooks/useMediaQuery';
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
  if (question?.requiresChemicalPalette) return true;
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
    group: '上付き数字（指数・べき）',
    items: [
      { label: '⁻', value: '⁻', desc: '上付きマイナス（指数の符号／例: 10⁻¹⁰）' },
      { label: '⁰', value: '⁰', desc: '上付き0' },
      { label: '¹', value: '¹', desc: '上付き1' },
      { label: '²', value: '²', desc: '上付き2（例: 2n²）' },
      { label: '³', value: '³', desc: '上付き3' },
      { label: '⁴', value: '⁴', desc: '上付き4' },
      { label: '⁵', value: '⁵', desc: '上付き5' },
      { label: '⁶', value: '⁶', desc: '上付き6' },
      { label: '⁷', value: '⁷', desc: '上付き7' },
      { label: '⁸', value: '⁸', desc: '上付き8' },
      { label: '⁹', value: '⁹', desc: '上付き9' },
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

/** 表示上の問題番号（問1/【問1】/先頭の 1 など）を消して、進捗表示に統一する。 */
function cleanQuestionText(text: string): string {
  return String(text || '')
    .replace(/^\s*(?:【\s*問?\s*\d+\s*】|問\s*\d+|第\s*\d+\s*問|\d+[.．、\s]+)\s*/u, '')
    .replace(/\n\s*(?:問\s*\d+|【\s*問?\s*\d+\s*】)\s*/gu, '\n');
}

/**
 * 設問ラベル（例: "問1 (ア)" / "(ア)" / "問3 (1) A"）から、
 * 問題文中でハイライトすべき「空欄トークン」を推定して返す。
 * 主に ( ア ) 〜 ( ス ) のような穴埋め記号を対象にする。
 * 見つからない場合は null を返す（＝ハイライトしない）。
 */
function extractBlankToken(label: string): string | null {
  if (!label) return null;
  // カッコ内のカタカナ1文字（ア〜ン）や、丸数字・英字1文字などを拾う。
  // 例: "問1 (ア)" → "ア", "(イ)" → "イ"
  const kata = label.match(/[（(]\s*([ア-ンア-ヶ])\s*[)）]/);
  if (kata) return kata[1];
  return null;
}

/**
 * 問題文中に「( ア )」のように空白付きで書かれた空欄と、
 * 詰めて書かれた「(ア)」の両方に対応するため、ハイライト候補文字列を複数返す。
 */
function blankHighlightVariants(token: string): string[] {
  return [
    `( ${token} )`,
    `(${token})`,
    `（ ${token} ）`,
    `（${token}）`,
  ];
}

/**
 * short_answer（短答穴埋め）かどうかの判定。
 * multiple_choice / sorting / descriptive 以外の短答入力を対象にする。
 */
function isShortAnswerType(sq: any): boolean {
  const t = sq?.type;
  return t !== 'multiple_choice' && t !== 'sorting' && t !== 'descriptive';
}

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
  // フローティング入力バー内の実入力要素の参照（スマホ時の唯一の編集入力）。
  // カードはタップ選択のみの表示専用にし、実際の文字入力はこのバーで行う（要件1）。
  const barInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  // 「前へ/次へ」やキーボードの「次へ(next)」でフォーカスを移すとき、
  // 再レンダー後に描画前（同期）で確実に .focus() するための一時保持。
  // iOS でソフトキーボードが一瞬閉じてしまう不具合の防止に用いる。
  const pendingFocusIdRef = useRef<string | null>(null);
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
  // 現在フォーカス中の短答穴埋め設問ID（フローティング入力欄・空欄ハイライト用）
  const [focusedSubId, setFocusedSubId] = useState<string | null>(null);
  // ソフトキーボードが表示されているか（visualViewport で推定）。
  // 表示中のみ、短答穴埋め用のフローティング入力バーを画面下部に出す。
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  // フローティング入力バーをキーボード上端に追従させるためのオフセット（px）。
  // visualViewport から算出した「画面下端からキーボード上端までの距離」。
  // iOS Safari では position:fixed + bottom:0 がキーボードに隠れるため、
  // ここで動的に bottom 値を与えてキーボードに貼り付くようにする。
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  // スマホ（タッチ）並べ替え用：タップで選択中の要素インデックス。
  // 「1つ目タップで選択 → 2つ目タップで位置を入れ替え」に使う。
  // sqId 単位で管理し、別設問へ移ったら選択解除する。
  const [tapSortSelect, setTapSortSelect] = useState<{ sqId: string; index: number } | null>(null);
  // Score animation state
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [scoreAnimationData, setScoreAnimationData] = useState<{
    breakdown: ScoreBreakdown;
    totalScore: number;
  } | null>(null);
  // スマホ/PC判定は共有フックに一元化（lg=1024px 以上をPCとみなす）。
  // isMobileView が渡された場合（スマホプレビュー枠）はそれを優先する。
  const isDesktop = useIsDesktop(isMobileView !== undefined ? !isMobileView : undefined);
  // 解答解説ページに渡すスマホ判定。
  // 【スクロール不具合の修正】従来は Explanation に isMobileView={false} を固定で
  // 渡していたため、実機スマホでも解説がPC版レイアウト（overflow-hidden）で描画され、
  // 縦スクロールできない不具合があった。ここでスマホ判定を正しく引き渡す。
  const isMobileForExplanation = useIsMobile(isMobileView);

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

  // 問題解答画面ではズーム（ピンチ／ダブルタップ）を一切禁止する。
  //
  // 【要件2・利便性向上】
  // - meta viewport を scale=1.0 固定・user-scalable=no にして拡大を禁止。
  // - iOS Safari は maximum-scale を後から変えても効かない場合があるため、
  //   gesturestart / gesturechange（ピンチ）と、300ms以内の連続タップ（ダブルタップ）
  //   を JS で明示的に抑止し、確実にズームさせない。
  // - 解説表示（showingExplanation）へ切り替わる瞬間は、一旦 scale=1.0 に初期化して
  //   直前のズーム倍率を引き継がないようにしてから、閲覧用のピンチズームを許可する。
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    const originalContent = meta?.getAttribute('content') || '';

    const LOCK = 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    const ALLOW = 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';

    // ピンチズーム（iOS の gesture イベント）を抑止
    const preventGesture = (e: Event) => { e.preventDefault(); };
    // ダブルタップズームを抑止（前回タップから300ms以内の2回目タップをキャンセル）
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    if (meta) {
      if (showingExplanation) {
        // 解説へ移る瞬間: 一旦 scale=1.0 に初期化 → 次フレームで閲覧用ズームを許可
        meta.setAttribute('content', LOCK);
        window.scrollTo(0, 0);
        requestAnimationFrame(() => {
          meta.setAttribute('content', ALLOW);
        });
      } else {
        // 解答中: ズーム完全禁止
        meta.setAttribute('content', LOCK);
      }
    }

    // 解答中のみズーム抑止リスナーを登録する
    if (!showingExplanation) {
      document.addEventListener('gesturestart', preventGesture, { passive: false });
      document.addEventListener('gesturechange', preventGesture, { passive: false });
      document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
    }

    return () => {
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('gesturechange', preventGesture);
      document.removeEventListener('touchend', preventDoubleTapZoom);
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

  // ソフトキーボードの表示/非表示を visualViewport の高さ変化で推定する。
  // キーボードが閉じたら、フローティング入力欄も閉じて「問題文全体＋入力欄」を
  // 同時に見られる通常表示に戻す（要件1）。
  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) return;
    // 初期のフル高さ。キーボード表示で vv.height はこれより小さくなる。
    const baseline = () => Math.max(vv.height, window.innerHeight || 0);
    let base = baseline();
    const onResize = () => {
      const full = Math.max(base, window.innerHeight || 0);
      // 可視領域が 15% 以上縮んだらキーボード表示とみなす。
      const shrink = full - vv.height;
      const visible = shrink > full * 0.15;
      setKeyboardVisible(visible);
      if (visible) {
        // キーボード上端の位置（レイアウトビューポート下端からの距離）。
        // layout viewport の高さ - (visualViewport の可視下端) がキーボード高さに相当。
        // offsetTop はページスクロール分、height は可視高さ。
        const layoutH = window.innerHeight || full;
        const kbTopFromBottom = Math.max(0, layoutH - (vv.height + vv.offsetTop));
        setKeyboardOffset(kbTopFromBottom);
      } else {
        setKeyboardOffset(0);
        // キーボードが閉じたらフォーカス状態も解除（通常表示へ）。
        // ただし選択式・並べ替え等のテキスト非入力設問は元々キーボードを
        // 開かないため、この resize 起因の解除対象から除外する
        // （除外しないと固定パネルが即座に閉じてしまう）。
        setFocusedSubId((prev) => {
          if (!prev) return prev;
          const cur = (currentQuestionRef.current?.subQuestions || []).find(
            (sq: any) => sq.id === prev
          );
          const isText = cur && (isShortAnswerType(cur) || cur.type === 'descriptive');
          return isText ? null : prev;
        });
      }
    };
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onResize);
    };
  }, []);

  // 問題が切り替わったらフォーカス・キーボード状態・並べ替えの選択をリセット
  useEffect(() => {
    setFocusedSubId(null);
    setTapSortSelect(null);
  }, [currentQuestionIndex]);

  // 「次へ/前へ」やキーボードの next キーによる移動時は、再レンダー直後・描画前に
  // 同期でフォーカスを移す（useLayoutEffect）。iOS はユーザー操作に続く同期的な
  // focus 移動であればソフトキーボードを閉じないため、「次へ」で入力状態が一瞬
  // 解除される不具合を防げる（課題2）。
  useLayoutEffect(() => {
    if (isDesktop) return;
    if (!focusedSubId) return;
    if (pendingFocusIdRef.current !== focusedSubId) return;
    pendingFocusIdRef.current = null;
    // テキスト非入力（選択式・並べ替え）はキーボードを開かないため
    // フォーカス移動は不要。
    {
      const cur = (currentQuestionRef.current?.subQuestions || []).find((sq: any) => sq.id === focusedSubId);
      const isText = cur && (isShortAnswerType(cur) || cur.type === 'descriptive');
      if (!isText) return;
    }
    const el = barInputRef.current;
    if (el) {
      el.focus({ preventScroll: true });
      try {
        const len = (el.value || '').length;
        (el as any).setSelectionRange?.(len, len);
      } catch {
        /* noop */
      }
    }
  }, [focusedSubId, isDesktop]);

  // 選択中の空欄（focusedSubId）が変わったら、フローティングバー内の入力欄へ
  // 実フォーカスを移してソフトキーボードを開く（要件1：入力はバーに一本化）。
  // カードのタップ→バー出現→キーボード表示、という流れを成立させる。
  // （移動由来の pendingFocus は上の useLayoutEffect が処理済みなのでスキップ）
  useEffect(() => {
    if (isDesktop) return;
    if (!focusedSubId) return;
    // テキスト非入力（選択式・並べ替え）はキーボードを開かないため、
    // カードのスクロールのみ行いフォーカス移動はしない。
    const curSub = (currentQuestionRef.current?.subQuestions || []).find((sq: any) => sq.id === focusedSubId);
    const isTextFocus = curSub && (isShortAnswerType(curSub) || curSub.type === 'descriptive');
    if (!isTextFocus) {
      const card = document.getElementById(`ans-card-${focusedSubId}`);
      if (card) {
        const raf = requestAnimationFrame(() => setTimeout(() => scrollInputIntoView(card), 150));
        return () => cancelAnimationFrame(raf);
      }
      return;
    }
    const raf = requestAnimationFrame(() => {
      const el = barInputRef.current;
      // すでにフォーカス済み（useLayoutEffect で処理済み等）なら二重処理しない
      if (el && document.activeElement !== el) {
        el.focus({ preventScroll: true });
        try {
          const len = (el.value || '').length;
          (el as any).setSelectionRange?.(len, len);
        } catch {
          /* noop */
        }
      }
      // 選択中の空欄カードをバーの上に見えるようスクロール
      const card = document.getElementById(`ans-card-${focusedSubId}`);
      if (card) setTimeout(() => scrollInputIntoView(card), 320);
    });
    return () => cancelAnimationFrame(raf);
  }, [focusedSubId, isDesktop]);

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

  // ────────────────────────────────────────────────────────────────
  // 解答コントロールの共通描画（要件1）
  // 選択式（multiple_choice）・並べ替え（sorting）の入力UIを関数化し、
  // PC版はインラインで、スマホ版は下部固定パネル内で同じUIを再利用する。
  // これにより「問題形式によらず解答欄を固定表示・前へ/次へで遷移」を満たす。
  // ────────────────────────────────────────────────────────────────

  /** 選択式（単一・複数）の選択肢ボタン群を描画する。 */
  const renderMultipleChoiceControl = (sq: any) => {
    const isLongOptionList = sq.options.some((opt: string) => opt.length > 5);
    // 複数選択かどうかの判定：
    //   correctAnswer を区切り文字で分割した「すべてのトークン」が選択肢に存在する場合のみ複数選択とみなす。
    const optionSet = new Set(sq.options.map((o: string) => o.trim()));
    const detectMulti = (sep: string) => {
      if (!sq.correctAnswer || !sq.correctAnswer.includes(sep)) return false;
      const toks = sq.correctAnswer.split(sep).map((t: string) => t.trim()).filter(Boolean);
      return toks.length >= 2 && toks.every((t: string) => optionSet.has(t));
    };
    const multiSep = detectMulti('・') ? '・' : (detectMulti('、') ? '、' : (detectMulti(',') ? ',' : null));
    const isMultiple = multiSep !== null;
    return (
      <div className={isLongOptionList
        ? "grid grid-cols-1 gap-2.5 w-full"
        : "grid grid-cols-2 xs:grid-cols-3 gap-2 md:gap-3 w-full sm:flex sm:flex-wrap"
      }>
        {sq.options.map((opt: string) => {
          const isSelected = isMultiple
            ? (answers[sq.id] || '').split(multiSep as string).map(s => s.trim()).includes(opt.trim())
            : (answers[sq.id] || '') === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => {
                if (isMultiple) {
                  const separator = multiSep as string;
                  const current = (answers[sq.id] || '').split(separator).map(s => s.trim()).filter(Boolean);
                  const nextUnordered = isSelected
                    ? current.filter(a => a !== opt)
                    : [...current, opt];
                  const ordered = sq.options.filter((o: string) => nextUnordered.includes(o));
                  handleOptionSelect(sq.id, ordered.join(separator));
                } else {
                  handleOptionSelect(sq.id, isSelected ? '' : opt);
                }
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-[16px] md:text-sm transition-all duration-200 border-2 flex items-center ${isLongOptionList ? 'justify-start text-left w-full' : 'justify-center text-center w-full sm:w-auto sm:flex-none'} min-w-[3rem] shadow-sm cursor-pointer
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
  };

  /** activeOrder 内で from→to へ要素を移動し、回答を更新する共通関数。 */
  const reorderSort = (sqId: string, activeOrder: string[], from: number, to: number) => {
    if (from === to || to < 0 || to >= activeOrder.length) return;
    const nextOrder = [...activeOrder];
    const moved = nextOrder.splice(from, 1)[0];
    nextOrder.splice(to, 0, moved);
    handleOptionSelect(sqId, nextOrder.join(' > '));
  };

  /** activeOrder 内で index a と b を入れ替えて回答を更新する（タップ入れ替え用）。 */
  const swapSort = (sqId: string, activeOrder: string[], a: number, b: number) => {
    if (a === b) return;
    const nextOrder = [...activeOrder];
    [nextOrder[a], nextOrder[b]] = [nextOrder[b], nextOrder[a]];
    handleOptionSelect(sqId, nextOrder.join(' > '));
  };

  /**
   * 並べ替え（sorting）UIを描画する。
   * - PC（isDesktop）: HTML5 ドラッグ＆ドロップで並べ替え。
   * - スマホ（タッチ端末）: HTML5 DnD はタッチで発火しないため使えない。
   *   代わりに「タップで選択→別要素タップで入れ替え」＋各要素の ◀▶ 移動ボタンで
   *   確実に並べ替えできるタッチ対応UIを提供する（要件：スマホでドラッグが使えない不具合）。
   */
  const renderSortingControl = (sq: any) => {
    const activeOrder = answers[sq.id] ? answers[sq.id].split(' > ') : [...(sq.items || [])];

    // ── スマホ（タッチ）: タップ入れ替え ＋ ◀▶ 移動ボタン ──
    if (!isDesktop) {
      const selIdx = tapSortSelect && tapSortSelect.sqId === sq.id ? tapSortSelect.index : null;
      return (
        <div className="flex-grow flex flex-col gap-3 w-full">
          <div className="text-xs text-gray-400 font-bold flex items-center justify-between">
            <span>タップで並べ替え :</span>
            <span className="text-[10px] text-[#A9CCE3] font-normal">左から順に並べる</span>
          </div>
          <div className="flex flex-col gap-2 p-3 bg-gray-50/80 border border-gray-200 rounded-2xl">
            {activeOrder.map((item: string, idx: number) => {
              const isSelected = selIdx === idx;
              return (
                <div
                  key={`${item}-${idx}`}
                  className={`flex items-center gap-2 px-3 py-2.5 bg-white border rounded-xl shadow-xs transition-all duration-200 select-none
                    ${isSelected ? 'border-[#A9CCE3] bg-[#A9CCE3]/10 ring-2 ring-[#A9CCE3]/30' : 'border-gray-200'}
                  `}
                >
                  {/* 番号 */}
                  <span className="text-[11px] bg-stone-100 text-stone-500 rounded px-1.5 py-0.5 text-center select-none font-mono font-semibold shrink-0 w-6">{idx + 1}</span>
                  {/* 本体：タップで選択／入れ替え */}
                  <button
                    type="button"
                    onClick={() => {
                      if (selIdx === null) {
                        // 1つ目：選択
                        setTapSortSelect({ sqId: sq.id, index: idx });
                      } else if (selIdx === idx) {
                        // 同じ要素を再タップ：選択解除
                        setTapSortSelect(null);
                      } else {
                        // 2つ目：選択中の要素と入れ替え
                        swapSort(sq.id, activeOrder, selIdx, idx);
                        setTapSortSelect(null);
                      }
                    }}
                    className="flex-1 flex items-center gap-2 text-left min-w-0 cursor-pointer"
                  >
                    <GripVertical size={14} className={`shrink-0 ${isSelected ? 'text-[#A9CCE3]' : 'text-gray-400'}`} />
                    <span className="font-bold text-gray-800 text-[15px] break-words">{formatText(item)}</span>
                  </button>
                  {/* ◀▶ 移動ボタン（確実な操作手段） */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      aria-label="1つ上へ移動"
                      disabled={idx === 0}
                      onClick={() => { reorderSort(sq.id, activeOrder, idx, idx - 1); setTapSortSelect(null); }}
                      className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
                        idx === 0 ? 'border-gray-150 text-gray-300 bg-gray-50' : 'border-[#A9CCE3] text-[#2C3E50] bg-white active:bg-[#A9CCE3]/20'
                      }`}
                    >
                      <ChevronLeft size={16} className="stroke-[2.5] -rotate-90" />
                    </button>
                    <button
                      type="button"
                      aria-label="1つ下へ移動"
                      disabled={idx === activeOrder.length - 1}
                      onClick={() => { reorderSort(sq.id, activeOrder, idx, idx + 1); setTapSortSelect(null); }}
                      className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
                        idx === activeOrder.length - 1 ? 'border-gray-150 text-gray-300 bg-gray-50' : 'border-[#A9CCE3] text-[#2C3E50] bg-white active:bg-[#A9CCE3]/20'
                      }`}
                    >
                      <ChevronRight size={16} className="stroke-[2.5] rotate-90" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-3 pt-0.5">
            <span className="text-xs text-gray-400 leading-normal">
              ※ 要素をタップで選び、もう一方をタップすると入れ替わります。▲▼でも移動できます。
            </span>
            {(answers[sq.id] || '') !== '' && (
              <button
                type="button"
                onClick={() => { handleOptionSelect(sq.id, ''); setTapSortSelect(null); }}
                className="text-xs text-red-400 active:text-red-500 transition-colors font-medium py-1 px-2.5 active:bg-red-50 rounded-lg cursor-pointer shrink-0"
              >
                やり直す (初期設定に戻す)
              </button>
            )}
          </div>
        </div>
      );
    }

    // ── PC: HTML5 ドラッグ＆ドロップ ──
    return (
      <div className="flex-grow flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2.5">
          <div className="text-xs text-gray-400 font-bold flex items-center justify-between">
            <span>ドラッグで順序を並べ替え :</span>
            <span className="text-[10px] text-[#A9CCE3] font-normal">左から順に並べる</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 p-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl min-h-[72px]">
            {activeOrder.map((item: string, idx: number) => {
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
            })}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 pt-0.5">
          <span className="text-xs text-gray-400 leading-normal">
            ※ 要素をドラッグして、正しい順序に並び替えてください。
          </span>
          {(answers[sq.id] || '') !== '' && (
            <button
              type="button"
              onClick={() => handleOptionSelect(sq.id, '')}
              className="text-xs text-red-400 hover:text-red-500 transition-colors font-medium hover:underline py-1 px-2.5 hover:bg-red-50 rounded-lg cursor-pointer shrink-0"
            >
              やり直す (初期設定に戻す)
            </button>
          )}
        </div>
      </div>
    );
  };

  /** 選択式の現在の選択内容を「表示専用チップ」用の文字列にする。 */
  const describeChoiceAnswer = (sq: any): string => {
    return answers[sq.id] || '';
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

  // visualViewport の resize ハンドラ（マウント時登録・依存なし）から
  // 最新の currentQuestion を参照するための ref。
  const currentQuestionRef = useRef<any>(currentQuestion);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

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

  // ────────────────────────────────────────────────────────────────
  // 要件1（解答入力方式）／要件4（化学記号パレットの出し分け）用の派生値
  // ────────────────────────────────────────────────────────────────

  // この問題に含まれる「短答穴埋め（short_answer）」の設問リスト。
  // フローティング入力バーの 前へ/次へ ナビゲーションで使う。
  const shortAnswerSubs = useMemo(() => {
    if (!currentQuestion) return [] as any[];
    return (currentQuestion.subQuestions || []).filter((sq: any) => isShortAnswerType(sq));
  }, [currentQuestion]);

  // インライン穴埋め（問題文中に入力欄を埋め込む）モードを使うか。
  // データ側で inlineBlanks が明示され、かつ短答穴埋めが存在する場合のみ有効。
  const useInlineBlanks = useMemo(() => {
    if (!currentQuestion) return false;
    if (!(currentQuestion as any).inlineBlanks) return false;
    return shortAnswerSubs.length > 0;
  }, [currentQuestion, shortAnswerSubs]);

  // この問題に化学記号パレットが必要か（要件4）。
  // いずれかの設問、または問題文自体が化学式・イオン・元素記号を要するなら true。
  const questionNeedsChemPalette = useMemo(() => {
    if (!currentQuestion) return false;
    const subs = currentQuestion.subQuestions || [];
    return (
      subs.some((sq: any) => requiresChemicalSymbols(sq, sq.correctAnswer)) ||
      requiresChemicalSymbols(currentQuestion as any)
    );
  }, [currentQuestion]);

  // 現在フォーカス中の穴埋め設問に対応する、問題文中のハイライト候補文字列。
  const focusHighlightVariants = useMemo(() => {
    if (!focusedSubId || !currentQuestion) return [] as string[];
    const sub = (currentQuestion.subQuestions || []).find((sq: any) => sq.id === focusedSubId);
    if (!sub) return [] as string[];
    const token = extractBlankToken(sub.label || '');
    if (!token) return [] as string[];
    return blankHighlightVariants(token);
  }, [focusedSubId, currentQuestion]);

  // ユーザー選択のハイライトと、フォーカス穴埋めのハイライトを結合。
  const combinedHighlights = useMemo(
    () => Array.from(new Set([...highlights, ...focusHighlightVariants])),
    [highlights, focusHighlightVariants]
  );

  // 固定表示（フローティング解答パネル）の対象となる全設問。
  // 要件1：問題形式によらず解答欄を画面下部に固定表示し、前へ/次へで遷移する。
  // そのため短答穴埋め・記述/計算だけでなく、選択式（multiple_choice）・
  // 並べ替え（sorting）も含めて「解答可能な全設問」を対象とする。
  const inputNavSubs = useMemo(() => {
    if (!currentQuestion) return [] as any[];
    return (currentQuestion.subQuestions || []).slice();
  }, [currentQuestion]);

  // 現在フォーカス中の設問オブジェクト（全形式対象）。
  const focusedSub = useMemo(() => {
    if (!focusedSubId) return null;
    return inputNavSubs.find((sq: any) => sq.id === focusedSubId) || null;
  }, [focusedSubId, inputNavSubs]);

  // inputNavSubs 内での現在フォーカスのインデックス（前へ/次へ判定用）。
  const focusedIndex = useMemo(() => {
    if (!focusedSubId) return -1;
    return inputNavSubs.findIndex((sq: any) => sq.id === focusedSubId);
  }, [focusedSubId, inputNavSubs]);

  /**
   * フローティング入力バーの 前へ/次へ で、フォーカスする設問を移動する。
   * dir=-1 で前、dir=1 で次。移動後は該当入力欄へ実フォーカスも移す。
   * 対象は入力欄を持つ全設問（短答穴埋め・記述/計算）。
   */
  const moveFocus = (dir: -1 | 1) => {
    if (inputNavSubs.length === 0) return;
    let idx = focusedIndex;
    if (idx < 0) idx = 0;
    else idx = Math.min(inputNavSubs.length - 1, Math.max(0, idx + dir));
    const target = inputNavSubs[idx];
    if (!target) return;
    if (target.id === focusedSubId) return;
    // iOS でソフトキーボードを閉じさせないために、ここでは blur せず
    // 「次にフォーカスすべき設問」を記録して state を更新するだけにする。
    // 実際の .focus() は再レンダー直後の useLayoutEffect（描画前・同期）で行う。
    // これにより「次へ」押下時にフォーカス（入力状態）が一瞬解除される不具合を防ぐ。
    pendingFocusIdRef.current = target.id;
    setFocusedSubId(target.id);
  };

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

  // C6: キーボードで問題を送り/戻しできるようにする（→ / ←）。
  // 入力欄（input/textarea/contenteditable）にフォーカス中や修飾キー併用時は
  // テキスト編集・ショートカットを妨げないよう無効化する。
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      const tag = el?.tagName?.toLowerCase();
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        (el?.isContentEditable ?? false);
      if (isEditable) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // handleNext/handlePrevious は毎レンダー再生成されるため依存に含める。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showingExplanation, currentQuestionIndex, answers]);

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
          isMobileView={isMobileForExplanation}
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
            title="単元選択に戻る"
            aria-label="単元選択に戻る"
            className="flex items-center justify-center p-1.5 md:p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
          >
            <ArrowLeft size={18} className="md:w-5 md:h-5" aria-hidden="true" />
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
              {formatText(cleanQuestionText(currentQuestion.text), combinedHighlights)}
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
              {/* 問題解答画面（回答入力中）にはロジックツリーを表示しない。
                  ロジックツリーは「単元選択・学習フローチャート」画面と
                  「解答解説ページ」にのみ表示する。 */}
            </div>
          </div>
        </div>

        {/* Section 2: Answers Area
            スマホ（!isDesktop）では、下部の「前へ / 解答と解説を見る」ナビゲーションを
            画面下に固定バーとして常時表示する（要件1）。そのぶん、解答欄の内容が
            固定バーに隠れないよう下部余白を大きめに確保する。
            ページ全体は fixed inset-0 + overflow-hidden で固定され、スワイプ/ページ
            スクロールでの問題送りは発生しない。問題送りは固定バーの前へ/次へのみ。 */}
        <div className={`lg:w-[42%] flex-1 min-h-0 overflow-y-auto bg-gray-50/50 p-4 md:p-8 ${isDesktop ? 'pb-8' : 'pb-[calc(6rem+env(safe-area-inset-bottom))]'} relative ${!isDesktop && isProblemExpanded ? 'hidden' : 'block z-10'}`}>
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
                      {g.items.map((sq: any) => {
                        const isFocusedBlank = focusedSubId === sq.id;
                        return (
                        <div
                          key={sq.id}
                          className={`flex flex-col gap-1.5 min-w-[50px] p-2 border rounded-xl shadow-2xs transition-colors ${
                            isFocusedBlank
                              ? 'bg-[#A9CCE3]/20 border-[#A9CCE3] ring-2 ring-[#A9CCE3]/40'
                              : 'bg-stone-50/80 border-stone-200/60'
                          }`}
                        >
                          <span className="font-bold text-stone-500 text-xs text-center border-b border-stone-200/60 pb-1 select-none font-sans">
                            {sq.label}
                          </span>
                          {isDesktop ? (
                            <input
                              type="text"
                              value={answers[sq.id] || ''}
                              onChange={(e) => handleTextChange(sq.id, e.target.value)}
                              onFocus={(e) => { setFocusedSubId(sq.id); handleInputFocusScroll(e); }}
                              placeholder="..."
                              className="w-full py-1 text-center text-sm font-bold text-stone-800 border-none outline-none focus:ring-0 leading-none bg-transparent"
                            />
                          ) : (
                            // スマホ：表示専用チップ。タップで当該空欄を選択し、
                            // 下部フローティングバーで入力する（要件1：二重入力の解消）。
                            <button
                              type="button"
                              id={`ans-card-${sq.id}`}
                              onClick={() => setFocusedSubId(sq.id)}
                              aria-label={`${sq.label} の解答を入力`}
                              className="w-full min-h-[1.75rem] py-1 text-center text-sm font-bold text-stone-800 leading-none bg-transparent cursor-text"
                            >
                              {answers[sq.id]
                                ? <span className="break-all">{answers[sq.id]}</span>
                                : <span className="text-stone-300">タップ</span>}
                            </button>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const sq = g.items[0];
              // 要件1：全形式でカードをタップ→固定パネル表示に統一するため、
              // フォーカス中カードのハイライトも全形式で有効にする。
              const isFocusedCard = !isDesktop && focusedSubId === sq.id;
              return (
                <div key={sq.id} className={`flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-sm border transition-all duration-250 ${
                  isFocusedCard ? 'border-[#A9CCE3] ring-2 ring-[#A9CCE3]/30' : 'border-gray-200 hover:border-[#A9CCE3]/50'
                }`}>
                  <div className="flex flex-col gap-3.5 w-full">
                    <span className="font-bold text-[#2C3E50] text-sm text-left bg-blue-50/45 border border-[#A9CCE3]/25 py-2 px-4 rounded-xl leading-relaxed shadow-xs w-full block">
                      {sq.label}
                    </span>
                    
                    {sq.type === 'multiple_choice' ? (
                      isDesktop ? (
                        // PC版：選択肢ボタンをインライン表示。
                        renderMultipleChoiceControl(sq)
                      ) : (
                        // スマホ版：表示専用チップ。タップで下部固定パネルに選択UIを表示（要件1）。
                        <button
                          type="button"
                          id={`ans-card-${sq.id}`}
                          onClick={() => setFocusedSubId(sq.id)}
                          aria-label={`${sq.label} の解答を選択`}
                          className={`relative w-full text-left px-4 py-2.5 min-h-[2.75rem] text-[16px] rounded-xl border shadow-sm transition-all font-modern leading-relaxed break-words cursor-pointer ${
                            focusedSubId === sq.id
                              ? 'border-[#A9CCE3] ring-2 ring-[#A9CCE3]/40 bg-white'
                              : 'border-gray-300 bg-gray-50'
                          }`}
                        >
                          {describeChoiceAnswer(sq)
                            ? <span className="text-gray-800 font-bold">{formatText(describeChoiceAnswer(sq))}</span>
                            : <span className="text-gray-400">タップして選択...</span>}
                        </button>
                      )
                    ) : sq.type === 'sorting' ? (
                      isDesktop ? (
                        // PC版：ドラッグ並べ替えUIをインライン表示。
                        renderSortingControl(sq)
                      ) : (
                        // スマホ版：表示専用チップ。タップで下部固定パネルに並べ替えUIを表示（要件1）。
                        <button
                          type="button"
                          id={`ans-card-${sq.id}`}
                          onClick={() => setFocusedSubId(sq.id)}
                          aria-label={`${sq.label} の順序を並べ替え`}
                          className={`relative w-full text-left px-4 py-2.5 min-h-[2.75rem] text-[16px] rounded-xl border shadow-sm transition-all font-modern leading-relaxed break-words cursor-pointer ${
                            focusedSubId === sq.id
                              ? 'border-[#A9CCE3] ring-2 ring-[#A9CCE3]/40 bg-white'
                              : 'border-gray-300 bg-gray-50'
                          }`}
                        >
                          {(answers[sq.id] || '')
                            ? <span className="text-gray-800 font-bold">{(answers[sq.id] || '').split(' > ').join(' → ')}</span>
                            : <span className="text-gray-400">タップして並べ替え...</span>}
                        </button>
                      )
                    ) : sq.type === 'descriptive' ? (
                      <div className="flex-grow flex flex-col gap-2 w-full">
                        {isDesktop ? (
                          <>
                            <div className="relative w-full">
                              <Edit3 className="absolute left-3 top-3 text-gray-400" size={16} />
                              <textarea
                                ref={(el) => { inputRefs.current[sq.id] = el; }}
                                value={answers[sq.id] || ''}
                                onChange={(e) => handleTextChange(sq.id, e.target.value)}
                                onFocus={(e) => { setFocusedSubId(sq.id); handleInputFocusScroll(e); }}
                                placeholder="解答を入力...（改行可）"
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
                          </>
                        ) : (
                          // スマホ：表示専用。タップで下部フローティングバーに入力を集約。
                          <button
                            type="button"
                            id={`ans-card-${sq.id}`}
                            onClick={() => setFocusedSubId(sq.id)}
                            aria-label={`${sq.label} の解答を入力`}
                            className={`relative w-full text-left pl-9 pr-4 py-2.5 min-h-[3.5rem] text-[16px] rounded-xl border transition-all font-modern leading-relaxed whitespace-pre-wrap break-words cursor-text ${
                              focusedSubId === sq.id
                                ? 'border-[#A9CCE3] ring-2 ring-[#A9CCE3]/40 bg-white'
                                : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <Edit3 className="absolute left-3 top-3 text-gray-400" size={16} />
                            {answers[sq.id]
                              ? <span className="text-gray-800">{answers[sq.id]}</span>
                              : <span className="text-gray-400">解答を入力...</span>}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex-grow flex flex-col gap-2 w-full">
                        {isDesktop ? (
                          <>
                            <div className="relative w-full">
                              <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                ref={(el) => { inputRefs.current[sq.id] = el; }}
                                type="text"
                                value={answers[sq.id] || ''}
                                onChange={(e) => handleTextChange(sq.id, e.target.value)}
                                onFocus={(e) => { setFocusedSubId(sq.id); handleInputFocusScroll(e); }}
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
                          </>
                        ) : (
                          // スマホ：表示専用。タップで下部フローティングバーに入力を集約。
                          <button
                            type="button"
                            id={`ans-card-${sq.id}`}
                            onClick={() => setFocusedSubId(sq.id)}
                            aria-label={`${sq.label} の解答を入力`}
                            className={`relative w-full text-left pl-9 pr-4 py-2.5 min-h-[2.75rem] text-[16px] rounded-xl border shadow-sm transition-all font-modern leading-relaxed break-words cursor-text ${
                              focusedSubId === sq.id
                                ? 'border-[#A9CCE3] ring-2 ring-[#A9CCE3]/40 bg-white'
                                : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            {answers[sq.id]
                              ? <span className="text-gray-800">{answers[sq.id]}</span>
                              : <span className="text-gray-400">解答を入力...</span>}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Answer submission action button and back button at the bottom of the answers column
                （PC版のみ：解答欄カラムの末尾にインライン表示。
                　スマホ版では下部固定ナビゲーションバーに置き換える＝要件1） */}
            {isDesktop && (
              <div className="pt-6 border-t border-gray-200/60 flex items-center justify-between gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  title="前の問題へ（←キー）"
                  aria-label="前の問題へ"
                  className={`flex items-center justify-center p-2.5 rounded-xl font-bold transition-all duration-200 border-2 shrink-0 cursor-pointer
                    ${currentQuestionIndex === 0 
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/50' 
                      : 'border-[#A9CCE3] text-[#A9CCE3] hover:bg-[#A9CCE3] hover:text-white bg-white shadow-sm'}`}
                >
                  <ChevronLeft size={16} className="stroke-[2.5]" aria-hidden="true" />
                </button>

                <button
                  onClick={handleNext}
                  className="flex shadow-md hover:shadow-lg hover:-translate-y-0.5 items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold tracking-wider transition-all duration-300 text-xs md:text-sm bg-[#2C3E50] text-white hover:bg-[#1B2631] flex-1 sm:flex-none sm:w-[180px] cursor-pointer"
                >
                  <span>解答と解説を見る</span>
                  <ChevronRight size={14} className="stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*
        スマホ版・下部固定ナビゲーションバー（要件1）
        ─────────────────────────────────────────────
        「前へ」「解答と解説を見る（次へ）」ボタンを画面下部に固定表示する。
        - 解答欄の内容量に関わらず常に同じ位置に表示され、位置ズレしない。
        - 問題の移動はこのボタンのみで行う（スワイプ／ページスクロールでの
          問題送りは実装しない。ページ自体は fixed + overflow-hidden で固定）。
        - 問題文の全画面表示中（isProblemExpanded）は非表示。
        - ソフトキーボード表示中（keyboardVisible）は、穴埋め移動用の
          フローティング解答バーを優先するため非表示にして重なりを防ぐ。
      */}
      {!isDesktop && !isProblemExpanded && !focusedSub && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.10)] px-3 pt-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom))]"
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              title="前の問題へ"
              aria-label="前の問題へ"
              className={`flex items-center justify-center p-3 rounded-xl font-bold transition-all duration-200 border-2 shrink-0 cursor-pointer
                ${currentQuestionIndex === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/50'
                  : 'border-[#A9CCE3] text-[#A9CCE3] active:bg-[#A9CCE3] active:text-white bg-white shadow-sm'}`}
            >
              <ChevronLeft size={18} className="stroke-[2.5]" aria-hidden="true" />
              <span className="ml-1 text-xs">前へ</span>
            </button>

            <button
              onClick={handleNext}
              className="flex shadow-md active:translate-y-0.5 items-center justify-center gap-1.5 px-5 py-3 rounded-xl font-bold tracking-wider transition-all duration-200 text-sm bg-[#2C3E50] text-white active:bg-[#1B2631] flex-1 cursor-pointer"
            >
              <span>解答と解説を見る</span>
              <ChevronRight size={16} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/*
        フローティング解答バー（要件1・スマホのみ）
        ─────────────────────────────────────────────
        ソフトキーボード表示中に、フォーカス中の設問の入力欄を画面下部に
        浮かせて表示する。1問ずつ集中して回答でき、前へ/次へで穴埋めを移動できる。
        - 短答穴埋め（short_answer）: 1行の入力欄
        - 記述/計算（descriptive）: 複数行の textarea（改行可・数式UIなし）
        - 化学記号パレットは questionNeedsChemPalette かつ当該設問が
          記号入力を要する場合のみ表示（要件4）。
      */}
      {!isDesktop && focusedSub && (
        <div
          className="fixed left-0 right-0 z-[60] bg-white border-t-2 border-[#A9CCE3]/60 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] px-3 pt-2.5 transition-[bottom] duration-150"
          style={{
            bottom: keyboardOffset,
            // キーボード非表示時（オフセット0）はセーフエリア分の余白を確保
            paddingBottom: keyboardOffset > 0 ? '0.5rem' : 'calc(0.5rem + env(safe-area-inset-bottom))',
          }}
        >
          <div className="max-w-2xl mx-auto flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-[#2C3E50] text-xs bg-blue-50/60 border border-[#A9CCE3]/40 px-2.5 py-1 rounded-lg truncate">
                {focusedSub.label}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {inputNavSubs.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => moveFocus(-1)}
                      disabled={focusedIndex <= 0}
                      className={`flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        focusedIndex <= 0
                          ? 'border-gray-200 text-gray-300 bg-gray-50'
                          : 'border-[#A9CCE3] text-[#2C3E50] bg-white active:bg-[#A9CCE3]/20'
                      }`}
                    >
                      <ChevronLeft size={14} className="stroke-[2.5]" />
                      前へ
                    </button>
                    <span className="text-[11px] text-gray-400 font-bold tabular-nums">
                      {focusedIndex + 1}/{inputNavSubs.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => moveFocus(1)}
                      disabled={focusedIndex >= inputNavSubs.length - 1}
                      className={`flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        focusedIndex >= inputNavSubs.length - 1
                          ? 'border-gray-200 text-gray-300 bg-gray-50'
                          : 'border-[#A9CCE3] text-[#2C3E50] bg-white active:bg-[#A9CCE3]/20'
                      }`}
                    >
                      次へ
                      <ChevronRight size={14} className="stroke-[2.5]" />
                    </button>
                  </>
                )}
                {/* 完了：固定パネルを閉じ、下部ナビ（前へ/解答と解説）へ戻す */}
                <button
                  type="button"
                  onClick={() => {
                    barInputRef.current?.blur();
                    setFocusedSubId(null);
                  }}
                  className="flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border border-[#2C3E50] bg-[#2C3E50] text-white active:bg-[#1B2631]"
                >
                  完了
                </button>
              </div>
            </div>

            {/*
              固定パネル内の解答UI（要件1：問題形式によらず固定表示）
              ─────────────────────────────────────────────
              フォーカス中の設問タイプに応じて、下記のいずれかを表示する。
                - 選択式（multiple_choice）: 選択肢ボタン群
                - 並べ替え（sorting）      : ドラッグ並べ替えUI
                - それ以外（短答/記述/計算）: 統一 textarea（キーボード入力）
              テキスト入力は「常に同じ textarea 1つ」に統一する。要素種別を
              input/textarea で切り替えると設問移動のたびに DOM が差し替わり、
              iOS でソフトキーボードが閉じてしまうため、textarea 1本に固定して
              rows と改行可否のみ切り替える（課題2）。font-size は 16px を明示し、
              タップ時の自動ズームも防止する（課題1）。
            */}
            {focusedSub.type === 'multiple_choice' ? (
              <div className="max-h-[42vh] overflow-y-auto py-1">
                {renderMultipleChoiceControl(focusedSub)}
              </div>
            ) : focusedSub.type === 'sorting' ? (
              <div className="max-h-[42vh] overflow-y-auto py-1">
                {renderSortingControl(focusedSub)}
              </div>
            ) : (
              <>
                <textarea
                  key="floating-answer-input"
                  ref={(el) => { barInputRef.current = el; if (focusedSub) inputRefs.current[focusedSub.id] = el; }}
                  value={answers[focusedSub.id] || ''}
                  onChange={(e) => handleTextChange(focusedSub.id, e.target.value)}
                  placeholder={focusedSub.type === 'descriptive' ? '解答を入力...（改行可）' : '解答を入力...'}
                  rows={focusedSub.type === 'descriptive' ? 2 : 1}
                  enterKeyHint={focusedIndex >= inputNavSubs.length - 1 ? 'done' : 'next'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // 記述/計算は改行を許可（Shift+Enter でなくても改行）。ただし
                      // 最後の設問での Enter は「完了」として扱いキーボードを閉じる。
                      if (focusedSub.type === 'descriptive') {
                        if (focusedIndex >= inputNavSubs.length - 1) {
                          e.preventDefault();
                          barInputRef.current?.blur();
                          setFocusedSubId(null);
                        }
                        return; // それ以外は通常の改行を許可
                      }
                      // 短答：Enter=次の空欄へ（改行はしない）。最後なら完了。
                      e.preventDefault();
                      if (focusedIndex < inputNavSubs.length - 1) moveFocus(1);
                      else {
                        barInputRef.current?.blur();
                        setFocusedSubId(null);
                      }
                    }
                  }}
                  className={`w-full px-3 text-[16px] rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none resize-none font-modern bg-gray-50 focus:bg-white leading-relaxed ${
                    focusedSub.type === 'descriptive' ? 'py-2' : 'py-2.5'
                  }`}
                />

                {/* 化学記号パレット（要件4：必要な問題のみ表示） */}
                {questionNeedsChemPalette && requiresChemicalSymbols(focusedSub, focusedSub.correctAnswer) && (
                  <div className="max-h-[28vh] overflow-y-auto">
                    <ChemistryPalette
                      value={answers[focusedSub.id] || ''}
                      onChange={(next) => handleTextChange(focusedSub.id, next)}
                      inputRef={{
                        get current() { return barInputRef.current; },
                        set current(el) { barInputRef.current = el; },
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

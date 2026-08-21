import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Edit3, ArrowLeft, GripVertical, Trophy } from 'lucide-react';
import { formatText } from '../utils/textFormatter';
import { ExplanationBody } from './ExplanationBody';
import { Explanation } from './Explanation';
import { IonizationEnergyChart } from './IonizationEnergyChart';
import { QuestionFigure } from './QuestionFigure';
import { ListeningAudioPlayer } from './ListeningAudioPlayer';
import { buildFigureNumberMap, getFigureNumber } from '../utils/figureNumbering';
import { QuizTimerBar } from './QuizTimerBar';
import { FloatingScoreAnimation } from './FloatingScoreAnimation';
import { LiveStandingPill, OvertakeBanner } from './LiveStandingPill';
import { useLiveStanding } from '../hooks/useLiveStanding';
import {
  calcQuestionTimeLimit,
  scoreProblem,
  calcMaxCombo,
  comboMultiplier,
  type ScoreBreakdown,
} from '../utils/scoring';
import { submitChapterScore } from '../utils/leaderboard';
import { captureWrongAnswers, type WrongAnswerInput } from '../utils/reviewList';
import {
  isPlainRecord,
  markProblemSolved,
  parseStoredNonNegativeInteger,
  parseStoredStringArrayRecord,
  parseStoredStringRecord,
} from '../utils/progress';
import { schedulePush } from '../utils/studySync';
import { isAnswerCorrect, isDescriptive } from '../utils/answerJudge';
import { answerCardMarker, buildSubQuestionList, splitQuestionLabel } from '../utils/questionDisplay';
import {
  buildListeningOptionTexts,
  buildListeningLeadText,
} from '../utils/listeningOptions';
import {
  buildListeningSteps,
  isPerSubQuestionListening,
  stepLabelOf,
  stepScoreKey,
} from '../utils/listeningSteps';
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
  /**
   * 「この範囲だけを1回の演習として解く」ときの範囲（両端を含む・章内の通し番号）。
   *
   * ■ 何のために足したのか（ご要望）
   *   英語リスニングは、これまで「第1問A」を開くと収録14回分が
   *   ひとつの通し番号（進捗 1/14）でつながっていた。
   *   そのため「第3回だけ解く」ことができず、必ず頭から通しでしか解けなかった。
   *   「第1問A のページ → 第1回演習〜第14回演習のボタンが並ぶ」形にするため、
   *   選ばれた1回だけを1セットとして扱えるようにする。
   *
   * ■ 章IDを分けなかった理由（とても大事）
   *   回ごとに新しい章IDを作ると、保存キー（quiz_answers_ / quiz_run_ など）や
   *   進捗台帳・ランキングの宛先が変わり、今まで解いてくれた記録が
   *   まるごと迷子になる。だから章IDは今のまま据え置き、
   *   「章の中のどこからどこまでを1回とみなすか」だけをここで受け取る。
   *
   * 省略（undefined）時は従来どおり章の全問を通しで解く。
   */
  questionRange?: { startIndex: number; endIndex: number } | null;
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
  /**
   * 「1問ずつ」解くリスニング用の採点記録。キーは `大問ID::小問ID`。
   *
   * perQuestion と分けている理由：
   *   perQuestion のキーは「大問ID」である前提で、進捗の引き継ぎ
   *   （progress.ts の backfillLegacyProgress）がキーを大問IDとして数える。
   *   小問単位のキーを混ぜると存在しない大問を「解いた」と数えてしまうため、
   *   別のフィールドに置いて既存の集計を汚さないようにしている。
   *   古い保存データには無いフィールドなので任意項目にしている。
   */
  perStep?: Record<string, ScoreBreakdown & { timeLimit: number; timeUsed: number }>;
  totalCorrect: number;
  totalJudgeable: number;
  totalTimeSec: number;
  startedAt: number;
}

function emptyRun(): ChapterRunState {
  return {
    totalScore: 0,
    runningCombo: 0,
    perQuestion: {},
    perStep: {},
    totalCorrect: 0,
    totalJudgeable: 0,
    totalTimeSec: 0,
    startedAt: Date.now(),
  };
}

function nonNegativeFinite(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

function loadRun(chapterId: string, mode: string): ChapterRunState {
  try {
    const raw = localStorage.getItem(chapterRunKey(chapterId, mode));
    if (!raw) return emptyRun();

    const parsed: unknown = JSON.parse(raw);
    if (!isPlainRecord(parsed)) return emptyRun();

    return {
      totalScore: nonNegativeFinite(parsed.totalScore),
      runningCombo: nonNegativeFinite(parsed.runningCombo),
      perQuestion: isPlainRecord(parsed.perQuestion)
        ? parsed.perQuestion as ChapterRunState['perQuestion']
        : {},
      perStep: isPlainRecord(parsed.perStep)
        ? parsed.perStep as NonNullable<ChapterRunState['perStep']>
        : {},
      totalCorrect: nonNegativeFinite(parsed.totalCorrect),
      totalJudgeable: nonNegativeFinite(parsed.totalJudgeable),
      totalTimeSec: nonNegativeFinite(parsed.totalTimeSec),
      startedAt: nonNegativeFinite(parsed.startedAt, Date.now()),
    };
  } catch {
    return emptyRun();
  }
}

function saveRun(chapterId: string, mode: string, run: ChapterRunState) {
  try {
    localStorage.setItem(chapterRunKey(chapterId, mode), JSON.stringify(run));
  } catch {
    /* noop */
  }
}

/**
 * 解答文字列そのものが化学記号パレットの記号を必要とするか判定する。
 *
 * パレットは「入力補助」なので、判断材料は
 * **その設問の解答として実際に打ち込む文字列**に限るのが正しい。
 * 問題文や解説に「イオン」「酸化」などの語が含まれるだけでパレットを出すと、
 * 語句を答えるだけの設問にも大量に表示されてしまう（旧実装の問題点）。
 */
function answerNeedsPalette(ansRaw: string): boolean {
  const ans = String(ansRaw);

  // 1. 上付き・下付き Unicode を含む（H₂O, Cu²⁺, 10⁻³ など）。
  //    ¹²³ は U+00B9/B2/B3 で U+2070-2079 の範囲外なので個別に列挙する。
  if (/[₀-₉⁰-⁹⁺⁻¹²³]/.test(ans)) return true;
  // 2. 反応式の記号（→ ⇌ ⇄ ↔）。
  //    ただし「1族→1」のような日本語の説明文中の矢印は反応式ではないので、
  //    元素記号になり得るラテン文字を含む場合に限る。
  if (/[→⇌⇄↔]/.test(ans) && /[A-Za-z]/.test(ans)) return true;
  // 3. TeX 風の上付き・下付き（e^-, ^2+, _8 など）
  if (/\^\{?[0-9]*[+\-−]/.test(ans) || /_\{?[0-9]/.test(ans)) return true;
  // 4. 元素記号＋数字／電荷（H2O, CaCO3, SO42- など）。
  //    ただし単位付きの数値（25 mL, 0.10 mol/L）は除外する。
  if (/(?:[A-Z][a-z]?\d*){1,}[\d+\-]/.test(ans) && /[A-Z]/.test(ans)) {
    const unitOnly =
      /^[\d.,\s×^\-+()/]*(?:mol|L|mL|g|kg|mg|cm|m|kJ|J|K|Pa|kPa|atm|%|℃|mol\/L|g\/mol|個)?[\d.,\s×^\-+()/]*$/i;
    if (!unitOnly.test(ans)) return true;
  }
  // 5. イオン式の平文表記（Na+, Cl-, OH-, NH4+ など）
  if (/[A-Z][A-Za-z]{0,3}\d*\s*[+\-]\s*$/.test(ans.trim())) return true;

  return false;
}

/**
 * 設問が下付き・上付き文字パレットの表示を必要とするかどうかを判定する。
 *
 * 判定方針（要件4）：
 *  - データ側で `requiresChemicalPalette` が明示された設問は常に表示（opt-in）。
 *  - 選択式（multiple_choice / true_false / select / sorting）はタップで選ぶだけなので不要。
 *  - それ以外は correctAnswer / acceptedAnswers のいずれかが
 *    化学式・イオン式・反応式・上下付き文字を含む場合のみ表示する。
 */
function requiresChemicalSymbols(question: any): boolean {
  if (question?.requiresChemicalPalette) return true;
  // 数学パレットを明示した問題は、化学パレットの推定ヒューリスティックに
  // 誤検知されないよう先に除外する（両方のパレットが並ぶのを防ぐ）。
  if (question?.requiresMathPalette) return false;

  const type = String(question?.type || '');
  if (
    type === 'multiple_choice' ||
    type === 'true_false' ||
    type === 'select' ||
    type === 'sorting'
  ) {
    return false;
  }

  const answers: string[] = [
    question?.correctAnswer,
    ...(Array.isArray(question?.acceptedAnswers) ? question.acceptedAnswers : []),
  ].filter((a: any): a is string => typeof a === 'string' && a.trim() !== '');

  if (answers.length === 0) return false;
  return answers.some((a) => answerNeedsPalette(a));
}

/**
 * この設問に「数学記号パレット」を出すか。
 *
 * 化学パレットと違い、数学は答えの文字列だけから確実に判定できないため
 * データ側の明示 opt-in（requiresMathPalette）を必須とする。
 * 数III積分の問題データ（mathIntegralProblems.ts）は全設問でこのフラグを立てている。
 */
function requiresMathSymbols(question: any): boolean {
  if (!question?.requiresMathPalette) return false;
  const type = String(question?.type || '');
  if (
    type === 'multiple_choice' ||
    type === 'true_false' ||
    type === 'select' ||
    type === 'sorting'
  ) {
    return false;
  }
  return true;
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

// 数学記号パレット（カテゴリ別）。
// 数III積分などで、∫・√・π・分数・累乗 などをキーボードなしでワンタップ入力する。
// 挿入する value は answerJudge の正規化と textFormatter の表示規約
// （^ で累乗、/ で分数、log|…| など）に合わせた「打ち込み表記」で統一する。
const mathPaletteGroups: PaletteGroup[] = [
  {
    group: '積分の記号',
    items: [
      { label: '∫', value: '∫', desc: '積分記号（インテグラル）' },
      { label: 'dx', value: ' dx', desc: '積分変数 dx' },
      { label: 'dt', value: ' dt', desc: '積分変数 dt' },
      { label: 'dθ', value: ' dθ', desc: '積分変数 dθ' },
      { label: '+ C', value: ' + C', desc: '積分定数 C（不定積分の最後に付ける）' },
    ],
  },
  {
    group: '累乗・分数・かっこ',
    items: [
      { label: '^', value: '^', desc: '累乗（例: x^3 は x の3乗）' },
      { label: '/', value: '/', desc: '分数の横棒（例: 1/3）' },
      { label: '√(', value: '√(', desc: 'ルート（例: √(x+2)）' },
      { label: '(', value: '(', desc: '開きかっこ' },
      { label: ')', value: ')', desc: '閉じかっこ' },
      { label: '| |', value: '||', desc: '絶対値（例: log|x|）' },
    ],
  },
  {
    group: '定数・文字',
    items: [
      { label: 'π', value: 'π', desc: '円周率 π' },
      { label: 'e', value: 'e', desc: '自然対数の底 e' },
      { label: 'θ', value: 'θ', desc: '角度 θ（シータ）' },
      { label: 'x', value: 'x', desc: '変数 x' },
      { label: 't', value: 't', desc: '変数 t' },
      { label: 'n', value: 'n', desc: '自然数 n' },
      { label: 'C', value: 'C', desc: '積分定数 C' },
    ],
  },
  {
    group: '関数',
    items: [
      { label: 'sin', value: 'sin ', desc: '正弦 sin' },
      { label: 'cos', value: 'cos ', desc: '余弦 cos' },
      { label: 'tan', value: 'tan ', desc: '正接 tan' },
      { label: 'log', value: 'log', desc: '対数 log（数IIIでは自然対数）' },
      { label: 'e^', value: 'e^', desc: '指数関数 e の累乗（例: e^x）' },
      { label: 'lim', value: 'lim', desc: '極限 lim' },
      { label: 'Σ', value: 'Σ', desc: '総和 Σ（シグマ）' },
    ],
  },
  {
    group: '演算・その他',
    items: [
      { label: '+', value: ' + ', desc: '足し算' },
      { label: '−', value: ' - ', desc: '引き算（半角マイナスで入力される）' },
      { label: '×', value: '×', desc: '掛け算' },
      { label: '=', value: ' = ', desc: '等号' },
      { label: '→', value: '→', desc: '区間の矢印（例: 0→1）' },
      { label: '[', value: '[', desc: '区間の開きかっこ' },
      { label: ']', value: ']', desc: '区間の閉じかっこ' },
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
    // フローティング解答バーはキーボードの上に重なって表示されるため、
    // 「可視領域の下端」だけを基準にするとバーの裏に隠れてしまう。
    // 実際のバーの高さを測って遮蔽領域として差し引く。
    // （入力欄拡大でバーが高くなったぶん、この補正がないと選択中の空欄が隠れる）
    const bar = document.getElementById('floating-answer-bar');
    const barHeight = bar ? bar.getBoundingClientRect().height : 0;
    // 入力欄の下端が実効可視下端より下（＝キーボード／バーに隠れている）なら、
    // 余白 24px を確保してスクロールする。
    const margin = 24;
    const overflowBottom = rect.bottom - (visibleBottom - margin - barHeight);
    if (overflowBottom > 0) {
      window.scrollBy({ top: overflowBottom, behavior: 'smooth' });
      return;
    }
    // 入力欄が可視領域の上に隠れている場合（上端側はバーの高さと無関係）
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
function SymbolPalette({
  value,
  onChange,
  inputRef,
  title,
  groups,
}: {
  value: string;
  onChange: (next: string) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  title: string;
  groups: PaletteGroup[];
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
        <span>{title}</span>
        <span className="font-normal text-stone-400">（タップで入力欄のカーソル位置に挿入）</span>
      </div>
      {/* ボタンを 44px 角に拡大したぶん全体が縦に伸びるため、スマホでのスクロール
          領域を 220px → 240px に微増し、1画面に見える行数を保つ。 */}
      <div className="flex flex-col gap-2.5 max-h-[240px] md:max-h-none overflow-y-auto">
        {groups.map((grp) => (
          <div key={grp.group} className="flex flex-col gap-1.5">
            <div className="text-[11px] text-stone-400 font-bold select-none px-0.5">
              {grp.group}
            </div>
            <div className="flex flex-wrap gap-2">
              {grp.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  // マウス/タッチダウンでの入力欄フォーカス喪失を防ぐ（キャレット維持のため）。
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => insert(item.value)}
                  // 記号は連続でタップするため、1つあたり 44px 角以上を確保する
                  // （以前は min-h-[36px] で誤タップしやすかった）。
                  className="min-w-[2.75rem] min-h-[2.75rem] px-3 py-2 bg-white border border-stone-200 hover:border-stone-400 hover:bg-stone-100 rounded-lg text-[15px] font-bold text-stone-700 font-sans shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-1 active:scale-95"
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

/** 化学記号パレット（SymbolPalette の化学版ラッパー）。 */
function ChemistryPalette(props: {
  value: string;
  onChange: (next: string) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}) {
  return <SymbolPalette {...props} title="化学記号パレット" groups={chemistryPaletteGroups} />;
}

/** 数学記号パレット（SymbolPalette の数学版ラッパー）。数III積分などの解答入力に使う。 */
function MathPalette(props: {
  value: string;
  onChange: (next: string) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}) {
  return <SymbolPalette {...props} title="数学記号パレット" groups={mathPaletteGroups} />;
}

export function Quiz({ mode, chapter, onFinish, onBack, isGuest, isMobileView, onExplanationChange, onScored, questionRange }: QuizProps) {
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

  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    parseStoredStringRecord(localStorage.getItem(`quiz_answers_${chapter.id}_${mode}`)),
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const questionCount = mode === 'mini_test'
      ? (chapter.miniTest || []).length
      : (chapter.practiceProblems || []).length;
    return parseStoredNonNegativeInteger(
      localStorage.getItem(`quiz_idx_${chapter.id}_${mode}`),
      Math.max(0, questionCount - 1),
    );
  });
  const [showingExplanation, setShowingExplanation] = useState(() => {
    return localStorage.getItem(`quiz_expl_${chapter.id}_${mode}`) === 'true';
  });

  /**
   * リスニングで「いま大問（回）の中の何問目を解いているか」（0始まり）。
   *
   * ご要望：
   *   > 問1で1つの進捗、問2で1つの進捗みたいな感じにしてほしい。
   *
   * 大問そのもの（第N回演習）は分割していないので `currentQuestionIndex` は
   * これまでどおり「回」を指す。その中の何問目かをこの state が持つ。
   * 中断して戻ってきたときに問1からやり直しにならないよう端末に保存する。
   */
  const [stepIndex, setStepIndex] = useState(() =>
    parseStoredNonNegativeInteger(localStorage.getItem(`quiz_step_${chapter.id}_${mode}`)),
  );

  useEffect(() => {
    localStorage.setItem(`quiz_answers_${chapter.id}_${mode}`, JSON.stringify(answers));
  }, [answers, chapter.id, mode]);

  useEffect(() => {
    localStorage.setItem(`quiz_step_${chapter.id}_${mode}`, stepIndex.toString());
  }, [stepIndex, chapter.id, mode]);

  useEffect(() => {
    localStorage.setItem(`quiz_idx_${chapter.id}_${mode}`, currentQuestionIndex.toString());
  }, [currentQuestionIndex, chapter.id, mode]);

  useEffect(() => {
    localStorage.setItem(`quiz_expl_${chapter.id}_${mode}`, showingExplanation.toString());
  }, [showingExplanation, chapter.id, mode]);

  // ────────────────────────────────────────────────────────────────
  // 消去法（elimination）― モードを持たず「選択肢の直接タップ」で行う
  // ────────────────────────────────────────────────────────────────
  //
  // ■ 何のための状態か
  //   リスニングやイラスト選択では「これは違う」と分かった選択肢を先に潰し、
  //   残りに集中するのが定石（消去法）。紙の問題冊子で選択肢に斜線を引く動作を
  //   アプリ上で再現する。
  //
  // ■ 消去モード（トグルボタン）を廃止した理由（ご要望）
  //   以前は専用ボタンで消去モードに切り替え、モード中だけ
  //   タップ＝斜線という仕様だった。しかしモードがあると
  //     ・押す前に必ずボタンを探す手間が増える
  //     ・「いま押したら選択なのか消去なのか」を毎回確認しないといけない
  //   という負担が生まれる。そこでモードを無くし、
  //   選択肢そのものを続けてタップするだけで消去できるようにした。
  //
  // ■ タップ1種類で3状態を回す（cycleOption）
  //     未選択 → 選択 → 消去（斜線） → 未選択 → …
  //   「選んだけれど、やっぱり違う」という思考の流れがそのまま指の動きになり、
  //   どの状態からでも続けてタップすれば元に戻せるので詰まらない。
  //
  // ■ 解答（answers）とは完全に別の状態にしている理由
  //   同じ state に混ぜると「消したつもりが解答になっていた」という
  //   取り違えが起きる。採点対象は answers のみ、消去は表示だけに効く、
  //   と役割を分けることで誤答リスクを無くす。
  //
  // ■ 形
  //   { [設問ID]: 消去した選択肢の配列 }
  //   選択肢そのものの文字列で持つ（並び替えや添字ズレに影響されないため）。
  const [eliminated, setEliminated] = useState<Record<string, string[]>>(() =>
    parseStoredStringArrayRecord(localStorage.getItem(`quiz_elim_${chapter.id}_${mode}`)),
  );

  useEffect(() => {
    localStorage.setItem(`quiz_elim_${chapter.id}_${mode}`, JSON.stringify(eliminated));
  }, [eliminated, chapter.id, mode]);

  /** ある設問で、その選択肢が消去済みか。 */
  const isEliminated = (sqId: string, opt: string) =>
    (eliminated[sqId] || []).includes(opt);

  /** 斜線を引く（消去する）。 */
  const strikeOption = (sqId: string, opt: string) => {
    setEliminated((prev) => {
      const cur = prev[sqId] || [];
      if (cur.includes(opt)) return prev;
      return { ...prev, [sqId]: [...cur, opt] };
    });
  };

  /** 斜線を消して候補に戻す。 */
  const restoreOption = (sqId: string, opt: string) => {
    setEliminated((prev) => {
      const cur = prev[sqId] || [];
      if (!cur.includes(opt)) return prev;
      return { ...prev, [sqId]: cur.filter((o) => o !== opt) };
    });
  };

  /**
   * その設問の斜線をすべて消す（長押しで一気にリセット）。
   *
   * ご指摘「事故的に選択肢を復活させてしまうリスク」への対応。
   * 1つずつタップして戻すと、戻す途中で別の選択肢を誤って選んでしまう
   * （＝解答が入ってしまう）ことがある。まとめて白紙に戻す道を用意して、
   * 「やり直したい」ときに解答を触らずに済むようにする。
   */
  const clearEliminated = (sqId: string) => {
    setEliminated((prev) => {
      if (!(prev[sqId] || []).length) return prev;
      const next = { ...prev };
      delete next[sqId];
      return next;
    });
  };

  // 直前に斜線を引いた選択肢（アニメーションを1回だけ流すためのキー）。
  // `${設問ID}\u0000${選択肢}` の形で持つ。区切りに \u0000 を使うのは
  // 選択肢の文字列に現れ得ない文字にして衝突を避けるため。
  const [justStruck, setJustStruck] = useState<string | null>(null);

  /** 斜線を引き、同時にアニメーション対象として記録する。 */
  const strikeOptionAnimated = (sqId: string, opt: string) => {
    strikeOption(sqId, opt);
    setJustStruck(`${sqId}\u0000${opt}`);
  };

  // 長押し判定用。押し始めのタイマーと、「長押しが成立したので
  // 指を離したときの通常タップ（onClick）は無視する」フラグを持つ。
  const longPressTimer = useRef<number | null>(null);
  const longPressFired = useRef(false);

  /** 長押し開始（500ms 押し続けたら、その設問の斜線を全部消す）。 */
  const beginLongPress = (sqId: string) => {
    longPressFired.current = false;
    if (longPressTimer.current !== null) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => {
      longPressTimer.current = null;
      // 斜線が1つも無いなら何も起きない（誤爆しても害がない）
      if (!(eliminated[sqId] || []).length) return;
      longPressFired.current = true;
      clearEliminated(sqId);
      // 端末が対応していれば触覚で「まとめて戻した」ことを伝える
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(30);
      }
    }, 500);
  };

  /** 長押し解除（指を離した／指が外れた／スクロールした）。 */
  const endLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // 設問が変わる・アンマウントされるときにタイマーを残さない
  useEffect(() => () => endLongPress(), []);

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
  // 【俯瞰UI＋ピンチズーム前提への変更】スマホでも常に PC 版レイアウト
  // （俯瞰表示）で描画するため、常に false を渡す。縮小/拡大は
  // App.tsx の viewport 制御（width=1024 ＋ fit scale ＋ ピンチズーム許可）に委ねる。
  const isMobileForExplanation = false;

  // 直前に表示していた問題のインデックスを保持（離脱した問題の回答リセット用）
  const prevQuestionIndexRef = useRef(currentQuestionIndex);

  /**
   * 指定インデックスの問題に入力された回答を消去する。
   * ただし、その問題が既に採点済みの場合は保持する
   * （採点済みの解答は解説表示の答え合わせに必要なため）。
   * 「一度離れた未提出の問題の回答」だけをリセットし、不正な得点（解答の使い回し）を防ぐ。
   *
   * ★採点済みの判定は perQuestion と perStep の両方を見る★
   *   リスニングの1問ずつモードの採点記録は run.perQuestion ではなく
   *   run.perStep（キーは「大問ID::小問ID」）に入る。
   *   以前は perQuestion しか見ていなかったため、リスニングで大問を
   *   移動した瞬間に「採点済みの解答」まで削除され、結果画面で
   *   解いたはずの問が全部「未解答→不正解」になるバグがあった。
   *   （ご報告「一問しか解いてないのに他のが全部不正解扱いになる」の原因）
   */
  const clearAnswersForQuestionIfUnscored = (qIndex: number) => {
    const q = questions[qIndex];
    if (!q) return;
    const scoredAsQuestion = !!run.perQuestion[q.id];
    const scoredAsStep = Object.keys(run.perStep || {}).some(
      (key) => key.startsWith(`${q.id}::`),
    );
    if (scoredAsQuestion || scoredAsStep) return; // 採点済みは残す
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

  // showingExplanation の状態を App 側（isExplanationView）へ同期する。
  //
  // 【俯瞰UI化に伴う修正】viewport の制御は App.tsx の shouldForceDesktopUI
  // effect に一元化したため、解説表示中かどうかを App が正確に把握できる
  // 必要がある。従来は各ハンドラ内でのみ onExplanationChange を呼んでいたため、
  // localStorage から showingExplanation=true で復元された場合（リロード/再開時）
  // に App 側と状態がズレ、初回表示だけレイアウトと viewport の組み合わせが
  // 不整合になる問題があった。effect で常に同期させて確実に一致させる。
  useEffect(() => {
    if (onExplanationChange) onExplanationChange(showingExplanation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showingExplanation]);

  // 問題解答画面ではズーム（ピンチ／ダブルタップ）を一切禁止する。
  //
  // 【要件2・利便性向上】
  // - iOS Safari は meta viewport の maximum-scale を後から変えても効かない場合があるため、
  //   gesturestart / gesturechange（ピンチ）と、300ms以内の連続タップ（ダブルタップ）
  //   を JS で明示的に抑止し、確実にズームさせない。
  //
  // 【俯瞰UI化に伴う修正】従来はここで meta viewport も直接書き換えていたが、
  // App / Explanation と 3箇所で競合して初回表示時のスクロール不能の原因と
  // なっていたため廃止し、viewport 制御は App.tsx に一元化した。
  // （解説表示中は上の同期 effect 経由で App が俯瞰用 viewport を適用する）
  useEffect(() => {
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

    if (showingExplanation) {
      // 解説へ移る瞬間: スクロール位置を最上部へ（viewport は App 側が制御）
      window.scrollTo(0, 0);
    } else {
      // 解答中のみズーム抑止リスナーを登録する
      document.addEventListener('gesturestart', preventGesture, { passive: false });
      document.addEventListener('gesturechange', preventGesture, { passive: false });
      document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
    }

    return () => {
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('gesturechange', preventGesture);
      document.removeEventListener('touchend', preventDoubleTapZoom);
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

    /*
      ★英語リスニング：選択肢の本文を「解答欄のボタンそのもの」に載せる（ご要望）
      ------------------------------------------------------------------
      第1問A のデータは options が ['①','②','③','④'] のマークだけで、
      英文本体は problem.text 側にあった。そのため
      「左ペインで英文を読む → 右ペインで①〜④を押す」という往復が必要だった。
      listeningOptionTexts は problem.text から①〜④の本文を取り出した対応表で、
      ここに本文があれば、マークと本文を1つのボタンに同居させる。
      これで「問題文（選択肢）と解答欄が同期する」＝分離が無くなる。
      第1問B（イラスト選択）には本文が無いので、従来どおりマークのみになる。
    */
    const optionTexts: string[] | undefined = listeningOptionTexts.get(sq.id);
    // 本文つきの選択肢は必ず縦1列（英文は長いので横並びにすると読めない）。
    const stacked = isLongOptionList || !!optionTexts;

    return (
      <div className="flex w-full flex-col gap-2">
      {/*
        消去法の操作説明。
        ボタン（モード切替）を置かず、選択肢を続けてタップするだけで
        「選ぶ → 消す → 戻す」が回ることを一行で伝える。
      */}
      {/*
        操作説明は「文字だけ」だと読み飛ばされるため、
        各状態の見た目そのものを小さな見本として並べて示す。
        初見のユーザーが「斜線という段階がある」ことに気づけるようにするのが目的。
      */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold leading-snug text-gray-400">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block rounded-md border-2 border-gray-200 bg-white px-1.5 py-0.5 text-gray-600">ア</span>
          <span>タップで選択</span>
        </span>
        <span aria-hidden="true" className="text-gray-300">→</span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block rounded-md border-2 border-[#A9CCE3] bg-[#A9CCE3] px-1.5 py-0.5 text-white">ア</span>
          <span>もう一度で斜線</span>
        </span>
        <span aria-hidden="true" className="text-gray-300">→</span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block rounded-md border-2 border-gray-200 bg-gray-100 px-1.5 py-0.5 text-gray-400 line-through decoration-2 decoration-[#E8A87C]">ア</span>
          <span>さらにタップで元に戻る</span>
        </span>
        <span className="text-gray-400">／長押しでこの設問の斜線をまとめて消す</span>
      </div>

      <div className={stacked
        ? "grid grid-cols-1 gap-2.5 w-full"
        // 注：以前ここに xs:grid-cols-3 があったが、Tailwind v4 の @theme に
        // xs ブレークポイントは未定義で「効かないクラス」だった。スマホで列数を
        // 増やすと1つあたりのタップ幅が狭くなり本要件（タップしづらい）に逆行する
        // ため、ブレークポイントを追加せずクラスを削除している。
        : "grid grid-cols-2 gap-2 md:gap-3 w-full sm:flex sm:flex-wrap"
      }>
        {sq.options.map((opt: string, optIdx: number) => {
          const isSelected = isMultiple
            ? (answers[sq.id] || '').split(multiSep as string).map(s => s.trim()).includes(opt.trim())
            : (answers[sq.id] || '') === opt;
          const struck = isEliminated(sq.id, opt);
          // 斜線を引いた直後だけアニメーションを流す（状態変化を動きで知らせる）
          const strikeAnimating = struck && justStruck === `${sq.id}\u0000${opt}`;
          const body = optionTexts?.[optIdx];
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={isSelected}
              // 消去済みは支援技術にも「候補から外した」と伝える
              aria-disabled={struck}
              // 見た目（斜線・グレー）に頼らず、状態を言葉でも伝える。
              // 「今どの状態か視覚情報だけで判断させない」ためのラベル。
              aria-label={`${opt}${body ? ` ${body}` : ''}／${
                struck ? '消去済み。タップで元に戻します' : isSelected ? '選択中。タップで斜線を引きます' : '未選択'
              }`}
              title={struck ? '消去済み（タップで元に戻す／長押しでまとめて戻す）' : undefined}
              // 長押しで、その設問の斜線をまとめて消す。
              // タッチ・マウスの両方を拾うため Pointer Events を使う。
              onPointerDown={() => beginLongPress(sq.id)}
              onPointerUp={endLongPress}
              onPointerLeave={endLongPress}
              onPointerCancel={endLongPress}
              onContextMenu={(e) => {
                // 長押しが成立した直後にモバイルの長押しメニューが出ると
                // 操作の邪魔になるため抑制する。
                if (longPressFired.current) e.preventDefault();
              }}
              onClick={() => {
                // 長押しでまとめて消した直後は、指を離したときの
                // 通常タップを実行しない（意図しない選択を防ぐ）。
                if (longPressFired.current) {
                  longPressFired.current = false;
                  return;
                }
                // ────────────────────────────────────────────────
                // 選択肢の直接タップだけで消去法まで行う（モード無し）
                //   未選択 → 選択 → 斜線（消去）→ 未選択 → …
                // ────────────────────────────────────────────────
                //
                // ① 斜線が引かれている選択肢をタップ → 斜線を消して未選択に戻す。
                //    「間違って消した」をその場のタップ1回で取り消せる。
                if (struck) {
                  restoreOption(sq.id, opt);
                  return;
                }
                if (isMultiple) {
                  // 複数選択：選択中のものをタップ＝選択解除（従来どおり）。
                  // 複数選択で斜線まで回すと「解除したのか消したのか」が
                  // 分からなくなるため、複数選択では斜線を使わない。
                  const separator = multiSep as string;
                  const current = (answers[sq.id] || '').split(separator).map(s => s.trim()).filter(Boolean);
                  const nextUnordered = isSelected
                    ? current.filter(a => a !== opt)
                    : [...current, opt];
                  const ordered = sq.options.filter((o: string) => nextUnordered.includes(o));
                  handleOptionSelect(sq.id, ordered.join(separator));
                  return;
                }
                // ② 単一選択で「いま選んでいる」ものをタップ
                //    → 解答を外し、そのまま斜線を引く（＝これは違うと判断した）。
                if (isSelected) {
                  handleOptionSelect(sq.id, '');
                  strikeOptionAnimated(sq.id, opt);
                  return;
                }
                // ③ それ以外（未選択）をタップ → 解答として選ぶ。
                handleOptionSelect(sq.id, opt);
              }}
              // スマホは 48px 以上の高さ・幅を確保してタップしやすくする（PC は従来寸法）。
              className={`relative px-4 py-3 md:py-2.5 min-h-[3rem] md:min-h-0 rounded-xl font-bold text-[16px] md:text-sm transition-all duration-200 border-2 flex items-center ${stacked ? 'justify-start text-left w-full' : 'justify-center text-center w-full sm:w-auto sm:flex-none'} min-w-[3.25rem] md:min-w-[3rem] shadow-sm cursor-pointer
                ${struck
                  // 消去済み：斜線＋グレーに加え、枠線を破線にして
                  // 「候補から外した（もう枠として生きていない）」ことを形でも示す。
                  // 色や透明度だけでは段階の違いが伝わりにくい、というご指摘への対応。
                  // 紙の冊子で選択肢に線を引いた状態の再現。
                  ? `bg-gray-100 text-gray-400 border-gray-300 border-dashed line-through decoration-2 decoration-[#E8A87C] opacity-70 shadow-none ${strikeAnimating ? 'animate-strike-out' : ''}`
                  : isSelected
                    ? 'bg-[#A9CCE3] text-white border-[#A9CCE3] ring-2 ring-[#A9CCE3]/30 scale-[1.01]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#A9CCE3]/50 hover:bg-gray-50'
                }`}
            >
              {body ? (
                // マークは丸バッジで固定幅にし、英文は折り返して全文を読ませる。
                // 「読む場所」と「押す場所」を1つにするのがこの表示の目的。
                <span className="flex w-full items-start gap-2.5">
                  <span
                    className={`shrink-0 text-[15px] md:text-base leading-6 ${
                      struck ? 'text-gray-400' : isSelected ? 'text-white' : 'text-[#2C3E50]'
                    }`}
                  >
                    {opt}
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] md:text-sm font-medium leading-6 break-words [overflow-wrap:anywhere]">
                    {formatText(body)}
                  </span>
                </span>
              ) : (
                formatText(opt)
              )}
              {/*
                消去済みを示すアイコン。
                「取り消し線＋グレー」だけでは通常表示との差に気づきにくいため、
                ✕ のバッジを重ねて、色が見分けにくい環境でも
                形で「消してある」と分かるようにする。
              */}
              {struck && (
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E8A87C] text-[9px] font-bold leading-none text-white shadow-sm ${
                    strikeAnimating ? 'animate-draw-strike' : ''
                  }`}
                >
                  ✕
                </span>
              )}
            </button>
          );
        })}
      </div>
      {/*
        いま何個消したかを読み上げ・表示の両方で伝える。
        「今どの状態か」を見た目だけで覚えなくて済むようにするのが目的。
      */}
      {(eliminated[sq.id] || []).length > 0 && (
        <p className="text-[10px] font-bold text-gray-400" aria-live="polite">
          {(eliminated[sq.id] || []).length}個を消去中（長押しでまとめて元に戻す）
        </p>
      )}
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
                    className="flex-1 flex items-center gap-2 text-left min-w-0 min-h-[2.75rem] cursor-pointer"
                  >
                    <GripVertical size={16} className={`shrink-0 ${isSelected ? 'text-[#A9CCE3]' : 'text-gray-400'}`} />
                    <span className="font-bold text-gray-800 text-[16px] break-words">{formatText(item)}</span>
                  </button>
                  {/* ◀▶ 移動ボタン（確実な操作手段） */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      aria-label="1つ上へ移動"
                      disabled={idx === 0}
                      onClick={() => { reorderSort(sq.id, activeOrder, idx, idx - 1); setTapSortSelect(null); }}
                      // ▲▼ は 32px 角では隣同士を誤タップしやすいため 44px 角に拡大。
                      className={`flex items-center justify-center w-11 h-11 rounded-lg border transition-colors ${
                        idx === 0 ? 'border-gray-150 text-gray-300 bg-gray-50' : 'border-[#A9CCE3] text-[#2C3E50] bg-white active:bg-[#A9CCE3]/20'
                      }`}
                    >
                      <ChevronLeft size={18} className="stroke-[2.5] -rotate-90" />
                    </button>
                    <button
                      type="button"
                      aria-label="1つ下へ移動"
                      disabled={idx === activeOrder.length - 1}
                      onClick={() => { reorderSort(sq.id, activeOrder, idx, idx + 1); setTapSortSelect(null); }}
                      className={`flex items-center justify-center w-11 h-11 rounded-lg border transition-colors ${
                        idx === activeOrder.length - 1 ? 'border-gray-150 text-gray-300 bg-gray-50' : 'border-[#A9CCE3] text-[#2C3E50] bg-white active:bg-[#A9CCE3]/20'
                      }`}
                    >
                      <ChevronRight size={18} className="stroke-[2.5] rotate-90" />
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

  /**
   * 今回解く範囲（両端を含む）。
   *
   * ■ 設計の要点：`questions` は章の全問のまま据え置く
   *   `currentQuestionIndex` は「章の中の通し番号」であり、
   *     ・localStorage の `quiz_idx_*`
   *     ・解説画面へ渡す singleQuestionIndex
   *     ・図版の通し番号（図1・図2…）
   *   がすべてこの番号を前提にしている。
   *   ここで配列そのものを切り出すと番号の意味がズレて、
   *   「解説に別の問題が出る」「図番号が飛ぶ」といった不具合になる。
   *   そこで配列は切らず、「どこからどこまでを1回とみなすか」だけを持つ。
   *
   * ■ 値の丸め方
   *   データ追加・削除で範囲が配列の外を指しても落ちないよう、
   *   必ず 0〜(最終問) に収める。範囲指定が無ければ章の全問が範囲。
   */
  const lastIndex = Math.max(0, questions.length - 1);
  const rangeStart = questionRange
    ? Math.min(Math.max(0, questionRange.startIndex), lastIndex)
    : 0;
  const rangeEnd = questionRange
    ? Math.min(Math.max(rangeStart, questionRange.endIndex), lastIndex)
    : lastIndex;
  /** 範囲内の問題数（進捗ピルの分母） */
  const rangeCount = rangeEnd - rangeStart + 1;
  /** 範囲内での現在位置（1始まり・進捗ピルの分子） */
  const rangePosition = Math.min(
    rangeCount,
    Math.max(1, currentQuestionIndex - rangeStart + 1),
  );

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

  // ────────────────────────────────────────────────────────────────
  // リスニング：1画面＝1問（ご要望「問1で1つの進捗、問2で1つの進捗」）
  // ────────────────────────────────────────────────────────────────
  //
  // `perStep` が true のときは、大問（回）の中の小問を1問ずつ見せる。
  // 化学など音源を持たない問題は false になり、これまでどおり
  // 大問まるごと1画面（(1)〜(4)を並べて表示）のまま。
  const perStep = isPerSubQuestionListening(currentQuestion);
  const listeningSteps = perStep ? buildListeningSteps(currentQuestion) : [];
  /** 範囲外を指さないよう丸めた、いま表示している問の位置 */
  const safeStepIndex = perStep
    ? Math.min(Math.max(0, stepIndex), Math.max(0, listeningSteps.length - 1))
    : 0;
  /** いま表示している小問（1問ずつモードのときだけ中身が入る） */
  const activeStepSub = perStep
    ? (currentQuestion.subQuestions || [])[safeStepIndex] ?? null
    : null;
  /** この回の最後の問まで来たか */
  const isLastStep = !perStep || safeStepIndex >= listeningSteps.length - 1;

  /**
   * 進捗ピルの分子・分母。
   *
   * ・1問ずつモード（リスニング）… その回の中の「問」を数える（例 2/4）
   * ・従来モード（化学など）      … 範囲内の「大問」を数える（例 3/14）
   *
   * 回をまたぐ通し番号にはしていない。1回＝4問と短いので、
   * 「この回のどこまで来たか」が分かるほうが達成感につながる。
   */
  const progressTotal = perStep ? listeningSteps.length : rangeCount;
  const progressPosition = perStep ? safeStepIndex + 1 : rangePosition;

  /**
   * 「前へ」を押せるか。
   *
   * 1問ずつモードでは、回の先頭（問1）にいても
   * まだ前の回が範囲内にあるなら戻れる。逆に範囲の先頭の問1では
   * 戻る先が無いのでボタンを無効にする（押しても何も起きないボタンを
   * 押せる状態にしておくと、壊れているように見えるため）。
   */
  const canGoPrevious = showingExplanation
    ? true
    : (perStep && safeStepIndex > 0) || currentQuestionIndex > rangeStart;

  // 「最後の問題か」＝範囲の終わりに来たか。
  // 章の最終問ではなく範囲の終わりで判定することで、
  // 1回分（例：第3回演習）を解き終えた時点でちゃんと結果画面へ進める。
  // 1問ずつモードでは「範囲の最後の回」かつ「その回の最後の問」で完了とする。
  const isLastQuestion = currentQuestionIndex >= rangeEnd && isLastStep;

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

  // ===== 解答中のライブ順位（臨場感）=====
  //
  // 「解き終わってから順位を見る」だけでは、いまの1問が順位に
  // どう跳ね返るのか分からず、得点が手応えにならない。
  // ワールドカップ中継のように、解答中もずっと順位と点差を見せる。
  //
  // 通信は「章を開いたとき1回だけ」。順位はスコアが動くたびに手元で
  // 再計算するので、1問ごとに Firestore を読みに行くことはしない。
  const { standing: liveStanding, delta: rankDeltaValue } = useLiveStanding(
    chapter.id,
    run.totalScore,
    isGuest,
  );

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
   * 解答欄に実際に描画するグループ一覧。
   *
   * ご要望「問1で1つの進捗、問2で1つの進捗みたいな感じにしてほしい」に対応し、
   * 1問ずつモード（perStep）では、いま解いている問だけを解答欄に出す。
   * 以前は問1〜問4のカードが4枚縦に並んでいたため、
   * 「今どれを解いているのか」が分からず、スマホでは選択肢まで
   * スクロールが必要だった。
   *
   * 化学など従来の問題（perStep=false）は groupedSubQuestions をそのまま使う。
   */
  const visibleGroupedSubQuestions = useMemo(() => {
    if (!perStep || !activeStepSub) return groupedSubQuestions;
    return groupedSubQuestions.filter((g: any) =>
      (g.items || []).some((sq: any) => sq?.id === activeStepSub.id),
    );
  }, [groupedSubQuestions, perStep, activeStepSub]);

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
  // 「解答として実際に打ち込む文字列」が化学式・イオン式・反応式・上下付き文字を
  // 含む設問が1つでもあれば true。問題データ側の明示 opt-in も尊重する。
  const questionNeedsChemPalette = useMemo(() => {
    if (!currentQuestion) return false;
    if ((currentQuestion as any).requiresChemicalPalette) return true;
    const subs = currentQuestion.subQuestions || [];
    return subs.some((sq: any) => requiresChemicalSymbols(sq));
  }, [currentQuestion]);

  // この問題に数学記号パレットが必要か。
  // データ側の明示 opt-in（requiresMathPalette）のみで判定する。
  const questionNeedsMathPalette = useMemo(() => {
    if (!currentQuestion) return false;
    if ((currentQuestion as any).requiresMathPalette) return true;
    const subs = currentQuestion.subQuestions || [];
    return subs.some((sq: any) => requiresMathSymbols(sq));
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

  // ────────────────────────────────────────────────────────────────
  // 英語リスニング：問ごとの音源トラック
  // ────────────────────────────────────────────────────────────────
  //
  // ご要望「1問題とそれに該当する再生ボタンを横に配置して」に対応するため、
  // 「この設問(subId)に対応するトラックがあるか」を O(1) で引けるようにする。
  // 解答カード側は subId で引いて、そのカードの横に再生ボタンを描く。
  const listeningTracks: any[] = useMemo(() => {
    const t = (currentQuestion as any)?.audioTracks;
    return Array.isArray(t) ? t : [];
  }, [currentQuestion]);

  /** 設問IDに対応する音源トラックがあるか（無ければ再生ボタンを出さない）。 */
  const hasTrackFor = useCallback(
    (sqId: string) => listeningTracks.some((t) => t?.subId === sqId),
    [listeningTracks],
  );

  // ────────────────────────────────────────────────────────────────
  // 英語リスニング：選択肢の本文（問題文と解答欄を分離しないための対応表）
  // ────────────────────────────────────────────────────────────────
  //
  // ご要望「問題文と解答欄を分離しないで／問題文(選択肢)と解答欄が同期するように」
  // に対応するため、problem.text に書かれている ①〜④ の英文を
  // 「設問ID → 選択肢本文の配列」に組み替える。
  // 解答欄の選択肢ボタンがこの本文を表示するので、
  // 読む場所と押す場所が一致し、左右のペインを往復する必要が無くなる。
  //
  // 元データは書き換えない（解説側では従来どおり問題文全文を見せたいため）。
  const listeningOptionTexts = useMemo(
    () => buildListeningOptionTexts(currentQuestion),
    [currentQuestion],
  );

  /**
   * 「問題文と解答欄を1つにまとめる」表示にするか（ご要望：分離しないで）。
   *
   * 音源つきの問題（＝英語リスニング）が対象。
   *   ・第1問A … 選択肢の英文を解答カードのボタンに載せる
   *   ・第1問B … 判断材料のイラストを解答カードに載せる（既にそうなっている）
   * どちらも「設問文・選択肢・解答」を1枚のカードに揃え、
   * 左ペインには共通のリード文（指示文・解き方のコツ）だけを残す。
   *
   * 化学など音源が無い教科では false のままなので、従来表示に影響しない。
   */
  const listeningUnified = listeningTracks.length > 0;

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

    // ────────────────────────────────────────────────────────────────
    // 採点の単位（ご要望「問1で1つの進捗、問2で1つの進捗」）
    // ────────────────────────────────────────────────────────────────
    //
    // ・1問ずつモード（リスニング）… いま表示している1問だけを採点する。
    //     「解答と解説を見る」を押すたびにその問の点が出るので、
    //     4問まとめて採点されて何が合っていたのか分からない状態を解消する。
    // ・従来モード（化学など）      … 大問の全小問をまとめて採点する。
    //
    // 二重採点のガードも単位に合わせる。大問IDだけで見ていると、
    // 1問ずつモードでは問1を採点した時点で問2〜問4が
    // 「もう採点済み」と判定されて0点のまま飛ばされてしまう。
    const scoringKey = perStep && activeStepSub
      ? stepScoreKey(currentQuestion.id, activeStepSub.id)
      : currentQuestion.id;

    if (perStep) {
      if (run.perStep?.[scoringKey]) return null;
    } else if (run.perQuestion[scoringKey]) {
      return null;
    }
    if (lastScoredQuestionRef.current === scoringKey) return null;
    lastScoredQuestionRef.current = scoringKey;

    // 採点対象の小問。1問ずつモードでは表示中の1問だけ。
    const subQuestions = perStep && activeStepSub
      ? [activeStepSub]
      : (currentQuestion.subQuestions || []);
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

    // 採点済みの記録先。
    //
    // ★1問ずつモードの記録は perQuestion に入れない★
    //   perQuestion のキーは「大問ID」であることを前提に、
    //   進捗の引き継ぎ処理（progress.ts の backfillLegacyProgress）が
    //   キーをそのまま大問IDとして数えている。ここに小問単位のキーを混ぜると
    //   存在しない大問を「解いた」と数えて進捗が分母を超えてしまう。
    //   そのため小問単位は perStep という別の入れ物に分ける。
    const scoreRecord = { ...finalBreakdown, timeLimit: questionTimeLimit, timeUsed };
    const nextRun: ChapterRunState = {
      ...run,
      totalScore: run.totalScore + boostedScore,
      runningCombo: nextRunningCombo,
      totalCorrect: run.totalCorrect + breakdown.correctCount,
      totalJudgeable: run.totalJudgeable + breakdown.judgeableCount,
      totalTimeSec: run.totalTimeSec + timeUsed,
      perQuestion: perStep
        ? run.perQuestion
        : { ...run.perQuestion, [scoringKey]: scoreRecord },
      perStep: perStep
        ? { ...(run.perStep || {}), [scoringKey]: scoreRecord }
        : run.perStep,
    };
    setRun(nextRun);
    saveRun(chapter.id, mode, nextRun);

    // ===== 学習進捗の記録（1点でも取れた大問は「解いた」として永続化） =====
    // run state（quiz_run_*）は章を解き終えた時点で削除され、
    // quiz_answers_* も章に入り直すと消えるため、
    // 「採点したこの瞬間」に別台帳（solved_problems_v1_*）へ追記しておく。
    // こうしないと、やり切った章ほど進捗から消えるという逆転が起きる。
    //
    // ★1問ずつモードでも記録の単位は「大問（回）」のまま★
    //   画面の進み方を問単位にしても、台帳のキーは `章ID::大問ID` を変えない。
    //   ここを小問単位に変えると、ホームの分母（章あたり14問・15問）と
    //   分子の単位が食い違い、これまでの学習記録も全部「未着手」に戻ってしまう。
    //   ご要望は「解き方・見え方」の話なので、記録の互換性は保つ。
    try {
      const uid = auth.currentUser?.uid || (isGuest ? 'guest' : null);
      markProblemSolved(uid, chapter.id, currentQuestion.id, boostedScore);

      // localStorage への記録が済んだので、クラウドへの送信を予約する。
      // 1問ごとに通信すると1授業で数千書き込みになるため、
      // studySync 側でまとめて（デバウンスして）送る。
      // 通信できなくても localStorage には残っているので学習は続く。
      schedulePush();
    } catch (e) {
      // 進捗記録の失敗で学習そのものを止めない
      console.error('[Quiz] markProblemSolved failed:', e);
    }

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
      // ★1問ずつモード：まず同じ回の次の問へ進む★
      // 問1の解説 →「次へ」→ 問2 → … と進み、その回の4問を終えてから
      // 次の回（または結果画面）へ移る。
      if (perStep && !isLastStep) {
        setStepIndex(safeStepIndex + 1);
        setShowingExplanation(false);
        if (onExplanationChange) onExplanationChange(false);
      } else if (!isLastQuestion) {
        setCurrentQuestionIndex(prev => prev + 1);
        // 次の回は必ず問1から始める。
        setStepIndex(0);
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
    } else if (perStep && safeStepIndex > 0) {
      // ★1問ずつモード：同じ回の1つ前の問（の解説）へ戻る★
      // 問3を解いている途中で「問2の答えをもう一度見たい」という戻り方を
      // 回をまたがずにできるようにする。
      setStepIndex(safeStepIndex - 1);
      setShowingExplanation(true);
      if (onExplanationChange) onExplanationChange(true);
    } else if (currentQuestionIndex > rangeStart) {
      // 「前へ」で今回の範囲より前（別の回）へは戻さない。
      // 選んだ回だけを解いているのに前の回が出てくると、
      // どの回を解いているのか分からなくなるため。
      setCurrentQuestionIndex(prev => prev - 1);
      // 前の回に戻るときは、その回の最後の問から見えるようにする。
      const prevQuestion = questions[currentQuestionIndex - 1];
      const prevSteps = isPerSubQuestionListening(prevQuestion)
        ? buildListeningSteps(prevQuestion)
        : [];
      setStepIndex(prevSteps.length > 0 ? prevSteps.length - 1 : 0);
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
    /*
      解説に渡すスコア。
      ─────────────────────────────────────────────
      1問ずつモード（リスニング）では、採点も「問ごと」に
      run.perStep へ記録している（run.perQuestion は大問単位の台帳のまま）。
      解説画面のスコア表示もその問の記録を出さないと、
      「問2を解いたのに問1の点数が出る」ことになる。
    */
    const stored = perStep && activeStepSub
      ? run.perStep?.[stepScoreKey(currentQuestion.id, activeStepSub.id)]
      : run.perQuestion[currentQuestion?.id];
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
          /* ご要望「だから解説も修正な」：1問ずつ解いたのだから、
             解説もその問だけに絞る（問2以降の正解が先に見えないようにする）。 */
          focusSubQuestionId={perStep && activeStepSub ? activeStepSub.id : null}
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
        {/* 順位が動くのは「採点した瞬間」＝この解説画面へ切り替わる瞬間なので、
            実況バナーは解説画面側にも置く。ここに無いと肝心の順位変動が
            一度も表示されないことになる。 */}
        <OvertakeBanner
          delta={rankDeltaValue}
          rank={liveStanding?.rank ?? 0}
          triggerKey={run.totalScore}
        />
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
          {/* 現在順位ピル（臨場感）。
              既存のスコアピル・進捗ピルと同じ「丸いピル」の形・同じ色域にそろえ、
              並べても違和感が出ないようにしている。ゲスト時は standing が null で非表示。 */}
          <LiveStandingPill standing={liveStanding} />

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
            {/* 分母は「今回解く範囲の問題数」。
                1回分（例：第3回演習）だけを選んで解いているときに
                章全体の 14 が分母になると、あと13回残っているように見えて
                いつまでも終わらない印象になるため。

                ★リスニング（1問ずつモード）では「問」を数える★
                ご要望「問1で1つの進捗、問2で1つの進捗」に合わせ、
                4問ある回では 1/4 → 2/4 → 3/4 → 4/4 と動く。
                以前は4問まとめて1件だったので 1/1 のまま動かず、
                解いた実感がまったく残らなかった。 */}
            <div className="font-mono font-bold text-[#2C3E50] text-xs md:text-base">
              <span className="text-sm md:text-lg">{progressPosition}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span>{progressTotal}</span>
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

      {/* 順位が動いた瞬間だけ降りてくる実況バナー（「2人抜き！ 7位 → 5位」）。
          「+120点」だけでは順位への影響が伝わらないので、順位変動を言語化する。
          2.6秒で自動的に消えるので、解答の邪魔にならない。 */}
      <OvertakeBanner
        delta={rankDeltaValue}
        rank={liveStanding?.rank ?? 0}
        triggerKey={run.totalScore}
      />


      {/* Main Content Area (Split on Desktop, Stacked on Mobile)

          ★英語リスニング（listeningUnified）のスマホ表示は上下を入れ替える（ご要望）
          ------------------------------------------------------------------
          ご要望：
            「選択肢の英文と図はスマホだったら上に持ってきて、
              パソコンだったら右に持ってきてほしい」

          PC では従来どおり「問題＝左 / 解答＝右」でご要望どおり。
          一方スマホでは解答ペインが下に来るため、選択肢まで届くのに
          スクロールが必要だった。そこで flex-col-reverse で解答ペインを
          上（＝最初に見える場所）に出す。
          ※ ただし「音源」と「図」は問題側（左ペイン）に置く（ご要望）。
             スマホでは左ペインが下に回るが、それは
             「共通リード文＋いま解いている問の見出し・音源・図」であり、
             解答（選択肢）とセットで1画面に収まる高さに抑えている。
          リスニング以外（化学など）は従来の flex-col のままなので影響しない。 */}
      <div className={`flex-1 flex ${listeningUnified ? 'flex-col-reverse' : 'flex-col'} lg:flex-row overflow-hidden relative`}>

        {/* Section 1: Problem Text
            ★左右比は従来どおり 58% / 42%（勝手に変えない、というご指摘に対応）。
              スマホの高さ上限も従来どおり 50vh。 */}
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
            className={`flex-1 overflow-y-auto p-4 md:p-8 text-[15px] leading-[1.85] md:text-base md:leading-relaxed text-gray-800 break-words [overflow-wrap:anywhere] ${
              // 数学の問題（requiresMathPalette 付き）は、数式が/や^の
              // 生テキストではなく教科書と同じ形で出るため、
              // 数式フォント＋一回り大きい表示（.math-content）で読みやすくする。
              questionNeedsMathPalette ? 'font-math math-content' : 'font-modern'
            }`}
            onMouseUp={handleTextSelection}
            onTouchEnd={handleTextSelection}
            title="テキストを選択するとハイライトできます"
          >
            <div className="max-w-prose md:max-w-none">
              {/* 問題文に含まれる Markdown テーブル（実験結果の表など）は
                  ExplanationBody を通して本物の <table> として描画する。

                  ★英語リスニング：ここに出すのは「共通のリード文」だけ。
                    問1〜問4のブロックは落とす。

                    ■ 不具合だった点（ご指摘：「全部の問いがまとまってて
                      どの問いを解いているかが分からない」）
                      以前は cleanQuestionText を先に通していた。これは
                      「行頭の 問N を消す」処理なので、切り落とす目印である
                      問N が先に消えてしまい、問1〜問4が全部残っていた。
                      buildListeningLeadText が正しい順序
                      （問Nで切る → 定型ブロックを落とす）を保証する。
                    いま解いている問の見出し・音源・図は、このリード文より
                    「上」に出す（下記）。
                    リスニング以外（listeningUnified=false）は従来どおり全文。 */}

              {/*
                ★英語リスニング：いま解いている問の「問題」をペインの先頭に出す
                ------------------------------------------------------------------
                ご指摘：
                  「再生ボタンはさ、左の問題の文章のところにおいてほしいよね。
                    何で解答の方に置くの？第１問の図も何で解答の方にあるの？
                    問題の方（左側）においてっていったよね」

                そこで
                  ・いま解いている問の見出し（問2 …）
                  ・その問の音源（再生／2回／速度）
                  ・その問の図（第1問B のイラスト）
                をすべて問題文ペイン＝左側にまとめる。
                右の解答ペインには選択肢（①〜④）だけが残るので、
                「どの問を解いているのか」も左を見れば必ず分かる。

                さらに、毎回同じ指示文（リード文）より前に置く。
                後ろに置くと「スクロールしてから再生を押す」ことになり、
                ご要望「スクロールしてわざわざ答えるのめんどい」に反する。
              */}
              {listeningUnified && activeStepSub && (() => {
                const stepMarker = stepLabelOf(activeStepSub, safeStepIndex);
                const { body } = splitQuestionLabel(activeStepSub.label || '', stepMarker);
                return (
                  <div className="mb-4">
                    {/* いま解いている問の見出し。回の中で迷子にならないよう
                        「問2 / 全4問」まで添える。 */}
                    <div className="flex items-center gap-2 flex-wrap mb-2.5">
                      <span className="font-bold text-white text-sm bg-[#2C3E50] py-1.5 px-3.5 rounded-lg shadow-sm">
                        {formatText(stepMarker)}
                      </span>
                      {listeningSteps.length > 1 && (
                        <span className="text-[11px] font-bold text-gray-400">
                          （全{listeningSteps.length}問中 {safeStepIndex + 1}問目）
                        </span>
                      )}
                    </div>

                    {body && (
                      <p className="text-[15px] md:text-base leading-relaxed text-gray-800 font-modern break-words [overflow-wrap:anywhere] mb-3">
                        {formatText(body, combinedHighlights)}
                      </p>
                    )}

                    {/* この問の音源。問題文のすぐ下＝「問題のところ」に横帯で置く。
                        横帯なのでボタンはどれも 44px 以上あり、指で押しやすい。 */}
                    {hasTrackFor(activeStepSub.id) && (
                      <div className="rounded-xl border border-[#A9CCE3]/40 bg-blue-50/50 p-2.5">
                        <ListeningAudioPlayer
                          tracks={listeningTracks}
                          focusSubId={activeStepSub.id}
                          variant="inline"
                          orientation="horizontal"
                          mode="practice"
                          tone="light"
                          readCount={(currentQuestion as any).readCount || 2}
                        />
                      </div>
                    )}

                    {/* この問の図（第1問B のイラスト①〜④）。
                        選択肢の中ではなく問題側に置く（ご要望）。
                        スマホは問題ペインが 50vh なので 26vh に抑えて
                        見出し・音源と一緒に1画面へ収め、PC は広いので
                        42vh まで大きく出す。タップでさらに拡大できる。 */}
                    {activeStepSub.imageUrl && (
                      <QuestionFigure
                        src={activeStepSub.imageUrl}
                        caption={activeStepSub.imageCaption}
                        tone="light"
                        className="mt-3"
                        imgClassName="max-h-[26vh] md:max-h-[42vh] object-contain"
                      />
                    )}

                    {/* リード文（毎回同じ指示文）との区切り */}
                    <div className="mt-4 border-t-2 border-[#A9CCE3]/40" />
                  </div>
                );
              })()}

              <ExplanationBody
                text={
                  listeningUnified
                    ? buildListeningLeadText(currentQuestion.text)
                    : cleanQuestionText(currentQuestion.text)
                }
                highlights={combinedHighlights}
              />
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
              {/* 表示ルール1・2：左側の「問題文」欄には共通リード文に加えて、
                  続く全小問の設問文（問1、問2、…）を順番に表示する。
                  左側だけ読めば全設問が理解できるようにする。

                  ★ただし英語リスニングのように「選択肢本文を解答カードに移した」
                    問題では、設問一覧を出すと設問文が左右2か所に分かれてしまう。
                    ご要望「問題文と解答欄を分離しないで」に反するため、
                    その場合は設問一覧を出さず、解答カード側に一本化する。 */}
              {(() => {
                if (listeningUnified) return null;
                const sqList = buildSubQuestionList(currentQuestion);
                if (sqList.length === 0) return null;
                return (
                  <div className="mt-4 pt-3 border-t border-dashed border-gray-300">
                    <div className="text-[11px] font-bold mb-2 text-gray-500">設問一覧</div>
                    <ol className="space-y-2">
                      {sqList.map((item, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          {item.marker && (
                            <span className="shrink-0 font-bold text-xs px-2 py-0.5 rounded-md border mt-0.5 bg-gray-50 text-gray-600 border-gray-200">
                              {formatText(item.marker)}
                            </span>
                          )}
                          <span className="min-w-0 leading-relaxed">
                            {formatText(item.body, combinedHighlights)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })()}
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
        {/* 下部余白：入力欄の拡大でフローティング解答バーが高くなったため、
            最後の解答カードがバーに隠れないよう 6rem → 9rem に広げる。 */}
        <div className={`lg:w-[42%] flex-1 min-h-0 overflow-y-auto bg-gray-50/50 p-4 md:p-8 ${isDesktop ? 'pb-8' : 'pb-[calc(9rem+env(safe-area-inset-bottom))]'} relative ${!isDesktop && isProblemExpanded ? 'hidden' : 'block z-10'}`}>
          <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
            <h3 className="font-bold text-gray-400 text-sm md:text-base mb-2 md:mb-4">解答入力</h3>
            {visibleGroupedSubQuestions.map((g: any, gIdx: number) => {
              if (g.type === 'group') {
                return (
                  <div key={`group-${gIdx}`} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-[#A9CCE3]/50 transition-all duration-250 flex flex-col gap-4">
                    <span className="font-bold text-[#2C3E50] text-sm text-left bg-blue-50/50 border border-[#A9CCE3]/30 py-2.5 px-4 rounded-xl leading-relaxed shadow-xs w-full block">
                      {formatText(g.groupName)}
                    </span>
                    
                    {/*
                      空欄グリッドの列数（スマホ入力UI改善）
                      ─────────────────────────────────────────────
                      以前は grid-cols-3（＋効いていない xs:grid-cols-4）で、375px 幅の
                      端末では 1 セルが約 90px しかなく、タップ・視認ともに窮屈だった。
                      スマホでは 2 列に減らして 1 セルあたりの幅を約 1.5 倍に広げる。
                      sm 以上は従来どおり列数を増やし、PC の見た目は変えない。
                    */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 gap-2.5 sm:gap-3 w-full">
                      {g.items.map((sq: any) => {
                        const isFocusedBlank = focusedSubId === sq.id;
                        return (
                        <div
                          key={sq.id}
                          className={`flex flex-col gap-1.5 min-w-[50px] p-2.5 sm:p-2 border rounded-xl shadow-2xs transition-colors ${
                            isFocusedBlank
                              ? 'bg-[#A9CCE3]/20 border-[#A9CCE3] ring-2 ring-[#A9CCE3]/40'
                              : 'bg-stone-50/80 border-stone-200/60'
                          }`}
                        >
                          <span className="font-bold text-stone-500 text-[13px] sm:text-xs text-center border-b border-stone-200/60 pb-1.5 sm:pb-1 select-none font-sans">
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
                            //
                            // タップ領域について（スマホ入力UI改善）
                            // ───────────────────────────────────────
                            // 以前は min-h-[1.75rem]（=28px）で、iOS ヒューマンインターフェイス
                            // ガイドラインおよび Material の推奨最小タップサイズ 44px を大きく
                            // 下回っていた。これが「入力欄が小さくタップしづらい」の主原因。
                            // 44px を最低ラインとして満たすだけでは指の当たり判定に余裕がない
                            // ため 48px を確保し、文字も本文最小 16px に揃える。
                            // 枠線と背景を与えて「ここが入力欄」であることも明示する。
                            <button
                              type="button"
                              id={`ans-card-${sq.id}`}
                              onClick={() => setFocusedSubId(sq.id)}
                              aria-label={`${sq.label} の解答を入力`}
                              className={`w-full min-h-[3rem] px-2 py-1.5 flex items-center justify-center text-center text-[16px] font-bold text-stone-800 leading-snug rounded-lg border transition-colors cursor-text ${
                                isFocusedBlank
                                  ? 'bg-white border-[#A9CCE3]'
                                  : 'bg-white/70 border-stone-200/70'
                              }`}
                            >
                              {answers[sq.id]
                                ? <span className="break-all">{answers[sq.id]}</span>
                                : <span className="text-stone-300 text-[15px]">タップ</span>}
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
              // 表示ルール3：右側の解答欄カードには設問文自体は含めず、
              // 設問マーカー（(ア)/(1)/問2 など）のみを表示する。
              const sqAllIndex = ((currentQuestion?.subQuestions || []) as any[]).indexOf(sq);
              // (1) の中が ①② に分かれている設問では "(1)①" のように枝番まで出す。
              // そうしないと解答欄に "(1)" が並び、今どれを入力中か分からなくなる。
              const sqMarker = answerCardMarker(sq, sqAllIndex < 0 ? gIdx : sqAllIndex, currentQuestion);
              return (
                <div key={sq.id} className={`flex flex-col gap-4 bg-white p-5 rounded-2xl shadow-sm border transition-all duration-250 ${
                  isFocusedCard ? 'border-[#A9CCE3] ring-2 ring-[#A9CCE3]/30' : 'border-gray-200 hover:border-[#A9CCE3]/50'
                }`}>
                  {/*
                    ★リスニング：この解答カードには「解答」だけを置く
                    ------------------------------------------------------------
                    ご指摘：
                      「再生ボタンはさ、左の問題の文章のところにおいてほしいよね。
                        何で解答の方に置くの？第１問の図も何で解答の方にあるの？
                        問題の方（左側）においてっていったよね」

                    そこで音源・図・設問文はすべて問題文ペイン（左側）へ移した。
                    ここに残すのは 問N のマーカーと選択肢（①〜④）だけ。
                    化学など従来の問題は listeningUnified=false なので、
                    これまでどおり設問マーカー＋入力UIの形のまま。
                  */}
                  <div className="flex flex-col gap-3.5 w-full min-w-0">
                    {/* 設問マーカー（(ア)/(1)/問2 など）。
                        リスニングでは設問文の本体は左ペインにあるので、
                        ここは「いまどの問の解答欄か」を示す目印だけ。 */}
                    <span className={`font-bold text-[#2C3E50] text-sm text-left bg-blue-50/45 border border-[#A9CCE3]/25 py-2 px-4 rounded-xl leading-relaxed shadow-xs w-fit block ${questionNeedsMathPalette ? 'font-math math-content' : ''}`}>
                      {formatText(sqMarker)}
                    </span>
                    
                    {sq.type === 'multiple_choice' ? (
                      // ★英語リスニング（音源つき／選択肢本文つき）は、スマホでも
                      //   選択肢をこのカード内にそのまま出す。
                      //   下部パネルに飛ばすと「問題文はカード・解答はパネル」と
                      //   離れてしまい、ご要望の「分離しない」に反するため。
                      //   化学など従来の問題は、これまでどおり下部固定パネルを使う。
                      isDesktop || listeningUnified ? (
                        // PC版・リスニング：選択肢ボタンをインライン表示。
                        renderMultipleChoiceControl(sq)
                      ) : (
                        // スマホ版：表示専用チップ。タップで下部固定パネルに選択UIを表示（要件1）。
                        <button
                          type="button"
                          id={`ans-card-${sq.id}`}
                          onClick={() => setFocusedSubId(sq.id)}
                          aria-label={`${sq.label} の解答を選択`}
                          // タップ領域は 48px 以上（44px の最小推奨に余裕を持たせる）。
                          className={`relative w-full text-left px-4 py-3 min-h-[3.25rem] flex items-center text-[16px] rounded-xl border shadow-sm transition-all font-modern leading-relaxed break-words cursor-pointer ${
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
                          // タップ領域は 48px 以上（44px の最小推奨に余裕を持たせる）。
                          className={`relative w-full text-left px-4 py-3 min-h-[3.25rem] flex items-center text-[16px] rounded-xl border shadow-sm transition-all font-modern leading-relaxed break-words cursor-pointer ${
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
                            {requiresChemicalSymbols(sq) && (
                              <ChemistryPalette
                                value={answers[sq.id] || ''}
                                onChange={(next) => handleTextChange(sq.id, next)}
                                inputRef={getInputRef(sq.id)}
                              />
                            )}
                            {/* 数学記号パレット（数III積分など requiresMathPalette の問題のみ） */}
                            {requiresMathSymbols(sq) && (
                              <MathPalette
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
                            // 記述・計算は複数行を書くため、他形式より広い高さ（約 80px）を確保する。
                            className={`relative w-full text-left pl-10 pr-4 py-3 min-h-[5rem] text-[16px] rounded-xl border transition-all font-modern leading-relaxed whitespace-pre-wrap break-words cursor-text ${
                              focusedSubId === sq.id
                                ? 'border-[#A9CCE3] ring-2 ring-[#A9CCE3]/40 bg-white'
                                : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <Edit3 className="absolute left-3 top-3.5 text-gray-400" size={17} />
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
                            {requiresChemicalSymbols(sq) && (
                              <ChemistryPalette
                                value={answers[sq.id] || ''}
                                onChange={(next) => handleTextChange(sq.id, next)}
                                inputRef={getInputRef(sq.id)}
                              />
                            )}
                            {/* 数学記号パレット（requiresMathPalette の問題のみ・カーソル位置に挿入） */}
                            {requiresMathSymbols(sq) && (
                              <MathPalette
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
                            // タップ領域は 48px 以上（44px の最小推奨に余裕を持たせる）。
                            className={`relative w-full text-left pl-10 pr-4 py-3 min-h-[3.25rem] flex items-center text-[16px] rounded-xl border shadow-sm transition-all font-modern leading-relaxed break-words cursor-text ${
                              focusedSubId === sq.id
                                ? 'border-[#A9CCE3] ring-2 ring-[#A9CCE3]/40 bg-white'
                                : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
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
                  disabled={!canGoPrevious}
                  title="前の問題へ（←キー）"
                  aria-label="前の問題へ"
                  className={`flex items-center justify-center p-2.5 rounded-xl font-bold transition-all duration-200 border-2 shrink-0 cursor-pointer
                    ${!canGoPrevious 
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
              disabled={!canGoPrevious}
              title="前の問題へ"
              aria-label="前の問題へ"
              className={`flex items-center justify-center p-3 rounded-xl font-bold transition-all duration-200 border-2 shrink-0 cursor-pointer
                ${!canGoPrevious
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
          id="floating-answer-bar"
          className="fixed left-0 right-0 z-[60] bg-white border-t-2 border-[#A9CCE3]/60 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] px-3 pt-3 transition-[bottom] duration-150"
          style={{
            bottom: keyboardOffset,
            // キーボード非表示時（オフセット0）はセーフエリア分の余白を確保
            paddingBottom: keyboardOffset > 0 ? '0.5rem' : 'calc(0.5rem + env(safe-area-inset-bottom))',
          }}
        >
          <div className="max-w-2xl mx-auto flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              {/* 表示ルール3：解答入力パネルにも設問マーカーのみを表示（設問文は左の問題文欄で読む）。
                  枝番（①②）まで含めることで、入力中の設問がひと目で分かるようにする。 */}
              <span className={`font-bold text-[#2C3E50] text-[13px] bg-blue-50/60 border border-[#A9CCE3]/40 px-3 py-1.5 rounded-lg truncate ${questionNeedsMathPalette ? 'font-math' : ''}`}>
                {formatText(answerCardMarker(focusedSub, focusedIndex, currentQuestion))}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {inputNavSubs.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => moveFocus(-1)}
                      disabled={focusedIndex <= 0}
                      aria-label="前の空欄へ"
                      // 空欄移動は入力中に最も多く押すボタン。44px 相当の高さを確保する。
                      className={`flex items-center justify-center gap-0.5 px-3 py-2.5 min-h-[2.75rem] rounded-lg text-[13px] font-bold border transition-colors ${
                        focusedIndex <= 0
                          ? 'border-gray-200 text-gray-300 bg-gray-50'
                          : 'border-[#A9CCE3] text-[#2C3E50] bg-white active:bg-[#A9CCE3]/20'
                      }`}
                    >
                      <ChevronLeft size={16} className="stroke-[2.5]" />
                      前へ
                    </button>
                    <span className="text-xs text-gray-400 font-bold tabular-nums">
                      {focusedIndex + 1}/{inputNavSubs.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => moveFocus(1)}
                      disabled={focusedIndex >= inputNavSubs.length - 1}
                      aria-label="次の空欄へ"
                      className={`flex items-center justify-center gap-0.5 px-3 py-2.5 min-h-[2.75rem] rounded-lg text-[13px] font-bold border transition-colors ${
                        focusedIndex >= inputNavSubs.length - 1
                          ? 'border-gray-200 text-gray-300 bg-gray-50'
                          : 'border-[#A9CCE3] text-[#2C3E50] bg-white active:bg-[#A9CCE3]/20'
                      }`}
                    >
                      次へ
                      <ChevronRight size={16} className="stroke-[2.5]" />
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
                  className="flex items-center justify-center px-4 py-2.5 min-h-[2.75rem] rounded-lg text-[13px] font-bold border border-[#2C3E50] bg-[#2C3E50] text-white active:bg-[#1B2631]"
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
            {/* 選択肢・並べ替えはボタンを 48px 級に拡大したぶん縦に伸びるため、
                スクロール領域を 42vh → 46vh に広げ、一覧性を保つ。 */}
            {focusedSub.type === 'multiple_choice' ? (
              <div className="max-h-[46vh] overflow-y-auto py-1">
                {/*
                  ★英語リスニング（スマホ・固定パネル）
                  ──────────────────────────────────────────────
                  ご指摘「再生ボタンはさ、左の問題の文章のところにおいてほしいよね。
                  何で解答の方に置くの？／第１問の図も何で解答の方にあるの？
                  問題の方（左側）においてっていったよね」を反映し、
                  音源プレイヤーと図はこの解答パネルからは完全に取り除き、
                  「問題」側（左ペインの現在の問ブロック）だけに置く。
                  ここは選択肢だけを表示する。
                  ※リスニングは isDesktop || listeningUnified の分岐により
                  そもそもこの固定パネルへ来ないが、二重表示の再発を防ぐため
                  実装からも除去しておく。
                */}
                {renderMultipleChoiceControl(focusedSub)}
              </div>
            ) : focusedSub.type === 'sorting' ? (
              <div className="max-h-[46vh] overflow-y-auto py-1">
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
                  // 行数（スマホ入力UI改善）
                  // ─────────────────────────────────────────
                  // 短答でも rows=1 は入力域が窮屈で、化学式の上付き・下付きが
                  // 詰まって見えるため 2 行に広げる。記述・計算は 3 行に広げ、
                  // 書いた内容を読み返しながら続きを書けるようにする。
                  rows={focusedSub.type === 'descriptive' ? 3 : 2}
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
                  className={`w-full px-3.5 py-3 text-[16px] rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none resize-none font-modern bg-gray-50 focus:bg-white leading-relaxed ${
                    focusedSub.type === 'descriptive' ? 'min-h-[6rem]' : 'min-h-[4.5rem]'
                  }`}
                />

                {/* 化学記号パレット（要件4：必要な問題のみ表示） */}
                {questionNeedsChemPalette && requiresChemicalSymbols(focusedSub) && (
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

                {/* 数学記号パレット（数III積分など requiresMathPalette の問題のみ表示） */}
                {questionNeedsMathPalette && requiresMathSymbols(focusedSub) && (
                  <div className="max-h-[28vh] overflow-y-auto">
                    <MathPalette
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

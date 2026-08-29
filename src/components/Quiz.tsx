import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Edit3, ArrowLeft, GripVertical, Trophy, HelpCircle } from 'lucide-react';
import { formatText } from '../utils/textFormatter';
// 記号パレット（解答入力の補助キーボード）は components/SymbolPalette.tsx に切り出した。
// KaTeX / mhchem の組版とサニタイズもそちらに移したので、
// このファイルは「どの設問に出すか」を判定して置くだけになった。
import { ChemistryPalette, MathPalette } from './SymbolPalette';
// 並べ替え（sorting）の解答UIは components/SortingControl.tsx に切り出した。
import { SortingControl } from './SortingControl';
import { MultipleChoiceControl } from './MultipleChoiceControl';
// 消去法（斜線）のしくみ一式は hooks/useElimination.ts に集約
import { useElimination } from '../hooks/useElimination';
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
// 章 × モードごとの保存キー名は utils/quizStorageKeys.ts が唯一の定義
import {
  quizAnswersKey,
  quizElimKey,
  quizExplKey,
  quizIndexKey,
  quizStepKey,
} from '../utils/quizStorageKeys';
// 章の途中経過（点数・コンボ・所要時間）の型と読み書きは utils/quizRunState.ts に集約
import {
  clearRun,
  loadRun,
  saveRun,
  type ChapterRunState,
} from '../utils/quizRunState';
// 記号パレットを「この設問に出すか」の判定ルールは utils/quizPaletteRules.ts に集約
import {
  requiresChemicalSymbols,
  requiresMathSymbols,
} from '../utils/quizPaletteRules';
// スマホでソフトウェアキーボードに入力欄が隠れないようにするスクロール調整
import { handleInputFocusScroll, scrollInputIntoView } from '../utils/quizInputScroll';
// 設問ラベルからの空欄トークン推定と短答判定（純関数）
import {
  blankHighlightVariants,
  extractBlankToken,
  isShortAnswerType,
} from '../utils/quizBlanks';
import { isAnswerCorrect, isDescriptive } from '../utils/answerJudge';
// cleanQuestionText は解説画面（Explanation.tsx）と同じ実装が必要なので
// questionDisplay.ts の1つだけを使う（以前はここにも同じ実装があった）。
import { answerCardMarker, buildSubQuestionList, splitQuestionLabel, isSubQuestionListRedundant, extractInlineQuestionRows, findSubQuestionSentence, cleanQuestionText, optionCircledMark } from '../utils/questionDisplay';
import {
  buildListeningOptionTexts,
  buildListeningLeadText,
  extractListeningDifficulty,
  stripListeningDifficulty,
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
 * 章の途中経過（点数・コンボ・所要時間）の型と localStorage 読み書きは
 * utils/quizRunState.ts に集約した（この画面の描画とは無関係な下請け処理）。
 * 保存キーは従来どおり quizStorageKeys.ts の quizRunKey を使う。
 */

/**
 * 記号パレットを出すかどうかの判定（answerNeedsPalette / requiresChemicalSymbols /
 * requiresMathSymbols）は utils/quizPaletteRules.ts に集約した。
 * 画面の描き方に依存しない純関数なので、単体で確かめられる場所に置く。
 */

/**
 * ソフトウェアキーボードで入力欄が隠れないようにするスクロール調整
 * （scrollInputIntoView / handleInputFocusScroll）は
 * utils/quizInputScroll.ts に切り出した。
 *
 * 設問ラベルからの空欄トークン推定と短答判定
 * （extractBlankToken / blankHighlightVariants / isShortAnswerType）は
 * utils/quizBlanks.ts に切り出した。
 */
/**
 * 記号パレット（PaletteButton / SymbolPalette / ChemistryPalette / MathPalette）は
 * components/SymbolPalette.tsx に切り出した。
 * 解答入力欄のカーソル位置に文字を挿入するだけの独立した部品で、
 * クイズの進行（採点・タイマー・ページ送り）とはやり取りしない。
 */

export function Quiz({ mode, chapter, onFinish, onBack, isGuest, isMobileView, onExplanationChange, onScored, questionRange }: QuizProps) {
  // ===== タイマー & スコア用 state =====
  const [run, setRun] = useState<ChapterRunState>(() => loadRun(chapter.id, mode));
  const timeUsedRef = useRef(0); // タイマーから250msごとに通知される最新値
  const lastScoredQuestionRef = useRef<string | null>(null);
  // 記述/短答入力欄の参照を sub-question id 単位で保持（化学記号パレットの
  // カーソル位置挿入に使用）。
  const inputRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});
  // 「前へ/次へ」やキーボードの「次へ(next)」でフォーカスを移すとき、
  // 再レンダー後に描画前（同期）で確実に .focus() するための一時保持。
  // iOS でソフトキーボードが一瞬閉じてしまう不具合の防止に用いる。
  const pendingFocusIdRef = useRef<string | null>(null);
  // 問題文ペインのスクロールコンテナ。スマホでキーボード表示中に
  // 「いま入力している穴抜きのカッコ」（黄色ハイライト）へ自動スクロール
  // させるために使う（ご要望：「問題(穴抜きなどのカッコの場所)は見えるようにしたい」）。
  const problemScrollRef = useRef<HTMLDivElement | null>(null);
  const getInputRef = (sqId: string): React.RefObject<HTMLInputElement | HTMLTextAreaElement | null> => ({
    get current() {
      return inputRefs.current[sqId] ?? null;
    },
    set current(el: HTMLInputElement | HTMLTextAreaElement | null) {
      inputRefs.current[sqId] = el;
    },
  });

  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    parseStoredStringRecord(localStorage.getItem(quizAnswersKey(chapter.id, mode))),
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const questionCount = mode === 'mini_test'
      ? (chapter.miniTest || []).length
      : (chapter.practiceProblems || []).length;
    return parseStoredNonNegativeInteger(
      localStorage.getItem(quizIndexKey(chapter.id, mode)),
      Math.max(0, questionCount - 1),
    );
  });
  const [showingExplanation, setShowingExplanation] = useState(() => {
    return localStorage.getItem(quizExplKey(chapter.id, mode)) === 'true';
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
    parseStoredNonNegativeInteger(localStorage.getItem(quizStepKey(chapter.id, mode))),
  );

  useEffect(() => {
    localStorage.setItem(quizAnswersKey(chapter.id, mode), JSON.stringify(answers));
  }, [answers, chapter.id, mode]);

  useEffect(() => {
    localStorage.setItem(quizStepKey(chapter.id, mode), stepIndex.toString());
  }, [stepIndex, chapter.id, mode]);

  useEffect(() => {
    localStorage.setItem(quizIndexKey(chapter.id, mode), currentQuestionIndex.toString());
  }, [currentQuestionIndex, chapter.id, mode]);

  useEffect(() => {
    localStorage.setItem(quizExplKey(chapter.id, mode), showingExplanation.toString());
  }, [showingExplanation, chapter.id, mode]);

  // ────────────────────────────────────────────────────────────────
  // 消去法（選択肢に斜線を引く）
  // ────────────────────────────────────────────────────────────────
  // 消去状態・端末への保存・斜線を引く／戻す・長押しでまとめて戻す・
  // 操作説明の初回表示、という一連の部品は hooks/useElimination.ts に
  // まとめた（Quiz.tsx で約 110 行を占めていた）。
  //
  // ★変えてはいけない設計：消去状態は採点対象の解答（answers）とは
  //   完全に別に持つ。混ぜると「消したつもりが解答になっていた」という
  //   取り違えが起きる。採点は answers のみを見る。
  const {
    eliminated,
    isEliminated,
    restoreOption,
    clearEliminated,
    strikeOptionAnimated,
    justStruck,
    beginLongPress,
    endLongPress,
    longPressFired,
    elimHintOpen,
    setElimHintOpen,
    dismissElimHint,
  } = useElimination(chapter.id, mode);

  // New state for layout and highlighting
  const [isProblemExpanded, setIsProblemExpanded] = useState(false);
  // ★スマホ：問題文ペインを「見出しだけ」にたたむトグル（ご要望）。
  // 長い問題文が画面上半分を占領して解答欄が狭くなる問題への対策。
  // たたむと下の解答ペインがほぼ全画面になり、入力に集中できる。
  // 短い問題（もともと h-auto で収まる）には影響しない。
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  // 現在フォーカス中の短答穴埋め設問ID（フローティング入力欄・空欄ハイライト用）
  const [focusedSubId, setFocusedSubId] = useState<string | null>(null);
  // スマホ：解答欄に「いま表示する1設問」のインデックス（ページ送り方式）。
  // ご指摘：「上下スクロールして(1)、(2)っていう入力欄を押して入力してく
  //         じゃん？それやめよう。(1)の入力欄を下半分に最初固定した状態に
  //         して。解答欄の右と左に黒の小さな矢印を置いて、固定する解答欄を
  //         変えるようにしてくれない？解答欄のスクロールがすごいうざい」
  // スマホでは全設問を縦に並べず、1設問ずつこの番号の欄だけを表示する。
  const [mobileAnsIdx, setMobileAnsIdx] = useState(0);
  // リスニング：問題の説明ページ（ブリーフィング）を表示中か。
  // ご要望：「これらの問題の説明は第1回演習とかのボタンを押した後に、
  //          問題を出すまえに問題の説明のページを作ってそこに書いてほしい」
  // 流れ：回を選ぶ → 説明ページ → 問1 → 問1の解説 → 問2 → …
  // 解答中の画面からはリード文（毎回同じ説明）を撤去し、
  // その分のスペースを選択肢・図の表示に当てる。
  const [showingBriefing, setShowingBriefing] = useState(false);
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
  // 【俯瞰UIの廃止】以前はスマホでも PC 版レイアウトを縮小表示（俯瞰UI）して
  // いたが、「解答と解説の文字が小さい」というご指摘のとおり初期表示が極小に
  // なるため廃止。スマホでは Explanation 側のスマホ専用レイアウト
  // （問題文を上部に固定＋正誤一覧→タップで解説）で表示する。
  // isMobileView が未指定なら Explanation 自身のメディアクエリ判定に任せる。
  const isMobileForExplanation = isMobileView;

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
    // 新しい問題では最初の設問（(1)・(ア) など）の解答欄から始める。
    setMobileAnsIdx(0);
    // 問題が変わったら「問題文をたたむ」状態は解除する。
    // 新しい問題の本文を読まずに解き始めてしまう事故を防ぐ。
    setIsProblemCollapsed(false);
    // 消去法の操作説明は「初回のみ」。1問でも先へ進んだら既読として
    // 自動で閉じる（閉じるボタンを押し忘れても2問目からは出ない）。
    if (currentQuestionIndex > 0 && elimHintOpen) {
      try {
        if (localStorage.getItem('quiz_elim_hint_seen') !== 'true') {
          localStorage.setItem('quiz_elim_hint_seen', 'true');
          setElimHintOpen(false);
        }
      } catch { /* 保存不可の環境ではそのまま */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // ★入力欄は「カード内の実入力欄」1つだけ（ご指摘「タップしたらなんで
    //   重複して解答欄が出てくるかわからん」への対応で、下部バーの複製
    //   入力欄を廃止した）。前へ/次へでの移動先もカード内の入力欄になる。
    const el = inputRefs.current[focusedSubId] ?? null;
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

  // 選択中の空欄（focusedSubId）が変わったら、そのカード内の入力欄へ
  // 実フォーカスを移してソフトキーボードを開く。
  //
  // ★入力欄は「カード内」の1か所だけ（ご指摘対応）
  // ─────────────────────────────────────────────
  // ご指摘：「タップしたらなんで重複して解答欄が出てくるかわからん。
  //          普通に入力できるようにしてよ。」
  // 以前は「カード＝表示専用チップ／実入力＝下部バーの複製入力欄」の
  // 2段構えで、同じ設問の解答欄が画面に2つ見えていた。
  // いまはカード内の入力欄に直接書き込む方式なので、フォーカスも
  // カード内の入力欄（inputRefs）へ移すだけでよい。
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
      const el = inputRefs.current[focusedSubId] ?? null;
      // すでにフォーカス済み（useLayoutEffect で処理済み・ユーザーの直接タップ等）
      // なら二重処理しない
      if (el && document.activeElement !== el) {
        el.focus({ preventScroll: true });
        try {
          const len = (el.value || '').length;
          (el as any).setSelectionRange?.(len, len);
        } catch {
          /* noop */
        }
      }
      // 選択中の入力欄がキーボード・下部バーに隠れないようスクロール
      if (el) setTimeout(() => scrollInputIntoView(el), 320);
    });
    return () => cancelAnimationFrame(raf);
  }, [focusedSubId, isDesktop]);

  // ─────────────────────────────────────────────
  // G-3：キーボード表示中でも「いま入力している穴抜きのカッコ」が見えるようにする
  // ─────────────────────────────────────────────
  // ご要望：「文字の入力欄を出す時に、全体が上に上がりすぎて問題が見えなく
  //          なるので、うまいこと工夫して問題(穴抜きなどのカッコの場所)は
  //          見えるようにしたい」
  // キーボード表示中は問題ペインが max-h-[24vh] に縮むが、縮んだだけでは
  // 該当の空欄が画面外（スクロール下）にあることが多い。そこで、
  // フォーカス中の空欄に対応する黄色ハイライト（<mark>）を問題ペイン内で
  // 探し、ペインのスクロール位置をそのハイライトが中央に来るよう合わせる。
  // ハイライトの描画（combinedHighlights 反映）後に走らせたいので
  // 少し遅延させる。ページ全体は fixed なので window は動かない。
  useEffect(() => {
    if (isDesktop) return;
    if (!focusedSubId) return;
    const timer = setTimeout(() => {
      const pane = problemScrollRef.current;
      if (!pane) return;
      const mark = pane.querySelector('mark');
      if (!mark) return;
      const paneRect = pane.getBoundingClientRect();
      const markRect = (mark as HTMLElement).getBoundingClientRect();
      // ペイン内でのハイライトの相対位置 → ペインの中央に来る scrollTop
      const offsetInPane = markRect.top - paneRect.top + pane.scrollTop;
      const target = Math.max(0, offsetInPane - pane.clientHeight / 2 + markRect.height / 2);
      pane.scrollTo({ top: target, behavior: 'smooth' });
    }, 200);
    return () => clearTimeout(timer);
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

  /**
   * 選択式（単一・複数）の解答UIは components/MultipleChoiceControl.tsx に切り出した。
   * 消去法（斜線）・長押しでまとめて戻す・リスニングの選択肢本文表示などを
   * 抱えて 359 行あったため、独立したファイルへ移した。
   * state（eliminated / elimHintOpen）は問題切り替え時のリセットや
   * localStorage 保存が Quiz 側にあるので動かさず、props で渡している。
   */
  const renderMultipleChoiceControl = (sq: any) => (
    <MultipleChoiceControl
      sq={sq}
      answers={answers}
      onSelect={handleOptionSelect}
      eliminated={eliminated}
      isEliminated={isEliminated}
      restoreOption={restoreOption}
      strikeOptionAnimated={strikeOptionAnimated}
      beginLongPress={beginLongPress}
      endLongPress={endLongPress}
      elimHintOpen={elimHintOpen}
      setElimHintOpen={setElimHintOpen}
      dismissElimHint={dismissElimHint}
      listeningOptionTexts={listeningOptionTexts}
      isEnglishProse={isEnglishProse}
      justStruck={justStruck}
      longPressFired={longPressFired}
      listeningMobileNoFigure={listeningMobileNoFigure}
    />
  );

  /**
   * 並べ替え（sorting）の解答UIは components/SortingControl.tsx に切り出した。
   * ドラッグ＆ドロップ（PC）とタップ入れ替え（スマホ）の2系統を抱えて
   * 188 行あったため、独立したファイルへ移した。
   * state（draggingIndex / dragOverIndex / tapSortSelect）は
   * 問題切り替え時のリセットが下の useEffect にあるので Quiz 側に残し、
   * props で渡している。
   */
  const renderSortingControl = (sq: any) => (
    <SortingControl
      sq={sq}
      answers={answers}
      onSelect={handleOptionSelect}
      isDesktop={isDesktop}
      draggingIndex={draggingIndex}
      setDraggingIndex={setDraggingIndex}
      dragOverIndex={dragOverIndex}
      setDragOverIndex={setDragOverIndex}
      tapSortSelect={tapSortSelect}
      setTapSortSelect={setTapSortSelect}
    />
  );

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
  // スマホ：解答欄の「1設問ずつページ送り」表示（ご指摘対応）
  // ────────────────────────────────────────────────────────────────
  //
  // ご指摘：「上下スクロールして(1)、(2)っていう入力欄を押して入力してく
  //          じゃん？それやめよう。(1)の入力欄を下半分に最初固定した状態に
  //          して。解答欄の右と左に黒の小さな矢印を置いて、固定する解答欄を
  //          変えるようにして。解答欄のスクロールがすごいうざい」
  //
  // 全設問のカードを縦に並べる（＝スクロールさせる）のをやめ、
  // 「いま答える1設問の解答欄」だけを下半分に固定表示する。
  // 移動は左右の黒矢印（と、キーボード表示中は下部バーの前へ/次へ）のみ。
  //
  // mobileAnswerSubs はページ送りの単位となる設問のフラットな一覧。
  // グループ（(ア)(イ)…の空欄グリッド）も1空欄＝1ページに分解し、
  // 「どのページでも解答欄は常に1つ」を保証する。
  const mobileAnswerSubs = useMemo(() => {
    const list: { sq: any; groupName?: string; gType: 'single' | 'group' }[] = [];
    visibleGroupedSubQuestions.forEach((g: any) => {
      (g.items || []).forEach((sq: any) => {
        list.push({ sq, groupName: g.type === 'group' ? g.groupName : undefined, gType: g.type });
      });
    });
    return list;
  }, [visibleGroupedSubQuestions]);

  // データ変化でインデックスが範囲外になっても落ちないよう必ず丸める。
  const safeMobileAnsIdx = Math.min(
    Math.max(0, mobileAnsIdx),
    Math.max(0, mobileAnswerSubs.length - 1),
  );

  // 実際に描画するグループ一覧。PC は従来どおり全設問を縦に並べ、
  // スマホは「現在ページの1設問」だけを含む1グループに絞る。
  const renderedAnswerGroups = useMemo(() => {
    if (isDesktop) return visibleGroupedSubQuestions;
    const cur = mobileAnswerSubs[safeMobileAnsIdx];
    if (!cur) return visibleGroupedSubQuestions;
    return [{ type: cur.gType, groupName: cur.groupName, items: [cur.sq] }] as any[];
  }, [isDesktop, visibleGroupedSubQuestions, mobileAnswerSubs, safeMobileAnsIdx]);

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

  /**
   * ★ご要望11「あと解説と問題でフォント違うの何？」★
   *
   * 英語（リスニング・英文法）の問題文・選択肢は「英語の散文」なので、
   * 化学式の体裁付け（英字をセリフ体の span で包む処理）を通してはいけない。
   * 通すと "The" "umbrella" のような単語まで化学式扱いになり、
   *   font-family: 'Cambria Math','Times New Roman', serif
   * がインライン style で当たって、日本語（ゴシック）と書体が食い違う。
   * これが「問題と解説でフォントが違う」とご指摘いただいた現象そのもの。
   *
   * ★科目名で分岐しない★
   *   'english_listening' などの科目名で切り替えると、
   *   将来ほかの科目に英文を入れたときに取り残される。
   *   英文を読み上げる音源（audioTracks）を持つのは英語の問題だけなので、
   *   「その問題自身が英文の音源を持っているか」という
   *   問題ごとの事実で判断する（ご指摘「コードで形式的に作ると
   *   問題によっておかしくなる」を避けるため）。
   */
  const isEnglishProse = useMemo(() => {
    const tracks = (currentQuestion as any)?.audioTracks;
    return Array.isArray(tracks) && tracks.length > 0;
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

  /*
    スマホ：小問行を横並びにできる問題かどうか（ご要望8）
    ─────────────────────────────────────────────
    「(1)から4問縦書きになってるけど、横書きにしたら1画面に収まるくない？」

    ★科目で決め打ちしない（ご注意9）
      全 262 問を実測すると、行頭マーカー行の本文は
        数学     … 10〜22 文字
        化学基礎 … 最大 157 文字
      と問題ごとにまったく違う。「数学だから横」にすると化学基礎の
      長い小問まで横に並べて崩れるので、判定は
      extractInlineQuestionRows() に任せ「その問題自身が短いか」で決める。
      条件を満たさない問題は null が返り、従来の縦積みにフォールバックする。

    PC（isDesktop）では常に null にして、これまでの表示を一切変えない。
  */
  const inlineQuestionRows = useMemo(
    () => (isDesktop ? null : extractInlineQuestionRows(cleanQuestionText(currentQuestion?.text || ''))),
    [isDesktop, currentQuestion?.text]
  );

  /*
    スマホ：設問一覧が問題文の丸写しなら出さない（ご要望8）
    ─────────────────────────────────────────────
    「設問一覧と問題が同じなので、同じやつはもう設問一覧いらない」

    こちらも科目では決めず、「一覧の全項目が問題文に含まれるか」を
    問題ごとに判定する（1 項目でも欠ければ一覧を残す＝情報を消さない）。
  */
  const hideRedundantSubQuestionList = useMemo(
    () => !isDesktop && isSubQuestionListRedundant(currentQuestion),
    [isDesktop, currentQuestion]
  );

  // 下部ナビバー（前へ/次へ）の対象となる設問。
  //
  // ★テキスト入力（短答穴埋め・記述/計算）だけに絞る（ご指摘対応）
  // ─────────────────────────────────────────────
  // ご指摘：「タップしたらなんで重複して解答欄が出てくるかわからん。
  //          普通に入力できるようにしてよ。」
  // 以前は選択式・並べ替えも含めて「カードをタップ→下部の固定パネルに
  // もう1つ解答UIを出す」方式だったため、同じ設問の解答欄が
  // 画面に2つ並んで見えていた。いまは全形式ともカード内で直接解答する
  // 方式に統一したので、下部バーの役割は
  //   「ソフトキーボード表示中の空欄移動（前へ/次へ）＋記号パレット」
  // だけになった。キーボードを使うのはテキスト入力の設問だけなので、
  // ナビ対象もテキスト入力の設問だけにする。
  const inputNavSubs = useMemo(() => {
    if (!currentQuestion) return [] as any[];
    return (currentQuestion.subQuestions || []).filter(
      (sq: any) => isShortAnswerType(sq) || sq.type === 'descriptive',
    );
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

  /**
   * スマホのリスニングで「高さの配り方を逆にする」レイアウトを使うか。
   *
   * ご指摘（第1問B のスマホ画面）：
   *   「選択肢のところが固定されてるけど、選択肢の下に空白合って無駄だから、
   *     まず固定するならもっと下にもってきて、図が隠れてるのを防いでほしい」
   *
   * true のとき
   *   ・解答ペイン（①〜④）… 中身の高さだけ取り、画面下部（下部ナビの真上）へ
   *   ・問題文ペイン       … 残りの高さを全部もらう ＝ 図が大きく出る
   * となる。
   *
   * ★PC・キーボード表示中・問題文の全画面表示中は使わない★
   *   ・PC は左右分割なので高さの取り合いが起きない
   *   ・キーボード表示中は入力欄をキーボードの上に見せる従来ロジックを優先
   *   ・全画面表示中は問題文ペインが absolute inset-0 になり無関係
   */
  const listeningMobileSplit =
    !isDesktop && listeningUnified && !isProblemExpanded && !isProblemCollapsed && !keyboardVisible;

  /**
   * いま解いている問に「図」があるか。
   *
   * ★余った高さを誰にあげるかを、これで切り替える★
   *   第1問B（イラスト選択）… 図がある。余りは図にあげる（大きく見せたい）
   *   第1問A・第3問・第2問  … 図が無い。余りを問題文ペインにあげても
   *                            「再生ボタンの下に巨大な空白」になるだけ。
   *
   * ご要望「他の大問のUIも変えてくれない？第1問Aも第3問もこれから入る予定の
   * 第2問とその他も」への対応の要。第1問B 用に入れた
   * 「問題文ペイン＝flex-1」をそのまま他の大問に適用すると、
   * 図が無いぶんの高さが丸ごと死んだ空白になってしまう
   *（＝ご指摘いただいた「下に空白があって無駄」が場所を変えて再発する）。
   */
  const activeStepHasFigure = !!activeStepSub?.imageUrl;

  /**
   * リスニング（スマホ）で「図が無い大問」のレイアウトを使うか。
   *
   * true のとき
   *   ・問題文ペイン … 中身の高さだけ（設問文＋再生ボタンで十分足りる）
   *   ・解答ペイン   … 残りの高さをもらい、選択肢を下端（下部ナビの真上）へ寄せる
   *   ・選択肢       … 余った高さのぶんだけ背を伸ばして押しやすくする
   *                    （ただし伸ばしすぎない上限つき）
   *
   * 図がある第1問B は従来どおり listeningMobileSplit の配り方
   *（問題文ペイン＝flex-1）を使う。
   */
  const listeningMobileNoFigure = listeningMobileSplit && !activeStepHasFigure;

  // ────────────────────────────────────────────────────────────────
  // リスニング：回のはじまりに「問題の説明ページ」を出す
  // ────────────────────────────────────────────────────────────────
  // ご要望：「これらの問題の説明は第1回演習とかのボタンを押した後に、
  //          問題を出すまえに問題の説明のページを作ってそこに書いて欲しい。
  //          例) 第1回演習のボタンを押す→問題の説明のページを出す
  //              →問1のページに行く→問1の解説のページに行く」
  // Quiz は回（演習）を選ぶたびにマウントされるので、マウント時に
  // リスニングの回であれば説明ページから始める。化学などは従来どおり。
  useEffect(() => {
    if (listeningTracks.length > 0) setShowingBriefing(true);
    // 回のマウント時のみ（問の移動では再表示しない）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // スマホは「1ページ＝1解答欄」の固定表示なので、フォーカス移動先の
    // 入力欄が実際に描画されるよう、ページ（mobileAnsIdx）も同じ設問に合わせる。
    // （ページを合わせないと、フォーカス先の input が未マウントで移動できない）
    const pageIdx = mobileAnswerSubs.findIndex((m) => m.sq.id === target.id);
    if (pageIdx >= 0) setMobileAnsIdx(pageIdx);
  };

  /**
   * スマホの解答欄ページ送り（解答欄の左右に置いた黒の小さな矢印）。
   * dir=-1 で前の設問、dir=1 で次の設問へ。
   * ご要望：「(1)の入力欄を下半分に最初固定した状態にして、右と左の矢印で
   *          固定する解答欄を変える。解答欄のスクロールがすごいうざい」
   * テキスト入力中（キーボード表示中）に矢印で移動した場合は、
   * 移動先がテキスト設問ならフォーカスを引き継いでキーボードを維持する。
   */
  const goMobileAns = (dir: -1 | 1) => {
    if (mobileAnswerSubs.length === 0) return;
    const next = Math.min(mobileAnswerSubs.length - 1, Math.max(0, safeMobileAnsIdx + dir));
    if (next === safeMobileAnsIdx) return;
    setMobileAnsIdx(next);
    const target = mobileAnswerSubs[next]?.sq;
    const targetIsText = target && (isShortAnswerType(target) || target.type === 'descriptive');
    if (focusedSubId && targetIsText) {
      // キーボードを閉じさせないため blur せず、次フォーカス先を予約して
      // 再レンダー直後の useLayoutEffect で実 .focus() する（moveFocus と同じ方式）。
      pendingFocusIdRef.current = target.id;
      setFocusedSubId(target.id);
    } else if (focusedSubId) {
      // 移動先が選択式など入力欄なしの設問なら、入力状態は終了する。
      setFocusedSubId(null);
    }
  };

  /** この設問がテキスト入力ナビ（前へ/次へ）の最後か。Enter キーのヒントに使う。 */
  const isLastNavSub = (sq: any) => {
    const idx = inputNavSubs.findIndex((s: any) => s.id === sq.id);
    return idx < 0 || idx >= inputNavSubs.length - 1;
  };

  /**
   * スマホのカード内入力欄の Enter キー処理。
   * ・短答（input）    : Enter＝次の空欄へ移動。最後の空欄なら入力を確定して閉じる。
   * ・記述（textarea） : Enter＝通常の改行。最後の設問でも改行を優先する
   *                      （長い答案の途中で誤って閉じない）。
   * 入力欄はカード内の1か所だけなので、ここで移動すれば
   * 「解答欄が2つ出る」ことはない（ご指摘対応）。
   */
  const handleMobileCardKeyDown = (sq: any) => (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;
    if (sq.type === 'descriptive') return; // 記述は改行を許可
    e.preventDefault();
    const idx = inputNavSubs.findIndex((s: any) => s.id === sq.id);
    if (idx >= 0 && idx < inputNavSubs.length - 1) {
      moveFocus(1);
    } else {
      (e.currentTarget as HTMLElement).blur();
      setFocusedSubId(null);
    }
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
        clearRun(chapter.id, mode);
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

  /*
    リスニング：問題の説明ページ（ブリーフィング）
    ─────────────────────────────────────────────
    ご要望：「これらの問題の説明は第1回演習とかのボタンを押した後に、
             問題を出すまえに問題の説明のページを作ってそこに書いて欲しい。
             例) 第1回演習のボタンを押す→問題の説明のページを出す
                 →問1のページに行く→問1の解説のページに行く」

    回を選んだ直後に1枚だけ表示する。ここに
      ・回のタイトル（第1回　第1問 A（4問・2回読み） など）
      ・「短い英文が2回読まれます。…①〜④のうちから1つ選びなさい」の説明
      ・難易度
    をまとめ、解答中の画面からはこれらを撤去する。
    そのぶん解答画面は「問題＋選択肢が1画面に収まる」表示になる。
  */
  if (showingBriefing && listeningUnified && currentQuestion) {
    const lead = buildListeningLeadText(currentQuestion.text);
    const difficulty = extractListeningDifficulty(lead);
    return (
      <div className="fixed inset-0 w-full flex flex-col bg-gray-50 overflow-hidden z-40">
        {/* ヘッダー（戻る＝単元選択へ） */}
        <div className="flex-none flex items-center gap-2 md:gap-4 p-3 md:p-4 bg-white border-b border-gray-200">
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

        {/* 説明本文 */}
        <div className="flex-1 overflow-y-auto p-5 md:p-10">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-white text-xs bg-[#A9CCE3] py-1 px-3 rounded-full">
                  この回の説明
                </span>
                {difficulty && (
                  <span className="text-[11px] font-bold text-gray-400">
                    難易度：{difficulty}
                  </span>
                )}
              </div>
              <div className="text-[15px] md:text-base leading-[1.9] text-gray-800 font-modern break-words [overflow-wrap:anywhere]">
                <ExplanationBody text={stripListeningDifficulty(lead)} />
              </div>
              <p className="mt-5 text-xs text-gray-400 leading-relaxed">
                この説明は解答中の画面には出ません。落ち着いて読んでから始めてください。
              </p>
            </div>
          </div>
        </div>

        {/* 開始ボタン（下部固定・親指で押しやすい位置） */}
        <div className="flex-none bg-white border-t border-gray-200 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setShowingBriefing(false)}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold tracking-wider text-sm bg-[#2C3E50] text-white active:bg-[#1B2631] hover:bg-[#1B2631] shadow-md transition-all duration-200 cursor-pointer"
            >
              <span>問題をはじめる</span>
              <ChevronRight size={16} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full flex flex-col bg-gray-50 overflow-hidden z-40">
      
      {/*
        Header (Fixed)

        ★B-3：解答を打っている間だけ、上部の帯を引っ込める★
        ─────────────────────────────────────────────────────
        ご指摘：
          「解答打つ時にこんなに画面塞がれるとしんどい
            (ア) 前へ 1/9 次へ 完了のところは必要だけど、
            それ以外の☑️とか色々消せないの？
            どちらにせよこれだと回答打ちづらい」

        ■ まず画面の占有を、誰が出しているかで分けて数えた
          （いただいた画面／844px 高さ換算）
            アプリのヘッダー（単元名・スコア・1/4）    7%  ← アプリ側
            タイマーバー（残り 6:10）                3%  ← アプリ側
            問題ヘッダー（Q1 問題文・たたむ・全画面）   5%  ← アプリ側
            問題文＋解答欄（★本体★）               25%
            ブラウザの操作バー（< > ↻ ⇧ ⋮）          6%  ← ブラウザ側
            キーボードの ∧ ∨ ☑️ の行                6%  ← ★ブラウザ側★
            かなキーボード本体                      48%  ← ブラウザ側

        ■ ★正直に書きます：☑️ の行はこちらから消せません★
          お尋ねの「☑️とか」の行は、キーボード（IME）と
          ブラウザが出している部分で、Webページ側の CSS や
          JavaScript からは操作できません。合計 60% がここです。
          「消せます」と書くのは嘘になるので書きません。

        ■ できること＝アプリ側の 15%（約126px）を入力中だけ空ける
          ヘッダー・タイマー・問題ヘッダーは、
          文字を打っている最中には読む必要がないものです。
          keyboardVisible の間だけ引っ込めると
            本体 25% → 40%（211px → 337px、約1.6倍）
          になります。

        ■ 消さないもの
          ・「(ア) 前へ 1/9 次へ 完了」バー … 必要と明言されたので残す
          ・入力欄と問題文               … 本体
          ・ヘッダーの中身そのもの         … 消さずに「隠す」だけ。
            「完了」でキーボードが閉じれば即座に元に戻る。
        PC（isDesktop）には一切かからない条件にしてある。
      */}
      <div className={`flex-none p-2 md:p-6 border-b border-gray-200 bg-white shadow-sm z-10 flex items-center justify-between gap-2 md:gap-4 ${
        !isDesktop && keyboardVisible ? 'hidden' : ''
      }`}>
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

      {/* タイマーバー（ヘッダー直下、問題本文の上） ー 控えめな細いバー
          ★B-3：入力中は隠す（3%）★
            計測は running のまま続くので、隠しても時間の進みは変わらない。
            表示だけを止めている（＝止めたら不正になる、を避ける）。 */}
      <div className={`flex-none bg-white border-b border-gray-100 ${
        !isDesktop && keyboardVisible ? 'hidden' : ''
      }`}>
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

          ★スマホは全教科とも「問題文が上・解答が下」に統一する（ご要望）
          ------------------------------------------------------------------
          ご指摘：
            「問題文と解答入力を逆にして。(リスニングの話)
              選択肢を見せるということに気が取られて問題が見えない
              スクロールがしにくい　図も見えない。」

          以前はリスニングだけ上下反転（col-reverse）で解答ペインを上に
          出していたが、問題文が「下からせり出すカード」になってしまい
          ・問題文・図が見えない
          ・下のカードの中をスクロールする操作が難しい
          という本末転倒な状態だった。
          そこで自然な読み順（上＝問題 → 下＝解答）へ戻す。
          「問題と選択肢を同時に見る」は、リスニング時の問題ペインの
          高さ上限（下記 max-h-[40vh]）と再生ボタンのスリム化で満たす。
          PC は従来どおり「問題＝左 / 解答＝右」。 */}
      <div className={`flex-1 flex flex-col lg:flex-row overflow-hidden relative`}>

        {/* Section 1: Problem Text
            ★左右比は従来どおり 58% / 42%（勝手に変えない、というご指摘に対応）。 */}
        {/* スマホの高さ制御（ご要望「問題文が占領しすぎて入力しづらい」対策）：
            ・通常は max-h-[50%]（親＝ペインを分け合う箱の半分）。
              変遷：50vh → 42dvh → 50%。
                50vh  … iOS Safari の vh は URLバー込みの「最大の画面高さ」
                        基準なので、実表示領域では半分を大きく超えていた。
                42dvh … 実表示高さ基準にはなったが、基準がビューポート全体の
                        ままだったので、ヘッダーと下部ナビを引いた「実際に
                        ペインが分け合える高さ」に対しては 54〜56% を先取り
                        してしまい、解答欄が下部ナビの下へ押し出された。
                50%   … 基準を親に変更。ヘッダー・ナビを自動的に除いた上で
                        ちょうど半分になるので、ビューポートが変わっても、
                        問題文が18文字でも1031文字でも取り分が変わらない。
              短い問題は h-auto なので半分も使わず、余りは解答側に回る。
            ・ソフトキーボード表示中は max-h-[24vh] に自動で縮め、
              入力欄と入力内容がキーボードの上に必ず見えるようにする
            ・「たたむ」で見出しだけにして解答欄を最大化できる */}
        {/*
          ★リスニング（スマホ）は「高さの取り合い」を逆向きにする★
          ------------------------------------------------------------------
          ご指摘：
            「選択肢のところが固定されてるけど、選択肢の下に空白合って
              無駄だから、まず固定するならもっと下にもってきて、
              図が隠れてるのを防いでほしい」

          ■ 何が起きていたか
            以前は
              ・問題文ペイン … max-h-[40vh]（上限を先に決める）
              ・解答ペイン   … flex-1（余った高さを全部もらう）
            だった。すると
              ・問題文ペインは 40vh で打ち切られ、第1問B の
                4コマイラストが下半分から切れる（ご指摘「図が隠れてる」）
              ・一方で解答ペインは ①〜④ の4ボタンしか無いのに
                余り高さを全部受け取るので、選択肢カードの下に
                大きな空白が残る（ご指摘「選択肢の下に空白合って無駄」）
            という、高さの配り方が完全に逆の状態だった。

          ■ どう直したか（listeningMobileSplit）
            取り合いを入れ替える。
              ・解答ペイン   … flex-none（中身のぶんだけ）＋ 画面下に寄せる
              ・問題文ペイン … flex-1（余った高さを全部もらう）
            これで
              ・選択肢カードは下部ナビの真上まで下がる（＝もっと下に）
              ・カード下の空白が消える（中身の高さしか取らないため）
              ・浮いた高さはそのまま問題文ペイン＝図に回る
            の3つが同時に成立する。

          化学・数学など（listeningUnified=false）は従来どおり
          「問題文に上限・解答に残り」のままで、見た目は変わらない。
        */}
        <div className={`
          lg:w-[58%] flex flex-col bg-white border-b lg:border-b-0 lg:border-r border-gray-200 transition-all duration-300
          ${listeningMobileSplit && !listeningMobileNoFigure ? 'flex-1 min-h-0' : 'flex-none'}
          ${isDesktop
            ? 'h-full'
            : isProblemExpanded
              ? 'absolute inset-0 z-30 h-full shadow-lg'
              : isProblemCollapsed
                ? 'h-auto shadow-md relative z-20'
                : keyboardVisible
                  /*
                    ★B-3：入力中の問題文の取り分★
                    ヘッダー・タイマー・見出しを隠して空いた約126px を、
                    問題文と解答欄で分け合う。ここを 24vh のままにすると
                    浮いた高さの大半が問題文側に流れてしまうため、
                    上限は据え置きにして余りは解答欄（flex-1）へ渡す。
                    ＝打っている欄と、直前に読んだ問題文の両方が見える。
                  */
                  ? 'max-h-[24vh] h-auto shadow-md relative z-20'
                  : listeningMobileNoFigure
                    // 図が無い大問（第1問A・第3問・第2問）は中身のぶんだけ。
                    // 余った高さは下の解答ペインに渡して選択肢を押しやすくする。
                    ? 'h-auto max-h-[46dvh] shadow-md relative z-20'
                    : listeningMobileSplit
                      ? 'shadow-md relative z-20'
                      /*
                        ★ご指摘「問題によって問題文の長さが違うから、コードで形式的に
                          作ると問題によっておかしくなる可能性がある」への修正★

                        以前は max-h-[42dvh]。名前は「画面の42%」だが、実際に
                        ペインが分け合えるのはヘッダーと下部ナビを引いた残りだけ。
                          360x600 → 使える高さ 453px なのに 42dvh = 252px（＝56%）
                          390x664 → 使える高さ 517px なのに 42dvh = 279px（＝54%）
                        つまり「42%」と書きながら実質は毎回 55% 前後を先取りしていた。
                        残り 201px しか無い解答ペインに 285px の解答カードが入らず、
                        (ア)(イ)(ウ)(エ) が下部ナビの下へ押し出されていた
                        （実測：c5_7[0] 360x600 で 見えている選択肢 0/4）。

                        ★直し方★ 基準をビューポートから「親（ペインを分け合う箱）」に
                        変える。max-h-[50%] は親の高さの50%なので、ヘッダーと
                        ナビを自動的に除いた上でのちょうど半分になる。
                        解答ペインは flex-1 なので必ず残り半分以上を受け取る。
                        これで問題文が18文字でも1031文字でも取り分は変わらない
                        （＝問題ごとに壊れない）。短い問題は h-auto なので
                        半分も使わず、余りは解答側に回る。
                      */
                      : 'max-h-[50%] h-auto shadow-md relative z-20'}
        `}>
          {/* 問題ペインの見出し行（Q1・問題文・たたむ・全画面で読む）。
              ★B-3：入力中は隠す（5%）★
                打っている間は「たたむ」「全画面で読む」を押さないし、
                Q1 の表示も読む必要がない。浮いた高さは問題文と解答欄に回る。
                「完了」でキーボードが閉じれば元に戻るので、機能は失われない。
                PC（isDesktop）は対象外。 */}
          <div className={`flex items-center justify-between p-2 md:p-4 border-b border-gray-100 bg-blue-50/30 ${
            !isDesktop && keyboardVisible ? 'hidden' : ''
          }`}>
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
              <div className="flex items-center gap-1.5">
                {/* 問題文を見出しだけにたたむ／戻す。高校生が迷わないよう
                    チップ型ボタン＋矢印で「押せる」ことを明示する。 */}
                {!isProblemExpanded && (
                  <button
                    onClick={() => setIsProblemCollapsed(!isProblemCollapsed)}
                    className="flex items-center gap-0.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-bold text-gray-600 hover:bg-gray-50 whitespace-nowrap"
                  >
                    {isProblemCollapsed ? (
                      <>問題文を表示<ChevronDown size={12} /></>
                    ) : (
                      <>たたむ<ChevronUp size={12} /></>
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsProblemExpanded(!isProblemExpanded);
                    setIsProblemCollapsed(false);
                  }}
                  className="flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-bold text-gray-600 hover:bg-gray-50 whitespace-nowrap"
                >
                  {isProblemExpanded ? '閉じる' : '全画面で読む'}
                </button>
              </div>
            )}
          </div>
          
          {/*
            ★リスニング（スマホ）は、この中も「高さの連鎖」を通す★
            図を「余った高さいっぱい」に伸ばすには、
              問題文ペイン（flex-1）
                → このスクロール枠（flex-1 min-h-0）
                  → 内側ラッパ（flex flex-col min-h-0）
                    → 問ブロック（flex flex-col min-h-0）
                      → QuestionFigure fill
            の全段で flex と min-h-0 が繋がっている必要がある。
            どこか1段でも高さ auto があると <img> の max-height:100% が
            none 扱いになり、図が原寸で伸びて枠からはみ出す（＝隠れる）。
            余白も p-4 → px-3 pt-2 に詰めて、そのぶんを図に回す。
          */}
          <div 
            ref={problemScrollRef}
            className={`${!isDesktop && !isProblemExpanded && isProblemCollapsed ? 'hidden' : ''} flex-1 min-h-0 overflow-y-auto md:p-8 text-[15px] leading-[1.85] md:text-base md:leading-relaxed text-gray-800 break-words [overflow-wrap:anywhere] ${
              listeningMobileSplit ? 'flex flex-col px-3 pt-2 pb-3' : 'p-4'
            } ${
              // 数学の問題（requiresMathPalette 付き）は、数式が/や^の
              // 生テキストではなく教科書と同じ形で出るため、
              // 数式フォント＋一回り大きい表示（.math-content）で読みやすくする。
              questionNeedsMathPalette ? 'font-math math-content' : 'font-modern'
            }`}
            onMouseUp={handleTextSelection}
            onTouchEnd={handleTextSelection}
            title="テキストを選択するとハイライトできます"
          >
            <div className={`max-w-prose md:max-w-none ${listeningMobileSplit ? 'flex min-h-0 flex-1 flex-col' : ''}`}>
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
                /*
                  ★短い設問文は見出しと同じ行に載せる（ご要望）★
                  ------------------------------------------------------------
                  ご指摘：
                    「発話に合うイラストっていう文字をさ、問4（全4問中4問目）の
                      右にもってこれば、もう少し図を上にできるでしょ」

                  第1問B の設問文は「発話に合うイラスト」の一言だけなのに、
                  見出し行の下に独立した <p> として置かれていた。
                  そのため
                    ・見出し行（問4 …）
                    ・設問文行（発話に合うイラスト）
                  で2行ぶんの高さを使い、そのぶん図が下に押し出されて
                  画面外で切れていた。

                  そこで「1行に収まる短さ（全角20文字相当まで）」の設問文だけ
                  見出し行へ寄せ、丸ごと1行ぶん節約して図を上げる。

                  ★長い設問文（第1問A・第3問の英文の問い）は従来どおり
                    下の段落に置く★
                    「話者がマイクに伝えたい内容に最も近い英文」のような
                    長い設問文まで見出し行に押し込むと、逆に見出し行が
                    2〜3行に折り返して高さが増えてしまう（本末転倒）。
                */
                const inlineBody = body && body.length <= 20 ? body : '';
                const blockBody = inlineBody ? '' : body;
                /*
                  ★英文法：英文そのものを必ず出す（ご要望11）★
                  ------------------------------------------------------------
                  ご指摘（原文）：
                    「英文法は普通に英文ないと問題成立しやんのやけど
                      音声のボタンを少し小さくした上で、英文しっかり載せて。」

                  ■ なぜ英文が消えていたのか
                    英文法の問題は音源（audioTracks）を持つので、この画面は
                    リスニングと同じ扱い（listeningUnified = true）になる。
                    その結果、下の
                      {!listeningUnified && ( …question.text を描画… )}
                    の分岐で question.text が丸ごと描画されなくなっていた。
                    リスニングは「英文は音声にしか無い・本文はリード文だけ」なので
                    これが正しいのだが、英文法は question.text の中の
                      問1　I ______ to Kyoto three times, so I can show you around.
                    が唯一の英文なので、消すと空所補充なのに空所のある文が無い、
                    つまり問題として成立しない状態になっていた。
                    代わりに出ている設問文（label）は「経験の現在完了」という
                    文法項目名だけで、英文はどこにも含まれない（全20問で実測）。

                  ■ 科目で分岐しない
                    ご指摘「コードで形式的に作ると問題によっておかしくなる
                    可能性がある」を踏まえ、「英文法なら出す」ではなく
                    「その問題の本文に、その小問番号の英文が実在するなら出す」
                    という問題ごとの判定にする。
                    実測では英文法20問すべてで英文が取れ、
                    リスニング44問すべてで取れない（＝自動的に無効になる）。
                    将来データが変わっても、英文がある問題だけで有効になる。
                */
                const stepSentence = findSubQuestionSentence(currentQuestion, activeStepSub);
                return (
                  <div className={listeningMobileSplit ? 'flex min-h-0 flex-1 flex-col' : 'mb-4'}>
                    {/* いま解いている問の見出し。回の中で迷子にならないよう
                        「問2 / 全4問」まで添える。 */}
                    <div className={`flex items-center gap-2 flex-wrap ${inlineBody ? 'mb-2' : 'mb-2.5'}`}>
                      <span className="font-bold text-white text-sm bg-[#2C3E50] py-1.5 px-3.5 rounded-lg shadow-sm shrink-0">
                        {formatText(stepMarker)}
                      </span>
                      {listeningSteps.length > 1 && (
                        <span className="text-[11px] font-bold text-gray-400 shrink-0">
                          （全{listeningSteps.length}問中 {safeStepIndex + 1}問目）
                        </span>
                      )}
                      {/* 短い設問文はここ（問N の右）に置く。行を増やさない。 */}
                      {inlineBody && (
                        <span className="min-w-0 text-[14px] md:text-base font-bold leading-snug text-gray-800 font-modern break-words [overflow-wrap:anywhere]">
                          {formatText(inlineBody, combinedHighlights, { prose: isEnglishProse })}
                        </span>
                      )}
                    </div>

                    {blockBody && (
                      <p className="text-[15px] md:text-base leading-relaxed text-gray-800 font-modern break-words [overflow-wrap:anywhere] mb-3">
                        {formatText(blockBody, combinedHighlights, { prose: isEnglishProse })}
                      </p>
                    )}

                    {/*
                      ★英文法の英文（空所つき）★
                      これが「解く対象」そのものなので、設問文（文法項目名）より
                      目立たせ、音源ボタンより上＝いちばん先に目に入る位置に置く。
                      薄い枠の箱にして「ここが読むべき英文」と分かるようにする。
                      prose: true で組むので、英単語がセリフ体に化けない。
                    */}
                    {stepSentence && (
                      <p className="mb-2.5 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2 text-[16px] md:text-base font-bold leading-relaxed text-gray-900 font-modern break-words [overflow-wrap:anywhere]">
                        {formatText(stepSentence, combinedHighlights, { prose: true })}
                      </p>
                    )}

                    {/* この問の音源。問題文のすぐ下＝「問題のところ」に横帯で置く。
                        横帯なのでボタンはどれも 44px 以上あり、指で押しやすい。
                        ★枠つきの箱には入れない（ご指摘：「再生ボタンも置くのは
                          いいけどそのせいで問題と選択肢のボタンが見えなくなってる」）。
                          箱の枠と余白のぶん縦幅を食っていたので、ボタン列だけの
                          スリムな1行にして、設問文・図・選択肢に高さを譲る。 */}
                    {hasTrackFor(activeStepSub.id) && (
                      <ListeningAudioPlayer
                        tracks={listeningTracks}
                        focusSubId={activeStepSub.id}
                        variant="inline"
                        orientation="horizontal"
                        mode="practice"
                        tone="light"
                        readCount={(currentQuestion as any).readCount || 2}
                      />
                    )}

                    {/*
                      この問の図（第1問B のイラスト①〜④）。
                      選択肢の中ではなく問題側に置く（ご要望）。

                      ★スマホの高さ上限をやめる（ご指摘「図が隠れてる」）★
                      以前は max-h-[22vh] で頭打ちにしていた。問題文ペインが
                      40vh で固定だった時代に「見出し＋音源＋図」を無理に
                      押し込むための数字だったが、
                        ・4コマイラストは縦にも情報があるので 22vh では
                          下2コマがほぼ潰れる
                        ・親側が overflow-y-auto なので、はみ出した分は
                          スクロールしないと見えない＝実質「隠れている」
                      という状態になっていた。

                      いまは問題文ペインが flex-1（余り高さを全部もらう）に
                      なったので、図は fill で「もらえた高さいっぱい」まで
                      伸ばす。縦を基準に縮小されるので、4コマ全体が
                      1画面に収まる。

                      ★ご要望「画像のある問題の画像が小さいので確認して。
                        クリックしてズーム機能はいらない。」★
                      これまでは「小さくてもタップで拡大できる」前提で
                      max-h-[22vh]（390x844 で 186px）という強い上限を
                      掛けていた。拡大機能を外すので、この上限だと
                      4コマの文字が読めなくなる。
                      上限自体は「音源・選択肢と同時に見える」ために必要なので、
                      22vh → 42vh（=354px、ほぼ横幅と同じ）まで緩める。
                    */}
                    {activeStepSub.imageUrl && (
                      <QuestionFigure
                        src={activeStepSub.imageUrl}
                        caption={activeStepSub.imageCaption}
                        tone="light"
                        // 図が高さ上限に張り付いている（実測で余り 0px）ので、
                        // 上余白も 12px → 8px に詰めて図の取り分に回す。
                        className={listeningMobileSplit ? 'mt-2' : 'mt-3'}
                        fill={listeningMobileSplit}
                        imgClassName={
                          listeningMobileSplit ? '' : 'max-h-[42vh] md:max-h-[52vh] object-contain'
                        }
                      />
                    )}

                  </div>
                );
              })()}

              {/* ★リスニング：毎回同じリード文（回の説明）は解答中の画面には出さない。
                  ご要望：「第一問Aでは・・・のところいらない。ここのスペースを
                          解答の選択肢のスペースに当てて」
                  回の説明は、回を選んだ直後の「問題の説明ページ」（showingBriefing）で
                  一度だけ読む。解答中の左ペインは「いま解いている問の見出し・
                  設問文・音源・図」だけになり、浮いた縦幅は選択肢・図の表示に回る。
                  化学など（listeningUnified=false）は従来どおり全文を出す。 */}
              {!listeningUnified && (
                inlineQuestionRows ? (
                  /*
                    スマホ・横並び表示（ご要望8）
                    ─────────────────────────────────────────
                    「(1)から4問縦書きになってるけど、横書きにしたら
                      1画面に収まるくない？」

                    リード文（次の不定積分を求めよ…）はそのまま1行で出し、
                    (1)〜(4) だけを 2 列に並べる。4 問なら 4 行 → 2 行になり、
                    浮いた高さが解答欄に回る。

                    ★grid ではなく flex-wrap を使う理由
                      grid は列幅を固定するので、想定より長い項目が来ると
                      はみ出す/文字が切れる。flex-wrap なら「入らなければ
                      次の行に折り返す」だけなので、判定をすり抜けた
                      長い項目が来ても崩れない（二重の安全網）。
                      basis-[calc(50%-0.25rem)] で通常は 2 列、
                      min-w-0 で長い数式も折り返せるようにする。
                  */
                  <div className="flex flex-col gap-1.5">
                    {inlineQuestionRows.lead && (
                      <ExplanationBody
                        text={inlineQuestionRows.lead}
                        highlights={combinedHighlights}
                      />
                    )}
                    <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
                      {inlineQuestionRows.rows.map((row, rIdx) => (
                        <li
                          key={rIdx}
                          className="flex min-w-0 grow basis-[calc(50%-0.25rem)] items-baseline gap-1"
                        >
                          {row.marker && (
                            <span className="shrink-0 font-bold text-gray-500">
                              {formatText(row.marker)}
                            </span>
                          )}
                          <span className="min-w-0">
                            {formatText(row.body, combinedHighlights)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <ExplanationBody
                    text={cleanQuestionText(currentQuestion.text)}
                    highlights={combinedHighlights}
                    /* ★問題文の「【会話文】」「【資料2 …】」を四角囲みにする（スマホのみ）★
                       実物の共通テスト冊子と同じく、資料のかたまりを枠で
                       本文から切り離して読みやすくする。PC は md: で
                       枠を打ち消すため従来と同じ見た目。 */
                    boxedSections
                  />
                )
              )}
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
                /* ★スマホ：設問一覧が問題文の丸写しなら出さない（ご要望8）
                     「設問一覧と問題が同じなので、同じやつはもう設問一覧いらない」
                   数学の (1)〜(4) のように、設問一覧が上の問題文と一字一句
                   同じ問題では、同じ数式が1画面に2回出て縦幅を二重に食う。
                   科目では決めず「一覧の全項目が問題文に含まれるか」で判定し、
                   1項目でも欠ける問題では一覧を残す（情報を消さない）。
                   PC は横幅に余裕があるので従来どおり両方出す。 */
                if (hideRedundantSubQuestionList) return null;
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
        {/* 下部余白：フローティングバーは「マーカー＋前へ/次へ＋完了」だけの
            細い1行になった（入力欄・パレットは撤去）ので、9rem → 6.5rem に戻す。
            解答欄も1設問ずつの固定表示（ページャー）になり、縦に長く
            スクロールすることは基本なくなった。 */}
        {/*
          ★リスニング（スマホ）だけ、このペインを「中身の高さ」にする★
          ------------------------------------------------------------------
          ご指摘：「選択肢の下に空白合って無駄」

          原因はここの flex-1 だった。①〜④ の4ボタンしか無いのに
          余った高さを全部受け取るので、カードの下に何も無い空白が
          そのまま残っていた。

          リスニングでは flex-none にして中身のぶんだけ確保する。
          余った高さは上の問題文ペイン（flex-1）＝図に回るので、
            ・選択肢カードが画面下（下部ナビの真上）まで下がる
            ・カード下の無駄な空白が消える
            ・図が切れずに大きく出る
          が一度に達成できる。paddingBottom も、リスニングでは
          「下部ナビの高さぶん」だけに絞る（余計な空白を作らない）。

          化学など（listeningUnified=false）は flex-1 のままで、
          長い記述欄をスクロールできる従来の挙動を保つ。
        */}
        {/*
          ★図が無い大問（第1問A・第3問・第2問）はここが余りを受け取る★
          ------------------------------------------------------------------
          ご要望：「他の大問のUIも変えてくれない？第1問Aも第3問も
                   これから入る予定の第2問とその他も」

          第1問B 用の配り方（問題文ペイン＝flex-1）をそのまま流用すると、
          図が無いぶんの高さが「再生ボタンの下の巨大な空白」になり、
          消したはずの無駄な空白が場所を変えて再発してしまう。

          そこで図が無いときは受け取り手を入れ替える。
            ・flex-1        … 余った高さをこのペインがもらう
            ・justify-end   … 選択肢カードを下端（下部ナビの真上）に寄せる
                              ＝親指の届く位置。ご要望「もっと下にもってきて」
          もらった高さは、下の auto-rows-fr で選択肢の背を伸ばすのに使う。
        */}
        {/* ★B-1：選択肢の本文幅を稼ぐため、リスニングのスマホだけ左右余白を詰める★
            px-4（16px×2）→ px-2（8px×2）で 16px を本文に回す。
            対象を listeningMobileSplit に限るのは、化学など従来の問題では
            解答欄が小さなチップの集まりで、余白を詰めると窮屈になるため。
            md 以上（PC）は md:p-8 が後ろで上書きするので影響しない。 */}
        <div className={`lg:w-[42%] min-h-0 overflow-y-auto bg-gray-50/50 ${
            listeningMobileSplit ? 'px-2' : 'px-4'
          } md:p-8 ${
            listeningMobileNoFigure
              ? 'flex-1 flex flex-col justify-end pt-2'
              : listeningMobileSplit ? 'flex-none pt-2' : 'flex-1 pt-4'
          } ${isDesktop
            ? 'pb-8'
            : listeningMobileSplit
              // 下部ナビ（前へ/解答と解説を見る）の高さぶんだけ空ける。
              ? 'pb-[calc(4.75rem+env(safe-area-inset-bottom))]'
              : 'pb-[calc(6.5rem+env(safe-area-inset-bottom))]'
          } relative ${!isDesktop && isProblemExpanded
              ? 'hidden'
              // 図が無い大問は flex で高さの連鎖を通す（block だと切れる）。
              : listeningMobileNoFigure ? 'z-10' : 'block z-10'}`}>
          {/* 図が無い大問では、この内側ラッパにも flex/min-h-0 を通しておく。
              ここで連鎖が切れると下の auto-rows-fr が伸びる先を失う。 */}
          <div className={`max-w-2xl mx-auto md:space-y-6 ${listeningMobileSplit ? 'space-y-2' : 'space-y-4'} ${
            listeningMobileNoFigure ? 'flex min-h-0 flex-1 flex-col' : ''
          }`}>
            {/* 「解答入力」見出しはスマホでは出さない（ご指摘：「左上にある
                解答入力というボタンでスペースなくなってるから消してほしい」）。
                各カードの先頭に (ア) や 問2 のマーカーがあるので、
                見出しがなくても「ここが解答欄」と分かる。浮いた縦幅は
                選択肢・入力欄の表示に回す。PC は余白が十分なので従来どおり。 */}
            <h3 className="hidden lg:block font-bold text-gray-400 text-sm md:text-base mb-2 md:mb-4">解答入力</h3>
            {/* スマホ：解答欄ページャー（要望：スクロールをやめ、1設問ずつ固定表示。
                左右の黒い小さな矢印で表示する解答欄を切り替える）。
                位置表示（n / 全体）で「あといくつ解答欄があるか」も分かるようにする。 */}
            {!isDesktop && mobileAnswerSubs.length > 1 && (
              <div className="text-center text-[11px] font-bold text-gray-400 tracking-widest select-none -mb-1">
                {safeMobileAnsIdx + 1} / {mobileAnswerSubs.length}
              </div>
            )}
            {/*
              ★スマホ：解答欄ページャーの矢印は「切り替える先があるとき」だけ置く★
              ─────────────────────────────────────────────────────────────
              ご指摘（B-1）：
                「選択肢の文章の幅が狭い。画面の幅に合わせ、④も見えるようにしたい。」

              ■ 何が起きていたか（390px 幅で実測・積算）
                以前は !isDesktop なら常にこの矢印を描き、行き先が無いときは
                invisible で「見えないが場所は取る」状態にしていた。
                w-7（28px）が左右で 56px ＝ 画面幅 390px の 14% を、
                解答欄が1つしか無い問でも占め続けていた。

                横幅の内訳（390px・図なしリスニング）：
                  解答ペイン px-4          -32px
                  ページャー矢印 w-7 ×2    -56px  ← ★これ★
                  カード p-3.5             -28px
                  選択肢ボタン px-4        -32px
                  ①と本文の gap-2.5        -10px
                  マーク①                  -18px
                  ────────────────────────────
                  英文に残る幅              214px（画面幅の 55%）

                英文が 55% の幅に押し込められて行数が増え、
                その増えた行数のぶんだけ ④ が下へ押し出されて切れていた。
                （④ が切れていたのは左右ではなく上下方向。原因は「幅」）

              ■ 直し方
                すぐ上の「n / 全体」表示と同じ条件（length > 1）でガードする。
                解答欄が1つの問では矢印を描かないので 56px がそのまま本文に回る。
                2つ以上ある問では従来どおり出る（切り替え手段は失わせない）。
                invisible を残さないのは、「見えないのに場所を取る」ことが
                今回の幅不足の直接原因だったため。
              PC（isDesktop）は contents のままで、見た目は一切変わらない。
            */}
            <div className={isDesktop ? 'contents' : 'flex items-stretch gap-1'}>
              {!isDesktop && mobileAnswerSubs.length > 1 && (
                <button
                  type="button"
                  onClick={() => goMobileAns(-1)}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label="前の解答欄へ"
                  className={`shrink-0 flex items-center justify-center w-7 text-gray-900 active:bg-gray-200/60 rounded-lg cursor-pointer ${safeMobileAnsIdx <= 0 ? 'invisible' : ''}`}
                >
                  <ChevronLeft size={20} className="stroke-[2.75]" aria-hidden="true" />
                </button>
              )}
              <div className={isDesktop ? 'contents' : 'flex-1 min-w-0 space-y-4'}>
            {renderedAnswerGroups.map((g: any, gIdx: number) => {
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
                            // スマホ：この欄に直接入力する（ご指摘：「タップしたらなんで
                            // 重複して解答欄が出てくるかわからん。普通に入力できる
                            // ようにしてよ」）。
                            //
                            // 以前は「カード＝表示専用チップ／実入力＝下部バーの複製
                            // 入力欄」の2段構えで、同じ設問の解答欄が画面に2つ見えて
                            // いた。タップ＝その場でキーボードが開き、打った文字は
                            // その欄にそのまま入る、という普通の入力に戻す。
                            // タップ領域は 48px 以上・文字 16px（iOS の自動ズーム防止）。
                            <input
                              ref={(el) => { inputRefs.current[sq.id] = el; }}
                              id={`ans-card-${sq.id}`}
                              type="text"
                              value={answers[sq.id] || ''}
                              onChange={(e) => handleTextChange(sq.id, e.target.value)}
                              onFocus={(e) => { setFocusedSubId(sq.id); handleInputFocusScroll(e); }}
                              onKeyDown={handleMobileCardKeyDown(sq)}
                              enterKeyHint={isLastNavSub(sq) ? 'done' : 'next'}
                              placeholder="解答"
                              aria-label={`${sq.label} の解答を入力`}
                              className={`w-full min-h-[3rem] px-2 py-1.5 text-center text-[16px] font-bold text-stone-800 leading-snug rounded-lg border outline-none transition-colors ${
                                isFocusedBlank
                                  ? 'bg-white border-[#A9CCE3] ring-2 ring-[#A9CCE3]/30'
                                  : 'bg-white/70 border-stone-200/70'
                              }`}
                            />
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
                <div key={sq.id} className={`flex flex-col gap-4 bg-white rounded-2xl shadow-sm border transition-all duration-250 ${
                  // 図が無い大問はカード自身も余り高さを受け取り、
                  // 中の選択肢を伸ばせるようにする（内側余白も少し詰める）。
                  /* ★B-1：カード内側も詰めて本文幅を稼ぐ★
                     p-3.5（14px×2）→ px-2 py-3 で左右 12px を英文に回す。
                     縦（py-3）は詰めない。縦を削ると1行あたりの余裕が減って
                     かえって読みにくくなり、④ が見えない問題も解決しないため。 */
                  listeningMobileNoFigure
                    ? 'min-h-0 flex-1 max-h-full px-2 py-3'
                    : listeningMobileSplit
                      /*
                        ★図がある大問（第1問B）だけ、カードの余白を図に譲る★
                        ご要望「画像のある問題の画像が小さいので確認して」

                        ■ 実測（390x844・第1問B・900x900 の4コマ）
                            図は 298x298。横幅は 366px 空いているのに
                            298px 止まりで、原因は「高さが尽きている」こと。
                            高さの内訳を測ると
                              画面 844
                              − ヘッダー 80 − 下部ナビ 76
                              − 見出し行 40 − 音源バー 44 − 図の上余白 12
                              − キャプション 28
                              − 解答ペイン 278（うちカード p-5 の上下 40）
                            ＝ 図に残るのは 298px で、余りは 0px（実測で確認）。
                            つまり図を大きくするには、どこかから高さを
                            もらう以外に方法がない。

                        ■ もらう先は「選択肢そのもの」ではなくカードの余白
                            ①〜④ のボタン高さ（52px）と行間は既出のご要望
                            「選択肢のスペースに当てて／タップしやすく」で
                            確保したものなので削らない。
                            代わりに p-5（上下 40px）を py-3.5（上下 28px）に
                            するだけにする。これは純粋な余白なので、
                            タップ領域を一切減らさずに 12px を図へ回せる。
                            左右も px-3 にして 16px を選択肢の幅に回す。

                        ■ PC・化学は対象外
                            listeningMobileSplit はスマホかつ音源つきのときだけ
                            真になるので、PC（isDesktop）と化学・数学
                            （listeningUnified=false）は従来の p-5 のまま。
                      */
                      ? 'px-3 py-3.5'
                      : 'p-5'
                } ${
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
                  <div className={`flex flex-col gap-3.5 w-full min-w-0 ${
                    // 図が無い大問：ここも連鎖に加える（切ると選択肢が伸びない）。
                    listeningMobileNoFigure ? 'min-h-0 flex-1' : ''
                  }`}>
                    {/* 設問マーカー（(ア)/(1)/問2 など）。
                        ★リスニングでは出さない（ご指摘：「解答のところの問4とかって
                          書いてあるのは問題のところに書いてあるのでいらない。
                          もっと選択肢と問題を一画面に出すイメージで」）。
                        左の問題ペインの見出しに 問N（全4問中N問目）が常にあるので、
                        解答カード側の 問N は重複。浮いた縦幅は選択肢・図に回す。
                        化学など（listeningUnified=false）は (ア)/(1) の目印が
                        入力に必須なので従来どおり表示する。 */}
                    {!listeningUnified && (
                      <span className={`font-bold text-[#2C3E50] text-sm text-left bg-blue-50/45 border border-[#A9CCE3]/25 py-2 px-4 rounded-xl leading-relaxed shadow-xs w-fit block ${questionNeedsMathPalette ? 'font-math math-content' : ''}`}>
                        {formatText(sqMarker)}
                      </span>
                    )}
                    
                    {sq.type === 'multiple_choice' ? (
                      // ★全教科・全端末で選択肢をカード内に直接表示する。
                      //   以前のスマホは「カード＝表示専用チップ → タップで下部
                      //   固定パネルにもう1つ選択UIが出る」2段構えで、同じ設問の
                      //   解答欄が重複して見えていた（ご指摘：「タップしたらなんで
                      //   重複して解答欄が出てくるかわからん」）。
                      //   選択肢はタップ1回で確定する操作なので、遷移を挟まず
                      //   その場で押せるのが最も手数が少ない。
                      renderMultipleChoiceControl(sq)
                    ) : sq.type === 'sorting' ? (
                      // ★並べ替えもカード内に直接表示（重複解答欄の解消）。
                      //   renderSortingControl はタッチ端末向けの
                      //   タップ入れ替え＋◀▶移動ボタン UI を内蔵している。
                      renderSortingControl(sq)
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
                          // スマホ：この欄に直接入力する（ご指摘：「タップしたらなんで
                          // 重複して解答欄が出てくるかわからん」）。
                          // 以前は表示専用チップ→下部バーの複製 textarea という
                          // 2段構えだった。タップ＝キーボードが開きここにそのまま書ける。
                          // 記号パレットはフォーカス中のみこの下（同じカード内）に出す。
                          <>
                            <div className="relative w-full">
                              <Edit3 className="absolute left-3 top-3 text-gray-400" size={16} />
                              <textarea
                                ref={(el) => { inputRefs.current[sq.id] = el; }}
                                id={`ans-card-${sq.id}`}
                                value={answers[sq.id] || ''}
                                onChange={(e) => handleTextChange(sq.id, e.target.value)}
                                onFocus={(e) => { setFocusedSubId(sq.id); handleInputFocusScroll(e); }}
                                placeholder="解答を入力...（改行可）"
                                rows={3}
                                className="w-full pl-9 pr-4 py-3 text-[16px] rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern resize-none bg-gray-50 focus:bg-white leading-relaxed"
                              />
                            </div>
                            {/* 化学・数学記号パレット：フォーカス中の設問にだけ出す
                                （常時表示だとカードが縦に伸びて他の設問が埋もれる）。 */}
                            {focusedSubId === sq.id && requiresChemicalSymbols(sq) && (
                              <ChemistryPalette
                                value={answers[sq.id] || ''}
                                onChange={(next) => handleTextChange(sq.id, next)}
                                inputRef={getInputRef(sq.id)}
                              />
                            )}
                            {focusedSubId === sq.id && requiresMathSymbols(sq) && (
                              <MathPalette
                                value={answers[sq.id] || ''}
                                onChange={(next) => handleTextChange(sq.id, next)}
                                inputRef={getInputRef(sq.id)}
                              />
                            )}
                          </>
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
                          // スマホ：この欄に直接入力する（重複解答欄の解消）。
                          // Enter＝次の空欄へ移動（最後なら確定）。
                          <>
                            <div className="relative w-full">
                              <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input
                                ref={(el) => { inputRefs.current[sq.id] = el; }}
                                id={`ans-card-${sq.id}`}
                                type="text"
                                value={answers[sq.id] || ''}
                                onChange={(e) => handleTextChange(sq.id, e.target.value)}
                                onFocus={(e) => { setFocusedSubId(sq.id); handleInputFocusScroll(e); }}
                                onKeyDown={handleMobileCardKeyDown(sq)}
                                enterKeyHint={isLastNavSub(sq) ? 'done' : 'next'}
                                placeholder="解答を入力..."
                                className="w-full pl-9 pr-4 py-3 min-h-[3.25rem] text-[16px] rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern bg-gray-50 focus:bg-white shadow-sm leading-relaxed"
                              />
                            </div>
                            {/* 記号パレットはフォーカス中の設問にだけ出す。 */}
                            {focusedSubId === sq.id && requiresChemicalSymbols(sq) && (
                              <ChemistryPalette
                                value={answers[sq.id] || ''}
                                onChange={(next) => handleTextChange(sq.id, next)}
                                inputRef={getInputRef(sq.id)}
                              />
                            )}
                            {focusedSubId === sq.id && requiresMathSymbols(sq) && (
                              <MathPalette
                                value={answers[sq.id] || ''}
                                onChange={(next) => handleTextChange(sq.id, next)}
                                inputRef={getInputRef(sq.id)}
                              />
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
              </div>
              {/* 右矢印も左と同じ条件でガードする（B-1）。
                  片側だけ残すと解答欄が中央からずれるので必ず対で揃える。 */}
              {!isDesktop && mobileAnswerSubs.length > 1 && (
                <button
                  type="button"
                  onClick={() => goMobileAns(1)}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-label="次の解答欄へ"
                  className={`shrink-0 flex items-center justify-center w-7 text-gray-900 active:bg-gray-200/60 rounded-lg cursor-pointer ${safeMobileAnsIdx >= mobileAnswerSubs.length - 1 ? 'invisible' : ''}`}
                >
                  <ChevronRight size={20} className="stroke-[2.75]" aria-hidden="true" />
                </button>
              )}
            </div>

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
        空欄ナビバー（スマホ・テキスト入力中のみ）
        ─────────────────────────────────────────────
        ★ここには入力欄を置かない（ご指摘対応）
        ご指摘：「タップしたらなんで重複して解答欄が出てくるかわからん。
                 普通に入力できるようにしてよ。」
        以前はこのバーに「複製の入力欄＋記号パレット」を出していたため、
        カードの解答欄と合わせて同じ設問の欄が2つ見えていた。
        いまは入力はカード内の欄に直接行うので、このバーは
          ・いまどの空欄を入力中か（マーカー）
          ・前へ/次へ（空欄の移動。(ア)→(イ)→… を指1本で進める）
          ・完了（キーボードを閉じる）
        だけの細い1行にする。キーボードの上端に追従して表示する。
        選択式・並べ替えはカード内で直接タップするので、このバーは出ない。
      */}
      {!isDesktop && focusedSub && (isShortAnswerType(focusedSub) || focusedSub.type === 'descriptive') && (
        <div
          id="floating-answer-bar"
          className="fixed left-0 right-0 z-[60] bg-white border-t-2 border-[#A9CCE3]/60 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] px-3 pt-2 transition-[bottom] duration-150"
          style={{
            bottom: keyboardOffset,
            // キーボード非表示時（オフセット0）はセーフエリア分の余白を確保
            paddingBottom: keyboardOffset > 0 ? '0.5rem' : 'calc(0.5rem + env(safe-area-inset-bottom))',
          }}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
            {/* いま入力中の設問マーカー（設問文は問題文欄・入力はカード内の欄で行う）。
                枝番（①②）まで含めて、どの空欄に書いているかをひと目で示す。 */}
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
              {/* 完了：キーボードを閉じ、下部ナビ（前へ/解答と解説）へ戻す */}
              <button
                type="button"
                onClick={() => {
                  const el = focusedSubId ? inputRefs.current[focusedSubId] : null;
                  el?.blur();
                  setFocusedSubId(null);
                }}
                className="flex items-center justify-center px-4 py-2.5 min-h-[2.75rem] rounded-lg text-[13px] font-bold border border-[#2C3E50] bg-[#2C3E50] text-white active:bg-[#1B2631]"
              >
                完了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

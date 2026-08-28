/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Home as HomeIcon, BookOpen, Settings, Trophy } from 'lucide-react';
import { Home } from './components/Home';
import { ProfileModal } from './components/ProfileModal';
import { ModeSelection } from './components/ModeSelection';
import { ChapterSelection } from './components/ChapterSelection';
import { Quiz } from './components/Quiz';
import { Explanation } from './components/Explanation';
import { LearningViewer } from './components/LearningViewer';
import { Leaderboard } from './components/Leaderboard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Intro } from './components/Intro';
import { LogicalTree } from './components/LogicalTree';
import { NoteDetail } from './components/NoteDetail';
import { StudyHub } from './components/StudyHub';
import { Onboarding } from './components/Onboarding';
import { MockExam } from './components/MockExam';
import { SubjectSelection, getSubjectLabel, isSubjectId, type SubjectId } from './components/SubjectSelection';
import { AdvancedFieldSelection } from './components/AdvancedFieldSelection';
// 分野（理論／無機／有機）の表示情報だけを持つ葉ファイルから読む。
// ここで使うのは「保存値が正しい分野IDかの確認」と「見出しに出す分野名」だけで、
// 化学（発展）の問題データは1問も要らない。
// （以前は ./data/chemistryAdvancedData から読んでいたため、
//   この2つを使うだけで問題データ本体まで読み込み対象になっていた）
import { ADVANCED_FIELDS, type AdvancedFieldId } from './data/advancedFields';
// 学習ノートからの遷移（handleReviewNote）で化学基礎の章一覧を使うため、これだけは直接参照する
import { chemistryData } from './data/chemistryData';
// 全教科から章IDで引く処理は data/allChapters.ts に集約している
import { findChapterById } from './data/allChapters';
import { useGlobalClickSound } from './hooks/useGlobalClickSound';
import { useIdleReset } from './hooks/useIdleReset';
import { useIsMobile } from './hooks/useMediaQuery';
import { MobileViewWrapper } from './components/MobileViewWrapper';
import { countIncomingFriendRequests } from './utils/friends';
import { applyOverviewViewport } from './utils/viewportControl';
import { ErrorBoundary } from './components/ErrorBoundary';
import { flushFeedbackQueue, getFeedbackWebhookUrl } from './utils/feedback';
import { recordUserPresence } from './utils/userRegistry';
import { ensureRankingEntry } from './utils/leaderboard';
import { parseStoredStringRecord } from './utils/progress';
// ユーザーごとの localStorage キー名は utils/userStorageKeys.ts が唯一の定義
import { profileKey, completedKey } from './utils/userStorageKeys';
// 章 × モードごとの保存キー名は utils/quizStorageKeys.ts が唯一の定義
import {
  quizAnswersKey,
  quizRunKey,
  quizExplKey,
  quizIndexKey,
} from './utils/quizStorageKeys';
import { pullStudyData, installStudySyncFlush, resetStudySyncState } from './utils/studySync';
import { TeacherDashboard } from './components/TeacherDashboard';
import { FeedbackAdminPanel } from './components/FeedbackAdminPanel';

export type AppState = 'home' | 'mode_selection' | 'chapters' | 'quiz' | 'explanation' | 'learning' | 'intro' | 'flowchart' | 'study_hub' | 'note_detail' | 'onboarding' | 'logical_tree' | 'settings' | 'leaderboard' | 'mock_exam' | 'subject_selection' | 'advanced_fields' | 'teacher_dashboard' | 'feedback_admin';
export type AppMode = 'mini_test' | 'practice' | 'learning';

const APP_STATES = new Set<AppState>([
  'home', 'mode_selection', 'chapters', 'quiz', 'explanation', 'learning', 'intro',
  'flowchart', 'study_hub', 'note_detail', 'onboarding', 'logical_tree', 'settings',
  'leaderboard', 'mock_exam', 'subject_selection', 'advanced_fields', 'teacher_dashboard',
  'feedback_admin',
]);
const APP_MODES = new Set<AppMode>(['mini_test', 'practice', 'learning']);

export function isAppState(value: unknown): value is AppState {
  return typeof value === 'string' && APP_STATES.has(value as AppState);
}

export function isAppMode(value: unknown): value is AppMode {
  return typeof value === 'string' && APP_MODES.has(value as AppMode);
}

/** 科目選択の保存キー（次回起動時に前回の科目を復元する） */
const SELECTED_SUBJECT_KEY = 'savedSelectedSubject';
/** 化学（発展）で最後に選んだ分野の保存キー */
const SELECTED_FIELD_KEY = 'savedSelectedAdvancedField';

/**
 * 無操作でホーム画面に戻るまでの時間（30分）。
 * 問題を read しながら考え込む時間を邪魔しない程度に長く取り、
 * かつ放置された端末が学習画面のまま残らない長さにしている。
 */
const IDLE_RESET_MS = 30 * 60 * 1000;

export default function App() {
  useGlobalClickSound();

  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('savedAppState');
    return isAppState(saved) ? saved : 'onboarding';
  });
  const [appMode, setAppMode] = useState<AppMode>(() => {
    const saved = localStorage.getItem('savedAppMode');
    return isAppMode(saved) ? saved : 'practice';
  });
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(() => localStorage.getItem('savedSelectedChapterId'));
  /**
   * 「今回はこの範囲だけを解く」ときの範囲（両端を含む・章内の通し番号）。
   *
   * ■ 何のために持つのか（ご要望）
   *   英語リスニングは「第1問A のページ → 第1回演習〜第14回演習のボタン」の形にした。
   *   ボタンで1回を選んだら、その1回だけを解き、その1回だけを振り返れるようにする。
   *   （これまでは14回分がひと続きで、途中でやめると中途半端な位置に取り残されていた）
   *
   * ■ 章IDを分けずに範囲で表す理由
   *   回ごとに章IDを作ると、保存キーや進捗台帳・ランキングの宛先が変わって
   *   これまでの学習記録が迷子になる。章IDは据え置き、範囲だけを別に持つ。
   *
   * ■ localStorage に載せている理由
   *   演習中にアプリを閉じて開き直したとき、範囲を忘れていると
   *   「第3回だけのはずが章の最後まで続く」ことになり、
   *   選んだはずの回と実際に解く範囲が食い違ってしまう。
   */
  const [quizRange, setQuizRange] = useState<{ startIndex: number; endIndex: number } | null>(() => {
    try {
      const raw = localStorage.getItem('savedQuizRange');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        Number.isSafeInteger(parsed.startIndex) && parsed.startIndex >= 0 &&
        Number.isSafeInteger(parsed.endIndex) && parsed.endIndex >= parsed.startIndex
      ) return { startIndex: parsed.startIndex, endIndex: parsed.endIndex };
      return null;
    } catch {
      return null;
    }
  });
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>(() =>
    parseStoredStringRecord(localStorage.getItem('savedQuizAnswers')),
  );
  // スマホ端末では常にスマホ向けレイアウトで表示するため、PC/スマホ切り替えは廃止。
  // 既存の判定ロジック（shouldForceDesktopUI / isMobileExplanation）との互換のため定数 false を保持する。
  const forceDesktop = false;
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  // ユーザーエージェントによるモバイル端末判定（初回のみ・不変）。
  // 画面幅の判定は共有フック useIsMobile に一元化する（C2）。
  const isMobileUserAgent = useRef(
    typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)
  ).current;
  const isNarrowViewport = useIsMobile();
  // 「モバイル端末」= UA がモバイル or 画面幅が md 未満。
  const isMobileDevice = isMobileUserAgent || isNarrowViewport;
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('savedIsGuest') === 'true');
  // 選択中の科目。ログイン直後の科目選択画面（＝タイトル画面）で決まる。
  // 保存値が今の科目一覧に無い（＝古い/壊れた値）場合は化学基礎に戻す。
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(() => {
    const saved = localStorage.getItem(SELECTED_SUBJECT_KEY);
    return isSubjectId(saved) ? saved : 'chemistry_basic';
  });
  // 化学（発展）で選択中の分野（理論／無機／有機）。
  // 保存値が壊れていても安全に理論化学へ倒す。
  const [selectedField, setSelectedField] = useState<AdvancedFieldId>(() => {
    const saved = localStorage.getItem(SELECTED_FIELD_KEY);
    return ADVANCED_FIELDS.some(f => f.id === saved) ? (saved as AdvancedFieldId) : 'theoretical';
  });
  const [isExplanationView, setIsExplanationView] = useState(false);
  const [prevAppState, setPrevAppState] = useState<AppState>('home');
  const [lastQuizResult, setLastQuizResult] = useState<any>(null);
  // 届いているフレンド申請件数（設定ボタンのバッジ表示用）
  const [pendingFriendRequests, setPendingFriendRequests] = useState(0);

  // フレンド申請件数を定期的に確認する（ログイン時のみ）。
  // 設定画面を閉じた直後にも再取得して、承諾/拒否の結果をバッジに反映する。
  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      if (!auth.currentUser) {
        if (!cancelled) setPendingFriendRequests(0);
        return;
      }
      const n = await countIncomingFriendRequests();
      if (!cancelled) setPendingFriendRequests(n);
    };
    refresh();
    const id = window.setInterval(refresh, 60000);
    const unsub = onAuthStateChanged(auth, () => refresh());
    return () => { cancelled = true; window.clearInterval(id); unsub(); };
  }, [appState]);

  // 送信に失敗して端末に溜まっているフィードバックを、起動時とオンライン復帰時に自動再送する。
  // （電波の悪い教室や機内モードで書いた意見を取りこぼさないための保険）
  useEffect(() => {
    const flush = () => { void flushFeedbackQueue().catch(() => {}); };
    const timer = window.setTimeout(flush, 2500);
    window.addEventListener('online', flush);
    return () => { window.clearTimeout(timer); window.removeEventListener('online', flush); };
  }, []);

  // 利用状況（総ユーザー数・登録 Google アカウント）を記録する。
  // ログイン状態が確定してから送りたいので onAuthStateChanged に乗せる。
  // 送りすぎないよう、初回と「前回から24時間以上あいたとき」だけ記録される
  // （判定は userRegistry 側が行う）。失敗してもアプリは止めない。
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      window.setTimeout(() => {
        void recordUserPresence(getFeedbackWebhookUrl()).catch(() => {});
      }, 4000);
    });
    return unsub;
  }, []);

  // ランキングへの参加登録（ご要望：0pt のユーザーも掲載する）
  // ─────────────────────────────────────────────
  // これまで leaderboard_total の枠は「初めてスコアを更新したとき」に
  // しか作られず、連携したばかりの人はランキングに存在しなかった。
  // Google 連携が確定した時点で totalScore: 0 の枠を作り、
  // 「連携済みなら必ず載る」状態にする。
  // 既にスコアがある人は名前とアイコンの更新だけが走る（スコアは触らない）。
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return; // ゲストは掲載対象外
      window.setTimeout(() => {
        void ensureRankingEntry().catch(() => {});
      }, 3000);
    });
    return unsub;
  }, []);

  // ============================================================
  // 学習進捗・復習リストのクラウド同期
  // ============================================================
  // これまで進捗は端末の localStorage だけにあり、
  // 機種変更やキャッシュ削除で全部消えていた。
  // ログインしている場合はクラウドと**マージ**して引き継ぐ。
  //
  // ・上書きではなくマージなので、オフラインで解いた分も残る
  // ・失敗しても学習は止めない（次回起動で再試行）
  // ・ゲストは同期しない（他人の記録と混ざらないようにする）
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // ログアウトしたら同期状態を捨てる（別アカウントと混ざらないように）
        resetStudySyncState();
        return;
      }
      // ログイン直後は他の初期化処理と競合しやすいので少し待つ
      window.setTimeout(() => {
        void pullStudyData().then((result) => {
          if (result.addedProblems > 0 || result.addedReviews > 0) {
            console.info(
              `[studySync] クラウドから引き継ぎました: 進捗 +${result.addedProblems} / 復習 +${result.addedReviews}`,
            );
          }
        });
      }, 1500);
    });
    return unsub;
  }, []);

  // 画面を離れるとき（スマホでアプリを切り替えたときを含む）に
  // 未送信の学習データを送る。iOS Safari は beforeunload が
  // 発火しないことがあるため pagehide / visibilitychange を使う。
  useEffect(() => installStudySyncFlush(), []);

  // Prevent iOS pinch zoom and double tap zoom, EXCEPT on the answers/explanations pages
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (appState === 'explanation' || isExplanationView) {
        return; // Allow zooming
      }
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    let lastTouchEnd = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      if (appState === 'explanation' || isExplanationView) {
        return; // Allow zooming
      }
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [appState, isExplanationView]);

  const [lastLearnState, setLastLearnState] = useState<AppState>(() => {
    const saved = localStorage.getItem('savedLastLearnState');
    return isAppState(saved) ? saved : 'mode_selection';
  });

  useEffect(() => { localStorage.setItem('savedAppState', appState); }, [appState]);
  useEffect(() => { localStorage.setItem('savedAppMode', appMode); }, [appMode]);
  useEffect(() => {
    if (selectedChapterId) {
      localStorage.setItem('savedSelectedChapterId', selectedChapterId);
    } else {
      localStorage.removeItem('savedSelectedChapterId');
    }
  }, [selectedChapterId]);
  useEffect(() => {
    if (quizRange) {
      localStorage.setItem('savedQuizRange', JSON.stringify(quizRange));
    } else {
      localStorage.removeItem('savedQuizRange');
    }
  }, [quizRange]);
  useEffect(() => { localStorage.setItem('savedQuizAnswers', JSON.stringify(quizAnswers)); }, [quizAnswers]);
  useEffect(() => { localStorage.setItem('savedIsGuest', isGuest.toString()); }, [isGuest]);
  useEffect(() => { localStorage.setItem(SELECTED_SUBJECT_KEY, selectedSubject); }, [selectedSubject]);
  useEffect(() => { localStorage.setItem(SELECTED_FIELD_KEY, selectedField); }, [selectedField]);
  
  useEffect(() => {
    if (['mode_selection', 'learning', 'chapters', 'quiz', 'explanation', 'mock_exam'].includes(appState)) {
      setLastLearnState(appState);
      localStorage.setItem('savedLastLearnState', appState);
    }
  }, [appState]);

  // 画面遷移時に常に最上部へスクロール（前画面のスクロール位置を引き継がない）
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [appState]);

  const isFirstLoad = useRef(true);

  /**
   * 科目選択画面を「どこから開いたか」。科目を選んだあとの遷移先に使う。
   *
   *  - 'start'  … ホームの「学習を始める」から。科目を選んだら
   *               そのまま学習モード選択へ進む（もう一度ボタンを押させない）。
   *  - 'change' … ホームの「科目を変更」から。科目を選んだらホームへ戻る。
   *
   * 科目選択は必ずホームから開くので、'onboarding' は廃止した。
   * （以前はログイン直後にも科目選択を挟んでいたため、科目選択が2回出ていた）
   *
   * ref ではなく state にしている理由：
   *   この値は描画（遷移先の分岐）に使うため。ref はレンダリングを
   *   起こさないので、ホーム→科目選択の遷移と同時に更新しても
   *   1テンポ遅れて反映され、事故になりやすい。
   */
  const [subjectPickerOrigin, setSubjectPickerOrigin] =
    useState<'start' | 'change'>('start');

  // 【スマホ解答解説：俯瞰UIの廃止 → スマホ専用レイアウトへ】
  // 以前は解答解説ページだけスマホでも PC 版レイアウト（width=1024 を縮小した
  // 俯瞰UI）を強制していたが、「解答と解説の文字が小さい。問題のところと同じ
  // ぐらいの文字の大きさにしたい」というご指摘のとおり、初期表示の文字が
  // 物理的に極小（実質6px程度）になっていた。
  // そこで俯瞰UIをやめ、スマホでは解答解説もスマホ専用レイアウト
  // （正誤一覧 → タップでその問の解説を開く。Explanation.tsx 側で実装）で表示する。
  // PC のレイアウトは一切変えない。
  const shouldForceDesktopUI = forceDesktop;
  const isMobileView = ((isMobileDevice && !shouldForceDesktopUI) || isMobilePreview) && !shouldForceDesktopUI;

  // PC版では「学習モードを選択」(mode_selection) 以外の全画面で外側余白をなくし、
  // ノート風背景を全幅に広げる。mode_selection だけは従来通り中央寄せ＋余白を維持。
  const isFullBleed = appState !== 'mode_selection';

  /**
   * 科目を選び終えたときの遷移先。
   *  - ホームの「学習を始める」から来た場合 … そのまま学習モード選択へ進む
   *    （ホームに戻してしまうと、もう一度ボタンを押させることになる）
   *  - 「科目を変更」から来た場合 … ホーム（ダッシュボード）へ
   */
  const handleSelectSubject = (subject: SubjectId) => {
    setSelectedSubject(subject);
    setAppState(subjectPickerOrigin === 'start' ? 'mode_selection' : 'home');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const wasFirstLoad = isFirstLoad.current;
      isFirstLoad.current = false;

      if (!user) {
        if (!isGuest && !wasFirstLoad) {
          setAppState('onboarding');
        }
      } else {
        setIsGuest(false);
        try {
          // Firestoreの代わりにlocalStorageを使用
          const localProfile = localStorage.getItem(profileKey(user.uid));
          if (!localProfile) {
            setAppState('onboarding');
          } else if (!wasFirstLoad) {
            setAppState('home');
          }
        } catch (error) {
          console.error("Error in onAuthStateChanged:", error);
          setAppState('onboarding');
        }
      }
    });
    return unsubscribe;
  }, [isGuest]);
  
  // BGM state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isBgmEnabled, setIsBgmEnabled] = useState(true);
  const [bgmVolume, setBgmVolume] = useState(() => {
    const saved = localStorage.getItem('bgm_volume');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAudioValid, setIsAudioValid] = useState(true);
  const hasLoggedAudioError = useRef(false);

  useEffect(() => {
    localStorage.setItem('bgm_volume', bgmVolume.toString());
    if (audioRef.current) {
      audioRef.current.volume = bgmVolume;
    }
  }, [bgmVolume]);

  const bgmStateRef = useRef({ isBgmEnabled, isAudioValid, appState });
  useEffect(() => {
    bgmStateRef.current = { isBgmEnabled, isAudioValid, appState };
  }, [isBgmEnabled, isAudioValid, appState]);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      
      // Attempt to play immediately on interaction to satisfy strict browser policies
      const audio = audioRef.current;
      const { isBgmEnabled, isAudioValid, appState } = bgmStateRef.current;
      
      if (audio && isAudioValid && isBgmEnabled && !['quiz', 'explanation'].includes(appState)) {
        audio.volume = bgmVolume;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            if (e.name === 'NotSupportedError' || e.message?.includes('no supported sources')) {
              if (!hasLoggedAudioError.current) {
                hasLoggedAudioError.current = true;
                console.error('[BGM Error] Decode failed on interaction. Switching to silent mode.', e);
                console.warn('音源ファイルが読み込めないか、サポートされていない形式です。無音でアプリを続行します。');
              }
              setIsAudioValid(false);
            } else if (e.name === 'NotAllowedError') {
              console.warn('[BGM Info] Autoplay blocked by browser. Waiting for user interaction.', e);
            } else {
              console.error('[BGM Error] Unexpected playback error on interaction:', e);
            }
          });
        }
      }

      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      if (shouldForceDesktopUI) {
        // 解答解説画面：俯瞰UI。常に PC 版レイアウト（width=1024）で描画し、
        // 初期表示は全体が画面内に収まる縮小倍率（fit scale）にする。
        // 実装は viewportControl.applyOverviewViewport に一元化。
        // （ページ遷移毎のズームリセットは Explanation 側でも同関数を呼ぶ）
        applyOverviewViewport();
      } else {
        // モバイルへ戻る/遷移する際に、以前の desktop スケールが残って
        // 「異常にズームされた状態」で切り替わるのを防ぐため、一度スケールを
        // 明示的に 1.0 に固定してから通常のビューポートへ戻す（D対策）。
        // user-scalable は既定（許可）のままにしてアクセシビリティを確保する（C3）。
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0');
        // 次フレームで拡大許可を戻し、ユーザーによるピンチズームを再度可能にする。
        requestAnimationFrame(() => {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
        });
      }
    }
  }, [shouldForceDesktopUI, appState]);

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const target = e.target as HTMLAudioElement;
    const error = target.error;
    
    if (!hasLoggedAudioError.current) {
      hasLoggedAudioError.current = true;
      console.error('[BGM Error] Failed to load or decode. Details:', {
        code: error?.code,
        message: error?.message,
        networkState: target.networkState,
        readyState: target.readyState,
        src: target.src
      });
      console.warn('音源ファイルが読み込めないか、ブラウザでサポートされていない形式です。無音でアプリを続行します。');
    }
    setIsAudioValid(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isAudioValid || hasLoggedAudioError.current) return;
    
    // Play BGM except during quiz and explanation, and only after user interaction
    const shouldPlay = isBgmEnabled && hasInteracted && !['quiz', 'explanation'].includes(appState);

    if (shouldPlay) {
      audio.volume = 0.1;
      // Play might fail if user hasn't interacted with the document yet or if source is invalid
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (e.name === 'NotSupportedError' || e.message?.includes('no supported sources')) {
            if (!hasLoggedAudioError.current) {
              hasLoggedAudioError.current = true;
              console.error('[BGM Error] Decode failed (NotSupportedError). Switching to silent mode.', e);
              console.warn('音源ファイルが読み込めないか、サポートされていない形式です。無音でアプリを続行します。');
            }
            setIsAudioValid(false);
          } else if (e.name === 'NotAllowedError') {
            console.warn('[BGM Info] Autoplay blocked by browser. Waiting for user interaction.', e);
          } else {
            console.error('[BGM Error] Unexpected playback error:', e);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [appState, isBgmEnabled, hasInteracted, isAudioValid]);

  // iOS/Safari では audio.play() をユーザー操作（クリック/タップ）と同一の
  // コールスタック内で呼ばないと再生がブロックされる。
  // 設定画面のトグルでは React state 更新 → useEffect 再生では間に合わないため、
  // 操作ハンドラ内で直接 play/pause を実行する。
  const handleToggleBgm = (enabled: boolean) => {
    setIsBgmEnabled(enabled);
    setHasInteracted(true);
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      if (!isAudioValid || hasLoggedAudioError.current) return;
      if (['quiz', 'explanation'].includes(appState)) return;
      audio.volume = bgmVolume;
      // iOS Safari 対策:
      // 音源がまだデコードされていない場合、ユーザー操作と同一スタックで
      // load() → play() を呼ぶことで再生ブロック/デコード失敗を回避しやすくなる。
      try {
        if (audio.readyState < 2) {
          audio.load();
        }
      } catch {
        /* load 失敗は play 側の catch で処理 */
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (e.name === 'NotSupportedError' || e.message?.includes('no supported sources')) {
            if (!hasLoggedAudioError.current) {
              hasLoggedAudioError.current = true;
              console.error('[BGM Error] Decode failed on toggle. Switching to silent mode.', e);
            }
            setIsAudioValid(false);
          } else if (e.name === 'NotAllowedError') {
            console.warn('[BGM Info] Playback blocked by browser on toggle.', e);
          } else {
            console.error('[BGM Error] Unexpected playback error on toggle:', e);
          }
        });
      }
    } else {
      audio.pause();
    }
  };

  /**
   * -----------------------------------------------------------------
   * 一定時間なにも操作されなかったらホーム画面へ戻す
   * -----------------------------------------------------------------
   * 端末を開いたまま放置されたとき、問題や解説の画面で止まったままに
   * せず、とびら君が話しているホームに戻す。
   *
   * 安全のための配慮：
   *  - すでにホームにいるときは何もしない（戻る先が同じ画面）。
   *  - ログイン前（オンボーディング）では作動させない。
   *    まだホームが無い状態で飛ばすと操作不能に見えるため。
   *    科目選択は必ずホームから開くので、こちらは対象に含める。
   *  - 解答の内容は Quiz 側が localStorage に保存しており、
   *    ここでは画面を移すだけなので書きかけの答えは失われない。
   *    （単元に入り直せば「続きから」再開できる）
   */
  const idleResetEnabled = appState !== 'home' && appState !== 'onboarding';

  useIdleReset({
    enabled: idleResetEnabled,
    timeoutMs: IDLE_RESET_MS,
    onIdle: () => setAppState('home'),
  });

  // ホームの「学習を始める」は、まず科目を選ばせる。
  // 以前は学習モード選択（mode_selection）へ直行していたため、
  // 別の科目を勉強したいときにホームの「科目を変更」を探す必要があった。
  // 学習の入口を «科目 → モード → 単元» の一本道にそろえる。
  const handleStart = () => {
    setSubjectPickerOrigin('start');
    setAppState('subject_selection');
  };
  const handleIntro = () => setAppState('intro');
  
  const handleSelectMode = (mode: AppMode) => {
    setAppMode(mode);
    if (mode === 'learning') {
      setAppState('learning');
    } else if (selectedSubject === 'english_listening') {
      // 英語リスニングは分野選択を持たず、そのまま大問（単元）選択へ進む。
      setAppState('chapters');
    } else if (selectedSubject === 'chemistry') {
      // 化学（発展）は単元の前に「理論／無機／有機」の分野選択を挙む。
      setAppState('advanced_fields');
    } else {
      setAppState('chapters');
    }
  };

  const handleSelectChapter = (
    chapterId: string,
    questionIndex = 0,
    resume = false,
    /**
     * 「この範囲だけを1回として解く」ときの範囲（両端を含む）。
     * 英語リスニングの「第N回演習」ボタンから渡す。
     * 省略時は範囲なし＝章の全問を通しで解く（化学基礎・化学は従来のまま）。
     */
    range: { startIndex: number; endIndex: number } | null = null,
  ) => {
    setSelectedChapterId(chapterId);
    setQuizRange(range);
    setAppState('quiz');
    setLastQuizResult(null);

    if (!resume) {
      setQuizAnswers({});
      localStorage.removeItem(quizAnswersKey(chapterId, appMode));
      localStorage.removeItem(quizRunKey(chapterId, appMode));
      localStorage.removeItem(quizExplKey(chapterId, appMode));
      localStorage.setItem(quizIndexKey(chapterId, appMode), questionIndex.toString());
    }
  };

  const handleFinishQuiz = (answers: Record<string, string>, result?: any) => {
    setQuizAnswers(answers);
    setLastQuizResult(result || null);
    setAppState('explanation');
    
    // Track chapter completion if not guest
    if (!isGuest && auth.currentUser && selectedChapterId) {
      const uid = auth.currentUser.uid;
      const key = completedKey(uid);
      try {
        const completed = JSON.parse(localStorage.getItem(key) || '[]');
        if (!completed.includes(selectedChapterId)) {
          completed.push(selectedChapterId);
          localStorage.setItem(key, JSON.stringify(completed));
        }
      } catch (e) {
        console.error('Failed to save completion:', e);
      }
    }
  };

  const handleBackToChapters = () => {
    setAppState('chapters');
    setSelectedChapterId(null);
  };

  /**
   * 学習ノートの問題項目から、対応する演習問題へ遷移する（要件5）。
   * ノートに保存された chapterId / questionId を優先して問題位置を特定し、
   * 見つからなければ questionIndex（1始まり表示番号）でフォールバックする。
   */
  const handleReviewNote = (note: any) => {
    if (!note) return;
    const allChapters = chemistryData.parts.flatMap(p => p.chapters) as any[];

    // 1) chapterId で章を特定（新しいノート）
    let chapter = note.chapterId
      ? allChapters.find(c => c.id === note.chapterId)
      : undefined;

    // 2) chapterId が無い/一致しない場合は chapterTitle（表示名）で章を特定（古いノート）
    if (!chapter && note.chapterTitle) {
      chapter = allChapters.find(
        c => c.abstractTitle === note.chapterTitle || c.realTitle === note.chapterTitle
      );
    }

    // 3) それでも見つからない場合、questionId を全章から検索（最後の手段）
    if (!chapter && note.questionId) {
      chapter = allChapters.find(c =>
        ((c.practiceProblems || []) as any[]).some((q: any) => q.id === note.questionId)
      );
    }

    if (!chapter) {
      alert('この復習ノートに対応する問題が見つかりませんでした。単元選択から復習してください。');
      setAppState('chapters');
      return;
    }

    // 練習モードへ切り替え（演習問題を開くため）。
    setAppMode('practice');

    const list: any[] = (chapter.practiceProblems || []) as any[];
    let questionIndex = -1;
    if (note.questionId) {
      questionIndex = list.findIndex((q: any) => q.id === note.questionId);
    }
    if (questionIndex < 0 && typeof note.questionIndex === 'number' && note.questionIndex > 0) {
      // questionIndex は 1始まりの表示番号 → 0始まりへ変換
      questionIndex = Math.min(note.questionIndex - 1, Math.max(0, list.length - 1));
    }
    if (questionIndex < 0) questionIndex = 0;

    handleSelectChapter(chapter.id, questionIndex, false);
  };

  /**
   * 選択中の章（単元）。
   * 化学基礎・化学（発展）・英語リスニングなど、全教科から探す。
   * 単元ID は接頭辞（c… / a… / el…）で重複しないため、単純な連結で安全に引ける。
   *
   * どの教科を探すかの一覧は data/allChapters.ts に集約している
   * （教科を追加するときは、そのファイルに1行足すだけでよい）。
   */
  const selectedChapter = findChapterById(selectedChapterId);

  return (
    <>
      <MobileViewWrapper isMobileMode={isMobilePreview && !shouldForceDesktopUI} onClose={() => setIsMobilePreview(false)}>
        {/*
          ===== アプリの外枠の高さについて =====
          ★以前は min-h-screen（＝100vh）だった。これが「1画面に収まらない」原因★

          iOS Safari の 100vh は「アドレスバー・下部ツールバーを含んだ高さ」なので、
          実際に見えている領域より必ず大きい。しかも min-height なので
          「最低でもこの高さ、中身が増えればいくらでも伸びる」箱になっていた。

          その結果、各画面の中にある `flex-1 overflow-y-auto` は
          高さの上限をもらえず、スクロールせずに中身のぶんだけ伸びてしまう
          （実測：ホームの中身 1501px ＝ ペインもそのまま 1501px）。
          スクロールするのは中のペインではなく **ページ全体** になり、
          コンテンツが下部ナビやブラウザのツールバーの裏に潜り込んでいた。
          （ご指摘の「マスコットの吹き出しが切れる」「この科目ではじめる が隠れる」）

          そこで h-[100dvh] で高さを確定させる。
           ・dvh … ツールバーを除いた「いま見えている高さ」
           ・h（min-h ではない）… 中身が増えても箱は伸びない
          これで各画面の overflow-y-auto が初めて上限を得て、
          「ページ全体ではなく中身だけがスクロールする」形になり、
          下部ナビは常に画面内に居座る。
        */}
        {/*
          ★overflow は hidden ではなく auto にする（重要）★
          この外枠の下には2種類の画面がぶら下がっている。
            A) 自前のスクロール領域を持つ画面（ホーム／科目選択／単元選択）
            B) 持たない画面（設定・ランキング・アプリ紹介・模試・
               ロジックツリー・学習モード選択 など）
          hidden にすると B の画面は中身がはみ出しても
          スクロールする手段が無くなり、下の方が永久に読めなくなる。
          auto なら A は自前ペインで完結し（外枠はスクロールしない）、
          B は外枠がスクロールしてくれる。
        */}
        <div className={`h-[100dvh] w-full flex justify-center relative overflow-y-auto ${
          isFullBleed
            ? 'p-0 items-stretch'
            : `pt-6 pb-safe-lg md:py-12 px-4 md:px-8 md:pb-28 ${['onboarding', 'subject_selection', 'intro', 'mode_selection'].includes(appState) ? 'items-center' : 'items-start'}`
        }`}>
          {/* iOS Safari では crossOrigin="anonymous" が付いていると
              同一オリジン音源でもデコードがブロックされ再生できないことがあるため付与しない。
              playsInline を付けて iOS のインライン再生を許可する。 */}
          <audio 
            ref={audioRef} 
            src="/tanjou.mp3" 
            loop 
            preload="auto" 
            // @ts-ignore - playsInline は audio でも iOS 挙動安定のため付与
            playsInline
            onError={handleAudioError}
          />
          
          {/* スマホ版の「パソコン版・スマホ版の切り替えボタン」は削除。
              （スマホ端末では常にスマホ向けレイアウトで表示する。forceDesktop は false 固定） */}

          {/*
            外枠でせっかく高さを確定させても、この中間ラッパーが高さを
            素通りさせないと子（各画面）は上限を受け取れない。
            ★パーセント指定の高さ（h-full / max-h-full）は、親の高さが
              解決していないと `none` 扱いで無視される★ため、
              外枠 → ここ → 各画面 と高さの鎖をつなぐ必要がある。

            mode_selection だけは中央寄せカード（items-center）なので、
            伸び縮みする箱として min-h-0 + flex を渡し、
            カード側が自分で内部スクロールを持てるようにする。
          */}
          <div className={`w-full relative min-h-0 ${
            appState === 'explanation'
              ? 'max-w-none w-full h-full'
              : isFullBleed
                ? 'max-w-none h-full'
                : 'max-w-5xl max-h-full flex flex-col'
          }`}>
            {appState === 'settings' && <ProfileModal onClose={() => setAppState(prevAppState)} isBgmEnabled={isBgmEnabled} setIsBgmEnabled={setIsBgmEnabled} onToggleBgm={handleToggleBgm} bgmVolume={bgmVolume} setBgmVolume={setBgmVolume} onOpenTeacherDashboard={() => setAppState('teacher_dashboard')} onOpenFeedbackAdmin={() => setAppState('feedback_admin')} />}
            {/* 先生ダッシュボード。戻る先を設定にしているのは、入ってきた経路と揃えるため。 */}
            {appState === 'teacher_dashboard' && <TeacherDashboard onBack={() => setAppState('settings')} />}
            {/* フィードバック管理（運営専用）。入口は設定内の運営専用ボタン。 */}
            {appState === 'feedback_admin' && <FeedbackAdminPanel onBack={() => setAppState('settings')} />}

            {/* ログイン／ゲスト開始の直後は、必ず科目選択（＝タイトル）画面を経由する */}
            {/* ログイン／ゲスト開始の直後は、そのままホームへ入る。
                以前はここで科目選択を挟んでいたため、
                «ログイン → 科目選択 → ホーム → 学習を始める → 科目選択»
                と科目選択が2回出てしまっていた。
                科目はホームの「学習を始める」で選ぶ（初期値は化学基礎）。 */}
            {appState === 'onboarding' && <Onboarding onComplete={() => setAppState('home')} onGuest={() => { setIsGuest(true); setAppState('home'); }} />}
            {appState === 'subject_selection' && (
              <SubjectSelection
                onSelectSubject={handleSelectSubject}
                isGuest={isGuest}
                // 科目選択は必ずホームから開くので、常に「ホームに戻る」を出せる
                onBack={() => setAppState('home')}
              />
            )}
            {appState === 'home' && <Home onStart={handleStart} onIntro={handleIntro} onNoteList={() => setAppState('study_hub')} onLogicalTree={() => setAppState('logical_tree')} onLeaderboard={() => setAppState('leaderboard')} onChangeSubject={() => { setSubjectPickerOrigin('change'); setAppState('subject_selection'); }} subjectLabel={getSubjectLabel(selectedSubject)} subject={selectedSubject} isGuest={isGuest} />}
            {appState === 'leaderboard' && <Leaderboard onBack={() => setAppState('home')} isGuest={isGuest} initialChapterId={selectedChapterId} />}
            {appState === 'intro' && <Intro onBack={() => setAppState('home')} />}
            {appState === 'logical_tree' && <LogicalTree />}
            {appState === 'mode_selection' && <ModeSelection onSelectMode={handleSelectMode} onBack={() => setAppState('home')} onMockExam={() => setAppState('mock_exam')} subject={selectedSubject} />}
            {appState === 'mock_exam' && <MockExam onBack={() => setAppState('mode_selection')} />}
            {appState === 'learning' && (
              <LearningViewer
                onBack={() => setAppState('mode_selection')}
                subject={
                  selectedSubject === 'chemistry' ? 'chemistry'
                  : selectedSubject === 'math' ? 'math'
                  : selectedSubject === 'biology_basic' ? 'biology_basic'
                  : 'chemistry_basic'
                }
              />
            )}
            {/* 化学（発展）：理論化学・無機化学・有機化学の分野選択 */}
            {appState === 'advanced_fields' && (
              <AdvancedFieldSelection
                onSelectField={(field) => { setSelectedField(field); setAppState('chapters'); }}
                onBack={() => setAppState('mode_selection')}
              />
            )}
            {appState === 'chapters' && (
              <ChapterSelection
                mode={appMode as 'mini_test' | 'practice'}
                onSelectChapter={handleSelectChapter}
                onBack={() => setAppState(selectedSubject === 'chemistry' ? 'advanced_fields' : 'mode_selection')}
                subject={selectedSubject}
                field={selectedField}
                fieldTitle={ADVANCED_FIELDS.find(f => f.id === selectedField)?.title}
              />
            )}
            {appState === 'quiz' && selectedChapter && (
              <ErrorBoundary label="演習画面" onReset={handleBackToChapters}>
                <Quiz mode={appMode as 'mini_test' | 'practice'} chapter={selectedChapter} onFinish={handleFinishQuiz} onBack={handleBackToChapters} isGuest={isGuest} isMobileView={isMobileView} onExplanationChange={setIsExplanationView} questionRange={quizRange} />
              </ErrorBoundary>
            )}
            {appState === 'explanation' && selectedChapter && (
              /* 結果・ランキング画面は問題データを一括で描画するため、
                 1問でもデータ不備があると全体が表示できなくなる。
                 エラーバウンダリで包み、真っ白な画面で操作不能にならないようにする。 */
              <ErrorBoundary label="結果・解説画面" onReset={handleBackToChapters}>
                <Explanation
                  mode={appMode as 'mini_test' | 'practice'}
                  chapter={selectedChapter}
                  answers={quizAnswers}
                  onBack={handleBackToChapters}
                  isGuest={isGuest}
                  // スマホではスマホ専用レイアウト（正誤一覧→タップで解説）で表示する。
                  // PC は従来どおり（isMobileView=false → 2カラムレイアウト）。
                  isMobileView={isMobileView}
                  resultTotalScore={lastQuizResult?.totalScore}
                  resultTotalCorrect={lastQuizResult?.totalCorrect}
                  resultTotalJudgeable={lastQuizResult?.totalJudgeable}
                  resultTotalTimeSec={lastQuizResult?.totalTimeSec}
                  // 1回分（例：第3回演習）だけを解いたときは、その回だけを振り返る。
                  // 解いていない回まで答え合わせに並ぶと、どこまでやったか分からなくなる。
                  questionRange={quizRange}
                />
              </ErrorBoundary>
            )}
            {appState === 'study_hub' && <StudyHub onBack={() => setAppState('home')} isGuest={isGuest} onSelectNote={(note) => { setSelectedNote(note); setAppState('note_detail'); }} onReview={handleReviewNote} />}
            {appState === 'note_detail' && selectedNote && <NoteDetail note={selectedNote} onBack={() => setAppState('study_hub')} onReview={handleReviewNote} />}

            {/* Global Bottom Navigation Footer
                日本語ラベル化（ホーム／学習／設定）＋aria-labelをaria-currentで現在地を明示
                アイコンには aria-hidden を付け、ラベルだけがスクリーンリーダーに読まれるよう整理 */}
            {appState !== 'onboarding' && appState !== 'subject_selection' && appState !== 'quiz' && appState !== 'explanation' && (
              <nav
                aria-label="メインナビゲーション"
                /*
                  ★以前は `pb-safe pt-3 … pb-6` と下パディングを2つ書いていた★
                  Tailwind（CSS）では後から出てくる pb-6 が勝つため、
                  pb-safe の env(safe-area-inset-bottom) は黙って捨てられていた。
                  ＝ iPhone のホームインジケータ領域ぶんの余白が確保されず、
                    ナビのラベルがぎりぎりまで下がっていた。

                  ここでは 1 つの pb に calc で統合し、
                  「基本の余白 ＋ 端末の安全領域」を確実に両方effectiveにする。
                  高さは各画面が余白を予約するときの基準にもなるので、
                  --app-nav-h として公開する（下の画面側で参照する）。
                */
                className="fixed bottom-0 left-0 right-0 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#D1D5DB]/65 flex justify-around items-center px-2 md:px-10 pt-3 pb-[calc(0.9rem+env(safe-area-inset-bottom))] z-[60] shadow-sm"
              >
                <button 
                  onClick={() => setAppState('home')}
                  aria-label="ホーム画面へ移動"
                  aria-current={appState === 'home' ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center w-14 gap-1.5 min-h-[44px] transition-colors ${appState === 'home' ? 'text-[#1B2631] font-bold' : 'text-[#4B5563]/60 hover:text-[#1B2631]/80'}`}
                >
                  <HomeIcon className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                  <span className="text-[10px] tracking-wider font-modern">ホーム</span>
                </button>
                
                <button 
                  onClick={() => {
                    if (appState === 'home' || appState === 'study_hub' || appState === 'note_detail' || appState === 'leaderboard') {
                      setAppState(lastLearnState);
                    } else {
                      setAppState('mode_selection');
                    }
                  }}
                  aria-label="学習画面へ移動"
                  aria-current={['mode_selection', 'chapters', 'learning', 'explanation', 'quiz', 'mock_exam'].includes(appState) ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center w-14 gap-1.5 min-h-[44px] transition-colors ${['mode_selection', 'chapters', 'learning', 'explanation', 'quiz', 'mock_exam'].includes(appState) ? 'text-[#1B2631] font-bold' : 'text-[#4B5563]/60 hover:text-[#1B2631]/80'}`}
                >
                  <BookOpen className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                  <span className="text-[10px] tracking-wider font-modern">学習</span>
                </button>

                <button 
                  onClick={() => setAppState('leaderboard')}
                  aria-label="ランキング画面へ移動"
                  aria-current={appState === 'leaderboard' ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center w-14 gap-1.5 min-h-[44px] transition-colors ${appState === 'leaderboard' ? 'text-[#1B2631] font-bold' : 'text-[#4B5563]/60 hover:text-[#1B2631]/80'}`}
                >
                  <Trophy className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                  <span className="text-[10px] tracking-wider font-modern">ランキング</span>
                </button>

                <button 
                  onClick={() => {
                    if (appState !== 'settings') {
                      setPrevAppState(appState);
                    }
                    setAppState('settings');
                  }}
                  aria-label={pendingFriendRequests > 0 ? `設定画面へ移動（フレンド申請が${pendingFriendRequests}件届いています）` : '設定画面へ移動'}
                  aria-current={appState === 'settings' ? 'page' : undefined}
                  className={`relative flex flex-col items-center justify-center w-14 gap-1.5 min-h-[44px] transition-colors ${appState === 'settings' ? 'text-[#1B2631] font-bold' : 'text-[#4B5563]/60 hover:text-[#1B2631]/80'}`}
                >
                  <div className="relative">
                    <Settings className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                    {pendingFriendRequests > 0 && (
                      <span
                        className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#E74C3C] text-white text-[9px] font-bold flex items-center justify-center shadow-sm"
                        aria-hidden="true"
                      >
                        {pendingFriendRequests > 9 ? '9+' : pendingFriendRequests}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] tracking-wider font-modern">設定</span>
                </button>
              </nav>
            )}
          </div>
        </div>
      </MobileViewWrapper>

      {/* Desktop Toggle Button for Mobile Preview
          aria-label / title を日本語で明示、アイコンには aria-hidden */}
      {!isMobileDevice && !isMobilePreview && (
        <div className="fixed bottom-4 right-4 z-[9999]">
          <button
            onClick={() => setIsMobilePreview(true)}
            aria-label="スマホ版でプレビュー"
            title="スマホ版でプレビュー（モバイル端末での見え方を確認）"
            className="bg-white rounded-full shadow-xl border-2 border-[#A9CCE3] flex items-center justify-center text-gray-600 hover:text-[#1B2631] transition-all p-3 group"
          >
            <Smartphone size={24} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span className="ml-2 font-bold text-sm hidden group-hover:inline-block whitespace-nowrap overflow-hidden transition-all">スマホ版</span>
          </button>
        </div>
      )}
    </>
  );
}

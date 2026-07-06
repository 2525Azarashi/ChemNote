/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Volume2, VolumeX, Home as HomeIcon, BookOpen, User, Settings, Trophy } from 'lucide-react';
import { Home } from './components/Home';
import { ProfileModal } from './components/ProfileModal';
import { ModeSelection } from './components/ModeSelection';
import { ChapterSelection } from './components/ChapterSelection';
import { Quiz } from './components/Quiz';
import { Explanation } from './components/Explanation';
import { LearningViewer } from './components/LearningViewer';
import { Leaderboard } from './components/Leaderboard';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Intro } from './components/Intro';
import { LogicalTree } from './components/LogicalTree';
import { Flowchart } from './components/Flowchart';
import { AuthButton } from './components/AuthButton';
import { NoteDetail } from './components/NoteDetail';
import { StudyHub } from './components/StudyHub';
import { Onboarding } from './components/Onboarding';
import { MockExam } from './components/MockExam';
import { chemistryData } from './data/chemistryData';
import { useGlobalClickSound } from './hooks/useGlobalClickSound';
import { useIsMobile } from './hooks/useMediaQuery';
import { MobileViewWrapper } from './components/MobileViewWrapper';
import { countIncomingFriendRequests } from './utils/friends';

export type AppState = 'home' | 'mode_selection' | 'chapters' | 'quiz' | 'explanation' | 'learning' | 'intro' | 'flowchart' | 'study_hub' | 'note_detail' | 'onboarding' | 'logical_tree' | 'settings' | 'leaderboard' | 'mock_exam';
export type AppMode = 'mini_test' | 'practice' | 'learning';

export default function App() {
  useGlobalClickSound();

  const [appState, setAppState] = useState<AppState>(() => (localStorage.getItem('savedAppState') as AppState) || 'onboarding');
  const [appMode, setAppMode] = useState<AppMode>(() => (localStorage.getItem('savedAppMode') as AppMode) || 'practice');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(() => localStorage.getItem('savedSelectedChapterId'));
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('savedQuizAnswers') || '{}');
    } catch {
      return {};
    }
  });
  const [forceDesktop, setForceDesktop] = useState(false);
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

  const [lastLearnState, setLastLearnState] = useState<AppState>(() => (localStorage.getItem('savedLastLearnState') as AppState) || 'mode_selection');

  useEffect(() => { localStorage.setItem('savedAppState', appState); }, [appState]);
  useEffect(() => { localStorage.setItem('savedAppMode', appMode); }, [appMode]);
  useEffect(() => {
    if (selectedChapterId) {
      localStorage.setItem('savedSelectedChapterId', selectedChapterId);
    } else {
      localStorage.removeItem('savedSelectedChapterId');
    }
  }, [selectedChapterId]);
  useEffect(() => { localStorage.setItem('savedQuizAnswers', JSON.stringify(quizAnswers)); }, [quizAnswers]);
  useEffect(() => { localStorage.setItem('savedIsGuest', isGuest.toString()); }, [isGuest]);
  
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

  const shouldForceDesktopUI = forceDesktop || isExplanationView || appState === 'explanation';
  const isMobileView = ((isMobileDevice && !shouldForceDesktopUI) || isMobilePreview) && !shouldForceDesktopUI;

  // 解答解説ページ専用のスマホ判定。
  // 【スクロール不具合の修正】
  // 従来は Explanation に isMobileView={false} を固定で渡していたため、
  // 実機スマホでも常に「PC版レイアウト（fixed + overflow-hidden）」で描画され、
  // 縦スクロールできず下部の要素（間違えた問題など）が見られない不具合があった。
  // 解説ページは shouldForceDesktopUI（＝解説中は常に true）に引きずられないよう、
  // 純粋に「スマホ端末 or スマホプレビュー枠」かどうかだけで判定する。
  // ただしユーザーが手動で「PC表示」に切り替えている場合（forceDesktop）は尊重する。
  const isMobileExplanation = (isMobileDevice || isMobilePreview) && !forceDesktop;

  // PC版では「学習モードを選択」(mode_selection) 以外の全画面で外側余白をなくし、
  // ノート風背景を全幅に広げる。mode_selection だけは従来通り中央寄せ＋余白を維持。
  const isFullBleed = appState !== 'mode_selection';

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
          const localProfile = localStorage.getItem(`profile_${user.uid}`);
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
        const scale = Math.min(1, window.innerWidth / 1024);
        viewport.setAttribute('content', `width=1024, initial-scale=${scale}, minimum-scale=${scale}, maximum-scale=3.0, user-scalable=yes`);
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

  const handleStart = () => setAppState('mode_selection');
  const handleIntro = () => setAppState('intro');
  
  const handleSelectMode = (mode: AppMode) => {
    setAppMode(mode);
    if (mode === 'learning') {
      setAppState('learning');
    } else {
      setAppState('chapters');
    }
  };

  const handleSelectChapter = (chapterId: string, questionIndex = 0, resume = false) => {
    setSelectedChapterId(chapterId);
    setAppState('quiz');
    setLastQuizResult(null);

    if (!resume) {
      setQuizAnswers({});
      localStorage.removeItem(`quiz_answers_${chapterId}_${appMode}`);
      localStorage.removeItem(`quiz_run_${chapterId}_${appMode}`);
      localStorage.removeItem(`quiz_expl_${chapterId}_${appMode}`);
      localStorage.setItem(`quiz_idx_${chapterId}_${appMode}`, questionIndex.toString());
    }
  };

  const handleFinishQuiz = (answers: Record<string, string>, result?: any) => {
    setQuizAnswers(answers);
    setLastQuizResult(result || null);
    setAppState('explanation');
    
    // Track chapter completion if not guest
    if (!isGuest && auth.currentUser && selectedChapterId) {
      const uid = auth.currentUser.uid;
      const key = `completed_${uid}`;
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

  const selectedChapter = chemistryData.parts
    .flatMap(p => p.chapters)
    .find(c => (c as any).id === selectedChapterId);

  return (
    <>
      <MobileViewWrapper isMobileMode={isMobilePreview && !shouldForceDesktopUI} onClose={() => setIsMobilePreview(false)}>
        <div className={`min-h-screen w-full flex justify-center relative ${
          isFullBleed
            ? 'p-0 items-stretch'
            : `pt-6 pb-safe-lg md:py-12 px-4 md:px-8 md:pb-28 ${['onboarding', 'intro', 'mode_selection'].includes(appState) ? 'items-center' : 'items-start'}`
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
          
          {/* Mobile/Desktop Display Toggle Button (For actual mobile devices)
              - aria-label と title を日本語で付与し、用途を明示
              - スクリーンリーダーで「PC表示に切り替え／スマホ表示に戻す」と読み上げ可能 */}
          {isMobileDevice && (
            <div className="fixed bottom-28 right-4 z-[9999]">
              <button
                onClick={() => setForceDesktop(!forceDesktop)}
                aria-label={forceDesktop ? "スマホ表示に戻す" : "PC表示に切り替え"}
                title={forceDesktop ? "スマホ表示に戻す" : "PC表示に切り替え（タブレット/PCレイアウトで閲覧）"}
                className={`bg-white rounded-full shadow-xl border-2 border-[#A9CCE3] flex items-center justify-center text-gray-600 hover:text-[#1B2631] transition-all ${forceDesktop ? 'p-5 scale-150 origin-bottom-right' : 'p-3'}`}
              >
                {forceDesktop ? <Smartphone size={28} className="text-[#A9CCE3]" aria-hidden="true" /> : <Monitor size={24} aria-hidden="true" />}
              </button>
            </div>
          )}

          <div className={`w-full relative ${appState === 'explanation' ? 'max-w-none w-full h-full' : (isFullBleed ? 'max-w-none' : 'max-w-5xl')}`}>
            {appState === 'settings' && <ProfileModal onClose={() => setAppState(prevAppState)} isBgmEnabled={isBgmEnabled} setIsBgmEnabled={setIsBgmEnabled} onToggleBgm={handleToggleBgm} bgmVolume={bgmVolume} setBgmVolume={setBgmVolume} />}

            {appState === 'onboarding' && <Onboarding onComplete={() => setAppState('home')} onGuest={() => { setIsGuest(true); setAppState('home'); }} />}
            {appState === 'home' && <Home onStart={handleStart} onIntro={handleIntro} onNoteList={() => setAppState('study_hub')} onLogicalTree={() => setAppState('logical_tree')} onLeaderboard={() => setAppState('leaderboard')} isGuest={isGuest} />}
            {appState === 'leaderboard' && <Leaderboard onBack={() => setAppState('home')} isGuest={isGuest} initialChapterId={selectedChapterId} />}
            {appState === 'intro' && <Intro onBack={() => setAppState('home')} />}
            {appState === 'logical_tree' && <LogicalTree />}
            {appState === 'mode_selection' && <ModeSelection onSelectMode={handleSelectMode} onBack={() => setAppState('home')} onMockExam={() => setAppState('mock_exam')} />}
            {appState === 'mock_exam' && <MockExam onBack={() => setAppState('mode_selection')} />}
            {appState === 'learning' && <LearningViewer onBack={() => setAppState('mode_selection')} />}
            {appState === 'chapters' && <ChapterSelection mode={appMode as 'mini_test' | 'practice'} onSelectChapter={handleSelectChapter} onBack={() => setAppState('mode_selection')} />}
            {appState === 'quiz' && selectedChapter && (
              <Quiz mode={appMode as 'mini_test' | 'practice'} chapter={selectedChapter} onFinish={handleFinishQuiz} onBack={handleBackToChapters} isGuest={isGuest} isMobileView={isMobileView} onExplanationChange={setIsExplanationView} />
            )}
            {appState === 'explanation' && selectedChapter && (
              <Explanation
                mode={appMode as 'mini_test' | 'practice'}
                chapter={selectedChapter}
                answers={quizAnswers}
                onBack={handleBackToChapters}
                isGuest={isGuest}
                isMobileView={isMobileExplanation}
                resultTotalScore={lastQuizResult?.totalScore}
                resultTotalCorrect={lastQuizResult?.totalCorrect}
                resultTotalJudgeable={lastQuizResult?.totalJudgeable}
                resultTotalTimeSec={lastQuizResult?.totalTimeSec}
              />
            )}
            {appState === 'study_hub' && <StudyHub onBack={() => setAppState('home')} isGuest={isGuest} onSelectNote={(note) => { setSelectedNote(note); setAppState('note_detail'); }} onReview={handleReviewNote} />}
            {appState === 'note_detail' && selectedNote && <NoteDetail note={selectedNote} onBack={() => setAppState('study_hub')} onReview={handleReviewNote} />}

            {/* Global Bottom Navigation Footer
                日本語ラベル化（ホーム／学習／設定）＋aria-labelをaria-currentで現在地を明示
                アイコンには aria-hidden を付け、ラベルだけがスクリーンリーダーに読まれるよう整理 */}
            {appState !== 'onboarding' && appState !== 'quiz' && appState !== 'explanation' && (
              <nav
                aria-label="メインナビゲーション"
                className="fixed bottom-0 left-0 right-0 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#D1D5DB]/65 flex justify-around items-center px-2 md:px-10 pb-safe pt-3 z-[60] shadow-sm pb-6"
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

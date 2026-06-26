/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Volume2, VolumeX, Home as HomeIcon, BookOpen, User, Settings } from 'lucide-react';
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
import { NoteList } from './components/NoteList';
import { NoteDetail } from './components/NoteDetail';
import { Onboarding } from './components/Onboarding';
import { chemistryData } from './data/chemistryData';
import { useGlobalClickSound } from './hooks/useGlobalClickSound';
import { MobileViewWrapper } from './components/MobileViewWrapper';

export type AppState = 'home' | 'mode_selection' | 'chapters' | 'quiz' | 'explanation' | 'learning' | 'intro' | 'flowchart' | 'note_list' | 'note_detail' | 'onboarding' | 'logical_tree' | 'settings' | 'leaderboard';
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
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('savedIsGuest') === 'true');
  const [isExplanationView, setIsExplanationView] = useState(false);
  const [prevAppState, setPrevAppState] = useState<AppState>('home');

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
    if (['mode_selection', 'learning', 'chapters', 'quiz', 'explanation'].includes(appState)) {
      setLastLearnState(appState);
      localStorage.setItem('savedLastLearnState', appState);
    }
  }, [appState]);

  const isFirstLoad = useRef(true);

  const shouldForceDesktopUI = forceDesktop || isExplanationView || appState === 'explanation';
  const isMobileView = ((isMobileDevice && !shouldForceDesktopUI) || isMobilePreview) && !shouldForceDesktopUI;

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
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAudioValid, setIsAudioValid] = useState(true);
  const hasLoggedAudioError = useRef(false);

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
        audio.volume = 0.1;
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
    const checkMobile = () => {
      setIsMobileDevice(/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      if (shouldForceDesktopUI) {
        const scale = Math.min(1, window.innerWidth / 1024);
        viewport.setAttribute('content', `width=1024, initial-scale=${scale}, minimum-scale=${scale}, maximum-scale=3.0, user-scalable=yes`);
      } else {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
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

  const handleSelectChapter = (chapterId: string, questionIndex = 0) => {
    setSelectedChapterId(chapterId);
    setAppState('quiz');
    setQuizAnswers({});
    localStorage.setItem(`quiz_idx_${chapterId}_${appMode}`, questionIndex.toString());
  };

  const handleFinishQuiz = (answers: Record<string, string>) => {
    setQuizAnswers(answers);
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

  const selectedChapter = chemistryData.parts
    .flatMap(p => p.chapters)
    .find(c => (c as any).id === selectedChapterId);

  return (
    <>
      <MobileViewWrapper isMobileMode={isMobilePreview && !shouldForceDesktopUI} onClose={() => setIsMobilePreview(false)}>
        <div className={`min-h-screen w-full flex justify-center pt-6 pb-24 md:py-12 px-4 md:px-8 md:pb-28 relative ${['onboarding', 'intro', 'mode_selection'].includes(appState) ? 'items-center' : 'items-start'}`}>
          <audio 
            ref={audioRef} 
            src="/tanjou.mp3" 
            loop 
            preload="auto" 
            crossOrigin="anonymous"
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

          <div className={`w-full relative ${appState === 'explanation' ? 'max-w-none w-full h-full' : 'max-w-5xl'}`}>
            {appState === 'settings' && <ProfileModal onClose={() => setAppState(prevAppState)} isBgmEnabled={isBgmEnabled} setIsBgmEnabled={setIsBgmEnabled} />}

            {appState === 'onboarding' && <Onboarding onComplete={() => setAppState('home')} onGuest={() => { setIsGuest(true); setAppState('home'); }} />}
            {appState === 'home' && <Home onStart={handleStart} onIntro={handleIntro} onNoteList={() => setAppState('note_list')} onLogicalTree={() => setAppState('logical_tree')} onLeaderboard={() => setAppState('leaderboard')} isGuest={isGuest} />}
            {appState === 'leaderboard' && <Leaderboard onBack={() => setAppState('home')} isGuest={isGuest} initialChapterId={selectedChapterId} />}
            {appState === 'intro' && <Intro onBack={() => setAppState('home')} />}
            {appState === 'logical_tree' && <LogicalTree />}
            {appState === 'mode_selection' && <ModeSelection onSelectMode={handleSelectMode} onBack={() => setAppState('home')} />}
            {appState === 'learning' && <LearningViewer onBack={() => setAppState('mode_selection')} />}
            {appState === 'chapters' && <ChapterSelection mode={appMode as 'mini_test' | 'practice'} onSelectChapter={handleSelectChapter} onBack={() => setAppState('mode_selection')} />}
            {appState === 'quiz' && selectedChapter && (
              <Quiz mode={appMode as 'mini_test' | 'practice'} chapter={selectedChapter} onFinish={handleFinishQuiz} onBack={handleBackToChapters} isGuest={isGuest} isMobileView={isMobileView} onExplanationChange={setIsExplanationView} />
            )}
            {appState === 'explanation' && selectedChapter && (
              <Explanation mode={appMode as 'mini_test' | 'practice'} chapter={selectedChapter} answers={quizAnswers} onBack={handleBackToChapters} isGuest={isGuest} isMobileView={false} />
            )}
            {appState === 'note_list' && <NoteList onBack={() => setAppState('home')} onSelectNote={(note) => { setSelectedNote(note); setAppState('note_detail'); }} />}
            {appState === 'note_detail' && selectedNote && <NoteDetail note={selectedNote} onBack={() => setAppState('note_list')} />}

            {/* Global Bottom Navigation Footer
                日本語ラベル化（ホーム／学習／設定）＋aria-labelをaria-currentで現在地を明示
                アイコンには aria-hidden を付け、ラベルだけがスクリーンリーダーに読まれるよう整理 */}
            {appState !== 'onboarding' && appState !== 'quiz' && appState !== 'explanation' && (
              <nav
                aria-label="メインナビゲーション"
                className="fixed bottom-0 left-0 right-0 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#D1D5DB]/65 flex justify-around items-center px-4 md:px-10 pb-safe pt-3 z-[60] shadow-sm pb-6"
              >
                <button 
                  onClick={() => setAppState('home')}
                  aria-label="ホーム画面へ移動"
                  aria-current={appState === 'home' ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center w-16 gap-1.5 min-h-[44px] transition-colors ${appState === 'home' ? 'text-[#1B2631] font-bold' : 'text-[#4B5563]/60 hover:text-[#1B2631]/80'}`}
                >
                  <HomeIcon className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                  <span className="text-[10px] tracking-wider font-modern">ホーム</span>
                </button>
                
                <button 
                  onClick={() => {
                    if (appState === 'home' || appState === 'note_list' || appState === 'note_detail') {
                      setAppState(lastLearnState);
                    } else {
                      setAppState('mode_selection');
                    }
                  }}
                  aria-label="学習画面へ移動"
                  aria-current={['mode_selection', 'chapters', 'learning', 'explanation', 'quiz'].includes(appState) ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center w-16 gap-1.5 min-h-[44px] transition-colors ${['mode_selection', 'chapters', 'learning', 'explanation', 'quiz'].includes(appState) ? 'text-[#1B2631] font-bold' : 'text-[#4B5563]/60 hover:text-[#1B2631]/80'}`}
                >
                  <BookOpen className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                  <span className="text-[10px] tracking-wider font-modern">学習</span>
                </button>

                <button 
                  onClick={() => {
                    if (appState !== 'settings') {
                      setPrevAppState(appState);
                    }
                    setAppState('settings');
                  }}
                  aria-label="設定画面へ移動"
                  aria-current={appState === 'settings' ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center w-16 gap-1.5 min-h-[44px] transition-colors ${appState === 'settings' ? 'text-[#1B2631] font-bold' : 'text-[#4B5563]/60 hover:text-[#1B2631]/80'}`}
                >
                  <Settings className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
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

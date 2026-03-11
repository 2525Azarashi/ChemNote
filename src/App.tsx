/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Volume2, VolumeX } from 'lucide-react';
import { Home } from './components/Home';
import { ModeSelection } from './components/ModeSelection';
import { ChapterSelection } from './components/ChapterSelection';
import { Quiz } from './components/Quiz';
import { Explanation } from './components/Explanation';
import { LearningViewer } from './components/LearningViewer';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Intro } from './components/Intro';
import { Flowchart } from './components/Flowchart';
import { AuthButton } from './components/AuthButton';
import { NoteList } from './components/NoteList';
import { NoteDetail } from './components/NoteDetail';
import { Onboarding } from './components/Onboarding';
import { chemistryData } from './data/chemistryData';
import { useGlobalClickSound } from './hooks/useGlobalClickSound';
import bgmUrl from './assets/bgm.mp3';

export type AppState = 'home' | 'mode_selection' | 'chapters' | 'quiz' | 'explanation' | 'learning' | 'intro' | 'flowchart' | 'note_list' | 'note_detail' | 'onboarding';
export type AppMode = 'mini_test' | 'practice' | 'learning';

export default function App() {
  useGlobalClickSound();

  const [appState, setAppState] = useState<AppState>('onboarding');
  const [appMode, setAppMode] = useState<AppMode>('mini_test');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [forceDesktop, setForceDesktop] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAppState('onboarding');
      } else {
        try {
          // Firestoreの代わりにlocalStorageを使用
          const localProfile = localStorage.getItem(`profile_${user.uid}`);
          if (!localProfile) {
            setAppState('onboarding');
          } else {
            setAppState('home');
          }
        } catch (error) {
          console.error("Error in onAuthStateChanged:", error);
          setAppState('onboarding');
        }
      }
    });
    return unsubscribe;
  }, []);
  
  // BGM state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isBgmEnabled, setIsBgmEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      // Explicitly try to play if it was blocked
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.warn('BGM play failed on interaction:', e));
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
      if (forceDesktop) {
        viewport.setAttribute('content', 'width=1024');
      } else {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    }
  }, [forceDesktop]);

  // BGM Logic
  useEffect(() => {
    if (!audioRef.current) {
      // Create audio element with imported asset
      const audio = new Audio(bgmUrl);
      audio.loop = true;
      audio.volume = 0.1; // Low volume
      
      audio.addEventListener('error', (e) => {
        console.error('BGM Audio Error:', audio.error);
        // Fallback to public folder if asset import fails
        if (audio.src !== window.location.origin + '/bgm.mp3') {
          console.log('Attempting fallback to /bgm.mp3');
          audio.src = '/bgm.mp3';
          if (isBgmEnabled && hasInteracted && !['quiz', 'explanation'].includes(appState)) {
            audio.play().catch(err => console.warn('Fallback BGM play failed:', err));
          }
        }
      });

      audioRef.current = audio;
    }

    const audio = audioRef.current;
    
    // Play BGM except during quiz and explanation, and only after user interaction
    const shouldPlay = isBgmEnabled && hasInteracted && !['quiz', 'explanation'].includes(appState);

    if (shouldPlay) {
      // Play might fail if user hasn't interacted with the document yet or if source is invalid
      audio.play().catch(e => {
        if (e.name === 'NotSupportedError') {
          console.warn('BGM source invalid or blocked by browser:', e.message);
        } else {
          console.warn('BGM autoplay prevented by browser:', e.message);
        }
      });
    } else {
      audio.pause();
    }
  }, [appState, isBgmEnabled, hasInteracted]);

  const handleStart = () => setAppState('mode_selection');
  const handleIntro = () => setAppState('intro');
  const handleFlowchart = () => setAppState('flowchart');
  
  const handleSelectMode = (mode: AppMode) => {
    setAppMode(mode);
    if (mode === 'learning') {
      setAppState('learning');
    } else {
      setAppState('chapters');
    }
  };

  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setAppState('quiz');
    setQuizAnswers({});
  };

  const handleFinishQuiz = (answers: Record<string, string>) => {
    setQuizAnswers(answers);
    setAppState('explanation');
  };

  const handleBackToChapters = () => {
    setAppState('chapters');
    setSelectedChapterId(null);
  };

  const selectedChapter = chemistryData.parts
    .flatMap(p => p.chapters)
    .find(c => c.id === selectedChapterId);

  return (
    <div className="min-h-screen w-full flex justify-center items-center py-6 md:py-12 px-4 md:px-8 relative">
      {/* BGM Toggle Button */}
      <button 
        onClick={() => setIsBgmEnabled(!isBgmEnabled)}
        className="absolute top-4 left-4 z-50 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-[#2C3E50] transition-colors"
        title={isBgmEnabled ? "BGMをオフにする" : "BGMをオンにする"}
      >
        {isBgmEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Auth Button */}
      <div className="absolute top-4 right-4 z-50">
        <AuthButton />
      </div>

      {/* Mobile Toggle Button */}
      {isMobileDevice && (
        <div className="fixed bottom-4 right-4 z-[9999]">
          <button
            onClick={() => setForceDesktop(!forceDesktop)}
            className={`bg-white rounded-full shadow-xl border-2 border-[#A9CCE3] flex items-center justify-center text-gray-600 hover:text-[#1B2631] transition-all ${forceDesktop ? 'p-5 scale-150 origin-bottom-right' : 'p-3'}`}
            title={forceDesktop ? "スマホ表示に戻す" : "PC表示に切り替え"}
          >
            {forceDesktop ? <Smartphone size={28} className="text-[#A9CCE3]" /> : <Monitor size={24} />}
          </button>
        </div>
      )}

      <div className="w-full max-w-5xl relative">
        {appState === 'onboarding' && <Onboarding onComplete={() => setAppState('home')} />}
        {appState === 'home' && <Home onStart={handleStart} onIntro={handleIntro} onNoteList={() => setAppState('note_list')} />}
        {appState === 'intro' && <Intro onBack={() => setAppState('home')} />}
        {appState === 'flowchart' && <Flowchart onBack={() => {
          // If we have a selected chapter or were in chapters mode, go back there
          // For now, let's just go back to chapters if we were there
          setAppState('chapters');
        }} />}
        {appState === 'mode_selection' && <ModeSelection onSelectMode={handleSelectMode} onBack={() => setAppState('home')} />}
        {appState === 'learning' && <LearningViewer onBack={() => setAppState('mode_selection')} />}
        {appState === 'chapters' && <ChapterSelection mode={appMode as 'mini_test' | 'practice'} onSelectChapter={handleSelectChapter} onBack={() => setAppState('mode_selection')} onFlowchart={handleFlowchart} />}
        {appState === 'quiz' && selectedChapter && (
          <Quiz mode={appMode as 'mini_test' | 'practice'} chapter={selectedChapter} onFinish={handleFinishQuiz} onBack={handleBackToChapters} />
        )}
        {appState === 'explanation' && selectedChapter && (
          <Explanation mode={appMode as 'mini_test' | 'practice'} chapter={selectedChapter} answers={quizAnswers} onBack={handleBackToChapters} />
        )}
        {appState === 'note_list' && <NoteList onBack={() => setAppState('home')} onSelectNote={(note) => { setSelectedNote(note); setAppState('note_detail'); }} />}
        {appState === 'note_detail' && selectedNote && <NoteDetail note={selectedNote} onBack={() => setAppState('note_list')} />}
      </div>
    </div>
  );
}

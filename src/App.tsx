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
import { Intro } from './components/Intro';
import { chemistryData } from './data/chemistryData';
import { useGlobalClickSound } from './hooks/useGlobalClickSound';
import bgmUrl from './assets/bgm.mp3';

export type AppState = 'home' | 'mode_selection' | 'chapters' | 'quiz' | 'explanation' | 'learning' | 'intro';
export type AppMode = 'mini_test' | 'practice' | 'learning';

export default function App() {
  useGlobalClickSound();

  const [appState, setAppState] = useState<AppState>('home');
  const [appMode, setAppMode] = useState<AppMode>('mini_test');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [forceDesktop, setForceDesktop] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
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
        {appState === 'home' && <Home onStart={handleStart} onIntro={handleIntro} />}
        {appState === 'intro' && <Intro onBack={() => setAppState('home')} />}
        {appState === 'mode_selection' && <ModeSelection onSelectMode={handleSelectMode} onBack={() => setAppState('home')} />}
        {appState === 'learning' && <LearningViewer onBack={() => setAppState('mode_selection')} />}
        {appState === 'chapters' && <ChapterSelection mode={appMode as 'mini_test' | 'practice'} onSelectChapter={handleSelectChapter} onBack={() => setAppState('mode_selection')} />}
        {appState === 'quiz' && selectedChapter && (
          <Quiz mode={appMode as 'mini_test' | 'practice'} chapter={selectedChapter} onFinish={handleFinishQuiz} onBack={handleBackToChapters} />
        )}
        {appState === 'explanation' && selectedChapter && (
          <Explanation mode={appMode as 'mini_test' | 'practice'} chapter={selectedChapter} answers={quizAnswers} onBack={handleBackToChapters} />
        )}
      </div>
    </div>
  );
}

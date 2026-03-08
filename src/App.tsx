/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Home } from './components/Home';
import { ModeSelection } from './components/ModeSelection';
import { ChapterSelection } from './components/ChapterSelection';
import { Quiz } from './components/Quiz';
import { Explanation } from './components/Explanation';
import { chemistryData } from './data/chemistryData';

export type AppState = 'home' | 'mode_selection' | 'chapters' | 'quiz' | 'explanation';
export type AppMode = 'mini_test' | 'practice';

export default function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [appMode, setAppMode] = useState<AppMode>('mini_test');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [forceDesktop, setForceDesktop] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

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

  const handleStart = () => setAppState('mode_selection');
  
  const handleSelectMode = (mode: AppMode) => {
    setAppMode(mode);
    setAppState('chapters');
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
    <div className="min-h-screen w-full flex justify-center items-center py-6 md:py-12 px-4 md:px-8">
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
        {appState === 'home' && <Home onStart={handleStart} />}
        {appState === 'mode_selection' && <ModeSelection onSelectMode={handleSelectMode} onBack={() => setAppState('home')} />}
        {appState === 'chapters' && <ChapterSelection mode={appMode} onSelectChapter={handleSelectChapter} onBack={() => setAppState('mode_selection')} />}
        {appState === 'quiz' && selectedChapter && (
          <Quiz mode={appMode} chapter={selectedChapter} onFinish={handleFinishQuiz} onBack={handleBackToChapters} />
        )}
        {appState === 'explanation' && selectedChapter && (
          <Explanation mode={appMode} chapter={selectedChapter} answers={quizAnswers} onBack={handleBackToChapters} />
        )}
      </div>
    </div>
  );
}

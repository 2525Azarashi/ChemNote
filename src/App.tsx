/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Home } from './components/Home';
import { ChapterSelection } from './components/ChapterSelection';
import { Quiz } from './components/Quiz';
import { Explanation } from './components/Explanation';
import { chemistryData } from './data/chemistryData';

export type AppState = 'home' | 'chapters' | 'quiz' | 'explanation';

export default function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [forceDesktop, setForceDesktop] = useState(false);

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

  const handleStart = () => setAppState('chapters');
  
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
      <div className={`fixed bottom-4 right-4 z-50 ${forceDesktop ? 'block' : 'md:hidden'}`}>
        <button
          onClick={() => setForceDesktop(!forceDesktop)}
          className="bg-white p-3 rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#A9CCE3] transition-colors"
          title={forceDesktop ? "スマホ表示に戻す" : "PC表示に切り替え"}
        >
          {forceDesktop ? <Smartphone size={24} /> : <Monitor size={24} />}
        </button>
      </div>

      <div className="w-full max-w-5xl relative">
        {appState === 'home' && <Home onStart={handleStart} />}
        {appState === 'chapters' && <ChapterSelection onSelectChapter={handleSelectChapter} />}
        {appState === 'quiz' && selectedChapter && (
          <Quiz chapter={selectedChapter} onFinish={handleFinishQuiz} onBack={handleBackToChapters} />
        )}
        {appState === 'explanation' && selectedChapter && (
          <Explanation chapter={selectedChapter} answers={quizAnswers} onBack={handleBackToChapters} />
        )}
      </div>
    </div>
  );
}

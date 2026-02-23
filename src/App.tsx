/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
    <div className="min-h-screen w-full flex justify-center items-center py-12 px-4 md:px-8">
      <div className="w-full max-w-4xl relative">
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

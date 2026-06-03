import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { InteractiveTree } from './InteractiveTree';
import { substanceTreeData } from '../data/chemistryData';

interface LearningViewerProps {
  onBack: () => void;
}

export function LearningViewer({ onBack }: LearningViewerProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full notebook-paper rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 relative min-h-[80vh] flex flex-col">
      <div className="flex justify-start items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-[#2C3E50] transition-colors font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm border border-gray-200"
        >
          <ArrowLeft size={20} />
          <span>戻る</span>
        </button>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-4xl font-handwriting font-bold text-[#2C3E50] mb-3">
          学習フローチャート
        </h2>
        <p className="text-sm md:text-base text-gray-600 font-modern">
          各ノードをタップして、詳細な解説と知識のつながりを確認しましょう
        </p>
      </div>

      <div className="flex-grow w-full bg-transparent rounded-xl relative p-1 sm:p-4">
        <InteractiveTree data={substanceTreeData} />
      </div>
    </div>
  );
}

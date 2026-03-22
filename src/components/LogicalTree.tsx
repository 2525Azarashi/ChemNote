import React, { useState } from 'react';
import { Search, Network, Info, BookOpen } from 'lucide-react';
import { InteractiveTree } from './InteractiveTree';
import { substanceTreeData } from '../data/chemistryData';

export const LogicalTree = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const handleQuestionClick = (qId: string) => {
    console.log('Question clicked:', qId);
    // In a real app, this might navigate to the question
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Network className="w-7 h-7 text-indigo-600" />
                ロジックツリー
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                化学の概念を論理的に整理し、関連する演習問題を確認できます。
              </p>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="物質名やキーワードで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setExpandedStep('1')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${expandedStep === '1' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Step 1: 物質の分類
            </button>
            <button 
              onClick={() => setExpandedStep('2')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${expandedStep === '2' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Step 2: 性質の比較
            </button>
            <button 
              onClick={() => setExpandedStep('3')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${expandedStep === '3' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Step 3: 単体と元素
            </button>
            <button 
              onClick={() => setExpandedStep(null)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
            >
              すべて閉じる
            </button>
          </div>
        </div>

        {/* Tree Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Info className="w-4 h-4 text-indigo-500" />
              ノードをクリックすると詳細な解説と関連問題が表示されます
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> Step 1
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div> Step 2
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div> Step 3
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-10 overflow-x-auto">
            <InteractiveTree 
              data={substanceTreeData} 
              onQuestionClick={handleQuestionClick}
              expandedStep={expandedStep}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">学習の進め方</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              ツリーを上から順に辿ることで、化学の基礎概念を体系的に理解できます。各ステップの演習問題に挑戦しましょう。
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm md:col-span-2">
            <h3 className="font-bold text-slate-800 mb-4">現在の学習状況</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Step 1: 物質の分類</span>
                <span className="font-semibold text-indigo-600">85% 完了</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[85%] rounded-full"></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Step 2: 性質の比較</span>
                <span className="font-semibold text-indigo-600">40% 完了</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[40%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

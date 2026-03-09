import React, { useEffect } from 'react';
import { Target, BookOpen, ArrowLeft } from 'lucide-react';

interface ModeSelectionProps {
  onSelectMode: (mode: 'mini_test' | 'practice') => void;
  onBack: () => void;
}

export function ModeSelection({ onSelectMode, onBack }: ModeSelectionProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full notebook-paper rounded-2xl p-6 md:p-12 min-h-[60vh] flex flex-col items-center justify-center relative">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-gray-500 hover:text-[#2C3E50] transition-colors font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm"
      >
        <ArrowLeft size={20} />
        <span>戻る</span>
      </button>

      {/* Logo */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
        <img src="https://lh3.googleusercontent.com/d/1bdaFoRcprvig_57izYdAEzon1gD47_Wk" alt="Logo" className="h-8 md:h-12 object-contain" referrerPolicy="no-referrer" />
      </div>

      <h2 className="text-2xl md:text-4xl font-handwriting font-bold text-[#2C3E50] mb-8 md:mb-12 mt-12 md:mt-0">
        学習モードを選択
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <button
          onClick={() => onSelectMode('mini_test')}
          className="group bg-white p-6 md:p-8 rounded-2xl shadow-md border-2 border-transparent hover:border-[#A9CCE3] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#A9CCE3]/20 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
            <Target className="text-[#A9CCE3] w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-handwriting text-[#2C3E50] mb-3 md:mb-4">小テスト</h3>
          <p className="text-sm md:text-base text-gray-600 font-handwriting leading-relaxed">
            各単元の重要なポイントを確認するための短いテストです。基礎固めに最適です。
          </p>
        </button>

        <button
          onClick={() => onSelectMode('practice')}
          className="group bg-white p-6 md:p-8 rounded-2xl shadow-md border-2 border-transparent hover:border-[#D9A0A0] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#D9A0A0]/20 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
            <BookOpen className="text-[#D9A0A0] w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-handwriting text-[#2C3E50] mb-3 md:mb-4">演習問題</h3>
          <p className="text-sm md:text-base text-gray-600 font-handwriting leading-relaxed">
            より実践的な問題に取り組みます。応用力を身につけたい場合におすすめです。
          </p>
        </button>
      </div>
    </div>
  );
}

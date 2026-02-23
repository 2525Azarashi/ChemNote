import React, { useState } from 'react';
import { ChevronRight, Edit3, ArrowLeft } from 'lucide-react';

interface QuizProps {
  chapter: any;
  onFinish: (answers: Record<string, string>) => void;
  onBack: () => void;
}

export function Quiz({ chapter, onFinish, onBack }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleOptionSelect = (sqId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [sqId]: option }));
  };

  const handleTextChange = (sqId: string, text: string) => {
    setAnswers(prev => ({ ...prev, [sqId]: text }));
  };

  const isComplete = chapter.miniTest.every((q: any) => 
    q.subQuestions.every((sq: any) => answers[sq.id] && answers[sq.id].trim() !== '')
  );

  if (chapter.miniTest.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 text-center">
        <h2 className="text-2xl font-modern font-bold text-gray-800 mb-4">
          {chapter.abstractTitle}
        </h2>
        <p className="text-gray-500 font-modern mb-8">
          この単元の問題はまだ追加されていません。
        </p>
        <button
          onClick={() => onFinish({})}
          className="bg-[#1B2631] text-white px-6 py-3 rounded-xl font-bold"
        >
          戻る
        </button>
      </div>
    );
  }

  return (
    <div className="w-full notebook-paper rounded-2xl p-8 md:p-12 relative">
      <div className="flex items-start justify-between mb-8 border-b-2 border-dashed border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-handwriting text-[#2C3E50] mb-2 font-bold tracking-wide">
            {chapter.abstractTitle} - 小テスト
          </h2>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-[#D9A0A0] transition-colors font-modern font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
        >
          <ArrowLeft size={18} />
          <span>戻る</span>
        </button>
      </div>

      <div className="space-y-12">
        {chapter.miniTest.map((q: any, i: number) => (
          <div key={q.id} className="bg-white/60 rounded-2xl p-6 md:p-8 shadow-sm border border-[#A9CCE3]/30 relative">
            <div className="absolute -top-5 -left-5 w-12 h-12 bg-[#FFB7B2] text-white rounded-full flex items-center justify-center font-handwriting text-xl font-bold shadow-md transform -rotate-6">
              Q{i + 1}
            </div>
            
            <p className="text-lg text-gray-800 font-modern mb-8 leading-relaxed"
               dangerouslySetInnerHTML={{
                 __html: q.text.replace(/\n/g, '<br/>').replace(/<u>/g, '<u class="decoration-[#D9A0A0] decoration-4 underline-offset-4">')
               }}
            />

            <div className="space-y-4">
              {q.subQuestions.map((sq: any) => (
                <div key={sq.id} className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <span className="font-bold text-[#1B2631] min-w-[60px] text-center bg-gray-50 py-1 px-2 rounded-md">{sq.label}</span>
                  
                  {sq.type === 'multiple_choice' ? (
                    <div className="flex flex-wrap gap-3">
                      {sq.options.map((opt: string) => (
                        <button
                          key={opt}
                          onClick={() => handleOptionSelect(sq.id, opt)}
                          className={`px-5 py-2 rounded-full font-bold text-md transition-all duration-200 border-2 flex items-center justify-center
                            ${answers[sq.id] === opt 
                              ? 'bg-[#A9CCE3] text-white border-[#A9CCE3] shadow-md scale-105' 
                              : 'bg-white text-gray-600 border-gray-200 hover:border-[#A9CCE3] hover:text-[#A9CCE3]'
                            }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : sq.type === 'descriptive' ? (
                    <div className="flex-1 relative">
                      <Edit3 className="absolute left-3 top-4 text-gray-400" size={18} />
                      <textarea
                        value={answers[sq.id] || ''}
                        onChange={(e) => handleTextChange(sq.id, e.target.value)}
                        placeholder="解答を入力..."
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern resize-none"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 relative">
                      <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={answers[sq.id] || ''}
                        onChange={(e) => handleTextChange(sq.id, e.target.value)}
                        placeholder="解答を入力..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#A9CCE3] focus:border-[#A9CCE3] outline-none transition-all font-modern"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-end">
        <button
          onClick={() => onFinish(answers)}
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold tracking-wider transition-all duration-300 bg-[#D9A0A0] text-white shadow-lg hover:bg-[#c98f8f] hover:shadow-xl hover:-translate-y-1"
        >
          <span>分析を開始する</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

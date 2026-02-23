import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, BookOpen, AlertCircle, CheckSquare } from 'lucide-react';

interface ExplanationProps {
  chapter: any;
  answers: Record<string, string>;
  onBack: () => void;
}

export function Explanation({ chapter, answers, onBack }: ExplanationProps) {
  const [selfGrades, setSelfGrades] = useState<Record<string, boolean>>({});

  const toggleGrade = (criteriaId: string) => {
    setSelfGrades(prev => ({ ...prev, [criteriaId]: !prev[criteriaId] }));
  };

  if (chapter.miniTest.length === 0) {
    return (
      <div className="w-full text-center">
        <button onClick={onBack} className="bg-[#1B2631] text-white px-6 py-3 rounded-xl font-bold">
          戻る
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/40">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#1B2631] transition-colors font-modern font-bold"
        >
          <ArrowLeft size={20} />
          <span>単元選択に戻る</span>
        </button>
        <div className="text-sm font-bold text-gray-400">
          {chapter.realTitle}
        </div>
      </div>

      {chapter.miniTest.map((q: any, i: number) => (
        <div key={q.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Problem Restatement */}
          <div className="bg-[#FDFBF7] p-6 md:p-8 border-b border-gray-100 relative">
            <div className="inline-flex items-center gap-2 bg-[#A9CCE3] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              <span>Q{i + 1}</span>
              <span>問題再掲</span>
            </div>
            <p className="text-gray-700 font-modern leading-relaxed"
               dangerouslySetInnerHTML={{
                 __html: q.text.replace(/\n/g, '<br/>').replace(/<u>/g, '<u class="decoration-[#D9A0A0] decoration-4 underline-offset-4">')
               }}
            />
          </div>

          {/* Answers & Results */}
          <div className="p-6 md:p-8 bg-white">
            <h3 className="text-lg font-bold text-[#1B2631] mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" />
              <span>答え合わせ</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {q.subQuestions.map((sq: any) => {
                if (sq.type === 'descriptive') {
                  return (
                    <div key={sq.id} className="p-4 rounded-xl border-2 border-blue-100 bg-blue-50/30 col-span-1 md:col-span-2 flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className="font-bold text-gray-500 mt-1">{sq.label}</div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-500 mb-1">あなたの解答</div>
                          <div className="font-bold text-lg text-gray-700 mb-4 whitespace-pre-wrap">
                            {answers[sq.id] || '未解答'}
                          </div>
                          <div className="text-sm text-gray-500 mb-1">模範解答</div>
                          <div className="font-bold text-lg text-[#1B2631] mb-4">{sq.correctAnswer}</div>
                          
                          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                            <div className="text-sm font-bold text-[#2C3E50] mb-3 flex items-center gap-2">
                              <CheckSquare size={16} className="text-blue-500" />
                              <span>自己採点チェック（部分点基準）</span>
                            </div>
                            <div className="space-y-3">
                              {sq.gradingCriteria?.map((criteria: string, cIdx: number) => {
                                const criteriaId = `${sq.id}_${cIdx}`;
                                const isChecked = selfGrades[criteriaId] || false;
                                return (
                                  <label key={cIdx} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggleGrade(criteriaId)}>
                                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${isChecked ? 'bg-blue-500 border-blue-500' : 'border-gray-300 group-hover:border-blue-400 bg-white'}`}>
                                      {isChecked && <CheckCircle2 size={14} className="text-white" />}
                                    </div>
                                    <span className={`text-sm leading-tight ${isChecked ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>{criteria}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                const isCorrect = answers[sq.id] === sq.correctAnswer;
                return (
                  <div key={sq.id} className={`p-4 rounded-xl border-2 flex items-start gap-4 ${isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                    <div className="font-bold text-gray-500 mt-1">{sq.label}</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">あなたの解答</div>
                      <div className={`font-bold text-lg ${isCorrect ? 'text-green-600' : 'text-red-500 line-through opacity-70'}`}>
                        {answers[sq.id] || '未解答'}
                      </div>
                      {!isCorrect && (
                        <div className="mt-2">
                          <div className="text-sm text-gray-500 mb-1">正解</div>
                          <div className="font-bold text-lg text-[#1B2631]">{sq.correctAnswer}</div>
                        </div>
                      )}
                      {sq.partialCreditCriteria && (
                        <div className="mt-3 text-xs bg-yellow-50 text-yellow-800 p-2 rounded flex items-start gap-1">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <span>{sq.partialCreditCriteria}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      {isCorrect ? <CheckCircle2 className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation Memo */}
            <div className="masking-tape bg-[#FDFBF7] p-6 md:p-8 rounded-xl shadow-inner border border-gray-200 relative mt-12">
              <h4 className="font-handwriting text-xl text-[#1B2631] mb-4 flex items-center gap-2 border-b-2 border-[#1B2631] pb-2 inline-flex">
                <Lightbulb size={24} className="text-[#F9E79F]" />
                <span>解説・論理ツリー</span>
              </h4>
              <p className="text-gray-700 font-modern whitespace-pre-wrap leading-relaxed mb-8">
                {q.explanation}
              </p>

              <div className="space-y-6">
                <div>
                  <h5 className="font-bold text-[#2C3E50] mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-[#A9CCE3]" />
                    <span>周辺知識</span>
                  </h5>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 font-modern">
                    {q.surroundingKnowledge.map((k: string, idx: number) => (
                      <li key={idx} className="pl-2">{k}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl border border-dashed border-[#D9A0A0]">
                  <h5 className="font-bold text-[#D9A0A0] mb-3">さらに深掘り</h5>
                  <div className="space-y-4">
                    {q.deepDiveTopics.map((topic: string, idx: number) => {
                      const [title, ...content] = topic.split('\n');
                      return (
                        <div key={idx}>
                          <div className="font-bold text-gray-700 text-sm mb-1">{title}</div>
                          <div className="text-gray-600 text-sm">{content.join('\n')}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

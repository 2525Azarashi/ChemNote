import React, { useEffect } from 'react';
import { chemistryData } from '../data/chemistryData';
import { ChevronRight, Target } from 'lucide-react';

interface ChapterSelectionProps {
  onSelectChapter: (id: string) => void;
}

export function ChapterSelection({ onSelectChapter }: ChapterSelectionProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full notebook-paper rounded-2xl p-8 md:p-12">
      
      <div className="space-y-20">
        {chemistryData.parts.map(part => {
          // Group chapters by realTitle (e.g., "1章 物質の構成")
          const chaptersByGroup = part.chapters.reduce((acc, chapter) => {
            const group = chapter.realTitle || "その他";
            if (!acc[group]) acc[group] = [];
            acc[group].push(chapter);
            return acc;
          }, {} as Record<string, typeof part.chapters>);

          return (
            <div key={part.id}>
              <h3 className="text-2xl font-handwriting font-bold text-[#D9A0A0] mb-10 border-b-4 border-double border-gray-200 pb-2 flex items-center gap-3">
                <span className="bg-[#D9A0A0] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm">
                  {part.id === 'part1' ? '1' : '2'}
                </span>
                {part.title}
              </h3>
              
              <div className="space-y-16">
                {Object.entries(chaptersByGroup).map(([groupTitle, chapters], groupIndex, array) => (
                  <div key={groupTitle} className="relative">
                    {/* Chapter Group Title */}
                    <h4 className="text-xl font-handwriting font-bold text-[#2C3E50] mb-6 pl-4 border-l-4 border-[#A9CCE3] flex items-center">
                      {groupTitle}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {chapters.map(chapter => (
                        <button
                          key={chapter.id}
                          onClick={() => onSelectChapter(chapter.id)}
                          className="group relative sticky-note rounded-xl p-6 text-left flex flex-col justify-between min-h-[180px] border border-yellow-100 transition-all duration-300 hover:rotate-1 hover:scale-[1.02] hover:shadow-lg hover:z-10"
                        >
                          <div className="absolute top-4 right-4 text-yellow-600/50 group-hover:text-[#D9A0A0] transition-colors">
                            <ChevronRight size={24} />
                          </div>
                          
                          <div className="w-full">
                            {chapter.miniTest.length > 0 && (
                              <div className="inline-flex items-center gap-2 bg-white/60 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-sm">
                                <Target size={14} className="text-[#D9A0A0]" />
                                <span>TARGET_PROBLEM</span>
                              </div>
                            )}
                            
                            <h5 className="text-lg font-handwriting font-bold text-[#2C3E50] group-hover:text-[#D9A0A0] transition-colors leading-tight mb-4">
                              {chapter.abstractTitle}
                            </h5>

                            {/* Topics List */}
                            {chapter.topics && chapter.topics.length > 0 && (
                              <ul className="text-xs text-gray-600 font-modern space-y-1.5 pl-1">
                                {chapter.topics.map((topic, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-[#A9CCE3] mt-0.5">•</span>
                                    <span className="opacity-90">{topic}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="mt-6 pt-4 border-t border-yellow-200/50 w-full flex justify-between items-center">
                            <span className="text-xs text-gray-400 font-modern">
                              {chapter.topics.length > 0 ? `${chapter.topics.length} トピック` : ''}
                            </span>
                            {chapter.miniTest.length > 0 ? (
                              <span className="text-xs font-bold text-[#D9A0A0] bg-white/50 px-2 py-1 rounded shadow-sm">
                                小テスト: {chapter.miniTest.length}問
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 bg-gray-100/50 px-2 py-1 rounded">
                                準備中
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Dashed separator between chapters (except last) */}
                    {groupIndex < array.length - 1 && (
                      <div className="absolute -bottom-8 left-4 right-4 border-b-2 border-dashed border-gray-300/40"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

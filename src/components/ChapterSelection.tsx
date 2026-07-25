import React, { useEffect, useState } from 'react';
import { chemistryData } from '../data/chemistryData';
import { ChevronRight, ArrowLeft, ChevronDown, GitBranch, TrendingUp, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChapterFlowchartModal } from './ChapterFlowchartModal';
import { TrendModal } from './TrendModal';
import { chapterTrends } from '../data/trendData';
import { DoorMascot } from './DoorMascot';

interface ChapterSelectionProps {
  mode: 'mini_test' | 'practice';
  onSelectChapter: (id: string, questionIndex?: number, resume?: boolean) => void;
  onBack: () => void;
}

// chapterのIDから、対応するtrendDataの情報を取得するマッピング
const chapterIdToTrendUnit: Record<string, { chapterGroupTitle: string; unitId: string }> = {
  'c1_1':   { chapterGroupTitle: '1章 物質の構成', unitId: 'c1_1' },
  'c1_2_A': { chapterGroupTitle: '1章 物質の構成', unitId: 'c1_2_A' },
  'c1_2_B': { chapterGroupTitle: '1章 物質の構成', unitId: 'c1_2_B' },
  'c1_3':   { chapterGroupTitle: '1章 物質の構成', unitId: 'c1_3' },
  'c2_1':   { chapterGroupTitle: '2章 物質の構成粒子', unitId: 'c2_3' },
  'c2_2':   { chapterGroupTitle: '2章 物質の構成粒子', unitId: 'c2_3' },
  'c2_3':   { chapterGroupTitle: '2章 物質の構成粒子', unitId: 'c2_3' },
  'c2_4':   { chapterGroupTitle: '2章 物質の構成粒子', unitId: 'c2_4' },
  'c3_1':   { chapterGroupTitle: '3章 化学結合', unitId: 'c3_5' },
  'c3_2':   { chapterGroupTitle: '3章 化学結合', unitId: 'c3_6' },
  'c3_3':   { chapterGroupTitle: '3章 化学結合', unitId: 'c3_7' },
  'c4_1':   { chapterGroupTitle: '4章 物質量と化学反応式', unitId: 'c4_8' },
  'c4_2':   { chapterGroupTitle: '4章 物質量と化学反応式', unitId: 'c4_9' },
  'c4_3':   { chapterGroupTitle: '4章 物質量と化学反応式', unitId: 'c4_10' },
  'c4_4':   { chapterGroupTitle: '4章 物質量と化学反応式', unitId: 'c4_11' },
  'c5_1':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_12' },
  'c5_2':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_13' },
  'c5_3':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_14' },
  'c5_4':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_15' },
  'c5_5':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_16' },
  'c5_6':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_17' },
  'c5_7':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_18' },
  'c6_1':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_2':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_3':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_4':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_5':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_6':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_7':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
};

// chapterのrealTitleから、対応するtrendDataのchapterGroupTitleを取得
const realTitleToChapterGroupTitle: Record<string, string> = {
  '1章 物質の構成': '1章 物質の構成',
  '2章 物質の構成粒子': '2章 物質の構成粒子',
  '3章 化学結合': '3章 化学結合',
  '4章 物質量と化学反応式': '4章 物質量と化学反応式',
  '5章 酸と塩基': '5章 酸と塩基',
  '6章 酸化還元反応': '6章 酸化還元反応',
};

const chapterGroups = chemistryData.parts.flatMap(part => {
  const groups = new Map<string, any[]>();

  (part.chapters as any[]).forEach(chapter => {
    const groupTitle = chapter.realTitle || 'その他';
    const chapters = groups.get(groupTitle) || [];
    chapters.push(chapter);
    groups.set(groupTitle, chapters);
  });

  return Array.from(groups, ([title, chapters]) => ({
    title,
    chapters,
    partId: part.id,
    partTitle: part.title,
  }));
});

export function ChapterSelection({ mode, onSelectChapter, onBack }: ChapterSelectionProps) {
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [activeGroupTitle, setActiveGroupTitle] = useState(chapterGroups[0]?.title || '');
  const [selectedFlowchart, setSelectedFlowchart] = useState<{ id: string; title: string; questions: any[] } | null>(null);
  const activeGroup = chapterGroups.find(group => group.title === activeGroupTitle) || chapterGroups[0];
  // 出題傾向モーダルの状態
  const [trendModal, setTrendModal] = useState<{
    open: boolean;
    chapterGroupTitle?: string;
    unitId?: string;
  }>({ open: false });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] min-h-0 w-full flex-col overflow-hidden notebook-paper p-3 pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:p-5 sm:pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:p-6 md:pb-[calc(5.75rem+env(safe-area-inset-bottom))] relative font-handwriting">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-gray-500 hover:text-[#2C3E50] transition-colors font-bold font-handwriting bg-white/80 px-4 py-2 rounded-full shadow-sm z-10"
      >
        <ArrowLeft size={20} />
        <span className="font-handwriting">戻る</span>
      </button>

      <DoorMascot showSpeech={false} size="mini" className="absolute top-3 right-4 md:top-5 md:right-6 w-auto z-10" />

      <div className="shrink-0 text-center mb-3 mt-10 md:mt-0 font-handwriting">
        <h2 className="text-xl md:text-3xl font-handwriting font-bold text-[#2C3E50] mb-1.5 md:mb-2">
          {mode === 'mini_test' ? '小テスト' : '演習問題'}
        </h2>
        <p className="text-sm md:text-base text-gray-600 font-handwriting font-bold">
          学習したい単元を選択してください
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col font-handwriting">
        <div className="mb-3 shrink-0 border-b border-slate-200/80">
          <div
            role="tablist"
            aria-label="章を選択"
            className="flex gap-1.5 overflow-x-auto pb-2 px-0.5 [scrollbar-width:thin]"
          >
            {chapterGroups.map((group, index) => {
              const isActive = group.title === activeGroup?.title;
              const chapterNumber = group.title.match(/^\d+章/)?.[0] || `${index + 1}章`;
              const shortTitle = group.title.replace(/^\d+章\s*/, '');

              return (
                <button
                  key={group.title}
                  id={`chapter-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="chapter-tab-panel"
                  onClick={() => {
                    setActiveGroupTitle(group.title);
                    setExpandedChapterId(null);
                    document.getElementById('chapter-tab-panel')?.scrollTo({ top: 0 });
                  }}
                  className={`shrink-0 rounded-xl border px-3 py-2 text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#A9CCE3] bg-[#2C3E50] text-white shadow-sm'
                      : 'border-slate-200 bg-white/75 text-slate-600 hover:border-[#A9CCE3] hover:bg-white'
                  }`}
                >
                  <span className={`block text-[10px] font-bold leading-none ${isActive ? 'text-[#A9CCE3]' : 'text-[#D9A0A0]'}`}>
                    {chapterNumber}
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm font-bold whitespace-nowrap">{shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {activeGroup && (
          <section
            id="chapter-tab-panel"
            role="tabpanel"
            aria-labelledby={`chapter-tab-${chapterGroups.indexOf(activeGroup)}`}
            tabIndex={0}
            className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain rounded-2xl border border-slate-200/80 bg-white/35 p-3 pb-6 sm:p-4 sm:pb-6 [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable]"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
              <div>
                <p className="text-[10px] font-bold text-[#D9A0A0]">{activeGroup.partTitle}</p>
                <h3 className="mt-0.5 text-base sm:text-lg font-bold text-[#2C3E50]">{activeGroup.title}</h3>
              </div>
              {realTitleToChapterGroupTitle[activeGroup.title] && (
                <button
                  type="button"
                  onClick={() => setTrendModal({
                    open: true,
                    chapterGroupTitle: realTitleToChapterGroupTitle[activeGroup.title],
                  })}
                  className="flex items-center gap-1.5 rounded-lg border border-[#A9CCE3] bg-[#A9CCE3]/15 px-2.5 py-1.5 text-[11px] font-bold text-[#2C3E50] transition-colors hover:bg-[#A9CCE3]/30 cursor-pointer"
                  title={`${activeGroup.title} の共通テスト出題傾向を確認`}
                >
                  <BarChart2 size={13} className="text-[#6FA8C5]" />
                  共通テスト傾向
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeGroup.chapters.map(chapter => {
                const questions = mode === 'mini_test' ? (chapter.miniTest || []) : (chapter.practiceProblems || []);
                const hasQuestions = questions.length > 0;
                const savedIndex = Math.max(0, Math.min(
                  questions.length - 1,
                  parseInt(localStorage.getItem(`quiz_idx_${chapter.id}_${mode}`) || '0', 10) || 0
                ));
                const hasSavedProgress = hasQuestions && (
                  savedIndex > 0 ||
                  localStorage.getItem(`quiz_expl_${chapter.id}_${mode}`) === 'true' ||
                  !!localStorage.getItem(`quiz_run_${chapter.id}_${mode}`) ||
                  (() => {
                    try { return Object.keys(JSON.parse(localStorage.getItem(`quiz_answers_${chapter.id}_${mode}`) || '{}')).length > 0; }
                    catch { return false; }
                  })()
                );
                const trendInfo = chapterIdToTrendUnit[chapter.id];

                return (
                  <article
                    key={chapter.id}
                    className="flex min-h-[148px] flex-col justify-between rounded-xl border border-yellow-200/80 bg-[#FFFDF2]/90 p-3 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div>
                      <h4 className="text-sm font-bold leading-tight text-[#2C3E50]">{chapter.abstractTitle}</h4>
                      {chapter.topics && chapter.topics.length > 0 && (
                        <p className="mt-1.5 line-clamp-2 text-[11px] font-bold leading-relaxed text-slate-500">
                          {chapter.topics.join(' ・ ')}
                        </p>
                      )}

                      {trendInfo && (
                        <button
                          type="button"
                          onClick={() => setTrendModal({
                            open: true,
                            chapterGroupTitle: trendInfo.chapterGroupTitle,
                            unitId: trendInfo.unitId,
                          })}
                          className="mt-2 inline-flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600 transition-colors hover:bg-orange-100 cursor-pointer"
                          title="この単元の共通テスト出題傾向を確認"
                        >
                          <TrendingUp size={11} />
                          出題傾向
                        </button>
                      )}
                    </div>

                    <div className="mt-3 border-t border-yellow-200/70 pt-2.5">
                      <div className="flex flex-wrap items-center gap-1.5 font-bold">
                        {hasQuestions ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onSelectChapter(chapter.id, 0, false)}
                              className="flex-1 min-w-[82px] rounded-lg bg-[#2C3E50] px-2.5 py-1.5 text-center text-[11px] text-white transition-colors hover:bg-[#1B2631] cursor-pointer"
                            >
                              最初から
                            </button>
                            {hasSavedProgress && (
                              <button
                                type="button"
                                onClick={() => onSelectChapter(chapter.id, savedIndex, true)}
                                className="flex-1 min-w-[82px] rounded-lg bg-[#D9A0A0] px-2.5 py-1.5 text-center text-[11px] text-white transition-colors hover:bg-[#C98787] cursor-pointer"
                              >
                                続きから
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="rounded-lg bg-slate-100/70 px-2.5 py-1.5 text-[11px] text-slate-400">準備中</span>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedFlowchart({ id: chapter.id, title: chapter.abstractTitle, questions })}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-[10px] font-bold text-emerald-800 transition-colors hover:bg-emerald-100 cursor-pointer"
                          title="単元のフローチャートを確認"
                        >
                          <GitBranch size={12} className="text-emerald-600" />
                          <span className="hidden sm:inline">フロー</span>
                        </button>

                        {hasQuestions && questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setExpandedChapterId(expandedChapterId === chapter.id ? null : chapter.id)}
                            aria-expanded={expandedChapterId === chapter.id}
                            className={`inline-flex items-center gap-1 rounded-lg border p-1.5 text-[10px] font-bold transition-colors cursor-pointer ${
                              expandedChapterId === chapter.id
                                ? 'border-[#A9CCE3] bg-[#A9CCE3] text-white'
                                : 'border-slate-200 bg-white text-[#2C3E50] hover:bg-slate-50'
                            }`}
                          >
                            問題
                            <ChevronDown size={12} className={`transition-transform ${expandedChapterId === chapter.id ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {expandedChapterId === chapter.id && hasQuestions && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 max-h-[126px] space-y-1 overflow-y-auto rounded-lg border border-yellow-200 bg-white/80 p-1.5 shadow-inner"
                          >
                            {questions.map((question: any, questionIndex: number) => (
                              <button
                                key={question.id}
                                type="button"
                                onClick={() => onSelectChapter(chapter.id, questionIndex, false)}
                                className="flex w-full items-center justify-between rounded-md border border-transparent bg-white/70 p-1.5 text-left text-[10px] font-bold text-slate-600 transition-colors hover:border-[#A9CCE3]/40 hover:bg-[#A9CCE3]/10 cursor-pointer"
                              >
                                <span className="truncate pr-1.5">{question.category || `問 ${questionIndex + 1}`}</span>
                                <ChevronRight size={11} className="shrink-0 text-[#A9CCE3]" />
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Chapter Flowchart Viewer Modal */}
      <AnimatePresence>
        {selectedFlowchart && (
          <ChapterFlowchartModal 
            chapterId={selectedFlowchart.id}
            chapterTitle={selectedFlowchart.title}
            questions={selectedFlowchart.questions}
            onClose={() => setSelectedFlowchart(null)}
            onSelectQuestion={(qIdx) => onSelectChapter(selectedFlowchart.id, qIdx, false)}
          />
        )}
      </AnimatePresence>

      {/* 出題傾向モーダル */}
      {trendModal.open && (
        <TrendModal
          onClose={() => setTrendModal({ open: false })}
          targetChapterGroupTitle={trendModal.chapterGroupTitle}
          targetUnitId={trendModal.unitId}
        />
      )}
    </div>
  );
}

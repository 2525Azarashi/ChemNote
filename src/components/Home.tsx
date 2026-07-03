import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Flame, ChevronRight, CheckCircle, Edit3, ArrowRight, Star, AlertCircle, RotateCw } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { chemistryData } from '../data/chemistryData';

interface HomeProps {
  onStart: () => void;
  onIntro: () => void;
  onNoteList: () => void;
  onLogicalTree: () => void;
  onLeaderboard?: () => void;
  isGuest: boolean;
}

export function Home({ onStart, onIntro, onNoteList, onLogicalTree, onLeaderboard, isGuest }: HomeProps) {
  const [profile, setProfile] = useState<any>(null);
  const [importantNotes, setImportantNotes] = useState<any[]>([]);
  const [notesToReview, setNotesToReview] = useState<any[]>([]);
  
  // Real stats state
  const [streak, setStreak] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  
  // 問題数ベースの進捗
  const allChaptersList = useMemo(() => chemistryData.parts.flatMap((p: any) => p.chapters), []);
  const totalQuestions = useMemo(() => {
    return allChaptersList.reduce((sum: number, c: any) => {
      const qs = c.miniTest || [];
      return sum + qs.reduce((s: number, q: any) => s + (q.subQuestions?.length || 0), 0);
    }, 0);
  }, [allChaptersList]);
  const [solvedQuestions, setSolvedQuestions] = useState(0);

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const uid = auth.currentUser ? auth.currentUser.uid : 'guest';
        
        // Load Profile Name/Details
        const localProfile = localStorage.getItem(`profile_${uid}`);
        if (localProfile) {
          setProfile(JSON.parse(localProfile));
        } else {
          setProfile({ name: auth.currentUser ? (auth.currentUser.displayName || 'ユーザー') : 'ゲスト' });
        }
        
        // Calculate streak
        const lastActive = localStorage.getItem(`lastActive_${uid}`);
        const storedStreak = parseInt(localStorage.getItem(`streak_${uid}`) || '0', 10);
        
        const today = new Date().toDateString();
        if (lastActive === today) {
          setStreak(storedStreak);
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastActive === yesterday.toDateString()) {
            const newStreak = storedStreak + 1;
            setStreak(newStreak);
            localStorage.setItem(`streak_${uid}`, newStreak.toString());
            localStorage.setItem(`lastActive_${uid}`, today);
          } else {
            setStreak(1);
            localStorage.setItem(`streak_${uid}`, '1');
            localStorage.setItem(`lastActive_${uid}`, today);
          }
        }

        // 解いた問題数をカウント（quiz_answers_${chapterId}_mini_test から）
        let solved = 0;
        allChaptersList.forEach((c: any) => {
          try {
            const raw = localStorage.getItem(`quiz_answers_${c.id}_mini_test`);
            if (raw) {
              const answersObj = JSON.parse(raw);
              solved += Object.keys(answersObj).length;
            }
          } catch {}
        });
        setSolvedQuestions(Math.min(solved, totalQuestions));

        // completed chapters（次の章を求めるために継続利用）
        const completed = JSON.parse(localStorage.getItem(`completed_${uid}`) || '[]');
        setCompletedIds(completed);

        // Fetch important notes for home display
        try {
          const allNotes = JSON.parse(localStorage.getItem(`notes_${uid}`) || '[]');
          const important = allNotes.filter((n: any) => n.isImportant).slice(0, 3);
          const toReview = allNotes.filter((n: any) => n.reviewCount && n.reviewCount < 3).slice(0, 3);
          setImportantNotes(important);
          setNotesToReview(toReview);
        } catch (error) {
          console.error("ノート取得エラー:", error);
        }

        {/* CSS Grid for Mobile-First layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Streak */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Streak Card
                ★ 修正：次のマイルストーン（補助テキスト）を追加 */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <div className="bg-[#F9E79F] rounded-[20px] p-6 shadow-sm flex items-start justify-between border border-[#1B2631]/5 relative overflow-hidden group h-full">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">🔥</span>
                    <span className="font-bold text-sm tracking-widest text-[#1B2631] font-modern">連続学習</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-6xl font-bold font-handwriting text-[#1B2631]">{streak}</span>
                    <span className="text-sm font-modern text-[#1B2631] font-medium">{streak > 0 ? '日連続' : '日目'}</span>
                  </div>
                  {/* ★ 次のマイルストーン補助テキスト：
                       メインの数字を邪魔しないよう、控えめなグレーで小さく配置 */}
                  {nextMilestone && (
                    <div className="mt-3 pt-3 border-t border-[#1B2631]/10">
                      <p className="text-[11px] md:text-xs text-[#4B5563] font-modern tracking-wide leading-snug">
                        <span className="opacity-70">次のマイルストーン：</span>
                        <span className="font-bold text-[#1B2631]">{nextMilestone.target}日連続</span>
                        <span className="opacity-70">まであと</span>
                        <span className="font-bold text-[#1B2631]"> {nextMilestone.remaining}日</span>
                      </p>
                    </div>
                  )}
                </div>
                {/* Accents */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-colors pointer-events-none"></div>
              </div>
            </motion.div>
            
            {/* Start Button (Desktop only) */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="mt-auto hidden lg:block">
              <button 
                onClick={onStart} 
                className="w-full bg-[#1B2631] text-white py-5 px-6 rounded-[20px] font-bold flex items-center justify-between group hover:bg-[#2C3E50] transition-colors shadow-[0_8px_20px_rgba(27,38,49,0.25)] min-h-[64px]"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6" aria-hidden="true" />
                  <span className="font-modern tracking-widest text-[16px]">{solvedQuestions === 0 ? '学習を始める' : '続きから開く'}</span>
                </div>
                <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white transition-colors group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </motion.div>
          </div>

          {/* Column 2: Progress (Wider since SRS is removed) */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Learning Progress
                ★ 修正1：プログレスバーのコントラスト強化
                  - トラック：bg-[#E5E1D8]（沈んだウォームグレー）
                  - 充填：bg-[#1B2631]（テキストと同じネイビーで明確）
                  - 高さ：h-2.5（10px）でしっかり視認
                  - role="progressbar" + aria-* 属性をルートで完備（HTMLの<progress>はTailwindで装飾が難しいためARIAで代替）
                ★ 修正2：状況別コピー
                  - 0%：これから始める人向けの説明＋「まず第1章から始めよう」CTA
                  - 進捗あり：「次の章：◯◯から始めよう」一行に切り替え */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="h-full">
              <div className="border border-[#D1D5DB] rounded-[20px] p-6 bg-white shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-[16px] mb-3 text-[#1B2631] font-modern">学習進捗</h2>
                  {solvedQuestions === 0 ? (
                    <>
                      <p className="text-xs md:text-sm text-[#4B5563] font-modern leading-relaxed mb-3">
                        各単元の問題を解くことで進捗が自動的に記録されます。すべての問題を解いて、化学基礎を完全攻略しましょう！
                      </p>
                      <button
                        onClick={onStart}
                        className="inline-flex items-center gap-1.5 text-[13px] md:text-sm font-bold font-modern text-[#1B2631] hover:text-[#D4A017] transition-colors mb-6 group"
                      >
                        まず第1章から始めよう
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <p className="text-xs md:text-sm text-[#4B5563] font-modern leading-relaxed mb-6">
                      {solvedQuestions < totalQuestions ? (
                        <>
                          次の章：
                          <button
                            onClick={onStart}
                            className="font-bold text-[#1B2631] hover:text-[#D4A017] transition-colors underline-offset-4 hover:underline"
                          >
                            {nextChapter ? (nextChapter.abstractTitle || nextChapter.title || nextChapter.id) : '次の章'}
                          </button>
                          {' '}から始めよう
                        </>
                      ) : (
                        <span className="font-bold text-[#1B2631]">全問制覇！おつかれさまでした。</span>
                      )}
                    </p>
                  )}
                </div>
                <div>
                  {/* ARIA progressbar（高コントラスト版） */}
                  <div
                    role="progressbar"
                    aria-label="学習進捗"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuetext={`${solvedQuestions} / ${totalQuestions} 問解答済み（${progressPercent}%）`}
                    className="w-full bg-[#E5E1D8] rounded-full h-2.5 mb-3 overflow-hidden shadow-inner flex-shrink-0"
                  >
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-[#1B2631] h-full rounded-full"
                    />
                  </div>
                  <p className="text-[13px] text-[#4B5563] font-modern text-right font-medium">{solvedQuestions} / {totalQuestions} 問解答済み ({progressPercent}%)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Start Button (Mobile only) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="mt-10 lg:hidden">
          <button 
            onClick={onStart} 
            className="w-full bg-[#1B2631] text-white py-4 px-6 rounded-full font-bold flex items-center justify-between group hover:bg-[#2C3E50] transition-colors shadow-[0_8px_20px_rgba(27,38,49,0.25)] min-h-[56px]"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" aria-hidden="true" />
              <span className="font-modern tracking-widest text-[15px]">{solvedQuestions === 0 ? '学習を始める' : '続きから開く'}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </motion.div>

        {/* Important Notes Section */}
        {(importantNotes.length > 0 || notesToReview.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }} className="mt-10 md:mt-12">
            <div className="space-y-4">
              {/* Important Notes */}
              {importantNotes.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-[20px] p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={18} className="text-yellow-600" fill="currentColor" />
                    <h3 className="font-bold text-[14px] md:text-[16px] text-yellow-800 font-modern">重要な問題（復習推奨）</h3>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {importantNotes.map((note) => (
                      <div key={note.id} className="bg-white rounded-lg p-2.5 text-xs md:text-sm text-gray-700 font-modern line-clamp-2 hover:bg-yellow-100 transition-colors cursor-pointer">
                        {note.chapterTitle && <span className="font-bold text-yellow-700">[{note.chapterTitle}] </span>}
                        {note.question?.replace(/<[^>]*>/g, '').substring(0, 50)}...
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={onNoteList}
                    className="mt-3 text-xs md:text-sm font-bold text-yellow-700 hover:text-yellow-900 transition-colors inline-flex items-center gap-1"
                  >
                    すべての重要な問題を見る
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}

              {/* Notes to Review */}
              {notesToReview.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-[20px] p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={18} className="text-orange-600" />
                    <h3 className="font-bold text-[14px] md:text-[16px] text-orange-800 font-modern">復習が必要な問題</h3>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {notesToReview.map((note) => (
                      <div key={note.id} className="bg-white rounded-lg p-2.5 text-xs md:text-sm text-gray-700 font-modern line-clamp-2 hover:bg-orange-100 transition-colors cursor-pointer flex items-start gap-2">
                        <RotateCw size={12} className="flex-shrink-0 mt-1 text-orange-600" />
                        <span>
                          {note.chapterTitle && <span className="font-bold text-orange-700">[{note.chapterTitle}] </span>}
                          {note.question?.replace(/<[^>]*>/g, '').substring(0, 50)}...
                        </span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={onNoteList}
                    className="mt-3 text-xs md:text-sm font-bold text-orange-700 hover:text-orange-900 transition-colors inline-flex items-center gap-1"
                  >
                    復習リストを確認
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Extra Links (App Info / Notes)
            ★ 修正：テキストリンク → ピル型ボタンへ
              - 角丸（rounded-full）でカプセル状
              - 薄いボーダー（border-[#D1D5DB]）で囲み、タップ可能なアフォーダンスを明示
              - 内側にアイコン+余白（gap-2, px-5 py-2.5）
              - hover時に背景がわずかに沈む（bg-[#F4F1EA]）
              - 最低タッチターゲット高さ44px（min-h-[44px]）を確保 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.6 }} className="mt-8 md:mt-12 flex flex-wrap justify-center gap-3 md:gap-4">
          <button
            onClick={onNoteList}
            aria-label="個人ノート一覧を開く"
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full border border-[#D1D5DB] bg-white text-sm font-modern font-medium text-[#1B2631] hover:bg-[#F4F1EA] hover:border-[#1B2631]/30 active:scale-[0.98] transition-all shadow-sm"
          >
            <Edit3 className="w-4 h-4" aria-hidden="true" />
            <span>ノート</span>
          </button>
          <button
            onClick={onIntro}
            aria-label="アプリ紹介を開く"
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full border border-[#D1D5DB] bg-white text-sm font-modern font-medium text-[#1B2631] hover:bg-[#F4F1EA] hover:border-[#1B2631]/30 active:scale-[0.98] transition-all shadow-sm"
          >
            <CheckCircle className="w-4 h-4" aria-hidden="true" />
            <span>アプリ紹介</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

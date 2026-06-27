import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Flame, ChevronRight, CheckCircle, Edit3, ArrowRight } from 'lucide-react';
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
        
      } catch (error) {
        console.error("プロフィール・統計情報取得エラー:", error);
      }
    };
    
    fetchProfileAndStats();
  }, [isGuest, allChaptersList, totalQuestions]);

  const todayStr = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
  const todayFormatted = todayStr.replace(/\//g, '.');

  const progressPercent = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;

  // 「次の章」を算出（学習進捗カードの状況別コピー用）
  const nextChapter = useMemo(() => {
    return allChaptersList.find((c: any) => !completedIds.includes(c.id)) as any;
  }, [completedIds, allChaptersList]);

  // 「次のマイルストーン」を算出（連続学習カード用）
  // 3日 → 7日 → 14日 → 30日 → 60日 → 100日 の順に次の節目を選ぶ
  const nextMilestone = useMemo(() => {
    const milestones = [3, 7, 14, 30, 60, 100];
    const target = milestones.find(m => m > streak);
    if (!target) return null;
    return { target, remaining: target - streak };
  }, [streak]);

  // 挨拶テキスト：「さん」とのスペースを排除（{name}さん で直結）
  const greetingName = profile?.name || 'ゲスト';

  return (
    <div className="w-full h-full min-h-[100dvh] sm:min-h-0 sm:h-[800px] w-full max-w-5xl mx-auto bg-[#FDFBF7] sm:rounded-[36px] sm:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] sm:border-[8px] sm:border-[#1B2631] flex flex-col overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-5 fabric-texture"></div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 md:px-12 pt-12 relative z-10">
        
        {/* Header
            ★ 修正：「ゲスト さん」→「ゲストさん」へスペース排除 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 font-handwriting">
          <h1 className="text-[22px] md:text-[28px] text-[#1B2631] font-bold tracking-wide">
            おかえり、{greetingName}さん
          </h1>
          <p className="text-xs md:text-sm text-[#4B5563] mt-1.5 font-modern tracking-wider">{todayFormatted}</p>
        </motion.div>

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

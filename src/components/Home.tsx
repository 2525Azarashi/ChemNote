import React, { useState, useEffect } from 'react';
import { BookOpen, Flame, ChevronRight, CheckCircle, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { chemistryData } from '../data/chemistryData';

interface HomeProps {
  onStart: () => void;
  onIntro: () => void;
  onNoteList: () => void;
  onLogicalTree: () => void;
  isGuest: boolean;
}

export function Home({ onStart, onIntro, onNoteList, onLogicalTree, isGuest }: HomeProps) {
  const [profile, setProfile] = useState<any>(null);
  
  // Real stats state
  const [streak, setStreak] = useState(0);
  const [totalChapters] = useState(() => chemistryData.parts.flatMap(p => p.chapters).length);
  const [completedChapters, setCompletedChapters] = useState(0);

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

        // Calculate completed chapters
        const completed = JSON.parse(localStorage.getItem(`completed_${uid}`) || '[]');
        setCompletedChapters(completed.length);
        
      } catch (error) {
        console.error("プロフィール・統計情報取得エラー:", error);
      }
    };
    
    fetchProfileAndStats();
  }, [isGuest]);

  const todayStr = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
  const todayFormatted = todayStr.replace(/\//g, '.');

  const progressPercent = Math.round((completedChapters / totalChapters) * 100) || 0;

  return (
    <div className="w-full h-full min-h-[100dvh] sm:min-h-0 sm:h-[800px] w-full max-w-5xl mx-auto bg-[#FDFBF7] sm:rounded-[36px] sm:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] sm:border-[8px] sm:border-[#1B2631] flex flex-col overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-5 fabric-texture"></div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 md:px-12 pt-12 relative z-10">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 font-handwriting">
          <h1 className="text-[22px] md:text-[28px] text-[#1B2631] font-bold tracking-wide">
            おかえり、{profile?.name || 'ゲスト'} さん
          </h1>
          <p className="text-xs md:text-sm text-[#4B5563] mt-1.5 font-modern tracking-wider">{todayFormatted}</p>
        </motion.div>

        {/* CSS Grid for Mobile-First layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Streak */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Streak Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <div className="bg-[#F9E79F] rounded-[20px] p-6 shadow-sm flex items-center justify-between border border-[#1B2631]/5 relative overflow-hidden group h-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <span className="font-bold text-sm tracking-widest text-[#1B2631] font-modern">連続学習</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-6xl font-bold font-handwriting text-[#1B2631]">{streak}</span>
                    <span className="text-sm font-modern text-[#1B2631] font-medium">{streak > 0 ? '日連続' : '日目'}</span>
                  </div>
                </div>
                {/* Accents */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-colors"></div>
              </div>
            </motion.div>
            
            {/* Start Button (Desktop only) */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="mt-auto hidden lg:block">
              <button 
                onClick={onStart} 
                className="w-full bg-[#1B2631] text-white py-5 px-6 rounded-[20px] font-bold flex items-center justify-between group hover:bg-[#2C3E50] transition-colors shadow-[0_8px_20px_rgba(27,38,49,0.25)] min-h-[64px]"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  <span className="font-modern tracking-widest text-[16px]">{completedChapters === 0 ? '学習を始める' : '続きから開く'}</span>
                </div>
                <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white transition-colors group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* Column 2: Progress (Wider since SRS is removed) */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Learning Progress */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="h-full">
              <div className="border border-[#D1D5DB] rounded-[20px] p-6 bg-white shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-[16px] mb-3 text-[#1B2631] font-modern">学習進捗</h2>
                  <p className="text-xs md:text-sm text-[#4B5563] font-modern leading-relaxed mb-6">
                    各単元の講義と演習問題を解くことで進捗が自動的に記録されます。すべての章の課題を突破して、化学基礎を完全攻略しましょう！
                  </p>
                </div>
                <div>
                  <div className="w-full bg-[#F4F1EA] rounded-full h-3 mb-3 overflow-hidden shadow-layout flex-shrink-0">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-[#A9CCE3] h-full rounded-full" 
                    />
                  </div>
                  <p className="text-[13px] text-[#4B5563] font-modern text-right font-medium">{completedChapters} / {totalChapters} 章修了 ({progressPercent}%)</p>
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
              <BookOpen className="w-5 h-5" />
              <span className="font-modern tracking-widest text-[15px]">{completedChapters === 0 ? '学習を始める' : '続きから開く'}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Extra Links (App Info / Notes) */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.6 }} className="mt-8 md:mt-12 flex justify-center gap-8">
          <button onClick={onNoteList} className="text-sm font-modern text-[#4B5563] hover:text-[#1B2631] flex items-center gap-2 transition-colors">
            <Edit3 className="w-4 h-4" />
            ノート
          </button>
          <button onClick={onIntro} className="text-sm font-modern text-[#4B5563] hover:text-[#1B2631] flex items-center gap-2 transition-colors">
            <CheckCircle className="w-4 h-4" />
            アプリ紹介
          </button>
        </motion.div>
      </div>
    </div>
  );
}

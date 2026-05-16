import React, { useState, useEffect } from 'react';
import { BookOpen, Flame, Clock, User, CheckCircle, ChevronRight, Home as HomeIcon, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { ProfileModal } from './ProfileModal';
import { chemistryData } from '../data/chemistryData';

interface HomeProps {
  onStart: () => void;
  onIntro: () => void;
  onNoteList: () => void;
  onLogicalTree: () => void;
  isGuest: boolean;
}

export function Home({ onStart, onIntro, onNoteList, onLogicalTree, isGuest }: HomeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'srs' | 'profile'>('home');
  
  // Real facts state
  const [streak, setStreak] = useState(0);
  const [totalChapters] = useState(() => chemistryData.parts.flatMap(p => p.chapters).length);
  const [completedChapters, setCompletedChapters] = useState(0);
  const [srsCount, setSrsCount] = useState(0);

  useEffect(() => {
    if (isGuest) {
      setStreak(0);
      setCompletedChapters(0);
      setSrsCount(0);
      return;
    }

    if (auth.currentUser) {
      const fetchProfile = async () => {
        try {
          const uid = auth.currentUser!.uid;
          const localProfile = localStorage.getItem(`profile_${uid}`);
          if (localProfile) {
            setProfile(JSON.parse(localProfile));
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
          
          // SRS count (mocked to 0 for now since not implemented)
          setSrsCount(0);
          
        } catch (error) {
          console.error("プロフィール取得エラー:", error);
        }
      };
      fetchProfile();
    }
  }, [isModalOpen, isGuest]);

  const todayStr = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
  const todayFormatted = todayStr.replace(/\//g, '.');

  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab === 'learn') {
      onStart();
      setActiveTab('home');
    } else if (tab === 'profile') {
      if (!isGuest) {
        setIsModalOpen(true);
      }
      setActiveTab('home');
    }
  };

  const progressPercent = Math.round((completedChapters / totalChapters) * 100) || 0;

  return (
    <div className="w-full h-full min-h-[100dvh] sm:min-h-0 sm:h-[800px] w-full max-w-5xl mx-auto bg-[#FDFBF7] sm:rounded-[36px] sm:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] sm:border-[8px] sm:border-[#1B2631] flex flex-col overflow-hidden relative">
      <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-5 fabric-texture"></div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 md:px-12 pt-12 relative z-10">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-[22px] md:text-[28px] font-handwriting text-[#1B2631] font-bold tracking-wide">
            おかえり、{isGuest ? 'ゲスト' : profile?.name || 'ゲスト'} さん
          </h1>
          <p className="text-xs md:text-sm text-[#4B5563] mt-1.5 font-modern tracking-wider">{todayFormatted}</p>
        </motion.div>

        {/* CSS Grid for Mobile-First layout: 1 col on mobile, 2 cols on md, 3 cols on lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Main Stats (Streak & Start Button) */}
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
            
            {/* Start Button (Visible on Desktop here, or hidden if we want it at bottom) */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="mt-auto hidden md:block">
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

          {/* Column 2: SRS & Progress */}
          <div className="flex flex-col gap-6 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2">
            {/* Today's Review (SRS) */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="h-full">
              <div className="border border-[#D1D5DB] rounded-[20px] p-6 bg-white shadow-sm h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-[16px] text-[#1B2631] font-modern">今日の復習</h2>
                  <span className={`${srsCount > 0 ? 'bg-[#D9A0A0]' : 'bg-[#D1D5DB]'} text-white text-[11px] md:text-xs font-bold px-3 py-1.5 rounded-full tracking-wider shadow-sm flex items-center gap-1.5`}>
                    <Clock className="w-3.5 h-3.5" /> SRS {srsCount > 0 ? srsCount : 'クリア'}
                  </span>
                </div>
                {srsCount > 0 ? (
                  <ul className="text-[14px] text-[#4B5563] space-y-3 font-modern flex-1">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#D1D5DB]"></div>復習アイテムがあります</li>
                  </ul>
                ) : (
                  <div className="text-[14px] text-[#4B5563] font-modern py-4 text-center text-gray-400 flex-1 flex items-center justify-center">
                    本日の復習タスクはありません🎉
                  </div>
                )}
              </div>
            </motion.div>

            {/* Learning Progress */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="h-full">
              <div className="border border-[#D1D5DB] rounded-[20px] p-6 bg-white shadow-sm h-full flex flex-col">
                <h2 className="font-bold text-[16px] mb-4 text-[#1B2631] font-modern">学習進捗</h2>
                <div className="mt-auto">
                  <div className="w-full bg-[#F4F1EA] rounded-full h-3 mb-3 overflow-hidden shadow-inner flex-shrink-0">
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="mt-10 md:hidden">
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
          <button onClick={!isGuest ? onNoteList : undefined} className={`text-sm font-modern text-[#4B5563] hover:text-[#1B2631] flex items-center gap-2 transition-colors ${isGuest ? 'opacity-40' : ''}`}>
            <Edit3 className="w-4 h-4" />
            ノート
          </button>
          <button onClick={onIntro} className="text-sm font-modern text-[#4B5563] hover:text-[#1B2631] flex items-center gap-2 transition-colors">
            <CheckCircle className="w-4 h-4" />
            アプリ紹介
          </button>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-t border-[#D1D5DB] flex justify-around items-center px-4 md:px-10 pb-6 pt-3 z-50">
         <NavItem icon={<HomeIcon className="w-5 h-5"/>} label="Home" isActive={activeTab === 'home'} onClick={() => handleTabClick('home')} />
         <NavItem icon={<BookOpen className="w-5 h-5"/>} label="Learn" isActive={activeTab === 'learn'} onClick={() => handleTabClick('learn')} />
         <NavItem icon={<Clock className="w-5 h-5"/>} label="SRS" isActive={activeTab === 'srs'} onClick={() => handleTabClick('srs')} />
         <NavItem icon={<User className="w-5 h-5"/>} label="Profile" isActive={activeTab === 'profile'} onClick={() => handleTabClick('profile')} />
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-16 gap-1 min-h-[44px] transition-colors ${isActive ? 'text-[#1B2631]' : 'text-[#4B5563]/60 hover:text-[#1B2631]/80'}`}
    >
      <div className={`relative ${isActive ? '-translate-y-1' : ''} transition-transform duration-300`}>
        {icon}
        {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D9A0A0] rounded-full" />}
      </div>
      <span className="text-[9px] font-modern font-bold tracking-wider">{label}</span>
    </button>
  );
}

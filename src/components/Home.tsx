import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Sparkles, Info, Atom, FlaskConical, Hexagon, Beaker, Edit3, Star, Brain, Pencil, CheckCircle, Coffee } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { ProfileModal } from './ProfileModal';

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

  useEffect(() => {
    if (auth.currentUser && !isGuest) {
      const fetchProfile = async () => {
        try {
          const localProfile = localStorage.getItem(`profile_${auth.currentUser!.uid}`);
          if (localProfile) {
            setProfile(JSON.parse(localProfile));
          }
        } catch (error) {
          console.error("プロフィール取得エラー:", error);
        }
      };
      fetchProfile();
    }
  }, [isModalOpen, isGuest]);

  return (
    <div className="relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] aspect-auto md:aspect-[16/9] max-w-5xl mx-auto bg-[#FDFBF7] rounded-3xl shadow-[20px_20px_60px_rgba(0,0,0,0.1),-5px_5px_15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center overflow-hidden border-4 md:border-8 border-white ring-1 ring-gray-200 py-12 md:py-0">
      
      {/* Profile Display */}
      {auth.currentUser && !isGuest && (
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-30 flex items-center gap-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-[#A9CCE3] font-handwriting cursor-pointer hover:bg-[#A9CCE3]/20 transition-colors" onClick={() => setIsModalOpen(true)}>
          <div className="w-10 h-10 rounded-full border border-[#A9CCE3] overflow-hidden rotate-3" style={{ borderRadius: '60% 40% 40% 60% / 40% 60% 40% 60%' }}>
            <img src={profile?.iconUrl || auth.currentUser.photoURL || ''} alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block pr-2">
            <p className="text-sm font-bold text-[#2C3E50]">{profile?.name || auth.currentUser.displayName}</p>
            <p className="text-sm font-bold text-[#2C3E50]">{profile?.grade} {profile?.stream === 'science' ? '理系' : profile?.stream === 'humanities' ? '文系' : ''}</p>
          </div>
        </div>
      )}

      <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Notebook Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-10 fabric-texture" 
           style={{ 
             backgroundImage: 'linear-gradient(transparent 95%, #A9CCE3 95%)', 
             backgroundSize: '100% 2rem' 
           }}>
      </div>

      {/* Decorative Illustrations */}
      <Star className="hidden md:block absolute top-10 right-20 text-[#A9CCE3] opacity-30 w-8 h-8 rotate-12" />
      <Hexagon className="hidden md:block absolute top-20 right-10 text-[#A9CCE3] opacity-20 w-12 h-12 -rotate-12" />
      <Brain className="hidden md:block absolute bottom-20 left-10 text-[#D9A0A0] opacity-30 w-10 h-10 rotate-6" />
      <Pencil className="hidden md:block absolute bottom-10 left-20 text-[#D9A0A0] opacity-30 w-8 h-8 -rotate-12" />
      <CheckCircle className="hidden md:block absolute bottom-10 right-20 text-[#F5B041] opacity-30 w-8 h-8 rotate-12" />
      <Coffee className="hidden md:block absolute bottom-20 right-10 text-[#F5B041] opacity-30 w-10 h-10 -rotate-6" />

      {/* Logo */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
        <img src="https://lh3.googleusercontent.com/d/1bdaFoRcprvig_57izYdAEzon1gD47_Wk" alt="Logo" className="h-6 sm:h-8 md:h-16 object-contain" referrerPolicy="no-referrer" />
      </div>

      {/* Main Content */}
      <div className="text-center z-20 px-4 sm:px-6 md:px-8 relative w-full mt-12 md:mt-0">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title Unit */}
          <div className="flex flex-col items-center gap-2 mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-handwriting text-[#2C3E50] font-bold tracking-wider leading-tight relative">
              マナトビ<br className="md:hidden" />
              <span className="hidden md:inline"> </span>化学基礎
              <svg className="absolute -bottom-2 left-0 w-full h-4 text-[#A9CCE3]" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M0 8 Q 25 3, 50 8 T 100 8" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </h1>
          </div>
          
          <p className="text-sm sm:text-base md:text-3xl font-handwriting text-[#2C3E50] font-bold mb-8 md:mb-12 leading-relaxed drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
            <span className="relative inline-block">
              『わかったつもり』はもう終わり。
              <span className="absolute -bottom-0.5 md:-bottom-1 left-0 w-full h-1 md:h-1.5 bg-[#F9E79F]/60 md:bg-[#F9E79F]/80 -rotate-1 rounded-full"></span>
            </span>
            <br/>
            <span className="relative inline-block mt-2 md:mt-0">
              学びは停止点から。
              <span className="absolute -bottom-0.5 md:-bottom-1 left-0 w-full h-1 md:h-1.5 bg-[#F9E79F]/60 md:bg-[#F9E79F]/80 rotate-1 rounded-full"></span>
            </span>
          </p>

          <div className="flex flex-col items-center justify-center gap-3 md:gap-4 w-full max-w-[280px] sm:max-w-[320px] mx-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="group relative inline-flex items-center justify-center gap-3 bg-[#2C3E50] text-white py-3 md:py-4 px-6 md:px-10 rounded-full shadow-[0_10px_20px_rgba(44,62,80,0.3)] hover:shadow-[0_15px_30px_rgba(44,62,80,0.4)] transition-all duration-300 font-modern font-bold text-base md:text-lg tracking-widest w-full fabric-texture"
            >
              <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
              <span>学習を開始する</span>
            </motion.button>

            <motion.button 
              whileHover={!isGuest ? { scale: 1.05 } : {}}
              whileTap={!isGuest ? { scale: 0.95 } : {}}
              onClick={!isGuest ? onNoteList : undefined}
              className={`inline-flex items-center justify-center gap-2 bg-transparent text-[#2C3E50] border-2 border-[#2C3E50] py-2.5 md:py-2 px-6 rounded-full font-modern font-bold text-sm tracking-widest hand-drawn-border w-full ${isGuest ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Edit3 className="w-4 h-4" />
              <span>個人ノート{isGuest ? ' (ゲスト利用不可)' : ''}</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onIntro}
              className="inline-flex items-center justify-center gap-2 bg-transparent text-[#2C3E50] border-2 border-transparent hover:border-[#2C3E50]/30 py-2 px-6 rounded-full font-modern font-bold text-xs md:text-sm tracking-widest transition-colors w-full"
            >
              <Info className="w-4 h-4" />
              <span>アプリ紹介</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Notebook rings simulation (Left side) */}
      <div className="absolute left-2 md:left-4 top-0 bottom-0 w-6 sm:w-8 md:w-10 flex flex-col justify-evenly py-8 pointer-events-none opacity-40">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 border-[#BDC3C7] bg-gradient-to-br from-[#ECF0F1] to-[#BDC3C7] shadow-sm relative z-30">
            <div className="absolute top-1/2 left-full w-2 sm:w-2.5 md:w-3 h-1 bg-[#BDC3C7] -translate-y-1/2 -z-10"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

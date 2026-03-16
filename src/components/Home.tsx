import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Sparkles, Info, Atom, FlaskConical, Hexagon, Beaker, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { ProfileModal } from './ProfileModal';

interface HomeProps {
  onStart: () => void;
  onIntro: () => void;
  onNoteList: () => void;
  onLogicalTree: () => void;
}

export function Home({ onStart, onIntro, onNoteList, onLogicalTree }: HomeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (auth.currentUser) {
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
  }, [isModalOpen]);

  return (
    <div className="relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] aspect-auto md:aspect-[16/9] max-w-5xl mx-auto bg-[#FDFBF7] rounded-3xl shadow-[20px_20px_60px_rgba(0,0,0,0.1),-5px_5px_15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center overflow-hidden border-4 md:border-8 border-white ring-1 ring-gray-200 py-12 md:py-0">
      
      {/* Profile Display */}
      {auth.currentUser && (
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-30 flex items-center gap-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-[#A9CCE3] font-handwriting cursor-pointer hover:bg-[#A9CCE3]/20 transition-colors" onClick={() => setIsModalOpen(true)}>
          <img src={profile?.iconUrl || auth.currentUser.photoURL || ''} alt="User" className="w-10 h-10 rounded-full border border-[#A9CCE3]" />
          <div className="hidden md:block pr-2">
            <p className="text-sm font-bold text-[#2C3E50]">{profile?.name || auth.currentUser.displayName}</p>
            <p className="text-xs text-[#7F8C8D]">{profile?.grade} {profile?.stream === 'science' ? '理系' : profile?.stream === 'humanities' ? '文系' : ''}</p>
          </div>
        </div>
      )}

      <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="absolute inset-0 pointer-events-none opacity-30" 
           style={{ 
             backgroundImage: 'linear-gradient(transparent 95%, #A9CCE3 95%)', 
             backgroundSize: '100% 2rem' 
           }}>
      </div>

      {/* Logo */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
        <img src="https://lh3.googleusercontent.com/d/1bdaFoRcprvig_57izYdAEzon1gD47_Wk" alt="Logo" className="h-8 sm:h-10 md:h-14 object-contain" referrerPolicy="no-referrer" />
      </div>

      {/* Decorative Elements (Stickers/Doodles) - Replaced with Chemistry themes */}
      <motion.div 
        initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
        animate={{ rotate: -12, scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 left-6 md:top-20 md:left-24 bg-[#F9E79F] text-[#D35400] p-2 sm:p-3 md:p-4 shadow-lg transform -rotate-12 z-10 font-handwriting text-xs sm:text-sm md:text-lg font-bold border-2 border-[#F5B041]"
        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)' }}
      >
        <span className="flex items-center gap-1 sm:gap-2"><Atom size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" /> 化学基礎</span>
      </motion.div>

      <motion.div 
        initial={{ rotate: 10, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 6, scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute bottom-10 right-6 md:bottom-32 md:right-24 bg-[#A9CCE3] text-white p-3 sm:p-4 md:p-6 rounded-full shadow-lg transform rotate-6 z-10 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-white border-dashed"
      >
        <FlaskConical size={32} className="sm:w-10 sm:h-10 md:w-12 md:h-12 transform -rotate-6" />
      </motion.div>

      <div className="absolute top-1/4 right-1/4 text-[#A9CCE3] opacity-40 transform rotate-12 hidden md:block">
        <Hexagon size={120} strokeWidth={1.5} />
      </div>
      
      <div className="absolute bottom-1/4 left-1/4 text-[#D9A0A0] opacity-30 transform -rotate-12 hidden md:block">
        <Beaker size={100} strokeWidth={1.5} />
      </div>

      {/* Main Content */}
      <div className="text-center z-20 px-4 sm:px-6 md:px-8 relative w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block relative mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-handwriting text-[#2C3E50] font-bold tracking-wider relative z-10 drop-shadow-sm leading-tight">
              化学基礎ノート
            </h1>
            <div className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-2 sm:h-3 md:h-4 bg-[#A9CCE3]/40 -skew-x-12 -z-0 rounded-full blur-[1px]"></div>
            <Sparkles className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 md:-top-6 md:-right-8 text-[#F5B041] w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </div>
          
          <p className="text-base sm:text-lg md:text-2xl font-handwriting text-[#7F8C8D] mb-8 md:mb-12 leading-relaxed">
            『わかったつもり』はもう終わり。<br/>
            学びは停止点から。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="group relative inline-flex items-center justify-center gap-2 md:gap-3 bg-[#2C3E50] text-white py-3 px-6 sm:px-8 md:py-4 md:px-10 rounded-2xl shadow-[0_10px_20px_rgba(44,62,80,0.3)] hover:shadow-[0_15px_30px_rgba(44,62,80,0.4)] transition-all duration-300 font-modern font-bold text-sm sm:text-base md:text-lg tracking-widest overflow-hidden w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>学習を開始する</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onIntro}
              className="group relative inline-flex items-center justify-center gap-2 md:gap-3 bg-white text-[#2C3E50] border-2 border-[#2C3E50] py-3 px-6 sm:px-8 md:py-4 md:px-10 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300 font-modern font-bold text-sm sm:text-base md:text-lg tracking-widest overflow-hidden w-full sm:w-auto"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
              <span>アプリ紹介</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNoteList}
              className="group relative inline-flex items-center justify-center gap-2 md:gap-3 bg-[#A9CCE3] text-[#2C3E50] border-2 border-[#A9CCE3] py-3 px-6 sm:px-8 md:py-4 md:px-10 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300 font-modern font-bold text-sm sm:text-base md:text-lg tracking-widest overflow-hidden w-full sm:w-auto"
            >
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>個人ノート</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Notebook rings simulation (Left side) */}
      <div className="absolute left-2 md:left-4 top-0 bottom-0 w-6 sm:w-8 md:w-12 flex flex-col justify-evenly py-8 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full border-2 sm:border-4 border-[#BDC3C7] bg-gradient-to-br from-[#ECF0F1] to-[#BDC3C7] shadow-md relative z-30">
            <div className="absolute top-1/2 left-full w-2 sm:w-3 md:w-4 h-1 sm:h-1.5 md:h-2 bg-[#BDC3C7] -translate-y-1/2 -z-10"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

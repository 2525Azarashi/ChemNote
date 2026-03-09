import React from 'react';
import { BookOpen, ChevronRight, Star, Sparkles, PenTool } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onStart: () => void;
}

export function Home({ onStart }: HomeProps) {
  return (
    <div className="relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] aspect-auto md:aspect-[16/9] max-w-5xl mx-auto bg-[#FDFBF7] rounded-3xl shadow-[20px_20px_60px_rgba(0,0,0,0.1),-5px_5px_15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center overflow-hidden border-4 md:border-8 border-white ring-1 ring-gray-200 py-12 md:py-0">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#A9CCE3 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* Logo */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
        <img src="https://lh3.googleusercontent.com/d/19wEK9eiqUz5N5k77-0TG23SYkoMCiMVi" alt="Logo" className="h-8 sm:h-10 md:h-14 object-contain" referrerPolicy="no-referrer" />
      </div>

      {/* Decorative Elements (Stickers/Doodles) */}
      <motion.div 
        initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
        animate={{ rotate: -12, scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-6 left-6 md:top-20 md:left-24 bg-[#F9E79F] text-[#D35400] p-2 sm:p-3 md:p-4 shadow-lg transform -rotate-12 z-10 font-handwriting text-xs sm:text-sm md:text-lg font-bold border-2 border-[#F5B041]"
        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)' }}
      >
        <span className="flex items-center gap-1 sm:gap-2"><Star size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="#D35400" /> 重要！</span>
      </motion.div>

      <motion.div 
        initial={{ rotate: 10, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 6, scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute bottom-10 right-6 md:bottom-32 md:right-24 bg-[#D9A0A0] text-white p-3 sm:p-4 md:p-6 rounded-full shadow-lg transform rotate-6 z-10 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-white border-dashed"
      >
        <span className="font-handwriting font-bold text-sm sm:text-lg md:text-xl transform -rotate-6">合格<br/>祈願</span>
      </motion.div>

      <div className="absolute top-1/4 right-1/4 text-[#A9CCE3] opacity-40 transform rotate-45 hidden md:block">
        <PenTool size={120} />
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
            <span className="text-[#D9A0A0] font-bold relative inline-block mt-2">
              学びは停止点から。
              <svg className="absolute w-full h-1.5 sm:h-2 -bottom-1 left-0 text-[#D9A0A0]" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </p>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group relative inline-flex items-center gap-2 md:gap-3 bg-[#2C3E50] text-white py-3 px-6 sm:px-8 md:py-4 md:px-10 rounded-2xl shadow-[0_10px_20px_rgba(44,62,80,0.3)] hover:shadow-[0_15px_30px_rgba(44,62,80,0.4)] transition-all duration-300 font-modern font-bold text-sm sm:text-base md:text-lg tracking-widest overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span>学習を開始する</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
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

import React from 'react';
import { BookOpen, ChevronRight, Star, Sparkles, PenTool } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onStart: () => void;
}

export function Home({ onStart }: HomeProps) {
  return (
    <div className="relative w-full min-h-[600px] aspect-[4/3] md:aspect-[16/9] max-w-5xl mx-auto bg-[#FDFBF7] rounded-3xl shadow-[20px_20px_60px_rgba(0,0,0,0.1),-5px_5px_15px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center overflow-hidden border-8 border-white ring-1 ring-gray-200">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#A9CCE3 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* Decorative Elements (Stickers/Doodles) */}
      <motion.div 
        initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
        animate={{ rotate: -12, scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute top-12 left-12 md:top-20 md:left-24 bg-[#F9E79F] text-[#D35400] p-4 shadow-lg transform -rotate-12 z-10 font-handwriting text-lg font-bold border-2 border-[#F5B041]"
        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)' }}
      >
        <span className="flex items-center gap-2"><Star size={16} fill="#D35400" /> 重要！</span>
      </motion.div>

      <motion.div 
        initial={{ rotate: 10, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 6, scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute bottom-20 right-12 md:bottom-32 md:right-24 bg-[#D9A0A0] text-white p-6 rounded-full shadow-lg transform rotate-6 z-10 flex items-center justify-center w-24 h-24 border-4 border-white border-dashed"
      >
        <span className="font-handwriting font-bold text-xl transform -rotate-6">合格<br/>祈願</span>
      </motion.div>

      <div className="absolute top-1/4 right-1/4 text-[#A9CCE3] opacity-40 transform rotate-45">
        <PenTool size={120} />
      </div>

      {/* Main Content */}
      <div className="text-center z-20 px-8 relative">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block relative mb-8">
            <h1 className="text-5xl md:text-7xl font-handwriting text-[#2C3E50] font-bold tracking-wider relative z-10 drop-shadow-sm">
              化学基礎ノート
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-4 bg-[#A9CCE3]/40 -skew-x-12 -z-0 rounded-full blur-[1px]"></div>
            <Sparkles className="absolute -top-6 -right-8 text-[#F5B041]" size={32} />
          </div>
          
          <p className="text-xl md:text-2xl font-handwriting text-[#7F8C8D] mb-12 leading-relaxed">
            『わかったつもり』はもう終わり。<br/>
            <span className="text-[#D9A0A0] font-bold relative inline-block mt-2">
              学びは停止点から。
              <svg className="absolute w-full h-2 -bottom-1 left-0 text-[#D9A0A0]" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </p>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 bg-[#2C3E50] text-white py-4 px-10 rounded-2xl shadow-[0_10px_20px_rgba(44,62,80,0.3)] hover:shadow-[0_15px_30px_rgba(44,62,80,0.4)] transition-all duration-300 font-modern font-bold text-lg tracking-widest overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <BookOpen size={24} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>学習を開始する</span>
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>

      {/* Notebook rings simulation (Left side) */}
      <div className="absolute left-4 top-0 bottom-0 w-12 flex flex-col justify-evenly py-8 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-full border-4 border-[#BDC3C7] bg-gradient-to-br from-[#ECF0F1] to-[#BDC3C7] shadow-md relative z-30">
            <div className="absolute top-1/2 left-full w-4 h-2 bg-[#BDC3C7] -translate-y-1/2 -z-10"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

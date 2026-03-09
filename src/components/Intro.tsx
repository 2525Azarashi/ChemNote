import React from 'react';
import { ArrowLeft, ExternalLink, Instagram, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface IntroProps {
  onBack: () => void;
}

export function Intro({ onBack }: IntroProps) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-6 md:p-10">
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl md:text-3xl font-handwriting font-bold text-[#2C3E50]">
          アプリ紹介
        </h2>
      </div>

      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#FDFBF7] p-6 rounded-2xl border border-gray-100 shadow-sm"
        >
          <h3 className="text-lg md:text-xl font-bold text-[#2C3E50] mb-4 border-b-2 border-[#A9CCE3] pb-2 inline-block">
            化学基礎ノートについて
          </h3>
          <p className="text-gray-700 leading-relaxed font-modern">
            このアプリケーションは、化学基礎の学習をサポートするために作成されました。
            「わかったつもり」を防ぐため、記述問題の自己採点機能や、弱点分析機能などを搭載しています。
            日々の学習やテスト対策にぜひご活用ください。
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <a 
            href="https://www.instagram.com/mana_tob1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center p-5 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-500 mr-4 group-hover:scale-110 transition-transform">
              <Instagram size={24} />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 font-bold mb-1">Instagram</div>
              <div className="text-[#2C3E50] font-bold flex items-center gap-2">
                @mana_tob1
                <ExternalLink size={14} className="text-gray-400" />
              </div>
            </div>
          </a>

          <a 
            href="https://mana-tob.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500 mr-4 group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 font-bold mb-1">公式Webサイト</div>
              <div className="text-[#2C3E50] font-bold flex items-center gap-2">
                mana-tob.vercel.app
                <ExternalLink size={14} className="text-gray-400" />
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </div>
  );
}

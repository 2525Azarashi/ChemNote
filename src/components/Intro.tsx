import React from 'react';
import { ArrowLeft, ExternalLink, Instagram, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface IntroProps {
  onBack: () => void;
}

export function Intro({ onBack }: IntroProps) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 relative font-handwriting">
      {/* Notebook Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(transparent 95%, #A9CCE3 95%)', 
             backgroundSize: '100% 2.5rem' 
           }}>
      </div>
      <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-6 md:p-10 relative z-10">
        <div className="flex items-center mb-8">
          {/* サークル型戻るボタン（aria-label追加で全画面と統一） */}
          <button 
            onClick={onBack}
            aria-label="ホームに戻る"
            title="ホームに戻る"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors mr-4 shadow-sm border border-gray-200"
          >
            <ArrowLeft size={20} aria-hidden="true" />
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
            {/* ★ 修正：見出しアンダーラインを アクセントイエロー (#F9E79F系) の 2px ボーダーに変更
                → ホーム画面のストリークバッジ・単元カード背景と視覚的に連動 */}
            <h3 className="text-lg md:text-xl font-handwriting font-bold text-[#2C3E50] mb-4 border-b-2 border-[#F1C40F] pb-2 inline-block">
              化学基礎ノートについて
            </h3>
            {/* ★ 修正：全角スペースを削除し、行間1.8、両端揃え（text-justify）で組む */}
            <p
              className="text-gray-700 font-handwriting text-lg text-justify"
              style={{ lineHeight: 1.8 }}
            >
              このアプリケーションは、化学基礎の学習をサポートするために作成されました。「わかったつもり」を防ぐため、記述問題の自己採点機能や、弱点分析機能などを搭載しています。日々の学習やテスト対策にぜひご活用ください。
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
              aria-label="公式Instagram @mana_tob1 を新しいタブで開く"
              className="flex items-center p-5 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-500 mr-4 group-hover:scale-110 transition-transform shrink-0">
                <Instagram size={24} aria-hidden="true" />
              </div>
              {/* ★ 修正：リンクテキストを「Instagramへ」のように意味のある言葉に、
                   ユーザー名は下に小さなグレーのサブテキストとして添える構成 */}
              <div className="flex-1 min-w-0">
                <div className="text-[#2C3E50] font-handwriting font-bold text-lg flex items-center gap-2">
                  Instagramへ
                  <ExternalLink size={14} className="text-gray-400" aria-hidden="true" />
                </div>
                <div className="text-xs text-gray-500 font-modern mt-1 truncate">
                  @mana_tob1
                </div>
              </div>
            </a>

            <a 
              href="https://mana-tob.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="公式Webサイトを新しいタブで開く"
              className="flex items-center p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500 mr-4 group-hover:scale-110 transition-transform shrink-0">
                <Globe size={24} aria-hidden="true" />
              </div>
              {/* ★ 修正：リンクテキストを「公式サイトへ」と意味のある言葉に変更し、
                   URLはその下に小さなグレーのサブテキストとして添える構成 */}
              <div className="flex-1 min-w-0">
                <div className="text-[#2C3E50] font-handwriting font-bold text-lg flex items-center gap-2">
                  公式サイトへ
                  <ExternalLink size={14} className="text-gray-400" aria-hidden="true" />
                </div>
                <div className="text-xs text-gray-500 font-modern mt-1 truncate">
                  mana-tob.vercel.app
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

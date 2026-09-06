import React from 'react';
import { ArrowLeft, ExternalLink, Instagram, Globe, Swords, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface IntroProps {
  onBack: () => void;
  /**
   * オンライン対戦を開く。
   *
   * ★任意（省略可）にしている理由★
   *   FEATURES.battle が false のときは App 側から渡さない。
   *   渡されなければ対戦の案内そのものを描かないので、
   *   「読ませたのに入口が無い」状態を作らない。
   */
  onBattle?: () => void;
}

export function Intro({ onBack, onBattle }: IntroProps) {
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
          {/* =================================================================
              オンライン対戦の紹介（★このページの1番目★）
              =================================================================

              ★ここを先頭にした理由★
                利用者の指示：「オンラインをメインにするUIにしていかんと
                だめよね？」「対戦画面は他のところでしているので
                そこまでのところはすべて変えて」

                このページは「アプリ紹介」なのに、
                ★対戦という語が1文字も無かった★。
                書いてあったのは「化学基礎の学習をサポートするために
                作成されました」だけで、記述問題の自己採点と弱点分析の
                説明で終わっていた。
                つまりアプリの主機能を、紹介ページが紹介していなかった。

              ★消したものは無い★
                下の「化学基礎ノートについて」も、Instagram・公式サイトの
                リンクも、文言ごとそのまま残してある。
                足しただけで、順番を「対戦 → 学習」にした。

              色は対戦モードの中と同じ青系（#2E86C1）にしてある。
              このページの他のカードはクリーム地なので、
              ここだけ青いことで「別の遊び方がある」と目で分かる。 */}
          {onBattle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[#EAF4FB] to-[#DCEBF7] p-6 rounded-2xl border border-[#BBDCF0] shadow-sm"
            >
              <h3 className="text-lg md:text-xl font-handwriting font-bold text-[#1B4F72] mb-4 border-b-2 border-[#2E86C1] pb-2 inline-block">
                オンライン対戦
              </h3>
              <p
                className="text-[#2C3E50] font-handwriting text-lg text-justify"
                style={{ lineHeight: 1.8 }}
              >
                このアプリの中心は<b className="text-[#1B4F72]">オンライン対戦</b>です。友だちと1対1で早解きを競ったり、全国の相手とレート戦をしたりできます。試合が終わると
                <b className="text-[#1B4F72]">その場で答えと解説</b>が出て、間違えた問題の単元をそのまま演習できます。「勝ちたいから覚える」が自然に続くように作りました。
              </p>
              {/* ★連携が必要なことを先に書く★
                  対戦は Firestore のルール上、Google 連携をしていないと
                  部屋に入れない。押してから弾かれるのが一番よくないので、
                  押す前に書いておく。 */}
              <p className="text-[#5D6D7E] font-handwriting text-base mt-2">
                ※ 対戦には Google アカウントでの連携が必要です（学習だけならゲストのままでも全部できます）。
              </p>
              <button
                onClick={onBattle}
                aria-label="オンライン対戦を開く"
                className="battle-sheen relative overflow-hidden mt-4 w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3D9BD9] to-[#2E86C1] px-6 py-3.5 font-handwriting font-bold text-white shadow-[0_12px_28px_-12px_rgba(46,134,193,0.75)] transition-colors hover:from-[#3691D2] hover:to-[#2678AF] min-h-[48px]"
              >
                <Swords size={20} aria-hidden="true" />
                <span className="text-lg">対戦をはじめる</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </motion.div>
          )}

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

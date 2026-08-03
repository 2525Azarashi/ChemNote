import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import {
  LEARNING_GLOBAL_CSS,
  SECTION_1_1_HTML,
  SECTION_1_2_HTML,
  SECTION_1_3_HTML,
  SECTION_2_1_HTML,
  SECTION_2_2_HTML,
  SECTION_2_3_HTML,
} from '../data/learningContent';
import { MolBasicsSection } from './MolBasicsSection';

interface LearningViewerProps {
  onBack: () => void;
  /** 初期表示するタブ（'mol-basics' で「物質量がわからない人へ」を直接開く） */
  initialTab?: string;
}

// 「物質量がわからない人へ」タブのID（色分けの判定にも使う）
export const MOL_BASICS_TAB_ID = 'mol-basics';

const SECTIONS = [
  { id: 'toc', title: '目次・使い方' },
  { id: '1-1', title: '1-1. 物質の構成' },
  { id: '1-2', title: '1-2. 物質の構成粒子' },
  { id: '1-3', title: '1-3. 化学結合' },
  { id: '2-1', title: '2-1. 物質量と化学反応式' },
  { id: MOL_BASICS_TAB_ID, title: '⭐ 物質量がわからない人へ' },
  { id: '2-2', title: '2-2. 酸と塩基' },
  { id: '2-3', title: '2-3. 酸化還元反応' },
];

// 各セクションのHTMLマップ（生成時に .learning-content スコープ済み）
const SECTION_HTML: Record<string, string> = {
  '1-1': SECTION_1_1_HTML,
  '1-2': SECTION_1_2_HTML,
  '1-3': SECTION_1_3_HTML,
  '2-1': SECTION_2_1_HTML,
  '2-2': SECTION_2_2_HTML,
  '2-3': SECTION_2_3_HTML,
};

const SECTION_PART_LABEL: Record<string, string> = {
  '1-1': '第1部 物質の構成',
  '1-2': '第1部 物質の構成',
  '1-3': '第1部 物質の構成',
  '2-1': '第2部 物質の変化',
  [MOL_BASICS_TAB_ID]: '第2部 物質の変化 / 物質量 補講',
  '2-2': '第2部 物質の変化',
  '2-3': '第2部 物質の変化',
};

export function LearningViewer({ onBack, initialTab }: LearningViewerProps) {
  const [activeTab, setActiveTab] = useState(initialTab || 'toc');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const sectionHtml = SECTION_HTML[activeTab];

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] font-modern pb-20 relative notebook-paper">
      {/* ===== グローバル学習プリント用 CSS（ビルド時に .learning-content スコープ済み）===== */}
      <style dangerouslySetInnerHTML={{ __html: LEARNING_GLOBAL_CSS }} />

      <div className="w-full px-0 py-0 relative">
        {/* Absolute Background Blur */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-[#A9CCE3]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#F9E79F]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Back and Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-0 px-4 md:px-8 py-4 md:py-5 bg-white/80 backdrop-blur-sm border-b border-gray-150 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl transition-all shadow-sm cursor-pointer"
              title="戻る"
            >
              <ArrowLeft size={18} className="stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#5b21b6]">化学基礎 まとめプリント</h1>
            </div>
          </div>

          <div className="text-right text-xs text-[#8b81a3] font-bold hidden md:block">
            大学入学共通テスト対策 / 2次試験対策 / 定期テスト対策
          </div>
        </div>

        {/* Responsive Topic Tab Scroll Container */}
        <div className="flex gap-2 overflow-x-auto py-3 mb-0 px-4 md:px-8 scrollbar-none snap-x z-20 relative bg-[#FDFBF7]/80 backdrop-blur-sm border-b border-gray-150">
          {SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-sm border snap-start cursor-pointer
                ${activeTab === sec.id
                  ? 'bg-[#5b21b6] border-[#5b21b6] text-white transform -translate-y-0.5 shadow-md'
                  : (sec.id === MOL_BASICS_TAB_ID
                      ? 'bg-[#f3ecff] border-[#c9bce6] text-[#5b21b6] hover:bg-[#e9dcff]'
                      : 'bg-white border-[#e3daf5] text-[#6b6280] hover:text-[#5b21b6] hover:bg-[#faf7ff]')}`}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* The Main Notebook-Styled Paper Page Container
            背景（罫線・ノート紙）は全幅のまま、読み取り用コンテンツは読みやすい最大幅に制限して中央寄せする。
            これにより、余白を消してもPCで画像や表が巨大化しない。 */}
        <div className="w-full notebook-paper rounded-none p-4 sm:p-8 md:p-12 relative min-h-[calc(100vh-140px)] shadow-none border-0">
          {/* Vertical Red Binder Line */}
          <div className="absolute top-0 bottom-0 left-[14px] sm:left-[36px] w-[1.5px] bg-red-200/50 pointer-events-none"></div>

          <div className="pl-5 sm:pl-10 relative z-10 text-[#1B2631] max-w-4xl mx-auto">

            {/* ====== TOC ====== */}
            {activeTab === 'toc' && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="text-center py-6 border-b-2 border-[#c9bce6] border-dotted">
                  <h2 className="text-3xl sm:text-4xl font-black text-[#5b21b6] font-modern tracking-wider mb-3">
                    化学基礎 まとめプリント
                  </h2>
                  <p className="text-[#7c3aed] font-bold text-sm tracking-wide">
                    大学入学共通テスト対策 / 大学2次試験対策 / 定期テスト対策
                  </p>
                </div>

                {/* Important style representation guide */}
                <div className="bg-white border-2 border-[#c9bce6] border-l-8 border-l-[#7c3aed] p-5 rounded-xl shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-[#7c3aed] tracking-wider uppercase">📖 重要語の表記について</h4>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-around pt-2">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-[#7c3aed] rounded-full"></span>
                      <p className="text-sm">
                        <span className="border-b-2 border-[#3f3352] pb-0.5 inline-block font-bold">太下線表記</span>
                        <span className="text-xs text-[#8b81a3] font-bold ml-2">＝最重要（必ず覚える）</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-[#c9bce6] rounded-full"></span>
                      <p className="text-sm">
                        <span className="underline decoration-wavy decoration-[#7c3aed] underline-offset-4 inline-block font-bold">波線下線表記</span>
                        <span className="text-xs text-[#8b81a3] font-bold ml-2">＝重要（押さえておく）</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8b81a3] pt-1 border-t border-[#e3daf5] italic">
                    ※ 例題および演習問題の解答・解説部分には強調ラインを適用していません。
                  </p>
                </div>

                {/* Print Content Map / 目次 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#5b21b6] flex items-center gap-2 border-b-2 border-dotted border-[#c9bce6] pb-2">
                    <BookOpen size={18} className="text-[#7c3aed]" />
                    <span>プリント目次</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="bg-white p-4 rounded-xl border-2 border-[#c9bce6] border-l-[6px] border-l-[#7c3aed]">
                      <h4 className="font-bold text-[#5b21b6] border-b border-dotted border-[#c9bce6] pb-1.5 mb-2 text-sm">第1部 物質の構成</h4>
                      <ul className="space-y-1.5 text-xs font-bold text-[#3f3352]">
                        <li className="flex items-center gap-1.5"><span className="text-[#7c3aed]">1.</span> 物質の構成 (純物質・混合物・分離法・同素体・炎色反応)</li>
                        <li className="flex items-center gap-1.5"><span className="text-[#7c3aed]">2.</span> 物質の構成粒子 (原子の構造・電子配置・周期表・放射線・イオン)</li>
                        <li className="flex items-center gap-1.5"><span className="text-[#7c3aed]">3.</span> 化学結合 (結合の種類・結晶・分子の極性・水素結合)</li>
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-xl border-2 border-[#c9bce6] border-l-[6px] border-l-[#7c3aed]">
                      <h4 className="font-bold text-[#5b21b6] border-b border-dotted border-[#c9bce6] pb-1.5 mb-2 text-sm">第2部 物質の変化</h4>
                      <ul className="space-y-1.5 text-xs font-bold text-[#3f3352]">
                        <li className="flex items-center gap-1.5"><span className="text-[#7c3aed]">1.</span> 物質量と化学反応式 (mol計算・化学反応式・イオン反応式・濃度)</li>
                        <li>
                          <button
                            type="button"
                            onClick={() => setActiveTab(MOL_BASICS_TAB_ID)}
                            className="w-full text-left flex items-start gap-1.5 rounded-lg border border-[#c9bce6] bg-[#f3ecff] px-2 py-1.5 text-[#5b21b6] hover:bg-[#e9dcff] transition-colors cursor-pointer"
                          >
                            <span>⭐</span>
                            <span>物質量がわからない人へ (プリントの単位変換の図で全部解く)</span>
                          </button>
                        </li>
                        <li className="flex items-center gap-1.5"><span className="text-[#7c3aed]">2.</span> 酸と塩基 (定義・電離度・強さ・pH・中和・塩の分類・中和滴定)</li>
                        <li className="flex items-center gap-1.5"><span className="text-[#7c3aed]">3.</span> 酸化還元反応 (定義・酸化数・半反応式・滴定・イオン化傾向・電池)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t-2 border-[#c9bce6] border-dotted text-center">
                  <p className="text-xs text-[#8b81a3] font-bold">
                    💡 上部メニューから見たいセクションを選択して勉強を進めましょう。
                  </p>
                </div>
              </div>
            )}

            {/* ====== 2-1 の冒頭に「物質量がわからない人へ」への案内を出す ====== */}
            {activeTab === '2-1' && (
              <button
                type="button"
                onClick={() => setActiveTab(MOL_BASICS_TAB_ID)}
                className="mb-5 w-full text-left rounded-xl border-2 border-[#c9bce6] border-l-8 border-l-[#7c3aed] bg-[#f7f2ff] px-4 py-3 transition-colors hover:bg-[#f0e7ff] cursor-pointer"
              >
                <span className="block text-[11px] font-extrabold tracking-widest text-[#7c3aed]">物質量 補講</span>
                <span className="mt-0.5 block text-sm font-bold text-[#5b21b6]">
                  ⭐ mol の計算がどうしても苦手な人へ →「物質量がわからない人へ」を見る
                </span>
                <span className="mt-1 block text-[11px] font-bold leading-relaxed text-[#6b6280]">
                  配布プリントの「単位変換の図」をそのまま操作して、どんな問題も同じ途中式で解けるようになります。
                </span>
              </button>
            )}

            {/* ====== ⭐ 物質量がわからない人へ（プリント完全再現 + 操作できる図） ====== */}
            {activeTab === MOL_BASICS_TAB_ID && (
              <div className="animate-fade-in-up">
                <div className="mb-4">
                  <span className="text-xs font-extrabold text-[#7c3aed] tracking-widest uppercase block">
                    {SECTION_PART_LABEL[MOL_BASICS_TAB_ID]}
                  </span>
                </div>
                <MolBasicsSection showHeader />
              </div>
            )}

            {/* ====== 各章 (1-1 〜 2-3) — 元のフル HTML を忠実に表示 ====== */}
            {sectionHtml && (
              <div className="animate-fade-in-up">
                <div className="mb-4">
                  <span className="text-xs font-extrabold text-[#7c3aed] tracking-widest uppercase block">
                    {SECTION_PART_LABEL[activeTab]}
                  </span>
                </div>
                <article
                  className="learning-content"
                  dangerouslySetInnerHTML={{ __html: sectionHtml }}
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

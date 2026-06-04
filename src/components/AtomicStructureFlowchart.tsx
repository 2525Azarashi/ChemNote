import React, { useState } from 'react';
import { Info, ChevronDown, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';

export function AtomicStructureFlowchart() {
  // Collapsible states for major sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    nucleus: true,
    proton: true,
    neutron: true,
    electron: true,
    num_mass: true,
    isotope: true,
    shells: true,
    valence: true,
    periodic_law: true,
    groups: true,
    elements: true,
    specific: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-4 md:p-6 bg-[#FCFBF9] border border-[#E5E2DC] rounded-3xl shadow-md font-sans">
      
      {/* Flowchart Main Header */}
      <div className="border-b-2 border-[#10B981]/50 pb-4 mb-6">
        <span className="text-xs md:text-sm font-bold text-[#10B981] tracking-wider block mb-1">
          第1部 物質の構成 / 2. 物質の構成粒子
        </span>
        <h4 className="text-lg md:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-[#10B981] text-white text-xs md:text-sm px-2.5 py-1 rounded-md">必須要約</span>
          重要事項① ～原子の構造と電子配置・元素の周期表～
        </h4>
      </div>

      {/* STEP 1 */}
      <div className="border-2 border-[#10B981]/30 bg-[#F4FBF7] p-4 md:p-5 rounded-2xl mb-6 shadow-sm">
        <span className="inline-block text-[11px] md:text-xs font-bold text-[#0F9575] bg-[#E6F4EA] border border-[#A3E635]/40 px-3 py-1 rounded-full mb-4">
          【Step1：原子の構造】
        </span>

        {/* 1.1 原子核 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('nucleus')}
            className="w-full bg-[#0F9575] hover:bg-[#0D8468] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>原子核 <span className="text-xs font-normal opacity-95 ml-2">（陽子と中性子からなる）</span></span>
            {openSections.nucleus ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {openSections.nucleus && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-[#0F9575]/20 space-y-3">
              {/* 原子核 Info Box */}
              <div className="flex items-start gap-2 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm">
                <Info size={16} className="text-[#0F9575] shrink-0 mt-0.5" />
                <span>
                  原子の中心にある。原子の質量はほぼ原子核の質量で決まる
                  <span className="text-[#0F9575] font-semibold">（陽子 : 中性子 : 電子 ＝ 1 : 1 : 1/1840）</span>。
                </span>
              </div>

              {/* 陽子 */}
              <div>
                <button 
                  onClick={() => toggleSection('proton')}
                  className="bg-[#0F9575] text-white text-xs md:text-sm font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[#0D8468] transition-colors"
                >
                  陽子
                  {openSections.proton ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {openSections.proton && (
                  <div className="mt-1.5 pl-3 border-l-2 border-[#0F9575]/25">
                    <div className="flex items-start gap-2 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                      <div className="w-2 h-2 rounded-full bg-[#0F9575] mt-1.5 shrink-0" />
                      <span>
                        正の電荷を持つ。
                        <span className="text-[#0F9575] font-bold underline decoration-2 decoration-[#10B981]/40">陽子の数 ＝ 原子番号</span>。
                        原子全体では陽子の数 ＝ 電子の数で電気的に中性。
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 中性子 */}
              <div>
                <button 
                  onClick={() => toggleSection('neutron')}
                  className="bg-[#0F9575] text-white text-xs md:text-sm font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[#0D8468] transition-colors"
                >
                  中性子
                  {openSections.neutron ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                {openSections.neutron && (
                  <div className="mt-1.5 pl-3 border-l-2 border-[#0F9575]/25">
                    <div className="flex items-start gap-2 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                      <div className="w-2 h-2 rounded-full bg-[#0F9575] mt-1.5 shrink-0" />
                      <span>
                        電荷を持たない。
                        <span className="text-amber-800 font-bold bg-[#FFFBEB] px-1 py-0.5 rounded">質量数 ＝ 陽子の数 ＋ 中性子の数</span>。
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 1.2 電子 */}
        <div>
          <button 
            onClick={() => toggleSection('electron')}
            className="w-full bg-[#0F9575] hover:bg-[#0D8468] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>電子 <span className="text-xs font-normal opacity-95 ml-2">（原子核のまわりに分布）</span></span>
            {openSections.electron ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {openSections.electron && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-[#0F9575]/20">
              <div className="flex items-start gap-2 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm">
                <Info size={16} className="text-[#0F9575] shrink-0 mt-0.5" />
                <span>
                  負の電荷を持つ。原子の直径は<span className="font-semibold text-[#0F9575]">約10⁻¹⁰m</span>、原子核はその<span className="font-semibold text-amber-800 bg-[#FFFBEB] px-1 rounded">約1/100000〜1/10000（1万〜10万分の1）</span>のサイズ。
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 2 */}
      <div className="border-2 border-[#10B981]/30 bg-[#F4FBF7] p-4 md:p-5 rounded-2xl mb-6 shadow-sm">
        <span className="inline-block text-[11px] md:text-xs font-bold text-[#0F9575] bg-[#E6F4EA] border border-[#A3E635]/40 px-3 py-1 rounded-full mb-4">
          【Step2：原子の表示と種類】
        </span>

        {/* 2.1 原子番号と質量数 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('num_mass')}
            className="w-full bg-[#0F9575] hover:bg-[#0D8468] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>原子番号と質量数 <span className="text-xs font-normal opacity-95 ml-2">（原子を特定する番号）</span></span>
            {openSections.num_mass ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {openSections.num_mass && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-[#0F9575]/20">
              <div className="flex flex-col gap-2 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>
                    <span className="font-bold text-red-600">・原子番号</span> ＝ 陽子の数
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0F9575]" />
                  <span>
                    <span className="font-bold text-[#0F9575]">・質量数</span> ＝ 陽子の数 ＋ 中性子の数
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2.2 同位体 */}
        <div>
          <button 
            onClick={() => toggleSection('isotope')}
            className="w-full bg-[#0F9575] hover:bg-[#0D8468] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>同位体 (アイソトープ) <span className="text-xs font-normal opacity-95 ml-2">（中性子数が異なる原子）</span></span>
            {openSections.isotope ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {openSections.isotope && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-[#0F9575]/20 space-y-3">
              <div className="flex flex-col gap-2 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <Info size={16} className="text-[#0F9575] shrink-0 mt-0.5" />
                  <span>原子番号が同じで、質量数が異なる（中性子数が異なる）原子同士のこと。化学的性質はほぼ同じ。</span>
                </div>
                <div className="mt-2 pt-2 border-t border-dashed border-slate-200">
                  <span className="font-bold text-[#0F9575]">【放射性同位体】</span> 原子核が自発的に放射線を放って壊変（崩壊）するもの。
                </div>
                <div>
                  <span className="font-bold text-[#0F9575]">【半減期】</span> 放射性同位体の量が元の半分になるまでの時間。
                </div>
                
                {/* Image 1 Q block replicated */}
                <div className="mt-2 bg-[#FFFBEB] border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-amber-500 text-white rounded-full text-xs font-bold shrink-0">Q</span>
                    <span className="text-slate-700 font-bold">例題：木材中の ¹⁴C から伐採時期を推定</span>
                  </div>
                  <div className="text-[#0F9575] font-bold text-[11px] md:text-xs">
                    （解答：11460年前）
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 3 */}
      <div className="border-2 border-[#10B981]/30 bg-[#F4FBF7] p-4 md:p-5 rounded-2xl mb-6 shadow-sm">
        <span className="inline-block text-[11px] md:text-xs font-bold text-[#0F9575] bg-[#E6F4EA] border border-[#A3E635]/40 px-3 py-1 rounded-full mb-4">
          【Step3：電子配置】
        </span>

        {/* 3.1 電子殻 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('shells')}
            className="w-full bg-[#0F9575] hover:bg-[#0D8468] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>電子殻 <span className="text-xs font-normal opacity-95 ml-2">（K殻・L殻・M殻・N殻）</span></span>
            {openSections.shells ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {openSections.shells && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-[#0F9575]/20">
              <div className="flex items-start gap-2 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <Info size={16} className="text-[#0F9575] shrink-0 mt-0.5" />
                <span>
                  電子殻は内側から K殻, L殻, M殻, N殻 と呼ばれる。 各殻の最大収容数は
                  <span className="text-[#0F9575] font-bold bg-[#FFFBEB] px-1 py-0.5 rounded">2n² 個</span> で表される。
                  <span className="text-xs text-slate-500 block mt-1">（K殻 ＝ 2個, L殻 ＝ 8個, M殻 ＝ 18個, N殻 ＝ 32個）</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3.2 最外殻電子・価電子 */}
        <div>
          <button 
            onClick={() => toggleSection('valence')}
            className="w-full bg-[#0F9575] hover:bg-[#0D8468] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>最外殻電子・価電子 <span className="text-xs font-normal opacity-95 ml-2">（結合に関与する電子）</span></span>
            {openSections.valence ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {openSections.valence && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-[#0F9575]/20 space-y-2">
              <div className="flex flex-col gap-2.5 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <div>
                  <span className="font-bold text-[#0F9575]">最外殻電子：</span> 最も外側の電子殻にある電子。
                </div>
                <div>
                  <span className="font-bold text-[#0F9575]">価電子：</span> 化学的性質を決定する。
                  <span className="bg-[#FFFBEB] px-1 rounded text-red-600 font-medium">貴ガス（18族）の場合は 0 個</span>と定義され、それ以外は「最外殻電子の数」と一致する。
                </div>
                <div className="pt-2 border-t border-dashed border-slate-200 text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg">
                  <span className="font-bold text-[#0F9575]">★ 特例：</span> 19番(K)・20番(Ca)は、M殻(最大18個)が完全に埋まる前に、N殻に電子がK殻に詰まり順番どおり (8個入ったら次へ) N殻に入っていく。
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 4 */}
      <div className="border-2 border-[#10B981]/30 bg-[#F4FBF7] p-4 md:p-5 rounded-2xl shadow-sm">
        <span className="inline-block text-[11px] md:text-xs font-bold text-[#0F9575] bg-[#E6F4EA] border border-[#A3E635]/40 px-3 py-1 rounded-full mb-4">
          【Step4：元素の周期表】
        </span>

        {/* 4.1 周期律 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('periodic_law')}
            className="w-full bg-[#0F9575] hover:bg-[#0D8468] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>周期律 <span className="text-xs font-normal opacity-95 ml-2">（性質の周期的変化）</span></span>
            {openSections.periodic_law ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {openSections.periodic_law && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-[#0F9575]/20">
              <div className="flex items-start gap-2 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm">
                <Info size={16} className="text-[#0F9575] shrink-0 mt-0.5" />
                <span>元素を原子番号順に並べると、化学的性質が周期的に変化して似た性質の元素が規則的に現れる。</span>
              </div>
            </div>
          )}
        </div>

        {/* 4.2 族と周期 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('groups')}
            className="w-full bg-[#0F9575] hover:bg-[#0D8468] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>族と周期 <span className="text-xs font-normal opacity-95 ml-2">（縦の列・横の行）</span></span>
            {openSections.groups ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {openSections.groups && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-[#0F9575]/20">
              <div className="flex flex-col gap-2 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <div>
                  <span className="font-bold text-[#0F9575]">・族：</span> 周期表の縦の列（1～18族）。同族元素は価電子数が等しく化学的性質が極めて類似。
                </div>
                <div>
                  <span className="font-bold text-[#0F9575]">・周期：</span> 周期表の横の行（第1～7周期）。同じ周期の元素は電子が入っている最外殻が共通。
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4.3 典型元素と遷移元素 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('elements')}
            className="w-full bg-[#0F9575] hover:bg-[#0D8468] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>典型元素と遷移元素 <span className="text-xs font-normal opacity-95 ml-2">（1,2,13～18族 ＆ 3～12族）</span></span>
            {openSections.elements ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {openSections.elements && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-[#0F9575]/20">
              <div className="flex flex-col gap-2.5 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <div>
                  <span className="font-bold text-[#0F9575]">・典型元素：</span> 1, 2族 および 13～18族の元素。原子番号が増加すると価電子数（1〜7、および貴ガスで0）が周期的に規則変化。
                </div>
                <div>
                  <span className="font-bold text-[#0F9575]">・遷移元素：</span> 3～12族の元素。<span className="bg-[#FFFBEB] font-semibold text-[#0F9575]">すべて金属元素</span>。原子番号が変わっても最外殻電子（価電子数）がほぼ1 or 2でほぼ変化しない。
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4.4 特定グループ */}
        <div>
          <button 
            onClick={() => toggleSection('specific')}
            className="w-full bg-[#0F9575] hover:bg-[#0D8468] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>特定グループ <span className="text-xs font-normal opacity-95 ml-2">（アルカリ金属・ハロゲン・貴ガスなど）</span></span>
            {openSections.specific ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          {openSections.specific && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-[#0F9575]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 border border-[#E6F4EA] bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm">
                <div className="p-2 border-r border-[#FFFBEB] last:border-0 border-b md:border-b-0 border-slate-100">
                  <span className="font-bold text-[#0F9575]">アルカリ金属：</span> 1族（※Hは除く非金属）
                </div>
                <div className="p-2 border-b md:border-b-0 border-slate-100">
                  <span className="font-bold text-[#0F9575]">アルカリ土類金属：</span> 2族（※Be、Mgを除くこともあるが広義の分類を含む）
                </div>
                <div className="p-2 border-r border-[#FFFBEB] last:border-0 border-b md:border-b-0 border-slate-100 md:border-t">
                  <span className="font-bold text-[#0F9575]">ハロゲン：</span> 17族（価電子数7、反応性高）
                </div>
                <div className="p-2 md:border-t border-slate-100">
                  <span className="font-bold text-[#0F9575]">貴ガス（希ガス）：</span> 18族（価電子数0、最外殻閉殻、極めて安定）
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

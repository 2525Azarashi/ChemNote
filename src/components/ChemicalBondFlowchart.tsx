import React, { useState } from 'react';
import { Info, ChevronDown, ChevronRight, HelpCircle, CheckSquare } from 'lucide-react';

export function ChemicalBondFlowchart() {
  // Collapsible states for major sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    step1: true,
    ionic: true,
    covalent: true,
    metallic: true,
    step2: true,
    electron_formula: true,
    structural_formula: true,
    coordinate: true,
    step3: true,
    linear: true,
    bent: true,
    pyramidal: true,
    tetrahedral: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-4 md:p-6 bg-[#FCFBF9] border border-[#E5E2DC] rounded-3xl shadow-md font-sans">
      
      {/* Flowchart Main Header */}
      <div className="border-b-2 border-blue-500/50 pb-4 mb-6">
        <span className="text-xs md:text-sm font-bold text-blue-600 tracking-wider block mb-1">
          第1部 物質の構成 / 3. 化学結合
        </span>
        <h4 className="text-lg md:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-blue-600 text-white text-xs md:text-sm px-2.5 py-1 rounded-md">必須要約</span>
          重要事項① ～結合の種類と分子の形状～
        </h4>
      </div>

      {/* STEP 1 */}
      <div className="border-2 border-blue-500/30 bg-blue-50/20 p-4 md:p-5 rounded-2xl mb-6 shadow-sm">
        <span className="inline-block text-[11px] md:text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-4">
          【Step1：結合の種類】
        </span>

        {/* イオン結合 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('ionic')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>イオン結合 <span className="text-xs font-normal opacity-90 ml-2">（金属 ＋ 非金属）</span></span>
            {openSections.ionic ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {openSections.ionic && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-blue-500/20 space-y-3">
              <div className="flex items-start gap-2 border border-blue-100 bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span>
                  陽イオン（金属）と陰イオン（非金属）の間の<span className="text-blue-600 font-bold underline decoration-2 decoration-blue-500/40">静電気力（クーロン力）</span>による結合。
                </span>
              </div>
              {/* Q Link Button Block */}
              <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-white rounded-full text-xs font-bold shrink-0">Q</span>
                  <span className="text-slate-700 font-bold">例題：例題4 (p.20)</span>
                </div>
                <div className="text-blue-600 font-bold text-[11px] md:text-xs">
                  イオン結合の性質
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 共有結合 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('covalent')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>共有結合 <span className="text-xs font-normal opacity-90 ml-2">（非金属 ＋ 非金属）</span></span>
            {openSections.covalent ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {openSections.covalent && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-blue-500/20 space-y-3">
              <div className="flex items-start gap-2 border border-blue-100 bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span>
                  非金属原子同士が<span className="text-blue-600 font-bold">価電子のペアを共有</span>することで、貴ガスの安定な電子配置を達成する結合。
                </span>
              </div>
              <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-white rounded-full text-xs font-bold shrink-0">Q</span>
                  <span className="text-slate-700 font-bold">例題：例題3 (p.20)</span>
                </div>
                <div className="text-blue-600 font-bold text-[11px] md:text-xs">
                  共有結合の強さ
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 金属結合 */}
        <div>
          <button 
            onClick={() => toggleSection('metallic')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>金属結合 <span className="text-xs font-normal opacity-90 ml-2">（金属 ＋ 金属）</span></span>
            {openSections.metallic ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {openSections.metallic && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-blue-500/20 space-y-3">
              <div className="flex items-start gap-2 border border-blue-100 bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span>
                  金属原子が価電子を全体で共有し、<span className="text-amber-700 font-bold bg-[#FFFBEB] px-1 rounded">自由電子</span>が結晶全体を動き回ることで結ばれる結合。
                </span>
              </div>
              <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-white rounded-full text-xs font-bold shrink-0">Q</span>
                  <span className="text-slate-700 font-bold">例題：例題2 (p.20)</span>
                </div>
                <div className="text-blue-600 font-bold text-[11px] md:text-xs">
                  金属結合と導電性
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 2 */}
      <div className="border-2 border-blue-500/30 bg-blue-50/20 p-4 md:p-5 rounded-2xl mb-6 shadow-sm">
        <span className="inline-block text-[11px] md:text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-4">
          【Step2：共有結合の表記】
        </span>

        {/* 電子式 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('electron_formula')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>電子式 <span className="text-xs font-normal opacity-90 ml-2">（価電子をドットで表記）</span></span>
            {openSections.electron_formula ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {openSections.electron_formula && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-blue-500/20 space-y-3">
              <div className="flex flex-col gap-2.5 border border-blue-100 bg-white p-3.5 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>価電子を元素記号の周りにドット（点）で配置した式。</span>
                </div>
                <ul className="list-disc list-inside pl-2 space-y-1 text-slate-600 text-xs md:text-sm">
                  <li><span className="font-bold text-slate-800">不対電子：</span> ペアになっていない電子（ここが結合の手になる）</li>
                  <li><span className="font-bold text-slate-800">共有電子対：</span> 原子間で共有されている電子ペア</li>
                  <li><span className="font-bold text-slate-800">非共有電子対（孤立電子対）：</span> すでにペアになっており、共有に関与しない電子ペア</li>
                </ul>
              </div>
              <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-white rounded-full text-xs font-bold shrink-0">Q</span>
                  <span className="text-slate-700 font-bold">例：例1～3 (Cl₂, H₂O, CH₄)</span>
                </div>
                <div className="text-blue-600 font-bold text-[11px] md:text-xs">
                  電子式の書き方
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 構造式 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('structural_formula')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>構造式 <span className="text-xs font-normal opacity-90 ml-2">（価標（線）で結合表記）</span></span>
            {openSections.structural_formula ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {openSections.structural_formula && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-blue-500/20 space-y-3">
              <div className="flex flex-col gap-2.5 border border-blue-100 bg-white p-3.5 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>共有電子対を価標と呼ばれる「線」で表した化学式。</span>
                </div>
                <ul className="list-disc list-inside pl-2 space-y-1 text-slate-600 text-xs md:text-sm">
                  <li><span className="font-bold text-slate-800">単結合：</span> 価標1本（共有電子対1対）</li>
                  <li><span className="font-bold text-slate-800">二重結合：</span> 価標2本（共有電子対2対）</li>
                  <li><span className="font-bold text-slate-800">三重結合：</span> 価標3本（共有電子対3対）</li>
                </ul>
              </div>
              <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-white rounded-full text-xs font-bold shrink-0">Q</span>
                  <span className="text-slate-700 font-bold">例：例4～6 (HCl, CO₂, N₂)</span>
                </div>
                <div className="text-blue-600 font-bold text-[11px] md:text-xs">
                  二重・三重結合の形状
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 配位結合 */}
        <div>
          <button 
            onClick={() => toggleSection('coordinate')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>配位結合 <span className="text-xs font-normal opacity-90 ml-2">（一方の原子が非共有電子対を一方的に提供）</span></span>
            {openSections.coordinate ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {openSections.coordinate && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-blue-500/20 space-y-3">
              <div className="flex flex-col gap-1 border border-blue-100 bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <div>
                  一方の原子だけが<span className="text-amber-700 font-bold bg-[#FFFBEB] px-1 py-0.5 rounded">非共有電子対</span>を提供し、もう一方（多くは H⁺）と共有する結合。
                </div>
                <div className="mt-1.5 text-blue-600 font-bold text-xs">
                  ★ 重要：結合が形成された後は、通常の共有結合と完全に区別ができない！
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  例：アンモニウムイオン（NH₄⁺）、オキソニウムイオン（H₃O⁺）
                </div>
              </div>
              <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-white rounded-full text-xs font-bold shrink-0">Q</span>
                  <span className="text-slate-700 font-bold">例題：例題1 (p.20)</span>
                </div>
                <div className="text-blue-600 font-bold text-[11px] md:text-xs">
                  配位結合の性質
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STEP 3 */}
      <div className="border-2 border-blue-500/30 bg-blue-50/20 p-4 md:p-5 rounded-2xl shadow-sm">
        <span className="inline-block text-[11px] md:text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-4">
          【Step3：分子の形】
        </span>

        {/* 直線形 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('linear')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>直線形 <span className="text-xs font-normal opacity-90 ml-2">（CO₂ など）</span></span>
            {openSections.linear ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {openSections.linear && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-blue-500/20">
              <div className="flex items-start gap-2 border border-blue-100 bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span>
                  中心原子の周りに電子対（多重結合を含む）が反対方向に反発しあって、180°に並ぶ形。<br />
                  <span className="font-semibold text-blue-600">代表例：CO₂</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 折れ線形 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('bent')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>折れ線形 <span className="text-xs font-normal opacity-90 ml-2">（H₂O, H₂S など）</span></span>
            {openSections.bent ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {openSections.bent && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-blue-500/20">
              <div className="flex items-start gap-2 border border-blue-100 bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span>
                  非共有電子対が共有電子対を強く押しやる（反発する）ことにより、結合角度が縮み、くの字（折れ線）になる形。<br />
                  <span className="font-semibold text-blue-600">代表例：H₂O, H₂S</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 三角錐形 */}
        <div className="mb-4">
          <button 
            onClick={() => toggleSection('pyramidal')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>三角錐形 <span className="text-xs font-normal opacity-90 ml-2">（NH₃ など）</span></span>
            {openSections.pyramidal ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {openSections.pyramidal && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-blue-500/20">
              <div className="flex items-start gap-2 border border-blue-100 bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span>
                  中心の窒素原子の上に非共有電子対が1つあり、これが3つの水素原子との共有結合対を押し下げることで、ピラミッド形（三角錐形）になる形。<br />
                  <span className="font-semibold text-blue-600">代表例：NH₃</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 正四面体形 */}
        <div>
          <button 
            onClick={() => toggleSection('tetrahedral')}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex justify-between items-center px-4 py-2.5 transition-all shadow-sm font-bold text-left text-sm md:text-base"
          >
            <span>正四面体形 <span className="text-xs font-normal opacity-90 ml-2">（CH₄, CCl₄ など）</span></span>
            {openSections.tetrahedral ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {openSections.tetrahedral && (
            <div className="mt-2 ml-2 md:ml-4 pl-3 md:pl-5 border-l-2 border-blue-500/20">
              <div className="flex items-start gap-2 border border-blue-100 bg-white p-3 rounded-xl text-xs md:text-sm text-slate-700 shadow-sm leading-relaxed">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span>
                  中心原子から等距離かつ等角度で、空間的に最も離れた4方向に均等に結合が伸びる、完全対称的な形。<br />
                  <span className="font-semibold text-blue-600">代表例：CH₄, CCl₄</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

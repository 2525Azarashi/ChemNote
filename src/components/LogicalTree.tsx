import React, { useState } from 'react';

// 説明文データ
const explanations: Record<string, string> = {
  "純物質": "1種類の物質でできたもの（1つの化学式で書ける）。例：酸素・窒素・鉄。性質：融点や沸点・密度などが物質ごとに一定となる。",
  "混合物": "2種類以上の物質でできたもの（1つの化学式で書けない）。例：空気・海水・石油・塩酸（塩化水素水溶液）・食塩水。性質：混じっている物質の種類やその割合により、値が変化する。",
  "単体": "1種類の元素でできたもの。",
  "化合物": "2種類以上の元素でできたもの。",
  "元素": "物質を構成する原子の種類（現在はおよそ120種類の元素が存在する）。",
  "単体_区別": "実際に存在し、直接的に触ることができる。",
  "元素_区別": "物質の構成成分で、直接的に触ることができない。"
};

const Node = ({ label, onClick, className = "" }: { label: string, onClick: () => void, className?: string }) => (
  <button 
    onClick={onClick}
    className={`text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors ${className}`}
  >
    {label}
  </button>
);

export const LogicalTree = () => {
  const [explanation, setExplanation] = useState<string | null>(null);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6">ロジカルツリー</h2>
      
      {/* Step 1 */}
      <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-400 mb-8">
        <h3 className="text-xl font-semibold text-orange-800 mb-4">Step 1（演習問題⓵－１・⓵－２・⓵－４）</h3>
        <div className="space-y-4">
          <div className="text-xl font-bold">物質（元素で構成）</div>
          <div className="ml-8 space-y-2">
            <div className="flex items-center gap-4">
              <Node label="純物質" onClick={() => setExplanation(explanations["純物質"])} />
              <div className="flex gap-2">
                <Node label="単体" onClick={() => setExplanation(explanations["単体"])} />
                <Node label="化合物" onClick={() => setExplanation(explanations["化合物"])} />
              </div>
            </div>
            <Node label="混合物" onClick={() => setExplanation(explanations["混合物"])} />
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-400">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Step 2（演習問題⓵－３）</h3>
        <div className="space-y-4">
          <div className="text-xl font-bold">単体と元素の区別</div>
          <div className="ml-8 space-y-2">
            <div className="flex items-center gap-4">
              <Node label="単体" onClick={() => setExplanation(explanations["単体_区別"])} />
              <span className="text-lg">：実際に存在し、直接的に触ることができる</span>
            </div>
            <div className="flex items-center gap-4">
              <Node label="元素" onClick={() => setExplanation(explanations["元素_区別"])} />
              <span className="text-lg">：物質の構成成分で、直接的に触ることができない</span>
            </div>
          </div>
        </div>
      </div>

      {/* 説明表示エリア */}
      {explanation && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-md">
          <button onClick={() => setExplanation(null)} className="absolute top-2 right-2 text-gray-400">×</button>
          <p className="text-lg">{explanation}</p>
        </div>
      )}
    </div>
  );
};

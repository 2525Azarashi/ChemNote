import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Beaker, Flame, Thermometer, Layers, Zap, ArrowRight, ChevronLeft } from 'lucide-react';

interface FlowchartProps {
  onBack: () => void;
}

export function Flowchart({ onBack }: FlowchartProps) {
  const sections = [
    {
      id: '1',
      title: '1章 物質の構成',
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <Layers className="w-6 h-6" />,
      items: [
        { id: '1-1', title: '① (単体・化合物) 純物質と混合物の識別', desc: '純物質と混合物の見分け方', icon: <Zap className="w-4 h-4" /> },
        { id: '1-2', title: '② 純物質と混合物の性質の違い', desc: '融点・沸点による純物質の判定', icon: <Thermometer className="w-4 h-4" /> },
        { id: '1-3', title: '③ 単体と元素の違い', desc: '単体（物質）と元素（成分）の区別', icon: <Beaker className="w-4 h-4" /> },
      ]
    },
    {
      id: '2a',
      title: '②-A 物質の分離と精製',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <Beaker className="w-6 h-6" />,
      items: [
        { id: '2a-1', title: '① 分離と精製の仕組み', desc: '混合物から純物質を取り出し、純度を高める', icon: <ArrowRight className="w-4 h-4" /> },
        { id: '2a-2', title: '② 分離法一覧', desc: 'ろ過・蒸留・分留・昇華法・再結晶・抽出・クロマトグラフィー', icon: <Layers className="w-4 h-4" /> },
        { id: '2a-3', title: '③ 道具の使い方', desc: 'ろ過のガラス棒、蒸留の温度計位置、冷却水の方向', icon: <Beaker className="w-4 h-4" /> },
      ]
    },
    {
      id: '2b',
      title: '②-B 物質の構成と成分元素の検出',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <Layers className="w-6 h-6" />,
      items: [
        { id: '2b-1', title: '① 同素体(SCOP)', desc: '同じ元素からなるが性質が異なる単体 (S, C, O, P)', icon: <Zap className="w-4 h-4" /> },
        { id: '2b-2', title: '② 成分元素の検出', desc: '石灰水(C), 硫酸銅(H), 硝酸銀(Cl)などによる検出', icon: <ArrowRight className="w-4 h-4" /> },
        { id: '2b-3', title: '③ 炎色反応', desc: '特定の金属元素による特有の発色 (リアカー無き...)', icon: <Flame className="w-4 h-4" /> },
      ]
    },
    {
      id: '3',
      title: '③ 粒子の熱運動と物質の三態',
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      icon: <Thermometer className="w-6 h-6" />,
      items: [
        { id: '3-1', title: '① セルシウス温度・絶対温度', desc: 'T [K] = t [℃] + 273 / 絶対零度(-273℃)', icon: <Thermometer className="w-4 h-4" /> },
        { id: '3-2', title: '② 状態変化と性質', desc: '融解・蒸発・凝縮・凝固・昇華・凝華', icon: <ArrowRight className="w-4 h-4" /> },
        { id: '3-3', title: '③ 熱運動と融点・沸点', desc: '温度一定の理由：熱が状態変化に使われるため', icon: <Zap className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[85vh] font-handwriting"
    >
      {/* Header */}
      <div className="bg-[#2C3E50] p-4 md:p-6 flex items-center justify-between text-white shrink-0">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-bold">戻る</span>
        </button>
        <h2 className="text-lg md:text-2xl font-handwriting font-bold tracking-wider">学習の全体像</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FDFBF7]">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-12 top-8 bottom-8 w-1 bg-gray-200 rounded-full hidden sm:block"></div>

          <div className="space-y-12">
            {sections.map((section, sIdx) => (
              <div key={section.id} className="relative">
                {/* Section Header */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-4 mb-6 relative z-10`}
                >
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${section.color} border-2 flex items-center justify-center shadow-sm`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg md:text-xl font-bold ${section.color.split(' ')[2]}`}>
                      {section.title}
                    </h3>
                  </div>
                </motion.div>

                {/* Items */}
                <div className="ml-6 md:ml-20 space-y-4">
                  {section.items.map((item, iIdx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: iIdx * 0.1 }}
                      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400 group-hover:text-[#2C3E50] transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Connector Arrow */}
                {sIdx < sections.length - 1 && (
                  <div className="flex justify-center my-6 sm:justify-start sm:ml-10 md:ml-16">
                    <ArrowDown className="text-gray-300 w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 shrink-0">
        各項目をタップして詳細な学習に進みましょう
      </div>
    </motion.div>
  );
}

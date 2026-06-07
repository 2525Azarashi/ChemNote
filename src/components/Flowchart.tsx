import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Beaker, Flame, Thermometer, Layers, Zap, ArrowRight, ChevronLeft } from 'lucide-react';
import { InteractiveTree, NodeData } from './InteractiveTree';
import { substanceTreeData } from '../data/chemistryData';

// 物質の分類ツリーデータ (Moved to chemistryData.ts)

interface FlowchartProps {
  onBack: () => void;
}

export function Flowchart({ onBack }: FlowchartProps) {
  const sections = [
    {
      id: '1',
      title: '第1部 1章 物質の構成',
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <Layers className="w-6 h-6" />,
      items: [
        { id: '1-1', title: '① 純物質と混合物の識別・性質', desc: '純物質と混合物の識別方法、融点・沸点・密度の一定性による性質の特定、単体と元素の区別基準。', icon: <Zap className="w-4 h-4" /> },
        { id: '1-2', title: '② 物質の分離と精製', desc: 'ろ過・蒸留・分留（原油の分留など）・昇華法・再結晶・抽出・クロマトグラフィーの原理と実験器具。', icon: <Beaker className="w-4 h-4" /> },
        { id: '1-3', title: '③ 成分元素の検出・同素体', desc: '炎色反応（リアカー無き...）、沈殿や変化（C=石灰水、H=硫酸銅、Cl=硝酸銀、S=酢酸鉛）、同素体(SCOP)。', icon: <Flame className="w-4 h-4" /> },
        { id: '1-4', title: '④ 粒子の熱運動と物質の三態', desc: '絶対温度（T [K] = t [℃] + 273）、絶対零度、熱運動（振動・並動）、状態変化と温度の一定性。', icon: <Thermometer className="w-4 h-4" /> },
      ]
    },
    {
      id: '2',
      title: '第1部 2章 物質の構成粒子',
      color: 'bg-emerald-50 border-emerald-200 text-[#0F9575]',
      icon: <Layers className="w-6 h-6" />,
      items: [
        { id: '2-1', title: '① 原子の構造・同位体', desc: '陽子（質量1・正電荷、原子番号）、中性子（質量1・中性）、電子（質量1/1840・負電荷）。同位体と放射性同位体・半減期。', icon: <Zap className="w-4 h-4" /> },
        { id: '2-2', title: '② 電子配置と電子配置のルール', desc: '電子殻（K, L, M, N...殻、最大収容電子数2n²）への電子の入り方、閉殻構造、最外殻電子と価電子。', icon: <Layers className="w-4 h-4" /> },
        { id: '2-3', title: '③ 元素の周期表と周期律', desc: 'メンデレーエフによる周期表、周期（1〜7）、族（1〜18）、同族元素、典型元素と遷移元素、金属と非金属の境界。', icon: <Beaker className="w-4 h-4" /> },
        { id: '2-4', title: '④ イオンのなりやすさとエネルギー', desc: 'イオン化エネルギー（1価の陽イオンになるとき吸収）と電子親和力（1価の陰イオンになるとき放出）、安定化への指向。', icon: <Zap className="w-4 h-4" /> },
        { id: '2-5', title: '⑤ 原子・イオンの大きさ', desc: '同族原子は下ほど大きい（殻数増）。同周期原子は右ほど小さい（核電荷増）。同じ電子配置のイオンは原子番号が大きいほど小さい（核電荷増）。', icon: <Thermometer className="w-4 h-4" /> },
      ]
    },
    {
      id: '3',
      title: '第1部 3章 化学結合',
      color: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: <Layers className="w-6 h-6" />,
      items: [
        { id: '3-1', title: '① 化学結合の種類と特徴', desc: 'イオン結合（静電気力、金属＋非金属）、共有結合（電子対共有、非金属＋非金属）、金属結合（自由電子の共有、金属＋金属）。', icon: <Zap className="w-4 h-4" /> },
        { id: '3-2', title: '② 共有結合の表記と配位結合', desc: '電子式（不対・共有・非共有電子対）、構造式（単・二・三重結合）、価標と原子価。配位結合（一方から電子対提供、NH₄⁺、H₃O⁺）。', icon: <Layers className="w-4 h-4" /> },
        { id: '3-3', title: '③ 分子の形と結合角', desc: '電子対反発による分子形状：直線形（CO₂）、折れ線形（H₂O）、三角錐形（NH₃）、正四面体形（CH₄/CCl₄）。', icon: <Beaker className="w-4 h-4" /> },
        { id: '3-4', title: '④ 結晶の種類と性質', desc: 'イオン結晶、分子結晶、共有結合結晶（ダイヤモンド・黒鉛）、金属結晶の融点・硬さ・電気伝導性の比較。', icon: <Layers className="w-4 h-4" /> },
        { id: '3-5', title: '⑤ 分子の極性・電気陰性度・水素結合', desc: '電気陰性度（フォンクラックス...）、極性分子・無極性分子の極性の打ち消し合い、記述ルールと沸点（HF, H₂O, NH₃の高い沸点）。', icon: <Thermometer className="w-4 h-4" /> },
      ]
    },
    {
      id: '4',
      title: '第2部 1章 物質量と化学反応式',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      icon: <Layers className="w-6 h-6" />,
      items: [
        { id: '4-1', title: '① 原子量・分子量・式量', desc: '相対質量の基準（¹²C ＝ 12）。同位体の存在比から求める平均原子量（単位なし）。分子量と式量の計算法。', icon: <Zap className="w-4 h-4" /> },
        { id: '4-2', title: '② 物質量（mol）のマスター', desc: '1 mol ＝ 6.0×10²³個（アボガドロ定数）。原子量・分子量・式量に [g/mol] を付けるとモル質量となり1 molあたりの質量。', icon: <Layers className="w-4 h-4" /> },
        { id: '4-3', title: '③ 物質量の単位変換関係図', desc: 'molを媒介にして、粒子数（÷/×6.0×10²³）、質量（÷/×M）、標準状態気体体積（÷/×22.4 L）、体積と質量の変換。', icon: <Beaker className="w-4 h-4" /> },
        { id: '4-4', title: '④ 化学反応式・イオン反応式', desc: '左辺に反応物、右辺に生成物を書き、目算法や未定係数法を用いて両辺の原子数・電荷バランスをそろえる手順。', icon: <Layers className="w-4 h-4" /> },
        { id: '4-5', title: '⑤ 溶液の濃度と調製', desc: '質量パーセント濃度（%）、モル濃度（mol/L、溶液1L中の溶質のmol）、調製器具（メスフラスコなど）、希釈計算。', icon: <Thermometer className="w-4 h-4" /> },
      ]
    },
    {
      id: '5',
      title: '第2部 2章 酸と塩基',
      color: 'bg-pink-50 border-pink-200 text-pink-800',
      icon: <Layers className="w-6 h-6" />,
      items: [
        { id: '5-1', title: '① 酸と塩基の定義', desc: 'アレニウスの定義（H⁺ / OH⁻ による定義）、ブレンステッド・ローリーの定義（H⁺のやり取りによる定義、気体反応にも適用）。', icon: <Zap className="w-4 h-4" /> },
        { id: '5-2', title: '② 酸と塩基の強さと価数', desc: '強酸・強塩基（電離度α ≒ 1）と弱酸・弱塩基（α ≪ 1）。価数（電離時に放出できるH⁺やOH⁻の最大数）。水素イオン濃度の算出。', icon: <Layers className="w-4 h-4" /> },
        { id: '5-3', title: '③ pHと水のイオン積', desc: 'pHスケール（0〜14）、25℃における水のイオン積 [H⁺][OH⁻] = 1.0×10⁻¹⁴ [mol²/L²] の維持、希釈時のpH変化。', icon: <Thermometer className="w-4 h-4" /> },
        { id: '5-4', title: '④ 中和反応と指示薬', desc: '中和反応による水と塩の生成、酸の価数×物質量＝塩基の価数×物質量。指示薬（フェノールフタレイン、メチルオレンジ、BTB）の変色域。', icon: <Beaker className="w-4 h-4" /> },
        { id: '5-5', title: '⑤ 塩の分類と塩の液性', desc: '酸性塩、塩基性塩、正塩の組成分類。もとの強酸・強塩基・弱酸・弱塩基の強弱組み合わせによる、正塩水溶液の液性（酸性・中性・塩基性）。', icon: <Layers className="w-4 h-4" /> },
        { id: '5-6', title: '⑥ 二段階滴定・弱酸遊離・揮発性酸遊離', desc: '弱酸の遊離、弱塩基の遊離、揮発性の酸の遊離特性。中和滴定の実験器具（コニカルビーカー・ビュレット等の共洗い）と二段階滴定。', icon: <Thermometer className="w-4 h-4" /> },
      ]
    },
    {
      id: '6',
      title: '第2部 3章 酸化還元反応',
      color: 'bg-teal-50 border-teal-200 text-teal-800',
      icon: <Layers className="w-6 h-6" />,
      items: [
        { id: '6-1', title: '① 酸化と還元の定義・酸化数', desc: '酸素・水素・電子の移動、電子を失う＝酸化、電子を得る＝還元。酸化数の決定ルール（単体中の原子は0、化合物中のHは+1、Oは-2等）。', icon: <Zap className="w-4 h-4" /> },
        { id: '6-2', title: '② 酸化剤・還元剤と反応式', desc: '相手を酸化（自身は還元）する酸化剤、相手を還元（自身は酸化）する還元剤。半反応式の作り方4ステップ、および電子を消去して合算した反応式。', icon: <Layers className="w-4 h-4" /> },
        { id: '6-3', title: '③ 酸化還元滴定・COD', desc: '過マンガン酸カリウム（終点は薄い赤紫色）、ヨウ素滴定（終点にデンプン指示薬）、化学的酸素要求量（COD）の測定と計算原理。', icon: <Beaker className="w-4 h-4" /> },
        { id: '6-4', title: '④ 金属のイオン化傾向と反応性', desc: 'イオン化列（リッチに貸そかな...）の順。水・酸・空気との常温・加熱・王水における相互反発、強酸での水素発生判定。', icon: <Flame className="w-4 h-4" /> },
        { id: '6-5', title: '⑤ 電池の仕組み・効率・実用電池', desc: 'ボルタ電池（水素発生による分極低下）、ダニエル電池（素焼き板、濃度効率）、燃料電池。一次電池・二次電池の実例。', icon: <Thermometer className="w-4 h-4" /> },
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
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-800">ロジックツリー</h3>
          <InteractiveTree data={substanceTreeData} />
        </div>
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

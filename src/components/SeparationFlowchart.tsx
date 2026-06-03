import React from 'react';
import { motion } from 'motion/react';
import { Info } from 'lucide-react';

interface SeparationFlowchartProps {
  onQuestionClick: (questionId: string) => void;
}

export function SeparationFlowchart({ onQuestionClick }: SeparationFlowchartProps) {
  const steps = [
    {
      groupTitle: '【Step1：固体と液体の分離】',
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50/10',
      items: [
        {
          id: 'filter',
          title: 'ろ過',
          subTitle: 'ろ紙で固体を分離',
          questionId: 'q2_1',
          questionLabel: '演習問題①-2(ろ過)',
          description: (
            <p className="text-slate-700 leading-relaxed text-sm">
              固体と液体の混合物から、<span className="font-bold text-[#E67E22] bg-amber-50 px-1 border-b border-amber-300">ろ紙</span>などを用いて固体を分離する操作。通過した液体を<span className="font-bold text-[#E67E22] bg-amber-50 px-1 border-b border-amber-300">「ろ液」</span>と呼ぶ。
            </p>
          ),
          details: (
            <div className="space-y-3 mt-3 pt-3 border-t border-dashed border-slate-200">
              <div>
                <span className="inline-block text-xs font-bold text-[#E67E22] bg-amber-50 px-2 py-0.5 rounded-full mb-1">【注意点】</span>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                  <li>ガラス棒に伝わらせて注ぐ</li>
                  <li>ろうとの足を内壁につける</li>
                  <li>ガラス棒をろ紙につける</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500 font-medium ml-1">
                <span className="text-amber-600 font-bold">例：</span>砂を含む水溶液から砂を分離する。
              </p>
            </div>
          )
        }
      ]
    },
    {
      groupTitle: '【Step2：沸点の違いを利用】',
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50/10',
      items: [
        {
          id: 'distillation',
          title: '蒸留',
          subTitle: '蒸気を冷却して分離',
          questionId: 'q2_2',
          questionLabel: '演習問題①-2(蒸留)',
          description: (
            <p className="text-slate-700 leading-relaxed text-sm">
              液体の混合物を加熱して沸騰させ、その蒸気を冷却して沸点の低い成分を分離する。
            </p>
          ),
          details: (
            <div className="space-y-3 mt-3 pt-3 border-t border-dashed border-slate-200">
              <div>
                <span className="inline-block text-xs font-bold text-[#E67E22] bg-amber-50 px-2 py-0.5 rounded-full mb-1">【注意点】</span>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                  <li>沸騰石を入れる（突沸防止）</li>
                  <li>液量は半分以下</li>
                  <li>温度計の球部は枝の付け根</li>
                  <li>冷却水は下から上へ</li>
                  <li>三角フラスコを密閉しない</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500 font-medium ml-1">
                <span className="text-amber-600 font-bold">例：</span>NaCl水溶液から水を分離。
              </p>
            </div>
          )
        },
        {
          id: 'fractional',
          title: '分留',
          subTitle: '沸点差で液体を分離',
          questionId: 'q2_3',
          questionLabel: '演習問題①-2(分留)',
          description: (
            <p className="text-slate-700 leading-relaxed text-sm">
              沸点の異なる2種類以上の液体混合物を加熱し、異なる温度で蒸留して分離する。
            </p>
          ),
          details: (
            <div className="space-y-3 mt-3 pt-3 border-t border-dashed border-slate-200">
              <p className="text-xs text-slate-500 font-medium ml-1">
                <span className="text-amber-600 font-bold">例：</span>液体空気の分離、石油（原油）の分留。
              </p>
              <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
                <p className="text-[11px] font-bold text-[#E67E22] mb-1">【原油の分留順】</p>
                <div className="text-[10px] text-slate-600 flex items-center flex-wrap gap-1 font-mono">
                  <span className="bg-white px-1 py-0.5 rounded border">沸点低 : 石油ガス</span>
                  <span>→</span>
                  <span className="bg-white px-1 py-0.5 rounded border">ナフサ</span>
                  <span>→</span>
                  <span className="bg-white px-1 py-0.5 rounded border">灯油</span>
                  <span>→</span>
                  <span className="bg-white px-1 py-0.5 rounded border">軽油</span>
                  <span>→</span>
                  <span className="bg-white px-1 py-0.5 rounded border">重油</span>
                  <span>→</span>
                  <span className="bg-white px-1 py-0.5 rounded border">残留 : 沸点高</span>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      groupTitle: '【Step3：特殊な性質を利用】',
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50/10',
      items: [
        {
          id: 'sublimation',
          title: '昇華法',
          subTitle: '固体→気体の性質を利用',
          questionId: 'q2_4',
          questionLabel: '演習問題①-2(昇華)',
          description: (
            <p className="text-slate-700 leading-relaxed text-sm">
              昇華しやすい固体を含む混合物を加熱し、生じた気体を冷却して分離する。
            </p>
          ),
          details: (
            <div className="space-y-3 mt-3 pt-3 border-t border-dashed border-slate-200">
              <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/50">
                <span className="font-bold text-xs text-[#E67E22]">【重要物質】</span>
                <span className="text-xs text-slate-600 ml-1 font-mono">ドライアイス、ヨウ素、ナフタレン</span>
              </div>
              <p className="text-xs text-slate-500 font-medium ml-1">
                <span className="text-amber-600 font-bold">例：</span>砂とヨウ素の混合物からヨウ素を分離する。
              </p>
            </div>
          )
        },
        {
          id: 'recrystallization',
          title: '再結晶',
          subTitle: '温度による溶解度差を利用',
          questionId: 'q2_5',
          questionLabel: '演習問題①-2(再結)',
          description: (
            <p className="text-slate-700 leading-relaxed text-sm">
              少量の不純物を含む固体を熱水に溶かし、冷却して目的の純粋な固体を得る操作。
            </p>
          ),
          details: (
            <div className="space-y-3 mt-3 pt-3 border-t border-dashed border-slate-200">
              <p className="text-xs text-slate-500 font-medium ml-1">
                <span className="text-amber-600 font-bold">例：</span>硝酸カリウムと少量の硫酸銅(II)五水和物の混合物から硝酸カリウムを分離する。
              </p>
            </div>
          )
        },
        {
          id: 'extraction',
          title: '抽出',
          subTitle: '特定の溶媒への溶けやすさ',
          questionId: 'q2_6',
          questionLabel: '演習問題①-2(抽出)',
          description: (
            <p className="text-slate-700 leading-relaxed text-sm">
              混合物に適切な溶媒を加えて、目的物質だけを溶かし出して分離する操作。
            </p>
          ),
          details: (
            <div className="space-y-3 mt-3 pt-3 border-t border-dashed border-slate-200">
              <p className="text-xs text-slate-500 font-medium ml-1">
                <span className="text-amber-600 font-bold">例：</span>ヨウ素とヨウ化カリウム水溶液からヨウ素を分離、茶葉から成分を溶かし出す。
              </p>
            </div>
          )
        },
        {
          id: 'chromatography',
          title: 'クロマトグラフィー',
          subTitle: '吸着力の違いを利用',
          questionId: 'q2_7',
          questionLabel: '演習問題①-2(クロマト)',
          description: (
            <p className="text-slate-700 leading-relaxed text-sm">
              物質の吸着力の違いを利用して分離する。ろ紙を用いる場合は<span className="font-bold text-[#E67E22] bg-amber-50 px-1 border-b border-amber-300">ペーパークロマトグラフィー</span>と呼ぶ。
            </p>
          ),
          details: (
            <div className="space-y-3 mt-3 pt-3 border-t border-dashed border-slate-200">
              <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/50">
                <span className="font-bold text-xs text-[#E67E22]">【種類】</span>
                <span className="text-xs text-slate-600 ml-1 font-mono">カラムクロマトグラフィー、ガスクロマトグラフィー</span>
              </div>
              <p className="text-xs text-slate-500 font-medium ml-1">
                <span className="text-amber-600 font-bold">例：</span>水性インクの色素分離。
              </p>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6 font-modern mt-2">
      {steps.map((step, idx) => (
        <div key={idx} className="relative">
          {/* Group Label */}
          <div className="text-amber-800 font-extrabold text-[13px] tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>{step.groupTitle}</span>
          </div>

          <div className={`border-l-4 ${step.borderColor} pl-4 sm:pl-6 space-y-6`}>
            {step.items.map((item) => (
              <div key={item.id} className="relative flex flex-col">
                
                {/* Accordion header style item tag & subtitle */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="bg-[#E67E22] text-white font-bold text-sm px-4 py-1.5 rounded-lg flex items-center justify-between gap-3 shadow-sm min-w-[110px]">
                    <span>{item.title}</span>
                    <span className="text-[10px] opacity-80">▲</span>
                  </div>
                  <span className="text-xs text-slate-500 font-bold">{item.subTitle}</span>
                </div>

                {/* Inner Content Card */}
                <div className="mt-2.5 bg-white border border-amber-200 rounded-[20px] p-4.5 sm:p-5 shadow-[0_4px_12px_rgba(230,126,34,0.03)] hover:shadow-[0_6px_16px_rgba(230,126,34,0.06)] transition-all flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left Column (Info Icon + Details) */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-[#E67E22] shrink-0 mt-0.5 border border-amber-200">
                      <Info size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.description}
                      {item.details}
                    </div>
                  </div>

                  {/* Right Column (Question Button) */}
                  <div className="flex items-center shrink-0 self-end md:self-center">
                    <button
                      onClick={() => onQuestionClick(item.questionId)}
                      className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-300 text-amber-700 bg-amber-50/30 hover:bg-amber-100/60 transition-all font-bold text-xs"
                    >
                      <span className="w-4 h-4 bg-amber-400 text-white rounded-full flex items-center justify-center font-bold text-[10px] group-hover:scale-110 transition-transform">Q</span>
                      <span className="group-hover:text-[#E67E22] transition-colors">{item.questionLabel}</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
          
          {idx < steps.length - 1 && (
            <div className="h-6 flex items-center pl-[2px]">
              <div className="w-0.5 h-full bg-amber-200"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

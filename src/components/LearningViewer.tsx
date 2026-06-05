import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, BookOpen, Lightbulb, Check, Award, Compass, Settings } from 'lucide-react';

interface LearningViewerProps {
  onBack: () => void;
}

const SECTIONS = [
  { id: 'toc', title: '目次・使い方' },
  { id: '1-1', title: '1-1. 物質の構成' },
  { id: '1-2', title: '1-2. 物質の構成粒子' },
  { id: '1-3', title: '1-3. 化学結合' },
  { id: '2-1', title: '2-1. 物質量と化学反応式' },
  { id: '2-2', title: '2-2. 酸と塩基' },
  { id: '2-3', title: '2-3. 酸化還元反応' }
];

export function LearningViewer({ onBack }: LearningViewerProps) {
  const [activeTab, setActiveTab] = useState('toc');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const toggleSolution = (id: string) => {
    setExpandedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] font-modern pb-20 relative">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 relative">
        {/* Absolute Background Blur */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-[#A9CCE3]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#F9E79F]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Back and Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl transition-all shadow-sm cursor-pointer"
              title="戻る"
            >
              <ArrowLeft size={18} className="stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1B2631]">化学基礎 まとめプリント</h1>
            </div>
          </div>
          
          <div className="text-right text-xs text-gray-400 font-bold hidden md:block">
            大学入学共通テスト対策 / 2次試験対策 / 定期テスト対策
          </div>
        </div>

        {/* Responsive Topic Tab Scroll Container */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4 scrollbar-none snap-x z-20 relative">
          {SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-sm border snap-start cursor-pointer
                ${activeTab === sec.id 
                  ? 'bg-[#2C3E50] border-[#2C3E50] text-[#FDFBF7] transform -translate-y-0.5 shadow-md' 
                  : 'bg-white border-gray-150 text-gray-500 hover:text-[#2C3E50] hover:bg-gray-50'}`}
            >
              {sec.title}
            </button>
          ))}
        </div>

        {/* The Main Notebook-Styled Paper Page Container */}
        <div className="w-full notebook-paper rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 relative min-h-[70vh] shadow-lg border border-gray-150">
          {/* Vertical Red Binder Line */}
          <div className="absolute top-0 bottom-0 left-[14px] sm:left-[36px] w-[1.5px] bg-red-200/50 pointer-events-none"></div>

          <div className="pl-5 sm:pl-10 relative z-10 text-[#1B2631]">

            {/* TOC/Intro Sub-Page */}
            {activeTab === 'toc' && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="text-center py-6 border-b border-gray-250 border-dotted">
                  <h2 className="text-3xl sm:text-4xl font-black text-[#2C3E50] font-modern tracking-wider mb-3">
                    化学基礎 まとめプリント
                  </h2>
                  <p className="text-[#A9CCE3] font-bold text-sm tracking-wide">
                    大学入学共通テスト対策 / 大学2次試験対策 / 定期テスト対策
                  </p>
                </div>

                {/* Important style representation guide */}
                <div className="bg-white/80 border border-gray-200 p-5 rounded-2xl shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase">📖 重要語の表記について</h4>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-around pt-2">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                      <p className="text-sm">
                        <span className="border-b-2 border-slate-800 pb-0.5 inline-block font-bold">太下線表記</span>
                        <span className="text-xs text-gray-400 font-bold ml-2">＝最重要（必ず覚える）</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-[#A9CCE3] rounded-full"></span>
                      <p className="text-sm">
                        <span className="underline decoration-wavy decoration-[#A9CCE3] underline-offset-4 inline-block font-bold">波線下線表記</span>
                        <span className="text-xs text-gray-400 font-bold ml-2">＝重要（押さえておく）</span>
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 pt-1 border-t border-gray-100 italic">
                    ※ 例題および演習問題の解答・解説部分には強調ラインを適用していません。
                  </p>
                </div>

                {/* Print Content Map / 目次 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2 border-b-2 border-[#2C3E50]/15 pb-2">
                    <BookOpen size={18} className="text-[#A9CCE3]" />
                    <span>プリント目次</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="bg-white/40 p-4 rounded-xl border border-gray-150">
                      <h4 className="font-bold text-[#2C3E50] text-[#A9CCE3] border-b border-gray-200 pb-1.5 mb-2 text-sm">第1部 物質の構成</h4>
                      <ul className="space-y-1.5 text-xs font-bold text-gray-600">
                        <li className="flex items-center gap-1.5 hover:text-black hover:translate-x-0.5 transition-all"><span className="text-gray-400">1.</span> 物質の構成 (純物質・混合物・分離法・同素体・炎色反応)</li>
                        <li className="flex items-center gap-1.5 hover:text-black hover:translate-x-0.5 transition-all"><span className="text-gray-400">2.</span> 物質の構成粒子 (原子の構造・電子配置・周期表・放射線・イオン)</li>
                        <li className="flex items-center gap-1.5 hover:text-black hover:translate-x-0.5 transition-all"><span className="text-gray-400">3.</span> 化学結合 (結合の種類・結晶・分子の極性・水素結合)</li>
                      </ul>
                    </div>

                    <div className="bg-white/40 p-4 rounded-xl border border-gray-150">
                      <h4 className="font-bold text-[#2C3E50] border-b border-gray-200 pb-1.5 mb-2 text-sm">第2部 物質の変化</h4>
                      <ul className="space-y-1.5 text-xs font-bold text-gray-600">
                        <li className="flex items-center gap-1.5 hover:text-black hover:translate-x-0.5 transition-all"><span className="text-gray-400">1.</span> 物質量と化学反応式 (mol計算・化学反応式・イオン反応式・濃度)</li>
                        <li className="flex items-center gap-1.5 hover:text-black hover:translate-x-0.5 transition-all"><span className="text-gray-400">2.</span> 酸と塩基 (定義・電離度・強さ・pH・中和・塩の分類・中和滴定)</li>
                        <li className="flex items-center gap-1.5 hover:text-black hover:translate-x-0.5 transition-all"><span className="text-gray-400">3.</span> 酸化還元反応 (定義・酸化数・半反応式・滴定・イオン化傾向・電池)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Helpful study advice */}
                <div className="pt-6 border-t border-gray-200 border-dashed text-center">
                  <p className="text-xs text-gray-400 font-bold">
                    💡 上部メニューから見たいセクションを選択して勉強を進めましょう。
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 1-1 */}
            {activeTab === '1-1' && (
              <div className="space-y-12 animate-fade-in-up">
                {/* Chapter Heading */}
                <div>
                  <span className="text-xs font-extrabold text-[#A9CCE3] tracking-widest uppercase block">第1部 物質の構成</span>
                  <h2 className="text-2xl font-black text-[#1B2631] border-l-4 border-[#2C3E50] pl-3 py-1 mt-1 mb-2">1. 物質の構成</h2>
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項① ～純物質と混合物～</p>
                </div>

                {/* Definitions */}
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    <span className="border-b-2 border-slate-800 pb-0.5 inline-block font-bold">元素</span> … 物質を構成する原子の種類＝現在はおよそ
                    <span className="border-b-2 border-slate-800 pb-0.5 inline-block font-bold">120種類</span>の元素が存在。
                  </p>
                  <p className="leading-relaxed">
                    <span className="border-b-2 border-slate-800 pb-0.5 inline-block font-bold">元素記号</span> … 元素を表すラテン語由来の文字。
                  </p>
                </div>

                {/* Classification Table */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">● 物質の分類</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs md:text-sm border-collapse border border-gray-200 bg-white min-w-[500px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="p-3 border-r border-gray-200 font-bold text-[#2C3E50]">分類</th>
                          <th className="p-3 border-r border-gray-200 font-bold text-[#2C3E50]">定義</th>
                          <th className="p-3 font-bold text-[#2C3E50]">例</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="p-3 border-r border-gray-200 font-bold bg-[#A9CCE3]/10" rowSpan={2}>
                            純物質
                            <span className="block text-[10px] font-normal text-gray-500">一つの化学式で書ける</span>
                          </td>
                          <td className="p-3 border-r border-gray-200 font-semibold text-gray-600">
                            <span className="font-bold text-[#1B2631]">単体</span>：1種類の元素でできたもの
                          </td>
                          <td className="p-3 text-gray-600">酸素、窒素、鉄 などの金属</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="p-3 border-r border-gray-200 font-semibold text-gray-600">
                            <span className="font-bold text-[#1B2631]">化合物</span>：2種類以上の元素でできたもの
                          </td>
                          <td className="p-3 text-gray-600">水、塩化ナトリウム</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="p-3 border-r border-gray-200 font-bold bg-amber-50">
                            混合物
                            <span className="block text-[10px] font-normal text-gray-500">分けるには物理的方法</span>
                          </td>
                          <td className="p-3 border-r border-gray-200 font-semibold text-gray-600">
                            2種類以上の純物質でできたもの（一つの化学式で書けない）
                          </td>
                          <td className="p-3 text-gray-600">空気、海水、石油、塩酸、食塩水</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Points Callout */}
                <div className="border-l-4 border-sky-blue bg-white p-5 rounded-r-2xl shadow-xs space-y-4">
                  <h4 className="font-bold text-[#2C3E50] flex items-center gap-1.5 text-sm">📌 Point</h4>
                  <div className="space-y-4 text-sm leading-relaxed">
                    <div>
                      <p className="font-bold text-[#2C3E50] mb-1">① 沸点・融点・密度の性質</p>
                      <ul className="list-disc list-inside space-y-1 pl-2 text-gray-600">
                        <li>純物質は、融点や沸点、密度などが物質ごとに<span className="border-b-2 border-slate-800 pb-0.5 inline-block font-bold">一定</span>となる。</li>
                        <li>
                          ⇔ 混合物では、混じっている物質の種類やその<span className="underline decoration-wavy decoration-[#A9CCE3] underline-offset-4 inline-block font-bold">物質の種類</span>やその<span className="underline decoration-wavy decoration-[#A9CCE3] underline-offset-4 inline-block font-bold">割合</span>により、値が<span className="underline decoration-wavy decoration-[#A9CCE3] underline-offset-4 inline-block font-bold">変化</span>する。
                        </li>
                      </ul>
                      <p className="text-xs text-gray-400 mt-1 pl-2">※ 例）水とエタノールの混合物の加熱では沸点が徐々に上がり、明確な一定温度でとまらない。</p>
                    </div>

                    <div>
                      <p className="font-bold text-[#2C3E50] mb-1">② 単体と元素の識別</p>
                      <ul className="list-disc list-inside space-y-1 pl-2 text-gray-600">
                        <li><span className="font-bold text-slate-800">単体</span>…実際に存在する物質（直接的に触ることができるもの）</li>
                        <li><span className="font-bold text-slate-800">元素</span>…物質の構成成分（直接的に触ることができないもの）</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Example 1 */}
                <div className="border-l-4 border-emerald-500 bg-emerald-50/10 p-5 rounded-r-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-3 text-sm">🟢 例題 — 単体と元素の識別</div>
                  <p className="font-bold mb-4 leading-relaxed text-sm">
                    次の文中の下線部が、「単体」なのか「元素」なのかを答えよ。
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-xs md:text-sm font-semibold text-gray-700 pl-2">
                    <li><u>酸素</u>は、水に溶けにくい。</li>
                    <li>食塩（塩化ナトリウム）には、<u>ナトリウム</u>と<u>塩素</u>が含まれている。</li>
                    <li>植物の生育には、<u>窒素</u>が欠かせない。</li>
                    <li>水を電気分解すると、<u>水素</u>と<u>酸素</u>を生じる。</li>
                    <li>骨には<u>カルシウム</u>が含まれている。</li>
                  </ol>

                  <div className="mt-4">
                    <button 
                      onClick={() => toggleSolution('ex1-1')}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Lightbulb size={13} />
                      <span>{expandedSolutions['ex1-1'] ? '解答を閉じる' : '解答と解説を表示'}</span>
                    </button>

                    {expandedSolutions['ex1-1'] && (
                      <div className="mt-4 p-4 border border-dashed border-emerald-200 rounded-xl bg-white space-y-3 text-xs md:text-sm text-gray-700 animate-fade-in-up">
                        <p className="font-bold text-emerald-800">■ 正解</p>
                        <ul className="list-decimal list-inside space-y-2 font-bold text-slate-700 pl-1">
                          <li><span className="text-emerald-700">単体</span> （実際に存在するO₂という無色無臭のガスだから）</li>
                          <li><span className="text-indigo-600">元素</span> （ナトリウム金属そのものではなく、構成成分としてのNa原子だから）</li>
                          <li><span className="text-indigo-600">元素</span> （窒素の構成成分）</li>
                          <li><span className="text-emerald-700">単体</span> （実際に発生する気体のH₂、O₂だから）</li>
                          <li><span className="text-indigo-600">元素</span> （骨の中の化合物の一部としてのカルシウム。直接カルシウム金属を触れない）</li>
                        </ul>
                        <div className="pt-2 border-t border-gray-100">
                          <p className="font-bold text-slate-800 text-xs">【超重要見分け方】</p>
                          <p className="text-[11px] text-gray-500">「直接触ったり、吸ったり、実験室でフラスコの中に集められるもの」は単体。「成分」「カルシウムを補給する」などは元素として考えると、どんな問題もほぼ100%正解できます。</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Important Topic 2 */}
                <div>
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項② ～物質の分離・精製法～</p>
                  <p className="text-sm text-gray-600 leading-relaxed mt-3">
                    <span className="border-b-2 border-slate-800 pb-0.5 inline-block font-bold">分離</span>：混合物から欲しい物質を取り出す操作。<br />
                    <span className="border-b-2 border-slate-800 pb-0.5 inline-block font-bold">精製</span>：分離された物質をさらに純粋にする（きれいにすること。
                  </p>
                </div>

                {/* Separations Table */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">● 分離・精製方法のまとめ</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse border border-gray-200 bg-white min-w-[650px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="p-3 border-r border-gray-200 font-bold text-[#2C3E50] w-[15%]">方法</th>
                          <th className="p-3 border-r border-gray-200 font-bold text-[#2C3E50] w-[40%]">操作内容</th>
                          <th className="p-3 font-bold text-[#2C3E50] w-[45%]">具体例と注意点</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="p-2 border-r border-gray-200 font-bold bg-slate-50"><span className="border-b-2 border-slate-800 pb-0.5">ろ過</span></td>
                          <td className="p-2 border-r border-gray-200 text-slate-600 leading-relaxed">
                            <span className="underline decoration-wavy decoration-[#A9CCE3] underline-offset-4">固体と液体の混合物</span>から、ろ紙を用いて固体を分離。※ろ液：通過した液
                          </td>
                          <td className="p-2 text-slate-500 leading-normal">
                            砂を含む水溶液から砂を取り出す。<br />
                            <strong>注意点</strong>：①ガラス棒に伝わせ注ぐ。 ②ろうとの足を内壁にぴったりつける。
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="p-2 border-r border-gray-200 font-bold bg-slate-50"><span className="border-b-2 border-slate-800 pb-0.5">蒸留</span></td>
                          <td className="p-2 border-r border-gray-200 text-slate-600 leading-relaxed">
                            沸点の違いを利用。液体を過熱して生じる蒸気を冷却し、沸点の低い液体を分離。
                          </td>
                          <td className="p-2 text-slate-500 leading-normal">
                            食塩水から純物質の「水」を分ける。<br />
                            <strong>注意点</strong>：①<span className="underline decoration-wavy decoration-[#A9CCE3]">突沸（急な沸騰）を防ぐため</span>に<b>沸騰石</b>を入れる。 ②温度計の球部は枝の付け根。 ③冷却水は下→上。
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="p-2 border-r border-gray-200 font-bold bg-slate-50"><span className="border-b-2 border-slate-800 pb-0.5">分留</span></td>
                          <td className="p-2 border-r border-gray-200 text-slate-600 leading-relaxed">
                            沸点の異なる<span className="underline decoration-wavy decoration-[#A9CCE3]">2種類以上の液体混合物</span>を加熱して別々に留出させる。
                          </td>
                          <td className="p-2 text-slate-500 leading-normal">
                            原油からガソリン、灯油、軽油などを分留する。
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="p-2 border-r border-gray-200 font-bold bg-slate-50"><span className="border-b-2 border-slate-800 pb-0.5">昇華法</span></td>
                          <td className="p-2 border-r border-gray-200 text-slate-600 leading-relaxed">
                            加熱して直接気体になる<span className="underline decoration-wavy decoration-[#A9CCE3]">昇華しやすい固体</span>を冷却して分離。 <br />
                            ※昇華性：ドライアイス、ヨウ素、ナフタレン
                          </td>
                          <td className="p-2 text-slate-500 leading-normal">
                            ヨウ素と砂の混合物からヨウ素を分離する。
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="p-2 border-r border-gray-200 font-bold bg-slate-50"><span className="border-b-2 border-slate-800 pb-0.5">再結晶</span></td>
                          <td className="p-2 border-r border-gray-200 text-slate-600 leading-relaxed">
                            温度によって<span className="underline decoration-wavy decoration-[#A9CCE3]">溶解度</span>が大きく変化する固体を、熱水に溶かして冷却し析出させる。
                          </td>
                          <td className="p-2 text-slate-500 leading-normal">
                            少量の硫酸銅を不純物とする硝酸カリウムから、純粋な硝酸カリウムを得る。
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="p-2 border-r border-gray-200 font-bold bg-slate-50"><span className="border-b-2 border-slate-800 pb-0.5">抽出</span></td>
                          <td className="p-2 border-r border-gray-200 text-slate-600 leading-relaxed">
                            混合物に適切な溶媒を引き入れ、目的の物質だけを溶かしだして分離。
                          </td>
                          <td className="p-2 text-slate-500 leading-normal">
                            茶葉にお湯を注いで、お茶の成分（カテキンなど）を溶かしだす。
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="p-2 border-r border-gray-200 font-bold bg-slate-50"><span className="border-b-2 border-slate-800 pb-0.5">クロマトグラフィー</span></td>
                          <td className="p-2 border-r border-gray-200 text-slate-600 leading-relaxed">
                            物質の吸着力や浸透速度の違いを利用。ろ紙などを用いる。
                          </td>
                          <td className="p-2 text-slate-500 leading-normal">
                            ペーパークロマトによる水性インクのインク色素の分離。
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Important Topic 3 "SCOP" */}
                <div className="border-l-4 border-amber-400 bg-amber-50/10 p-5 rounded-r-2xl shadow-xs space-y-4">
                  <h4 className="font-bold text-[#2C3E50] flex items-center gap-1.5 text-sm">🔥 定期テストに出やすいこと① 〜同素体〜</h4>
                  <p className="text-sm leading-relaxed">
                    <span className="border-b-2 border-slate-800 pb-0.5 inline-block font-bold">同素体</span>：同じ元素からなるが、性質の異なる単体が存在するもの。
                  </p>
                  
                  {/* Mnemonic phrase */}
                  <div className="bg-[#F9E79F]/30 p-4 rounded-xl border border-[#FDFBF7]">
                    <div className="text-xs font-bold text-amber-700 mb-1">💡 覚え方</div>
                    <p className="font-handwriting text-base text-gray-800 leading-relaxed">
                      同素体の「<b>スコップ</b>」 → <span className="text-[#2C3E50] font-bold"><b>S</b>（硫黄）・<b>C</b>（炭素）・<b>O</b>（酸素）・<b>P</b>（リン）</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="bg-white p-3 rounded-lg border border-gray-150">
                      <p className="font-bold text-slate-800 mb-1 border-b border-gray-150 pb-1">S （硫黄）</p>
                      <ul className="space-y-1 text-gray-500">
                        <li>❶ <span className="text-slate-800">斜方硫黄 S₈</span>（常温で安定・黄色）</li>
                        <li>❷ <span className="text-slate-800">単斜硫黄 S₈</span>（淡黄色・針状）</li>
                        <li>❸ <span className="text-slate-800">ゴム状硫黄 S</span>（暗褐色・ゴム状）</li>
                      </ul>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-150">
                      <p className="font-bold text-slate-800 mb-1 border-b border-gray-150 pb-1">C （炭素）</p>
                      <ul className="space-y-1 text-gray-500">
                        <li>❶ <span className="text-slate-800">ダイヤモンド</span>（超極きめて硬い・絶縁体）</li>
                        <li>❷ <span className="text-slate-800">黒鉛</span>（やわらかい・電気を通す）</li>
                        <li>❸ <span className="text-slate-800">フラーレン C₆₀</span>（サッカーボール型）</li>
                        <li>❹ <span className="text-slate-800">カーボンナノチューブ</span>（筒状ナノ構造）</li>
                      </ul>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-150">
                      <p className="font-bold text-slate-800 mb-1 border-b border-gray-150 pb-1">O （酸素）</p>
                      <ul className="space-y-1 text-gray-500">
                        <li>❶ <span className="text-slate-800">酸素 O₂</span>（無色・無臭）</li>
                        <li>❷ <span className="text-slate-800">オゾン O₃</span>（淡青色・特異臭・有毒）</li>
                      </ul>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-150">
                      <p className="font-bold text-slate-800 mb-1 border-b border-gray-150 pb-1">P （リン）</p>
                      <ul className="space-y-1 text-gray-500">
                        <li>❶ <span className="text-slate-800">黄リン P₄</span>（毒性強、空気中で<span className="underline decoration-wavy decoration-red-400">自然発火するため<b>水中保存</b></span>）</li>
                        <li>❷ <span className="text-slate-800">赤リン P_x</span>（毒性弱、安全。マッチの側薬に利用）</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Flame color reaction table */}
                <div className="border-l-4 border-amber-400 bg-amber-50/10 p-5 rounded-r-2xl shadow-xs space-y-4">
                  <h4 className="font-bold text-[#2C3E50] flex items-center gap-1.5 text-sm">🔥 定期テストに出やすいこと② 〜炎色反応〜</h4>
                  <p className="text-sm leading-relaxed">
                    <span className="border-b-2 border-slate-800 pb-0.5 inline-block font-bold">炎色反応</span>：ある金属元素を含む溶液・物質を無色透明のガスバーナーの炎に近づけると、特異な色を放つ現象。
                  </p>

                  <div className="bg-white p-4 rounded-xl border border-gray-150">
                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 text-center text-xs md:text-sm font-bold">
                      <div className="bg-red-50 p-2 rounded-lg border border-red-150"><p className="text-slate-500">Li</p><p className="text-red-500 mt-1">赤</p></div>
                      <div className="bg-amber-50 p-2 rounded-lg border border-amber-150"><p className="text-slate-500">Na</p><p className="text-amber-500 mt-1">黄</p></div>
                      <div className="bg-purple-50 p-2 rounded-lg border border-purple-150"><p className="text-slate-500">K</p><p className="text-purple-500 mt-1">淡紫</p></div>
                      <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-150"><p className="text-slate-500">Cu</p><p className="text-emerald-500 mt-1">青緑</p></div>
                      <div className="bg-orange-50 p-2 rounded-lg border border-orange-150"><p className="text-slate-500">Ca</p><p className="text-orange-500 mt-1">橙赤</p></div>
                      <div className="bg-rose-50 p-2 rounded-lg border border-rose-150"><p className="text-slate-500">Sr</p><p className="text-rose-500 mt-1">紅</p></div>
                      <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-150"><p className="text-slate-500">Ba</p><p className="text-yellow-600 mt-1">黄緑</p></div>
                    </div>
                  </div>

                  <div className="bg-[#FDFBF7] p-3 rounded-xl border border-gray-150">
                    <div className="text-xs font-bold text-slate-500 mb-1">💡 覚え方（代表的語呂合わせ）</div>
                    <p className="font-handwriting text-base text-[#1D3557] leading-relaxed">
                      「<b>リアカー</b>（Li赤） <b>無き</b>（Na黄） <b>K村</b>（K紫） <b>動力</b>（Cu青緑） <b>借りようと</b>（Ca橙） <b>するもくれない</b>（Sr紅） <b>馬力</b>（Ba黄緑）で行こう」
                    </p>
                  </div>
                </div>

                {/* Detection detection of elements */}
                <div className="space-y-4">
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項③ ～成分元素の検出～</p>
                  <p className="text-sm text-gray-500 font-bold mb-2">物質の中にどの元素が含まれているか、化学反応を利用して突き止める方法</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="bg-white p-4 rounded-xl border border-gray-150 relative shadow-xs">
                      <p className="font-bold text-slate-800 border-b pb-1.5 mb-2 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">C</span>
                        <span>炭素（C）の検出</span>
                      </p>
                      <p className="leading-relaxed text-gray-600">
                        対象を完全に燃焼させ、発生した気体を<b>石灰水</b>に通すと、不溶性の炭酸カルシウムが生成して<span className="border-b-2 border-slate-800 pb-0.5 font-bold">白く濁る</span>（白濁）。
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-150 relative shadow-xs">
                      <p className="font-bold text-slate-800 border-b pb-1.5 mb-2 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">H</span>
                        <span>水素（H）の検出</span>
                      </p>
                      <p className="leading-relaxed text-gray-600">
                        対象を完全に燃焼して生じた液体（水）を、白色の<b>硫酸銅（Ⅱ）無水塩 (CuSO₄)</b> に触れさせると、五水和物(CuSO₄・5H₂O)の美しい<span className="border-b-2 border-slate-800 pb-0.5 font-bold">青色に変わる</span>。
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-150 relative shadow-xs">
                      <p className="font-bold text-slate-800 border-b pb-1.5 mb-2 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">Cl</span>
                        <span>塩素（Cl）の検出</span>
                      </p>
                      <p className="leading-relaxed text-gray-600">
                        試料の水溶液に<b>硝酸銀（AgNO₃）</b>水溶液を加えると、不溶性の塩化銀沈殿(AgCl)により、きれいな<span className="underline decoration-wavy decoration-[#A9CCE3]">白色沈殿</span>が生じる。
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-150 relative shadow-xs">
                      <p className="font-bold text-slate-800 border-b pb-1.5 mb-2 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">S</span>
                        <span>硫黄（S）の検出</span>
                      </p>
                      <p className="leading-relaxed text-gray-600">
                        試料に<b>酢酸鉛（Ⅱ）</b>水溶液を加えると、硫化鉛(PbS)の<span className="underline decoration-wavy decoration-[#A9CCE3]">黒色沈殿</span>が生じる。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Solid, liquid, gaseous comparative table */}
                <div className="space-y-4">
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項④ ～粒子の熱運動と物質の三態～</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse border border-gray-200 bg-white min-w-[550px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-slate-700">
                          <th className="p-3 border-r border-gray-200 font-bold">状態</th>
                          <th className="p-3 border-r border-gray-200 font-bold">粒子相互間の距離（引力）</th>
                          <th className="p-3 border-r border-gray-200 font-bold">熱運動の状態</th>
                          <th className="p-3 font-bold">体積と形状</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold bg-blue-50/30">固体 (Solid)</td>
                          <td className="p-3 border-r border-gray-200">極めて小さく、引力が一番強く働く</td>
                          <td className="p-3 border-r border-gray-200">その場でわずかに<span className="border-b-2 border-slate-800 font-bold">振動</span>している</td>
                          <td className="p-3">体積・形ともに一定</td>
                        </tr>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold bg-amber-50/20">液体 (Liquid)</td>
                          <td className="p-3 border-r border-gray-200">固体とほぼ同じ。お互いの粒子が自由に動ける</td>
                          <td className="p-3 border-r border-gray-200">比較的エネルギーが大きく、流動的に動く</td>
                          <td className="p-3">体積はほぼ一定、形状は変化</td>
                        </tr>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold bg-red-50/20">気体 (Gas)</td>
                          <td className="p-3 border-r border-gray-200">距離が非常に大きく、分子間力はほぼ無視</td>
                          <td className="p-3 border-r border-gray-200">高速で<span className="underline decoration-wavy decoration-[#A9CCE3] font-bold">激しく熱運動</span>し四方に飛び回る</td>
                          <td className="p-3">体積・形ともに自由に変形</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* SECTION 1-2 */}
            {activeTab === '1-2' && (
              <div className="space-y-12 animate-fade-in-up">
                {/* Chapter Heading */}
                <div>
                  <span className="text-xs font-extrabold text-[#A9CCE3] tracking-widest uppercase block">第1部 物質の構成</span>
                  <h2 className="text-2xl font-black text-[#1B2631] border-l-4 border-[#2C3E50] pl-3 py-1 mt-1 mb-2">2. 物質の構成粒子</h2>
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項① ～原子の構造と周期表～</p>
                </div>

                {/* Atom Structure point */}
                <div className="space-y-4 text-sm leading-relaxed">
                  <p>
                    原子は中央に正（＋）の電荷をもつ<b>原子核</b>があり、周りを負（－）の電荷をもつ<b>電子</b>が回っている。
                  </p>
                  <p>
                    原子核の中には、正の電荷をもつ<b>陽子</b>と、電気的に中性な<b>中性子</b>が存在する。
                  </p>
                  <div className="bg-white border rounded-xl p-4 border-gray-200 text-slate-600 space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-xs text-slate-800">📌 原子の成立条件</p>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-xs">
                      <li><span className="font-bold text-slate-800">原子番号</span> ＝ 陽子の数 ＝ 原子核の周りの電子の数（＝電気的に中性）</li>
                      <li><span className="font-bold text-slate-800">質量数</span> ＝ 陽子の数 ＋ 中性子の数（電子の質量はほぼ0として無視できる）</li>
                      <li><span className="font-bold text-slate-800">質量関係</span> ： 陽子と中性子の質量比はほぼ１：１。電子の質量は陽子の約１／1840（非常に小さい）。</li>
                    </ul>
                  </div>
                </div>

                {/* Isotopes & Radioactivity */}
                <div className="border-l-4 border-sky-blue bg-white p-5 rounded-r-2xl shadow-xs space-y-3">
                  <h4 className="font-bold text-[#2C3E50] text-sm">📌 同位体（アイソトープ）</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    原子番号（陽子の数・陽子の性質）が全く同じ（同じ元素）だが、<span className="font-bold text-slate-800">中性子の数が異なる</span>ため、質量数が違う原子同士のこと。化学的性質はほぼ等しい。
                  </p>
                  <p className="text-xs text-gray-500">
                    ※ 放射能を持ち、時間とともに壊れて放射線を放ち別原子に変わる同位体は「放射性同位体（ラジオアイソトープ）」と呼ばれる。一定の割合で減少する時間の長さを「半減期」（C-14は5730年）と呼ぶ。
                  </p>
                </div>

                {/* Example problem calculated */}
                <div className="border-l-4 border-emerald-500 bg-emerald-50/10 p-5 rounded-r-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-3 text-sm">🟢 例題 — 半減期の計算</div>
                  <p className="font-bold mb-4 leading-relaxed text-sm">
                    遺跡から発見された古い木材片に含まれる炭素14（¹⁴C）の割合を測定したところ、現在の植物（大気中）に含まれる ¹⁴C の割合の 4分の1（1/4）に減少していた。この木材片は、今から約何年前に伐採されたものか、整数で求めよ。ただし、 ¹⁴C の半減期は 5730 年とする。
                  </p>

                  <div className="mt-4">
                    <button 
                      onClick={() => toggleSolution('ex1-2-1')}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Lightbulb size={13} />
                      <span>{expandedSolutions['ex1-2-1'] ? '解答を閉じる' : '解答と解説を表示'}</span>
                    </button>

                    {expandedSolutions['ex1-2-1'] && (
                      <div className="mt-4 p-4 border border-dashed border-emerald-200 rounded-xl bg-white space-y-3 text-xs md:text-sm text-gray-700 animate-fade-in-up">
                        <p className="font-bold text-emerald-800">■ 正解</p>
                        <ul className="space-y-1 font-bold text-slate-700">
                          <li>現在の量から、1/2 になるまでに1回分の半減期（1×5730年）が経ち、</li>
                          <li>さらにその半分（1/4）になるまでに、2回分の半減期が経過していることになります。</li>
                          <li className="text-red-500 mt-2 text-base">式： 5730 年 × 2 ＝ 11460 年前</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Periodic Law summary */}
                <div className="space-y-4">
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項② ～周期表と周期律～</p>
                  <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-slate-600 pl-1 leading-relaxed">
                    <li><span className="font-bold text-slate-800">周期律</span>：元素を原子番号順に並べると、同じような化学的性質をもつ元素が周期的に現れる性質。</li>
                    <li><span className="font-bold text-slate-800">周期表</span>：ロシアの化学者メンデレーエフが原型を作成。<br />
                      ・<b>縦の列「族」</b>（1族～18族 ⇒ 同族元素は価電子数が等しく化学的性質が酷似）<br />
                      ・<b>横の行「周期」</b>（第1周期～第7周期 ⇒ 電子殻の数に対応）
                    </li>
                    <li>典型元素（1, 2, 13～18族）と遷移元素（3～12族のすべてが金属）の境目や、金属と非金属の性質を捉えておく。</li>
                    <li><b>常温で液体</b>の元素は、単体で<span className="border-b-2 border-slate-800 font-bold">水銀 (Hg)</span>と<span className="border-b-2 border-slate-800 font-bold">臭素 (Br)</span>の2点のみ。</li>
                  </ul>
                </div>

                {/* Ions & properties */}
                <div className="space-y-4">
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項③ ～イオン～</p>
                  <p className="text-sm leading-relaxed">
                    原子は、一番外側の軌道にある電子の数（<span className="font-bold text-slate-800">価電子</span>）を放出して陽性（陽イオン）になるか、電子を取り込んで陰性（陰イオン）になり、安定な貴ガスの電子配置をとろうとする。
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="bg-white p-4 rounded-xl border border-gray-150 relative shadow-xs">
                      <p className="font-bold text-slate-800 border-b pb-1.5 mb-2">陽イオンへのなりやすさ</p>
                      <p className="leading-relaxed text-gray-600">
                        価電子数が「1〜3個」の原子（金属元素に多い）は、価電子を失って<span className="border-b-2 border-slate-800 font-bold">陽イオン</span>になりやすい。<br />
                        これを「陽性が強い」と言い、周期表の<b>左下</b>（特にアルカリ金属）に行くほど顕著。
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-150 relative shadow-xs">
                      <p className="font-bold text-slate-800 border-b pb-1.5 mb-2">陰イオンへのなりやすさ</p>
                      <p className="leading-relaxed text-gray-600">
                        価電子数が「6〜7個」の原子（非金属・ハロゲンなど）は、電子を受け取って<span className="border-b-2 border-slate-800 font-bold">陰イオン</span>になりやすい。<br />
                        これを「陰性が強い」と言い、周期表の<b>右上</b>（17族ハロゲン。18族貴ガスは除く）に行くほど顕著。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ionization energy and electron affinity */}
                <div className="border-l-4 border-amber-400 bg-amber-50/10 p-5 rounded-r-2xl shadow-xs space-y-4">
                  <h4 className="font-bold text-[#2C3E50] flex items-center gap-1.5 text-sm">💡 イオン化エネルギーと電子親和力</h4>
                  <div className="space-y-3 text-xs md:text-sm leading-relaxed text-slate-650">
                    <p>
                      ❶ <b>（第一）イオン化エネルギー</b>：原子から電子を1個むしり取って、1価の陽イオンにするために「<b>必要とする（吸収する）エネルギー</b>」。最小のアルカリ金属は陽イオンになりやすく、最大の18族貴ガス（特にヘリウム）は陽イオンになりにくい。
                    </p>
                    <p>
                      ❷ <b>電子親和力</b>：原子が電子を1個取り込んで、1価の陰イオンになるときに「<b>放出するエネルギー</b>」。この値が大きい元素（17族ハロゲン、特に塩素）ほど、電子を放出して陰イオンに安定化しやすい。
                    </p>
                  </div>
                </div>

                {/* Periodic atom/ion radius comparisons */}
                <div className="space-y-4">
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項④ ～原子・イオンの大きさ～</p>
                  
                  <div className="border-l-4 border-sky-blue bg-white p-5 rounded-r-2xl shadow-xs space-y-4">
                    <h4 className="font-bold text-[#2C3E50] text-sm">📌 大きさを決める2大要因</h4>
                    <div className="space-y-3 text-xs md:text-sm">
                      <p>
                        ① <b>同じ族（縦列）</b>：原子番号が大きくなるほど、電子が収まる殻（電子殻）の数が増えるため、<b>半径は大きくなる</b>。
                      </p>
                      <p>
                        ② <b>同じ電子配置のイオン</b>：中性子・電子の配列が同一（等電子配置。例：O²⁻、F⁻、Na⁺、Mg²⁺、Al³⁺はすべてネオン型）の場合、原子核の中の陽子の数（正の電荷）が多ければ多いほど、電子を内側に強く引き付けるため、<b>半径は小さくなる</b>。
                        <span className="block font-bold text-red-500 text-center text-sm mt-2">
                          大小： O²⁻ ＞ F⁻ ＞ Na⁺ ＞ Mg²⁺ ＞ Al³⁺
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SECTION 1-3 */}
            {activeTab === '1-3' && (
              <div className="space-y-12 animate-fade-in-up">
                {/* Chapter Heading */}
                <div>
                  <span className="text-xs font-extrabold text-[#A9CCE3] tracking-widest uppercase block">第1部 物質の構成</span>
                  <h2 className="text-2xl font-black text-[#1B2631] border-l-4 border-[#2C3E50] pl-3 py-1 mt-1 mb-2">3. 化学結合</h2>
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項① ～結合の種類〜</p>
                </div>

                {/* Explanation of Bonds */}
                <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-650">
                  <p>
                    ❶ <b>イオン結合</b>：陽イオンと陰イオンが<span className="border-b-2 border-slate-800 pb-0.5 font-bold">静電気力（クーロン力）</span>で引き合って規則正しく密に配列した強固な結合。（例：塩化ナトリウム NaCl。主に金属＋非金属）。
                  </p>
                  <p>
                    ❷ <b>共有結合</b>：非金属元素の原子がお互いの不対電子を出し合って、共有してつくられる強い結合。最外殻電子に注目して描く「<b>電子式</b>」や、共有結合のペアを1本の実線で表す「<b>構造式</b>」を学ぶ。
                  </p>
                  <p>
                    ❸ <b>配位結合</b>：一方の原子がすでに持っている非共有電子対を、他方に一方的に提供して共有して結びつく結合。（例：アンモニウムイオン NH₄⁺、オキソニウムイオン H₃O⁺）。結合した後は普通の共有結合と全く同様であり、区別がつかない。
                  </p>
                  <p>
                    ❹ <b>金属結合</b>：金属元素の原子同士が、遊離して自由に動ける「<b>自由電子</b>」をみんなで共有することにより、全体がまとまっている結合。
                  </p>
                </div>

                {/* Point Callouts: Form of molecules */}
                <div className="border-l-4 border-sky-blue bg-white p-5 rounded-r-2xl shadow-xs space-y-4">
                  <h4 className="font-bold text-[#2C3E50] text-sm">📌 分子の形と結合角（超頻出）</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse border border-gray-200 bg-white min-w-[450px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-slate-700">
                          <th className="p-3 border-r border-gray-200 font-bold">分子</th>
                          <th className="p-3 border-r border-gray-200 font-bold">化学式</th>
                          <th className="p-3 border-r border-gray-200 font-bold">立体的な形状</th>
                          <th className="p-3 font-bold">代表的な結合角</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold">二酸化炭素</td>
                          <td className="p-3 border-r border-gray-200 font-mono">CO₂</td>
                          <td className="p-3 border-r border-gray-200 font-bold">直線型</td>
                          <td className="p-3">180°</td>
                        </tr>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold">水</td>
                          <td className="p-3 border-r border-gray-200 font-mono">H₂O</td>
                          <td className="p-3 border-r border-gray-200 font-bold">折れ線型</td>
                          <td className="p-3">104.5°</td>
                        </tr>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold">アンモニア</td>
                          <td className="p-3 border-r border-gray-200 font-mono">NH₃</td>
                          <td className="p-3 border-r border-gray-200 font-bold">三角錐型</td>
                          <td className="p-3">107°</td>
                        </tr>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold">メタン</td>
                          <td className="p-3 border-r border-gray-200 font-mono">CH₄</td>
                          <td className="p-3 border-r border-gray-200 font-bold">正四面体型</td>
                          <td className="p-3">109.5°</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Crystal characteristics */}
                <div className="space-y-4">
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項② ～結晶の種類と性質～</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] md:text-xs border-collapse border border-gray-200 bg-white min-w-[700px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-slate-700">
                          <th className="p-2 border-r border-gray-200 font-bold">結晶の種類</th>
                          <th className="p-2 border-r border-gray-200 font-bold">各構成粒子</th>
                          <th className="p-2 border-r border-gray-200 font-bold">中心となる結合力</th>
                          <th className="p-2 border-r border-gray-200 font-bold">特徴の例、融点</th>
                          <th className="p-2 font-bold">代表的な実例</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-2 border-r border-gray-200 font-bold bg-slate-50">イオン結晶</td>
                          <td className="p-2 border-r border-gray-200">陽イオン、陰イオン</td>
                          <td className="p-2 border-r border-gray-200">イオン結合（クーロン力）</td>
                          <td className="p-2 border-r border-gray-200">硬くてもろい。水に溶けると電気を通す。融点高い。</td>
                          <td className="p-2 font-mono">NaCl, CaCO₃</td>
                        </tr>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-2 border-r border-gray-200 font-bold bg-slate-50">分子結晶</td>
                          <td className="p-2 border-r border-gray-200">分子（共有結合）</td>
                          <td className="p-2 border-r border-gray-200">弱い分子間力、水素結合</td>
                          <td className="p-2 border-r border-gray-200">柔らかくて脆い。電気を通さない。融点低い、昇華性あり。</td>
                          <td className="p-2 font-mono">ヨウ素, ドライアイス, ナフタレン</td>
                        </tr>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-2 border-r border-gray-200 font-bold bg-slate-50">共有結合結晶</td>
                          <td className="p-2 border-r border-gray-200">非金属原子</td>
                          <td className="p-2 border-r border-gray-200">強大な共有結合だけ</td>
                          <td className="p-2 border-r border-gray-200">極めて硬く、融点・沸点が極限まで非常に高い。電気は通さない(黒鉛除く)。</td>
                          <td className="p-2 font-mono">ダイヤモンド, ケイ素(Si), 二酸化ケイ素(SiO₂)</td>
                        </tr>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-2 border-r border-gray-200 font-bold bg-slate-50">金属結晶</td>
                          <td className="p-2 border-r border-gray-200">金属の陽イオン</td>
                          <td className="p-2 border-r border-gray-200">金属結合（自由電子）</td>
                          <td className="p-2 border-r border-gray-200">展性・延性、光沢に優れる。熱・電気を良く通す。</td>
                          <td className="p-2 font-mono">Fe, Cu, Al, Na</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-amber-50/20 p-4 rounded-xl border border-amber-200">
                    <p className="text-xs font-bold text-[#D35400] mb-1">💡 結晶の強さ（融点の大小）の序列</p>
                    <p className="font-bold text-slate-800 text-sm">
                      共有結合結晶 ＞ イオン結晶 ＞ 金属結晶 ＞＞ 分子結晶（分子間力）
                    </p>
                  </div>
                </div>

                {/* Electronegativity and Polarisations */}
                <div className="space-y-4">
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項③ ～分子の極性と電気陰性度～</p>
                  <p className="text-xs md:text-sm leading-relaxed">
                    原子が共有電子対を引き付ける強さの度合いを<b>電気陰性度</b>という。お互いの値が異なると、電荷の偏り（<b>極性</b>）が生じる。
                  </p>

                  <div className="bg-[#F9E79F]/30 p-4 rounded-xl border border-[#FDFBF7]">
                    <div className="text-xs font-bold text-amber-700 mb-1">💡 電気陰性度の覚え方（フォンクラックス）</div>
                    <p className="font-handwriting text-base text-[#1D3557] leading-relaxed">
                      「<b>フ（F） ォ（O） ン（N ≦ Cl） ク（C） ラ（S） ッ（H） ク（金属）</b>」
                      <span className="block font-bold font-modern text-xs mt-1 text-gray-500">
                        ※ F ＞ O ＞ N ＝ Cl ＞ C ＞ S ＞ H ＞ 金属
                      </span>
                    </p>
                  </div>

                  <div className="border-l-4 border-sky-blue bg-white p-4 rounded-r-xl shadow-xs text-xs md:text-sm">
                    <p className="font-bold mb-1">分子全体の極性の見分け方</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li><b>極性分子</b>：分子の形状が非対称。電荷の偏りが相殺されずに残る製品（例：H₂O 折れ線型、NH₃ 三角錐型）。</li>
                      <li><b>無極性分子</b>：直線型や正四面体などの高い対称形状をもち、電荷が対称的に相殺される物質（例：CO₂ 直線型、CH₄ 正四面体型）。</li>
                    </ul>
                  </div>
                </div>

              </div>
            )}

            {/* SECTION 2-1 */}
            {activeTab === '2-1' && (
              <div className="space-y-12 animate-fade-in-up">
                {/* Chapter Heading */}
                <div>
                  <span className="text-xs font-extrabold text-[#A9CCE3] tracking-widest uppercase block">第2部 物質の変化</span>
                  <h2 className="text-2xl font-black text-[#1B2631] border-l-4 border-[#2C3E50] pl-3 py-1 mt-1 mb-2">1. 物質量と化学反応式</h2>
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項① ～物質量（mol）～</p>
                </div>

                {/* Mole calculation concepts */}
                <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-650">
                  <p>
                    炭素原子 ¹²C 1個の質量（絶対質量）は約2×10⁻²³gと非常に扱いづらい。
                    そこで、「<b>¹²C 1個の質量を基準12とする</b>」という<span className="border-b-2 border-slate-800 pb-0.5 font-bold">相対質量</span>を取り入れる。
                  </p>
                  <p>
                    ・<b>原子量</b>：炭素12を基準とした各元素の相対質量の平均値（同位体の存在比を考慮）。<br />
                    ・<b>分子量</b>：分子を表す化学式内の構成元素の原子量の合計。<br />
                    ・<b>式量</b>：イオンや、イオン結晶などの分子をつくらない物質の合計原子量。
                  </p>
                </div>

                {/* Calculations details */}
                <div className="border-l-4 border-sky-blue bg-white p-5 rounded-r-2xl shadow-xs space-y-4 text-xs md:text-sm leading-relaxed">
                  <h4 className="font-bold text-[#2C3E50] text-sm">📌 物質量（mol）の算出ルール</h4>
                  <p>
                    1 mol（モル）とは、粒子を「<b>6.0×10²³個</b>」（アボガドロ定数）集めた塊としての単位。
                  </p>
                  <ul className="list-decimal list-inside space-y-2 text-slate-600 pl-1">
                    <li><span className="font-bold text-slate-800">個数 ↔ mol</span>： 1 mol ＝ 6.0×10²³ 個 (粒子の個数に相当)</li>
                    <li><span className="font-bold text-slate-800">質量 ↔ mol</span>： 1 mol ＝ モル質量 [g] (原子量・分子量・式量に「g/mol」をつけた値)</li>
                    <li><span className="font-bold text-slate-800">体積 ↔ mol</span>： 標準状態（0℃, 1.013×10⁵Pa）において、どんな気体でも <b>1 mol ＝ 22.4 L</b> となる。</li>
                  </ul>
                </div>

                {/* Example calculation for mole */}
                <div className="border-l-4 border-emerald-500 bg-emerald-50/10 p-5 rounded-r-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-3 text-sm">🟢 例題 — 物質量と体積・個数の複合計算</div>
                  <p className="font-bold mb-4 leading-relaxed text-sm">
                    二酸化炭素 CO₂ 88 g がある。これに関して以下の問に答えよ。（ただし C＝12、O＝16、アボガドロ定数は 6.0×10²³ /mol とする）
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-xs md:text-sm font-semibold text-gray-700 pl-2">
                    <li>この二酸化炭素の物質量（mol）はいくらか。</li>
                    <li>この二酸化炭素に含まれる二酸化炭素分子の個数は何個か。</li>
                    <li>この二酸化炭素が標準状態のときに占める体積は何 L か。</li>
                  </ol>

                  <div className="mt-4">
                    <button 
                      onClick={() => toggleSolution('ex2-1-1')}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Lightbulb size={13} />
                      <span>{expandedSolutions['ex2-1-1'] ? '解答を閉じる' : '解答と解説を表示'}</span>
                    </button>

                    {expandedSolutions['ex2-1-1'] && (
                      <div className="mt-4 p-4 border border-dashed border-emerald-200 rounded-xl bg-white space-y-3 text-xs md:text-sm text-gray-700 animate-fade-in-up">
                        <p className="font-bold text-emerald-800">■ 正解と解説</p>
                        <p className="text-gray-500">※まずCO₂の分子量を求めます。 12 ＋ 16×2 ＝ 44 です。よってCO₂のモル質量は 44 g/mol。</p>
                        <ol className="list-decimal list-inside space-y-3 font-semibold text-slate-700">
                          <li>
                            <span className="text-emerald-700 font-bold">2.0 mol</span><br />
                            <span className="text-xs text-gray-400">（式： 88 g ÷ 44 g/mol ＝ 2.0 mol）</span>
                          </li>
                          <li>
                            <span className="text-emerald-700 font-bold">1.2×10²⁴ 個</span><br />
                            <span className="text-xs text-gray-400">（式： 2.0 mol × 6.0×10²³ 個/mol ＝ 12×10²³ ＝ 1.2×10²⁴ 個）</span>
                          </li>
                          <li>
                            <span className="text-emerald-700 font-bold">44.8 L</span><br />
                            <span className="text-xs text-gray-400">（式： 2.0 mol × 22.4 L/mol ＝ 44.8 L）</span>
                          </li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chemical Reaction representation */}
                <div className="space-y-4">
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項② ～化学反応式とその量的関係～</p>
                  <p className="text-sm leading-relaxed">
                    化学反応式を書く場合の最大のルールは、「<b>反応の前後で各元素の原子の総数を等しくする</b>」こと。<br />
                    最も簡単な整数比になるように決定する（係数1は省略）。反応式をつくるには、主に<b>目算法</b>と、連立方程式を導く<b>未定係数法</b>がある。
                  </p>

                  <div className="bg-[#F9E79F]/30 p-4 rounded-xl border border-[#FDFBF7]">
                    <div className="text-xs font-bold text-amber-700 mb-1">💡 反応式の係数が意味する黄金比率</div>
                    <p className="text-xs md:text-sm leading-relaxed text-slate-800">
                      化学反応式の係数の比は以下と一致する。<br />
                      <span className="font-bold text-red-650 text-sm block text-center mt-2">
                        係数の比 ＝ 物質量の比 ＝ 粒子の個数の比 ＝ 気体の体積の比
                      </span>
                      ※ 質量の比（gの比）とは一致しないので注意！
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* SECTION 2-2 */}
            {activeTab === '2-2' && (
              <div className="space-y-12 animate-fade-in-up">
                {/* Chapter Heading */}
                <div>
                  <span className="text-xs font-extrabold text-[#A9CCE3] tracking-widest uppercase block">第2部 物質の変化</span>
                  <h2 className="text-2xl font-black text-[#1B2631] border-l-4 border-[#2C3E50] pl-3 py-1 mt-1 mb-2">2. 酸と塩基</h2>
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項① ～酸と塩基の定義～</p>
                </div>

                {/* Definitions table */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">● 2つの代表的な定義</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs md:text-sm border-collapse border border-gray-200 bg-white min-w-[500px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-slate-700">
                          <th className="p-3 border-r border-gray-200 font-bold">定義名</th>
                          <th className="p-3 border-r border-gray-200 font-bold">酸とは</th>
                          <th className="p-3 font-bold">塩基とは</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold">アレニウスの定義</td>
                          <td className="p-3 border-r border-gray-200 leading-relaxed">
                            水に溶けて <span className="border-b-2 border-slate-800 font-bold">H⁺（または H₃O⁺）</span> を電離して生じるもの
                          </td>
                          <td className="p-3 leading-relaxed">
                            水に溶けて <span className="border-b-2 border-slate-800 font-bold">OH⁻</span> を電離して生じるもの
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold">ブレンステッド・ローリー</td>
                          <td className="p-3 border-r border-gray-200 leading-relaxed">
                            相手の物質に <span className="underline decoration-wavy decoration-[#A9CCE3]">H⁺ を与える</span>（水素イオンの供与体）
                          </td>
                          <td className="p-3 leading-relaxed">
                            相手の物質から <span className="underline decoration-wavy decoration-[#A9CCE3]">H⁺ を受け取る</span>（水素イオンの受容体）
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hydrogen ion calculations and pH */}
                <div className="space-y-4">
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項② ～強さ・pH・電離度～</p>
                  
                  <div className="border-l-4 border-sky-blue bg-white p-5 rounded-r-2xl shadow-xs space-y-4 text-xs md:text-sm leading-relaxed">
                    <h4 className="font-bold text-[#2C3E50] text-sm">📌 水素イオン濃度とpH</h4>
                    <p>
                      酸の水溶液中の水素イオン濃度 [H⁺] は、次の公式で導き出される。
                    </p>
                    <p className="bg-gray-50 p-3 rounded-lg text-center font-bold font-mono text-slate-800 shadow-inner">
                      [H⁺] ＝ 酸のモル濃度 (mol/L) × 電離度 α × 価数
                    </p>
                    <p>
                      [H⁺] ＝ 1.0 × 10⁻ˣ mol/L のとき、その水溶液の酸性度を表す指数である <b>pH 値は x</b> と定義される。
                    </p>
                    <div className="border-t pt-2 mt-2">
                      <p className="font-bold text-xs text-slate-700">【強さの覚え方】</p>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500 pl-1">
                        <li><b>強酸</b>：ほぼ100%完全に電離（α≒1）するもの。<b>「塩酸、硫酸、硝酸」</b>の3大メジャーのみ！</li>
                        <li><b>強塩基</b>：ほぼ完全に電離（α≒1）。<b>1族（Li, Na, K）と2族（Ca, Baなど※Mg除く）の金属水酸化物</b>のみ！</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Indicating and titration colors */}
                <div className="space-y-3">
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項③ ～中和と指示薬の変色域～</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse border border-gray-200 bg-white min-w-[550px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-slate-700">
                          <th className="p-3 border-r border-gray-200 font-bold">指示薬名</th>
                          <th className="p-3 border-r border-gray-200 font-bold">変色域（pH）</th>
                          <th className="p-3 font-bold">酸性側 ↔ 塩基性側の色変化</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold">メチルオレンジ</td>
                          <td className="p-3 border-r border-gray-200 font-mono">3.1〜4.4 (酸性寄り)</td>
                          <td className="p-3"><p className="text-red-500 font-bold inline">赤</p> ↔ <span className="text-amber-500 font-bold">黄</span> <span className="text-[10px] text-gray-400 pl-2">（語呂：ベーコンエッグ：赤→黄）</span></td>
                        </tr>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold"><span className="border-b-2 border-slate-850">フェノールフタレイン</span></td>
                          <td className="p-3 border-r border-gray-200 font-mono">8.0〜9.8 (塩基性寄り)</td>
                          <td className="p-3">無色 ↔ <p className="text-rose-500 font-bold inline">赤（強めのピンク紅）</p></td>
                        </tr>
                        <tr className="border-b border-gray-200 text-slate-600">
                          <td className="p-3 border-r border-gray-200 font-bold">BTB溶液</td>
                          <td className="p-3 border-r border-gray-200 font-mono">6.0〜7.6 (中性・広範囲)</td>
                          <td className="p-3"><span className="text-yellow-500 font-bold">黄(酸)</span> ↔ <span className="text-green-500 font-bold">緑(中)</span> ↔ <span className="text-blue-500 font-bold">青(塩基)</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mnemonic for shared washing */}
                <div className="border-l-4 border-amber-400 bg-amber-50/10 p-5 rounded-r-2xl shadow-xs space-y-3">
                  <h4 className="font-bold text-[#2C3E50] text-sm flex items-center gap-1.5">🔥 中和滴定器具の「共洗い（ともあらい）」の選別ルール</h4>
                  <div className="bg-[#F9E79F]/30 p-4 rounded-xl border border-[#FDFBF7]">
                    <div className="text-xs font-bold text-amber-700 mb-1">💡 覚え方</div>
                    <p className="font-handwriting text-base text-gray-800 leading-relaxed">
                      器具の末尾に、<b>ホールピペッ「ト」</b>、<b>ビュレッ「ト」</b>のように<b>「ト」</b>がつく精密な器具は、水分が少しでも残ると溶液がうすまり計量誤差が生じるため、滴定前に使用する溶液で内部を「<b>ともあらい</b>」する必要がある！
                    </p>
                    <p className="text-xs text-gray-400 font-bold mt-2">
                      ※ メスフラスコ、コニカルビーカーは「共洗いをしてはいけない（純水で洗った濡れたままで使って良い）」。
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* SECTION 2-3 */}
            {activeTab === '2-3' && (
              <div className="space-y-12 animate-fade-in-up">
                {/* Chapter Heading */}
                <div>
                  <span className="text-xs font-extrabold text-[#A9CCE3] tracking-widest uppercase block">第2部 物質の変化</span>
                  <h2 className="text-2xl font-black text-[#1B2631] border-l-4 border-[#2C3E50] pl-3 py-1 mt-1 mb-2">3. 酸化還元反応</h2>
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項① ～酸化数～</p>
                </div>

                {/* Definition and calculation */}
                <div className="space-y-4 text-xs md:text-sm leading-relaxed text-slate-650">
                  <p>
                    原子が電子をどれだけ失ったか（または得たか）の仮想的な状態を表す指標を<span className="border-b-2 border-slate-800 pb-0.5 font-bold">酸化数</span>と呼ぶ。
                  </p>
                  <p>
                    ・<b>酸化</b>：酸化数が増加する（電子を失う）。<br />
                    ・<b>還元</b>：酸化数が減少する（電子を受け取る）。
                  </p>
                </div>

                {/* Calculation rules */}
                <div className="border-l-4 border-sky-blue bg-white p-5 rounded-r-2xl shadow-xs space-y-4 text-xs md:text-sm leading-relaxed">
                  <h4 className="font-bold text-[#2C3E50] text-sm">📌 酸化数の決定ルール（超重要）</h4>
                  <ul className="list-decimal list-inside space-y-2 text-slate-600 pl-1">
                    <li>単体を構成するすべての原子の酸化数は <b>0</b> である。（例：H₂, O₂, Cu などは全部 0）</li>
                    <li>化合物を構成する各原子の酸化数の合計は <b>0</b> となる。</li>
                    <li>多原子イオンを構成する各原子の酸化数の合計は、その<b>イオンの電荷（価数）</b>に一致する。</li>
                    <li>
                      化合物中において：<br />
                      ・ <b>H原子は ＋1</b> （例外の金属水素化物 NaH などでは －1）<br />
                      ・ <b>O原子は －2</b> （例外の過酸化水素 H₂O₂ では －1） である。
                    </li>
                  </ul>
                </div>

                {/* Example of oxidation number calculation */}
                <div className="border-l-4 border-emerald-500 bg-emerald-50/10 p-5 rounded-r-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-3 text-sm">🟢 例題 — 酸化数の決定</div>
                  <p className="font-bold mb-4 leading-relaxed text-sm">
                    次の化学式・イオンにおける下線部を引いた原子の酸化数を求めよ。
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-xs md:text-sm font-semibold text-gray-700 pl-2 font-mono">
                    <li><u>Mn</u>O₄⁻ (過マンガン酸イオン)</li>
                    <li>K₂<u>Cr</u>₂O₇ (二クロム酸カリウム)</li>
                    <li><u>H</u>₂</li>
                    <li>H₂<u>O</u>₂ (過酸化水素)</li>
                  </ol>

                  <div className="mt-4">
                    <button 
                      onClick={() => toggleSolution('ex2-3-1')}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Lightbulb size={13} />
                      <span>{expandedSolutions['ex2-3-1'] ? '解答を閉じる' : '解答と解説を表示'}</span>
                    </button>

                    {expandedSolutions['ex2-3-1'] && (
                      <div className="mt-4 p-4 border border-dashed border-emerald-200 rounded-xl bg-white space-y-3 text-xs md:text-sm text-gray-700 animate-fade-in-up font-mono">
                        <p className="font-bold text-emerald-800">■ 正解と求め方</p>
                        <ol className="list-decimal list-inside space-y-3 font-semibold text-slate-700">
                          <li>
                            <span className="text-emerald-700 font-bold">＋7</span><br />
                            <span className="text-xs text-slate-500">（求め方： x ＋ (－2) × 4 ＝ －1 よって x ＝ ＋7）</span>
                          </li>
                          <li>
                            <span className="text-emerald-700 font-bold">＋6</span><br />
                            <span className="text-xs text-slate-500">（Kは＋1、Oは－2。(＋1)×2 ＋ y×2 ＋ (－2)×7 ＝ 0  よって y ＝ ＋6）</span>
                          </li>
                          <li>
                            <span className="text-emerald-700 font-bold font-mono">0</span><br />
                            <span className="text-xs text-slate-500">（単体の構成原子は例外なく 0 となる）</span>
                          </li>
                          <li>
                            <span className="text-emerald-700 font-bold">－1</span><br />
                            <span className="text-xs text-slate-500 font-bold">（※最重要例外。Hの＋1を優先するため、(＋1)×2 ＋ z×2 ＝ 0 より z ＝ －1）</span>
                          </li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metal Ionisation comparison list */}
                <div className="space-y-4">
                  <p className="text-xs text-red-500 font-black border-b border-red-200 border-dashed pb-2 inline-block">重要事項② ～金属のイオン化傾向・電池〜</p>
                  <p className="text-sm leading-relaxed">
                    金属単体が出しやすい「自由電子」を失って水溶液中で陽イオンになりたがる性質の序列を<b>イオン化列</b>と呼ぶ。
                  </p>

                  <div className="overflow-x-auto">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 text-center text-xs md:text-sm font-black whitespace-nowrap overflow-x-auto">
                      Li ＞ K ＞ Ca ＞ Na ＞ Mg ＞ Al ＞ Zn ＞ Fe ＞ Ni ＞ Sn ＞ Pb ＞ (H₂) ＞ Cu ＞ Hg ＞ Ag ＞ Pt ＞ Au
                    </div>
                  </div>

                  <div className="bg-[#F9E79F]/30 p-4 rounded-xl border border-[#FDFBF7]">
                    <div className="text-xs font-bold text-amber-700 mb-1">💡 イオン化傾向の代表的語呂合わせ</div>
                    <p className="font-handwriting text-base text-[#1D3557] leading-relaxed">
                      「<b>り（Li） っ（K） ち（Ca）に（Na）貸そ（Ca・Na） か（K）な（Na）</b>、<b>ま（Mg） あ（Al） ぁ（Zn） て（Fe）</b>に（Ni）<b>する（Sn）な（Pb）</b>、<b>ひ（H₂） ど（Cu）す（Hg）ぎ（Ag）借（Pt）金（Au）</b>」
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

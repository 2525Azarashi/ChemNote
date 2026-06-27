import React, { useState } from 'react';
import { X, TrendingUp, ChevronDown, ChevronUp, BarChart2, BookOpen, Star, AlertCircle } from 'lucide-react';
import { overallTrend, chapterTrends, rotationAnalysis } from '../data/trendData';

interface TrendModalProps {
  onClose: () => void;
  // chapterGroupTitle: 特定の章の傾向を表示する場合に指定。undefinedなら全体総括。
  // unitId: 特定の小単元を表示する場合に指定。
  targetChapterGroupTitle?: string;
  targetUnitId?: string;
}

export function TrendModal({ onClose, targetChapterGroupTitle, targetUnitId }: TrendModalProps) {
  const [activeTab, setActiveTab] = useState<'overall' | 'chapter' | 'rotation'>('overall');
  const [expandedUnit, setExpandedUnit] = useState<string | null>(targetUnitId || null);

  // ターゲットの章を探す
  const targetChapter = targetChapterGroupTitle
    ? chapterTrends.find(c => c.chapterGroupTitle === targetChapterGroupTitle)
    : null;

  // 特定章・単元が指定されている場合はその章タブを初期表示
  React.useEffect(() => {
    if (targetChapterGroupTitle) {
      setActiveTab('chapter');
    }
  }, [targetChapterGroupTitle]);

  const getPredictionColor = (prediction: string) => {
    if (prediction.startsWith('◎')) return 'text-red-600 bg-red-50 border-red-200';
    if (prediction.startsWith('○')) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm p-2 md:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-[#F4D03F]" />
            <div>
              <h2 className="text-lg md:text-xl font-bold font-handwriting">
                {targetChapterGroupTitle
                  ? `${targetChapterGroupTitle} 共通テスト出題傾向`
                  : '共通テスト出題傾向分析（過去11年）'}
              </h2>
              <p className="text-xs text-white/70 font-handwriting">2016〜2026年 共通テスト・センター試験</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* タブ */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overall')}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold font-handwriting whitespace-nowrap transition-colors ${activeTab === 'overall' ? 'text-[#2C3E50] border-b-2 border-[#2C3E50] bg-white' : 'text-gray-500 hover:text-[#2C3E50]'}`}
          >
            <BarChart2 className="w-4 h-4" />
            全体総括
          </button>
          <button
            onClick={() => setActiveTab('chapter')}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold font-handwriting whitespace-nowrap transition-colors ${activeTab === 'chapter' ? 'text-[#2C3E50] border-b-2 border-[#2C3E50] bg-white' : 'text-gray-500 hover:text-[#2C3E50]'}`}
          >
            <BookOpen className="w-4 h-4" />
            章・単元別
          </button>
          <button
            onClick={() => setActiveTab('rotation')}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold font-handwriting whitespace-nowrap transition-colors ${activeTab === 'rotation' ? 'text-[#2C3E50] border-b-2 border-[#2C3E50] bg-white' : 'text-gray-500 hover:text-[#2C3E50]'}`}
          >
            <Star className="w-4 h-4" />
            2027年予想
          </button>
        </div>

        {/* コンテンツ */}
        <div className="overflow-y-auto max-h-[70vh] p-4 md:p-6">

          {/* ========== 全体総括タブ ========== */}
          {activeTab === 'overall' && (
            <div className="space-y-6">
              {/* 年度別一覧 */}
              <div>
                <h3 className="text-base font-bold text-[#2C3E50] font-handwriting mb-3 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#A9CCE3]" />
                  大問構成・分量の推移（一覧表）
                </h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-xs font-handwriting">
                    <thead>
                      <tr className="bg-[#2C3E50] text-white">
                        <th className="p-2 text-left font-bold">年度</th>
                        <th className="p-2 text-center font-bold">区分</th>
                        <th className="p-2 text-center font-bold">小問数</th>
                        <th className="p-2 text-left font-bold">主な構成の特徴</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overallTrend.yearlyOverview.map((row, i) => (
                        <tr key={row.year} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-2 font-bold text-[#2C3E50]">{row.year}</td>
                          <td className={`p-2 text-center font-bold ${row.type === '共通テスト' ? 'text-blue-600' : 'text-gray-600'}`}>
                            {row.type === '共通テスト' ? '共通' : 'センター'}
                          </td>
                          <td className="p-2 text-center">{row.subQuestions}</td>
                          <td className="p-2 text-gray-700 leading-relaxed">{row.feature}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3つの大きなトレンド */}
              <div>
                <h3 className="text-base font-bold text-[#2C3E50] font-handwriting mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D9A0A0]" />
                  大きく見える3つのトレンド
                </h3>
                <div className="space-y-3">
                  {overallTrend.bigTrends.map((trend, i) => (
                    <div key={i} className="bg-gradient-to-r from-[#FDFBF7] to-white border border-[#D9A0A0]/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#D9A0A0] text-white flex items-center justify-center text-sm font-bold shrink-0 font-handwriting">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#2C3E50] text-sm font-handwriting mb-1">{trend.title}</h4>
                          <p className="text-xs text-gray-700 font-handwriting leading-relaxed">{trend.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2027年第1問予想 */}
              <div>
                <h3 className="text-base font-bold text-[#2C3E50] font-handwriting mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#F4D03F]" />
                  2027年共通テスト 予想構成
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
                  <p className="text-xs font-bold text-amber-800 font-handwriting mb-3">【第1問】小問集合 9〜10問</p>
                  <div className="space-y-2">
                    {overallTrend.exam2027Structure.q1.map((item) => (
                      <div key={item.no} className="flex items-start gap-2">
                        <span className="text-xs font-bold text-amber-700 font-handwriting shrink-0 w-6">問{item.no}</span>
                        <p className="text-xs text-gray-700 font-handwriting flex-1">{item.theme}</p>
                        <span className={`text-xs font-bold font-handwriting px-2 py-0.5 rounded-full shrink-0 ${
                          item.probability.startsWith('◎') || parseInt(item.probability) >= 80
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>{item.probability}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-800 font-handwriting mb-2">【第2問】テーマ型総合問題 6〜9問 ★予想テーマ候補★</p>
                  <ul className="space-y-1">
                    {overallTrend.exam2027Structure.q2Candidates.map((c, i) => (
                      <li key={i} className="text-xs text-gray-700 font-handwriting flex items-start gap-1.5">
                        <span className="text-blue-500 shrink-0">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 平均点 */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-700 font-handwriting mb-2">平均点・難易度の推移（参考）</h4>
                <div className="flex gap-3 flex-wrap">
                  {overallTrend.averageScores.map((s) => (
                    <div key={s.year} className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-handwriting">
                      <span className="font-bold text-[#2C3E50]">{s.year}年：</span>
                      <span className="text-gray-600">{s.score}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 font-handwriting mt-2">共通テスト化以降、平均点は概ね25〜30点の間で安定。「8割以上が壁」と評されるのが定型化しており、その壁の正体は第2問のグラフ・表読解と複合計算である。</p>
              </div>
            </div>
          )}

          {/* ========== 章・単元別タブ ========== */}
          {activeTab === 'chapter' && (
            <div className="space-y-6">
              {(targetChapter ? [targetChapter] : chapterTrends).map((chapter) => (
                <div key={chapter.chapterGroupTitle} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* 章ヘッダー */}
                  <div className="bg-gradient-to-r from-[#A9CCE3]/30 to-[#A9CCE3]/10 p-4 border-b border-gray-200">
                    <h3 className="text-base font-bold text-[#2C3E50] font-handwriting mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#A9CCE3]" />
                      {chapter.chapterGroupTitle}【章まとめ・総括】
                    </h3>
                    <p className="text-xs text-gray-700 font-handwriting leading-relaxed">{chapter.summary}</p>
                  </div>

                  {/* 小単元一覧 */}
                  <div className="divide-y divide-gray-100">
                    {chapter.units.map((unit) => {
                      const isExpanded = expandedUnit === unit.id;
                      const isTarget = unit.id === targetUnitId;
                      return (
                        <div key={unit.id} className={`${isTarget ? 'bg-yellow-50' : 'bg-white'}`}>
                          <button
                            onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
                            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {isTarget && (
                                <span className="text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-handwriting">この単元</span>
                              )}
                              <span className="text-sm font-bold text-[#2C3E50] font-handwriting">{unit.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 font-handwriting hidden md:block">{unit.frequency.split('（')[0]}</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 space-y-4">
                              {/* 出題実績 */}
                              <div>
                                <h5 className="text-xs font-bold text-[#A9CCE3] font-handwriting mb-1">📅 出題実績（年度・頻度）</h5>
                                <p className="text-xs text-gray-600 font-handwriting leading-relaxed bg-blue-50 border border-blue-100 rounded-lg p-2">{unit.frequency}</p>
                                <p className="text-xs text-gray-700 font-handwriting leading-relaxed mt-1">{unit.yearsAppeared}</p>
                              </div>

                              {/* 出題タイプ */}
                              <div>
                                <h5 className="text-xs font-bold text-[#D9A0A0] font-handwriting mb-1">📝 具体的な出題タイプ</h5>
                                <ul className="space-y-1">
                                  {unit.examTypes.map((t, i) => (
                                    <li key={i} className="text-xs text-gray-700 font-handwriting flex items-start gap-1.5">
                                      <span className="text-[#D9A0A0] shrink-0">•</span>
                                      <span>{t}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* 必要な武器 */}
                              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                                <h5 className="text-xs font-bold text-green-700 font-handwriting mb-2">⚔️ 必要な武器（知識・概念）</h5>
                                <ul className="space-y-1">
                                  {unit.weapons.map((w, i) => (
                                    <li key={i} className="text-xs text-gray-700 font-handwriting flex items-start gap-1.5">
                                      <span className="text-green-500 shrink-0">✓</span>
                                      <span>{w}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* 演習意識ポイント */}
                              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                <h5 className="text-xs font-bold text-amber-700 font-handwriting mb-1">⚡ 演習時の意識ポイント</h5>
                                <p className="text-xs text-gray-700 font-handwriting leading-relaxed">{unit.studyPoints}</p>
                              </div>

                              {/* 2027予想 */}
                              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                <h5 className="text-xs font-bold text-red-700 font-handwriting mb-1">🎯 2027年予想</h5>
                                <p className="text-xs text-gray-700 font-handwriting leading-relaxed">{unit.prediction2027}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========== 2027年予想タブ ========== */}
          {activeTab === 'rotation' && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <h3 className="text-sm font-bold text-red-700 font-handwriting">ローテーション分析と2027年出題予想度</h3>
                </div>
                <p className="text-xs text-gray-600 font-handwriting">11年分のデータを並べると、出題テーマには明確な周期性・代替性がある。重要テーマは1〜3年おきに必ず再登場する。</p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-xs font-handwriting">
                  <thead>
                    <tr className="bg-[#2C3E50] text-white">
                      <th className="p-2 text-left font-bold">テーマ</th>
                      <th className="p-2 text-center font-bold">周期</th>
                      <th className="p-2 text-left font-bold">2027予想度</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rotationAnalysis.map((row, i) => (
                      <tr key={row.theme} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-2">
                          <div className="font-bold text-[#2C3E50]">{row.theme}</div>
                          <div className="text-gray-400 text-[10px] mt-0.5">{row.years}</div>
                        </td>
                        <td className="p-2 text-center text-gray-600">{row.cycle}</td>
                        <td className="p-2">
                          <span className={`inline-block text-xs font-bold px-2 py-1 rounded-lg border font-handwriting ${getPredictionColor(row.prediction)}`}>
                            {row.prediction}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* センター→共通テストへの変化 */}
              <div>
                <h3 className="text-sm font-bold text-[#2C3E50] font-handwriting mb-3">センター → 共通テストへの変化（重要）</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-xs font-handwriting">
                    <thead>
                      <tr className="bg-[#2C3E50] text-white">
                        <th className="p-2 text-left font-bold">観点</th>
                        <th className="p-2 text-left font-bold">センター（〜2020）</th>
                        <th className="p-2 text-left font-bold">共通テスト（2021〜）</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["大問構成", "第1問・第2問とも小問集合（独立7問×2）", "第1問=小問集合10問前後／第2問=1テーマ総合問題6〜9問"],
                        ["小問数", "13〜15問", "13〜19問（2025は最多）"],
                        ["1問あたり配点", "ほぼ均等（3〜4点）", "重い問題は4〜5点、軽い問題は2点と差がある"],
                        ["問題の長さ", "1問あたり3〜5行", "リード文＋実験操作＋表＋グラフで1テーマ1〜2ページ"],
                        ["図表の量", "1〜2題", "毎回4〜6か所（グラフ・装置図・分子モデル・表）"],
                        ["計算の複雑度", "一段階計算が多い", "多段階／グラフ読み取りからの逆算／文字式での一般化"],
                        ["テーマ性", "なし（純粋な単元別）", "あり（蒸留・宇宙・科学史・肥料・しょうゆなど）"],
                        ["求められる力", "知識＋計算技能", "知識＋計算技能＋資料読解＋現象解釈＋複合的思考"],
                      ].map(([aspect, center, kyotsuu], i) => (
                        <tr key={aspect} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-2 font-bold text-[#2C3E50] whitespace-nowrap">{aspect}</td>
                          <td className="p-2 text-gray-600">{center}</td>
                          <td className="p-2 text-blue-700 font-bold">{kyotsuu}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 最終メッセージ */}
              <div className="bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white rounded-xl p-5">
                <h3 className="text-sm font-bold font-handwriting mb-3">受験生への最終メッセージ</h3>
                <p className="text-xs font-handwriting leading-relaxed text-white/90 mb-2">
                  共通テスト化学基礎で安定して8割以上を取るには、以下の3つの力が不可欠である：
                </p>
                <ul className="space-y-2">
                  {[
                    "①【知識の正確さ】どんなに思考型でも、6章すべての基本用語・反応・公式を「即答できる反射神経」がベース。特に『電子配置20元素』『イオン化列』『代表的酸塩基』『指示薬の変色域』『主要反応式』は完全暗記。",
                    "②【計算の単位追跡】molを起点として、g・L・粒子数・mol/L・%への双方向変換を機械的にこなす。物質量と化学反応式が最重要章。",
                    "③【グラフ・表の読解力】グラフを見たら必ず「軸・単位・傾き・プラトー・交点」の5点をチェックする習慣。プラトーは『片方が尽きた限界点』、傾きは『反応の量的比』を表すと即座に解釈できる訓練を。"
                  ].map((msg, i) => (
                    <li key={i} className="text-xs font-handwriting text-white/90 flex items-start gap-2">
                      <span className="text-[#F4D03F] shrink-0">★</span>
                      <span>{msg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#2C3E50] text-white rounded-xl font-bold font-handwriting text-sm hover:bg-[#1B2631] transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

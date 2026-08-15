import React, { useEffect, useState } from 'react';
import { Target, BookOpen, ArrowLeft, FileText, TrendingUp, FlaskConical } from 'lucide-react';
import { TrendModal } from './TrendModal';
import { chemistryBasicTrendDataset } from '../data/trendData';
import { chemistryAdvancedTrendDataset } from '../data/chemistryAdvancedTrendData';
import { MntbLogo } from './MntbLogo';
import { DoorMascot } from './DoorMascot';
import { subjectTheme } from '../data/subjectTheme';

interface ModeSelectionProps {
  onSelectMode: (mode: 'mini_test' | 'practice' | 'learning') => void;
  onBack: () => void;
  onMockExam?: () => void;
  /** 選択中の科目。省略時は従来どおり化学基礎として振る舞う。 */
  subject?: 'chemistry_basic' | 'chemistry' | 'english_listening';
}

export function ModeSelection({ onSelectMode, onBack, onMockExam, subject = 'chemistry_basic' }: ModeSelectionProps) {
  /**
   * 化学（発展）では、化学基礎専用の 2027年度予想問題はまだ用意していないので隠す。
   * 化学基礎側の表示は一切変えない。
   *
   * 「学習(インプット)」と「出題傾向」は例外で、化学でも
   * まとめプリントと過去15年（本試＋追試）の分析を公開済みなので両方の科目で表示する。
   */
  const isAdvanced = subject === 'chemistry';
  /**
   * 英語リスニングはまず大問（単元）だけを公開した段階なので、
   * まとめプリント（学習インプット）・出題傾向・予想問題はまだ無い。
   * 空の画面へ連れていかないよう、「演習問題」だけを出す（カードの見た目は他科目と同じ）。
   */
  const isListening = subject === 'english_listening';
  /**
   * 科目ごとの配色。
   * この画面はどの科目でも同じダスティローズで描かれていたため、
   * 「今どの科目のモードを選んでいるのか」が見た目から分からなかった。
   * 演習問題カードのアクセントを科目色にして区別できるようにする。
   */
  const theme = subjectTheme(subject);
  const [showOverallTrend, setShowOverallTrend] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="w-full notebook-paper rounded-2xl p-6 md:p-12 min-h-[60vh] flex flex-col items-center justify-center relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-gray-500 hover:text-[#2C3E50] transition-colors font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={20} />
          <span>戻る</span>
        </button>

        {/* Logo（従来の mntb を模したインラインロゴ） */}
        <MntbLogo size="sm" className="absolute top-4 right-4 md:top-6 md:right-6 z-30" />

        <div className="flex items-center gap-2 mb-8 md:mb-12 mt-12 md:mt-0">
          <DoorMascot subject={subject} showSpeech={false} size="mini" className="w-auto" />
          <h2 className="text-2xl md:text-4xl font-handwriting font-bold text-[#2C3E50]">
            学習モードを選択
          </h2>
        </div>

        <div className={`grid grid-cols-1 gap-6 w-full ${isListening ? 'max-w-md' : 'max-w-3xl md:grid-cols-2'}`}>
          {/* 学習(インプット)ボタン（化学基礎・化学の両方。リスニングは未収録） */}
          {!isListening && (
          <button
            onClick={() => onSelectMode('learning')}
            className="group bg-white p-6 md:p-8 rounded-2xl shadow-md border-2 border-transparent hover:border-[#F4D03F] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#F4D03F]/20 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
              <FileText className="text-[#F4D03F] w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-handwriting text-[#2C3E50] mb-3 md:mb-4">学習(インプット)</h3>
            <p className="text-sm md:text-base text-gray-600 font-handwriting leading-relaxed">
              {isAdvanced
                ? 'まとめプリントで基礎知識をしっかりと身につけます。（現在は理論化学「化学反応とエネルギー」を公開中）'
                : '基礎知識をしっかりと身につけます。'}
            </p>
          </button>
          )}

          {/* 演習問題ボタン */}
          <button
            onClick={() => onSelectMode('practice')}
            className="group bg-white p-6 md:p-8 rounded-2xl shadow-md border-2 border-transparent hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1"
            /* hover の枠線色は科目ごとに変わるため、Tailwind ではなく直接指定する
               （クラス名を動的に組み立てると JIT がクラスを生成できない） */
            style={{ borderColor: 'transparent' }}
            onMouseEnter={(event) => { event.currentTarget.style.borderColor = theme.accent; }}
            onMouseLeave={(event) => { event.currentTarget.style.borderColor = 'transparent'; }}
            onFocus={(event) => { event.currentTarget.style.borderColor = theme.accent; }}
            onBlur={(event) => { event.currentTarget.style.borderColor = 'transparent'; }}
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${theme.accentSoft}55` }}
            >
              <BookOpen className="w-8 h-8 md:w-10 md:h-10" style={{ color: theme.accent }} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-handwriting text-[#2C3E50] mb-3 md:mb-4">演習問題</h3>
            <p className="text-sm md:text-base text-gray-600 font-handwriting leading-relaxed">
              {isListening
                ? '第1問〜第6問の大問別に単元を選んで取り組みます。'
                : 'より実践的な問題に取り組みます。応用力を身につけたい場合におすすめです。'}
            </p>
          </button>
        </div>

        {/* 化学（発展）で準備中のコンテンツがあることを明示する。 */}
        {isAdvanced && (
          <p className="mt-6 text-xs md:text-sm text-gray-500 font-handwriting text-center max-w-3xl">
            ※「出題傾向」「予想問題」は化学基礎のみ対応です。化学の「学習(インプット)」は順次章を追加していきます。
          </p>
        )}

        {/* 英語リスニングで準備中のコンテンツがあることを明示する。 */}
        {isListening && (
          <p className="mt-6 text-xs md:text-sm text-gray-500 font-handwriting text-center max-w-3xl">
            ※ まずは大問（第1問〜第6問）の単元を公開しています。問題・音声・「学習(インプット)」は順次追加していきます。
          </p>
        )}

        {/* 演習問題ボタンの下に追加ボタンを配置（化学基礎・化学） */}
        {(subject === 'chemistry_basic' || isAdvanced) && (
        <div className="w-full max-w-3xl mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 全体出題傾向ボタン */}
          <button
            onClick={() => setShowOverallTrend(true)}
            className="group bg-gradient-to-r from-[#2C3E50] to-[#34495E] text-white p-4 rounded-2xl shadow-md border-2 border-transparent hover:shadow-xl transition-all duration-300 flex items-center gap-4 transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <TrendingUp className="text-[#F4D03F] w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold font-handwriting">共通テスト出題傾向</h3>
              <p className="text-xs text-white/70 font-handwriting leading-relaxed">
                {isAdvanced
                  ? '過去15年（2012〜2026年・本試＋追試）の全体分析・2027予想'
                  : '過去11年（2016〜2026年）の全体分析・2027予想'}
              </p>
            </div>
          </button>

          {/* 2027年予想問題ボタン（化学基礎のみ） */}
          {onMockExam && !isAdvanced && (
            <button
              onClick={onMockExam}
              className="group bg-gradient-to-r from-[#D9A0A0] to-[#C0847E] text-white p-4 rounded-2xl shadow-md border-2 border-transparent hover:shadow-xl transition-all duration-300 flex items-center gap-4 transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <FlaskConical className="text-white w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-sm md:text-base font-bold font-handwriting leading-tight">2027年度 共通テスト化学基礎予想問題</h3>
                <p className="text-xs text-white/70 font-handwriting leading-relaxed">オリジナル予想問題（解説付き）</p>
              </div>
            </button>
          )}
        </div>
        )}
      </div>

      {/* 全体出題傾向モーダル */}
      {showOverallTrend && (
        <TrendModal
          onClose={() => setShowOverallTrend(false)}
          dataset={isAdvanced ? chemistryAdvancedTrendDataset : chemistryBasicTrendDataset}
        />
      )}
    </>
  );
}

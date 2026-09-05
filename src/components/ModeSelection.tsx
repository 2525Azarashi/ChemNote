import React, { useEffect, useState } from 'react';
import { BookOpen, ArrowLeft, FileText, TrendingUp, FlaskConical, Swords, ArrowRight } from 'lucide-react';
import { TrendModal } from './TrendModal';
import { chemistryBasicTrendDataset } from '../data/trendData';
import { chemistryAdvancedTrendDataset } from '../data/chemistryAdvancedTrendData';
import { MntbLogo } from './MntbLogo';
import { DoorMascot } from './DoorMascot';
import { subjectTheme } from '../data/subjectTheme';
// 教科IDの型は data/allChapters.ts の SubjectKey が唯一の定義
import type { SubjectKey } from '../data/allChapters';

interface ModeSelectionProps {
  onSelectMode: (mode: 'mini_test' | 'practice' | 'learning') => void;
  onBack: () => void;
  onMockExam?: () => void;
  /** 選択中の科目。省略時は従来どおり化学基礎として振る舞う。 */
  subject?: SubjectKey;
  /**
   * オンライン対戦を開く。
   *
   * ★この画面に対戦の席を作った理由★
   *   利用者の指示「オンラインをメインにするUIにしていかんとだめよね？」
   *   「対戦画面は他のところでしているのでそこまでのところはすべて変えて」
   *
   *   この画面は下部ナビの「学習」を押すと必ず来る場所で、
   *   ★対戦という語が1文字も無かった★。
   *   モードは「学習(インプット)」と「演習問題」の2枚だけで、
   *   ここまで来た人には対戦が存在しないように見えていた。
   *
   * ★任意（省略可）にしている★
   *   FEATURES.battle が false のときは App 側から渡さない。
   *   渡されなければ席ごと描かないので、
   *   「見えるのに入れない」を作らない。
   */
  onBattle?: () => void;
}

export function ModeSelection({ onSelectMode, onBack, onMockExam, subject = 'chemistry_basic', onBattle }: ModeSelectionProps) {
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
   * 数学は「学習(インプット)＝まとめプリント」と「演習問題」の2つを公開する。
   * 出題傾向・予想問題は化学基礎・化学専用なので出さない。
   */
  const isMath = subject === 'math';
  const isBiology = subject === 'biology_basic';
  /**
   * 英文法は「単元別の4択演習」として公開している。
   * まとめプリント（学習インプット）・出題傾向・予想問題は未収録なので、
   * リスニングと同じように「演習問題」だけを出す（空の画面へ連れていかない）。
   */
  const isGrammar = subject === 'english_grammar';
  /**
   * 地理総合・地理探究は第1問〜第3問の演習（単元演習5回＋模試7回ぶん）を
   * 公開した段階。
   * まとめプリント（学習インプット）・出題傾向・予想問題は未収録なので、
   * リスニング・英文法と同じく「演習問題」だけを出す（空の画面へ連れていかない）。
   */
  const isGeography = subject === 'geography';
  /** まとめプリントを持たない科目（学習カードを隠す） */
  const hideLearning = isListening || isGrammar || isGeography;
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
      {/*
        ★スマホで内部スクロールできる箱にする（PC は従来のまま）★

        従来は min-h-[60vh] の「伸びるだけの箱」で、中身（実測 842px）が
        見える高さ（664 − ナビ81 ＝ 583px）を超えると
        はみ出した分がそのまま下部ナビの裏に潜り込んでいた。
        ＝ ご指摘の「演習問題の説明文が途中で切れる」。

        max-h-full＋overflow-y-auto で、超えた分はこの箱の中で
        スクロールさせる（ページ全体は動かさない）。
        末尾に pb-app-nav を置いて、最後の要素が固定ナビの裏に
        残らないようにする。
        sm 以上は max-h-none で従来の見た目に戻す。
      */}
      <div className="w-full notebook-paper rounded-2xl p-4 sm:p-6 md:p-12 min-h-0 sm:min-h-[60vh] max-h-full sm:max-h-none overflow-y-auto sm:overflow-visible pb-app-nav sm:pb-6 md:pb-12 flex flex-col items-center justify-start sm:justify-center relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-gray-500 hover:text-[#2C3E50] transition-colors font-bold bg-white/80 px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={20} />
          <span>戻る</span>
        </button>

        {/* Logo（従来の mntb を模したインラインロゴ） */}
        <MntbLogo size="sm" className="absolute top-4 right-4 md:top-6 md:right-6 z-30" />

        {/* mt-12 は絶対配置の「戻る」ボタンを避けるための逃げ。
            スマホでは mt-11 まで詰め、下の余白も 8 → 4 に半減させる
            （タイトル周りは1画面化で最も削りやすい場所）。 */}
        <div className="flex items-center gap-2 mb-4 md:mb-12 mt-11 md:mt-0">
          <DoorMascot subject={subject} showSpeech={false} size="mini" className="w-auto" />
          <h2 className="text-2xl md:text-4xl font-handwriting font-bold text-[#2C3E50]">
            学習モードを選択
          </h2>
        </div>

        {/* =====================================================================
            オンライン対戦（★モードカードより先に置く★）
            =====================================================================

            ★ここに置いた理由★
              この画面は下部ナビの「学習」から必ず来る場所。
              対戦を思い立った人が学習の側に迷い込んだとき、
              ★ホームまで戻らずに対戦へ移れる★ようにする。

            ★モードカードより「上」だが「小さい」★
              この画面の目的は学習モードを選ぶことなので、
              主役は下の2枚（学習(インプット)／演習問題）のまま。
              対戦は横1行の帯にして、順番だけ先にした。
              ホーム（Home.tsx）では対戦が主役の大きさ、
              ここでは案内の大きさ。場所ごとに主従を変えている。

            ★学習のカードは1枚も消していない★
              利用者の指示「でも問題をなくすとかはダメだよ」。
              学習(インプット)・演習問題・出題傾向・予想問題は
              すべて元のまま、文言も変えていない。 */}
        {onBattle && (
          <button
            onClick={onBattle}
            aria-label="オンライン対戦を開く"
            className="battle-sheen relative overflow-hidden w-full max-w-3xl mb-3 md:mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#3D9BD9] to-[#2E86C1] px-4 py-3 md:px-6 md:py-4 text-white shadow-[0_12px_28px_-12px_rgba(46,134,193,0.7)] transition-colors hover:from-[#3691D2] hover:to-[#2678AF] min-h-[48px]"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Swords className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <h3 className="text-base md:text-xl font-bold font-handwriting leading-tight">オンライン対戦</h3>
              <p className="text-[11px] md:text-sm text-white/80 font-handwriting leading-snug truncate">
                友だちと1対1で早解き・全国とレート戦
              </p>
            </div>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white/70 shrink-0" aria-hidden="true" />
          </button>
        )}

        <div className={`grid grid-cols-1 gap-3 md:gap-6 w-full ${hideLearning ? 'max-w-md' : 'max-w-3xl md:grid-cols-2'}`}>
          {/* 学習(インプット)ボタン（化学基礎・化学の両方。リスニング・英文法は未収録） */}
          {!hideLearning && (
          <button
            onClick={() => onSelectMode('learning')}
            /* ★スマホは横並び1行、md以上は従来の縦積み中央寄せ★
               縦積みだと 1枚 195px＋218px で400px超になり、
               タイトルと合わせて画面に収まらない。 */
            className="group bg-white p-3.5 md:p-8 rounded-2xl shadow-md border-2 border-transparent hover:border-[#F4D03F] hover:shadow-xl transition-all duration-300 flex flex-row md:flex-col items-center text-left md:text-center gap-3 md:gap-0 transform hover:-translate-y-1"
          >
            <div className="w-11 h-11 md:w-20 md:h-20 bg-[#F4D03F]/20 rounded-full flex items-center justify-center shrink-0 mb-0 md:mb-6 group-hover:scale-110 transition-transform">
              <FileText className="text-[#F4D03F] w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div className="min-w-0 md:contents">
            <h3 className="text-base md:text-2xl font-bold font-handwriting text-[#2C3E50] mb-0.5 md:mb-4">学習(インプット)</h3>
            <p className="text-[11px] md:text-base text-gray-600 font-handwriting leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
              {isAdvanced
                ? 'まとめプリントで基礎知識をしっかりと身につけます。（現在は理論化学「化学反応とエネルギー」を公開中）'
                : isMath
                  ? 'まとめプリントで「解法のパターン化」を学びます。積分・ベクトル・確率・整数の4単元、判断フローと型の早見表付き。'
                  : isBiology
                    ? 'まとめプリントで共通テスト生物基礎の全範囲（細胞・遺伝子・体内環境・植生・生態系）を一気に総復習できます。'
                    : '基礎知識をしっかりと身につけます。'}
            </p>
            </div>
          </button>
          )}

          {/* 演習問題ボタン */}
          <button
            onClick={() => onSelectMode('practice')}
            /* 学習カードと同じ理由でスマホは横並び1行にする。
               ★ご指摘の「演習問題の説明文が途中で切れる」当該カード★ */
            className="group bg-white p-3.5 md:p-8 rounded-2xl shadow-md border-2 border-transparent hover:shadow-xl transition-all duration-300 flex flex-row md:flex-col items-center text-left md:text-center gap-3 md:gap-0 transform hover:-translate-y-1"
            /* hover の枠線色は科目ごとに変わるため、Tailwind ではなく直接指定する
               （クラス名を動的に組み立てると JIT がクラスを生成できない） */
            style={{ borderColor: 'transparent' }}
            onMouseEnter={(event) => { event.currentTarget.style.borderColor = theme.accent; }}
            onMouseLeave={(event) => { event.currentTarget.style.borderColor = 'transparent'; }}
            onFocus={(event) => { event.currentTarget.style.borderColor = theme.accent; }}
            onBlur={(event) => { event.currentTarget.style.borderColor = 'transparent'; }}
          >
            <div
              className="w-11 h-11 md:w-20 md:h-20 rounded-full flex items-center justify-center shrink-0 mb-0 md:mb-6 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${theme.accentSoft}55` }}
            >
              <BookOpen className="w-6 h-6 md:w-10 md:h-10" style={{ color: theme.accent }} />
            </div>
            <div className="min-w-0 md:contents">
            <h3 className="text-base md:text-2xl font-bold font-handwriting text-[#2C3E50] mb-0.5 md:mb-4">演習問題</h3>
            <p className="text-[11px] md:text-base text-gray-600 font-handwriting leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
              {isListening
                ? '第1問A・第1問B …のように大問別（A／Bも別）に選び、回ごとに取り組みます。'
                : isGrammar
                ? '文型・時制・準動詞…の単元別に4択を解きます。全問に完成文の音源と誤答肢の理由がつきます。'
                : isGeography
                ? '会話文と資料（気候グラフ・統計表・地形図）を行き来して考える、共通テスト型の大問を回ごとに解きます。'
                : isMath
                  ? '積分・ベクトル・確率・整数の全パターンを、型ごとの小問で演習します。数学記号パレットで ∫ や √ もワンタップ入力。'
                  : 'より実践的な問題に取り組みます。応用力を身につけたい場合におすすめです。'}
            </p>
            </div>
          </button>
        </div>

        {/* 化学（発展）で準備中のコンテンツがあることを明示する。 */}
        {isAdvanced && (
          <p className="mt-3 md:mt-6 text-[10px] md:text-sm text-gray-500 font-handwriting text-center max-w-3xl">
            ※「出題傾向」「予想問題」は化学基礎のみ対応です。化学の「学習(インプット)」は順次章を追加していきます。
          </p>
        )}

        {/* 数学では現在の収録範囲を明示する。 */}
        {isMath && (
          <p className="mt-3 md:mt-6 text-[10px] md:text-sm text-gray-500 font-handwriting text-center max-w-3xl">
            ※ 現在は「数III 積分法」「ベクトル」「場合の数・確率」「整数」の4単元（各全パターン演習）を公開しています。他の単元も順次追加していきます。
          </p>
        )}

        {/* 英語リスニングで準備中のコンテンツがあることを明示する。 */}
        {isListening && (
          <p className="mt-3 md:mt-6 text-[10px] md:text-sm text-gray-500 font-handwriting text-center max-w-3xl">
            ※ まずは大問（第1問A〜第6問B）の単元を公開しています。問題・音声・「学習(インプット)」は順次追加していきます。
          </p>
        )}

        {/* 英文法で準備中のコンテンツを明示する。 */}
        {isGrammar && (
          <p className="mt-3 md:mt-6 text-[10px] md:text-sm text-gray-500 font-handwriting text-center max-w-3xl">
            ※ 全20単元の4択演習（各単元5問）を公開しています。「学習(インプット)」は順次追加していきます。
          </p>
        )}

        {/* 地理で準備中のコンテンツを明示する。
            ★「第2問以降は準備中」と書いてはいけない★
              模擬問題（第1回〜第6回＋予想問題）を入れたことで
              第1問・第2問・第3問がすべて揃った。古い案内文を残すと
              「まだ第1問しか無い」と誤解させてしまう。 */}
        {isGeography && (
          <p className="mt-3 md:mt-6 text-[10px] md:text-sm text-gray-500 font-handwriting text-center max-w-3xl">
            ※ 第1問〜第3問の演習を公開しています（単元演習5回＋模試7回ぶん・全26単元）。第4問以降と「学習(インプット)」は順次追加していきます。
          </p>
        )}

        {/* 演習問題ボタンの下に追加ボタンを配置（化学基礎・化学） */}
        {(subject === 'chemistry_basic' || isAdvanced) && (
        <div className="w-full max-w-3xl mt-3 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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

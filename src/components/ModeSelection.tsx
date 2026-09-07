import React, { useEffect, useState } from 'react';
import { BookOpen, ArrowLeft, FileText, TrendingUp, FlaskConical, Swords, ArrowRight } from 'lucide-react';
import { TrendModal } from './TrendModal';
import { chemistryBasicTrendDataset } from '../data/trendData';
import { chemistryAdvancedTrendDataset } from '../data/chemistryAdvancedTrendData';
import { labelOfSubject } from '../data/subjectLabels';
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
      <div className="mtb-page mode-desk w-full min-h-0 max-h-full overflow-y-auto pb-app-nav" style={{ '--subject-accent': theme.accent, '--subject-soft': theme.accentSoft } as React.CSSProperties}>
        <header className="mtb-page-header">
          <button type="button" onClick={onBack} className="mtb-back" aria-label="ホームに戻る"><ArrowLeft size={19} aria-hidden="true" /><span>ホーム</span></button>
          <span className="mtb-kicker">STUDY ROOM</span>
          <DoorMascot subject={subject} showSpeech={false} size="mini" />
        </header>
        <div className="mode-heading">
          <p className="mtb-kicker">今日の学びを、明日の自信に。</p>
          <h1>{labelOfSubject(subject)}</h1>
          <p>学習モードを選択</p>
        </div>
        {onBattle && (
          <button type="button" onClick={onBattle} aria-label="オンライン対戦を開く" className="mode-battle-bridge">
            <Swords size={18} aria-hidden="true" /><span>対戦ロビーへ<small>友だちと1対1で早解き・全国とレート戦</small></span><ArrowRight size={16} aria-hidden="true" />
          </button>
        )}
        <div className={`mode-workspace ${hideLearning ? 'mode-workspace-solo' : ''}`}>
          <section className="mode-practice-stage" aria-labelledby="mode-practice-title">
            <div className="mode-practice-art" aria-hidden="true"><span>TRY</span><BookOpen /><i>01</i></div>
            <div className="mode-practice-copy">
              <span className="mtb-kicker">知識を、使える力に</span>
              <h2 id="mode-practice-title">演習問題</h2>
              <p>{isListening
                ? '第1問A・第1問B …のように大問別（A／Bも別）に選び、回ごとに取り組みます。'
                : isGrammar
                ? '文型・時制・準動詞…の単元別に4択を解きます。全問に完成文の音源と誤答肢の理由がつきます。'
                : isGeography
                ? '会話文と資料（気候グラフ・統計表・地形図）を行き来して考える、共通テスト型の大問を回ごとに解きます。'
                : isMath
                  ? '積分・ベクトル・確率・整数の全パターンを、型ごとの小問で演習します。数学記号パレットで ∫ や √ もワンタップ入力。'
                  : 'より実践的な問題に取り組みます。応用力を身につけたい場合におすすめです。'}</p>
            </div>
            <button type="button" onClick={() => onSelectMode('practice')} className="mode-primary" aria-label="演習問題の単元を選ぶ"><span>演習問題をはじめる</span><ArrowRight size={21} aria-hidden="true" /></button>
          </section>
          {!hideLearning && (
            <button type="button" onClick={() => onSelectMode('learning')} className="mode-input-paper" aria-label="学習(インプット)を開く">
              <span className="mode-page-tab">READ</span><FileText size={34} aria-hidden="true" />
              <h2>学習(インプット)</h2><span className="mode-input-subtitle">まとめプリント</span>
              <p>{isAdvanced
                ? 'まとめプリントで基礎知識をしっかりと身につけます。（現在は理論化学「化学反応とエネルギー」を公開中）'
                : isMath
                  ? 'まとめプリントで「解法のパターン化」を学びます。積分・ベクトル・確率・整数の4単元、判断フローと型の早見表付き。'
                  : isBiology
                    ? 'まとめプリントで共通テスト生物基礎の全範囲（細胞・遺伝子・体内環境・植生・生態系）を一気に総復習できます。'
                    : '基礎知識をしっかりと身につけます。'}</p>
              <span className="mode-input-open">ノートをひらく <ArrowRight size={18} aria-hidden="true" /></span>
            </button>
          )}
        </div>
        {(subject === 'chemistry_basic' || isAdvanced) && (
          <section className="mode-tools" aria-label="試験対策のツール">
            <p className="mtb-section-label">試験前の、もうひと準備</p>
            <div>
              <button type="button" onClick={() => setShowOverallTrend(true)} className="mtb-round-link">
                <span><TrendingUp size={24} aria-hidden="true" /></span><strong>共通テスト出題傾向</strong>
                <small>{isAdvanced ? '過去15年・本試＋追試' : '過去11年の全体分析'}<br />2027年の出題を予想</small>
              </button>
              {onMockExam && !isAdvanced && (
                <button type="button" onClick={onMockExam} className="mtb-round-link">
                  <span><FlaskConical size={24} aria-hidden="true" /></span><strong>2027年度 予想問題</strong>
                  <small>共通テスト化学基礎<br />オリジナル問題・解説付き</small>
                </button>
              )}
            </div>
          </section>
        )}
        <p className="mode-footnote">{hideLearning ? 'この科目は演習問題を公開中です。学習(インプット)は順次追加予定です。' : '読む → 解く → 振り返る。自分に合った入口から始めましょう。'}</p>
      </div>
      {showOverallTrend && <TrendModal onClose={() => setShowOverallTrend(false)} dataset={isAdvanced ? chemistryAdvancedTrendDataset : chemistryBasicTrendDataset} />}
    </>
  );
}

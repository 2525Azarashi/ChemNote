/**
 * ===================================================================
 * 科目選択画面（＝アプリのタイトル画面）
 * ===================================================================
 * ログイン（オンボーディング）直後に最初に表示される画面。
 *
 * 役割は2つ:
 *  1. アプリの「顔」＝タイトル画面（ロゴ・キャッチコピー・世界観の提示）
 *  2. 学習する科目の選択（化学基礎／化学／英語リスニング／数学／生物基礎）
 *
 * 設計方針
 *  - Home.tsx と同じ淡いピンク基調（#D9466E / #E8688E / #FBE0E9 / #FDFBF7）と
 *    ノート罫線＋桜の世界観をそのまま引き継ぎ、「別アプリ感」を出さない。
 *  - 科目カードは「今すぐ入れる科目」と「準備中の科目」を一目で区別できるよう、
 *    色・影・カーソル・バッジ・aria-disabled を明確に変える。
 *  - 準備中の科目を押しても行き止まりにせず、
 *    「公開されたら知りたい」意思をフィードバック機能に接続して回収する。
 *
 * 1画面グリッドにした理由（カルーセルからの変更）
 *  - 以前は横スクロールのカルーセルだったが、科目が5つに増えると
 *    「隠れている科目」が生まれ、スワイプしないと全体が見えなかった。
 *  - 全科目を一望して選べることが科目選択画面の本質なので、
 *    **すべての科目カードが1つの画面に並ぶグリッド**に変更した。
 *  - スマホ＝1カラム（縦スクロール）、md以上＝2カラム、lg以上＝3カラム。
 *    カードは従来より少しコンパクトにし、1画面あたりの情報量を保つ。
 *  - カードはボタンなので Tab で順に到達できる。全カードのタップ領域は
 *    44px 以上を確保。
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Lock,
  Sparkles,
  BookOpen,
  FlaskConical,
  Headphones,
  Calculator,
  Leaf,
  Bell,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import { auth } from '../firebase';
import { MntbLogo } from './MntbLogo';
import { SakuraPetals } from './SakuraPetals';
import { NotebookScenery } from './NotebookScenery';
import { FeedbackModal } from './FeedbackModal';
import { GoogleLinkBanner } from './GoogleLinkBanner';
import { chemistryData } from '../data/chemistryData';
import { getAllAdvancedChapters } from '../data/chemistryAdvancedData';
import { getListeningStats } from '../data/englishListeningData';
import { getMathStats } from '../data/mathData';

/** アプリが扱う科目の識別子 */
export type SubjectId = 'chemistry_basic' | 'chemistry' | 'english_listening' | 'math' | 'biology_basic';

/** 科目ID → 画面に出す科目名（App 側のバッジ表示などでも使う） */
export const SUBJECT_LABELS: Record<SubjectId, string> = {
  chemistry_basic: '化学基礎',
  chemistry: '化学',
  english_listening: '英語リスニング',
  math: '数学',
  biology_basic: '生物基礎',
};

/** 未知の値が入っていても安全に科目名を引く */
export function getSubjectLabel(id: string | null | undefined): string {
  return SUBJECT_LABELS[(id || '') as SubjectId] || SUBJECT_LABELS.chemistry_basic;
}

/** 保存済みの科目ID が今の定義に存在するか */
export function isSubjectId(value: string | null | undefined): value is SubjectId {
  return Boolean(value && value in SUBJECT_LABELS);
}

interface SubjectDefinition {
  id: SubjectId;
  /** カードの主タイトル */
  title: string;
  /** 主タイトルの下に出す英字（デザイン用の添え字） */
  latin: string;
  /** 1行の説明 */
  description: string;
  /** カード内に並べる収録内容のハイライト */
  highlights: string[];
  /** 選択できるか（false なら「準備中」表示） */
  available: boolean;
  /** カードのアイコン */
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

interface SubjectSelectionProps {
  /** 科目を選んだとき */
  onSelectSubject: (subject: SubjectId) => void;
  /** ゲスト利用中かどうか（挨拶の出し分けに使う） */
  isGuest: boolean;
  /**
   * ホームから「学習を始める」で来たときだけ渡される。
   * オンボーディング直後（＝戻る先が無い）ときは undefined のままにして、
   * 行き止まりにならないよう戻るボタン自体を出さない。
   */
  onBack?: () => void;
}

export function SubjectSelection({ onSelectSubject, isGuest, onBack }: SubjectSelectionProps) {
  /**
   * 「公開されたら知らせて」モーダルで、どの科目が押されたかを覚えておく。
   * 以前は文面が「化学」固定だったため、科目が増えると誤った案内になってしまう。
   */
  const [notifySubject, setNotifySubject] = useState<SubjectDefinition | null>(null);

  /** 表示名（プロフィール → Firebase 表示名 → ゲスト の順で解決） */
  const displayName = useMemo(() => {
    try {
      const uid = auth.currentUser?.uid || 'guest';
      const raw = localStorage.getItem(`profile_${uid}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) return String(parsed.name);
      }
    } catch {
      /* localStorage が使えない環境は表示名なしで続行 */
    }
    return auth.currentUser?.displayName || (isGuest ? 'ゲスト' : 'ユーザー');
  }, [isGuest]);

  /** 化学基礎の収録ボリューム（数字をハードコードせずデータから算出する） */
  const basicStats = useMemo(() => {
    const chapters = chemistryData.parts.flatMap((p: any) => p.chapters);
    let questions = 0;
    chapters.forEach((c: any) => {
      questions += (c.practiceProblems || []).length + (c.miniTest || []).length;
    });
    return { chapters: chapters.length, questions };
  }, []);

  /** 化学（発展）の収録ボリューム。問題は順次追加するため、単元数だけ先に表示する。 */
  const advancedStats = useMemo(() => {
    const chapters = getAllAdvancedChapters();
    let questions = 0;
    chapters.forEach((c) => {
      questions += (c.practiceProblems || []).length + (c.miniTest || []).length;
    });
    return { chapters: chapters.length, questions };
  }, []);

  /**
   * 英語リスニングの収録ボリューム。
   * 化学（発展）と同じやり方で、まずは大問（単元）だけを公開し、
   * 問題は順次追加していく。数字はデータから算出する。
   */
  const listeningStats = useMemo(() => getListeningStats(), []);

  /** 数学の収録ボリューム。まずは数III積分（全パターン演習）から公開する。 */
  const mathStats = useMemo(() => getMathStats(), []);

  const subjects: SubjectDefinition[] = useMemo(() => [
    {
      id: 'chemistry_basic',
      title: '化学基礎',
      latin: 'Basic Chemistry',
      description: '共通テスト「化学基礎」を、教科書の順番どおりに完全網羅。',
      highlights: [
        `全${basicStats.chapters}単元・演習${basicStats.questions}問を収録`,
        '出題傾向データ（2016〜2026年）に完全対応',
        'ロジックツリー・模擬試験・復習リスト対応',
      ],
      available: true,
      icon: BookOpen,
    },
    {
      id: 'chemistry',
      title: '化学',
      latin: 'Chemistry',
      description: '理論・無機・有機を、教科書の順番どおりに配置。単元から選んで学習できます。',
      highlights: [
        `全${advancedStats.chapters}単元を教科書順で収録（問題は順次追加中）`,
        '理論化学・無機化学・有機化学を分野別に選択',
        '化学基礎と同じ単元画面・同じ演習の進め方',
      ],
      available: true,
      icon: FlaskConical,
    },
    {
      id: 'english_listening',
      title: '英語リスニング',
      latin: 'English Listening',
      description: '共通テスト「英語リスニング」を、本試験と同じ大問の並びで配置。',
      highlights: [
        `第1問A〜第6問Bの全${listeningStats.units}単元を本試験順で収録（問題は順次追加中）`,
        `配点${listeningStats.points}点・マーク${listeningStats.marks}個の大問構成に対応`,
        '化学と同じ単元画面・同じ演習の進め方',
      ],
      available: true,
      icon: Headphones,
    },
    {
      id: 'math',
      title: '数学',
      latin: 'Mathematics',
      description: '数III「積分法」を全パターン網羅。見た瞬間に解法が浮かぶ状態を作ります。',
      highlights: [
        `積分${mathStats.chapters}単元・演習${mathStats.questions}問を収録（順次追加中）`,
        '15パターン判断フローのまとめプリント付き',
        '数学記号パレットで ∫・√・π もワンタップ入力',
      ],
      available: true,
      icon: Calculator,
    },
    {
      id: 'biology_basic',
      title: '生物基礎',
      latin: 'Basic Biology',
      description: '共通テスト「生物基礎」。現在、単元と問題を準備しています。',
      highlights: [
        '教科書の順番どおりの単元構成で準備中',
        '化学基礎と同じ演習・復習のしくみに対応予定',
        '公開時にお知らせを受け取れます',
      ],
      available: false,
      icon: Leaf,
    },
  ], [basicStats, advancedStats, listeningStats, mathStats]);

  return (
    <div className="w-full min-h-[100dvh] sm:min-h-0 flex flex-col relative overflow-hidden rounded-none sm:rounded-[32px] bg-gradient-to-b from-[#FFF1F5] via-[#FDFBF7] to-[#F8E7EE]">

      {/* ===== 背景（Home と同じ世界観：ノート罫線＋風景＋桜） ===== */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: 'linear-gradient(transparent calc(2.5rem - 1px), #F0C7D2 calc(2.5rem - 1px))',
          backgroundSize: '100% 2.5rem',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 pointer-events-none opacity-5 fabric-texture" aria-hidden="true" />
      <NotebookScenery />
      <SakuraPetals count={40} />

      {/* ===== ホームへ戻る（ホームの「学習を始める」から来たときだけ） =====
          オンボーディング直後は戻る先が無いので表示しない。 */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="ホームに戻る"
          className="absolute top-4 left-4 sm:top-5 sm:left-5 z-30 flex items-center gap-1.5 rounded-full border border-[#F4A9C4]/70 bg-white/95 px-3.5 py-2 text-[12px] font-bold text-[#D9466E] shadow-[0_8px_20px_-10px_rgba(217,70,110,0.5)] backdrop-blur-sm transition-all hover:bg-white hover:border-[#E8688E] active:scale-95 min-h-[44px] cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="font-modern">ホーム</span>
        </button>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-5 sm:px-8 md:px-12 pt-10 sm:pt-12 md:pt-14 relative z-10 flex flex-col">

        {/* ===== タイトル（アプリの顔） ===== */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-7 md:mb-9"
        >
          {/* ロゴのみを大きく置く。
              以前はロゴの下に「まなとび」「まなびの、とびらを開こう」の
              文字を重ねていたが、ロゴ自体がアプリ名を表しており冗長なため撤去した。 */}
          <div className="flex justify-center">
            <MntbLogo size="hero" />
          </div>

          <p className="mt-5 text-[13px] sm:text-sm text-[#5D6D7E] font-modern leading-relaxed">
            ようこそ、<span className="font-bold text-[#1B2631]">{displayName}</span>さん。<br className="sm:hidden" />
            学習する科目を選んでください。
          </p>
        </motion.header>

        {/* ===== Googleアカウント連携のおすすめ（ゲスト利用中のみ） ===== */}
        {isGuest && <GoogleLinkBanner />}

        {/* ===== 科目カード（1画面グリッド：全科目を一望して選ぶ） =====
            スマホ＝1カラム／md＝2カラム／lg＝3カラム。
            カルーセルと違い、隠れている科目が無い。 */}
        <div className="relative max-w-6xl w-full mx-auto">
          <div
            role="group"
            aria-label="学習する科目を選択"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          >
          {subjects.map((subject, index) => {
            const Icon = subject.icon;
            const handleClick = () => {
              if (subject.available) onSelectSubject(subject.id);
              else setNotifySubject(subject);
            };

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + index * 0.07 }}
                data-subject-card
                className="w-full"
              >
                <button
                  onClick={handleClick}
                  aria-label={
                    subject.available
                      ? `${subject.title}を学習する`
                      : `${subject.title}は準備中です。公開のお知らせを希望する`
                  }
                  className={`group relative w-full h-full text-left rounded-[22px] p-5 md:p-6 border transition-all duration-200 overflow-hidden min-h-[210px] flex flex-col ${
                    subject.available
                      ? 'bg-white/92 backdrop-blur-sm border-[#F4A9C4]/55 shadow-[0_16px_38px_-18px_rgba(217,70,110,0.55)] hover:border-[#E8688E] hover:shadow-[0_22px_46px_-18px_rgba(217,70,110,0.62)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.995]'
                      : 'bg-[#F7F5F3]/85 backdrop-blur-sm border-[#D7DDE3]/70 shadow-none hover:border-[#B8C4CE] hover:bg-[#F2F0EE]/90'
                  }`}
                >
                  {/* 利用可能カードだけ、上端にアクセントの帯を引く */}
                  {subject.available && (
                    <span
                      className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E8688E] via-[#D9466E] to-[#E89AAF]"
                      aria-hidden="true"
                    />
                  )}

                  {/* 右上のステータスバッジ */}
                  <span
                    className={`absolute top-4 right-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold font-modern tracking-wider ${
                      subject.available
                        ? 'bg-[#FBE0E9] text-[#D9466E]'
                        : 'bg-[#E4E8EC] text-[#8895A0]'
                    }`}
                  >
                    {subject.available
                      ? (<><Sparkles className="w-3 h-3" aria-hidden="true" />公開中</>)
                      : (<><Lock className="w-3 h-3" aria-hidden="true" />準備中</>)}
                  </span>

                  {/* アイコン＋タイトル（横並びにして縦方向を節約する） */}
                  <div className="flex items-center gap-3 mb-3 mt-1">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                        subject.available
                          ? 'bg-[#FBE0E9] text-[#D9466E] group-hover:scale-105'
                          : 'bg-[#E4E8EC] text-[#8895A0]'
                      }`}
                    >
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h2
                        className={`font-handwriting font-bold text-[22px] md:text-[24px] leading-tight ${
                          subject.available ? 'text-[#1B2631]' : 'text-[#8895A0]'
                        }`}
                      >
                        {subject.title}
                      </h2>
                      <p
                        className={`text-[10px] font-modern tracking-[0.2em] mt-0.5 ${
                          subject.available ? 'text-[#E8688E]' : 'text-[#B8C4CE]'
                        }`}
                      >
                        {subject.latin.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* 説明 */}
                  <p
                    className={`text-xs font-modern leading-relaxed mb-3 ${
                      subject.available ? 'text-[#5D6D7E]' : 'text-[#8895A0]'
                    }`}
                  >
                    {subject.description}
                  </p>

                  {/* 収録ハイライト */}
                  <ul className="space-y-1.5 mb-4">
                    {subject.highlights.map((item) => (
                      <li
                        key={item}
                        className={`flex items-start gap-2 text-[11px] font-modern leading-snug ${
                          subject.available ? 'text-[#5D6D7E]' : 'text-[#A3AEB8]'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-3.5 h-3.5 mt-[1px] shrink-0 ${
                            subject.available ? 'text-[#E8688E]' : 'text-[#C6CFD6]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* フッター行（CTA） */}
                  <div className="mt-auto pt-3 border-t border-dashed border-[#E4E8EC] flex items-center justify-between">
                    <span
                      className={`text-[13px] font-bold font-modern tracking-wide ${
                        subject.available ? 'text-[#D9466E]' : 'text-[#8895A0]'
                      }`}
                    >
                      {subject.available ? 'この科目ではじめる' : '公開のお知らせを受け取る'}
                    </span>
                    {subject.available ? (
                      <ArrowRight
                        className="w-5 h-5 text-[#E8688E] group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    ) : (
                      <Bell className="w-4 h-4 text-[#8895A0]" aria-hidden="true" />
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
          </div>
        </div>

        {/* ===== 補足 ===== */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center text-[11px] text-[#8895A0] font-modern mt-7 leading-relaxed"
        >
          科目はあとから画面下の「ホーム」からいつでも切り替えられます。
        </motion.p>
      </div>

      {/* 準備中の科目を押したときの受け皿（フィードバックとして回収する）
          文面は押された科目名に合わせる（以前は「化学」固定だった）。 */}
      {notifySubject && (
        <FeedbackModal
          screen="title"
          category="request"
          initialMessage={`「${notifySubject.title}」の公開を希望します。`}
          description={`「${notifySubject.title}」は現在準備中です。公開のお知らせ希望や、優先してほしい分野をお聞かせください`}
          context={{ requestedSubject: notifySubject.id, isGuest }}
          onClose={() => setNotifySubject(null)}
        />
      )}
    </div>
  );
}

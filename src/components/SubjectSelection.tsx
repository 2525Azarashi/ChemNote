/**
 * ===================================================================
 * 科目選択画面（＝アプリのタイトル画面）
 * ===================================================================
 * ログイン（オンボーディング）直後に最初に表示される画面。
 *
 * 役割は2つ:
 *  1. アプリの「顔」＝タイトル画面（ロゴ・キャッチコピー・世界観の提示）
 *  2. 学習する科目の選択（化学基礎／化学）
 *
 * 設計方針
 *  - Home.tsx と同じ淡いピンク基調（#D9466E / #E8688E / #FBE0E9 / #FDFBF7）と
 *    ノート罫線＋桜の世界観をそのまま引き継ぎ、「別アプリ感」を出さない。
 *  - 科目カードは「今すぐ入れる科目」と「準備中の科目」を一目で区別できるよう、
 *    色・影・カーソル・バッジ・aria-disabled を明確に変える。
 *  - 準備中の科目を押しても行き止まりにせず、
 *    「公開されたら知りたい」意思をフィードバック機能に接続して回収する。
 *  - スマホ 1 カラム / タブレット以上 2 カラム。全カードはタップ領域 44px 以上を確保。
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Lock, Sparkles, BookOpen, FlaskConical, Bell, CheckCircle2 } from 'lucide-react';
import { auth } from '../firebase';
import { MntbLogo } from './MntbLogo';
import { SakuraPetals } from './SakuraPetals';
import { NotebookScenery } from './NotebookScenery';
import { FeedbackModal } from './FeedbackModal';
import { chemistryData } from '../data/chemistryData';

/** アプリが扱う科目の識別子 */
export type SubjectId = 'chemistry_basic' | 'chemistry';

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
  /** 科目を選んだとき（現状は化学基礎のみ遷移する） */
  onSelectSubject: (subject: SubjectId) => void;
  /** ゲスト利用中かどうか（挨拶の出し分けに使う） */
  isGuest: boolean;
}

export function SubjectSelection({ onSelectSubject, isGuest }: SubjectSelectionProps) {
  /** 「公開されたら知らせて」モーダルの開閉 */
  const [notifyOpen, setNotifyOpen] = useState(false);

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
      description: '理論・無機・有機を扱う「化学」。現在、鋭意制作中です。',
      highlights: [
        '理論化学（気体・溶液・平衡・反応速度）',
        '無機化学（各元素の系統的性質）',
        '有機化学（構造決定・高分子）',
      ],
      available: false,
      icon: FlaskConical,
    },
  ], [basicStats]);

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

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-5 sm:px-8 md:px-12 pt-10 sm:pt-12 md:pt-14 relative z-10 flex flex-col justify-center">

        {/* ===== タイトル（アプリの顔） ===== */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="flex justify-center mb-4">
            <MntbLogo />
          </div>

          <h1 className="font-handwriting font-bold text-[#1B2631] tracking-wide text-[30px] sm:text-[38px] md:text-[46px] leading-tight">
            まなとび
          </h1>

          {/* 装飾ライン（左右の細線で挟んだキャッチコピー） */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-px w-8 sm:w-14 bg-gradient-to-r from-transparent to-[#F4A9C4]" aria-hidden="true" />
            <p className="text-[11px] sm:text-[13px] font-modern tracking-[0.25em] text-[#D9466E] font-bold whitespace-nowrap">
              まなびの、とびらを開こう
            </p>
            <span className="h-px w-8 sm:w-14 bg-gradient-to-l from-transparent to-[#F4A9C4]" aria-hidden="true" />
          </div>

          <p className="mt-5 text-[13px] sm:text-sm text-[#5D6D7E] font-modern leading-relaxed">
            ようこそ、<span className="font-bold text-[#1B2631]">{displayName}</span>さん。<br className="sm:hidden" />
            学習する科目を選んでください。
          </p>
        </motion.header>

        {/* ===== 科目カード ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-4xl w-full mx-auto">
          {subjects.map((subject, index) => {
            const Icon = subject.icon;
            const handleClick = () => {
              if (subject.available) onSelectSubject(subject.id);
              else setNotifyOpen(true);
            };

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 + index * 0.1 }}
              >
                <button
                  onClick={handleClick}
                  aria-label={
                    subject.available
                      ? `${subject.title}を学習する`
                      : `${subject.title}は準備中です。公開のお知らせを希望する`
                  }
                  className={`group relative w-full h-full text-left rounded-[24px] p-6 md:p-7 border transition-all duration-200 overflow-hidden min-h-[248px] flex flex-col ${
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
                    className={`absolute top-5 right-5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold font-modern tracking-wider ${
                      subject.available
                        ? 'bg-[#FBE0E9] text-[#D9466E]'
                        : 'bg-[#E4E8EC] text-[#8895A0]'
                    }`}
                  >
                    {subject.available
                      ? (<><Sparkles className="w-3 h-3" aria-hidden="true" />公開中</>)
                      : (<><Lock className="w-3 h-3" aria-hidden="true" />準備中</>)}
                  </span>

                  {/* アイコン */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mb-4 mt-1 transition-transform ${
                      subject.available
                        ? 'bg-[#FBE0E9] text-[#D9466E] group-hover:scale-105'
                        : 'bg-[#E4E8EC] text-[#8895A0]'
                    }`}
                  >
                    <Icon className="w-7 h-7" aria-hidden="true" />
                  </div>

                  {/* タイトル */}
                  <h2
                    className={`font-handwriting font-bold text-[26px] md:text-[30px] leading-tight ${
                      subject.available ? 'text-[#1B2631]' : 'text-[#8895A0]'
                    }`}
                  >
                    {subject.title}
                  </h2>
                  <p
                    className={`text-[10px] font-modern tracking-[0.22em] mt-1 mb-3 ${
                      subject.available ? 'text-[#E8688E]' : 'text-[#B8C4CE]'
                    }`}
                  >
                    {subject.latin.toUpperCase()}
                  </p>

                  {/* 説明 */}
                  <p
                    className={`text-xs md:text-[13px] font-modern leading-relaxed mb-4 ${
                      subject.available ? 'text-[#5D6D7E]' : 'text-[#8895A0]'
                    }`}
                  >
                    {subject.description}
                  </p>

                  {/* 収録ハイライト */}
                  <ul className="space-y-1.5 mb-5">
                    {subject.highlights.map((item) => (
                      <li
                        key={item}
                        className={`flex items-start gap-2 text-[11px] md:text-xs font-modern leading-snug ${
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

      {/* 準備中の科目を押したときの受け皿（フィードバックとして回収する） */}
      {notifyOpen && (
        <FeedbackModal
          screen="title"
          category="request"
          initialMessage="「化学」の公開を希望します。"
          description="「化学」は現在準備中です。公開のお知らせ希望や、優先してほしい分野をお聞かせください"
          context={{ requestedSubject: 'chemistry', isGuest }}
          onClose={() => setNotifyOpen(false)}
        />
      )}
    </div>
  );
}

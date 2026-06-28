import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, ChevronRight, Edit3, ArrowRight, CalendarDays, BarChart3, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { chemistryData } from '../data/chemistryData';
import { SakuraPetals } from './SakuraPetals';
import { getDaysUntilExam, EXAM_DATE_LABEL } from '../utils/examCountdown';
import { MntbLogo } from './MntbLogo';
import { DoorMascot } from './DoorMascot';

interface HomeProps {
  onStart: () => void;
  onIntro: () => void;
  onNoteList: () => void;
  onLogicalTree: () => void;
  onLeaderboard?: () => void;
  isGuest: boolean;
}

export function Home({ onStart, onIntro, onNoteList, onLogicalTree, onLeaderboard, isGuest }: HomeProps) {
  const [profile, setProfile] = useState<any>(null);

  // Real stats state
  const [streak, setStreak] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // 問題数ベースの進捗
  const allChaptersList = useMemo(() => chemistryData.parts.flatMap((p: any) => p.chapters), []);
  const totalQuestions = useMemo(() => {
    return allChaptersList.reduce((sum: number, c: any) => {
      const qs = c.miniTest || [];
      return sum + qs.reduce((s: number, q: any) => s + (q.subQuestions?.length || 0), 0);
    }, 0);
  }, [allChaptersList]);
  const [solvedQuestions, setSolvedQuestions] = useState(0);

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const uid = auth.currentUser ? auth.currentUser.uid : 'guest';

        // Load Profile Name/Details
        const localProfile = localStorage.getItem(`profile_${uid}`);
        if (localProfile) {
          setProfile(JSON.parse(localProfile));
        } else {
          setProfile({ name: auth.currentUser ? (auth.currentUser.displayName || 'ユーザー') : 'ゲスト' });
        }

        // Calculate streak
        const lastActive = localStorage.getItem(`lastActive_${uid}`);
        const storedStreak = parseInt(localStorage.getItem(`streak_${uid}`) || '0', 10);

        const today = new Date().toDateString();
        if (lastActive === today) {
          setStreak(storedStreak);
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastActive === yesterday.toDateString()) {
            const newStreak = storedStreak + 1;
            setStreak(newStreak);
            localStorage.setItem(`streak_${uid}`, newStreak.toString());
            localStorage.setItem(`lastActive_${uid}`, today);
          } else {
            setStreak(1);
            localStorage.setItem(`streak_${uid}`, '1');
            localStorage.setItem(`lastActive_${uid}`, today);
          }
        }

        // 解いた問題数をカウント（quiz_answers_${chapterId}_mini_test から）
        let solved = 0;
        allChaptersList.forEach((c: any) => {
          try {
            const raw = localStorage.getItem(`quiz_answers_${c.id}_mini_test`);
            if (raw) {
              const answersObj = JSON.parse(raw);
              solved += Object.keys(answersObj).length;
            }
          } catch {}
        });
        setSolvedQuestions(Math.min(solved, totalQuestions));

        // completed chapters（次の章を求めるために継続利用）
        const completed = JSON.parse(localStorage.getItem(`completed_${uid}`) || '[]');
        setCompletedIds(completed);

      } catch (error) {
        console.error("プロフィール・統計情報取得エラー:", error);
      }
    };

    fetchProfileAndStats();
  }, [isGuest, allChaptersList, totalQuestions]);

  const todayStr = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
  const todayFormatted = todayStr.replace(/\//g, '.');

  // 共通テストまでの残り日数
  const daysUntilExam = useMemo(() => getDaysUntilExam(), []);

  const progressPercent = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;

  // 「次の章」を算出（学習進捗カードの状況別コピー用）
  const nextChapter = useMemo(() => {
    return allChaptersList.find((c: any) => !completedIds.includes(c.id)) as any;
  }, [completedIds, allChaptersList]);

  // 「次のマイルストーン」を算出（連続学習カード用）
  const nextMilestone = useMemo(() => {
    const milestones = [3, 7, 14, 30, 60, 100];
    const target = milestones.find(m => m > streak);
    if (!target) return null;
    return { target, remaining: target - streak };
  }, [streak]);

  const greetingName = profile?.name || 'ゲスト';

  return (
    // タイトル画面：他ページと馴染む淡いピンク基調＋ノート罫線の柔らかい背景を全面に広げる
    <div className="w-full min-h-[100dvh] sm:min-h-0 flex flex-col relative overflow-hidden rounded-none sm:rounded-[32px] bg-gradient-to-b from-[#FFF1F5] via-[#FDFBF7] to-[#F8E7EE]">

      {/* 背景：うっすらノート罫線（手書き風の余韻を残す） */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.18]"
        style={{
          backgroundImage: 'linear-gradient(transparent calc(2.5rem - 1px), #F0C7D2 calc(2.5rem - 1px))',
          backgroundSize: '100% 2.5rem',
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-5 fabric-texture"></div>
      {/* 桜を降らせる装飾 */}
      <SakuraPetals count={20} />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-5 sm:px-8 md:px-12 pt-6 md:pt-8 relative z-10">

        {/* ===== トップバー：左上ロゴ ＋ 右上の情報 ===== */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-7 md:mb-8"
        >
          {/* 左上ロゴ（従来の mntb を模したロゴ） */}
          <MntbLogo />
        </motion.div>

        {/* ===== 挨拶 ＋ カウントダウン ===== */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-7 md:mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="font-handwriting">
            <h1 className="text-[22px] md:text-[30px] text-[#1B2631] font-bold tracking-wide">
              おかえり、{greetingName}さん
            </h1>
            <p className="text-xs md:text-sm text-[#5D6D7E] mt-1.5 font-modern tracking-wider">{todayFormatted}</p>
          </motion.div>

          {/* 共通テストまでのカウントダウンカード（空色テーマ） */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="self-start md:self-auto shrink-0"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-[20px] px-5 py-4 shadow-[0_10px_26px_-12px_rgba(46,134,222,0.5)] border border-[#A9CCE3]/50 flex items-center gap-4 min-w-[210px]">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-widest text-[#5D6D7E] font-modern">共通テストまで</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl md:text-4xl font-bold font-handwriting text-[#2E86DE] leading-none tabular-nums">{daysUntilExam}</span>
                  <span className="text-sm font-modern font-bold text-[#2E86DE]">日</span>
                </div>
                <span className="text-[10px] text-[#8895A0] font-modern mt-1 tracking-wide">{EXAM_DATE_LABEL}</span>
              </div>
              <div className="ml-auto w-11 h-11 rounded-2xl bg-[#E3F0FB] flex items-center justify-center shrink-0">
                <CalendarDays className="w-6 h-6 text-[#4FA3F0]" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== メインカード群 ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">

          {/* 連続学習カード（とびら君マスコット＋化学豆知識付き） */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="bg-white/90 backdrop-blur-sm rounded-[20px] p-5 md:p-6 shadow-[0_10px_26px_-14px_rgba(46,134,222,0.45)] border border-[#A9CCE3]/40 relative overflow-hidden h-full flex items-center gap-3">
              <div className="flex flex-col gap-1 w-full min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-widest text-[#1B2631] font-modern">連続学習</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-5xl md:text-6xl font-bold font-handwriting text-[#2E86DE]">{streak}</span>
                  <span className="text-sm font-modern text-[#1B2631] font-medium">{streak > 0 ? '日連続' : '日目'}</span>
                </div>
                {nextMilestone && (
                  <div className="mt-3 pt-3 border-t border-[#A9CCE3]/30">
                    <p className="text-[11px] md:text-xs text-[#5D6D7E] font-modern tracking-wide leading-snug">
                      <span className="opacity-80">次のマイルストーン：</span>
                      <span className="font-bold text-[#1B2631]">{nextMilestone.target}日連続</span>
                      <span className="opacity-80">まであと</span>
                      <span className="font-bold text-[#1B2631]"> {nextMilestone.remaining}日</span>
                    </p>
                    {/* マイルストーン進捗バー */}
                    <div className="w-full bg-[#E3F0FB] rounded-full h-1.5 mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (streak / nextMilestone.target) * 100)}%` }}
                        transition={{ duration: 0.9, delay: 0.4 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#4FA3F0] to-[#2E86DE]"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* とびら君マスコット：開くたびにランダムなキャラクターと豆知識を表示 */}
              <DoorMascot className="hidden lg:flex self-end -mb-2 -mr-2 shrink-0" />
            </div>
          </motion.div>

          {/* 学習進捗カード */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <div className="border border-[#A9CCE3]/40 rounded-[20px] p-5 md:p-6 bg-white/90 backdrop-blur-sm shadow-[0_10px_26px_-14px_rgba(46,134,222,0.45)] h-full flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-[16px] mb-3 text-[#1B2631] font-modern flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#4FA3F0]" aria-hidden="true" />
                  学習進捗
                </h2>
                {solvedQuestions === 0 ? (
                  <>
                    <p className="text-xs md:text-sm text-[#5D6D7E] font-modern leading-relaxed mb-3">
                      各単元の問題を解くことで進捗が自動的に記録されます。すべての問題を解いて、化学基礎を完全攻略しましょう！
                    </p>
                    <button
                      onClick={onStart}
                      className="inline-flex items-center gap-1.5 text-[13px] md:text-sm font-bold font-modern text-[#1B2631] hover:text-[#2E86DE] transition-colors mb-6 group"
                    >
                      まず第1章から始めよう
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <p className="text-xs md:text-sm text-[#5D6D7E] font-modern leading-relaxed mb-6">
                    {solvedQuestions < totalQuestions ? (
                      <>
                        次の章：
                        <button
                          onClick={onStart}
                          className="font-bold text-[#1B2631] hover:text-[#2E86DE] transition-colors underline-offset-4 hover:underline"
                        >
                          {nextChapter ? (nextChapter.abstractTitle || nextChapter.title || nextChapter.id) : '次の章'}
                        </button>
                        {' '}から始めよう
                      </>
                    ) : (
                      <span className="font-bold text-[#1B2631]">全問制覇！おつかれさまでした。</span>
                    )}
                  </p>
                )}
              </div>
              <div>
                <div
                  role="progressbar"
                  aria-label="学習進捗"
                  aria-valuenow={progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuetext={`${solvedQuestions} / ${totalQuestions} 問解答済み（${progressPercent}%）`}
                  className="w-full bg-[#E3F0FB] rounded-full h-2.5 mb-3 overflow-hidden shadow-inner flex-shrink-0"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-[#4FA3F0] to-[#2E86DE] h-full rounded-full"
                  />
                </div>
                <p className="text-[13px] text-[#5D6D7E] font-modern text-right font-medium">{solvedQuestions} / {totalQuestions} 問解答済み ({progressPercent}%)</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== メインCTA：学習を始める（空色グラデのワイドピル） ===== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="mt-6">
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-[#E89AAF] to-[#D98AA0] text-white py-4 md:py-5 px-6 rounded-[20px] font-bold flex items-center justify-between group hover:from-[#E38EA6] hover:to-[#CC7890] transition-colors shadow-[0_12px_28px_-10px_rgba(217,138,160,0.55)] min-h-[60px]"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" aria-hidden="true" />
              <span className="font-modern tracking-widest text-[16px] md:text-[17px]">{solvedQuestions === 0 ? '学習を始める' : '続きから開く'}</span>
            </div>
            <ArrowRight className="w-6 h-6 text-white/70 group-hover:text-white transition-all group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </motion.div>

        {/* ===== セカンダリ：ノートを見る / アプリ紹介（白いカードボタン） ===== */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.45 }} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={onNoteList}
            aria-label="個人ノート一覧を開く"
            className="flex items-center gap-4 px-5 py-4 rounded-[18px] border border-[#A9CCE3]/40 bg-white/90 backdrop-blur-sm hover:bg-[#F4FAFF] hover:border-[#4FA3F0]/50 active:scale-[0.99] transition-all shadow-[0_8px_22px_-14px_rgba(46,134,222,0.4)] text-left group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#E3F0FB] flex items-center justify-center shrink-0">
              <Edit3 className="w-5 h-5 text-[#4FA3F0]" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-handwriting font-bold text-[#1B2631] text-base md:text-lg">ノートを見る</div>
              <div className="text-[11px] md:text-xs text-[#8895A0] font-modern mt-0.5">自分のまとめを確認しよう</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B8C4CE] group-hover:text-[#4FA3F0] group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
          </button>

          <button
            onClick={onIntro}
            aria-label="アプリ紹介を開く"
            className="flex items-center gap-4 px-5 py-4 rounded-[18px] border border-[#A9CCE3]/40 bg-white/90 backdrop-blur-sm hover:bg-[#F4FAFF] hover:border-[#4FA3F0]/50 active:scale-[0.99] transition-all shadow-[0_8px_22px_-14px_rgba(46,134,222,0.4)] text-left group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#E3F0FB] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#4FA3F0]" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-handwriting font-bold text-[#1B2631] text-base md:text-lg">アプリ紹介</div>
              <div className="text-[11px] md:text-xs text-[#8895A0] font-modern mt-0.5">使い方や機能をチェック</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B8C4CE] group-hover:text-[#4FA3F0] group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

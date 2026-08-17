import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, ChevronRight, Edit3, ArrowRight, CalendarDays, BarChart3, ShieldCheck, Repeat2, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { auth } from '../firebase';
import { chemistryData } from '../data/chemistryData';
import { getAllAdvancedChapters } from '../data/chemistryAdvancedData';
import { getAllListeningChapters } from '../data/englishListeningData';
import { SakuraPetals } from './SakuraPetals';
import { NotebookScenery } from './NotebookScenery';
import { getDaysUntilExam, EXAM_DATE_LABEL } from '../utils/examCountdown';
import { getDueCount } from '../utils/reviewList';
import { DoorMascot } from './DoorMascot';
import { FeedbackButton } from './FeedbackButton';
import { GoogleLinkBanner } from './GoogleLinkBanner';
import {
  backfillLegacyProgress,
  countSolvedByChapter,
  countSolvedProblemsIn,
} from '../utils/progress';
import { loadSchoolBrand } from '../utils/classroom';
import { UpdateNoticeModal } from './UpdateNoticeModal';
import { unreadNoticeCount } from '../utils/updateNotices';

interface HomeProps {
  onStart: () => void;
  onIntro: () => void;
  onNoteList: () => void;
  onLogicalTree: () => void;
  onLeaderboard?: () => void;
  onReviewList?: () => void;
  /** 科目選択（タイトル）画面へ戻る */
  onChangeSubject?: () => void;
  /** 現在選択中の科目名（表示用） */
  subjectLabel?: string;
  /** 現在選択中の科目。省略時は従来どおり化学基礎として振る舞う。 */
  subject?: 'chemistry_basic' | 'chemistry' | 'english_listening';
  isGuest: boolean;
}

export function Home({ onStart, onIntro, onNoteList, onLogicalTree, onLeaderboard, onChangeSubject, subjectLabel = '化学基礎', subject = 'chemistry_basic', isGuest }: HomeProps) {
  const reviewDueCount = useMemo(() => {
    const uid = auth.currentUser?.uid || (isGuest ? 'guest' : null);
    return getDueCount(uid);
  }, [isGuest]);
  const [profile, setProfile] = useState<any>(null);

  /**
   * ホワイトレーベル：クラスに参加している生徒には学校名を掲げる。
   *
   * localStorage から同期的に読むのは、起動直後に一瞬だけ
   * 既定ブランドが見えてから学校名に差し替わるチラつきを避けるため。
   * 未参加の生徒（大半）には何も出ない。
   */
  const schoolBrand = useMemo(() => loadSchoolBrand(), []);

  // ===== お知らせ（更新履歴）=====
  // 未読件数は localStorage を見るだけなので同期的に初期化できる。
  // モーダルを閉じたときに 0 件へ更新してバッジを消す。
  const [showNotices, setShowNotices] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => unreadNoticeCount());

  // Real stats state
  const [streak, setStreak] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // ===== 学習進捗（大問ベース） =====
  // 分母：全章の「大問」数（miniTest ＋ practiceProblems）。
  //   以前は miniTest の「小問」数だけを分母にしていたため、
  //   演習（practiceProblems＝大問の大多数）が丸ごと抜け落ちていた。
  // 分子：1点でも獲得した大問の数（utils/progress の台帳を参照）。
  // 科目に応じて集計対象の章を切り替える（化学基礎の振る舞いは従来のまま）。
  const allChaptersList = useMemo(
    () => {
      if (subject === 'chemistry') return getAllAdvancedChapters() as any[];
      if (subject === 'english_listening') return getAllListeningChapters() as any[];
      return chemistryData.parts.flatMap((p: any) => p.chapters) as any[];
    },
    [subject],
  );
  const totalQuestions = useMemo(() => {
    return allChaptersList.reduce((sum: number, c: any) => {
      return sum + (c.miniTest?.length || 0) + (c.practiceProblems?.length || 0);
    }, 0);
  }, [allChaptersList]);
  const [solvedQuestions, setSolvedQuestions] = useState(0);
  /** 章ID → その章で解いた大問数（「次の章」の算出に使う） */
  const [solvedByChapter, setSolvedByChapter] = useState<Record<string, number>>({});

  // ===== 科目ごとの進捗（「何問中何問」を教科別に見せる） =====
  // 従来は選択中の科目の1本だけを表示していたため、
  // 他の科目の進み具合を見るには科目を切り替える必要があった。
  // ここで全科目分をまとめて作り、カード内に並べて出す。
  const subjectProgressDefs = useMemo(
    () => [
      {
        id: 'chemistry_basic' as const,
        label: '化学基礎',
        chapters: chemistryData.parts.flatMap((p: any) => p.chapters) as any[],
      },
      {
        id: 'chemistry' as const,
        label: '化学',
        chapters: getAllAdvancedChapters() as any[],
      },
      {
        id: 'english_listening' as const,
        label: '英語リスニング',
        chapters: getAllListeningChapters() as any[],
      },
    ],
    [],
  );
  /** 科目ID → { solved, total } */
  const [subjectProgress, setSubjectProgress] = useState<
    Record<string, { solved: number; total: number }>
  >({});

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

        // 解いた大問数をカウント（1点でも取れた大問＝進捗）。
        // 初回だけ旧データ（quiz_run_* / quiz_answers_* / completed_*）から引き継ぐ。
        try {
          backfillLegacyProgress(uid, allChaptersList);
        } catch {
          /* 引き継ぎに失敗しても現在の進捗表示は続行する */
        }
        // 選択中の科目の進捗。
        // countSolvedProblems は全科目の合計を返すため、そのまま使うと
        // 「化学基礎 174問中 180問」のように分母を超えることがあった。
        // 対象の章に限って数える countSolvedProblemsIn を使う。
        const currentChapterIds = allChaptersList.map((c: any) => c.id);
        setSolvedQuestions(
          Math.min(countSolvedProblemsIn(uid, currentChapterIds), totalQuestions),
        );
        setSolvedByChapter(countSolvedByChapter(uid));

        // 科目ごとの進捗（教科別に「何問中何問」を並べて出すため）
        const perSubject: Record<string, { solved: number; total: number }> = {};
        subjectProgressDefs.forEach((def) => {
          const total = def.chapters.reduce(
            (sum: number, c: any) =>
              sum + (c.miniTest?.length || 0) + (c.practiceProblems?.length || 0),
            0,
          );
          const solved = Math.min(
            countSolvedProblemsIn(uid, def.chapters.map((c: any) => c.id)),
            total,
          );
          perSubject[def.id] = { solved, total };
        });
        setSubjectProgress(perSubject);

        // completed chapters（次の章を求めるために継続利用）
        const completed = JSON.parse(localStorage.getItem(`completed_${uid}`) || '[]');
        setCompletedIds(completed);

      } catch (error) {
        console.error("プロフィール・統計情報取得エラー:", error);
      }
    };

    fetchProfileAndStats();
  }, [isGuest, allChaptersList, totalQuestions, subjectProgressDefs]);

  const todayStr = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
  const todayFormatted = todayStr.replace(/\//g, '.');

  // 共通テストまでの残り日数
  const daysUntilExam = useMemo(() => getDaysUntilExam(), []);


  // 「次の章」を算出（学習進捗カードの状況別コピー用）
  // 大問をすべて解き終えた章は飛ばし、まだ残っている最初の章を提示する。
  // （completed_ は「ミニテストを通した」履歴でしかなく、
  //   演習の進捗を反映しないため、台帳側の章ごと件数を併せて見る）
  const nextChapter = useMemo(() => {
    const remaining = allChaptersList.find((c: any) => {
      const total = (c.miniTest?.length || 0) + (c.practiceProblems?.length || 0);
      if (total === 0) return false;
      return (solvedByChapter[c.id] || 0) < total;
    }) as any;
    return remaining || (allChaptersList.find((c: any) => !completedIds.includes(c.id)) as any);
  }, [completedIds, allChaptersList, solvedByChapter]);

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
      {/* 背景の手書き風風景：桜の木と遠くの学校（罫線の裏に描く） */}
      <NotebookScenery />
      {/* 桜を降らせる装飾（量を増やして春らしさを強調） */}
      <SakuraPetals count={48} />

      {/* PC（lg以上）ではスクロールせず1画面に収める：縦パディングを詰め、はみ出しを隠す。
          スマホ/タブレットは従来どおり縦スクロール可能。 */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden no-scrollbar pb-32 lg:pb-24 px-5 sm:px-8 md:px-12 pt-6 md:pt-8 lg:pt-6 relative z-10 lg:flex lg:flex-col lg:justify-center">

        {/* ===== 挨拶 ＋ カウントダウン =====
            ※ 左上の「まなとび」ワードマークは表示しない（ユーザー要望）。 */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-7 md:mb-8 lg:mb-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="font-handwriting">
            {/* 学校名（クラスに参加している生徒のみ。学校の教材として見えるようにする） */}
            {schoolBrand && (
              <p className="text-[11px] font-modern font-bold text-[#5D6D7E] tracking-wide mb-1">
                {schoolBrand.schoolName}
              </p>
            )}
            {/* 現在の科目バッジ（タップで科目選択＝タイトル画面へ戻れる導線） */}
            {onChangeSubject && (
              <button
                onClick={onChangeSubject}
                aria-label={`科目を変更する（現在：${subjectLabel}）`}
                className="group inline-flex items-center gap-1.5 mb-2 pl-2.5 pr-2 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-[#F4A9C4]/55 text-[11px] font-modern font-bold text-[#D9466E] hover:bg-white hover:border-[#E8688E] transition-colors min-h-[28px]"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                {subjectLabel}
                <span className="text-[#B8C4CE] group-hover:text-[#E8688E] transition-colors" aria-hidden="true">|</span>
                <Repeat2 className="w-3.5 h-3.5 text-[#8895A0] group-hover:text-[#E8688E] transition-colors" aria-hidden="true" />
              </button>
            )}
            <h1 className="text-[22px] md:text-[30px] text-[#1B2631] font-bold tracking-wide">
              おかえり、{greetingName}さん
            </h1>
            <p className="text-xs md:text-sm text-[#5D6D7E] mt-1.5 font-modern tracking-wider">{todayFormatted}</p>
          </motion.div>

          {/* 共通テストまでのカウントダウンカード（ピンクテーマ）＋ お知らせベル */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="self-start md:self-auto shrink-0 flex items-start gap-2.5"
          >
            {/* ===== お知らせ（更新履歴） =====
                アプリが更新されても、利用者から見ると画面が黙って変わるだけで
                「問題が増えた」「不具合が直った」ことに気づけない。
                ベルを常設し、未読があれば件数を出して気づけるようにする。
                カウントダウンの隣に置くのは、毎回必ず視線が通る位置だから。 */}
            <button
              type="button"
              onClick={() => setShowNotices(true)}
              aria-label={
                unreadCount > 0
                  ? `お知らせを開く（未読 ${unreadCount} 件）`
                  : 'お知らせを開く'
              }
              className="relative flex h-[68px] w-[52px] shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[18px] border border-[#F4A9C4]/50 bg-white/90 shadow-[0_10px_26px_-12px_rgba(217,70,110,0.5)] backdrop-blur-sm transition-colors hover:bg-white"
            >
              <Bell className="h-5 w-5 text-[#E8688E]" aria-hidden="true" />
              <span className="font-modern text-[9px] font-bold tracking-wide text-[#5D6D7E]">
                お知らせ
              </span>
              {unreadCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#D9466E] px-1 text-[10px] font-bold text-white shadow-md"
                  aria-hidden="true"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className="bg-white/90 backdrop-blur-sm rounded-[20px] px-5 py-4 shadow-[0_10px_26px_-12px_rgba(217,70,110,0.5)] border border-[#F4A9C4]/50 flex items-center gap-4 min-w-[210px]">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold tracking-widest text-[#5D6D7E] font-modern">共通テストまで</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl md:text-4xl font-bold font-handwriting text-[#D9466E] leading-none tabular-nums">{daysUntilExam}</span>
                  <span className="text-sm font-modern font-bold text-[#D9466E]">日</span>
                </div>
                <span className="text-[10px] text-[#8895A0] font-modern mt-1 tracking-wide">{EXAM_DATE_LABEL}</span>
              </div>
              <div className="ml-auto w-11 h-11 rounded-2xl bg-[#FBE0E9] flex items-center justify-center shrink-0">
                <CalendarDays className="w-6 h-6 text-[#E8688E]" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== Googleアカウント連携のおすすめ（ゲスト利用中のみ） =====
            ゲストのままだと記録が端末に閉じてしまうため、
            ホームでも一行の細い帯で連携を案内する（×で当面非表示にできる）。 */}
        {isGuest && !auth.currentUser && (
          <div className="mb-5 md:mb-6 lg:mb-4">
            <GoogleLinkBanner variant="inline" dismissible />
          </div>
        )}

        {/* ===== メインカード群 ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 lg:gap-5">

          {/* 連続学習カード（とびら君マスコット＋化学豆知識付き） */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="bg-white/90 backdrop-blur-sm rounded-[20px] p-5 md:p-6 shadow-[0_10px_26px_-14px_rgba(217,70,110,0.45)] border border-[#F4A9C4]/40 relative overflow-hidden h-full flex flex-col">
              {/* 上段：連続日数とマイルストーン */}
              <div className="flex flex-col gap-1 w-full min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-widest text-[#1B2631] font-modern">連続学習</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-5xl md:text-6xl font-bold font-handwriting text-[#D9466E] leading-none">{streak}</span>
                  <span className="text-sm font-modern text-[#1B2631] font-medium">{streak > 0 ? '日連続' : '日目'}</span>
                </div>
                {nextMilestone && (
                  <div className="mt-3 pt-3 border-t border-[#F4A9C4]/30">
                    <p className="text-[11px] md:text-xs text-[#5D6D7E] font-modern tracking-wide leading-snug">
                      <span className="opacity-80">次のマイルストーン：</span>
                      <span className="font-bold text-[#1B2631]">{nextMilestone.target}日連続</span>
                      <span className="opacity-80">まであと</span>
                      <span className="font-bold text-[#1B2631]"> {nextMilestone.remaining}日</span>
                    </p>
                    {/* マイルストーン進捗バー */}
                    <div className="w-full bg-[#FBE0E9] rounded-full h-1.5 mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (streak / nextMilestone.target) * 100)}%` }}
                        transition={{ duration: 0.9, delay: 0.4 }}
                        className="h-full rounded-full bg-gradient-to-r from-[#E8688E] to-[#D9466E]"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* 下段：とびら君マスコット＋豆知識（カード内に収まる横並び）
                  科目を渡して、いま開いている科目の豆知識と配色にする。 */}
              <DoorMascot
                subject={subject}
                showCategory
                className="mt-4 pt-4 border-t border-[#F4A9C4]/25"
              />
            </div>
          </motion.div>

          {/* 学習進捗カード */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <div className="border border-[#F4A9C4]/40 rounded-[20px] p-5 md:p-6 bg-white/90 backdrop-blur-sm shadow-[0_10px_26px_-14px_rgba(217,70,110,0.45)] h-full flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-[16px] mb-3 text-[#1B2631] font-modern flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#E8688E]" aria-hidden="true" />
                  学習進捗
                </h2>
                {solvedQuestions === 0 ? (
                  <>
                    <p className="text-xs md:text-sm text-[#5D6D7E] font-modern leading-relaxed mb-3">
                      各単元の問題を解くと、<span className="font-bold text-[#1B2631]">1点でも取れた大問</span>が進捗として自動的に記録されます。すべての問題を解いて、{subjectLabel}を完全攻略しましょう！
                    </p>
                    <button
                      onClick={onStart}
                      className="inline-flex items-center gap-1.5 text-[13px] md:text-sm font-bold font-modern text-[#1B2631] hover:text-[#D9466E] transition-colors mb-6 group"
                    >
                      まず第1章から始めよう
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <p className="text-xs md:text-sm text-[#5D6D7E] font-modern leading-relaxed mb-6">
                    {solvedQuestions < totalQuestions ? (
                      <>
                        次の章：{/* 未完了の大問が残っている最初の章 */}
                        <button
                          onClick={onStart}
                          className="font-bold text-[#1B2631] hover:text-[#D9466E] transition-colors underline-offset-4 hover:underline"
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
              {/* ===== 教科ごとの進捗 =====
                  以前は選択中の科目1本だけを出していたため、他の科目の
                  進み具合を見るには科目を切り替える必要があった。
                  ここで全科目を縦に並べ、いま選んでいる科目を強調する。
                  単位は「大問」（小問数と混ざらないよう明記する）。 */}
              <div className="space-y-3">
                {subjectProgressDefs.map((def, i) => {
                  const p = subjectProgress[def.id] || { solved: 0, total: 0 };
                  const percent = p.total > 0 ? Math.round((p.solved / p.total) * 100) : 0;
                  const isCurrent = def.id === subject;
                  const isDone = p.total > 0 && p.solved >= p.total;
                  // まだ問題が1問も入っていない科目（化学（発展）は章立てのみ先行実装）。
                  // ここで「大問 0 / 0 問 (0%)」と出すと不具合に見えてしまうため、
                  // 数字ではなく「準備中」と伝える。
                  const isEmpty = p.total === 0;
                  return (
                    <div key={def.id}>
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span
                          className={`font-modern text-[12px] md:text-[13px] flex items-center gap-1.5 ${
                            isCurrent ? 'font-bold text-[#1B2631]' : 'font-medium text-[#7A8894]'
                          }`}
                        >
                          {def.label}
                          {isCurrent && (
                            <span className="rounded-full bg-[#FBE0E9] px-1.5 py-0.5 text-[10px] font-bold text-[#D9466E]">
                              選択中
                            </span>
                          )}
                          {isDone && <span aria-label="全問クリア">🏆</span>}
                        </span>
                        <span
                          className={`font-modern text-[12px] md:text-[13px] tabular-nums ${
                            isEmpty
                              ? 'font-medium text-[#A9B4BE]'
                              : isCurrent
                                ? 'font-bold text-[#1B2631]'
                                : 'font-medium text-[#7A8894]'
                          }`}
                        >
                          {isEmpty ? '問題を準備中' : `大問 ${p.solved} / ${p.total} 問 (${percent}%)`}
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label={`${def.label}の学習進捗`}
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuetext={
                          isEmpty
                            ? `${def.label}：問題を準備中`
                            : `${def.label}：大問 ${p.solved} / ${p.total} 問クリア（${percent}%）`
                        }
                        className={`w-full bg-[#FBE0E9] rounded-full overflow-hidden shadow-inner flex-shrink-0 ${
                          isCurrent && !isEmpty ? 'h-2.5' : 'h-1.5'
                        } ${isEmpty ? 'opacity-60' : ''}`}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.12 }}
                          className={`h-full rounded-full ${
                            isCurrent && !isEmpty
                              ? 'bg-gradient-to-r from-[#E8688E] to-[#D9466E]'
                              : 'bg-[#F0AFC2]'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== メインCTA：学習を始める（空色グラデのワイドピル） ===== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="mt-6 lg:mt-5">
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-[#E89AAF] to-[#D98AA0] text-white py-4 md:py-5 lg:py-3.5 px-6 rounded-[20px] font-bold flex items-center justify-between group hover:from-[#E38EA6] hover:to-[#CC7890] transition-colors shadow-[0_12px_28px_-10px_rgba(217,138,160,0.55)] min-h-[60px] lg:min-h-[54px]"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" aria-hidden="true" />
              <span className="font-modern tracking-widest text-[16px] md:text-[17px]">{solvedQuestions === 0 ? '学習を始める' : '続きから開く'}</span>
            </div>
            <ArrowRight className="w-6 h-6 text-white/70 group-hover:text-white transition-all group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </motion.div>

        {/* ===== セカンダリ：学習ノート（ノート＋復習を統合）/ アプリ紹介 / ご意見 ===== */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.45 }} className="mt-5 lg:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* ノートと復習リストを1つの入口「学習ノート」に統合。今日の復習件数をバッジで提示 */}
          <button
            onClick={onNoteList}
            aria-label={`学習ノートを開く（ノートと復習）${reviewDueCount > 0 ? `。今日の復習${reviewDueCount}件` : ''}`}
            className="flex items-center gap-4 px-5 py-4 lg:py-3 rounded-[18px] border border-[#F4A9C4]/40 bg-white/90 backdrop-blur-sm hover:bg-[#FFF3F7] hover:border-[#E8688E]/50 active:scale-[0.99] transition-all shadow-[0_8px_22px_-14px_rgba(217,70,110,0.4)] text-left group"
          >
            <div className="relative w-11 h-11 lg:w-10 lg:h-10 rounded-2xl bg-[#FBE0E9] flex items-center justify-center shrink-0">
              <Edit3 className="w-5 h-5 text-[#E8688E]" aria-hidden="true" />
              {reviewDueCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#E8688E] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">
                  {reviewDueCount > 99 ? '99+' : reviewDueCount}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-handwriting font-bold text-[#1B2631] text-base md:text-lg">学習ノート</div>
              <div className="text-[11px] md:text-xs text-[#8895A0] font-modern mt-0.5">
                {reviewDueCount > 0 ? `今日の復習が${reviewDueCount}件あります` : 'ノートと復習をまとめて確認'}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B8C4CE] group-hover:text-[#E8688E] group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
          </button>

          <button
            onClick={onIntro}
            aria-label="アプリ紹介を開く"
            className="flex items-center gap-4 px-5 py-4 lg:py-3 rounded-[18px] border border-[#F4A9C4]/40 bg-white/90 backdrop-blur-sm hover:bg-[#FFF3F7] hover:border-[#E8688E]/50 active:scale-[0.99] transition-all shadow-[0_8px_22px_-14px_rgba(217,70,110,0.4)] text-left group"
          >
            <div className="w-11 h-11 lg:w-10 lg:h-10 rounded-2xl bg-[#FBE0E9] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#E8688E]" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-handwriting font-bold text-[#1B2631] text-base md:text-lg">アプリ紹介</div>
              <div className="text-[11px] md:text-xs text-[#8895A0] font-modern mt-0.5">使い方や機能をチェック</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B8C4CE] group-hover:text-[#E8688E] group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
          </button>

          {/* ご意見・ご要望（タイトル画面からの意見収集入口）
              学習ノート／アプリ紹介と同じカード様式に揃え、
              「気づいたときにすぐ書ける」場所として常設する。 */}
          <FeedbackButton
            screen="title"
            variant="card"
            label="ご意見・ご要望"
            subLabel="気づいたことを開発者に伝える"
            description="アプリ全体の使い勝手・ほしい機能など、自由にお書きください"
            context={{ streak, solvedQuestions, totalQuestions, isGuest }}
            className="sm:col-span-2 lg:col-span-1"
          />
        </motion.div>
      </div>

      {/* ===== お知らせ（更新履歴）のモーダル =====
          閉じたときに未読件数を読み直す。モーダル側で既読化しているので、
          ここでは 0 件になったバッジを反映するだけで済む。 */}
      {showNotices && (
        <UpdateNoticeModal
          onClose={() => {
            setShowNotices(false);
            setUnreadCount(unreadNoticeCount());
          }}
        />
      )}
    </div>
  );
}

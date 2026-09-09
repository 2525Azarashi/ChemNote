import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, ChevronRight, Edit3, ArrowRight, BarChart3, ShieldCheck, Repeat2, Bell, Volume2, VolumeX, Swords, Microscope, Flame, Sparkles } from 'lucide-react';
import { auth } from '../firebase';
/*
 * 教科IDの型だけは data/allChapters.ts が唯一の定義。
 *
 * ★必ず `import type` と書くこと（`import { type SubjectKey }` にしないこと）★
 * 後者の書き方だと、型しか使っていなくてもモジュールの解決自体は行われ、
 * バンドラは data/allChapters.ts →（6教科ぶんの教科データ）を
 * 起動時の読み込みに含めてしまう。
 * 実測でも `import { type ... }` のままだと src/data 51 ファイル
 * （約 2.66MB）が読み込まれ、索引にした効果が消えていた。
 * `import type` にすると文ごと消えるので、教科データは読み込まれない。
 */
import type { SubjectKey } from '../data/allChapters';
/*
 * ★ホームは教科データ本体を読まない（軽い索引だけを読む）★
 *
 * ■ 以前の作り
 *   ここで getChaptersOfSubject / SUBJECTS を呼んで章オブジェクトを
 *   そのまま受け取っていた。章オブジェクトには問題文・選択肢・解説が
 *   全部ぶら下がっているため、依存を辿ると起動時に
 *     src/data から 50 ファイル / 2,637,176 バイト
 *   が読み込まれていた。問題を1問足すたびにこの数字が増える。
 *
 * ■ ところがホームは問題文を1文字も表示していない
 *   出しているのは「大問 12 / 174 問」という数字と、
 *   「次の章：○○ から始めよう」という章名だけ。
 *   つまり必要なのは ★章ID・章名・その章の大問数★ の3つだけである。
 *
 * ■ そこで軽い索引に切り替えた
 *   data/chapterIndex.generated.ts は上の3つだけを持つ自動生成ファイルで、
 *   全6教科・162章ぶんで 24,972 バイト（約 1/106）。
 *   中身は章の数ぶんしか無いので、問題を何問足しても大きさは変わらない。
 *   索引が本体とズレていないことは tests/chapterIndex.test.ts が
 *   1件ずつ突き合わせて検査している（再生成を忘れたら落ちる）。
 *
 * ■ 画面の見た目は変えていない
 *   索引のフィールド名（id / title / abstractTitle）は
 *   章オブジェクトのものと同じにしてあるので、描画のコードは元のまま。
 *   数え方も data/problemCount.ts と同一（索引生成時に同じ式で数え、
 *   一致をテストで検査している）。
 *
 * ■ 教科データ本体が必要な処理は1つだけ残っている
 *   旧データからの引き継ぎ（backfillLegacyProgress）は大問の実体が
 *   必要なので索引では代われない。ただしこれは1人につき生涯1回だけの
 *   処理なので、下の useEffect で「まだ引き継いでいない人にだけ」
 *   その場で読み込む形にした（動的 import）。
 */
import {
  SUBJECT_INDEX,
  getChapterIndexOfSubject,
  type ChapterIndexEntry,
} from '../data/chapterIndex.generated';
// 公開/非公開の判断は src/config/features.ts が唯一の出どころ
import { isSubjectEnabled } from '../config/features';
import { SakuraPetals } from './SakuraPetals';
import { NotebookScenery } from './NotebookScenery';
import { getDaysUntilExam, EXAM_DATE_LABEL } from '../utils/examCountdown';
import { getDueCount } from '../utils/reviewList';
import { DoorMascot } from './DoorMascot';
import { FeedbackButton } from './FeedbackButton';
import { FeedbackReplyInbox } from './FeedbackReplyInbox';
import { GoogleLinkBanner } from './GoogleLinkBanner';
import {
  isLegacyProgressBackfilled,
  countSolvedByChapter,
  countSolvedProblemsIn,
} from '../utils/progress';
// ユーザーごとの localStorage キー名は utils/userStorageKeys.ts が唯一の定義
import { profileKey, streakKey, lastActiveKey, completedKey } from '../utils/userStorageKeys';
import { loadSchoolBrand } from '../utils/classroom';
import { UpdateNoticeModal } from './UpdateNoticeModal';
import { unreadNoticeCount } from '../utils/updateNotices';

interface HomeProps {
  onStart: () => void;
  onIntro: () => void;
  onNoteList: () => void;
  onLogicalTree: () => void;
  onLeaderboard?: () => void;
  /** 対戦モードを開く。FEATURES.battle が false のときは渡されない */
  onBattle?: () => void;
  /**
   * 高校入試 理科（演習・まとめ・出題傾向）を開く。
   *
   * ★科目カードではなくホームの入口にした理由★
   *   理科は本体の「章→大問→小問」の形を持っていない。
   *   単元の絞り込みも問題の出し方も理科の画面が自分で持っているので、
   *   科目選択のカードに並べると、押した先で1問も出せない状態になる。
   *   （詳しくは src/features/rika/RikaHome.tsx）
   *
   * ★省略可にしてある理由★
   *   Home はテストやプレビューからも描画される。
   *   必須にすると呼び出し側すべてに手を入れることになる。
   *   渡されなければカードを出さない（＝従来どおりの見た目）。
   *   FEATURES.rika が false のときは App 側で渡さない。
   */
  onRika?: () => void;
  onReviewList?: () => void;
  /** 科目選択（タイトル）画面へ戻る */
  onChangeSubject?: () => void;
  /** 現在選択中の科目名（表示用） */
  subjectLabel?: string;
  /** 現在選択中の科目。省略時は従来どおり化学基礎として振る舞う。 */
  subject?: SubjectKey;
  isGuest: boolean;
  /*
    ===== BGM の ON/OFF をヘッダーから切り替えられるようにする =====

    ■ なぜ設定画面だけでは足りないのか
      音は「いま鳴っている」ときに止めたいものなので、
        ナビ → 設定 → スクロール → トグル
      という4手を踏ませるのは実質「止められない」に等しい。
      鳴っていることに気づいた画面で1タップで止められる必要がある。

    ■ なぜ「省略可」なのか
      Home は他の場所（テスト・プレビュー）からも描画される。
      必須にすると呼び出し側すべてに手を入れることになり、
      今回の指摘とは無関係な変更が広がる。
      渡されなければボタンを出さない（＝従来どおりの見た目）。
  */
  isBgmEnabled?: boolean;
  /** フェードで音が消えた状態。ラベルを「もう一度鳴らす」に変えるため。 */
  isBgmFadedOut?: boolean;
  onToggleBgm?: (enabled: boolean) => void;
}

export function Home({ onStart, onIntro, onNoteList, onLogicalTree, onLeaderboard, onBattle, onRika, onChangeSubject, subjectLabel = '化学基礎', subject = 'chemistry_basic', isGuest, isBgmEnabled, isBgmFadedOut, onToggleBgm }: HomeProps) {
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
  // 未知の科目IDが来た場合は化学基礎の章が返る（従来の if 連鎖の既定分岐と同じ）。
  //
  // 中身は軽い索引（章ID・章名・大問数のみ）。教科データ本体は読まない。
  const allChaptersList = useMemo(() => getChapterIndexOfSubject(subject), [subject]);
  const totalQuestions = useMemo(
    () => allChaptersList.reduce((sum, c) => sum + c.problemCount, 0),
    [allChaptersList],
  );
  const [solvedQuestions, setSolvedQuestions] = useState(0);
  /** 章ID → その章で解いた大問数（「次の章」の算出に使う） */
  const [solvedByChapter, setSolvedByChapter] = useState<Record<string, number>>({});

  // ===== 科目ごとの進捗（「何問中何問」を教科別に見せる） =====
  // 従来は選択中の科目の1本だけを表示していたため、
  // 他の科目の進み具合を見るには科目を切り替える必要があった。
  // ここで全科目分をまとめて作り、カード内に並べて出す。
  // 並ぶ順・表示名・対象の章は索引がそのまま決める（並び順は data/allChapters.ts の
  // SUBJECTS と同一で、一致は tests/chapterIndex.test.ts が検査している）。
  // 教科を追加したときにここへ書き足す必要は無い。
  // ★ここは「4箇所」のうちの4番目（一覧・検索結果）★
  // 非公開の科目は進捗一覧にも出さない。
  // 出してしまうと「数学 0/48問」のように見えて、
  // タップできないのに存在だけ知られる＝一番中途半端な状態になる。
  // 判断は src/config/features.ts の1か所だけを見る。
  const subjectProgressDefs = useMemo(
    () =>
      SUBJECT_INDEX.filter((s) => isSubjectEnabled(s.id)).map((s) => ({
        id: s.id,
        label: s.label,
        chapters: s.chapters,
      })),
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
        const localProfile = localStorage.getItem(profileKey(uid));
        if (localProfile) {
          setProfile(JSON.parse(localProfile));
        } else {
          setProfile({ name: auth.currentUser ? (auth.currentUser.displayName || 'ユーザー') : 'ゲスト' });
        }

        // Calculate streak
        const lastActive = localStorage.getItem(lastActiveKey(uid));
        const storedStreak = parseInt(localStorage.getItem(streakKey(uid)) || '0', 10);

        const today = new Date().toDateString();
        if (lastActive === today) {
          setStreak(storedStreak);
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastActive === yesterday.toDateString()) {
            const newStreak = storedStreak + 1;
            setStreak(newStreak);
            localStorage.setItem(streakKey(uid), newStreak.toString());
            localStorage.setItem(lastActiveKey(uid), today);
          } else {
            setStreak(1);
            localStorage.setItem(streakKey(uid), '1');
            localStorage.setItem(lastActiveKey(uid), today);
          }
        }

        /*
         * 解いた大問数をカウント（1点でも取れた大問＝進捗）。
         * 初回だけ旧データ（quiz_run_* / quiz_answers_* / completed_*）から引き継ぐ。
         *
         * ■ ここだけは教科データ本体が必要
         *   引き継ぎは「小問IDから、それが属する大問IDを引く」処理なので、
         *   大問の実体（subQuestions）が要る。軽い索引では代われない。
         *
         * ■ ただし1人につき生涯1回しか走らない
         *   済んだかどうかは localStorage のフラグで覚えている。
         *   以前は毎回この関数を呼んでいたため、2回目以降の起動では
         *   「読み込んだ教科データ 約2.6MB を、何もせず捨てる」
         *   ということが毎回起きていた。
         *
         *   そこで先にフラグだけを見て、
         *     ・まだの人   → その場で教科データを読み込んで引き継ぐ（従来と同じ）
         *     ・済んだ人   → 何も読み込まない
         *   と分けた。大多数の起動は後者になる。
         *
         * ■ 順番は変えていない（ここが大事）
         *   引き継ぎは「進捗を数える前」に終わっている必要がある。
         *   先に数えてしまうと、引き継ぎ直後の1回だけ古い数字が出て、
         *   あとから増えるという不自然な見え方になる。
         *   そのため await して、引き継ぎが終わってから数える。
         *   （待つのは「まだの人」の初回だけ。済んだ人は待たない）
         *
         * ■ 渡す章は従来と同一
         *   以前も選択中の教科の章だけを渡していた（全教科ではない）。
         *   getChaptersOfSubject(subject) はまさにそれと同じものを返す。
         */
        if (!isLegacyProgressBackfilled(uid)) {
          try {
            const [{ getChaptersOfSubject }, { backfillLegacyProgress }] = await Promise.all([
              import('../data/allChapters'),
              import('../utils/progress'),
            ]);
            backfillLegacyProgress(uid, getChaptersOfSubject(subject));
          } catch {
            /* 引き継ぎに失敗しても現在の進捗表示は続行する */
          }
        }
        // 選択中の科目の進捗。
        // countSolvedProblems は全科目の合計を返すため、そのまま使うと
        // 「化学基礎 174問中 180問」のように分母を超えることがあった。
        // 対象の章に限って数える countSolvedProblemsIn を使う。
        const currentChapterIds = allChaptersList.map((c) => c.id);
        setSolvedQuestions(
          Math.min(countSolvedProblemsIn(uid, currentChapterIds), totalQuestions),
        );
        setSolvedByChapter(countSolvedByChapter(uid));

        // 科目ごとの進捗（教科別に「何問中何問」を並べて出すため）
        const perSubject: Record<string, { solved: number; total: number }> = {};
        subjectProgressDefs.forEach((def) => {
          // 索引が持っている大問数を足すだけ（数え方は data/problemCount.ts と同一。
          // 一致は tests/chapterIndex.test.ts が検査している）。
          const total = def.chapters.reduce((sum, c) => sum + c.problemCount, 0);
          const solved = Math.min(
            countSolvedProblemsIn(uid, def.chapters.map((c) => c.id)),
            total,
          );
          perSubject[def.id] = { solved, total };
        });
        setSubjectProgress(perSubject);

        // completed chapters（次の章を求めるために継続利用）
        const completed = JSON.parse(localStorage.getItem(completedKey(uid)) || '[]');
        setCompletedIds(completed);

      } catch (error) {
        console.error("プロフィール・統計情報取得エラー:", error);
      }
    };

    fetchProfileAndStats();
    // subject を足したのは、引き継ぎに渡す章を subject から引き直すようにしたため。
    // allChaptersList は subject から作られているので、実際に再実行される回数は従来と同じ。
  }, [isGuest, subject, allChaptersList, totalQuestions, subjectProgressDefs]);

  const todayStr = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
  const todayFormatted = todayStr.replace(/\//g, '.');

  // 共通テストまでの残り日数
  const daysUntilExam = useMemo(() => getDaysUntilExam(), []);


  // 「次の章」を算出（学習進捗カードの状況別コピー用）
  // 大問をすべて解き終えた章は飛ばし、まだ残っている最初の章を提示する。
  // （completed_ は「ミニテストを通した」履歴でしかなく、
  //   演習の進捗を反映しないため、台帳側の章ごと件数を併せて見る）
  const nextChapter = useMemo((): ChapterIndexEntry | undefined => {
    const remaining = allChaptersList.find((c) => {
      // 索引が持っている大問数（数え方は countChapterProblems と同一）。
      const total = c.problemCount;
      if (total === 0) return false;
      return (solvedByChapter[c.id] || 0) < total;
    });
    return remaining || allChaptersList.find((c) => !completedIds.includes(c.id));
  }, [completedIds, allChaptersList, solvedByChapter]);

  // 「次のマイルストーン」を算出（連続学習カード用）
  const nextMilestone = useMemo(() => {
    const milestones = [3, 7, 14, 30, 60, 100];
    const target = milestones.find(m => m > streak);
    if (!target) return null;
    return { target, remaining: target - streak };
  }, [streak]);

  const greetingName = profile?.name || 'ゲスト';

  const progressPercent = totalQuestions > 0 ? Math.round(solvedQuestions / totalQuestions * 100) : 0;
  const bgmPlaying = !!isBgmEnabled && !isBgmFadedOut;
  const bgmLabel = !isBgmEnabled ? 'BGMを鳴らす' : isBgmFadedOut ? 'BGMをもう一度鳴らす' : 'BGMを止める';

  return (
    <div className="home-lobby w-full h-full min-h-0 flex flex-col relative overflow-hidden">
      <div className="home-lobby-lines" aria-hidden="true" />
      <NotebookScenery />
      <SakuraPetals count={18} />

      {/* 固定ナビの高さを予約。短い画面でも先頭から末尾までスクロールできる。 */}
      <div className="home-lobby-scroll flex-1 min-h-0 overflow-y-auto pb-app-nav">
        <div className="home-lobby-content">
          <header className="home-lobby-header">
            <div className="home-player">
              {schoolBrand && <p className="home-school">{schoolBrand.schoolName}</p>}
              <p className="home-date">{todayFormatted}</p>
              <h1>おかえり、<span>{greetingName}さん</span></h1>
              <div className="home-streak" title={nextMilestone ? `${nextMilestone.target}日連続まであと${nextMilestone.remaining}日` : '連続学習を継続中'}>
                <Flame size={14} aria-hidden="true" />
                <span>連続学習 <b>{streak}</b> 日</span>
                {nextMilestone && <span className="home-milestone">次の目標 {nextMilestone.target}日</span>}
              </div>
            </div>
            <div className="home-header-tools">
              <div className="home-countdown" title={EXAM_DATE_LABEL}>
                <span>共通テストまで</span>
                <div>あと <strong>{daysUntilExam}</strong> 日</div>
              </div>
              <div className="home-utility-row">
                {onToggleBgm && (
                  <button type="button" className="home-header-icon" onClick={() => onToggleBgm(!isBgmEnabled || !!isBgmFadedOut)}
                    aria-label={bgmLabel} title={bgmLabel} aria-pressed={bgmPlaying}>
                    {bgmPlaying ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}
                    <span>BGM</span>
                  </button>
                )}
                <button type="button" className="home-header-icon home-notices" onClick={() => setShowNotices(true)}
                  aria-label={unreadCount > 0 ? `お知らせを開く（未読 ${unreadCount} 件）` : 'お知らせを開く'}>
                  <Bell size={17} aria-hidden="true" /><span>お知らせ</span>
                  {unreadCount > 0 && <span className="home-notice-dot" aria-hidden="true">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                </button>
              </div>
            </div>
          </header>

          <div className="home-lobby-layout">
            {/* 対戦は独立したステージ。補助機能と同じカード列には戻さない。 */}
            <section className={`home-arena ${!onBattle ? 'home-arena-study' : ''}`} aria-labelledby="home-arena-title" data-home-arena>
              <div className="home-arena-main">
                <p className="home-eyebrow">{onBattle ? 'ONLINE QUIZ BATTLE' : 'MY STUDY ROOM'}</p>
                <h2 id="home-arena-title">{onBattle ? '学んだ力を、対戦で。' : '今日も、ひとつ先へ。'}</h2>
                <div className="home-battle-emblem" aria-hidden="true">
                  <div className="home-emblem-orbit" />
                  <div className="home-emblem-paper home-emblem-paper-left"><BookOpen /></div>
                  <div className="home-emblem-paper home-emblem-paper-right"><Sparkles /></div>
                  <div className="home-emblem-core">{onBattle ? <Swords /> : <BookOpen />}</div>
                  <span className="home-emblem-tag">{onBattle ? '1 vs 1' : 'STEP BY STEP'}</span>
                  <Sparkles className="home-emblem-spark" />
                </div>
                {onBattle && (
                  <button type="button" onClick={onBattle} aria-label="オンライン対戦を開く" className="home-battle-button" data-home-battle>
                    <span><strong>オンライン対戦</strong><small>全国レート戦・友だちと1対1</small></span>
                    <span className="home-battle-arrow"><ArrowRight size={23} aria-hidden="true" /></span>
                  </button>
                )}
                <p className="home-arena-caption">{onBattle ? 'いつもの学びが、勝つ力になる。' : '自分のペースで、知識を積み重ねよう。'}</p>
              </div>

              {/* 丸いショートカットは常設。ラベルも残し、アイコンだけにしない。 */}
              <aside className="home-shortcuts" aria-label="ホームのショートカット">
                <button type="button" onClick={onNoteList} className="home-shortcut"
                  aria-label={`学習ノートを開く（ノートと復習）${reviewDueCount > 0 ? `。今日の復習${reviewDueCount}件` : ''}`}>
                  <span className="home-shortcut-disc"><Edit3 size={23} aria-hidden="true" />
                    {reviewDueCount > 0 && <span className="home-review-badge">{reviewDueCount > 99 ? '99+' : reviewDueCount}</span>}
                  </span>
                  <span>学習ノート</span>
                </button>
                <button type="button" onClick={onIntro} className="home-shortcut" aria-label="アプリ紹介を開く">
                  <span className="home-shortcut-disc home-shortcut-sage"><ShieldCheck size={23} aria-hidden="true" /></span>
                  <span>アプリ紹介</span>
                </button>
                <FeedbackButton screen="title" variant="text" label="ご意見・ご要望"
                  description="アプリ全体の使い勝手・ほしい機能など、自由にお書きください"
                  context={{ streak, solvedQuestions, totalQuestions, isGuest }} className="home-feedback-shortcut" />
              </aside>

              {/*
                ★とびら君の豆知識は「最初の画面」に置く★

                ご指摘（原文）：
                  > なんかほーむがめんのとびらくんのことば少し下隠れてて
                  > スクロールしないといけないのもったいない

                ■ 何が起きていたか（Chromium で実測・ゲスト状態のホーム初期表示）
                  以前は画面末尾の .home-lobby-footer に置いていた。
                  末尾の要素の位置は「その上にある全部の高さの合計」で決まるので、
                  縦の短い端末では初期表示から押し出されていた。
                    320x568 … 160px 隠れる（見える下端 497 / 吹き出し 589〜657）
                    360x640 … 129px 隠れる
                    375x667 … 103px 隠れる
                    390x844 … 隠れない
                  つまり「端末によって出る／出ない」が変わる状態で、
                  出ない端末の人だけがスクロールを強いられていた。

                ■ なぜ「px を詰める」直し方にしなかったか
                  末尾に置いたままでは、位置が中身の量で動き続ける。
                  学校名の有無・次の目標の行・連携バナー・返信の受信箱は
                  利用者ごとに出る／出ないが変わるので、
                  「私の端末ではちょうど収まる」値を入れても
                  別の人・別の端末で再発する（＝直ったことにならない）。

                ■ どう直したか
                  豆知識を ★対戦ステージ（上から2番目の区画）の中★ へ移した。
                  下に何が増えても位置が動かないので、必ず初期表示に入る。

                ■ なぜ .home-arena-main の中ではなく、ステージ直下の子なのか
                  main は中央の狭い列（右にショートカットの列がある）。
                  そこへ入れると吹き出しが 3 行に折り返し、実測で
                  高さが 67px → 82px に増えて「学習を始める」を
                  320x568 で 64px ぶん画面外へ押し出した。
                  ステージ直下に置いて grid-column: 1 / -1 で全幅にすると
                  折り返しが減り、押し出しを起こさずに収まる。

                  情報は一切減らしていない（吹き出しの文も分野ラベルもそのまま）。
              */}
              <DoorMascot subject={subject} showCategory size="mini" className="home-arena-tip" />
            </section>

            {/* 学習の入口と実際の進捗を一枚のノートにまとめる。全科目は開閉できる。 */}
            <section className="home-study-paper" aria-label="学習と進捗" data-home-study>
              <div className="home-paper-binding" aria-hidden="true"><i /><i /><i /></div>
              <div className="home-study-topline">
                <span className="home-study-kicker"><BookOpen size={13} aria-hidden="true" /> ひとりで学ぶ</span>
                {onChangeSubject && (
                  <button type="button" onClick={onChangeSubject} className="home-subject-switch" aria-label={`科目を変更する（現在：${subjectLabel}）`}>
                    <span>{subjectLabel}</span><Repeat2 size={13} aria-hidden="true" />
                  </button>
                )}
              </div>
              <button type="button" onClick={onStart} className="home-study-button">
                <span><strong>{solvedQuestions === 0 ? '学習を始める' : '続きから開く'}</strong>
                  <small>{solvedQuestions >= totalQuestions && totalQuestions > 0 ? '全問制覇！くり返し学んで定着させよう' : '演習・まとめプリントで、対戦の力をつけよう'}</small>
                </span>
                <span className="home-study-arrow"><ArrowRight size={21} aria-hidden="true" /></span>
              </button>
              <div className="home-progress-summary">
                <div className="home-progress-ring" style={{ '--progress': `${progressPercent}%` } as React.CSSProperties} aria-hidden="true"><span>{progressPercent}<small>%</small></span></div>
                <div className="home-progress-text">
                  <h2><BarChart3 size={13} aria-hidden="true" /> 学習進捗 <span>{subjectLabel}</span></h2>
                  <p>{totalQuestions > 0 ? <><strong>{solvedQuestions}</strong> / {totalQuestions} 大問クリア</> : '問題を準備中'}</p>
                  <div className="home-progress-track" role="progressbar" aria-label={`${subjectLabel}の学習進捗`}
                    aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}
                    aria-valuetext={`${subjectLabel}：大問 ${solvedQuestions} / ${totalQuestions} 問クリア（${progressPercent}%）`}>
                    <span style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              </div>
              <details className="home-all-progress">
                <summary>全科目の進捗を見る <ChevronRight size={14} aria-hidden="true" /></summary>
                <div className="home-progress-list">
                  <p className="home-progress-help">1点でも取れた大問を記録しています。</p>
                  {subjectProgressDefs.map((def) => {
                    const p = subjectProgress[def.id] || { solved: 0, total: def.chapters.reduce((sum, c) => sum + c.problemCount, 0) };
                    const percent = p.total > 0 ? Math.round(p.solved / p.total * 100) : 0;
                    return (
                      <div key={def.id} className="home-subject-progress">
                        <div><span>{def.label}</span><span>{p.total === 0 ? '問題を準備中' : `大問 ${p.solved} / ${p.total} 問 (${percent}%)`}</span></div>
                        <div className="home-progress-track" role="progressbar" aria-label={`${def.label}の学習進捗（一覧）`}
                          aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}
                          aria-valuetext={p.total === 0 ? `${def.label}：問題を準備中` : `${def.label}：大問 ${p.solved} / ${p.total} 問クリア（${percent}%）`}>
                          <span style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {nextChapter && <button type="button" onClick={onStart} className="home-next-chapter">次の章：{nextChapter.abstractTitle || nextChapter.title || nextChapter.id}<ArrowRight size={14} aria-hidden="true" /></button>}
                </div>
              </details>
              {onRika && <button type="button" onClick={onRika} aria-label="高校入試 理科を開く" className="home-rika-link hidden md:flex"><Microscope size={15} aria-hidden="true" />高校入試 理科<ChevronRight size={14} aria-hidden="true" /></button>}
            </section>
          </div>

          {/* 末尾に残すのは「読み終わってから出会えばよいもの」だけ。
              とびら君の豆知識は上の対戦ステージへ移した（理由はそちらのコメント）。 */}
          <div className="home-lobby-footer">
            {isGuest && !auth.currentUser && <GoogleLinkBanner variant="inline" dismissible />}
            <FeedbackReplyInbox />
          </div>
        </div>
      </div>
      {showNotices && <UpdateNoticeModal onClose={() => { setShowNotices(false); setUnreadCount(unreadNoticeCount()); }} />}
    </div>
  );
}

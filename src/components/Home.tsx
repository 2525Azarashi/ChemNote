import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, ChevronRight, Edit3, ArrowRight, CalendarDays, BarChart3, ShieldCheck, Repeat2, Bell, Volume2, VolumeX, Swords, Microscope } from 'lucide-react';
import { motion } from 'motion/react';
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

  return (
    // タイトル画面：他ページと馴染む淡いピンク基調＋ノート罫線の柔らかい背景を全面に広げる
    /*
      ★min-h-[100dvh] → h-full に変更した理由★
      min-height は「最低これだけ、中身が増えれば伸びる」箱なので、
      中の overflow-y-auto に高さの上限を渡せない（＝スクロールしない）。
      App 側で外枠の高さを 100dvh に確定させたので、
      ここは h-full でその高さをそのまま受け取り、子に渡す。
      これで下の flex-1 ペインが初めて「余った高さ」を正しく計算でき、
      ページ全体ではなくペインの中だけがスクロールするようになる。
    */
    <div className="w-full h-full min-h-0 flex flex-col relative overflow-hidden rounded-none sm:rounded-[32px] bg-gradient-to-b from-[#FFF1F5] via-[#FDFBF7] to-[#F8E7EE]">

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
          スマホ/タブレットは縦スクロール可能。

          ★min-h-0 と pb-app-nav を足したのが今回の修正★
          ・min-h-0 … flex の子は既定で min-height:auto（＝中身より縮まない）。
            これを外さないと flex-1 が効かず、中身のぶんだけ伸びて
            スクロールしない箱になってしまう。高さの鎖の要。
          ・pb-app-nav … 固定ナビは高さを占めないので、末尾に同じだけ
            余白を作らないと最後の要素（＝マスコットの吹き出し）が
            ナビの裏に隠れる。以前の pb-32 は実際のナビ高さより
            大きすぎて、逆に1画面に収まらない一因にもなっていた。 */}
      {/*
        ★スマホでも flex flex-col にした理由★
        「学習を始める」を必ず1画面目に入れたい（ご要望）。
        しかし進捗カードの高さは科目数・進捗テキストで伸び縮みするため、
        高さを詰める方向だけで押し込むのは端末やデータ次第で必ず破綻する。
        そこで flex の order で「並び順」を変え、
          挨拶 → 学習を始める → カード群 → サブ導線
        とする。順番で保証すれば、カードが何px になっても
        CTA が画面外に出ることはない。
        lg 以上は order を戻し、従来の見た目を維持する。
      */}
      {/*
        ===== パソコンでスクロールできなかった問題の修正 =====

        ■ 何が起きていたか
          パソコンでは「1画面に収める」設計にしてあり、
          はみ出したぶんを隠す指定（overflow:hidden）を入れていた。
          ところが画面の縦が短いパソコン（ノートPCに多い）では
          中身が1画面に収まらず、
          ★隠した部分に手が届かない＝下まで読めない★ 状態になっていた。

        ■ 実際に測った結果
          横1280×縦720 … 83px ぶん届かない
          横1366×縦768 … 59px ぶん届かない
          横1440×縦900 … 収まっている（問題なし）
          横1920×1080  … 収まっている（問題なし）
          つまり「一部のパソコンだけで起きる」不具合で、
          自分の環境では気づけなかった。

        ■ どう直したか
          隠す指定をやめ、パソコンでも縦スクロールできるようにした
          （overflow-y-auto）。
          ただし ★収まっているときの見た目は変えない★。
          ・中身が画面に収まる場合はスクロールバーも出ず、
            今までと完全に同じ表示になる（auto は必要なときだけ出る）
          ・中央寄せ（lg:justify-center）は
            lg:justify-start へは変えず、代わりに
            「中身が余ったときだけ中央に寄る」書き方（my-auto ではなく
            justify-center のまま）を維持している。
            収まる画面では従来どおり中央、
            収まらない画面では上から順に読めてスクロールできる。

        ■ 縦が短い画面だけ余白を詰める
          そもそも収まらないのは余白が大きいことも一因なので、
          縦が短いときだけ上下の余白を少し詰める
          （xl:pt-6 / 高さ条件つきのクラスは使わず、
            lg での下余白 24 → 16 に控えめに調整）。
          これで 1366×768 は収まりやすくなり、
          収まらない場合もスクロールで最後まで読める。
      */}
      {/*
        ===== パソコンで「上に」スクロールできなかった問題の修正 =====

        ■ ご指摘（原文）
          > PCバージョンのタイトル画面で上にスクロールできず、
          > お知らせや科目変更ができません。

        ■ 何が起きていたか
          上の修正で overflow-y-auto にしてスクロールできるようにしたが、
          中央寄せの指定（lg:justify-center）を そのまま残していた。

          ★スクロールする箱に justify-center を付けてはいけない★
          中身が箱より高いとき、justify-center は はみ出したぶんを
          上と下に「半分ずつ」押し出す。ところが
          ブラウザがスクロールで見せてくれるのは ★下にはみ出した側だけ★。
          上にはみ出した側は、スクロール位置の最小値が 0（＝箱の上辺）
          なので、どれだけ上へスクロールしようとしても到達できない。
          これは CSS の仕様で、Chrome も Safari も同じ挙動になる。

          その結果、ホーム画面の一番上に置いてある
            ・お知らせのベル（更新履歴）
            ・現在の科目バッジ（押すと科目を変更できる導線）
          が、縦の短いパソコンでは ★永久に押せない★ 状態だった。
          「下は読めるのに上だけ届かない」というご指摘のとおりの症状。

        ■ どう直したか
          中央寄せを justify-center（箱の指定）から
          ★中身側の auto マージン★ に移した。

            収まるとき   … 余った高さを上下の auto が分け合う ＝ 従来どおり中央
            収まらないとき … auto マージンは 0 に潰れる ＝ 上端から始まる

          auto マージンは「余りを分ける」だけで ★足りないときに
          はみ出しを作らない★ ので、上に届かない領域が生まれない。
          つまり「収まっている画面の見た目は完全に従来のまま」で、
          収まらない画面だけが上から順に読めるようになる。

          具体的には
            ・箱   … lg:justify-center を外す（justify-start 相当）
            ・中身 … 先頭の要素に lg:mt-auto、末尾の要素に lg:mb-auto
          を付ける。order で並び替えているので、
          「先頭／末尾」は order 番号ではなく ★DOM の最初と最後★ に付ける
          必要がある点に注意（auto マージンは視覚順ではなく
          flex の配置計算に効くため、order 済みの実際の並びで先頭・末尾に
          来るものに付ける）。ここでは order-1 の挨拶行が先頭、
          order-5 のサブ導線が末尾になる。
      */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-app-nav lg:pb-16 px-5 sm:px-8 md:px-12 pt-6 md:pt-8 lg:pt-6 relative z-10 flex flex-col">

        {/* ===== 挨拶 ＋ カウントダウン =====
            ※ 左上の「まなとび」ワードマークは表示しない（ユーザー要望）。 */}
        {/* スマホでは挨拶とカウントダウンを横並びにする。
            縦積みだと実測 216px を占め、1画面化の最大の障害だった。
            横並びなら約110pxで収まる。md 以上は従来どおり。 */}
        {/* lg:mt-auto … パソコンで中身が余ったときだけ上に余白を作り、
            末尾の lg:mb-auto と対になって「結果的に中央」に見せる。
            中身が収まらないときは 0 に潰れるので、
            ★上にはみ出して押せなくなる領域が生まれない★。 */}
        <div className="order-1 shrink-0 lg:mt-auto flex flex-row md:items-start md:justify-between gap-3 md:gap-5 mb-3 md:mb-8 lg:mb-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="font-handwriting min-w-0 flex-1">
            {/* 学校名（クラスに参加している生徒のみ。学校の教材として見えるようにする） */}
            {schoolBrand && (
              <p className="text-[11px] font-modern font-bold text-[#5D6D7E] tracking-wide mb-1">
                {schoolBrand.schoolName}
              </p>
            )}
            {/*
              科目バッジと BGM ボタンを同じ1行に並べる。

              ★行を増やさないことが条件★
              スマホのホームは「学習を始める」を1画面目に入れるため
              1px 単位で高さを詰めてある（実測して詰めた経緯がある）。
              ボタンを縦に足すと、その努力を壊して CTA が画面外に出る。
              そこで既存のバッジと同じ高さ（min-h-[28px]）の
              小さな丸ボタンにして、同じ行の右隣に置く。
              gap と flex-wrap を付けているので、
              科目名が長い端末でも重ならず折り返すだけで済む。
            */}
            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            {/* 現在の科目バッジ（タップで科目選択＝タイトル画面へ戻れる導線） */}
            {onChangeSubject && (
              <button
                onClick={onChangeSubject}
                aria-label={`科目を変更する（現在：${subjectLabel}）`}
                className="group inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-[#F4A9C4]/55 text-[11px] font-modern font-bold text-[#D9466E] hover:bg-white hover:border-[#E8688E] transition-colors min-h-[28px]"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                {subjectLabel}
                <span className="text-[#B8C4CE] group-hover:text-[#E8688E] transition-colors" aria-hidden="true">|</span>
                <Repeat2 className="w-3.5 h-3.5 text-[#8895A0] group-hover:text-[#E8688E] transition-colors" aria-hidden="true" />
              </button>
            )}

            {/*
              ===== BGM の ON/OFF（ヘッダー） =====

              ■ なぜここに要るのか
                音が鳴っていることに気づくのはホームに入った直後で、
                そのとき止める手段が「設定画面まで4手」しか無かった。
                図書館や電車では ★その4手が間に合わない★。
                気づいた画面で1タップで止められる必要がある。

              ■ 表示の意味
                ・OFF のとき … スピーカーに斜線。押すと鳴る。
                ・ON のとき  … スピーカー。押すと止まる。
                ・フェードで消えたあと … ON のままだが鳴っていないので、
                  ラベルを「もう一度鳴らす」にする。
                  ★ONなのに無音＝故障に見える★のを防ぐため。

              ■ onToggleBgm を経由する理由
                iOS Safari は「利用者の操作と同じ呼び出しの流れの中で」
                再生を始めないとブロックする。
                状態を変えてから鳴らす作りでは間に合わないので、
                押した瞬間に鳴らす処理（App 側）をそのまま呼ぶ。
            */}
            {onToggleBgm && (
              <button
                type="button"
                onClick={() => onToggleBgm(!isBgmEnabled)}
                aria-label={
                  !isBgmEnabled
                    ? 'BGMを鳴らす'
                    : isBgmFadedOut
                      ? 'BGMをもう一度鳴らす'
                      : 'BGMを止める'
                }
                aria-pressed={!!isBgmEnabled && !isBgmFadedOut}
                title={
                  !isBgmEnabled
                    ? 'BGMを鳴らす'
                    : isBgmFadedOut
                      ? 'BGMをもう一度鳴らす'
                      : 'BGMを止める'
                }
                className={`inline-flex items-center gap-1 pl-2 pr-2.5 py-1 rounded-full border text-[11px] font-modern font-bold transition-colors min-h-[28px] ${
                  isBgmEnabled && !isBgmFadedOut
                    ? 'bg-[#FBE0E9] border-[#E8688E]/60 text-[#D9466E] hover:bg-[#F8D2DF]'
                    : 'bg-white/85 backdrop-blur-sm border-[#D1D5DB]/70 text-[#8895A0] hover:bg-white hover:text-[#5D6D7E]'
                }`}
              >
                {isBgmEnabled && !isBgmFadedOut ? (
                  <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>BGM</span>
              </button>
            )}
            </div>
            {/* スマホでは 22px → 18px に落として1行に収める。
                2行に折り返すと、それだけで約40pxを失っていた。 */}
            <h1 className="text-[18px] md:text-[30px] text-[#1B2631] font-bold tracking-wide truncate">
              おかえり、{greetingName}さん
            </h1>
            <p className="text-[11px] md:text-sm text-[#5D6D7E] mt-0.5 md:mt-1.5 font-modern tracking-wider">{todayFormatted}</p>
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
              /* スマホでは正方形の小さなボタンにし、「お知らせ」の文字は
                 ベルのアイコンで十分伝わるので隠す（aria-label は残す）。 */
              className="relative flex h-[44px] w-[44px] md:h-[68px] md:w-[52px] shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[14px] md:rounded-[18px] border border-[#F4A9C4]/50 bg-white/90 shadow-[0_10px_26px_-12px_rgba(217,70,110,0.5)] backdrop-blur-sm transition-colors hover:bg-white"
            >
              <Bell className="h-5 w-5 text-[#E8688E]" aria-hidden="true" />
              <span className="hidden md:block font-modern text-[9px] font-bold tracking-wide text-[#5D6D7E]">
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

            {/* スマホでは幅・余白を詰め、日付ラベルとカレンダーアイコンを隠す。
                「あと何日か」という数字が主役なので、そこだけ残せば伝わる。
                md 以上は従来の見た目のまま。 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[20px] px-3 py-2.5 md:px-5 md:py-4 shadow-[0_10px_26px_-12px_rgba(217,70,110,0.5)] border border-[#F4A9C4]/50 flex items-center gap-2 md:gap-4 min-w-0 md:min-w-[210px]">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-[#5D6D7E] font-modern whitespace-nowrap">共通テストまで</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl md:text-4xl font-bold font-handwriting text-[#D9466E] leading-none tabular-nums">{daysUntilExam}</span>
                  <span className="text-sm font-modern font-bold text-[#D9466E]">日</span>
                </div>
                <span className="hidden md:block text-[10px] text-[#8895A0] font-modern mt-1 tracking-wide">{EXAM_DATE_LABEL}</span>
              </div>
              <div className="hidden md:flex ml-auto w-11 h-11 rounded-2xl bg-[#FBE0E9] items-center justify-center shrink-0">
                <CalendarDays className="w-6 h-6 text-[#E8688E]" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== Googleアカウント連携のおすすめ（ゲスト利用中のみ） =====
            ゲストのままだと記録が端末に閉じてしまうため、
            ホームでも一行の細い帯で連携を案内する（×で当面非表示にできる）。 */}
        {isGuest && !auth.currentUser && (
          /* order-4：CTA の後ろに置く。ゲスト案内は大事だが、
             これが CTA を画面外へ押し出してはいけない。 */
          <div className="order-4 lg:order-2 shrink-0 mb-3 md:mb-6 lg:mb-4">
            <GoogleLinkBanner variant="inline" dismissible />
          </div>
        )}

        {/* ===== メインカード群 ===== */}
        <div className="order-3 grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 lg:gap-5">

          {/* 連続学習カード（とびら君マスコット＋化学豆知識付き） */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="bg-white/90 backdrop-blur-sm rounded-[20px] p-3.5 md:p-6 shadow-[0_10px_26px_-14px_rgba(217,70,110,0.45)] border border-[#F4A9C4]/40 relative overflow-hidden h-full flex flex-col">
              {/* 上段：連続日数とマイルストーン
                  スマホでは「連続学習」の見出しと日数を横1行に並べ、
                  巨大な数字（text-5xl=48px）も 3xl に落として高さを削る。 */}
              <div className="flex flex-col gap-1 w-full min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-sm tracking-widest text-[#1B2631] font-modern">連続学習</span>
                  <span className="md:hidden ml-auto flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-handwriting text-[#D9466E] leading-none">{streak}</span>
                    <span className="text-xs font-modern text-[#1B2631] font-medium">{streak > 0 ? '日連続' : '日目'}</span>
                  </span>
                </div>
                <div className="hidden md:flex items-baseline gap-1 mt-1.5">
                  <span className="text-5xl md:text-6xl font-bold font-handwriting text-[#D9466E] leading-none">{streak}</span>
                  <span className="text-sm font-modern text-[#1B2631] font-medium">{streak > 0 ? '日連続' : '日目'}</span>
                </div>
                {nextMilestone && (
                  <div className="mt-2 pt-2 md:mt-3 md:pt-3 border-t border-[#F4A9C4]/30">
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
              {/* ★ご指摘の「吹き出しが切れる」当該要素★
                  クリップ自体は外枠の高さ確定（App 側）とスクロール領域の
                  末尾余白（pb-app-nav）で解消済み。ここでは上余白を詰めて
                  1画面に収まりやすくする。 */}
              <DoorMascot
                subject={subject}
                showCategory
                className="mt-2.5 pt-2.5 md:mt-4 md:pt-4 border-t border-[#F4A9C4]/25"
              />
            </div>
          </motion.div>

          {/* 学習進捗カード */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <div className="border border-[#F4A9C4]/40 rounded-[20px] p-3.5 md:p-6 bg-white/90 backdrop-blur-sm shadow-[0_10px_26px_-14px_rgba(217,70,110,0.45)] h-full flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-[15px] md:text-[16px] mb-2 md:mb-3 text-[#1B2631] font-modern flex items-center gap-2">
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
                      className="inline-flex items-center gap-1.5 text-[13px] md:text-sm font-bold font-modern text-[#1B2631] hover:text-[#D9466E] transition-colors mb-3 md:mb-6 group"
                    >
                      まず第1章から始めよう
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <p className="text-xs md:text-sm text-[#5D6D7E] font-modern leading-relaxed mb-3 md:mb-6">
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
              <div className="space-y-1.5 md:space-y-3">
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

        {/* =================================================================
            メインCTA：対戦（1番目） ＋ 学習（2番目）
            =================================================================

            ★並びを入れ替えた理由★
              利用者の指示：「オンラインをメインにするUIにしていかんとだめよね？
              取り組めるところから頼む　でも問題をなくすとかはダメだよ
              ボタンの配置変えるぐらい」

              それまでのホームは
                主CTA        ＝「学習を始める」（幅いっぱいのピル）
                対戦への入口  ＝ 下のセカンダリ小カードの3番目
              になっていた。対戦は
                ・相手が要る（＝思い立ったときにすぐ押せないと成立しない）
                ・1試合が短い（＝入口が遠いと割に合わない）
              性質の機能なので、主動線から2段下がっているのは構造の誤り。

            ★「問題をなくすのはダメ」を守っている点★
              学習の入口は消していない。同じ位置に、同じ文言（学習を始める／
              続きから開く）で残してある。変えたのは
                ・順番（対戦を先に）
                ・大きさの比（対戦を主役の大きさ、学習を並の大きさ）
              だけで、行ける場所は1つも減っていない。
              下のセカンダリからは対戦カードを外したが、これは
              ★ここに昇格したぶんの重複を消しただけ★（入口の数は同じ）。

            ★対戦が使えないときは学習が主役に戻る★
              onBattle が渡されない（FEATURES.battle が false／ビルドから
              外した）ときは、対戦の枠を描かず、学習のボタンを従来どおりの
              主CTA の大きさで出す。「見えるのに入れない」を作らない。 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
          /* ★order-2：スマホでは進捗カードより前に出す★
             これで主CTA は常に画面上部＝1画面目に居る。
             lg 以上は order-4 で従来の位置（カードの下）に戻す。 */
          className="order-2 lg:order-4 shrink-0 mt-0 md:mt-6 lg:mt-5 mb-3 lg:mb-0 space-y-2 md:space-y-2.5">

          {/* --- 1番目：対戦（主役） ---
              色は対戦モードの中と同じ青系（#2E86C1 系）にしてある。
              ホームのローズ色のままだと「学習の続き」に見えて、
              いま押しているものが別の機能だと分からない。
              入口から中まで色でつながるようにする。 */}
          {onBattle && (
            <button
              onClick={onBattle}
              aria-label="オンライン対戦を開く"
              className="battle-sheen relative w-full overflow-hidden bg-gradient-to-r from-[#3D9BD9] to-[#2E86C1] text-white py-3.5 md:py-5 lg:py-4 px-5 md:px-6 rounded-[20px] font-bold flex items-center justify-between group hover:from-[#3691D2] hover:to-[#2678AF] transition-colors shadow-[0_14px_30px_-10px_rgba(46,134,193,0.6)] min-h-[60px] md:min-h-[68px] lg:min-h-[62px]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <Swords className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="font-modern tracking-widest text-[16px] md:text-[18px] leading-tight">オンライン対戦</div>
                  {/* 何ができるかを1行で。人数や待ち時間は入口では約束できないので
                      「すぐ始まる」とは書かない（待たされたときに嘘になる）。 */}
                  <div className="text-[11px] md:text-xs text-white/80 font-modern mt-0.5 truncate">
                    友だちと1対1で早解き・全国とレート戦
                  </div>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-white/70 group-hover:text-white transition-all group-hover:translate-x-1 shrink-0" aria-hidden="true" />
            </button>
          )}

          {/* --- 2番目：学習（残す。消していない） ---
              対戦が出ているときは一段控えめな高さにして主従を作る。
              対戦が無いときは従来どおりの主CTA の大きさに戻す。 */}
          <button
            onClick={onStart}
            className={`w-full bg-gradient-to-r from-[#E89AAF] to-[#D98AA0] text-white px-5 md:px-6 rounded-[20px] font-bold flex items-center justify-between group hover:from-[#E38EA6] hover:to-[#CC7890] transition-colors shadow-[0_12px_28px_-10px_rgba(217,138,160,0.55)] ${
              onBattle
                ? 'py-2.5 md:py-3.5 lg:py-3 min-h-[48px] md:min-h-[54px] lg:min-h-[50px]'
                : 'py-3 md:py-5 lg:py-3.5 min-h-[52px] md:min-h-[60px] lg:min-h-[54px]'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className={onBattle ? 'w-5 h-5 md:w-6 md:h-6' : 'w-6 h-6'} aria-hidden="true" />
              <span className={`font-modern tracking-widest ${onBattle ? 'text-[15px] md:text-[16px]' : 'text-[16px] md:text-[17px]'}`}>{solvedQuestions === 0 ? '学習を始める' : '続きから開く'}</span>
            </div>
            <ArrowRight className={`text-white/70 group-hover:text-white transition-all group-hover:translate-x-1 ${onBattle ? 'w-5 h-5 md:w-6 md:h-6' : 'w-6 h-6'}`} aria-hidden="true" />
          </button>
        </motion.div>

        {/* ===== セカンダリ：学習ノート（ノート＋復習を統合）/ アプリ紹介 / ご意見 ===== */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.45 }} className="order-5 lg:mb-auto mt-3 md:mt-5 lg:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {/* ノートと復習リストを1つの入口「学習ノート」に統合。今日の復習件数をバッジで提示 */}
          <button
            onClick={onNoteList}
            aria-label={`学習ノートを開く（ノートと復習）${reviewDueCount > 0 ? `。今日の復習${reviewDueCount}件` : ''}`}
            className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-2.5 md:py-4 lg:py-3 rounded-[18px] border border-[#F4A9C4]/40 bg-white/90 backdrop-blur-sm hover:bg-[#FFF3F7] hover:border-[#E8688E]/50 active:scale-[0.99] transition-all shadow-[0_8px_22px_-14px_rgba(217,70,110,0.4)] text-left group"
          >
            <div className="relative w-9 h-9 md:w-11 md:h-11 lg:w-10 lg:h-10 rounded-2xl bg-[#FBE0E9] flex items-center justify-center shrink-0">
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
            className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-2.5 md:py-4 lg:py-3 rounded-[18px] border border-[#F4A9C4]/40 bg-white/90 backdrop-blur-sm hover:bg-[#FFF3F7] hover:border-[#E8688E]/50 active:scale-[0.99] transition-all shadow-[0_8px_22px_-14px_rgba(217,70,110,0.4)] text-left group"
          >
            <div className="w-9 h-9 md:w-11 md:h-11 lg:w-10 lg:h-10 rounded-2xl bg-[#FBE0E9] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#E8688E]" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-handwriting font-bold text-[#1B2631] text-base md:text-lg">アプリ紹介</div>
              <div className="text-[11px] md:text-xs text-[#8895A0] font-modern mt-0.5">使い方や機能をチェック</div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#B8C4CE] group-hover:text-[#E8688E] group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
          </button>

          {/* ===== 対戦モードのカードは、ここから主CTA へ昇格させた =====
              （このファイル内の「メインCTA：対戦（1番目）＋学習（2番目）」を参照）

              ★ここに残さなかった理由★
                主CTA と同じ行き先のカードを下にも置くと、
                「押した先が違うのでは」と考えさせる（同じ場所へ2つの扉）。
                入口の数は減っていない＝上に移しただけ。

              ★注意：ここに戻すなら主CTA 側を消すこと★
                両方に置くと重複になる。 */}

          {/* ===== 高校入試 理科 =====
              渡されていないときはカード自体を描かない（対戦モードと同じ扱い）。

              ★色だけ他のカードと違えている理由★
              このカードだけは「いま選んでいる科目」とは無関係な別の教科へ入る。
              他のカードと同じローズ色にすると、化学基礎の続きに見えてしまう。
              対戦の教科選択・結果・履歴でも理科はバイオレット #7B4FA8 で
              出るようにしてあるので（src/data/externalSubjects.ts）、
              ★入口から中まで同じ色でつながる★ようにしている。 */}
          {onRika && (
            <button
              onClick={onRika}
              aria-label="高校入試 理科を開く"
              className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-2.5 md:py-4 lg:py-3 rounded-[18px] border border-[#D6C4E7]/70 bg-white/90 backdrop-blur-sm hover:bg-[#FAF6FD] hover:border-[#7B4FA8]/50 active:scale-[0.99] transition-all shadow-[0_8px_22px_-14px_rgba(123,79,168,0.45)] text-left group"
            >
              <div className="w-9 h-9 md:w-11 md:h-11 lg:w-10 lg:h-10 rounded-2xl bg-[#D6C4E7]/45 flex items-center justify-center shrink-0">
                <Microscope className="w-5 h-5 text-[#7B4FA8]" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-handwriting font-bold text-[#1B2631] text-base md:text-lg">高校入試 理科</div>
                <div className="text-[11px] md:text-xs text-[#8895A0] font-modern mt-0.5">
                  32単元の演習・まとめ・出題傾向
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#B8C4CE] group-hover:text-[#7B4FA8] group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
            </button>
          )}

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

          {/* 運営からの返信（ご意見を送ってくれた人へのお返事）。
              自分宛の返信が1件もない人には何も表示されない。 */}
          <FeedbackReplyInbox />
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

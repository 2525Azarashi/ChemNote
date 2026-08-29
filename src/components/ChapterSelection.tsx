import React, { useEffect, useMemo, useRef, useState } from 'react';
// ★必ず `import type` と書くこと（`import { type AdvancedFieldId }` にしないこと）★
//   後者は「値の import 文」なので、型しか使っていなくてもモジュールの解決が起き、
//   参照先のファイルが読み込み対象に入ってしまう。`import type` なら完全に消える。
// あわせて参照先も、問題データ本体（chemistryAdvancedData）ではなく
// 分野名だけを持つ葉ファイル（advancedFields）に変えている。
import type { AdvancedFieldId } from '../data/advancedFields';
// 教科ごとの parts は data/allChapters.ts から引く
// （以前はこのファイルで6教科ぶんを個別に import していた）
import { getPartsOfSubject, type SubjectKey } from '../data/allChapters';
import { ChevronRight, ArrowLeft, ChevronDown, GitBranch, TrendingUp, BarChart2, GraduationCap, X, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChapterFlowchartModal } from './ChapterFlowchartModal';
import { TrendModal } from './TrendModal';
import { chemistryBasicTrendDataset } from '../data/trendData';
import { chemistryAdvancedTrendDataset } from '../data/chemistryAdvancedTrendData';
import { DoorMascot } from './DoorMascot';
import { subjectTheme } from '../data/subjectTheme';
import { MolBasicsSection } from './MolBasicsSection';
import { ListeningAudioPlayer } from './ListeningAudioPlayer';
import type { ListeningAudioTrack } from '../data/englishListeningQ1AProblems';
import { buildListeningRounds } from '../utils/listeningRounds';
import { problemKey, readSolvedMap } from '../utils/progress';
// 章 × モードごとの保存キー名は utils/quizStorageKeys.ts が唯一の定義
import {
  quizAnswersKey,
  quizExplKey,
  quizIndexKey,
  quizRunKey,
} from '../utils/quizStorageKeys';
import { auth } from '../firebase';

interface ChapterSelectionProps {
  mode: 'mini_test' | 'practice';
  /**
   * 単元（章）を選んで演習画面へ移るためのハンドラ。
   *
   * @param questionIndex 章の中で最初に開く問題（0始まり）
   * @param resume        保存された解答を引き継ぐか
   * @param range         「この範囲だけを1回として解く」ときの範囲（両端を含む）。
   *                      英語リスニングの「第N回演習」ボタンから渡す。
   *                      省略時は章の全問を通しで解く（化学は従来のまま）。
   */
  onSelectChapter: (
    id: string,
    questionIndex?: number,
    resume?: boolean,
    range?: { startIndex: number; endIndex: number } | null,
  ) => void;
  onBack: () => void;
  /**
   * 表示する科目。省略時は従来どおり化学基礎。
   * 'chemistry' のときは、指定された分野（理論／無機／有機）の単元だけを表示する。
   * 'english_listening' のときは、共通テストの大問を A・B ごとの単元として表示する
   * （第1問A・第1問B …）。各単元のページには「第N回演習」のボタンを並べる。
   */
  subject?: SubjectKey;
  /** 科目が 'chemistry' のときに表示する分野 */
  field?: AdvancedFieldId;
  /** 分野名（画面見出しに出す。化学のときのみ） */
  fieldTitle?: string;
}

// chapterのIDから、対応するtrendDataの情報を取得するマッピング
const chapterIdToTrendUnit: Record<string, { chapterGroupTitle: string; unitId: string }> = {
  'c1_1':   { chapterGroupTitle: '1章 物質の構成', unitId: 'c1_1' },
  'c1_2_A': { chapterGroupTitle: '1章 物質の構成', unitId: 'c1_2_A' },
  'c1_2_B': { chapterGroupTitle: '1章 物質の構成', unitId: 'c1_2_B' },
  'c1_3':   { chapterGroupTitle: '1章 物質の構成', unitId: 'c1_3' },
  'c2_1':   { chapterGroupTitle: '2章 物質の構成粒子', unitId: 'c2_3' },
  'c2_2':   { chapterGroupTitle: '2章 物質の構成粒子', unitId: 'c2_3' },
  'c2_3':   { chapterGroupTitle: '2章 物質の構成粒子', unitId: 'c2_3' },
  'c2_4':   { chapterGroupTitle: '2章 物質の構成粒子', unitId: 'c2_4' },
  'c3_1':   { chapterGroupTitle: '3章 化学結合', unitId: 'c3_5' },
  'c3_2':   { chapterGroupTitle: '3章 化学結合', unitId: 'c3_6' },
  'c3_3':   { chapterGroupTitle: '3章 化学結合', unitId: 'c3_7' },
  'c4_1':   { chapterGroupTitle: '4章 物質量と化学反応式', unitId: 'c4_8' },
  'c4_2':   { chapterGroupTitle: '4章 物質量と化学反応式', unitId: 'c4_9' },
  'c4_3':   { chapterGroupTitle: '4章 物質量と化学反応式', unitId: 'c4_10' },
  'c4_4':   { chapterGroupTitle: '4章 物質量と化学反応式', unitId: 'c4_11' },
  'c5_1':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_12' },
  'c5_2':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_13' },
  'c5_3':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_14' },
  'c5_4':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_15' },
  'c5_5':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_16' },
  'c5_6':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_17' },
  'c5_7':   { chapterGroupTitle: '5章 酸と塩基', unitId: 'c5_18' },
  'c6_1':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_2':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_3':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_4':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_5':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_6':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
  'c6_7':   { chapterGroupTitle: '6章 酸化還元反応', unitId: 'c6_19' },
};

// chapterのrealTitleから、対応するtrendDataのchapterGroupTitleを取得
const realTitleToChapterGroupTitle: Record<string, string> = {
  '1章 物質の構成': '1章 物質の構成',
  '2章 物質の構成粒子': '2章 物質の構成粒子',
  '3章 化学結合': '3章 化学結合',
  '4章 物質量と化学反応式': '4章 物質量と化学反応式',
  '5章 酸と塩基': '5章 酸と塩基',
  '6章 酸化還元反応': '6章 酸化還元反応',
};

// 化学（発展）は単元 ID（a1_1 など）と章名（realTitle）が
// そのまま傾向データ側の ID / chapterGroupTitle と一致するので、
// 手書きの対応表を作らずデータから自動生成する。
const advancedChapterIdToTrendUnit: Record<string, { chapterGroupTitle: string; unitId: string }> =
  Object.fromEntries(
    chemistryAdvancedTrendDataset.chapters.flatMap(chapter =>
      chapter.units.map(unit => [
        unit.id,
        { chapterGroupTitle: chapter.chapterGroupTitle, unitId: unit.id },
      ] as const)
    )
  );

const advancedRealTitleToChapterGroupTitle: Record<string, string> = Object.fromEntries(
  chemistryAdvancedTrendDataset.chapters.map(chapter => [
    chapter.chapterGroupTitle,
    chapter.chapterGroupTitle,
  ])
);

/**
 * parts を「教科書の章（realTitle）」単位のタブにまとめる共通処理。
 * 化学基礎・化学（発展）のどちらも同じ構造なので、そのまま使い回せる。
 */
function buildChapterGroups(parts: any[]) {
  return parts.flatMap((part: any) => {
    const groups = new Map<string, any[]>();

    (part.chapters as any[]).forEach(chapter => {
      const groupTitle = chapter.realTitle || 'その他';
      const chapters = groups.get(groupTitle) || [];
      chapters.push(chapter);
      groups.set(groupTitle, chapters);
    });

    return Array.from(groups, ([title, chapters]) => ({
      title,
      chapters,
      partId: part.id,
      partTitle: part.title,
    }));
  });
}

/**
 * 教科ごとのタブ（章のグループ）。
 *
 * どの教科も realTitle でグループ化するだけで正しいタブになるため、
 * 処理は buildChapterGroups の1本で共通。以前は教科ごとに
 *   const chapterGroups   = buildChapterGroups(chemistryData.parts);
 *   const listeningGroups = buildChapterGroups(englishListeningData.parts);
 *   …（5教科ぶん）
 * と同じ行を並べていたが、教科を足すたびに書き足す必要があった。
 *
 * ★同じ教科なら必ず同じ配列（実体）を返すこと。★
 * groups は useEffect / useMemo の依存に入っているので、
 * 呼ぶたびに新しい配列を作るとタブが毎回作り直され、
 * 開いているタブが勝手に先頭へ戻ってしまう。
 * そのため一度作ったものを教科IDで覚えておく。
 *
 * 参考（各教科の事情はそのまま）：
 * - 英語リスニング：A・B が分かれる大問は realTitle も別（'第1問 A' / '第1問 B'）
 *   なので、この共通処理を通すだけで A・B が独立したタブになる
 * - 英文法：「10章 語法」は 4 単元を抱えるので、1 つのタブに 4 単元が並ぶ
 */
const groupsBySubject = new Map<string, ReturnType<typeof buildChapterGroups>>();

function getChapterGroups(subject: string): ReturnType<typeof buildChapterGroups> {
  const cached = groupsBySubject.get(subject);
  if (cached) return cached;
  const built = buildChapterGroups(getPartsOfSubject(subject));
  groupsBySubject.set(subject, built);
  return built;
}

/**
 * 単元の中に収録されている音源を、回（problem）ごとにまとめて取り出す。
 *
 * ご要望「復習用の音源を聞く場所もしっかりと作って」に対応するためのもの。
 * 問題を解き直さなくても、単元選択の画面からいつでも音源だけを
 * 聞き直せるようにする（＝復習専用の入口）。
 */
function collectAudioSets(
  chapter: any,
): { id: string; title: string; readCount: 1 | 2; tracks: ListeningAudioTrack[] }[] {
  const problems: any[] = [
    ...((chapter?.practiceProblems as any[]) || []),
    ...((chapter?.miniTest as any[]) || []),
  ];
  return problems
    .filter((p) => Array.isArray(p?.audioTracks) && p.audioTracks.length > 0)
    .map((p) => ({
      id: p.id,
      title: p.category || chapter.abstractTitle,
      readCount: (p.readCount || 2) as 1 | 2,
      tracks: p.audioTracks as ListeningAudioTrack[],
    }));
}

/**
 * タブに出す見出しを「小さな添え字（上段）＋ 見出し（下段）」に分解する。
 *
 * - 化学基礎／化学：「1章 物質の構成」→ 上段「1章」／下段「物質の構成」
 * - 英語リスニング：「第1問」        → 上段「Q1」／下段「第1問」
 *                   「第1問 A」      → 上段「Q1A」／下段「第1問 A」
 *   （リスニングの大問には章名が無いので、上段に通し番号を置いて
 *    デザイン（2段組みのタブ）を他科目とまったく同じに保つ）
 *
 * ★A・B の枝番まで上段に出す理由★
 *   第1問 A と第1問 B は設問形式がまったく違う別の練習なので、
 *   タブを横に並べたときに「Q1」が2つ続くと見分けが付かない。
 *   上段を Q1A / Q1B と書き分けることで、狭いスマホ幅でも取り違えない。
 */
function splitTabTitle(title: string, index: number): { kicker: string; label: string } {
  const chapterMatch = title.match(/^(\d+章)\s*(.*)$/);
  if (chapterMatch) {
    return { kicker: chapterMatch[1], label: chapterMatch[2] || title };
  }
  // 「第1問」「第1問 A」「第1問A」のいずれの表記でも拾う
  const questionMatch = title.match(/^第(\d+)問\s*([A-Z]?)$/);
  if (questionMatch) {
    return { kicker: `Q${questionMatch[1]}${questionMatch[2]}`, label: title };
  }
  return { kicker: `${index + 1}章`, label: title };
}

export function ChapterSelection({ mode, onSelectChapter, onBack, subject = 'chemistry_basic', field, fieldTitle }: ChapterSelectionProps) {
  // 科目ごとに画面の作りが変わる箇所だけフラグにしている。
  // （数学・生物基礎はタブの作り方も中身の出し方も共通処理のままなので、
  //   専用のフラグは持たない）
  const isAdvanced = subject === 'chemistry';
  const isListening = subject === 'english_listening';
  const isGrammar = subject === 'english_grammar';
  /**
   * 地理はリスニングと同じく「大問別のタブ（第1問）→ 回ごとの単元」という
   * 2階層なので、この一行がないと今どの科目の画面なのか分からない。
   * タブの作り方（realTitle でまとめる）と中身の出し方は共通処理のまま。
   */
  const isGeography = subject === 'geography';
  /**
   * 科目ごとの配色。
   * これまで覈しのラベル等はすべてダスティローズ直書きだったため、
   * 化学でもリスニングでも同じ色に見えてしまっていた。
   * 色を動的に差し替える部分は Tailwind の JIT が拾えないので style 属性で渡す。
   */
  const theme = subjectTheme(subject);

  /**
   * 表示対象のタブ一覧。
   * - 化学基礎      ：従来どおり全 parts
   * - 化学          ：選択された分野（part）のみに絞る
   * - 英語リスニング：全 parts（前半＝2回読み／後半＝1回読み）
   */
  const groups = useMemo(() => {
    // 化学（発展）だけは分野（理論／無機／有機）で parts を絞るため別扱い。
    // 他の教科は parts をそのまま使うので共通処理で作れる。
    if (isAdvanced) {
      const parts = getPartsOfSubject('chemistry').filter((p: any) => !field || p.field === field);
      return buildChapterGroups(parts);
    }
    // 化学基礎（および想定外の科目）は化学基礎のタブになる（従来どおり）。
    return getChapterGroups(subject);
  }, [isAdvanced, subject, field]);

  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  /**
   * 復習用音源パネルで開いている回（problem.id）。
   * 英語リスニングのみで使う。null なら閉じている。
   */
  const [openAudioSetId, setOpenAudioSetId] = useState<string | null>(null);
  const [activeGroupTitle, setActiveGroupTitle] = useState(groups[0]?.title || '');
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [selectedFlowchart, setSelectedFlowchart] = useState<{ id: string; title: string; questions: any[] } | null>(null);

  /**
   * すでに解いた大問（回）の一覧。
   *
   * ■ なぜ出すのか
   *   「第1回演習〜第14回演習」を並べるだけだと、次にどれをやればいいのか
   *   分からず、同じ回を何度も開いてしまう。解いた回に「済」を付けることで、
   *   まだ手を付けていない回が一目で分かる。
   *
   * ■ 通信しない理由
   *   これは localStorage の台帳（solved_problems_v1_*）を読むだけ。
   *   単元選択を開くたびに通信すると表示が遅くなるので、
   *   すでに手元にある記録だけで描画する。
   */
  const solvedMap = useMemo(
    () => readSolvedMap(auth.currentUser?.uid || 'guest'),
    // 画面に入ったときの一度だけで十分（回を解いたら演習画面を経由して戻ってくる）
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // 分野を切り替えたときは、その分野の先頭の章を開き直す
  useEffect(() => {
    setActiveGroupTitle(groups[0]?.title || '');
    setExpandedChapterId(null);
    setOpenAudioSetId(null);
  }, [groups]);

  // スマホでは選択中のタブを横スクロール領域の中央付近に保つ。
  // PC のグリッド表示では inline 方向にあふれないため、同じ処理でも位置は変わらない。
  useEffect(() => {
    tabRefs.current[activeGroupTitle]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeGroupTitle]);

  const activeGroup = groups.find(group => group.title === activeGroupTitle) || groups[0];

  // 出題傾向データ（科目ごとに切り替える）。リスニングには傾向データがないのでボタンを出さない。
  const trendDataset = isAdvanced ? chemistryAdvancedTrendDataset : chemistryBasicTrendDataset;
  const trendUnitMap = isListening
    ? {}
    : isAdvanced
      ? advancedChapterIdToTrendUnit
      : chapterIdToTrendUnit;
  const trendGroupMap: Record<string, string> = isListening
    ? {}
    : isAdvanced
      ? advancedRealTitleToChapterGroupTitle
      : realTitleToChapterGroupTitle;

  // 出題傾向モーダルの状態
  const [trendModal, setTrendModal] = useState<{
    open: boolean;
    chapterGroupTitle?: string;
    unitId?: string;
  }>({ open: false });
  // チュートリアル（物質量 mol 補講）モーダルの開閉
  const [tutorialOpen, setTutorialOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] min-h-0 w-full flex-col overflow-hidden notebook-paper p-3 pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:p-5 sm:pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:p-6 md:pb-[calc(5.75rem+env(safe-area-inset-bottom))] relative font-handwriting">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-gray-500 hover:text-[#2C3E50] transition-colors font-bold font-handwriting bg-white/80 px-4 py-2 rounded-full shadow-sm z-10"
      >
        <ArrowLeft size={20} />
        <span className="font-handwriting">戻る</span>
      </button>

      <DoorMascot subject={subject} showSpeech={false} size="mini" className="absolute top-3 right-4 md:top-5 md:right-6 w-auto z-10" />

      <div className="shrink-0 text-center mb-3 mt-10 md:mt-0 font-handwriting">
        {/* 化学（発展）では、今どの分野にいるかが分かるよう分野名を添える。 */}
        {isAdvanced && fieldTitle && (
          <p className="mb-1 text-[11px] md:text-xs font-bold tracking-widest" style={{ color: theme.accent }}>
            化学 ／ {fieldTitle}
          </p>
        )}
        {/* 英語リスニングでも、今どの科目にいるかを同じ位置・同じ書式で示す。 */}
        {isListening && (
          <p className="mb-1 text-[11px] md:text-xs font-bold tracking-widest" style={{ color: theme.accent }}>
            英語リスニング ／ 共通テスト大問別
          </p>
        )}
        {/* 英文法も同形。リスニングと同じ「英語」なので、
            この一行がないとどちらの画面にいるのか区別がつかない。 */}
        {isGrammar && (
          <p className="mb-1 text-[11px] md:text-xs font-bold tracking-widest" style={{ color: theme.accent }}>
            英文法 ／ 単元別（4択演習）
          </p>
        )}
        {/* 地理も同形。リスニングと同じ「大問別タブ」の見た目なので、
            この一行がないとどちらの画面にいるのか区別がつかない。 */}
        {isGeography && (
          <p className="mb-1 text-[11px] md:text-xs font-bold tracking-widest" style={{ color: theme.accent }}>
            地理総合・地理探究 ／ 共通テスト大問別
          </p>
        )}
        <h2 className="text-xl md:text-3xl font-handwriting font-bold text-[#2C3E50] mb-1.5 md:mb-2">
          {mode === 'mini_test' ? '小テスト' : '演習問題'}
        </h2>
        <p className="text-sm md:text-base text-gray-600 font-handwriting font-bold">
          学習したい単元を選択してください
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col font-handwriting">
        {/* ================================================================
            章／大問の一覧
            ================================================================
            ■ スマホは横スクロールにする理由
              2列の折り返し一覧はタブだけで縦幅を使い、下の問題を選びにくかった。
              横並び＋スナップにして、問題一覧を見せたまま親指で単元を切り替えられるようにする。
              タブ幅を画面の半分より少し狭くし、次のタブが一部見えることで
              右側にも単元が続くことが分かるようにしている。

            ■ タブレット／PCはグリッドを保つ理由
              横幅がある画面では複数章を一度に見渡せる利点が大きいため、
              sm 以上では従来どおり折り返しグリッドに戻す。
              長い章名は途中で省略せず、タブ内で折り返して全文を表示する。
        */}
        <div className="mb-3 shrink-0 border-b border-slate-200/80">
          <div
            role="tablist"
            aria-label="章を選択"
            className="flex touch-pan-x snap-x snap-mandatory gap-1.5 overflow-x-auto overscroll-x-contain px-0.5 pb-2 [scrollbar-width:thin] sm:grid sm:grid-cols-3 sm:overflow-x-visible sm:overscroll-auto lg:grid-cols-4 xl:grid-cols-5"
          >
            {groups.map((group, index) => {
              const isActive = group.title === activeGroup?.title;
              const { kicker: chapterNumber, label: shortTitle } = splitTabTitle(group.title, index);

              // ★スマホ用チュートリアルタイル（化学基礎のみ）
              //   ご要望「チュートリアルは 3章と4章の間に入れて、下は単元ボタンを
              //   広く表示して」に対応。章タブの横スクロール列の 3章の直後に
              //   チュートリアル入口を差し込み、画面下部の常設バナーはスマホでは
              //   非表示にする（→ 単元一覧の縦スペースが広がる）。
              //   章が3つ未満の科目でも壊れないよう、最後のタブの後ろに出す。
              const tutorialSlot = subject === 'chemistry_basic'
                && (index === 2 || (groups.length <= 3 && index === groups.length - 1));

              return (
                <React.Fragment key={group.title}>
                <button
                  ref={(element) => {
                    tabRefs.current[group.title] = element;
                  }}
                  id={`chapter-tab-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="chapter-tab-panel"
                  onClick={() => {
                    setActiveGroupTitle(group.title);
                    setExpandedChapterId(null);
                    // 大問を切り替えたら、開いていた復習用音源パネルも閉じる
                    // （別の大問の音源が開いたまま残るのを防ぐ）
                    setOpenAudioSetId(null);
                    document.getElementById('chapter-tab-panel')?.scrollTo({ top: 0 });
                  }}
                  className={`flex h-full min-h-[3rem] w-[42vw] min-w-[8.5rem] max-w-[11rem] shrink-0 snap-center flex-col justify-center rounded-xl border px-2.5 py-2 text-left transition-all cursor-pointer sm:w-auto sm:min-w-0 sm:max-w-none sm:shrink ${
                    isActive
                      ? 'border-[#A9CCE3] bg-[#2C3E50] text-white shadow-sm'
                      : 'border-slate-200 bg-white/75 text-slate-600 hover:border-[#A9CCE3] hover:bg-white'
                  }`}
                >
                  <span
                    className="block text-[10px] font-bold leading-none"
                    style={{ color: isActive ? theme.accentSoft : theme.accent }}
                  >
                    {chapterNumber}
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm font-bold leading-snug break-words [overflow-wrap:anywhere]">
                    {shortTitle}
                  </span>
                </button>
                {tutorialSlot && (
                  <button
                    type="button"
                    onClick={() => setTutorialOpen(true)}
                    className="flex h-full min-h-[3rem] w-[42vw] min-w-[8.5rem] max-w-[11rem] shrink-0 snap-center flex-col justify-center rounded-xl border-2 border-[#7c3aed]/40 bg-gradient-to-r from-[#f6f1ff] to-[#efe6ff] px-2.5 py-2 text-left transition-all cursor-pointer hover:border-[#7c3aed] sm:hidden"
                    title="チュートリアル：物質量（mol）がわからない人へ"
                  >
                    <span className="flex items-center gap-1 text-[10px] font-bold leading-none text-[#7c3aed]">
                      <GraduationCap size={11} />
                      チュートリアル
                    </span>
                    <span className="mt-1 block text-xs font-bold leading-snug text-[#3f3352] break-words [overflow-wrap:anywhere]">
                      mol がわからない人へ
                    </span>
                  </button>
                )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {activeGroup && (
          <section
            id="chapter-tab-panel"
            role="tabpanel"
            aria-labelledby={`chapter-tab-${groups.indexOf(activeGroup)}`}
            tabIndex={0}
            className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain rounded-2xl border border-slate-200/80 bg-white/35 p-3 pb-6 sm:p-4 sm:pb-6 [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable]"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
              <div>
                <p className="text-[10px] font-bold" style={{ color: theme.accent }}>{activeGroup.partTitle}</p>
                <h3 className="mt-0.5 text-base sm:text-lg font-bold text-[#2C3E50]">{activeGroup.title}</h3>
              </div>
              {trendGroupMap[activeGroup.title] && (
                <button
                  type="button"
                  onClick={() => setTrendModal({
                    open: true,
                    chapterGroupTitle: trendGroupMap[activeGroup.title],
                  })}
                  className="flex items-center gap-1.5 rounded-lg border border-[#A9CCE3] bg-[#A9CCE3]/15 px-2.5 py-1.5 text-[11px] font-bold text-[#2C3E50] transition-colors hover:bg-[#A9CCE3]/30 cursor-pointer"
                  title={`${activeGroup.title} の共通テスト出題傾向を確認`}
                >
                  <BarChart2 size={13} className="text-[#6FA8C5]" />
                  共通テスト傾向
                </button>
              )}
            </div>

            {/* ================================================================
                英語リスニング：「第N回演習」のボタンを並べる
                ================================================================
                ■ なぜこの形にしたのか（ご要望）
                  これまで「第1問A」を開くと、収録14回分が1本の通し番号
                  （進捗 1/14）でつながっていた。つまり
                    ・今日は第3回だけやりたい
                    ・前にやった第7回だけ解き直したい
                  ができず、必ず頭から通しで解くしかなかった。
                  そこで大問のページを開いた時点で
                  「第1回演習 … 第14回演習」が並ぶ形にして、
                  やりたい回をその場で1タップで始められるようにした。

                ■ 化学と分けている理由
                  化学基礎・化学は「章 → 大問がいくつか」という作りで、
                  回という単位が無い。共通の見た目にすると、かえって
                  どちらの科目でも意味の分からないボタンが並ぶ。
                  そのため、リスニングだけ専用の並べ方にしている。 */}
            {isListening ? (
              <div className="space-y-5">
                {activeGroup.chapters.map((chapter: any) => {
                  const questions = mode === 'mini_test' ? (chapter.miniTest || []) : (chapter.practiceProblems || []);
                  const rounds = buildListeningRounds(questions);
                  const audioSets = collectAudioSets(chapter);

                  return (
                    <div key={chapter.id}>
                      {/* 単元の説明（何を練習する回なのか）。
                          回のボタンだけだと「第1問Aって何をするんだっけ」が分からない。 */}
                      <div className="mb-2.5">
                        {chapter.topics && chapter.topics.length > 0 && (
                          <p className="text-[11px] font-bold leading-relaxed text-slate-500">
                            {chapter.topics.join(' ・ ')}
                          </p>
                        )}
                        <p className="mt-1 text-[10px] font-bold text-slate-400">
                          {rounds.length > 0
                            ? `全${rounds.length}回 ／ 解きたい回を選んでください（1回ずつ完結します）`
                            : 'この大問の問題は準備中です'}
                        </p>
                      </div>

                      {rounds.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                          {rounds.map((round) => {
                            const solved = solvedMap[problemKey(chapter.id, round.questionId)];
                            const audio = audioSets.find((s) => s.id === round.questionId);
                            return (
                              <div
                                key={round.questionId}
                                className={`flex flex-col rounded-xl border p-2.5 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                  solved
                                    ? 'border-[#5BC0BE]/60 bg-[#EAF9F6]'
                                    : 'border-yellow-200/80 bg-[#FFFDF2]/90'
                                }`}
                              >
                                {/* 回のボタン本体。
                                    第4引数で「この回だけ」を範囲として渡すことで、
                                    進捗が 1/1 になり、その回を解き終えた時点で
                                    ちゃんと結果画面に進む。 */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    onSelectChapter(chapter.id, round.index, false, {
                                      startIndex: round.index,
                                      endIndex: round.index,
                                    })
                                  }
                                  className="flex min-w-0 flex-1 flex-col items-start text-left cursor-pointer"
                                  title={`${round.roundLabel}${round.detail ? ` ／ ${round.detail}` : ''}`}
                                >
                                  <span className="flex w-full items-center justify-between gap-1">
                                    <span className="text-[13px] font-bold text-[#2C3E50]">
                                      {round.roundLabel}
                                    </span>
                                    {solved ? (
                                      <span className="shrink-0 rounded-full bg-[#3E9C93] px-1.5 py-0.5 text-[9px] font-bold text-white">
                                        済
                                      </span>
                                    ) : (
                                      <ChevronRight size={13} className="shrink-0 text-[#A9CCE3]" />
                                    )}
                                  </span>
                                  {round.detail && (
                                    <span className="mt-1 line-clamp-2 text-[10px] font-bold leading-snug text-slate-500">
                                      {round.detail}
                                    </span>
                                  )}
                                </button>

                                {/* 回ごとの復習用音源。
                                    問題を解き直さなくても、この回の音声だけを聞ける。 */}
                                {audio && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenAudioSetId(openAudioSetId === audio.id ? null : audio.id)
                                    }
                                    aria-expanded={openAudioSetId === audio.id}
                                    className={`mt-2 inline-flex items-center justify-center gap-1 rounded-lg border px-1.5 py-1 text-[10px] font-bold transition-colors cursor-pointer ${
                                      openAudioSetId === audio.id
                                        ? 'border-[#3E9C93] bg-[#3E9C93] text-white'
                                        : 'border-[#5BC0BE]/60 bg-white text-[#2F7C74] hover:bg-[#D8F3EE]'
                                    }`}
                                    title={`${round.roundLabel} の音源だけを聞く`}
                                  >
                                    <Headphones size={11} />
                                    音源
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-slate-200 bg-white/70 p-4 text-center text-[11px] font-bold text-slate-400">
                          準備中（問題は順次追加しています）
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeGroup.chapters.map(chapter => {
                const questions = mode === 'mini_test' ? (chapter.miniTest || []) : (chapter.practiceProblems || []);
                const hasQuestions = questions.length > 0;
                const savedIndex = Math.max(0, Math.min(
                  questions.length - 1,
                  parseInt(localStorage.getItem(quizIndexKey(chapter.id, mode)) || '0', 10) || 0
                ));
                const hasSavedProgress = hasQuestions && (
                  savedIndex > 0 ||
                  localStorage.getItem(quizExplKey(chapter.id, mode)) === 'true' ||
                  !!localStorage.getItem(quizRunKey(chapter.id, mode)) ||
                  (() => {
                    try { return Object.keys(JSON.parse(localStorage.getItem(quizAnswersKey(chapter.id, mode)) || '{}')).length > 0; }
                    catch { return false; }
                  })()
                );
                const trendInfo = trendUnitMap[chapter.id];
                // 英語リスニング・英文法の単元に収録されている音源（回ごと）。
                // 1つでもあれば「復習用音源」ボタンをカードに出す。
                //
                // ★英文法を含める理由★
                //   英文法の各問も「空所を埋めた完成文」の音源を持っている。
                //   正しい形を音で通しておくと「音の違和感」で誤答を切れるように
                //   なるので、問題を解き直さなくても聞き直せる入口を単元画面に置く。
                const audioSets = isListening || isGrammar ? collectAudioSets(chapter) : [];
                const hasAudio = audioSets.length > 0;

                return (
                  <article
                    key={chapter.id}
                    className="flex min-h-[148px] flex-col justify-between rounded-xl border border-yellow-200/80 bg-[#FFFDF2]/90 p-3 text-left shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div>
                      <h4 className="text-sm font-bold leading-tight text-[#2C3E50]">{chapter.abstractTitle}</h4>
                      {chapter.topics && chapter.topics.length > 0 && (
                        <p className="mt-1.5 line-clamp-2 text-[11px] font-bold leading-relaxed text-slate-500">
                          {chapter.topics.join(' ・ ')}
                        </p>
                      )}

                      {trendInfo && (
                        <button
                          type="button"
                          onClick={() => setTrendModal({
                            open: true,
                            chapterGroupTitle: trendInfo.chapterGroupTitle,
                            unitId: trendInfo.unitId,
                          })}
                          className="mt-2 inline-flex items-center gap-1 rounded-md border border-orange-200 bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600 transition-colors hover:bg-orange-100 cursor-pointer"
                          title="この単元の共通テスト出題傾向を確認"
                        >
                          <TrendingUp size={11} />
                          出題傾向
                        </button>
                      )}
                    </div>

                    <div className="mt-3 border-t border-yellow-200/70 pt-2.5">
                      <div className="flex flex-wrap items-center gap-1.5 font-bold">
                        {hasQuestions ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onSelectChapter(chapter.id, 0, false)}
                              className="flex-1 min-w-[82px] rounded-lg bg-[#2C3E50] px-2.5 py-1.5 text-center text-[11px] text-white transition-colors hover:bg-[#1B2631] cursor-pointer"
                            >
                              最初から
                            </button>
                            {hasSavedProgress && (
                              <button
                                type="button"
                                onClick={() => onSelectChapter(chapter.id, savedIndex, true)}
                                className="flex-1 min-w-[82px] rounded-lg px-2.5 py-1.5 text-center text-[11px] text-white transition-opacity hover:opacity-85 cursor-pointer"
                                style={{ backgroundColor: theme.accent }}
                              >
                                続きから
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="rounded-lg bg-slate-100/70 px-2.5 py-1.5 text-[11px] text-slate-400">準備中</span>
                        )}

                        {/* ★復習用の音源（英語リスニングのみ）
                            問題を解き直さなくても音源だけを聞き直せる入口。
                            ヘッドホンアイコン＋ミントの配色で、他のボタンから
                            一目で区別できるようにしている。 */}
                        {hasAudio && (
                          <button
                            type="button"
                            onClick={() => {
                              const first = audioSets[0].id;
                              setOpenAudioSetId(openAudioSetId === first ? null : first);
                            }}
                            aria-expanded={openAudioSetId === audioSets[0].id}
                            className={`inline-flex items-center gap-1 rounded-lg border p-1.5 text-[10px] font-bold transition-colors cursor-pointer ${
                              openAudioSetId === audioSets[0].id
                                ? 'border-[#3E9C93] bg-[#3E9C93] text-white'
                                : 'border-[#5BC0BE]/60 bg-[#EAF9F6] text-[#2F7C74] hover:bg-[#D8F3EE]'
                            }`}
                            title="復習用の音源を聞く（問題を解かずに音声だけ再生）"
                          >
                            <Headphones size={12} />
                            音源
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedFlowchart({ id: chapter.id, title: chapter.abstractTitle, questions })}
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 p-1.5 text-[10px] font-bold text-emerald-800 transition-colors hover:bg-emerald-100 cursor-pointer"
                          title="単元のフローチャートを確認"
                        >
                          <GitBranch size={12} className="text-emerald-600" />
                          <span className="hidden sm:inline">フロー</span>
                        </button>

                        {hasQuestions && questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setExpandedChapterId(expandedChapterId === chapter.id ? null : chapter.id)}
                            aria-expanded={expandedChapterId === chapter.id}
                            className={`inline-flex items-center gap-1 rounded-lg border p-1.5 text-[10px] font-bold transition-colors cursor-pointer ${
                              expandedChapterId === chapter.id
                                ? 'border-[#A9CCE3] bg-[#A9CCE3] text-white'
                                : 'border-slate-200 bg-white text-[#2C3E50] hover:bg-slate-50'
                            }`}
                          >
                            問題
                            <ChevronDown size={12} className={`transition-transform ${expandedChapterId === chapter.id ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {expandedChapterId === chapter.id && hasQuestions && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 max-h-[126px] space-y-1 overflow-y-auto rounded-lg border border-yellow-200 bg-white/80 p-1.5 shadow-inner"
                          >
                            {questions.map((question: any, questionIndex: number) => (
                              <button
                                key={question.id}
                                type="button"
                                onClick={() => onSelectChapter(chapter.id, questionIndex, false)}
                                className="flex w-full items-center justify-between rounded-md border border-transparent bg-white/70 p-1.5 text-left text-[10px] font-bold text-slate-600 transition-colors hover:border-[#A9CCE3]/40 hover:bg-[#A9CCE3]/10 cursor-pointer"
                              >
                                <span className="truncate pr-1.5">{question.category || `問 ${questionIndex + 1}`}</span>
                                <ChevronRight size={11} className="shrink-0 text-[#A9CCE3]" />
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </article>
                );
              })}
            </div>
            )}

            {/* ================================================================
                復習用の音源を聞く場所（英語リスニングのみ）
                ================================================================
                ご要望「復習用の音源を聞く場所もしっかりと作って」に対応。

                ・単元カードは横4列のグリッドで幅が狭いため、プレーヤー本体は
                  グリッドの**下に全幅**で開く（スクリプトや語句が読める幅を確保）。
                ・カード側の「音源」ボタンと連動し、押した回のパネルが開く。
                ・問題を解かなくても再生できるので、通学中の聞き直しに使える。 */}
            {(isListening || isGrammar) && (
              <AnimatePresence initial={false}>
                {(() => {
                  const sets = activeGroup.chapters.flatMap((c: any) => collectAudioSets(c));
                  const target = sets.find((s) => s.id === openAudioSetId);
                  if (!target) return null;
                  return (
                    <motion.div
                      key={target.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3">
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          {/* 色は科目テーマに揃える。
                              リスニングは従来のミントをそのまま使い続ける（見た目不変）。 */}
                          <p
                            className={
                              isGrammar
                                ? 'text-[11px] font-bold text-[#9D5C24]'
                                : 'text-[11px] font-bold text-[#2F7C74]'
                            }
                          >
                            復習用音源 ／ {target.title}
                          </p>
                          <button
                            type="button"
                            onClick={() => setOpenAudioSetId(null)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-500 transition-colors hover:bg-slate-50 cursor-pointer"
                          >
                            <X size={11} />
                            閉じる
                          </button>
                        </div>
                        <ListeningAudioPlayer
                          tracks={target.tracks}
                          mode="review"
                          tone="light"
                          readCount={target.readCount}
                          title="復習用の音源を聞く"
                        />
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            )}
          </section>
        )}

        {/* ========== チュートリアル（単元選択の下） ==========
            物質量（mol）の考え方を配布プリントそのままの途中式で学べる
            「物質量（mol）がわからない人へ」をチュートリアルとして常設表示する。
            ※ mol は化学基礎の内容なので、化学（発展）では表示しない。 */}
        {/* スマホでは章タブ列にチュートリアル入口を移したので、
            この常設バナーは sm 以上（タブレット・PC）だけに表示する。
            → スマホは単元一覧（①・②…のカード）が縦に広く使える。 */}
        {subject === 'chemistry_basic' && (
        <div className="hidden sm:block shrink-0 mt-3">
          <button
            type="button"
            onClick={() => setTutorialOpen(true)}
            className="w-full flex items-center justify-between gap-3 rounded-2xl border-2 border-[#7c3aed]/35 bg-gradient-to-r from-[#f6f1ff] to-[#efe6ff] px-4 py-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
            title="チュートリアル：物質量（mol）がわからない人へ"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7c3aed] text-white shadow-md">
                <GraduationCap size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold tracking-widest text-[#7c3aed]">チュートリアル</p>
                <p className="truncate text-sm sm:text-base font-bold text-[#3f3352]">
                  物質量（mol）がわからない人へ
                </p>
                <p className="hidden sm:block truncate text-[11px] font-bold text-[#6b6280]">
                  「スタートは？ゴールは？」単位変換の図と同じ途中式で mol 計算を根本から理解する
                </p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#7c3aed] px-3 py-1.5 text-[11px] font-bold text-white">
              開く
              <ChevronRight size={13} />
            </span>
          </button>
        </div>
        )}
      </div>

      {/* チュートリアル全画面モーダル */}
      <AnimatePresence>
        {tutorialOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex flex-col bg-black/45 backdrop-blur-sm"
            onClick={() => setTutorialOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-auto my-3 flex h-[calc(100dvh-1.5rem)] w-[min(60rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-2xl bg-[#fbf8ff] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#c9bce6] bg-white/90 px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <GraduationCap size={18} className="shrink-0 text-[#7c3aed]" />
                  <span className="truncate text-sm sm:text-base font-bold text-[#3f3352]">
                    チュートリアル：物質量（mol）がわからない人へ
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTutorialOpen(false)}
                  className="flex shrink-0 items-center gap-1 rounded-full border border-[#c9bce6] bg-white px-3 py-1.5 text-xs font-bold text-[#5b21b6] transition-colors hover:bg-[#f3ecff] cursor-pointer"
                >
                  <X size={14} />
                  閉じる
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-6 sm:px-5 [-webkit-overflow-scrolling:touch]">
                <MolBasicsSection showHeader={false} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter Flowchart Viewer Modal */}
      <AnimatePresence>
        {selectedFlowchart && (
          <ChapterFlowchartModal 
            chapterId={selectedFlowchart.id}
            chapterTitle={selectedFlowchart.title}
            questions={selectedFlowchart.questions}
            onClose={() => setSelectedFlowchart(null)}
            onSelectQuestion={(qIdx) => onSelectChapter(selectedFlowchart.id, qIdx, false)}
          />
        )}
      </AnimatePresence>

      {/* 出題傾向モーダル */}
      {trendModal.open && (
        <TrendModal
          onClose={() => setTrendModal({ open: false })}
          targetChapterGroupTitle={trendModal.chapterGroupTitle}
          targetUnitId={trendModal.unitId}
          dataset={trendDataset}
        />
      )}
    </div>
  );
}

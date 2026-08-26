import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Trash2,
  Clock,
  Star,
  BookOpen,
  Sparkles,
  Flame,
  NotebookPen,
  ChevronDown,
  PenLine,
} from 'lucide-react';
import { auth } from '../firebase';
import {
  getAllReviewItems,
  getDueReviewItems,
  markReviewedCorrect,
  markReviewedWrong,
  removeReviewItem,
  isMastered,
  type ReviewItem,
} from '../utils/reviewList';
import { ForgettingCurveChart } from './ForgettingCurveChart';
import { stripHtmlToText } from '../utils/sanitizeHtml';
import {
  ALL_SUBJECTS,
  badgesForItem,
  filterBySubjectTab,
  formatDue,
  formatScope,
  retentionOf,
  reviewSubjectStyle,
  subjectOfReviewItem,
  summarizeBySubject,
  summarizeQuestion,
  truncate,
  REVIEW_SUBJECT_LABELS,
  type SubjectTabId,
} from '../utils/reviewSubject';

/**
 * StudyHub — 「ノート」と「復習リスト」を1画面に統合した学習ハブ。
 *
 * 設計意図（なぜこの形にしたか）:
 *   - 従来はホームに「ノートを見る」「復習リスト」という2つの入口が並び、
 *     ユーザーは“復習すべきもの”を探すのに2画面を行き来していた。
 *   - この2機能は本質的に「復習ハブ」という同じゴールを持つが、性質が異なる:
 *       ・復習リスト = 誤答を自動キャプチャ + 忘却曲線(間隔反復)で自動スケジュール
 *       ・ノート    = 自分で保存したまとめ/メモ/重要マーク（手動キュレーション）
 *   - そこで「1つのハブ」に統合し、冒頭に “今日の復習” を自動提示（今やるべきことが一目でわかる）、
 *     その下でノートと復習項目を横断できるタブを用意した。
 *   - 自動(誤答)/手動(ノート)は色・アイコン・ラベルで視覚的に区別し、迷わず対象に到達できるようにした。
 *   - 忘却曲線の自動スケジュール（学習効率の要）は保持しつつ、入口だけを一本化する。
 */

interface StudyHubProps {
  onBack: () => void;
  isGuest: boolean;
  /** ノート詳細を開く（既存の NoteDetail 画面へ） */
  onSelectNote: (note: any) => void;
  /** 復習アイテム／ノートから、対応する演習問題へ直接遷移する（要件5） */
  onReview?: (target: any) => void;
}

type Tab = 'today' | 'notes' | 'important' | 'all';

// ============================================================
// 表示用の小道具
// ============================================================

// 一覧のプレビュー用にHTMLタグを落としてテキストだけにする。
//
// ★以前は innerHTML に代入して textContent を読み出していた★
//   <script> は実行されないが、<img src=x onerror=...> は
//   HTMLの解析時に読み込みが走り onerror が発火し得る。
//   DOMを一切作らない共通実装に統一した。
const stripHtml = stripHtmlToText;

// truncate / formatDue は復習リスト画面（ReviewList.tsx）と同じ表示に
// しなければならないので、utils/reviewSubject.ts の1つだけを使う
// （以前はここにも同じ実装があった）。

// ============================================================
// 復習アイテム カード（自動キャプチャ = 誤答）
// ============================================================

interface ReviewCardProps {
  item: ReviewItem;
  now: number;
  onCorrect: (key: string) => void;
  onWrong: (key: string) => void;
  onRemove: (key: string) => void;
  onReview?: (item: ReviewItem) => void;
  /** 科目名を出すか（「すべて」タブでは出し、科目タブでは冗長なので出さない） */
  showSubject?: boolean;
}

/**
 * 復習カード（自動キャプチャ = 誤答）
 *
 * ■ 何を直したか
 *   以前のカードは常時、
 *     「苦手（自動）」バッジ / 章名バッジ / 第N問バッジ / 予定日バッジ /
 *      問題文90文字 / 正答 / あなたの解答 / 間違い回数・復習正解回数・定着度 /
 *      ボタン4つ
 *   を全部出していた。1枚で9要素あり、リストが数件並ぶだけで
 *   「どれを次にやるか」を選べない情報量になっていた。
 *
 * ■ どう再設計したか（要件2）
 *   閉じているときは3行に固定する。
 *     1行目: 出題範囲（第2回 第1問 A／1章 物質の状態と平衡 第3問）
 *     2行目: 設問の要約（最初の1文だけ・末尾は省略記号）
 *     3行目: バッジ（苦手／定着）を右寄せで最大2つ
 *   正答・自分の解答・復習回数・予定日・操作ボタンは
 *   カードをタップして開いたときだけ出す。
 *
 *   カード全体をボタンにすると、中の「できた」等のボタンと
 *   入れ子になってしまう（HTML的に不正で、スクリーンリーダーでも壊れる）。
 *   そこで開閉のトリガは見出し部分の <button> に限定し、
 *   詳細の操作ボタンはその外側に置いている。
 */
const ReviewCard: React.FC<ReviewCardProps> = ({
  item,
  now,
  onCorrect,
  onWrong,
  onRemove,
  onReview,
  showSubject = false,
}) => {
  const [open, setOpen] = useState(false);
  const due = item.dueAt <= now;
  const mastered = isMastered(item);
  const retention = Math.round(retentionOf(item) * 100);
  const subject = subjectOfReviewItem(item);
  const style = reviewSubjectStyle(subject);
  const badges = badgesForItem(item);
  const detailId = `review-detail-${item.key}`;

  return (
    <li
      className={`relative overflow-hidden rounded-2xl border shadow-sm transition-colors ${
        due ? 'bg-[#FFF6F9] border-[#F4A9C4]/60' : 'bg-white border-gray-100'
      }`}
    >
      {/*
        左端の色帯で科目を示す。
        バッジを1つ増やすより場所を取らず、リストを縦に流し読みしても
        「化学基礎の問題が続いている」ことが色で分かる。
      */}
      <span
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.stripeClass}`}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={detailId}
        className="w-full text-left pl-5 pr-4 py-4 sm:pl-6 sm:pr-5 sm:py-5 cursor-pointer"
      >
        {/* 1行目: 出題範囲 */}
        <div className="flex items-center gap-2">
          {showSubject && (
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold border ${style.textClass} ${style.bgClass} ${style.borderClass}`}
            >
              {REVIEW_SUBJECT_LABELS[subject]}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-xs sm:text-[13px] font-bold text-gray-500">
            {formatScope(item)}
          </span>
          <ChevronDown
            size={18}
            className={`shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>

        {/* 2行目: 設問の要約（1文・省略記号つき） */}
        <p className="mt-2 text-[15px] sm:text-base font-bold text-[#2C3E50] leading-relaxed break-words [overflow-wrap:anywhere] font-handwriting line-clamp-2">
          {summarizeQuestion(item.questionText)}
        </p>

        {/* 3行目: タグ類（右寄せ・最大2つ） */}
        <div className="mt-3 flex items-center justify-end gap-1.5">
          {badges.map((b) => (
            <span
              key={b.kind}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                b.kind === 'weak'
                  ? 'bg-[#E8688E]/10 text-[#C0392B] border-[#E8688E]/30'
                  : b.kind === 'mastered'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {b.kind === 'weak' && <Flame size={10} aria-hidden="true" />}
              {b.kind === 'mastered' && <CheckCircle2 size={10} aria-hidden="true" />}
              {b.label}
            </span>
          ))}
        </div>
      </button>

      {/* ===== 詳細（タップで展開）===== */}
      {open && (
        <div id={detailId} className="pl-5 pr-4 pb-4 sm:pl-6 sm:pr-5 sm:pb-5">
          <div className="border-t border-gray-100 pt-3 space-y-2">
            {/* 予定日・回数などの補足情報はここに集約する */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} aria-hidden="true" />
                {formatDue(item.dueAt, now)}
              </span>
              <span>間違い {item.wrongCount}回</span>
              <span>復習正解 {item.correctCount}回</span>
              <span>定着度 {retention}%</span>
              {mastered && <span className="text-emerald-600 font-bold">習得済み</span>}
            </div>

            {(item.correctAnswer || item.lastWrongAnswer) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {item.correctAnswer && (
                  <div className="text-emerald-700">
                    <span className="font-bold">正答: </span>
                    <span className="font-math">{item.correctAnswer}</span>
                  </div>
                )}
                {item.lastWrongAnswer && (
                  <div className="text-[#C0392B]">
                    <span className="font-bold">あなたの解答: </span>
                    <span className="font-math">{item.lastWrongAnswer}</span>
                  </div>
                )}
              </div>
            )}

            {/* 問題文の続き（要約で切り落とした分をここで補う） */}
            {item.questionText && (
              <p className="text-[13px] text-gray-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                {truncate(stripHtml(item.questionText), 160)}
              </p>
            )}

            {/* アクション */}
            <div className="pt-1 flex flex-wrap gap-2">
              {onReview && (
                <button
                  onClick={() => onReview(item)}
                  aria-label="この問題を解き直す"
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg bg-[#2C3E50] text-white text-sm font-bold hover:bg-[#1B2631] transition-colors"
                >
                  <PenLine size={16} aria-hidden="true" /> 解いてみる
                </button>
              )}
              <button
                onClick={() => onCorrect(item.key)}
                aria-label="復習で正解にする"
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors"
              >
                <CheckCircle2 size={16} aria-hidden="true" /> できた
              </button>
              <button
                onClick={() => onWrong(item.key)}
                aria-label="復習でまだ苦手にする"
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg bg-amber-100 text-amber-800 text-sm font-bold hover:bg-amber-200 transition-colors border border-amber-200"
              >
                <RotateCcw size={16} aria-hidden="true" /> まだ苦手
              </button>
              <button
                onClick={() => onRemove(item.key)}
                aria-label="復習リストから削除"
                title="復習リストから削除"
                className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg bg-white text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors border border-gray-200 ml-auto"
              >
                <Trash2 size={16} aria-hidden="true" /> 削除
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

// ============================================================
// 「もっと見る」で展開する復習リスト
// ============================================================

interface CollapsibleReviewListProps {
  items: ReviewItem[];
  now: number;
  onCorrect: (key: string) => void;
  onWrong: (key: string) => void;
  onRemove: (key: string) => void;
  onReview?: (item: ReviewItem) => void;
  showSubject?: boolean;
  /** 最初に見せる件数（要件4: 既定3件） */
  initialCount?: number;
}

/**
 * 要件4: カードリストは既定で3件だけ表示し、「もっと見る」で全件に広げる。
 *
 * 「今日の復習が20件」のような状態でも、開いた直後に見えるのは3件なので
 * グラフとサマリーが画面外に押し出されない。
 * 件数が initialCount 以下のときはボタン自体を出さない（無意味な操作を作らない）。
 */
const CollapsibleReviewList: React.FC<CollapsibleReviewListProps> = ({
  items,
  now,
  onCorrect,
  onWrong,
  onRemove,
  onReview,
  showSubject = false,
  initialCount = 3,
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > initialCount;
  const visible = expanded || !hasMore ? items : items.slice(0, initialCount);
  const hiddenCount = items.length - visible.length;

  return (
    <>
      <ul className="space-y-3">
        {visible.map((it) => (
          <ReviewCard
            key={it.key}
            item={it}
            now={now}
            onCorrect={onCorrect}
            onWrong={onWrong}
            onRemove={onRemove}
            onReview={onReview}
            showSubject={showSubject}
          />
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-3 w-full min-h-[44px] rounded-xl border border-gray-200 bg-white/80 text-sm font-bold text-[#2C6187] hover:bg-white transition-colors cursor-pointer"
        >
          {expanded ? '表示を減らす' : `もっと見る（あと${hiddenCount}件）`}
        </button>
      )}
    </>
  );
};

// ============================================================
// ノート カード（手動キュレーション）
// ============================================================

interface NoteCardProps {
  note: any;
  onSelect: (note: any) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onSelect }) => {
  return (
    <li
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-[#A9CCE3]/50 transition-all"
      onClick={() => onSelect(note)}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {/* 種別バッジ: 手動（ノート） */}
        <span className="inline-flex items-center gap-1 bg-[#A9CCE3]/15 text-[#2C6187] px-2 py-0.5 rounded text-[10px] font-bold border border-[#A9CCE3]/50">
          <NotebookPen size={11} aria-hidden="true" /> マイノート
        </span>
        {note.chapterTitle && (
          <span className="bg-[#A9CCE3]/20 text-[#2C3E50] px-2 py-0.5 rounded text-[10px] font-bold border border-[#A9CCE3]/50">
            {note.chapterTitle}
          </span>
        )}
        {note.questionIndex && (
          <span className="bg-[#F9E79F]/30 text-[#D35400] px-2 py-0.5 rounded text-[10px] font-bold border border-[#F5B041]/50">
            第{note.questionIndex}問
          </span>
        )}
        {note.isImportant && (
          <span className="ml-auto inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-[10px] font-bold border border-yellow-300">
            <Star size={11} fill="currentColor" aria-hidden="true" /> 重要
          </span>
        )}
      </div>

      <h3 className="font-bold text-[#2C3E50] leading-relaxed break-words [overflow-wrap:anywhere] font-handwriting text-lg">
        {truncate(stripHtml(note.question) || '（問題文なし）', 70)}
      </h3>
      <p className="text-sm text-gray-500 mt-1 break-words [overflow-wrap:anywhere]">
        {note.memo ? truncate(note.memo, 60) : 'メモなし'}
      </p>

      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {note.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && <span className="text-[10px] text-gray-500">+{note.tags.length - 3}</span>}
        </div>
      )}
    </li>
  );
};

// ============================================================
// メイン
// ============================================================

export function StudyHub({ onBack, isGuest, onSelectNote, onReview }: StudyHubProps) {
  const uid = auth.currentUser?.uid || (isGuest ? 'guest' : null);

  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>('today');
  const [now, setNow] = useState(() => Date.now());
  const [todayOpen, setTodayOpen] = useState(true);

  const loadNotes = () => {
    try {
      const raw = localStorage.getItem(`notes_${uid || 'guest'}`);
      const list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) return [];
      // 重要 → 新しい順
      list.sort((a: any, b: any) => {
        if (!!a.isImportant !== !!b.isImportant) return (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0);
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      return list;
    } catch {
      return [];
    }
  };

  const refresh = () => {
    setNow(Date.now());
    setReviewItems(getAllReviewItems(uid));
    setNotes(loadNotes());
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- 科目タブ（要件1）----------------------------------------
  //
  // 科目の一覧は「実際に復習アイテムがある科目」だけから作る。
  // 固定の3科目を常に並べると、化学基礎しか解いていない人にも
  // 空の「化学」「英語」タブが出てしまい、押しても何も無い体験になる。
  const subjectSummaries = useMemo(() => summarizeBySubject(reviewItems, now), [reviewItems, now]);

  // 選択中の科目タブ。既定は「すべて」（従来どおりの俯瞰表示）。
  const [subjectTab, setSubjectTab] = useState<SubjectTabId>(ALL_SUBJECTS);

  // 表示中の科目が無くなった場合（最後の1問を削除した等）は
  // 選択が宙に浮くので「すべて」に戻す。
  useEffect(() => {
    if (subjectTab === ALL_SUBJECTS) return;
    if (!subjectSummaries.some((s) => s.subject === subjectTab)) {
      setSubjectTab(ALL_SUBJECTS);
    }
  }, [subjectSummaries, subjectTab]);

  /** 選択中の科目に属する復習アイテム（グラフ・リストの両方がこれを見る＝要件4の連動） */
  const scopedItems = useMemo(
    () => filterBySubjectTab(reviewItems, subjectTab),
    [reviewItems, subjectTab]
  );

  /** 選択中の科目のうち、いま復習すべきもの */
  const scopedDueItems = useMemo(
    () =>
      scopedItems
        .filter((it) => it.dueAt <= now)
        .sort((a, b) => a.dueAt - b.dueAt || b.wrongCount - a.wrongCount),
    [scopedItems, now]
  );

  /** グラフ見出しに出す科目名（「すべて」のときは付けない） */
  const scopedSubjectLabel =
    subjectTab === ALL_SUBJECTS ? undefined : REVIEW_SUBJECT_LABELS[subjectTab];

  const dueItems = useMemo(() => getDueReviewItems(uid, now), [reviewItems, now, uid]);
  const masteredCount = useMemo(() => reviewItems.filter(isMastered).length, [reviewItems]);
  const importantNotes = useMemo(() => notes.filter((n) => n.isImportant), [notes]);

  const handleCorrect = (key: string) => {
    markReviewedCorrect(uid, key);
    refresh();
  };
  const handleWrong = (key: string) => {
    markReviewedWrong(uid, key);
    refresh();
  };
  const handleRemove = (key: string) => {
    removeReviewItem(uid, key);
    refresh();
  };

  // タブごとの表示内容。
  // 復習系（今日の復習／すべて）の件数は科目タブの選択に連動させる。
  // ノートは chapterId を持たない自由記述なので科目で絞らない。
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'today', label: '今日の復習', count: scopedDueItems.length },
    { id: 'notes', label: 'マイノート', count: notes.length },
    { id: 'important', label: '重要', count: importantNotes.length },
    { id: 'all', label: 'すべて', count: scopedItems.length + notes.length },
  ];

  return (
    // 要件5：学習ノート画面の背景を罫線（ノートの横線）にし、手書き風フォントで統一。
    <div className="w-full min-h-screen notebook-paper font-handwriting pb-28 md:pb-12">
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-5">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            aria-label="ホームに戻る"
            title="ホームに戻る"
            className="flex items-center justify-center w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-gray-100 hover:bg-gray-200 text-[#2C3E50] transition-colors shadow-sm border border-gray-200"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] font-handwriting">学習ノート</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              今日の復習とあなたのノートを、ここでまとめて管理できます
            </p>
          </div>
        </div>

        {/*
          サマリー（要件4「今日の復習の件数バッジは維持」）。
          ここは科目タブの選択に関係なく、常に全科目の合計を出す。
          科目を絞っている最中でも「まだ他の科目に残っている」ことが
          分かるようにするため、あえて連動させていない。
        */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <div className="text-2xl font-bold text-[#E8688E]">{dueItems.length}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">今日の復習（全科目）</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <div className="text-2xl font-bold text-[#2C6187]">{notes.length}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">マイノート</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{masteredCount}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">習得済み</div>
          </div>
        </div>

        {/*
          ===== 科目タブ（要件1）=====
          ここでの選択が、下のグラフと「今日の復習」リストの両方を同時に絞る。
          科目が1つしか無いユーザーには「すべて」だけを出しても意味がないので、
          2科目以上ある場合にのみタブ列を表示する。
        */}
        {subjectSummaries.length > 1 && (
          <div
            role="tablist"
            aria-label="科目を選択"
            className="flex flex-wrap gap-2"
          >
            {[
              {
                id: ALL_SUBJECTS as SubjectTabId,
                label: 'すべて',
                total: reviewItems.length,
                avg: null as number | null,
              },
              ...subjectSummaries.map((s) => ({
                id: s.subject as SubjectTabId,
                label: s.shortLabel,
                total: s.total,
                avg: s.avgRetention as number | null,
              })),
            ].map((t) => {
              const isActive = subjectTab === t.id;
              const style =
                t.id === ALL_SUBJECTS ? null : reviewSubjectStyle(t.id as any);
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="subject-scoped-panel"
                  onClick={() => setSubjectTab(t.id)}
                  className={`min-h-[44px] px-3 rounded-xl border text-left transition-colors cursor-pointer ${
                    isActive
                      ? style
                        ? style.activeClass
                        : 'bg-[#2C3E50] text-white border-[#2C3E50]'
                      : 'bg-white/80 text-gray-600 border-gray-200 hover:bg-white'
                  }`}
                >
                  <span className="block text-sm font-bold leading-tight">
                    {t.label}
                    <span className={`ml-1 text-[11px] font-bold ${isActive ? 'opacity-90' : 'text-gray-400'}`}>
                      {t.total}
                    </span>
                  </span>
                  {/*
                    科目ごとの平均定着度（要件1）。
                    タブ上に出すことで、切り替える前に
                    「どの科目が弱っているか」を比較できる。
                  */}
                  <span className={`block text-[10px] leading-tight ${isActive ? 'opacity-80' : 'text-gray-400'}`}>
                    {t.avg === null ? '全科目' : `定着 ${t.avg}%`}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 科目タブで絞られる領域（グラフ＋今日の復習） */}
        <div id="subject-scoped-panel" role="tabpanel" className="space-y-5">
          {/* ===== 忘却曲線グラフ（解答日時→定着度の可視化） ===== */}
          <ForgettingCurveChart items={scopedItems} now={now} subjectLabel={scopedSubjectLabel} />

          {/* ===== 今日の復習セクション（冒頭に自動表示） ===== */}
          {scopedDueItems.length > 0 && (
            <section className="bg-gradient-to-br from-[#FFF1F5] to-[#FDFBF7] rounded-2xl border border-[#F4A9C4]/50 shadow-sm p-4 sm:p-5">
              <button
                onClick={() => setTodayOpen((v) => !v)}
                className="w-full flex items-center gap-2 text-left cursor-pointer"
                aria-expanded={todayOpen}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FBE0E9] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#E8688E]" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#1B2631] font-handwriting text-lg leading-tight">
                    今日の復習 <span className="text-[#E8688E]">{scopedDueItems.length}</span> 件
                    {scopedSubjectLabel && (
                      <span className="ml-1 text-xs font-bold text-gray-400">
                        （{scopedSubjectLabel}）
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500">忘却曲線にそって、いま復習すべき問題です</div>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 shrink-0 transition-transform ${todayOpen ? 'rotate-0' : '-rotate-90'}`}
                  aria-hidden="true"
                />
              </button>

              {todayOpen && (
                <div className="mt-4">
                  {/*
                    要件4: 既定は3件だけ。残りは「もっと見る」で展開する。
                    「すべて」タブのときだけカードに科目名を出す
                    （科目タブでは全件が同じ科目なので冗長）。
                  */}
                  <CollapsibleReviewList
                    items={scopedDueItems}
                    now={now}
                    onCorrect={handleCorrect}
                    onWrong={handleWrong}
                    onRemove={handleRemove}
                    onReview={onReview}
                    showSubject={subjectTab === ALL_SUBJECTS}
                    initialCount={3}
                  />
                </div>
              )}
            </section>
          )}
        </div>

        {/* ===== タブ ===== */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="学習ノートの表示切替">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 min-h-[44px] px-4 rounded-full text-sm font-bold transition-colors border ${
                tab === t.id
                  ? 'bg-[#E8688E] text-white border-[#E8688E]'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t.label}（{t.count}）
            </button>
          ))}
        </div>

        {/* ===== タブ本体 ===== */}
        {tab === 'today' && (
          scopedDueItems.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" aria-hidden="true" />}
              title={
                scopedSubjectLabel
                  ? `${scopedSubjectLabel}の今日の復習は完了です！`
                  : '今日の復習は完了です！'
              }
              desc="問題を解いて間違えると、ここに自動で追加されます。"
            />
          ) : (
            <p className="text-xs text-gray-400 text-center py-2">
              今日の復習は上のセクションに表示しています。
            </p>
          )
        )}

        {tab === 'notes' && (
          notes.length === 0 ? (
            <EmptyState
              icon={<BookOpen size={40} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />}
              title="ノートはまだありません"
              desc="解説ページの「ノートに保存」から、まとめを追加できます。"
            />
          ) : (
            <ul className="space-y-3">
              {notes.map((n) => (
                <NoteCard key={n.id} note={n} onSelect={onSelectNote} />
              ))}
            </ul>
          )
        )}

        {tab === 'important' && (
          importantNotes.length === 0 ? (
            <EmptyState
              icon={<Star size={40} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />}
              title="重要マークのノートはありません"
              desc="ノート詳細で「重要」をつけると、ここに集まります。"
            />
          ) : (
            <ul className="space-y-3">
              {importantNotes.map((n) => (
                <NoteCard key={n.id} note={n} onSelect={onSelectNote} />
              ))}
            </ul>
          )
        )}

        {tab === 'all' && (
          scopedItems.length === 0 && notes.length === 0 ? (
            <EmptyState
              icon={<Sparkles size={40} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />}
              title="まだ何もありません"
              desc="問題を解いて間違えたり、ノートを保存すると、ここに集まります。"
            />
          ) : (
            <div className="space-y-5">
              {scopedItems.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                    <Flame size={13} className="text-[#E8688E]" aria-hidden="true" /> 苦手（自動キャプチャ）
                    {scopedSubjectLabel && (
                      <span className="font-bold text-gray-400">／{scopedSubjectLabel}</span>
                    )}
                  </h3>
                  {/*
                    こちらも既定3件＋「もっと見る」。
                    全件（数十件）を最初から並べると、下のマイノートまで
                    スクロールで到達できなくなるため。
                  */}
                  <CollapsibleReviewList
                    items={scopedItems}
                    now={now}
                    onCorrect={handleCorrect}
                    onWrong={handleWrong}
                    onRemove={handleRemove}
                    onReview={onReview}
                    showSubject={subjectTab === ALL_SUBJECTS}
                    initialCount={3}
                  />
                </div>
              )}
              {notes.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                    <NotebookPen size={13} className="text-[#2C6187]" aria-hidden="true" /> マイノート
                  </h3>
                  <ul className="space-y-3">
                    {notes.map((n) => (
                      <NoteCard key={n.id} note={n} onSelect={onSelectNote} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
      {icon}
      <p className="font-bold text-[#2C3E50]">{title}</p>
      <p className="text-sm mt-1">{desc}</p>
    </div>
  );
}

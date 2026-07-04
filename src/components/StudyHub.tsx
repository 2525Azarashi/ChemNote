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
} from 'lucide-react';
import { auth } from '../firebase';
import {
  getAllReviewItems,
  getDueReviewItems,
  markReviewedCorrect,
  markReviewedWrong,
  removeReviewItem,
  isMastered,
  REVIEW_INTERVALS_DAYS,
  type ReviewItem,
} from '../utils/reviewList';

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
}

type Tab = 'today' | 'notes' | 'important' | 'all';

// ============================================================
// 表示用の小道具
// ============================================================

function stripHtml(html?: string): string {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').trim();
}

function truncate(text: string, max = 90): string {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

function formatDue(dueAt: number, now: number): string {
  const diff = dueAt - now;
  if (diff <= 0) return '復習可能';
  const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
  if (days <= 1) return '明日';
  return `${days}日後`;
}

// ============================================================
// 復習アイテム カード（自動キャプチャ = 誤答）
// ============================================================

interface ReviewCardProps {
  item: ReviewItem;
  now: number;
  onCorrect: (key: string) => void;
  onWrong: (key: string) => void;
  onRemove: (key: string) => void;
  compact?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ item, now, onCorrect, onWrong, onRemove, compact = false }) => {
  const due = item.dueAt <= now;
  const mastered = isMastered(item);
  const retention = Math.round((item.box / (REVIEW_INTERVALS_DAYS.length - 1)) * 100);

  return (
    <li
      className={`rounded-2xl border shadow-sm p-4 sm:p-5 transition-colors ${
        due
          ? 'bg-[#FFF6F9] border-[#F4A9C4]/60'
          : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {/* 種別バッジ: 自動（誤答） */}
        <span className="inline-flex items-center gap-1 bg-[#E8688E]/10 text-[#C0392B] px-2 py-0.5 rounded text-[10px] font-bold border border-[#E8688E]/30">
          <Flame size={11} aria-hidden="true" /> 苦手（自動）
        </span>
        {item.chapterTitle && (
          <span className="bg-[#A9CCE3]/20 text-[#2C3E50] px-2 py-0.5 rounded text-[10px] font-bold border border-[#A9CCE3]/50">
            {item.chapterTitle}
          </span>
        )}
        {item.questionIndex && (
          <span className="bg-[#F9E79F]/30 text-[#D35400] px-2 py-0.5 rounded text-[10px] font-bold border border-[#F5B041]/50">
            第{item.questionIndex}問{item.subLabel ? ` ${item.subLabel}` : ''}
          </span>
        )}
        <span
          className={`ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
            due
              ? 'bg-[#E8688E]/10 text-[#C0392B] border-[#E8688E]/30'
              : 'bg-gray-50 text-gray-500 border-gray-200'
          }`}
        >
          <Clock size={11} aria-hidden="true" />
          {formatDue(item.dueAt, now)}
        </span>
      </div>

      <p className="text-sm text-[#2C3E50] leading-relaxed break-words [overflow-wrap:anywhere]">
        {truncate(stripHtml(item.questionText) || '（問題文なし）')}
      </p>

      {!compact && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
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

      <div className="mt-1 text-[11px] text-gray-400">
        間違い{item.wrongCount}回 / 復習正解{item.correctCount}回 ・ 定着度 {retention}%
        {mastered && <span className="ml-1 text-emerald-600 font-bold">習得済み</span>}
      </div>

      {/* アクション */}
      <div className="mt-3 flex flex-wrap gap-2">
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
    </li>
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

      <h3 className="font-bold text-[#2C3E50] leading-relaxed break-words [overflow-wrap:anywhere] font-modern">
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

export function StudyHub({ onBack, isGuest, onSelectNote }: StudyHubProps) {
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

  // タブごとの表示内容
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'today', label: '今日の復習', count: dueItems.length },
    { id: 'notes', label: 'マイノート', count: notes.length },
    { id: 'important', label: '重要', count: importantNotes.length },
    { id: 'all', label: 'すべて', count: reviewItems.length + notes.length },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] font-modern pb-28 md:pb-12">
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

        {/* サマリー */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <div className="text-2xl font-bold text-[#E8688E]">{dueItems.length}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">今日の復習</div>
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

        {/* ===== 今日の復習セクション（冒頭に自動表示） ===== */}
        {dueItems.length > 0 && (
          <section className="bg-gradient-to-br from-[#FFF1F5] to-[#FDFBF7] rounded-2xl border border-[#F4A9C4]/50 shadow-sm p-4 sm:p-5">
            <button
              onClick={() => setTodayOpen((v) => !v)}
              className="w-full flex items-center gap-2 text-left"
              aria-expanded={todayOpen}
            >
              <div className="w-9 h-9 rounded-xl bg-[#FBE0E9] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#E8688E]" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[#1B2631] font-handwriting text-lg leading-tight">
                  今日の復習 <span className="text-[#E8688E]">{dueItems.length}</span> 件
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
              <ul className="mt-4 space-y-3">
                {dueItems.map((it) => (
                  <ReviewCard
                    key={it.key}
                    item={it}
                    now={now}
                    onCorrect={handleCorrect}
                    onWrong={handleWrong}
                    onRemove={handleRemove}
                  />
                ))}
              </ul>
            )}
          </section>
        )}

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
          dueItems.length === 0 ? (
            <EmptyState
              icon={<CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" aria-hidden="true" />}
              title="今日の復習は完了です！"
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
          reviewItems.length === 0 && notes.length === 0 ? (
            <EmptyState
              icon={<Sparkles size={40} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />}
              title="まだ何もありません"
              desc="問題を解いて間違えたり、ノートを保存すると、ここに集まります。"
            />
          ) : (
            <div className="space-y-5">
              {reviewItems.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                    <Flame size={13} className="text-[#E8688E]" aria-hidden="true" /> 苦手（自動キャプチャ）
                  </h3>
                  <ul className="space-y-3">
                    {reviewItems.map((it) => (
                      <ReviewCard
                        key={it.key}
                        item={it}
                        now={now}
                        onCorrect={handleCorrect}
                        onWrong={handleWrong}
                        onRemove={handleRemove}
                        compact
                      />
                    ))}
                  </ul>
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

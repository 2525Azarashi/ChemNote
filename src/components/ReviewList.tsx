import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Trash2, Clock, AlertTriangle } from 'lucide-react';
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

interface ReviewListProps {
  onBack: () => void;
  isGuest: boolean;
}

type Tab = 'due' | 'all';

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

export function ReviewList({ onBack, isGuest }: ReviewListProps) {
  const uid = auth.currentUser?.uid || (isGuest ? 'guest' : null);
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [tab, setTab] = useState<Tab>('due');
  const [now, setNow] = useState(() => Date.now());

  const refresh = () => {
    setNow(Date.now());
    setItems(getAllReviewItems(uid));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dueItems = useMemo(() => getDueReviewItems(uid, now), [items, now, uid]);
  const shown = tab === 'due' ? dueItems : items;

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

  const masteredCount = items.filter(isMastered).length;

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
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2C3E50]">復習リスト</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              間違えた問題を忘却曲線にそって再出題します
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
            <div className="text-2xl font-bold text-[#2C3E50]">{items.length}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">登録中</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{masteredCount}</div>
            <div className="text-[11px] sm:text-xs text-gray-500 mt-0.5">習得済み</div>
          </div>
        </div>

        {/* タブ */}
        <div className="flex gap-2" role="tablist" aria-label="復習リストの表示切替">
          <button
            role="tab"
            aria-selected={tab === 'due'}
            onClick={() => setTab('due')}
            className={`flex-1 min-h-[44px] rounded-full text-sm font-bold transition-colors border ${
              tab === 'due'
                ? 'bg-[#E8688E] text-white border-[#E8688E]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            今日の復習（{dueItems.length}）
          </button>
          <button
            role="tab"
            aria-selected={tab === 'all'}
            onClick={() => setTab('all')}
            className={`flex-1 min-h-[44px] rounded-full text-sm font-bold transition-colors border ${
              tab === 'all'
                ? 'bg-[#E8688E] text-white border-[#E8688E]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            すべて（{items.length}）
          </button>
        </div>

        {/* リスト */}
        {shown.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
            {tab === 'due' ? (
              <>
                <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" aria-hidden="true" />
                <p className="font-bold text-[#2C3E50]">今日の復習は完了です！</p>
                <p className="text-sm mt-1">問題を解いて間違えると、ここに自動で追加されます。</p>
              </>
            ) : (
              <>
                <AlertTriangle size={40} className="mx-auto text-gray-300 mb-3" aria-hidden="true" />
                <p className="font-bold text-[#2C3E50]">復習リストは空です</p>
                <p className="text-sm mt-1">間違えた問題がここにたまっていきます。</p>
              </>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {shown.map((it) => {
              const due = it.dueAt <= now;
              return (
                <li
                  key={it.key}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {it.chapterTitle && (
                      <span className="bg-[#A9CCE3]/20 text-[#2C3E50] px-2 py-0.5 rounded text-[10px] font-bold border border-[#A9CCE3]/50">
                        {it.chapterTitle}
                      </span>
                    )}
                    {it.questionIndex && (
                      <span className="bg-[#F9E79F]/30 text-[#D35400] px-2 py-0.5 rounded text-[10px] font-bold border border-[#F5B041]/50">
                        第{it.questionIndex}問{it.subLabel ? ` ${it.subLabel}` : ''}
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
                      {formatDue(it.dueAt, now)}
                    </span>
                  </div>

                  <p className="text-sm text-[#2C3E50] leading-relaxed break-words [overflow-wrap:anywhere]">
                    {truncate(stripHtml(it.questionText) || '（問題文なし）')}
                  </p>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {it.correctAnswer && (
                      <div className="text-emerald-700">
                        <span className="font-bold">正答: </span>
                        <span className="font-math">{it.correctAnswer}</span>
                      </div>
                    )}
                    {it.lastWrongAnswer && (
                      <div className="text-[#C0392B]">
                        <span className="font-bold">あなたの解答: </span>
                        <span className="font-math">{it.lastWrongAnswer}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-1 text-[11px] text-gray-400">
                    間違い{it.wrongCount}回 / 復習正解{it.correctCount}回 ・ 定着度{' '}
                    {Math.round((it.box / (REVIEW_INTERVALS_DAYS.length - 1)) * 100)}%
                  </div>

                  {/* アクション */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCorrect(it.key)}
                      aria-label="復習で正解にする"
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors"
                    >
                      <CheckCircle2 size={16} aria-hidden="true" /> できた
                    </button>
                    <button
                      onClick={() => handleWrong(it.key)}
                      aria-label="復習でまだ苦手にする"
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg bg-amber-100 text-amber-800 text-sm font-bold hover:bg-amber-200 transition-colors border border-amber-200"
                    >
                      <RotateCcw size={16} aria-hidden="true" /> まだ苦手
                    </button>
                    <button
                      onClick={() => handleRemove(it.key)}
                      aria-label="復習リストから削除"
                      title="復習リストから削除"
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg bg-white text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors border border-gray-200 ml-auto"
                    >
                      <Trash2 size={16} aria-hidden="true" /> 削除
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

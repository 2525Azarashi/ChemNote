/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ランキング画面
 * - 3つのタブ: 全章合計 / 章ごと / 期間別（週間・月間・全期間）
 * - 自分の順位がわかるように isMe をハイライト
 * - ゲスト時はログイン誘導
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Crown, Medal, ChevronLeft, RefreshCw, User, BookOpen, Calendar, Globe } from 'lucide-react';
import {
  fetchChapterRanking,
  fetchTotalRanking,
  fetchPeriodRanking,
  type RankingPeriod,
} from '../utils/leaderboard';
import { auth } from '../firebase';
import { chemistryData } from '../data/chemistryData';

interface LeaderboardProps {
  onBack: () => void;
  isGuest: boolean;
  /** 章タブを開いた時の初期 chapterId */
  initialChapterId?: string | null;
}

type Tab = 'total' | 'chapter' | 'period';

export function Leaderboard({ onBack, isGuest, initialChapterId }: LeaderboardProps) {
  const [tab, setTab] = useState<Tab>('total');
  const [period, setPeriod] = useState<RankingPeriod>('week');
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Array<{ rank: number; nickname: string; photoURL?: string; score: number; sub?: string; isMe: boolean; uid?: string }>>([]);

  const allChapters = useMemo(
    () => chemistryData.parts.flatMap((p: any) => p.chapters.map((c: any) => ({ id: c.id, title: c.abstractTitle || c.title || c.id }))),
    []
  );
  const [chapterId, setChapterId] = useState<string>(
    initialChapterId || allChapters[0]?.id || ''
  );

  const load = async () => {
    setLoading(true);
    try {
      if (tab === 'total') {
        const list = await fetchTotalRanking(100);
        setRows(
          list.map((r) => ({
            rank: r.rank,
            nickname: r.entry.nickname,
            photoURL: r.entry.photoURL,
            score: r.entry.totalScore,
            sub: `${Object.keys(r.entry.chapterScores || {}).length} 章クリア`,
            isMe: r.isMe,
            uid: r.entry.uid,
          }))
        );
      } else if (tab === 'chapter') {
        if (!chapterId) return;
        const list = await fetchChapterRanking(chapterId, 100);
        setRows(
          list.map((r) => ({
            rank: r.rank,
            nickname: r.entry.nickname,
            photoURL: r.entry.photoURL,
            score: r.entry.bestScore,
            sub: `正答率 ${Math.round((r.entry.correctRate || 0) * 100)}% / ${r.entry.timeUsedSec}秒`,
            isMe: r.isMe,
            uid: r.entry.uid,
          }))
        );
      } else {
        const list = await fetchPeriodRanking(period, 100);
        setRows(
          list.map((r) => ({
            rank: r.rank,
            nickname: r.entry.nickname,
            photoURL: r.entry.photoURL,
            score: r.entry.bestScore,
            sub: `${r.entry.playCount} 回プレイ`,
            isMe: r.isMe,
            uid: r.entry.uid,
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, period, chapterId]);

  // 自分が圏外かどうか判定
  const myRow = rows.find((r) => r.isMe);
  const me = auth.currentUser;

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] font-modern pb-32">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 relative">
        <div className="absolute top-10 right-4 w-40 h-40 bg-[#F4D03F]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-4 w-48 h-48 bg-[#A9CCE3]/15 rounded-full blur-3xl pointer-events-none" />

        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <button
            onClick={onBack}
            className="p-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl transition-all shadow-sm cursor-pointer"
            title="戻る"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F4D03F]/30 text-[#1B2631] flex items-center justify-center shadow-xs">
              <Trophy size={18} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1B2631]">ランキング</h2>
          </div>

          <button
            onClick={load}
            className="ml-auto p-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl transition-all shadow-sm cursor-pointer"
            title="更新"
            aria-label="ランキングを更新"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* タブ */}
        <div className="relative z-10 grid grid-cols-3 gap-2 mb-4">
          <TabButton active={tab === 'total'} onClick={() => setTab('total')} icon={<Globe size={14} />} label="全章合計" />
          <TabButton active={tab === 'chapter'} onClick={() => setTab('chapter')} icon={<BookOpen size={14} />} label="章別ベスト" />
          <TabButton active={tab === 'period'} onClick={() => setTab('period')} icon={<Calendar size={14} />} label="期間別" />
        </div>

        {/* サブセレクタ */}
        {tab === 'chapter' && (
          <div className="relative z-10 mb-4 bg-white border border-gray-200 rounded-2xl shadow-xs p-2">
            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
              className="w-full px-3 py-2 bg-transparent outline-none text-sm font-bold text-[#1B2631] cursor-pointer"
            >
              {allChapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {tab === 'period' && (
          <div className="relative z-10 mb-4 grid grid-cols-3 gap-2">
            {(['week', 'month', 'all'] as RankingPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  period === p
                    ? 'bg-[#1B2631] text-white border-[#1B2631] shadow-md'
                    : 'bg-white text-[#4B5563] border-gray-200 hover:border-[#1B2631]/30'
                }`}
              >
                {p === 'week' ? '週間' : p === 'month' ? '月間' : '全期間'}
              </button>
            ))}
          </div>
        )}

        {/* 自分の順位サマリー */}
        {!isGuest && me && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mb-4 bg-[#1B2631] text-white rounded-2xl p-4 shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                {me.photoURL ? (
                  <img src={me.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={18} />
                )}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-60">あなた</p>
                <p className="text-sm font-bold truncate max-w-[180px]">{myRow?.nickname || '—'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest opacity-60">順位 / スコア</p>
              <p className="text-lg font-bold font-handwriting tabular-nums">
                {myRow ? `${myRow.rank}位` : '圏外'}
                <span className="text-xs opacity-70 ml-2">{myRow ? `${myRow.score} pt` : ''}</span>
              </p>
            </div>
          </motion.div>
        )}

        {isGuest && (
          <div className="relative z-10 mb-4 bg-[#F4D03F]/20 border border-[#F4D03F]/40 rounded-2xl p-4 text-sm text-[#1B2631] font-bold text-center">
            ゲストモードではランキングに参加できません。Googleでログインして全国順位を狙おう！
          </div>
        )}

        {/* リスト */}
        <div className="relative z-10 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          {loading && rows.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">読み込み中…</div>
          ) : rows.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-400">
              まだ誰もチャレンジしていません。
              <br />
              一番乗りで頂点を取ろう！
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {rows.map((r) => (
                <li
                  key={`${r.uid}-${r.rank}`}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    r.isMe ? 'bg-[#F4D03F]/15 border-l-4 border-[#F4D03F]' : 'hover:bg-gray-50'
                  }`}
                >
                  <RankBadge rank={r.rank} />
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {r.photoURL ? (
                      <img src={r.photoURL} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User size={16} className="text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-bold truncate ${r.isMe ? 'text-[#1B2631]' : 'text-[#1B2631]'}`}>
                      {r.nickname}
                      {r.isMe && <span className="ml-2 text-[10px] text-[#D4A017] font-bold">YOU</span>}
                    </p>
                    {r.sub && <p className="text-[11px] text-gray-400 truncate">{r.sub}</p>}
                  </div>
                  <p className="text-base font-bold tabular-nums font-handwriting text-[#1B2631] shrink-0">
                    {r.score}
                    <span className="text-[10px] text-gray-400 ml-1">pt</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-bold transition-all border-2 ${
        active
          ? 'bg-[#1B2631] text-white border-[#1B2631] shadow-md'
          : 'bg-white text-[#4B5563] border-gray-200 hover:border-[#1B2631]/30'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#F4D03F] text-[#1B2631] flex items-center justify-center shadow-sm shrink-0">
        <Crown size={16} />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center shadow-sm shrink-0">
        <Medal size={16} />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#D4A017]/30 text-[#A47C0A] flex items-center justify-center shadow-sm shrink-0">
        <Medal size={16} />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold tabular-nums shrink-0">
      {rank}
    </div>
  );
}

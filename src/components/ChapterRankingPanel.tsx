import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { fetchChapterRanking } from '../utils/leaderboard';

interface ChapterRankingPanelProps {
  chapterId: string;
  userScore: number;
  isGuest: boolean;
}

interface RankingData {
  userRank: number;
  totalParticipants: number;
  topScores: Array<{
    rank: number;
    nickname: string;
    score: number;
    isCurrentUser: boolean;
  }>;
  percentile: number;
}

export function ChapterRankingPanel({ chapterId, userScore, isGuest }: ChapterRankingPanelProps) {
  const [ranking, setRanking] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankingData = async () => {
      setLoading(true);
      try {
        if (isGuest) {
          setRanking(null);
          return;
        }

        const uid = auth.currentUser?.uid;
        if (!uid) {
          setRanking(null);
          return;
        }

        const topRanking = await fetchChapterRanking(chapterId, 50);
        const me = topRanking.find((row) => row.entry.uid === uid);
        const betterCount = topRanking.filter((row) => row.entry.bestScore > userScore).length;
        const userRank = me?.rank ?? betterCount + 1;
        const totalParticipants = Math.max(topRanking.length, 1);

        const topScores = topRanking.slice(0, 3).map((row) => ({
          rank: row.rank,
          nickname: row.entry.nickname || '名無しの化学者',
          score: row.entry.bestScore,
          isCurrentUser: row.entry.uid === uid,
        }));

        const percentile = Math.max(
          0,
          Math.round(((totalParticipants - userRank + 1) / totalParticipants) * 100)
        );

        setRanking({ userRank, totalParticipants, topScores, percentile });
      } catch (error) {
        console.error('Failed to fetch ranking:', error);
        setRanking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
  }, [chapterId, isGuest, userScore]);

  if (isGuest) {
    return (
      <div className="mt-4 rounded-2xl border border-[#F4D03F]/50 bg-[#F4D03F]/15 p-4 text-sm font-bold text-[#1B2631]">
        Googleログインすると、結果がランキングに反映されます。
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white/70 p-4 text-sm text-gray-500">
        ランキングを読み込み中...
      </div>
    );
  }

  if (!ranking) return null;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return `#${rank}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 rounded-2xl border-2 border-[#A9CCE3]/60 bg-gradient-to-br from-[#E8F4FD] to-[#FFF8E1] p-4 shadow-lg md:p-6"
      >
        <div className="mb-4 flex items-center gap-2 md:mb-6">
          <Trophy className="h-5 w-5 text-yellow-600 md:h-6 md:w-6" />
          <h3 className="text-base font-bold text-[#2C3E50] md:text-lg">ランキング</h3>
        </div>

        <div className="mb-4 rounded-xl border-2 border-[#F4D03F]/40 bg-white p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600 md:text-base">あなたの順位</span>
            <span className="text-2xl font-bold text-[#2C3E50] md:text-3xl">#{ranking.userRank}</span>
          </div>
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-gray-500">参加者 {ranking.totalParticipants}人中</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-bold text-green-600">上位 {ranking.percentile}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <h4 className="px-1 text-xs font-bold text-gray-600 md:text-sm">トップスコア</h4>
          {ranking.topScores.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white/70 p-3 text-sm text-gray-500">
              まだランキングデータがありません。
            </div>
          ) : (
            ranking.topScores.map((entry) => (
              <motion.div
                key={`${entry.rank}-${entry.nickname}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: entry.rank * 0.1 }}
                className={`flex items-center gap-2 rounded-lg border-2 p-3 transition-all md:gap-3 md:p-4 ${
                  entry.isCurrentUser
                    ? 'border-[#F4D03F]/80 bg-gradient-to-r from-[#F4D03F]/20 to-[#F4D03F]/10'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span className="w-10 text-sm font-black text-[#2C3E50]">{getRankBadge(entry.rank)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-800 md:text-sm">{entry.nickname}</p>
                </div>
                <span className="ml-auto text-sm font-bold text-[#2C3E50] md:text-base">{entry.score}点</span>
                {entry.isCurrentUser && (
                  <span className="ml-2 rounded bg-white px-2 py-1 text-xs font-bold text-[#D4A017]">YOU</span>
                )}
              </motion.div>
            ))
          )}
        </div>

        {ranking.userRank > 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 border-t-2 border-gray-200 pt-4 md:mt-5 md:pt-5"
          >
            <p className="flex items-center gap-2 text-xs text-gray-600 md:text-sm">
              <Zap className="h-4 w-4 text-orange-500" />
              <span>もう少しで上位が見えてきます。次の挑戦で更新しましょう。</span>
            </p>
          </motion.div>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#A9CCE3] px-4 py-2 text-sm font-bold text-white md:mt-5 md:py-3 md:text-base">
          <Users className="h-4 w-4" />
          他のプレイヤーとのランキング
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

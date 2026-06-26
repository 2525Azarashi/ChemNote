/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * チャプター完了時のランキング表示パネル
 * - ユーザーの最終スコアと順位
 * - 上位3位のスコアとの比較
 * - 全体ランキング内での位置
 */

import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { fetchChapterRanking, fetchMyChapterBest } from '../utils/leaderboard';

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

export function ChapterRankingPanel({
  chapterId,
  userScore,
  isGuest,
}: ChapterRankingPanelProps) {
  const [ranking, setRanking] = useState<RankingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        setLoading(true);

        // ゲストモードの場合はランキングデータなし
        if (isGuest) {
          setLoading(false);
          return;
        }

        const uid = auth.currentUser?.uid;
        if (!uid) return;

        // トップランキングを取得
        const topRanking = await fetchChapterRanking(chapterId, 50);

        // ユーザーのベストスコアを取得
        const userBest = await fetchMyChapterBest(chapterId);

        // ランキング内でのユーザーの順位を計算
        let userRank = topRanking.length + 1;
        let userInTop = false;

        for (let i = 0; i < topRanking.length; i++) {
          if (topRanking[i].uid === uid) {
            userRank = i + 1;
            userInTop = true;
            break;
          }
        }

        // トップ3のスコアを取得
        const topScores = topRanking.slice(0, 3).map((entry, idx) => ({
          rank: idx + 1,
          nickname: entry.nickname || '名無しの化学者',
          score: entry.bestScore,
          isCurrentUser: entry.uid === uid,
        }));

        // パーセンタイル計算
        const percentile = Math.round(((topRanking.length - userRank + 1) / topRanking.length) * 100);

        setRanking({
          userRank,
          totalParticipants: topRanking.length,
          topScores,
          percentile,
        });
      } catch (error) {
        console.error('Failed to fetch ranking:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
  }, [chapterId, isGuest]);

  if (isGuest || loading || !ranking) {
    return null;
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-br from-[#E8F4FD] to-[#FFF8E1] border-2 border-[#A9CCE3]/60 rounded-2xl p-4 md:p-6 shadow-lg mt-6"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
          <h3 className="font-bold text-base md:text-lg text-[#2C3E50]">
            ランキング
          </h3>
        </div>

        {/* User's Position */}
        <div className="bg-white rounded-xl p-4 md:p-5 mb-4 border-2 border-[#F4D03F]/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm md:text-base font-semibold text-gray-600">
              あなたの順位
            </span>
            <span className="text-2xl md:text-3xl font-bold text-[#2C3E50]">
              #{ranking.userRank}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-gray-500">
              全体: {ranking.totalParticipants}人中
            </span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="font-bold text-green-600">
                上位 {ranking.percentile}%
              </span>
            </div>
          </div>
        </div>

        {/* Top 3 Scores */}
        <div className="space-y-2 md:space-y-3">
          <h4 className="text-xs md:text-sm font-bold text-gray-600 px-1">
            トップスコア
          </h4>
          {ranking.topScores.map((entry) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: entry.rank * 0.1 }}
              className={`
                flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg border-2 transition-all
                ${entry.isCurrentUser
                  ? 'bg-gradient-to-r from-[#F4D03F]/20 to-[#F4D03F]/10 border-[#F4D03F]/80'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-xl md:text-2xl">
                {getRankBadge(entry.rank)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-semibold text-gray-800 truncate">
                  {entry.nickname}
                </p>
              </div>
              <span className="text-sm md:text-base font-bold text-[#2C3E50] ml-auto">
                {entry.score}点
              </span>
              {entry.isCurrentUser && (
                <span className="text-xs font-bold text-[#F4D03F] bg-white px-2 py-1 rounded ml-2">
                  YOU
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Motivation Message */}
        {ranking.userRank > 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 md:mt-5 pt-4 md:pt-5 border-t-2 border-gray-200"
          >
            <p className="text-xs md:text-sm text-gray-600 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>もっと練習して、トップを目指しましょう！</span>
            </p>
          </motion.div>
        )}

        {/* Leaderboard Link */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 md:mt-5 px-4 py-2 md:py-3 bg-gradient-to-r from-[#A9CCE3] to-[#85B8D8] text-white font-bold rounded-lg text-sm md:text-base hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Users className="w-4 h-4" />
          全体ランキングを見る
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}

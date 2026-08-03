import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Users, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../firebase';
import { fetchChapterRanking } from '../utils/leaderboard';
import { RankingPodium } from './RankingPodium';

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
    photoURL?: string;
    score: number;
    isCurrentUser: boolean;
  }>;
  percentile: number;
  /** すぐ上の相手までの点差。「あと○点で○位」を出すために使う */
  chase: { gap: number; targetRank: number; targetName: string } | null;
  /** 首位のときの2位との差（守るべきリード） */
  lead: number | null;
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
          photoURL: row.entry.photoURL,
          score: row.entry.bestScore,
          isCurrentUser: row.entry.uid === uid,
        }));

        const percentile = Math.max(
          0,
          Math.round(((totalParticipants - userRank + 1) / totalParticipants) * 100)
        );

        // すぐ上の相手までの点差を出す。
        // 「#5」だけでは次に何をすればよいか分からないが、
        // 「あと18点で4位」まで示せば、次の1問が具体的な意味を持つ。
        const above = topRanking.filter((row) => row.rank < userRank);
        const chase =
          above.length > 0
            ? (() => {
                const target = above.reduce((best, cur) => (cur.rank > best.rank ? cur : best), above[0]);
                return {
                  gap: Math.max(1, (target.entry.bestScore || 0) - userScore + 1),
                  targetRank: target.rank,
                  targetName: target.entry.nickname || '名無しの化学者',
                };
              })()
            : null;

        // 首位なら「2位との差」＝守るべきリードを出す
        const second = topRanking.find((row) => row.rank === 2);
        const lead =
          userRank === 1 && second ? Math.max(0, userScore - (second.entry.bestScore || 0)) : null;

        setRanking({ userRank, totalParticipants, topScores, percentile, chase, lead });
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
      <div className="mt-4 rounded-2xl border border-[#F4D03F]/50 bg-[#F4D03F]/15 p-4 text-sm font-bold text-[#1B2631] font-handwriting">
        Googleログインすると、結果がランキングに反映されます。
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white/70 p-4 text-sm text-gray-500 font-handwriting">
        ランキングを読み込み中...
      </div>
    );
  }

  if (!ranking) return null;

  // 順位の見せ方は RankingPodium（表彰台）に一元化したので、
  // ここで文字列バッジ（1st/2nd/3rd）を組み立てる必要はなくなった。

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 rounded-2xl border-2 border-[#A9CCE3]/60 bg-gradient-to-br from-[#E8F4FD] to-[#FFF8E1] p-4 shadow-lg md:p-6 font-handwriting"
      >
        <div className="mb-4 flex items-center gap-2 md:mb-6">
          <Trophy className="h-5 w-5 text-yellow-600 md:h-6 md:w-6" />
          <h3 className="text-base font-bold text-[#2C3E50] md:text-lg">ランキング</h3>
        </div>

        {/* 上位3名の表彰台。
            解き終わった直後にいちばん見たいのは「頂点が誰か」と「自分との距離」。
            一覧より台の形の方が高さの差でそれが一目で伝わる。 */}
        {ranking.topScores.length > 0 && (
          <RankingPodium
            entries={ranking.topScores.map((entry) => ({
              rank: entry.rank,
              nickname: entry.nickname,
              photoURL: entry.photoURL,
              score: entry.score,
              isMe: entry.isCurrentUser,
            }))}
            className="mb-4"
          />
        )}

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

          {/* あと何点で1つ上か。
              順位だけだと「遠い」で終わるが、点差まで見えると
              「次の1問で届く」と分かり、もう1章やる理由になる。 */}
          {ranking.chase && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#F4D03F]/50 bg-[#FFF8E1] px-3 py-2">
              <Zap className="h-4 w-4 shrink-0 text-orange-500" />
              <p className="min-w-0 truncate text-xs font-bold text-[#2C3E50] md:text-sm">
                あと<span className="mx-1 text-base tabular-nums text-[#D4A017]">{ranking.chase.gap}</span>点で
                {ranking.chase.targetRank}位
                <span className="ml-1 font-normal text-gray-500">（{ranking.chase.targetName}）</span>
              </p>
            </div>
          )}
          {ranking.lead != null && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#F4D03F]/50 bg-[#FFF8E1] px-3 py-2">
              <Trophy className="h-4 w-4 shrink-0 text-[#D4A017]" />
              <p className="text-xs font-bold text-[#2C3E50] md:text-sm">
                首位です。2位との差は
                <span className="mx-1 text-base tabular-nums text-[#D4A017]">{ranking.lead}</span>点
              </p>
            </div>
          )}
        </div>

        {ranking.topScores.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white/70 p-3 text-sm text-gray-500">
            まだランキングデータがありません。
          </div>
        )}

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

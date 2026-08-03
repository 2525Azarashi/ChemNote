/**
 * ===================================================================
 * ランキング上位3名の表彰台（ワールドカップの高揚感を担うパーツ）
 * ===================================================================
 *
 * ■ なぜ表彰台なのか
 * これまでのランキングは1位から順に並ぶ「一覧」だった。
 * 情報としては正しいが、1位も4位も同じ高さの行なので、
 * 「頂点に立つ」という感覚が生まれない。
 *
 * 国際大会の順位発表が必ず表彰台の形をしているのは、
 * 高さの差そのものが「そこを目指す価値」を伝えるからである。
 * そこで上位3名だけを台の形に組み、1位を中央・最も高く置く。
 *
 * ■ 既存デザインを壊さないための約束
 * ・色は既存パレットの範囲だけを使う
 *     金 #F4D03F（既存の Trophy 色）／銀 #C9CDD2／銅 #D4A017
 *     背景は既存の #E8F4FD → #FFF8E1 グラデーション（ChapterRankingPanel と同じ）
 * ・フォントは既存の font-handwriting をそのまま使う
 * ・一覧（<ul>）は今までどおり下に残す。表彰台は「上に足す」だけで、
 *   既存の見え方・情報量は一切減らさない。
 */

import React from 'react';
import { motion } from 'motion/react';
import { Crown, User } from 'lucide-react';

export interface PodiumEntry {
  rank: number;
  nickname: string;
  photoURL?: string;
  score: number;
  isMe: boolean;
}

interface RankingPodiumProps {
  /** 上位3名（4件以上渡されても先頭3件だけ使う） */
  entries: PodiumEntry[];
  className?: string;
}

/** 順位ごとの見え方。金・銀・銅は既存パレットの範囲に収める。 */
const PODIUM_STYLE: Record<number, { medal: string; ring: string; height: string; badge: string }> = {
  1: {
    medal: 'bg-[#F4D03F] text-[#1B2631]',
    ring: 'ring-[#F4D03F]',
    height: 'h-24 md:h-28',
    badge: 'bg-[#F4D03F] text-[#1B2631] border-[#D4A017]',
  },
  2: {
    medal: 'bg-[#C9CDD2] text-[#1B2631]',
    ring: 'ring-[#C9CDD2]',
    height: 'h-16 md:h-20',
    badge: 'bg-[#C9CDD2] text-[#1B2631] border-[#9AA0A6]',
  },
  3: {
    medal: 'bg-[#D4A017]/45 text-[#7A5C05]',
    ring: 'ring-[#D4A017]/50',
    height: 'h-12 md:h-14',
    badge: 'bg-[#D4A017]/35 text-[#7A5C05] border-[#D4A017]/60',
  },
};

/** 表示順は 2位・1位・3位（＝実際の表彰台の並び） */
const DISPLAY_ORDER = [2, 1, 3];

export function RankingPodium({ entries, className = '' }: RankingPodiumProps) {
  const top = (entries || []).slice(0, 3);
  // 1人もいなければ台を出さない（空の台は寂しいだけで意味がない）
  if (top.length === 0) return null;

  const byRank = new Map(top.map((entry) => [entry.rank, entry]));

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 border-[#F4D03F]/50 bg-gradient-to-b from-[#E8F4FD] via-white to-[#FFF8E1] px-3 pt-5 pb-0 shadow-md font-handwriting ${className}`}
    >
      {/* スタジアムの照明に見立てた淡い光。既存パネルと同じ blur 装飾の作法。 */}
      <div className="pointer-events-none absolute -top-10 left-1/2 h-32 w-52 -translate-x-1/2 rounded-full bg-[#F4D03F]/25 blur-3xl" />

      <p className="relative mb-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B2631]/50">
        Top 3
      </p>

      <div className="relative flex items-end justify-center gap-2 md:gap-4">
        {DISPLAY_ORDER.map((rank) => {
          const entry = byRank.get(rank);
          const style = PODIUM_STYLE[rank];
          // その順位がまだ埋まっていない場合は台だけ置く（＝空席が見える＝狙える）
          return (
            <div key={rank} className="flex min-w-0 flex-1 flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: rank === 1 ? 0.1 : rank === 2 ? 0.2 : 0.3 }}
                className="flex w-full flex-col items-center"
              >
                {rank === 1 && entry && (
                  <Crown size={18} className="mb-0.5 text-[#D4A017]" aria-hidden="true" />
                )}

                {/* 顔写真（なければアイコン）。1位だけ少し大きくする。 */}
                <div
                  className={`mb-1.5 flex items-center justify-center overflow-hidden rounded-full bg-white ring-2 ${style.ring} ${
                    rank === 1 ? 'h-12 w-12 md:h-14 md:w-14' : 'h-9 w-9 md:h-11 md:w-11'
                  } ${entry ? '' : 'opacity-40'}`}
                >
                  {entry?.photoURL ? (
                    <img
                      src={entry.photoURL}
                      alt=""
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User size={rank === 1 ? 20 : 15} className="text-gray-400" />
                  )}
                </div>

                <p
                  className={`w-full truncate px-1 text-center font-bold text-[#1B2631] ${
                    rank === 1 ? 'text-xs md:text-sm' : 'text-[10px] md:text-xs'
                  }`}
                >
                  {entry ? entry.nickname : '空席'}
                </p>
                {entry?.isMe && (
                  <span className="mt-0.5 rounded bg-white px-1.5 text-[9px] font-bold text-[#D4A017]">
                    YOU
                  </span>
                )}
                <p className="text-[10px] font-bold tabular-nums text-[#1B2631]/70 md:text-xs">
                  {entry ? `${entry.score} pt` : '—'}
                </p>
              </motion.div>

              {/* 台。高さの差そのものが「上を目指す理由」になる。 */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="mt-1.5 w-full"
              >
                <div
                  className={`flex w-full items-start justify-center rounded-t-xl border-t border-x ${style.medal} ${style.height} border-white/70 pt-1.5 shadow-inner`}
                >
                  <span className="text-base font-black tabular-nums md:text-lg">{rank}</span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ===================================================================
 * 解答中に出す「現在順位」ピル ＋ 順位が動いた瞬間の実況バナー
 * ===================================================================
 *
 * ■ なぜ解答中に順位を出すのか
 * ワールドカップ中継は、試合中ずっと画面の端に順位と勝ち点差が出ている。
 * だから「この1点で順位が変わる」と分かり、1プレーの重みが伝わる。
 *
 * 本アプリは解き終わるまで順位が見えないので、解答中の1問が
 * 順位にどう跳ね返るのかが分からず、得点が手応えにならなかった。
 * そこで「いま何位」「すぐ上まで何点」を常時、ただし控えめに出す。
 *
 * ■ 既存デザインを壊さないための約束
 * ・ヘッダーの既存ピル（スコア・進捗）と同じ「丸いピル」の形に合わせる
 * ・色は既存のトロフィー黄（#F4D03F）と藍（#1B2631）の範囲に収める。
 *   問題文の蛍光ペン（黄マーカー）と衝突しない位置＝ヘッダー内に置く。
 * ・スマホでは文字が溢れるので順位だけに絞る（点差は sm 以上で出す）
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronsUp, Flag } from 'lucide-react';
import { qualifyLineFor, type LiveStanding } from '../utils/liveRank';

interface LiveStandingPillProps {
  standing: LiveStanding | null;
  /** コンパクト表示（スマホのヘッダーなど） */
  compact?: boolean;
  className?: string;
}

/** 順位に応じた見え方。上位ほど強く光らせて「順位に意味がある」ことを伝える。 */
function rankTone(rank: number, qualifyLine: number | null) {
  if (rank === 1) {
    return {
      wrap: 'bg-[#F4D03F] border-[#D4A017] text-[#1B2631] shadow-[0_0_0_3px_rgba(244,208,63,0.25)]',
      label: '首位',
    };
  }
  if (rank <= 3) {
    return { wrap: 'bg-[#F4D03F]/25 border-[#F4D03F]/70 text-[#1B2631]', label: '表彰台' };
  }
  if (qualifyLine != null && rank <= qualifyLine) {
    return { wrap: 'bg-[#A9CCE3]/25 border-[#A9CCE3]/70 text-[#1B2631]', label: '圏内' };
  }
  return { wrap: 'bg-gray-100 border-gray-200 text-[#4B5563]', label: '圏外' };
}

export function LiveStandingPill({ standing, compact = false, className = '' }: LiveStandingPillProps) {
  if (!standing) return null;
  const qualifyLine = qualifyLineFor(standing.total);
  const tone = rankTone(standing.rank, qualifyLine);

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-2 py-1 md:px-3 md:py-1.5 transition-colors ${tone.wrap} ${className}`}
      title={
        standing.nextTarget
          ? `現在 ${standing.rank}位 / ${standing.total}人。すぐ上の ${standing.nextTarget.nickname} まで ${standing.nextTarget.gap}点`
          : `現在 ${standing.rank}位 / ${standing.total}人（首位）`
      }
    >
      <Flag size={12} className="shrink-0" />
      <div className="font-mono font-bold text-xs md:text-sm tabular-nums leading-none">
        {standing.rank}
        <span className="text-[9px] md:text-[10px] opacity-60 ml-0.5">位</span>
        <span className="text-[9px] md:text-[10px] opacity-50 ml-1">/{standing.total}</span>
      </div>
      {/* すぐ上の相手までの点差。「あと○点で1つ上」が分かると1問の重みが出る。 */}
      {!compact && standing.nextTarget && (
        <span className="hidden sm:inline text-[10px] font-bold opacity-75 whitespace-nowrap">
          あと{standing.nextTarget.gap}点で{standing.rank - 1}位
        </span>
      )}
    </div>
  );
}

interface OvertakeBannerProps {
  /** 何人抜いたか（負なら抜かれた）。0 のときは出さない */
  delta: number;
  /** 変化後の順位 */
  rank: number;
  /** 表示のたびに変わるキー（同じ順位変動を二度出さないため） */
  triggerKey: string | number;
}

/**
 * 順位が動いた瞬間だけ、上から短く降りてくる実況バナー。
 *
 * 「+120点」だけでは順位への影響が分からないので、
 * 「2人抜き！ 7位 → 5位」と言語化する。ここが臨場感の核。
 * 2.6秒で自動的に消し、解答の邪魔をしない。
 */
export function OvertakeBanner({ delta, rank, triggerKey }: OvertakeBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (delta === 0) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 2600);
    return () => window.clearTimeout(timer);
  }, [delta, triggerKey]);

  const isUp = delta > 0;
  const message = isUp
    ? rank === 1
      ? '首位に立った！'
      : `${delta}人抜き！ ${rank + delta}位 → ${rank}位`
    : `${-delta}人に抜かれた… ${rank + delta}位 → ${rank}位`;

  return (
    <AnimatePresence>
      {visible && delta !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 -translate-x-1/2 top-3 z-[9998] pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 shadow-lg font-handwriting font-bold text-sm md:text-base whitespace-nowrap border ${
              isUp
                ? 'bg-[#F4D03F] border-[#D4A017] text-[#1B2631]'
                : 'bg-white border-gray-300 text-[#4B5563]'
            }`}
          >
            <ChevronsUp size={16} className={isUp ? '' : 'rotate-180'} />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

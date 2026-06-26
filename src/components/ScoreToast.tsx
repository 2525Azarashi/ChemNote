/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 解説画面で表示するスコアサマリーカード。
 * - その問題のスコア内訳（基礎点、時間ボーナス、コンボ、ペナルティ）
 * - 章ベスト更新時はキラキラ演出 + 「自己ベスト更新！」表示
 * - パーフェクト時はリボン表示
 */

import React from 'react';
import { Trophy, Zap, Clock, Flame, AlertTriangle, Star } from 'lucide-react';
import { motion } from 'motion/react';
import type { ScoreBreakdown } from '../utils/scoring';

interface ScoreSummaryCardProps {
  breakdown: ScoreBreakdown;
  timeLimit: number;
  timeUsed: number;
  newBest?: boolean;
  previousBest?: number;
  totalScore?: number;
  /** ゲストモードならランキング非対応の旨を表示 */
  isGuest?: boolean;
}

export function ScoreSummaryCard({
  breakdown,
  timeLimit,
  timeUsed,
  newBest,
  previousBest,
  totalScore,
  isGuest,
}: ScoreSummaryCardProps) {
  const isPerfect = breakdown.perfectBonus > 0;
  const isOvertime = breakdown.overtimePenalty > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative w-full bg-gradient-to-br from-[#FFF8E1] via-white to-[#E8F4FD] border border-[#F4D03F]/60 rounded-3xl shadow-lg overflow-hidden"
    >
      {/* キラキラ装飾 */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#F4D03F]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#A9CCE3]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-5 md:p-6">
        {/* ヘッダー */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#F4D03F] text-[#1B2631] flex items-center justify-center shadow-md">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-[#1B2631]/60 font-bold font-modern">
                Score
              </p>
              <p className="text-3xl md:text-4xl font-handwriting font-bold text-[#1B2631] leading-none tabular-nums">
                +{breakdown.finalScore}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {isPerfect && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4D03F] text-[#1B2631] text-[10px] font-bold shadow-sm">
                <Star size={12} className="fill-current" />
                PERFECT
              </span>
            )}
            {newBest && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#5BC0BE] text-white text-[10px] font-bold shadow-sm animate-pulse">
                ✨ 自己ベスト更新
              </span>
            )}
          </div>
        </div>

        {/* 内訳 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-3">
          <BreakdownItem
            icon={<Zap size={14} />}
            label="基礎点"
            value={breakdown.basePoints}
            color="text-[#1B2631]"
            sub={`${breakdown.correctCount}/${breakdown.judgeableCount} 正解`}
          />
          <BreakdownItem
            icon={<Clock size={14} />}
            label="時間ボーナス"
            value={breakdown.timeBonus}
            color="text-emerald-600"
            sub={`${Math.floor(timeUsed)}s / ${timeLimit}s`}
          />
          <BreakdownItem
            icon={<Flame size={14} />}
            label="コンボ"
            value={breakdown.comboBonus}
            color="text-orange-500"
            sub={`${breakdown.comboCount}連続`}
          />
          {isOvertime ? (
            <BreakdownItem
              icon={<AlertTriangle size={14} />}
              label="時間超過"
              value={-breakdown.overtimePenalty}
              color="text-rose-500"
              sub="ペナルティ"
            />
          ) : (
            <BreakdownItem
              icon={<Star size={14} />}
              label="特別点"
              value={breakdown.perfectBonus + breakdown.descriptiveBonus}
              color="text-amber-600"
              sub={breakdown.perfectBonus > 0 ? '全問正解' : breakdown.descriptiveBonus > 0 ? '記述参加' : '—'}
            />
          )}
        </div>

        {/* ランキング情報 */}
        {!isGuest && (
          <div className="mt-3 pt-3 border-t border-[#1B2631]/10 flex flex-wrap items-center justify-between gap-2 text-xs font-modern">
            <div className="flex items-center gap-3 text-[#4B5563]">
              {previousBest != null && (
                <span>
                  これまでの自己ベスト:&nbsp;
                  <span className="font-bold tabular-nums text-[#1B2631]">{previousBest}</span>
                </span>
              )}
              {totalScore != null && (
                <span>
                  全章合計:&nbsp;
                  <span className="font-bold tabular-nums text-[#1B2631]">{totalScore}</span>
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#4B5563]/70">ランキングへ自動同期済み</span>
          </div>
        )}

        {isGuest && (
          <div className="mt-3 pt-3 border-t border-[#1B2631]/10 text-[11px] text-[#4B5563]/80 font-modern">
            ※ ゲストモードのためランキングには反映されません。Googleログインで全国ランキングに参加できます。
          </div>
        )}
      </div>
    </motion.div>
  );
}

function BreakdownItem({
  icon,
  label,
  value,
  color,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white rounded-2xl p-2.5 md:p-3 shadow-xs">
      <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${color}`}>
        {icon}
        <span>{label}</span>
      </div>
      <p className={`mt-1 text-base md:text-lg font-bold tabular-nums ${color}`}>
        {value >= 0 ? '+' : ''}
        {value}
      </p>
      {sub && <p className="text-[10px] text-[#4B5563]/70 mt-0.5">{sub}</p>}
    </div>
  );
}

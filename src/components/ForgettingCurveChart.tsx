import React, { useMemo } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { REVIEW_INTERVALS_DAYS, type ReviewItem } from '../utils/reviewList';

/**
 * ForgettingCurveChart — 忘却曲線 × 復習リストの定着度を可視化するグラフ。
 *
 * 目的（要件4）:
 *   - 各問題の「解答日時（createdAt / updatedAt）」を記録として活かし、
 *     エビングハウスの忘却曲線（理論値）と、ユーザー自身の復習アイテムの
 *     現在の定着度（box → retention%）を1つのグラフに重ねて表示する。
 *   - 「いつ・どの単元を復習すべきか」を視覚的に判断できるよう、
 *     復習期限（dueAt）が今日以前のアイテムは “復習推奨” としてハイライトする。
 *
 * 依存を増やさない方針で、外部チャートライブラリは使わず軽量な SVG で描画する。
 */

interface ForgettingCurveChartProps {
  items: ReviewItem[];
  now?: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

// エビングハウスの忘却曲線（理論値）: R = e^(-t/S) を単純化して描く。
// 復習しない場合、時間とともに記憶保持率が急速に下がる様子を表す。
function ebbinghaus(days: number): number {
  // S（記憶の強さ）を約1.8日相当にして、1日で約58%、7日で約2割…の感触に合わせる
  return Math.exp(-days / 1.8);
}

export const ForgettingCurveChart: React.FC<ForgettingCurveChartProps> = ({ items, now = Date.now() }) => {
  // 復習アイテムを「初回解答からの経過日数」と「現在の定着度」に写像する。
  const points = useMemo(() => {
    return items.map((it) => {
      const elapsedDays = Math.max(0, (now - (it.createdAt ?? now)) / DAY_MS);
      // box が進むほど定着度が上がる（0〜1）。復習によって忘却曲線を押し上げるイメージ。
      const retention = it.box / (REVIEW_INTERVALS_DAYS.length - 1);
      const due = it.dueAt <= now;
      return { elapsedDays, retention, due, item: it };
    });
  }, [items, now]);

  // グラフの描画領域（viewBox 座標）
  const W = 320;
  const H = 150;
  const padL = 30;
  const padR = 12;
  const padT = 12;
  const padB = 26;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // X軸は 0〜30日（最終復習間隔）で正規化
  const maxDays = REVIEW_INTERVALS_DAYS[REVIEW_INTERVALS_DAYS.length - 1] || 60;
  const xForDays = (d: number) => padL + (Math.min(d, maxDays) / maxDays) * plotW;
  const yForRet = (r: number) => padT + (1 - Math.max(0, Math.min(1, r))) * plotH;

  // 忘却曲線（理論値）のパスを生成
  const curvePath = useMemo(() => {
    const N = 40;
    let d = '';
    for (let i = 0; i <= N; i++) {
      const day = (i / N) * maxDays;
      const x = xForDays(day);
      const y = yForRet(ebbinghaus(day));
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    }
    return d.trim();
  }, [maxDays]);

  // 復習の“階段”（間隔反復で定着度が段階的に上がる）を理想線として描く
  const stairPath = useMemo(() => {
    const steps = REVIEW_INTERVALS_DAYS.length;
    let d = '';
    for (let i = 0; i < steps; i++) {
      const x = xForDays(REVIEW_INTERVALS_DAYS[i]);
      const y = yForRet(i / (steps - 1));
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    }
    return d.trim();
  }, [maxDays]);

  const dueCount = points.filter((p) => p.due).length;
  const avgRetention = points.length
    ? Math.round((points.reduce((s, p) => s + p.retention, 0) / points.length) * 100)
    : 0;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF2FB] flex items-center justify-center shrink-0">
            <TrendingUp size={18} className="text-[#2C6187]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#2C3E50] font-handwriting leading-tight">
              忘却曲線と定着度
            </h3>
            <p className="text-[10px] sm:text-[11px] text-gray-400">
              解答日時をもとに、復習で記憶がどれだけ定着したかを可視化します
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg sm:text-xl font-bold text-[#2C6187] tabular-nums leading-none">
            {avgRetention}<span className="text-xs ml-0.5">%</span>
          </div>
          <div className="text-[10px] text-gray-400">平均定着度</div>
        </div>
      </div>

      {points.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-400">
          復習アイテムがまだありません。<br />問題を解くと、ここに定着度の推移が表示されます。
        </div>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto"
            role="img"
            aria-label="忘却曲線と定着度グラフ"
          >
            {/* Y軸グリッド（0/50/100%） */}
            {[0, 0.5, 1].map((r) => (
              <g key={r}>
                <line
                  x1={padL}
                  y1={yForRet(r)}
                  x2={W - padR}
                  y2={yForRet(r)}
                  stroke="#EEE"
                  strokeWidth={1}
                />
                <text x={padL - 4} y={yForRet(r) + 3} textAnchor="end" fontSize="8" fill="#B0B0B0">
                  {Math.round(r * 100)}
                </text>
              </g>
            ))}

            {/* X軸ラベル（日数） */}
            {REVIEW_INTERVALS_DAYS.map((d) => (
              <text
                key={d}
                x={xForDays(d)}
                y={H - padB + 14}
                textAnchor="middle"
                fontSize="8"
                fill="#B0B0B0"
              >
                {d === 0 ? '当日' : `${d}日`}
              </text>
            ))}

            {/* 復習しない場合の忘却曲線（赤・破線） */}
            <path d={curvePath} fill="none" stroke="#E8A0A0" strokeWidth={1.6} strokeDasharray="4 3" />
            {/* 間隔反復による理想的な定着（青・実線） */}
            <path d={stairPath} fill="none" stroke="#7FB3D5" strokeWidth={2} strokeLinejoin="round" />

            {/* ユーザーの各アイテム（点） */}
            {points.map((p, i) => (
              <circle
                key={p.item.key + i}
                cx={xForDays(p.elapsedDays)}
                cy={yForRet(p.retention)}
                r={p.due ? 4.2 : 3}
                fill={p.due ? '#E8688E' : '#5DADE2'}
                stroke="#fff"
                strokeWidth={1}
              >
                <title>
                  {(p.item.chapterTitle || '') + ' ' + (p.item.subLabel || '')}｜定着度{Math.round(p.retention * 100)}%
                  {p.due ? '（復習推奨）' : ''}
                </title>
              </circle>
            ))}
          </svg>

          {/* 凡例 */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-0 border-t-2 border-dashed border-[#E8A0A0]" />
              復習なしの忘却曲線
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-0 border-t-2 border-[#7FB3D5]" />
              間隔反復での定着
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#E8688E]" />
              復習推奨
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#5DADE2]" />
              あなたの問題
            </span>
          </div>

          {dueCount > 0 && (
            <div className="mt-3 flex items-center gap-2 text-[11px] sm:text-xs text-[#C0392B] bg-[#FDF0F3] rounded-lg px-3 py-2">
              <Calendar size={14} className="shrink-0" />
              <span>
                いま復習すべき問題が <b className="font-bold">{dueCount}</b> 件あります。忘却曲線が下がりきる前に復習しましょう。
              </span>
            </div>
          )}
        </>
      )}
    </section>
  );
};

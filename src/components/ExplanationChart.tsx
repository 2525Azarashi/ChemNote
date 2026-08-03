import React from 'react';
import { EXTRA_EXPLANATION_CHARTS } from './ExplanationChartsExtra';

/**
 * ExplanationChart
 * ------------------------------------------------------------------
 * 学習フローチャート（ロジックツリー）のノード解説に埋め込む「図・グラフ」を
 * SVG で描画するための共通コンポーネント。
 *
 * 【背景・方針】
 *  - 従来、解説テキストの中に「／」「￣」「＼」などの文字を並べた
 *    アスキーアート風のグラフが書かれていた。
 *    これは (1) 等幅フォント以外では形が崩れる、(2) 折り返しで壊れる、
 *    (3) スクリーンリーダーが意味を読み取れない、という致命的な問題がある。
 *  - そこで、グラフは必ず「構造化された SVG」として描画し、
 *    併せて <title> / <desc> と可視キャプションで
 *    「どのようなグラフか」を文章で正確に説明する方針に統一する。
 *
 * 【使い方】
 *   データ側（chemistryData.ts など）のノードに chart: 'heating_curve_pure_vs_mixture'
 *   のようにキーを持たせると、InteractiveTree が該当の図を描画する。
 */

const AXIS_COLOR = '#94a3b8';   // slate-400
const GRID_COLOR = '#e2e8f0';   // slate-200 相当
const PURE_COLOR = '#2563eb';   // blue-600  … 純物質
const MIX_COLOR = '#ea580c';    // orange-600 … 混合物
const LABEL_COLOR = '#475569';  // slate-600

/** 折れ線を SVG path (M/L) に変換する。 */
function toPath(points: Array<[number, number]>): string {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}

/**
 * 純物質と混合物の「加熱時間 − 温度」グラフ（加熱曲線）。
 *
 * 縦軸に温度［℃］、横軸に加熱時間をとったグラフ。
 *  - 純物質（水）: 温度が上がっていき、沸点 100℃ に達すると
 *    沸騰している間は温度が変化せず「水平な平坦部（プラトー）」ができる。
 *    液体が全て気体になった後、再び温度が上がる。
 *  - 混合物（水とエタノール）: 沸騰が始まってからも
 *    組成が変化し続けるため温度が一定にならず、
 *    平坦部を作らずに右上がりに変化し続ける。
 */
function HeatingCurvePureVsMixture() {
  // 描画領域（viewBox 座標系）
  const W = 360;
  const H = 226;
  const padL = 46;
  const padR = 14;
  const padT = 18;
  const padB = 46;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // 軸のスケール: X = 加熱時間(0〜100 の相対値), Y = 温度(0〜120℃)
  const T_MAX = 120;
  const x = (t: number) => padL + (t / 100) * plotW;
  const y = (temp: number) => padT + (1 - temp / T_MAX) * plotH;

  // 純物質（水）: 20℃ →(加熱)→ 100℃ で沸騰中は一定 → 気体になり再上昇
  const purePoints: Array<[number, number]> = [
    [x(0), y(20)],
    [x(14), y(58)],
    [x(30), y(100)],  // 沸点に到達
    [x(66), y(100)],  // 沸騰中：温度が一定（平坦部）
    [x(84), y(116)],  // 全て気体になった後、再び上昇
  ];

  // 混合物（水＋エタノール）: 平坦部ができず、沸騰中も温度が上がり続ける
  const mixPoints: Array<[number, number]> = [
    [x(0), y(20)],
    [x(12), y(52)],
    [x(24), y(78)],   // エタノールを多く含む蒸気が出始める付近
    [x(40), y(85)],
    [x(56), y(91)],
    [x(72), y(97)],
    [x(84), y(104)],
  ];

  const yTicks = [0, 20, 40, 60, 80, 100];

  return (
    <figure className="my-2 w-full">
      <div className="rounded-xl border border-slate-200 bg-white p-2 sm:p-3 shadow-sm">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-labelledby="heating-curve-title heating-curve-desc"
          preserveAspectRatio="xMidYMid meet"
        >
          <title id="heating-curve-title">純物質と混合物の加熱曲線（加熱時間と温度の関係）</title>
          <desc id="heating-curve-desc">
            縦軸に温度［℃］、横軸に加熱時間をとったグラフ。純物質（水）の曲線は温度が上昇したあと
            沸点100℃で水平な平坦部をつくり、沸騰し終わると再び上昇する。
            混合物（水とエタノール）の曲線は平坦部をつくらず、沸騰が始まったあとも
            右上がりに温度が変化し続ける。
          </desc>

          {/* 横方向のグリッド線と温度目盛り */}
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={padL} y1={y(t)} x2={W - padR} y2={y(t)} stroke={GRID_COLOR} strokeWidth={1} />
              <text x={padL - 6} y={y(t) + 3.5} textAnchor="end" fontSize={9} fill={LABEL_COLOR}>
                {t}
              </text>
            </g>
          ))}

          {/* 沸点 100℃ の補助線 */}
          <line
            x1={padL}
            y1={y(100)}
            x2={W - padR}
            y2={y(100)}
            stroke={PURE_COLOR}
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.55}
          />
          <text x={W - padR} y={y(100) - 5} textAnchor="end" fontSize={9} fill={PURE_COLOR} fontWeight="bold">
            沸点 100℃
          </text>

          {/* 座標軸 */}
          <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={AXIS_COLOR} strokeWidth={1.5} />
          <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke={AXIS_COLOR} strokeWidth={1.5} />

          {/* 軸ラベル */}
          <text x={padL - 34} y={padT + 4} fontSize={10} fill={LABEL_COLOR} fontWeight="bold">
            温度[℃]
          </text>
          <text x={W - padR} y={padT + plotH + 26} textAnchor="end" fontSize={10} fill={LABEL_COLOR} fontWeight="bold">
            加熱時間 →
          </text>

          {/* 混合物の曲線（平坦部なし・上昇し続ける） */}
          <path d={toPath(mixPoints)} fill="none" stroke={MIX_COLOR} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />

          {/* 純物質の曲線（沸騰中は水平な平坦部） */}
          <path d={toPath(purePoints)} fill="none" stroke={PURE_COLOR} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />

          {/* 平坦部の強調（沸騰中は温度が一定） */}
          <text x={x(48)} y={y(100) - 9} textAnchor="middle" fontSize={9} fill={PURE_COLOR} fontWeight="bold">
            温度が一定
          </text>
          <text x={x(62)} y={y(88)} textAnchor="middle" fontSize={9} fill={MIX_COLOR} fontWeight="bold">
            一定にならない
          </text>

          {/* 凡例 */}
          <g transform={`translate(${padL + 4}, ${padT + plotH + 34})`}>
            <line x1={0} y1={-3} x2={18} y2={-3} stroke={PURE_COLOR} strokeWidth={2.4} strokeLinecap="round" />
            <text x={23} y={0} fontSize={9.5} fill={LABEL_COLOR}>純物質（水）</text>
            <line x1={104} y1={-3} x2={122} y2={-3} stroke={MIX_COLOR} strokeWidth={2.4} strokeLinecap="round" />
            <text x={127} y={0} fontSize={9.5} fill={LABEL_COLOR}>混合物（水＋エタノール）</text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-1.5 text-[11px] sm:text-xs leading-relaxed text-slate-600">
        <span className="font-bold text-slate-700">図：純物質と混合物の加熱曲線</span>
        ／縦軸＝温度［℃］、横軸＝加熱時間。
        <span className="font-bold" style={{ color: PURE_COLOR }}>純物質（水）</span>
        は沸点100℃に達すると沸騰し終わるまで温度が変わらず<strong>水平な平坦部</strong>ができるが、
        <span className="font-bold" style={{ color: MIX_COLOR }}>混合物（水＋エタノール）</span>
        は沸騰中も組成が変わるため平坦部ができず、<strong>右上がりに温度が変化し続ける</strong>。
      </figcaption>
    </figure>
  );
}

/** 解説ノードから参照できる図の一覧（キー → コンポーネント）。 */
export const EXPLANATION_CHARTS: Record<string, React.FC> = {
  heating_curve_pure_vs_mixture: HeatingCurvePureVsMixture,
  // ロジックツリー内のアスキーアート図を置き換えた SVG 図（別ファイルで定義）
  ...EXTRA_EXPLANATION_CHARTS,
};

export interface ExplanationChartProps {
  /** EXPLANATION_CHARTS のキー */
  chartId?: string;
}

/** キーに対応する図を描画する（未登録キーの場合は何も描画しない）。 */
export function ExplanationChart({ chartId }: ExplanationChartProps) {
  if (!chartId) return null;
  const Chart = EXPLANATION_CHARTS[chartId];
  if (!Chart) return null;
  return <Chart />;
}

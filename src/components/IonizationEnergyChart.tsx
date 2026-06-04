import React, { useState } from 'react';

interface ChartDataPoint {
  atomicNumber: number;
  symbol: string;
  energy: number;
  type: 'noble' | 'alkali' | 'other';
  name: string;
}

const data: ChartDataPoint[] = [
  { atomicNumber: 1, symbol: "H", energy: 1312, type: "other", name: "水素" },
  { atomicNumber: 2, symbol: "He", energy: 2372, type: "noble", name: "ヘリウム" },
  { atomicNumber: 3, symbol: "Li", energy: 520, type: "alkali", name: "リチウム" },
  { atomicNumber: 4, symbol: "Be", energy: 899, type: "other", name: "ベリリウム" },
  { atomicNumber: 5, symbol: "B", energy: 801, type: "other", name: "ホウ素" },
  { atomicNumber: 6, symbol: "C", energy: 1086, type: "other", name: "炭素" },
  { atomicNumber: 7, symbol: "N", energy: 1402, type: "other", name: "窒素" },
  { atomicNumber: 8, symbol: "O", energy: 1314, type: "other", name: "酸素" },
  { atomicNumber: 9, symbol: "F", energy: 1681, type: "other", name: "フッ素" },
  { atomicNumber: 10, symbol: "Ne", energy: 2081, type: "noble", name: "ネオン" },
  { atomicNumber: 11, symbol: "Na", energy: 496, type: "alkali", name: "ナトリウム" },
  { atomicNumber: 12, symbol: "Mg", energy: 738, type: "other", name: "マグネシウム" },
  { atomicNumber: 13, symbol: "Al", energy: 578, type: "other", name: "アルミニウム" },
  { atomicNumber: 14, symbol: "Si", energy: 786, type: "other", name: "ケイ素" },
  { atomicNumber: 15, symbol: "P", energy: 1012, type: "other", name: "リン" },
  { atomicNumber: 16, symbol: "S", energy: 1000, type: "other", name: "硫黄" },
  { atomicNumber: 17, symbol: "Cl", energy: 1251, type: "other", name: "塩素" },
  { atomicNumber: 18, symbol: "Ar", energy: 1521, type: "noble", name: "アルゴン" },
  { atomicNumber: 19, symbol: "K", energy: 419, type: "alkali", name: "カリウム" },
  { atomicNumber: 20, symbol: "Ca", energy: 590, type: "other", name: "カルシウム" },
];

interface IonizationEnergyChartProps {
  showDetails?: boolean;
}

export function IonizationEnergyChart({ showDetails = true }: IonizationEnergyChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  // SVG Size Parameters
  const viewBoxWidth = 850;
  const viewBoxHeight = 400;
  const paddingLeft = 70;
  const paddingRight = 40;
  const paddingTop = 60;
  const paddingBottom = 50;

  const width = viewBoxWidth - paddingLeft - paddingRight;
  const height = viewBoxHeight - paddingTop - paddingBottom;

  // Range setting: matches the provided image
  const minY = 350;
  const maxY = 2500;

  const getX = (n: number) => paddingLeft + (n - 1) * (width / 19);
  const getY = (energy: number) => paddingTop + height - ((energy - minY) / (maxY - minY)) * height;

  // Line paths
  const linePoints = data.map(d => `${getX(d.atomicNumber)},${getY(d.energy)}`).join(' ');

  // Grid line values
  const yGridValues = [500, 750, 1000, 1250, 1500, 1750, 2000, 2250];

  return (
    <div id="ionization-energy-chart-container" className="w-full bg-white border border-gray-200 rounded-3xl p-3 sm:p-5 shadow-sm max-w-4xl mx-auto my-6">
      <div className="text-center mb-3">
        <h4 id="ionization-chart-title" className="text-base sm:text-lg font-bold text-slate-800 tracking-tight flex items-center justify-center gap-2">
          <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-mono">図6</span>
          第1イオン化エネルギーの周期性
        </h4>
        {showDetails && (
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            ※各点にホバー、タップすると元素の詳細情報が表示されます。
          </p>
        )}
      </div>

      <div className="relative overflow-x-auto">
        <div className="min-w-[640px] max-w-full">
          <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-auto select-none overflow-visible">
            {/* Background Grid Lines (Y-axis) */}
            {yGridValues.map((val) => {
              const yPos = getY(val);
              return (
                <g key={`grid-y-${val}`}>
                  <line
                    x1={paddingLeft}
                    y1={yPos}
                    x2={viewBoxWidth - paddingRight}
                    y2={yPos}
                    stroke="#F1F5F9"
                    strokeWidth={1.5}
                  />
                  <line
                    x1={paddingLeft - 8}
                    y1={yPos}
                    x2={paddingLeft}
                    y2={yPos}
                    stroke="#E2E8F0"
                    strokeWidth={1.5}
                  />
                  <text
                    x={paddingLeft - 12}
                    y={yPos + 4}
                    textAnchor="end"
                    className="text-[10px] sm:text-xs font-mono fill-slate-500"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Background Grid Lines (X-axis, atomic numbers) */}
            {data.map((d) => {
              const xPos = getX(d.atomicNumber);
              return (
                <g key={`grid-x-${d.atomicNumber}`}>
                  <line
                    x1={xPos}
                    y1={paddingTop}
                    x2={xPos}
                    y2={paddingTop + height}
                    stroke="#F1F5F9"
                    strokeWidth={1}
                    className="opacity-70"
                  />
                  <line
                    x1={xPos}
                    y1={paddingTop + height}
                    x2={xPos}
                    y2={paddingTop + height + 8}
                    stroke="#DDE2EC"
                    strokeWidth={1.5}
                  />
                  <text
                    x={xPos}
                    y={paddingTop + height + 20}
                    textAnchor="middle"
                    className="text-[10px] sm:text-xs font-medium fill-slate-600 font-mono"
                  >
                    {d.atomicNumber}
                  </text>
                </g>
              );
            })}

            {/* X and Y Axes lines */}
            <line
              x1={paddingLeft}
              y1={paddingTop - 10}
              x2={paddingLeft}
              y2={paddingTop + height + 10}
              stroke="#CBD5E1"
              strokeWidth={2}
            />
            <line
              x1={paddingLeft - 10}
              y1={paddingTop + height}
              x2={viewBoxWidth - paddingRight + 10}
              y2={paddingTop + height}
              stroke="#CBD5E1"
              strokeWidth={2}
            />

            {/* Labels for axes */}
            <text
              transform={`rotate(-90) translate(${-paddingTop - height / 2}, 22)`}
              textAnchor="middle"
              className="text-xs sm:text-sm font-bold fill-slate-700"
            >
              第1イオン化エネルギー (kJ/mol)
            </text>
            <text
              x={paddingLeft + width / 2}
              y={paddingTop + height + 36}
              textAnchor="middle"
              className="text-xs sm:text-sm font-bold fill-slate-700"
            >
              原子番号
            </text>

            {/* Connecting line */}
            <polyline
              points={linePoints}
              fill="none"
              stroke="#1D4ED8"
              strokeWidth={3}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Interactive Data Nodes */}
            {data.map((d) => {
              const cx = getX(d.atomicNumber);
              const cy = getY(d.energy);
              
              // Color mapping in sync with user image
              let nodeColor = "#1D4ED8"; // Standard blue
              if (d.type === 'noble') nodeColor = "#EF4444"; // Noble gas - Red
              else if (d.type === 'alkali') nodeColor = "#15803D"; // Alkali metal - Green

              const isHovered = hoveredPoint?.atomicNumber === d.atomicNumber;

              return (
                <g 
                  key={`node-${d.atomicNumber}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(d)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => setHoveredPoint(d)}
                >
                  {/* Subtle pulsing background for noble/alkali points to catch eye */}
                  {isHovered && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={11}
                      fill={nodeColor}
                      opacity={0.3}
                      className="transition-all duration-300"
                    />
                  )}
                  {/* Main Point Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 7.5 : 5.5}
                    fill={nodeColor}
                    stroke="#FFF"
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    className="transition-all duration-200"
                  />
                  {/* Element symbol above */}
                  <text
                    x={cx}
                    y={cy - 12}
                    textAnchor="middle"
                    className={`text-[10px] font-bold ${
                      isHovered ? 'fill-indigo-900 text-xs scale-110' : 'fill-slate-700'
                    } transition-all duration-150`}
                  >
                    {d.symbol}
                  </text>
                </g>
              );
            })}

            {/* Custom Legend Box (matches the layout exactly) */}
            <g transform={`translate(${viewBoxWidth - 190}, ${paddingTop - 45})`}>
              <rect
                width={170}
                height={55}
                rx={6}
                fill="#F8FAFC"
                stroke="#E2E8F0"
                strokeWidth={1}
              />
              {/* Legend 1: Noble */}
              <circle cx={15} cy={16} r={5.5} fill="#EF4444" />
              <text x={28} y={20} className="text-[11px] font-bold fill-slate-700">貴ガス（極大）</text>

              {/* Legend 2: Alkali */}
              <circle cx={15} cy={38} r={5.5} fill="#15803D" />
              <text x={28} y={42} className="text-[11px] font-bold fill-slate-700">アルカリ金属（極小）</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Floating Detailed Hover Info Box */}
      {showDetails && (
        <div 
          id="ionization-detail-panel" 
          className={`mt-4 p-4 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-3 ${
            hoveredPoint 
              ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' 
              : 'bg-slate-50/30 border-slate-100 opacity-60'
          }`}
        >
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
              hoveredPoint?.type === 'noble' 
                ? 'bg-red-500' 
                : hoveredPoint?.type === 'alkali' 
                  ? 'bg-emerald-600' 
                  : 'bg-blue-600'
            }`}>
              {hoveredPoint ? hoveredPoint.symbol : '?'}
            </div>
            <div>
              <h5 className="font-bold text-sm text-slate-800">
                {hoveredPoint 
                  ? `${hoveredPoint.name}（原子番号: ${hoveredPoint.atomicNumber}）` 
                  : 'グラフで確認したい点をタップしてください'}
              </h5>
              <p className="text-xs text-slate-500">
                {hoveredPoint 
                  ? `${hoveredPoint.type === 'noble' ? '18族・貴ガス元素。最外殻が安定閉殻のため、電子を1個奪うのに非常に大きなエネルギーを必要とします。' : hoveredPoint.type === 'alkali' ? '1族・アルカリ金属元素。最外殻に1個だけ電子を持つため、奪われやすくエネルギーは最小になります。' : '典型元素。同一周期内では原子番号が増えるほど原子核が電子を引く力が強まり、イオン化エネルギーは増加傾向にあります。'}` 
                  : '周期的なエネルギーの増減が確認できます。貴ガス（赤）でピーク、アルカリ金属（緑）でボトムとなります。'}
              </p>
            </div>
          </div>
          {hoveredPoint && (
            <div className="text-right sm:text-left shrink-0 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-start">
              <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">
                第1イオン化エネルギー
              </span>
              <span className="text-lg font-extrabold text-indigo-700 font-mono">
                {hoveredPoint.energy} <span className="text-xs font-semibold text-slate-400">kJ/mol</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

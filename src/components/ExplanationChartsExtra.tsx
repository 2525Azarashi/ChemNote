import React from 'react';

/**
 * ExplanationChartsExtra
 * ------------------------------------------------------------------
 * フローチャート（ロジックツリー）のノード解説に埋め込む「図」の追加分。
 *
 * 【背景】
 *  ロジックツリーの解説には「┌───┐」「／」「│」などの文字を並べた
 *  アスキーアート風の図が残っていた。これは
 *    (1) 等幅フォントでないと形が崩れる
 *    (2) 折り返しで壊れて「図が枠に入りきらない」状態になる
 *    (3) 支援技術が図として認識できない
 *  という問題があり、ユーザーからも「フローチャート内に図が入りきっていない」
 *  という指摘を受けた。
 *
 * 【方針】
 *  すべての図を viewBox 付きの SVG（w-full h-auto）で描き直す。
 *  これで親要素の幅に必ず収まり、どの端末でも形が崩れない。
 *  併せて <title>/<desc> と可視キャプションで内容を文章でも説明する。
 */

const SLATE = '#475569';
const SLATE_LINE = '#94a3b8';
const BLUE = '#2563eb';
const ORANGE = '#ea580c';
const GREEN = '#059669';
const PURPLE = '#7c3aed';
const PINK = '#d9466e';

/** 図の共通フレーム（枠 ＋ キャプション） */
function ChartFrame({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: React.ReactNode;
}) {
  return (
    <figure className="my-2 w-full">
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
        {children}
      </div>
      <figcaption className="mt-1.5 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
        {caption}
      </figcaption>
    </figure>
  );
}

/** 角丸の箱（ラベル入り） */
function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  fill = '#f8fafc',
  stroke = SLATE_LINE,
  color = SLATE,
  fontSize = 11,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  fill?: string;
  stroke?: string;
  color?: string;
  fontSize?: number;
}) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} fill={fill} stroke={stroke} strokeWidth={1.4} />
      <text
        x={cx}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="bold"
        fill={color}
      >
        {label}
      </text>
      {sub && (
        <text x={cx} y={y + h / 2 + 11} textAnchor="middle" fontSize={fontSize - 2} fill={color} opacity={0.8}>
          {sub}
        </text>
      )}
    </g>
  );
}

/* ==================================================================
 * ① 物質量の単位変換マップ（mol がハブ）  … p4_2_n8
 * ================================================================== */
function MolConversionMap() {
  const W = 360;
  const H = 300;
  const A = 'url(#exc-arrow)';
  return (
    <ChartFrame
      caption={
        <>
          <span className="font-bold text-slate-700">図：単位変換マップ（mol がすべてのハブ）</span>
          ／中心の <b>物質量［mol］</b> と、質量［g］・粒子の個数［個］・標準状態の気体の体積［L］が
          それぞれ1本の矢印で結ばれている。
          <b>mol へ行くときは ÷</b>、<b>mol から出るときは ×</b>。
          使う数は 個数なら 6.0×10²³、質量ならモル質量 M、体積なら 22.4 L/mol。
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="exc-mol-t exc-mol-d">
        <title id="exc-mol-t">物質量（mol）を中心とした単位変換マップ</title>
        <desc id="exc-mol-d">
          中心に物質量［mol］の箱があり、上に質量［g］、下に粒子の個数［個］、さらに下に標準状態の気体の体積［L］の箱がある。
          molへ向かう矢印は割り算、molから出る矢印は掛け算で、それぞれモル質量M、6.0×10の23乗、22.4L/molを使う。
        </desc>
        <defs>
          <marker id="exc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={SLATE_LINE} />
          </marker>
        </defs>

        {/* 質量 [g] */}
        <Box x={110} y={8} w={140} h={34} label="質量［g］" fill="#fff7ed" stroke={ORANGE} color="#9a3412" />
        {/* mol（ハブ） */}
        <Box x={92} y={110} w={176} h={44} label="物質量［mol］" sub="★ すべての中心（ハブ）" fill="#fdf2f8" stroke={PINK} color="#9d174d" fontSize={13} />
        {/* 個数 */}
        <Box x={8} y={228} w={150} h={34} label="粒子の個数［個］" fill="#eff6ff" stroke={BLUE} color="#1e40af" />
        {/* 気体の体積 */}
        <Box x={196} y={228} w={156} h={34} label="気体の体積［L］" sub="標準状態 0℃・1.013×10⁵Pa" fill="#ecfdf5" stroke={GREEN} color="#065f46" />

        {/* g ⇄ mol */}
        <line x1={158} y1={42} x2={158} y2={108} stroke={SLATE_LINE} strokeWidth={1.6} markerEnd={A} />
        <line x1={202} y1={108} x2={202} y2={42} stroke={SLATE_LINE} strokeWidth={1.6} markerEnd={A} />
        <text x={152} y={70} textAnchor="end" fontSize={10} fontWeight="bold" fill="#9a3412">÷ M</text>
        <text x={152} y={83} textAnchor="end" fontSize={8.5} fill={SLATE}>g→mol</text>
        <text x={208} y={70} fontSize={10} fontWeight="bold" fill="#9a3412">× M</text>
        <text x={208} y={83} fontSize={8.5} fill={SLATE}>mol→g</text>

        {/* mol ⇄ 個数 */}
        <path d="M138 154 L100 200 L92 226" fill="none" stroke={SLATE_LINE} strokeWidth={1.6} markerEnd={A} />
        <path d="M60 226 L52 198 L112 158" fill="none" stroke={SLATE_LINE} strokeWidth={1.6} markerEnd={A} />
        <text x={110} y={186} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill="#1e40af">× 6.0×10²³</text>
        <text x={44} y={186} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill="#1e40af">÷ 6.0×10²³</text>

        {/* mol ⇄ 体積 */}
        <path d="M222 154 L262 200 L270 226" fill="none" stroke={SLATE_LINE} strokeWidth={1.6} markerEnd={A} />
        <path d="M320 226 L330 198 L248 158" fill="none" stroke={SLATE_LINE} strokeWidth={1.6} markerEnd={A} />
        <text x={248} y={186} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill="#065f46">× 22.4</text>
        <text x={326} y={186} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill="#065f46">÷ 22.4</text>

        {/* コツ */}
        <text x={W / 2} y={288} textAnchor="middle" fontSize={10} fontWeight="bold" fill={PURPLE}>
          コツ：まず mol に直す → 次に求めたい単位へ変換
        </text>
      </svg>
    </ChartFrame>
  );
}

/* ==================================================================
 * ② 原子の構造（階層図）  … p2_1_n1
 * ================================================================== */
function AtomStructureTree() {
  const W = 360;
  const H = 176;
  return (
    <ChartFrame
      caption={
        <>
          <span className="font-bold text-slate-700">図：原子の構造</span>
          ／原子（直径 約10⁻¹⁰ m）は、中心の<b>原子核</b>（10⁻¹⁵〜10⁻¹⁴ m）と、そのまわりに分布する
          <b>電子</b>（−電荷）からできている。原子核は<b>陽子</b>（＋電荷）と<b>中性子</b>（電荷なし）でできている。
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="exc-atom-t exc-atom-d">
        <title id="exc-atom-t">原子の構造の階層図</title>
        <desc id="exc-atom-d">
          原子は原子核と電子に分かれ、原子核はさらに陽子と中性子に分かれる階層構造の図。
        </desc>
        <Box x={96} y={6} w={168} h={32} label="原子（約 10⁻¹⁰ m）" fill="#f1f5f9" stroke={SLATE_LINE} />

        {/* 原子核 / 電子 の分岐 */}
        <path d="M180 38 L180 52 M96 52 L264 52 M96 52 L96 66 M264 52 L264 66" fill="none" stroke={SLATE_LINE} strokeWidth={1.4} />
        <Box x={18} y={66} w={156} h={34} label="原子核" sub="10⁻¹⁵〜10⁻¹⁴ m（＋）" fill="#fff7ed" stroke={ORANGE} color="#9a3412" />
        <Box x={198} y={66} w={150} h={34} label="電子 e⁻" sub="− 電荷・核のまわりに分布" fill="#eff6ff" stroke={BLUE} color="#1e40af" />

        {/* 陽子 / 中性子 */}
        <path d="M96 100 L96 114 M30 114 L162 114 M30 114 L30 128 M162 114 L162 128" fill="none" stroke={SLATE_LINE} strokeWidth={1.4} />
        <Box x={0} y={128} w={82} h={32} label="陽子 p" sub="＋ 電荷" fill="#fef2f2" stroke="#dc2626" color="#991b1b" fontSize={10} />
        <Box x={110} y={128} w={94} h={32} label="中性子 n" sub="電荷なし" fill="#f5f3ff" stroke={PURPLE} color="#5b21b6" fontSize={10} />

        <text x={W - 4} y={H - 4} textAnchor="end" fontSize={9} fill={SLATE}>
          陽子の数 ＝ 原子番号 ／ 陽子＋中性子 ＝ 質量数
        </text>
      </svg>
    </ChartFrame>
  );
}

/* ==================================================================
 * ③ 加熱曲線（融点・沸点で温度一定）  … p1_3_n9
 * ================================================================== */
function MeltingBoilingCurve() {
  const W = 360;
  const H = 214;
  const padL = 44;
  const padR = 12;
  const padT = 16;
  const padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const x = (t: number) => padL + (t / 100) * plotW;
  const y = (v: number) => padT + (1 - v / 100) * plotH;

  // 固体 → (融解:一定) → 液体 → (沸騰:一定) → 気体
  const pts: Array<[number, number]> = [
    [x(0), y(6)],
    [x(14), y(28)],
    [x(34), y(28)], // 融点：融解中は一定
    [x(50), y(62)],
    [x(68), y(62)], // 沸点：沸騰中は一定
    [x(86), y(90)],
  ];
  const path = pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');

  return (
    <ChartFrame
      caption={
        <>
          <span className="font-bold text-slate-700">図：加熱曲線（純物質）</span>
          ／縦軸＝温度、横軸＝加熱時間。<b style={{ color: BLUE }}>融点</b>と
          <b style={{ color: ORANGE }}>沸点</b>では、状態変化が終わるまで温度が上がらず
          <b>水平な平坦部</b>ができる（加えた熱が融解熱・蒸発熱として使われるため）。
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="exc-mb-t exc-mb-d">
        <title id="exc-mb-t">純物質の加熱曲線（融点・沸点で温度一定）</title>
        <desc id="exc-mb-d">
          縦軸に温度、横軸に加熱時間をとったグラフ。温度は上昇したのち融点で水平になり、
          融解が終わると再び上昇し、沸点でまた水平になり、沸騰が終わると再び上昇する。
        </desc>

        {/* 融点・沸点の補助線 */}
        <line x1={padL} y1={y(28)} x2={W - padR} y2={y(28)} stroke={BLUE} strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
        <line x1={padL} y1={y(62)} x2={W - padR} y2={y(62)} stroke={ORANGE} strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
        <text x={padL - 5} y={y(28) + 3.5} textAnchor="end" fontSize={9.5} fontWeight="bold" fill={BLUE}>融点</text>
        <text x={padL - 5} y={y(62) + 3.5} textAnchor="end" fontSize={9.5} fontWeight="bold" fill={ORANGE}>沸点</text>

        {/* 軸 */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={SLATE_LINE} strokeWidth={1.5} />
        <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke={SLATE_LINE} strokeWidth={1.5} />
        <text x={padL - 30} y={padT + 2} fontSize={10} fontWeight="bold" fill={SLATE}>温度</text>
        <text x={W - padR} y={padT + plotH + 24} textAnchor="end" fontSize={10} fontWeight="bold" fill={SLATE}>加熱時間 →</text>

        {/* 曲線 */}
        <path d={path} fill="none" stroke={PINK} strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" />

        {/* 平坦部の注記 */}
        <text x={x(24)} y={y(28) - 6} textAnchor="middle" fontSize={9} fontWeight="bold" fill={BLUE}>融解中：温度一定</text>
        <text x={x(59)} y={y(62) - 6} textAnchor="middle" fontSize={9} fontWeight="bold" fill={ORANGE}>沸騰中：温度一定</text>

        {/* 状態のラベル */}
        <text x={x(5)} y={padT + plotH + 14} fontSize={9} fill={SLATE}>固体</text>
        <text x={x(42)} y={padT + plotH + 14} fontSize={9} fill={SLATE}>液体</text>
        <text x={x(80)} y={padT + plotH + 14} fontSize={9} fill={SLATE}>気体</text>
      </svg>
    </ChartFrame>
  );
}

/* ==================================================================
 * ④ 三態と状態変化の6つの名前  … p1_3_n8
 * ================================================================== */
function StateChangeMap() {
  const W = 360;
  const H = 200;
  const A = 'url(#exc-arrow2)';
  return (
    <ChartFrame
      caption={
        <>
          <span className="font-bold text-slate-700">図：三態と状態変化</span>
          ／固体⇄液体は<b>融解／凝固</b>、液体⇄気体は<b>蒸発／凝縮</b>。
          固体⇄気体は液体を飛ばす変化で、固体→気体が<b>昇華</b>、気体→固体が<b>凝華</b>。
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="exc-state-t exc-state-d">
        <title id="exc-state-t">固体・液体・気体の三態と6つの状態変化</title>
        <desc id="exc-state-d">
          固体・液体・気体の3つの箱が横に並び、隣り合う箱の間に融解と凝固、蒸発と凝縮の矢印がある。
          さらに固体と気体を直接つなぐ大きな矢印が上下にあり、上が昇華（固体から気体）、下が凝華（気体から固体）を表す。
        </desc>
        <defs>
          <marker id="exc-arrow2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={SLATE_LINE} />
          </marker>
        </defs>

        {/* 昇華（固体 → 気体）: 上を大きく回る */}
        <path d="M46 74 C46 18 314 18 314 74" fill="none" stroke={PURPLE} strokeWidth={1.8} markerEnd={A} />
        <text x={180} y={22} textAnchor="middle" fontSize={11} fontWeight="bold" fill={PURPLE}>昇華（固 → 気）</text>

        {/* 3つの箱 */}
        <Box x={4} y={78} w={84} h={40} label="固体" sub="形・体積一定" fill="#eff6ff" stroke={BLUE} color="#1e40af" fontSize={13} />
        <Box x={138} y={78} w={84} h={40} label="液体" sub="形は自由" fill="#ecfdf5" stroke={GREEN} color="#065f46" fontSize={13} />
        <Box x={272} y={78} w={84} h={40} label="気体" sub="自由に広がる" fill="#fff7ed" stroke={ORANGE} color="#9a3412" fontSize={13} />

        {/* 固体 ⇄ 液体 */}
        <line x1={90} y1={90} x2={136} y2={90} stroke={SLATE_LINE} strokeWidth={1.6} markerEnd={A} />
        <line x1={136} y1={108} x2={90} y2={108} stroke={SLATE_LINE} strokeWidth={1.6} markerEnd={A} />
        <text x={113} y={85} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill={SLATE}>融解</text>
        <text x={113} y={122} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill={SLATE}>凝固</text>

        {/* 液体 ⇄ 気体 */}
        <line x1={224} y1={90} x2={270} y2={90} stroke={SLATE_LINE} strokeWidth={1.6} markerEnd={A} />
        <line x1={270} y1={108} x2={224} y2={108} stroke={SLATE_LINE} strokeWidth={1.6} markerEnd={A} />
        <text x={247} y={85} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill={SLATE}>蒸発</text>
        <text x={247} y={122} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill={SLATE}>凝縮</text>

        {/* 凝華（気体 → 固体）: 下を大きく回る */}
        <path d="M314 122 C314 176 46 176 46 122" fill="none" stroke={PURPLE} strokeWidth={1.8} markerEnd={A} />
        <text x={180} y={192} textAnchor="middle" fontSize={11} fontWeight="bold" fill={PURPLE}>凝華（気 → 固）</text>
      </svg>
    </ChartFrame>
  );
}

/* ==================================================================
 * ⑤ ろ過の装置  … p1_2A_n5
 * ================================================================== */
function FiltrationApparatus() {
  const W = 340;
  const H = 220;
  return (
    <ChartFrame
      caption={
        <>
          <span className="font-bold text-slate-700">図：ろ過の装置</span>
          ／① 液は<b>ガラス棒に伝わらせて</b>静かに注ぐ。② <b>ろうとの足を受けビーカーの内壁につける</b>
          （毛細管現象で連続的に流れ、はねを防ぐ）。③ <b>ガラス棒の先はろ紙の三重に重なった側</b>につける。
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="exc-filt-t exc-filt-d">
        <title id="exc-filt-t">ろ過の装置の模式図</title>
        <desc id="exc-filt-d">
          左上のビーカーからガラス棒に伝わらせて液を注ぎ、ろ紙を敷いたろうとを通し、
          ろうとの足を受けビーカーの内壁につけてろ液を受ける様子を表した模式図。
        </desc>

        {/* 注ぐビーカー（傾けた） */}
        <g transform="translate(6,10) rotate(-18 40 30)">
          <path d="M6 4 L6 52 Q6 60 16 60 L58 60 Q68 60 68 52 L68 4" fill="#eff6ff" stroke={BLUE} strokeWidth={1.6} />
          <path d="M6 22 L68 22" stroke={BLUE} strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
        </g>
        <text x={4} y={92} fontSize={9.5} fontWeight="bold" fill={BLUE}>混合物（例：砂＋水）</text>

        {/* ガラス棒 */}
        <line x1={80} y1={28} x2={148} y2={86} stroke="#0f172a" strokeWidth={3.4} strokeLinecap="round" opacity={0.75} />
        <text x={92} y={26} fontSize={9.5} fontWeight="bold" fill={SLATE}>① ガラス棒に伝わらせる</text>

        {/* ろうと（V字）＋ろ紙 */}
        <path d="M120 84 L214 84 L172 138 L162 138 Z" fill="#f8fafc" stroke={SLATE_LINE} strokeWidth={1.6} />
        <path d="M132 90 L202 90 L169 132 L165 132 Z" fill="#fde68a" stroke="#d97706" strokeWidth={1.3} opacity={0.85} />
        <text x={218} y={92} fontSize={9.5} fontWeight="bold" fill="#92400e">ろ紙（ろうと）</text>
        <text x={218} y={104} fontSize={8.5} fill={SLATE}>③ 棒の先は三重側へ</text>

        {/* ろうとの足 */}
        <path d="M162 138 L162 176 L172 176 L172 138" fill="#f8fafc" stroke={SLATE_LINE} strokeWidth={1.6} />
        <text x={182} y={166} fontSize={9.5} fontWeight="bold" fill={SLATE}>② 足を内壁につける</text>

        {/* 受けビーカー */}
        <path d="M112 158 L112 208 Q112 216 122 216 L216 216 Q226 216 226 208 L226 158" fill="#ecfdf5" stroke={GREEN} strokeWidth={1.8} />
        <path d="M112 192 Q169 186 226 192 L226 208 Q226 216 216 216 L122 216 Q112 216 112 208 Z" fill="#a7f3d0" opacity={0.7} />
        <text x={169} y={207} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#065f46">ろ液</text>

        {/* 残った固体 */}
        <text x={228} y={126} fontSize={9} fill={SLATE}>ろ紙上に残る ＝ 固体（砂）</text>
      </svg>
    </ChartFrame>
  );
}

/* ==================================================================
 * ⑥ 周期表の傾向（イオン化エネルギー・電子親和力）  … p2_3_n4
 * ================================================================== */
function PeriodicTrendEnergy() {
  const W = 340;
  const H = 190;
  const A = 'url(#exc-arrow3)';
  return (
    <ChartFrame
      caption={
        <>
          <span className="font-bold text-slate-700">図：周期表での傾向</span>
          ／イオン化エネルギーも電子親和力も、大まかには
          <b>右上へ行くほど大きく、左下へ行くほど小さい</b>。
          右上ほど原子核が電子を強く引きつけるため。
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="exc-pte-t exc-pte-d">
        <title id="exc-pte-t">イオン化エネルギーと電子親和力の周期表上の傾向</title>
        <desc id="exc-pte-d">
          周期表を表す長方形の上に、左下から右上へ向かう太い矢印が描かれている。
          矢印の先（右上）が「大きい」、根元（左下）が「小さい」を表す。
        </desc>
        <defs>
          <marker id="exc-arrow3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={PINK} />
          </marker>
        </defs>

        {/* 周期表の枠 */}
        <rect x={40} y={38} width={264} height={112} rx={6} fill="#f8fafc" stroke={SLATE_LINE} strokeWidth={1.5} />
        {[1, 2, 3, 4, 5].map((i) => (
          <line key={`v${i}`} x1={40 + (264 / 6) * i} y1={38} x2={40 + (264 / 6) * i} y2={150} stroke="#e2e8f0" strokeWidth={1} />
        ))}
        {[1, 2].map((i) => (
          <line key={`h${i}`} x1={40} y1={38 + (112 / 3) * i} x2={304} y2={38 + (112 / 3) * i} stroke="#e2e8f0" strokeWidth={1} />
        ))}
        <text x={172} y={30} textAnchor="middle" fontSize={10.5} fontWeight="bold" fill={SLATE}>周期表（→ 族／↓ 周期）</text>

        {/* 左下 → 右上 の矢印 */}
        <line x1={58} y1={140} x2={288} y2={50} stroke={PINK} strokeWidth={3.4} markerEnd={A} strokeLinecap="round" />

        {/* ラベル */}
        <text x={296} y={44} textAnchor="end" fontSize={11} fontWeight="bold" fill={PINK}>右上：大きい</text>
        <text x={48} y={162} fontSize={11} fontWeight="bold" fill={SLATE}>左下：小さい</text>
        <text x={172} y={182} textAnchor="middle" fontSize={9.5} fill={SLATE}>
          ※ 貴ガスはイオン化エネルギーが特に大きい（電子配置が安定）
        </text>
      </svg>
    </ChartFrame>
  );
}

/* ==================================================================
 * ⑦ 原子半径の傾向  … p2_4_n3
 * ================================================================== */
function AtomicRadiusTrend() {
  const W = 340;
  const H = 200;
  const A = 'url(#exc-arrow4)';
  return (
    <ChartFrame
      caption={
        <>
          <span className="font-bold text-slate-700">図：原子半径の傾向</span>
          ／同じ周期では<b>右へ行くほど小さく</b>（原子核の正電荷が増えて電子を強く引く）、
          同じ族では<b>下へ行くほど大きい</b>（電子殻が増える）。つまり
          <b>右上ほど小さく、左下ほど大きい</b>。
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="exc-ar-t exc-ar-d">
        <title id="exc-ar-t">原子半径の周期表上の傾向</title>
        <desc id="exc-ar-d">
          周期表を表す長方形の上に、横方向に右へ「小さくなる」矢印、縦方向に下へ「大きくなる」矢印が描かれている。
          左下が最も大きく、右上が最も小さい。
        </desc>
        <defs>
          <marker id="exc-arrow4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={SLATE_LINE} />
          </marker>
        </defs>

        {/* 上の矢印（右へ小さくなる） */}
        <line x1={66} y1={22} x2={300} y2={22} stroke={ORANGE} strokeWidth={2.4} markerEnd={A} />
        <text x={183} y={15} textAnchor="middle" fontSize={10.5} fontWeight="bold" fill="#9a3412">→ 小さくなる（同一周期）</text>

        {/* 左の矢印（下へ大きくなる） */}
        <line x1={26} y1={40} x2={26} y2={158} stroke={BLUE} strokeWidth={2.4} markerEnd={A} />
        <text x={20} y={100} textAnchor="middle" fontSize={10.5} fontWeight="bold" fill="#1e40af" transform="rotate(-90 20 100)">
          大きくなる（同一族）
        </text>

        {/* 周期表の枠 */}
        <rect x={44} y={34} width={266} height={126} rx={6} fill="#f8fafc" stroke={SLATE_LINE} strokeWidth={1.5} />
        {[1, 2, 3, 4, 5].map((i) => (
          <line key={`v${i}`} x1={44 + (266 / 6) * i} y1={34} x2={44 + (266 / 6) * i} y2={160} stroke="#e2e8f0" strokeWidth={1} />
        ))}
        {[1, 2].map((i) => (
          <line key={`h${i}`} x1={44} y1={34 + (126 / 3) * i} x2={310} y2={34 + (126 / 3) * i} stroke="#e2e8f0" strokeWidth={1} />
        ))}

        {/* 大小のイメージ（円） */}
        <circle cx={72} cy={140} r={15} fill="#bfdbfe" stroke={BLUE} strokeWidth={1.3} />
        <text x={72} y={144} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#1e40af">大</text>
        <circle cx={286} cy={56} r={6} fill="#fed7aa" stroke={ORANGE} strokeWidth={1.3} />
        <text x={286} y={59} textAnchor="middle" fontSize={7} fontWeight="bold" fill="#9a3412">小</text>

        <text x={W / 2} y={186} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill={PURPLE}>
          例：K &gt; Ca &gt; Na &gt; Mg &gt; Li &gt; Be
        </text>
      </svg>
    </ChartFrame>
  );
}

/* ==================================================================
 * ⑧ ダイヤモンドと黒鉛の構造の違い  … p3_2_n10
 * ================================================================== */
function DiamondVsGraphite() {
  const W = 360;
  const H = 224;
  return (
    <ChartFrame
      caption={
        <>
          <span className="font-bold text-slate-700">図：ダイヤモンドと黒鉛</span>
          ／<b style={{ color: BLUE }}>ダイヤモンド</b>は価電子4個すべてを使う正四面体の立体網目構造で、
          動ける電子がないため電気を通さず、きわめて硬い。
          <b style={{ color: ORANGE }}>黒鉛</b>は価電子3個で正六角形の平面層をつくり、
          残った1個が層内を動くため<b>例外的に電気を通す</b>。層どうしは弱い分子間力なのではがれやすい。
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="exc-dg-t exc-dg-d">
        <title id="exc-dg-t">ダイヤモンドと黒鉛の構造の比較</title>
        <desc id="exc-dg-d">
          左にダイヤモンドの正四面体を単位とする立体網目構造、右に黒鉛の正六角形の平面層が
          弱い分子間力で積み重なった構造を並べた図。
        </desc>

        {/* 見出し */}
        <text x={86} y={14} textAnchor="middle" fontSize={11.5} fontWeight="bold" fill="#1e40af">ダイヤモンド（4本すべて）</text>
        <text x={266} y={14} textAnchor="middle" fontSize={11.5} fontWeight="bold" fill="#9a3412">黒鉛（3本＋自由な1個）</text>
        <line x1={176} y1={20} x2={176} y2={200} stroke="#e2e8f0" strokeWidth={1.4} strokeDasharray="4 3" />

        {/* ── ダイヤモンド：正四面体 ── */}
        <g stroke={BLUE} strokeWidth={1.5} fill="none">
          <path d="M86 40 L46 108 M86 40 L126 108 M86 40 L86 88 M46 108 L126 108 M46 108 L86 88 M126 108 L86 88" />
          <path d="M46 108 L36 152 M126 108 L136 152 M86 88 L86 132" />
          <path d="M36 152 L76 168 M136 152 L96 168 M86 132 L86 168" opacity={0.55} />
        </g>
        {[[86, 40], [46, 108], [126, 108], [86, 88], [36, 152], [136, 152], [86, 132]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={8} fill="#dbeafe" stroke={BLUE} strokeWidth={1.4} />
            <text x={cx} y={cy + 3.2} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#1e40af">C</text>
          </g>
        ))}
        <text x={86} y={190} textAnchor="middle" fontSize={9.5} fill={SLATE}>正四面体の立体網目</text>
        <text x={86} y={202} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#1e40af">硬い／電気を通さない</text>

        {/* ── 黒鉛：正六角形の層 ── */}
        {[0, 1].map((layer) => {
          const oy = 34 + layer * 62;
          const hex = (cx: number) =>
            `M${cx - 16} ${oy} L${cx - 8} ${oy - 14} L${cx + 8} ${oy - 14} L${cx + 16} ${oy} L${cx + 8} ${oy + 14} L${cx - 8} ${oy + 14} Z`;
          return (
            <g key={layer}>
              <path d={hex(226)} fill="#ffedd5" stroke={ORANGE} strokeWidth={1.5} />
              <path d={hex(258)} fill="#ffedd5" stroke={ORANGE} strokeWidth={1.5} />
              <path d={hex(290)} fill="#ffedd5" stroke={ORANGE} strokeWidth={1.5} />
              <path d={hex(322)} fill="#ffedd5" stroke={ORANGE} strokeWidth={1.5} />
            </g>
          );
        })}
        {/* 層間の弱い力 */}
        {[210, 242, 274, 306, 338].map((cx) => (
          <line key={cx} x1={cx} y1={52} x2={cx} y2={78} stroke={SLATE_LINE} strokeWidth={1} strokeDasharray="2 3" />
        ))}
        <text x={266} y={70} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill={SLATE}>弱い分子間力（はがれる）</text>

        {/* 自由に動く電子 */}
        <path d="M198 126 L340 126" stroke={GREEN} strokeWidth={1.4} strokeDasharray="5 3" />
        {[210, 244, 278, 312].map((cx) => (
          <circle key={cx} cx={cx} cy={126} r={3.2} fill={GREEN} />
        ))}
        <text x={266} y={144} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#065f46">残る1個の価電子が層内を動く</text>
        <text x={266} y={190} textAnchor="middle" fontSize={9.5} fill={SLATE}>正六角形の平面層状構造</text>
        <text x={266} y={202} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#9a3412">やわらかい／例外的に電気を通す</text>

        <text x={W / 2} y={218} textAnchor="middle" fontSize={9} fill={SLATE}>
          どちらも炭素 C だけからできた単体 ＝ 同素体（同位体ではない）
        </text>
      </svg>
    </ChartFrame>
  );
}

/* ==================================================================
 * ⑨ 滴定曲線（強酸＋強塩基）  … acidBaseTreeData_sec7_2_1
 * ================================================================== */
function TitrationStrongStrong() {
  const W = 360;
  const H = 214;
  const padL = 38;
  const padR = 14;
  const padT = 16;
  const padB = 42;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const x = (t: number) => padL + (t / 100) * plotW;
  const y = (ph: number) => padT + (1 - ph / 14) * plotH;

  const pts: Array<[number, number]> = [
    [x(0), y(1.0)],
    [x(20), y(1.6)],
    [x(40), y(2.3)],
    [x(48), y(3.0)],
    [x(50), y(7.0)],
    [x(52), y(11.0)],
    [x(60), y(11.8)],
    [x(80), y(12.6)],
    [x(96), y(13.0)],
  ];
  const path = pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');

  return (
    <ChartFrame
      caption={
        <>
          <span className="font-bold text-slate-700">図：滴定曲線（強酸＋強塩基）</span>
          ／中和点は <b>pH ＝ 7（中性）</b>。pH ジャンプが <b>約 pH3〜11</b> と非常に広いので、
          変色域がジャンプ内に入る<b>メチルオレンジ MO・フェノールフタレイン PP のどちらでも使える</b>。
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="exc-t1-t exc-t1-d">
        <title id="exc-t1-t">強酸に強塩基を滴下したときの滴定曲線</title>
        <desc id="exc-t1-d">
          縦軸にpH、横軸に塩基の滴下量をとったグラフ。pHは1付近からゆるやかに上がり、
          中和点で3から11まで垂直に急上昇し、その後13付近までゆるやかに上がる。
          メチルオレンジの変色域とフェノールフタレインの変色域がどちらもジャンプの中に入っている。
        </desc>

        {/* 変色域の帯 */}
        <rect x={padL} y={y(4.4)} width={plotW} height={y(3.1) - y(4.4)} fill="#fca5a5" opacity={0.35} />
        <rect x={padL} y={y(9.8)} width={plotW} height={y(8.0) - y(9.8)} fill="#f9a8d4" opacity={0.4} />
        <text x={W - padR - 2} y={y(3.75) + 3} textAnchor="end" fontSize={8.5} fontWeight="bold" fill="#b91c1c">MO 3.1〜4.4</text>
        <text x={W - padR - 2} y={y(8.9) + 3} textAnchor="end" fontSize={8.5} fontWeight="bold" fill="#be185d">PP 8.0〜9.8</text>

        {/* 中和点 pH7 */}
        <line x1={padL} y1={y(7)} x2={W - padR} y2={y(7)} stroke={SLATE_LINE} strokeWidth={1} strokeDasharray="4 3" />

        {/* 軸 */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={SLATE_LINE} strokeWidth={1.5} />
        <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke={SLATE_LINE} strokeWidth={1.5} />
        {[0, 7, 14].map((t) => (
          <text key={t} x={padL - 5} y={y(t) + 3.5} textAnchor="end" fontSize={9} fill={SLATE}>{t}</text>
        ))}
        <text x={padL - 32} y={padT + 2} fontSize={10} fontWeight="bold" fill={SLATE}>pH</text>
        <text x={W - padR} y={padT + plotH + 26} textAnchor="end" fontSize={10} fontWeight="bold" fill={SLATE}>塩基の滴下量 →</text>

        {/* 曲線 */}
        <path d={path} fill="none" stroke={BLUE} strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" />

        {/* 中和点 */}
        <circle cx={x(50)} cy={y(7)} r={4} fill="#fff" stroke={PINK} strokeWidth={2} />
        <text x={x(50) + 8} y={y(7) - 4} fontSize={9.5} fontWeight="bold" fill={PINK}>中和点 pH＝7</text>
        <text x={x(50) - 8} y={y(9.5)} textAnchor="end" fontSize={9} fontWeight="bold" fill={SLATE}>ジャンプ</text>
        <text x={x(50) - 8} y={y(8.2)} textAnchor="end" fontSize={8.5} fill={SLATE}>（約 pH3〜11）</text>
      </svg>
    </ChartFrame>
  );
}

/* ==================================================================
 * ⑩ 二段階滴定の曲線  … acidBaseTreeData_sec7_3_1
 * ================================================================== */
function TitrationTwoStep() {
  const W = 360;
  const H = 224;
  const padL = 38;
  const padR = 14;
  const padT = 16;
  const padB = 52;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const x = (t: number) => padL + (t / 100) * plotW;
  const y = (ph: number) => padT + (1 - ph / 14) * plotH;

  const pts: Array<[number, number]> = [
    [x(0), y(11.8)],
    [x(14), y(11.2)],
    [x(26), y(10.4)],
    [x(32), y(9.5)],
    [x(35), y(8.3)], // 第1中和点（pH≒8.3, PP変色）
    [x(38), y(7.6)],
    [x(50), y(7.2)],
    [x(62), y(6.6)],
    [x(68), y(5.2)],
    [x(70), y(3.8)], // 第2中和点（pH≒3.8, MO変色）
    [x(74), y(2.6)],
    [x(88), y(2.0)],
    [x(98), y(1.7)],
  ];
  const path = pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)}`).join(' ');

  return (
    <ChartFrame
      caption={
        <>
          <span className="font-bold text-slate-700">図：二段階滴定（Na₂CO₃ に HCl を滴下）</span>
          ／第1中和点（pH ＞ 7）で Na₂CO₃ → NaHCO₃ の反応が終わり
          <b style={{ color: PINK }}>PP が赤 → 無色</b>。第2中和点（pH ＜ 7）で NaHCO₃ → NaCl＋H₂O＋CO₂ が終わり
          <b style={{ color: '#b91c1c' }}>MO が黄 → 赤</b>。滴下量は <b>v₁ ＝ v₂ − v₁</b> の関係になる。
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="exc-t2-t exc-t2-d">
        <title id="exc-t2-t">炭酸ナトリウムに塩酸を滴下したときの二段階滴定曲線</title>
        <desc id="exc-t2-d">
          縦軸にpH、横軸に塩酸の滴下量をとったグラフ。pHは11付近から下がり、
          第1中和点でpH8付近の小さな段差、続いて第2中和点でpH4付近の段差ができる、
          階段状に2回下がる曲線。
        </desc>

        {/* 変色域の帯 */}
        <rect x={padL} y={y(9.8)} width={plotW} height={y(8.0) - y(9.8)} fill="#f9a8d4" opacity={0.35} />
        <rect x={padL} y={y(4.4)} width={plotW} height={y(3.1) - y(4.4)} fill="#fca5a5" opacity={0.35} />
        <text x={W - padR - 2} y={y(8.9) + 3} textAnchor="end" fontSize={8.5} fontWeight="bold" fill="#be185d">PP 8.0〜9.8</text>
        <text x={W - padR - 2} y={y(3.75) + 3} textAnchor="end" fontSize={8.5} fontWeight="bold" fill="#b91c1c">MO 3.1〜4.4</text>

        {/* pH7 */}
        <line x1={padL} y1={y(7)} x2={W - padR} y2={y(7)} stroke={SLATE_LINE} strokeWidth={1} strokeDasharray="4 3" />
        <text x={padL - 5} y={y(7) + 3.5} textAnchor="end" fontSize={9} fill={SLATE}>7</text>

        {/* 軸 */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={SLATE_LINE} strokeWidth={1.5} />
        <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke={SLATE_LINE} strokeWidth={1.5} />
        {[0, 14].map((t) => (
          <text key={t} x={padL - 5} y={y(t) + 3.5} textAnchor="end" fontSize={9} fill={SLATE}>{t}</text>
        ))}
        <text x={padL - 32} y={padT + 2} fontSize={10} fontWeight="bold" fill={SLATE}>pH</text>
        <text x={W - padR} y={padT + plotH + 26} textAnchor="end" fontSize={10} fontWeight="bold" fill={SLATE}>HCl の滴下量 →</text>

        {/* 曲線 */}
        <path d={path} fill="none" stroke={PURPLE} strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" />

        {/* 第1中和点 */}
        <line x1={x(35)} y1={y(8.3)} x2={x(35)} y2={padT + plotH} stroke={PINK} strokeWidth={1} strokeDasharray="3 2" />
        <circle cx={x(35)} cy={y(8.3)} r={4} fill="#fff" stroke={PINK} strokeWidth={2} />
        <text x={x(35)} y={y(8.3) - 8} textAnchor="middle" fontSize={9} fontWeight="bold" fill={PINK}>第1中和点</text>
        <text x={x(35)} y={padT + plotH + 13} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill={PINK}>v₁</text>

        {/* 第2中和点 */}
        <line x1={x(70)} y1={y(3.8)} x2={x(70)} y2={padT + plotH} stroke="#b91c1c" strokeWidth={1} strokeDasharray="3 2" />
        <circle cx={x(70)} cy={y(3.8)} r={4} fill="#fff" stroke="#b91c1c" strokeWidth={2} />
        <text x={x(70) + 6} y={y(3.8) - 8} fontSize={9} fontWeight="bold" fill="#b91c1c">第2中和点</text>
        <text x={x(70)} y={padT + plotH + 13} textAnchor="middle" fontSize={9.5} fontWeight="bold" fill="#b91c1c">v₂</text>

        {/* 各段階の反応 */}
        <text x={padL + 2} y={H - 26} fontSize={9} fill={SLATE}>
          ①（〜v₁）Na₂CO₃ ＋ HCl → NaCl ＋ NaHCO₃　… PP 赤→無色
        </text>
        <text x={padL + 2} y={H - 13} fontSize={9} fill={SLATE}>
          ②（v₁〜v₂）NaHCO₃ ＋ HCl → NaCl ＋ H₂O ＋ CO₂↑　… MO 黄→赤
        </text>
      </svg>
    </ChartFrame>
  );
}

/** 追加分の図の一覧（キー → コンポーネント）。 */
export const EXTRA_EXPLANATION_CHARTS: Record<string, React.FC> = {
  mol_unit_conversion_map: MolConversionMap,
  atom_structure_tree: AtomStructureTree,
  melting_boiling_curve: MeltingBoilingCurve,
  state_change_map: StateChangeMap,
  filtration_apparatus: FiltrationApparatus,
  periodic_trend_energy: PeriodicTrendEnergy,
  atomic_radius_trend: AtomicRadiusTrend,
  diamond_vs_graphite: DiamondVsGraphite,
  titration_strong_strong: TitrationStrongStrong,
  titration_two_step: TitrationTwoStep,
};

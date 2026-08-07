/**
 * MolUnitMap — プリント「★ 単位変換の図 〜この図だけで化学基礎の計算は全部解ける〜」を
 * そのまま操作できるようにしたインタラクティブ図。
 *
 * 【設計方針（重要）】
 *  - 図の見た目・矢印に書かれた変換の書き方（1mol＝6.0×10²³個 など）は
 *    プリントと完全に同じ表記のまま扱う。
 *  - 生成される途中式も必ずプリントと同じ形式：
 *      88g × [1mol/44g] × [22.4L/1mol] ＝ 44.8L
 *      1を2回掛けている（単位も約分されて「g→mol→L」になる）
 *  - ノード（四角）と矢印のラベルはドラッグで自由に動かせる。
 *  - 矢印の変換の数字をタップすると、その変換（＝1を掛ける）が式に追加される。
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* ============================================================
 * 数値ユーティリティ（プリントの表記に合わせる）
 * ============================================================ */

const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/** 全角・上付き文字などを計算できる形に正規化する */
function normalizeNumText(s: string): string {
  let t = s.trim()
    .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/．/g, '.')
    .replace(/＋/g, '+')
    .replace(/[－−ー]/g, '-')
    .replace(/[×✕Ｘ]/g, '×');
  // 上付き数字（10²³ など）を ^23 の形に直す
  t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, m =>
    '^' + m.replace(/./g, c => (c === '⁻' ? '-' : String(SUP_DIGITS.indexOf(c))))
  );
  return t.replace(/\s/g, '');
}

/** 数値として解釈できれば数値、できなければ null（＝文字式扱い） */
function parseNum(s: string): number | null {
  const t = normalizeNumText(s);
  if (!t) return null;
  let m = t.match(/^([0-9.]+)(?:[×x*]10\^?([+-]?[0-9]+))?$/);
  if (m) {
    const base = parseFloat(m[1]);
    if (!isFinite(base)) return null;
    return m[2] ? base * Math.pow(10, parseInt(m[2], 10)) : base;
  }
  m = t.match(/^([0-9.]+)[eE]([+-]?[0-9]+)$/);
  if (m) return parseFloat(m[1]) * Math.pow(10, parseInt(m[2], 10));
  return null;
}

/** 数字を上付き表記（6.0×10²³ など）に整形する */
function toSuperscript(n: number): string {
  return String(n)
    .replace(/-/g, '⁻')
    .replace(/[0-9]/g, d => SUP_DIGITS[Number(d)]);
}

/** 計算結果をプリントと同じ雰囲気で表示する */
function formatNum(v: number): string {
  if (!isFinite(v)) return '—';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1e4 || abs < 1e-3) {
    const exp = Math.floor(Math.log10(abs));
    const mant = v / Math.pow(10, exp);
    const mantStr = String(Number(mant.toPrecision(2)));
    return `${mantStr}×10${toSuperscript(exp)}`;
  }
  return String(Number(v.toPrecision(6)));
}

/* ============================================================
 * 分数（プリントの囲み分数）表示
 * ============================================================ */

export function Frac({ up, down }: { up: React.ReactNode; down: React.ReactNode }) {
  return (
    <span className="mb-frac">
      <span className="mb-frac-up">{up}</span>
      <span className="mb-frac-down">{down}</span>
    </span>
  );
}

/* ============================================================
 * 図の定義
 * ============================================================ */

type NodeId = 'mol' | 'kosuu' | 'volStd' | 'g' | 'kg' | 'mg' | 'volMl';
/** 変換に使う定数のキー */
type ValKey = 'NA' | 'Vm' | 'M' | 'd' | null;

interface NodeDef {
  id: NodeId;
  /** 図に書かれている文字（プリントどおり） */
  title: React.ReactNode;
  sub?: React.ReactNode;
  /** 単位（式に出る文字列） */
  unit: string;
  x: number;
  y: number;
  w: number;
  h: number;
  gray?: boolean;
  /** 体積（L）の外枠つきノード */
  outer?: boolean;
}

const CANVAS_W = 880;
const CANVAS_H = 720;

const NODE_DEFS: NodeDef[] = [
  { id: 'kg',     title: '質量',  sub: '（kg）',  unit: 'kg',  x: 700, y: 8,   w: 132, h: 76 },
  { id: 'mol',    title: '物質量', sub: '（mol）', unit: 'mol', x: 358, y: 62,  w: 136, h: 76, gray: true },
  { id: 'kosuu',  title: '粒子の数', sub: '（個）', unit: '個',  x: 18,  y: 236, w: 184, h: 84, gray: true },
  { id: 'g',      title: '質量',  sub: '（g）',   unit: 'g',   x: 700, y: 252, w: 132, h: 76, gray: true },
  { id: 'volStd', title: '標準状態での体積', sub: '（0℃・1.013×10⁵Pa）', unit: 'L', x: 232, y: 318, w: 348, h: 176, gray: true, outer: true },
  { id: 'mg',     title: '質量',  sub: '（mg）',  unit: 'mg',  x: 700, y: 508, w: 132, h: 76 },
  { id: 'volMl',  title: '体積',  sub: '（mL/cm³）', unit: 'mL', x: 356, y: 606, w: 148, h: 84 },
];

interface EdgeDef {
  id: string;
  a: NodeId;
  b: NodeId;
  /** a 側の係数（多くは "1"） */
  an: string;
  /** b 側の係数（定数キーがある場合はそこから取る） */
  bn: string;
  /** b 側の係数として使う定数 */
  valKey: ValKey;
  /** ラベルの補足行（（アボガドロ定数）など） */
  note?: string;
  /** ラベル位置の初期オフセット */
  dx: number;
  dy: number;
  /** mL/cm³ ノードのように単位が2つある辺 */
  dualUnit?: boolean;
}

const EDGE_DEFS: EdgeDef[] = [
  { id: 'mol-kosuu',  a: 'mol',    b: 'kosuu',  an: '1', bn: '', valKey: 'NA', note: '（アボガドロ定数）', dx: -6,  dy: -52 },
  { id: 'mol-g',      a: 'mol',    b: 'g',      an: '1', bn: '', valKey: 'M',  note: '（モル質量）',       dx: -6,  dy: -52 },
  { id: 'mol-volStd', a: 'mol',    b: 'volStd', an: '1', bn: '', valKey: 'Vm', dx: 66,  dy: -6 },
  { id: 'kg-g',       a: 'kg',     b: 'g',      an: '1', bn: '1000', valKey: null, dx: 62, dy: 0 },
  { id: 'g-mg',       a: 'g',      b: 'mg',     an: '1', bn: '1000', valKey: null, dx: 62, dy: 0 },
  { id: 'volStd-g',   a: 'volStd', b: 'g',      an: '1', bn: '', valKey: 'd',  note: '（密度）', dx: -34, dy: -44 },
  { id: 'volStd-volMl', a: 'volStd', b: 'volMl', an: '1', bn: '1000', valKey: null, dx: -104, dy: 0, dualUnit: true },
  { id: 'volMl-g',    a: 'volMl',  b: 'g',      an: '1', bn: '', valKey: 'd', note: '（密度）', dx: 44, dy: 34, dualUnit: true },
];

/* ============================================================
 * 幾何計算
 * ============================================================ */

interface Rect { x: number; y: number; w: number; h: number; }

function center(r: Rect) {
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
}

/** 中心から外向きの線が長方形の枠と交わる点（矢印の始点・終点を枠の上に置く） */
function clipToRect(r: Rect, toward: { x: number; y: number }) {
  const c = center(r);
  const dx = toward.x - c.x;
  const dy = toward.y - c.y;
  if (dx === 0 && dy === 0) return c;
  const hw = r.w / 2 + 2;
  const hh = r.h / 2 + 2;
  const sx = dx === 0 ? Infinity : hw / Math.abs(dx);
  const sy = dy === 0 ? Infinity : hh / Math.abs(dy);
  const s = Math.min(sx, sy);
  return { x: c.x + dx * s, y: c.y + dy * s };
}

/* ============================================================
 * 本体
 * ============================================================ */

interface Step {
  edgeId: string;
  from: NodeId;
  to: NodeId;
  /** 分子（変換先）表記 */
  upN: string;
  upU: string;
  /** 分母（変換元）表記 */
  downN: string;
  downU: string;
}

interface MolUnitMapProps {
  /** 図の見出しを表示するか */
  title?: string;
  /** 初期の縮尺 */
  initialScale?: number;
}

export function MolUnitMap({ title = '★ 単位変換の図　〜この図だけで化学基礎の計算は全部解ける〜', initialScale }: MolUnitMapProps) {
  /* --- ノード位置（ドラッグで動く） --- */
  const [pos, setPos] = useState<Record<string, { x: number; y: number }>>(() => {
    const o: Record<string, { x: number; y: number }> = {};
    NODE_DEFS.forEach(n => { o[n.id] = { x: n.x, y: n.y }; });
    return o;
  });
  /* --- ラベル位置のオフセット（ドラッグで動く） --- */
  const [labelOff, setLabelOff] = useState<Record<string, { x: number; y: number }>>(() => {
    const o: Record<string, { x: number; y: number }> = {};
    EDGE_DEFS.forEach(e => { o[e.id] = { x: e.dx, y: e.dy }; });
    return o;
  });

  /* --- 変換に使う定数（プリントの文字のまま／数値も入れられる） --- */
  const [vals, setVals] = useState({ NA: '6.0×10²³', Vm: '22.4', M: 'M', d: 'd' });
  /* --- mL / cm³ の切り替え --- */
  const [mlUnit, setMlUnit] = useState<'mL' | 'cm³'>('mL');

  /* --- 式の組み立て --- */
  const [startValue, setStartValue] = useState('88');
  const [startNode, setStartNode] = useState<NodeId>('g');
  const [steps, setSteps] = useState<Step[]>([]);

  /* --- 縮尺 ---
     スマホでは 880px の図が画面からはみ出して右側（kg / g / mg）が
     まったく見えなくなってしまうので、既定では「表示幅にぴったり収める」
     オートフィットにしておく。ユーザーが ＋／－ を押した瞬間に手動へ切りかわる。 */
  const [scale, setScale] = useState(initialScale ?? 0.78);
  const [autoFit, setAutoFit] = useState(initialScale === undefined);
  const [fullscreen, setFullscreen] = useState(false);
  const [showHint, setShowHint] = useState(true);

  /* 図の表示領域の幅を測って、オートフィット時の縮尺を決める */
  const scrollRef = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(0);
  const [boxH, setBoxH] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      // padding(4px*2) + border(1px*2) を引いた実際に使える幅
      setBoxW(Math.max(0, el.clientWidth - 10));
      setBoxH(Math.max(0, el.clientHeight - 10));
    };
    update();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fullscreen]);

  /** 表示領域に図全体が収まる縮尺（0.28〜1.0 に丸める） */
  const fitScale = useMemo(() => {
    if (!boxW) return null;
    const byW = boxW / CANVAS_W;
    // 全画面のときは高さも見て、図が1画面に収まるようにする
    const byH = fullscreen && boxH ? boxH / CANVAS_H : Infinity;
    const v = Math.min(byW, byH);
    return Math.max(0.28, Math.min(1, Math.round(v * 100) / 100));
  }, [boxW, boxH, fullscreen]);

  // オートフィット中は測った縮尺を反映する
  useEffect(() => {
    if (autoFit && fitScale != null) setScale(fitScale);
  }, [autoFit, fitScale]);

  /** ＋／－ を押したら手動モードへ */
  const bumpScale = (d: number) => {
    setAutoFit(false);
    setScale(s => Math.max(0.28, Math.min(1.6, Math.round((s + d) * 100) / 100)));
  };

  const naRef = useRef<HTMLInputElement>(null);
  const vmRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const dRef = useRef<HTMLInputElement>(null);
  const refOf: Record<string, React.RefObject<HTMLInputElement | null>> = {
    NA: naRef, Vm: vmRef, M: mRef, d: dRef,
  };

  /* ---- ノードの単位（mL/cm³ ノードだけ可変） ---- */
  const unitOf = useCallback((id: NodeId): string => {
    if (id === 'volMl') return mlUnit;
    return NODE_DEFS.find(n => n.id === id)!.unit;
  }, [mlUnit]);

  /* ---- 辺の係数（プリントの表記のまま文字列で持つ） ---- */
  const edgeCoef = useCallback((e: EdgeDef) => {
    const bn = e.valKey ? vals[e.valKey] : e.bn;
    return { an: e.an, bn: bn.trim() === '' ? '1' : bn.trim() };
  }, [vals]);

  /** 「1mol＝44g」のような矢印ラベル本文（プリントの書き方どおり） */
  const edgeLabelText = useCallback((e: EdgeDef): string[] => {
    const { an, bn } = edgeCoef(e);
    const au = unitOf(e.a);
    if (e.dualUnit) {
      // プリントは「1L＝1000mL」「1L＝1000cm³」の2行、「1mL＝dg」「1cm³＝dg」の2行
      if (e.id === 'volStd-volMl') return [`1L＝${bn}mL`, `1L＝${bn}cm³`];
      return [`1mL＝${bn}g`, `1cm³＝${bn}g`];
    }
    const bu = unitOf(e.b);
    return [`${an}${au}＝${bn}${bu}`];
  }, [edgeCoef, unitOf]);

  const currentNode: NodeId = steps.length ? steps[steps.length - 1].to : startNode;
  const currentUnit = unitOf(currentNode);

  /* ---- 矢印タップ：変換（＝1を掛ける）を式に追加 ---- */
  const tapEdge = useCallback((e: EdgeDef) => {
    setShowHint(false);
    // 直前と同じ矢印なら1つ戻す（往復操作）
    if (steps.length && steps[steps.length - 1].edgeId === e.id) {
      setSteps(s => s.slice(0, -1));
      return;
    }
    const cur = steps.length ? steps[steps.length - 1].to : startNode;
    let from: NodeId | null = null;
    let to: NodeId | null = null;
    if (e.a === cur) { from = e.a; to = e.b; }
    else if (e.b === cur) { from = e.b; to = e.a; }
    if (!from || !to) return; // 今いる場所につながっていない矢印は無視

    const { an, bn } = edgeCoef(e);
    const aSide = { n: an, u: unitOf(e.a) };
    let bSide = { n: bn, u: unitOf(e.b) };
    if (e.id === 'volStd-volMl') bSide = { n: bn, u: mlUnit };
    if (e.id === 'volMl-g') {
      // プリント：1mL＝dg / 1cm³＝dg（左辺が mL or cm³）
      const step: Step = from === 'volMl'
        ? { edgeId: e.id, from, to, upN: bn, upU: 'g', downN: '1', downU: mlUnit }
        : { edgeId: e.id, from, to, upN: '1', upU: mlUnit, downN: bn, downU: 'g' };
      setSteps(s => [...s, step]);
      return;
    }
    const fromSide = from === e.a ? aSide : bSide;
    const toSide = from === e.a ? bSide : aSide;
    setSteps(s => [...s, {
      edgeId: e.id, from: from!, to: to!,
      upN: toSide.n, upU: toSide.u,
      downN: fromSide.n, downU: fromSide.u,
    }]);
  }, [steps, startNode, edgeCoef, unitOf, mlUnit]);

  /* ---- 計算結果（数値がそろえば計算、そろわなければ文字式のまま） ---- */
  const result = useMemo(() => {
    const sv = parseNum(startValue);
    const numSyms: string[] = [];
    const denSyms: string[] = [];
    let numeric = sv;
    steps.forEach(st => {
      const up = parseNum(st.upN);
      const down = parseNum(st.downN);
      if (up === null) numSyms.push(st.upN); else if (numeric !== null) numeric *= up;
      if (down === null) denSyms.push(st.downN); else if (numeric !== null) numeric /= down;
      if (up === null || down === null) { /* 文字式が混ざる */ }
    });
    const unit = steps.length ? steps[steps.length - 1].upU : unitOf(startNode);
    if (sv === null) {
      return { ok: false, text: '', unit, numSyms, denSyms, symbolic: true };
    }
    if (numSyms.length === 0 && denSyms.length === 0 && numeric !== null) {
      return { ok: true, text: formatNum(numeric), unit, numSyms, denSyms, symbolic: false };
    }
    // 文字式が残る場合：数値部分＋文字を並べて表示
    const coef = numeric !== null && Math.abs(numeric - 1) > 1e-12 ? formatNum(numeric) : '';
    return {
      ok: true,
      text: '',
      unit,
      numSyms,
      denSyms,
      symbolic: true,
      coef,
    } as any;
  }, [startValue, steps, startNode, unitOf]);

  /* ---- 「1を◯回掛けている」の説明（プリントの文言そのまま） ---- */
  const oneTimesNote = useMemo(() => {
    if (steps.length === 0) return null;
    const route = [unitOf(startNode), ...steps.map(s => s.upU)].join('→');
    const head = steps.length === 1 ? '1を掛けている' : `1を${steps.length}回掛けている`;
    return `${head}（単位も約分されて「${route}」になる）`;
  }, [steps, startNode, unitOf]);

  /* ============================================================
   * ドラッグ処理（マウス・タッチ共通 / タップ判定つき）
   * ============================================================ */
  const drag = useRef<{
    kind: 'node' | 'label';
    id: string;
    px: number; py: number;
    ox: number; oy: number;
    moved: boolean;
  } | null>(null);

  const onPointerDown = (
    ev: React.PointerEvent,
    kind: 'node' | 'label',
    id: string
  ) => {
    const origin = kind === 'node' ? pos[id] : labelOff[id];
    (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
    drag.current = {
      kind, id,
      px: ev.clientX, py: ev.clientY,
      ox: origin.x, oy: origin.y,
      moved: false,
    };
  };

  const onPointerMove = (ev: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = (ev.clientX - d.px) / scale;
    const dy = (ev.clientY - d.py) / scale;
    if (Math.abs(ev.clientX - d.px) > 4 || Math.abs(ev.clientY - d.py) > 4) d.moved = true;
    if (!d.moved) return;
    ev.preventDefault();
    if (d.kind === 'node') {
      setPos(p => ({ ...p, [d.id]: { x: d.ox + dx, y: d.oy + dy } }));
    } else {
      setLabelOff(p => ({ ...p, [d.id]: { x: d.ox + dx, y: d.oy + dy } }));
    }
  };

  const onPointerUp = (ev: React.PointerEvent, edge?: EdgeDef) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    // 動かしていなければ「タップ」＝変換を実行
    if (!d.moved && edge) tapEdge(edge);
  };

  /* ---- 図のリセット ---- */
  const resetLayout = () => {
    const p: Record<string, { x: number; y: number }> = {};
    NODE_DEFS.forEach(n => { p[n.id] = { x: n.x, y: n.y }; });
    setPos(p);
    const l: Record<string, { x: number; y: number }> = {};
    EDGE_DEFS.forEach(e => { l[e.id] = { x: e.dx, y: e.dy }; });
    setLabelOff(l);
  };

  /* ---- 現在の位置から矢印の座標を作る ---- */
  const rects = useMemo(() => {
    const r: Record<string, Rect> = {};
    NODE_DEFS.forEach(n => {
      r[n.id] = { x: pos[n.id].x, y: pos[n.id].y, w: n.w, h: n.h };
    });
    return r;
  }, [pos]);

  const edgeGeom = useMemo(() => {
    return EDGE_DEFS.map(e => {
      const ra = rects[e.a];
      const rb = rects[e.b];
      const p1 = clipToRect(ra, center(rb));
      const p2 = clipToRect(rb, center(ra));
      const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      return { e, p1, p2, mid };
    });
  }, [rects]);

  /** 今タップできる矢印か */
  const isTappable = (e: EdgeDef) => e.a === currentNode || e.b === currentNode;
  /** 式の中で使われている矢印か */
  const usedEdgeIds = new Set(steps.map(s => s.edgeId));

  return (
    <div className="mb-map-wrap">
      <style>{MAP_CSS}</style>

      <div className="mb-map-head">
        <p className="mb-map-title">{title}</p>
        <p className="mb-map-usage">
          ① 下の「スタート」を決める　② 通る<b>矢印の変換の数字をタップ</b>する　→ プリントと同じ途中式ができる<br />
          ※ 四角・矢印の文字は<b>ドラッグで自由に動かせます</b>（もう一度同じ矢印をタップすると1つ戻る）
        </p>
      </div>

      {/* ================= スタートの設定 ================= */}
      <div className="mb-panel">
        <div className="mb-panel-row">
          <span className="mb-panel-label">スタート</span>
          <input
            className="mb-input mb-input-num"
            value={startValue}
            onChange={ev => { setStartValue(ev.target.value); }}
            inputMode="text"
            aria-label="スタートの数値"
          />
          <select
            className="mb-select"
            value={startNode}
            onChange={ev => { setStartNode(ev.target.value as NodeId); setSteps([]); }}
            aria-label="スタートの単位"
          >
            {NODE_DEFS.map(n => (
              <option key={n.id} value={n.id}>{unitOf(n.id)}</option>
            ))}
          </select>
          <span className="mb-now">
            いまいる場所：<b>{currentUnit}</b>
          </span>
          <button type="button" className="mb-btn mb-btn-sub" onClick={() => setSteps([])}>式をクリア</button>
          <button type="button" className="mb-btn mb-btn-sub" onClick={() => setSteps(s => s.slice(0, -1))} disabled={!steps.length}>1つ戻す</button>
        </div>
      </div>

      {/* ================= 図 ================= */}
      <div className="mb-zoom-row">
        <button type="button" className="mb-btn mb-btn-icon" onClick={() => bumpScale(-0.08)} aria-label="縮小">－</button>
        <span className="mb-zoom-val">{Math.round(scale * 100)}%</span>
        <button type="button" className="mb-btn mb-btn-icon" onClick={() => bumpScale(+0.08)} aria-label="拡大">＋</button>
        <button
          type="button"
          className={`mb-btn ${autoFit ? 'mb-btn-on' : 'mb-btn-sub'}`}
          onClick={() => setAutoFit(a => !a)}
          title="図の全体が画面に収まるように自動で縮小します"
        >
          {autoFit ? '✓ 全体表示' : '全体表示'}
        </button>
        <button
          type="button"
          className="mb-btn mb-btn-sub mb-btn-fs"
          onClick={() => setFullscreen(true)}
          title="画面いっぱいに図を開きます（スマホ向け）"
        >
          ⛶ 大きく見る
        </button>
        <button type="button" className="mb-btn mb-btn-sub" onClick={resetLayout}>図の配置をリセット</button>
        <span className="mb-ml-toggle">
          体積の単位:
          <button type="button" className={`mb-chip ${mlUnit === 'mL' ? 'on' : ''}`} onClick={() => { setMlUnit('mL'); setSteps([]); }}>mL</button>
          <button type="button" className={`mb-chip ${mlUnit === 'cm³' ? 'on' : ''}`} onClick={() => { setMlUnit('cm³'); setSteps([]); }}>cm³</button>
        </span>
      </div>

      <div className={fullscreen ? 'mb-fs-overlay' : 'mb-fs-inline'}>
        {fullscreen && (
          <div className="mb-fs-bar">
            <span className="mb-fs-title">単位変換の図</span>
            <button type="button" className="mb-btn mb-btn-icon" onClick={() => bumpScale(-0.08)} aria-label="縮小">－</button>
            <span className="mb-zoom-val">{Math.round(scale * 100)}%</span>
            <button type="button" className="mb-btn mb-btn-icon" onClick={() => bumpScale(+0.08)} aria-label="拡大">＋</button>
            <button type="button" className={`mb-btn ${autoFit ? 'mb-btn-on' : 'mb-btn-sub'}`} onClick={() => setAutoFit(a => !a)}>全体表示</button>
            <button type="button" className="mb-btn mb-btn-sub" onClick={() => setFullscreen(false)}>閉じる ✕</button>
          </div>
        )}
      <div className="mb-canvas-scroll" ref={scrollRef}>
        <div
          className="mb-canvas"
          style={{ width: CANVAS_W * scale, height: CANVAS_H * scale }}
        >
          <div
            className="mb-canvas-inner"
            style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})` }}
            onPointerMove={onPointerMove}
            onPointerUp={ev => onPointerUp(ev)}
          >
            {/* --- 矢印（両向き太矢印） --- */}
            <svg className="mb-svg" width={CANVAS_W} height={CANVAS_H}>
              <defs>
                {/* markerUnits を userSpaceOnUse にして、線の太さで矢印の頭が
                    巨大化しないようにする（プリントと同じ太矢印の比率にそろえる） */}
                <marker id="mbArrow" viewBox="0 0 12 12" refX="11" refY="6"
                  markerWidth="19" markerHeight="19" markerUnits="userSpaceOnUse"
                  orient="auto-start-reverse">
                  <path d="M0,0 L12,6 L0,12 z" fill="#3f3352" />
                </marker>
                <marker id="mbArrowDim" viewBox="0 0 12 12" refX="11" refY="6"
                  markerWidth="19" markerHeight="19" markerUnits="userSpaceOnUse"
                  orient="auto-start-reverse">
                  <path d="M0,0 L12,6 L0,12 z" fill="#9c93ab" />
                </marker>
                <marker id="mbArrowOn" viewBox="0 0 12 12" refX="11" refY="6"
                  markerWidth="21" markerHeight="21" markerUnits="userSpaceOnUse"
                  orient="auto-start-reverse">
                  <path d="M0,0 L12,6 L0,12 z" fill="#7c3aed" />
                </marker>
              </defs>
              {edgeGeom.map(({ e, p1, p2 }) => {
                const on = usedEdgeIds.has(e.id);
                const able = isTappable(e);
                const marker = on ? 'url(#mbArrowOn)' : able ? 'url(#mbArrow)' : 'url(#mbArrowDim)';
                // 矢印の頭のぶんだけ線を短くして、頭と線が二重に見えないようにする
                const len = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
                const inset = Math.min(13, len / 2 - 1);
                const ux = (p2.x - p1.x) / len;
                const uy = (p2.y - p1.y) / len;
                return (
                  <line
                    key={e.id}
                    x1={p1.x + ux * inset} y1={p1.y + uy * inset}
                    x2={p2.x - ux * inset} y2={p2.y - uy * inset}
                    stroke={on ? '#7c3aed' : able ? '#3f3352' : '#9c93ab'}
                    strokeWidth={on ? 10 : 8}
                    markerStart={marker}
                    markerEnd={marker}
                    opacity={able || on ? 1 : 0.5}
                  />
                );
              })}
            </svg>

            {/* --- ノード（四角） --- */}
            {NODE_DEFS.map(n => {
              const isCur = n.id === currentNode;
              return (
                <div
                  key={n.id}
                  className={`mb-node ${n.gray ? 'gray' : ''} ${n.outer ? 'outer' : ''} ${isCur ? 'current' : ''}`}
                  style={{ left: pos[n.id].x, top: pos[n.id].y, width: n.w, height: n.h }}
                  onPointerDown={ev => onPointerDown(ev, 'node', n.id)}
                  onPointerMove={onPointerMove}
                  onPointerUp={ev => onPointerUp(ev)}
                  title="ドラッグで動かせます"
                >
                  {n.outer ? (
                    <>
                      <div className="mb-node-inner-gray">
                        <span className="mb-node-title">{n.title}</span>
                        <span className="mb-node-sub">{n.sub}</span>
                        <span className="mb-node-sub">（L）</span>
                      </div>
                      <div className="mb-node-outer-label">体積　（L）</div>
                    </>
                  ) : (
                    <>
                      <span className="mb-node-title">{n.title}</span>
                      <span className="mb-node-sub">{n.sub}</span>
                    </>
                  )}
                  {isCur && <span className="mb-node-badge">いまここ</span>}
                </div>
              );
            })}

            {/* --- 矢印のラベル（タップで変換） --- */}
            {edgeGeom.map(({ e, mid }) => {
              const lines = edgeLabelText(e);
              const able = isTappable(e);
              const on = usedEdgeIds.has(e.id);
              const isLast = steps.length > 0 && steps[steps.length - 1].edgeId === e.id;
              return (
                <div
                  key={e.id}
                  className={`mb-elabel ${able ? 'able' : ''} ${on ? 'on' : ''} ${showHint && able ? 'hint' : ''}`}
                  style={{ left: mid.x + labelOff[e.id].x, top: mid.y + labelOff[e.id].y }}
                  onPointerDown={ev => onPointerDown(ev, 'label', e.id)}
                  onPointerMove={onPointerMove}
                  onPointerUp={ev => onPointerUp(ev, e)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tapEdge(e); } }}
                  title={able ? (isLast ? 'もう一度タップで1つ戻る' : 'タップでこの変換を式に入れる') : 'いまいる場所につながっていません'}
                >
                  {lines.map((l, i) => (
                    <span key={i} className={`mb-elabel-line ${e.dualUnit ? (l.includes(mlUnit) ? 'active' : 'dim') : ''}`}>{l}</span>
                  ))}
                  {e.note && <span className="mb-elabel-note">{e.note}</span>}
                  {e.valKey && (
                    <button
                      type="button"
                      className="mb-edit"
                      onPointerDown={ev => ev.stopPropagation()}
                      onClick={ev => {
                        ev.stopPropagation();
                        const r = refOf[e.valKey as string];
                        r?.current?.focus();
                        r?.current?.select();
                        r?.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
                      }}
                      title="この数字を書きかえる"
                      aria-label="この数字を書きかえる"
                    >✎</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      {/* ================= 定数の入力 ================= */}
      <div className="mb-panel">
        <p className="mb-panel-head">矢印の数字（問題文に合わせて書きかえる）</p>
        <div className="mb-vals">
          <label className="mb-val">
            <span>アボガドロ定数</span>
            <span className="mb-val-eq">1mol＝</span>
            <input ref={naRef} className="mb-input" value={vals.NA} onChange={ev => setVals(v => ({ ...v, NA: ev.target.value }))} />
            <span>個</span>
          </label>
          <label className="mb-val">
            <span>モル体積</span>
            <span className="mb-val-eq">1mol＝</span>
            <input ref={vmRef} className="mb-input" value={vals.Vm} onChange={ev => setVals(v => ({ ...v, Vm: ev.target.value }))} />
            <span>L</span>
          </label>
          <label className="mb-val">
            <span>モル質量</span>
            <span className="mb-val-eq">1mol＝</span>
            <input ref={mRef} className="mb-input" value={vals.M} onChange={ev => setVals(v => ({ ...v, M: ev.target.value }))} />
            <span>g</span>
          </label>
          <label className="mb-val">
            <span>密度</span>
            <span className="mb-val-eq">1{mlUnit}・1L＝</span>
            <input ref={dRef} className="mb-input" value={vals.d} onChange={ev => setVals(v => ({ ...v, d: ev.target.value }))} />
            <span>g</span>
          </label>
        </div>
        <p className="mb-panel-foot">
          ※ 数字を入れなければ <b>M</b>・<b>d</b> のまま文字式で立式できます（演習1のような文字の問題もこの図で解けます）。
        </p>
      </div>

      {/* ================= できあがった式（プリントと同じ形式） ================= */}
      <div className="mb-answer">
        <p className="mb-answer-head">できあがった式</p>
        <div className="mb-formula">
          <span className="mb-formula-start">{startValue}{unitOf(startNode)}</span>
          {steps.map((s, i) => (
            <span key={i} className="mb-formula-term">
              <span className="mb-times">×</span>
              <Frac up={<>{s.upN === '1' ? '1' : s.upN}{s.upU}</>} down={<>{s.downN === '1' ? '1' : s.downN}{s.downU}</>} />
            </span>
          ))}
          <span className="mb-eq">＝</span>
          <span className="mb-formula-result">
            {result.symbolic ? (
              <SymbolicResult
                coef={(result as any).coef}
                numSyms={result.numSyms}
                denSyms={result.denSyms}
                unit={result.unit}
                startValue={startValue}
              />
            ) : (
              <><b>{result.text}</b>{result.unit}</>
            )}
          </span>
        </div>
        {oneTimesNote && (
          <p className="mb-onetimes">{oneTimesNote}</p>
        )}
        {steps.length === 0 && (
          <p className="mb-answer-hint">→ 図の矢印にある変換の数字をタップすると、ここに途中式が1つずつ増えていきます。</p>
        )}
      </div>
    </div>
  );
}

/** 文字（M, d, N_A …）が残る式の結果表示 */
function SymbolicResult({
  coef, numSyms, denSyms, unit, startValue,
}: { coef?: string; numSyms: string[]; denSyms: string[]; unit: string; startValue: string }) {
  const startSym = parseNum(startValue) === null ? startValue : '';
  const ups = [coef && coef !== '1' ? coef : '', startSym, ...numSyms].filter(Boolean);
  const downs = denSyms.filter(Boolean);
  const upText = ups.length ? ups.join('×') : '1';
  if (!downs.length) return <><b>{upText}</b>{unit}</>;
  return <><Frac up={<b>{upText}</b>} down={<b>{downs.join('×')}</b>} />{unit}</>;
}

/* ============================================================
 * CSS（.mb- 接頭辞でスコープ）
 * ============================================================ */

const MAP_CSS = `
.mb-map-wrap{
  --mb-accent:#7c3aed;
  --mb-accent-d:#5b21b6;
  --mb-ink:#3f3352;
  --mb-bg:#faf7ff;
  --mb-line:#c9bce6;
  font-family:'Hiragino Sans','Yu Gothic','Meiryo','Noto Sans JP',sans-serif;
  color:var(--mb-ink);
  background:var(--mb-bg);
  border:2px solid var(--mb-line);
  border-radius:12px;
  padding:14px;
  margin:18px 0;
}
.mb-map-head{margin-bottom:10px;}
.mb-map-title{font-weight:800;font-size:1.02em;color:var(--mb-accent-d);margin:0 0 6px;}
.mb-map-usage{font-size:.8em;line-height:1.6;color:#5c5170;background:#fff;border:1px dashed var(--mb-line);border-radius:8px;padding:8px 10px;margin:0;}
.mb-map-usage b{color:var(--mb-accent-d);}

.mb-panel{background:#fff;border:1px solid var(--mb-line);border-radius:10px;padding:10px 12px;margin:10px 0;}
.mb-panel-head{margin:0 0 8px;font-size:.85em;font-weight:800;color:var(--mb-accent-d);}
.mb-panel-foot{margin:8px 0 0;font-size:.76em;color:#6b6280;line-height:1.6;}
.mb-panel-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;}
.mb-panel-label{font-size:.85em;font-weight:800;color:var(--mb-accent-d);}
.mb-input{border:1.5px solid var(--mb-line);border-radius:6px;padding:4px 8px;font-size:.9em;width:120px;background:#fff;color:var(--mb-ink);font-family:inherit;}
.mb-input:focus{outline:2px solid var(--mb-accent);outline-offset:1px;}
.mb-input-num{width:110px;font-weight:700;}
.mb-select{border:1.5px solid var(--mb-line);border-radius:6px;padding:4px 8px;font-size:.9em;background:#fff;color:var(--mb-ink);font-family:inherit;font-weight:700;}
.mb-now{font-size:.82em;background:#f3ecff;border-radius:999px;padding:3px 10px;border:1px solid var(--mb-line);}
.mb-now b{color:var(--mb-accent-d);}

.mb-btn{border:1.5px solid var(--mb-line);background:#fff;color:var(--mb-accent-d);border-radius:8px;padding:4px 10px;font-size:.8em;font-weight:800;cursor:pointer;font-family:inherit;}
.mb-btn:hover{background:#f3ecff;}
.mb-btn:disabled{opacity:.4;cursor:default;}
.mb-btn-icon{width:32px;padding:4px 0;font-size:1em;}
.mb-zoom-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:6px 0;}
.mb-zoom-val{font-size:.78em;width:44px;text-align:center;color:#6b6280;font-weight:700;}
.mb-ml-toggle{display:inline-flex;align-items:center;gap:5px;font-size:.78em;color:#6b6280;margin-left:auto;}
.mb-chip{border:1.5px solid var(--mb-line);background:#fff;border-radius:999px;padding:2px 10px;font-size:.95em;font-weight:800;color:var(--mb-accent-d);cursor:pointer;font-family:inherit;}
.mb-chip.on{background:var(--mb-accent);color:#fff;border-color:var(--mb-accent);}

.mb-btn-on{background:var(--mb-accent);color:#fff;border-color:var(--mb-accent);}
.mb-canvas-scroll{overflow:auto;-webkit-overflow-scrolling:touch;background:#fff;border:1px solid var(--mb-line);border-radius:10px;padding:4px;}

/* ===== 全画面表示（スマホで図の右端まで見えるように） ===== */
.mb-fs-inline{display:block;}
.mb-fs-overlay{
  position:fixed;inset:0;z-index:70;display:flex;flex-direction:column;
  background:rgba(47,39,64,.9);backdrop-filter:blur(2px);padding:8px;gap:8px;
}
.mb-fs-overlay .mb-canvas-scroll{flex:1 1 auto;min-height:0;}
.mb-fs-bar{
  display:flex;align-items:center;gap:8px;flex-wrap:wrap;flex:0 0 auto;
  background:#fff;border-radius:10px;padding:6px 10px;
}
.mb-fs-title{font-size:.82em;font-weight:800;color:var(--mb-accent-d);margin-right:auto;}
.mb-canvas{position:relative;}
.mb-canvas-inner{position:relative;transform-origin:top left;touch-action:none;}
.mb-svg{position:absolute;inset:0;pointer-events:none;}

.mb-node{
  position:absolute;box-sizing:border-box;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  border:2px solid #2f2740;background:#fff;
  font-size:15px;font-weight:700;line-height:1.25;text-align:center;
  cursor:grab;touch-action:none;user-select:none;
}
.mb-node.gray{background:#d9d9d9;}
.mb-node.outer{background:#fff;justify-content:flex-start;padding-top:10px;}
.mb-node.outer .mb-node-inner-gray{
  width:88%;background:#d9d9d9;border:2px solid #2f2740;
  display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px 4px;
}
.mb-node-outer-label{margin-top:auto;margin-bottom:8px;font-size:15px;font-weight:700;}
.mb-node-title{font-size:15px;}
.mb-node-sub{font-size:13px;}
.mb-node.current{border-color:var(--mb-accent);box-shadow:0 0 0 3px rgba(124,58,237,.25);}
.mb-node-badge{
  position:absolute;top:-11px;left:50%;transform:translateX(-50%);
  background:var(--mb-accent);color:#fff;font-size:10px;font-weight:800;
  padding:1px 7px;border-radius:999px;white-space:nowrap;
}

.mb-elabel{
  position:absolute;transform:translate(-50%,-50%);
  display:flex;flex-direction:column;align-items:center;
  background:rgba(255,255,255,.96);border:2px solid transparent;border-radius:8px;
  padding:3px 8px;font-size:14px;font-weight:800;line-height:1.35;white-space:nowrap;
  cursor:pointer;touch-action:none;user-select:none;
}
.mb-elabel-line{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:2px;}
.mb-elabel-line.dim{opacity:.42;text-decoration:none;}
.mb-elabel-line.active{color:var(--mb-accent-d);}
.mb-elabel-note{font-size:12px;text-decoration:underline;}
.mb-elabel.able{border-color:var(--mb-line);}
.mb-elabel.able:hover{background:#f3ecff;border-color:var(--mb-accent);}
.mb-elabel.on{border-color:var(--mb-accent);background:#f3ecff;color:var(--mb-accent-d);}
.mb-elabel.hint{animation:mbPulse 1.6s ease-in-out infinite;}
@keyframes mbPulse{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,.35);}50%{box-shadow:0 0 0 6px rgba(124,58,237,0);}}
.mb-edit{
  position:absolute;top:-10px;right:-10px;width:20px;height:20px;
  border-radius:50%;border:1.5px solid var(--mb-line);background:#fff;
  font-size:11px;line-height:1;cursor:pointer;color:var(--mb-accent-d);padding:0;
}
.mb-edit:hover{background:var(--mb-accent);color:#fff;}

.mb-vals{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:8px;}
.mb-val{display:flex;align-items:center;gap:6px;font-size:.8em;background:#faf7ff;border:1px solid var(--mb-line);border-radius:8px;padding:6px 8px;}
.mb-val>span:first-child{font-weight:800;color:var(--mb-accent-d);min-width:92px;}
.mb-val-eq{font-weight:700;}
.mb-val .mb-input{width:88px;}

.mb-answer{background:#fff;border:2px solid var(--mb-accent);border-radius:10px;padding:12px;margin-top:10px;}
.mb-answer-head{margin:0 0 8px;font-size:.85em;font-weight:800;color:var(--mb-accent-d);}
.mb-answer-hint{margin:8px 0 0;font-size:.78em;color:#6b6280;}
.mb-formula{display:flex;flex-wrap:wrap;align-items:center;gap:2px;font-size:1.05em;font-weight:700;line-height:2.4;}
.mb-formula-start{font-weight:700;}
.mb-formula-term{display:inline-flex;align-items:center;}
.mb-times{margin:0 2px;}
.mb-eq{margin:0 4px;}
.mb-formula-result b{color:var(--mb-accent-d);border-bottom:2.5px solid var(--mb-accent-d);}
.mb-onetimes{
  margin:10px 0 0;display:inline-block;font-size:.86em;font-weight:800;
  border:1.5px solid var(--mb-ink);padding:3px 8px;
}

/* プリントと同じ「囲み分数」 */
.mb-frac{display:inline-flex;flex-direction:column;vertical-align:middle;border:1.5px solid currentColor;margin:0 2px;text-align:center;}
.mb-frac-up{padding:0 6px;border-bottom:1.5px solid currentColor;font-size:.92em;line-height:1.4;}
.mb-frac-down{padding:0 6px;font-size:.92em;line-height:1.4;}

@media (max-width:640px){
  .mb-map-wrap{padding:10px;}
  .mb-input-num{width:84px;}
  .mb-val>span:first-child{min-width:76px;}
  .mb-formula{font-size:.96em;}
  /* 図のボタン行は横に並べきれないので折り返し前提にする */
  .mb-zoom-row{gap:6px;}
  .mb-zoom-row .mb-btn{font-size:.74em;padding:4px 8px;}
  .mb-ml-toggle{margin-left:0;width:100%;}
  /* 縦長の画面でも図の全体像がわかるように、最低限の高さを確保する */
  .mb-fs-inline .mb-canvas-scroll{max-height:60vh;}
}
/* 「大きく見る」ボタンはスマホでいちばん効くので、そこだけ目立たせる */
.mb-btn-fs{border-color:var(--mb-accent);color:var(--mb-accent-d);font-weight:900;}
`;

export default MolUnitMap;

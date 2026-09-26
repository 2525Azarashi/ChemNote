/**
 * ===================================================================
 * ガチャの「大当たり（UR）」＝ 学習プリントPDF を作る
 * ===================================================================
 *
 * 使い方（2段階）:
 *   1) 素材を書き出す（アプリの検証済みデータだけを使う）
 *        npx tsx scripts/gacha-prints/dump-data.mts .tmpwork/prints-data.json
 *   2) PDF を作る（Chromium で HTML を印刷する）
 *        PLAYWRIGHT_DIR=<playwright のあるフォルダ> node scripts/gacha-prints/build-prints.mjs .tmpwork/prints-data.json
 *      → public/prints/*.pdf と .tmpwork/prints-manifest.json を書き出す
 *   3) 圧縮・サムネイル（1ページ目の縮小画像）・一覧ファイルの生成
 *        python3 scripts/gacha-prints/finalize.py
 *      → public/prints/thumbs/*.webp と src/data/gachaPrints.generated.ts（★手で直さない★）
 *
 * ★問題・正解・解説はアプリの対戦プール（検証済み）からそのまま使う。新しく問題を作らない★
 *   正解が間違ったプリントを配らないため。出題傾向はアプリ内の分析データ（trendData）から。
 *
 * PLAYWRIGHT_DIR は playwright パッケージのあるディレクトリ（既定: .tmpwork/pw/node_modules/playwright）。
 * アプリ本体の依存には入れない（PDF はリポジトリに入れて配信するので、本番ビルドでは不要）。
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const DATA = JSON.parse(readFileSync(process.argv[2] ?? path.join(ROOT, '.tmpwork/prints-data.json'), 'utf8'));
const OUT_DIR = path.join(ROOT, 'public/prints');
mkdirSync(OUT_DIR, { recursive: true });
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_DIR ?? path.join(ROOT, '.tmpwork/pw/node_modules/playwright'));

// -------------------------------------------------------------------
// 小道具
// -------------------------------------------------------------------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const br = (s) => esc(s).replace(/\n/g, '<br>');
const MARKS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];

/** 決まった種から乱数（毎回同じプリントになるように） */
function rng(seed) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}

/** 図や資料が無いと解けない問題は外す（プリントに図を載せられないため） */
const NEEDS_FIGURE = /図|資料|グラフ|写真|下の表|次の表|表から|表を|表中|右の|左の|模式図|イラスト/;

function questionText(q) {
  const p = (q.p || '').trim();
  const l = (q.l || '').trim();
  if (p === '次の問いに答えよ。' || p === '熟語の意味を選べ') return l;
  if (p && l && !/^空欄に入る/.test(l)) return `${p}\n${l}`;
  return p || l;
}

/**
 * 問題を選ぶ。章（単元）ごとに均等に、同じ文の重複を除いて、最大 n 問。
 * 並びは章の順を保つ（プリントは単元順に解くほうが学びやすい）。
 */
function pick(qs, n, seed, chapterOrder) {
  const seen = new Set();
  const usable = qs.filter((q) => {
    if (q.img || !q.o || q.o.length < 2 || q.a < 0) return false;
    const t = questionText(q);
    if (!t || NEEDS_FIGURE.test(t)) return false;
    const key = t.replace(/\s/g, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const byCh = new Map();
  for (const q of usable) byCh.set(q.ch, [...(byCh.get(q.ch) || []), q]);
  const order = chapterOrder ?? [...byCh.keys()];
  const r = rng(seed);
  for (const list of byCh.values()) list.sort(() => r() - 0.5);
  const out = [];
  let round = 0;
  while (out.length < n) {
    let added = false;
    for (const ch of order) {
      const list = byCh.get(ch);
      if (list && list[round]) { out.push(list[round]); added = true; if (out.length >= n) break; }
    }
    if (!added) break;
    round += 1;
  }
  const rank = new Map(order.map((c, i) => [c, i]));
  return out.sort((a, b) => (rank.get(a.ch) ?? 0) - (rank.get(b.ch) ?? 0));
}

// -------------------------------------------------------------------
// 見た目（A4・印刷前提）
// -------------------------------------------------------------------
const CSS = `
@page { size: A4; margin: 16mm 14mm 16mm 14mm; }
* { box-sizing: border-box; }
body { font-family: "Noto Sans CJK JP", "Noto Sans JP", sans-serif; color: #1B2631; font-size: 10.5pt; line-height: 1.65; margin: 0; }
h1,h2,h3 { margin: 0; line-height: 1.35; }
.cover { height: 262mm; display: flex; flex-direction: column; page-break-after: always; }
.band { background: var(--c); color: #fff; border-radius: 6mm; padding: 12mm 10mm 10mm; position: relative; overflow: hidden; }
.band::after { content: ""; position: absolute; right: -18mm; top: -18mm; width: 70mm; height: 70mm; border-radius: 50%; background: rgba(255,255,255,.12); }
.band .kicker { font-size: 10pt; letter-spacing: .2em; opacity: .9; }
.band h1 { font-size: 25pt; margin-top: 3mm; }
.band .sub { font-size: 11.5pt; margin-top: 3mm; opacity: .95; }
.ur { display: inline-block; margin-top: 5mm; padding: 1.2mm 4mm; border-radius: 99px; background: linear-gradient(90deg,#ff6b6b,#f7b733,#4ecdc4,#7b68ee); font-weight: 900; font-size: 10pt; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.25); }
.meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; margin-top: 6mm; }
.meta div { border: 1px solid #E5E1D8; border-radius: 3mm; padding: 3mm 4mm; }
.meta b { display: block; font-size: 15pt; color: var(--c); }
.meta span { font-size: 8.5pt; color: #5D6D7E; }
.box { border: 1.4px solid var(--c); border-radius: 4mm; padding: 4mm 5mm; margin-top: 6mm; }
.box h2 { font-size: 12pt; color: var(--c); margin-bottom: 2mm; }
.box ul { margin: 0; padding-left: 5mm; }
.box li { margin: .6mm 0; }
.check li { list-style: none; margin-left: -5mm; }
.check li::before { content: "□ "; color: var(--c); font-weight: 700; }
.name { margin-top: auto; display: grid; grid-template-columns: 1fr 1fr 34mm; gap: 3mm; }
.name div { border-bottom: 1px solid #1B2631; padding: 6mm 1mm 1mm; font-size: 9pt; color: #5D6D7E; }
.name .score { border: 1.4px solid #1B2631; border-radius: 3mm; text-align: right; padding: 2mm 3mm; }
.brand { margin-top: 4mm; font-size: 8pt; color: #8895A0; text-align: right; }
.section { page-break-before: always; }
.sec-title { border-left: 3mm solid var(--c); padding: 1mm 0 1mm 3mm; font-size: 15pt; margin-bottom: 4mm; }
.sec-lead { color: #5D6D7E; font-size: 9.5pt; margin: -2mm 0 4mm; }
.unit-h { margin: 5mm 0 2mm; padding: 1.5mm 3mm; background: var(--soft); border-radius: 2mm; font-size: 11pt; font-weight: 700; color: #1B2631; page-break-after: avoid; }
.q { border-bottom: 1px dashed #D5D8DC; padding: 2.4mm 0 3mm; page-break-inside: avoid; display: grid; grid-template-columns: 11mm 1fr 16mm; gap: 2mm; }
.q .no { font-weight: 900; color: var(--c); font-size: 11pt; }
.q .ans { border: 1px solid #AAB7B8; border-radius: 2mm; height: 10mm; align-self: start; }
.opts { display: grid; grid-template-columns: 1fr 1fr; gap: .6mm 5mm; margin-top: 1.4mm; font-size: 10pt; }
.opts.long { grid-template-columns: 1fr; }
.key { width: 100%; border-collapse: collapse; font-size: 9.2pt; }
.key th, .key td { border: 1px solid #D5D8DC; padding: 1.4mm 2mm; vertical-align: top; }
.key th { background: var(--soft); width: 12mm; }
.key td.a { width: 12mm; text-align: center; font-weight: 900; color: #C0392B; font-size: 11pt; }
.key tr { page-break-inside: avoid; }
table.t { width: 100%; border-collapse: collapse; font-size: 9.2pt; margin: 2mm 0 4mm; }
table.t th, table.t td { border: 1px solid #D5D8DC; padding: 1.5mm 2mm; vertical-align: top; }
table.t th { background: var(--soft); text-align: left; white-space: nowrap; }
table.t tr { page-break-inside: avoid; }
.card { border: 1px solid #E5E1D8; border-radius: 3mm; padding: 3mm 4mm; margin: 3mm 0; page-break-inside: avoid; }
.card h3 { font-size: 11pt; color: var(--c); margin-bottom: 1mm; }
.tag { display: inline-block; font-size: 8pt; padding: .3mm 2mm; border-radius: 99px; background: var(--soft); margin-right: 1.5mm; }
.pred { background: #FEF9E7; border-left: 2mm solid #F4D03F; padding: 2mm 3mm; margin-top: 2mm; font-size: 9.5pt; }
.label { font-size: 8.5pt; font-weight: 700; color: #5D6D7E; margin-top: 1.5mm; }
.vocab { width: 100%; border-collapse: collapse; font-size: 9.6pt; }
.vocab td { border-bottom: 1px solid #E5E1D8; padding: 1.3mm 1.5mm; }
.vocab td.n { width: 9mm; color: #8895A0; font-size: 8pt; }
.vocab td.w { width: 45mm; font-weight: 700; font-family: "Noto Serif CJK JP", serif; }
.vocab td.blank { border-bottom: 1px solid #1B2631; }
.two { columns: 2; column-gap: 7mm; }
.two .q { break-inside: avoid; }
.tip { font-size: 9pt; color: #5D6D7E; background: #F8F9F9; border-radius: 2mm; padding: 2mm 3mm; margin-bottom: 3mm; }
`;

const SUBJECT_STYLE = {
  chemistry_basic: { c: '#C2567A', soft: '#FBE9EF', name: '化学基礎' },
  chemistry: { c: '#2E86C1', soft: '#E3F0FA', name: '化学' },
  math: { c: '#5B5EA6', soft: '#ECECF8', name: '数学' },
  biology_basic: { c: '#6E8B3D', soft: '#EEF4E3', name: '生物基礎' },
  english_grammar: { c: '#C27C0E', soft: '#FDF1DE', name: '英文法' },
  english_vocab: { c: '#B9770E', soft: '#FDF2E0', name: '英単語・熟語' },
  joho: { c: '#17A589', soft: '#E0F5F0', name: '情報Ⅰ' },
  rika: { c: '#7B4FA8', soft: '#F2EAF9', name: '高校入試 理科' },
};

function page({ subject, kicker, title, sub, meta, aims, checklist, body, note }) {
  const st = SUBJECT_STYLE[subject];
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS}</style></head>
<body style="--c:${st.c};--soft:${st.soft}">
<section class="cover">
  <div class="band"><div class="kicker">${esc(kicker)}</div><h1>${esc(title)}</h1><div class="sub">${esc(sub)}</div><span class="ur">★ 大当たり UR 学習プリント ★</span></div>
  <div class="meta">${meta.map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>
  <div class="box"><h2>このプリントのねらいと使い方</h2><ul>${aims.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>
  ${checklist?.length ? `<div class="box"><h2>到達度チェック（できたら✓）</h2><ul class="check">${checklist.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>` : ''}
  <div class="name"><div>組・番号</div><div>氏名</div><div class="score">／ ${esc(note ?? '100')}</div></div>
  <div class="brand">マナトビ 学習プリント ／ ${esc(st.name)} ／ ガチャ大当たり特典</div>
</section>
${body}
</body></html>`;
}

function questionsBlock(questions, { chapters, groupBy = true, startNo = 1 } = {}) {
  let html = '';
  let last = null;
  questions.forEach((q, i) => {
    if (groupBy && q.ch !== last) {
      last = q.ch;
      const t = (chapters?.[q.ch] || q.topic || q.ch).replace(/｜/g, '　');
      html += `<div class="unit-h">${esc(t)}</div>`;
    }
    const long = q.o.some((o) => o.length > 16);
    html += `<div class="q"><div class="no">${startNo + i}</div><div><div>${br(questionText(q))}</div>
      <div class="opts${long ? ' long' : ''}">${q.o.map((o, k) => `<div>${MARKS[k]} ${esc(o)}</div>`).join('')}</div></div><div class="ans"></div></div>`;
  });
  return html;
}

function answerKey(questions, startNo = 1) {
  return `<table class="key"><tbody>${questions.map((q, i) => {
    const expl = q.e ? q.e : `正解は「${q.o[q.a]}」。`;
    return `<tr><th>${startNo + i}</th><td class="a">${MARKS[q.a]}</td><td>${br(expl)}</td></tr>`;
  }).join('')}</tbody></table>`;
}

function practicePrint(o) {
  const qs = o.questions;
  const body = `
<section class="section"><h2 class="sec-title">演習問題（全${qs.length}問）</h2>
<p class="sec-lead">答えを右の枠に番号で書く。途中式・根拠は余白に。1問1分を目安に。</p>
${o.intro ?? ''}
${questionsBlock(qs, { chapters: o.chapters })}</section>
<section class="section"><h2 class="sec-title">解答・解説</h2>
<p class="sec-lead">丸つけ後、間違えた番号に✓。1週間後にもう一度解き直すと定着します。</p>
${answerKey(qs)}</section>`;
  return page({ ...o, body, meta: [[`${qs.length}問`, '収録問題'], [o.units, '範囲'], [`約${Math.ceil(qs.length * 1.1)}分`, '目安時間']], note: `${qs.length}` });
}

// ---- 出題傾向 ----
function unitCard(u) {
  return `<div class="card"><h3>${esc(u.name)}</h3>
    <span class="tag">頻度：${esc(u.frequency)}</span>
    <div class="label">出題年度</div><div>${esc(u.yearsAppeared)}</div>
    <div class="label">出題パターン</div><ul>${(u.examTypes || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="label">必要な武器（覚えること）</div><ul>${(u.weapons || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <div class="label">演習で意識すること</div><div>${esc(u.studyPoints)}</div>
    <div class="pred"><b>2027 予想：</b>${esc(u.prediction2027)}</div></div>`;
}

function overallTrendBody(ds) {
  const o = ds.overall;
  return `
<section class="section"><h2 class="sec-title">${esc(o.title)}</h2><p class="sec-lead">${esc(o.period)}</p>
<h3 class="unit-h">${esc(ds.yearlyTableTitle)}</h3>
<table class="t"><thead><tr><th>年</th><th>区分</th><th>大問</th><th>小問</th><th>特徴</th></tr></thead><tbody>
${o.yearlyOverview.map((r) => `<tr><td>${r.year}</td><td>${esc(r.type)}</td><td>${r.bigQuestions}</td><td>${r.subQuestions}</td><td>${esc(r.feature)}${r.supplementary ? `<br><small>追試：${esc(r.supplementary)}</small>` : ''}</td></tr>`).join('')}
</tbody></table>
<h3 class="unit-h">大きな流れ</h3>
${o.bigTrends.map((t) => `<div class="card"><h3>${esc(t.title)}</h3><div>${esc(t.detail)}</div></div>`).join('')}
<h3 class="unit-h">センター試験 → 共通テストで何が変わったか</h3>
<table class="t"><thead><tr><th>観点</th><th>センター</th><th>共通テスト</th></tr></thead><tbody>
${ds.comparisonTable.map(([a, b, c]) => `<tr><th>${esc(a)}</th><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</tbody></table>
<h3 class="unit-h">平均点</h3><p>${o.averageScores.map((a) => `${a.year}年：${esc(a.score)}`).join('　／　')}</p><p class="tip">${esc(ds.averageScoreNote)}</p>
</section>
<section class="section"><h2 class="sec-title">2027年 予想構成</h2>
<h3 class="unit-h">${esc(ds.structurePrimaryLabel)}</h3>
<table class="t"><thead><tr><th>問</th><th>予想テーマ</th><th>確率</th></tr></thead><tbody>
${o.exam2027Structure.q1.map((r) => `<tr><td>${r.no}</td><td>${esc(r.theme)}</td><td>${esc(r.probability)}</td></tr>`).join('')}</tbody></table>
<h3 class="unit-h">${esc(ds.structureSecondaryLabel)}</h3><ul>${o.exam2027Structure.q2Candidates.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
<h2 class="sec-title" style="margin-top:8mm">テーマのローテーション（周期）</h2><p class="tip">${esc(ds.rotationIntro)}</p>
<table class="t"><thead><tr><th>テーマ</th><th>出題年</th><th>周期</th><th>2027</th></tr></thead><tbody>
${ds.rotation.map((r) => `<tr><td>${esc(r.theme)}</td><td>${esc(r.years)}${r.yearsSupplementary ? `<br><small>追試：${esc(r.yearsSupplementary)}</small>` : ''}</td><td>${esc(r.cycle)}</td><td>${esc(r.prediction)}</td></tr>`).join('')}
</tbody></table>
<h3 class="unit-h">合格者からのメッセージ</h3><p>${esc(ds.finalMessageLead)}</p><ul>${ds.finalMessages.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
</section>`;
}

function chapterTrendBody(chapters, extraQs, chapterTitles) {
  let html = chapters.map((c) => `
<section class="section"><h2 class="sec-title">${esc(c.chapterGroupTitle)}</h2>
<div class="tip"><b>章の総括：</b>${esc(c.summary)}</div>
${c.units.map(unitCard).join('')}</section>`).join('');
  if (extraQs?.length) {
    html += `<section class="section"><h2 class="sec-title">傾向を読んだら即演習（${extraQs.length}問）</h2>
<p class="sec-lead">上の「必要な武器」を使えば解ける問題だけを集めました。</p>${questionsBlock(extraQs, { chapters: chapterTitles })}</section>
<section class="section"><h2 class="sec-title">解答・解説</h2>${answerKey(extraQs)}</section>`;
  }
  return html;
}

function vocabBody(words, title) {
  const rows = (list, start, showAns) => `<table class="vocab"><tbody>${list.map((w, i) => `<tr><td class="n">${start + i}</td><td class="w">${esc(w.l)}</td><td class="${showAns ? '' : 'blank'}">${showAns ? esc(w.o[w.a]) : ''}</td></tr>`).join('')}</tbody></table>`;
  const half = Math.ceil(words.length / 2);
  return `
<section class="section"><h2 class="sec-title">${esc(title)}　テスト（全${words.length}語）</h2>
<p class="sec-lead">意味を右の線の上に書く。1語5秒。分からなければ飛ばして、最後に戻る。</p>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:7mm">${rows(words.slice(0, half), 1, false)}${rows(words.slice(half), half + 1, false)}</div></section>
<section class="section"><h2 class="sec-title">解答（意味の一覧）</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:7mm">${rows(words.slice(0, half), 1, true)}${rows(words.slice(half), half + 1, true)}</div>
<h2 class="sec-title" style="margin-top:8mm">4択で確認（20問）</h2>
${questionsBlock(words.slice(0, 20).map((w) => ({ ...w, p: '', l: `${w.l} の意味は？` })), { groupBy: false })}
</section>`;
}

// -------------------------------------------------------------------
// カタログ（何を作るか）
// -------------------------------------------------------------------
const Q = DATA.questions;
const CH = DATA.chapters;
const T = DATA.trends;
const catalog = [];
const add = (x) => catalog.push(x);
const idsWith = (subject, re) => [...new Set(Q[subject].filter((q) => re.test(q.ch)).map((q) => q.ch))];

// ① 共通テスト出題傾向（化学基礎・化学）
add({ id: 'print_trend_cb_all', subject: 'chemistry_basic', category: '出題傾向', label: '化学基礎 共通テスト出題傾向 総合レポート',
  kicker: 'COMMON TEST TREND REPORT', title: '化学基礎 共通テスト出題傾向 総合レポート', sub: '過去11年（2016〜2026）の全問分析と 2027 年の予想',
  build: () => page({ subject: 'chemistry_basic', kicker: 'COMMON TEST TREND REPORT', title: '化学基礎 共通テスト出題傾向 総合レポート', sub: '過去11年（2016〜2026）の全問分析と 2027 年の予想',
    meta: [['11年分', 'センター＋共通テスト'], ['6章', '全範囲'], ['2027', '予想つき']],
    aims: ['試験の「型」を知ってから勉強すると、同じ時間でも点の伸びが違う。まず全体像をつかむ。', '年度表で「どの年に何が出たか」、ローテーション表で「次に来るテーマ」を確認する。', '最後の2027予想構成を、自分の弱点リストと照らし合わせて学習計画を立てる。'],
    checklist: ['第1問と第2問の役割の違いを説明できる', '毎年出るテーマを5つ挙げられる', '周期的に出るテーマのうち、来年来そうなものを言える'],
    body: overallTrendBody(T.chemistry_basic) }) });
T.chemistry_basic.chapters.forEach((c, i) => {
  const n = i + 1;
  const extra = pick(Q.chemistry_basic.filter((q) => q.ch.startsWith(`c${n}_`)), 16, `cbtrend${n}`);
  add({ id: `print_trend_cb_ch${n}`, subject: 'chemistry_basic', category: '出題傾向', label: `化学基礎 ${c.chapterGroupTitle} 出題傾向＋即演習`,
    build: () => page({ subject: 'chemistry_basic', kicker: 'TREND × PRACTICE', title: `${c.chapterGroupTitle}`, sub: '共通テスト出題傾向（小単元別）＋ 傾向どおりの即演習',
      meta: [[`${c.units.length}単元`, '小単元別分析'], [`${extra.length}問`, '即演習'], ['2027', '予想つき']],
      aims: ['小単元ごとに「どの年に・どんな形で」出たかを読み、必要な知識（武器）を確認する。', '武器リストの中で即答できないものに印をつけ、教科書・アプリの単元で補強する。', '最後の即演習で、傾向どおりの問題が本当に解けるかを確かめる。'],
      checklist: c.units.map((u) => `${u.name} の出題パターンを説明できる`).slice(0, 7),
      body: chapterTrendBody([c], extra, CH.chemistry_basic), note: `${extra.length}` }) });
});
add({ id: 'print_trend_c_all', subject: 'chemistry', category: '出題傾向', label: '化学 共通テスト出題傾向 総合レポート',
  build: () => page({ subject: 'chemistry', kicker: 'COMMON TEST TREND REPORT', title: '化学 共通テスト出題傾向 総合レポート', sub: '過去15年（本試＋追試）の分析と 2027 年の予想',
    meta: [['15年分', '本試＋追試'], ['14章', '理論・無機・有機'], ['2027', '予想つき']],
    aims: ['理論・無機・有機のどこに配点が集まるかをつかみ、勉強の順番を決める。', '追試の出題も含めた「裏テーマ」まで押さえる。', 'ローテーション表で、今年狙われやすいテーマに印をつける。'],
    checklist: ['第1〜4問と第5問の役割を説明できる', '15年間ほぼ毎年出る章を挙げられる', '追試で出たが本試で出ていないテーマを1つ挙げられる'],
    body: overallTrendBody(T.chemistry) }) });
[['theoretical', '理論化学', /^(1|2|3|4|5|6)章/, /^a[1-6]_/], ['inorganic', '無機化学', /^(7|8|9)章/, /^a[7-9]_/], ['organic', '有機化学', /^1[0-4]章/, /^a1[0-4]_/]].forEach(([key, name, reCh, reId]) => {
  const chs = T.chemistry.chapters.filter((c) => reCh.test(c.chapterGroupTitle));
  const extra = pick(Q.chemistry.filter((q) => reId.test(q.ch)), 16, `ctrend${key}`);
  add({ id: `print_trend_c_${key}`, subject: 'chemistry', category: '出題傾向', label: `化学 ${name} 出題傾向${extra.length ? '＋即演習' : ''}`,
    build: () => page({ subject: 'chemistry', kicker: 'TREND BY FIELD', title: `化学 ${name} 出題傾向`, sub: `${chs[0].chapterGroupTitle} 〜 ${chs.at(-1).chapterGroupTitle}　小単元別の完全分析`,
      meta: [[`${chs.length}章`, '範囲'], [`${chs.reduce((n, c) => n + c.units.length, 0)}単元`, '小単元別'], [extra.length ? `${extra.length}問` : '—', '即演習']],
      aims: ['章ごとの総括で「何が主戦場か」をつかむ。', '小単元カードの「必要な武器」を暗記チェックリストとして使う。', '2027予想の高い単元から優先して演習する。'],
      checklist: chs.map((c) => `${c.chapterGroupTitle} の頻出パターンを言える`),
      body: chapterTrendBody(chs, extra, CH.chemistry), note: extra.length ? `${extra.length}` : '—' }) });
});

// ② 化学基礎 章別演習
T.chemistry_basic.chapters.forEach((c, i) => {
  const n = i + 1;
  const qs = pick(Q.chemistry_basic.filter((q) => q.ch.startsWith(`c${n}_`)), 50, `cb${n}`, Object.keys(CH.chemistry_basic).filter((k) => k.startsWith(`c${n}_`)));
  add({ id: `print_cb_ch${n}`, subject: 'chemistry_basic', category: '演習プリント', label: `化学基礎 ${c.chapterGroupTitle} 演習50題`,
    build: () => practicePrint({ subject: 'chemistry_basic', kicker: 'PRACTICE 50', title: `化学基礎 ${c.chapterGroupTitle}`, sub: '単元別 演習50題（解答・解説つき）', questions: qs, chapters: CH.chemistry_basic, units: `${c.units.length}単元`,
      aims: ['単元の順に並べてあるので、上から解けば章全体を一周できる。', '間違えた問題は解説の「理由」の部分を声に出して読む。', 'アプリの同じ単元で解き直すと、対戦の出題にもそのまま強くなる。'],
      checklist: c.units.map((u) => `${u.name}`).slice(0, 7) }) });
});

// ③ 化学 分野別演習
[['theoretical', '理論化学（熱化学）', /^a[1-6]_/], ['inorganic', '無機化学', /^a[7-9]_/]].forEach(([key, name, re]) => {
  const qs = pick(Q.chemistry.filter((q) => re.test(q.ch)), 50, `c${key}`, Object.keys(CH.chemistry).filter((k) => re.test(k)));
  add({ id: `print_c_${key}`, subject: 'chemistry', category: '演習プリント', label: `化学 ${name} 演習${qs.length}題`,
    build: () => practicePrint({ subject: 'chemistry', kicker: `PRACTICE ${qs.length}`, title: `化学 ${name}`, sub: `分野別 演習${qs.length}題（解答・解説つき）`, questions: qs, chapters: CH.chemistry, units: `${new Set(qs.map((q) => q.ch)).size}単元`,
      aims: ['共通テストの第1〜3問で出る形の問題を分野ごとに集めた。', '計算問題は単位を必ず書いてから数字を入れる。', '無機は「色・におい・沈殿・製法」をセットで覚える。'] }) });
});

// ④ 数学（分野別）
const mathTopics = [['場合の数と確率', 'math_prob'], ['整数の性質', 'math_int'], ['データの分析', 'math_data'], ['積分法', 'math_integral'], ['ベクトル', 'math_vector']];
mathTopics.forEach(([topic, id]) => {
  const pool = Q.math.filter((q) => q.topic === topic);
  const qs = pick(pool, 40, id);
  const course = pool[0]?.course ?? '';
  add({ id: `print_${id}`, subject: 'math', category: '演習プリント', label: `数学 ${course}「${topic}」演習${qs.length}題`,
    build: () => practicePrint({ subject: 'math', kicker: `MATH DRILL ${qs.length}`, title: `${course}　${topic}`, sub: `分野別 演習${qs.length}題（全問検算済み・解説つき）`, questions: qs, chapters: CH.math, units: course,
      aims: ['アプリの「網羅」「パターン演習」の問題から、分野の型を一通り集めた。', '選択肢を見る前に自分で答えを出してから番号を選ぶ（共通テストのマーク対策）。', '解説の式を自分のノートで再現できたら、その型は合格。'] }) });
});
{
  const pool = Q.math.filter((q) => /^mc[123abc]_/.test(q.ch));
  const qs = pick(pool, 60, 'math_basic_all');
  add({ id: 'print_math_basic_all', subject: 'math', category: '演習プリント', label: '数学Ⅰ・A・Ⅱ・B・Ⅲ・C 基礎〜標準 総まとめ',
    build: () => practicePrint({ subject: 'math', kicker: 'ALL COURSES', title: '数学 全6科目 基礎〜標準 総まとめ', sub: '数Ⅰ・A・Ⅱ・B・Ⅲ・C の全単元を1冊で一周', questions: qs, chapters: CH.math, units: '全6科目',
      aims: ['全単元から少しずつ出題。苦手な単元を見つける「健康診断」として使う。', '間違えた単元はアプリの同じ単元で集中的に解く。'] }) });
}

// ⑤ 2次関数 週課題（ハブの資料をそのまま）
add({ id: 'print_math_quadratic_weekly', subject: 'math', category: '演習プリント', label: '数学Ⅰ 2次関数 週課題 全6週（62ページ）', copyFrom: path.join(ROOT, 'scripts/gacha-prints/source/quadratic_weekly_6weeks.pdf') });

// ⑥ 生物基礎
[['前半', '生物の特徴・遺伝子', /^bio[12]_/], ['後半', '体内環境・植生・生態系', /^bio[345]_/]].forEach(([half, name, re], i) => {
  const qs = pick(Q.biology_basic.filter((q) => re.test(q.ch)), 50, `bio${i}`);
  add({ id: `print_bio_${i + 1}`, subject: 'biology_basic', category: '演習プリント', label: `生物基礎 ${half}（${name}）演習${qs.length}題`,
    build: () => practicePrint({ subject: 'biology_basic', kicker: 'BIOLOGY BASIC', title: `生物基礎 ${half}`, sub: `${name}　演習${qs.length}題（解答・解説つき）`, questions: qs, chapters: CH.biology_basic, units: name,
      aims: ['用語の定義と「似た用語との違い」を問う形を中心に集めた。', '解説に出てくる対比（〇〇ではなく△△）をノートに表にまとめると強い。'] }) });
});

// ⑦ 情報Ⅰ（単元別）
Object.entries(CH.joho).filter(([k]) => /^jh/.test(k)).forEach(([ch, name]) => {
  const qs = pick(Q.joho.filter((q) => q.ch === ch), 40, `joho${ch}`);
  add({ id: `print_joho_${ch}`, subject: 'joho', category: '演習プリント', label: `情報Ⅰ「${name}」演習${qs.length}題`,
    build: () => practicePrint({ subject: 'joho', kicker: 'INFORMATION I', title: `情報Ⅰ　${name}`, sub: `共通テスト情報Ⅰ対策　演習${qs.length}題（解答・解説つき）`, questions: qs, chapters: CH.joho, units: name, groupBy: false,
      aims: ['共通テスト「情報Ⅰ」の知識問題の型を単元ごとに集めた。', '解説の「なぜそうなるか」を1行で言えるようにする。'] }) });
});

// ⑧ 英文法
{
  const qs = pick(Q.english_grammar, 100, 'grammar', Object.keys(CH.english_grammar).filter((k) => /^eg/.test(k)));
  add({ id: 'print_grammar_100', subject: 'english_grammar', category: '演習プリント', label: '英文法 全20単元 総合100題',
    build: () => practicePrint({ subject: 'english_grammar', kicker: 'GRAMMAR 100', title: '英文法 総合100題', sub: '文型から会話表現まで 全20単元を1冊で', questions: qs, chapters: CH.english_grammar, units: '全20単元',
      aims: ['1単元5問ずつ。単元の見出しを見て「何の文法か」を意識してから解く。', '間違えた問題は、正しい文を3回音読する。'] }) });
}

// ⑨ 英単語・熟語テスト
[['lv1', '単語 Lv1 共通テスト基礎'], ['lv2', '単語 Lv2 共通テスト標準'], ['lv3', '単語 Lv3 二次・私大標準'], ['lv4', '単語 Lv4 難関・最難関'], ['ilv1', '熟語 Lv1〜3']].forEach(([lv, name]) => {
  const re = lv === 'ilv1' ? /^ilv/ : new RegExp(`^${lv}$`);
  const words = pick(Q.english_vocab.filter((q) => re.test(q.ch) && q.id.endsWith('e2j')), 100, `vocab${lv}`).map((w) => ({ ...w }));
  add({ id: `print_vocab_${lv}`, subject: 'english_vocab', category: '単語テスト', label: `英${name} 100語テスト`,
    build: () => page({ subject: 'english_vocab', kicker: 'VOCABULARY TEST 100', title: `英${name}`, sub: '100語テスト（意味を書く＋4択確認・解答つき）',
      meta: [['100語', '収録'], ['20問', '4択確認'], ['約15分', '目安時間']],
      aims: ['左の英語を見て、右の線に意味を書く。書けなかった語に✓をつける。', '✓の語だけを翌日もう一度。3日連続で書けたら卒業。', '最後の4択で、似た意味との区別を確認する。'],
      body: vocabBody(words, `英${name}`), note: '100' }) });
});

// ⑩ 高校入試 理科
[['生物編', /^ch0[1-9]$|^ch2[789]$/], ['物理編', /^ch1[0-7]$/], ['化学・地学編', /^ch1[89]$|^ch2[0-5]$|^ch3[0-2]$/]].forEach(([name, re], i) => {
  const qs = pick(Q.rika.filter((q) => re.test(q.ch)), 60, `rika${i}`, Object.keys(CH.rika).filter((k) => re.test(k)));
  add({ id: `print_rika_${i + 1}`, subject: 'rika', category: '演習プリント', label: `高校入試 理科 ${name} 最終チェック${qs.length}題`,
    build: () => practicePrint({ subject: 'rika', kicker: 'HIGH SCHOOL ENTRANCE', title: `高校入試 理科　${name}`, sub: `最終チェック${qs.length}題（解答つき）`, questions: qs, chapters: CH.rika, units: name,
      aims: ['入試直前の「用語・しくみ」の最終確認用。1問30秒で解く。', '迷った問題は教科書の図と一緒に見直す。'] }) });
});

// -------------------------------------------------------------------
// 書き出し
// -------------------------------------------------------------------
const browser = await chromium.launch();
const ctx = await browser.newContext();
const manifest = [];
for (const item of catalog) {
  const file = `/prints/${item.id}.pdf`;
  const dest = path.join(OUT_DIR, `${item.id}.pdf`);
  if (item.copyFrom) {
    copyFileSync(item.copyFrom, dest);
  } else {
    const html = item.build();
    const pageObj = await ctx.newPage();
    await pageObj.setContent(html, { waitUntil: 'load' });
    await pageObj.pdf({
      path: dest, format: 'A4', printBackground: true, preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="font-size:7px;width:100%;padding:0 14mm;color:#8895A0;font-family:'Noto Sans CJK JP'"><span>${esc(item.label)}</span></div>`,
      footerTemplate: `<div style="font-size:8px;width:100%;text-align:center;color:#8895A0;font-family:'Noto Sans CJK JP'">— <span class="pageNumber"></span> / <span class="totalPages"></span> —　マナトビ</div>`,
    });
    await pageObj.close();
  }
  const bytes = statSync(dest).size;
  manifest.push({ id: item.id, label: item.label, subject: item.subject, category: item.category, file, thumb: `/prints/thumbs/${item.id}.webp`, bytes });
  process.stdout.write(`✓ ${item.id} (${Math.round(bytes / 1024)}KB)\n`);
}
await browser.close();
writeFileSync(path.join(ROOT, '.tmpwork/prints-manifest.json'), JSON.stringify(manifest, null, 1));
console.log(`done: ${manifest.length} prints`);

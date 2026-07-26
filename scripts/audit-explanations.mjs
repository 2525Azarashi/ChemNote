#!/usr/bin/env node
/**
 * audit-explanations
 * ------------------------------------------------------------------
 * 全ての問題の「解答解説ページ」を洗い出し、次の2点を監査する。
 *
 *  A) 疑似テーブル検出
 *     「｜」「|」を並べただけのプレーンテキストによる疑似テーブルを検出する。
 *     （Markdown テーブル = ヘッダ行 + 区切り行 |---|---| は正常として扱う）
 *
 *  B) 不要な化学記号パレット検出
 *     解答に化学式・イオン式・反応式の入力が不要なのにパレットが出る問題を検出する。
 *
 * 使い方: node scripts/audit-explanations.mjs [--json]
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { findPseudoTableBlocks } from './pseudo-table.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ------------------------------------------------------------------
// 化学記号パレット必要性の判定（Quiz.tsx の現行ロジックを移植）
// ------------------------------------------------------------------
/**
 * 現在の Quiz.tsx `requiresChemicalSymbols` と同じロジック（修正後）。
 * 解答文字列だけを判断材料にする。
 */
function currentRequiresChemicalSymbols(question) {
  if (question?.requiresChemicalPalette) return true;
  const type = String(question?.type || '');
  if (type === 'multiple_choice' || type === 'true_false' || type === 'select' || type === 'sorting') {
    return false;
  }
  const answers = [question?.correctAnswer, ...(question?.acceptedAnswers || [])]
    .filter((a) => typeof a === 'string' && a.trim() !== '');
  if (answers.length === 0) return false;
  return answers.some((a) => answerNeedsPalette(a));
}

/** 修正前の（過剰検出だった）ロジック。before/after 比較用に残す。 */
function legacyRequiresChemicalSymbols(question, answer = {}) {
  if (question?.requiresChemicalPalette) return true;
  const text = [
    question?.text || '',
    answer?.correctAnswer || '',
    question?.category || '',
    JSON.stringify(question?.detailedExplanation || ''),
  ].join(' ').toLowerCase();

  const ionPattern = /\b([a-z]{1,2}\d*(?:[\+\-]|【）)|\([\+\-]|イオン)/i;
  const chemicalFormula = /\b[a-z]\d+\b|[a-z]{2,}\d+/i;
  const unicodeSuperSubscript = /[⁺⁻²³⁴⁵₂₃₄₅]/;
  const massNumberPattern = /\d+[a-z]|[a-z]\d+[\+\-\)]|\d+\(/;
  const chemKeywords = /価|イオン|原子|分子|化合物|酸化|還元|電荷|陽子|陰イオン|陽イオン|硫酸|硝酸|塩化|水酸|炭酸|アンモニウム/;
  const reactionKeywords = /反応式|化学式|組成式|電離|中和|化学反応|イオン反応|熱化学|燃焼|→|⇌/;

  return (
    ionPattern.test(text) || chemicalFormula.test(text) || unicodeSuperSubscript.test(text) ||
    massNumberPattern.test(text) || chemKeywords.test(text) || reactionKeywords.test(text)
  );
}

/**
 * 「本当に」パレットが必要かを、解答（correctAnswer / acceptedAnswers）の
 * 中身だけから判定する。パレットは *入力補助* なので、
 * 判断材料は「その設問の解答として打ち込む文字列」に限るのが正しい。
 */
export function trulyNeedsPalette(sub) {
  // multiple_choice / true_false はタップで選ぶだけ → 入力不要
  const type = sub?.type || '';
  if (type === 'multiple_choice' || type === 'true_false' || type === 'select') return false;

  const answers = [sub?.correctAnswer, ...(sub?.acceptedAnswers || [])]
    .filter((a) => typeof a === 'string' && a.trim() !== '');
  if (answers.length === 0) return false;

  return answers.some((a) => answerNeedsPalette(a));
}

/** 解答文字列そのものが、パレットの記号を必要とするか */
export function answerNeedsPalette(ansRaw) {
  const ans = String(ansRaw);

  // 1. 上付き・下付き Unicode を含む（H₂O, Cu²⁺, 10⁻³ など）
  // ¹²³ は U+00B9/B2/B3 で U+2070-2079 の範囲外なので個別に列挙する。
  if (/[₀-₉⁰-⁹⁺⁻¹²³]/.test(ans)) return true;
  // 2. 反応式の記号（→ ⇌ ⇄ ↔）。日本語説明文中の矢印は除外するためラテン文字必須。
  if (/[→⇌⇄↔]/.test(ans) && /[A-Za-z]/.test(ans)) return true;
  // 3. 電子・電荷の記号（e-, ^+, ^2- など TeX 風）
  if (/\^\{?[0-9]*[+\-−]/.test(ans) || /_\{?[0-9]/.test(ans)) return true;
  // 4. 元素記号＋数字（H2O, CaCO3, SO42- など。ただし単位付き数値は除く）
  //    先頭大文字の元素記号が1つ以上あり、数字か電荷が付いている
  if (/(?:[A-Z][a-z]?\d*){1,}[\d+\-]/.test(ans) && /[A-Z]/.test(ans)) {
    // 単位のみ（25 mL, 0.10 mol/L）は除外
    const unitOnly = /^[\d.,\s×^\-+()/]*(?:mol|L|mL|g|kg|mg|cm|m|kJ|J|K|Pa|kPa|atm|%|℃|mol\/L|g\/mol|個)?[\d.,\s×^\-+()/]*$/i;
    if (!unitOnly.test(ans)) return true;
  }
  // 5. イオン式の平文表記（Na+, Cl-, OH-, NH4+ など）
  if (/[A-Z][A-Za-z]{0,3}\d*\s*[+\-]\s*$/.test(ans.trim())) return true;

  return false;
}

// ------------------------------------------------------------------
// データ読み込み（TS を素の JS として評価できないため tsx 経由で JSON 化）
// ------------------------------------------------------------------
const dumpPath = join(ROOT, '.audit-data.json');
let data;
try {
  data = JSON.parse(readFileSync(dumpPath, 'utf8'));
} catch {
  console.error('先に scripts/dump-data.mts を実行してください（.audit-data.json が必要）');
  process.exit(2);
}

// ------------------------------------------------------------------
// 監査本体
// ------------------------------------------------------------------
const pseudoTableHits = [];
const paletteHits = [];
const allProblems = [];

for (const part of data.chemistryData.parts || []) {
  for (const ch of part.chapters || []) {
    for (const p of ch.practiceProblems || []) {
      allProblems.push({ partId: part.id, chapterId: ch.id, chapterTitle: ch.abstractTitle, problem: p });
    }
  }
}

/** 解説テキストとして表示される文字列を全部集める */
function collectExplanationTexts(p) {
  const out = [];
  const push = (label, v) => { if (typeof v === 'string' && v.trim()) out.push({ label, text: v }); };

  push('explanation', p.explanation);
  for (const sq of p.subQuestions || []) {
    push(`sub:${sq.id}.label`, sq.label);
    push(`sub:${sq.id}.explanation`, sq.explanation);
    push(`sub:${sq.id}.partialCreditCriteria`, sq.partialCreditCriteria);
    const de = sq.detailedExplanation;
    if (de) {
      push(`sub:${sq.id}.de.theme`, de.theme);
      for (const [i, s] of (de.steps || []).entries()) push(`sub:${sq.id}.de.steps[${i}]`, s);
    }
  }
  push('text', p.text);
  for (const [i, k] of (p.surroundingKnowledge || []).entries()) {
    if (typeof k === 'string') push(`surroundingKnowledge[${i}]`, k);
    else if (k) { push(`surroundingKnowledge[${i}].title`, k.title); push(`surroundingKnowledge[${i}].content`, k.content); }
  }
  return out;
}

for (const rec of allProblems) {
  const p = rec.problem;
  // --- A) 疑似テーブル ---
  for (const { label, text } of collectExplanationTexts(p)) {
    const hits = findPseudoTableBlocks(text);
    if (hits.length > 0) {
      pseudoTableHits.push({ ...rec, field: label, rows: hits.length, sample: hits[0].lines[0].slice(0, 60) });
    }
  }
  // --- B) 不要なパレット ---
  for (const sq of p.subQuestions || []) {
    const cur = currentRequiresChemicalSymbols(sq);
    const truly = trulyNeedsPalette(sq);
    if (cur && !truly) {
      paletteHits.push({
        chapterId: rec.chapterId, chapterTitle: rec.chapterTitle,
        problemId: p.id, subId: sq.id, type: sq.type || '(none)',
        answer: String(sq.correctAnswer ?? '').slice(0, 30),
      });
    }
  }
}

// --- ロジックツリー（フローチャート）の解説も監査対象 ---
const treeHits = [];
function walkTree(name, node, path = []) {
  if (!node || typeof node !== 'object') return;
  if (typeof node.explanation === 'string' && node.explanation.trim()) {
    const hits = findPseudoTableBlocks(node.explanation);
    if (hits.length > 0) {
      treeHits.push({ tree: name, id: node.id, label: node.label, rows: hits.length, sample: hits[0].lines[0].slice(0, 60) });
    }
  }
  for (const c of node.children || []) walkTree(name, c, [...path, node.id]);
}
for (const [name, tree] of Object.entries(data.trees || {})) walkTree(name, tree);

// ------------------------------------------------------------------
// 出力
// ------------------------------------------------------------------
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ pseudoTableHits, treeHits, paletteHits, totalProblems: allProblems.length }, null, 2));
} else {
  console.log(`\n=== 監査サマリー（全 ${allProblems.length} 問） ===\n`);
  console.log(`【A】疑似テーブル（問題データ）: ${pseudoTableHits.length} 箇所`);
  for (const h of pseudoTableHits) console.log(`  - ${h.chapterId} / ${h.problem.id} / ${h.field} (${h.rows}表) : ${h.sample}`);
  console.log(`\n【A'】疑似テーブル（ロジックツリー解説）: ${treeHits.length} 箇所`);
  for (const h of treeHits) console.log(`  - ${h.tree} / ${h.id} 「${h.label}」(${h.rows}表) : ${h.sample}`);
  console.log(`\n【B】不要な化学記号パレット: ${paletteHits.length} 設問`);
  const byProblem = new Map();
  for (const h of paletteHits) {
    const k = `${h.chapterId} / ${h.problemId}`;
    if (!byProblem.has(k)) byProblem.set(k, []);
    byProblem.get(k).push(h);
  }
  for (const [k, list] of byProblem) {
    console.log(`  - ${k} : ${list.length}設問 (${list.map((x) => `${x.subId}[${x.type}]`).slice(0, 6).join(', ')}${list.length > 6 ? ' …' : ''})`);
  }
  console.log('');
}

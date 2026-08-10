import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chemistryData } from '../src/data/chemistryData.ts';
import { chemistryAdvancedData } from '../src/data/chemistryAdvancedData.ts';
import { mockExam } from '../src/data/mockExamData.ts';
import { formatText } from '../src/utils/textFormatter.tsx';

// 「STEP」はフローチャート／ロジックツリーを参照するときだけ使ってよい
const FLOW_REF = /(?:フローチャート|ロジックツリー)[^。\n<]{0,30}STEP\s*\d+/gi;

/**
 * 実描画したときに「本文がブラウザに飲み込まれていないか」を確認する。
 *
 * 冪等マーカー <!--fmt-v1--> の "-->" が化学式変換でイオンの電荷に化け、
 * コメントが閉じずに以降の解説がまるごと消える、という事故が実際に起きた。
 * 同種の再発を機械的に検出するため、描画後のHTMLについて
 *   ・HTMLコメントが必ず閉じていること
 *   ・コメントの外側に、解説末尾の文字が残っていること
 * を検査する。
 */
function checkRendered(text) {
  const s = typeof text === 'string' ? text : '';
  if (!s) return { commentClosed: true, bodyVisible: true };
  let html;
  try {
    html = renderToStaticMarkup(formatText(s));
  } catch {
    return { commentClosed: false, bodyVisible: false };
  }
  // コメントを取り除いた「実際に見える側」のHTML
  const visible = html.replace(/<!--[\s\S]*?-->/g, '');
  const commentClosed = !visible.includes('<!--');
  // 解説末尾の日本語を10文字ぶん取り出し、可視側に残っているかを見る
  const tail = (s.replace(/<[^>]*>/g, '').replace(/\s+/g, '').slice(-10)) || '';
  const visibleText = visible.replace(/<[^>]*>/g, '').replace(/\s+/g, '');
  const bodyVisible = tail === '' || visibleText.includes(tail);
  return { commentClosed, bodyVisible };
}

function check(text) {
  const s = typeof text === 'string' ? text : '';
  const stripped = s.replace(FLOW_REF, '');
  return {
    // 解答マーカー（ピンクの蛍光ペン）。文字全体の塗りつぶしをやめ、
    // 「文字の下だけに引くアンダーライン型」のグラデーションに変更した。
    hasAns: /linear-gradient\(to top,\s*rgba\(233,\s*104,\s*142/i.test(s),
    hasCircle: /[①②③④⑤]/.test(s),
    hasTrend: /ココが狙われる/.test(s),
    noYellow: !/<u>/i.test(s),
    stepOnlyFlow: !/STEP/i.test(stripped),
    ...checkRendered(s),
  };
}

function report(label, items) {
  let ok = 0;
  const ng = [];
  for (const [where, text] of items) {
    const r = check(text);
    if (Object.values(r).every(Boolean)) ok += 1;
    else ng.push([where, r]);
  }
  console.log(`${label}: 準拠 ${ok} / 非準拠 ${ng.length} （全 ${items.length}）`);
  ng.slice(0, 15).forEach(([w, r]) => console.log('  NG', w, JSON.stringify(r)));
}

const items = [];
let supplements = 0;
// 化学基礎＋化学発展。発展側の収録済み単元も同じフォーマット要件を満たす必要がある。
for (const part of [...chemistryData.parts, ...chemistryAdvancedData.parts]) {
  for (const c of part.chapters || []) {
    for (const p of [...(c.practiceProblems || []), ...(c.miniTest || [])]) {
      if (p.explanationSupplement) supplements += 1;
      items.push([`${c.id}/${p.id}`, p.explanationSupplement || p.explanation]);
    }
  }
}
report('章の問題', items);
console.log(`  （うちフローチャート補足つき: ${supplements}）`);

const mockItems = [];
for (const q of mockExam.questions || []) {
  const where = `mock/${q.bigQuestion}-${q.questionNumber}`;
  if (q.subQuestions?.length) {
    q.subQuestions.forEach((sq, i) => mockItems.push([`${where}/${sq.id ?? i}`, sq.detailedExplanation || sq.explanation]));
  } else {
    mockItems.push([where, q.explanation]);
  }
}
report('模試', mockItems);

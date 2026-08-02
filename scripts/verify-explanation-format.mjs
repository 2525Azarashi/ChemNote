import { chemistryData } from '../src/data/chemistryData.ts';
import { mockExam } from '../src/data/mockExamData.ts';

// 「STEP」はフローチャート／ロジックツリーを参照するときだけ使ってよい
const FLOW_REF = /(?:フローチャート|ロジックツリー)[^。\n<]{0,30}STEP\s*\d+/gi;

function check(text) {
  const s = typeof text === 'string' ? text : '';
  const stripped = s.replace(FLOW_REF, '');
  return {
    hasAns: /background-color:\s*#ffc0cb/i.test(s),
    hasCircle: /[①②③④⑤]/.test(s),
    hasTrend: /ココが狙われる/.test(s),
    noYellow: !/<u>/i.test(s),
    stepOnlyFlow: !/STEP/i.test(stripped),
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
for (const part of chemistryData.parts) {
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

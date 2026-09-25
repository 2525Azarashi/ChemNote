/**
 * スマホの4択演習（数学）の対象を書き出す。
 *   npx tsx scripts/math-choices/dump-targets.mts > .tmpwork/math-choice-targets.json
 * 手書きの対戦4択（authored/math.*.json）で正解が一致するものは、その誤答を使う（seed）。
 */
import { readFileSync, readdirSync } from 'node:fs';
import { mathData } from '../../src/data/mathData';

const norm = (s: string) => String(s).replace(/\s+/g, '').replace(/（/g, '(').replace(/）/g, ')');
const authored = new Map<string, { options: { text: string; correct?: boolean }[] }[]>();
for (const f of readdirSync('src/battle/data/authored').filter((f) => f.startsWith('math.'))) {
  const d = JSON.parse(readFileSync(`src/battle/data/authored/${f}`, 'utf8'));
  for (const q of d.questions ?? d) {
    const k = q.source.subQuestionId;
    if (!authored.has(k)) authored.set(k, []);
    authored.get(k)!.push(q);
  }
}
const strip = (s: unknown, n: number) => String(s ?? '').replace(/\$+/g, '').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
const out: unknown[] = [];
for (const part of mathData.parts) for (const ch of part.chapters) for (const pr of ch.practiceProblems) for (const s of pr.subQuestions || []) {
  if (s.type !== 'short_answer') continue;
  const accepted = [s.correctAnswer, ...(s.acceptedAnswers || [])].map(String);
  const acc = accepted.map(norm);
  let seed: string[] | null = null;
  for (const q of authored.get(s.id) || []) {
    const right = q.options.find((o) => o.correct);
    if (right && acc.includes(norm(right.text))) { seed = q.options.filter((o) => !o.correct).map((o) => o.text).slice(0, 3); break; }
  }
  out.push({
    id: s.id, chapterId: ch.id, label: String(s.label || ''), problem: strip(pr.text, 500),
    answer: String(s.correctAnswer), accepted, explanation: strip(pr.explanation, 300), seed,
  });
}
process.stdout.write(JSON.stringify(out));

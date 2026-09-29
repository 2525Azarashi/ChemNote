/**
 * 生成した誤答を、アプリの本物の採点関数（isAnswerCorrect）に通して、
 * 正解と判定されてしまう誤答を取り除く（採点が甘い表記ゆれ・別解を誤答に出さないため）。
 * 3つ残らなかった設問は4択にしない（スマホでも入力のまま）。
 *   npx tsx scripts/math-choices/filter-by-judge.mts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { mathData } from '../../src/data/mathData';
import { isAnswerCorrect } from '../../src/utils/answerJudge';

const PATH = 'src/data/mathChoices.generated.json';
const table = JSON.parse(readFileSync(PATH, 'utf8')) as Record<string, string[]>;
const byId = new Map<string, any>();
for (const ch of mathData.parts.flatMap((p) => p.chapters)) for (const pr of ch.practiceProblems) for (const s of pr.subQuestions || []) byId.set(s.id, s);
const out: Record<string, string[]> = {};
let dropped = 0, removed = 0;
for (const [id, wrong] of Object.entries(table)) {
  const s = byId.get(id);
  if (!s || !isAnswerCorrect(s, String(s.correctAnswer))) { dropped += 1; continue; }
  const keep = wrong.filter((w) => !isAnswerCorrect(s, w));
  removed += wrong.length - keep.length;
  if (keep.length === 3) out[id] = keep; else dropped += 1;
}
writeFileSync(PATH, JSON.stringify(out, Object.keys(out).sort(), 0).replace(/^\{/, '{'));
writeFileSync(PATH, JSON.stringify(Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]))));
console.log(JSON.stringify({ kept: Object.keys(out).length, dropped, removedWrong: removed }));

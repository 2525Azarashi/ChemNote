/**
 * ガチャの大当たり（学習プリントPDF）の素材を JSON に書き出す。
 * 素材は ★アプリに既にある検証済みデータだけ★（対戦プールの問題・正解・1行解説、出題傾向分析）。
 *   npx tsx scripts/gacha-prints/dump-data.mts > .tmpwork/prints-data.json
 */
import { writeFileSync } from 'node:fs';
import { loadPool, loadBattleAnswers } from '../../src/battle/data/battlePool';
import { chemistryBasicTrendDataset } from '../../src/data/trendData';
import { chemistryAdvancedTrendDataset } from '../../src/data/chemistryAdvancedTrendData';
import { getPartsOfSubject } from '../../src/data/allChapters';
import { mathTopicOfChapter, mathCourseOfChapter, MATH_COURSE_LABELS } from '../../src/data/mathNavigation';
import { EXTERNAL_SUBJECTS } from '../../src/data/externalSubjects';

const SUBJECTS = ['chemistry_basic', 'chemistry', 'math', 'biology_basic', 'english_grammar', 'geography', 'joho', 'rika', 'english_vocab'];
const out: any = { questions: {}, chapters: {}, trends: { chemistry_basic: chemistryBasicTrendDataset, chemistry: chemistryAdvancedTrendDataset } };
for (const s of SUBJECTS) {
  const pool = await loadPool(s);
  let answers: ReadonlyMap<string, string> = new Map();
  try { answers = await loadBattleAnswers(s); } catch {}
  out.questions[s] = pool
    .filter((q) => (q.format === 'choice4' || q.format === 'choice') && q.answerIndex >= 0 && !q.audioUrl)
    .map((q) => ({
      id: q.id, ch: q.chapterId, p: q.prompt, l: q.label, o: q.options, a: q.answerIndex,
      e: answers.get(q.id) ?? '', img: q.imageUrl ?? '',
      topic: s === 'math' ? mathTopicOfChapter(q.chapterId) : undefined,
      course: s === 'math' ? (mathCourseOfChapter(q.chapterId) ? MATH_COURSE_LABELS[mathCourseOfChapter(q.chapterId)!] : undefined) : undefined,
    }));
  const titles: Record<string, string> = {};
  try {
    for (const p of getPartsOfSubject(s) as any[]) for (const c of p.chapters) titles[c.id] = `${c.realTitle ?? ''}｜${c.abstractTitle ?? ''}`;
  } catch {}
  const ext = EXTERNAL_SUBJECTS.find((e) => e.id === s);
  if (ext) for (const c of ext.chapters) titles[c.id] = c.title;
  out.chapters[s] = titles;
}
writeFileSync(process.argv[2] ?? '.tmpwork/prints-data.json', JSON.stringify(out));
console.log(Object.fromEntries(Object.entries(out.questions).map(([k, v]: any) => [k, v.length])));

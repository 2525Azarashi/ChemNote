import { chemistryData } from './src/data/chemistryData.ts';

const part0 = chemistryData.parts[0];
console.log('Chapters in Part 0:');
part0.chapters.forEach((ch, idx) => {
  console.log(`\nChapter [${idx}] ID: ${ch.id} | abstractTitle: ${ch.abstractTitle}`);
  console.log(`  Practice Problems (${ch.practiceProblems ? ch.practiceProblems.length : 0}):`);
  if (ch.practiceProblems) {
    ch.practiceProblems.forEach((p, pIdx) => {
      console.log(`    [${pIdx}] ID: ${p.id} | category: ${p.category}`);
    });
  }
  console.log(`  Mini Test (${ch.miniTest ? ch.miniTest.length : 0}):`);
  if (ch.miniTest) {
    ch.miniTest.forEach((t, tIdx) => {
      console.log(`    [${tIdx}] ID: ${t.id} | category: ${t.category}`);
    });
  }
});

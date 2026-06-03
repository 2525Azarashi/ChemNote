import { chemistryData } from './src/data/chemistryData.ts';

console.log("Parts count:", chemistryData.parts.length);
chemistryData.parts.forEach(part => {
  console.log(`Part: ${part.id} - ${part.title}`);
  part.chapters.forEach(chap => {
    console.log(`  Chapter: ${chap.id} - ${chap.abstractTitle}`);
    const problems = chap.practiceProblems || [];
    console.log(`    Problems count: ${problems.length}`);
    problems.forEach(prob => {
      console.log(`      Problem ID: ${prob.id} - ${prob.category}`);
      if (prob.subQuestions) {
        console.log(`        Sub-questions: ${prob.subQuestions.length}`);
        prob.subQuestions.forEach(sq => {
          const detail = sq.detailedExplanation;
          if (detail) {
            console.log(`          SubQ ID: ${sq.id} (${sq.label}) - ${detail.theme} - Steps: ${detail.steps ? detail.steps.length : 0}`);
            if (detail.steps) {
              detail.steps.forEach((s, idx) => console.log(`            Step ${idx + 1}: ${s}`));
            }
          }
        });
      }
    });
  });
});

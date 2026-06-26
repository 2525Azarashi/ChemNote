import fs from 'fs';

let fileContent = fs.readFileSync('./temp_chemistryData.js', 'utf-8');
fileContent = fileContent.split('\n').filter(line => !line.includes('module.exports')).join('\n');

const cleanContent = fileContent.replace('const chemistryData =', 'global.chemistryData =');

try {
  eval(cleanContent);
} catch (e) {
  console.error('Eval failed:', e);
}

if (global.chemistryData) {
  global.chemistryData.parts.forEach((part, pIdx) => {
    part.chapters.forEach((ch, cIdx) => {
      if (ch.practiceProblems) {
        ch.practiceProblems.forEach((p, pIdx2) => {
          if (p.id.includes('c1_2')) {
            console.log(`Part ${pIdx}, Chapter ${cIdx} [${ch.id}] - PracticeProblem [${pIdx2}] ID: ${p.id}`);
          }
        });
      }
      if (ch.miniTest) {
        ch.miniTest.forEach((t, tIdx) => {
          if (t.id.includes('c1_2')) {
            console.log(`Part ${pIdx}, Chapter ${cIdx} [${ch.id}] - MiniTest [${tIdx}] ID: ${t.id}`);
          }
        });
      }
    });
  });
} else {
  console.log('Falsy');
}

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
  const ch1 = global.chemistryData.parts[0].chapters[1];
  console.log(`=== Chapter 1 [${ch1.id}] ===`);
  console.log('practiceProblems count:', ch1.practiceProblems ? ch1.practiceProblems.length : 0);
  console.log('miniTest count:', ch1.miniTest ? ch1.miniTest.length : 0);
  if (ch1.miniTest) {
    ch1.miniTest.forEach((t, i) => {
      console.log(`  MiniTest [${i}] ID: ${t.id} Category: ${t.category}`);
    });
  }
}

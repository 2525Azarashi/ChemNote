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
  console.log('Chapters in backup:');
  global.chemistryData.parts[0].chapters.forEach((ch, idx) => {
    console.log(`\nChapter [${idx}] ID: ${ch.id} | title: ${ch.abstractTitle}`);
    console.log(`  practiceProblems: ${ch.practiceProblems ? ch.practiceProblems.length : 0}`);
  });
} else {
  console.log('global.chemistryData is falsy');
}

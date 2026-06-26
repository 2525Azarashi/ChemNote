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
  console.log(`Chapter [1] ID: ${ch1.id} [${ch1.abstractTitle}]`);
  if (ch1.miniTest) {
    ch1.miniTest.forEach((t, idx) => {
      console.log(`\n===========================================`);
      console.log(`MiniTest [${idx}] ID: ${t.id} Category: ${t.category}`);
      console.log(`===========================================`);
      console.log('Text:', t.text);
      console.log('SubQuestions:', JSON.stringify(t.subQuestions, null, 2));
      console.log('Explanation:', t.explanation);
    });
  }
} else {
  console.log('Falsy');
}

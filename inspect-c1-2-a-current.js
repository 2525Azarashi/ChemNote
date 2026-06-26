import fs from 'fs';

const filePath = './src/data/chemistryData.ts';
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');

// Let's find index where id: "c1_2_A" is, and read until the next chapter.
let index = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id: "c1_2_A"')) {
    index = i;
    break;
  }
}

if (index !== -1) {
  // Read next 300 lines to find all practiceProblems and miniTests
  let subSection = lines.slice(index, index + 350).join('\n');
  console.log(subSection);
} else {
  console.log('Not found');
}

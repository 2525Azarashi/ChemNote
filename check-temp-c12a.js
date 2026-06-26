import fs from 'fs';

// temp_chemistryData.js is a CommonJS or ES module? Let's check or parse it.
// Since it's a JS file, we can write a node script that reads it, but let's just find the text containing c1_2_A.

const content = fs.readFileSync('./temp_chemistryData.js', 'utf-8');
const lines = content.split('\n');

let index = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id: "c1_2_A"')) {
    index = i;
    break;
  }
}

if (index !== -1) {
  console.log('Found c1_2_A in temp_chemistryData.js at line:', index + 1);
  console.log(lines.slice(index, index + 200).join('\n'));
} else {
  console.log('c1_2_A not found in temp_chemistryData.js');
}

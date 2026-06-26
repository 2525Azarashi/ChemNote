import fs from 'fs';

const content = fs.readFileSync('./temp_chemistryData.js', 'utf-8');
const lines = content.split('\n');

let index = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id: "c1_2_A"') || lines[i].includes('②-A 物質の分離と精製')) {
    index = i;
    break;
  }
}

if (index !== -1) {
  console.log('Found around c1_2_A in temp_chemistryData.js at line:', index + 1);
  console.log(lines.slice(Math.max(0, index - 5), index + 50).join('\n'));
} else {
  console.log('Not found');
}

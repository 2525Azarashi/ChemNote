import fs from 'fs';

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
  // Let's find where the next chapter (c1_2_B or c1_3) starts.
  let endIndex = -1;
  for (let i = index + 1; i < lines.length; i++) {
    if (lines[i].includes('id: "c1_2_B"') || lines[i].includes('id: "c1_3"')) {
      endIndex = i;
      break;
    }
  }
  if (endIndex === -1) endIndex = lines.length;
  console.log(`Lines from ${index + 1} to ${endIndex}:`);
  console.log(lines.slice(index - 2, endIndex).join('\n'));
} else {
  console.log('c1_2_A not found');
}

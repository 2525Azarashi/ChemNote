const fs = require('fs');

const data = fs.readFileSync('src/data/chemistryData.ts', 'utf8');

const regex = /explanation:\s*JSON\.stringify\(([\s\S]*?)\),\s*surroundingKnowledge:/g;

let match;
while ((match = regex.exec(data)) !== null) {
  console.log("Matched JSON string:", match[1]);
}

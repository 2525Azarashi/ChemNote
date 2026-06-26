import fs from 'fs';

const lines = fs.readFileSync('./src/data/chemistryData.ts', 'utf-8').split('\n');
console.log(lines.slice(580, 630).map((l, i) => `${581 + i}: ${l}`).join('\n'));

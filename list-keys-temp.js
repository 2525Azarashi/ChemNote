import fs from 'fs';

const content = fs.readFileSync('./temp_chemistryData.js', 'utf-8');
const regex = /q_c1_2_[AB]_\d+/g;
const matches = content.match(regex);
console.log('All c1_2 keys in temp_chemistryData.js:', [...new Set(matches)]);

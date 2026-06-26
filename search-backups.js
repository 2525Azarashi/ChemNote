import fs from 'fs';
import path from 'path';

const files = [
  'temp_chemistryData.js',
  'update_data.js',
  'update_data2.js',
  'update_data3.js',
  'update_data4.js',
  'update_data5.cjs',
  'update_data6.cjs',
  'update_data7.cjs',
  'update_data8.cjs',
  'update_data9.cjs',
  'update_data10.cjs'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = [];
    if (content.includes('q_c1_2_A_1')) matches.push('q_c1_2_A_1');
    if (content.includes('q_c1_2_A_2')) matches.push('q_c1_2_A_2');
    if (content.includes('q_c1_2_A_3')) matches.push('q_c1_2_A_3');
    if (content.includes('q_c1_2_A_4')) matches.push('q_c1_2_A_4');
    if (content.includes('q_c1_2_A_5')) matches.push('q_c1_2_A_5');
    if (content.includes('q_c1_2_A_6')) matches.push('q_c1_2_A_6');
    if (content.includes('q_c1_2_A_7')) matches.push('q_c1_2_A_7');
    console.log(`${file}: matches [${matches.join(', ')}]`);
  }
});

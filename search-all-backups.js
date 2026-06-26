import fs from 'fs';

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
    // Let's count how many times "q_c1_2_A_1" or "q_c1_2_A_2" etc appear
    const matches = [];
    for (let i = 1; i <= 7; i++) {
      if (content.includes(`q_c1_2_A_${i}`)) {
        matches.push(`q_c1_2_A_${i}`);
      }
    }
    for (let i = 1; i <= 7; i++) {
      if (content.includes(`q_c1_2_B_${i}`)) {
        matches.push(`q_c1_2_B_${i}`);
      }
    }
    if (matches.length > 0) {
      console.log(`${file}: contains ${matches.length} matches: ${matches.join(', ')}`);
    }
  }
});

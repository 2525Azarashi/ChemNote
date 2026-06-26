import fs from 'fs';

const files = [
  'update_data.js', 'update_data2.js', 'update_data3.js', 'update_data4.js',
  'update_data5.cjs', 'update_data6.cjs', 'update_data7.cjs', 'update_data8.cjs',
  'update_data9.cjs', 'update_data10.cjs'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf-8');
    if (content.includes('c1_2_A') || content.includes('c1_2_B') || content.includes('q_c1_2')) {
      console.log(`=== File: ${f} (size: ${content.length}) ===`);
      // print first 5 occurrences of c1_2
      const lines = content.split('\n');
      let count = 0;
      lines.forEach((line, idx) => {
        if ((line.includes('c1_2') || line.includes('q_c1_2')) && count < 5) {
          console.log(`  Line ${idx+1}: ${line.trim()}`);
          count++;
        }
      });
    }
  }
});

import fs from 'fs';

const files = [
  'update_data.js', 'update_data2.js', 'update_data3.js', 'update_data4.js',
  'update_data5.cjs', 'update_data6.cjs', 'update_data7.cjs', 'update_data8.cjs',
  'update_data9.cjs', 'update_data10.cjs', 'git_rescue.js', 'git_rescue.cjs'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf-8');
    if (content.includes('c1_2_A')) {
      console.log(`=== File: ${f} ===`);
      // Find how many practiceProblems or miniTests it lists, or search for "問"
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('category:') && (line.includes('問1') || line.includes('問2') || line.includes('問3') || line.includes('問4') || line.includes('問5') || line.includes('問6') || line.includes('問7') || line.includes('問8'))) {
          console.log(`  Line ${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
});

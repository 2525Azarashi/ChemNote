import fs from 'fs';

const files = [
  'update_data.js', 'update_data2.js', 'update_data4.js',
  'update_data5.cjs', 'update_data6.cjs', 'update_data7.cjs',
  'update_data8.cjs', 'update_data9.cjs', 'update_data10.cjs'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    console.log(`=== File: ${file} ===`);
    lines.forEach((line, idx) => {
      if (line.includes('ア') && line.includes('タ')) {
        console.log(`  Line ${idx + 1}: ${line.trim().substring(0, 150)}`);
      }
    });
  }
});

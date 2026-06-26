import fs from 'fs';

const files = ['dump_problems.js', 'git_rescue.js', 'git_rescue.cjs'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf-8');
    console.log(`=== File: ${f} (size: ${content.length}) ===`);
    if (content.includes('c1_2')) {
      console.log('Contains c1_2!');
      const lines = content.split('\n');
      lines.forEach((l, idx) => {
        if (l.includes('c1_2') || l.includes('分離と精製') || l.includes('蒸留')) {
          console.log(`  Line ${idx+1}: ${l.trim().substring(0, 120)}`);
        }
      });
    }
  }
});

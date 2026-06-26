import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('.').filter(f => f.endsWith('.js') || f.endsWith('.cjs') || f.endsWith('.ts'));

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(/q_c1_2_[AB]_\d+/g);
  if (matches) {
    const uniq = [...new Set(matches)];
    console.log(`${file}: found ${uniq.length} keys: ${uniq.join(', ')}`);
  }
});

import fs from 'fs';

const files = ['summary.txt', 'breakpoints.txt', 'ids.txt'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    console.log(`=== ${f} ===`);
    console.log(fs.readFileSync(f, 'utf-8'));
  }
});

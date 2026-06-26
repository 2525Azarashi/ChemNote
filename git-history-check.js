import { execSync } from 'child_process';
import fs from 'fs';

try {
  // Let's see the recent commits that modified src/data/chemistryData.ts
  console.log('--- Git Log for chemistryData.ts ---');
  const log = execSync('git log -n 10 --oneline -- src/data/chemistryData.ts', { encoding: 'utf-8' });
  console.log(log);

  // Let's search the git log for deleted content of chemistryData.ts
  console.log('--- Searching for deleted lines in history ---');
  const search = execSync('git log -S "q_c1_2_A_1" --oneline', { encoding: 'utf-8' });
  console.log(search);
} catch (e) {
  console.error('Error running git:', e.message);
}

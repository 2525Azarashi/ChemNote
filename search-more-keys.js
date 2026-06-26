import fs from 'fs';
import path from 'path';

function searchInFiles(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
        searchInFiles(file);
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.json') || file.endsWith('.cjs')) {
        const content = fs.readFileSync(file, 'utf-8');
        const matches = [];
        ['q_c1_2_A_5', 'q_c1_2_A_6', 'q_c1_2_A_7', 'q_c1_2_B_6', 'q_c1_2_B_7'].forEach(key => {
          if (content.includes(key)) {
            matches.push(key);
          }
        });
        if (matches.length > 0) {
          console.log(`- ${file} contains: ${matches.join(', ')}`);
        }
      }
    }
  });
}

searchInFiles('.');

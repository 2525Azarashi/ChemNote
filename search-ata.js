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
        if (content.includes('ア') && content.includes('タ')) {
          console.log(`- ${file} matches "ア" and "タ"`);
        }
      }
    }
  });
}

searchInFiles('.');

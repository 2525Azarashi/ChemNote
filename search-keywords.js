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
      if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.json')) {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.includes('砂の混ざった水') || content.includes('空欄（ア）〜（タ）') || content.includes('KNO3') || content.includes('蒸留装置') || content.includes('ア）〜（タ）')) {
          console.log(`- ${file}: contains keyword!`);
          const lines = content.split('\n');
          lines.forEach((line, idx) => {
            if (line.includes('砂の混ざった水') || line.includes('空欄（ア）〜（タ）') || line.includes('KNO3') || line.includes('蒸留装置') || line.includes('ア）〜（タ）')) {
              console.log(`  Line ${idx + 1}: ${line.trim().substring(0, 100)}`);
            }
          });
        }
      }
    }
  });
}

searchInFiles('.');

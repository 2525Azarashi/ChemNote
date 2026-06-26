import fs from 'fs';

const filePath = './temp_chemistryData.js';
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log('File size:', content.length);
  const lines = content.split('\n');
  console.log('Number of lines:', lines.length);
  // Let's print the first 100 lines and see what is in it
  console.log('First 50 lines:\n', lines.slice(0, 50).join('\n'));
} else {
  console.log('Does not exist');
}

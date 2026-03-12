import fs from 'fs';
const buffer = fs.readFileSync('./public/cobblestone_dreams.mp3');
console.log('Size:', buffer.length);
console.log('First 100 bytes:', buffer.slice(0, 100).toString('hex'));

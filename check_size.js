const fs = require('fs');
const stats = fs.statSync('src/assets/click.mp3');
console.log(stats.size);

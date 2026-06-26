import fs from 'fs';

['public/graph.jpg', 'public/graph2.jpg', 'public/manatob_bg.png'].forEach(file => {
  if (fs.existsSync(file)) {
    const stat = fs.statSync(file);
    console.log(`${file}: ${stat.size} bytes`);
  } else {
    console.log(`${file} does not exist`);
  }
});

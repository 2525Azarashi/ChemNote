const https = require('https');
const fs = require('fs');

const fileId = '1nX3qhDbKCPdDKGTcUqnvRTATzgSR4WxT';
const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

https.get(url, (res) => {
  if (res.statusCode === 302 || res.statusCode === 303) {
    https.get(res.headers.location, (res2) => {
      const file = fs.createWriteStream('public/click.mp3');
      res2.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download complete');
      });
    });
  } else {
    const file = fs.createWriteStream('public/click.mp3');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Download complete');
    });
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});

import fs from 'fs';
import https from 'https';

const url = 'https://docs.google.com/uc?export=download&id=1nX3qhDbKCPdDKGTcUqnvRTATzgSR4WxT';
const dest = 'public/click.mp3';

https.get(url, (res) => {
  if (res.statusCode === 302 || res.statusCode === 303) {
    https.get(res.headers.location, (res2) => {
      const file = fs.createWriteStream(dest);
      res2.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded');
      });
    });
  } else {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded');
    });
  }
});

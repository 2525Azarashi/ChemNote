import fs from 'fs';

async function download() {
  try {
    console.log('Downloading...');
    const res = await fetch('https://drive.google.com/uc?export=download&id=1RuT6Vn3YYSccdkFwzDkMuusymfiLGQ7G');
    const buffer = await res.arrayBuffer();
    
    // Check if it's HTML (error/warning page)
    const text = Buffer.from(buffer).toString('utf8', 0, 500);
    if (text.includes('<!DOCTYPE html>')) {
      console.log('Received HTML instead of audio. Trying to extract confirm token...');
      // It's a warning page, we need to extract the confirm token
      const fullText = Buffer.from(buffer).toString('utf8');
      const match = fullText.match(/confirm=([a-zA-Z0-9_-]+)/);
      if (match) {
        const confirmToken = match[1];
        console.log('Found token:', confirmToken);
        
        // Need to pass the cookie from the first response
        const cookies = res.headers.get('set-cookie');
        
        const res2 = await fetch(`https://drive.google.com/uc?export=download&id=1RuT6Vn3YYSccdkFwzDkMuusymfiLGQ7G&confirm=${confirmToken}`, {
          headers: {
            'Cookie': cookies || ''
          }
        });
        const buffer2 = await res2.arrayBuffer();
        fs.writeFileSync('public/bgm.mp3', Buffer.from(buffer2));
        console.log('Downloaded with token. Size:', buffer2.byteLength);
      } else {
        console.log('No confirm token found. Saving as is (might be broken).');
        fs.writeFileSync('public/bgm.mp3', Buffer.from(buffer));
      }
    } else {
      fs.writeFileSync('public/bgm.mp3', Buffer.from(buffer));
      console.log('Downloaded directly. Size:', buffer.byteLength);
    }
  } catch (e) {
    console.error(e);
  }
}

download();

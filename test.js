fetch('http://localhost:3000/cobblestone_dreams.mp3').then(r => console.log(r.status, r.headers.get('content-type'))).catch(console.error)

const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 4321;

http.createServer((req, res) => {
  const file = path.join(__dirname, 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
}).listen(port, () => console.log('Listening on ' + port));

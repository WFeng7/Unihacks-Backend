var http = require('http');
var fs = require('fs');
var path = require('path');

const handlers = Object.create(null);
function getHandlersRec(p, h) {
  fs.readdirSync(p, { withFileTypes: true }).forEach(v => {
    let name = path.basename(v.name, path.extname(v.name));
    let _p = path.join(p, name);
    if (v.isDirectory()) {
      h[name] = Object.create(null);
      getHandlersRec(_p, h[name]);
    } else h[name] = require(_p);
  });
}
getHandlersRec(path.resolve('./handlers'), handlers);
console.log(handlers);

const server = http.createServer();
server.listen(80, () => {
  console.log('server is open');
});

server.on('request', (req, res) => {
  const url = req.url.split('/').filter(v => v);
  // res.writeHead(200, { 'Content-Type': 'text/plain' });
  // res.write(`"${JSON.stringify(url)}"`);
  // res.end();
  let h = handlers;
  let hand = h['404'];
  while (url.length) {
    let base = url[0];
    if (base in h) {
      h = h[url.shift()];
      if (typeof h === 'function') {
        hand = h;
        break;
      }
    } else break;
  }
  try {
    hand(req, res, url);
  } catch (err) {
    console.log('error', err);
    if (res.writableEnded) return;
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Error: ${err}`);
  }
});
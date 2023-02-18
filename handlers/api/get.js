module.exports = function(req, res, url) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(`test get.`);
  res.end();
};
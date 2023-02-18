module.exports = function(req, res, url) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.write(`The path "${req.url}" was not found.`);
  res.end();
};
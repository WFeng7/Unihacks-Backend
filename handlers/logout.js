var http = require('http');
var auth = require('./_auth');

/**
 * @param {http.IncomingRequest} req
 * @param {http.ServerResponse} res
 * @param {string[]} url
 * @returns {undefined}
 */
module.exports = function(req, res, url) {
  let header = req.headers.authorization;
  if (!header.startsWith('Bearer ')) throw 'invalid header';
  header = header.slice(7);
  let token = auth.deleteToken(user);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(token);
};

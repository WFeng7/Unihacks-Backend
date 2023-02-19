var http = require('http');
var token = require('./_token');

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
  let userToken = token.deleteToken(user);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(userToken);
};

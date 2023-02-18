var http = require('http');
var auth = require('./_auth');

/**
 * @param {http.IncomingRequest} req
 * @param {http.ServerResponse} res
 * @param {string[]} url
 * @returns {undefined}
 */
module.exports = async function (req, res, url) {
  let user = auth.auth(req, res);
  if (!user) return;
  let token = auth.createToken(user);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(token);
};
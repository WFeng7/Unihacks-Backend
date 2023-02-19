var http = require('http');
var util = require('./_util');

/**
 * @param {http.IncomingRequest} req
 * @param {http.ServerResponse} res
 * @param {string[]} url
 * @returns {undefined}
 */
module.exports = async function(req, res, url) {
  let header = req.headers.authorization;
  if (!header.startsWith('Basic ')) throw 'invalid header';
  header = header.slice(6);
  header = Buffer.from(header, 'base64').toString().split(':');
  let username = header.shift();
  let pass = header.join(':');
  let data = await util.finishStream(req);
  util.create({ username, password: pass, data, type: 2 });
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end();
};

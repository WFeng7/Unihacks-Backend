var http = require('http');

/**
 * @param {http.IncomingRequest} req
 * @param {http.ServerResponse} res
 * @param {string[]} url
 * @returns {undefined}
 */module.exports = function(req, res, url) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(`test get.`);
  res.end();
};
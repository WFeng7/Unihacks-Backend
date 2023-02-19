var http = require('http');
var util = require('../_util');

/**
 * @param {http.IncomingRequest} req
 * @param {http.ServerResponse} res
 * @param {string[]} url
 * @returns {undefined}
 */
module.exports = async function(req, res, url) {
  let data = (await util.finishStream(req)).toString();
  let { id } = util.create({ username: '', password: '', data, type: 2 });
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(id);
  res.end();
};

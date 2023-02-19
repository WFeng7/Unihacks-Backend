var http = require('http');
var util = require('../_util');
var token = require('../_token');

/**
 * @param {http.IncomingRequest} req
 * @param {http.ServerResponse} res
 * @param {string[]} url
 * @returns {undefined}
 */
module.exports = async function(req, res, url) {
  if (url[2] && +url[2] !== 2) {
    let user = token.authHeader(req);
    if (!user || user.type < 2) throw 'invalid permissions';
  }
  let data = (await util.finishStream(req)).toString();
  let { id } = util.create({ username: url[0] || '', password: url[1] || '', data, type: +url[2] || 2, isDeleted: false });
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(id);
  res.end();
};

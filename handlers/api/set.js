var http = require('http');
var auth = require('../_auth');
var util = require('../_util');

/**
 * @param {http.IncomingRequest} req
 * @param {http.ServerResponse} res
 * @param {string[]} url
 * @returns {undefined}
 */ module.exports = async function(req, res, url) {
  let user = auth.auth(req, res);
  if (!user) throw 'user does not exist';

  let data = await util.finishStream(req);
  data = JSON.parse(data);
  let id = url[0] || user.id;
  if (id !== user.id && user.type > 1) throw 'invalid permissions';

  user = util.get(id);
  user.data = data;
  util.update(id, user);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end();
};

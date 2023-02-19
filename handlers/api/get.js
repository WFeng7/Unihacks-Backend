var http = require('http');
var token = require('../_token');
var util = require('../_util');

/**
 * @param {http.IncomingRequest} req
 * @param {http.ServerResponse} res
 * @param {string[]} url
 * @returns {undefined}
 */ module.exports = function(req, res, url) {
  let user = token.authHeader(req, res);
  if (!user) throw 'user does not exist';

  let id = url[0] || user.id;
  if (id !== user.id && user.type > 1) throw 'invalid permissions';

  user = util.get(id);
  if (!user) throw 'user not found';
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(
    JSON.stringify(user, (k, v) =>
      k === 'username' || k === 'password' ? void 0 : v
    )
  );
  res.end();
};

var http = require('http');
var util = require('./_util');
var cache = require('./_cache');

var tokens = cache(7 * 24 * 60 * 60 * 1000, 128);
module.exports = {
  /**
   * @description checks authorization header
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @returns {?import('./_util').User} the authorized user, if it succeeded
   */
  auth(req, res) {
    let header = req.headers.authorization;
    if (!header) return void this.challenge(req, res);
    if (header.startsWith('Bearer ')) {
      header = header.slice(7);
      if (!tokens.has(header)) return void this.challenge(req, res);
      return tokens.get(header).user;
    }
    if (!header.startsWith('Basic ')) return void this.challenge(req, res);
    header = header.slice(6);
    header = Buffer.from(header, 'base64').toString().split(':');
    let username = header.shift();
    let pass = header.join(':');
    let user = util.getUser(username);
    if (!user || user.password !== pass) return void this.challenge(req, res);
    return user;
  },
  /**
   * @private
   * @description sends www-authenticate
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @returns {undefined}
   */
  challenge(req, res) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="everything", charset="UTF-8"',
    });
    res.end();
  },
  /**
   * @param {import('./_util').User} user
   * @returns {string} token
   */
  createToken(user) {
    let token = tokens.create();
    token.user = user;
    return token.uuid;
  },
  /**
   * @param {string} token
   * @returns {undefined}
   */
  deleteToken(token) {
    tokens.delete(token);
  },
};

var util = require('./_util');
var http = require('http');
var cache = require('./_cache');

var tokens = cache(7 * 24 * 60 * 60 * 1000, 128, 60_000);
module.exports = {
  /**
   * @description asserts authoization header is valid
   * @param {http.IncomingMessage} req
   * @returns {?util.User} the authorized user, if it succeeded
   */
  authHeader(req) {
    let head = req.headers.authorization;
    if (!head.startsWith('Bearer ')) throw 'Malformed authorization header';
    return this.authToken(head.slice(7));
  },
  /**
   * @description asserts token is valid
   * @param {string} token
   * @returns {?util.User} the authorized user, if it succeeded
   */
  authToken(token) {
    if (!tokens.has(token)) return void 0;
    return tokens.get(header).user;
  },
  /**
   * @param {util.User} user
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
  }
};

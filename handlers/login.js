var http = require('http');
var token = require('./_token');
var util = require('./_util');
var crypto = require('crypto');

/**
 * @description sends www-authenticate
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @returns {undefined}
 */
function challenge(req, res, msg) {
  res.setHeader('WWW-Authenticate',
    [
      'Basic realm="everything", charset="UTF-8"'
    ]);
  res.writeHead(401);
  if (msg) res.write(msg);
  res.end();
};

/**
 * @param {string} b64
 * @returns {string} decoded base64
 */
function decodeBase64(b64) {
  return Buffer.from(b64, 'base64').toString();
}
/**
 * @param {string} str
 * @returns {string} encoded base64
 */
function encodeBase64(str) {
  return Buffer.from(str).toString('base64');
}
/**
 *
 * @param {string} str
 * @param {string} c
 * @returns {string[]} str split along the first c
 */
function splitFirst(str, c) {
  let i = str.indexOf(c);
  let a = str.slice(0, i);
  let b = str.slice(i + 1);
  return [a, b];
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {string[]} url
 * @returns {undefined}
 */
module.exports = function(req, res, url) {
  let authHead = req.headers.authorization;
  if (!authHead) return challenge(req, res);
  let authType;
  ([authType, authHead] = splitFirst(authHead, ' '));
  if (authType === 'Bearer') {
    if (!token.authToken(authHead)) return challenge(req, res, 'invalid token');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end();
    return;
  }
  if (authType === 'Basic') {
    authHead = decodeBase64(authHead);
    let [username, pass] = splitFirst(authHead, ':');
    let user = util.getUser(username);
    if (!user || user.password !== pass) {
      res.writeHead(401, { 'Content-Type': 'text/plain' });
      res.write('username/password is incorrect');
      res.end();
      return;
    }
    let userToken = token.createToken(user);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(userToken);
    res.end();
    return;
  }
  challenge(req, res, 'unknown challenge protocol');
};
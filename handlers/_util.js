/**
 * @typedef {Object} User
 * @property {(0|1|2)} type access level
 * - 0: admin
 * - 1: mod
 * - 2: user
 * @property {string} id uuid
 * @property {string} username
 * @property {string} password cleartext
 * @property {string} data other data'
 */
var fs = require('fs');
var path = require('path');
var { randomUUID } = require('crypto');

const userPath = path.join(__dirname, './_users.json');
if (!fs.existsSync(userPath)) fs.writeFileSync(userPath, '[]');
/** @type {User[]} */
var users = JSON.parse(fs.readFileSync(userPath));
setInterval(() => {
  if (isFileUpdated) return;
  fs.writeFile(userPath, JSON.stringify(users), err => err && console.log('Error saving file', err));
  isFileUpdated = true;
}, 1_000);
var isFileUpdated = true;
var idDict = {};
var ignDict = {};
users.forEach((v, i) => {
  idDict[v.id] = i;
  ignDict[v.username] = i;
});
module.exports = {
  /**
   * @param {string} id
   * @returns {User}
   */
  get(id) {
    return users[idDict[id]];
  },
  /**
   * @param {string} username
   * @returns {User}
   */
  getUser(username) {
    return users[ignDict[username]];
  },
  /**
   * @returns {User[]}
   */
  getAll() {
    return users;
  },
  /**
   * @param {User} user
   * @returns {User} created user
   */
  create(user) {
    user.id = randomUUID();
    idDict[user.id] = ignDict[user.username] = users.push(user) - 1;
    isFileUpdated = false;
    return user;
  },
  /**
   * @param {string} id
   * @param {User} user
   * @returns {User} updated user
   */
  update(id, user) {
    if (!(id in idDict)) return this.create(user);
    let i = idDict[id];
    users[i] = user;
    isFileUpdated = false;
    return user;
  },
  /**
   * @param {string} id
   * @returns {boolean} success
   */
  delete(id) {
    if (!(id in idDict)) return false;
    let i = idDict[id];
    delete idDict[id];
    delete ignDict[users[i].username];
    idDict.forEach((v, _) => v > i && idDict[_]--);
    users.splice(i, 1);
    isFileUpdated = false;
    return true;
  },
  /**
   * @param {ReadableStream} stream
   * @returns {Promise<Buffer>}
   */
  finishStream(stream) {
    return new Promise((res) => {
      let data = [];
      stream.on('data', (c) => data.push(c));
      stream.on('end', () => {
        res(Buffer.concat(data));
      });
    });
  }
};

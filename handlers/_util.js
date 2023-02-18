/**
 * @typedef {Object} User
 * @property {string} id - uuid
 * @property {string} username
 * @property {string} pass - cleartext
 */
var fs = require('fs');
var { randomUUID } = require('crypto');

if (!fs.existsSync('./_users.json')) fs.writeFileSync('./_users.json', '[]');
var users = JSON.parse(fs.readFileSync('./_users.json'));
var isFileUpdated = true;
var idDict = {}
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
   * @returns {undefined}
   */
  create(user) {
    user.id = randomUUID;
    idDict[user.id] = ignDict[user.username] = users.push(user) - 1;
  },
  /**
   * @param {string} id
   * @param {User} user
   * @returns {undefined}
   */
  update(id, user) {
    if (!(id in idDict)) return this.create(user);
    let i = idDict[id];
    users[i] = user;
  },
  /**
   * @param {ReadableStream} stream
   * @returns {Promise<Buffer>}
   */
  finishStream(stream) {
    return new Promise(res => {
      let data = [];
      stream.on('data', c => data.push(c));
      stream.on('end', () => {
        res(Buffer.concat(data));
      });
    });
  }
};
setInterval(() => {
  if (isFileUpdated) return;
  fs.writeFile('./_users.json', JSON.stringify(users));
}, 60_000);
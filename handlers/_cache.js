var crypto = require('crypto');

const UUID_LENGTH = 64;
const CACHE_LENGTH = 60 * 60 * 1000;
var createCache = function(cacheLen, uuidLen) {
  if (cacheLen === null || cacheLen === undefined) cacheLen = CACHE_LENGTH;
  if (uuidLen === null || uuidLen === undefined) uuidLen = UUID_LENGTH;

  let cached = new Map();
  let getUUID = function() {
    let uuid;
    let loops = 0;
    do {
      uuid = crypto.randomBytes(uuidLen).toString('hex');
      loops++;
      if (loops > 5) {
        console.log('wtf');
        uuid = crypto.randomBytes(uuidLen);
        do {
          increment:
          for (let i = 0; i < uuid.length; i++) {
            if (uuid[i]++ !== 255) break increment;
          }
        } while (cached.has(uuid.toString('hex')));
        uuid = uuid.toString();
      }
    } while (cached.has(uuid));
    return uuid;
  };
  return {
    has: function(uuid) {
      return cached.has(uuid);
    },
    get: function(uuid) {
      let c = cached.get(uuid);
      if (!c) return;
      // c.expirationTime = Date.now() + cacheLen;
      return c;
    },
    delete: function(uuid) {
      if (!cached.has(uuid)) return;
      let c = cached.get(uuid);
      c.onExpire(c);
      cached.delete(uuid);
    },
    create: function() {
      let item = Object.create(null);

      let uuid = getUUID();
      item.uuid = uuid;
      item.creationTime = Date.now();
      item.expirationTime = item.creationTime + cacheLen;
      item.onExpire = Function.prototype;

      cached.set(uuid, item);
      return item;
    },
    entries: function() {
      return cached.entries();
    },
    updateTimer: setInterval(() => {
      let t = Date.now();
      for (let [uuid, c] of cached.entries()) {
        if (t > c.expirationTime) {
          c.onExpire(c);
          cached.delete(uuid);
        }
      }
    }, 60_000).unref()
  };
};

module.exports = createCache;
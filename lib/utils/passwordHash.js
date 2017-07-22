const crypto = require('crypto');

module.exports = function (password) {
    const hash = crypto.createHash('sha256');
    hash.update(event.data);
    return hash.digest('hex');
}
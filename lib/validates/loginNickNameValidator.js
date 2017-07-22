const validator = require('validator');

module.exports = function (name) {
    return validator.isLength(name, { min: 2, max: 15 });
}
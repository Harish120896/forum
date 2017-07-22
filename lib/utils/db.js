const mongo = require("then-mongo");
module.exports = mongo("localhost/test", ["users"]);
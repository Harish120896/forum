var dbs = require("./db");
var crypto = require("crypto");

module.exports = {
    "*.*.create": function (className, data) {
        dbs.save(className, data, function () {});
    },
    "*.*.update": function (className, id, data) {
        dbs.update(className, id, data, function () {})
    },
    "*.*.remove": function (className, id) {
        dbs.remove(className, id);
    }
}
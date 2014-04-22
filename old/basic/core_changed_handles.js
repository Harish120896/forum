var dbs = require("./db");
var crypto = require("crypto");

module.exports = {
    "*.*.create": function (className, data) {
        if(className === "User"){
            data.logo = crypto.createHash('md5').update(data.email).digest("hex");
        }
        dbs.save(className, data, function () {});
    },
    "*.*.update": function (className, id, data) {
        dbs.update(className, id, data, function () {})
    },
    "*.*.remove": function (className, id) {
        dbs.remove(className, id);
    }
}
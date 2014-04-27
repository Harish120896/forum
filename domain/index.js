var domain = require("jsdm")();
var query = require("../application/query");
var crypto = require("crypto");
var dbs = require("../application/dbs");

domain.register(

    "get", require("../application/dbs").get,

    "AggreClass",
    require("./User"),
    require("./Column"),
    require("./Topic"),
    require("./Reply"),
    require("./Message"),
    require("./Info"),
    "repository", require("./repos"),
    "listener", require("./eventHandles"),
    "service", require("./services"),
    function (my) {
        function getQuery() {
            return query;
        }

        getQuery.serviceName = "getQuery";
        return getQuery;
    }

).openMethod(

        "User.follow",
        "User.unfollow",
        "User.updateInfo",

        "Column.updateInfo",
        "Column.top",
        "Column.setManager",

        "Topic.updateInfo",
        "Topic.removeReply",
        "Topic.top",
        "Topic.untop",
        "Topic.fine",
        "Topic.unfine",
        "Topic.access"
    ).seal()


domain.on("*.*.create", function (className, data) {
    if (className === "User") {
        data.logo = crypto.createHash('md5').update(data.email).digest("hex");
    }
    dbs.save(className, data, function () {
    });
});

domain.on("*.*.update", function (className, id, data) {
    dbs.update(className, id, data, function () {
    })
});

domain.on("*.*.remove", function (className, id) {
    dbs.remove(className, id);
});

module.exports = domain;

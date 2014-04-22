var domain = require("jsdm")();
var identity = require("identity");
var query = require("./query");
var dbs = require("./db");
var crypto = require("crypto");

domain.register(

    "get",require("./db").get,

    "AggreClass",
    require("../../domain/User"),
    require("../../domain/Column"),
    require("../../domain/Topic"),
    require("../../domain/Reply"),
    require("../../domain/Message"),
    require("../../domain/Info"),

    "domain", {userDomain: identity.domain},

    "repository", require("../../domain/repos"),

    "service",
    require("../../domain/services"),
    function(my){

        function getQuery(){
            return query;
        }

        getQuery.serviceName = "getQuery";
        return getQuery;

    },

    "listener", require("../../domain/eventHandles")
//
//        "commandHandle", require("./../old/core/commandHandles"),
//        "service", require("./../old/core/services")

).openMethod(

        "User.follow",
        "User.unfollow",
        "User.updateInfo",

        "Column.updateInfo",
        "Column.setManager"
//
//        "Topic.updateInfo",
//        "Topic.removeReply",
//        "Topic.toseal",
//        "Topic.unseal",
//        "Topic.access",
//
//        "Photo.addImage",
//        "Photo.delImage"
    ).seal()


domain.on("*.*.create",function (className, data) {
    if(className === "User"){
        data.logo = crypto.createHash('md5').update(data.email).digest("hex");
    }
    dbs.save(className, data, function () {});
});

domain.on("*.*.update" , function (className, id, data) {
    dbs.update(className, id, data, function () {})
});

domain.on("*.*.remove", function (className, id) {
    dbs.remove(className, id);
});

module.exports = domain;

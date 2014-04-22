var domain = require("jsdm")();
var identity = require("identity");

domain.register(

    "AggreClass",
    require("./User"),
    require("./Column"),
    require("./Topic"),
    require("./Reply"),
    require("./Message"),
    require(".//Info"),
    "domain", {userDomain: identity.domain},
    "repository", require("./repos")

//        "listener", require("./../old/core/eventHandles"),
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


module.exports = domain;

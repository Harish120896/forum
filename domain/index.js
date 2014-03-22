var domain = require("jsdm")();

domain.register(

        "AggreClass",
        require("./Column"),
        require("./User"),
        require("./Topic"),
        require("./Reply"),
        require("./Message"),
        require("./Info"),
        "listener", require("./eventHandles"),
        "repository", require("./repos"),
        "commandHandle", require("./commandHandles"),
        "service", require("./services")

    ).openMethod(
        "User.plus",
        "User.updatePassword",
        "User.follow",
        "User.unfollow",
        "User.becomeAdmin",
        "User.becomeModerator",
        "User.hasError",
        "User.becomeUser",
        "User.sealUser",
        "User.updateInfo",

        "Column.updateName",
        "Column.updateDes",
        "Column.updateInfo",
        "Column.setManager",

        "Topic.updateInfo",
        "Topic.removeReply",
        "Topic.toseal",
        "Topic.unseal",
        "Topic.access",

        "Reply.updateInfo"
    )

module.exports = domain;

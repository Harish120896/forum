var domain = require("jsdm")();

domain.register(
	"get":require("../app/db"),
    "AggreClass", 
	require("./Column"), 
	require("./User"),
    require("./Topic"), 
	require("./Reply"),
	require("./Message"),
    "listener", require("./eventHandles"),require("../app/eventHandles"),
    "repository", require("./repos"),
    "commandHandle", require("./commandHandles"),
    "service", require("./services")(require("../app/query"))
).openMethod(
	"User.plus",
	"User.updatePassword",
	"User.follow",
	"User.unfollow",
	"User.becomeAdmin",
	"User.becomeModerator",
	"User.hasError",
	"User.becomeUser",
	"User.updateInfo",
	"User.updateNickname",
	
	"Column.updateName",
	"Column.updateDes",
	
	"Topic.updateInfo"
).seal();

module.exports = domain;
var domain = require("jsdm")();

domain.register(
	// "get",require("../infrastructure/db").get,
    "AggreClass", 
	require("./Column"), 
	require("./User"),
    require("./Topic"), 
	require("./Reply"),
	require("./Message"),
    "listener", require("./eventHandles"),
    "repository", require("./repos"),
    "commandHandle", require("./commandHandles")
    // "service", require("./services")(require("../infrastructure/query"))
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
	"User.updateNickname",
	
	"Column.updateName",
	"Column.updateDes",
	"Column.updateInfo",
	
	"Topic.updateInfo",
	"Topic.removeReply",
	"Topic.toseal",
	"Topic.unseal",
	"Topic.access",
	
	"Reply.updateInfo"
);

module.exports = domain;
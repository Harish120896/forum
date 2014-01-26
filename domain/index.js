var domain = require("jsdm")();

domain.register(
    "AggreClass", 
	require("./Column"), 
	require("./User"),
    require("./Topic"), 
	require("./Reply"),
	require("./Message"),
    "get", function () {
    },
    "listener", require("./eventHandles"),require("../app/eventHandles"),
    "repository", require("./repos"),
    "commandHandle", require("./commandHandles"),
    "service", require("./services")(require("../app/query"))
).openMethod(
	"User.plus",
	"User.attr",
	"User.updatePassword"
)
module.exports = domain;
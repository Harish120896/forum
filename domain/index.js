var domain = require("jsdm")();

domain.register(
    "AggreClass", 
	require("./Column"), 
	require("./User"),
    require("./Topic"), 
	require("./Reply"),
    "get", function () {
    },
    // "listener", require("./eventHandles"),
    "repository", require("./repos"),
    "commandHandle", require("./commandHandles"),
    "service", require("./services")
).openMethod(
	"User.plus",
	"User.attr",
	"User.updatePassword"
)
module.exports = domain;
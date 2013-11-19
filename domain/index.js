var domain = require("jsdm")();

domain.register(
    "AggreClass", require("./Column"), require("./Post"),
    "listener", require("./eventHandles"),
    "repository", require("./repos"),
    "commandHandle", require("./commandHandles"),
    "service",require("./services")
)//.closeMethod()

module.exports = domain;

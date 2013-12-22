var domain = require("jsdm")();

domain.register(
    "AggreClass", require("./Column"), require("./User")
    , require("./Topic"), require("./Reply"),
    "get", function () {
    },
    // "listener", require("./eventHandles"),
    "repository", require("./repos"),
    "commandHandle", require("./commandHandles"),
    "service", require("./services")
)//.closeMethod()
module.exports = domain;
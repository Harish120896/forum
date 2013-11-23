var domain = require("jsdm")();

domain.register(
    "AggreClass", require("./Column"),require("./User")
        , //require("./Post"),
   // "listener", require("./eventHandles"),
  //  "repository", require("./repos"),
  //  "commandHandle", require("./commandHandles"),
    "service",require("./services")
)//.closeMethod()
    .seal();

module.exports = domain;

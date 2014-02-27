var domain = require("../domain");
domain.register(
	"get",require("./db").get,
    "listener", require("./eventHandles"),
	"service", require("../domain/services")(require("./query"))
).seal();
module.exports = domain;
var domain = require("../../domain");

domain.register(
	"get",require("./dbrepo").db2.get,
    "listener", require("./eventHandles"),
	"service", require("../../domain/services")(require("./query"))
).seal();

module.exports = domain;
var validator = require("../validator"),
	columnCtrl = require("../controller/column"),
	data = require("../data"),
	util = require("../util");

module.exports = function wrap(app){
	// column controller
	app.post("/column/create",
		validator.isLogin,
		validator.isAdmin,
		columnCtrl.create,
		util.end);

	app.post("/column/:id/update",
		validator.isLogin,
		validator.isAdmin,
		columnCtrl.update,
		util.end);
}
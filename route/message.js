var validator = require("../validator"),
	messageCtrl = require("../controller/message"),
	data = require("../data"),
	util = require("../util");

module.exports = function wrap(app){
	// message controller
	app.post("/message/send",
		validator.isLogin,
		validator.validat_num,
		messageCtrl.create);
}
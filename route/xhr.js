var validator = require("../validator"),
	data = require("../data"),
	util = require("../util");

module.exports = function wrap(app){
	app.get("/info",
		validator.xhr,
		data.infoList,
		function(req,res){
	
		});

	app.get("/message",
		validator.xhr,
		data.messageList,
		function(req,res){
	
		});

	app.get("/user/:id/get",
		validator.xhr,
		data.user("id"),
		function(req,res){
			res.send(req.user);
		});
	
	app.get("/reply/:id",
		validator.xhr,
		data.reply,
		function(req,res){
			res.send(req.reply);
		})	
}
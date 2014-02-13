var validator = require("../validator"),
	data = require("../data"),
	util = require("../util");

module.exports = function wrap(app){
	app.get("/",
		data.share,
		data.columnList,
		function(req,res){
		
		});

	app.get("/topic/:id",
		data.share,
		data.topic,
		function(req,res){
		
		});

	app.get("/user/:id",
		data.share,
		function(req,res){

		});

	app.get("/column/:id",
		data.share,
		util.pager,
		function(req,res){

		});
		
}
var data = require("../controller/data"),
	util = require("../controller/util");

module.exports = function wrap(app){
	app.get("/",
		data.share,
		data.columnList,
		function(req,res){
		
		});

	app.get("/topic/:id",
		data.share,
		data.topicById,
		function(req,res){
		
		});

	app.get("/user/:id",
		data.share,
		function(req,res){

		});

	app.get("/column/:id",
		data.share,
		data.topicByColumnId,
		function(req,res){

		});
		
}
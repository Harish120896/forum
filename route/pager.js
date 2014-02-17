var data = require("../controller/data"),
	util = require("../controller/util");

module.exports = function wrap(app){
	app.get("/",
		//data.share,
		util.cookieLogin,
		data.columnList,
		function(req,res){
			res.render("index",{columns:req.columns,user:req.session.user});
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

	app.get("/setNewPassword",
		function(req,res){
			console.log("dfdsfsdfsfsfss")
			res.locals.code = req.param("code");
			res.locals.email = req.param("email");
			res.render("setNewPassword");
		});		
}
var data = require("../controller/data"),
	util = require("../controller/util");

module.exports = function wrap(app){
	app.get("/",
	util.cookieLogin,
		//data.share,
		util.cookieLogin,
		data.columnList,
		function(req,res){
			res.render("index",{columns:req.columns,user:req.session.user});
		});

	app.get("/topic/:id",
		//data.share,
		util.cookieLogin,
		data.topicById,
		function(req,res){
			if(req.topic){
				res.locals.topic = topic;
				res.render("topic");
			}else{
				res.send(404);
			}
		});

	app.get("/user/:id",
		util.cookieLogin,
		data.userById,
		util.hasReqUser,
		function(req,res){
			res.locals.user = req.user;
			res.render("user");
		});

	app.get("/column/:id",
		//data.share,
		util.cookieLogin,
		data.columnById,
		data.topicsByColumnId,
		function(req,res){
			if(req.topics && req.column){
				res.locals.topics = req.topics;
				res.locals.column = req.column;
				res.render("column");
			}else{
				res.send(404);
			}
		});

	app.get("/setNewPassword",
		function(req,res){
			res.locals.code = req.param("code");
			res.locals.email = req.param("email");
			res.render("setNewPassword");
		});		
}
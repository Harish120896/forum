var data = require("../controller/data"),
Tree = require("tree-node"),
	util = require("../controller/util");

module.exports = function wrap(app){
	// app.get("/info",
	// 	util.xhr,
	// 	data.infoList,
	// 	function(req,res){
	// 
	// 	});
	// 
	// app.get("/message",
	// 	util.xhr,
	// 	data.messageList,
	// 	function(req,res){
	// 
	// 	});
	
	
	app.get("/column/:id/get",
		data.columnById,
		function(req,res){
			var column = req.result.data("column");
			res.send(column)
		}
	)

	app.get("/user/:id/get",
		util.xhr,
		data.userById,
		function(req,res){
			res.send(req.user);
		});
	
	app.get("/reply/:id",
		util.xhr,
		data.replyById,
		function(req,res){
			var reply = req.result.data("reply");
			res.send(reply);
		})
		
		app.get("/replyTree/:id",
		util.xhr,
		data.topicById,
		function(req,res){
			
			var replyTree = [];
			var topic = req.result.data("topic");
			if(topic){
				console.log(topic)
				var rt = Tree.reborn(topic.replyTree);
				var ids = rt.childIds;
				ids.forEach(function(rid){
					replyTree.push({id:rid,childIds:rt.getNode(rid).allChildIds})
				})
			}
			
			res.send(replyTree);
			
		}
	)

	app.get("/refresh_num",
		util.refreshValidatNum,
		data.validatNumPng,
		function(req,res){
			res.send(req.result.data("validatNumPng"));
		})
		
}
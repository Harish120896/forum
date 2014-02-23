var Result = require("result-brighthas");

module.exports = {
	
	create:function(req,res,next){
		var domain = req.env.domain;
		req.body.authorId = req.session.user.id;
		domain.exec("create a topic",req.body,function(result){
			req.result = result;
			next();
		});
	},
	
	update:function(req,res,next){
		var domain = req.env.domain;
		req.body.authorId = req.session.user.id;
		domain.call("Topic.updateInfo",req.body.topicId,[req.body.title, req.body.body, req.body.columnId],function(result){
			req.result = result;
			next();
		});
	},
	
	// dev isLogin / isAdmin
	remove:function(req,res,next){
		var domain = req.env.domain;
		var id = req.param("id");
		domain.exec("remove a topic",{id:id},function(result){
			req.result = new Result;
			next();
		})
	},
	
	// dev isLogin / isTopicManager
	seal:function(req,res,next){
		var domain = req.env.domain;
		var id = req.param("id");
		domain.call("Topic.toseal",id,[],function(err){
			req.result = new Result();
			next();
		})		
	},
	
	// dev isLogin / isTopicManager
	unseal:function(req,res,next){
		var domain = req.env.domain;
		var id = req.param("id");
		domain.call("Topic.unseal",id,[],function(err){
			req.result = new Result();
			next();
		})		
	}
	
}
var domain = require("../../domain"),query = require("../query");

module.exports = {
	
	
	create:function(req,res,next){
		req.body.authorId = req.session.user.id;
		domain.exec("create a topic",req.body,function(err,topic){
			req.topic = topic;
			if(topic){
				req.result = "success";
			}else{
				req.result = "error";
			}
			next();
		});
	},
	
	
	update:function(req,res){
		req.body.authorId = req.session.user.id;
		domain.call("Topic.updateInfo",req.body.topicId,[req.body.title, req.body.body, req.body.columnId],function(err){
			res.result = err;
			next();
		});
	},
	
	remove:function(req,res){
		var id = req.param("id");
		domain.exec("remove a topic",{id:id},function(err){
			res.result = err;
			next();
		})
	},
	
	view:function(req,res){
		query.topic({id:req.param("id")},function(rs){
			if(rs){
				res.locals.topic = rs;
				res.render("topic");
			}else{
				res.send(404);
			}
		});
	}
	
}
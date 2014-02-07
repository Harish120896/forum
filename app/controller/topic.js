var domain = require("../domain"),query = require("../query");

module.exports = {
	
	view:function(req,res){
		query.topic({id:req.param("topicId")},function(rs){
			if(rs){
				res.locals.topic = rs;
				res.render("topic");
			}else{
				res.send(404);
			}
		});
	},
	
	create:function(req,res){
		req.body.authorId = req.session.user.id;
		domain.exec("create a topic",req.body,function(errs){
			res.send(errs);
		});
	},
	
	update:function(req,res){
		req.body.authorId = req.session.user.id;
		domain.call("Topic.updateInfo",req.body.topicId,[req.body.title, req.body.body, req.body.columnId],function(errs){
			res.send(errs)
		});
	},
	
	remove:function(req,res){
		var id = req.param("topicId");
		domain.exec("remove a topic",{id:id},function(err){
			res.send(err);
		})
	};
	
}
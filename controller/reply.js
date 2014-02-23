
module.exports = {
	
	create:function(req,res,next){
		var query = req.env.query;
		var domain = req.env.domain;
		req.body.authorId = req.session.user.id;
		domain.exec("create a reply",req.body,function(result){		
			req.result = result;
			next();
		});
	},
		
	// dev isLogin / isAdmin
	remove:function(req,res,next){
		var domain = req.env.domain;
		var id = req.param("id");
		var topicId = req.result.data("reply").topicId;
;		domain.call("Topic.removeReply",topicId,[id],function(result){
			req.result = result;
			next();
		})
	}
	
}
var domain = require("../domain"),query = require("../infrastructure/query");

module.exports = {
	
	create:function(req,res,next){
		req.body.authorId = req.session.user.id;
		domain.exec("create a reply",req.body,function(err,reply){
			if(reply){
				req.result = "success";
				req.reply = reply;
			}else{
				req.result = "error";
			}
			next();
		});
	},
		
	// dev isLogin / isAdmin
	remove:function(req,res,next){
		var id = req.param("id");
		var topicId = req.reply.id;
		domain.call("Topic.removeReply",topicId,[id],function(err){
			res.result = err || "success";
			next();
		})
	}
	
}
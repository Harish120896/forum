var query = require("../infrastructure/query");

module.exports = {
	
	userById:function(req,res,next){
		query.userById(req.param("id"),function(rs){
			req.user = rs;
			next();
		});
	},
	
	userByEmail:function(req,res,next){
		
		query.userByEmail(req.param("email"),function(rs){
			req.user = rs;
			next();
		})
	},	
	
	topicById:function(req,res,next){
		query.topicById(req.param("id"),function(rs){
			req.topic = rs;
			next();
		})
	},
	
	replyById:function(req,res,next){
		query.replyById(req.param("id"),function(rs){
			req.reply = rs;
			next();
		})		
	}
	
	
}
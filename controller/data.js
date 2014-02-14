var query = require("../infrastructure/query");

module.exports = {
	
	share:function(req,res,next){
		
	},
	
	columnList:function(req,res,next){
		query.columns(function(rs){
			req.columns = rs;
			next();
		});
	},
	
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
	
	topicByColumnId:function(req,res,next){
		
	},
	
	replyById:function(req,res,next){
		query.replyById(req.param("id"),function(rs){
			req.reply = rs;
			next();
		})		
	},
	
	infoList:function(req,res,next){
		
	},
	messageList:function(req,res,next){
		
	}
	
}
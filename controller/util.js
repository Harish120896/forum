var r = require("random-word")("0123456789");
var Result = require("result-brighthas");

module.exports = {
	
	cookieLogin:function(req, res, next) {
		var query = req.env.query;
		
	    if (req.session.user) {
	        next();
	    } else {
	        if (req.cookies.user) {
	            try {
	                var u = JSON.parse(req.cookies.user);
	                query.userByEmail(u.email, function(user) {
	                    if (user && user.password === u.password) {
	                        req.session.user = user;
	                        next();
	                    } else {
	                        next();
	                    }
	                })
	            } catch (e) {
	                next();
	            }
	        } else {
	            next();
	        }
	    }
	},
	refreshValidatNum:function(req,res,next){
	    req.session.validat_num = r.random(4);	
		next();
	},
	end:function(req,res){
		res.send(req.result.toJSON());
	},

	isLogin:function(req,res,next){
		if(req.session.user){
			next();
		}else{
			var result = new Result();
			result.error("email","请先登录");
			res.send(result.toJSON());
		}
	},
	
	validat_num:function(req, res, next) {
	    if (req.body.validat_num && req.session.validat_num === req.body.validat_num) {
			next();
	    } else {
			var result = new Result();
			result.error("validat_num","验证码错误");
			res.send(result.toJSON());
	    }
	},
	
	hasReqUser:function(req,res,next){
		if(req.result.data("user")){
			next();
		}else{
			var result = new Result();
			result.error("user","没有此用户");
			res.send(result.toJSON());
		}
	},
	
	// // dev hasReqUser / isLogin
	// userNoSelf:function(req,res,next){	 
	// 	var user = req.result.data("user");
	// 	if(user.id !== req.session.user.id){
	// 		res.send(req.result.toJSON());
	// 	}else{
	// 		next();
	// 	}
	// },
	// 
	// // dev hasReqUser / isLogin
	// userSelf:function(req,res,next){	 
	// 	if(req.user.id === req.session.user.id){
	// 		res.send("success");
	// 	}else{
	// 		next();
	// 	}
	// },
	
	// dev isLogin
	isAdmin:function(req,res,next){
		var result = new Result();
		if(req.session.user.role !== 1){
			result.error("user","不是管理员");
			res.send(result.toJSON());
		}else{
			next();
		}
	},
	
	hasTopic:function(req,res,next){
		var topic = req.result.data("topic");
		var result = new Result();
		if(topic){
			next();
		}else{
			result.error("topic","没有主题帖");
			res.send(result);
		}
	},
	
	// dev isLogin / hasTopic
	isTopicManager:function(req,res,next){
		
		var query = req.env.query;
		var result = new Result();
		var topic = req.result.data("topic");
		
		query.columnById(topic.columnId,function(col){
			if(
				topic.authorId === req.session.user.id || 
				col.managerId === req.session.user.id || 
				req.session.user.role === 1 ){
					
					next();
			}else{
				result.error("user","非法操作");
				res.send(result);
			}			
		});
	},
	
	hasReply:function(req,res,next){
		var reply = req.result.data("reply");
		if(reply){
			next();
		}else{
			var result = new Result();
			result.error("reply","没有回复贴")
			res.send(result);
		}
	},
	
	// dev isLogin / hasReply
	isReplyManager:function(req,res,next){
		var query = req.env.query;
		var reply = req.result.data("reply");
		var result = new Result();
		
		query.topicById(reply.topicId,function(topic){
			if(topic){
				query.columnById(topic.columnId,function(col){
					if(col){
						if(
							req.session.user.id === req.reply.authorId || 
							req.session.user.id === topic.authorId || 
							req.session.user.role === 1 ){
							next();
						}else{
							req.result.error("error","非法操作 ");
						}							
					}else{
						req.result.error("error","非法操作 ");
					}
					res.send(req.result.toJSON());
				});				
			}else{
				req.result.error("error","非法操作 ");
				res.send(req.result.toJSON());
			}
		});
		
	},
	
	//dev isLogin / hasReply
	isReplyAuthor:function(req,res,next){
		var reply = req.result.data("reply");
		
		if(req.session.user.id === reply.authorId){
			next();
		}else{
			req.result.error("error","非法操作 ");
			res.send(req.result.toJSON());
		}
	},
	
	xhr:function(req,res,next){
		if(!req.xhr){
			req.result.error("error","非法操作 ");
			res.send(req.result.toJSON());
		}else{
			next();
		}
	}
}

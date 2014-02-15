var query = require("../infrastructure/query");
var r = require("random-word")("0123456789");

module.exports = {
	
	cookieLogin:function(req, res, next) {
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
		res.send(req.result);
	},

	isLogin:function(req,res,next){
		if(req.session.user){
			next();
		}else{
			res.send(["请先登录！"]);
		}
	},
	validat_num:function(req, res, next) {
	    if (req.body.validat_num && req.session.validat_num === req.body.validat_num) {
			next();
	    } else {
			res.send(["验证码错误！"]);
	    }
	},
	hasReqUser:function(req,res,next){
		
		if(req.user){
			next();
		}else{
			res.send("error");
		}
	},
	
	// dev hasReqUser / isLogin 芳草地
	userNoSelf:function(req,res,next){	 
		if(req.user.id !== req.session.user.id){
			res.send("success");
		}else{
			next();
		}
	},
	
	// dev hasReqUser / isLogin
	userSelf:function(req,res,next){	 
		if(req.user.id === req.session.user.id){
			res.send("success");
		}else{
			next();
		}
	},
	
	// dev isLogin
	isAdmin:function(req,res,next){
		if(req.result === "success"){
			next();
		}else{
			if(req.session.user.role === 1){
				req.result = "success";
			}else{
				req.result = "error";
			}
			next();			
		}
	},
	
	hasTopic:function(req,res,next){
		if(req.topic){
			next();
		}else{
			res.send("error");
		}
	},
	
	// dev isLogin / hasTopic
	isTopicManager:function(req,res,next){
		query.column(req.topic.columnId,function(col){
			if(
				req.topic.authorId === req.session.user.id || 
				col.managerId === req.session.user.id || 
				req.session.user.role === 1 ){
					
					next();
			}else{
				res.send("error");
			}			
		});
	},
	
	hasReply:function(req,res,next){
		if(req.reply){
			next();
		}else{
			res.send("error");
		}
	},
	
	// dev isLogin / hasReply
	isReplyManager:function(req,res,next){
		
		query.topic({id:req.reply.topicId},function(topic){
			if(topic){
				query.column({id:topic.columnId},function(col){
					if(col){
						if(
							req.session.user.id === req.reply.authorId || 
							req.session.user.id === topic.authorId || 
							req.session.user.role === 1 ){
							req.result = "success";
							next();
						}else{
							res.send("error")
						}							
					}else{
						res.send("error");
					}
				});				
			}else{
				res.send("error");
			}
		});
		
	},
	
	//dev isLogin / hasReply
	isReplyAuthor:function(req,res,next){
		if(req.session.user.id === req.reply.authorId){
			req.result = "success";
			next();
		}else{
			res.send("error")
		}
	},
	
	xhr:function(req,res,next){
		if(req.xhr){
			req.result = "success";
		}else{
			req.result = "error";
		}
		next();
	}
}

var crypto = require("crypto");
var domain = require("../../domain");
var config = require("../config");
var _ = require("underscore");

module.exports = {
	
	login:function(req,res,next){
		
		if(req.user && req.body.password){
	        var md5 = crypto.createHash('md5');
	        var pwd = md5.update(req.body.password).digest("hex");
			if(req.user.password === pwd){
				
				req.session.user = req.user;
				
                res.cookie('user', JSON.stringify({
                    email: req.user.email,
                    password: req.user.password
                }), {
                    maxAge: 1000 * 60 * 60 * 24 * 90
                });
				
				req.result = "success";
				next();
			}else{
				req.result = "error";
				next();
			}
		}else{
			req.result = "error";
			next();
			//res.send(["邮箱或密码错误!"]);
		}
	},
	
	logout:function(req,res,next){
	    res.clearCookie("user");
		req.session.user = null;
		next();
	},
	
	// return success or [error];
	// if success , req.user exist.
	create:function(req,res,next){
		
		function pass(user){
			req.user = user;
			req.result = "success";
			next();
		}
		
	    domain.exec("create a user", req.body, function(err, user) {
	        if (err) {
	            req.result = "error";
				next();
	        } else {
	            if (user.email === config.admin) {
	                setTimeout(function() {
	                    domain.call("User.becomeAdmin", user.id);
						pass(user);
	                }, 1000);
	            } else {
	                pass(user);
	            }
	        }
	    });
	},
	
	update:function(req,res,next){
	    domain.call("User.updateInfo", req.session.user.id, [req.body], function(err) {
			if(err){
				req.result = "error";
			}else{
				req.result = "success";
			}
			next();
	    });
	}
}
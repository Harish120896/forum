var query = require("./query");
var r = require("random-word")("0123456789");
var pw = require("png-word")();

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
	refreshValidatNum:function(req,res){
	    var numtxt = req.session.validat_num = r.random(4);
	    pw.createPNG(numtxt, function(pngnum) {
	        res.send(pngnum);
	    });		
	},
	end:function(req,res){
		res.send(req.result);
	}
}

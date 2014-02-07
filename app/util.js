var query = require("./query");

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
	}		
}

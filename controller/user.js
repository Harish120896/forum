var crypto = require("crypto");
var config = require("../infrastructure/config");
var _ = require("underscore");
var nodemailer = require("nodemailer");
var Result = require("result-brighthas");

// test email push
var transport = nodemailer.createTransport("SMTP", {
    service: "QQ",
    auth: {
        user: config.sys_email,
        pass: config.sys_email_pwd
    }
});

module.exports = {

    findPassword: function(req, res, next) {
		
		var user = req.result.data("user");
		
        transport.sendMail({
            from: "xxxq <1405491181@qq.com>",
            to: "hi <" + user.email + ">",
            // Subject of the message
            subject: '更改密码',

            // plaintext body
            text: '更改密码',

            // HTML body
            html: '<a href="http://localhost:3000/setNewPassword?email=' + user.email + "&code=" + user.password + '">点击更改密码</a>'

        }, function(err) {
            req.result =  new Result();
            next();
        });
    },

    // must have req.user & req.body.password
    login: function(req, res, next) {
		var result = new Result();
        var md5 = crypto.createHash('md5');
        var pwd = md5.update(req.body.password).digest("hex");
		var user = req.result.data("user");
        if (user.password === pwd) {

            req.session.user = user;

            res.cookie('user', JSON.stringify({
                email: user.email,
                password: user.password
            }), {
                maxAge: 1000 * 60 * 60 * 24 * 90
            });
        } else {
            result.error("email","登录信箱或密码有误，请重新登录。");
        }
		
		req.result = result;
		next();
    },

    logout: function(req, res, next) {
        res.clearCookie("user");
        req.session.user = null;
        next();
    },

    // return success or [error];
    // if success , req.user exist.
    create: function(req, res, next) {
		
		var result = new Result();
        var domain = req.env.domain;
        domain.exec("create a user", {
            nickname: req.body.nickname,
            email: req.body.email,
            password: req.body.password
        }, function(err,user) {
			if(user){	
				result.data("user",user);
	            if (user.email === config.admin) {
	                domain.call("User.becomeAdmin", user.id);
	            }
			}else{
				result.error("error",err);
			}
			
			req.result = result;
			next();
			
        });
    },

    update: function(req, res, next) {
        var domain = req.env.domain;
        domain.call("User.updateInfo", req.session.user.id, [req.body], function(result) {
            req.result = result;
            next();
        });
    },

    seal: function(req, res, next) {
        var domain = req.env.domain;
		var user = req.result.data("user");
        domain.call("User.sealUser", user.id, []);
        next();
    },

    follow: function(req, res, next) {
		var user = req.result.data("user");
		
        domain.call("User.follow", req.session.id, [user.id]);
        next();
    },

    unfollow: function(req, res, next) {
        var domain = req.env.domain;
		var user = req.result.data("user");
		
        domain.call("User.unfollow", req.session.id, [user.id]);
        next();
    },

    becomeModerator: function(req, res, next) {
        var domain = req.env.domain;
		var user = req.result.data("user");

        domain.call("User.becomeModerator", user.id, []);
        next();
    },

    becomeUser: function(req, res, next) {
        var domain = req.env.domain;
		var user = req.result.data("user");

        domain.call("User.becomeUser", user.id, []);
        next();
    },
    updatePassword: function(req, res, next) {
        var domain = req.env.domain;
		var user = req.result.data("user");
        if (req.user.password === req.body.code) {
            domain.call("User.updatePassword", user.id, [req.param("password")], function(result) {
                req.result = result;
                next();
            })
        } else {
			var result = new Result();
			result.error("code","操作失败");
            next();
        }
    },

    plus: function(req, res, next) {
        var domain = req.env.domain;
		var user = req.result.data("user");
		
        domain.call("User.plus", user.id, [req.param["fraction"]])
        next();
    },

    remove: function(req, res, next) {
        var domain = req.env.domain;

        domain.exec("remove a user", {
            id: req.param("id")
        })
        next();
    }

}

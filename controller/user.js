var crypto = require("crypto");
var config = require("../infrastructure/config");
var _ = require("underscore");
var nodemailer = require("nodemailer");

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
        transport.sendMail({
            from: "xxxq <1405491181@qq.com>",
            to: "hi <" + req.user.email + ">",
            // Subject of the message
            subject: '更改密码',

            // plaintext body
            text: '更改密码',

            // HTML body
            html: '<a href="http://localhost:3000/setNewPassword?email=' + req.user.email + "&code=" + req.user.password + '">点击更改密码</a>'

        }, function(err) {
            req.result = "success";
            next();
        });
    },

    // must have req.user & req.body.password
    login: function(req, res, next) {
        var md5 = crypto.createHash('md5');
        var pwd = md5.update(req.body.password).digest("hex");
        if (req.user && req.user.password === pwd) {

            req.session.user = req.user;

            res.cookie('user', JSON.stringify({
                email: req.user.email,
                password: req.user.password
            }), {
                maxAge: 1000 * 60 * 60 * 24 * 90
            });

            req.result = "success";
            next();
        } else {
            req.result = {
                email: ["登录信箱或密码有误，请重新登录。"]
            };
            next();
        }
    },

    logout: function(req, res, next) {
        res.clearCookie("user");
        req.session.user = null;
        next();
    },

    // return success or [error];
    // if success , req.user exist.
    create: function(req, res, next) {
        var domain = req.env.domain;

        function pass(user) {
            req.user = user;
            req.result = "success";
            next();
        }
        domain.exec("create a user", {
            nickname: req.body.nickname,
            email: req.body.email,
            password: req.body.password
        }, function(err, user) {
            if (err) {
                res.send(err);
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

    update: function(req, res, next) {
        var domain = req.env.domain;
        domain.call("User.updateInfo", req.session.user.id, [req.body], function(err) {
            if (err) {
                req.result = "error";
            } else {
                req.result = "success";
            }
            next();
        });
    },

    seal: function(req, res, next) {
        var domain = req.env.domain;
        domain.call("User.sealUser", req.user.id, []);
        next();
    },

    follow: function(req, res, next) {ç
        domain.call("User.follow", req.session.id, [req.user.id]);
        next();
    },

    unfollow: function(req, res, next) {
        var domain = req.env.domain;
        domain.call("User.unfollow", req.session.id, [req.user.id]);
        next();
    },

    becomeModerator: function(req, res, next) {
        var domain = req.env.domain;

        domain.call("User.becomeModerator", req.user.id, []);
        next();
    },

    becomeUser: function(req, res, next) {
        var domain = req.env.domain;

        domain.call("User.becomeUser", req.user.id, []);
        next();
    },
    updatePassword: function(req, res, next) {
        var domain = req.env.domain;

        if (req.user.password === req.body.code) {
            domain.call("User.updatePassword", req.user.id, [req.param("password")], function(err) {
                req.result = err || "success";
                next();
            })
        } else {
            req.result = {
                "user": ["非法操作！"]
            };
            next();
        }
    },

    plus: function(req, res, next) {
        var domain = req.env.domain;

        domain.call("User.plus", req.user.id, [req.param["fraction"]])
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

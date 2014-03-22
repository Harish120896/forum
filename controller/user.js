var crypto = require("crypto");
var fs = require("fs");
var path = require("path");
var _ = require("underscore");



module.exports = function(domain,query){
    return {

        findPassword: function (req, res, next) {

            if (req.result.hasError()) {
                return next();
            }

            var user = req.result.data("user");
            req.env.transport.sendMail({
                from: "xxxq <308212012@qq.com>",
                to: "hi <" + user.email + ">",
                // Subject of the message
                subject: '更改密码',

                // plaintext body
                text: '更改密码',

                // HTML body
                html: '<a href="http://localhost:3000/setNewPassword?email=' + user.email + "&code=" + user.password + '">点击更改密码</a>'

            }, function (err) {
                if (err)
                    req.result.error("email", "内部错误，请联系管理员");
                next();
            });
        },

        // must have req.user & req.body.password
        login: function (req, res, next) {

            if (req.result.hasError()) {
                return next();
            }

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
                req.result.error("email", "登录信箱或密码有误，请重新登录。");
            }
            next();
        },

        logout: function (req, res, next) {
            res.clearCookie("user");
            req.session.user = null;
            next();
        },

        // return success or [error];
        // if success , req.user exist.
        create: function (req, res, next) {

            if (req.result.hasError()) {
                return next();
            }
            domain.exec("create a user", {
                nickname: req.body.nickname,
                email: req.body.email,
                password: req.body.password
            }, function (result) {
                var user = result.data("user");
                if (user) {
                    if (user.email === req.env.config.admin) {
                        setTimeout(function(){
                            domain.call("User.becomeAdmin", user.id);
                        },1000);
                    }
                }

                req.result.mix(result);

                next();

            });
        },

        update: function (req, res, next) {

            if (req.result.hasError()) {
                return next();
            }

            domain.call("User.updateInfo", req.session.user.id, [req.body], function (result) {
                req.result.mix(result);
                next();
            });
        },

        seal: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            domain.call("User.sealUser", req.param("id"), []);
            next();
        },

        follow: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }

            domain.call("User.follow", req.session.user.id, [req.param("id")]);
            next();
        },

        unfollow: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }

            domain.call("User.unfollow", req.session.user.id, [req.param("id")]);
            next();
        },

        becomeModerator: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }

            domain.call("User.becomeModerator", req.param("id"));
            next();
        },

        becomeUser: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }

            domain.call("User.becomeUser", req.param("id"));
            next();
        },

        updateLogo: function (req, res) {
//        if (req.result.hasError()) {
//            return next();
//        }
            var logo = req.files.file;
            if (logo && (logo.type === "image/png" || logo.type === "image/jpeg") && logo.size <= 1024 * 100) {
                fs.createReadStream(logo.path).pipe(fs.createWriteStream(path.join(__dirname, "..", "public/logo", req.session.user.nickname)));
            } else {
                req.result.error("logo", "图片大小<100k，并且是png格式");
            }
            res.send(req.result.json());
//        next();
        },

        updatePassword: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            var user = req.result.data("user");
            if (user.password === req.body.code) {
                domain.call("User.updatePassword", user.id, [req.param("password")], function (result) {
                    next();
                })
            } else {
                req.result.error("code", "操作失败");
                next();
            }
        },

        plus: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            domain.call("User.plus", req.param("id"), [req.param["fraction"]])
            next();
        },

        remove: function (req, res, next) {

            if (req.result.hasError()) {
                return next();
            }
            domain.exec("remove a user", {
                id: req.param("id")
            });
            next();
        },

        isCustomLogo: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            domain.exec("isCustomLogo", {
                id: req.session.user.id,
                custom:req.param("custom")
            });
            next();
        }

    }
}

var r = require("random-word")("0123456789");
var Result = require("result-brighthas");

var util = {

    result: function (req, res, next) {
        req.result = new Result();
        next();
    },

    cookieLogin: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        if (req.session.user) {
            next();
        } else {
            if (req.cookies.user) {
                try {
                    var u = JSON.parse(req.cookies.user);
                    query.userByEmail(u.email, function (user) {
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

    refreshValidatNum: function (req, res, next) {
        req.session.validat_num = r.random(4);
        next();
    },

    end: function (req, res, next) {
        res.send(req.result.json());
    },

    isLogin: function (req, res, next) {

        if (req.result.hasError()) {
            return next();
        }
        if (!req.session.user) {
            req.result.error("email", "请先登录");
        }
        next();

    },

    validat_num: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        if (!(req.body.validat_num && req.session.validat_num === req.body.validat_num)) {
            req.result.error("validat_num", "验证码错误");
        }
        next();

    },

    hasUser: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        if (!req.result.data("user")) {
            req.result.error("user", "没有此用户");
        }
        next();
    },

    // dev hasReqUser / isLogin
    noSelf: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var user = req.result.data("user");
        if (user.id === req.session.user.id) {
            req.result.error("error", "error");
        }

        next();
    },

    // dev hasReqUser / isLogin
    isSelf: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var user = req.result.data("user");
        if (user.id !== req.session.user.id) {
            req.result.error("error", "error");
        }

        next()
    },

    // dev isLogin
    isAdmin: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        if (req.session.user.role !== 1) {
            req.result.error("user", "不是管理员");
        }
        next();
    },

    hasTopic: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var topic = req.result.data("topic");
        if (!topic) {
            result.error("topic", "没有主题帖");
        }
        next();
    },

    // dev isLogin / hasTopic
    isTopicManager: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        var topic = req.result.data("topic");

        query.columnById(topic.columnId, function (col) {
            if (
                topic.authorId === req.session.user.id ||
                    col.managerId === req.session.user.id ||
                    req.session.user.role === 1) {
            } else {
                req.result.error("user", "非法操作");
            }
            next();
        });

    },

    hasReply: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var reply = req.result.data("reply");

        if (!reply) {
            req.result.error("reply", "没有回复贴")
        }
        next();

    },

    // dev isLogin / hasReply
    isReplyManager: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;
        var reply = req.result.data("reply");

        query.topicById(reply.topicId, function (topic) {
            if (topic) {
                query.columnById(topic.columnId, function (col) {
                    if (col) {
                        if (
                            req.session.user.id === reply.authorId ||
                                req.session.user.id === topic.authorId ||
                                req.session.user.role === 1) {
                        } else {
                            req.result.error("error", "非法操作 ");
                        }
                    } else {
                        req.result.error("error", "非法操作 ");
                    }
                    next();
                });
            } else {
                req.result.error("error", "非法操作 ");
                next();
            }
        });

    },

    //dev isLogin / hasReply
    isReplyAuthor: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var reply = req.result.data("reply");

        if (req.session.user.id !== reply.authorId) {

            req.result.error("error", "非法操作 ");
        }
        next();
    },

    xhr: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        if (req.xhr || req.get("angular-request") === "ajaxRequest") {
        } else {
            req.result.error("error", "非法操作 ");
        }

        next();
    }
}

module.exports = util;

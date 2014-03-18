var Result = require("result-brighthas");
var escape = require("./escape");

module.exports = {

    create: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var domain = req.env.domain;
        req.body.authorId = req.session.user.id;
        if(req.body.body){
            req.body.body = escape(req.body.body);
        }
        domain.exec("create a topic", req.body, function (result) {
            req.result.mix(result);
            next();
        });
    },

    update: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var domain = req.env.domain;
        req.body.authorId = req.session.user.id;
        if(req.body.body){
            req.body.body = escape(req.body.body);
        }
        domain.call("Topic.updateInfo", req.body.topicId, [req.body.title, req.body.body, req.body.columnId], function (result) {
            req.result.mix(result);
            next();
        });
    },

    // dev isLogin / isAdmin
    remove: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var domain = req.env.domain;
        var id = req.param("id");
        domain.exec("remove a topic", {
            id: id
        });
        next();
    },

    // dev isLogin / isTopicManager
    seal: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var domain = req.env.domain;
        var id = req.param("id");
        domain.call("Topic.toseal", id);
        next();
    },

    // dev isLogin / isTopicManager
    unseal: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var domain = req.env.domain;
        var id = req.param("id");
        domain.call("Topic.unseal", id);
        next();
    },

    access: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var domain = req.env.domain;
        var id = req.param("id");
        domain.call("Topic.access", id);
        next();
    },

    removeReply: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var domain = req.env.domain;
        var id = req.param("id");
        var replyId = req.body.replyId;
        domain.call("Topic.removeReply", id, [replyId]);
        next();
    }

}

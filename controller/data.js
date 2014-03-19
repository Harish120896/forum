var Result = require("result-brighthas");
var util = require("./util");
var pw = require("png-word")();

module.exports = {

    columnById: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;
        query.columnById(req.param("id"), function (rs) {
            if (rs) {
                req.result.data("column", rs);
            }
            next();
        });
    },

    columnByTopicId: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;
        query.columnByTopicId(req.param("id"), function (rs) {
            if (rs) {
                req.result.data("column", rs);
            }
            next();
        });
    },

    share: function (req, res, next) {
        res.locals.user = null;
        next();
    },

    columnList: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;
        query.columns(function (rs) {
            req.result.data("columnList", rs);
            next();
        });

    },

    validatNumPng: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        if (!req.session.validat_num) {
            util.refreshValidatNum(req, res, function () {
            });
        }
        pw.createPNG(req.session.validat_num, function (pngnum) {
            req.result.data("validatNumPng", pngnum);
            next();
        });

    },

    userById: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.userById(req.param("id"), function (rs) {
            if (rs) {
                req.result.data("user", rs);
            }
            next();
        });
    },

    userByEmail: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.userByEmail(req.param("email"), function (rs) {
            if (rs) {
                req.result.data("user", rs);
            }
            next();
        })
    },

    userByNick: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.userByNick(req.param("nickname"), function (rs) {
            if (rs) {
                req.result.data("user", rs);
            }
            next();
        })
    },

    topicById: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;
        query.topicById(req.param("id"), function (rs) {
            if (rs) {
                req.result.data("topic", rs);
            }
            next();
        })
    },

    topicsByColumnId: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;
        var cid = req.param("id");
        query.topicCountByColumnId(cid,function(count){
            query.topicsByColumnId(req.param("page"), cid, function (rs) {
                var page = req.param("page");
                page = parseInt(page);
                page = page > 0 ? page : 1;
                req.result.data("count",count);
                req.result.data("page",page);
                req.result.data("topics", rs);
                next();
            });
        });
    },

    replyById: function (req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.replyById(req.param("id"), function (rs) {
            if (rs) {
                req.result.data("reply", rs);
            }
            next();
        })
    },

    topicTitleListByUserId:function(req,res,next){
        var query = req.env.query;
        var userId = req.param("id");
        var page = req.param("page");
        query.topicTitleListByUserId(userId,page,function(rs){
            req.result.data("topicTitleList",rs);
            next();
        });
    },

    topicCountByUserId:function(req,res,next){
        var query = req.env.query;
        query.topicCountByUserId(req.param("id"),function(count){
            req.result.data("topicCount",count);
            next();
        })
    },

    replyIdsByUserId:function(req,res,next){
        var query = req.env.query;
        var userId = req.param("id");
        var page = req.param("page");
        query.replyIdsByUserId(userId,page,function(rs){
            req.result.data("replyIds",rs);
            next();
        });
    },

    replyCountByUserId:function(req,res,next){
        var query = req.env.query;
        query.replyCountByUserId(req.param("id"),function(count){
            req.result.data("replyCount",count);
            next();
        })
    },


    messageListByUserId:function(req,res,next){
        if(req.result.hasError()){
            next();
        }
        var query = req.env.query;
        query.messageListByUserId(req.param("page"), req.session.user.id, function (rs) {
            if (rs) {
                req.result.data("messageList", rs);
            }
            next();
        });
    },

    infoListByUserId: function (req, res, next) {
        if(req.result.hasError()){
            next();
        }
        var query = req.env.query;
        query.infoListByUserId(req.param("page"), req.session.user.id, function (rs) {
            if (rs) {
                req.result.data("infoList", rs);
            }
            next();
        });
    }
}

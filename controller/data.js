var Result = require("result-brighthas");
var util = require("./util");
var pw = require("png-word")();

module.exports = {

    columnById: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;
        query.columnById(req.param("id"), function(rs) {
			if(rs){
	            req.result.data("column", rs);
			}
            next();
        });
    },

    share: function(req, res, next) {
		res.locals.user = null;
        next();
    },

    columnList: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;
        query.columns(function(rs) {
            req.result.data("columnList", rs);
            next();
        });

    },

    validatNumPng: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        if (!req.session.validat_num) {
            util.refreshValidatNum(req, res, function() {});
        }
        pw.createPNG(req.session.validat_num, function(pngnum) {
            req.result.data("validatNumPng", pngnum);
            next();
        });

    },

    userById: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.userById(req.param("id"), function(rs) {
			if(rs){
	            req.result.data("user", rs);
			}
            next();
        });
    },

    userByEmail: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.userByEmail(req.param("email"), function(rs) {
			if(rs){
	            req.result.data("user", rs);
			}
            next();
        })
    },

    topicById: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;
        query.topicById(req.param("id"), function(rs) {
			if(rs){
	            req.result.data("topic", rs);
			}
            next();
        })
    },

    topicsByColumnId: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.topicsByColumnId(req.param("page"), req.param("id"), function(rs) {
			if(rs){
	            req.result.data("topics", rs);
			}
            next();
        });

    },

    replyById: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.replyById(req.param("id"), function(rs) {
			if(rs){
	            req.result.data("reply", rs);
			}
            next();
        })
    },

	// DOTO
	infoList:function(req,res,next){
		next();
	}
}

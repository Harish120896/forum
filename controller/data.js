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
            var result = new Result();
            result.data("column", rs);
            req.result = result;
            next();
        });
    },

    share: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        next();
    },

    columnList: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;
        query.columns(function(rs) {
            var result = new Result();
            result.data("columnList", rs);
            req.result = result;
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
            var result = new Result();
            result.data("validatNumPng", pngnum);
            req.result = result;
            next();
        });

    },

    userById: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.userById(req.param("id"), function(rs) {
            var result = new Result();
            result.data("user", rs);
            req.result = result;
            next();
        });
    },

    userByEmail: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.userByEmail(req.param("email"), function(rs) {
            var result = new Result();
            result.data("user", rs);
            req.result = result;
            next();
        })
    },

    topicById: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;
        query.topicById(req.param("id"), function(rs) {
            var result = new Result();
            result.data("topic", rs);
            req.result = result;
            next();
        })
    },

    topicsByColumnId: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.topicsByColumnId(req.param("page"), req.param("id"), function(rs) {
            var result = new Result();
            result.data("topics", rs);
            req.result = result;
            next();
        });

    },

    replyById: function(req, res, next) {
        if (req.result.hasError()) {
            return next();
        }
        var query = req.env.query;

        query.replyById(req.param("id"), function(rs) {
            var result = new Result();
            result.data("reply", rs);
            req.result = result;
            next();
        })
    }

}

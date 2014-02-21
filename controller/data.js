
var util = require("./util");
var pw = require("png-word")();

module.exports = {

	columnById:function(req,res,next){
		var query = req.env.query;
        query.columnById(req.param("id"),function(rs) {
            req.column = rs;
            next();
        });
	},

    share: function(req, res, next) {

    },

    columnList: function(req, res, next) {
		var query = req.env.query;
		
        query.columns(function(rs) {
			
            req.columns = rs;
            next();
        });
    },
    validatNumPng: function(req, res, next) {
        if (!req.session.validat_num) {
            util.refreshValidatNum(req, res, function() {});
        }
        pw.createPNG(req.session.validat_num, function(pngnum) {
            req.validatNumPng = pngnum;
            next();
        });

    },
    userById: function(req, res, next) {
		var query = req.env.query;
		
        query.userById(req.param("id"), function(rs) {
            req.user = rs;
            next();
        });
    },

    userByEmail: function(req, res, next) {
		var query = req.env.query;

        query.userByEmail(req.param("email"), function(rs) {
            req.user = rs;
            next();
        })
    },

    topicById: function(req, res, next) {
		var query = req.env.query;
	
        query.topicById(req.param("id"), function(rs) {
            req.topic = rs;
            next();
        })
    },

    topicsByColumnId: function(req, res, next) {
		var query = req.env.query;
		
        query.topicsByColumnId(req.param("id"), function(rs) {
            req.topics = rs;
            next();
        })
    },

    replyById: function(req, res, next) {
		var query = req.env.query;
		
        query.replyById(req.param("id"), function(rs) {
            req.reply = rs;
            next();
        })
    },

    infoList: function(req, res, next) {

    },
    messageList: function(req, res, next) {

    }

}

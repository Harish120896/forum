var is = require("istype");
var dbs = require("./db");

function oneday(date) {

    var date = date || new Date();

    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    this.startTime = date.getTime();

    this.endTime = this.startTime + 1000 * 60 * 60 * 24;

}

module.exports = {

    clear: function () {

        dbs.getDB("User").remove({}, {});
        dbs.getDB("Topic").remove({}, {});
        dbs.getDB("Column").remove({}, {});
        dbs.getDB("Reply").remove({}, {});
        dbs.getDB("Message").remove({}, {});

    },

    columns: function (callback) {
        var db = dbs.getDB("Column");
        db.find({}).exec(function (err, rs) {
            callback(rs || []);
        })
    },


    columnById: function (id, callback) {
        var db = dbs.getDB("Column");
        db.findOne({
            id: id
        }).exec(function (err, rs) {
                callback(rs);
            })
    },

    topicById: function (id, callback) {
        var db = dbs.getDB("Topic");
        db.findOne({
            id: id
        }).exec(function (err, rs) {
                callback(rs);
            })
    },

    replyById: function (id, callback) {
        var db = dbs.getDB("Reply");
        db.findOne({
            id: id
        }).exec(function (err, rs) {
                callback(rs);
            })
    },

    topicsByColumnId: function (page, columnId, callback) {
        if (columnId) {
            var page = is.number(page) && page > 0 && Number(page) === page ? page : 1;
            var db = dbs.getDB("Topic");
            db
                .find({
                    columnId: columnId
                })
                .limit(3)
                .sort({
                    createTime: -1
                })
                .skip((page - 1) * 3)
                .exec(function (err, rs) {
                    callback(rs || []);
                })
        } else {
            callback([]);
        }

    },

    users: function (callback) {
        var db = dbs.getDB("User");
        db.find({}).exec(function (err, rs) {
            callback(rs);
        });
    },

    userById: function (id, callback) {
        var db = dbs.getDB("User");
        db.findOne({
            id: id
        }).exec(function (err, rs) {
                callback(rs);
            });
    },

    userByEmail: function (email, callback) {
        var db = dbs.getDB("User");
        db.findOne({
            email: email
        }).exec(function (err, rs) {
                callback(rs);
            });
    },

    userByNick: function (nick, callback) {
        var db = dbs.getDB("User");
        db.findOne({
            nickname: nick
        }).exec(function (err, rs) {
                callback(rs);
            });
    },

    userFuzzyExist: function (userInfo, callback) {
        var db = dbs.getDB("User");
        var orq = [];
        for (var k in userInfo) {
            var kv = {};
            kv[k] = userInfo[k];
            orq.push(kv);
        }
        db.count({
            $or: orq
        }).exec(function (err, num) {
                callback(num ? true : false);
            });
    },

    replyCountByToday: function (authorId, callback) {
        var date = new oneday();
        var db = dbs.getDB("Reply");
        db.count({
            authorId: authorId,
            createTime: {
                $gt: date.startTime,
                $lt: date.endTime
            }
        })
            .exec(function (err, num) {
                callback(num || 0);
            });
    },

    topicCountByToday: function (authorId, callback) {
        var date = new oneday();
        var db = dbs.getDB("Topic");
        db.count({
            authorId: authorId,
            createTime: {
                $gt: date.startTime,
                $lt: date.endTime
            }
        })
            .exec(function (err, num) {
                callback(num || 0);
            })
    }

}

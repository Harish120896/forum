var is = require("istype");
var dbs = require("./db");
var Q = require("q");

function oneday(date) {

    var date = date || new Date();

    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    this.startTime = date.getTime();

    this.endTime = this.startTime + 1000 * 60 * 60 * 24;

}

module.exports = {

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

    columnByTopicId: function (id, callback) {
        var tdb = dbs.getDB("Topic");
        var cdb = dbs.getDB("Column");
        tdb.findOne({
            id: id
        }).exec(function (err, rs) {
                if (rs) {
                    cdb.findOne({
                        id: rs.columnId
                    }).exec(function (err, c) {
                            callback(c);
                        });
                } else {
                    callback(null);
                }
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

    newReplyByTopicId:function(topicId,callback){
        var defer = Q.defer();
        var db = dbs.getDB("Reply");
        db.findOne({
            topicId: topicId
        })
            .sort({createTime: -1})
            .exec(function (err, rs) {
                defer.resolve(rs);
                callback(rs);
        })
        return defer.promise;
    },

    newReplyAuthorByTopicId:function(topicId,callback){
        var defer = Q.defer();
        var self = this;
        this.newReplyByTopicId(topicId,function(r){
            if(r){
                self.userById(r.authorId,function(u){
                    defer.resolve(u || null);
                    callback(u || null)
                })
            }else{
                defer.resolve(null);
                callback(null);
            }
        })
        return defer.promise;
    },

    topicsByColumnId: function (page, columnId, callback) {

        if (columnId) {
            page = parseInt(page);
            page = page > 0 ? page : 1;
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

    topicCountByColumnId: function (columnId, callback) {
        var db = dbs.getDB("Topic");
        db.count({columnId: columnId}).exec(function (err, count) {
            callback(count || 0);
        })
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
    },

    topicTitleListByUserId: function (userId, page, callback) {
        if (userId) {
            page = parseInt(page);
            page = page > 0 ? page : 1;
            var db = dbs.getDB("Topic");
            db
                .find({
                    authorId: userId
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

    topicCountByUserId: function (userId, callback) {
        if (userId) {
            var db = dbs.getDB("Topic");
            db
                .count({
                    authorId: userId
                })
                .exec(function (err, rs) {
                    callback(rs || 0);
                })
        } else {
            callback(0);
        }
    },

    replyIdsByUserId: function (userId, page, callback) {
        if (userId) {
            page = parseInt(page);
            page = page > 0 ? page : 1;
            var db = dbs.getDB("Reply");
            db
                .find({
                    authorId: userId
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


    replyCountByUserId: function (userId, callback) {
        if (userId) {
            var db = dbs.getDB("Reply");
            db
                .count({
                    authorId: userId
                })
                .exec(function (err, rs) {
                    callback(rs || 0);
                })
        } else {
            callback(0);
        }
    },

    messageListByUserId: function (page, userId, callback) {
        if (userId) {
            page = parseInt(page);
            page = page > 0 ? page : 1;
            var db = dbs.getDB("Message");
            db
                .find({
                    targetId: userId
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

    infoListByUserId: function (page, userId, callback) {
        if (userId) {
            page = parseInt(page);
            page = page > 0 ? page : 1;
            var db = dbs.getDB("Info");
            db
                .find({
                    targetId: userId
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

    topList:function(callback){
        var db = dbs.getDB("Topic");
        db.find({top:true}).limit(10).sort({
            updateTime: -1
        }).exec(function(err,rs){
            callback(rs || []);
        })
    },

    hotList:function(callback){
        var db = dbs.getDB("Topic");
        db.find({}).limit(10).sort({
            replyNum: -1
        }).exec(function(err,rs){
            callback(rs || []);
        })
    },

    searchTopic:function(keyword,callback){
        var db = dbs.getDB("Topic");
        db.find({
            $where:function(){
                var regexp = new RegExp(keyword,"gi");
               return  regexp.test(this.title) || regexp.test(this.body);
            }
        }).exec(function(err,rs){
                callback(rs || []);
         })
    },

    // result is {topicAuthor 主题作者, newReply 最新回贴 , replyAuthor最新回贴作者}
    topicInfo:function(topic,callback){

        callback = callback || function(){}
        var defer = Q.defer();
        var self = this;
        var info = {}

        self.userById(topic.authorId,function(topicAuthor){
            info.topicAuthor = topicAuthor;

            self.newReplyByTopicId(topic.id,function(r){
                if(r){
                    info.newReply = r;
                    self.userById(r.authorId,function(replyAuthor){

                        if(replyAuthor){
                            info.replyAuthor = replyAuthor;
                        }
                        defer.resolve(info);
                        callback(info);
                    })
                }else{
                    defer.resolve(info);
                    callback(info);
                }
            })
        })

        return defer.promise;
    },

    // 获得信息
    topicsInfo:function(topics,callback){

        var self = this;

        var qList = [];

        topics.forEach(function(topic){
            qList.push(self.topicInfo(topic));
        });

        Q.all(qList).spread(function(){
            callback([].slice.apply(arguments));
        }).done();

    }


}

var dbs = require("./dbs");
var Q = require("q");

function oneday(date) {
    var date = date || new Date();
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.startTime = date.getTime();
    this.endTime = this.startTime + 1000 * 60 * 60 * 24;
}


module.exports = {

    "get user by id": function (id) {
        var defer = Q.defer();
        dbs.getDB("User").findOne({id: id}, function (err, user) {
            defer.resolve(user);
        })
        return defer.promise;
    },

    "get replyList by user's id": function (id, page) {

        page = parseInt(page) || 1;

        var defer = Q.defer();
        dbs.getDB("Reply").find({authorId: id})
            .limit(10)
            .sort({createTime: -1})
            .skip(10 * (page - 1))
            .toArray(function (err, result) {
                defer.resolve(result);
            })
        return defer.promise;
    },

    "get topicList by user's id": function (id, page) {

        page = parseInt(page) || 1;

        var defer = Q.defer();
        dbs.getDB("Reply").find({authorId: id})
            .limit(10)
            .sort({createTime: -1})
            .skip(10 * (page - 1))
            .toArray(function (err, result) {
                defer.resolve(result);
            })
        return defer.promise;
    },

    "get infoList by user's id": function (id, page) {

        page = parseInt(page) || 1;

        var defer = Q.defer();
        dbs.getDB("Info").find({targetId: id})
            .limit(10)
            .sort({createTime: -1})
            .skip(10 * (page - 1))
            .toArray(function (err, result) {
                defer.resolve(result);
            })
        return defer.promise;
    },

    "get messageList by user's id": function (id, page) {

        page = parseInt(page) || 1;

        var defer = Q.defer();
        dbs.getDB("Message").find({targetId: id})
            .limit(10)
            .sort({createTime: -1})
            .skip(10 * (page - 1))
            .toArray(function (err, result) {
                defer.resolve(result);
            })
        return defer.promise;
    },

    "get a user's reply count in today": function (authorId) {

        var defer = Q.defer();

        var date = new oneday();
        var db = dbs.getDB("Reply");
        db.count({
            authorId: authorId,
            createTime: {
                $gt: date.startTime,
                $lt: date.endTime
            }
        }, function (err, num) {
            defer.resolve(num || 0);
        });

        return defer.promise;
    },

    "get a user's topic count in today": function (authorId) {

        var defer = Q.defer();

        var date = new oneday();
        var db = dbs.getDB("Topic");
        db.count({
            authorId: authorId,
            createTime: {
                $gt: date.startTime,
                $lt: date.endTime
            }
        }, function (err, num) {
            defer.resolve(num || 0);
        })

        return defer.promise;
    }


}
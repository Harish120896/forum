var dbs = require("./db");
var Q = require("q");

function oneday(date) {
    var date = date || new Date();
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.startTime = date.getTime();
    this.endTime = this.startTime + 1000 * 60 * 60 * 24;
}

module.exports = {

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
        })
            .exec(function (err, num) {
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
        })
            .exec(function (err, num) {
                defer.resolve(num || 0);
            })

        return defer.promise;
    }

};
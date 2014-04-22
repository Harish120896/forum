var Q = require("q");

module.exports = function (my) {
    return function (req, res, next) {
        Q.all([
                my.query("get hot topics"),
                my.query("get top topics"),
                my.query("get all columns")
            ]).spread(function (hotList, topList, columnList) {
                res.locals.hotList = hotList;
                res.locals.topList = topList;
                res.locals.columnList = columnList;
                next();
            })
    }
}
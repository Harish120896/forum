var Q = require("q");
var Pager = require("./share_data/pager");

module.exports = function (my) {

    var share_data = require("./share_data")(my);

    function topicInfo(topic) {

        var defer = Q.defer();

        var info = {}

        my.query("get a user by id", {id: topic.authorId}).then(function (topicAuthor) {
            info.topicAuthor = topicAuthor;

            my.query("get a newest reply by topic's id", {id: topic.id}).then(function (r) {
                if (r) {
                    info.newReply = r;
                    my.query("get a user by id", {id: r.authorId}).then(function (replyAuthor) {
                        if (replyAuthor) {
                            info.replyAuthor = replyAuthor;
                        }
                        defer.resolve(info);
                    })
                } else {
                    defer.resolve(info);
                }
            })
        })

        return defer.promise;
    }

    my.app.get("/column",
        my.util.cookieLogin,
        share_data,
        function (req, res) {

            Q.all([
                    my.query("get topics by column's id", {id: req.query.id, page: req.query.page || 1}),
                    my.query("get a column by id", {id: req.query.id}),
                    my.query("get topic count by column's id", {id: req.query.id})
                ]).spread(function (topics, column, count) {

                    if (res.locals.column = column) {

                        res.locals.breadcrumb = "column";
                        res.locals.title = column.name;
                        res.locals.topics = topics;

                        res.locals.pager = Pager(count, parseInt(req.query.page) || 1, 10);

                        var topicInfosArr = [];

                        topics.forEach(function (topic) {
                            topicInfosArr.push(topicInfo(topic));
                        });

                        Q.all(topicInfosArr).then(function (rs) {
                            res.locals.topicsInfo = rs;
                            res.render("column");
                        })

                    } else {
                        res.send(404);
                    }
                }).fail(function (err) {
                    console.log(err);
                })
        })

    my.app.get("/topic/search",
        my.util.cookieLogin,
        share_data,
        function (req, res) {
            if (req.query.keyword) {
                Q.all([
                        my.query("search topics by keyword", {keyword: req.query.keyword, page: req.query.page}),
                        my.query("search topics count by keyword", {keyword: req.query.keyword})])
                    .spread(function (topics, count) {


                        res.locals.breadcrumb = "search";
                        res.locals.title = "搜索关键词: " + req.query.keyword;
                        res.locals.keyword = req.query.keyword;
                        res.locals.topics = topics;
                        res.locals.pager = Pager(count, parseInt(req.query.page) || 1, 10);

                        var topicInfosArr = [];

                        topics.forEach(function (topic) {
                            topicInfosArr.push(topicInfo(topic));
                        });

                        Q.all(topicInfosArr).then(function (rs) {
                            res.locals.topicsInfo = rs;
                            res.render("search");
                        })

                    })
            } else {
                res.send(404);
            }

        })

}
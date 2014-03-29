var Q = require("q");


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

                        // page info
                        var groupNum = 1,
                            groupMaxPageNum = 3,
                            itemNum = 3;

                        var page = res.locals.page = parseInt(req.query.page) || 1;
                        var pagenum = res.locals.pagenum = Math.floor(count / itemNum) + ( count % itemNum ? 1 : 0);

                        groupNum = Math.floor(page / (groupMaxPageNum - 1)) + ((page % (groupMaxPageNum - 1)) ? 1 : 0);
                        res.locals.groupNum = groupNum;
                        res.locals.groupMaxPageNum = groupMaxPageNum;

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

}
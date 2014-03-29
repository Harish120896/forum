var Q = require("q");
var markdown = require("marked");

module.exports = function (my) {

    var share_data = require("./share_data")(my);

    my.app.get("/topic",

        my.util.cookieLogin,
        share_data,

        function (req, res) {

            var topicId = req.query.id;

            Q.all([
                    my.query("get a topic by id", {id: topicId}),
                    my.query("get a column by topic's id", {id: topicId})
                ]).spread(function (topic, column) {

                    res.locals.topic = topic;
                    res.locals.title = topic.title;
                    res.locals.breadcrumb = "topic"
                    res.locals.column = column;
                    res.locals.markdown = markdown;

                    if (topic)
                        res.render("topic");
                    else
                        res.send(404);

                })
        });

    my.app.post("/topic/search",
        function (req, res) {
            var rs = req.result.data("topicList");
            res.send(rs);
        });

    my.app.post("/topic/create",
        my.util.isLogin,
        my.util.validat_num,
        function (req, res) {
            req.body.authorId = req.session.user.id;
            my.core.exec("create a topic", req.body, function (result) {
                res.send(result.json());
            })
        });

    my.app.post("/reply/create",
        my.util.isLogin,
        my.util.validat_num,
        function (req, res) {
            req.body.authorId = req.session.user.id;
            my.core.exec("create a reply", req.body, function (result) {
                res.send(result.json());
            });
        });

}
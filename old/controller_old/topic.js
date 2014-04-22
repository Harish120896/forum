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
        //回帖频率控制，过高会阻止发帖
        function (req,res,next){

            // 最后回帖时间
            var lastTime = req.session.user.replyLastTime;

            if(lastTime){
                // 测试是否回帖太频繁
                var xt = Date.now() - lastTime;
                req.session.user.replyLastTime = Date.now();
                if(xt > 5000){
                    next();
                }else{
                    req.result.error("freq","回帖过频繁，请注意哦！5秒后再发吧。");
                    res.send(req.result.json());
                }
            }else{
                req.session.user.replyLastTime = Date.now();
                next();
            }

        },
        function (req, res) {
            req.body.authorId = req.session.user.id;
            my.core.exec("create a reply", req.body, function (result) {
                res.send(result.json());
            });
        });

}
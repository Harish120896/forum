var data = require("../controller/data"),
    util = require("../controller/util");

module.exports = function wrap(app) {


    app.get("/",
        util.cookieLogin,
        data.share,
        function (req, res) {
            res.locals.breadcrumb = "index"
            res.render("index", { loginUser: req.session.user , pageType:"index"});
        });

    app.get("/topic/:id",
        util.cookieLogin,
        data.share,
        data.topicById,
        data.columnByTopicId,
        function (req, res) {
            var topic = req.result.data("topic");
            var column = req.result.data("column");
            if (topic) {
                res.locals.topic = topic;
                res.locals.column = column;
                res.locals.loginUser = req.session.user;
                res.locals.breadcrumb = "topic"
                res.render("topic");
            } else {
                res.send(404);
            }
        });

    app.get("/user/:id",
        util.cookieLogin,
        data.share,
        data.userById,
        util.hasUser,
        function (req, res) {
            if(req.result.hasError()){
                res.send(404);
            }else{
                res.locals.breadcrumb = "user";
                res.locals.user = req.result.data("user");
                res.locals.loginUser = req.session.user;
                res.render("user");
            }
        });

    app.get("/column/:id/:page?",
        util.cookieLogin,
        data.share,
        data.columnById,
        data.topicsByColumnId,
        function (req, res) {
            res.locals.breadcrumb = "column";
            if (res.locals.column = req.result.data("column")) {
                res.locals.topics = req.result.data("topics");

                var groupNum = 1,
                    groupMaxPageNum = 3,
                    itemNum = 3;

                var count = res.locals.count = req.result.data("count");
                var page = res.locals.page = req.result.data("page");
                res.locals.loginUser = req.session.user;
                var pagenum = res.locals.pagenum = Math.floor(count/itemNum) + ( count%itemNum ? 1 : 0);

                groupNum = Math.floor(page / (groupMaxPageNum-1)) + ((page % (groupMaxPageNum-1)) ? 1:0);
                res.locals.groupNum = groupNum;
                res.locals.groupMaxPageNum = groupMaxPageNum;
                res.render("column");
            } else {
                res.send(404);
            }
        });

    // doto
    app.get("/setNewPassword",
        function (req, res) {
            res.locals.code = req.param("code");
            res.locals.email = req.param("email");
            res.render("setNewPassword");
        });
}
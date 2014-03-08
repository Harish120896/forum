var data = require("../controller/data"),
    util = require("../controller/util");

module.exports = function wrap(app) {
    app.get("/",
        util.cookieLogin,
        data.share,
        util.cookieLogin,
        data.columnList,
        function (req, res) {
            res.render("index", {columns: req.result.data("columnList"), user: req.session.user});
        });

    app.get("/topic/:id",
        //data.share,
        util.cookieLogin,
        data.topicById,
        data.columnByTopicId,
        function (req, res) {
            var topic = req.result.data("topic");
            var column = req.result.data("column");
            if (topic) {
                res.locals.topic = topic;
                res.locals.column = column;
                res.render("topic");
            } else {
                res.send(404);
            }
        });

    app.get("/user/:id",
        util.cookieLogin,
        data.userById,
        util.hasUser,
        function (req, res) {
            res.locals.user = req.user;
            res.render("user");
        });

    app.get("/column/:id",
        //data.share,
        util.cookieLogin,
        data.columnById,
        data.topicsByColumnId,
        function (req, res) {
            var topics = req.result.data("topics");
            var column = req.result.data("column");
            if (column) {
                res.locals.topics = topics;
                res.locals.column = column;
                res.render("column");
            } else {
                res.send(404);
            }
        });

    app.get("/setNewPassword",
        function (req, res) {
            res.locals.code = req.param("code");
            res.locals.email = req.param("email");
            res.render("setNewPassword");
        });
}
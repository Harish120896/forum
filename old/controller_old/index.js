var Q = require("q");

module.exports = function (my) {

    var share_data = require("./share_data")(my);

    my.app.get("/refresh_num",
        my.util.refreshValidatNum,
        my.util.validatNumPng,
        function (req, res) {
            res.send(req.result.data("validatNumPng"));
        });

    my.app.get("/",
        my.util.cookieLogin,
        share_data,
        function (req, res) {

            var counts = [],
                managers = []; // 版主

            res.locals.columnList.forEach(function (col) {
                counts.push(my.query("get topic count by column's id", {id: col.id}));
                managers.push(my.query("get a user by id", {id: col.managerId}));
            })

            // 得到每个栏目的帖数
            Q.all(counts).spread(function () {
                res.locals.topicCountList = [].slice.apply(arguments);
                Q.all(managers).spread(function () {
                    res.locals.managers = [].slice.apply(arguments);
                    done();
                })
            })

            // 完成并渲染界面
            function done() {
                res.locals.title = "社区主页"
                res.locals.breadcrumb = "index"
                res.render("index", { loginUser: req.session.user, pageType: "index"});
            }
        });

}
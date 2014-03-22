
module.exports = function wrap(app,ctrls) {

    app.get("/topicTitleListByUserId/:id/:page",
        ctrls.data.topicTitleListByUserId,
        function(req,res){
            res.send(req.result.data("topicTitleList"))
        }
    )

    app.get("/topicCountByUserId/:id",
        ctrls.data.topicCountByUserId,
        function(req,res){
            res.send(req.result.data())
        })

    app.get("/replyIdsByUserId/:id/:page",
        ctrls.data.replyIdsByUserId,
        function(req,res){
            res.send(req.result.data("replyIds"))
        }
    )

    app.get("/topicById/:id",
        ctrls.data.topicById,
        function(req,res){
            res.send(req.result.data("topic"));
        }
    )

    app.get("/replyCountByUserId/:id",
        ctrls.data.topicCountByUserId,
        function(req,res){
            res.send(req.result.data())
        })

    app.get("/column/:id/get",
        ctrls.data.columnById,
        function (req, res) {
            var column = req.result.data("column");
            res.send(column)
        }
    )

    app.get("/user/:id/get",
        ctrls.data.userById,
        function (req, res) {
            var user = req.result.data("user");
            if(user){
                delete user.password;
            }
            res.send(user);
        });

    app.get("/reply/:id",
        ctrls.util.xhr,
        ctrls.data.replyById,
        function (req, res) {
            var reply = req.result.data("reply");
            res.send(reply);
        })

    app.get("/replyTree/:id",
        ctrls.util.xhr,
        ctrls.data.topicById,
        function (req, res) {
            var replyTree;
            var topic = req.result.data("topic");
            if (topic) {
                replyTree = topic.replyTree;
            }
            res.send(replyTree);
        }
    )

    app.get("/refresh_num",
        ctrls.util.refreshValidatNum,
        ctrls.data.validatNumPng,
        function (req, res) {
            res.send(req.result.data("validatNumPng"));
        })

    app.get("/messageList/:page",
        ctrls.util.isLogin,
        ctrls.data.messageListByUserId,
        function (req, res) {
            res.send(req.result.data("messageList"));
        }
    )

    app.get("/infoList/:page",
        ctrls.util.isLogin,
        ctrls.data.infoListByUserId,
        function(req,res){
            res.send(req.result.data("infoList"));
        }
    )

}
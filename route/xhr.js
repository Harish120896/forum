var data = require("../controller/data"),
    Tree = require("tree-node"),
    util = require("../controller/util");

module.exports = function wrap(app) {

    // app.get("/info",
    // 	util.xhr,
    // 	data.infoList,
    // 	function(req,res){
    //
    // 	});
    //
    // app.get("/message",
    // 	util.xhr,
    // 	data.messageList,
    // 	function(req,res){
    //
    // 	});

    app.get("/topicTitleListByUserId/:id/:page",
        data.topicTitleListByUserId,
        function(req,res){
            res.send(req.result.data("topicTitleList"))
        }
    )

    app.get("/topicCountByUserId/:id",
        data.topicCountByUserId,
        function(req,res){
            res.send(req.result.data())
        })

    app.get("/replyIdsByUserId/:id/:page",
        data.replyIdsByUserId,
        function(req,res){
            res.send(req.result.data("replyIds"))
        }
    )

    app.get("/topicById/:id",
        data.topicById,
        function(req,res){
            res.send(req.result.data("topic"));
        }
    )

    app.get("/replyCountByUserId/:id",
        data.topicCountByUserId,
        function(req,res){
            res.send(req.result.data())
        })

    app.get("/column/:id/get",
        data.columnById,
        function (req, res) {
            var column = req.result.data("column");
            res.send(column)
        }
    )

    app.get("/user/:id/get",
        data.userById,
        function (req, res) {
            var user = req.result.data("user");
            if(user){
                delete user.password;
            }
            res.send(user);
        });

    app.get("/reply/:id",
        util.xhr,
        data.replyById,
        function (req, res) {
            var reply = req.result.data("reply");
            res.send(reply);
        })

    app.get("/replyTree/:id",
        util.xhr,
        data.topicById,
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
        util.refreshValidatNum,
        data.validatNumPng,
        function (req, res) {
            res.send(req.result.data("validatNumPng"));
        })

    app.get("/messageList/:page",
        util.isLogin,
        data.messageListByUserId,
        function (req, res) {
            res.send(req.result.data("messageList"));
        }
    )

    app.get("/infoList/:page",
        util.isLogin,
        data.infoListByUserId,
        function(req,res){
            res.send(req.result.data("infoList"));
        }
    )

//
//    app.get("/user/logo/:nickname",
//        data.userByNick,
//        function(req,res){
//            var user = req.result.data("user");
//            if(user){
//
//            }else{
//                res.send(404);
//            }
//    })
}
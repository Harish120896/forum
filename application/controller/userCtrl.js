var express = require('express');
var router = express.Router();
var query = require("../query");
var domain = require("../../domain");

//router.get("/:id", function (req, res) {
//    query["get user by id"](req.params.id).then(function (user) {
//        res.send(user);
//    })
//})
//
//router.get("/:id/replyList", function (req, res) {
//    query["get replyList by user's id"](req.params.id, req.query.page)
//        .then(function (replyList) {
//            res.send(replyList);
//        })
//})
//
//router.get("/:id/topicList", function (req, res) {
//    query["get topicList by user's id"](req.params.id, req.query.page)
//        .then(function (topicList) {
//            res.send(topicList);
//        })
//})
//
//router.get("/:id/infoList", function (req, res) {
//    query["get infoList by user's id"](req.params.id, req.query.page)
//        .then(function (infoList) {
//            res.send(infoList);
//        })
//})
//
//router.get("/:id/messageList", function (req, res) {
//    query["get messageList by user's id"](req.params.id, req.query.page)
//        .then(function (messageList) {
//            res.send(messageList);
//        })
//})

router.post("/:id/follow", function (req, res) {
    domain.call("User.follow", req.params.id,[req.body.userId]);
    res.send();
})

router.post("/:id/unfollow", function (req, res) {
    domain.call("User.unfollow", req.params.id,[req.body.userId]);
    res.send();
})

router.post("/:id/updateInfo", function (req, res) {
    domain.call("User.updateInfo", req.params.id, [req.body])
        .then(function () {
            res.send();
        })
        .fail(function (err) {
            res.send(err);
        });
})


module.exports = router;
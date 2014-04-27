var express = require('express');
var router = express.Router();
var domain = require("../../domain");

router.post("/create", function (req, res) {
    domain.repos.Topic.create(req.body, function (err, topic) {
        res.send({error: err, topicId: topic._id});
    });
})

router.post("/:id/top", function (req, res) {
    domain.call("Topic.top", req.params.id);
    res.send();
})

router.post("/:id/untop", function (req, res) {
    domain.call("Topic.untop", req.params.id);
    res.send();
})

router.post("/:id/fine", function (req, res) {
    domain.call("Topic.fine", req.params.id);
    res.send();
})

router.post("/:id/unfine", function (req, res) {
    domain.call("Topic.unfine", req.params.id);
    res.send();
})

router.post("/:id/remove", function (req, res) {
    domain.repos.Topic.remove(req.params.id);
    res.send();
})

router.post("/:id/:replyId/remove", function (req, res) {
    domain.call("Topic.removeReply", req.params.id, [req.params.replyId]);
    res.send();
})

router.post("/:id/updateInfo", function (req, res) {
    domain.call("Topic.updateInfo", req.params.id, [req.body.title, req.body.body, req.body.columnId])
        .then(function () {
            res.send();
        })
        .fail(function (err) {
            res.send({error: err});
        })
})

module.exports = router;
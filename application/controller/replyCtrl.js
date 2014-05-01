var express = require('express');
var router = express.Router();
var domain = require("../../domain");

router.post("/create", function (req, res, next) {
    domain.repos.Reply.create(req.body, function (err, reply) {
        if (!reply) {
            next(err);
        } else {
            res.send({reply: {
                id: reply._id,
                title: reply._title,
                body: reply._body,
                authorId: reply._authorId,
                parentId: reply._parentId,
                topicId: reply._topicId,
                createTime: reply._createTime
            }});
        }

    });
})

module.exports = router;
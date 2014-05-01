var express = require('express');
var router = express.Router();
var domain = require("../../domain");

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.email === "brighthas@gmail.com") {
        next();
    } else {
        next(500);
    }
}

router.post("/columns/create", isAdmin);
router.post("/columns/:id/*", isAdmin);


function isLogin(req, res,next) {
    if (req.session.user) {
        req.body.authorId = req.session.user.id;
        next();
    } else {
        next(500);
    }
}
router.post("/messages/send", isLogin);
router.post("/replys/create", isLogin);

router.post("/topics/create", isLogin);
router.post("/topics/:id/*", function (req, res, next) {
    if (req.session.user) {
        if (req.session.user.email === "brighthas@gmail.com") {
            next();
        } else {
            domain.repos.Topic.get(req.params.id).then(function (topic) {

                if (topic) {
                    if (topic.authorId === req.session.user.id) {
                        next();
                    } else {
                        domain.repos.Column.get(topic.columnId).then(function (column) {
                            if (column.managerId === req.session.user.id) {
                                next();
                            } else {
                                next(500);
                            }
                        })
                    }

                } else {
                    next(500);
                }
            })
        }
    } else {
        next(500);
    }
});

router.post("/users/*",isLogin);

module.exports = router;
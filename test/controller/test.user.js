require("../util/testInit");
var dbs = require("../util/db");
var result = require("../../controller/util").result;

var env = require("../util/env");
var request = require("supertest");
var express = require("express");
var userCtrl = require("../../controller/user");
var assert = require("assert");
var should = require("should");
var DATA = require("../../controller/data");

describe("userCtrl", function () {

    it("#create", function (done) {


        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);
        app.post("/create", userCtrl.create, function (req, res) {
            if (req.result.hasError()) {

                res.send("error");
            } else {
                res.send("success");
            }
        });

        request(app).post("/create")
            .send({
                email: "leo2@leo.leo9",
                nickname: "leo2",
                password: "1234567"
            })
            .expect("success", done);
    })

    it("#login", function (done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/login", DATA.userByEmail, userCtrl.login, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                req.session.user.email.should.eql("leo@leo.leo");
                res.send("success");
            }
        });

        request(app).post("/login")
            .send({
                email: "leo@leo.leo",
                password: "123456"
            })
            .end(function (err, res) {
                var user = JSON.parse(decodeURIComponent(res.headers["set-cookie"][0]).split(";")[0].replace(/user=/g, ""));
                user.email.should.eql("leo@leo.leo")
                request(app).post("/login")
                    .send({
                        email: "leo@leo.leo",
                        password: "1234567"
                    })
                    .expect("error", done);
            });

    });


    it("#logout", function (done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/logout", DATA.userByEmail, userCtrl.login,
            userCtrl.logout, function (req, res) {
                assert.ok(null === req.session.user);
                res.send();
            });

        request(app).post("/logout")
            .send({
                email: "leo@leo.leo",
                password: "123456"
            })
            .expect("", done);

    })

    it("#update", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/update", DATA.userByEmail, userCtrl.login, userCtrl.update, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });

        setTimeout(function () {
            request(app).post("/update")
                .send({
                    email: "leo@leo.leo",
                    password: "123456",
                    address: "ddddd"
                })
                .expect("success", function () {
                    request(app).post("/update")
                        .send({
                            email: "leo@leo.leo",
                            password: "123456",
                            address: "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
                        })
                        .expect("error", done);
                });
        })

    })

    it("#seal", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/seal/:id", userCtrl.seal, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });

        request(app).post("/seal/u001")
            .send({})
            .expect("success", done);

    })


    it("#findPassword", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/findPassword",
            function (req, res, next) {
                req.result.data("user", {
                    email: "308212012@qq.com",
                    password: "1212121212"
                })
                next();
            },
            userCtrl.findPassword, function (req, res) {
                if (req.result.hasError()) {
                    res.send("error");
                } else {
                    res.send("success");
                }
            });

        request(app).post("/findPassword")
            .send({})
            .expect("success", done);

    })


    it("#follow", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/follow/:id",
            function (req, res, next) {
                req.session.user = {
                    id: "00111"
                }
                next();
            }, userCtrl.follow, function (req, res) {
                if (req.result.hasError()) {
                    res.send("error");
                } else {
                    res.send("success");
                }
            });

        request(app).post("/follow/u001")
            .send({})
            .expect("success", done);

    })

    it("#unfollow", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/unfollow/:id",
            function (req, res, next) {
                req.session.user = {
                    id: "00111"
                }
                next();
            }, userCtrl.unfollow, function (req, res) {
                if (req.result.hasError()) {
                    res.send("error");
                } else {
                    res.send("success");
                }
            });

        request(app).post("/unfollow/u001")
            .send({})
            .expect("success", done);

    })


    it("#becomeModerator", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/becomeModerator/:id",
            function (req, res, next) {
                req.session.user = {
                    id: "00111"
                }
                next();
            }, userCtrl.becomeModerator, function (req, res) {
                if (req.result.hasError()) {
                    res.send("error");
                } else {
                    res.send("success");
                }
            });

        request(app).post("/becomeModerator/u001")
            .send({})
            .expect("success", done);

    })

    it("#becomeUser", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/becomeUser/:id",
            function (req, res, next) {
                req.session.user = {
                    id: "00111"
                }
                next();
            }, userCtrl.becomeUser, function (req, res) {
                if (req.result.hasError()) {
                    res.send("error");
                } else {
                    res.send("success");
                }
            });

        request(app).post("/becomeUser/u001")
            .send({})
            .expect("success", done);

    })

    it("#updatePassword", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/updatePassword/:id",
            function (req, res, next) {
                req.result.data("user", {
                    id: "u0001",
                    password: "123"
                })
                next();
            }, userCtrl.updatePassword, function (req, res) {
                if (req.result.hasError()) {
                    res.send("error");
                } else {
                    res.send("success");
                }
            });

        request(app).post("/updatePassword/u001")
            .send({
                code: "123"
            })
            .expect("success", done);

    })

    it("#plus", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/plus/:id",
            userCtrl.plus, function (req, res) {
                if (req.result.hasError()) {
                    res.send("error");
                } else {
                    res.send("success");
                }
            });

        request(app).post("/plus/u001")
            .send({
                code: "123"
            })
            .expect("success", done);

    })

    it("#remove", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/remove/:id",
            userCtrl.remove, function (req, res) {
                if (req.result.hasError()) {
                    res.send("error");
                } else {
                    res.send("success");
                }
            });

        request(app).post("/remove/u001")
            .send({
                code: "123"
            })
            .expect("success", done);

    })

})

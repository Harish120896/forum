var dbs = require("../util/db")
var env = require("../util/env");
require("../util/testInit")
var request = require("supertest");
var express = require("express");
var topicCtrl = require("../../controller/topic");
var assert = require("assert");
var should = require("should");
var DATA = require("../../controller/data");
var util = require("../../controller/util");
var result = util.result;

describe("topicCtrl", function () {

    var tid;

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

        app.post("/create", function (req, res, next) {
            req.session.user = {
                id: "u001"
            };
            next();
        }, topicCtrl.create, function (req, res) {
            var topic = req.result.data("topic");
            tid = topic.id;
            if (req.result.hasError()) {
                res.send(req.result.toJSON())
            } else {
                res.send("success")
            }
        });

        request(app).post("/create")
            .send({
                title: "title001",
                body: "hahahhahhhahhaha",
                columnId: "c001"
            })
            .expect('success', done);
    });


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

        app.post("/update", function (req, res, next) {
            req.session.user = {
                id: "u001"
            };
            next();
        }, topicCtrl.update, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });

        request(app).post("/update")
            .send({
                topicId: tid,
                columnId: "c001",
                title: "title0000002",
                body: "hahahhahhhahhaha0001"
            })
            .expect('success', done);

    });

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

        app.post("/remove/:id", topicCtrl.remove, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });

        request(app).post("/remove/" + tid)
            .expect('success', done);

    });


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

        app.post("/seal/:id", topicCtrl.seal, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });

        request(app).post("/seal/" + tid)
            .expect('success', done);

    });


    it("#unseal", function (done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/unseal/:id", topicCtrl.unseal, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });

        request(app).post("/unseal/" + tid)
            .expect('success', done);

    });


    it("#access", function (done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/access/:id", topicCtrl.access, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });

        request(app).post("/access/" + tid)
            .expect('success', done);

    });

    it("#access", function (done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/access/:id", topicCtrl.access, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });

        request(app).post("/access/" + tid)
            .expect('success', done);

    });

    it("#removeReply", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(result);

        app.use(app.router);

        app.post("/removeReply/:id", topicCtrl.removeReply, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });

        request(app).post("/removeReply/" + tid)
            .expect('success', done);
    })

});

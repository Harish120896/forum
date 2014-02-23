var dbs = require("./util/db")
var env = require("./util/env");
require("./util/testInit");
var request = require("supertest");
var express = require("express");
var replyCtrl = require("../controller/reply");
var assert = require("assert");
var should = require("should");
var DATA = require("../controller/data");
var util = require("../controller/util");

describe("topicCtrl", function() {

    var rid;

    it("#create", function(done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
        app.use(app.router);

        app.post("/create", function(req, res, next) {
            req.session.user = {
                id: "u001"
            };
            next();
        }, replyCtrl.create, function(req, res) {
            res.send(req.result.json())
        });

        request(app).post("/create")
            .send({
                topicId: "t001",
                title: "reply title",
                body: "reply content"
            })
            .end(function(err, res) {
				rid = res.body.data.reply.id;
                should.exist(rid);
				done()
            });

    })

    // DOTO
    it("#remove", function(done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(env);
    
        app.use(app.router);
    
        app.post("/remove/:id", DATA.replyById,replyCtrl.remove, function(req, res) {
            res.send(req.result)
        });
        request(app).post("/remove/" + rid)
            .end(function() {
				done();
            });
    });

});

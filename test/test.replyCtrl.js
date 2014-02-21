var request = require("supertest");
var express = require("express");
var replyCtrl = require("../controller/reply");
var assert = require("assert");
var should = require("should");
var DATA = require("../controller/data");
var util = require("../controller/util");
var env = require("./util/env");
var dbs = require("./util/dbrepo").db2;
var domain = require("./util/domain");

describe("topicCtrl", function() {

    var rid;

    it("#create", function(done) {

        dbs.getDB("User").insert({
            id: "u00001"
        });

        domain.exec("create a topic", {
                id: "t00001",
                authorId: "u00001",
                columnId: "c0001",
                title: "topic title",
                body: "topic content"
            },
            function(err, topic) {

            });

        //dbs.getDB("Topic").insert({id:"t00001"});

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
                id: "u00001"
            };
            next();
        }, replyCtrl.create, function(req, res) {
            res.send(req.reply)
        });

        setTimeout(function() {
            request(app).post("/create")
                .send({
                    topicId: "t00001",
                    title: "title001",
                    body: "hahahhahhhahhaha"
                })
                .end(function(err, res) {

                    should.exist(res.body.id);
                    rid = res.body.id;

                    dbs.getDB("Reply").findOne({
                        id: rid
                    }, function(err, rs) {

                        should.exist(rs.id);

                        done()

                    });

                });
        })

    });



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

        app.post("/remove/:id", DATA.replyById, util.hasReply, replyCtrl.remove, function(req, res) {
            res.send(req.result)
        });

        request(app).post("/remove/" + rid)
            .end(function() {
                setTimeout(function() {
                    dbs.getDB("Reply").findOne({
                        id: rid
                    }, function(err, rs) {
                        should.not.exist(rs);
                        done()
                    });
                })
            });
    });

});

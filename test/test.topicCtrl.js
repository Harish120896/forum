var domain = require("../domain");
var should = require("should");
var request = require("supertest");
var identity = require("identity");

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var clearDB = require("./util/clearDB");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser("keyboard cat"));
app.use(session());

app.use('/', require("../application/controller/topicCtrl"));

var agent = request.agent(app);

describe("replyCtrl", function () {

    it("#clearDB", function (done) {
        clearDB().then(done);
    })

    var uid1, uid2, cid, tid;

    it("#create user", function (done) {
        identity.domain.repos.User.create({email: "1405491181@qq.com", password: "123456"}).then(function (user) {

            uid1 = user.id;
            identity.domain.repos.User.create({email: "xxdsfsdxx@qq.com", password: "123456"}).then(function (user) {
                uid2 = user.id;

                domain.repos.Column.create({name: "node.js", des: ""}, function (err, col) {
                    cid = col._id;
                    done();
                });

            });
        });

    })

    it("#/create", function (done) {


        agent
            .post("/create")
            .send({
                title: "topic title",
                body: "topic body",
                authorId: uid1,
                columnId: cid
            }).end(function (err, res) {
                tid = res.body.topicId;
                domain.repos.Topic.get(res.body.topicId).then(function (topic) {
                    should.exist(topic);
                    done();
                })
            })

    })

    it("#/:id/top", function (done) {
        agent
            .post("/" + tid + "/top")
            .end(function (err, res) {
                domain.repos.Topic.get(tid).then(function (topic) {
                    topic._top.should.eql(true);
                    done();
                })
            })
    })

    it("#/:id/untop", function (done) {
        agent
            .post("/" + tid + "/untop")
            .end(function (err, res) {
                domain.repos.Topic.get(tid).then(function (topic) {
                    topic._top.should.eql(false);
                    done();
                })
            })
    })

    it("#/:id/fine", function (done) {
        agent
            .post("/" + tid + "/fine")
            .end(function (err, res) {
                domain.repos.Topic.get(tid).then(function (topic) {
                    topic._fine.should.eql(true);
                    done();
                })
            })
    })

    it("#/:id/unfine", function (done) {
        agent
            .post("/" + tid + "/unfine")
            .end(function (err, res) {
                domain.repos.Topic.get(tid).then(function (topic) {
                    topic._fine.should.eql(false);
                    done();
                })
            })
    })

    it("#/:id/:replyId/remove", function (done) {

        domain.repos.Topic.get(tid).then(function (topic) {
            topic._replyTree.allChildIds.length.should.eql(0);
            topic.addReply(null, "rid000");
            topic._replyTree.allChildIds.length.should.eql(1);

            agent
                .post("/" + tid + "/rid000/remove")
                .end(function (err, res) {
                    domain.repos.Topic.get(tid).then(function (topic) {
                        topic._replyTree.allChildIds.length.should.eql(0);
                        done();
                    })
                })
        })

    })

    it("#/:id/updateInfo", function (done) {
        agent
            .post("/" + tid + "/updateInfo")
            .send({ title: "mmm", body: "nnn", columnId: cid })
            .end(function (err, res) {
                domain.repos.Topic.get(tid).then(function (topic) {
                    topic._title.should.eql("mmm");
                    topic._body.should.eql("nnn");
                    done();
                })
            })
    })

    it("#/:id/remove",function(done){
        agent
            .post("/" + tid + "/remove")
            .end(function(){
                domain.repos.Topic.get(tid).then(function (topic) {
                   should.not.exist(topic)
                    done()
                })
            })
    })

})
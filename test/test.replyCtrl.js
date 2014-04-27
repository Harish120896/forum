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

app.use('/', require("../application/controller/replyCtrl"));

var agent = request.agent(app);

describe("replyCtrl", function () {

    it("#clearDB", function (done) {
        clearDB().then(done);
    })

    var uid1, uid2, tid;

    it("#create user", function (done) {
        identity.domain.repos.User.create({email: "1405491181@qq.com", password: "123456"}).then(function (user) {

            uid1 = user.id;
            identity.domain.repos.User.create({email: "xxdsfsdxx@qq.com", password: "123456"}).then(function (user) {
                uid2 = user.id;

                domain.repos.Column.create({name: "node.js", des: ""}, function (err, col) {
                    domain.repos.Topic.create({
                        columnId: col._id,
                        title: "mytopic title",
                        body: "gagagaga",
                        authorId: uid1
                    }, function (err, topic) {
                        tid = topic._id;
                    })
                });

                setTimeout(done);
            });
        });

    })

    it("#/create", function (done) {


        agent
            .post("/create")
            .send({
                authorId: uid2,
                topicId: tid,
                body: "hi uid1"
            }).end(function (err, res) {
                domain.repos.Reply.get(res.body.replyId).then(function (r) {
                    should.exist(r);
                    done();

                })

            })

    })

})
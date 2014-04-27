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

app.use('/', require("../application/controller/messageCtrl"));

var agent = request.agent(app);

describe("messageCtrl", function () {

    it("#clearDB", function (done) {
        clearDB().then(done);
    })

    var uid1, uid2;

    it("#create user", function (done) {
        identity.domain.repos.User.create({email: "1405491181@qq.com", password: "123456"}).then(function (user) {

            uid1 = user.id;
            identity.domain.repos.User.create({email: "xxdsfsdxx@qq.com", password: "123456"}).then(function (user) {
                uid2 = user.id;
                setTimeout(done);
            });
        });

    })

    it("#/send", function (done) {


        agent
            .post("/send")
            .send({
                targetId: uid1,
                authorId: uid2,
                title: "mytitle",
                body: "hi"
            }).end(function (err, res) {
                if (res.body.messageId) {

                    domain.repos.Message.get(res.body.messageId).then(function (msg) {
                        if (msg) {
                            done();
                        }
                    })

                }

            })

    })

})
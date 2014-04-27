var domain = require("../domain");
var should = require("should");
var request = require("supertest");
var identity = require("identity");

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var clearDB =require("./util/clearDB");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser("keyboard cat"));
app.use(session());

app.use('/', require("../application/controller/userCtrl"));

var agent = request.agent(app);

describe("userCtrl", function () {

    it("#clearDB", function (done) {
        clearDB().then(done);
    })

    var uid1, uid2;

    it("#create a user", function (done) {
        identity.domain.repos.User.create({email: "1405491181@qq.com", password: "123456"}).then(function (user) {

            uid1 = user.id;
            identity.domain.repos.User.create({email: "xxdsfsdxx@qq.com", password: "123456"}).then(function (user) {
                uid2 = user.id;
                setTimeout(done);
            });
        });

    })

    it("#/:id/follow", function (done) {

        agent
            .post("/" + uid1 + "/follow")
            .send({userId: uid2}).end(function () {
                domain.repos.User.get(uid1).then(function (user) {
                    user.follows[0].should.eql(uid2);
                    domain.repos.User.get(uid2).then(function (user) {
                        user.watchers[0].should.eql(uid1);
                        done();
                    })
                })
            })

    })

    it("#/:id/unfollow", function (done) {
        agent
            .post("/" + uid1 + "/unfollow")
            .send({userId: uid2}).end(function () {
                domain.repos.User.get(uid1).then(function (user) {
                    user.follows.should.eql([]);
                    domain.repos.User.get(uid2).then(function (user) {
                        user.watchers.should.eql([]);
                        done();
                    })
                })
            });

    })

    it("#/:id/updateInfo", function (done) {
        agent
            .post("/" + uid1 + "/updateInfo")
            .send({des: "mygod"}).end(function (err,res) {
                domain.repos.User.get(uid1).then(function (user) {
                   user._des.should.eql("mygod");
                    done()
                })
            });

    })

//    it("#/:id",function(done){
//        agent.get("/"+uid1).end(function(err,res){
//            res.body.des.should.eql("mygod");
//            done()
//
//        })
//    })
//
//    it("#/:id/replyList",function(done){
//        agent.get("/"+uid1+"/replyList").end(function(err,res){
//            res.body.should.eql([]);
//            done()
//        })
//    })
//
//    it("#/:id/topicList",function(done){
//        agent.get("/"+uid1+"/topicList").end(function(err,res){
//            res.body.should.eql([]);
//            done()
//        })
//    })
//
//    it("#/:id/infoList",function(done){
//        agent.get("/"+uid1+"/infoList").end(function(err,res){
//            res.body.should.eql([]);
//            done()
//        })
//    })
//
//    it("#/:id/messageList",function(done){
//        agent.get("/"+uid1+"/messageList").end(function(err,res){
//            res.body.should.eql([]);
//            done()
//        })
//    })


})
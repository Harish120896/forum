var domain = require("../domain");
var should = require("should");
var request = require("supertest");
var clearDB = require("./util/clearDB");
var identity = require("identity");

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");


describe("columnCtrl", function () {

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
                    col.setManager(uid2);
                    cid = col._id;
                    domain.repos.Topic.create({
                        title: "title002",
                        body: "body002",
                        authorId: uid1,
                        columnId: cid
                    }, function (err, t) {
                        tid = t._id;
                        done();
                    });
                });

            });
        });

    })


    it("#isLogin", function (done) {

        var app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded());
        app.use(cookieParser("keyboard cat"));
        app.use(session());

        app.use('/', require("../application/controller/accessControl"));

        app.use(function(err,req,res,next){
            if(err){
                res.send("500");
            }
        })

        var app2 = express();
        app2.use(bodyParser.json());
        app2.use(bodyParser.urlencoded());
        app2.use(cookieParser("keyboard cat"));
        app2.use(session());

        app2.use(function(req,res,next){
            req.session.user  = {
                id:"u001"
            }
            next();
        })

        app2.use('/', require("../application/controller/accessControl"));

        app2.use("/messages/send",function(req,res){
            res.send("success")
        })

        app2.use(function(err,req,res,next){
            if(err){
                res.send("500");
            }
        })

        request(app).post("/messages/send").end(function (err, res) {
            res.text.should.eql("500");
            request(app2).post("/messages/send").end(function(err,res){
                res.text.should.eql("success");
                done();
            })
        })

    })


    it("#isAdmin", function (done) {

        var app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded());
        app.use(cookieParser("keyboard cat"));
        app.use(session());

        app.use('/', require("../application/controller/accessControl"));

        app.use(function(err,req,res,next){
            if(err){
                res.send("500");
            }
        })

        var app2 = express();
        app2.use(bodyParser.json());
        app2.use(bodyParser.urlencoded());
        app2.use(cookieParser("keyboard cat"));
        app2.use(session());

        app2.use(function(req,res,next){
            req.session.user  = {
                id:"u001",
                email:"brighthas@gmail.com"
            }
            next();
        })

        app2.use('/', require("../application/controller/accessControl"));

        app2.use("/columns/create",function(req,res){
            res.send("success")
        })

        app2.use(function(err,req,res,next){
            if(err){
                res.send("500");
            }
        })

        request(app).post("/columns/create").end(function (err, res) {
            res.text.should.eql("500");
            request(app2).post("/columns/create").end(function(err,res){
                res.text.should.eql("success");
                done();
            })
        })

    })


    it("#isManager", function (done) {

        var app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded());
        app.use(cookieParser("keyboard cat"));
        app.use(session());

        app.use('/', require("../application/controller/accessControl"));

        app.use(function(err,req,res,next){
            if(err){
                res.send("500");
            }
        })

        var app2 = express();
        app2.use(bodyParser.json());
        app2.use(bodyParser.urlencoded());
        app2.use(cookieParser("keyboard cat"));
        app2.use(session());

        app2.use(function(req,res,next){
            req.session.user  = {
                id:uid2
            }
            next();
        })

        app2.use('/', require("../application/controller/accessControl"));

        app2.use("/topics/:id/x",function(req,res){
            res.send("success")
        })

        app2.use(function(err,req,res,next){
            if(err){
                res.send("500");
            }
        })

        request(app).post("/topics/"+tid+"/x").end(function (err, res) {
            res.text.should.eql("500");
            request(app2).post("/topics/"+tid+"/x").end(function(err,res){
                res.text.should.eql("success");
                done();
            })
        })

    })

})
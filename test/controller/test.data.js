require("../util/testInit")
var data = require("../../controller/data");
var request = require("supertest");
var express = require("express");
var should = require("should");
var util = require("../../controller/util");
var result = util.result;
var assert = require("assert");

var dbs = require("../util/db")
var env = require("../util/env");

describe("data", function() {

    var uid;
    it("#userByEmail", function(done) {
        var app = express();
        app.use(result);

        app.use(env);

        app.get("/user", data.userByEmail, function(req, res) {
            var user = req.result.data("user");
            uid = user.id;
            res.send(user ? user.email : null);
        })
        request(app).get("/user?email=leo@leo.leo").expect("leo@leo.leo", done);
    });


    it("#userById", function(done) {

        var app = express();
        app.use(result);

        app.use(env);
        app.get("/user", data.userById, function(req, res) {

            var user = req.result.data("user");
            uid = user.id;
            res.send(user ? user.email : null);
        })
        request(app).get("/user?id=u001").expect("leo@leo.leo", done);
    });


    it("#topicById", function(done) {

        var app = express();
        app.use(result);

        app.use(env);

        app.get("/topic/:id", data.topicById, function(req, res) {
            var topic = req.result.data("topic");
            res.send(topic.id);
        });

        request(app).get("/topic/t001").expect("t001", done);

    });

    it("#replyById", function(done) {

        var db = dbs.getDB("Reply");

        db.insert({
            id: "00100"
        }, function(err, rs) {

            rs.id.should.eql("00100");

            var app = express();
            app.use(result);

            app.use(env);

            app.get("/reply/:id", data.replyById, function(req, res) {
                res.send(req.result.data("reply").id);
            });

            request(app).get("/reply/" + rs.id).expect("00100", done);

        });

    });

    it("#columnById", function(done) {

        var app = express();
        app.use(result);

        app.use(env);

        app.get("/column/:id", data.columnById, function(req, res) {
            res.send(req.result.data("column").id);
        });

        request(app).get("/column/c001").expect("c001", done);

    })

    it("#columnList", function(done) {

        var app = express();
        app.use(result);
        app.use(env);

        app.get("/columns", data.columnList, function(req, res) {
            res.send(req.result.data("columnList"));
        });

        request(app).get("/columns").end(function(err, res) {
			res.body.should.be.an.Array;
            done()
        });
		
    })
	
	it("#validatNumPng",function(done){
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(result);
		app.use(env);
		app.use(app.router);
		

        app.get("/validatNumPng", data.validatNumPng, function(req, res) {
			var result = req.result.data("validatNumPng");
            res.send(result);
        });

        request(app).get("/validatNumPng").end(function(err, res) {
			// res.body.should.be.an.Array;
			should.exist(res.text);
            done()
        });
	})

	it("#topicsByColumnId",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(result);
		app.use(env);
		app.use(app.router);
		

        app.get("/topicsByColumnId/:id", data.topicsByColumnId, function(req, res) {
			var result = req.result.data("topics");
            res.send(result);
        });

        request(app).get("/topicsByColumnId/c001").end(function(err, res) {
			// res.body.should.be.an.Array;
			should.exist(res.body);
            done()
        });
		
	})


});

require("./util/testInit")
var data = require("../controller/data");
var request = require("supertest");
var express = require("express");
var should = require("should");
var util = require("../controller/util");
var assert = require("assert");

var dbs = require("./util/db")
var env = require("./util/env");

describe("data",function(){
	
	var uid;
	it("#userByEmail",function(done){
		var app = express();
		app.use(env);		
		
		app.get("/user",data.userByEmail,function(req,res){
			var user = req.result.data("user");
			uid = user.id;
			res.send(user ? user.email : null);
		})
		request(app).get("/user?email=leo@leo.leo").expect("leo@leo.leo",done);
	});
	
	
	it("#userById",function(done){
		
		var app = express();
		app.use(env);		
		app.get("/user",data.userById,function(req,res){
			
			var user = req.result.data("user");
			uid = user.id;
			res.send(user ? user.email : null);
		})
		request(app).get("/user?id=u001").expect("leo@leo.leo",done);
	});
	
		
	it("#topicById",function(done){
		
		
			var app = express();
			app.use(env);
			
			app.get("/topic/:id",data.topicById,function(req,res){
				var topic = req.result.data("topic");
				res.send(topic.id);
			});
			
			request(app).get("/topic/t001").expect("t001",done);
						

	});
	
	it("#replyById",function(done){
		
		var db = dbs.getDB("Reply");
		
		db.insert({id:"00100"},function(err,rs){
			
			rs.id.should.eql("00100");

			var app = express();
			app.use(env);
			
			app.get("/reply/:id",data.replyById,function(req,res){
				res.send(req.result.data("reply").id);
			});
			
			request(app).get("/reply/"+rs.id).expect("00100",done);
						
		});

	});	
	
});
	
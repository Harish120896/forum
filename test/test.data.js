var data = require("../app/data");
var request = require("supertest");
var express = require("express");
var should = require("should");
var util = require("../app/util");
var dbs = require("../app/db");
var validator = require("../app/validator");
var assert = require("assert");

describe("data",function(){
	
	it("#user",function(done){
		var app = express();
		app.get("/user",data.user("email"),function(req,res){
			res.send(req.user ? req.user.email : null);
		})
		request(app).get("/user?email=brighthas@gmail.com").expect("brighthas@gmail.com",done);
	});
	
	
	it("#topic",function(done){
		var db = dbs.getDB("Topic");
		db.create({id:"001"},function(err,rs){
			
			rs.id.should.eql("001");

			var app = express();
			
			app.get("/topic/:id",data.topic,function(req,res){
				res.send(req.topic.id);
			});
			
			request(app).get("/topic/001").expect("001",done);
						
		});

	});
	
	it("#reply",function(done){
		
		var db = dbs.getDB("Reply");
		
		db.create({id:"00100"},function(err,rs){
			
			rs.id.should.eql("00100");

			var app = express();
			
			app.get("/reply/:id",data.reply,function(req,res){
				res.send(req.reply.id);
			});
			
			request(app).get("/reply/00100").expect("00100",done);
						
		});

	});	
	
});
	
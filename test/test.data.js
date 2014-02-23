var data = require("../controller/data");
var request = require("supertest");
var express = require("express");
var should = require("should");
var util = require("../controller/util");
var assert = require("assert");

var cdb = require("./util/db")
var query = require("./util/query")(cdb())
var domain = require("./util/domain")(query);
var dbs = query.dbs;
var env = require("./util/env")(domain,query);

describe("data",function(){
	
	var uid;
	it("#userByEmail",function(done){
		var app = express();
		app.use(env);
		
		dbs.getDB("User").insert({email:"brighthas@gmail.com",id:"u00001"})
		
		
		app.get("/user",data.userByEmail,function(req,res){
			uid = req.user.id;
			res.send(req.user ? req.user.email : null);
		})
		request(app).get("/user?email=brighthas@gmail.com").expect("brighthas@gmail.com",done);
	});
	
	
	it("#userById",function(done){
		
		var app = express();
		app.use(env);
		
		dbs.getDB("User").insert({email:"brighthas@gmail.com",id:"u00001"});
		
		app.get("/user",data.userById,function(req,res){
			
			//console.log(req.user)
			
			res.send(req.user ? req.user.email : null);
		})
		request(app).get("/user?id=u00001").expect("brighthas@gmail.com",done);
	});
	
		
	it("#topicById",function(done){
		
		var db = dbs.getDB("Topic");
		
		db.insert({id:"001"},function(err,rs){
			
			rs.id.should.eql("001");

			var app = express();
			app.use(env);
			
			app.get("/topic/:id",data.topicById,function(req,res){
				res.send(req.topic.id);
			});
			
			request(app).get("/topic/"+rs.id).expect("001",done);
						
		});

	});
	
	it("#replyById",function(done){
		
		var db = dbs.getDB("Reply");
		
		db.insert({id:"00100"},function(err,rs){
			
			rs.id.should.eql("00100");

			var app = express();
			app.use(env);
			
			app.get("/reply/:id",data.replyById,function(req,res){
				res.send(req.reply.id);
			});
			
			request(app).get("/reply/"+rs.id).expect("00100",done);
						
		});

	});	
	
});
	
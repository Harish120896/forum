var request = require("supertest");
var express = require("express");
var topicCtrl = require("../controller/topic");
var assert = require("assert");
var should = require("should");
var DATA = require("../controller/data");

describe("topicCtrl",function(){
	
	it("#create",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/create",function(req,res,next){
				req.session.user = {id:"bc60cf90-90ad-11e3-9c63-f58e948ec7ef"};
				next();
			},topicCtrl.create,function(req,res){
			res.send(req.result)
		});
		
		request(app).post("/create")
			.send({title:"title001",body:"hahahhahhhahhaha"})
			.expect('success',done);
		
	});
	

});
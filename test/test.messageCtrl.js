

var cdb = require("./util/db")
var query = require("./util/query")(cdb())
var domain = require("./util/domain")(query);
var dbs = query.dbs;
var env = require("./util/env")(domain,query);


var request = require("supertest");
var express = require("express");
var messageCtrl = require("../controller/message");
var assert = require("assert");
var should = require("should");
var DATA = require("../controller/data");


describe("columnCtrl",function(){
	
	it("#send",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(env);
		app.use(app.router);
		
		var messagedb = dbs.getDB("Message");
		var udb = dbs.getDB("User");
		
		
		udb.insert({id:"u123",nickname:"u123"},function(){
			
			
			app.post("/send",
				function(req,res,next){
					req.session.user = {id:"001"}
					next();
				},
				messageCtrl.send,
				function(req,res){
					res.send();
				});
		
			request(app).post("/send")
				.send({title:"title001",body:"hahahhahhhahhaha @u123"})
				.end(function(){
					
					done();
				});
		});
		
		
	});

});
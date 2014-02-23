var request = require("supertest");
var express = require("express");
var columnCtrl = require("../controller/column");
var assert = require("assert");
var should = require("should");
var env = require("./util/env");
var result = require("../controller/util").result;

var DATA = require("../controller/data");

describe("columnCtrl",function(){
	
	it("#create",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		
		app.use(result);
		app.use(env);
		app.use(app.router);
		
		app.post("/create",columnCtrl.create,function(req,res){
			if(req.result.hasError()){
				res.send("error");
			}else{
				res.send("success");
			}
		});
		
		request(app).post("/create")
			.send({name:"title001",body:"hahahhahhhahhaha"})
			.expect('success',done);
		
	});
	
	it("#update",function(done){
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(result);
		app.use(env);
		app.use(app.router);
		
		
		app.post("/update",columnCtrl.create,function(req,res){
			if(req.result.hasError()){
				res.send("error");
			}else{
				res.send("success");
			}
		});
		
		request(app).post("/update")
			.send({name:"title001",body:"hahahhahhhahhaha"})
			.expect('success',done);
				
	})
	
		

});
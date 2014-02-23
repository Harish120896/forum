require("./util/testInit");
var dbs = require("./util/db");

var env = require("./util/env");
var request = require("supertest");
var express = require("express");
var userCtrl = require("../controller/user");
var assert = require("assert");
var should = require("should");
var DATA = require("../controller/data");

describe("userCtrl",function(){
	
	it("#create",function(done){
		
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
        app.use(env);
		
		app.use(app.router);
		
		app.post("/create",userCtrl.create,function(req,res){
            if(req.result.hasError()){
            	res.send("error");
            }else{
            	res.send("success");
            }
		});
		
		request(app).post("/create")
		.send({email:"leo2@leo.leo",nickname:"leo2",password:"1234567"})
		.expect("success",done);		
	})
	
	it("#login",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
	        app.use(env);
		
		app.use(app.router);
		
		app.post("/login",DATA.userByEmail,userCtrl.login,function(req,res){
			if(req.result.hasError()){
				res.send("error");
			}else{
				req.session.user.email.should.eql("leo@leo.leo");
				res.send("success");
			}
		});
		
		request(app).post("/login")
		.send({email:"leo@leo.leo",password:"123456"})
		.end(function(err,res){
			var user = JSON.parse(decodeURIComponent(res.headers["set-cookie"][0]).split(";")[0].replace(/user=/g,""));
			user.email.should.eql("leo@leo.leo")
			request(app).post("/login")
			.send({email:"leo@leo.leo",password:"1234567"})
			.expect("error",done);
		});
		
	});
	
	
	it("#logout",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
	        app.use(env);
		
		app.use(app.router);
		
		app.post("/logout",DATA.userByEmail,userCtrl.login,
		userCtrl.logout,function(req,res){
			assert.ok(null === req.session.user);
			res.send();
		});
		
		request(app).post("/logout")
		.send({email:"leo@leo.leo",password:"123456"})
		.expect("",done);
		
	})
	
	it("#update",function(done){
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
	        app.use(env);
		
		app.use(app.router);
	
		app.post("/update",DATA.userByEmail,userCtrl.login,userCtrl.update,function(req,res){
			if(req.result.hasError()){
				res.send("error");
			}else{
				res.send("success");
			}
		});
	
		setTimeout(function(){
			request(app).post("/update")
			.send({email:"leo@leo.leo",password:"123456",address:"ddddd"})
			.expect("success",function(){
				request(app).post("/update")
				.send({email:"leo@leo.leo",password:"123456",address:"ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"})
				.expect("error",done);			
			});			
		})
	
	})
	
	
	
})
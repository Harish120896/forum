var request = require("supertest");
var express = require("express");
var util = require("../app/util");
var userCtrl = require("../app/controller/user");
var validator = require("../app/validator");
var assert = require("assert");
var DATA = require("../app/data");

describe("validator",function(){
	
	it("#validat_num",function(done){
		
		var app = express();
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.get("/refresh",util.refreshValidatNum);
		request(app).get("/refresh").expect(/[0~9]*/g,done);
		
	})
	
	it("#hasReqUser",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/hasReqUser",DATA.user("email"),validator.hasReqUser,function(req,res){
			res.send("success")
		});
		request(app).post("/hasReqUser").send({email:"leo@leo.leo"}).expect("success",done);
		
	})
		
	it("#isLogin",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);

		app.post("/isLogin",DATA.user("email"),userCtrl.login,validator.isLogin,function(req,res){
			res.send("success");
		});
		request(app).post("/isLogin").send({email:"leo@leo.leo",password:"123456"}).expect("success",done);		
	})
	
	it("#userNoSelf",function(done){

		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/noself",function(req,res,next){
			req.user = {id:"001"};
			req.session.user = {id:"002"};
			next();
		},validator.userNoSelf),function(req,res){
			res.send("error");
		};
		
		request(app).post("/noself").expect("success",function(){
			
			var app = express();
			app.use(express.favicon());
			app.use(express.json());
			app.use(express.methodOverride());
			app.use(express.cookieParser('your secret here'));
			app.use(express.session());
			app.use(app.router);
			
			app.post("/noself",function(req,res,next){
				req.user = {id:"001"};
				req.session.user = {id:"001"};
				next();
			},validator.userNoSelf,function(req,res){
				res.send("error");
			});
		
			request(app).post("/noself").expect("error",done);
				
		});		
		
	})
	
	it("#isAdmin",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);		
		
		app.post("/isAdmin",DATA.user("email"),userCtrl.login,validator.isLogin,validator.isAdmin,function(req,res){
			res.send(req.result);
		});
		request(app).post("/isAdmin")
			.send({email:"brighthas@gmail.com",
			password:"zshying"}).expect("success",function(){
				done();
			});				
	})
	
	it("#userSelf",function(done){

		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/noself",function(req,res,next){
			req.user = {id:"001"};
			req.session.user = {id:"002"};
			next();
		},validator.userSelf),function(req,res){
			res.send("error");
		};
		
		request(app).post("/noself").expect("error",function(){
			
			var app = express();
			app.use(express.favicon());
			app.use(express.json());
			app.use(express.methodOverride());
			app.use(express.cookieParser('your secret here'));
			app.use(express.session());
			app.use(app.router);
			
			app.post("/noself",function(req,res,next){
				req.user = {id:"001"};
				req.session.user = {id:"001"};
				next();
			},validator.userSelf,function(req,res){
				res.send("error");
			});
		
			request(app).post("/noself").expect("success",done);
				
		});		
		
	});
	
	it("#hasTopic",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/topic/:id",DATA.topic,validator.hasTopic,function(req,res){
			res.send(req.result);
		});
	
		request(app).post("/topic/001").expect("success",done);
			
	})
	
	
})
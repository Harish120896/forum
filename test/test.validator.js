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
	
	
	
	
})
var request = require("supertest");
var express = require("express");
var userCtrl = require("../app/controller/user");
var DATA = require("../app/data");

describe("app",function(){
	
	it("#login",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/login",DATA.user("email"),userCtrl.login);
		
		request(app).post("/login")
		.send({email:"leo@leo.leo",password:"123456"})
		.expect('',function(){
			request(app).post("/login")
			.send({email:"leo@leo.leo",password:"1234567"})
			.expect(["邮箱或密码错误!"],done)
		})
		
	});
	
	
})
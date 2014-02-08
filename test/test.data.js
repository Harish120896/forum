var data = require("../app/data");
var request = require("supertest");
var express = require("express");
var util = require("../app/util");
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
	
	
	
	
});
	
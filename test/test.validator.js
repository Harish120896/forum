var request = require("supertest");
var express = require("express");
var util = require("../app/util");
var validator = require("../app/validator");
var assert = require("assert");

describe("validator",function(){
	
	it("#validat_num",function(done){
		
		var app = express();
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.get("/refresh",util.refreshValidatNum);
		request(app).get("/refresh").expect(/[0~9]*/g,done);
		
	})
	
	
	
})
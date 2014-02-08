var http = require("supertest");
var express = require("express");
var validator = require("../app/validator");
var assert = require("assert");

describe("validator",function(){
	it("#validat_num",function(){
		var app = express();
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		
		
		
	})
})
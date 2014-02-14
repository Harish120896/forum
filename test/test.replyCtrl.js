var request = require("supertest");
var express = require("express");
var replyCtrl = require("../controller/reply");
var assert = require("assert");
var should = require("should");
var DATA = require("../controller/data");
var util = require("../controller/util");

describe("topicCtrl",function(){
	
	var rid;
	
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
			},replyCtrl.create,function(req,res){
			res.send(req.reply)
		});
		
		request(app).post("/create")
			.send({topicId:"1e3adfe0-92ce-11e3-91e8-476cb2ad5817",title:"title001",body:"hahahhahhhahhaha"})
			.end(function(err,res){
					should.exist(res.body.id);
					rid = res.body.id;
					done()
			});
		
	});
	

		
	// DOTO
	it("#remove",function(done){
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);

		app.post("/remove/:id",DATA.replyById,util.hasReply,function(req,res,next){
			next()
			
		},replyCtrl.remove,function(req,res){
			res.send(req.result)
		});
		
		request(app).post("/remove/"+rid)
			.end(done);
		
	});

});
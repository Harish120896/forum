
var cdb = require("./util/db")
var query = require("./util/query")(cdb())
var domain = require("./util/domain")(query);
var dbs = query.dbs;
var env = require("./util/env")(domain,query);

var request = require("supertest");
var express = require("express");
var topicCtrl = require("../controller/topic");
var assert = require("assert");
var should = require("should");
var DATA = require("../controller/data");



describe("topicCtrl",function(){
	
	var tid;
	
	it("#create",function(done){
		
		dbs.getDB("User").insert({id:"u001"},function(){
			dbs.getDB("Column").insert({id:"c001"},function(err,c){
				console.log(c)
				var app = express();
				app.use(express.favicon());
				app.use(express.json());
				app.use(express.methodOverride());
				app.use(express.cookieParser('your secret here'));
				app.use(express.session());
		        app.use(env);
		
				app.use(app.router);
		
				app.post("/create",function(req,res,next){
						req.session.user = {id:"u001"};
						next();
					},topicCtrl.create,function(req,res){
						tid  =  req.topic.id;
						if(req.result.hasError()){
							res.send(req.result.toJSON())
						}else{
			
							res.send("success")
						}
				});
		
				request(app).post("/create")
					.send({title:"title001",body:"hahahhahhhahhaha",columnId:"c001"})
					.expect('success',done);				
			});		
			
		});
		
		
	});
	
	it("#update",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
        app.use(env);
		
		app.use(app.router);
		
		app.post("/update",function(req,res,next){
				req.session.user = {id:"u001"};
				next();
			},topicCtrl.update,function(req,res){
			res.send(req.result)
		});
		
		request(app).post("/update")
				.send({topicId:tid,columnId:"c001",title:"title0000002",body:"hahahhahhhahhaha0001"})
				.expect('success',done);


	
	});
	
	it("#remove",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
        app.use(env);
		
		app.use(app.router);
		
		app.post("/remove/:id",topicCtrl.remove,function(req,res){
			res.send(req.result)
		});
		
		request(app).post("/remove/t001")
			.expect('success',done);
						
	});
	
	it("#seal",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
        app.use(env);
		
		app.use(app.router);
		
		app.post("/seal/:id",topicCtrl.seal,function(req,res){
			res.send(req.result)
		});
		
		request(app).post("/seal/"+tid)
			.expect('success',done);
						
	});
	
	
	it("#unseal",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
        app.use(env);
		
		app.use(app.router);
		
		app.post("/unseal/:id",topicCtrl.unseal,function(req,res){
			res.send(req.result)
		});
		
		request(app).post("/unseal/"+tid)
			.expect('success',done);
						
	});
	
		

});
var request = require("supertest");
var express = require("express");
var dbs = require("../app/db");
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
			res.send("success");
		});
	
		request(app).post("/topic/001").expect("success",done);
			
	})
	
	it("#isTopicManager",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/author/:id",
			function(req,res,next){
				req.session.user = {id:"u001"};
				next();
			},
			DATA.topic,
			validator.hasTopic,
			validator.isTopicManager,
			function(req,res){
			res.send("success");
		});
		
		var tdb = dbs.getDB("Topic");
		var cdb = dbs.getDB("Column");
		
		cdb.create({managerId:"u001",id:"c001"},function(err,rs){
		
			tdb.create({authorId:"u001",id:"t001",columnId:"c001"},function(err,rs){
				request(app).post("/author/t001").expect("success",done);
			});				
		})

		
	})
	
	
	it("#isReplyManager1",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/reply/:id",
			function(req,res,next){
				req.session.user = {id:"u006"};
				next();
			},
			DATA.reply,
			validator.hasReply,
			validator.isReplyManager,
			function(req,res){
			res.send("success");
		});
		
		var tdb = dbs.getDB("Topic");
		var cdb = dbs.getDB("Column");
		var rdb = dbs.getDB("Reply");
		
		cdb.create({managerId:"u009",id:"c007"},function(err,rs){
			tdb.create({authorId:"u006",id:"t007",columnId:"c007"},function(err,rs){
				rdb.create({authorId:"u0011" , id:"r007" , topicId:"t007" },function(err,rs){
					request(app).post("/reply/r007").expect("success",done);
				});
			});				
		});
		
	});	
	
	it("#isReplyManager2",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/reply/:id",
			function(req,res,next){
				req.session.user = {id:"u006"};
				next();
			},
			DATA.reply,
			validator.hasReply,
			validator.isReplyManager,
			function(req,res){
			res.send("success");
		});
		
		var tdb = dbs.getDB("Topic");
		var cdb = dbs.getDB("Column");
		var rdb = dbs.getDB("Reply");
		
		cdb.create({managerId:"u009",id:"c007"},function(err,rs){
			tdb.create({authorId:"u009",id:"t007",columnId:"c007"},function(err,rs){
				rdb.create({authorId:"u0011" , id:"r007" , topicId:"t007" },function(err,rs){
					request(app).post("/reply/r007").expect("success",done);
				});
			});				
		});
		
	});	
	
	it("#isReplyManager3",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/reply/:id",
			function(req,res,next){
				req.session.user = {id:"u00000",role:1};
				next();
			},
			DATA.reply,
			validator.hasReply,
			validator.isReplyManager,
			function(req,res){
			res.send("success");
		});
		
		var tdb = dbs.getDB("Topic");
		var cdb = dbs.getDB("Column");
		var rdb = dbs.getDB("Reply");
		
		cdb.create({managerId:"u009",id:"c007"},function(err,rs){
			tdb.create({authorId:"u0000",id:"t007",columnId:"c007"},function(err,rs){
				rdb.create({authorId:"u0011" , id:"r007" , topicId:"t007" },function(err,rs){
					request(app).post("/reply/r007").expect("success",done);
				});
			});				
		});
		
	});		
		
	it("#isReplyManager3",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/reply/:id",
			function(req,res,next){
				req.session.user = {id:"u000dd00"};
				next();
			},
			DATA.reply,
			validator.hasReply,
			validator.isReplyManager,
			function(req,res){
			res.send("success");
		});
		
		var tdb = dbs.getDB("Topic");
		var cdb = dbs.getDB("Column");
		var rdb = dbs.getDB("Reply");
		
		cdb.create({managerId:"u009",id:"c007"},function(err,rs){
			tdb.create({authorId:"u0000",id:"t007",columnId:"c007"},function(err,rs){
				rdb.create({authorId:"u0011" , id:"r007" , topicId:"t007" },function(err,rs){
					request(app).post("/reply/r007").expect("error",done);
				});
			});				
		});
		
	});		
			
	it("#isReplyAuthor success",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/reply/:id",
			function(req,res,next){
				req.session.user = {id:"id000"};
				req.reply = {id:"000",authorId:"id000"};
				next();
			},
			validator.isReplyAuthor,
			function(req,res){
			res.send("success");
		});
		
		var tdb = dbs.getDB("Topic");
		var cdb = dbs.getDB("Column");
		var rdb = dbs.getDB("Reply");
		
		request(app).post("/reply/r007").expect("success",done);
		
		
	});	
	
	it("#isReplyAuthor error" ,function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/reply/:id",
			function(req,res,next){
				req.session.user = {id:"id00110"};
				req.reply = {id:"000",authorId:"id000"};
				next();
			},
			validator.isReplyAuthor,
			function(req,res){
			res.send("success");
		});
		
		request(app).post("/reply/r007").expect("error",done);
		
		
	});
	
	it("#hasReply",function(done){
		
		var app = express();
		app.use(express.favicon());
		app.use(express.json());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		
		app.post("/reply",
			function(req,res,next){
				req.reply = {id:"000",authorId:"id000"};
				next();
			},
			validator.hasReply,
			function(req,res){
			res.send("success");
		});
		request(app).post("/reply").expect("success",done);
		
	})
	
})
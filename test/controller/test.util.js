require("./util/testInit");
var dbs = require("./util/db");
var env = require("./util/env");

var request = require("supertest");
var express = require("express");
var util = require("../controller/util");
var userCtrl = require("../controller/user");
var assert = require("assert");


var DATA = require("../controller/data");

describe("validator", function() {

    it("#validat_num", function(done) {

        var app = express();
        app.use(env);

        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.get("/refresh", util.refreshValidatNum);
        request(app).get("/refresh").expect(/[0~9]*/g, done);

    })
    // 
    // it("#hasReqUser", function(done) {
    // 
    // 
    // 
    //     var app = express();
    //     app.use(env);
    // 
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(express.methodOverride());
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/hasReqUser", DATA.userByEmail, util.hasReqUser, function(req, res) {
    //         res.send("success")
    //     });
    // 
    //     request(app).post("/hasReqUser").send({
    //         email: "leo@leo.leo"
    //     }).expect("success", done);
    // 
    // })
    // 
    // 
    // it("#isLogin", function(done) {
    // 
    //     var app = express();
    //     app.use(env);
    // 
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(express.methodOverride());
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/isLogin", DATA.userByEmail, userCtrl.login, util.isLogin, function(req, res) {
    //         res.send("success");
    //     });
    //     request(app).post("/isLogin").send({
    //         email: "leo@leo.leo",
    //         password: "123456"
    //     }).expect("success", done);
    // })
    // 
    // // it("#userNoSelf",function(done){
    // // 
    // // 	var app = express();
    // // 	app.use(express.favicon());
    // //         app.use(env);
    // // 	
    // // 	app.use(express.json());
    // // 	app.use(express.methodOverride());
    // // 	app.use(express.cookieParser('your secret here'));
    // // 	app.use(express.session());
    // // 	app.use(app.router);
    // // 	
    // // 	app.post("/noself",function(req,res,next){
    // // 		req.user = {id:"001"};
    // // 		req.session.user = {id:"002"};
    // // 		next();
    // // 	},util.userNoSelf),function(req,res){
    // // 		res.send("error");
    // // 	};
    // // 	
    // // 	request(app).post("/noself").expect("success",function(){
    // // 		
    // // 		var app = express();
    // // 		app.use(express.favicon());
    // // 		app.use(express.json());
    // // 		app.use(express.methodOverride());
    // // 		app.use(express.cookieParser('your secret here'));
    // //         app.use(env);
    // // 		
    // // 		app.use(express.session());
    // // 		app.use(app.router);
    // // 		
    // // 		app.post("/noself",function(req,res,next){
    // // 			req.user = {id:"001"};
    // // 			req.session.user = {id:"001"};
    // // 			next();
    // // 		},util.userNoSelf,function(req,res){
    // // 			res.send("error");
    // // 		});
    // // 	
    // // 		request(app).post("/noself").expect("error",done);
    // // 			
    // // 	});		
    // // 	
    // // })
    // // 
    // // DOTO
    // it("#isAdmin", function(done) {
    // 
    //     var app = express();
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(express.methodOverride());
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(env);
    // 
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/isAdmin", DATA.userByEmail, userCtrl.login, util.isLogin, util.isAdmin, function(req, res) {
    //         res.send("success");
    //     });
    //     request(app).post("/isAdmin")
    //         .send({
    //             email: "leo@leo.leo",
    //             password: "123456"
    //         }).expect("success", function() {
    //             done();
    //         });
    // })
    // 
    // it("#userSelf", function(done) {
    // 
    //     var app = express();
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(express.methodOverride());
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(env);
    // 
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/noself", function(req, res, next) {
    //         req.user = {
    //             id: "001"
    //         };
    //         req.session.user = {
    //             id: "002"
    //         };
    //         next();
    //     }, util.userSelf),
    // 
    //     function(req, res) {
    //         res.send("error");
    //     };
    // 
    //     request(app).post("/noself").expect("error", function() {
    // 
    //         var app = express();
    //         app.use(express.favicon());
    //         app.use(env);
    // 
    //         app.use(express.json());
    //         app.use(express.methodOverride());
    //         app.use(express.cookieParser('your secret here'));
    //         app.use(express.session());
    //         app.use(app.router);
    // 
    //         app.post("/noself", function(req, res, next) {
    //             req.user = {
    //                 id: "001"
    //             };
    //             req.session.user = {
    //                 id: "001"
    //             };
    //             next();
    //         }, util.userSelf, function(req, res) {
    //             res.send("error");
    //         });
    // 
    //         request(app).post("/noself").expect("success", done);
    // 
    //     });
    // 
    // });
    // 
    // it("#hasTopic", function(done) {
    // 
    //     var app = express();
    //     app.use(env);
    // 
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(express.methodOverride());
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/topic/:id", DATA.topicById, util.hasTopic, function(req, res) {
    //         res.send("success");
    //     });
    // 
    //     request(app).post("/topic/t001").expect("success", done);
    // })
    // 
    // it("#isTopicManager", function(done) {
    // 
    //     var app = express();
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(express.methodOverride());
    //     app.use(env);
    // 
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/author/:id",
    //         function(req, res, next) {
    //             req.session.user = {
    //                 id: "u00001"
    //             };
    //             next();
    //         },
    //         DATA.topicById,
    //         util.hasTopic,
    //         util.isTopicManager,
    //         function(req, res) {
    //             res.send("success");
    //         });
    // 
    //     cdb.insert({
    //         managerId: "u001",
    //         id: "c001"
    //     }, function(err, rs) {
    // 
    //         request(app).post("/author/t001").expect("success", done);
    //     })
    // 
    // 
    // })
    // 
    // 
    // it("#isReplyManager1", function(done) {
    // 
    //     var app = express();
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(express.methodOverride());
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(env);
    // 
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/reply/:id",
    //         function(req, res, next) {
    //             req.session.user = {
    //                 id: "u001"
    //             };
    //             next();
    //         },
    //         DATA.replyById,
    //         util.hasReply,
    //         util.isReplyManager,
    //         function(req, res) {
    //             res.send("success");
    //         });
    // 
    //     request(app).post("/reply/r001").expect("success", done);
    // 
    // });
    // 
    // it("#isReplyManager2", function(done) {
    // 
    //     var app = express();
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(env);
    // 
    //     app.use(express.methodOverride());
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/reply/:id",
    //         function(req, res, next) {
    //             req.session.user = {
    //                 id: "u001"
    //             };
    //             next();
    //         },
    //         DATA.replyById,
    //         util.hasReply,
    //         util.isReplyManager,
    //         function(req, res) {
    //             res.send("success");
    //         });
    // 
    //     request(app).post("/reply/r001").expect("success", done);
    // 
    // });
    // 
    // it("#isReplyManager3", function(done) {
    // 
    //     var app = express();
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(env);
    // 
    //     app.use(express.methodOverride());
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/reply/:id",
    //         function(req, res, next) {
    //             req.session.user = {
    //                 id: "u001",
    //                 role: 1
    //             };
    //             next();
    //         },
    //         DATA.replyById,
    //         util.hasReply,
    //         util.isReplyManager,
    //         function(req, res) {
    //             res.send("success");
    //         });
    // 
    //     request(app).post("/reply/r00001").expect("success", done);
    // 
    // 
    // });
    // 
    // it("#isReplyManager3", function(done) {
    // 
    //     var app = express();
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(express.methodOverride());
    //     app.use(env);
    // 
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/reply/:id",
    //         function(req, res, next) {
    //             req.session.user = {
    //                 id: "u001"
    //             };
    //             next();
    //         },
    //         DATA.replyById,
    //         util.hasReply,
    //         util.isReplyManager,
    //         function(req, res) {
    //             res.send("success");
    //         });
    // 
    //     request(app).post("/reply/r007").expect("error", done);
    // 
    // 
    // });
    // 
    // it("#isReplyAuthor success", function(done) {
    // 
    //     var app = express();
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(express.methodOverride());
    //     app.use(env);
    // 
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/reply/:id",
    //         function(req, res, next) {
    //             req.session.user = {
    //                 id: "u001"
    //             };
    //             req.reply = {
    //                 id: "r001",
    //                 authorId: "u001"
    //             };
    //             next();
    //         },
    //         util.isReplyAuthor,
    //         function(req, res) {
    //             res.send("success");
    //         });
    // 
    //     request(app).post("/reply/r001").expect("success", done);
    // 
    // 
    // });
    // 
    // it("#isReplyAuthor error", function(done) {
    // 
    //     var app = express();
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(express.methodOverride());
    //     app.use(env);
    // 
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/reply/:id",
    //         function(req, res, next) {
    //             req.session.user = {
    //                 id: "u001"
    //             };
    //             req.reply = {
    //                 id: "r001",
    //                 authorId: "u001"
    //             };
    //             next();
    //         },
    //         util.isReplyAuthor,
    //         function(req, res) {
    //             res.send("success");
    //         });
    // 
    //     request(app).post("/reply/r001").expect("error", done);
    // 
    // 
    // });
    // 
    // it("#hasReply", function(done) {
    // 
    //     var app = express();
    //     app.use(express.favicon());
    //     app.use(express.json());
    //     app.use(express.methodOverride());
    //     app.use(env);
    // 
    //     app.use(express.cookieParser('your secret here'));
    //     app.use(express.session());
    //     app.use(app.router);
    // 
    //     app.post("/reply",
    //         function(req, res, next) {
    //             req.reply = {
    //                 id: "r001",
    //                 authorId: "u001"
    //             };
    //             next();
    //         },
    //         util.hasReply,
    //         function(req, res) {
    //             res.send("success");
    //         });
    //     request(app).post("/reply").expect("success", done);
    // 
    // })

})

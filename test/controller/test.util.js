require("../util/testInit");
var dbs = require("../util/db");
var env = require("../util/env");

var request = require("supertest");
var express = require("express");
var util = require("../../controller/util");
var userCtrl = require("../../controller/user");
var assert = require("assert");
var result = util.result;


var DATA = require("../../controller/data");

describe("validator", function() {

    it("#validat_num", function(done) {

        var app = express();
        app.use(env);
        app.use(result);

        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.get("/refresh", util.refreshValidatNum);
        request(app).get("/refresh").expect(/[0~9]*/g, done);

    })

    it("#hasReqUser", function(done) {



        var app = express();
        app.use(env);
        app.use(result);

        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);

        app.post("/hasUser",
            function(req, res, next) {
                req.result.data("user", {})

                next();
            }, util.hasUser, function(req, res) {
                res.send("success")
            });

        request(app).post("/hasUser").send({
            email: "leo@leo.leo"
        }).expect("success", done);

    })


    it("#isLogin", function(done) {

        var app = express();
        app.use(env);
        app.use(result);

        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);

        app.post("/isLogin",
            function(req, res, next) {
                req.session.user = {};
				next();
            },
            util.isLogin, function(req, res) {
                res.send("success");
            });
        request(app).post("/isLogin").send({
            email: "leo@leo.leo",
            password: "123456"
        }).expect("success", done);
    })

    it("#noSelf", function(done) {

        var app = express();
        app.use(express.favicon());
        app.use(env);
        app.use(result);

        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);

        app.post("/noself", function(req, res, next) {
            req.result.data("user" , {
                id: "001"
            });
			
            req.session.user = {
                id: "002"
            };
			
            next();
			
        }, util.noSelf,
        function(req, res) {
            res.send("success");
        })

        request(app).post("/noself").send({}).expect("success", done);
		
    })
	
    it("#isSelf", function(done) {

        var app = express();
        app.use(express.favicon());
        app.use(env);
        app.use(result);

        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);

        app.post("/isself", function(req, res, next) {
            req.result.data("user" , {
                id: "001"
            });
			
            req.session.user = {
                id: "001"
            };
            next();
        }, util.isSelf,
        function(req, res) {
            res.send("success");
        });

        request(app).post("/isself").expect("success", done);
    })

    it("#isAdmin", function(done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(env);
        app.use(result);

        app.use(express.session());
        app.use(app.router);

        app.post("/isAdmin", function(req,res,next){
        	
			req.session.user = {
				role : 1
			}
			
			next();
			
        },util.isAdmin, function(req, res) {
            res.send("success");
        });
        request(app).post("/isAdmin")
            .send({
                email: "leo@leo.leo",
                password: "123456"
            }).expect("success", done);
    })

    it("#hasTopic", function(done) {

        var app = express();
        app.use(env);
        app.use(result);


        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);

        app.post("/topic/:id", 
		function(req,res,next){
			req.result.data("topic",{});
			next();
		},
		util.hasTopic, function(req, res) {
            res.send("success");
        });

        request(app).post("/topic/t001").expect("success", done);
    })

    it("#isTopicManager", function(done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(env);
        app.use(result);


        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);

        app.post("/isTopicManager/:id",
		
            function(req, res, next) {
				
                req.session.user = {
                    id: "u001"
                };
				
				req.result.data("topic",{
					columnId:"c001"
				});
				
                next();
            },
            
            util.isTopicManager,
            function(req, res) {
                res.send("success");
            });

        dbs.getDB("Column").insert({
            managerId: "u001",
            id: "c001"
        }, function(err, rs) {

            request(app).post("/isTopicManager/t001").expect("success", done);
        })


    })


    it("#isReplyManager1", function(done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(env);
        app.use(result);

        app.use(express.session());
        app.use(app.router);

        app.post("/reply/:id",
            function(req, res, next) {
                req.session.user = {
                    id: "u001"
                };
                next();
            },
            DATA.replyById,
            util.hasReply,
            util.isReplyManager,
            function(req, res) {
                res.send("success");
            });

        request(app).post("/reply/r001").expect("success", done);

    });

    it("#isReplyManager2", function(done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(env);
        app.use(result);

        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);

        app.post("/reply/:id",
            function(req, res, next) {
                req.session.user = {
                    id: "u001"
                };
                next();
            },
            DATA.replyById,
            util.hasReply,
            util.isReplyManager,
            function(req, res) {
                res.send("success");
            });

        request(app).post("/reply/r001").expect("success", done);

    });

    it("#isReplyManager3", function(done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(env);
        app.use(result);

        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);

        app.post("/reply/:id",
            function(req, res, next) {
                req.session.user = {
                    id: "u001",
                    role: 1
                };
                next();
            },
            DATA.replyById,
            util.hasReply,
            util.isReplyManager,
            function(req, res) {
                res.send("success");
            });

        request(app).post("/reply/r00001").expect("success", done);


    });


    it("#isReplyAuthor success", function(done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(env);
        app.use(result);

        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);

        app.post("/reply/:id",
            function(req, res, next) {
                req.session.user = {
                    id: "u001"
                };
                req.result.data("reply" , {
                    id: "r001",
                    authorId: "u001"
                });
                next();
            },
            util.isReplyAuthor,
            function(req, res) {
                res.send("success");
            });

        request(app).post("/reply/r001").expect("success", done);


    });

    it("#hasReply", function(done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(env);
        app.use(result);

        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(app.router);

        app.post("/reply",
            function(req, res, next) {
                req.reply = {
                    id: "r001",
                    authorId: "u001"
                };
                next();
            },
            util.hasReply,
            function(req, res) {
                res.send("success");
            });
        request(app).post("/reply").expect("success", done);

    })

})

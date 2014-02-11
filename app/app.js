var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var validator = require("./validator");
var data = require("./data");
var userCtrl = require("./controller/user");
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// user controller
app.post("/user/login", 
	validator.validat_num,
	data.user("email"),
	validator.hasReqUser,
	userCtrl.login,
	function(req,res){
		res.send(req.result);
	});

app.post("/user/logout",
	userCtrl.logout,
	function(req,res){
		res.send();
	});

app.post("/user/reg",
	validator.isLogin,
	validator.validat_num, 
	userCtrl.create,
	function(req,res){
		if(req.result === "success"){
			res.send("success");
		}else{
			res.send(["密码或登录信箱有误！"]);
		}
	});

app.post("/user/update",
	validator.isLogin,
	validator.validat_num,
	userCtrl.update);

app.post("/user/:id/seal",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.seal,
	function(req,res){
		res.send();
	});


app.get("/user/:id/view",
	data.user("id"),
	function(req,res){
		res.send(req.user);
	});

app.post("/user/:id/remove",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.remove,
	function(req,res){
		res.send();
	});

app.post("/user/:id/follow",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.follow,
	function(req,res){
		res.send();
	});

app.post("/user/:id/unfollow",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.unfollow,
	function(req,res){
		res.send();
	});


app.post("/user/:id/becomeModerator",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.becomeModerator,
	function(req,res){
		res.send();
	});

app.post("/user/:id/becomeUser",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.becomeUser,
	function(req,res){
		res.send();
	});

app.post("/user/updatePassword",
	validator.isLogin,
	validator.validat_num,
	userCtrl.updatePassword,
	function(req,res){
		res.send(req.result);
	});

app.post("/user/:id/plus",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	userCtrl.plus,
	function(req,res){
		res.send();
	});


// Topic controller
app.post("/topic/create",
	validator.isLogin,
	validator.validat_num,
	topicCtrl.create,
	function(req,res){
		res.send({result:req.result,topic:req.topic});
	});

app.post("/topic/:id/update",
	validator.isLogin,
	validator.validat_num,
	topicCtrl.update,
	function(req,res){
		res.send(req.result);
	});
	
app.post("/topic/:id/remove",
	validator.isLogin,
	data.topic,
	validator.hasTopic,
	validator.isTopicManager
	topicCtrl.remove);
	
app.post("/topic/:id/seal",
	validator.isLogin,
	data.topic,
	validator.hasTopic,
	validator.isTopicAuthor,
	validator.isAdmin,
	topicCtrl.seal);

			
module.exports = app;


/*
// topic controller
app.get("/topic/:topicId/view", topicCtrl.view);

// column controller
app.post("/column/create",columnCtrl.create);
app.post("/column/update",columnCtrl.update);
app.post("/column/:columnId/remove",columnCtrl.remove);
app.get("/column/:columnId/view",columnCtrl.view);

// reply controller
app.post("/reply/create",replyCtrl.create);
app.post("/reply/update",replyCtrl.update);
app.post("/reply/:replyId/remove",replyCtrl.remove);
app.get("/reply/:replyId/view",replyCtrl.view);

// info controller
app.get("/info",infoCtrl.view);

// message controller
app.post("/message/send",messageCtrl.create);
app.get("/message/view",messageCtrl.view);
app.get("/message/list",messageCtrl.list);
*/
/*

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

*/

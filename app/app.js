var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var validator = require("./validator");
var util = require("./util");
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
	util.end);

app.post("/user/logout",
	userCtrl.logout,
	util.end);

app.post("/user/reg",
	validator.isLogin,
	validator.validat_num, 
	userCtrl.create,
	util.end);

app.post("/user/update",
	validator.isLogin,
	validator.validat_num,
	userCtrl.update,
	util.end);

app.post("/user/:id/seal",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.seal,
	util.end);


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
	util.end);

app.post("/user/:id/follow",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.follow,
	util.end);

app.post("/user/:id/unfollow",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.unfollow,
	util.end);


app.post("/user/:id/becomeModerator",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.becomeModerator,
	util.end);

app.post("/user/:id/becomeUser",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.becomeUser,
	util.end);

app.post("/user/updatePassword",
	validator.isLogin,
	validator.validat_num,
	userCtrl.updatePassword,
	util.end);

app.post("/user/:id/plus",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	userCtrl.plus,
	util.end);


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
	util.end);
	
app.post("/topic/:id/remove",
	validator.isLogin,
	data.topic,
	validator.hasTopic,
	validator.isAdmin,
	topicCtrl.remove,
	util.end);
	
app.post("/topic/:id/seal",
	validator.isLogin,
	data.topic,
	validator.hasTopic,
	validator.isTopicManager,
	topicCtrl.seal,
	util.end);

app.post("/topic/:id/unseal",
	validator.isLogin,
	data.topic,
	validator.hasTopic,
	validator.isTopicManager,
	topicCtrl.unseal,
	util.end);

// app.get("/topic/:id/view",
// 	topicCtrl.view,
// 	function(req,res){
// 		res.locals.topic = req.topic;
// 		res.render("topic");
// 	})


// column controller
app.post("/column/create",
	validator.isLogin,
	validator.isAdmin,
	columnCtrl.create,
	util.end);

app.post("/column/:id/update",
	validator.isLogin,
	validator.isAdmin,
	columnCtrl.update,
	util.end);



// reply controller
app.post("/reply/create",
	validator.isLogin,
	validator.validat_num,
	replyCtrl.create,
	function(req,res){
		res.send({result:req.result,topic:req.reply});
	});
	

app.post("/reply/:id/update",
	validator.isLogin,
	validator.validat_num,
	data.reply,
	validator.isReplyAuthor,
	replyCtrl.update,
	util.end);

app.post("/reply/:id/remove",
	validator.isLogin,
	validator.validat_num,
	data.reply,
	validator.isReplyManager,
	replyCtrl.remove,
	util.end);
	
// message controller
app.post("/message/send",
	validator.isLogin,
	validator.validat_num,
	messageCtrl.create);


module.exports = app;


/*


// info controller
app.get("/info",infoCtrl.view);

app.get("/message/view",messageCtrl.view);
app.get("/message/list",messageCtrl.list);
	
*/
/*

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

*/

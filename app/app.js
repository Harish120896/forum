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
app.post("/user/login", validator.validat_num, data.user("email"), userCtrl.login);

/**
app.post("/user/logout",userCtrl.logout);
app.post("/user/create",userCtrl.create);
app.post("/user/update",userCtrl.update);
app.post("/user/:userId/seal",userCtrl.seal);
app.get("/user/:userId/view",userCtrl.view);

app.post("/user/:userId/remove",userCtrl.remove);
app.post("/user/:userId/follow",userCtrl.follow);
app.post("/user/:userId/unfollow",userCtrl.unfollow);
app.post("/user/:userId/seal",userCtrl.seal);

/*
// topic controller
app.post("/topic/create",validator.isLogin,validator.validat_num,topicCtrl.create);
app.post("/topic/update",validator.isLogin,validator.validat_num,topicCtrl.update);
app.post("/topic/:topicId/remove",validator.isLogin,validator.isAuthor,topicCtrl.remove);
app.post("/topic/:topicId/seal",validator.isLogin,validator.isAuthor,topicCtrl.remove);
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

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

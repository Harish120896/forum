var express = require('express');
var http = require('http');
var userRoute = require('./route/user');
var topicRoute = require("./route/topic");
var columnRoute = require("./route/column");
var replyRoute = require("./route/reply");

var app = express();

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

userRoute(app);
topicRoute(app);
columnRoute(app);
replyRoute(app);
messageRoute(app);
pagerRoute(app);
xhrRoute(app);

module.exports = app;

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});



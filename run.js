var express = require('express');
var http = require('http');
var fs = require("fs");
var path = require("path");
var result = require("./controller/util").result;
var app = express();

// config domain
var env = require("./infrastructure/env");

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

app.use(result);
app.use(env);

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// load route modules.
fs.readdirSync(__dirname+"/route").forEach(function(filename){
	require("./route/"+filename)(app);
});

module.exports = app;

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});



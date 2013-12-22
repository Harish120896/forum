var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var db = require("./db");
var http = require('http');
var ehs = require('./eventHandles');
var domain = require("../domain");
var path = require('path');

domain.register("get",db.get,"listener",ehs).seal();


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",function(req,res){
    res.render("index")
})

app.post("/user/create",function(req,res){
    domain.exec("create a user",req.body,function(){

    })
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


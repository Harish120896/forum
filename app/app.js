var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var Jsdm_middle = require("jsdm.middle");
var db = require("./db");
var http = require('http');
var query = require("./query");
var ehs = require('./eventHandles');
var domain = require("../domain");
var path = require('path');

var pw = require("png-word")();
var r = require("random-word")("0123456789");



domain.register("get",db.get).seal();



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

app.use(express.static(path.join(__dirname, 'public')));
var middle = new Jsdm_middle(domain, query);
app.use("/domain",middle.middle);


// refresh png number.
app.get('/refresh',function(req,res){

 var numtxt = req.session.validat_num = r.random(4);
 pw.createPNG(numtxt,function(pngnum){
  res.send(pngnum);	
 });
  
});

function validat_num(req,res,next){
	if(req.body.validat_num && req.session.validat_num === req.body.validat_num){
		req.validat_success = true;
	}else{
		req.validat_success = false;
	}
	next()
}

app.get("/reg",function(req,res){
	var errors = req.session.errors;
	delete req.session.errors;
	
    res.render("reg",{errors:errors || []})
})

app.post("/reg",validat_num,function(req,res){
	if(req.validat_success){
		domain.exec("create a user",req.body,function(){
			console.log(arguments);
		})
	}else{
		req.session.errors  = ["验证码错误！"]
		res.redirect("/reg");
	}
})


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


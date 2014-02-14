var query = require("../infrastructure/query");
var domain = require("../domain");

module.exports = {
	
	create:function(req,res,next){
		domain.exec("create a column",req.body,function(err,column){
			req.column = column;
			if(column){
				req.result = "success";
			}else{
				req.result = err || "error";
			}
			next();
		});
	},
	
	update:function(req,res,next){
		var columnId = req.param("columnId");
		domain.call("Column.updateInfo",columnId,
			[req.body.name,req.body.des],function(err){
				req.result = err || "success";
				next();
			})
	}
	
	
	
	
	
}
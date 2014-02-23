module.exports = {
	
	create:function(req,res,next){
		var domain = req.env.domain;
		domain.exec("create a column",req.body,function(result){
			req.result = result;
			next();
		});
	},
	
	update:function(req,res,next){
		
		var domain = req.env.domain;
				
		var columnId = req.param("columnId");
		domain.call("Column.updateInfo",columnId,
			[req.body.name,req.body.des],function(result){
				req.result = result;
				next();
			})
		}
}
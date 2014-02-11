var db = require("./db");

module.exports = {
	user:function(){

		var keys = arguments;
		
		var udb = db.getDB("User");
		
		return function(req,res,next){
			
			var qs = {};
			
			try{
				for(var i=0,len = keys.length ; i<len ; i++){
					var k = keys[i];
					v = req.param(k);
					if(v === undefined){
						throw new Error();
					}
					qs[k] = v;
				}		
				udb.findOne(qs).exec(function(err,rs){
					req.user = rs;
					next();
				})			
			}catch(e){			
				next();
			}

		}
	},
	
	topic:function(req,res,next){
		var tdb = db.getDB("Topic");
		tdb.findOne({id:req.param("id")}).exec(function(err,rs){
			req.topic = rs;
			next();
		})	
	}
}
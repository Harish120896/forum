var db = require("./db");

module.exports = {
	user:function(){
		var keys = [].concat.apply(arguments);
		var udb = db.getDB("User");
		return function(req,res,next){
			var qs = {};
			for(var i=0,len = keys.length ; i<len ; i++){
				var k = keys[i];
				qs[k] = req.param(k);
				if(qs[k] === undefined){
					next();
					break;
				}
			}
			udb.findOne(qs).exec(function(err,rs){
				req.user = rs;
				next();
			})
		}
	}
}
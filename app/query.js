var dbs = require("./db");


module.exports = {
	
	columns:function(args,callback){
		var db = dbs.getDB("Column");
		db.find().exec(function(err,rs){
			callback(rs);
		})
	},
	
	users:function(args,callback){
		var db = dbs.getDB("User");
		db.find().exec(function(err,rs){
			callback(rs);
		})
	},
	
	userById:function(id,callback){
		var db = dbs.getDB("User");
		db.find().exec(function(err,rs){
			callback(rs);
		})
	},
	
	topics:function(args,callback){
		
	},
	
	topic:function(){
		
	},
	
	replys:function(){
		
	}
	
}
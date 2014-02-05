var dbs = require("./db");
var oneday = require("./util/oneday");


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
	
	userByEmail:function(email,callback){
		var db = dbs.getDB("User");
		db.findOne().where({email:email}).exec(function(err,rs){
			callback(rs);
		})
	},
	
	userFuzzyExist:function(userInfo,callback){
		var db = dbs.getDB("User");
		var orq = [];
	    for(var k in userInfo){
			var kv = {};
			kv[k] = userInfo[k];
	    	orq.push(kv);
	    }
		db.find().or(orq).count(function(err,num){
			callback(num ? true : false);
		})
	},
	
	replyCountByToday:function(authorId,callback){
		var date = new oneday();
		var db = dbs.getDB("Reply");
		db.find().where({authorId:authorId}).where('createTime').gt(date.startTime).lt(date.endTime)
		.count(function(err,num){
			callback(num || 0);
		})
	},
	
	topicCountByToday:function(authorId,callack){
		var date = new oneday();
		var db = dbs.getDB("Topic");
		db.find().where({authorId:authorId}).where('createTime').gt(date.startTime).lt(date.endTime)
		.count(function(err,num){
			callback(num || 0);
		})
	}
	
}
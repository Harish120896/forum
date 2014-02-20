var dbs = require("./db");
var is = require("istype");

function oneday(date){
	
	var date = date || new Date();
		
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	
	this.startTime = date.getTime();
	
	this.endTime = this.startTime + 1000*60*60*24;
	
}

module.exports = {
	
	columns:function(callback){
		var db = dbs.getDB("Column");
		db.find({}).exec(function(err,rs){
			callback(rs || []);
		})
	},
	
	column:function(args,callback){
		var db = dbs.getDB("Column");
		db.findOne({id:args.id}).exec(function(err,rs){
			callback(rs);
		})
	},
	
	columnById:function(id,callback){
		var db = dbs.getDB("Column");
		db.findOne({id:id}).exec(function(err,rs){
			callback(rs);
		})
	},
	
	topic:function(args,callback){
		var db = dbs.getDB("Topic");
		db.findOne({id:args.id}).exec(function(err,rs){
			callback(rs);
		})
	},
	
	topicById:function(id,callback){
		this.topic({id:id},callback);
	},
	
	replyById:function(id,callback){
		var db = dbs.getDB("Reply");
		db.findOne({id:id}).exec(function(err,rs){
			callback(rs);
		})
	},
	
	topics:function(args,callback){
		var page = is.number(args.page) && args.page > 0 && Number(args.page) === args.page ? args.page : 1;
		var db = dbs.getDB("Topic");
		db
			.find({columnId:args.columnId})
			.limit(10)
			.sort({createTime:-1})
			.skip(page)
			.exec(function(err,rs){
				callback(rs || []);
			})
	},
	
	topicsByColumnId:function(id,callback){
		var db = dbs.getDB("Topic");
		db.find({columnId:id}).exec(function(err,rs){
			callback(rs || []);
		})
	},
	
	users:function(args,callback){
		var db = dbs.getDB("User");
		db.find({}).exec(function(err,rs){
			callback(rs);
		});
	},
	
	userById:function(id,callback){
		var db = dbs.getDB("User");
		db.findOne({id:id}).exec(function(err,rs){
			callback(rs);
		});
	},
	
	userByEmail:function(email,callback){
		var db = dbs.getDB("User");
		db.findOne({email:email}).exec(function(err,rs){
			callback(rs);
		});
	},
	
	userByNick:function(nick,callback){
		var db = dbs.getDB("User");
		db.findOne().where({nickname:nick}).exec(function(err,rs){
			callback(rs);
		});
	},
	
	userIdByNick:function(nick,callback){
		var db = dbs.getDB("User");
		db.findOne({{nickname:nick}}).exec(function(err,rs){
			if(rs){
				callback(rs.id);
			}else{
				callback();
			}
		});	
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
		});
	},
	
	replyCountByToday:function(authorId,callback){
		var date = new oneday();
		var db = dbs.getDB("Reply");
		db.find({authorId:authorId,createTime:{$gt:date.startTime,$lt:date.endTime}})
		.count(function(err,num){
			callback(num || 0);
		});
	},
	
	topicCountByToday:function(authorId,callback){
		var date = new oneday();
		var db = dbs.getDB("Topic");
		db.find().where({authorId:authorId,createTime:{$gt:date.startTime,$lt:date.endTime}})
		.count(function(err,num){
			callback(num || 0);
		})
	}
	
}
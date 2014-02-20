var db = require("../db");
var Datastore = require('nedb');
var should = require("should");

describe("DB",function(){
	
	it("#getDB",function(){
		
		db.getDB("User").should.be.instanceof(Datastore);
		db.getDB("Topic").should.be.instanceof(Datastore);
		db.getDB("Reply").should.be.instanceof(Datastore);
		db.getDB("Column").should.be.instanceof(Datastore);
		db.getDB("Message").should.be.instanceof(Datastore);
		
	})
	
	var me;
	
	it("#save",function(done){
		db.save("User",{name:"leo",id:"001"},function(err,user){
			me = user;
			user.name.should.eql("leo");
			should.exist(user._id);
			done();
		})
	})
	
	it("#update",function(done){
		db.update("User","001",{name:"brighthas"},function(){
			db.get("User","001",function(err,user){
				user.name.should.eql("brighthas");
				user.id.should.eql("001");
				done()
			})
		})
	})
	
	it("#remove",function(done){
		db.remove("User","001",function(){
			db.get("User","001",function(err,user){
				console.log(!!user);
				done()
			})
		})
	})
	
})
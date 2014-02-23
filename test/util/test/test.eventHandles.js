var ehs = require("../eventHandles")();
var db = require("../db");
var Emitter = require("events").EventEmitter;
var should = require("should");
var bus = new Emitter;

ehs.forEach(function(eh){
	bus.on(eh.eventName,eh);
})

describe("eventHandle",function(){
	it("#*.*.create",function(done){
		bus.emit("*.*.create","Topic",{id:"t0001"});
		setTimeout(function(){
			var DB = db.getDB("Topic");
			DB.find({}).exec(function(err,rs){
                rs.should.be.instanceof(Array).and.have.lengthOf(1);
				done();
			});
		})
	});
	
	it("#*.*.update",function(done){
		bus.emit("*.*.update","Topic","t0001",{name:"leo"});
		setTimeout(function(){
			var DB = db.getDB("Topic");
			DB.find({}).exec(function(err,rs){
                rs.should.be.instanceof(Array).and.have.lengthOf(1);
				rs[0].name.should.eql("leo")
				done();
			});
		})
	});
	
	it("#*.*.remove",function(done){
		bus.emit("*.*.remove","Topic","t0001");
		setTimeout(function(){
			var DB = db.getDB("Topic");
			DB.find({}).exec(function(err,rs){
                rs.should.be.instanceof(Array).and.have.lengthOf(0);
				done()
			});
		})
	});
})
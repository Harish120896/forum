var should = require("should"),
	domain = require("./util/domain"),
	Message = domain._my.Aggres.Message;


describe("Message",function(){
	
	var msg
	it("#create",function(){
		
		msg = new Message({id:"id001",targetId:"001",authorId:"002",title:"tttt",body:"bobby"});
		msg.errors.should.eql({});
		
	})
		
	it("#see",function(){
		msg.havesee.should.be.false;
		msg.see();
		msg.havesee.should.be.true;
	})
	
})
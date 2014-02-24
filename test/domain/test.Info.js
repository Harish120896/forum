var should =require("should")
var my = require("../util/my");
var Info = require("../../domain/Info")(my);

describe("Info",function(){
	
	var info;
	
	it("#create",function(){
		info = new Info({body:"info body",targetId:"u001"});
		info.body.should.eql("info body");
		info.havesee.should.eql(false);
		should.exist(info.createTime);
		should.exist(info.id);
	})
	
	it("#see",function(){
		info.see();
		info.havesee.should.eql(true);
	})
	
})
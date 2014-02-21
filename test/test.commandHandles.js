var should =require("should")
    , domain = require("./util/domain")
    , my = domain._my;

describe("commandHandles",function(){
    it("#create a user",function(done){
         domain.exec("create a user",{password:"pass"},function(err){
			 should.exist(err);
			 done()
         })
    });
})
var should =require("should")
var query = require("./util/query")
var domain = require("./util/domain")
    var my = domain._my;

describe("commandHandles",function(){
    it("#create a user",function(done){
         domain.exec("create a user",{password:"pass"},function(err){
			 should.exist(err);
			 done()
         })
    });
})
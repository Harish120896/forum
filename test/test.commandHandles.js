var should =require("should")
var cdb = require("./util/db")
var query = require("./util/query")(cdb())
var domain = require("./util/domain")(query);

var env = require("./util/env")(domain,query);
    var my = domain._my;

describe("commandHandles",function(){
    it("#create a user",function(done){
         domain.exec("create a user",{password:"pass"},function(err){
			 should.exist(err);
			 done()
         })
    });
})
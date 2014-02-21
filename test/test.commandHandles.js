var should =require("should")
    , domain = require("./util/domain")
    , my = domain._my;

describe("commandHandles",function(){
    it("#create a user",function(){
        (function(){
            domain.exec("create a user",{password:"pass"},function(){

            })
        }).should.throw();
    });
})
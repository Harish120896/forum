var should =require("should")
    ,domain = require("../domain")
    ,User = domain._my.Aggres.User;


describe("User",function(){

    var user;

    it("#new",function(){
        user = new User("brighthas","123456");
    })

})
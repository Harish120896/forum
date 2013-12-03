var should =require("should")
    , findUser = require("../infrastructure/findUser")
    , domain = require("../domain")(findUser)
    ,User = domain._my.Aggres.User
    ,crypto = require("crypto");


describe("User",function(){

    var user;

    it("#new",function(){
        user = new User("brighthas","brighthas","123456","brighthas@gmail.com");
        user._loginname.should.eql("brighthas");
        var md5 = crypto.createHash('md5');
        user._password= md5.update("123456").digest("hex");
        user._email.should.eql("brighthas@gmail.com");
        user._fraction.should.eql(0);
        user._nickname.should.eql("brighthas");
        user._role.should.eql(User.roles.USER);
    });

    it("#updatePassword",function(){
        (function(){
            user.updatePassword("1222222","55555555");
        }).should.throw();
        user.updatePassword("123456","rrrrrr");
    });

    it("#authorizeAdmin",function(){
        user.authorizeAdmin();
        user._role.should.eql(User.roles.ADMIN);
    });

    it("#authorizeModerator",function(){
        user.authorizeModerator();
        user._role.should.eql(User.roles.MODERATOR);
    });

    it("#authorizeUser",function(){
        user.authorizeUser();
        user._role.should.eql(User.roles.USER);
    });

    it("#plus",function(){
        user.plus(12);
        user.plus(3);
        user._fraction.should.eql(15);
    });
})
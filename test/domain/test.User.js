var crypto = require("crypto");

var should = require("should")
var my = require("../util/my");
var User = require("../../domain/User")(my);

describe("User", function() {

    var user;

    it("#new", function() {
        user = new User({
            nickname: "brighthas",
            password: "123456",
            email: "brighthas@gmail.com"
        });
        var md5 = crypto.createHash('md5');
        user.password.should.eql(md5.update("123456").digest("hex"));

        user.email.should.eql("brighthas@gmail.com");
        user.fraction.should.eql(0);
        user.nickname.should.eql("brighthas");
        user.role.should.eql(User.roles.USER);


    });

    it("#updatePassword", function() {
        var md5 = crypto.createHash('md5');
        user.password = "ahhahhaah";
        user.password.should.eql(md5.update("ahhahhaah").digest("hex"));

    });

    it("#become", function() {
        user.becomeAdmin();
        user.role.should.eql(User.roles.ADMIN);
        user.becomeModerator();
        user.role.should.eql(User.roles.MODERATOR);
		user.becomeUser();
        user.role.should.eql(User.roles.USER);
		user.sealUser();
        user.role.should.eql(User.roles.SEAL);
		
    });

    it("#plus", function() {
        user.plus(12);
        user.plus(3);
        user.fraction.should.eql(15);
    });

    var u1;

    it("#follow", function(done) {
		
		u1 = new User({
            nickname: "leo",
            password: "123456",
            email: "leo@gmail.com"
		})
        u1.follow("u001");
        u1.follows[0].should.eql("u001");
        done();

    })

    it("#unfollow", function() {
        u1.unfollow("u001");
        u1.follows.should.eql([]);
    })


    it("#report", function() {
        u1.fraction.should.eql(0);
        u1.report();
        u1.report();
        u1.report();
        u1.fraction.should.eql(2);

    })
	
	

})

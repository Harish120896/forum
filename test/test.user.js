var should =require("should")
    , domain = require("../domain")
    ,crypto = require("crypto");

domain.seal();

var User = domain._my.Aggres.User;

describe("User",function(){

    var user;

    it("#new",function(){
        user = new User({nickname:"brighthas",loginname:"brighthas",password:"123456",email:"brighthas@gmail.com"});
        user.loginname.should.eql("brighthas");
				
        var md5 = crypto.createHash('md5');
        user.password.should.eql(md5.update("123456").digest("hex"));
		
        user.email.should.eql("brighthas@gmail.com");
        user.fraction.should.eql(0);
        user.nickname.should.eql("brighthas");
        user.role.should.eql(User.roles.USER);
    });

    it("#updatePassword",function(){
		var old = user.password;
        user.updatePassword("1222j222","55555555");
		user.password.should.eql(old);
		user.updatePassword("123456","rrrrrr");
		(user.password === old).should.be.false;
    });

    it("#authorizeAdmin",function(){
		user.role = 4;
        user.role.should.eql(User.roles.USER);
		user.role = 1;
        user.role.should.eql(User.roles.ADMIN);
		
    });

    it("#plus",function(){
        user.plus(12);
        user.plus(3);
        user.fraction.should.eql(15);
    });
	
	var u1,u2;
	
	/*it("#follow",function(done){
        
		domain._my.repos.User.create({nickname:"brighthas",loginname:"brighthas",password:"123456",email:"brighthas@gmail.com"},function(err,user){
			u1 = user;        
			
			domain._my.repos.User.create({nickname:"leo",loginname:"leo",password:"123456",email:"leoddd@gmail.com"},function(err,user){
				u2 = user;
				
				u1.follow(u2.id);
		
				u1.follows[0].should.eql(u2.id);
		
				u2.watchers[0].should.eql(u1.id);
				
				done();
				
			});
		});

		
	})
		
	it("#unfollow",function(){
		u1.unfollow(u2.id);
		u1.follows.should.eql([]);
		u2.watchers.should.eql([]);
	})
	
	
	it("#report",function(){
		u1.fraction.should.eql(0);
		u1.report();
		u1.report();
		u1.report();
		u1.fraction.should.eql(2);
		
	})
	*/
})
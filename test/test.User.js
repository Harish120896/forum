var domain = require("../domain");
var should = require("should");
var clearDB =require("./util/clearDB");

describe("User", function () {

    var User = domain._my.Aggres.User;

    var user;

    it("#clearDB",function(done){
        clearDB().then(done);
    });

    it("#new", function () {

        var createTime = Date.now();

        user = new User("001", "leo@q.q", "leo", createTime);


        user.id.should.eql("001");
        user.email.should.eql("leo@q.q");
        user.username.should.eql("leo");
        user.createTime.should.eql(createTime);

        user.activation.should.eql(true);
        user.follows.should.eql([]);
        user.watchers.should.eql([]);
        user.fraction.should.eql(0);

        user.isCustomLogo.should.eql(true);
        user.des.should.eql("");
        user.sex.should.eql(true);
        user.address.should.eql("");

    })

    it("#follow",function(){

        domain._my.repos.User.create({id:"002", email:"leo2@q.q", username:"leo2", createTime:Date.now()});
        user.follow("002");
        user.follows.length.should.eql(1);

        domain._my.repos.User.get("002",function(err,u){
            u.watchers.length.should.eql(1);
        });
    })


    it("#unfollow",function(){

        user.unfollow("002");
        user.follows.length.should.eql(0);

        domain._my.repos.User.get("002",function(err,u){
            u.watchers.length.should.eql(0);
        });
    })

    it("#plus",function(){
        user.plus(12);
        user.fraction.should.eql(12);
    })

    it("#updateInfo",function(){

        user.updateInfo({
            des:"123",
            sex:false,
            isCustomLogo:false,
            address:"xxx"
        });

        user.des.should.eql("123");
        user.sex.should.eql(false);
        user.isCustomLogo.should.eql(false);
        user.address.should.eql("xxx");

        (function(){
            user.updateInfo({
                des:Array(3000).join(",")
            })
        }).should.throw();


        (function(){
            user.updateInfo({
                address:Array(3000).join(",")
            })
        }).should.throw();

    })

})
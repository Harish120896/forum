var should = require("should")
    , domain = require("../domain")
    , userRepo = domain._my.repos.User
    , columnRepo = domain._my.repos.Column;

describe("repos", function () {

    it("#user repository create", function () {

        userRepo.create({
            nickname: "leo",
            loginname: "brighthas",
            password: "brighthas",
            email: "brighthas@gmail.com"}, function (err, userAggre) {
            should.exist(userAggre)
        })

        userRepo.create({
            nickname: "leo",
            loginname: "brighthas",
            password: "brighthas",
            email: "brighthas@gmail.com"}, function (err, userAggre) {
            should.not.exist(userAggre)
        })
    });

    it("user repository _data2aggre",function(){
        var aggre = userRepo._data2aggre({
            id:"id001",
            nickname: "leo",
            loginname: "brighthas",
            password: "111111",
            email: "brighthas@gmail.com"});
        aggre._id.should.eql("id001");
        aggre._nickname.should.eql("leo");
        aggre._loginname.should.eql("brighthas");
        aggre._password.should.eql("111111");
        aggre._email.should.eql("brighthas@gmail.com");

    })

    it("cloumn repository create", function () {

        columnRepo.create({
            name: "node.js",
            des: "my node.js column"
        }, function (err, rs) {
            rs._name.should.eql("node.js");
            rs._des.should.eql("my node.js column");
        });

    });



})
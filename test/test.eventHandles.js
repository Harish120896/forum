var domain = require("./util/domain");
var should = require("should");
var identity = require("identity");

var Q = require("q");

describe("eventHandles", function () {

    var userId;

    it("#userDomain User.*.create", function (done) {

        domain.once("User.*.create",function(data){
            userId = data.id;
            data.username.should.eql("leo000");
            done();
        })

        identity.domain._my.repos.User.create({
            username:"leo000",
            email:"leo@qq.com",
            password:"11111111"})

    })

    it("#userDomain User.*.update", function (done) {

        domain.on("*.*.update",function(className,id,data){
            if(className === "User" && id===userId && data.activation === false){

                done();
            }
        })

        identity.domain._my.repos.User.get(userId).then(function(user){
            user.deactivate();
        })

    })

})
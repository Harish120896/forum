var should = require("should")
    , domain = require("../domain")
    , userRepo = domain._my.repos.User

describe("repos", function () {

    it("#user repository create", function () {

        userRepo.create({
            nickname: "leo",
            loginname: "brighthas",
            password: "brighthas",
            email: "brighthas@gmail.com"}, function (err,userAggre) {
                should.exist(userAggre)
        })

        userRepo.create({
            nickname: "leo",
            loginname: "brighthas",
            password: "brighthas",
            email: "brighthas@gmail.com"}, function (err,userAggre) {
                should.not.exist(userAggre)
        })
    });


})
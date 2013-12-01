var should = require("should")
    , findUser = require("../infrastructure/findUser")
    , domain = require("../domain")(findUser)
    , userRepo = domain._my.repos.User
    , topicRepo = domain._my.repos.Topic
    , replyRepo = domain._my.repos.Reply;

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
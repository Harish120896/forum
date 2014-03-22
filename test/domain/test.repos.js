var should = require("should")
var my = require("../util/my");
var repos = require("../../domain/repos")(my);

var replyRepo = repos[0];
var columnRepo = repos[1];
var topicRepo = repos[2];
var userRepo = repos[3];
var messageRepo = repos[4];
var infoRepo = repos[5];

describe("repos", function () {

    var email = "bright" + Date.now() + "@email.com";

    it("#user repository create", function () {

        userRepo.create({
            nickname: "leodsfdsfds",
            password: "brighthas",
            email: email
        }, function (err, userAggre) {
            should.exist(userAggre)
        })


    });

    var aggre;

    it("user repository _data2aggre", function () {
        aggre = userRepo._data2aggre({
            id: "id001",
            nickname: "leo2",
            loginname: "brighthas",
            password: "111111",
            email: "brighthas@gmail.com",
            createTime: new Date(),
            fraction: 0
        });
        aggre.id.should.eql("id001");
        aggre.nickname.should.eql("leo2");
        aggre.password.should.eql("111111");
        aggre.email.should.eql("brighthas@gmail.com");

    })

    it("user repository _aggre2data", function () {
        var data = userRepo._aggre2data(aggre);
        aggre.id.should.eql("id001");
        aggre.nickname.should.eql("leo2");
        aggre.password.should.eql("111111");
        aggre.email.should.eql("brighthas@gmail.com");
    })


    var column;

    it("cloumn repository create", function () {

        columnRepo.create({
            name: "node.js",
            des: "my node.js column"
        }, function (err, rs) {
            column = rs;
            rs.name.should.eql("node.js");
            rs.des.should.eql("my node.js column");
        });

    });

    var data;

    it("cloumn repository _aggre2data", function () {

        data = columnRepo._aggre2data(column);
        data.name.should.eql("node.js");
        data.des.should.eql("my node.js column");

    });

    it("cloumn repository _data2aggre", function () {

        var aggre = columnRepo._data2aggre(data);
        aggre.name.should.eql("node.js");
        aggre.des.should.eql("my node.js column");

    });


    var topic;

    it("topic repository create", function () {

        topicRepo.create({
            title: "test title",
            body: "test body",
            authorId: "user001",
            columnId: "id0001"
        }, function (err, rs) {
            topic = rs;
            rs.title.should.eql("test title");
            rs.body.should.eql("test body");
        });

    });

    var data;

    it("topic repository _aggre2data", function () {

        data = topicRepo._aggre2data(topic);
        data.title.should.eql("test title");
        data.body.should.eql("test body");

    });

    it("topic repository _data2aggre", function () {

        var aggre = topicRepo._data2aggre(data);
        aggre.title.should.eql("test title");
        aggre.body.should.eql("test body");

    });

    var reply;

    it("reply repository create", function () {

        replyRepo.create({
            "title": "my title",
            "body": "my reply body",
            "authorId": "aid0001",
            "parentId": "pid0001",
            "topicId": "tid0001"
        }, function (err, rs) {
            reply = rs;
            rs.title.should.eql("my title");
            rs.body.should.eql("my reply body");
        });

    });

    var data;

    it("reply repository _aggre2data", function () {

        data = replyRepo._aggre2data(reply);
        data.title.should.eql("my title");
        data.body.should.eql("my reply body");

    });

    it("reply repository _data2aggre", function () {

        var aggre = replyRepo._data2aggre(data);
        aggre.title.should.eql("my title");
        aggre.body.should.eql("my reply body");

    });

    var message;

    it("message repository create", function () {

        messageRepo.create({
            targetId: "001",
            authorId: "002",
            title: "tttt",
            body: "bobby"
        }, function (err, msg) {
            message = msg;
            should.exist(msg.id);
            should.exist(msg.createTime);
            msg.authorId.should.eql("002");
            msg.title.should.eql("tttt");
            msg.body.should.eql("bobby");
        });

    });

    var data;

    it("message repository _aggre2data", function () {

        data = messageRepo._aggre2data(message);
        should.exist(data.id);
        should.exist(data.createTime);
        data.authorId.should.eql("002");
        data.title.should.eql("tttt");
        data.body.should.eql("bobby");

    });

    it("reply repository _data2aggre", function () {

        var aggre = messageRepo._data2aggre(data);
        should.exist(aggre.id);
        should.exist(aggre.createTime);
        aggre.authorId.should.eql("002");
        aggre.title.should.eql("tttt");
        aggre.body.should.eql("bobby");

    });

    var info;

    it("info repository create", function () {

        infoRepo.create({
            body: "info body",
            targetId: "u001"
        }, function (err, rs) {
            info = rs;
            info.body.should.eql("info body");
            info.havesee.should.eql(false);
            should.exist(info.createTime);
            should.exist(info.id);
        });

    });

    var data;

    it("info repository _aggre2data", function () {

        data = infoRepo._aggre2data(info);
        data.body.should.eql("info body");
        data.havesee.should.eql(false);
        should.exist(data.createTime);
        should.exist(data.id);

    });

    it("info repository _data2aggre", function () {

        var aggre = infoRepo._data2aggre(data);
        aggre.body.should.eql("info body");
        aggre.havesee.should.eql(false);
        should.exist(aggre.createTime);
        should.exist(aggre.id);

    });

})

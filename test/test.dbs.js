var dbs = require("../application/dbs");
var should = require("should");
var clearDB =require("./util/clearDB");

describe("dbs", function () {

    var Column, User, Topic, Reply, Message, Info;

    it("#getDB", function () {
        Column = dbs.getDB("Column");
        User = dbs.getDB("User");
        Topic = dbs.getDB("Topic");
        Reply = dbs.getDB("Reply");
        Message = dbs.getDB("Message");
        Info = dbs.getDB("Info");
    })

    it("#clearDB", function (done) {
        clearDB().then(done);
    })

    it("#save", function (done) {
        dbs.save("Column", {id: "c01", name: "node.js"}, function (err, column) {
            column.id.should.eql("c01");
            done();
        })
    })

    it("#get", function (done) {
        dbs.get("Column", "c01", function (err, col) {
            col.id.should.eql("c01");
            done();
        })
    })

    it("#update", function (done) {
        dbs.update("Column", "c01", {name: "leobook"}, function () {
            dbs.get("Column", "c01", function (err, col) {
                col.name.should.eql("leobook");
                done();
            })
        })
    })

    it("#remove", function (done) {
        dbs.save("User", {id: "u01", name: "leo"}, function () {
            dbs.save("User", {name: "leo2", id: "u02"}, function () {
                dbs.getDB("User").count({}, function (err, num) {
                    num.should.eql(2);
                    dbs.remove("User", "u02");
                    dbs.getDB("User").count({}, function (err, num) {
                        num.should.eql(1);
                        done();
                    });
                })

            })
        })

    })

})
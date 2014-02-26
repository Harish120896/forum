require("../util/testInit");
var should = require("should");
var domain = require("../util/domain");

describe("commandHandles", function() {

    it("#create a user", function(done) {
        domain.exec("create a user", {
                nickname: "brighthas",
                password: "123445",
                email: "brighthas@gmail.com"
            },
            function(result) {
                result.hasError().should.be.false;
                done()
            })
    });

    it("#create a column", function(done) {
        domain.exec("create a column", {
                des: "column des"
            },
            function(result) {
                result.hasError().should.be.true;
            })
        domain.exec("create a column", {
                name: "column name",
                des: "column des"
            },
            function(result) {
                result.hasError().should.be.false;
                done()
            })
    });

    var topicID;

    it("#create a topic", function(done) {
        domain.exec("create a topic", {
            title: "test title",
            body: "test body",
            authorId: "u001",
            columnId: "c001"
        }, function(result) {
            topicID = result.data("topic").id;
            result.hasError().should.be.false;
            setTimeout(function() {
                done()
            })
        })
    })

    it("#create a reply", function(done) {
        domain.exec("create a reply", {
            "title": "my title",
            "body": "my reply body",
            "authorId": "u001",
            "topicId": topicID
        }, function(result) {
            result.hasError().should.be.false;
            done()
        })
    })

    it("#up topic", function(done) {
        domain.exec("top topic", {
            "topicId": topicID
        }, function(result) {
            done()
        })
    })

    it("#down topic", function(done) {
        domain.exec("down topic", {
            "topicId": topicID
        }, function(result) {
            done()
        })
    })

})

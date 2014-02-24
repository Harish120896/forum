var should = require("should")
var my = require("../util/my");
var Reply = require("../../domain/Reply")(my);

describe("Reply", function() {

    var reply;

    it("#new", function() {

        var options = {
            "title": "my title",
            "body": "my reply body",
            "authorId": "aid0001",
            "parentId": "pid0001",
            "topicId": "tid0001"
        }

        reply = new Reply(options);
        reply.title.should.eql("my title")
        reply.body.should.eql("my reply body")
        reply.authorId.should.eql("aid0001")
        reply.parentId.should.eql("pid0001")
        reply.topicId.should.eql("tid0001")
        reply.createTime.should.eql(reply.updateTime)


    })

    it("#updateInfo", function(done) {
        reply.updateInfo("tttt", "bobbobod");

        reply.hasError().should.eql(false);
        reply.updateTimeout = 1;
        setTimeout(function() {
            reply.updateInfo("title1", "body1");
            reply.result.json().errors.should.eql({
                'timeout': ['timeout']
            });
            reply.title.should.eql("tttt")
            reply.body.should.eql("bobbobod")
            done()
        })
    })

});

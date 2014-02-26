var should = require("should")
var my = require("../util/my");
var Message = require("../../domain/Message")(my);

describe("Message", function() {

    var msg

    it("#create", function() {

        msg = new Message({
            targetId: "001",
            authorId: "002",
            title: "tttt",
            body: "bobby"
        });
        msg.hasError().should.be.false;
        should.exist(msg.id);
        should.exist(msg.createTime);
        msg.authorId.should.eql("002");
        msg.title.should.eql("tttt");
        msg.body.should.eql("bobby");

    })

    it("#see", function() {
        msg.havesee.should.be.false;
        msg.see();
        msg.havesee.should.be.true;
    })

})

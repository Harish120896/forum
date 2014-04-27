var domain = require("../domain");
var should = require("should");
var clearDB =require("./util/clearDB");

describe("Message", function () {

    var Message = domain._my.Aggres.Message;

    var msg;

    it("#clearDB",function(done){
        clearDB().then(done);
    });

    it("#new", function () {

        msg = new Message({
            id: "m001",
            authorId: "a001",
            title: "mytitle",
            body: "mybody",
            targetId: "t001"
        })

        msg._id.should.eql("m001");
        msg._authorId.should.eql("a001");
        msg._title.should.eql("mytitle");
        msg._body.should.eql("mybody");
        msg._targetId.should.eql("t001");

        msg._visited.should.eql(false);
        should.exist(msg._createTime);


    })

    it("#access", function () {
        msg.access();
        msg._visited.should.eql(true);
    })

})
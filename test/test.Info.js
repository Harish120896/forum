var domain = require("./util/domain");
var should = require("should");

describe("Message", function () {

    var Info = domain._my.Aggres.Info;

    var info;

    it("#new", function () {

        info = new Info({
            id: "m001",
            body: "mybody",
            targetId: "t001"
        })

        info._id.should.eql("m001");
        info._body.should.eql("mybody");
        info._targetId.should.eql("t001");

        info._visited.should.eql(false);
        should.exist(info._createTime);


    })

    it("#access", function () {
        info.access();
        info._visited.should.eql(true);
    })

})
var should = require("should")
    , domain = require("../domain")
    , Topic = domain._my.Aggres.Topic;

describe("Topic", function () {

    var topic;

    it("#new", function () {

        var options = {
            title: "test title",
            body: "test body",
            authorId: "user001",
            columnId: "id0001"
        }

        topic = new Topic(options);

        topic._accessNum.should.eql(0);
        topic._title.should.eql("test title");
        topic._body.should.eql("test body");
        topic._authorId.should.eql("user001");
        topic._columnId.should.eql("id0001");
        topic._createTime.should.eql(topic._updateTime)

    })

    it("#addSubMark",function(){
        topic.addSubMark(null,"id001");
        topic.addSubMark(null,"id002");
        topic.addSubMark("id001","id003");
        topic._subMarkTree.childIds.length.should.eql(2);
        topic._subMarkTree.getChild("id001").childIds.length.should.eql(1);
    });

});
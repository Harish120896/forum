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
        topic.addReply(null,"id001");
        topic.addReply(null,"id002");
        topic.addReply("id001","id003");
        topic._replyTree.childIds.length.should.eql(2);
        topic._replyTree.getChild("id001").childIds.length.should.eql(1);
    });

    it("#removeSubMark",function(){
        topic.removeReply("id002");
        topic._replyTree.childIds.length.should.eql(1);
        topic.removeReply();
        topic._replyTree.childIds.length.should.eql(0);
    })

    it("#access",function(){
        topic._accessNum.should.eql(0);
        topic.access();
        topic._accessNum.should.eql(1);
    })

    it("#updateInfo",function(){
        var cid;
        domain._my.repos.Column.create({name:"abc",des:"ceee"},function(err,column){
            cid = column.id;
        })
        topic.updateInfo("title01","body001",cid);
        topic._title.should.eql("title01");
        topic._body.should.eql("body001");
    })

});
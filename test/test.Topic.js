var domain = require("./util/domain");
var should = require("should");
var Node = require("tree-node");

describe("Topic", function () {

    var Topic = domain._my.Aggres.Topic;

    var topic;

    it("#new", function () {

        topic = new Topic({id: "t001", title: "mytitle", body: "mybody", columnId: "c001", authorId: "u001"});
        topic._id.should.eql("t001");
        topic._title.should.eql("mytitle");
        topic._body.should.eql("mybody");
        topic._columnId.should.eql("c001");
        topic._authorId.should.eql("u001");
        topic._activation.should.eql(true);
        topic._replyNum.should.eql(0);
        (topic._replyTree instanceof Node).should.be.true;

        topic._updateTime.should.eql(topic._createTime);
        topic._top.should.eql(false);
        topic._fine.should.eql(false);
        topic._accessNum.should.eql(0);

    })

    it("#top & untop", function () {
        topic.top();
        topic._top.should.eql(true);
        topic.untop();
        topic._top.should.eql(false);
    })

    it("#fine & unfine", function () {
        topic.fine();
        topic._fine.should.eql(true);
        topic.unfine();
        topic._fine.should.eql(false);
    })

    it("#access", function () {
        topic.access();
        topic.access();
        topic.access();

        topic._accessNum.should.eql(3);
    })

    it("#addReply", function () {
        topic.addReply(null, "r001");
        var child = topic._replyTree.getChild("r001");
        should.exist(child);
        topic._replyNum.should.eql(1);
    })

    it("#removeReply", function () {
        topic.removeReply("r001");
        var child = topic._replyTree.getChild("r001");
        should.not.exist(child);
        topic._replyNum.should.eql(0);
    })

    it("#updateInfo", function (done) {

        var colId;
        domain._my.repos.Column.create({name: "node.js", des: "js"}, function (err, col) {
            colId = col._id;
        })

        topic.updateInfo("mytitle01", "mybody01", colId).then(function (rs) {
            rs.should.eql("success");
            done()
        }).fail(function (err) {
                console.log(err);
            })

    })

});
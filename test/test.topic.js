var should = require("should"),
	domain = require("./util/domain");

var Topic = domain._my.Aggres.Topic;
var dbs = require("./util/dbrepo").db2;

describe("Topic", function() {

	var topic;

	it("#new", function() {

		var options = {
			title: "test title",
			body: "test body",
			authorId: "user001",
			columnId: "id0001"
		}

		topic = new Topic(options);
		topic.accessNum.should.eql(0);
		topic.title.should.eql("test title");
		topic.body.should.eql("test body");
		topic.authorId.should.eql("user001");
		topic.columnId.should.eql("id0001");
		topic.createTime.should.eql(topic.updateTime);

	})


	it("#addSubMark", function() {
		topic.addReply(null, "id001");
		topic.addReply(null, "id002");
		topic.addReply("id001", "id003");
		topic.replyTree.childIds.length.should.eql(2);
		topic.replyTree.getChild("id001").childIds.length.should.eql(1);
	});


	it("#removeSubMark", function() {
		topic.removeReply("id002");
		topic.replyTree.childIds.length.should.eql(1);
		topic.removeReply();
		topic.replyTree.childIds.length.should.eql(0);
	})

	it("#access", function() {
		topic.accessNum.should.eql(0);
		topic.access();
		topic.accessNum.should.eql(1);
	})

	it("#updateInfo", function(done) {
		
		dbs.getDB("Column").insert({id:"c01"},function(err,col){
			var result = topic.updateInfo("title01", "body001", "c01");
			result.then(function(err){
				topic.title.should.eql("title01");
				topic.body.should.eql("body001");
				done();
			})			
		})

	})

});

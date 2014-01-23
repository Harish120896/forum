var should = require("should"),
	domain = require("../domain");

domain.seal();

var Reply = domain._my.Aggres.Reply;

describe("Topic", function() {

	var reply;

	it("#new", function() {

		var options = {
			"title":"my title",
			"body":"my reply body",
			"authorId":"aid0001",
			"parentId":"pid0001",
			"topicId":"tid0001"
		}

		reply = new Reply(options);
		reply.title.should.eql("my title")
		reply.body.should.eql("my reply body")
		reply.authorId.should.eql("aid0001")
		reply.parentId.should.eql("pid0001")
		reply.topicId.should.eql("tid0001")
		reply.createTime.should.eql(reply.updateTime)
		

	})

	it("#updateInfo",function(done){
		reply.updateInfo("tttt","bobbobod");
		reply.errors.should.eql([]);
		
		reply.updateTimeout = 1;
		
		setTimeout(function(){
			reply.updateInfo("title1","body1");
			reply.errors.should.eql([{ attr: 'timeout', message: 'timeout' }]);
			reply.title.should.eql("tttt")
			reply.body.should.eql("bobbobod")
			done()
		},200)
	})

});

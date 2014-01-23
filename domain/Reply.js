var uid = require("node-uuid").v1,
	Emit = require("events").EventEmitter,
	check = require('validator').check,
	inherits = require("util").inherits;

var createModel = require("model-brighthas");

module.exports = wrap;

function wrap(my) {

	var Reply = createModel("Reply")
		.attr("updateTimeout", {
			type: "number",
			default: 1000 * 60 * 60
		})
		.attr("id")
		.attr("title")
		.attr("body")
		.attr("authorId")
		.attr("parentId")
		.attr("topicId")
		.attr("updateTime", {
			type: "date"
		})
		.attr("createTime", {
			type: "date"
		})
		.on("changed",function(reply,attrs){
			my.publish("*.*.update","Reply",reply.id,this.toJSON(reply,Object.keys(attrs)));
		})
		// update timeout
		.on("changing",function(reply){
			if(Date.now() - reply.updateTime.getTime() > reply.updateTimeout){
				reply.error("timeout","timeout");
			}
		})
		
		
		.on("creating",function(reply){
			reply.attrs.createTime = reply.attrs.updateTime = new Date();
		})
		.method("updateInfo",function(title,body){
			this.begin();
			this.updateTime = new Date();
			this.title = title;
			this.body = body;
			this.end();
			return this.errors;
		})

	Reply.className = "Reply";

	return Reply;
	
}

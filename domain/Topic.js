var uid = require("node-uuid").v1,
	Emit = require("events").EventEmitter,
	check = require('validator').check,
	Node = require("tree-node"),
	Model = require("model-brighthas"),
	attr = require("./plugin/attr");


module.exports = wrap;

function wrap(my) {

	var Topic = Model("Column")

	Topic
		.attr("id")
		.attr("title")
		.attr("body")
		.attr("authorId")
		.attr("columnId")
		.attr("accessNum", {
			type: "number"
			,default:0
		})
		.attr("replyTree", {
			type: Node
		})
		.attr("updateTime", {
			type: "date"
		})
		.attr("createTime", {
			type: "date"
		})
		.use(attr)
	// init replyTree
	.on("creating", function(topic) {
		topic.attrs.replyTree = new Node();
		topic.attrs.createTime = topic.attrs.updateTime = new Date();
	})
	.on("changed",function(topic,attrs){
		my.publish("*.*.update","Topic",topic.id,this.toJSON(topic,Object.keys(attrs)));
	})
		.method("removeReply", function(replyId) {
			var tree = this.replyTree;
			var node = tree.getNode(replyId);
			if (node) {
				var ids = node.allChildIds;
				if (tree === node) {
					var cids = node.childIds;
					cids.forEach(function(cid) {
						node.removeChild(cid);
					});
				} else {
					tree.removeChild(replyId);
				}
				ids.push(replyId);
				ids.forEach(function(id) {
					my.repos.Reply.remove(id);
				})
			}
		})
		.method("access", function() {
			var num = this.accessNum;
			this.accessNum = num + 1;
		})
		.method("addReply", function(parentId, replyId) {
			var tree = this.replyTree;
			var parent = tree.getNode(parentId);
			parent.appendChild(new Node(replyId));
		})
		.method("updateInfo", function(title, body, columnId) {
			this.begin();
			this.title = title;
			this.body = body;
			this.columnId = columnId;
			this.end();
			return this.errors;
		})

	Topic.className = "Topic";

	return Topic;
}

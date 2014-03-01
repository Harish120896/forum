var uid = require("node-uuid").v1,
    Emit = require("events").EventEmitter,
    check = require('validator').check,
    Node = require("tree-node"),
    Model = require("model-brighthas"),
    Q = require("q"),
    _ = require("underscore");

module.exports = wrap;

function wrap(my) {

    var Topic = Model("Column")

    Topic
        .attr("id", {
            readonly: true
        })
        .attr("title", {
            min: 2,
            required: true,
            max: 35,
            message: "标题2~35字符"
        })
        .attr("body", {
            min: 2,
            max: 1000,
            required: true,
            message: "内容2～1000字符"
        })
        .attr("authorId", {
            required: true
        })
        .attr("columnId", {
            required: true
        })
        .attr("seal", {
            type: "boolean",
            default: false
        })
        .attr("accessNum", {
            type: "number",
            default: 0
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
        .on("creating", function(topic) {
            topic.attrs.replyTree = new Node();
            topic.attrs.createTime = topic.attrs.updateTime = new Date();
			topic.attrs.id = uid();
        })
        .on("changed", function(topic, attrs) {
            my.publish("*.*.update", "Topic", topic.id, this.toJSON(topic, Object.keys(attrs)));
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
			console.log(replyId)
            var tree = this.replyTree;
            var parent = tree.getNode(parentId);
			if(parent){
	            parent.appendChild(new Node(replyId));
			}
			
        })
        .method("updateInfo", function(title, body, columnId) {
            var deferred = Q.defer();
            var self = this;

            my.services.existColumn(columnId, function(has) {
                if (has) {
                    self.begin();
                    self.title = title;
                    self.body = body;
                    self.columnId = columnId;
                    self.end();
                } else {
                    self.result.error("columnId", "没有这个栏目");
                }
                deferred.resolve(self.result);
            });
            return deferred.promise;
        })
        .method("toseal", function() {
            this.seal = true;
        })
        .method("unseal", function() {
            this.seal = false;
        })

    Topic.className = "Topic";

    return Topic;
}

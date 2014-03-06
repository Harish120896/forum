var Emit = require("events").EventEmitter,
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
        .attr("id", {
            readonly: true
        })
        .attr("title", {
            min: 2,
            max: 35,
            required: true,
            message: "标题2~35字符"
        })
        .attr("body", {
            min: 2,
            required: true,
            max: 1000,
            message: "内容2～1000字符"
        })
        .attr("authorId", {
            required: true
        })
        .attr("parentId")
        .attr("topicId", {
            required: true
        })
        .attr("updateTime", {
            type: "date"
        })
        .attr("createTime", {
            type: "date"
        })
        .on("changed", function(reply, attrs) {
            my.publish("*.*.update", "Reply", reply.id, this.toJSON(reply, Object.keys(attrs)));
        })
        .on("changing", function(reply) {
            if (Date.now() - reply.updateTime.getTime() > reply.updateTimeout) {
                reply.result.error("timeout", "timeout");
            }
        })
        .on("creating", function(reply) {
            reply.attrs.createTime = reply.attrs.updateTime = new Date();
        })
        .method("updateInfo", function(title, body) {
            this.begin();
            this.updateTime = new Date();
            this.title = title;
            this.body = body;
            this.end();
            return this.result;
        })

    Reply.className = "Reply";

    return Reply;

}

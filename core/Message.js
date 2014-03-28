module.exports = wrap;
var createModel = require("model-brighthas");

function wrap(my) {

    var Message = createModel("Message");

    Message
        .attr("id", {
            readonly: true
        })
        .attr("authorId", {
            required: true
        })
        .attr("title", {
            required: true,
            min: 2,
            max: 20
        })
        .attr("body", {
            required: true,
            min: 2,
            max: 200
        })
        .attr("targetId", {
            required: true
        })
        .attr("createTime", {
            type: "date"
        })
        .attr("havesee", {
            type: "boolean",
            default: false
        })
        .method("see", function () {
            if (!this.havesee) {
                this.havesee = true;
            }
        })

    Message.on("creating", function (msg) {
        msg.attrs.createTime = new Date();
    })

    Message.className = "Message";

    return Message;

}

module.exports = wrap;
var uid = require("node-uuid").v1;

var createModel = require("model-brighthas");

function wrap(my) {

    var Info = createModel("Info");

    Info
        .attr("id", {
            readonly: true
        })
        .attr("targetId", {
            required: true,
            readonly: true
        })
        .attr("body", {
            required: true,
            max: 500,
            readonly: true
        })
        .attr("createTime", {
            type: "date"
        })
        .attr("havesee", {
            type: "boolean",
            default: false
        })
        .method("see", function() {
            if (!this.havesee) {
                this.havesee = true;
            }
        })

    Info.on("creating", function(info) {
        info.attrs.createTime = new Date();
		info.attrs.id = uid();
    })

    Info.className = "Info";

    return Info;

}

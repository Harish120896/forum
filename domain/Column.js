var uid = require("node-uuid").v1,
    createModel = require("model-brighthas"),
    _ = require("underscore");


module.exports = wrap;

function wrap(my) {
    var Column = createModel("Column")
        .attr('id', {
            default: uid(),
            readonly: true
        })
        .attr("name", {
            type: "string",
            required: true
        })
        .attr("updateTime", {
            type: "date"
        })
        .attr("createTime", {
            type: "date"
        })
        .attr("managerId")
        .attr("des")

    .on("creating", function(column) {
        column.attrs.createTime = column.attrs.updateTime = new Date();
    })

    .on("changing", function(column, attrs) {
        attrs.updateTime = new Date;
    })

    .on("changed", function(column, attrs) {
        my.publish("*.*.update", "Column", column.id, column.toJSON());
    })

    .method("up", function() {
        this.updateTime = new Date;
    })

    .method("setManager", function(uid) {
		
		var self = this;
		my.services.existUser(uid,function(exist){
			if(exist)
	        self.managerId = uid;
		});
		
    })

    .method("updateInfo", function(name, des) {
        this.set({
            name: name,
            des: des
        });
        return this.result;
    })


    Column.className = "Column";

    return Column;
}

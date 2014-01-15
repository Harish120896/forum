var uid = require("node-uuid").v1,
	Model = require("modella"),
	Validators = require("modella-validators"),
	ColumnModel = new Model("Column"),
    inherits = require("util").inherits;

	ColumnModel.use(Validators);

	// DOTO  , add validator
	ColumnModel
		.attr('id')
		.attr("name",{type:"string",required: true})
		.attr("top",{type:"boolean"})
		.attr("accessNum",{type:"number"})
		.attr("updateTime",{type:"number"})
		.attr("createTime",{type:"number"})
		.attr("des",{type:"string"})

module.exports = wrap;

function wrap(my) {

    var emitUpdate = require("./emitUpdate")("Column", my);

    function Column(name,des) {
		des = des || "";
		var time = Date.now();
		var model = this.model = new ColumnModel(
			{id:uid(),name:name,des:des,top:false,accessNum:0,updateTime:time,createTime:time}
		);
		this.model.on("setting",function(data){
			my.publish("Column.*.update", model.id,data);
		});
		this.model.on("change",function(k,v){
			var o = {};
			o[k] = v;
			my.publish("Column.*.update", model.id,o);
		});
    }
	
    var proto = Column.prototype;

    proto.up = function () {
        this.model.updateTime( Date.now());
    }

    proto.top = function () {
        if (this.model.top() === false) {
			this.model.set({
				top:true,
				updateTime:Date.now()
			})
        }
    }

    proto.goin = function (readerId) {
		var accessNum = this.model.accessNum();
		this.model.accessNum(accessNum+1);
        my.publish("goin column", readerId);
    }

    proto.untop = function () {
        if (this.model.top() === true) {
			this.model.top(false);
        }
    }

    proto.updateInfo = function (name, des) {
		this.model.set({name:name,des:des,updateTime:Date.now()})
    }

    Object.defineProperty(proto, "id", {
        value: function () {
            return this.model.id();
        }
    })

    Column.className = "Column";

    return Column;
}

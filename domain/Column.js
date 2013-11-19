var uid = require("node-uuid").v1,
    Emit = require("events").EventEmitter,
    check = require('validator').check,
    inherits = require("util").inherits;

module.exports = wrap;

function wrap(my){

    function emitUpdate(aggreObj,fieldNames){
        var data = {};
        fieldNames.forEach(function(name){
            data[name] = aggreObj["_"+name];
        })
        my.publish("Column.*.update",data);
    }

    function Column(name,des){
        this._name = name;
        this._id = uid();
        this._top = false;
        this._accessNum = 0;
        this._updateTime =
        this._createTime = Date.now();
        this._des = des || "";
    }

    inherits(Column,Emit);

    var proto = Column.prototype;

    proto.up = function(){
        this._updateTime = Date.now();
        emitUpdate(this,["updateTime"]);
    }

    proto.top = function(){
        if(this._top === false){
            this._top = true;
            this._updateTime = Date.now();
            emitUpdate(this,["top","updateTime"]);
        }
    }

    proto.access = function(readerId){
        this._accessNum += 1;
        emitUpdate(this,["accessNum"]);
        my.publish("access column",readerId);
    }

    proto.uptop = function(){
        if(this._top === true){
           this._top = false;
           emitUpdate(this,["top"]);
        }
    }

    proto.updateInfo = function(name,des){
        check(name).len(2, 15);
        this._name = name;
        this._updateTime = Date.now();
        var fieldNames = ["name","updateTime"];
        if(des){
            this._des = des;
            fieldNames.push(des);
        }
        emitUpdate(this,fieldNames);
    }

    Column.className = "Column";

    return Column;
}

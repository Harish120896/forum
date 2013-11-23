var uid = require("node-uuid").v1,
    Emit = require("events").EventEmitter,
    inherits = require("util").inherits;

module.exports = wrap;

function wrap(my){

    var emitUpdate = require("./emitUpdate")("Column",my);

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

    proto.goin = function(readerId){
        this._accessNum += 1;
        emitUpdate(this,["accessNum"]);
        my.publish("goin column",readerId);
    }

    proto.untop = function(){
        if(this._top === true){
           this._top = false;
           emitUpdate(this,["top"]);
        }
    }

    proto.updateInfo = function(name,des,callback){

        my.services.updateColumnValidator(name,des,function(pass){
            if(pass){
                this._name = name;
                this._updateTime = Date.now();
                var fieldNames = ["name","updateTime"];
                if(des){
                    this._des = des;
                    fieldNames.push("des");
                }
                emitUpdate(this,fieldNames);
                callback();
            }else{
                callback(new Error());
            }
        });

    }

    Object.defineProperty(proto,"id",{
        value:function(){
            return this._id;
        }
    })

    Column.className = "Column";

    return Column;
}

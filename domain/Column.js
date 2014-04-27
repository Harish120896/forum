
var validator = require("validator");

module.exports = wrap;

function wrap(my) {

    function Column(id,name,des){
        this._id = id;
        this._managerId = null;
        this._createTime = this._updateTime = Date.now();
        this.updateInfo(name,des);

    }

    Object.defineProperty(Column.prototype,"managerId",{
        get:function(){
            return this._managerId;
        }
    })

    Column.prototype.top = function(){
        this._updateTime = Date.now();
        my.publish("*.*.update","Column",this._id,{updateTime:this._updateTime});
    }

    Column.prototype.setManager = function(managerId){
        var self = this;
        my.repos.User.get(managerId).then(function(u){
            if(u){
                self._managerId = managerId;
                my.publish("*.*.update","Column",self._id,{managerId:managerId});
                my.publish("*.*.update","Column",self._id,{managerId:managerId});
            }
        })

    }

    /**
     * 更改栏目名称和描述信息
     * @param name
     * @param des
     */
    Column.prototype.updateInfo  = function(name,des){
        if(validator.isLength(name,2,30) && validator.isLength(des,0,1000)){
            this._name = name;
            this._des = des || "";
            my.publish("*.*.update","Column",this._id,{name:this._name,des:this._des,updateTime:this._updateTime});
        }else{
            throw {error:"更改栏目信息失败"}
        }
    }

    Column.className = "Column";

    return Column;
}

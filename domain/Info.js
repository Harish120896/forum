module.exports = wrap;

function wrap(my) {

    /**
     *
     * 信息通知，一般是系统创建的。
     *
     * reposiotry create 方法调用它，并验证参数有效性。
     * @param args {id,body,targetId}
     * @constructor
     */
    function Info(args){
        this._id = args.id;
        this._body = args.body;
        this._targetId = args.targetId;
        this._createTime = Date.now();
        this._visited = false;
    }

    Info.prototype.access = function () {
        if (!this._visited) {
            this._visited = true;
            my.publish("*.*.update","Info",this._id,{visited: true});
        }
    }

    Info.className = "Info";

    return Info;

}

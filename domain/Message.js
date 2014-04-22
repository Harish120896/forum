module.exports = wrap;

function wrap(my) {

    /**
     * 由 repository 负责调用，并验证参数有效性。
     * @param args {id,authorId,title,body,targetId}
     * @constructor
     */
    function Message(args) {
        this._id = args.id;
        this._authorId = args.authorId;
        this._title = args.title;
        this._body = args.body;
        this._targetId = args.targetId;
        this._visited = false;
        this._createTime = Date.now();
    }

    Message.prototype.access = function () {
        if (!this._visited) {
            this._visited = true;
            my.publish("*.*.update","Message",this._id,{id: this._id, visited: true});
        }
    }

    Message.className = "Message";

    return Message;

}

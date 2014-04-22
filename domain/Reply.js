module.exports = wrap;

function wrap(my) {


    /**
     * 参数验证由reposiotry create方法负责
     * @param args
     * @constructor
     */
    function Reply(args){
        this._id = args.id;
        this._title = args.title;
        this._body = args.body;
        this._authorId = args.authorId;
        this._parentId = args.parentId;
        this._topicId = args.topicId;
        this._createTime = Date.now();
    }

    Reply.className = "Reply";

    return Reply;

}

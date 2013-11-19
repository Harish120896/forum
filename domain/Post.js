var uid = require("node-uuid").v1,
    Emit = require("events").EventEmitter,
    check = require('validator').check,
    inherits = require("util").inherits;

function wrap(my){

    var emitUpdate = require("./emitUpdate")("Post",my);

    // options:{title,body,authorId,columnId,parentId}
    function Post(options){
        this._id = uid();
        this._title = options.title;
        this._body = options.body;
        this._authorId = options.authorId;
        this._columnId = options.columnId
        this._parentId = options.parentId;
        this._updateTime =
        this._createTime = Date.now();
    }

    inherits(Post,Emit);

    var proto = Post.prototype;

    proto.updateInfo = function(title,body,columnId){

        check(title).len(3, 18);
        check(body).len(5,2000);

        if(this._parentId){
            columnId = null;
        }
        this._title = title;
        this._body = body;
        var fieldNames = ["name","updateTime"];
        if(columnId){

            var existColumn = my.services["existColumn"];
            existColumn(columnId,function(exist){
                if(exist){
                    this._columnId = columnId;
                    fieldNames.push("columnId");
                    emitUpdate(this,fieldNames);
                }
            })

        }else{
            emitUpdate(this,fieldNames);
        }

    }

    Post.className = "Column";

    return Post;
}

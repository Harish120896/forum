var uid = require("node-uuid").v1,
    Emit = require("events").EventEmitter,
    check = require('validator').check,
    inherits = require("util").inherits;

function wrap(my){

    var emitUpdate = require("./emitUpdate")("Column",my);

    function Post(title,body,authorId){
        this._id = uid();
        this._title = title;
        this._body = body;
        this._authorId = authorId;
    }

    inherits(Post,Emit);

    var proto = Post.prototype;

    Post.className = "Column";

    return Post;
}

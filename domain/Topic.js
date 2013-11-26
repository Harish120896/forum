var uid = require("node-uuid").v1,
    Emit = require("events").EventEmitter,
    check = require('validator').check,
    Node = require("tree-node"),
    inherits = require("util").inherits;

module.exports = wrap;

function wrap(my){

    var emitUpdate = require("./emitUpdate")("Topic",my);

    // options:{title,body,authorId,columnId}
    function Topic(options){
        this._id = uid();
        this._title = options.title;
        this._body = options.body;
        this._authorId = options.authorId;
        this._replyTree = new Node();
        this._accessNum = 0;
        this._columnId = options.columnId;
        this._updateTime =
            this._createTime = Date.now();
    }

    inherits(Topic,Emit);

    var proto = Topic.prototype;

    // if replayID == null , then remove all replay.
    proto.removeReply = function(replyId){
        var node = this._replyTree.getNode(replyId);
        if(node){
            var ids = node.allChildIds;
            if(this._replyTree.id === node.id){
                var cids = node.childIds;
                cids.forEach(function(cid){
                    node.removeChild(cid);
                });
            }else{
                this._replyTree.removeChild(replyId);
            }
            emitUpdate(this,["replyTree"]);
            ids.push(replyId);
            ids.forEach(function(id){
                my.repos.Reply.remove(id);
            })
        }
    }

    proto.access = function(){
        this._accessNum += 1;
        emitUpdate(this,["accessNum"]);
    }

    // command handle call
    proto.addReply = function(parentId,replyId){
        var parent = this._replyTree.getNode(parentId);
        parent.appendChild(new Node(replyId));
        emitUpdate(this,["subMarkTree"]);
    }

    proto.updateInfo = function(title,body,columnId){
        check(title).len(3, 18);
        check(body).len(5,2000);

        this._title = title;
        this._body = body;
        var fieldNames = ["title","updateTime","body"];
        if(columnId){

            var existColumn = my.services["existColumn"];
            existColumn(columnId,function(exist){
                if(exist){
                    this._columnId = columnId;
                    fieldNames.push("columnId");
                }
                emitUpdate(this,fieldNames);
            })

        }else{
            emitUpdate(this,fieldNames);
        }
    }

    Topic.className = "Topic";

    return Topic;
}

var uid = require("node-uuid").v1,
    Emit = require("events").EventEmitter,
    check = require('validator').check,
    Node = require("tree-node"),
    inherits = require("util").inherits;

function wrap(my){

    var emitUpdate = require("./emitUpdate")("MainPost",my);

    // options:{title,body,authorId,columnId}
    function MainPost(options){
        this._id = uid();
        this._title = options.title;
        this._body = options.body;
        this._authorId = options.authorId;
        this._subMarkTree = new Node();
        this._accessNum = 0;
        this._columnId = options.columnId;
        this._updateTime =
            this._createTime = Date.now();
    }

    inherits(MainPost,Emit);

    var proto = MainPost.prototype;


    proto.removeSubMark = function(subPostId){
        var postMark = this._subMarkTree.getNode(subPostId);
        if(postMark && postMark.id !== this._subMarkTree.id){
            this._subMarkTree.removeChild(subPostId);
            emitUpdate(this,["subMarkTree"]);
            var ids = postMark.allChildIds;
            ids.push(subPostId);
            ids.forEach(function(id){
                my.repos.SubPost.remove(id);
            })
        }
    }

    proto.access = function(){
        this._accessNum += 1;
        emitUpdate(this,["accessNum"]);
    }

    proto.addSubMark = function(parentPostId,subPostId){
        var parent = this._subMarkTree.getNode(parentPostId);
        parent.appendChild(new Node(subPostId));
        emitUpdate(this,["subMarkTree"]);
    }

    proto.updateInfo = function(title,body,columnId){

        check(title).len(3, 18);
        check(body).len(5,2000);

        if(this._parentId){
            columnId = null;
        }
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

    MainPost.className = "MainPost";

    return MainPost;
}

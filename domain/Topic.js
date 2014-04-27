var Node = require("tree-node"),
    escape = require("./escape"),
    validator = require("validator"),
    Q = require("q");

module.exports = wrap;

function wrap(my) {


    /**
     * 命令处理器调用
     * @param args
     * @constructor
     */
    function Topic(args) {

        this._id = args.id;
        this._title = args.title;
        this._body = escape(args.body);

        this._authorId = args.authorId;
        this._columnId = args.columnId;

        this._activation = true;
        this._replyTree = new Node();
        this._createTime = this._updateTime = Date.now();
        this._top = false;
        this._fine = false;
        this._accessNum = 0;
        this._replyNum = 0;

    }


    Topic.mix = function (obj) {
        Object.defineProperties(obj, {

            authorId:{
                get:function(){
                    return this._authorId;
                }
            },

            columnId:{
                get:function(){
                    return this._columnId;
                }
            },

            top:{
                value:function(){
                    if(!this._top){
                        this._top = true;
                        my.publish("*.*.update", "Topic" ,this._id,{top:this._top});
                    }
                }
            },

            untop:{
                value:function(){
                    if(this._top){
                        this._top = false;
                        my.publish("*.*.update", "Topic" ,this._id,{top:this._top});
                    }
                }
            },

            fine:{
                value:function(){
                    if(!this._fine){
                        this._fine = true;
                        my.publish("*.*.update", "Topic" , this._id,{ fine:this._fine});
                    }
                }
            },

            unfine:{
                value:function(){
                    if(this._fine){
                        this._fine = false;
                        my.publish("*.*.update", "Topic" , this._id,{ fine:this._fine});
                    }
                }
            },

            removeReply: {
                value: function (replyId) {

                    var tree = this._replyTree;
                    var node = tree.getNode(replyId);
                    if (node) {
                        var ids = node.allChildIds;
                        if (tree === node) {
                            var cids = node.childIds;
                            cids.forEach(function (cid) {
                                node.removeChild(cid);
                            });
                        } else {
                            tree.removeChild(replyId);
                        }
                        ids.push(replyId);
                        ids.forEach(function (id) {
                            my.repos.Reply.remove(id);
                        })


                        this._replyNum = tree.allChildIds.length;

                        my.publish("*.*.update", "Topic", this._id, { replyNum: this._replyNum, replyTree: this._replyTree.toJSON()})
                    }

                }
            },
            access: {
                value: function () {
                    this._accessNum += 1;
                    my.publish("*.*.update", "Topic" , this._id ,{ accessNum: this._accessNum});
                }
            },

            /**
             * private , 事件处理器调用，当有回复主题的 回复产生时调用。
             */
            addReply: {
                value: function (parentId, replyId) {
                    var tree = this._replyTree;
                    var parent = tree.getNode(parentId);
                    if (parent) {
                        parent.appendChild(new Node(replyId));
                        this._replyNum = tree.allChildIds.length;
                        my.publish("*.*.update", "Topic" , this._id, { replyNum: this._replyNum, replyTree: this._replyTree.toJSON()})
                    }
                }
            },
            updateInfo: {
                value: function (title, body, columnId) {

                    var deferred = Q.defer();
                    var self = this;

                    my.repos.Column.get(columnId).then(function(col){
                        if (col) {

                            var error=null;
                            if (!validator.isLength(title, 2, 25)) {
                                error = error || {};
                                error.title = "主题标题字符长度2～25";
                            }

                            if (!validator.isLength(body, 0, 2000)) {
                                error = error || {};
                                error.body = "主题内容 2000 字符以内";
                            }

                            if(error){
                                deferred.reject(error);
                            }else{
                                self._title = title;
                                self._body = body;
                                self._columnId = columnId;
                                my.publish("*.*.update", "Topic" , self._id, {title:self._title,body:self._body,columnId:self._columnId});
                                deferred.resolve("success");
                            }


                        } else {
                            deferred.reject(500);
                        }
                    })

                    return deferred.promise;
                }
            }

        })
    }

    Topic.mix(Topic.prototype);

    Topic.className = "Topic";

    return Topic;
}

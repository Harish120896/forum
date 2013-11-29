var Node = require("tree-node");
module.exports = wrap;

function wrap(my) {


    var topicRepo = new my.Repository("Topic");

    topicRepo._create = function(args,callback){
        var Topic = my.Aggres.Topic;
        var topic = new Topic(args);
        callback(null,topic);
    }

    topicRepo._data2aggre = function(data){
        var Topic = my.Aggres.Topic;
        var topic = new Topic(data);
        topic._id = data.id;
        var tree = new Node();
        tree.reborn(data.replyTree);
        topic._replyTree = tree;
        topic._updateTime = data.updateTime;
        topic._createTime = data.createTime;
        return topic;
    }

    topicRepo._aggre2data = function(aggre){

        return {
            id:aggre.id,
            title:aggre._title,
            body:aggre._body,
            authorId:aggre._authorId,
            replyTree:aggre._replyTree,
            accessNum:aggre._accessNum,
            columnId:aggre._columnId,
            updateTime:aggre._updateTime,
            createTime:aggre._createTime
        }

    }


    var replyRepo = new my.Repository("Reply");

    replyRepo._create = function (args, callback) {
        var Reply = my.Aggres.Reply;
        var reply = new Reply(args);
        callback(null, reply);
    }

    replyRepo._data2aggre = function (data) {

        var Reply = my.Aggres.Reply;
        var reply = new Reply(data);
        reply._id = data.id;
        reply._updateTime = data.updateTime;
        reply._createTime = data.createTime;

        return reply;
    }

    replyRepo._aggre2data = function (aggre) {
        return {
            id: aggre.id,
            title: aggre._title,
            body: aggre._body,
            authorId: aggre._authorId,
            parentId: aggre._parentId,
            topicId: aggre._topicId,
            updateTime: aggre._updateTime,
            createTime: aggre._createTime
        }
    }


    var columnRepo = new my.Repository("Column");

    columnRepo._create = function (args, callback) {
        var Column = my.Aggres.Column;
        var column = new Column(args.name, args.des);
        callback(null, column);
    }

    columnRepo._aggre2data = function (aggre) {
        return {
            name: aggre._name,
            id: aggre._id,
            top: aggre._top,
            accessNum: aggre._accessNum,
            updateTime: aggre._updateTime,
            createTime: aggre._createTime,
            des: aggre._des
        }
    }

    columnRepo._data2aggre = function (data) {
        var aggre = new my.Aggres.Column(data.name, data.des);
        aggre._updateTime = data.updateTime;
        aggre._id = data.id;
        aggre._top = data.name;
        aggre._accessNum = data.accessNum;
        aggre._createTime = data.createTime;
        return aggre;
    }

    return [replyRepo, columnRepo, topicRepo];
}
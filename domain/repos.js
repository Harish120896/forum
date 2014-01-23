var Node = require("tree-node")
    ,check = require('validator').check
    ,crypto = require("crypto");

module.exports = wrap;

function wrap(my) {

    var topicRepo = new my.Repository("Topic");

    topicRepo._create = function (args, callback) {
        var Topic = my.Aggres.Topic;
        var topic = new Topic(args.title,args.body,args.authorId,args.columnId);
        callback(null, topic);
    }

    topicRepo._data2aggre = function (data) {
		
        var Topic = my.Aggres.Topic;
        var topic = new Topic(data.title,data.body,data.authorId,data.columnId);
		var model = topic.model;
        
        var tree = new Node();
        tree.reborn(data.replyTree);
		
		for(var k in data){
			model.attrs[k] = model.dirty[k] = data[k];
		}
		
        return topic;
    }

    topicRepo._aggre2data = function (aggre) {

        var o = aggre.model.toJSON();
		o.replyTree = aggre.model.replyTree().json;
		return o;

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
		return aggre.model.toJSON();
    }

    columnRepo._data2aggre = function (data) {
        var aggre = new my.Aggres.Column(data.name, data.des);
		aggre.model.set(data);
        return aggre;
    }

    var userRepo = new my.Repository("User");

    userRepo._create = function (args, callback) {
        my.services.userUnique(args,function(err){
            if(err){
                callback(err);
            }else{
                var md5 = crypto.createHash('md5');
                args.password = md5.update(args.password).digest("hex");
                var user = new my.Aggres.User({nickname:args.nickname, loginname:args.loginname, password:args.password, email:args.email});
                if(user.hasError()){
                	callback(user.errors);
                }else{
					callback(null, user);
                }
            }
        });
    }

    userRepo._aggre2data = function (aggre) {
        return aggre.toJSON();
    }

    userRepo._data2aggre = function (data) {
        return my.Aggres.User.reborn(data);
    }

    return [replyRepo, columnRepo, topicRepo, userRepo];
}
var Node = require("tree-node")
    ,crypto = require("crypto");

module.exports = wrap;

function wrap(my) {

    var topicRepo = new my.Repository("Topic");

    topicRepo._create = function (args, callback) {
        var Topic = my.Aggres.Topic;
		var topic = new Topic(args);
		if(topic.hasError()){
			callback(topic.errors);
		}else{
	        callback(null, topic);
		}
    }

    topicRepo._data2aggre = function (data) {
        var Topic = my.Aggres.Topic;
        return Topic.reborn(data);
    }

    topicRepo._aggre2data = function (aggre) {
		return aggre.toJSON();
    }


    var replyRepo = new my.Repository("Reply");

    replyRepo._create = function (args, callback) {
        var Reply = my.Aggres.Reply;
        var reply = new Reply(args);
		if(reply.hasError()){
			callback(reply.errors);
		}else{
	        callback(null, reply);
		}
    }

    replyRepo._data2aggre = function (data) {

        var Reply = my.Aggres.Reply;
		return Reply.reborn(data);
    }

    replyRepo._aggre2data = function (aggre) {
        return aggre.toJSON();
    }


    var columnRepo = new my.Repository("Column");

    columnRepo._create = function (args, callback) {
        var Column = my.Aggres.Column;
        var column = new Column(args);
		if(column.hasError()){
	        callback(column.errors);
			
		}else{
			callback(null,column)
		}
    }

    columnRepo._aggre2data = function (aggre) {
		return aggre.toJSON();
    }

    columnRepo._data2aggre = function (data) {
        var Column = my.Aggres.Column;
        return Column.reborn(data);
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
var Node = require("tree-node")
    ,crypto = require("crypto")
	,Result = require("result-brighthas")
	,hus = require("huskies")
	,lock = require("huskies-lock");

module.exports = wrap;

function wrap(my) {

    var topicRepo = new my.Repository("Topic");

    topicRepo._create = function (args, callback) {
        var Topic = my.Aggres.Topic;
		var topic = new Topic(args);
		var result = new Result();
		result.mix(topic.result);
		result.data("topic",topic.toJSON())
		callback(result);
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
		var result = new Result();
		result.mix(reply.result);
		result.data("reply",reply.toJSON())
		callback(result);
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
		var result = new Result();
		result.mix(column.result);
		result.data("column",column.toJSON())
		callback(result);
    }

    columnRepo._aggre2data = function (aggre) {
		return aggre.toJSON();
    }

    columnRepo._data2aggre = function (data) {
        var Column = my.Aggres.Column;
        return Column.reborn(data);
    }

    var userRepo = new my.Repository("User");

    userRepo._create = hus(function (args, callback) {
		var result = new Result();
        my.services.userUnique(args.email,args.nickname,function(unique){
            if(unique){
				unique.forEach(function(k){
					if(k === "nickname"){
						result.error("nickname","昵称已被使用");
					}
					if(k === "email"){
						result.error("email","邮箱已被使用");
					}
				});
            }else{
                var user = new my.Aggres.User(args);
				result.mix(user.result);
				result.data("user",user.toJSON())
            }
			callback(result);
			
        });
    }).use(lock);

    userRepo._aggre2data = function (aggre) {
        return aggre.toJSON();
    }

    userRepo._data2aggre = function (data) {
        return my.Aggres.User.reborn(data);
    }
	
	var messageRepo = new my.Repository("Message");
	
	
	messageRepo._create = function(args,callback){
		var msg = new my.Aggres.Message(args);
		result.mix(msg.result);
		result.data("message",msg.toJSON());
		callback(result);
	}
	
	messageRepo._data2aggre = function(data){
		return my.Aggres.Message.reborn(data);
	}

	messageRepo._aggre2data = function(aggre){
		return aggre.toJSON();	
	}
	
	var infoRepo = new my.Repository("Info");
	
	infoRepo._create = function(args,callback){
		var info = new my.Aggres.Info(args);
		result.mix(info.result);
		result.data("info",info.toJSON());
		callback(result);
	}
	
	infoRepo._data2aggre = function(data){
		return my.Aggre.Info.reborn(data);
	}

	infoRepo._aggre2data = function(aggre){
		return aggre.toJSON();	
	}

    return [replyRepo, columnRepo, topicRepo, userRepo,messageRepo , infoRepo];
}
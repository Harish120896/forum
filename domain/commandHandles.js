module.exports = wrap;
var filterNickname  = require("./filterNickname");
var check = require("validator").check;
var Result = require("result-brighthas");

//var query = require("../infrastructure/query");

function wrap(my) {



    //////////////////////  command handle for Topic  ////////////////////
    // create a topic.
    handle1.commandName = "create a topic";
    function handle1(args, callback) {
		var result = new Result();
		my.services.postTopicCheck(args.authorId,function(pass){
			if(pass){
				my.repos.Topic.create(args, function(err,topic){
					if(topic){
						result.data("topic",topic);
					}else{
						result.error("error",err);
					}
					callback(result);
				});
			}else{
				result.error("error","error");
				callback(result);
			}
		})
    }


    // remove a topic
    handle2.commandName = "remove a topic";
    function handle2(args, callback) {
		my.repos.Topic.remove(args.id);
		callback(new Result());
    }
	
	handle3.commandName = "create a reply";
	function handle3(args,callback){
		var result = new Result();
		my.repos.Topic.get(args.topicId,function(err,topic){
			if(topic){
				my.services.postReplyCheck(args.authorId,function(pass){
					
					if(pass){
						my.repos.Reply.create(args,function(err,reply){
							if(reply){
								topic.addReply(reply.parentId, reply);
								result.data("reply",reply);
							}else{
								result.error("error",err);
							}
							callback(result);
						});
					}else{
						result.error("error","no reply");
						callback(result);
					}

				});			
			}else{
				result.error("error","no reply");
				callback(result);
			}
		})	
	}
	
	handle5.commandName = "remove a reply";
	function handle5(args,callback){

		my.repos.Topic.get(args.topicId,function(topic){
			if(topic){
				topic.removeReply(args.replyId);
			}
		})

		callback(new Result());
	}

    //////////////////////  command handle for User  ////////////////////
    handle4.commandName = "create a user";
    function handle4(args, callback) {
        my.repos.User.create(args, callback);
    }
	
    handle6.commandName = "create a column";
    function handle6(args, callback) {
        my.repos.Column.create(args,callback);
    }
	
	handle7.commandName = "send message";
	function handle7(args,callback){
		var title = args.title;
		var body = args.body;
		var authorId = args.authorId;
		if(body){
			filterNickname(body).forEach(function(name){
				my.services.userByNick(name,function(user){
					if(user){
						my.repos.Message.create({
							title:title,
							body:body,
							authorId:authorId,
							targetId:user.id
						},function(err){});
					}
				});
			});
		}
		callback(new Result());
	}
	
    return [ handle1, handle2, handle3 , handle4 ,handle5 , handle6, handle7 ]
}
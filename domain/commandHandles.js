module.exports = wrap;

var check = require("validator").check;

function wrap(my) {



    //////////////////////  command handle for Topic  ////////////////////
    // create a topic.
    handle1.commandName = "create a topic";
    function handle1(args, callback) {
		my.services.postTopicCheck(args.authorId,function(pass){
			if(pass){
				my.repos.Topic.create(args, callback);
			}else{
				callback("have error");
			}
		})
    }


    // remove a topic
    handle2.commandName = "remove a topic";
    function handle2(args, callback) {
        my.repos.Topic.get(args.id, function (err, topic) {
            if (topic) {
                topic.removeReply();
                topic.remove();
            }
            callback();
        });
    }
	
	handle3.commandName = "create a reply";
	function handle3(args,callback){
	
		my.services.postReplyCheck(args.authorId,function(pass){
			if(pass){
				my.repos.Reply.create(args,function(err,reply){
					if(reply){
						my.repos.Topic.get(reply.topicId,function(topic){
							topic.addReply(reply.parentId, reply.id);
						})
					}
				});
			}

		});
		
		callback();
		
	}
	
	handle5.commandName = "remove a reply";
	function handle5(args,callback){

		my.repos.Topic.get(args.topicId,function(topic){
			topic.removeReply(args.replyId);
		})

		callback();
	}

    //////////////////////  command handle for User  ////////////////////
    handle4.commandName = "create a user";
    function handle4(args, callback) {
        my.repos.User.create(args, callback);
    }
	
    handle6.commandName = "create a column";
    function handle6(args, callback) {
        my.repos.Column.create(args, callback);
    }

    return [handle1, handle2, handle3 , handle4,handle5 , handle6]
}
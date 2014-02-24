
module.exports = wrap;

function wrap(my){

    handle1.eventName = "User.*.create";

    function handle1(user){

    }
	
	handle2.eventName = "Topic.*.create";
	
	function handle2(topic){
		my.repos.User.get(topic.authorId,function(err,user){
			if(user){
				user.plus(5);
			}
		})
	}
	
	handle3.eventName = "Reply.*.create";
	
	function handle3(reply){
		my.repos.User.get(reply.authorId,function(err,user){
			if(user){
				user.plus(1);
			}
		})
	}
	
    return [handle1,handle2];
}

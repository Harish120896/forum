var check = require('validator').check,
    huskies = require("huskies"),
    lock = require("huskies-lock"),
    findUser = require("./findUser"),
    step = require("step");


module.exports = function(query) {


    return function wrap(my) {

        service1.serviceName = "existColumn";

        function service1(columnId, callback) {
           query.columnById(columnId, function(col) {
                if (col) {
                    callback(true);
                } else {
                    callback(false);
                }
            })
        }

        // userInfo{nickname , email}
        // return err or null , if err mean not unique.
        service5.serviceName = "userUnique";
        function service5(email,nickname, callback) {
			var result = [];
			query.userByEmail(email,function(u){
				if(u){
					result.push("email");
				}
				query.userByNick(nickname,function(u2){
					if(u2){
						result.push("nickname");
					}
					callback(result.length > 0 ? result : null);
				});
			})
		}
		

        // true / false 
        // check user whether post topic.
        service6.serviceName = "postTopicCheck";

        function service6(userId, callback) {
			query.userById(userId,function(user){
				if(user){
					query.topicCountByToday(userId,function(count){
						if(count > 10){
							callback(false);
						}else{
							callback(true);
						}
					})					
				}else{
					callback(false);
				}
			})
        }

        // true / false 
        // check user whether post reply.	
        service7.serviceName = "postReplyCheck";

        function service7(userId, callback) {
		
			query.replyCountByToday(userId,function(count){
				if(count > 50){ //doto
					callback(false);
				}else{
					callback(true);
				}
			})
			
        }
		
		service8.serviceName = "userByNick"
		function service8(nick,callback){
			query.userByNick(nick,function(rs){
				callback(rs);
			});
		}

        return [service1, service5, service6, service7,service8];

    }

}

var check = require('validator').check,
    huskies = require("huskies"),
    lock = require("huskies-lock"),
    findUser = require("./findUser"),
    step = require("step");


module.exports = function(query) {


    return function wrap(my) {

        service1.serviceName = "existColumn";

        function service1(columnId, callback) {
            my.repos.Column.get(columnId, function(err, col) {
                if (col) {
                    callback(true);
                } else {
                    callback(false);
                }
            })
        }


        service2.serviceName = "existPost";

        function service2(postId, callback) {
            my.repos.SubPost.get(postId, function(err, post) {
                if (col) {
                    callback(true);
                } else {
                    callback(false);
                }
            })
        }

        service4.serviceName = "updatePasswordValidator";

        function service4(password) {
            if (password === password.trim()) {
                check(password).len(6, 18);
            } else {
                throw new Error();
            }
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
						if(count > 10000){
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
				if(count > 10000){ //doto
					callback(false);
				}else{
					callback(true);
				}
			})
			
        }

        return [service1, service2, service4, service5, service6, service7];

    }

}

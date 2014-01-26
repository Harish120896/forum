var check = require('validator').check,
    huskies = require("huskies"),
    lock = require("huskies-lock"),
	oneday = require("./util/oneday"),
    findUser = require("./findUser"),
    step = require("step");


module.exports = function(dbs) {


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


        // userInfo{loginname , nickname , email}
        // return err or null , if err mean not unique.
        var service5 = huskies(function(userInfo, callback) {

            step(
                function() {
                    findUser({
                        loginname: userInfo.loginname
                    }, this)
                },
                function(have) {
                    if (have) throw new Error("loginname not unique");
                    findUser({
                        nickname: userInfo.nickname
                    }, this);
                },
                function(have) {
                    if (have) throw new Error("nickname not unique");
                    findUser({
                        nickname: userInfo.email
                    }, this);
                },
                function(have) {
                    if (have) throw new Error("email not unique");
                    return null;
                },
                function(err) {
                    callback(err);
                }
            )
        }).use(lock);
        service5.serviceName = "userUnique";


        // true / false 
        // check user whether post topic.
        service6.serviceName = "postTopicCheck";

        function service6(userId, callback) {
			
			var date = new oneday();
			
			var db = dbs.getDB("Reply");
			db.find().where({authorId:userId}).where('createTime').gt(date.startTime).lt(date.endTime)
			.count(function(err,num){
				if(num > 10){
					callback(false);
				}else{
					callback(true);
				}
			})
        }

        // true / false 
        // check user whether post reply.	
        service7.serviceName = "postReplyCheck";

        function service7(userId, callback) {
			var date = new oneday();
			
			var db = dbs.getDB("Reply");
			db.find().where({authorId:userId}).where('createTime').gt(date.startTime).lt(date.endTime)
			.count(function(err,num){
				if(num > 10){
					callback(false);
				}else{
					callback(true);
				}
			})
        }

        return [service1, service2, service4, service5, service6, service7];

    }

}

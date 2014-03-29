var Q = require("q");

module.exports = function wrap(my) {

    service1.serviceName = "existColumn";

    function service1(columnId, callback) {
        var query = my.services.getQuery();
        query.columnById(columnId, function (col) {
            if (col) {
                callback(true);
            } else {
                callback(false);
            }
        })
    }

    service2.serviceName = "existUser";

    function service2(uid, callback) {


        var query = my.services.getQuery();
        query.userById(uid, function (u) {
            if (u) {
                callback(true);
            } else {
                callback(false);
            }
        })
    }

    // userInfo{nickname , email}
    // return err or null , if err mean not unique.
    service5.serviceName = "userUnique";

    function service5(email, nickname, callback) {
        var query = my.services.getQuery();

        var result = [];
        query("get a user by email",{email:email}, function (u) {
            if (u) {
                result.push("email");
            }
            query("get a user by nickname",{nickname:nickname}, function (u2) {
                if (u2) {
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
        var query = my.services.getQuery();
        query("get a user's topic count in today",{id:userId}).then(function(count){
            if (count > 50000) {
                callback(false);
            } else {
                callback(true);
            }
        })
    }

    // true / false
    // check user whether post reply.
    service7.serviceName = "postReplyCheck";

    function service7(userId, callback) {

        var query = my.services.getQuery();

        query("get a user's reply count in today",{id:userId}).then(function(count){
            if (count > 5000) {
                callback(false);
            } else {
                callback(true);
            }
        });

    }

    service8.serviceName = "userByNick"

    function service8(nick, callback) {
        var query = my.services.getQuery();

        query("get a user by nickname",{nickname:nick}, function (rs) {
            callback(rs);
        })
    }

    return [service1, service2, service5, service6, service7, service8];

}
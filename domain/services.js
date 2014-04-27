var Q = require("q");

module.exports = function wrap(my) {

    // true / false
    // check user whether post topic.
    postTopicCheck.serviceName = "postTopicCheck";

    function postTopicCheck(userId, callback) {
        var query = my.services.getQuery();
        query["get a user's topic count in today"](userId).then(function(count){
            if (count >= 50) {
                callback(false);
            } else {
                callback(true);
            }
        })
    }

    // true / false
    // check user whether post reply.
    postReplyCheck.serviceName = "postReplyCheck";

    function postReplyCheck(userId, callback) {

        var query = my.services.getQuery();

        query["get a user's reply count in today"](userId).then(function(count){
            if (count >= 150) {
                callback(false);
            } else {
                callback(true);
            }
        })
    }

    return [postReplyCheck,postTopicCheck];

}
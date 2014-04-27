var Q = require("q");
var dbs = require("../../application/dbs");
var identity_db = require("identity/application/DB");
var Column = dbs.getDB("Column");
var User = dbs.getDB("User");
var Topic = dbs.getDB("Topic");
var Reply = dbs.getDB("Reply");
var Message = dbs.getDB("Message");
var Info = dbs.getDB("Info");
var identity_domain = require("identity").domain;
var forum_domain = require("../../domain");
var domain = require("../../domain");

identity_domain.on("User.*.create",function createUser(data) {
    domain.repos.User.create(data);
})

identity_domain.on("User.*.update",function updateUser(data) {
    domain.repos.User.get(data.id).then(function (user) {
        if (user) {
            user.updateInfoPrivate(data);
        }
    });
});


module.exports = function () {

    forum_domain._my.repos.User.loopClear();
    forum_domain._my.repos.User.loopClear();
    forum_domain._my.repos.Column.loopClear();
    forum_domain._my.repos.Topic.loopClear();
    forum_domain._my.repos.Reply.loopClear();
    forum_domain._my.repos.Message.loopClear();
    forum_domain._my.repos.Info.loopClear();


    var defer = Q.defer();
    identity_db.remove({}, function () {
        Column.remove({}, function () {
            User.remove({}, function () {
                Topic.remove({}, function () {
                    Reply.remove({}, function () {
                        Message.remove({}, function () {
                            Info.remove({}, function () {
                                defer.resolve();
                            })
                        })
                    })
                })
            })
        })
    })
    return defer.promise;
}


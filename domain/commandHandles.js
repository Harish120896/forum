module.exports = wrap;
var filterNickname = require("./filterNickname");
var check = require("validator").check;
var Result = require("result-brighthas");

function wrap(my) {

    handle1.commandName = "create a topic";

    function handle1(args, callback) {
        var result = new Result();
        my.services.postTopicCheck(args.authorId, function (pass) {
            if (pass) {
                my.repos.Topic.create(args, function (err, topic) {
                    if (!err) {
                        result.data("topic", topic.toJSON());
                    } else {
                        result.mix(err);
                    }
                    callback(result);
                });
            } else {
                result.error("error", "error");
                callback(result);
            }
        })
    }

    handle2.commandName = "remove a topic";

    function handle2(args, callback) {
        my.repos.Topic.remove(args.id);
        callback();
    }

    handle3.commandName = "create a reply";

    function handle3(args, callback) {
        var result = new Result();
        my.repos.Topic.get(args.topicId, function (err, topic) {
            if (topic) {
                my.services.postReplyCheck(args.authorId, function (pass) {

                    if (pass) {
                        my.repos.Reply.create(args, function (err, reply) {
                            if (!err) {
                                topic.addReply(reply.parentId, reply.id);
                                result.data("reply", reply.toJSON());
                            } else {
                                result.mix(err);
                            }
                            callback(result);
                        });
                    } else {
                        result.error("error", "> 50");
                        callback(result);
                    }

                });
            } else {
                result.error("error", "no topic");
                callback(result);
            }
        })
    }

    handle4.commandName = "create a user";

    function handle4(args, callback) {
        my.repos.User.create(args, function (err, rs) {
            var result = new Result();
            if (!err) {
                result.data("user", rs.toJSON());
            } else {
                result.mix(err);
            }
            callback(result);
        });
    }


    handle5.commandName = "remove a reply";

    function handle5(args, callback) {

        my.repos.Topic.get(args.topicId, function (topic) {
            if (topic) {
                topic.removeReply(args.replyId);
            }
        })

        callback();
    }

    handle6.commandName = "create a column";

    function handle6(args, callback) {
        var result = new Result();
        my.repos.Column.create(args, function (err, col) {
            if (col) {
                result.data("column", col);
            } else {
                result.mix(err);
            }
            callback(result);
        });
    }

    handle7.commandName = "send message";

    function handle7(args, callback) {
        var title = args.title;
        var body = args.body;
        var authorId = args.authorId;
        if (body) {
            filterNickname(body).forEach(function (name) {
                my.services.userByNick(name, function (user) {
                    if (user) {
                        my.repos.Message.create({
                            title: title,
                            body: body,
                            authorId: authorId,
                            targetId: user.id
                        }, function (err) {
                        });
                    }
                });
            });
        }
        callback();
    }

    handle8.commandName = "top topic";

    function handle8(args, callback) {

        my.repos.Topic.get(args.id, function (err, topic) {
            if (topic) {
                topic.begin();
                topic.top = true;
                topic.updateTime = new Date();
                topic.end();
            }
        })
        callback();
    }

    handle9.commandName = "down topic";

    function handle9(args, callback) {

        my.repos.Topic.get(args.id, function (err, topic) {
            if (topic) {
                topic.top = false;
            }
        })
        callback();
    }

    handle5.commandName = "remove a user";

    function handle10(args, callback) {

        my.repos.Topic.remove(args.id, callback)
    }

    return [handle1, handle2, handle3, handle4, handle5, handle6, handle7, handle8, handle9, handle10];

}

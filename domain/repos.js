var shortid = require("shortid");
var validator = require("validator");
var Q = require("q");

module.exports = wrap;

function wrap(my) {

    var userRepo = new my.Repository("User");

    // 是根据 identity 的 user domain 的User.*.create 事件调用的
    userRepo._create = function (args, callback) {
        callback(null, new my.Aggres.User(args.id, args.email, args.username, args.createTime));
    }

    userRepo._aggre2data = function (aggre) {
        return {
            id: aggre.id,
            username: aggre.username,
            email: aggre.email,
            createTime: aggre.createTime,
            activation: aggre.activation,
            follows: aggre.follows,
            watchers: aggre.watchers,
            fraction: aggre._fraction,
            isCustomLogo: aggre.isCustomLogo,
            des: aggre.des,
            sex: aggre.sex,
            address: aggre.address
        }
    }

    userRepo._data2aggre = function (data) {
        var user = new my.Aggres.User();
        user._id = data.id;
        user._username = data.username;
        user._email = data.email;
        user._createTime = data.createTime;
        user._activation = data.activation;
        user._follows = data.follows;
        user._watchers = data.watchers;
        user._fraction = data.fraction;
        user._isCustomLogo = data.isCustomLogo;
        user._des = data.des;
        user._sex = data.sex;
        user._address = data.address;
        return user;

    }

    var columnRepo = new my.Repository("Column");

    columnRepo._create = function (args, callback) {
        args.id = shortid.generate();
        var Column = my.Aggres.Column;
        try {
            var column = new Column(args.id, args.name, args.des);
            callback(null, column);
        } catch (err) {
            callback(err);
        }

    }

    columnRepo._aggre2data = function (aggre) {
        return {
            id: aggre._id,
            name: aggre._name,
            des: aggre._des,
            managerId: aggre._managerId,
            createTime: aggre._createTime,
            updateTime: aggre._updateTime
        }
    }

    columnRepo._data2aggre = function (data) {
        var Column = my.Aggres.Column;
        var col = new Column(data.id, data.name, data.des);
        col._createTime = data.createTime;
        col._updateTime = data.updateTime;
        col._managerId = data.managerId;
        return col;
    }


    var topicRepo = new my.Repository("Topic");

    // 负责验证args参数的有效
    topicRepo._create = function (args, callback) {

        my.services.postTopicCheck(args.authorId, function (bool) {
            if (bool) {
                args.id = shortid.generate();
                var Topic = my.Aggres.Topic;

                var error = null;

                if (!validator.isLength(args.title, 2, 25)) {
                    error = error || {};
                    error.title = "主题标题字符长度2～25";
                }

                if (!validator.isLength(args.body, 0, 2000)) {
                    error = error || {};
                    error.body = "主题内容 2000 字符以内";
                }

                if (error) {
                    callback(error);
                } else {
                    Q.all([
                            my.repos.User.get(args.authorId),
                            my.repos.Column.get(args.columnId)
                        ]).then(function (result) {
                            if (result[0] && result[0]) {
                                var topic = new Topic(args);
                                callback(null, topic);
                            } else {
                                callback({error: 500}); // 500 表示内部未知错误
                            }
                        })
                }
            } else {

                callback({error: 500}); // 500 表示内部未知错误
            }
        })

    }

    topicRepo._data2aggre = function (data) {
        var Topic = my.Aggres.Topic;
        var topic = new Topic(data);
        topic._activation = data.activation;
        topic._replyTree.reborn(data.replyTree);
        topic._createTime = data.createTime;
        topic._updateTime = data.updateTime;
        topic._top = data.top;
        topic._fine = data.fine;
        topic._accessNum = data.accessNum;
        topic._replyNum = data.replyNum;
        return topic;
    }

    topicRepo._aggre2data = function (aggre) {

        return {
            id: aggre._id,
            title: aggre._title,
            body: aggre._body,
            authorId: aggre._authorId,
            columnId: aggre._columnId,
            activation: aggre._activation,
            createTime: aggre._createTime,
            updateTime: aggre._updateTime,
            top: aggre._top,
            fine: aggre._fine,
            accessNum: aggre._accessNum,
            replyNum: aggre._replyNum,
            replyTree: aggre._replyTree.json
        }
    }


    var replyRepo = new my.Repository("Reply");

    replyRepo._create = function (args, callback) {

        // 发布回复前的检查
        my.services.postReplyCheck(args.authorId, function (bool) {
            if (bool) {
                var selfUser, parentUser;
                my.repos.Topic.get(args.topicId)
                    .then(function (p) {
                        if (p)
                            return my.repos.User.get(p._authorId);
                        else {
                            throw new Error("no topic");
                        }
                    }).then(function (u) {
                        if (u) {
                            parentUser = u;
                            return my.repos.User.get(args.authorId);
                        } else {
                            throw new Error("no parent user");
                        }

                    }).then(function (su) {

                        if (su) {
                            selfUser = su;

                            if (selfUser && parentUser) {
                                args.title = selfUser.username + " 回复：" + parentUser.username;
                            }

                            args.id = shortid.generate();


                            var Reply = my.Aggres.Reply;

                            var reply = new Reply(args);
                            callback(null, reply);
                        } else {
                            throw new Error("no author");
                        }

                    }).fail(function () {
                        callback({error: 500})
                    })
            } else {
                callback({error: 500});
            }
        })


    }

    replyRepo._data2aggre = function (data) {
        var Reply = my.Aggres.Reply;
        var reply = new Reply(data);
        reply._createTime = data.createTime;
        return reply;
    }

    replyRepo._aggre2data = function (aggre) {

        return {
            id: aggre._id,
            title: aggre._title,
            body: aggre._body,
            authorId: aggre._authorId,
            parentId: aggre._parentId,
            topicId: aggre._topicId,
            createTime: aggre._createTime
        }
    }


    var messageRepo = new my.Repository("Message");

    messageRepo._create = function (args, callback) {

        Q.all([
                my.repos.User.get(args.targetId),
                my.repos.User.get(args.authorId)
            ]).then(function (result) {
                if (result[0] && result[1]
                    && validator.isLength(args.title, 1, 20)
                    && validator.isLength(args.body, 1, 300)) {
                    args.id = shortid.generate();
                    var msg = new my.Aggres.Message(args);
                    callback(null, msg);
                } else {
                    callback({error: 500});
                }
            })

    }

    messageRepo._data2aggre = function (data) {
        return new my.Aggres.Message(data);
    }

    messageRepo._aggre2data = function (aggre) {
        return {
            id: aggre._id,
            authorId: aggre._authorId,
            title: aggre._title,
            body: aggre._body,
            targetId: aggre._targetId,
            visited: aggre._visited,
            createTime: aggre._createTime
        }
    }


    var infoRepo = new my.Repository("Info");

    infoRepo._create = function (args, callback) {

        my.repos.User.get(args.targetId).then(function (user) {
            if (user) {
                args.id = shortid.generate();
                var info = new my.Aggres.Info(args);
                callback(null, info);
            } else {
                callback({error: 500});
            }
        })

    }

    infoRepo._data2aggre = function (data) {
        return new my.Aggres.Info(data);
    }

    infoRepo._aggre2data = function (aggre) {
        return {
            id: aggre._id,
            body: aggre._body,
            targetId: aggre._targetId,
            createTime: aggre._createTime,
            visited: aggre._visited
        }
    }


    return [userRepo, columnRepo, topicRepo, replyRepo, messageRepo, infoRepo];

}

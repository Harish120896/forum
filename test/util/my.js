var Aggres = {};
var Repository = require("jsdm/lib/Repository");
Repository.prototype._publish = function () {
}

var my = {
    publish: function () {
    },
    repos: {
        Reply: {
            remove: function () {
            }
        },
        User: {
            get: function (id, cb) {
                var user = new User({
                    id: id,
                    nickname: "brighthas",
                    password: "123456",
                    email: "brighthas2@gmail.com"
                })
                cb(null, user);
            },
            create: function (args, cb) {
                cb(null, cb);
            }
        },
        Topic: {
            create: function (args, cb) {
                var topic = new Topic(args);
                cb(null, topic);
            }
        }
    },
    services: {
        existColumn: function (columnId, callback) {
            callback(true);
        },
        userUnique: function (email, nickname, callback) {
            callback(false);
        },
        postTopicCheck: function (id, cb) {
            cb(true);
        }
    },
    Aggres: Aggres,
    Repository: Repository
}

var User = require("../../domain/User")(my);
var Topic = require("../../domain/Topic")(my);
var Reply = require("../../domain/Reply")(my);
var Column = require("../../domain/Column")(my);
var Message = require("../../domain/Message")(my);
var Info = require("../../domain/Info")(my);

var repos = require("../../domain/repos")(my);

Aggres["User"] = User;
Aggres["Topic"] = Topic;
Aggres["Reply"] = Reply;
Aggres["Column"] = Column;
Aggres["Message"] = Message;
Aggres["Info"] = Info;

module.exports = my;

var my = require("../util/my");
var should = require("should");
var User = require("../../domain/User")(my);
var user = new User({
    nickname: "brighthas",
    password: "123456",
    email: "brighthas@gmail.com"
});

var eventHandles = require("../../domain/eventHandles")({
    repos: {
        User: {
            get: function(id, cb) {
                cb(null, user);
            }
        }
    }
});

describe("eventHandles", function() {

    it("#Topic.*.create", function() {
        eventHandles[0]({
            authorId: "001"
        });
        user.fraction.should.eql(5);

    })

    it("#Reply.*.create", function() {
        eventHandles[1]({
            authorId: "001"
        });
        user.fraction.should.eql(6);
    })

})

var services = require("../../domain/services")({
    columnById: function(id, cb) {
        cb(true)
    },
    userByEmail: function(a, cb) {
        cb({})
    },
    userByNick: function(a, cb) {
        cb({})
    },
    userById: function(a, cb) {
        cb({})
    },
    topicCountByToday: function(a, cb) {
        cb(8);
    },
    replyCountByToday: function(a, cb) {
        cb(9);
    }

})();

var should = require("should");

var existColumn = services[0],
    userUnique = services[1],
    postTopicCheck = services[2],
    postReplyCheck = services[3],
    userByNick = services[4];

describe("services", function() {

    it("#existColumn", function(done) {
        existColumn("id", function(exist) {
            exist.should.be.true;
            done()
        })
    })

    it("#userUnique", function(done) {
        userUnique("ID", "em", function(rs) {
            rs.should.eql(["email", "nickname"]);
            done()
        })
    })

    it("#postTopicCheck", function(done) {
        postTopicCheck("id", function(exist) {
            exist.should.be.true;
            done();
        });
    })

    it("#postReplyCheck", function(done) {
        postReplyCheck("id", function(exist) {
            exist.should.be.true;
            done();
        });
    })

    it("#userByNick", function(done) {
        userByNick("nk", function(u) {
            u.should.eql({});
            done();
        })
    })

})

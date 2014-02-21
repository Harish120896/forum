var query = require("../query");
var db = require("../dbrepo").db2;
var should = require("should");

describe("query", function() {

    it("#columns", function(done) {

        db.save("Column", {
            id: "001"
        }, function() {
            db.save("Column", {
                id: "002"
            }, function() {
                query.columns(function(rs) {
                    rs.should.be.instanceof(Array).and.have.lengthOf(2);
                    done()
                })
            })
        })

    })

    it("#columnById", function(done) {
        query.columnById("001", function(rs) {
            should.exist(rs);
            done();
        })
    })

    it("#topicById", function(done) {
        db.save("Topic", {
            id: "001"
        }, function() {
            query.topicById("001", function(rs) {
                should.exist(rs);
                rs.id.should.eql("001");
                done();
            })
        })
    })

    it("#replyById", function(done) {
        db.save("Reply", {
            id: "001"
        }, function() {
            query.replyById("001", function(rs) {
                should.exist(rs);
                rs.id.should.eql("001");
                done();
            })
        })
    })

    it("#topicsByColumnId", function(done) {
        var DB = db.getDB("Topic");

        DB.insert([{
            columnId: "001"
        }, {
            columnId: "001"
        }, {
            columnId: "001"
        }, {
            columnId: "001"
        }, {
            columnId: "001"
        }], function(err, docs) {

            query.topicsByColumnId(1, "001", function(rs) {
                rs.should.be.instanceof(Array).and.have.lengthOf(3);

                query.topicsByColumnId(2, "001", function(rs) {
                    rs.should.be.instanceof(Array).and.have.lengthOf(2);
                    done()
                })

            })

        })
    })

    it("#users", function(done) {
        var DB = db.getDB("User");

        DB.insert([{
            name: "leo01"
        }, {
            name: "leo02"
        }, {
            name: "leo03"
        }, {
            name: "leo04"
        }, {
            name: "leo05"
        }, {
            name: "leo06"
        }, ], function(err, docs) {

            query.users(function(rs) {
                rs.should.be.instanceof(Array).and.have.lengthOf(6);
                done()
            })

        })
    })

    it("#userById", function(done) {

        var DB = db.getDB("User");

        DB.insert([{
            name: "leo01",
            id: "id9000"
        }, ], function(err, docs) {

            query.userById("id9000", function(rs) {
                rs.id.should.eql("id9000");
                done()
            })

        })
    })


    it("#userByEmail", function(done) {

        var DB = db.getDB("User");

        DB.insert([{
            email: "leo@leo",
            id: "id9000"
        }, ], function(err, docs) {

            query.userByEmail("leo@leo", function(rs) {
                rs.email.should.eql("leo@leo");
                done()
            })

        })
    })


    it("#userByNick", function(done) {

        var DB = db.getDB("User");

        DB.insert([{
            email: "leo@leo",
            id: "id9000",
            nickname: "brighthas"
        }, ], function(err, docs) {

            query.userByNick("brighthas", function(rs) {
                rs.nickname.should.eql("brighthas");
                done()
            })

        })
    })

    it("#userFuzzyExist", function(done) {


        var DB = db.getDB("User");


        DB.insert([{
            email: "leo@leo",
            id: "id9000",
            nickname: "brighthas"
        }, ], function(err, docs) {

            query.userFuzzyExist({
                email: "leo@leo"
            }, function(rs) {
                rs.should.eql(true);

                query.userFuzzyExist({
                    email: "leo@leo2"
                }, function(rs) {
                    rs.should.eql(false);

                    done()
                })
            })

        })
    })

    it("#replyCountByToday", function(done) {
        var DB = db.getDB("Reply");
        DB.insert([{
            createTime: Date.now() + 1,
            authorId: "001"
        }, {
            createTime: Date.now() + 3,
            authorId: "001"
        }, {
            createTime: Date.now() + 24 * 10 * 60 * 60 * 1000,
            authorId: "001"
        }], function(err, docs) {

            query.replyCountByToday("001", function(num) {

                num.should.eql(2);
                done()

            })

        })
    })

    it("#topicCountByToday", function(done) {
        var DB = db.getDB("Topic");
        DB.insert([{
            createTime: Date.now() + 1,
            authorId: "001"
        }, {
            createTime: Date.now() + 3,
            authorId: "001"
        }, {
            createTime: Date.now() + 24 * 10 * 60 * 60 * 1000,
            authorId: "001"
        }], function(err, docs) {

            query.topicCountByToday("001", function(num) {

                num.should.eql(2);
                done()

            })

        })
    })

})

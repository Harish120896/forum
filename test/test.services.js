var domain = require("./util/domain");
var should = require("should");

var Q = require("q");


describe("services", function () {

    var services = domain._my.services;

    var author, column;

    it("#init", function (done) {

        Q.all([
                domain._my.repos.User.create({id: "u99", email: "u0001@q.q", username: "u0001", createTime: Date.now()}),
                domain._my.repos.Column.create({name: "node.js", des: "js"})
            ]).then(function (result) {

                author = result[0];
                column = result[1];

                domain._my.repos.Topic.create({
                    title: "title002",
                    body: "body002",
                    authorId: author._id,
                    columnId: column._id
                }).then(function (tp) {
                        var postTopics = [], postReplys = [];

                        for (var i = 0; i < 50; i++)
                            postTopics.push(domain._my.repos.Topic.create({
                                title: "title002",
                                body: "body002",
                                authorId: author._id,
                                columnId: column._id
                            }))

                        for (var i = 0; i < 150; i++)
                            postReplys.push(domain._my.repos.Reply.create({
                                id: "r001" + i,
                                title: "mytitle",
                                body: "mybody",
                                topicId: tp._id,
                                authorId: author._id
                            }));

                        Q.all(postTopics.concat(postReplys)).then(function () {
                            done();
                        }).fail(function (err) {
                                console.log(err)
                            })
                    })
            })
    });

    it("#postTopicCheck", function (done) {
        services.postTopicCheck("u001", function (bool) {
            bool.should.eql(true);
            services.postTopicCheck(author._id, function (bool) {
                bool.should.eql(false);
                done();
            })
        })
    });

    it("#postReplyCheck", function () {
        services.postReplyCheck("u001", function (bool) {
            bool.should.eql(true);
            services.postReplyCheck(author._id, function (bool) {
                bool.should.eql(false);
                done()
            })
        })
    });

})
var domain = require("../domain");
var should = require("should");
var clearDB =require("./util/clearDB");

describe("reply repository", function () {

    var repository = domain._my.repos.Reply;

    var uid, tid, cid;

    var reply;

    it("#clearDB",function(done){
        clearDB().then(done);
    });

    it("#_create", function (done) {

        repository._create({
            id: "r001",
            title: "mytitle",
            body: "mybody",
            parentId: "p001",
            authorId: "a001"
        }, function (err) {

            err.should.eql(500);
        })

        domain._my.repos.User.create({ email: "u000www1@q.q", username: "u00sss01"}, function (err, u) {
            var user = u;
            uid = u._id;
            domain._my.repos.Column.create({name: "node.js", des: "js"}, function (err, col) {
                cid = col._id;
                domain._my.repos.Topic.create({ title: "mytitle", body: "mybody", columnId: cid, authorId: uid}, function (err, t) {

                    tid = t._id;
                    repository.create({
                        id: "r001",
                        title: "mytitle",
                        body: "mybody",
                        topicId: tid,
                        authorId: uid
                    }, function (err, r) {
                        reply = r;
                        should.exist(reply);
                        setTimeout(function () {
                            user._fraction.should.eql(6);
                            done();
                        })
                    })
                })

            })
        })


    })

    var data;

    it("#_aggre2data", function () {

        data = domain._my.repos.Reply._aggre2data(reply);

        should.exist(data.title);
        should.exist(data.id);

        data.body.should.eql("mybody");
        data.authorId.should.eql(uid);
        data.topicId.should.eql(tid);

        should.exist(data.createTime);

    })

    it("#_data2aggre", function () {

        var aggre = domain._my.repos.Reply._data2aggre(data);

        should.exist(aggre._title);
        should.exist(aggre._id);

        aggre._body.should.eql("mybody");
        aggre._authorId.should.eql(uid);
        aggre._topicId.should.eql(tid);
        should.exist(aggre._createTime);

    })

})
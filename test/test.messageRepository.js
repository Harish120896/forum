var domain = require("../domain");
var should = require("should");
var Q = require("q");
var clearDB =require("./util/clearDB");


describe("message repository", function () {

    var repository = domain._my.repos.Message;

    var message;

    it("#clearDB",function(done){
        clearDB().then(done);
    });


    it("#_create", function (done) {

        Q.all([
                domain._my.repos.User.create({ email: "xxx@q.q", username: "xxx"}),
                domain._my.repos.User.create({ email: "bbb@q.q", username: "bbb"})
            ]).then(function (result) {
                repository._create({
                    authorId: result[0]._id,
                    title: "mytitle",
                    body: "mybody",
                    targetId: result[1]._id
                }, function (err, msg) {

                    message = msg;

                    should.exist(msg._id);
                    msg._authorId.should.eql(result[0]._id);
                    msg._title.should.eql("mytitle");
                    msg._body.should.eql("mybody");
                    msg._targetId.should.eql(result[1]._id);

                    msg._visited.should.eql(false);
                    should.exist(msg._createTime);
                    done();
                })
            })


    })

    var data;

    it("#_aggre2data", function () {
        data = repository._aggre2data(message);
        should.exist(data.id);
        data.authorId.should.eql(message._authorId);
        data.title.should.eql("mytitle");
        data.body.should.eql("mybody");
        data.targetId.should.eql(message._targetId);
        data.visited.should.eql(false);
        should.exist(data.createTime);
    })

    it("#_data2aggre", function () {

        var aggre = repository._data2aggre(data);

        aggre._id.should.eql(data.id);
        aggre._authorId.should.eql(data.authorId);
        aggre._title.should.eql("mytitle");
        aggre._body.should.eql("mybody");
        aggre._targetId.should.eql(data.targetId);

        aggre._visited.should.eql(false);
        should.exist(aggre._createTime);

    })

})
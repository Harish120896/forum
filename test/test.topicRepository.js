var domain = require("../domain");
var should = require("should");
var clearDB =require("./util/clearDB");

describe("topic repository", function () {

    var topic,columnId, authorId,author;


    var repository = domain._my.repos.Topic;

    it("#clearDB",function(done){
        clearDB().then(done);
    });

    it("#_create", function (done) {

        repository._create({
            title: "title002",
            body: "body002",
            authorId: "u00001",
            columnId: "c00001"
        }, function (err, topic) {
            err.error.should.eql(500);
        });



        domain._my.repos.Column.create({name: "node.js", des: "js"}, function (err, col) {
            columnId = col._id;
        });

        domain._my.repos.User.create({id: "u0001", email: "u0001@q.q", username: "u0001", createTime: 12313131}, function (err, u) {
                author = u;
        });

        repository.create({
            title: "title002",
            body: "body002",
            authorId: "u0001",
            columnId: columnId
        }, function (err, t) {
            should.exist(t);
            topic = t;

            setTimeout(function(){
                author._fraction.should.eql(5);
                done();
            },200)

        });

    })

    var data;

    it("#_aggre2data", function () {
        data = repository._aggre2data(topic);

        data.title.should.eql("title002");
        data.body.should.eql("body002");
        data.authorId.should.eql("u0001");
        data.columnId.should.eql(columnId);
        data.activation.should.eql(true);
        data.replyNum.should.eql(0);
        should.exist(data.replyTree);

        data.updateTime.should.eql(data.createTime);
        data.top.should.eql(false);
        data.fine.should.eql(false);
        data.accessNum.should.eql(0);
    })

    it("#_data2aggre", function () {

        data = repository._data2aggre(data);

        data._title.should.eql("title002");
        data._body.should.eql("body002");
        data._authorId.should.eql("u0001");
        data._columnId.should.eql(columnId);
        data._activation.should.eql(true);
        data._replyNum.should.eql(0);
        should.exist(data._replyTree);

        data._updateTime.should.eql(data._createTime);
        data._top.should.eql(false);
        data._fine.should.eql(false);
        data._accessNum.should.eql(0);
    })

})
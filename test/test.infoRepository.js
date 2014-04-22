var domain = require("./util/domain");
var should = require("should");
var Q = require("q");


describe("message repository", function () {

    var repository = domain._my.repos.Info;

    var info;

    it("#_create", function (done) {

        domain._my.repos.User.create({ email: "bbb@q.q", username: "bbb"}).then(function (user) {
            repository._create({
                targetId: user._id,
                body: "mybody"
            }, function (err, inf) {

                info = inf;

                should.exist(info._id);
                info._body.should.eql("mybody");
                info._targetId.should.eql(user._id);
                info._visited.should.eql(false);
                should.exist(info._createTime);

                done();
            })
        })


    })

    var data;

    it("#_aggre2data", function () {
        data = repository._aggre2data(info);
        should.exist(data.id);
        data.body.should.eql("mybody");
        data.targetId.should.eql(info._targetId);
        data.visited.should.eql(false);
        should.exist(data.createTime);
    })

    it("#_data2aggre", function () {

        var aggre = repository._data2aggre(data);

        aggre._id.should.eql(data.id);
        aggre._body.should.eql("mybody");
        aggre._targetId.should.eql(data.targetId);
        aggre._visited.should.eql(false);
        should.exist(aggre._createTime);

    })

})
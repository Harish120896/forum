var domain = require("./util/domain");
var should = require("should");

describe("user repository", function () {

    var repository = domain._my.repos.User;
    var createTime = Date.now();

    var user, data;

    it("#_create", function () {


        repository.create({id: "u0001", email: "u0001@q.q", username: "u0001", createTime: createTime}, function (err, u) {
            user = u;
            user.id.should.eql("u0001");
            user.email.should.eql("u0001@q.q");
            user.username.should.eql("u0001");
            user.createTime.should.eql(createTime);

            user.activation.should.eql(true);
            user.follows.should.eql([]);
            user.watchers.should.eql([]);
            user.fraction.should.eql(0);

            user.isCustomLogo.should.eql(true);
            user.des.should.eql("");
            user.sex.should.eql(true);
            user.address.should.eql("");
        })
    })

    it("#_aggre2data", function () {
        data = repository._aggre2data(user);
        data.id.should.eql("u0001");
        data.email.should.eql("u0001@q.q");
        data.username.should.eql("u0001");
        data.createTime.should.eql(createTime);

        data.activation.should.eql(true);
        data.follows.should.eql([]);
        data.watchers.should.eql([]);
        data.fraction.should.eql(0);

        data.isCustomLogo.should.eql(true);
        data.des.should.eql("");
        data.sex.should.eql(true);
        data.address.should.eql("");
    })

    it("#_data2aggre", function () {
        var aggre = repository._data2aggre(data);
        aggre = repository._aggre2data(user);
        aggre.id.should.eql("u0001");
        aggre.email.should.eql("u0001@q.q");
        aggre.username.should.eql("u0001");
        aggre.createTime.should.eql(createTime);

        aggre.activation.should.eql(true);
        aggre.follows.should.eql([]);
        aggre.watchers.should.eql([]);
        aggre.fraction.should.eql(0);

        aggre.isCustomLogo.should.eql(true);
        aggre.des.should.eql("");
        aggre.sex.should.eql(true);
        aggre.address.should.eql("");
    })

})
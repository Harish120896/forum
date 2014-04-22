var domain = require("./util/domain");
var should = require("should");

describe("user repository", function () {

    var repository = domain._my.repos.Column;

    var column, data;

    it("#_create", function (done) {
        repository.create({name: "node.js", des:"js"}, function (err, col) {
            setTimeout(function(){
                column = col;
                col._name.should.eql("node.js");
                col._des.should.eql("js");
                (true).should.eql(null === col._managerId);
                col._createTime.should.eql(col._updateTime);
                done()
            })

        })
    })

    it("#_aggre2data", function () {
        data = repository._aggre2data(column);
        data.name.should.eql("node.js");
        data.des.should.eql("js");
        (true).should.eql(null === data.managerId);
        data.createTime.should.eql(data.updateTime);
    })

    it("#_data2aggre", function () {

        var aggre = repository._data2aggre(data);
        aggre._name.should.eql("node.js");
        aggre._des.should.eql("js");
        (true).should.eql(null === aggre._managerId);
        aggre._createTime.should.eql(aggre._updateTime);
    })

})
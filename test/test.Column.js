var domain = require("./util/domain");
var should = require("should");

describe("Column", function () {

    var Column = domain._my.Aggres.Column;
    var col;

    it("#new", function () {
        col = new Column("id001", "node.js");
        col._name.should.eql("node.js");
        col._des.should.eql("");
        col._id = "id001";
        (true).should.eql(null === col._managerId);
        col._createTime.should.eql(col._updateTime);
    })

    it("#updateInfo", function () {

        (function(){
            col.updateInfo();
        }).should.throw();

        col.updateInfo("express","mvc framework");
        col._name.should.eql("express");
        col._des.should.eql("mvc framework");

    })

    it("#setManager",function(){
        col.setManager("u001");
        col._managerId.should.eql("u001");
    })

})
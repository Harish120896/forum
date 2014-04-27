var domain = require("../domain");
var should = require("should");
var clearDB =require("./util/clearDB");

describe("Column", function () {

    var Column = domain._my.Aggres.Column;
    var col;

    it("#clearDB",function(done){
        clearDB().then(done);
    });

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

    it("#setManager",function(done){

        domain.repos.User.create({id:"u001",username:"leo",email:"leo@q.q"},function(err,u){

            col.setManager("u001");
            setTimeout(function(){
                col._managerId.should.eql("u001");
                done();
            })

        });

    })

})
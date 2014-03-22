var should = require("should")
var my = require("../util/my");
var Column = require("../../domain/Column")(my);

describe("column", function () {

    var column;

    it("#create", function () {
        column = new Column({
            name: "column name",
            des: "column des"
        });
        column.name.should.eql("column name");
        column.des.should.eql("column des");
        column.updateTime.should.eql(column.updateTime);
    })

    it("#up", function () {
        var uptime = column.updateTime;
        column.up();
        (column.updateTime > uptime).should.be.true;

    })


    it("#updateInfo", function () {

        column.updateInfo('abcde', 'fdfd');

        column.des.should.eql("fdfd");

    })


})

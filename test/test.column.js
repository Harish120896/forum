var should =require("should")
    , domain = require("../domain").seal()
   ,Column = domain._my.Aggres.Column;

describe("column",function(){

    var column;

    it("#create",function(){
        column = new Column("column name","column des");
		
		
		
        column.model.name().should.eql("column name");
        column.model.des().should.eql("column des");
        column.model.updateTime().should.eql(column.model.updateTime());
        (column.model.createTime() <= Date.now()).should.be.true;
        column.model.accessNum().should.eql(0);
        column.model.top().should.eql(false);
    })

    it("#up",function(done){

        var ut = column.model.updateTime();
        domain.once("Column.*.update",function(id,data){
            (data.updateTime > ut).should.be.true;
            done();
        });
        column.up();

    })

    it("#top",function(done){
        domain.once("Column.*.update",function(id,data){
            data.top.should.be.true;
            done();
        });
        column.top();
    })

    it("#untop",function(done){
        domain.once("Column.*.update",function(id,data){
            data.top.should.be.false;
            done();
        });
        column.untop();
    })

    it("#updateInfo",function(done){

        domain.once("Column.*.update",function(id,data){
            data.name.should.eql("abcde");
            data.des.should.eql("fdfd");
            done();
        });

        column.updateInfo('abcde','fdfd');

    })

    it("#goin",function(){

        column.model.accessNum().should.eql(0);
        domain.once("Column.*.update",function(id,data){
            data.accessNum.should.eql(1);
        });
        domain.once("goin column",function(rid){
            rid.should.eql("reader001")
        })
        column.goin("reader001");

    })

})
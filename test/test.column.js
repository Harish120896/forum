var should =require("should")
    , domain = require("../domain").seal()
   
   var Column = domain._my.Aggres.Column;

describe("column",function(){

    var column;

    it("#create",function(){
        column = new Column({name:"column name",des:"column des"});
        column.name.should.eql("column name");
        column.des.should.eql("column des");
        column.updateTime.should.eql(column.updateTime);
        column.accessNum.should.eql(0);
        column.top_.should.eql(false);
    })

    it("#up",function(){
		var uptime = column.updateTime;
		column.up();
		(column.updateTime > uptime ).should.be.true;

    })
	
    it("#top",function(){
        column.top();
        column.top_.should.eql(true);
		
    })

    it("#untop",function(){
        column.untop();
        column.top_.should.eql(false);
		
    })

    it("#updateInfo",function(){

		column.updateInfo('abcde','fdfd');

        column.des.should.eql("fdfd");
        
    })

    it("#access",function(){

		column.access();
		column.accessNum.should.eql(1);

    })

})
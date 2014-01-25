var dbs = require("./db");

module.exports = wrap;

function wrap(my){

    handle1.eventName = "*.*.create";

    function handle1(className,data){
		console.log(arguments)
		var db = dbs.getDB(className);
		db.create(data,function(err){
			console.log(err)
		})
    }
	
	handle2.eventName = "*.*.update";
	function handle2(className,id,data){
		var db = dbs.getDB(className);
		db.update({id:id},data,function(){})
	}

	handle3.eventName = "*.*.remove";
	function handle3(className,id){
		var db = dbs.getDB(className);
		db.remove({id:id},function(){});
	}
    return [handle1,handle2,handle3];
}

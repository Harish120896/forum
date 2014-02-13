module.exports = {
	create:function(req,res,next){
		var columnId = req.param("columnId");
		var page = req.param("page");
		query.topics({page:page,columnId:columnId},function(rs){
			res.locals.topics = rs;
			res.render("column");
		});		
	},
	update:function(req,res,next){
		
	}
}
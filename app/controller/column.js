module.exports = {
	view:function(){
		var columnId = req.param("columnId");
		var page = req.param("page");
		query.topics({page:page,columnId:columnId},function(rs){
			res.locals.topics = rs;
			res.render("column");
		});		
	}
}
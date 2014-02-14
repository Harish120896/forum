var query = require("../infrastructure/query");
var domain = require("../domain");

module.exports = {
	send:function(req,res,next){
		var authorId = req.session.user.id;
		req.body.authorId = authorId;
		domain.exec("send message",req.body,next());
	}
}
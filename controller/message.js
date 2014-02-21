
module.exports = {
	send:function(req,res,next){
		var query = req.env.query;
		var domain = req.env.domain;
		
		var authorId = req.session.user.id;
		req.body.authorId = authorId;
		domain.exec("send message",req.body,next());
	}
}
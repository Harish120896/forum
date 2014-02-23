
module.exports = {
	send:function(req,res,next){
		var query = req.env.query;
		var domain = req.env.domain;
		req.body.authorId = req.session.user.id;
		
		domain.exec("send message",req.body,next());
		
	}
}
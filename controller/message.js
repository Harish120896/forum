
module.exports = {
	send:function(req,res,next){
		if(req.result.hasError()){
			return next();
		}
		var domain = req.env.domain;
		req.body.authorId = req.session.user.id;
		domain.exec("send message",req.body,next());
	}
}
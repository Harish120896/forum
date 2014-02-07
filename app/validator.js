module.exports = {
	isLogin:function(req,res,next){
		if(req.session.user){
			next();
		}else{
			res.send(["请先登录！"]);
		}
	},
	validat_num:function(req, res, next) {
	    if (req.body.validat_num && req.session.validat_num === req.body.validat_num) {
			next();
	    } else {
			res.send(["验证码错误！"]);
	    }
	}
}
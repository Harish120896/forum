var crypto = require("crypto");

module.exports = {
	login:function(req,res){
		
		if(req.user && req.body.password){
	        var md5 = crypto.createHash('md5');
	        var pwd = md5.update(req.body.password).digest("hex");
			if(req.user.password === pwd){
				res.send();
			}else{
				res.send(["邮箱或密码错误!"]);				
			}
		}else{
			res.send(["邮箱或密码错误!"]);
		}
		

	}
}
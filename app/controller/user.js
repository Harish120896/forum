var crypto = require("crypto");

moudle.exports = {
	login:function(req,res){
        var md5 = crypto.createHash('md5');
        var pwd = md5.update(req.body.password).digest("hex");
        query.userByEmail(req.body.email, function(user) {
            if (user && user.password === pwd) {
                res.cookie('user', JSON.stringify({
                    email: user.email,
                    password: user.password
                }), {
                    maxAge: 1000 * 60 * 60 * 24 * 90
                });
                req.session.user = user;
                res.redirect("/user");
            } else {
                res.render("login", {
                    errors: ["邮箱或密码错误"]
                })
            }
        })	
	}
}
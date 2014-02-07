var query = require("./query");
var ehs = require('./eventHandles');
var path = require('path');

var _ = require("underscore");
var crypto = require("crypto");
var pw = require("png-word")();
var nodemailer = require("nodemailer");
var validator = require("node-validator");

var util = require("./util");

var topicCtrl = require("./controller/topic");

var validator = require("./validator");

var config = require("./config");
var r = require("random-word")("0123456789");
var data = require("./data");

// test email push
var transport = nodemailer.createTransport("SMTP", {
    service: "QQ",
    auth: {
        user: config.sys_email,
        pass: config.sys_email_pwd
    }
});


// refresh png number.
app.get('/refresh', function(req, res) {

    var numtxt = req.session.validat_num = r.random(4);
    pw.createPNG(numtxt, function(pngnum) {
        res.send(pngnum);
    });

});





app.get("/", cookieLogin, function(req, res) {
	query.columns(null,function(columns){
		res.render("index",{columns:columns});
	})
})

app.get("/reg", cookieLogin, function(req, res) {
    if (req.session.user) {
        res.redirect("/user");
    } else {
        res.render("reg", {
            errors: []
        });
    }
})

app.post("/reg", validat_num, function(req, res) {
    if (req.validat_success) {
        domain.exec("create a user", req.body, function(err, user) {
            if (err) {
                res.render("reg", {
                    errors: _.values(err)
                });
            } else {
                if (user.email === config.admin) {
                    setTimeout(function() {
                        domain.call("User.becomeAdmin", user.id);
                        res.cookie('user', JSON.stringify({
                            email: user.email,
                            password: user.password
                        }), {
                            maxAge: 1000 * 60 * 60 * 24 * 90
                        });
                        req.session.user = user.toJSON();
                        res.redirect("/user");
                    }, 1000);
                } else {
                    res.cookie('user', JSON.stringify({
                        email: user.email,
                        password: user.password
                    }), {
                        maxAge: 1000 * 60 * 60 * 24 * 90
                    });
                    req.session.user = user.toJSON();
                    res.redirect("/user");
                }
            }
        })
    } else {
        res.render("reg", {
            errors: ["验证码错误"]
        });
    }
})

app.get("/login", cookieLogin, function(req, res) {
    if (req.session.user) {
        res.redirect("back");
    } else {
        res.render("login", {
            errors: []
        });
    }
})

app.post("/login", validat_num, function(req, res) {
    if (req.body.password) {
        if (req.validat_success) {
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
        } else {
            res.render("login", {
                errors: ["验证码错误"]
            });
        }
    } else {
        res.render("login", {
            errros: ["邮箱或密码错误"]
        })
    }
})

app.get("/fpwd_apply", function(req, res) {
    res.render("fpwd_apply");
})

app.post("/fpwd_apply", function(req, res) {

    query.userByEmail(req.body.email, function(user) {
        if (user) {
            transport.sendMail({
                from: "xxxq <1405491181@qq.com>",
                to: "qqq <brighthas@gmail.com>",
                // Subject of the message
                subject: '更改密码',

                // plaintext body
                text: '更改密码',

                // HTML body
                html: '<a href="http://localhost:3000/fpwd/' + user.email + "/" + user.password + '">点击更改密码</a>'

            }, function(err) {
                res.render("fpwd_apply_success");
            });
        } else {
            res.render("fpwd_apply");
        }
    });

})

app.get("/fpwd/:email/:code", cookieLogin, function(req, res) {
    if (req.session.user) {
        res.redirect("back");
    } else {
        res.render("fpwd", {
            errors: [],
            email: req.param("email"),
            code: req.param("code")
        });
    }
})

app.post("/fpwd", validat_num, function(req, res) {

    if (req.body.password) {
        if (req.validat_success) {
            var md5 = crypto.createHash('md5');
            var pwd = md5.update(req.body.password).digest("hex");
            query.userByEmail(req.body.email, function(user) {
                console.log(req.body.code);
                console.log(user.password);
                if (user && user.password === req.body.code) {
                    domain.call("User.updatePassword", user.id, [req.body.password], function(err) {
                        domain.call("User.hasError", user.id, [], function(has) {

                            if (has) {
                                res.render("fpwd", {
                                    errors: ["邮箱或验证信息错误，请重新申请。"]
                                })
                            } else {
                                res.render("fpwd_success");
                            }
                        })
                    });
                } else {
                    res.render("fpwd", {
                        errors: ["邮箱或验证信息错误"]
                    })
                }
            })
        } else {
            res.render("fpwd", {
                errors: ["验证码错误"]
            });
        }
    } else {
        res.render("fpwd", {
            errros: ["密码范围在 6～18 个字符"]
        })
    }

})

app.get("/user", function(req, res) {
    var nickname = req.query.nickname;
    if (nickname) {
        query.userByNick(nickname, function(user) {
            if (user) {
                res.render("user", {
                    user: user
                });
            } else {
                res.redirect("/");
            }
        })
    } else {
        if (req.session.user) {
            query.userById(req.session.user.id, function(user) {
                if (user) {
                    res.render("user", {
                        user: user
                    });
                } else {
                    res.redirect("/");
                }
            })
        } else {
            res.redirect("/");
        }
    }
})

app.post("/user/updateInfo", function(req, res) {
    res.send();
    domain.call("User.updateInfo", req.session.user.id, [req.body], function(err) {
        console.log(err)
    });
})

app.post("/user/updateNickname", function(req, res) {


    query.userById(req.session.user.id, function(user) {
        if (user) {
            if (user.nickname) {
                if (req.session.user.email === config.admin) {
                    run();
                } else {
                    res.send("error");
                }
            } else {
                run();
            }
        } else {
            res.send("error");
        }
    })


    function run() {
        domain.call("User.updateNickname", req.session.user.id, [req.body.nickname], function(err) {
            if (err) {
                res.send("error");
            } else {
                res.send();
            }
        });
    }

})


app.get("/logout", function(req, res) {
    res.clearCookie("user");
    req.session.user = null;
    res.redirect("/");
})

app.get("/upwd", function(req, res) {
    if (req.session.user) {
        res.render("upwd", {
            errors: []
        });
    } else {
        res.redirect("/login");
    }
})

app.post("/upwd", validat_num, function(req, res) {

    if (req.session.user) {
        if (req.validat_success) {
            var md5 = crypto.createHash('md5');
            var oldpwd = md5.update(req.body.oldpassword).digest("hex");
            query.userById(req.session.user.id, function(user) {
                if (user) {
                    if (user.password === oldpwd) {
                        domain.call("User.updatePassword", user.id, [req.body.password], function(err) {
                            domain.call("User.hasError", user.id, [], function(has) {
                                if (has) {
                                    res.render("upwd", {
                                        errors: _.values(err)
                                    });
                                } else {
                                    res.render("upwd_success");
                                }
                            })
                        })
                    } else {
                        res.render("upwd", {
                            errors: ["密码输入错误！"]
                        })
                    }
                } else {
                    res.render("upwd", {
                        errors: ["不明错误！"]
                    })
                }
            });
        } else {
            res.render("upwd", {
                errors: ["验证码错误"]
            });
        }
    } else {
        res.redirect("/login");
    }

})

app.post("/column/create", function(req, res) {
	if(req.session.user && req.session.user.role === 1){
		domain.exec("create a column", req.body, function(err) {

		})
	}
    res.send();
})

app.post("/column/:id/updateName",function(req,res){
	if(req.session.user && req.session.user.role === 1){
		
		domain.call("Column.updateName", req.param("id"), [req.body.name],function(err) {
		})
	}
    res.send();
})


app.post("/column/:id/updateDes",function(req,res){

	if(req.session.user && req.session.user.role === 1){
		domain.call("Column.updateDes", req.param("id"), [req.body.des],function(err) {

		})
	}
    res.send();
})

app.get("/column/:id",function(req,res){
	query.column({id:req.param("id")},function(col){
		if(col){
			query.topicsByColumn({columnId:col.id},function(rs){
				res.render("column",{column:col,topics:rs});			
			});	
		}else{
			res.send(404);
		}
	})
})
var crypto = require("crypto");

module.exports = function wrap(my) {

    var share_data = require("./share_data")(my);

    function login(req, res) {

        my.query("get a user by email", {email: req.param("email")}).then(function (user) {

            var md5 = crypto.createHash('md5');

            try{
                var pwd = md5.update(req.body.password).digest("hex");
            }catch(e){
                var pwd = null;
            }

            if (user && user.password === pwd) {

                req.session.user = user;

                res.cookie('user', JSON.stringify({
                    email: user.email,
                    password: user.password
                }), {
                    maxAge: 1000 * 60 * 60 * 24 * 90
                });
                res.send();

            } else {
                req.result.error("email", "登录信箱或密码有误，请重新登录。");
                res.send(req.result.json());
            }
        })
    }

    my.app.get("/user",
        my.util.cookieLogin,
        share_data,
        function (req, res) {

            my.query("get a user by id",{id:req.query.id}).then(function(user){
                if(user){
                    res.locals.breadcrumb = "user";
                    delete user.password;
                    res.locals.user = user;
                    res.locals.loginUser = req.session.loginUser;
                    res.locals.title = res.locals.user.nickname + "的个人中心"
                    res.render("user");
                }else{
                    res.send(404);
                }
            })


        });


    my.app.post("/user/logined", function (req, res, next) {
        if(req.session.user){
            my.query("get a user by id",{id:req.session.user.id}).then(function(user){
                if(!user){ req.session.user = null; }
                res.send(user || "");
            })
        }else{
            res.send();
        }
    });

    my.app.get("/user/update_password",
        function (req, res) {
            res.locals.code = req.param("code");
            res.locals.email = req.param("email");
            res.render("setNewPassword");
        });

    my.app.post("/user/find_password", function (req, res) {

        my.query("get a user by email", {email: req.query.email}).then(function (user) {
            if (user) {
                req.env.transport.sendMail({
                    from: "xxxq <308212012@qq.com>",
                    to: "hi <" + user.email + ">",
                    subject: '更改密码',
                    text: '更改密码',
                    html: '<a href="http://localhost:3000/setNewPassword?email=' + user.email + "&code=" + user.password + '">点击更改密码</a>'

                }, function (err) {
                    if (err)
                        res.send("内部错误，请联系管理员");
                    else
                        res.send();
                });
            } else {
                res.send("没有此用户");
            }
        })

    });

    my.app.post("/user/reg",
        my.util.validat_num,
        my.util.refreshValidatNum,
        function (req, res, next) {

            my.core.exec("create a user",
                {email:req.body.email,nickname:req.body.nickname,password:req.body.password}
                , function (result) {

                if (result.hasError()) {
                    res.send(result.json());
                } else {

                    var user = result.data("user");

                    if (user && user.email === my.config.admin_email) {
                        setTimeout(function () {
                            my.core.call("User.becomeAdmin", user.id);

                        }, 1000);
                    }

                    setTimeout(function () {
                        next();
                    },100);
                }

            });
        }, login);

    my.app.post("/user/login",
        my.util.validat_num,
        my.util.refreshValidatNum,
        login);

    my.app.post("/user/logout", function (req, res) {
        res.clearCookie("user");
        req.session.user = null;
        res.send();
    })

    my.app.post("/user/update_logo",
        my.util.isLogin,
        function (req, res) {
            var logo = req.files.file;
            if (logo && (logo.type === "image/png" || logo.type === "image/jpeg") && logo.size <= 1024 * 100) {
                fs.createReadStream(logo.path).pipe(fs.createWriteStream(path.join(__dirname, "..", "public/logo", req.session.user.nickname)));
                res.send();
            } else {
                res.send("图片大小<100k，并且是png/jpg格式");
            }
        })

}
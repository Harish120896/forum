var userCtrl = require("../controller/user"),
    data = require("../controller/data"),
    util = require("../controller/util");

module.exports = function wrap(app) {

// user controller
    app.post("/user/login",
        util.validat_num,
        data.userByEmail,
        util.hasUser,
        userCtrl.login,
        util.end);

    app.post("/user/logout",
        userCtrl.logout,
        util.end);

    app.post("/user/reg",
        util.validat_num,
        userCtrl.create,
        userCtrl.login,
        util.end);

    app.post("/user/update",
        util.isLogin,
        userCtrl.update,
        util.end);

    app.post("/user/:id/seal",
        util.isLogin,
        util.isAdmin,
        data.userById,
        util.hasUser,
        util.noSelf,
        userCtrl.seal,
        util.end);

    app.post("/user/:id/remove",
        util.isLogin,
        util.isAdmin,
        data.userById,
        util.hasUser,
        util.noSelf,
        userCtrl.remove,
        util.end);

    app.post("/user/:id/follow",
        util.isLogin,
        userCtrl.follow,
        util.end);

    app.post("/user/:id/unfollow",
        util.isLogin,
        userCtrl.unfollow,
        util.end);

    app.post("/user/findPassword",
        data.userByEmail,
        util.hasUser,
        userCtrl.findPassword,
        util.end
    )

    app.post("/user/updatePassword",
        data.userByEmail,
        util.hasUser,
        userCtrl.updatePassword,
        util.end);

    app.post("/user/:id/plus",
        util.isLogin,
        util.isAdmin,
        data.userById,
        util.hasUser,
        userCtrl.plus,
        util.end);

    app.post("/user/logined",
        util.isLogin,
        function (req, res) {
            if(req.result.hasError()){
                res.send();
            }else{
                res.redirect("/user/"+req.session.user.id+"/get")
            }
        })

    app.post("/user/:id/get",
        data.userById,
        function (req, res) {
            res.send(req.user);
        })

    app.post("/user/updateLogo",
        util.isLogin,
        userCtrl.updateLogo
    )

    app.post("/user/isCustomLogo",
        util.isLogin,
        userCtrl.isCustomLogo,
        util.end
    )

}
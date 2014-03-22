
module.exports = function wrap(app,ctrls) {

    app.post("/user/login",
        ctrls.util.validat_num,
        ctrls.data.userByEmail,
        ctrls.util.hasUser,
        ctrls.user.login,
        ctrls.util.end);

    app.post("/user/logout",
        ctrls.user.logout,
        ctrls.util.end);

    app.post("/user/reg",
        ctrls.util.validat_num,
        ctrls.user.create,
        ctrls.user.login,
        ctrls.util.end);

    app.post("/user/update",
        ctrls.util.isLogin,
        ctrls.user.update,
        ctrls.util.end);

    app.post("/user/:id/seal",
        ctrls.util.isLogin,
        ctrls.util.isAdmin,
        ctrls.data.userById,
        ctrls.util.hasUser,
        ctrls.util.noSelf,
        ctrls.userCtrl.seal,
        ctrls.util.end);

    app.post("/user/:id/remove",
        ctrls.util.isLogin,
        ctrls.util.isAdmin,
        ctrls.data.userById,
        ctrls.util.hasUser,
        ctrls.util.noSelf,
        ctrls.user.remove,
        ctrls.util.end);

    app.post("/user/:id/follow",
        ctrls.util.isLogin,
        ctrls.user.follow,
        ctrls.util.end);

    app.post("/user/:id/unfollow",
        ctrls.util.isLogin,
        ctrls.user.unfollow,
        ctrls.util.end);

    app.post("/user/findPassword",
        ctrls.data.userByEmail,
        ctrls.util.hasUser,
        ctrls.user.findPassword,
        ctrls.util.end
    )

    app.post("/user/updatePassword",
        ctrls.data.userByEmail,
        ctrls.util.hasUser,
        ctrls.user.updatePassword,
        ctrls.util.end);

    app.post("/user/:id/plus",
        ctrls.util.isLogin,
        ctrls.util.isAdmin,
        ctrls.data.userById,
        ctrls.util.hasUser,
        ctrls.user.plus,
        ctrls.util.end);

    app.post("/user/logined",
        ctrls.util.isLogin,
        function (req, res) {
            if(req.result.hasError()){
                res.send();
            }else{
                res.redirect("/user/"+req.session.user.id+"/get")
            }
        })

    app.post("/user/:id/get",
        ctrls.data.userById,
        function (req, res) {
            res.send(req.user);
        })

    app.post("/user/updateLogo",
        ctrls.util.isLogin,
        ctrls.user.updateLogo
    )

    app.post("/user/isCustomLogo",
        ctrls.util.isLogin,
        ctrls.user.isCustomLogo,
        ctrls.util.end
    )

}
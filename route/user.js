var validator = require("../validator"),
	userCtrl = require("../controller/user"),
	data = require("../data"),
	util = require("../util");

module.exports = function wrap(app){

// user controller
app.post("/user/login", 
	validator.validat_num,
	data.user("email"),
	validator.hasReqUser,
	userCtrl.login,
	util.end);

app.post("/user/logout",
	userCtrl.logout,
	util.end);

app.post("/user/reg",
	validator.isLogin,
	validator.validat_num, 
	userCtrl.create,
	util.end);

app.post("/user/update",
	validator.isLogin,
	validator.validat_num,
	userCtrl.update,
	util.end);

app.post("/user/:id/seal",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.seal,
	util.end);

app.post("/user/:id/remove",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.remove,
	util.end);

app.post("/user/:id/follow",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.follow,
	util.end);

app.post("/user/:id/unfollow",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.unfollow,
	util.end);


app.post("/user/:id/becomeModerator",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.becomeModerator,
	util.end);

app.post("/user/:id/becomeUser",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	validator.userNoSelf,
	userCtrl.becomeUser,
	util.end);

app.post("/user/updatePassword",
	validator.isLogin,
	validator.validat_num,
	userCtrl.updatePassword,
	util.end);

app.post("/user/:id/plus",
	validator.isLogin,
	validator.isAdmin,
	data.user("id"),
	validator.hasReqUser,
	userCtrl.plus,
	util.end);
	
}
var validator = require("../validator"),
	replyCtrl = require("../controller/reply"),
	data = require("../data"),
	util = require("../util");

module.exports = function wrap(app){
// reply controller
app.post("/reply/create",
	validator.isLogin,
	validator.validat_num,
	replyCtrl.create,
	function(req,res){
		res.send({result:req.result,topic:req.reply});
	});
	
app.post("/reply/:id/update",
	validator.isLogin,
	validator.validat_num,
	data.reply,
	validator.isReplyAuthor,
	replyCtrl.update,
	util.end);

app.post("/reply/:id/remove",
	validator.isLogin,
	validator.validat_num,
	data.reply,
	validator.isReplyManager,
	replyCtrl.remove,
	util.end);
}
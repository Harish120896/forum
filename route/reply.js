var replyCtrl = require("../controller/reply"),
	data = require("../controller/data"),
	util = require("../controller/util");

module.exports = function wrap(app){
// reply controller
app.post("/reply/create",
	util.isLogin,
	util.validat_num,
	replyCtrl.create,
	function(req,res){
		res.send({result:req.result,topic:req.reply});
	});
	
app.post("/reply/:id/remove",
	util.isLogin,
	util.validat_num,
	data.replyById,
	util.hasReply,
	util.isReplyManager,
	replyCtrl.remove,
	util.end);
}
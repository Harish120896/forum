var topicCtrl = require("../controller/topic"),
	data = require("../controller/data"),
	util = require("../controller/util");

module.exports = function wrap(app){


// Topic controller
app.post("/topic/create",
	util.isLogin,
	util.validat_num,
	topicCtrl.create,
	function(req,res){
		res.send({result:req.result,topic:req.topic});
	});

app.post("/topic/:id/update",
	util.isLogin,
	util.validat_num,
	topicCtrl.update,
	util.end);
	
app.post("/topic/:id/remove",
	util.isLogin,
	data.topicById,
	util.hasTopic,
	util.isAdmin,
	topicCtrl.remove,
	util.end);
	
app.post("/topic/:id/seal",
	util.isLogin,
	data.topicById,
	util.hasTopic,
	util.isTopicManager,
	topicCtrl.seal,
	util.end);

app.post("/topic/:id/unseal",
	util.isLogin,
	data.topicById,
	util.hasTopic,
	util.isTopicManager,
	topicCtrl.unseal,
	util.end);
	
}
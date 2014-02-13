var validator = require("../validator"),
	topicCtrl = require("../controller/topic"),
	data = require("../data"),
	util = require("../util");

module.exports = function wrap(app){

// Topic controller
app.post("/topic/create",
	validator.isLogin,
	validator.validat_num,
	topicCtrl.create,
	function(req,res){
		res.send({result:req.result,topic:req.topic});
	});

app.post("/topic/:id/update",
	validator.isLogin,
	validator.validat_num,
	topicCtrl.update,
	util.end);
	
app.post("/topic/:id/remove",
	validator.isLogin,
	data.topic,
	validator.hasTopic,
	validator.isAdmin,
	topicCtrl.remove,
	util.end);
	
app.post("/topic/:id/seal",
	validator.isLogin,
	data.topic,
	validator.hasTopic,
	validator.isTopicManager,
	topicCtrl.seal,
	util.end);

app.post("/topic/:id/unseal",
	validator.isLogin,
	data.topic,
	validator.hasTopic,
	validator.isTopicManager,
	topicCtrl.unseal,
	util.end);
	
}
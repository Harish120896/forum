module.exports = function(req,res,next){
	req.env = {
		query : require("./query"),
		domain : require("./domain")
	}
	next();
}
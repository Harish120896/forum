var domain = require("./domain"),
query = require("./query");

module.exports = function(req,res,next){
	req.env = {
		domain:domain,
		query:query
	}
	next();
}
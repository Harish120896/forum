module.exports = function(Model){
	Model.prototype.attr = function(attrs){
		this.set(attrs);
		return this.errors;
	}
}
module.exports = function OneDay(date){
	
	var date = date || new Date();
		
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	
	this.startTime = date.getTime();
	
	this.endTime = this.startTime + 1000*60*60*24;
	
}
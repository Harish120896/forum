module.exports = filter;

function filter(content){
	var names = content.match(/(?:@)\w*(?=\s|$)/gi);
	var names2 = [];
	if(names){
		names.forEach(function(name){
			names2.push(name.substring(1,name.length));
		});
	}
	return names2;
}


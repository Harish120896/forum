var Domain = require("jsdm.proxy");
var domain  = new Domain("/domain");


angular.module("forumapp",[])
.controller("appCtrl",function($scope){

	$scope.create = function(){
		console.log(3333)
		domain.exec("create a column",{name:$scope.name,des:$scope.des},function(){
			domain.query("columns",{},function(rs){
				$scope.columns = rs;
				$scope.$apply()
			})
		});
	}
	
})
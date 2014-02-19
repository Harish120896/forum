;(function(){
	
	app.controller("topicCtrl",function($scope,$http){
		$scope.createTopic = function(){
			console.log($scope.title)
			$http.post("/topic/create",{
				title:$scope.title,
				body:$scope.body,
				validat_num:$scope.validat_num,
				columnId:$scope.columnId
			}).success(function(){
				window.location.href  =  window.location.href;
			})
		}
	});
		
})()
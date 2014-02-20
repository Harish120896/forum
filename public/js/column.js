;(function(){
	
	app.controller("topicCtrl",function($scope,$http,$rootScope){
		$scope.createTopic = function(){
			$http.post("/topic/create",{
				title:$scope.title,
				body:$scope.body,
				validat_num:$scope.validat_num,
				columnId:$scope.columnId
			}).success(function(data){
                if (data.result === "success") {
					window.location.href = "/topic/"+data.data;
				} else {
                    var keys = Object.keys(data.result);
                    keys.forEach(function(key) {
                        $scope[key + "Message"] = data.result[key][0];
                    })
                    $rootScope.refreshNum();
                }
			})
		}
	});
		
})()
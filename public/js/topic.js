app.controller("replyCtrl",function($scope,$http,$rootScope){
	
	$scope.$watch("topicId",function(){
		$http.get("/replyTree/"+$scope.topicId).success(function(data){
			$scope.replyTree = data;
			
		})
	})
	
	
	$scope.createReply = function(){
		$http.post("/reply/create",{
			title:$scope.title,
			body:$scope.body,
			validat_num:$scope.validat_num,
			topicId:$scope.topicId
		}).success(function(data){
            if (data.result === "success") {
				setTimeout(function(){
					window.location.reload();
				},1000)
			} else {
                var keys = Object.keys(data.result);
                keys.forEach(function(key) {
                    $scope[key + "Message"] = data.result[key][0];
                })
                $rootScope.refreshNum();
            }
		})
	}
})

app.directive("reply",function($http){
	return {
		scope:{},
		template:'<div>{{reply.body}}</div>',
		link:function(scope, elem, attrs){
			console.log(attrs.replyid)
			var rid = attrs.replyid;
			$http.get("/reply/"+rid).success(function(data){
				console.log(data)
				scope.reply = data;
			})
		}
	}
})
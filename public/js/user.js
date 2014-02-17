app.controller("infoCtrl",function($scope,$http){
	
	$scope.nickEditShow = false;
	
	$scope.edit = function(){
		this.nickEditShow = true;
	}
	
	$scope.nickEditOk = function(){
		var oldnick = this.nickname;
		$http.post("/user/updateNickname",{nickname:$scope.nickname}).success(function(err){
			if(err){
				$scope.nickEditErrorShow = true;
			}else{
				$scope.nickEditShow = false;
				$scope.nickEditErrorShow = false;
				
			}
		})
		
	}
});

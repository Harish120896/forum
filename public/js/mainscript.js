var app = angular.module("forumapp",[])

.run(function($rootScope,$http){
	
	$http.post("/user/logined").success(function(data){
		if(data.email){
			$rootScope.user = data;
			$rootScope.logined = true;
		}
	})
	
	$rootScope.refreshNum = function(){
		this.time = Date.now();
	}
	$rootScope.refreshNum();	
})

.controller("headerCtrl",function($scope,$rootScope,$http){
	$scope.logout = function(){
		$http.post("/user/logout").success(function(){
			$rootScope.logined = false;
		})
	}
})

.controller("regCtrl",function($scope,$rootScope,$http){
	$scope.reg = function(){
		$http.post("/user/reg",{email:$scope.email,password:$scope.password,validat_num:$scope.validat_num})
		.success(function(data){
			if(data.email){
				$rootScope.user = data;
				$rootScope.logined = true;
				$('#regDialog').modal('hide');
			}else{
				$scope.errorShow = true;
			}
		})
	}
})

.controller("loginCtrl",function($scope,$rootScope,$http){
	$scope.reg = function(){
		$http.post("/user/login",{email:$scope.email,password:$scope.password,validat_num:$scope.validat_num})
		.success(function(data){
			if(data.email){
				$rootScope.user = data;
				$rootScope.logined = true;
				$('#loginDialog').modal('hide');
			}else{
				$scope.errorShow = true;
			}
		})
	}
})
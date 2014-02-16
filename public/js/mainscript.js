var app = angular.module("forumapp",[]);

;(function(){
	
	function initForm(scope,form){
		clearErrors(scope);
		scope.email = "";
		scope.password = "";
		scope.validat_num = "";
		scope.$apply();
	}
	
	function formFocus(form){
		setTimeout(function(){
			$(form).find("input")[0].focus();
		},500);
	}
	
	function clearErrors(scope){
		scope.emailMessage = null;
		scope.validat_numMessage= null;
		scope.passwordMessage = null;
	}
	
	// init
	app.run(function($rootScope,$http){
	
		
		$("#regDialog [tabindex]").bind("keydown",function(e){
		
			if(e.keyCode === 13){
				var t = $(this).attr("tabindex");
				var t = parseInt(t);

				var next;
				if(t === 4){
					next = 1;
				}else{
					next = t+1;
				}

				$("#regDialog").find("[tabindex="+next+"]").focus();	
			}

			
		});
			
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
		
		$("#regDialog").on('show.bs.modal', function (e) {
			initForm($scope,this);
			$rootScope.refreshNum();
		})
		
		$("#regDialog").on('shown.bs.modal', function (e) {
			formFocus(this);
		})
		
		$scope.reg = function(){
			$http.post("/user/reg",{email:$scope.email,password:$scope.password,validat_num:$scope.validat_num})
			.success(function(data){
				if(data === "success"){
					location.reload();
				}else{
					
					clearErrors($scope);
					var keys  = Object.keys(data);
					keys.forEach(function(key){
						$scope[key+"Message"] = data[key][0];
					})
					$rootScope.refreshNum();
				}
			})
		}
	})

	.controller("loginCtrl",function($scope,$rootScope,$http){
		
		$("#loginDialog").on('show.bs.modal', function (e) {
			initForm($scope,this);
			$rootScope.refreshNum();
		})
		
		$scope.reg = function(){
			$http.post("/user/login",{email:$scope.email,password:$scope.password,validat_num:$scope.validat_num})
			.success(function(data){
				if(data.email){
					$rootScope.user = data;
					$rootScope.logined = true;
					$('#loginDialog').modal('hide');
				}else{
					$scope.errorShow = true;
					$rootScope.refreshNum();
				}
				initForm($scope);
			})
		}
	})	
})();

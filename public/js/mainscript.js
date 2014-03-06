var app = angular.module("forumapp", []).config([
    '$httpProvider',
    '$locationProvider',
    function($httpProvider, $locationProvider) {
      // Expose XHR requests to server
      $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

      // This is `false` by default
      $locationProvider.html5Mode(true);
    }
  ]);

(function() {

    function initForm(scope, form) {
        clearErrors(scope);
        scope.email = "";
        scope.password = "";
        scope.nickname = "";
        scope.validat_num = "";
        scope.$apply();
    }

	function popover(msg){
		// doto 
		setTimeout(function(){
			$("#userInfo").popover({content:msg,placement:"bottom"}).popover("show");
		},100);
		setTimeout(function(){
			$("#userInfo").popover("destroy");
		},2000)		
	}

    function formFocus(form) {
        setTimeout(function() {
            $(form).find("input")[0].focus();
        }, 500);
    }

    function clearErrors(scope) {
        scope.emailMessage = null;
        scope.nicknameMessage = null;
        scope.validat_numMessage = null;
        scope.passwordMessage = null;
    }

    // init
    app.run(function($rootScope, $http) {

		function enterFocus(maxTabNum){
	        return function (e) {

	            if (e.keyCode === 13) {
	                var t = $(this).attr("tabindex");
	                var t = parseInt(t);

	                var next;
	                if (t === maxTabNum) {
	                    next = 1;
	                } else {
	                    next = t + 1;
	                }

	                $(this).parents().find("[tabindex=" + next + "]").focus();
	            }

	        }			
		}


        $("#regDialog [tabindex]").bind("keydown", enterFocus(5));
        $("#loginDialog [tabindex]").bind("keydown", enterFocus(4));

        $rootScope.checkLogined = function() {
            var self = this;
            $http.post("/user/logined").success(function(data) {
                if (data.email) {
                    self.user = data;
                    self.logined = true;
                }
            })
        }

        $rootScope.checkLogined();

        $rootScope.refreshNum = function() {
            this.time = Date.now();
        }

        $rootScope.refreshNum();
    })

    .controller("headerCtrl", function($scope, $rootScope, $http) {
        $scope.logout = function() {
            $http.post("/user/logout").success(function() {
                $rootScope.logined = false;
            })
        }
    })

    .controller("regCtrl", function($scope, $rootScope, $http) {

		

        $("#regDialog").on('show.bs.modal', function(e) {
            initForm($scope, this);
            $rootScope.refreshNum();
        })

        $("#regDialog").on('shown.bs.modal', function(e) {
            formFocus(this);
        })

        $scope.reg = function() {
            $http.post("/user/reg", {
				nickname:$scope.nickname,
                email: $scope.email,
                password: $scope.password,
                validat_num: $scope.validat_num
            })
                .success(function(data) {
                    if (data === "success") {
                        $rootScope.checkLogined();
                        $('#regDialog').modal('hide');
						popover("您已注册成功！")
                    } else {

                        clearErrors($scope);
                        var keys = Object.keys(data);
                        keys.forEach(function(key) {
                            $scope[key + "Message"] = data[key][0];
                        })
                        $rootScope.refreshNum();
                    }
                })
        }
    })

    .controller("loginCtrl", function($scope, $rootScope, $http) {

        $("#loginDialog").on('show.bs.modal', function(e) {
            $rootScope.refreshNum();
            initForm($scope, this);
        })

        $("#loginDialog").on('shown.bs.modal', function(e) {
            formFocus(this);
        })
		
		$scope.findPassword = function(){
			
            $http.post("/user/findPassword", {
            	email: $scope.email
            }).success(function(data){
                if (data === "success") {
                    alert("请到信箱"+$scope.email+"内确认");
                } else{
                    if (data === "success") {
                        $rootScope.checkLogined();
                        $('#loginDialog').modal('hide');
						popover("您已登录成功!");
						
                    } else {
                        clearErrors($scope);
                        var keys = Object.keys(data);
                        keys.forEach(function(key) {
							if(key === "user"){
								 $scope["emailMessage"] = data[key][0];
							}else{
	                            $scope[key + "Message"] = data[key][0];
							}
                        })
                        $rootScope.refreshNum();
                    }                	
                }
            })
			
		}

        $scope.reg = function() {
            $http.post("/user/login", {
                email: $scope.email,
                password: $scope.password,
                validat_num: $scope.validat_num
            })
                .success(function(data) {
                    if (data === "success") {
                        $rootScope.checkLogined();
                        $('#loginDialog').modal('hide');
						popover("您已登录成功!");
						
                    } else {
                        clearErrors($scope);
                        var keys = Object.keys(data);
                        keys.forEach(function(key) {
							if(key === "user"){
								 $scope["emailMessage"] = data[key][0];
							}else{
	                            $scope[key + "Message"] = data[key][0];
							}
                        })
                        $rootScope.refreshNum();
                    }
                })
        }
    })
})();

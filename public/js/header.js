var app = angular.module('jseraApp', ['ui.bootstrap'])
    .config([
        '$httpProvider',
        '$locationProvider',
        function($httpProvider, $locationProvider) {
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $locationProvider.html5Mode(true);
        }
    ])
 // enter tab index.
.directive("focus", function($timeout) {
    return {
        scope: {
            trigger: '@focus'
        },
        link: function(scope, element) {
            var els = element[0].querySelectorAll("[tabindex]");
            var len = els.length;
            var currentIndex;
            element.bind("keydown", function(e) {
                if (e.keyCode === 13) {
                    var t = angular.element(element[0].querySelector(":focus")).attr("tabindex");
                    var t = parseInt(t);

                    var next;
                    if (t === len) {
                        next = 1;
                    } else {
                        next = t + 1;
                    }
                    scope.trigger = next;
                    scope.$apply();
                }
            });
            scope.$watch('trigger', function(value) {
                currentIndex = parseInt(value);
                $timeout(function() {
                    element[0].querySelector("[tabindex=\"" + value + "\"]").focus();
                });
            });
        }
    };
})
.run(function($rootScope, $http) {
    $rootScope.refreshNum = function() {
        this.time = Date.now();
    }
    $rootScope.refreshNum();
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
})
.controller("headerCtrl", function($scope, $modal, $http,$rootScope) {
    $scope.openLoginDialog = function() {
        $modal.open({
            templateUrl: 'template/login.html',
            controller: "loginCtrl"
        });
    };
    $scope.openRegDialog = function() {
        $modal.open({
            templateUrl: 'template/reg.html',
            controller: "regCtrl"
        });
    };
    $scope.logout = function() {
        $http.post("/user/logout").success(function() {
            $rootScope.logined = false;
        })
    }
})
.controller("loginCtrl", function($scope, $modalInstance,$http,$rootScope) {
	
	$scope.data = {}
			
    $modalInstance.opened.then(function() {
        $scope.tabindex = "1";
    })
    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    }
    $scope.login = function() {
        $http.post("/user/login", {
            email: $scope.data.email,
            password: $scope.data.password,
            validat_num: $scope.data.validat_num
        }).success(function(data) {
            if (data === "success") {
                $rootScope.checkLogined();
	            $modalInstance.dismiss('cancel');
            } else {
                //clearErrors($scope);
                var keys = Object.keys(data);
                keys.forEach(function(key) {
                    if (key === "user") {
                        $scope["emailMessage"] = data[key][0];
                    } else {
                        $scope[key + "Message"] = data[key][0];
                    }
                })
                $rootScope.refreshNum();
            }
        })
    }
})
.controller("regCtrl", function($scope, $modalInstance,$http,$rootScope) {
	
	$scope.data = {}
			
    $modalInstance.opened.then(function() {
        $scope.tabindex = "1";
    })
    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    }
    $scope.reg = function() {
        $http.post("/user/reg", $scope.data).success(function(data) {
            if (data === "success") {
                $rootScope.checkLogined();
	            $modalInstance.dismiss('cancel');
            } else {
                //clearErrors($scope);
                var keys = Object.keys(data);
                keys.forEach(function(key) {
                    if (key === "user") {
                        $scope["emailMessage"] = data[key][0];
                    } else {
                        $scope[key + "Message"] = data[key][0];
                    }
                })
                $rootScope.refreshNum();
            }
        })
    }
})
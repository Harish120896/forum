
    app.controller("upwdCtrl", function($scope, $http) {

        $scope.update = function() {
			console.log($scope.code);
            $http.post("/user/updatePassword", {
                code: $scope.code,
                email: $scope.email,
                password: $scope.password
            })
                .success(function(data) {
					console.log(data);
                    if (data === "success") {
                        alert("success");
                    } else {
                        if (data.password) {
                            $scope.passwordMessage = data.password[0];
                        } else if (data.user) {
                            $scope.passwordMessage = data.user[0];
                        }

                    }
                })
        }

    })


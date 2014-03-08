;
app.controller("columnCtrl",function ($scope, $modal) {

    $scope.openCreateDialog = function () {
        $modal.open({
            templateUrl: 'template/createColumn.html',
            controller: "createColumnCtrl"
        });
    }

    $scope.openUpdateDialog = function (id) {

        var dialog = $modal.open({
            templateUrl: 'template/updateColumn.html',
            controller: "updateColumnCtrl",
        });

        dialog.id = id;

    }

}).controller("createColumnCtrl",function ($scope, $http, $modalInstance) {


        $modalInstance.opened.then(function () {
            $scope.tabindex = "1";
        })

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }

        $scope.data = {}
        $scope.create = function () {
            $http.post("/column/create", $scope.data).success(function (data) {
                setTimeout(function () {
                    window.location.reload();
                }, 1000)
            })
        }

    }).controller("updateColumnCtrl", function ($scope, $http, $modalInstance) {

        console.log($modalInstance.id)
        $http.get("/column/" + $modalInstance.id + "/get")
            .success(function (data) {
                $scope.data = data;
            })

        $modalInstance.opened.then(function () {
            $scope.tabindex = "1";
        })

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }


        $scope.update = function () {
            $http.post("/column/" + $modalInstance.id + "/update", $scope.data)
                .success(function (data) {
                    $modalInstance.dismiss('cancel');
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000)
                })
        }

    });
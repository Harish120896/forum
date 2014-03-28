app.controller("column_page_ctrl", function ($scope, $http, $rootScope, core) {

    $scope.createTopic = function () {

        core.exec("create a topic", {})

        $http.post("/topic/create", {
            title: $scope.title,
            body: $scope.body,
            validat_num: $scope.validat_num,
            columnId: $scope.columnId
        }).success(function (data) {
                if (data) {
                    $scope.errors = data;
                    $rootScope.refreshNum();
                } else {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000)
                }
            })
    }

})

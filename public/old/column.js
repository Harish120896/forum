app.controller("topicCtrl", function ($scope, $http, $rootScope) {
    $scope.createTopic = function () {
        $http.post("/topic/create", {
            title: $scope.title,
            body: $scope.body,
            validat_num: $scope.validat_num,
            columnId: $scope.columnId
        }).success(function (data) {
                if (data === "success") {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000)
                } else {
                    var keys = Object.keys(data);
                    keys.forEach(function (key) {
                        $scope[key + "Message"] = data[key][0];
                    })
                    $rootScope.refreshNum();
                }
            })
    }
});

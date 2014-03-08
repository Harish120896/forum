var app = angular.module('jseraApp', ['ui.bootstrap'])
    .config([
        '$httpProvider',
        '$locationProvider',
        function ($httpProvider, $locationProvider) {
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $locationProvider.html5Mode(true);
        }
    ])

    .directive("focus", function ($timeout) {
        return {
            scope: {
                trigger: '@focus'
            },
            link: function (scope, element) {
                var els = element[0].querySelectorAll("[tabindex]");
                var len = els.length;
                var currentIndex;
                element.bind("keydown", function (e) {
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
                scope.$watch('trigger', function (value) {
                    currentIndex = parseInt(value);
                    $timeout(function () {
                        element[0].querySelector("[tabindex=\"" + value + "\"]").focus();
                    });
                });
            }
        };
    })
    .run(function ($rootScope, $http) {
        $rootScope.refreshNum = function () {
            this.time = Date.now();
        }
        $rootScope.refreshNum();
        $rootScope.checkLogined = function () {
            var self = this;
            $http.post("/user/logined").success(function (data) {
                if (data.email) {
                    self.user = data;
                    self.logined = true;
                }
            })
        }
        $rootScope.checkLogined();
    })
    .controller("headerCtrl", function ($scope, $modal, $http, $rootScope) {
        $scope.openLoginDialog = function () {
            $modal.open({
                templateUrl: 'template/login.html',
                controller: "loginCtrl"
            });
        };
        $scope.openRegDialog = function () {
            $modal.open({
                templateUrl: 'template/reg.html',
                controller: "regCtrl"
            });
        };
        $scope.logout = function () {
            $http.post("/user/logout").success(function () {
                $rootScope.logined = false;
            })
        }
    })
    .controller("loginCtrl", function ($scope, $modalInstance, $http, $rootScope) {

        $scope.data = {}

        $modalInstance.opened.then(function () {
            $scope.tabindex = "1";
        })
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }
        $scope.login = function () {
            $http.post("/user/login", {
                email: $scope.data.email,
                password: $scope.data.password,
                validat_num: $scope.data.validat_num
            }).success(function (data) {
                    if (data === "success") {
                        $rootScope.checkLogined();
                        $modalInstance.dismiss('cancel');
                    } else {
                        //clearErrors($scope);
                        var keys = Object.keys(data);
                        keys.forEach(function (key) {
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
    .controller("regCtrl", function ($scope, $modalInstance, $http, $rootScope) {

        $scope.data = {}

        $modalInstance.opened.then(function () {
            $scope.tabindex = "1";
        })
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }
        $scope.reg = function () {
            $http.post("/user/reg", $scope.data).success(function (data) {
                if (data === "success") {
                    $rootScope.checkLogined();
                    $modalInstance.dismiss('cancel');
                } else {
                    //clearErrors($scope);
                    var keys = Object.keys(data);
                    keys.forEach(function (key) {
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
    .directive("reply", function ($rootScope, $sce) {

        return {
            scope: {
                parent: "@",
                topic: "@",
                createReply: "&"
            },
            templateUrl: "/template/reply.html",
            controller: function ($scope) {

                $scope.content = "";

                $scope.refreshNum = $rootScope.refreshNum;

                $scope.getEditor = function (editor) {
                    $scope.editor = editor;
                }

            },
            link: function (scope, elem, attrs, ctrl) {

                scope.$watch("parent", function () {
                    if (scope.parent) {
                        var parent = document.querySelector("#" + scope.parent);
                        parent.appendChild(elem[0]);
                        scope.editor.refresh();
                        scope.refreshNum();
                    }
                })
            }
        }

    })
    .factory("DATA", function ($http) {

    })
    .directive('editor', function () {

        return {
            scope: {
                defaultContent: "=",
                getEditor: "&"
            },
            template: '<div class="epic-editor"></div>',
            link: function (scope, element, attrs) {

                var editor;

                var content;

                function refresh() {

                    var opts = {
                        container: element[0],
                        basePath: '',
                        file: {
                            defaultContent: scope.defaultContent,
                            autoSave: 100
                        }
                    }

                    editor = new EpicEditor(opts);
                    editor.load(function () {
                        editor.importFile(null, scope.content);
                        editor.on("update", function (v) {
                            content = v.content;
                        })
                    });

                }

                refresh();

                scope.getEditor({
                    editor: {
                        content: function (v) {
                            if (arguments.length === 0) {
                                return content;
                            } else {
                                editor.editorIframe.body.innerText = v;
                            }
                        },
                        refresh: refresh
                    }
                })

            }
        }
    })
    .controller("replyCtrl", function ($scope, $http, $rootScope) {

        $scope.$watch("topicId", function () {
            $http.get("/replyTree/" + $scope.topicId).success(function (data) {
                $scope.replyTree = data;
                $scope.render();
            })
        })

        var editor;

        $scope.getEditor = function (edt) {
            editor = edt;
        }

        $scope.toreply = function (id) {
            $scope.parent = id;
        }

        $scope.render = function () {
            var rs = $scope.replyTree.slice(0, $scope.shownum);

            for (var i = 0, len = rs.length; i < len; i++) {

                (function (id) {
                    var ids = $scope.subReply(id);
                    for (var i = 0, len = ids.length; i < len; i++) {

                        (function (id) {

                            $http.get("/reply/" + id).success(function (data) {
                                $scope.replys[id] = data;
                            });
                        })(ids[i]);
                    }

                    $http.get("/reply/" + id).success(function (data) {
                        $scope.replys[id] = data;
                    });
                })(rs[i].id);
            }
        }

        $scope.subReply = function (rid) {
            var rs = $scope.replyTree;
            for (var i = 0, len = rs.length; i < len; i++) {
                if (rs[i].id === rid) {
                    return rs[i].childIds;
                }
            }
        }

        $scope.shownum = 3;
        $scope.replys = {}

        $scope.more = function () {

            this.shownum += 3;
            this.render();
        }

        var showReplyId = null;


        $scope.openReplyTextarea = function (id) {
            showReplyId = id;
            this.content = "";
        }

        $scope.showTextarea = function (id) {
            if (showReplyId === id) {
                return true;
            }
        }

        $scope.reply = function () {

            var option = {
                title: "回帖",
                body: $scope.body,
                validat_num: $scope.validat_num,
                topicId: $scope.topicId,
                parentId: showReplyId
            }

            $http.post("/reply/create", option).success(function (data) {
                if (data.result === "success") {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000)
                } else {
                    var keys = Object.keys(data.result);
                    keys.forEach(function (key) {
                        $scope[key + "Message"] = data.result[key][0];
                    })
                    $rootScope.refreshNum();
                }
            })
        }


        $scope.createReply = function (option) {
            console.log(option);
            $http.post("/reply/create", option).success(function (data) {
                if (data.result === "success") {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000)
                } else {
                    var keys = Object.keys(data.result);
                    keys.forEach(function (key) {
                        $scope[key + "Message"] = data.result[key][0];
                    })
                    $rootScope.refreshNum();
                }
            })

        }

        $scope.createReply2 = function () {
            var option = {
                title: $scope.title,
                body: editor.content(),
                validat_num: $scope.validat_num,
                topicId: $scope.topicId
            }

            $http.post("/reply/create", option).success(function (data) {
                if (data.result === "success") {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000)
                } else {
                    var keys = Object.keys(data.result);
                    keys.forEach(function (key) {
                        $scope[key + "Message"] = data.result[key][0];
                    })
                    $rootScope.refreshNum();
                }
            })
        }
    })
    .controller("columnCtrl",function ($scope, $modal) {

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

    })
    .controller("infoCtrl", function ($scope, $http) {

        $scope.nickEditShow = false;

        $scope.edit = function () {
            this.nickEditShow = true;
        }

        $scope.nickEditOk = function () {
            var oldnick = this.nickname;
            $http.post("/user/updateNickname", {nickname: $scope.nickname}).success(function (err) {
                if (err) {
                    $scope.nickEditErrorShow = true;
                } else {
                    $scope.nickEditShow = false;
                    $scope.nickEditErrorShow = false;

                }
            })

        }
    })
    .controller("topicCtrl", function ($scope, $http, $rootScope) {
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
    })
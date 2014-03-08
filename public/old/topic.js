app
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

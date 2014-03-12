var app = angular.module('jseraApp', ['ui.bootstrap','angularFileUpload'])

    .config([
        '$httpProvider',
        '$locationProvider',
        function ($httpProvider, $locationProvider) {
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $locationProvider.html5Mode(true);
        }
    ])

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
    .directive('epicEditor', function () {

        return {
            restrict: "E",
            link: function (scope, element, attrs) {

                var editor;
                var content = "";

                function refresh() {

                    var opts = {
                        container: element[0],
                        basePath: '',
                        file: {
                            defaultContent: attrs.defaultContent || "",
                            autoSave: 100
                        }
                    }

                    editor = new EpicEditor(opts);
                    editor.load(function () {
                        editor.importFile(null, scope.content);
                        editor.on("update", function (v) {
                            content = v.content;
                        })
                        element.find("iframe").css("width","100%");
                        console.log(element.find("iframe").css("width"));

                    });

                }

                refresh();

                scope.epicEditor = {
                    content: function (v) {
                        if (arguments.length === 0) {
                            return content;
                        } else {
                            editor.editorIframe.body.innerText = v;
                        }
                    },
                    refresh: refresh
                }

            }
        }
    })

    .directive("replyEditor", function ($rootScope) {

        return {

            templateUrl: "/template/reply.html",
            restrict: "E",
            link: function (scope, elem, attrs) {

                scope.$watch("editorContainerId", function (v) {
                    if (v) {
                        var parent = document.querySelector("#" + v);
                        parent.appendChild(elem[0]);
                    }
                    scope.epicEditor.refresh();
                    $rootScope.refreshNum();
                })

            }
        }

    })

    .controller("headerCtrl", function ($scope, $modal, $http, $rootScope) {
        $scope.openLoginDialog = function () {
            $modal.open({
                templateUrl: '/template/login.html',
                controller: "loginCtrl"
            });
        };
        $scope.openRegDialog = function () {
            $modal.open({
                templateUrl: '/template/reg.html',
                controller: "regCtrl"
            });
        };
        $scope.logout = function () {
            $http.post("/user/logout").success(function () {
                $rootScope.logined = false;
            })
        }
    })

    .controller("loginCtrl", function ($scope, $modalInstance, $http, $rootScope,shareCode) {

        $scope.data = {}

        var handle = shareCode.getResultHandle($scope,$modalInstance);

        $modalInstance.opened.then(function () {
            $scope.tabindex = "1";
        })

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }

        $scope.login = function () {
            $http.post("/user/login",$scope.data).success(handle);
        }

    })

    .controller("regCtrl", function ($scope, $modalInstance, $http, $rootScope, shareCode) {

        $scope.data = {}
        var handle = shareCode.getResultHandle($scope,$modalInstance);

        $modalInstance.opened.then(function () {
            $scope.tabindex = "1";
        })
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }
        $scope.reg = function () {
            $http.post("/user/reg", $scope.data).success(handle);
        }
    })
    .factory("shareCode", function (Result, $rootScope) {

        return {
            getResultHandle: function ($scope, $modalInstance) {
                return function resultHandle(data) {
                    var result = new Result();
                    result.reborn(data);
                    if (!result.hasError()) {
                        $rootScope.checkLogined();
                        $modalInstance.dismiss('cancel');
                    } else {
                        var errors = result.error();
                        var keys = Object.keys(errors);
                        keys.forEach(function (key) {
                            if (key === "user") {
                                $scope["emailMessage"] = errors[key][0];
                            } else {
                                $scope[key + "Message"] = errors[key][0];
                            }
                        })
                        $rootScope.refreshNum();
                    }
                }
            }
        }


    })
    .factory("Result", function () {

        function Result() {
            this._errors = {};
            this._data = {};
        }

        Result.isResult = function (obj) {
            return obj instanceof this;
        }

        Result.prototype = {
            error: function (attr, msg) {
                if (arguments.length === 2) {
                    if (!this._errors[attr]) {
                        this._errors[attr] = [];
                    }
                    this._errors[attr].push(msg);
                    return this;
                } else if (arguments.length === 1) {
                    return this._errors[attr];
                } else {
                    return this._errors;
                }
            },
            hasError: function () {
                return Object.keys(this._errors).length > 0;
            },
            data: function (k, v) {
                if (arguments.length === 2) {
                    this._data[k] = v;
                    return this;
                } else if (arguments.length === 1) {
                    return this._data[k];
                } else {
                    return this._data;
                }
            },
            mix: function (result) {

                var errKeys = Object.keys(result._errors);
                var self = this;

                errKeys.forEach(function (k) {
                    if (!self._errors[k]) {
                        self._errors[k] = [];
                    }
                    self._errors[k] = self._errors[k].concat(result._errors[k]);
                })

                var dataKeys = Object.keys(result._data);
                dataKeys.forEach(function (k) {
                    self._data[k] = result._data[k];
                })

                return this;
            },
            clearError: function () {
                this._errors = {};
            },
            json: function () {
                return {errors: this._errors, data: this._data};
            },
            reborn: function (json) {
                this._errors = json.errors || {};
                this._data = json.data || {};
            }
        }

        return Result;

    })
    .factory("DATA", function ($http, $q) {

        var replys = {},users = {}

        return {
            user:function(uid){
                var deferred = $q.defer();
                if(users[uid]){
                    deferred.resolve(users[uid]);
                }else{
                    $http.get("/user/" + uid+"/get").success(function (data) {
                        if(data){
                            users[uid] = data;
                            deferred.resolve(users[uid]);
                        }else{
                            deferred.resolve(null);
                        }
                    });
                }
                return deferred.promise;
            },
            removeReply: function (id) {
                $http.post("/reply/" + id + "/remove");
                delete replys[id];
            },
            reply: function (id) {
                var deferred = $q.defer();
                if (replys[id]) {
                    deferred.resolve(replys[id]);
                } else {
                    $http.get("/reply/" + id).success(function (data) {
                        replys[id] = data;
                        deferred.resolve(replys[id]);
                    });
                }
                return deferred.promise;
            },
            replyTree: function (id) {
                var deferred = $q.defer();
                $http.get("/replyTree/" + id).success(function (data) {

                    var replyIdsList = data.childIdsList;
                    var subReplyIds = [];

                    function getSubIdsList(child) {
                        var rs = child.childIdsList.concat([]);
                        child.childIdsList.forEach(function (rid) {
                            rs = rs.concat(getSubIdsList(child.childs[rid]));
                        })
                        return rs;
                    }

                    replyIdsList.forEach(function (rid) {
                        subReplyIds[rid] = getSubIdsList(data.childs[rid]);
                    })

                    deferred.resolve({replyIdsList: replyIdsList, subReplyIds: subReplyIds});
                })
                return deferred.promise;
            }
        }

    })

    .controller("replyCtrl", function ($scope, $http, $rootScope, DATA, Result) {

        // skip reply num
        var replySkipNum = 2;
        $scope.showReplyPosition = 0;
        $scope.showSubReplyPositions = {};

        $scope.loadUser = function(uid){
            DATA.user(uid).then(function(u){
                $scope.users[uid] = u;
            })
        }

        // clear error message
        function clearErrorMessage() {
            $scope.bodyMessage = false;
            $scope.validat_numMessage = false;
        }

        // show replys
        $scope.replys = {};
        $scope.users = {};
        $scope.showEditor = false;
        $scope.editorContainerId = null;

        // init topicId
        $scope.$watch("topicId", function (topicId) {
            DATA.replyTree(topicId).then(function (replyTree) {
                $scope.replyIdsList = replyTree.replyIdsList;
                $scope.subReplyIds = replyTree.subReplyIds;
                $scope.moreReply();
            })
        })

        $scope.moveEditor = function (cid, parentId) {
            if(cid === "createReply"){
                $scope.editorContainerId = cid;
                $scope.parentId = null;
            }else{
                $scope.editorContainerId = cid;
                $scope.parentId = parentId || cid;
            }
        }

        $scope.removeReply = function (rid) {
            delete $scope.replys[rid];
            DATA.removeReply(rid);
        }

        $scope.removeTopic = function(){
            $http.post("/topic/"+$scope.topicId+"/remove").success(function(data){
                window.location.href = "/column/"+$scope.columnId;
            })
        }

        $scope.moreReply = function () {

            var old_showReplyPosition = $scope.showReplyPosition;
            $scope.showReplyPosition += replySkipNum;
            if ($scope.showReplyPosition > $scope.replyIdsList.length) {
                $scope.showReplyPosition = $scope.replyIdsList.length;
            }
            var ids = $scope.replyIdsList.slice(old_showReplyPosition, $scope.showReplyPosition);
            ids.forEach(function (rid) {
                DATA.reply(rid).then(function (r) {
                    if (r) {
                        $scope.moreSubReply(r.id);
                        $scope.replys[r.id] = r;
                        $scope.loadUser(r.authorId);
                    }
                })
            })
        }


        $scope.moreSubReply = function (rid) {

            // init $scope.showSubReplyPositions[rid]
            if ($scope.showSubReplyPositions[rid] === undefined) {
                $scope.showSubReplyPositions[rid] = 0;
            }

            $scope.showSubReplyPositions[rid] += replySkipNum;
            if ($scope.showSubReplyPositions[rid] > $scope.subReplyIds[rid].length) {
                $scope.showSubReplyPositions[rid] = $scope.subReplyIds[rid].length;
            }

            //console.log($scope.showSubReplyPositions[rid]);

            var ids = $scope.subReplyIds[rid].slice(0, $scope.showSubReplyPositions[rid]);
            ids.forEach(function (rid) {
                DATA.reply(rid).then(function (r) {
                    if (r) {
                        $scope.replys[r.id] = r;
                        $scope.loadUser(r.authorId);
                    }
                })
            })
        }

        $scope.createReply = function () {
            clearErrorMessage();

            var parentId = $scope.parentId;

            var data = {
                body: $scope.epicEditor.content(),
                validat_num: $scope.validat_num,
                topicId: $scope.topicId,
                parentId: $scope.parentId
            }

            $http.post("/reply/create", data).success(function (rs) {

                var result = new Result();
                result.reborn(rs);
                if (result.hasError()) {
                    var errors = result.error();
                    var keys = Object.keys(errors);
                    keys.forEach(function (key) {
                        $scope[key + "Message"] = errors[key][0];
                    })
                    $rootScope.refreshNum();

                } else {
                    var reply = result.data("reply");
                    if (reply.parentId) {
                        $scope.subReplyIds[$scope.editorContainerId].push(reply.id);
                        $scope.showSubReplyPositions[$scope.editorContainerId] += 1;
                    } else {
                        $scope.replyIdsList.push(reply.id);
                        $scope.subReplyIds[reply.id] = [];
                        $scope.showReplyPosition += 1;
                    }
                    $scope.replys[reply.id] = reply;
                    $scope.loadUser(reply.authorId);
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
    .controller("userCtrl", function ($scope, $http,$upload) {

        $scope.nickEditShow = false;

        $scope.edit = function () {
            this.nickEditShow = true;
        }

        var isCustomLog_init = false;
        $scope.$watch("isCustomLogo",function(v){
            if(isCustomLog_init){
                $http.post("/user/isCustomLogo",{custom:v});
            }else{
                isCustomLog_init = true;
            }
        });

        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/user/updateLogo', //upload.php script, node.js route, or servlet url
                    // method: POST or PUT,
                    // headers: {'headerKey': 'headerValue'},
                    // withCredentials: true,
                    data: {myObj: $scope.myModelObj},
                    file: file,
                    // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                    /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                    //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                    //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
                }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);
                    });
                //.error(...)
                //.then(success, error, progress);
            }
            // $scope.upload = $upload.upload({...}) alternative way of uploading, sends the the file content directly with the same content-type of the file. Could be used to upload files to CouchDB, imgur, etc... for HTML5 FileReader browsers.
        };

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
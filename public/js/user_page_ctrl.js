app
    .controller("userCtrl", function ($modal, $rootScope, $scope, $http, $timeout, $upload, DATA, $tooltip, $sce, Result) {

        $scope.targetTag = window.location.hash;
        if ($scope.targetTag) {
            $scope.targetTag = $scope.targetTag.substr(1);
        }

        $scope.hasFollow = function () {
            var has = false;
            var follows = $rootScope.loginUser ? $rootScope.loginUser.follows || [] : [];
            for (var i = 0, len = follows.length; i < len; i++) {
                if ($scope.userId === follows[i]) {
                    has = true;
                    break;
                }
            }
            return has;
        }

        $scope.sendMessage = function () {
            var sc = $scope.$new();
            sc.userId = $scope.userId;
            $modal.open({
                scope: sc,
                templateUrl: '/template/message.html',
                controller: "messageCtrl"
            });
        }

        $scope.follow = function () {
            $http.post("/user/" + $scope.userId + "/follow");
            $rootScope.loginUser.follows.push($scope.userId);
        }

        $scope.unfollow = function () {
            $http.post("/user/" + $scope.userId + "/unfollow");
            $timeout(function () {
                for (var i = 0, len = $rootScope.loginUser.follows.length; i < len; i++) {
                    if ($scope.userId === $rootScope.loginUser.follows[i]) {
                        $rootScope.loginUser.follows.splice(i, 1);
                    }
                }
            })
        }

        var isCustomLog_init = false;
        $scope.replys = [];
        $scope.topics = [];

        $rootScope.$watch("userId", function (uid) {
            if (uid) {
                DATA.user(uid).then(function (user) {
                    $scope.user = user;
                });
            }
        })

        // update user info
        $scope.updateUser = function () {
            $http.post("/user/update", {
                des: $scope.user.des,
                address: $scope.user.address,
                sex: $scope.user.sex === "true" ? true : false
            })
        }

        $scope.$watch("user.isCustomLogo", function (v) {
            if (isCustomLog_init) {
                $http.post("/user/isCustomLogo", {custom: v});
            } else {
                isCustomLog_init = true;
            }
        }, true);

        $scope.onFileSelect = function ($files) {
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
                }).progress(function (evt) {
                        //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data, status, headers, config) {
                        // file is uploaded successfully
                        var result = new Result();
                        result.reborn(data);
                        if (result.hasError()) {
                            alert(result.error().logo);
                        } else {
                            setTimeout(function () {
                                window.location.reload()
                            }, 1000);
                        }

                    });
                //.error(...)
                //.then(success, error, progress);
            }
            // $scope.upload = $upload.upload({...}) alternative way of uploading, sends the the file content directly with the same content-type of the file. Could be used to upload files to CouchDB, imgur, etc... for HTML5 FileReader browsers.
        };

        $scope.setManager = function (uid, cid) {
            $http.post("/column/" + cid + "/setManager", {userId: uid});
            setTimeout(function () {
                window.location.reload()
            }, 1000);
        }

        $scope.selectTopicPage = function (page) {
            DATA.topicTitles($scope.userId, page).then(function (rs) {
                $scope.topicTitles = rs;
            })
        }

        $scope.selectReplyPage = function (page) {
            DATA.replysByUserId($scope.userId, page).then(function (rs) {
                $scope.replys = rs;
                for (var i = 0, len = rs.length; i < len; i++) {
                    DATA.topicById(rs[i].topicId).then(function (t) {
                        if (t) {
                            $scope.topics[t.id] = t;
                        }
                    })
                }
            });
        }

        $scope.loadTopicList = function () {
            DATA.topicCount($scope.userId).then(function (rs) {
                $scope.bigTotalItems = rs;
                $scope.bigCurrentPage = 1;
                $scope.perPage = 3;

            })
            DATA.topicTitles($scope.userId, 0).then(function (rs) {
                $scope.topicTitles = rs;
            })
        }

        $scope.loadReplyList = function () {
            DATA.replyCount($scope.userId).then(function (rs) {
                $scope.bigTotalItems2 = rs;
                $scope.bigCurrentPage2 = 1;
                $scope.perPage2 = 3;
            })
            DATA.replysByUserId($scope.userId, 0).then(function (rs) {
                $scope.replys = rs;
                for (var i = 0, len = rs.length; i < len; i++) {
                    DATA.topicById(rs[i].topicId).then(function (t) {
                        if (t) {
                            $scope.topics[t.id] = t;
                        }
                    })
                }
            })
        }

        var messagePage = 0;
        $scope.messageList = [];
        $scope.showMessageMoreButton = true;

        $scope.loadMessageList = function () {
            messagePage += 1;
            DATA.messageList(messagePage).then(function (rs) {
                if (rs.length <= $scope.messageList.length) {
                    $scope.showMessageMoreButton = false;
                } else {
                    $scope.messageList = rs;
                }
            })
        }

        var infoPage = 0;
        $scope.infoList = [];
        $scope.showInfoMoreButton = true;

        $scope.loadInfoList = function () {
            infoPage += 1;
            DATA.infoList(infoPage).then(function (rs) {
                if (rs.length <= $scope.infoList.length) {
                    $scope.showInfoMoreButton = false;
                } else {
                    $scope.infoList = rs;
                }
            })
        }

        $scope.sce = function (htmltxt) {
            return $sce.trustAsHtml(htmltxt);
        }

        $scope.$watch("userId", function (v) {

            DATA.user($scope.userId).then(function (user) {
                $scope.user = user;
                for (var i = 0, len = user.follows.length; i < len; i++) {
                    DATA.user(user.follows[i]);
                }
                for (var i = 0, len = user.watchers.length; i < len; i++) {
                    DATA.user(user.watchers[i]);
                }
            })

        })


    })

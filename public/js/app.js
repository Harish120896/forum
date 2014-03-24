var app = angular.module('jseraApp', ['ui.bootstrap', 'angularFileUpload'])

    .config([
        '$httpProvider',
        '$locationProvider',
        function ($httpProvider, $locationProvider) {
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $locationProvider.html5Mode(true);
        }
    ])

    .filter('markdown', function ($sce) {
        return function (value) {
            var html = marked(value || '');
            return $sce.trustAsHtml(html);
        };
    })

    .filter('time', function($filter){

        return function(time){

            var date = new Date();
            date.setTime(time);
            var now = new Date();

            if(date.getFullYear() !== now.getFullYear()){
                return $filter('date')(date,"yyyy");
            }

            if(date.getMonth() !== now.getMonth() || date.getDate() !== now.getDate()){
                return $filter('date')(date,"MM/dd");
            }

            return $filter('date')(date,"H:m");

        }
    })

    .run(function ($rootScope, $http) {
        $rootScope.users = {}
        $rootScope.refreshNum = function () {
            this.time = Date.now();
        }
        $rootScope.refreshNum();
        $rootScope.checkLogined = function () {
            var self = this;
            $http.post("/user/logined").success(function (data) {
                if (data.email) {
                    self.user = data;
                    self.loginUser = data;
                    $rootScope.users[data.id] = data;
                    self.logined = true;
                }
            })
        }
        $rootScope.hash = window.location.hash;
        $rootScope.checkLogined();
    })

    .factory('$position', ['$document', '$window', function ($document, $window) {

        function getStyle(el, cssprop) {
            if (el.currentStyle) { //IE
                return el.currentStyle[cssprop];
            } else if ($window.getComputedStyle) {
                return $window.getComputedStyle(el)[cssprop];
            }
            // finally try and get inline style
            return el.style[cssprop];
        }

        /**
         * Checks if a given element is statically positioned
         * @param element - raw DOM element
         */
        function isStaticPositioned(element) {
            return (getStyle(element, 'position') || 'static' ) === 'static';
        }

        /**
         * returns the closest, non-statically positioned parentOffset of a given element
         * @param element
         */
        var parentOffsetEl = function (element) {
            var docDomEl = $document[0];
            var offsetParent = element.offsetParent || docDomEl;
            while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || docDomEl;
        };

        return {
            /**
             * Provides read-only equivalent of jQuery's position function:
             * http://api.jquery.com/position/
             */
            position: function (element) {
                var elBCR = this.offset(element);
                var offsetParentBCR = { top: 0, left: 0 };
                var offsetParentEl = parentOffsetEl(element[0]);
                if (offsetParentEl != $document[0]) {
                    offsetParentBCR = this.offset(angular.element(offsetParentEl));
                    offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
                    offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
                }

                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop('offsetWidth'),
                    height: boundingClientRect.height || element.prop('offsetHeight'),
                    top: elBCR.top - offsetParentBCR.top,
                    left: elBCR.left - offsetParentBCR.left
                };
            },

            /**
             * Provides read-only equivalent of jQuery's offset function:
             * http://api.jquery.com/offset/
             */
            offset: function (element) {
                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop('offsetWidth'),
                    height: boundingClientRect.height || element.prop('offsetHeight'),
                    top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                    left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
                };
            },

            /**
             * Provides coordinates for the targetEl in relation to hostEl
             */
            positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

                var positionStrParts = positionStr.split('-');
                var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

                var hostElPos,
                    targetElWidth,
                    targetElHeight,
                    targetElPos;

                hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

                targetElWidth = targetEl.prop('offsetWidth');
                targetElHeight = targetEl.prop('offsetHeight');

                var shiftWidth = {
                    center: function () {
                        return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
                    },
                    left: function () {
                        return hostElPos.left;
                    },
                    right: function () {
                        return hostElPos.left + hostElPos.width;
                    }
                };

                var shiftHeight = {
                    center: function () {
                        return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
                    },
                    top: function () {
                        return hostElPos.top;
                    },
                    bottom: function () {
                        return hostElPos.top + hostElPos.height;
                    }
                };

                switch (pos0) {
                    case 'right':
                        targetElPos = {
                            top: shiftHeight[pos1](),
                            left: shiftWidth[pos0]()
                        };
                        break;
                    case 'left':
                        targetElPos = {
                            top: shiftHeight[pos1](),
                            left: hostElPos.left - targetElWidth
                        };
                        break;
                    case 'bottom':
                        targetElPos = {
                            top: shiftHeight[pos0](),
                            left: shiftWidth[pos1]()
                        };
                        break;
                    default:
                        targetElPos = {
                            top: hostElPos.top - targetElHeight,
                            left: shiftWidth[pos1]()
                        };
                        break;
                }

                return targetElPos;
            }
        };
    }])
    .directive("editor", function ($sce) {
        return {
            scope: {
                content: "=",
                height: "@"
            },
            templateUrl: "/template/editor.html",
            link: function (scope, elem, attrs) {
                scope.editing = true;
                scope.top = function () {
                    elem[0].scrollIntoView(false);
                }
            }
        }
    })
    .directive("usercode", function ($http, $compile, $timeout, $modal, $position, $rootScope, $timeout) {

        return {
            scope: {
                "userId": "@"
            },
            link: function (scope, elem, attrs) {
                $http.get("/template/usercode.html").then(function (rs) {
                    scope.users = $rootScope.users;
                    scope.logined = false;
                    scope.loginUser = {};
                    $rootScope.$watch("user", function (user) {
                        if (user) {
                            scope.loginUser = user;
                        }
                    });

                    $rootScope.$watch("logined", function (logined) {
                        if (logined) {
                            scope.logined = logined;
                        }
                    });

                    scope.hasFollow = function () {
                        var has = false;
                        var follows = scope.loginUser.follows || [];
                        for (var i = 0, len = follows.length; i < len; i++) {
                            if (scope.userId === follows[i]) {
                                has = true;
                                break;
                            }
                        }
                        return has;
                    }

                    scope.$watch("userId", function (v) {
                        if(v){
                            var code = $compile(angular.element(rs.data))(scope);
                            var closefn;
                            angular.element(document.body).append(code);

                            elem.bind("mouseenter", function (event) {
                                var toid;
                                toid = setTimeout(function () {
                                    scope.showcode = false;
                                    scope.$apply();
                                }, 1000);
                                code.bind("mouseenter", function (event) {
                                    clearTimeout(toid);
                                    code.bind("mouseleave", function () {
                                        scope.showcode = false;
                                        scope.$apply();
                                    })
                                });
                                scope.showcode = true;
                                scope.$apply();
                                var pos = $position.offset(elem);
                                code.css("left", pos.left + "px").css("top", pos.top + 17 + "px");
                                scope.sendMessage = function () {
                                    $modal.open({
                                        scope: scope,
                                        templateUrl: '/template/message.html',
                                        controller: "messageCtrl"
                                    });
                                }
                                scope.follow = function () {
                                    $http.post("/user/" + v + "/follow");
                                    scope.loginUser.follows.push(scope.userId);
                                }
                                scope.unfollow = function () {
                                    this.showcode = false;
                                    $http.post("/user/" + v + "/unfollow");
                                    $timeout(function () {
                                        for (var i = 0, len = scope.loginUser.follows.length; i < len; i++) {
                                            if (scope.userId === scope.loginUser.follows[i]) {
                                                scope.loginUser.follows.splice(i, 1);
                                            }
                                        }
                                    })
                                }
                            })

                        }


                    })

                });
            }
        }
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
                window.location.href = "/";
            })
        }
    })

    .controller("loginCtrl", function ($scope, $modalInstance, $http, $rootScope, shareCode) {

        $scope.data = {}

        var handle = shareCode.getResultHandle($scope, $modalInstance);

        $modalInstance.opened.then(function () {
            $scope.tabindex = "1";
        })

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }

        $scope.login = function () {
            $http.post("/user/login", $scope.data).success(handle);
        }

    })

    .controller("regCtrl", function ($scope, $modalInstance, $http, $rootScope, shareCode) {

        $scope.data = {}
        var handle = shareCode.getResultHandle($scope, $modalInstance);

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
                        $rootScope.tipone = true;
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
    .factory("DATA", function ($http, $q, $rootScope) {

        var replys = {}, users = $rootScope.users;
        var infoList = [], messageList = [];

        return {
            user: function (uid) {

                var deferred = $q.defer();
                if (uid) {
                    if (users[uid]) {
                        deferred.resolve(users[uid]);
                    } else {
                        $http.get("/user/" + uid + "/get").success(function (data) {
                            if (data) {
                                users[uid] = data;
                                deferred.resolve(users[uid]);
                            } else {
                                deferred.resolve(null);
                            }
                        });
                    }
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
            },
            topicTitles: function (uid, page) {
                var deferred = $q.defer();
                $http.get("/topicTitleListByUserId/" + uid + "/" + page).success(function (rs) {
                    deferred.resolve(rs);
                });
                return deferred.promise;
            },
            topicCount: function (uid) {
                var deferred = $q.defer();
                $http.get("/topicCountByUserId/" + uid).success(function (rs) {
                    rs = rs.topicCount || 0;
                    deferred.resolve(rs);
                });
                return deferred.promise;
            },
            topicCountByColumnId:function(cid){

                var deferred = $q.defer();
                $http.get("/topicCountByColumnId/" + cid).success(function (rs) {
                    rs = rs.topicCount || 0;
                    deferred.resolve(rs);
                });
                return deferred.promise;
            },
            replysByUserId: function (uid, page) {
                var deferred = $q.defer();
                $http.get("/replyIdsByUserId/" + uid + "/" + page).success(function (rs) {
                    deferred.resolve(rs);
                });
                return deferred.promise;
            },
            topicById: function (tid) {
                var deferred = $q.defer();
                $http.get("/topicById/" + tid).success(function (rs) {
                    deferred.resolve(rs);
                });
                return deferred.promise;
            },
            replyCount: function (uid) {
                var deferred = $q.defer();
                $http.get("/replyCountByUserId/" + uid).success(function (rs) {
                    rs = rs.topicCount || 0;
                    deferred.resolve(rs);
                });
                return deferred.promise;
            },
            messageList: function (page) {
                var deferred = $q.defer();
                $http.get("/messageList/" + page).success(function (rs) {
                    messageList = messageList.concat(rs);
                    deferred.resolve(messageList);
                });
                return deferred.promise;
            },
            infoList: function (page) {
                var deferred = $q.defer();
                $http.get("/infoList/" + page).success(function (rs) {
                    infoList = infoList.concat(rs);
                    deferred.resolve(infoList);
                });
                return deferred.promise;
            }
        }

    })

    .controller("replyCtrl", function ($scope, $http, $rootScope, DATA, Result, ability) {

        // skip reply num
        var replySkipNum = 2;
        $scope.showReplyPosition = 0;
        $scope.showSubReplyPositions = {};
        $scope.ability = ability;

        $scope.loadUser = function (uid) {
            DATA.user(uid).then(function (u) {
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
                // show reply by location.hash
                if ($rootScope.hash) {

                    var replyId = $rootScope.hash.substr(1), parent, sub;

                    // find parent reply
                    for (var i = 0, len = $scope.replyIdsList.length; i < len; i++) {
                        var pid = $scope.replyIdsList[i];
                        if (pid === replyId) {
                            parent = pid;
                            break;
                        }
                        var sids = $scope.subReplyIds[pid];

                        for (var k = 0, len = sids.length; k < len; k++) {
                            var sid = sids[k];
                            if (sid === replyId) {
                                parent = pid;
                                sub = sid;
                                break;
                            }
                        }
                    }

                    if (parent) {
                        DATA.reply(parent).then(function (r) {
                            if (r) {
                                $scope.moreSubReply(r.id);
                                $scope.replys[r.id] = r;
                                $scope.loadUser(r.authorId);
                            }
                        })
                    }
                    if (sub) {
                        DATA.reply(sub).then(function (r) {
                            if (r) {
                                $scope.replys[r.id] = r;
                                $scope.loadUser(r.authorId);
                            }
                        })
                    }

                }
            })
        })

        $scope.moveEditor = function (cid, parentId) {
            $scope.validat_numMessage = null;
            $scope.body = "";
            if (cid === "createReply") {
                $scope.editorContainerId = cid;
                $scope.parentId = null;
            } else {
                $scope.editorContainerId = cid;
                $scope.parentId = parentId || cid;
            }
        }

        $scope.removeReply = function (rid) {
            var bool = window.confirm("确定删除这条回复吗？");
            if (bool) {
                delete $scope.replys[rid];
                DATA.removeReply(rid);
            }

        }

        $scope.top = function (rid) {
            $http.post("/topic/" + $scope.topicId + "/top").success(function (data) {
                window.location.href = "/column/" + $scope.columnId;
            })
        }

        $scope.removeTopic = function () {
            var bool = window.confirm("确定删除主题帖吗？");
            if (bool) {
                $http.post("/topic/" + $scope.topicId + "/remove").success(function (data) {
                    window.location.href = "/column/" + $scope.columnId;
                })
            }
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
                body: $scope.body,
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

                } else {
                    var reply = result.data("reply");
                    if (reply.parentId) {
                        $scope.subReplyIds[$scope.editorContainerId].push(reply.id);
                        $scope.showSubReplyPositions[$scope.editorContainerId] += 1;
                    } else {
                        $scope.replyIdsList.push(reply.id);
                        $scope.subReplyIds[reply.id] = [];
                        $scope.showReplyPosition += 1;
                        $scope.showSubReplyPositions[reply.id] = 0;
                    }
                    $scope.replys[reply.id] = reply;
                    $scope.loadUser(reply.authorId);
                }
                $scope.validat_num = "";
                $scope.body = "";
                $rootScope.refreshNum();

            })
        }

    })
    .controller("columnCtrl",function ($scope, $modal, DATA) {

        $scope.openCreateDialog = function () {
            $modal.open({
                templateUrl: 'template/createColumn.html',
                controller: "createColumnCtrl"
            });
        }

        $scope.DATA = DATA;

        $scope.topicCountByColumnId = function(cid){
            DATA.topicCountByColumnId(cid).then(function(count){
                $scope.topicCounts[cid] = count;
            })
        }

        $scope.topicCounts = {};
        $scope.openUpdateDialog = function (id) {

            var dialog = $modal.open({
                templateUrl: 'template/updateColumn.html',
                controller: "updateColumnCtrl"
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

        $http.post("/column/" + $modalInstance.id + "/get")
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
    .controller("userCtrl", function ($modal,$rootScope, $scope, $http, $timeout, $upload, DATA, $tooltip, $sce, Result) {

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
                DATA.user(uid).then(function(user){
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
        },true);

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
    .controller("topicCtrl", function ($scope, $http, $rootScope, Result) {
        $scope.createTopic = function () {
            $http.post("/topic/create", {
                title: $scope.title,
                body: $scope.body,
                validat_num: $scope.validat_num,
                columnId: $scope.columnId
            }).success(function (data) {
                    var result = new Result();
                    result.reborn(data);
                    if (!result.hasError()) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000)
                    } else {
                        var errors = result.error();
                        var keys = Object.keys(errors);
                        keys.forEach(function (key) {
                            $scope[key + "Message"] = errors[key][0];
                        })
                        $rootScope.refreshNum();
                    }
                })
        }
    })
    .controller("messageCtrl", function ($scope, $http, $modalInstance, Result, $rootScope) {
        $scope.data = {};
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        }
        $scope.send = function () {

            $scope.data.body += " @" + $rootScope.users[$scope.userId].nickname;
            $http.post("/message/send", $scope.data).success(function (rs) {
                $scope.close();
                setTimeout(function(){
                    alert("私信发送成功！")
                })
            })
        }
    })

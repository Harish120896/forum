module.exports = wrap;

var validator = require("validator");

function wrap(my, domains) {


    /**
     * 是根据 identity 的 user domain 的User.*.create 事件调用的
     * @param id
     * @param email
     * @param username
     * @constructor
     */
    function User(id, email, username, createTime) {

        this._id = id;
        this._username = username;
        this._email = email;
        this._createTime = createTime;

        this._activation = true;

        this._follows = [];
        this._watchers = [];

        this._fraction = 0;
        this._isCustomLogo = true;
        this._des = "";
        this._sex = true;
        this._address = "";

    }

    User.mix = function (obj) {
        Object.defineProperties(obj, {
            id: {
                get: function () {
                    return this._id;
                }
            },

            fraction: {
                get: function () {
                    return this._fraction;
                }
            },

            createTime: {
                get: function () {
                    return this._createTime;
                }
            },

            email: {
                get: function () {
                    return this._email;
                }
            },
            username: {
                get: function () {
                    return this._username;
                }
            },
            activation: {
                get: function () {
                    return this._activation;
                }
            },
            address: {
                get: function () {
                    return this._address;
                }
            },
            sex: {
                get: function () {
                    return this._sex;
                }
            },
            des: {
                get: function () {
                    return this._des;
                }
            },
            watchers: {
                get: function () {
                    return this._watchers;
                }
            },
            follows: {
                get: function () {
                    return this._follows;
                }
            },
            isCustomLogo: {
                get: function () {
                    return this._isCustomLogo;
                }
            },
            follow: {
                value: function (uid) {
                    var self = this;
                    if (uid === this.id) return;
                    my.repos.User.get(uid, function (err, user) {
                        if (user) {

                            var follows = self.follows;

                            if (follows.indexOf(uid) === -1) {
                                follows.push(uid);
                                self._follows = follows;
                            }

                            user.addWatcher(self.id);

                            my.publish("*.*.update", "User" ,self._id ,{ follows: self.follows, watchers: self.watchers})

                        }
                    })
                }
            },
            unfollow: {
                value: function (uid) {
                    var self = this;
                    if (uid === this.id) return;
                    my.repos.User.get(uid, function (err, user) {

                        var follows = self.follows;

                        var findex = follows.indexOf(uid);
                        if (findex !== -1) {
                            follows.splice(findex, 1);
                            self._follows = follows;
                        }

                        if (user) {
                            user.removeWatcher(self.id);
                        }

                        my.publish("*.*.update","User",self._id, { follows: self.follows})
                    })
                }
            },
            addWatcher:{value:function(uid){
                if (this._watchers.indexOf(uid) === -1) {
                    this._watchers.push(uid);
                    my.publish("*.*.update","User",this._id, { watchers: this._watchers})
                }
            }},
            removeWatcher:{value:function(uid){
                var windex = this._watchers.indexOf(uid);
                if (windex !== -1) {
                    this._watchers.splice(windex, 1);
                    my.publish("*.*.update","User",this._id, { watchers: this._watchers})
                }
            }},
            plus: {
                value: function (num) {
                    num = parseInt(num);
                    if (num) {
                        this._fraction += num;
                        my.publish("*.*.update","User",this._id,{ fraction: this.fraction})
                    }
                }
            },

            /**
             * 由userDomain的 User.*.update 事件监听器调用，同步userDomain的数据。
             */
            updateInfoPrivate: {
                value: function (data) {
                    if (data.hasOwnProperty("username")) {
                        this._username = data.username;
                    }
                    if (data.hasOwnProperty("activation")) {
                        this._activation = data.activation;
                    }
                    my.publish("*.*.update", "User" , this._id, {activation: this.activation, username: this.username});
                }
            },

            updateInfo: {

                value: function (data) {

                    data = data || {}

                    if (data.hasOwnProperty("address") && !validator.isLength(data.address, 0, 50)){
                            throw {error: {address: "地址字符长度 0~50"}};
                    }

                    if (data.hasOwnProperty("des") && !validator.isLength(data.des, 0, 200)){
                            throw {error: {des: "描述字符长度 0~200"}};
                    }

                    if (data.hasOwnProperty("address")) {
                            this._address = data.address;
                    }

                    if (data.hasOwnProperty("des")) {
                            this._des = data.des;
                    }

                    if (data.hasOwnProperty("sex")) {
                        this._sex = validator.toBoolean(data.sex);
                    }

                    if (data.hasOwnProperty("isCustomLogo")) {
                        this._isCustomLogo = validator.toBoolean(data.isCustomLogo);
                    }

                    my.publish("*.*.update", "User", this._id ,{
                        des: this.des,
                        isCustomLogo: this.isCustomLogo,
                        sex: this.sex,
                        address: this.address
                    })

                }
            }

        })
    }

    User.mix(User.prototype);

    User.className = "User";

    return User;

}

module.exports = wrap;


var crypto = require("crypto"),
    createModel = require("model-brighthas"),
    is = require("istype"),
    q = require("q"),
    _ = require("underscore");

function wrap(my) {


    var User = createModel("User");

    User.roles = {
        USER: 0,
        ADMIN: 1,
        MODERATOR: 2,
        SEAL: 3
    };

    User
        .attr("id", {
            readonly: true
        })
        .attr("follows", {
            type: "array",
            default: []
        })
        .attr("watchers", {
            type: "array",
            default: []
        })
        .attr("nickname", {
            min: 2,
            max: 15,
            required: true,
            readonly: true,
            validator: /^[a-zA-Z0-9]*$/,
            message: "昵称长度 2～15 字符，a~z A~Z 0-9"
        })
        .attr("sex", {
            type: "boolean",
            default: true
        })
        .attr("address", {
            max: 35,
            default: "",
            message: "长度小于35个字符"

        })
        .attr("des", {
            max: 200,
            default: "",
            message: "长度小于200个字符"
        })
        .attr("role", {
            required: true,
            type: "number",
            default: User.roles.USER
        })
        .attr("password", {
            min: 6,
            max: 14,
            validator: /^[a-z0-9]*$/,
            message: "密码长度 6~14，支持a-z 0-9字符",
            required: true
        })
        .attr("email", {
            min: 3,
            max: 30,
            message: "email格式错误！",
            type: "email",
            required: true,
            readonly: true
        })
        .attr("logo")
        .attr("fraction", {
            default: 0,
            type: "number"
        })
        .attr("createTime", {
            type: "date"
        })
        .attr("reportTime", {
            type: "date"
        })

    .method("updateInfo", function(data) {

        data = data || {}

        this.begin();

        if (data.hasOwnProperty("address")) {
            this.address = data.address;
        }

        if (data.hasOwnProperty("des")) {
            this.des = data.des;
        }

        if (data.hasOwnProperty("sex")) {
            this.sex = data.sex;
        }

        this.end();
        return this.result;

    })
        .method("updatePassword", function(npass) {
            this.password = npass;
            return this.result;
        })
        .method("plus", function(num) {
            this.fraction = this.fraction + num;
            return this.result;
        })
        .method("report", function() {
            var reportTime = this.reportTime;
            var nowTime = new Date();
            if ("" + reportTime.getFullYear() + reportTime.getMonth() + reportTime.getDate() !== "" + nowTime.getFullYear() + nowTime.getMonth() + nowTime.getDate()) {
                this.plus(2);
                this.reportTime = new Date();
            }
        })
        .method("follow", function(uid) {
            var self = this;

            my.repos.User.get(uid, function(err, user) {
                if (user) {

                    var follows = self.follows;

                    if (follows.indexOf(uid) === -1) {
                        follows.push(uid);
                        self.follows = follows;
                    }

                    var watchers = user.watchers;
                    if (watchers.indexOf(self.id) === -1) {
                        watchers.push(self.id);
                        user.watchers = watchers;
                    }

                }
            })
        })
        .method("unfollow", function(uid) {
            var self = this;
            my.repos.User.get(uid, function(err, user) {

                var follows = self.follows;

                var findex = follows.indexOf(uid);
                if (findex !== -1) {
                    follows.splice(findex, 1);
                    self.follows = follows;
                }

                if (user) {
                    var watchers = user.watchers;
                    var windex = watchers.indexOf(self.id);
                    if (windex !== -1) {
                        watchers.splice(windex, 1);
                        user.watchers = watchers;
                    }
                }
            })
        })
        .method("becomeModerator", function() {
            this.role = User.roles.MODERATOR;
        })
        .method("becomeAdmin", function() {

            this.role = User.roles.ADMIN;
        })
        .method("becomeUser", function() {
            this.role = User.roles.USER;
        })
        .method("sealUser", function() {
            this.role = User.roles.SEAL;
        })
        .on("changed", function(u, attrs) {
            passTransform(u);
            my.publish("*.*.update", "User", u.id, this.toJSON(u, Object.keys(attrs)));
        })
        .validate(function(user, keys) {
            if (keys.indexOf("role") !== -1) {
                var role = user.attrs["role"];
                if ([0, 1, 2, 3].indexOf(role) === -1) {
                    user.result.error("role", "没有这个角色");
                }
            }
        })
    // logo validat
    //  image base64 must cut base64 type head
    .validate(function(user, keys) {

        var keys = []

        if (keys.indexOf("logo") !== -1) {

            var logo = user.attrs["logo"];
            if (is.string(logo) && logo.length > 0) {
                var buf = new Buffer(logo, "base64")
                if (buf.length > 1024 * 150) {
                    user.error("logo", "error");
                }
            } else {
                user.error("logo", "error");
            }

        }

    })

    User.on("created", function(user) {
        passTransform(user);
    })

    User.on("creating", function(user) {
        user.attrs.createTime = new Date();
        user.attrs.reportTime = new Date(0);
    })


    function passTransform(u) {
        // password transform
        if (u.attrs.password) {
            var md5 = crypto.createHash('md5');
            u.oattrs.password = md5.update(u.oattrs.password).digest("hex");
        }
    }

    User.className = "User";

    return User;

}

module.exports = wrap;


var crypto = require("crypto"),
	createModel = require("model-brighthas"),
	attr = require("./plugin/attr");

function wrap(my) {


	var User = createModel("User");

	User.roles = {
		USER: 0,
		ADMIN: 1,
		MODERATOR: 2
	};

	User
		.attr("id")
		.attr("nickname", {
			required: true
		})
		.attr("loginname", {
			required: true
		})
		.attr("role", {
			required: true,
			type: "number",
			default: User.roles.USER
		})
		.attr("password", {
			required: true
		})
		.attr("email", {
			required: true
		})
		.attr("fraction", {
			default: 0,
			type: "number"
		})
		.attr("createTime", {
			type: "date"
		})
		.method("updatePassword", function(old,npass) {

			var md5 = crypto.createHash('md5');
			old = md5.update(old).digest("hex");

			if (this.password === old) {
				md5 = crypto.createHash('md5');
				this.password = md5.update(npass).digest("hex");
			}
			return this.errors;

		})
		.method("plus", function(num) {
			this.fraction = this.fraction + num;
			return this.errors;
		})
		.use(attr)
		.on("creating",function(u){
			// password transform
			if(u.attrs.password){
				var md5 = crypto.createHash('md5');
				u.attrs.password = md5.update(u.attrs.password).digest("hex");
			}
		})
		.on("changed",function(u,attrs){
			my.publish("*.*.update","User",u.id,this.toJSON(u,Object.keys(attrs)));
		})
		.validate(function(user, keys) {
			if (keys.indexOf("role") !== -1) {
				var role = user.attrs["role"];
				if ([0, 1, 2].indexOf(role) === -1) {
					user.error("role", "no the role");
				}
			}
		})

	User.on("creating", function(user) {
		user.attrs.createTime = new Date();
	})

	User.className = "User";

	return User;

}

module.exports = wrap;

var crypto = require("crypto"),
    md5 = crypto.createHash('md5');

function wrap(my){

    var emitUpdate = require("./emitUpdate")("User", my);

    User.roles = {
        DEFAULT:0,
        ADMIN:1
    };

    Object.freeze(User.roles);

    function User(nickname,loginname,password,email){
        this._role = User.roles.DEFAULT;
        this._nickname = nickname;
        this._loginname = loginname;
        this._fraction = 0;
        this._password = md5.update(password).digest("hex");
        this._email = email;
        this._createTime = Date.now();
    }

    var proto = User.prototype;

    proto.updatePassword = function(old,npass){
        my.services.updatePasswordValidator(npass);

        old = md5.update(old).digest("hex");

        if(this._password === old){
            this._password = md5.update(npass).digest("hex");
            emitUpdate(this,["password"]);
        }else{
            throw new Error();
        }
    }

    proto._authorize = function(role){
        this._role = role;
        emitUpdate(this,["role"]);
        my.publish("authorize",this);
    }

    proto.authorizeAdmin = function(){
        this._authorize(User.roles.ADMIN);
    }

    proto.plus = function(num){
        this._fraction += num;
        emitUpdate(this,["fraction"]);
    }

    User.className = "User";

    return User;

}
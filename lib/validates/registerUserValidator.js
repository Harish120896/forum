const validator = require("validator");
const nameValidator = require("./loginNickNameValidator");
const loginnameExist = require("./loginnameExist");
const nicknameExist = require("./nicknameExist");
const emailExist = require("./emailExist");

module.exports = async function registerUserValidator(data = {}) {

    const { loginname, nickname, password, email } = data;
    const errors = {};

    if (!nameValidator(loginname)) {
        errors.loginname = "loginame char size must >= 2 and <= 15";
    }

    if (nickname && !!nameValidator(nickname)) {
        errors.nickname = "nickname char size must >= 2 and <= 15";
    }

    if (!validator.isLength(password || "", { min: 6 })) {
        errors.password = " password char size must >= 6";
    }

    if (email && !validator.isEmail(email)) {
        errors.email = "Please enter the correct email ";
    }

    if (!errors.loginname && await loginnameExist(loginname)) {
        errors.loginname = "loginname is exist";
    }

    if (!errors.nickname && await nicknameExist(nickname)) {
        errors.nickname = "nickname is exist";
    }

    if (await emailExist(email)) {
        errors.email = "email is exist";
    }

    return errors;
}
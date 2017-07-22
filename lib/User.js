const { Actor } = require("cqrs");
const registerUserValidator = require("./validates/registerUserValidator");
const nicknameValidator = require("./validates/loginNicknameValidator");
const nicknameExist = require("./validates/nicknameExist");
const validator = require("validator");
const passwordHash = require("./utils/passwordHash");

module.exports = class User extends Actor {

    static async createBefor(data) {
        const errors = await registerUserValidator(data);
        if (Object.keys(errors).length) {
            throw errors;
        }
    }

    constructor(data) {
        super(Object.assign({}, data, {
            isFreeze: false,
            integral: 0,
            money: 0
        }));

    }

    freeze() {
        this.$();
    }

    unFreeze() {
        this.$();
    }

    plusIntegral(integral) {
        if (integral = integral | 0)
            this.$(integral);
    }

    plusMoney(money) {
        if (money = money | 0)
            this.$(money);
    }

    async changeNickname(name) {
        if (nicknameValidator(name)) {
            if (await nicknameExist(name)) {
                throw { nickname: "nickname is exist!" }
            }
            this.$(name);
        } else
            throw { nickname: " nickname char size must >= 2 and <= 15 " }
    }

    changePassword(password) {
        if (password && passworld.length > 6) {
            this.$(password);
        } else {
            throw { password: "password char size must >6" }
        }
    }

    when(event) {
        switch (event.type) {
            case "changeNickname":
                return { nickname: event.data }
            case "changePassword":
                return { password: passwordHash(event.data) }
            case "freeze":
                return { isFreeze: true }
            case "unFreeze":
                return { isFreeze: false }
            case "plusIntegral":
                const oldIntegral = this.json.integral;
                return {
                    integral: oldIntegral + event.data
                }
            case "plusMoney":
                const oldMoney = this.json.money;
                return {
                    money: oldMoney + event.data
                }

        }
    }
}
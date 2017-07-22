const should = require('should');
const { Domain } = require("cqrs");
const User = require("../lib/User");
const { users } = require("../lib/utils/db");

describe("User", function () {

    const domain = new Domain();
    domain.register(User);

    it("clear", async function () {
        await users.remove();
    });

    it("#create", async function () {
        let errors;
        try {
            let user = await domain.create("User", { loginname: "i", password: "12fdsfsd32" });
        } catch (err) {
            errors = err;
        }
        should.exist(errors.loginname);
    });

}); 
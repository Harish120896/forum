const { users } = require("../utils/db");

module.exports = async function (email) {
    return (await users.find({ email })).length;
}
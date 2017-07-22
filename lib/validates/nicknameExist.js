const { users } = require("../utils/db");

module.exports = async function (nickname) {
    return (await users.find({ nickname })).length;
}
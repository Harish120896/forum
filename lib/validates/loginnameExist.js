const { users } = require("../utils/db");

module.exports = async function (loginname) {
    return (await users.find({ loginname })).length;
}
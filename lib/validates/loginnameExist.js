const { users } = mongo("localhost/test", ["users"]);

moduel.exports = async function (loginname) {
    return (await users.find({ loginname })).length;
}
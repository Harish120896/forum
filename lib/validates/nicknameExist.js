const { users } = mongo("localhost/test", ["users"]);

moduel.exports = async function (nickname) {
    return (await users.find({ nickname })).length;
}
const { users } = mongo("localhost/test", ["users"]);

moduel.exports = async function (email) {
    return (await users.find({ email })).length;
}
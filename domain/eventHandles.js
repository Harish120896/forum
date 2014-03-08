module.exports = wrap;

function wrap(my) {

    handle1.eventName = "Topic.*.create";

    function handle1(topic) {
        my.repos.User.get(topic.authorId, function (err, user) {
            if (user) {
                user.plus(5);
            }
        })
    }

    handle2.eventName = "Reply.*.create";

    function handle2(reply) {
        my.repos.User.get(reply.authorId, function (err, user) {
            if (user) {
                user.plus(1);
            }
        })
    }

    return [handle1, handle2];
}

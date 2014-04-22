module.exports = wrap;

function wrap(my) {

    handle1.eventName = "Topic.*.create";

    function handle1(topic) {
        var infoRepo = my.repos.Info;
        my.repos.User.get(topic.authorId, function (err, user) {
            if (user) {
                user.plus(5);
                user.watchers.forEach(function (wid) {

                    infoRepo.create({targetId: wid, body: "<a href='/topic/" + topic.id + "'>" + user.nickname + " 发布主题 ：" + topic.title + "</a>"
                    })
                });
            }
        })

    }

    handle2.eventName = "Reply.*.create";

    function handle2(reply) {

        my.repos.Topic.get(reply.topicId, function (err, topic) {
            if (topic) {
                var infoRepo = my.repos.Info;
                infoRepo.create({
                    targetId: topic.authorId,
                    body: "<a href='/topic?id=" + topic.id + "#" + reply.id + "'> 您的帖子有人回复 ：" + topic.title + "</a>"
                })
            }
        })

        my.repos.User.get(reply.authorId, function (err, user) {
            if (user) {
                user.plus(1);
            }
        })
    }


    createUser.eventName = "userDomain User.*.create";
    function createUser(data) {
        my.repos.User.create(data);
    }

    updateUser.eventName = "userDomain User.*.update";
    function updateUser(data) {
        my.repos.User.get(data.id).then(function (user) {
            if (user) {
                    user.updateInfoPrivate(data);
            }
        });
    }

    return [handle1, handle2, createUser, updateUser];
}

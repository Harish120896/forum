var Q = require("q");

module.exports = function (my) {
    return [
        function (req, res, next) {

            var methodName = req.query.methodName;
            var id = req.query.id;

            if (!(id && methodName) || !req.session.user) {
                return res.send();
            }

            // 终极管理员就直接通过
            else if (req.session.user.role === 1)
                return next();


            // 如果已登录的用户，并且方法名如下
            else if (-1 !== [
                "User.updatePassword",
                "User.follow",
                "User.unfollow",
                "User.updateInfo"
            ].indexOf(methodName)) {
                if (req.session.user.id !== id) {
                    return res.send();
                } else {
                    return next();
                }
            }

            else if ("Topic.removeReply" === methodName) {

                var replyId = req.body["0"];

                if (!replyId) {
                    return res.send();
                }

                Q.all([
                        my.query("get a topic by id", {id: id}),
                        my.query("get a reply by id", {id: replyId}),
                        my.query("get a column by topic's id", {id: id})
                    ]).spread(function (topic, reply, column) {
                        if (topic && reply && column && (column.managerId === req.session.user.id || topic.authorId === req.session.user.id || reply.author === req.session.user.id)){
                            return next();
                        } else {
                            return res.send();
                        }
                    })
            }

            else
                return res.send();

        }]
}

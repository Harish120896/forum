var escape = require("./escape");

module.exports = function wrap(domain, query) {

    return {

        create: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            req.body.authorId = req.session.user.id;
            if (req.body.body) {
                req.body.body = escape(req.body.body);
            }
            domain.exec("create a reply", req.body, function (result) {
                req.result.mix(result);
                next();
            });
        },

        remove: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            var id = req.param("id");
            var reply = req.result.data("reply");
            if (reply) {
                var topicId = reply.topicId;
                domain.call("Topic.removeReply", topicId, [id])
            }

            next();

        },

        updateInfo: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            var id = req.param("id");
            var title = req.body.title;
            if (req.body.body) {
                req.body.body = escape(req.body.body);
            }
            var body = req.body.body;
            domain.call("Reply.updateInfo", id, [title, body], function (result) {
                req.result.mix(result);
                next();
            })
        }

    }

}

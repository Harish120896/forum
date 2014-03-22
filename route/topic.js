module.exports = function wrap(app, ctrls) {

    app.post("/topic/create",
        ctrls.util.isLogin,
        ctrls.util.validat_num,
        ctrls.topic.create,
        ctrls.util.end);

    app.post("/topic/:id/update",
        ctrls.util.isLogin,
        ctrls.util.validat_num,
        ctrls.topic.update,
        ctrls.util.end);

    app.post("/topic/:id/remove",
        ctrls.util.isLogin,
        ctrls.data.topicById,
        ctrls.util.hasTopic,
        ctrls.topic.remove,
        ctrls.util.end);

    app.post("/topic/:id/seal",
        ctrls.util.isLogin,
        ctrls.data.topicById,
        ctrls.util.hasTopic,
        ctrls.util.isTopicManager,
        ctrls.topic.seal,
        ctrls.util.end);

    app.post("/topic/:id/unseal",
        ctrls.util.isLogin,
        ctrls.data.topicById,
        ctrls.util.hasTopic,
        ctrls.util.isTopicManager,
        ctrls.topic.unseal,
        ctrls.util.end);

}
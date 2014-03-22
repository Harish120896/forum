module.exports = function wrap(app,ctrls) {

    app.post("/reply/create",
        ctrls.util.isLogin,
        ctrls.util.validat_num,
        ctrls.reply.create,
        ctrls.util.end);

    app.post("/reply/:id/remove",
        ctrls.util.isLogin,
        ctrls.data.replyById,
        ctrls.util.hasReply,
        ctrls.util.isReplyManager,
        ctrls.reply.remove,
        ctrls.util.end);

}
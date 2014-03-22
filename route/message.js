module.exports = function wrap(app, ctrls) {
    app.post("/message/send",
        ctrls.util.isLogin,
        ctrls.util.validat_num,
        ctrls.message.send,
        ctrls.util.end);
}
var replyCtrl = require("../controller/reply"),
    data = require("../controller/data"),
    util = require("../controller/util");

module.exports = function wrap(app) {
// reply controller
    app.post("/reply/create",
        util.isLogin,
        util.validat_num,
        replyCtrl.create,
        util.end);

    app.post("/reply/:id/remove",
        util.isLogin,
        data.replyById,
        util.hasReply,
        util.isReplyManager,
        replyCtrl.remove,
        util.end);
}
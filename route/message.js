var messageCtrl = require("../controller/message"),
    data = require("../controller/data"),
    util = require("../controller/util");

module.exports = function wrap(app) {
    // message controller
    app.post("/message/send",
        util.isLogin,
        util.validat_num,
        messageCtrl.send,
    util.end);
}
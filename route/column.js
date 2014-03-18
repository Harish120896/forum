var util = require("../controller/util"),
    columnCtrl = require("../controller/column"),
    data = require("../controller/data");

module.exports = function wrap(app) {
    // column controller
    app.post("/column/create",
        util.isLogin,
        util.isAdmin,
        columnCtrl.create,
        util.end);

    app.post("/column/:id/update",
        util.isLogin,
        util.isAdmin,
        columnCtrl.update,
        util.end);

    app.post("/column/:id/setManager",
        util.isLogin,
        util.isAdmin,
        columnCtrl.setManager,
        util.end)
}
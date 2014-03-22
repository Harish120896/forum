module.exports = function wrap(app,ctrls) {

    app.post("/column/create",
        ctrls.util.isLogin,
        ctrls.util.isAdmin,
        ctrls.column.create,
        ctrls.util.end);

    app.post("/column/:id/update",
        ctrls.util.isLogin,
        ctrls.util.isAdmin,
        ctrls.column.update,
        ctrls.util.end);

    app.post("/column/:id/setManager",
        util.isLogin,
        util.isAdmin,
        columnCtrl.setManager,
        util.end)
}
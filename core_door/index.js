module.exports = function (my) {
    var call_filters = require("./call_filters")(my),
        exec_filters = require("./exec_filters")(my),
        query_filters = require("./query_filters")(my),
        paths = my.config.core_route_paths;

    my.app.get(paths.query, query_filters, function (req, res) {
        var qn = req.query.queryName;
        delete req.query.queryName;
        my.query(qn, req.query).then(function (rs) {
            res.send(rs || "");
        })
    })

    my.app.post(paths.exec, exec_filters, function (req, res) {
        my.core.exec(req.query.commandName, req.body, function (rs) {
            res.send(rs || "");
        })
    })

    my.app.post(paths.call, call_filters, function (req, res) {

        var args;
        try {
            args = [].slice.apply(req.body, [0]);
        } catch (e) {
            args = [];
        }

        my.core.call(req.query.methodName, req.query.id, args, function (rs) {
            res.send(rs || "");
        })
    })

}
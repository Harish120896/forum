var Result = require("result-brighthas");

module.exports = function wrap(domain, query) {

    return {

        create: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            domain.exec("create a column", req.body, function (result) {
                req.result.mix(result);
                next();
            });
        },

        update: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            var columnId = req.param("id");
            domain.call("Column.updateInfo", columnId, [req.body.name, req.body.des], function (result) {
                if (Result.isResult(result)) {
                    req.result.mix(result);
                } else {
                    req.result.error("error", result);
                }
                next();
            })
        },

        up: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            var columnId = req.param("id");
            domain.call("Column.up", columnId);
            next();
        },

        setManager: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            var columnId = req.param("id");
            var userId = req.body.userId;
            console.log(req.body, columnId);
            if (userId)
                domain.call("Column.setManager", columnId, [userId]);
            next();
        }

    }

}

var dbs = require("./db");
module.exports = function wrap(my) {

    handle1.eventName = "*.*.create";

    function handle1(className, data) {
        var db = dbs.getDB(className);
        db.insert(data, function(err, rs) {

        })
    }

    handle2.eventName = "*.*.update";

    function handle2(className, id, data) {
        var db = dbs.getDB(className);
        db.update({
            id: id
        }, {
            $set: data
        }, {}, function() {})
    }

    handle3.eventName = "*.*.remove";

    function handle3(className, id) {
        var db = dbs.getDB(className);
        db.remove({
            id: id
        }, function() {});
    }

    return [handle1, handle2, handle3];

}

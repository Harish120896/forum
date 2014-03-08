var dbs = require("./db");

module.exports = wrap;

function wrap(my) {

    handle1.eventName = "*.*.create";

    function handle1(className, data) {
        console.log(className, "---------------------");

        dbs.save(className, data, function () {
        })
    }

    handle2.eventName = "*.*.update";
    function handle2(className, id, data) {
        dbs.update(className, id, data, function () {
        })
    }

    handle3.eventName = "*.*.remove";
    function handle3(className, id) {
        dbs.remove(className, id);
    }

    return [handle1, handle2, handle3];
}

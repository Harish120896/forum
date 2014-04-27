var mongojs = require("mongojs");

var dbs = mongojs('forum', ["Column", "User", "Topic", "Reply", "Message", "Info"]);

module.exports = {
    get: function (type, id, cb) {
        dbs.collection(type).findOne({
            "id": id
        }, cb);
    },
    save: function (type, data, cb) {
        dbs.collection(type).save(data, cb);
    },
    update: function (type, id, data, cb) {
        dbs.collection(type).update({
            "id": id
        }, {
            $set: data
        }, {}, cb);
    },
    remove: function (type, id) {
        dbs.collection(type).remove({
            "id": id
        });
    },
    getDB: function (type) {
        return dbs.collection(type);
    }
}
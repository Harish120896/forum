var Datastore = require('nedb');

var dbs = {
    User: new Datastore({filename: '../data/users', autoload: true}),
    Topic: new Datastore({filename: '../data/topics', autoload: true}),
    Column: new Datastore({filename: '../data/columns', autoload: true}),
    Info: new Datastore({filename: '../data/infos', autoload: true}),
    Reply: new Datastore({filename: '../data/replies', autoload: true}),
    Message: new Datastore({filename: '../data/messages', autoload: true}),
    Photo: new Datastore({filename: '../data/photos', autoload: true})

}

module.exports = {
    get: function (type, id, cb) {
        dbs[type].findOne({
            "id": id
        }).exec(cb);
    },
    save: function (type, data, cb) {
        dbs[type].insert(data, cb);
    },
    update: function (type, id, data, cb) {
        dbs[type].update({
            "id": id
        }, {
            $set: data
        }, {}, cb);
    },
    remove: function (type, id) {
        dbs[type].remove({
            "id": id
        }, {}, function () {
        });
    },
    getDB: function (type) {
        return dbs[type];
    }
}

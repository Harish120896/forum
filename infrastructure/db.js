var Datastore = require('nedb');

var dbs = {
    User: new Datastore({filename: 'dbs/users', autoload: true}),
    Topic: new Datastore({filename: 'dbs/topics', autoload: true}),
    Column: new Datastore({filename: 'dbs/columns', autoload: true}),
	Info:new Datastore({filename: 'dbs/infos', autoload: true}),
    Reply: new Datastore({filename: 'dbs/replies', autoload: true}),
    Message: new Datastore({filename: 'dbs/messages', autoload: true})
}

module.exports = {
    get: function(type, id, cb) {
        dbs[type].findOne({
            "id": id
        }).exec(cb);
    },
    save: function(type, data, cb) {
        dbs[type].insert(data, cb);
    },
    update: function(type, id, data, cb) {
        dbs[type].update({
            "id": id
        }, {
            $set: data
        }, {}, cb);
    },
    remove: function(type, id, cb) {
        dbs[type].remove({
            "id": id
        }, {}, cb);
    },
    getDB: function(type) {
        return dbs[type];
    }
}

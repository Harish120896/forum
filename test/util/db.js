var Datastore = require('nedb');


  var dbs = {
      User:new Datastore,
      Topic:new Datastore,
      Column:new Datastore,
      Reply:new Datastore,
  	Message:new Datastore
  }

  module.exports = {
      get: function(type, id, cb) {
          dbs[type].findOne({
              "id": id
          }, cb);
      },
      save: function(type, data, cb) {
          dbs[type].insert(data, cb);
      },
      update: function(type, id, data, cb) {
          dbs[type].update({
              "id": id
          }, data,{}, cb);
      },
      remove: function(type, id, cb) {
          dbs[type].remove({
              "id": id
          }, {},cb);
      },
      getDB: function(type) {
          return dbs[type];
      }
  }
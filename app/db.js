var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// test connection
mongoose.connect("mongodb://localhost/testdb3");

var Column = mongoose.model("Column", new Schema({
    name: String,
    des: String,
    id: String,
    top: Boolean,
    accessNum: Number,
    updateTime: Number,
    createTime: Number
}));

var Reply = mongoose.model("Reply", new Schema({
    updateTimeout: Number,
    id: String,
    title: String,
    body: String,
    authorId: String,
    parentId: String,
    topicId: String,
    updateTime: Number,
    createTime: Number
}));

var Topic = mongoose.model("Topic", new Schema({
    id: String,
    title: String,
    body: String,
    authorId: String,
    replyTree: String,
    accessNum: Number,
    columnId: String,
    updateTime: Number,
    createTime: Number
}));

var User = mongoose.model("User",new Schema({
    id: String,
    role : Number,
    nickname : String,
    loginname : String,
    fraction : Number,
    password : String,
    email : String,
    createTime : Number,
	reportTime : Number
}));

var Message = mongoose.model("Message",new Schema({
	authorId:String,
    id: String,
	title:String,
	body:String,
	targetId:String,
	createTime:Number,
	havesee:Boolean
}));

var dbs = {
    User:User,
    Topic:Topic,
    Column:Column,
    Reply:Reply,
	Message:Message
}

module.exports = {
    get: function(type, id, cb) {
        dbs[type].findOne({
            "id": id
        }, cb);
    },
    save: function(type, data, cb) {
        dbs[type].create(data, cb);
    },
    update: function(type, id, data, cb) {
        dbs[type].update({
            "id": id
        }, data, cb);
    },
    remove: function(type, id, cb) {
        dbs[type].remove({
            "id": id
        }, cb);
    },
    getDB: function(type) {
        return dbs[type];
    }
}